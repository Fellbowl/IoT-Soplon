import React from 'react';
import { Link } from 'react-router-dom';

const variables = [
  ['Temperatura', 'Numérica', '0-50 °C', 'LM75A'],
  ['Presión / Viento', 'Numérica', '0-150+ km/h', 'MPS20N0040D'],
  ['Biomecánica (Pitch/Roll)', 'Numérica', '-180° a 180°', 'MPU-6050'],
  ['Potencia Aerodinámica', 'Numérica', '0-2000 W', 'Calculada'],
  ['Magnitud G (Impactos)', 'Numérica', '0-16g', 'MPU-6050'],
  ['Eventos y Estrategia', 'Texto', 'Alertas y Correcciones', 'Algoritmo IoT'],
];

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* 1. HERO SECTION: Impacto Visual y Promesa de Valor */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white py-24 overflow-hidden">
        {/* Si tienes una imagen de fondo, descomenta la siguiente línea y ponla en la carpeta public */}
        {/* <img src="/fondo_ciclismo.jpg" alt="Fondo" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" /> */}
        
        <div className="relative mx-auto max-w-6xl px-6 text-center z-10">
          <span className="rounded-full bg-sky-500/20 px-4 py-1 text-sm font-semibold text-sky-300 uppercase tracking-wider border border-sky-500/30">
            IoT para Alto Rendimiento
          </span>
          <h1 className="mt-6 text-6xl font-extrabold tracking-tight sm:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SOPLÓN
          </h1>
          <p className="mt-4 text-2xl italic text-sky-400 font-light">
            "El que te sopla la estrategia, no el secreto"
          </p>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300">
            Eliminamos el túnel de viento y lo llevamos a la carretera. Un estratega digital integrado en tu casco que procesa variables aerodinámicas al instante para indicarte qué hacer en el momento exacto.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link to="/dashboard" className="rounded-full bg-sky-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-sky-500/30 hover:bg-sky-400 hover:scale-105 transition-all">
              Ver Dashboard en Vivo
            </Link>
          </div>
        </div>
      </section>

      {/* 2. EL PROBLEMA Y LA INNOVACIÓN */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">El "Punto Ciego" Aerodinámico</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                El viento es el factor que mayor influencia ejerce sobre el rendimiento. Representa entre el <strong>70% y el 90% de la resistencia total</strong>. Sin embargo, los ciclistas corren a ciegas: no tienen datos objetivos en tiempo real para saber cuándo adoptar una postura más aerodinámica o cuándo conservar energía.
              </p>
              <h3 className="text-xl font-bold text-slate-900 mb-3">La Innovación</h3>
              <p className="text-slate-600 leading-relaxed border-l-4 border-sky-500 pl-4 bg-slate-50 p-4 rounded-r-lg">
                A diferencia de otros equipos (como Garmin o Velocomp) que cuestan miles de dólares o solo guardan datos para análisis posterior, <strong>SOPLÓN genera alertas y estrategias en tiempo real</strong> mediante un sistema embebido de bajo costo y conexión a la nube.
              </p>
            </div>
            
            {/* AQUÍ VA TU VIDEO LOCAL */}
            <div className="rounded-3xl shadow-2xl overflow-hidden bg-slate-900 border-4 border-slate-100 relative group">
              {/* Cambia "Prototipo_SOPLON.mp4" por el nombre exacto de tu archivo en la carpeta public */}
              <video 
                className="w-full h-auto object-cover aspect-video" 
                autoPlay 
                loop 
                muted 
                playsInline
                controls
              >
                <source src="/Prototipo_SOPLON.mp4" type="video/mp4" />
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

      {/* 3. USUARIO OBJETIVO */}
      <section className="py-16 bg-slate-100">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">¿Para quién está diseñado?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🚴‍♂️</div>
              <h3 className="text-xl font-bold text-slate-900">Ciclistas y Triatletas</h3>
              <p className="mt-3 text-slate-600">Aficionados avanzados y élites que buscan maximizar su eficiencia adaptándose al viento en ruta.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold text-slate-900">Entrenadores</h3>
              <p className="mt-3 text-slate-600">Directores de clubes de alto rendimiento que requieren telemetría para corregir la técnica de sus deportistas.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-slate-900">Seguridad en Ruta</h3>
              <p className="mt-3 text-slate-600">Detecta magnitudes G extremas e inclinaciones inusuales para generar alertas inmediatas de caídas o baches.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ARQUITECTURA DE INGENIERÍA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Arquitectura IoT Centralizada</h2>
            <p className="mt-4 text-slate-400">Flujo de datos de extremo a extremo: desde el hardware en el casco hasta la toma de decisiones.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative">
            {/* Linea conectora fondo (solo en desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-violet-500 to-emerald-500 -z-0 transform -translate-y-1/2 opacity-30"></div>

            {/* Nodos */}
            {[
              { titulo: "Capa Percepción", desc: "Sensores I2C/2-Wire (LM75, MPU6050, Presión)", color: "border-sky-500", bg: "bg-sky-900/30" },
              { titulo: "Nodo Máster", desc: "Raspberry Pi 3 B+ procesa EMA y Bernoulli", color: "border-violet-500", bg: "bg-violet-900/30" },
              { titulo: "Nube & Broker", desc: "MQTT via HiveMQ Cloud", color: "border-fuchsia-500", bg: "bg-fuchsia-900/30" },
              { titulo: "Backend DB", desc: "Bridge Python + InfluxDB Cloud", color: "border-amber-500", bg: "bg-amber-900/30" },
              { titulo: "Dashboard UI", desc: "React + Vercel + Clerk", color: "border-emerald-500", bg: "bg-emerald-900/30" }
            ].map((nodo, index) => (
              <div key={index} className={`relative z-10 w-full lg:w-48 bg-slate-800 rounded-xl border-t-4 ${nodo.color} ${nodo.bg} p-5 text-center shadow-2xl`}>
                <h3 className="font-bold text-sm text-white">{nodo.titulo}</h3>
                <p className="mt-2 text-xs text-slate-400">{nodo.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TABLA DE VARIABLES (Diseño Limpio) */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Variables Sensadas y Procesadas</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-lg">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">Variable</th>
                  <th className="px-6 py-4 font-semibold">Tipo</th>
                  <th className="px-6 py-4 font-semibold">Rango / Lógica</th>
                  <th className="px-6 py-4 font-semibold">Origen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {variables.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{row[0]}</td>
                    <td className="px-6 py-4 text-slate-600">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs">{row[1]}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{row[2]}</td>
                    <td className="px-6 py-4 text-sky-600 font-mono text-xs">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FOOTER ACADÉMICO */}
      <footer className="py-12 bg-slate-900 text-slate-400 text-center border-t border-slate-800">
        <div className="mx-auto max-w-6xl px-6">
          <p className="uppercase tracking-widest text-xs font-semibold mb-4 text-slate-500">
            Pontificia Universidad Javeriana - Facultad de Ingeniería
          </p>
          <p className="text-sm italic">
            Proyecto: Fundamentos en IoT y aplicaciones • Tutor: Wilder Eduardo Castellanos Hernández, PhD
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
            <span>S. Castrillón</span>
            <span>J.P. Arenas</span>
            <span>D. Alvarez</span>
            <span>S. Montoya</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
