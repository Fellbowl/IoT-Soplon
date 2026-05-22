"""
Soplón — Publisher.py
Firmware/daemon para Raspberry Pi (casco ciclista).

Sensores:
  - LM75A       → temperatura ambiente (I2C 0x48)
  - MPU-6050    → IMU: pitch + roll para postura (I2C 0x68)
  - MPS20N0040D-S / HX710B → presión dinámica frontal → velocidad de viento

LEDs GPIO:
  - LED_POSTURE  → rojo si mala postura (pitch o roll fuera de rango)
  - LED_OVERTAKE → verde si condiciones favorables para adelantar
  - LED_CROSSWIND → amarillo si hay viento cruzado estimado (lateral via roll + presión)

Payload MQTT publicado (JSON):
{
  "device_id": str,
  "timestamp": ISO8601,
  "temperature_c": float,
  "pitch_deg": float,
  "roll_deg": float,
  "wind_speed_kmh": float,
  "wind_dynamic_pa": float,
  "accel_x/y/z": float,
  "gyro_x/y/z": float,
  "posture_ok": bool,
  "posture_alert": str | null,   // "HEAD_TOO_HIGH" | "HEAD_TOO_LOW" | "LEAN_LEFT" | "LEAN_RIGHT"
  "wind_status": str,            // "CALM" | "FAVORABLE" | "HEADWIND" | "CROSSWIND_WARNING"
  "fall_detected": bool,
  "alerts": [str]                // lista de alertas activas en este ciclo
}
"""

import time
import json
import math
import logging
import os
import ssl
from collections import deque
from datetime import datetime, timezone

import paho.mqtt.client as mqtt
import smbus2
from mpu6050 import mpu6050
from dotenv import load_dotenv

try:
    import RPi.GPIO as GPIO
    GPIO_AVAILABLE = True
except ImportError:
    GPIO_AVAILABLE = False
    logging.warning("RPi.GPIO no disponible — LEDs deshabilitados (modo simulación)")

# ─────────────────────────────────────────────
# Configuración
# ─────────────────────────────────────────────
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
log = logging.getLogger("soplon")

# MQTT
BROKER       = os.getenv("MQTT_BROKER", "localhost")
PORT         = int(os.getenv("MQTT_PORT", 8883))
TOPIC        = os.getenv("MQTT_TOPIC", "soplon/readings")
MQTT_USER    = os.getenv("MQTT_USER", "")
MQTT_PASS    = os.getenv("MQTT_PASS", "")
log.info(f"MQTT_USER='{MQTT_USER}' (len={len(MQTT_USER)}), MQTT_PASS len={len(MQTT_PASS)}")
DEVICE_ID    = os.getenv("DEVICE_ID", "helmet-01")
INTERVAL_S   = float(os.getenv("PUBLISH_INTERVAL_S", 1.0))

# GPIO pines (BCM)
PIN_LED_POSTURE   = int(os.getenv("PIN_LED_POSTURE", 17))    # rojo
PIN_LED_OVERTAKE  = int(os.getenv("PIN_LED_OVERTAKE", 27))   # verde
PIN_LED_CROSSWIND = int(os.getenv("PIN_LED_CROSSWIND", 22))  # amarillo
PIN_HX710B_SCK    = int(os.getenv("PIN_HX710B_SCK", 5))
PIN_HX710B_DOUT   = int(os.getenv("PIN_HX710B_DOUT", 6))

# ── Umbrales de postura (grados) ──────────────────────────────────────────────
# Pitch positivo = cabeza arriba (mala postura aerodinámica si muy alto)
# Pitch negativo = cabeza abajo (mala postura si muy bajo — cuello forzado)
PITCH_MAX_DEG   = float(os.getenv("PITCH_MAX_DEG", 20.0))   # cabeza demasiado alta
PITCH_MIN_DEG   = float(os.getenv("PITCH_MIN_DEG", -15.0))  # cabeza demasiado baja
ROLL_MAX_DEG    = float(os.getenv("ROLL_MAX_DEG", 15.0))    # inclinación lateral máxima

# ── Umbrales de viento ────────────────────────────────────────────────────────
# Presión dinámica: q = 0.5 * rho * v^2  → v = sqrt(2q/rho)
AIR_DENSITY_KGM3      = float(os.getenv("AIR_DENSITY", 1.225))   # ~Bogotá ~1.0, ajustar
WIND_FAVORABLE_KMH    = float(os.getenv("WIND_FAVORABLE_KMH", 10.0))  # >= favorable para adelantar
WIND_CROSSWIND_KMH    = float(os.getenv("WIND_CROSSWIND_KMH", 25.0))  # >= peligroso cruzado

# ── Caídas ────────────────────────────────────────────────────────────────────
FALL_ACCEL_THRESHOLD  = float(os.getenv("FALL_ACCEL_THRESHOLD", 3.0))   # múltiplos de g
FALL_CONFIRM_CYCLES   = int(os.getenv("FALL_CONFIRM_CYCLES", 2))

# ── Calibración HX710B ────────────────────────────────────────────────────────
PRESSURE_OFFSET = int(os.getenv("PRESSURE_OFFSET", 0))
PRESSURE_SCALE  = float(os.getenv("PRESSURE_SCALE", 1.0))

# ── Filtro EMA ────────────────────────────────────────────────────────────────
EMA_ALPHA = float(os.getenv("EMA_ALPHA", 0.2))

# ─────────────────────────────────────────────
# Inicialización GPIO
# ─────────────────────────────────────────────
def setup_gpio():
    if not GPIO_AVAILABLE:
        return
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    for pin in [PIN_LED_POSTURE, PIN_LED_OVERTAKE, PIN_LED_CROSSWIND]:
        GPIO.setup(pin, GPIO.OUT)
        GPIO.output(pin, GPIO.LOW)
    GPIO.setup(PIN_HX710B_SCK, GPIO.OUT)
    GPIO.setup(PIN_HX710B_DOUT, GPIO.IN)
    log.info("GPIO inicializado")

def set_leds(posture_bad: bool, overtake_ok: bool, crosswind_warn: bool):
    if not GPIO_AVAILABLE:
        return
    GPIO.output(PIN_LED_POSTURE,   GPIO.HIGH if posture_bad    else GPIO.LOW)
    GPIO.output(PIN_LED_OVERTAKE,  GPIO.HIGH if overtake_ok    else GPIO.LOW)
    GPIO.output(PIN_LED_CROSSWIND, GPIO.HIGH if crosswind_warn else GPIO.LOW)

# ─────────────────────────────────────────────
# Lectura HX710B (presión diferencial)
# ─────────────────────────────────────────────
def hx710b_read_raw() -> int:
    """Lee 24 bits del HX710B vía bit-bang. Retorna valor con signo."""
    if not GPIO_AVAILABLE:
        return 0

    # Esperar DOUT = LOW (dato listo)
    timeout = time.time() + 1.0
    while GPIO.input(PIN_HX710B_DOUT):
        if time.time() > timeout:
            log.warning("HX710B timeout esperando dato")
            return 0
        time.sleep(0.001)

    raw = 0
    for _ in range(24):
        GPIO.output(PIN_HX710B_SCK, GPIO.HIGH)
        time.sleep(0.000001)
        raw = (raw << 1) | GPIO.input(PIN_HX710B_DOUT)
        GPIO.output(PIN_HX710B_SCK, GPIO.LOW)
        time.sleep(0.000001)

    # Pulso 25 para configurar ganancia 128 (canal A)
    GPIO.output(PIN_HX710B_SCK, GPIO.HIGH)
    time.sleep(0.000001)
    GPIO.output(PIN_HX710B_SCK, GPIO.LOW)

    # Complemento a dos (24-bit)
    if raw & 0x800000:
        raw -= 0x1000000
    return raw

def read_pressure_pa() -> float:
    """Retorna presión dinámica en Pascales (calibrada)."""
    raw = hx710b_read_raw()
    calibrated = (raw - PRESSURE_OFFSET) * PRESSURE_SCALE
    # El sensor MPS20N0040D-S tiene fondo de escala ~40 kPa en 2^24 counts
    # Conversión aproximada: 40000 Pa / 2^23 ≈ 0.00476 Pa/count
    pa = calibrated * (40000.0 / 8388608.0)
    return max(pa, 0.0)   # presión dinámica es siempre ≥ 0

def pressure_to_wind_kmh(pa: float) -> float:
    """Bernoulli inverso: v = sqrt(2 * q / rho), convertido a km/h."""
    if pa <= 0:
        return 0.0
    v_ms = math.sqrt(2.0 * pa / AIR_DENSITY_KGM3)
    return v_ms * 3.6

# ─────────────────────────────────────────────
# Lectura LM75A (temperatura)
# ─────────────────────────────────────────────
def read_lm75a_temperature(bus: smbus2.SMBus, addr: int = 0x48) -> float:
    """Lee temperatura del LM75A. Retorna °C."""
    raw = bus.read_i2c_block_data(addr, 0x00, 2)
    temp_raw = (raw[0] << 8 | raw[1]) >> 5
    if temp_raw > 1023:
        temp_raw -= 2048
    return temp_raw * 0.125

# ─────────────────────────────────────────────
# Procesamiento postura
# ─────────────────────────────────────────────
def compute_pitch_roll(accel: dict) -> tuple[float, float]:
    """
    Calcula pitch y roll en grados a partir del acelerómetro.
    Convención: el MPU-6050 está montado en el casco con X apuntando
    hacia adelante del ciclista.
      pitch > 0 → cabeza arriba
      pitch < 0 → cabeza abajo
      roll  > 0 → inclinado a la derecha
    """
    ax = accel["x"]
    ay = accel["y"]
    az = accel["z"]
    pitch = math.degrees(math.atan2(ax, math.sqrt(ay**2 + az**2)))
    roll  = math.degrees(math.atan2(ay, math.sqrt(ax**2 + az**2)))
    return pitch, roll

def evaluate_posture(pitch: float, roll: float) -> tuple[bool, str | None]:
    """
    Retorna (posture_ok, alert_code).
    alert_code: None | "HEAD_TOO_HIGH" | "HEAD_TOO_LOW" | "LEAN_LEFT" | "LEAN_RIGHT"
    """
    if pitch > PITCH_MAX_DEG:
        return False, "HEAD_TOO_HIGH"
    if pitch < PITCH_MIN_DEG:
        return False, "HEAD_TOO_LOW"
    if roll > ROLL_MAX_DEG:
        return False, "LEAN_RIGHT"
    if roll < -ROLL_MAX_DEG:
        return False, "LEAN_LEFT"
    return True, None

# ─────────────────────────────────────────────
# Evaluación condiciones de viento
# ─────────────────────────────────────────────
def evaluate_wind(wind_kmh: float, roll_deg: float) -> tuple[str, bool, bool]:
    """
    Retorna (wind_status, overtake_ok, crosswind_warn).

    Lógica:
    - CALM           → viento < favorable_threshold, no hay info útil
    - FAVORABLE      → viento >= favorable, frontal (roll bajo) → LED verde
    - HEADWIND       → viento alto pero frontal (sin roll) → info neutra
    - CROSSWIND_WARNING → roll significativo + viento alto → LED amarillo

    El roll del IMU en bicicleta es un proxy de cuán desviado está el casco
    respecto al eje de avance — indica componente lateral del viento.
    """
    lateral_component = abs(roll_deg) > 8.0  # más de 8° de inclinación lateral

    if wind_kmh < WIND_FAVORABLE_KMH:
        return "CALM", False, False

    if wind_kmh >= WIND_CROSSWIND_KMH and lateral_component:
        return "CROSSWIND_WARNING", False, True

    if lateral_component:
        return "CROSSWIND_WARNING", False, True

    if wind_kmh >= WIND_FAVORABLE_KMH:
        return "FAVORABLE", True, False

    return "HEADWIND", False, False

# ─────────────────────────────────────────────
# Detección de caídas
# ─────────────────────────────────────────────
class FallDetector:
    def __init__(self, threshold_g: float, confirm_cycles: int):
        self.threshold_g = threshold_g
        self.confirm_cycles = confirm_cycles
        self._counter = 0

    def update(self, accel: dict) -> bool:
        """
        Detecta caída por pico de aceleración total (impacto)
        seguido de aceleración baja sostenida (inmovilidad post-caída).
        """
        ax, ay, az = accel["x"], accel["y"], accel["z"]
        total_g = math.sqrt(ax**2 + ay**2 + az**2) / 9.81

        if total_g > self.threshold_g:
            self._counter += 1
        else:
            self._counter = max(0, self._counter - 1)

        return self._counter >= self.confirm_cycles

# ─────────────────────────────────────────────
# Filtro EMA
# ─────────────────────────────────────────────
class EMAFilter:
    def __init__(self, alpha: float):
        self.alpha = alpha
        self._value = None

    def update(self, new_val: float) -> float:
        if self._value is None:
            self._value = new_val
        else:
            self._value = self.alpha * new_val + (1 - self.alpha) * self._value
        return self._value

# ─────────────────────────────────────────────
# MQTT
# ─────────────────────────────────────────────
def build_mqtt_client() -> mqtt.Client:
    client = mqtt.Client(client_id=DEVICE_ID)
    if MQTT_USER:
        client.username_pw_set(MQTT_USER, MQTT_PASS)
    client.tls_set(tls_version=ssl.PROTOCOL_TLS_CLIENT)
    client.enable_logger(log)
    def on_connect(c, u, f, rc):
        if rc == 0:
            log.info("MQTT conectado correctamente")
        else:
            log.error(f"MQTT rechazado por el broker (rc={rc})")
    client.on_connect = on_connect
    client.on_disconnect = lambda c, u, rc: log.warning(f"MQTT desconectado (rc={rc})")
    return client

# ─────────────────────────────────────────────
# Loop principal
# ─────────────────────────────────────────────
def main():
    setup_gpio()

    bus = smbus2.SMBus(1)
    imu = mpu6050(0x68)
    imu.set_accel_range(mpu6050.ACCEL_RANGE_4G)
    imu.set_gyro_range(mpu6050.GYRO_RANGE_500DEG)

    fall_detector = FallDetector(FALL_ACCEL_THRESHOLD, FALL_CONFIRM_CYCLES)
    ema_pressure  = EMAFilter(EMA_ALPHA)
    ema_temp      = EMAFilter(EMA_ALPHA)

    client = build_mqtt_client()
    client.connect(BROKER, PORT, keepalive=60)
    client.loop_start()

    log.info(f"Publicando en {BROKER}:{PORT} → {TOPIC} cada {INTERVAL_S}s")

    while True:
        try:
            t0 = time.time()

            # ── Lecturas raw ──────────────────────────────────────────────────
            accel_raw = imu.get_accel_data()    # m/s²
            gyro_raw  = imu.get_gyro_data()     # deg/s
            temp_raw  = read_lm75a_temperature(bus)
            pres_raw  = read_pressure_pa()

            # ── Filtrado EMA ──────────────────────────────────────────────────
            temp_c    = ema_temp.update(temp_raw)
            pres_pa   = ema_pressure.update(pres_raw)

            # ── Procesamiento ─────────────────────────────────────────────────
            pitch, roll   = compute_pitch_roll(accel_raw)
            posture_ok, posture_alert = evaluate_posture(pitch, roll)
            wind_kmh      = pressure_to_wind_kmh(pres_pa)
            wind_status, overtake_ok, crosswind_warn = evaluate_wind(wind_kmh, roll)
            fall_detected = fall_detector.update(accel_raw)

            # ── Alertas activas ───────────────────────────────────────────────
            alerts = []
            if posture_alert:
                alerts.append(posture_alert)
            if wind_status == "CROSSWIND_WARNING":
                alerts.append("CROSSWIND_WARNING")
            if fall_detected:
                alerts.append("FALL_DETECTED")

            # ── LEDs ──────────────────────────────────────────────────────────
            set_leds(
                posture_bad    = not posture_ok,
                overtake_ok    = overtake_ok,
                crosswind_warn = crosswind_warn
            )

            # ── Payload ───────────────────────────────────────────────────────
            payload = {
                "device_id":       DEVICE_ID,
                "timestamp":       datetime.now(timezone.utc).isoformat(),
                "temperature_c":   round(temp_c, 2),
                "pitch_deg":       round(pitch, 2),
                "roll_deg":        round(roll, 2),
                "wind_speed_kmh":  round(wind_kmh, 1),
                "wind_dynamic_pa": round(pres_pa, 2),
                "accel_x":         round(accel_raw["x"], 4),
                "accel_y":         round(accel_raw["y"], 4),
                "accel_z":         round(accel_raw["z"], 4),
                "gyro_x":          round(gyro_raw["x"], 4),
                "gyro_y":          round(gyro_raw["y"], 4),
                "gyro_z":          round(gyro_raw["z"], 4),
                "posture_ok":      posture_ok,
                "posture_alert":   posture_alert,
                "wind_status":     wind_status,
                "fall_detected":   fall_detected,
                "alerts":          alerts,
            }

            result = client.publish(TOPIC, json.dumps(payload), qos=1)
            if result.rc != mqtt.MQTT_ERR_SUCCESS:
                log.error(f"Error publicando: {result.rc}")
            else:
                log.info(
                    f"pitch={pitch:.1f}° roll={roll:.1f}° "
                    f"viento={wind_kmh:.1f}km/h [{wind_status}] "
                    f"temp={temp_c:.1f}°C "
                    f"alertas={alerts}"
                )

            # ── Timing ───────────────────────────────────────────────────────
            elapsed = time.time() - t0
            sleep_t = max(0.0, INTERVAL_S - elapsed)
            time.sleep(sleep_t)

        except KeyboardInterrupt:
            log.info("Detenido por usuario")
            break
        except Exception as e:
            log.error(f"Error en ciclo: {e}", exc_info=True)
            time.sleep(2.0)

    client.loop_stop()
    client.disconnect()
    if GPIO_AVAILABLE:
        GPIO.cleanup()
    log.info("Soplón detenido")


if __name__ == "__main__":
    main()