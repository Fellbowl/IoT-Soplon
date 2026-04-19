# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IoT-Soplon is an IoT telemetry platform with:
- **Frontend**: React + Vite + TailwindCSS dashboard with Clerk authentication
- **Bridge**: Python Flask service that ingests MQTT telemetry and serves API data from InfluxDB

## Architecture

```
IoT Device → MQTT Broker → Bridge (Flask + MQTT + InfluxDB) → Frontend (React)
```

**Data flow**:
1. Devices publish JSON telemetry to MQTT broker
2. Bridge subscribes, parses payloads, writes to InfluxDB Cloud
3. Frontend polls `GET /api/readings` every 2 seconds for dashboard visualization

## Commands

### Frontend
```bash
cd IoT-Soplon/frontend
npm run dev      # Start Vite dev server (port 4173)
npm run build    # Production build
npm run preview  # Preview production build
```

### Bridge
```bash
cd IoT-Soplon/bridge
pip install -r requirements.txt
python main.py   # Start Flask API + MQTT listener
```

## Environment Variables

### Frontend (`IoT-Soplon/frontend/.env`)
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk auth (required)
- `VITE_BRIDGE_URL` - Bridge API URL for telemetry fetches

### Bridge (`IoT-Soplon/bridge/.env`)
- `MQTT_BROKER_URL` - MQTT broker connection (e.g., `mqtt://broker.hivemq.com:1883`)
- `MQTT_TOPIC` - Topic to subscribe (default: `iot/sensor/readings`)
- `INFLUX_URL`, `INFLUX_TOKEN`, `INFLUX_ORG`, `INFLUX_BUCKET` - InfluxDB Cloud config
- `PORT` - Flask server port (default: 5000)
- `ALLOWED_ORIGIN` - CORS allowed origin

## Key Files

| File | Purpose |
|------|---------|
| `frontend/src/App.jsx` | React Router + ClerkProvider setup, protected routes |
| `frontend/src/pages/Dashboard.jsx` | Polls bridge API, renders Recharts visualizations |
| `frontend/src/components/ProtectedRoute.jsx` | Auth guard redirecting to `/sign-in` |
| `bridge/main.py` | MQTT ingestion, InfluxDB writes, `/api/readings` endpoint |

## Deployment

- **Frontend**: Vercel (see `frontend/vercel.json` for SPA rewrites)
- **Bridge**: Railway (see `bridge/railway.toml` with `/api/health` healthcheck)

## API Contract

**GET `/api/readings`** returns:
```json
[
  { "time": "ISO8601", "field": "temperature", "value": 25.4 }
]
```

Fields: `temperature`, `pressure`, `accel_x/y/z`, `gyro_x/y/z`
