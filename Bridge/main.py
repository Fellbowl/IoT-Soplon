import os
import json
import ssl
import paho.mqtt.client as mqtt
import threading
from dotenv import load_dotenv
from supabase import create_client
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timezone, timedelta

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")
supabase     = create_client(SUPABASE_URL, SUPABASE_KEY)

MQTT_BROKER   = os.getenv("MQTT_BROKER")
MQTT_PORT     = int(os.getenv("MQTT_PORT", 8883))
MQTT_TOPIC    = os.getenv("MQTT_TOPIC")
MQTT_USER     = os.getenv("MQTT_USER")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "*")
PORT           = int(os.getenv("PORT", 5000))

app = Flask(__name__)
CORS(app, origins=[ALLOWED_ORIGIN])


def parse_alerts(value):
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else []
        except json.JSONDecodeError:
            return []
    return []

# ─────────────────────────────────────────────
# Endpoints REST
# ─────────────────────────────────────────────

@app.route("/api/health")
def health():
    return jsonify({"status": "ok"})


@app.route("/api/readings")
def readings():
    """
    Devuelve lecturas en orden cronológico.
    Query params:
      - minutes (int, default 5): ventana de tiempo hacia atrás
      - limit   (int, default 20): fallback si no hay datos recientes
    """
    minutes = int(request.args.get("minutes", 5))
    limit   = int(request.args.get("limit", 20))

    since = (datetime.now(timezone.utc) - timedelta(minutes=minutes)) \
                .strftime("%Y-%m-%dT%H:%M:%SZ")

    response = (
        supabase.table("sensor_readings")
        .select("*")
        .gte("timestamp", since)
        .order("timestamp", desc=False)
        .execute()
    )

    if not response.data:
        response = (
            supabase.table("sensor_readings")
            .select("*")
            .order("timestamp", desc=True)
            .limit(limit)
            .execute()
        )
        rows = [dict(row, alerts=parse_alerts(row.get("alerts"))) for row in reversed(response.data)]
        return jsonify(rows)

    rows = [dict(row, alerts=parse_alerts(row.get("alerts"))) for row in response.data]
    return jsonify(rows)


@app.route("/api/alerts")
def alerts():
    """
    Devuelve las filas que tuvieron al menos una alerta activa.
    Query params:
      - minutes (int, default 30): ventana de búsqueda
      - limit   (int, default 50)
    """
    minutes = int(request.args.get("minutes", 30))
    limit   = int(request.args.get("limit", 50))

    since = (datetime.now(timezone.utc) - timedelta(minutes=minutes)) \
                .strftime("%Y-%m-%dT%H:%M:%SZ")

    response = (
        supabase.table("sensor_readings")
        .select("timestamp, device_id, alerts, posture_alert, wind_status, fall_detected")
        .gte("timestamp", since)
        .neq("alerts", "[]")          # solo filas con alertas
        .order("timestamp", desc=True)
        .limit(limit)
        .execute()
    )

    rows = [dict(row, alerts=parse_alerts(row.get("alerts"))) for row in response.data]
    return jsonify(rows)


@app.route("/api/session/summary")
def session_summary():
    """
    Resumen estadístico de la sesión más reciente (últimas N horas).
    Útil para la vista Historial del dashboard.
    """
    hours = float(request.args.get("hours", 2))
    since = (datetime.now(timezone.utc) - timedelta(hours=hours)) \
                .strftime("%Y-%m-%dT%H:%M:%SZ")

    response = (
        supabase.table("sensor_readings")
        .select(
            "timestamp, posture_ok, wind_status, wind_speed_kmh, "
            "temperature_c, fall_detected, alerts"
        )
        .gte("timestamp", since)
        .order("timestamp", desc=False)
        .execute()
    )

    data = [dict(row, alerts=parse_alerts(row.get("alerts"))) for row in response.data]
    if not data:
        return jsonify({"error": "no data"}), 404

    total = len(data)
    posture_ok_count = sum(1 for r in data if r.get("posture_ok"))
    fall_count       = sum(1 for r in data if r.get("fall_detected"))
    temps            = [r["temperature_c"] for r in data if r.get("temperature_c") is not None]
    winds            = [r["wind_speed_kmh"] for r in data if r.get("wind_speed_kmh") is not None]

    alert_counts = {}
    for r in data:
        for a in parse_alerts(r.get("alerts")):
            alert_counts[a] = alert_counts.get(a, 0) + 1

    return jsonify({
        "total_readings":    total,
        "posture_ok_pct":    round(posture_ok_count / total * 100, 1) if total else 0,
        "fall_count":        fall_count,
        "avg_temperature_c": round(sum(temps) / len(temps), 2) if temps else None,
        "max_wind_kmh":      round(max(winds), 1) if winds else None,
        "alert_counts":      alert_counts,
        "from":              data[0]["timestamp"],
        "to":                data[-1]["timestamp"],
    })


# ─────────────────────────────────────────────
# MQTT — mapeo de payload v2
# ─────────────────────────────────────────────

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print(f"[MQTT] Conectado al broker, suscrito a: {MQTT_TOPIC}")
        client.subscribe(MQTT_TOPIC)
    else:
        print(f"[MQTT] Error de conexión, código: {rc}")


def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print(f"[MQTT] Mensaje recibido: {payload}")

        row = {
            # ── Identificación ────────────────────────────────────────────
            "device_id":       payload.get("device_id", "unknown"),
            "timestamp":       payload.get("timestamp"),

            # ── Ambiente ──────────────────────────────────────────────────
            "temperature_c":   payload.get("temperature_c"),   # nuevo nombre v2
            "temperature":     payload.get("temperature_c"),   # alias v1 (retrocompat.)

            # ── Presión / viento ──────────────────────────────────────────
            "wind_dynamic_pa": payload.get("wind_dynamic_pa"),
            "wind_speed_kmh":  payload.get("wind_speed_kmh"),
            "wind_status":     payload.get("wind_status"),     # CALM|FAVORABLE|HEADWIND|CROSSWIND_WARNING
            "pressure":        payload.get("wind_dynamic_pa"), # alias v1 (retrocompat.)

            # ── Postura ───────────────────────────────────────────────────
            "pitch_deg":       payload.get("pitch_deg"),
            "roll_deg":        payload.get("roll_deg"),
            "posture_ok":      payload.get("posture_ok"),
            "posture_alert":   payload.get("posture_alert"),   # HEAD_TOO_HIGH|LOW|LEAN_LEFT|RIGHT

            # ── IMU raw ───────────────────────────────────────────────────
            "accel_x":         payload.get("accel_x"),
            "accel_y":         payload.get("accel_y"),
            "accel_z":         payload.get("accel_z"),
            "gyro_x":          payload.get("gyro_x"),
            "gyro_y":          payload.get("gyro_y"),
            "gyro_z":          payload.get("gyro_z"),

            # ── Alertas / seguridad ───────────────────────────────────────
            "fall_detected":   payload.get("fall_detected", False),
            "alerts":          json.dumps(payload.get("alerts", [])),  # array → JSON string para Supabase
        }

        supabase.table("sensor_readings").insert(row).execute()
        print(f"[Supabase] Fila insertada — alertas: {payload.get('alerts', [])}")

    except json.JSONDecodeError as e:
        print(f"[Error] Payload inválido: {e}")
    except Exception as e:
        print(f"[Error] {e}")


# ─────────────────────────────────────────────
# Arranque
# ─────────────────────────────────────────────

mqtt_client = mqtt.Client()
mqtt_client.tls_set(tls_version=ssl.PROTOCOL_TLS)
mqtt_client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(MQTT_BROKER, MQTT_PORT)

flask_thread = threading.Thread(
    target=lambda: app.run(host="0.0.0.0", port=PORT, use_reloader=False)
)
flask_thread.daemon = True
flask_thread.start()

mqtt_client.loop_forever()