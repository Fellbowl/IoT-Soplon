"""
Soplón — main.py
Subscriber MQTT + API REST para el dashboard del casco ciclista.

Arquitectura:
  - Hilo principal: Flask (Render detecta el puerto y mantiene el servicio vivo).
  - Hilo secundario: cliente MQTT con loop_forever() y reconexión automática.

Flujo de datos:
  Publisher (Raspberry Pi)  ──MQTT/TLS──►  HiveMQ Cloud
                                              │
                                              ▼
                                       este subscriber
                                              │
                                              ├──►  Supabase (persistencia)
                                              │
                                              └──►  Flask REST API ──►  Frontend
"""

import os
import json
import ssl
import logging
import threading
import time
from datetime import datetime, timezone, timedelta

import paho.mqtt.client as mqtt
from dotenv import load_dotenv
from supabase import create_client
from flask import Flask, jsonify, request
from flask_cors import CORS

# ─────────────────────────────────────────────
# Configuración
# ─────────────────────────────────────────────
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
log = logging.getLogger("soplon-api")

# ── Validación de variables de entorno ────────────────────────────────────────
REQUIRED_ENV = [
    "SUPABASE_URL", "SUPABASE_SECRET_KEY",
    "MQTT_BROKER", "MQTT_TOPIC", "MQTT_USER", "MQTT_PASSWORD",
]
_missing = [v for v in REQUIRED_ENV if not os.getenv(v)]
if _missing:
    raise RuntimeError(f"Variables de entorno faltantes: {_missing}")

# ── Supabase ──────────────────────────────────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SECRET_KEY")
supabase     = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── MQTT ──────────────────────────────────────────────────────────────────────
MQTT_BROKER   = os.getenv("MQTT_BROKER")
MQTT_PORT     = int(os.getenv("MQTT_PORT", 8883))
MQTT_TOPIC    = os.getenv("MQTT_TOPIC")
MQTT_USER     = os.getenv("MQTT_USER")
MQTT_PASSWORD = os.getenv("MQTT_PASSWORD")
MQTT_CLIENT_ID = os.getenv("MQTT_CLIENT_ID", "soplon-subscriber")
MQTT_KEEPALIVE = int(os.getenv("MQTT_KEEPALIVE", 30))

# ── Flask ─────────────────────────────────────────────────────────────────────
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "*")
PORT           = int(os.getenv("PORT", 5000))

app = Flask(__name__)
CORS(app, origins=[ALLOWED_ORIGIN])


# ─────────────────────────────────────────────
# Utilidades
# ─────────────────────────────────────────────
def parse_alerts(value):
    """Normaliza el campo 'alerts' a lista de strings, venga como venga."""
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else []
        except json.JSONDecodeError:
            return []
    return []


def iso_since(**kwargs) -> str:
    """Retorna un timestamp ISO8601 en UTC restando el delta especificado."""
    return (datetime.now(timezone.utc) - timedelta(**kwargs)) \
        .strftime("%Y-%m-%dT%H:%M:%SZ")


# ─────────────────────────────────────────────
# Endpoints REST
# ─────────────────────────────────────────────
@app.route("/api/health")
def health():
    """Health check para Render y monitoreo externo."""
    return jsonify({
        "status":      "ok",
        "mqtt_state":  mqtt_state.copy(),
        "timestamp":   datetime.now(timezone.utc).isoformat(),
    })


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
    since   = iso_since(minutes=minutes)

    response = (
        supabase.table("sensor_readings")
        .select("*")
        .gte("timestamp", since)
        .order("timestamp", desc=False)
        .execute()
    )

    if not response.data:
        # Fallback: últimas N lecturas sin importar fecha
        response = (
            supabase.table("sensor_readings")
            .select("*")
            .order("timestamp", desc=True)
            .limit(limit)
            .execute()
        )
        rows = [
            dict(row, alerts=parse_alerts(row.get("alerts")))
            for row in reversed(response.data)
        ]
        return jsonify(rows)

    rows = [
        dict(row, alerts=parse_alerts(row.get("alerts")))
        for row in response.data
    ]
    return jsonify(rows)


@app.route("/api/alerts")
def alerts():
    """
    Devuelve filas con al menos una alerta activa.
    Query params:
      - minutes (int, default 30)
      - limit   (int, default 50)
    """
    minutes = int(request.args.get("minutes", 30))
    limit   = int(request.args.get("limit", 50))
    since   = iso_since(minutes=minutes)

    response = (
        supabase.table("sensor_readings")
        .select("timestamp, device_id, alerts, posture_alert, wind_status, fall_detected")
        .gte("timestamp", since)
        .neq("alerts", "[]")
        .order("timestamp", desc=True)
        .limit(limit)
        .execute()
    )

    rows = [
        dict(row, alerts=parse_alerts(row.get("alerts")))
        for row in response.data
    ]
    return jsonify(rows)


@app.route("/api/session/summary")
def session_summary():
    """Resumen estadístico de la sesión más reciente."""
    hours = float(request.args.get("hours", 2))
    since = iso_since(hours=hours)

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

    data = [
        dict(row, alerts=parse_alerts(row.get("alerts")))
        for row in response.data
    ]
    if not data:
        return jsonify({"error": "no data"}), 404

    total            = len(data)
    posture_ok_count = sum(1 for r in data if r.get("posture_ok"))
    fall_count       = sum(1 for r in data if r.get("fall_detected"))
    temps            = [r["temperature_c"]  for r in data if r.get("temperature_c")  is not None]
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
# MQTT
# ─────────────────────────────────────────────
# Estado compartido para que /api/health lo pueda reportar
mqtt_state = {
    "connected":         False,
    "last_message_at":   None,
    "messages_received": 0,
    "messages_stored":   0,
    "last_error":        None,
}


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        mqtt_state["connected"] = True
        log.info(f"MQTT conectado, suscribiendo a: {MQTT_TOPIC}")
        client.subscribe(MQTT_TOPIC, qos=1)
    else:
        mqtt_state["connected"]  = False
        mqtt_state["last_error"] = f"CONNACK rc={rc}"
        log.error(f"MQTT rechazado por el broker (rc={rc})")


def on_disconnect(client, userdata, rc):
    mqtt_state["connected"] = False
    if rc != 0:
        log.warning(f"MQTT desconectado inesperadamente (rc={rc}). "
                    f"loop_forever reintentará automáticamente.")
    else:
        log.info("MQTT desconectado limpiamente.")


def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        mqtt_state["messages_received"] += 1
        mqtt_state["last_message_at"]    = datetime.now(timezone.utc).isoformat()

        row = {
            # ── Identificación ────────────────────────────────────────────
            "device_id":       payload.get("device_id", "unknown"),
            "timestamp":       payload.get("timestamp"),

            # ── Ambiente ──────────────────────────────────────────────────
            "temperature_c":   payload.get("temperature_c"),
            "temperature":     payload.get("temperature_c"),   # alias v1

            # ── Presión / viento ──────────────────────────────────────────
            "wind_dynamic_pa": payload.get("wind_dynamic_pa"),
            "wind_speed_kmh":  payload.get("wind_speed_kmh"),
            "wind_status":     payload.get("wind_status"),
            "pressure":        payload.get("wind_dynamic_pa"), # alias v1

            # ── Postura ───────────────────────────────────────────────────
            "pitch_deg":       payload.get("pitch_deg"),
            "roll_deg":        payload.get("roll_deg"),
            "posture_ok":      payload.get("posture_ok"),
            "posture_alert":   payload.get("posture_alert"),

            # ── IMU raw ───────────────────────────────────────────────────
            "accel_x":         payload.get("accel_x"),
            "accel_y":         payload.get("accel_y"),
            "accel_z":         payload.get("accel_z"),
            "gyro_x":          payload.get("gyro_x"),
            "gyro_y":          payload.get("gyro_y"),
            "gyro_z":          payload.get("gyro_z"),

            # ── Alertas / seguridad ───────────────────────────────────────
            "fall_detected":   payload.get("fall_detected", False),
            "alerts":          json.dumps(payload.get("alerts", [])),
        }

        supabase.table("sensor_readings").insert(row).execute()
        mqtt_state["messages_stored"] += 1

        alerts_list = payload.get("alerts", [])
        if alerts_list:
            log.warning(f"Fila insertada con alertas: {alerts_list}")
        else:
            log.info(f"Fila insertada — device={row['device_id']}")

    except json.JSONDecodeError as e:
        mqtt_state["last_error"] = f"JSON inválido: {e}"
        log.error(f"Payload inválido: {e}")
    except Exception as e:
        mqtt_state["last_error"] = str(e)
        log.exception(f"Error procesando mensaje: {e}")


def build_mqtt_client() -> mqtt.Client:
    """Construye el cliente con TLS, credenciales y callbacks."""
    client = mqtt.Client(client_id=MQTT_CLIENT_ID, clean_session=False)
    client.tls_set(tls_version=ssl.PROTOCOL_TLS_CLIENT)
    client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
    client.on_connect    = on_connect
    client.on_disconnect = on_disconnect
    client.on_message    = on_message
    client.enable_logger(log)
    return client


def mqtt_worker():
    """
    Worker MQTT con reintentos: si connect() falla al arranque
    (broker temporalmente caído, DNS, etc.), espera y reintenta
    en lugar de tumbar todo el servicio.
    """
    backoff = 2
    while True:
        client = build_mqtt_client()
        try:
            log.info(f"Conectando a MQTT {MQTT_BROKER}:{MQTT_PORT} "
                     f"como '{MQTT_CLIENT_ID}'")
            client.connect(MQTT_BROKER, MQTT_PORT, keepalive=MQTT_KEEPALIVE)
            backoff = 2  # reset tras éxito
            client.loop_forever(retry_first_connection=True)
        except Exception as e:
            mqtt_state["connected"]  = False
            mqtt_state["last_error"] = str(e)
            log.error(f"MQTT falló: {e}. Reintentando en {backoff}s...")
            time.sleep(backoff)
            backoff = min(backoff * 2, 60)  # backoff exponencial hasta 60s


# ─────────────────────────────────────────────
# Arranque
# ─────────────────────────────────────────────
def main():
    # MQTT en hilo secundario (daemon = muere con el proceso)
    mqtt_thread = threading.Thread(target=mqtt_worker, daemon=True, name="mqtt")
    mqtt_thread.start()
    log.info("Hilo MQTT iniciado")

    # Flask en hilo principal → Render detecta el puerto y mantiene el servicio vivo
    log.info(f"Flask escuchando en 0.0.0.0:{PORT}")
    app.run(host="0.0.0.0", port=PORT, use_reloader=False)


if __name__ == "__main__":
    main()