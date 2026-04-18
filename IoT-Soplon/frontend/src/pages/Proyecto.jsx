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

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* 1. HERO SECTION: Impacto Visual */}
      <section className="relative bg-slate-900 text-white py-28 overflow-hidden">
        <img 
          src="/Fondo PROYECTO.jpg" 
          alt="Fondo Proyecto Soplón" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay" 
        />
        <div className="relative mx-auto max-w-6xl px-6 text-center z-10">
          <span className="rounded-full bg-sky-500/20 px-4 py-1.5 text-sm font-semibold text-sky-300 uppercase tracking-widest border border-sky-500/30">
            IoT para Alto Rendimiento Deportivo
          </span>
          <h1 className="mt-8 text-6xl font-extrabold tracking-tight sm:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 drop-shadow-lg">
            SOPLÓN
          </h1>
          <p className="mt-6 text-2xl italic text-sky-400 font-light drop-shadow-md">
            "El que te sopla la estrategia, no el secreto"
          </p>
          <div className="mt-12 flex justify-center gap-6">
            <Link to="/dashboard" className="rounded-full bg-sky-500 px-8 py-4 text-base font-bold text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 hover:scale-105 transition-all">
              Ver Dashboard en Vivo
            </Link>
          </div>
        </div>
      </section>

      {/* 2. QUIÉNES SOMOS & QUÉ ES LA SOLUCIÓN */}
      <section className="py-20 bg-slate-100 border-b border-slate-200">
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
              <h2 className="text-4xl font-bold text-slate-900 mb-6">¿Qué es SOPLÓN y Quiénes Somos?</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                <strong>SOPLÓN</strong> es una solución IoT diseñada para optimizar el desempeño en ciclismo de ruta, triatlón y deportes al aire libre. Consiste en un sistema de sensores integrados estratégicamente en el casco que capturan variables físicas y ambientales con alta precisión, procesándolas en tiempo real para facilitar la toma de decisiones.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Detrás de este proyecto estamos <strong>Samuel Castrillón, Juan Pablo Arenas, David Alvarez y Samuel Montoya</strong>; un equipo de estudiantes de Ingeniería de la Pontificia Universidad Javeriana. Nuestra meta es democratizar la telemetría profesional, llevando el análisis aerodinámico del túnel de viento directamente a la carretera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EL PROBLEMA Y EL VIDEO DEMOSTRATIVO */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">El "Punto Ciego" Aerodinámico</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                Durante el desplazamiento, el deportista debe vencer la resistencia aerodinámica. El viento representa entre el <strong>70% y el 90% de la resistencia total</strong>. Esto impacta directamente el consumo de energía y la velocidad.
              </p>
              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg mb-6">
                <h3 className="font-bold text-red-800 mb-2">El Problema Actual</h3>
                <p className="text-red-700 text-sm">
                  Los deportistas corren a ciegas: no cuentan con herramientas accesibles para medir el viento relativo en tiempo real. No saben cuándo adoptar una postura más aerodinámica, o cuándo conservar energía frente a una ráfaga frontal.
                </p>
              </div>
            </div>
            
            <div className="rounded-3xl shadow-2xl overflow-hidden bg-slate-900 border-4 border-slate-100 relative group">
              <video 
                className="w-full h-auto object-cover aspect-video" 
                autoPlay loop muted playsInline controls
              >
                <source src="/Prototipo SOPLON.mp4" type="video/mp4" />
                Tu navegador no soporta la etiqueta de video.
              </video>
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                PROTOTIPO EN ACCIÓN
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LA INNOVACIÓN (Comparativa de Mercado) */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold">Nuestra Innovación</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-3xl mx-auto">
              A diferencia de equipos costosos que solo guardan datos para revisarlos después, SOPLÓN procesa todo al instante para indicar qué hacer en el momento.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-300 mb-2">Garmin / Potenciómetros</h3>
              <p className="text-sm text-slate-400 mb-4">Miden dinámica de pedaleo y esfuerzo mecánico (Vatios).</p>
              <span className="inline-block bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded border border-red-500/30">Limitación: No miden el viento.</span>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-300 mb-2">Velocomp / Notio</h3>
              <p className="text-sm text-slate-400 mb-4">Calculan resistencia al aire y CdA.</p>
              <span className="inline-block bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded border border-red-500/30">Limitación: Alto costo / Análisis posterior.</span>
            </div>
            <div className="bg-sky-900/40 border border-sky-500 p-6 rounded-2xl shadow-[0_0_30px_rgba(14,165,233,0.2)] transform scale-105">
              <h3 className="text-xl font-bold text-sky-400 mb-2">SOPLÓN (Nuestra Solución)</h3>
              <p className="text-sm text-slate-300 mb-4">Integra biomecánica, variables ambientales y genera alertas en tiempo real.</p>
              <span className="inline-block bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/30">Ventaja: Estratega digital de bajo costo.</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTELIGENCIA DEL SISTEMA: EVENTOS Y ALERTAS */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Inteligencia y Detección de Eventos</h2>
            <p className="mt-4 text-slate-600">El sistema evalúa continuamente los datos para "soplar" la mejor estrategia.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento, index) => (
              <div key={index} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition">
                <div className="text-3xl mb-3">{evento.icono}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{evento.titulo}</h3>
                <p className="text-xs font-mono text-sky-600 mb-3 bg-sky-50 inline-block px-2 py-1 rounded">Condición: {evento.umbral}</p>
                <p className="text-sm text-slate-600">{evento.accion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ¿CÓMO SE ESTÁ HACIENDO? (Arquitectura Técnica) */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Diseño e Ingeniería del Sistema</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Detalles de Hardware y Procesamiento */}
            <div>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Procesamiento y Lógica</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">1</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Ecuación de Bernoulli</h4>
                    <p className="text-sm text-slate-600 mt-1">Transformamos la presión diferencial (sensor MPS20N0040D) en velocidad de viento integrando la densidad del aire de Bogotá.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">2</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Biomecánica (Pitch & Roll)</h4>
                    <p className="text-sm text-slate-600 mt-1">Usamos el acelerómetro triaxial del MPU6050 y funciones trigonométricas (arctan2) para saber la inclinación exacta del casco.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-bold">3</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Filtrado Digital EMA</h4>
                    <p className="text-sm text-slate-600 mt-1">Para evitar lecturas erráticas por vibraciones o baches, implementamos un Filtro de Media Exponencial (EMA) a 10 Hz.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Arquitectura de Red */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Topología Centralizada</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Capa Física (Sensores)</span>
                  <p className="font-medium text-slate-800 mt-1">Módulos I2C y 2-Wire (LM75, MPU6050, HX710B)</p>
                </div>
                <div className="text-center text-slate-400">⬇</div>
                <div className="p-4 bg-white border-l-4 border-l-violet-500 rounded-xl shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nodo Máster</span>
                  <p className="font-medium text-slate-800 mt-1">Raspberry Pi 3 B+ (Procesamiento y almacenamiento local CSV)</p>
                </div>
                <div className="text-center text-slate-400">⬇</div>
                <div className="p-4 bg-white border-l-4 border-l-sky-500 rounded-xl shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cloud & UI</span>
                  <p className="font-medium text-slate-800 mt-1">MQTT (HiveMQ) → InfluxDB → React Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TABLA DE VARIABLES (Anexo técnico) */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Resumen de Entidades del Sistema</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-700 shadow-lg bg-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/50 text-slate-300">
                <tr>
                  <th className="px-6 py-4 font-semibold">Variable</th>
                  <th className="px-6 py-4 font-semibold">Tipo</th>
                  <th className="px-6 py-4 font-semibold">Rango / Lógica</th>
                  <th className="px-6 py-4 font-semibold">Sensor / Origen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {variables.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{row[0]}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-700 px-2 py-1 rounded text-xs text-slate-300">{row[1]}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{row[2]}</td>
                    <td className="px-6 py-4 text-sky-400 font-mono text-xs">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER ACADÉMICO */}
      <footer className="py-12 bg-black text-slate-400 text-center border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-6">
          <p className="uppercase tracking-widest text-xs font-semibold mb-4 text-slate-500">
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
