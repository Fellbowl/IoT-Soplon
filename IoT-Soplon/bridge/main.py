import json
import logging
import os
import sys
import threading
import time
from datetime import datetime
from urllib.parse import urlparse

import paho.mqtt.client as mqtt
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from influxdb_client import InfluxDBClient, Point, WritePrecision

logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s: %(message)s')

load_dotenv()

MQTT_BROKER_URL = os.getenv('MQTT_BROKER_URL')
MQTT_TOPIC = os.getenv('MQTT_TOPIC', 'iot/sensor/readings')
INFLUX_URL = os.getenv('INFLUX_URL')
INFLUX_TOKEN = os.getenv('INFLUX_TOKEN')
INFLUX_ORG = os.getenv('INFLUX_ORG')
INFLUX_BUCKET = os.getenv('INFLUX_BUCKET')
ALLOWED_ORIGIN = os.getenv('ALLOWED_ORIGIN')

if not MQTT_BROKER_URL or not INFLUX_URL or not INFLUX_TOKEN or not INFLUX_ORG or not INFLUX_BUCKET:
    logging.error(
        'Missing required environment variables. Confirm MQTT_BROKER_URL, INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, and INFLUX_BUCKET are set.'
    )
    sys.exit(1)

app = Flask(__name__)
CORS(app, origins=[ALLOWED_ORIGIN] if ALLOWED_ORIGIN else '*')


def parse_broker_url(url):
    parsed = urlparse(url)
    host = parsed.hostname or 'localhost'
    port = parsed.port or (8883 if parsed.scheme in ('mqtts', 'ssl') else 1883)
    username = parsed.username
    password = parsed.password
    use_tls = parsed.scheme in ('mqtts', 'ssl')
    return host, port, username, password, use_tls


def build_influx_client():
    return InfluxDBClient(url=INFLUX_URL, token=INFLUX_TOKEN, org=INFLUX_ORG)


def format_payload(payload):
    if isinstance(payload, dict):
        return payload
    try:
        return json.loads(payload)
    except (TypeError, ValueError):
        return {}


def create_point(data):
    device_id = str(data.get('device_id', data.get('device', 'unknown')))
    measurement = data.get('measurement', 'iot_sensor')

    point = Point(measurement).tag('device', device_id)

    METADATA_KEYS = {'device_id', 'device', 'measurement', 'timestamp'}

    for key, value in data.items():
        if key not in METADATA_KEYS:
            try:
                point = point.field(key, float(value))
            except (TypeError, ValueError):
                pass

    timestamp = data.get('timestamp')
    if timestamp:
        try:
            point = point.time(int(timestamp), WritePrecision.S)
        except (TypeError, ValueError):
            try:
                point = point.time(datetime.fromisoformat(timestamp), WritePrecision.NS)
            except ValueError:
                pass
    else:
        point = point.time(datetime.utcnow(), WritePrecision.NS)

    return point


influx_client = build_influx_client()


def query_last_readings():
    query = (
        f'from(bucket: "{INFLUX_BUCKET}") '
        f'|> range(start: -5m) '
        f'|> filter(fn: (r) => r._measurement == "iot_sensor") '
        f'|> sort(columns: ["_time"], desc: false)'
    )
    query_api = influx_client.query_api()
    readings = []

    tables = query_api.query(query, org=INFLUX_ORG)
    for table in tables:
        for record in table.records:
            record_time = record.get_time()
            readings.append(
                {
                    'time': record_time.isoformat() if hasattr(record_time, 'isoformat') else str(record_time),
                    'field': record.get_field(),
                    'value': record.get_value(),
                }
            )

    return readings


@app.route('/api/readings', methods=['GET'])
def get_readings():
    try:
        readings = query_last_readings()
        return jsonify(readings)
    except Exception as ex:
        logging.error('Failed to query readings: %s', ex)
        return jsonify({'error': 'Unable to fetch readings'}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'})


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logging.info('Connected to MQTT broker successfully.')
        client.subscribe(MQTT_TOPIC)
        logging.info('Subscribed to topic: %s', MQTT_TOPIC)
    else:
        logging.error('Failed to connect to MQTT broker, return code: %s', rc)


def on_disconnect(client, userdata, rc):
    if rc != 0:
        logging.warning('Unexpected disconnection from MQTT broker. Reconnecting...')
    else:
        logging.info('Disconnected from MQTT broker.')


def on_message(client, userdata, msg):
    message = msg.payload.decode('utf-8', errors='replace')
    logging.info('Received message on %s: %s', msg.topic, message)

    payload = format_payload(message)
    point = create_point(payload)

    try:
        influx = userdata['influx']
        write_api = influx.write_api()
        write_api.write(bucket=INFLUX_BUCKET, org=INFLUX_ORG, record=point)
        logging.info('Wrote point to InfluxDB: %s', point.to_line_protocol())
    except Exception as ex:
        logging.error('Failed to write to InfluxDB: %s', ex)


def connect_loop():
    host, port, username, password, use_tls = parse_broker_url(MQTT_BROKER_URL)

    client = mqtt.Client()
    if username and password:
        client.username_pw_set(username, password)

    if use_tls:
        client.tls_set()

    client.user_data_set({'influx': influx_client})
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_message = on_message

    while True:
        try:
            logging.info('Connecting to MQTT broker at %s:%d', host, port)
            client.connect(host, port, keepalive=60)
            client.loop_forever()
        except KeyboardInterrupt:
            logging.info('Bridge service interrupted by user.')
            break
        except Exception as ex:
            logging.error('Connection error: %s', ex)
            time.sleep(5)


def start_api_server():
    port = int(os.environ.get("PORT", 5000))
    thread = threading.Thread(
        target=lambda: app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False),
        daemon=True
    )
    thread.start()
    logging.info('Started Flask API server on port %d', port)


if __name__ == '__main__':
    logging.info('Starting MQTT bridge service...')
    start_api_server()
    connect_loop()
