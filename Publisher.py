import time
import json
import logging
import numpy as np
import smbus2
import RPi.GPIO as GPIO
from mpu6050 import mpu6050
from dotenv import load_dotenv
import os
import paho.mqtt.client as mqtt
import atexit

load_dotenv()
logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s: %(message)s')

BROKER   = os.getenv("MQTT_BROKER", "broker.hivemq.com")
PORT     = int(os.getenv("MQTT_PORT", 1883))
TOPIC    = os.getenv("MQTT_TOPIC", "iot/sensor/readings")
INTERVAL = int(os.getenv("PUBLISH_INTERVAL", 2))

# ── Calibration offsets ───────────────────────────────────────
ACCEL_OFFSET = {"x": -1.3351, "y": -0.3364, "z": 0.0324}
GYRO_OFFSET  = {"x": -3.4829, "y":  1.0650, "z": -0.7938}

# ── Filtering config ──────────────────────────────────────────
SAMPLES       = 5     # menos samples, más rápido
SAMPLE_DELAY  = 0.01
ZSCORE_THRESH = 2.0
EMA_ALPHA     = 0.2   # 0.1 = muy suave, 0.3 = más responsivo

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

# ── LM75A (temperature, I2C 0x48) ────────────────────────────
def read_lm75a():
    readings = []
    for _ in range(SAMPLES):
        bus = smbus2.SMBus(1)
        raw = bus.read_i2c_block_data(0x48, 0x00, 2)
        bus.close()
        temp = ((raw[0] << 8) | raw[1]) >> 5
        if temp > 1023:
            temp -= 2048
        readings.append(temp * 0.125)
        time.sleep(SAMPLE_DELAY)
    return round(filtered_mean(readings), 2)

# ── MPU-6050 (IMU, I2C 0x68) ─────────────────────────────────
sensor_mpu = mpu6050(0x68)

def read_mpu6050():
    ax_vals, ay_vals, az_vals = [], [], []
    gx_vals, gy_vals, gz_vals = [], [], []
    for _ in range(SAMPLES):
        accel = sensor_mpu.get_accel_data()
        gyro  = sensor_mpu.get_gyro_data()
        ax_vals.append(accel["x"])
        ay_vals.append(accel["y"])
        az_vals.append(accel["z"])
        gx_vals.append(gyro["x"])
        gy_vals.append(gyro["y"])
        gz_vals.append(gyro["z"])
        time.sleep(SAMPLE_DELAY)
    return {
        "accel_x": round(filtered_mean(ax_vals) - ACCEL_OFFSET["x"], 3),
        "accel_y": round(filtered_mean(ay_vals) - ACCEL_OFFSET["y"], 3),
        "accel_z": round(filtered_mean(az_vals) - ACCEL_OFFSET["z"], 3),
        "gyro_x":  round(filtered_mean(gx_vals) - GYRO_OFFSET["x"],  3),
        "gyro_y":  round(filtered_mean(gy_vals) - GYRO_OFFSET["y"],  3),
        "gyro_z":  round(filtered_mean(gz_vals) - GYRO_OFFSET["z"],  3),
    }

# ── MPS20N0040D-S (presion diferencial, HX710B 2-wire) ───────
DOUT_PIN = 5   # Data out
SCK_PIN  = 6   # Clock
HX710B_ZERO_RAW = None
HX710B_COUNTS_PER_KPA = float(
    os.getenv("HX710B_COUNTS_PER_KPA", str(8388608.0 / 10.0))
)
HX710B_MAX_JUMP_KPA = float(os.getenv("HX710B_MAX_JUMP_KPA", "10.0"))
HX710B_CAL_SAMPLES = int(os.getenv("HX710B_CAL_SAMPLES", "25"))
HX710B_CAL_DELAY = float(os.getenv("HX710B_CAL_DELAY", "0.02"))
HX710B_CAL_STDEV_RAW = float(os.getenv("HX710B_CAL_STDEV_RAW", "15000.0"))

GPIO.setmode(GPIO.BCM)
GPIO.setup(DOUT_PIN, GPIO.IN)
GPIO.setup(SCK_PIN, GPIO.OUT)
GPIO.output(SCK_PIN, GPIO.LOW)

def read_hx710b():
    # Esperar a que DOUT baje (conversión lista)
    timeout = time.time() + 1.0
    while GPIO.input(DOUT_PIN) == 1:
        if time.time() > timeout:
            logging.warning("HX710B timeout")
            return None

    # Leer 24 bits
    raw = 0
    for _ in range(24):
        GPIO.output(SCK_PIN, GPIO.HIGH)
        raw = (raw << 1) | GPIO.input(DOUT_PIN)
        GPIO.output(SCK_PIN, GPIO.LOW)

    # Pulso 25 para configurar ganancia 128 (canal A) en próxima lectura
    GPIO.output(SCK_PIN, GPIO.HIGH)
    GPIO.output(SCK_PIN, GPIO.LOW)

    # Complemento a 2 para valor con signo de 24 bits
    if raw & 0x800000:
        raw -= 0x1000000

    return raw


def calibrate_hx710b_zero():
    readings = []
    for _ in range(HX710B_CAL_SAMPLES):
        val = read_hx710b()
        if val is not None:
            readings.append(val)
        time.sleep(HX710B_CAL_DELAY)

    if len(readings) < max(5, HX710B_CAL_SAMPLES // 2):
        logging.warning("HX710B zero calibration skipped: insufficient samples")
        return 0.0

    clean_raw = filtered_mean(readings)
    stdev_raw = float(np.std(np.array(readings, dtype=float)))

    if stdev_raw > HX710B_CAL_STDEV_RAW:
        logging.warning(
            "HX710B zero calibration skipped: unstable baseline (std=%.1f raw counts)",
            stdev_raw,
        )
        return 0.0

    logging.info("HX710B zero calibrated at raw offset %.1f", clean_raw)
    return float(clean_raw)

def read_pressure():
    readings = []
    for _ in range(SAMPLES):
        val = read_hx710b()
        if val is not None:
            readings.append(val)
        time.sleep(SAMPLE_DELAY)

    if not readings:
        return None

    clean_raw = filtered_mean(readings)

    delta_raw = clean_raw - HX710B_ZERO_RAW
    pressure_kpa = delta_raw / HX710B_COUNTS_PER_KPA

    if not np.isfinite(pressure_kpa):
        return None

    if abs(pressure_kpa) > HX710B_MAX_JUMP_KPA:
        logging.warning("HX710B pressure outlier discarded: %.3f kPa", pressure_kpa)
        return None

    return round(pressure_kpa, 3)

# ── MQTT ──────────────────────────────────────────────────────
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logging.info("Connected to MQTT broker at %s:%d", BROKER, PORT)
    else:
        logging.error("Failed to connect, rc=%d", rc)

client = mqtt.Client()
client.on_connect = on_connect
client.connect(BROKER, PORT, keepalive=60)
client.loop_start()
atexit.register(GPIO.cleanup)

HX710B_ZERO_RAW = calibrate_hx710b_zero()

# ── Main loop ─────────────────────────────────────────────────
logging.info("Starting publisher — sending every %ds to topic '%s'", INTERVAL, TOPIC)

while True:
    try:
        imu = read_mpu6050()
        pressure_raw = read_pressure()
        if pressure_raw is None:
            pressure_value = round(ema_state.get("pressure", 0.0), 3)
        else:
            pressure_value = ema("pressure", pressure_raw)
        payload = {
            "device_id":   "rpi-soplon",
            "temperature": ema("temperature", read_lm75a()),
            "pressure":    pressure_value,
            "accel_x":     ema("accel_x",     imu["accel_x"]),
            "accel_y":     ema("accel_y",     imu["accel_y"]),
            "accel_z":     ema("accel_z",     imu["accel_z"]),
            "gyro_x":      ema("gyro_x",      imu["gyro_x"]),
            "gyro_y":      ema("gyro_y",      imu["gyro_y"]),
            "gyro_z":      ema("gyro_z",      imu["gyro_z"]),
        }
        client.publish(TOPIC, json.dumps(payload))
        logging.info("Published: %s", payload)
    except Exception as e:
        logging.error("Sensor read error: %s", e)
    time.sleep(INTERVAL)

