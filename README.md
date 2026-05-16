# Soplón — IoT Aerodynamic Dashboard

Resumen
-------
Soplón es un sistema IoT para monitoreo aerodinámico (orientado a ciclismo) que consta de tres partes principales:

- `Publisher.py`: firmware/daemon para Raspberry Pi que lee sensores y publica lecturas vía MQTT.
- `Bridge/`: servicio backend que consume mensajes MQTT y los persiste en Supabase, además expone una API REST ligera.
- `frontend/`: aplicación React (Vite) que muestra un dashboard en tiempo real con gráficos.

Estructura del repositorio y función de cada archivo
----------------------------------------------------

- `Publisher.py` — Lector y publicador MQTT (Raspberry Pi)
	- Lee sensores I2C/ADC:
		- LM75A (temperatura) vía `smbus2`.
		- MPU-6050 (IMU: acelerómetro/giroscopio) mediante la librería `mpu6050`.
		- HX710B / MPS20N0040D-S (sensor de presión diferencial) usando GPIO (pulsado bit-bang) y cálculo de offset/calibración.
	- Filtra lecturas (media filtrada, z-score, EMA) y aplica offsets de calibración.
	- Publica un JSON con `device_id`, `timestamp`, `temperature`, `pressure`, `accel_*`, `gyro_*` al broker MQTT seguro (TLS) usando `paho.mqtt.client`.
	- Variables configurables mediante `.env` (broker, puerto, topic, credenciales, intervalos, constantes de calibración).

- `Bridge/` — Servicio puente (MQTT → Supabase + API)
	- `main.py`:
		- Se conecta al broker MQTT (TLS) y se suscribe al `MQTT_TOPIC`.
		- Para cada mensaje recibido, parsea el JSON y lo inserta en la tabla `sensor_readings` de Supabase.
		- Ejecuta un servidor Flask (endpoints):
			- `GET /api/health` — estado simple.
			- `GET /api/readings` — devuelve lecturas recientes (intenta 5 minutos, si no hay datos devuelve últimos 20 registros históricos).
		- Usa variables de entorno para configuración (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `MQTT_*`, `ALLOWED_ORIGIN`, `PORT`).
	- `requirements.txt` — dependencias: `paho-mqtt`, `python-dotenv`, `flask`, `flask-cors`, `supabase`.
	- `test_publish.py` — script de prueba que publica un mensaje de ejemplo al topic MQTT (útil para pruebas locales).
	- `Procfile` (si está presente) sugiere despliegue tipo Heroku/Platform-as-a-Service para ejecutar el bridge como proceso web.

- `frontend/` — Interfaz de usuario (React + Vite)
	- `package.json` — scripts y dependencias principales:
		- `dev`, `build`, `preview` (Vite).
		- Dependencias clave: `react`, `react-dom`, `react-router-dom`, `recharts` (gráficos), `@clerk/clerk-react` (auth).
	- `README.md` — plantilla Vite/React.
	- `index.html`, `vite.config.js` — configuración de la app cliente.
	- `src/App.jsx` — inicializa rutas y proveedor de autenticación (Clerk).
	- `src/components/Navbar.jsx` — barra de navegación con enlaces y botones de sesión (`UserButton`) de Clerk.
	- `src/components/ProtectedRoute.jsx` — componente que protege rutas que requieren autenticación.
	- `src/pages/Dashboard.jsx` — vista principal con peticiones periódicas a `BRIDGE_URL` (`/api/readings`), renderiza gráficos con `recharts` (temperatura, presión, aceleración, giroscopio).
	- `src/pages/Home.jsx`, `SignInPage.jsx`, `SignUpPage.jsx` — páginas públicas y de autenticación usando Clerk.

Herramientas y servicios conectados
---------------------------------

- MQTT broker (conexión TLS): canal de telemetría entre `Publisher.py` y `Bridge`.
- Supabase: base de datos / backend como servicio donde se insertan las lecturas en la tabla `sensor_readings`.
- Clerk: proveedor de autenticación para el frontend (SSO / gestión de usuarios).
- Vite + React + Recharts: herramientas de UI y visualización en frontend.
- Flask + Flask-CORS: servidor HTTP liviano en `Bridge` para exponer endpoints consumidos por el frontend.
- Raspberry Pi hardware + sensores:
	- `mpu6050` (IMU), `LM75A` (temp), HX710B (ADC para presión diferencial), `smbus2`, `RPi.GPIO`.
- Librerías Python: `paho-mqtt` (MQTT TLS), `python-dotenv` (config via .env), `supabase` (cliente), `numpy` (filtrado), `mpu6050`.

Despliegue y ejecución (resumen rápido)
-------------------------------------

- Publisher (Raspberry Pi): configurar `.env` con credenciales MQTT y ejecutar `python Publisher.py` como servicio/daemon.
- Bridge: crear `.env` con `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `MQTT_*`, y ejecutar `python Bridge/main.py`. `Procfile` permite desplegar en plataformas que soporten Procfile.
- Frontend: en `frontend/` instalar dependencias y lanzar dev server:

```bash
cd frontend
npm install
npm run dev
```

Notas y recomendaciones
----------------------

- Asegúrate de proteger las claves (`SUPABASE_SECRET_KEY`, credenciales MQTT) y no subir `.env` al repositorio.
- Considerar agregar manejo de reconexión y backoff en `Publisher.py` y `Bridge/main.py` para robustez.
- Añadir validaciones en la inserción en Supabase para evitar filas corruptas.
- Documentar la estructura de la tabla `sensor_readings` en Supabase (tipos y columnas esperadas).


