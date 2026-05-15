"""
Publisher.py — Soplón IoT Aerodynamic System (Optimized Version)
"""

import time
import json
import math
import logging
import numpy as np
from dotenv import load_dotenv
import os
import smbus2
import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO
from mpu6050 import mpu6050
from datetime import datetime, timezone

load_dotenv()
logging.basicConfig(level=logging.INFO, format="[%(asctime)s] %(levelname)s: %(message)s")
log = logging.getLogger(__name__)

# ──────────────────────────────────────────────
# CONFIGURACIÓN (desde .env)
# ──────────────────────────────────────────────
MQTT_BROKER   = os.getenv("MQTT_BROKER", "broker.example.com")
MQTT_PORT     = int(os.getenv("MQTT_PORT", 8883))
MQTT_TOPIC    = os.getenv("MQTT_TOPIC", "soplon/casco/v1")
MQTT_USER     = os.getenv("MQTT_USER", "")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD", "")
MQTT_CA_CERT  = os.getenv("MQTT_CA_CERT", "/etc/ssl/certs/ca-certificates.crt")
DEVICE_ID     = os.getenv("DEVICE_ID", "rpi-soplon")
PUBLISH_INTERVAL = float(os.getenv("PUBLISH_INTERVAL", 0.5))

# Pines GPIO (BCM) para LEDs
LED_POSTURE   = int(os.getenv("LED_POSTURE_PIN", 17))   # Rojo -> Mala postura
LED_WIND_OK   = int(os.getenv("LED_WIND_OK_PIN", 27))   # Verde -> Viento favorable
LED_CROSSWIND = int(os.getenv("LED_CROSSWIND_PIN", 22)) # Amarillo -> Precaución

# Parámetros de filtrado del código antiguo
ZSCORE_THRESH = 2.0
EMA_ALPHA     = 0.2

# ──────────────────────────────────────────────
# UMBRALES DE ENTORNO Y LÓGICA
# ──────────────────────────────────────────────
PITCH_AERO_MIN = float(os.getenv("PITCH_AERO_MIN", -45))
PITCH_AERO_MAX = float(os.getenv("PITCH_AERO_MAX", -10))
PITCH_UPRIGHT  = float(os.getenv("PITCH_UPRIGHT", 5))
ROLL_MAX       = float(os.getenv("ROLL_MAX", 15))

AIR_DENSITY    = float(os.getenv("AIR_DENSITY", 0.94)) # Bogotá aprox
PRESSURE_SCALE = float(os.getenv("PRESSURE_SCALE", 1000.0)) # Ajustar conversión a Pa

WIND_CALM      = float(os.getenv("WIND_CALM", 3.0))
WIND_FAVORABLE = float(os.getenv("WIND_FAVORABLE", 8.0))
WIND_STRONG    = float(os.getenv("WIND_STRONG", 14.0))

TEMP_HOT       = float(os.getenv("TEMP_HOT", 35.0))
TEMP_CRITICAL  = float(os.getenv("TEMP_CRITICAL", 40.0))

FALL_ACCEL_THRESHOLD = float(os.getenv("FALL_ACCEL_THRESHOLD", 3.5))
FALL_CONFIRM_TIME    = float(os.getenv("FALL_CONFIRM_TIME", 0.8))

# ──────────────────────────────────────────────
# FILTROS MATEMÁTICOS RECUPERADOS
# ──────────────────────────────────────────────
ema_state = {}

def ema(key, new_value):
    if key not in ema_state:
        ema_state[key] = new_value
    ema_state[key] = EMA_ALPHA * new_value + (1 - EMA_ALPHA) * ema_state[key]
    return round(ema_state[key], 3)

def filtered_mean(values):
    arr = np.array(values, dtype=float)
    if len(arr) < 3:
        return float(np.mean(arr))
    mean = np.mean(arr)
    std  = np.std(arr)
    if std == 0:
        return float(mean)
    z_scores = np.abs((arr - mean) / std)
    clean = arr[z_scores < ZSCORE_THRESH]
    if len(clean) < 3:
        return float(mean)
    return float(np.mean(clean))

# ──────────────────────────────────────────────
# INICIALIZACIÓN GPIO
# ──────────────────────────────────────────────
def init_gpio():
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    for pin in [LED_POSTURE, LED_WIND_OK, LED_CROSSWIND]:
        GPIO.setup(pin, GPIO.OUT)
        GPIO.output(pin, GPIO.LOW)

def set_leds(posture_bad: bool, wind_ok: bool, crosswind: bool):
    GPIO.output(LED_POSTURE,   GPIO.HIGH if posture_bad else GPIO.LOW)
    GPIO.output(LED_WIND_OK,   GPIO.HIGH if wind_ok     else GPIO.LOW)
    GPIO.output(LED_CROSSWIND, GPIO.HIGH if crosswind   else GPIO.LOW)

# ──────────────────────────────────────────────
# CLASES DE SENSORES (POO + FILTROS COMPLETOS)
# ──────────────────────────────────────────────
class IMUSensor:
    def __init__(self, address=0x68):
        self.imu = mpu6050(address)
        self.imu.set_accel_range(mpu6050.ACCEL_RANGE_4G)
        self.imu.set_gyro_range(mpu6050.GYRO_RANGE_250DEG)
        self.pitch = 0.0
        self.roll  = 0.0
        self.alpha = 0.96  # Peso del giroscopio en filtro complementario
        self.last_time = time.time()
        self._fall_candidate_time = None
        self.fall_detected = False
        log.info("MPU-6050 inicializado con Filtro Complementario")

    def update(self) -> dict:
        accel = self.imu.get_accel_data()
        gyro  = self.imu.get_gyro_data()
        now   = time.time()
        dt    = now - self.last_time
        self.last_time = now

        ax, ay, az = accel['x'], accel['y'], accel['z']
        gx, gy     = gyro['x'],  gyro['y']

        # Ángulos base del acelerómetro
        pitch_acc = math.degrees(math.atan2(ax, math.sqrt(ay**2 + az**2)))
        roll_acc  = math.degrees(math.atan2(ay, math.sqrt(ax**2 + az**2)))

        # Fusión por Filtro Complementario
        self.pitch = self.alpha * (self.pitch + gx * dt) + (1 - self.alpha) * pitch_acc
        self.roll  = self.alpha * (self.roll  + gy * dt) + (1 - self.alpha) * roll_acc

        # Detección de Caídas
        accel_mag = math.sqrt(ax**2 + ay**2 + az**2)
        if accel_mag > FALL_ACCEL_THRESHOLD:
            if self._fall_candidate_time is None:
                self._fall_candidate_time = now
        else:
            if self._fall_candidate_time and (now - self._fall_candidate_time) > FALL_CONFIRM_TIME:
                if not self.fall_detected:
                    log.warning("⚠️ ¡POSIBLE CAÍDA DETECTADA!")
                self.fall_detected = True
            if self._fall_candidate_time and (now - self._fall_candidate_time) > 3.0:
                self._fall_candidate_time = None

        return {
            "pitch_deg":    round(self.pitch, 2),
            "roll_deg":     round(self.roll, 2),
            "accel_x":      round(ax, 3),
            "accel_y":      round(ay, 3),
            "accel_z":      round(az, 3),
            "accel_mag_g":  round(accel_mag, 3),
            "gyro_x":       round(gx, 2),
            "gyro_y":       round(gy, 2),
            "gyro_z":       round(gyro['z'], 2),
        }

    def reset_fall(self):
        self.fall_detected = False
        self._fall_candidate_time = None


class TemperatureSensor:
    def __init__(self, address=0x48, bus=1):
        self.address = address
        self.bus_num = bus

    def read(self) -> float:
        # Mantiene el muestreo múltiple y filtrado Z-Score de tu código antiguo
        readings = []
        bus = smbus2.SMBus(self.bus_num)
        for _ in range(5):
            raw = bus.read_i2c_block_data(self.address, 0x00, 2)
            temp_raw = (raw[0] << 3) | (raw[1] >> 5)
            if temp_raw > 1023:
                temp_raw -= 2048
            readings.append(temp_raw * 0.125)
            time.sleep(0.01)
        bus.close()
        
        # Suavizado combinado: Z-Score + EMA
        raw_filtered = filtered_mean(readings)
        return ema("temperature", raw_filtered)


class PressureSensor:
    HX710B_DATA_PIN  = int(os.getenv("HX710B_DATA_PIN", 5))
    HX710B_CLOCK_PIN = int(os.getenv("HX710B_CLOCK_PIN", 6))

    def __init__(self):
        GPIO.setup(self.HX710B_DATA_PIN,  GPIO.IN)
        GPIO.setup(self.HX710B_CLOCK_PIN, GPIO.OUT)
        GPIO.output(self.HX710B_CLOCK_PIN, GPIO.LOW)
        self._offset = 0.0
        self.calibrate()

    def _read_raw(self) -> int:
        timeout = time.time() + 0.5
        while GPIO.input(self.HX710B_DATA_PIN) == GPIO.HIGH:
            if time.time() > timeout:
                raise TimeoutError("HX710B sin respuesta")
            time.sleep(0.001)

        count = 0
        for _ in range(24):
            GPIO.output(self.HX710B_CLOCK_PIN, GPIO.HIGH)
            count = (count << 1) | GPIO.input(self.HX710B_DATA_PIN)
            GPIO.output(self.HX710B_CLOCK_PIN, GPIO.LOW)

        GPIO.output(self.HX710B_CLOCK_PIN, GPIO.HIGH)
        GPIO.output(self.HX710B_CLOCK_PIN, GPIO.LOW)

        if count & 0x800000:
            count -= 0x1000000
        return count

    def calibrate(self):
        # Calibración robusta del código antiguo (mide estabilidad con std)
        log.info("Calibrando sensor de presión (Mantener sin flujo de viento)…")
        readings = []
        for _ in range(25):
            try:
                readings.append(self._read_raw())
            except TimeoutError:
                pass
            time.sleep(0.02)

        if len(readings) < 12:
            log.warning("Calibración imprecisa: Muestras insuficientes.")
            return

        stdev_raw = float(np.std(np.array(readings, dtype=float)))
        if stdev_raw > 15000.0: # Umbral de estabilidad de tu código antiguo
            log.warning(f"Línea base inestable (std={stdev_raw:.1f}). Calibración abortada.")
            return

        self._offset = filtered_mean(readings)
        log.info(f"HX710B calibrado con éxito. Offset: {self._offset:.1f}")

    def read_pa(self) -> float:
        readings = []
        for _ in range(5):
            try:
                readings.append(self._read_raw())
            except TimeoutError:
                pass
            time.sleep(0.01)

        if not readings:
            return ema("pressure", 0.0)

        clean_raw = filtered_mean(readings)
        delta_raw = clean_raw - self._offset
        
        # Conversión a Pascales y suavizado EMA
        pa = delta_raw / PRESSURE_SCALE
        if abs(pa) > 1000.0: # Filtro de picos anómalos (Outliers)
            return round(ema_state.get("pressure", 0.0), 2)

        return max(0.0, ema("pressure", pa))


# ──────────────────────────────────────────────
# LOGICA DE TRATAMIENTO DE DATOS
# ──────────────────────────────────────────────
def classify_posture(pitch: float, roll: float) -> dict:
    bad = False
    issues = []
    if pitch > PITCH_UPRIGHT:
        bad = True
        issues.append("cabeza_erguida")
    elif pitch < PITCH_AERO_MIN:
        bad = True
        issues.append("cabeza_muy_baja")
    if abs(roll) > ROLL_MAX:
        bad = True
        issues.append("inclinacion_lateral")

    status = "aerodinamica" if (PITCH_AERO_MIN <= pitch <= PITCH_AERO_MAX and abs(roll) <= ROLL_MAX) else ("mala" if bad else "aceptable")
    return {"posture_status": status, "posture_bad": bad, "posture_issues": issues}

def wind_speed_from_pressure(pa: float) -> float:
    if pa <= 0: return 0.0
    return round(math.sqrt(2 * pa / AIR_DENSITY), 2)

def classify_wind(speed_ms: float) -> dict:
    kmh = round(speed_ms * 3.6, 1)
    if speed_ms < WIND_CALM:
        category, favorable, cross = "calma", False, False
    elif speed_ms < WIND_FAVORABLE:
        category, favorable, cross = "favorable", True, False
    elif speed_ms < WIND_STRONG:
        category, favorable, cross = "fuerte", False, True
    else:
        category, favorable, cross = "peligroso", False, True

    return {"wind_speed_ms": speed_ms, "wind_speed_kmh": kmh, "wind_category": category, "wind_favorable": favorable, "crosswind_risk": cross}

def classify_temperature(temp_c: float) -> dict:
    status = "critica" if temp_c >= TEMP_CRITICAL else ("caliente" if temp_c >= TEMP_HOT else "normal")
    return {"temperature_c": temp_c, "temp_status": status}

def build_alert_list(posture: dict, wind: dict, temp: dict, fall: bool) -> list:
    alerts = []
    if fall: alerts.append({"type": "CAIDA", "severity": "critical", "msg": "Posible caída detectada"})
    if posture["posture_bad"]:
        for issue in posture["posture_issues"]:
            alerts.append({"type": "POSTURA", "severity": "warning", "msg": issue.replace("_", " ")})
    if wind["wind_category"] == "peligroso": alerts.append({"type": "VIENTO", "severity": "critical", "msg": "Viento peligroso"})
    if temp["temp_status"] == "critica": alerts.append({"type": "TEMPERATURA", "severity": "critical", "msg": "Temperatura crítica"})
    return alerts


# ──────────────────────────────────────────────
# CLIENTE MQTTv5 ENCAPSULADO
# ──────────────────────────────────────────────
class MQTTPublisher:
    def __init__(self):
        self.client = mqtt.Client(client_id=DEVICE_ID, protocol=mqtt.MQTTv5)
        self.client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
        self.client.tls_set(ca_certs=MQTT_CA_CERT)
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.connected = False

    def _on_connect(self, client, userdata, flags, rc, props=None):
        if rc == 0:
            self.connected = True
            log.info("✅ Conexión establecida vía MQTTv5 con TLS")
        else:
            log.error(f"Error de conexión MQTT: rc={rc}")

    def _on_disconnect(self, client, userdata, rc, props=None):
        self.connected = False
        log.warning("MQTT desconectado. Intentando reconexión...")

    def connect(self):
        self.client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
        self.client.loop_start()

    def publish(self, payload: dict):
        if not self.connected: return
        self.client.publish(MQTT_TOPIC, json.dumps(payload), qos=1)


# ──────────────────────────────────────────────
# BUCLE PRINCIPAL DE EJECUCIÓN
# ──────────────────────────────────────────────
def main():
    init_gpio()
    
    imu = IMUSensor()
    temp = TemperatureSensor()
    pres = PressureSensor()
    mqtt_pub = MQTTPublisher()
    mqtt_pub.connect()

    time.sleep(1.5) # Espera de cortesía para estabilización MQTT

    try:
        while True:
            start_time = time.time()

            # Lecturas filtradas
            imu_data = imu.update()
            temp_c = temp.read()
            pressure_pa = pres.read_pa()

            # Lógica e inferencias
            posture = classify_posture(imu_data["pitch_deg"], imu_data["roll_deg"])
            wind_spd = wind_speed_from_pressure(pressure_pa)
            wind = classify_wind(wind_spd)
            temp_cl = classify_temperature(temp_c)
            fall = imu.fall_detected

            alerts = build_alert_list(posture, wind, temp_cl, fall)

            # Control de LEDs de advertencia física en el casco
            set_leds(
                posture_bad = posture["posture_bad"],
                wind_ok     = wind["wind_favorable"],
                crosswind   = wind["crosswind_risk"]
            )

            # Construcción del mensaje integrado
            payload = {
                "device_id": DEVICE_ID,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "pitch_deg": imu_data["pitch_deg"],
                "roll_deg": imu_data["roll_deg"],
                "posture_status": posture["posture_status"],
                "pressure_pa": pressure_pa,
                "wind_speed_kmh": wind["wind_speed_kmh"],
                "wind_category": wind["wind_category"],
                "temperature_c": temp_c,
                "temp_status": temp_cl["temp_status"],
                "fall_detected": fall,
                "alerts": alerts
            }

            mqtt_pub.publish(payload)
            if alerts:
                log.warning(f"Alertas activas: {alerts}")

            if fall:
                imu.reset_fall()

            # Sincronización precisa del ciclo de publicación
            elapsed = time.time() - start_time
            time.sleep(max(0, PUBLISH_INTERVAL - elapsed))

    except KeyboardInterrupt:
        log.info("Script interrumpido por el usuario")
    finally:
        GPIO.cleanup()
        mqtt_pub.client.loop_stop()
        mqtt_pub.client.disconnect()

if __name__ == "__main__":
    main()