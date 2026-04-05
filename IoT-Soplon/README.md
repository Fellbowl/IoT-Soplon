# IoT-Soplon

IoT-Soplon is a full-stack proof-of-concept for an IoT telemetry platform. It includes a React + Vite frontend with Clerk authentication and a Python bridge service that subscribes to MQTT topics and writes sensor data into InfluxDB Cloud.

## Architecture

```
[IoT Device] -- MQTT --> [Bridge service (Python)] -- HTTP --> [InfluxDB Cloud]
                                  |
                                  v
                               [Logging / stdout]

[User browser] -- HTTPS --> [Vercel frontend (React + Clerk)]
                                \__ fetches sensor readings via InfluxDB REST API
```

## Prerequisites

- Node.js 20+ and npm
- Python 3.11+
- A Clerk application with a publishable key
- An InfluxDB Cloud organization, bucket, and token
- An MQTT broker URL (HiveMQ, Mosquitto, or any compatible broker)

## Frontend setup

1. Open `frontend`:
   ```bash
   cd /home/juanpablo/Documents/LoginApp/IoT-Soplon/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment example:
   ```bash
   cp .env.example .env
   ```
4. Set your values in `.env`:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_INFLUX_URL`
5. Run the frontend locally:
   ```bash
   npm run dev
   ```

## Bridge service setup

1. Open `bridge`:
   ```bash
   cd /home/juanpablo/Documents/LoginApp/IoT-Soplon/bridge
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. Copy the environment example:
   ```bash
   cp .env.example .env
   ```
4. Set your values in `.env`:
   - `MQTT_BROKER_URL`
   - `MQTT_TOPIC`
   - `INFLUX_URL`
   - `INFLUX_TOKEN`
   - `INFLUX_ORG`
   - `INFLUX_BUCKET`
5. Run the bridge:
   ```bash
   python main.py
   ```

## Environment variables reference

| Variable | Description |
|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key for frontend auth | 
| `VITE_INFLUX_URL` | Full InfluxDB Cloud query endpoint | 
| `MQTT_BROKER_URL` | MQTT broker address, e.g. `mqtt://broker.hivemq.com:1883` | 
| `MQTT_TOPIC` | Topic to subscribe to for sensor payloads | 
| `INFLUX_URL` | InfluxDB Cloud base URL | 
| `INFLUX_TOKEN` | InfluxDB API token with write permission | 
| `INFLUX_ORG` | InfluxDB organization name | 
| `INFLUX_BUCKET` | InfluxDB bucket name | 

## Deployment

### Frontend (Vercel)

1. Create a Vercel project from the `frontend` directory.
2. Set environment variables in Vercel:
   - `VITE_CLERK_PUBLISHABLE_KEY`
   - `VITE_INFLUX_URL`
3. Deploy.

### Bridge service (Railway or Render)

1. Use the `bridge` directory as the deployment source.
2. Add environment variables in the service dashboard:
   - `MQTT_BROKER_URL`
   - `MQTT_TOPIC`
   - `INFLUX_URL`
   - `INFLUX_TOKEN`
   - `INFLUX_ORG`
   - `INFLUX_BUCKET`
3. Ensure the service runs with `python main.py`.

## Notes

- The frontend uses Clerk for authentication and route protection.
- The bridge service is agnostic to the MQTT broker URL and will connect to MQTT brokers configured via environment variables.
- The dashboard fetches live readings from InfluxDB Cloud and renders them in a table and line chart.
