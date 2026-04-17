# IoT-Soplon

IoT-Soplon is a full-stack IoT telemetry platform with two main parts:

- A React frontend for authentication and visualization.
- A Python bridge service that ingests MQTT telemetry and serves API data from InfluxDB.

This README is focused on project structure, file responsibilities, and exact file-to-file and service-to-service connections.

## 1) High-Level Connection Map

```text
IoT Device
    |
    | publish telemetry (MQTT)
    v
MQTT Broker
    |
    | subscribed by bridge/main.py
    v
Bridge Service (Flask + MQTT + InfluxDB client)
    |                         \
    | write telemetry          \ query recent readings
    v                           v
InfluxDB Cloud <----------- /api/readings
                                              ^
                                              |
                                              | fetch via VITE_BRIDGE_URL
                                              |
Frontend Dashboard (React)
```

## 2) Runtime Flows (What Connects With What)

### A) Telemetry ingestion flow

1. Device publishes JSON payload to MQTT topic.
2. `bridge/main.py` subscribes to `MQTT_TOPIC`.
3. MQTT callback `on_message` parses payload and creates an Influx point.
4. Bridge writes point to InfluxDB bucket.

### B) Dashboard read flow

1. User opens `/dashboard` in frontend.
2. `frontend/src/pages/Dashboard.jsx` calls `GET {VITE_BRIDGE_URL}/api/readings`.
3. Flask route in `bridge/main.py` executes Influx query.
4. Bridge returns normalized readings JSON.
5. Dashboard renders line charts and table.

### C) Authentication flow

1. `frontend/src/App.jsx` initializes `ClerkProvider`.
2. `/sign-in` and `/sign-up` render Clerk components.
3. `frontend/src/components/ProtectedRoute.jsx` checks auth.
4. Unauthenticated users are redirected to `/sign-in`.

## 3) Project Structure

```text
IoT-Soplon/
   README.md
   bridge/
      main.py
      Procfile
      railway.toml
      requirements.txt
   frontend/
      index.html
      package.json
      postcss.config.js
      tailwind.config.js
      vercel.json
      vite.config.js
      public/
         robots.txt
      src/
         App.jsx
         index.css
         main.jsx
         components/
            Navbar.jsx
            ProtectedRoute.jsx
         pages/
            Dashboard.jsx
            Home.jsx
            SignInPage.jsx
            SignUpPage.jsx
```

## 4) File-by-File Responsibility and Connections

### Root

#### `README.md`
- Purpose: Project documentation.
- Connected to: Developers only (not imported in runtime).

### Bridge service

#### `bridge/main.py`
- Purpose:
   - Loads environment variables.
   - Connects to MQTT broker.
   - Ingests MQTT telemetry and writes to InfluxDB.
   - Exposes Flask API endpoints `/api/readings` and `/api/health`.
- Direct dependencies:
   - Python libs: `paho.mqtt.client`, `flask`, `flask_cors`, `influxdb_client`, `dotenv`.
   - Env vars: `MQTT_BROKER_URL`, `MQTT_TOPIC`, `INFLUX_URL`, `INFLUX_TOKEN`, `INFLUX_ORG`, `INFLUX_BUCKET`, `PORT`, `ALLOWED_ORIGIN`.
- Runtime connections:
   - Connects to MQTT broker (subscribe).
   - Connects to InfluxDB Cloud (write + query).
   - Receives HTTP requests from frontend dashboard.
- Internal function graph:
   - `connect_loop` -> `on_connect`, `on_disconnect`, `on_message`.
   - `on_message` -> `format_payload` -> `create_point` -> Influx write API.
   - `/api/readings` route -> `query_last_readings` -> Influx query API.

#### `bridge/requirements.txt`
- Purpose: Python dependency list for bridge runtime.
- Connected to:
   - Used by pip install process.
   - Supports `bridge/main.py` imports.

#### `bridge/Procfile`
- Purpose: Process command for PaaS runtimes.
- Connected to:
   - Starts bridge with `python main.py`.

#### `bridge/railway.toml`
- Purpose: Railway deployment config.
- Connected to:
   - Uses `python main.py` as start command.
   - Uses `/api/health` from `bridge/main.py` as health check endpoint.

### Frontend base and build configuration

#### `frontend/index.html`
- Purpose: Vite HTML shell and root mount node.
- Connected to:
   - Loads `frontend/src/main.jsx` module.

#### `frontend/package.json`
- Purpose: Frontend scripts and dependency manifest.
- Connected to:
   - Scripts `dev`, `build`, `preview` run Vite.
   - Declares dependencies consumed by files in `frontend/src`.

#### `frontend/vite.config.js`
- Purpose: Vite runtime/build config and dev port.
- Connected to:
   - Used by Vite CLI from `package.json` scripts.

#### `frontend/tailwind.config.js`
- Purpose: Tailwind scan configuration.
- Connected to:
   - Scans `index.html` and `src/**/*.{js,jsx}` to generate CSS classes.

#### `frontend/postcss.config.js`
- Purpose: PostCSS plugin pipeline.
- Connected to:
   - Enables Tailwind + Autoprefixer for CSS build process.

#### `frontend/vercel.json`
- Purpose: SPA rewrite config for Vercel.
- Connected to:
   - Rewrites all routes to `index.html` so React Router paths work in production.

#### `frontend/public/robots.txt`
- Purpose: Search engine crawling policy.
- Connected to:
   - Served as static asset by Vite/Vercel.

### Frontend application source

#### `frontend/src/main.jsx`
- Purpose: React application entry point.
- Connected to:
   - Imports `App` from `frontend/src/App.jsx`.
   - Imports global styles from `frontend/src/index.css`.
   - Mounts app into `#root` from `frontend/index.html`.

#### `frontend/src/index.css`
- Purpose: Global styles and Tailwind directives.
- Connected to:
   - Included by `frontend/src/main.jsx`.
   - Processed by PostCSS + Tailwind configs.

#### `frontend/src/App.jsx`
- Purpose:
   - Creates routing tree.
   - Provides Clerk auth context with `ClerkProvider`.
   - Defines public and protected routes.
- Connected to:
   - Imports `Navbar`, `ProtectedRoute`, and all page components.
   - Uses env var `VITE_CLERK_PUBLISHABLE_KEY`.
   - Wraps `/dashboard` route with `ProtectedRoute`.

#### `frontend/src/components/Navbar.jsx`
- Purpose: Top navigation and sign out control.
- Connected to:
   - Used by `frontend/src/App.jsx`.
   - Uses Clerk hooks (`useUser`, `useClerk`) from auth context.
   - Navigates to `/`, `/dashboard`, `/sign-in`, `/sign-up`.

#### `frontend/src/components/ProtectedRoute.jsx`
- Purpose: Guard component for private routes.
- Connected to:
   - Used by `frontend/src/App.jsx` around `Dashboard` route.
   - Uses Clerk `useAuth`.
   - Redirects to `/sign-in` when user is unauthenticated.

#### `frontend/src/pages/Home.jsx`
- Purpose: Public landing page.
- Connected to:
   - Routed by `frontend/src/App.jsx` on `/`.
   - Uses `Link` to `/sign-up`.

#### `frontend/src/pages/SignInPage.jsx`
- Purpose: Sign-in page wrapper around Clerk `SignIn` component.
- Connected to:
   - Routed by `frontend/src/App.jsx` on `/sign-in/*`.

#### `frontend/src/pages/SignUpPage.jsx`
- Purpose: Sign-up page wrapper around Clerk `SignUp` component.
- Connected to:
   - Routed by `frontend/src/App.jsx` on `/sign-up/*`.

#### `frontend/src/pages/Dashboard.jsx`
- Purpose:
   - Fetches telemetry from bridge API.
   - Polls every 5 seconds.
   - Displays charts and readings table.
- Connected to:
   - Routed by `frontend/src/App.jsx` on `/dashboard` (through `ProtectedRoute`).
   - Uses Clerk `useAuth` to wait for auth initialization.
   - Calls bridge endpoint `GET {VITE_BRIDGE_URL}/api/readings`.
   - Renders charts via `recharts` components.
   - Depends on bridge route implemented in `bridge/main.py`.

## 5) Internal Connection Maps

### Frontend import/runtime map

```text
index.html
   -> src/main.jsx
         -> src/App.jsx
               -> components/Navbar.jsx
               -> components/ProtectedRoute.jsx
               -> pages/Home.jsx
               -> pages/SignInPage.jsx
               -> pages/SignUpPage.jsx
               -> pages/Dashboard.jsx
                     -> fetch(VITE_BRIDGE_URL + /api/readings)
         -> src/index.css
```

### Bridge logic/runtime map

```text
main.py
   -> load env vars
   -> build Influx client
   -> start Flask API server
         -> GET /api/health
         -> GET /api/readings -> query_last_readings -> Influx query
   -> start MQTT loop
         -> on_connect -> subscribe MQTT_TOPIC
         -> on_message -> format_payload -> create_point -> Influx write
```

## 6) Cross-Layer Contracts

### Frontend -> Bridge API contract

- Request: `GET /api/readings`
- Response: JSON array of objects with:
   - `time`
   - `field`
   - `value`

### MQTT payload -> Influx write contract

- Bridge expects JSON payload from MQTT.
- Metadata keys handled specially: `device_id`, `device`, `measurement`, `timestamp`.
- Numeric keys become Influx fields.

## 7) Environment Variables and Where They Are Used

### Frontend env vars

- `VITE_CLERK_PUBLISHABLE_KEY`
   - Used in `frontend/src/App.jsx` to initialize Clerk.
- `VITE_BRIDGE_URL`
   - Used in `frontend/src/pages/Dashboard.jsx` to call bridge API.

### Bridge env vars

- `MQTT_BROKER_URL`
   - Used in `bridge/main.py` for broker connection settings.
- `MQTT_TOPIC`
   - Used in `bridge/main.py` topic subscription.
- `INFLUX_URL`, `INFLUX_TOKEN`, `INFLUX_ORG`, `INFLUX_BUCKET`
   - Used in `bridge/main.py` for Influx client, writes, and reads.
- `PORT`
   - Used in `bridge/main.py` to run Flask server.
- `ALLOWED_ORIGIN`
   - Used in `bridge/main.py` CORS configuration.

## 8) Deployment File Connections

- Frontend deployment:
   - `frontend/vercel.json` enables SPA routing behavior in Vercel.
- Bridge deployment:
   - `bridge/Procfile` and `bridge/railway.toml` both start `bridge/main.py`.
   - `bridge/railway.toml` health check depends on `/api/health` route in `bridge/main.py`.

## 9) Practical Summary

- The frontend never talks directly to InfluxDB.
- The bridge is the integration layer between MQTT, InfluxDB, and browser clients.
- Authentication is fully managed in frontend with Clerk, and route access is enforced by `ProtectedRoute`.
