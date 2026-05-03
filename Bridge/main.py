import os
import json
import ssl
import paho.mqtt.client as mqtt
import threading
from dotenv import load_dotenv
from supabase import create_client
from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime, timezone, timedelta


load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

MQTT_BROKER = os.getenv("MQTT_BROKER")
MQTT_PORT   = int(os.getenv("MQTT_PORT", 8883))
MQTT_TOPIC  = os.getenv("MQTT_TOPIC")
MQTT_USER     = os.getenv("MQTT_USER")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN")
PORT = int(os.getenv("PORT", 5000))

app = Flask(__name__)
CORS(app, origins=[ALLOWED_ORIGIN])

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})

# Una forma de asegurar que siempre veas algo de data al cargar:
@app.route("/api/readings")
def readings():
    # Intenta traer los últimos 5 minutos...
    since = (datetime.now(timezone.utc) - timedelta(minutes=5)).strftime("%Y-%m-%dT%H:%M:%SZ")
    response = (
        supabase.table("sensor_readings")
        .select("*")
        .gte("timestamp", since)
        .order("timestamp", desc=False)
        .execute()
    )
    
    # ...pero si no hay nada, trae al menos los últimos 20 registros históricos
    if not response.data:
        response = (
            supabase.table("sensor_readings")
            .select("*")
            .order("timestamp", desc=True)
            .limit(20)
            .execute()
        )
        # Invertimos para que el gráfico los muestre en orden cronológico
        return jsonify(list(reversed(response.data)))
        
    return jsonify(response.data)

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"Conectado al broker MQTT")
        client.subscribe(MQTT_TOPIC)
    else:
        print(f"Error de conexión, código: {rc}")

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print(f"Mensaje recibido: {payload}")

        row = {
            "device_id":   payload.get("device_id", "unknown"),
            "timestamp":   payload.get("timestamp"),
            "temperature": payload.get("temperature"),
            "pressure":    payload.get("pressure"),
            "accel_x":     payload.get("accel_x"),
            "accel_y":     payload.get("accel_y"),
            "accel_z":     payload.get("accel_z"),
            "gyro_x":      payload.get("gyro_x"),
            "gyro_y":      payload.get("gyro_y"),
            "gyro_z":      payload.get("gyro_z"),
        }

        supabase.table("sensor_readings").insert(row).execute()
        print(f"Fila insertada en Supabase")

    except Exception as e:
        print(f"Error: {e}")

mqtt_client = mqtt.Client()
mqtt_client.tls_set(tls_version=ssl.PROTOCOL_TLS)
mqtt_client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_BROKER, MQTT_PORT)
flask_thread = threading.Thread(target=lambda: app.run(host="0.0.0.0", port=PORT))
flask_thread.daemon = True
flask_thread.start()
mqtt_client.loop_forever()