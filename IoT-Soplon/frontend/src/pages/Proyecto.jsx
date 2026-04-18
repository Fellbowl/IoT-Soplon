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
            Documentación Técnica
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
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900">Arquitectura y Flujo de Datos</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              SOPLÓN utiliza una infraestructura en la nube moderna y de alta disponibilidad, conectando hardware físico con interfaces web en tiempo real.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Lógica y Ecuaciones (Columna Izquierda) */}
            <div className="lg:col-span-5">
              <h3 className="text-2xl font-bold text-slate-800 mb-8">Procesamiento y Lógica</h3>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl shadow-sm">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Ecuación de Bernoulli</h4>
                    <p className="text-base text-slate-600 mt-2 leading-relaxed">Transformamos la presión diferencial (sensor MPS20N0040D) en velocidad de viento integrando la densidad del aire local.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl shadow-sm">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Biomecánica (Pitch & Roll)</h4>
                    <p className="text-base text-slate-600 mt-2 leading-relaxed">Usamos el acelerómetro triaxial del MPU6050 y trigonometría para conocer la inclinación exacta del casco.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold text-xl shadow-sm">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">Filtrado Digital EMA</h4>
                    <p className="text-base text-slate-600 mt-2 leading-relaxed">Para evitar lecturas erráticas por vibraciones o baches, implementamos un Filtro de Media Exponencial (EMA) a 10 Hz.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Diagrama de Arquitectura dibujado en JSX (Columna Derecha) */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl relative">
              <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest text-center mb-8">Deployment Map</h3>
              
              <div className="flex flex-col items-center w-full relative">
                
                {/* 1. IoT Device */}
                <div className="w-full max-w-sm bg-slate-50 border-t-4 border-sky-500 rounded-2xl shadow-md p-5 text-center relative z-10 border border-slate-200">
                  <div className="text-2xl mb-1">📟</div>
                  <h4 className="font-bold text-slate-900 text-lg">Dispositivo IoT (Casco)</h4>
                  <p className="text-sm text-slate-500 mt-1 font-mono">Raspberry Pi 3 B+ | Sensores</p>
                </div>

                {/* Flecha: Publish */}
                <div className="h-12 w-0 border-l-2 border-dashed border-slate-300 flex items-center justify-center relative z-0">
                  <div className="absolute left-4 bg-sky-50 text-sky-700 text-xs font-bold px-3 py-1 rounded-full border border-sky-200 whitespace-nowrap">
                    MQTT Publish
                  </div>
                </div>

                {/* 2. Broker */}
                <div className="w-full max-w-sm bg-slate-50 border-t-4 border-violet-500 rounded-2xl shadow-md p-5 text-center relative z-10 border border-slate-200">
                  <div className="text-2xl mb-1">☁️</div>
                  <h4 className="font-bold text-slate-900 text-lg">Broker MQTT</h4>
                  <p className="text-sm text-slate-500 mt-1 font-mono">HiveMQ Cloud</p>
                </div>

                {/* Flecha: Subscribe */}
                <div className="h-12 w-0 border-l-2 border-dashed border-slate-300 flex items-center justify-center relative z-0">
                  <div className="absolute left-4 bg-violet-50 text-violet-700 text-xs font-bold px-3 py-1 rounded-full border border-violet-200 whitespace-nowrap">
                    MQTT Subscribe
                  </div>
                </div>

                {/* 3. Backend & DB (En la misma fila) */}
                <div className="w-full max-w-md flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                  <div className="w-full bg-slate-50 border-t-4 border-amber-500 rounded-2xl shadow-md p-5 text-center border border-slate-200">
                    <div className="text-2xl mb-1">⚙️</div>
                    <h4 className="font-bold text-slate-900 text-lg">Bridge Service</h4>
                    <p className="text-sm text-slate-500 mt-1 font-mono">Python + Flask (Railway)</p>
                  </div>
                  
                  {/* Flecha horizontal interna */}
                  <div className="hidden sm:flex items-center text-slate-300">
                    <div className="w-6 border-t-2 border-dashed border-slate-300"></div>
                    <span className="text-xl -ml-1">▶</span>
                  </div>
                  <div className="flex sm:hidden h-6 border-l-2 border-dashed border-slate-300 items-center justify-center">
                    <span className="text-xl text-slate-300 transform rotate-90 -mb-4">▶</span>
                  </div>

                  <div className="w-full sm:w-48 bg-slate-50 border-t-4 border-rose-500 rounded-2xl shadow-md p-5 text-center border border-slate-200">
                    <div className="text-2xl mb-1">🗄️</div>
                    <h4 className="font-bold text-slate-900 text-base">Time-Series DB</h4>
                    <p className="text-sm text-slate-500 mt-1 font-mono">InfluxDB</p>
                  </div>
                </div>

                {/* Flecha: GET API */}
                <div className="h-12 w-0 border-l-2 border-dashed border-slate-300 flex items-center justify-center relative z-0">
                  <div className="absolute right-4 bg-amber-50 text-amber-700 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 whitespace-nowrap">
                    GET /api/readings
                  </div>
                </div>

                {/* 4. Frontend & Auth (En la misma fila) */}
                <div className="w-full max-w-md flex flex-col sm:flex-row-reverse items-center justify-center gap-4 relative z-10">
                  <div className="w-full bg-slate-50 border-t-4 border-emerald-500 rounded-2xl shadow-md p-5 text-center border border-slate-200">
                    <div className="text-2xl mb-1">💻</div>
                    <h4 className="font-bold text-slate-900 text-lg">React App</h4>
                    <p className="text-sm text-slate-500 mt-1 font-mono">Vercel (Dashboard)</p>
                  </div>
                  
                  {/* Flecha horizontal interna (Auth provee a React) */}
                  <div className="hidden sm:flex items-center text-slate-300">
                    <span className="text-xl -mr-1">◀</span>
                    <div className="w-6 border-t-2 border-dashed border-slate-300"></div>
                  </div>
                  <div className="flex sm:hidden h-6 border-l-2 border-dashed border-slate-300 items-center justify-center">
                    <span className="text-xl text-slate-300 transform -rotate-90 -mb-4">▶</span>
                  </div>

                  <div className="w-full sm:w-48 bg-slate-50 border-t-4 border-blue-500 rounded-2xl shadow-md p-5 text-center border border-slate-200">
                    <div className="text-2xl mb-1">🔐</div>
                    <h4 className="font-bold text-slate-900 text-base">Auth</h4>
                    <p className="text-sm text-slate-500 mt-1 font-mono">Clerk</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. TABLA DE VARIABLES (Anexo técnico) */}
      <section className="py-24 bg-slate-900 text-white border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">Entidades del Sistema (Métricas)</h2>
          <div className="overflow-x-auto rounded-3xl border border-slate-700 shadow-2xl bg-slate-800">
            <table className="w-full text-left text-base">
              <thead className="bg-black/40 text-slate-300">
                <tr>
                  <th className="px-8 py-5 font-bold uppercase tracking-wider text-sm">Variable</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-wider text-sm">Tipo</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-wider text-sm">Rango / Lógica</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-wider text-sm">Sensor / Origen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {variables.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-8 py-5 font-semibold text-white">{row[0]}</td>
                    <td className="px-8 py-5">
                      <span className="bg-slate-700/50 border border-slate-600 px-3 py-1 rounded-md text-xs font-medium text-slate-300">{row[1]}</span>
                    </td>
                    <td className="px-8 py-5 text-slate-400">{row[2]}</td>
                    <td className="px-8 py-5 text-sky-400 font-mono text-sm">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER ACADÉMICO */}
      <footer className="py-12 bg-black text-slate-500 text-center">
        <div className="mx-auto max-w-6xl px-6">
          <p className="uppercase tracking-[0.2em] text-xs font-bold mb-4 text-slate-600">
            Pontificia Universidad Javeriana - Facultad de Ingeniería
          </p>
          <p className="text-sm italic">
            Proyecto: Fundamentos en IoT y aplicaciones • Tutor: Wilder Eduardo Castellanos Hernández, PhD
          </p>
        </div>
      </footer>
    </div>
  );
}
