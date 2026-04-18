import React from 'react';
import { Link } from 'react-router-dom';

// Datos de variables para la tabla
const variables = [
  ['Temperatura', 'Numérica', '0-50 °C', 'LM75A'],
  ['Presión / Viento', 'Numérica', '0-150+ km/h', 'MPS20N0040D'],
  ['Biomecánica (Pitch/Roll)', 'Numérica', '-180° a 180°', 'MPU-6050'],
  ['Potencia Aerodinámica', 'Numérica', '0-2000 W', 'Calculada (Pérdida por viento)'],
  ['Magnitud G (Impactos)', 'Numérica', '0-16g', 'MPU-6050'],
  ['Eventos y Estrategia', 'Texto', 'Alertas y Correcciones', 'Algoritmo IoT / Master'],
];

// Datos de eventos para las tarjetas
const eventos = [
  { icono: '💨', titulo: 'Viento Crítico', umbral: '> 25 km/h', accion: 'Aviso: "Viento fuerte" - Sugiere postura compacta' },
  { icono: '💥', titulo: 'Detección de Caída', umbral: '> 2.7g y Pitch > 60°', accion: 'Alerta Prioritaria: "!!! CAÍDA DETECTADA !!!"' },
  { icono: '🚀', titulo: 'Notificación de Sprint', umbral: 'Aceleración X > 1.3g', accion: 'Registra alta intensidad - Motiva mantener cadencia' },
  { icono: '⚠️', titulo: 'Irregularidad / Bache', umbral: 'Magnitud > 3.0g', accion: 'Identifica vibración severa en la superficie' },
  { icono: '🚴‍♂️', titulo: 'Corrección Postura', umbral: 'Pitch > -15°', accion: 'Recomendación: "Inclínate más hacia adelante"' },
  { icono: '🎯', titulo: 'Oportunidad de Ataque', umbral: 'Viento < 5 km/h', accion: 'Notifica condiciones favorables para aumentar el ritmo' },
];

export default function Proyecto() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* 1. HERO SECTION: Impacto Visual Mejorado */}
      <section className="relative text-white py-32 overflow-hidden flex items-center min-h-[60vh]">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Fondo PROYECTO.jpg" 
            alt="Fondo Proyecto Soplón" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 text-center z-10 w-full">
          <span className="backdrop-blur-sm rounded-full bg-sky-500/30 px-5 py-2 text-sm font-bold text-sky-100 uppercase tracking-widest border border-sky-400/50 shadow-lg">
            Solución IoT para Deportistas de Alto Rendimiento
          </span>
          <h1 className="mt-8 text-6xl font-extrabold tracking-tight sm:text-8xl text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
            Proyecto SOPLÓN
          </h1>
          <p className="mt-6 text-2xl md:text-3xl italic text-sky-300 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            "El que te sopla la estrategia, no el secreto"
          </p>
          <div className="mt-12 flex justify-center gap-6">
            <Link to="/dashboard" className="rounded-full bg-sky-500 hover:bg-sky-400 px-8 py-4 text-base font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:scale-105 transition-all">
              Ver Dashboard en Vivo
            </Link>
          </div>
        </div>
      </section>

      {/* 2. QUIÉNES SOMOS & QUÉ ES LA SOLUCIÓN */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/3 flex justify-center">
              <img 
                src="/Logo SOPLON.png" 
                alt="Logo Empresa Soplón" 
                className="w-64 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">¿Quiénes somos y qué hacemos?</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                <strong>Soplón</strong> es una empresa tecnológica emergente nacida en la Pontificia Universidad Javeriana, cuyo fin principal es democratizar el acceso a la telemetría profesional en el deporte. Nos apasiona la intersección entre el alto rendimiento físico y las tecnologías de vanguardia.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Nuestro propósito es transformar datos complejos en decisiones estratégicas claras. A través de soluciones de Internet de las Cosas (IoT) accesibles, portátiles y precisas, buscamos empoderar a atletas y entrenadores para que alcancen su máximo potencial, llevando el análisis aerodinámico de un costoso túnel de viento directamente a la carretera.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-sky-500 pl-4 bg-slate-50 py-3 rounded-r-lg">
                Nuestra primera línea de desarrollo se centra en un sistema de sensores estratégicamente integrados en el casco del ciclista, que capturan variables físicas y ambientales procesándolas en tiempo real para optimizar la eficiencia energética durante la ruta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EL PROBLEMA Y EL VIDEO DEMOSTRATIVO */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">El "Punto Ciego" Aerodinámico</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Durante el desplazamiento, el deportista debe vencer la resistencia aerodinámica. El viento representa entre el <strong>70% y el 90% de la resistencia total</strong>. Esto impacta directamente el consumo de energía y la velocidad.
              </p>
              <div className="bg-red-50 border border-red-100 p-6 rounded-2xl mb-6 shadow-sm">
                <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                  <span className="text-xl">⚠️</span> El Problema Actual
                </h3>
                <p className="text-red-700 text-base leading-relaxed">
                  Los deportistas corren a ciegas: no cuentan con herramientas accesibles para medir el viento relativo en tiempo real. No saben cuándo adoptar una postura más aerodinámica, o cuándo conservar energía frente a una ráfaga frontal.
                </p>
              </div>
            </div>
            
            <div className="rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.15)] overflow-hidden bg-slate-900 border-4 border-white relative group transform hover:scale-[1.02] transition-transform duration-300">
              <video 
                className="w-full h-auto object-cover aspect-video" 
                autoPlay loop muted playsInline controls
              >
                <source src="/Prototipo SOPLON.mp4" type="video/mp4" />
                Tu navegador no soporta la etiqueta de video.
              </video>
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-white text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                PROTOTIPO EN ACCIÓN
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LA INNOVACIÓN (Comparativa de Mercado) */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Nuestra Innovación</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-3xl mx-auto">
              A diferencia de equipos costosos que solo guardan datos para revisarlos después, SOPLÓN procesa todo al instante para indicar qué hacer en el momento.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-slate-300 mb-2">Garmin / Potenciómetros</h3>
              <p className="text-base text-slate-400 mb-6">Miden dinámica de pedaleo y esfuerzo mecánico (Vatios).</p>
              <span className="inline-block bg-red-500/20 text-red-400 text-sm font-semibold px-3 py-1.5 rounded border border-red-500/30">Limitación: No miden el viento.</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-slate-300 mb-2">Velocomp / Notio</h3>
              <p className="text-base text-slate-400 mb-6">Calculan resistencia al aire y CdA.</p>
              <span className="inline-block bg-red-500/20 text-red-400 text-sm font-semibold px-3 py-1.5 rounded border border-red-500/30">Limitación: Alto costo / Análisis posterior.</span>
            </div>
            <div className="bg-sky-900/40 border border-sky-500 p-8 rounded-3xl shadow-[0_0_30px_rgba(14,165,233,0.2)] transform scale-105">
              <h3 className="text-2xl font-bold text-sky-400 mb-2">SOPLÓN (Nuestra Solución)</h3>
              <p className="text-base text-slate-300 mb-6">Integra biomecánica, variables ambientales y genera alertas en tiempo real.</p>
              <span className="inline-block bg-emerald-500/20 text-emerald-400 text-sm font-semibold px-3 py-1.5 rounded border border-emerald-500/30">Ventaja: Estratega digital de bajo costo.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTELIGENCIA DEL SISTEMA: EVENTOS Y ALERTAS */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900">Inteligencia y Detección de Eventos</h2>
            <p className="mt-4 text-lg text-slate-600">El sistema evalúa continuamente los datos para "soplar" la mejor estrategia.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventos.map((evento, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 p-8 rounded-3xl shadow-sm hover:shadow-lg hover:bg-white transition-all duration-300">
                <div className="text-4xl mb-4">{evento.icono}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{evento.titulo}</h3>
                <p className="text-xs font-mono text-sky-600 mb-4 bg-sky-100 inline-block px-3 py-1.5 rounded-md font-semibold">Condición: {evento.umbral}</p>
                <p className="text-base text-slate-600 leading-relaxed">{evento.accion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ¿CÓMO SE ESTÁ HACIENDO? (Arquitectura Técnica con Diagrama en Código) */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Ingeniería e Infraestructura IoT</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Visualización detallada de la arquitectura centralizada del sistema, mostrando el flujo de datos desde los sensores hasta la interfaz de usuario en la nube.
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-violet-500/5 blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-sky-500/5 blur-[100px]"></div>

            {/* Título interno del diagrama */}
            <h3 className="text-2xl font-extrabold text-slate-900 text-center mb-12">Topología de red Centralizada</h3>

            {/* Diagrama dibujado en JSX */}
            <div className="flex flex-col items-center w-full relative z-10">
              
              {/* Capa Superior: Entradas (Sensores) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl justify-items-center relative">
                
                {/* Columna Izquierda: MPS + HX */}
                <div className="flex flex-col items-center gap-4 w-full">
                  <div className="text-sm text-slate-500 text-center mb-1">Medición Manométrica y Dinámica</div>
                  <div className="w-full max-w-sm bg-sky-900/40 border border-sky-500 rounded-2xl shadow-md p-5 text-center">
                    <div className="text-white text-base">MPS20N0040D (Sensor Diferencial Presión)</div>
                  </div>
                  
                  {/* Línea punteada */}
                  <div className="h-6 w-0 border-l-2 border-dashed border-slate-300"></div>

                  <div className="text-sm text-slate-500 text-center mb-1">Digitalización Puente de Wheatstone</div>
                  <div className="w-full max-w-sm bg-sky-900/40 border border-sky-500 rounded-2xl shadow-md p-5 text-center">
                    <div className="text-white text-base">HX710B (Amplificador y ADC)</div>
                  </div>
                </div>

                {/* Columna Derecha: LM75 + MPU */}
                <div className="flex flex-col items-center gap-4 w-full relative">
                  <div className="text-sm text-slate-500 text-center mb-1">Medición Temperatura Ambiente</div>
                  <div className="w-full max-w-sm bg-sky-900/40 border border-sky-500 rounded-2xl shadow-md p-5 text-center">
                    <div className="text-white text-base">LM75A (Termómetro Digital)</div>
                  </div>

                  {/* Línea punteada compartida */}
                  <div className="h-6 w-full flex justify-center items-center relative">
                    <div className="w-0 border-l-2 border-dashed border-slate-300 h-full"></div>
                    <div className="absolute -bottom-2 bg-slate-50 text-slate-500 text-xs px-2 py-0.5 rounded-full border border-slate-200">Bus Compartido (I2C)</div>
                  </div>

                  <div className="text-sm text-slate-500 text-center mb-1">Detección Inercial 6 Ejes</div>
                  <div className="w-full max-w-sm bg-sky-900/40 border border-sky-500 rounded-2xl shadow-md p-5 text-center">
                    <div className="text-white text-base">MPU6050 (Acelerómetro + Giroscopio)</div>
                  </div>
                </div>
              </div>

              {/* Flechas conectores a RPi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl justify-items-center">
                {/* Conector Izquierdo */}
                <div className="w-full flex justify-center items-center h-12 relative">
                  <div className="w-0 border-l-2 border-dashed border-slate-300 h-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1 rounded-full border border-sky-200 whitespace-nowrap">
                    GPIO 5/6 (2‐Wire)
                  </div>
                  {/* Punta de flecha */}
                  <div className="absolute bottom-0 -left-1 border-r-2 border-b-2 border-slate-300 w-2 h-2 transform rotate-[135deg]"></div>
                </div>
                {/* Conector Derecho */}
                <div className="w-full flex justify-center items-center h-12 relative">
                  <div className="w-0 border-l-2 border-dashed border-slate-300 h-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-violet-50 text-violet-700 text-xs font-bold px-3 py-1 rounded-full border border-violet-200 whitespace-nowrap">
                    GPIO 2/3 (I2C)
                  </div>
                  {/* Punta de flecha */}
                  <div className="absolute bottom-0 -left-1 border-r-2 border-b-2 border-slate-300 w-2 h-2 transform rotate-[135deg]"></div>
                </div>
              </div>

              {/* Nodo Central: RPi */}
              <div className="w-full max-w-6xl p-8 bg-slate-50 border-t-4 border-l-4 border-l-violet-500 border-violet-500 rounded-[2.5rem] shadow-lg relative border border-slate-200">
                <div className="text-2xl mb-1">📟</div>
                <h4 className="font-bold text-slate-900 text-lg mb-6">Raspberry Pi 3 B+ (Nodo Máster)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start relative">
                  {/* Gestión de procesos central */}
                  <div className="md:col-span-2 flex flex-col items-center gap-4 relative">
                    <div className="text-sm text-slate-500 text-center mb-1">Gestión de Procesos</div>
                    <div className="w-full max-w-sm bg-sky-900/40 border border-sky-500 rounded-2xl shadow-md p-5 text-center relative z-10">
                      <div className="text-white text-base">publisher.py</div>
                    </div>
                    {/* Flecha a Paho-MQTT */}
                    <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-sky-300 text-xl z-0 hidden md:block">▶</div>
                    <div className="h-6 border-l-2 border-dashed border-slate-300 md:hidden"></div>
                    <div className="absolute -bottom-4 text-sky-300 text-xl transform rotate-90 md:hidden z-0">▶</div>
                  </div>

                  {/* Bloques de lógica internos */}
                  <div className="md:col-span-3 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-amber-200 rounded-xl shadow-inner text-center">
                      <div className="font-semibold text-amber-900 text-xs font-mono">driver_mps.py</div>
                    </div>
                    <div className="p-4 bg-white border border-fuchsia-200 rounded-xl shadow-inner text-center">
                      <div className="font-semibold text-fuchsia-900 text-xs font-mono">Calculo Bernoulli (Viento)</div>
                    </div>
                    <div className="p-4 bg-white border border-blue-200 rounded-xl shadow-inner text-center">
                      <div className="font-semibold text-blue-900 text-xs font-mono"> filtrado.py</div>
                    </div>
                    <div className="p-4 bg-white border border-rose-200 rounded-xl shadow-inner text-center">
                      <div className="font-semibold text-rose-900 text-xs font-mono"> Estrategia Soplada (Alertas)</div>
                    </div>
                    <div className="p-4 bg-white border border-blue-200 rounded-xl shadow-inner text-center">
                      <div className="font-semibold text-blue-900 text-xs font-mono"> driver_mpu.py</div>
                    </div>
                    <div className="p-4 bg-white border border-rose-200 rounded-xl shadow-inner text-center">
                      <div className="font-semibold text-rose-900 text-xs font-mono">estrategia.py</div>
                    </div>
                    <div className="p-4 bg-white border border-teal-200 rounded-xl shadow-inner text-center col-span-2">
                      <div className="font-semibold text-teal-900 text-xs font-mono hover:text-sky-500 transition-colors">Almacenamiento Local CSV</div>
                    </div>
                  </div>

                  {/* L-shaped dashed arrows connection to Paho-MQTT */}
                  <div className="absolute top-1/2 -right-6 transform -translate-y-1/2 hidden md:block z-0">
                    <div className="w-10 border-t-2 border-dashed border-slate-300 relative">
                        <div className="absolute top-1/2 -right-1 text-slate-300 text-lg transform -translate-y-1/2">▶</div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Flechas conectores salidas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl justify-items-center h-12 relative mt-12 mb-12">
                {/* Conector Local CSV */}
                <div className="w-full flex justify-center items-center h-full relative">
                  <div className="w-0 border-l-2 border-dashed border-slate-300 h-full relative">
                    <div className="absolute top-0 -left-1 border-t-2 border-l-2 border-slate-300 w-2 h-2 transform rotate-45"></div>
                  </div>
                </div>
                {/* Conector Alertas */}
                <div className="w-full flex justify-center items-center h-full relative">
                   <div className="w-0 border-l-2 border-dashed border-slate-300 h-full relative">
                    <div className="absolute top-0 -left-1 border-t-2 border-l-2 border-slate-300 w-2 h-2 transform rotate-45"></div>
                  </div>
                </div>
                {/* Conector Paho-MQTT */}
                <div className="w-full flex justify-center items-center h-full relative">
                   <div className="w-0 border-l-2 border-dashed border-slate-300 h-full relative">
                    <div className="absolute top-0 -left-1 border-t-2 border-l-2 border-slate-300 w-2 h-2 transform rotate-45"></div>
                  </div>
                </div>
              </div>

              {/* Capa Inferior: Salidas Locales, Estrategia, MQTT */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl justify-items-center items-start">
                {/* Local CSV */}
                <div className="flex flex-col items-center gap-4 w-full text-center">
                  <div className="text-sm text-slate-500 text-center mb-1">Respaldo y Depuración de Datos Local</div>
                  <div className="w-full bg-slate-50/50 border-t-4 border-teal-500 rounded-2xl shadow-md p-5 text-center border border-slate-200 transition hover:border-teal-300">
                    <div className="text-2xl mb-1">📂</div>
                    <h4 className="font-semibold text-slate-900 text-lg">Almacenamiento Local CSV</h4>
                  </div>
                </div>

                {/* Estrategia Soplada */}
                <div className="flex flex-col items-center gap-4 w-full text-center">
                  <div className="text-sm text-slate-500 text-center mb-1">Alertas y Recomendaciones en Campo</div>
                  <div className="w-full bg-slate-50/50 border-t-4 border-rose-500 rounded-2xl shadow-md p-5 text-center border border-slate-200 transition hover:border-rose-300">
                    <div className="text-2xl mb-1">💡</div>
                    <h4 className="font-semibold text-slate-900 text-lg">Estrategia Soplada (Alertas)</h4>
                  </div>
                </div>

                {/* MQTT Client */}
                <div className="flex flex-col items-center gap-4 w-full text-center">
                  <div className="text-sm text-slate-500 text-center mb-1">Publicación JSON de Métricas Procesadas</div>
                  <div className="w-full bg-sky-900/40 border border-sky-500 rounded-2xl shadow-md p-5 text-center">
                    <div className="text-white text-lg">Cliente MQTT (Paho-MQTT)</div>
                  </div>
                </div>
              </div>

              {/* Conector MQTT a Cloud */}
              <div className="w-full flex flex-col sm:flex-row items-center justify-center h-16 relative mt-16 mb-16">
                 {/* Flecha horizontal interna */}
                  <div className="hidden sm:flex items-center text-slate-300">
                    <div className="w-6 h-0 border-t-2 border-slate-300 relative z-0">
                        <div className="absolute top-1/2 -right-1 text-slate-300 text-lg transform -translate-y-1/2">▶</div>
                    </div>
                  </div>
                  <div className="flex sm:hidden h-6 border-l-2 border-slate-300 items-center justify-center">
                    <span className="text-xl text-slate-300 transform rotate-90 -mb-4">▶</span>
                  </div>
              </div>

              {/* HiveMQ Cloud & Dashboard UI (En la misma fila) */}
              <div className="w-full max-w-md flex flex-col sm:flex-row items-center justify-center gap-12 relative z-10 border border-slate-200 rounded-[2.5rem] bg-slate-900/40 p-12">
                  <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]"></div>
                  <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[100px]"></div>

                  <div className="w-full sm:w-1/2 bg-slate-800 border-t-4 border-blue-500 rounded-2xl shadow-md p-5 text-center border border-slate-700 transition hover:border-blue-400">
                    <div className="text-3xl mb-1">☁️</div>
                    <h4 className="font-bold text-white text-lg">HiveMQ Cloud (Broker MQTT)</h4>
                  </div>

                  <div className="text-3xl font-bold text-sky-400 transform sm:rotate-0 rotate-90">→</div>

                  <div className="w-full sm:w-1/2 bg-slate-800 border-t-4 border-emerald-500 rounded-2xl shadow-md p-5 text-center border border-slate-700 transition hover:border-emerald-400">
                    <div className="text-3xl mb-1">📱💻</div>
                    <div className="text-sm text-slate-500 text-center mb-1">Visualización Remota en Tiempo Real</div>
                    <h4 className="font-bold text-white text-lg">Dashboard (Interfaz de Usuario React)</h4>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TABLA DE VARIABLES (Anexo técnico) */}
      <section className="py-24 bg-slate-900 text-white border-t border-slate-800 relative">
         <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-500/5 blur-[100px]"></div>
         <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-emerald-500/5 blur-[100px]"></div>
        <div className="mx-auto max-w-5xl px-6 relative z-10">
          <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Resumen de Entidades del Sistema</h2>
          <p className="text-lg text-slate-400 text-center mb-12 max-w-3xl mx-auto leading-relaxed">Definición de las variables físicas y lógicas que interactúan dentro del ecosistema IoT de SOPLÓN.</p>
          
          <div className="overflow-hidden rounded-2xl border border-slate-700 shadow-lg bg-slate-800 relative">
            <table className="w-full text-left text-sm relative z-10">
              <thead className="bg-black text-slate-300">
                <tr>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-sm">Variable</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-sm">Tipo</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-sm">Rango / Lógica</th>
                  <th className="px-6 py-4 font-semibold uppercase tracking-wider text-sm">Sensor / Origen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700 bg-slate-800">
                {variables.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{row[0]}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="bg-slate-700 px-2 py-1 rounded text-xs font-medium text-slate-300">{row[1]}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 leading-relaxed">{row[2]}</td>
                    <td className="px-6 py-4 text-sky-600 font-mono text-xs">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER ACADÉMICO */}
      <footer className="py-12 bg-black text-slate-600 text-center border-t border-slate-800 relative">
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <p className="uppercase tracking-[0.2em] text-xs font-bold mb-4 text-slate-500">
            Pontificia Universidad Javeriana - Facultad de Ingeniería
          </p>
          <p className="text-sm italic">
            Proyecto: Fundamentos en IoT y aplicaciones • Tutor: Wilder Eduardo Castellanos Hernández, PhD
          </p>
           <p className="mt-4 text-xs font-mono">06 – 03 – 2026 • Bogotá DC, Colombia</p>
        </div>
      </footer>
    </div>
  );
}
