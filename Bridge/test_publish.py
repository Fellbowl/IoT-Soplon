import json, ssl
import paho.mqtt.client as mqtt
from dotenv import load_dotenv
import os
import time
from datetime import datetime, timezone

load_dotenv()

client = mqtt.Client()
client.tls_set(tls_version=ssl.PROTOCOL_TLS)
client.username_pw_set(os.getenv("MQTT_USER"), os.getenv("MQTT_PASSWORD"))
client.connect(os.getenv("MQTT_BROKER"), int(os.getenv("MQTT_PORT", 8883)))

payload = {
    "device_id": "test",
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "temperature": 23.5,
    "pressure": 0.012,
    "accel_x": 0.021, "accel_y": -0.015, "accel_z": 9.812,
    "gyro_x": 0.003,  "gyro_y": -0.001,  "gyro_z": 0.002
}

client.publish(os.getenv("MQTT_TOPIC"), json.dumps(payload))
print("Mensaje publicado")
time.sleep(2)  # espera a que el broker confirme la entrega
client.disconnect()