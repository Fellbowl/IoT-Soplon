import React from 'react';
import { Link } from 'react-router-dom';

// Datos extraídos del Documento Oficial
const variables = [
  ['Temperatura (temp)', 'Numérica', '0 – 50 °C', 'LM75A/B'],
  ['Presión (pressure)', 'Numérica', '-10 – 10 kPa', 'MPS20N0040D + HX710B'],
  ['Aceleración (ax, ay, az)', 'Numérica', '±2g / ±4g / ±8g / ±16g', 'MPU6050'],
  ['Giroscopio (gx, gy, gz)', 'Numérica', '±250 a ±2000 °/s', 'MPU6050'],
  ['Velocidad del viento', 'Numérica', '0 -150+ km/h (Ecuación Bernoulli)', 'Cálculo RPi'],
  ['Pitch & Roll', 'Numérica', 'Pitch: ±90° / Roll: ±180°', 'Trigonometría (MPU)'],
  ['Potencia Aerodinámica', 'Numérica', '0 – 2000W (Estimación de pérdida)', 'Cálculo RPi'],
  ['Magnitud G', 'Numérica', '0 – 16g (Suma Vectorial)', 'Cálculo RPi'],
];

const eventos = [
  { icono: '💨', titulo: 'Alerta Viento Crítico', umbral: 'Viento > 25 km/h', accion: 'Aviso: "Viento fuerte" - Sugiere postura compacta' },
  { icono: '💥', titulo: 'Detección de Caída', umbral: 'Mag > 2.7g Y Pitch > 60°', accion: 'Activa alerta prioritaria: "!!! CAIDA DETECTADA !!!"' },
  { icono: '🚀', titulo: 'Notificación Sprint', umbral: 'Acel X > 1.3g', accion: 'Registra alta intensidad - Motiva mantener cadencia' },
  { icono: '⚖️', titulo: 'Alerta Inestabilidad', umbral: 'Acel Y > 1.2g', accion: 'Notifica oscilación lateral - Sugiere línea estable' },
  { icono: '⚠️', titulo: 'Irregularidad (Bache)', umbral: 'Magnitud > 3.0g', accion: 'Identifica vibración severa en la rodadura' },
  { icono: '🚴‍♂️', titulo: 'Corrección Postura', umbral: 'Pitch > -15°', accion: 'Recomendación: "Inclínate más hacia adelante"' },
  { icono: '🎯', titulo: 'Oportunidad Ataque', umbral: 'Viento < 5 km/h', accion: 'Condiciones favorables para aumentar el ritmo' },
];

export default function Proyecto() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* 1. HERO SECTION: Portada de la Exposición */}
      <section className="relative text-white py-32 overflow-hidden flex items-center min-h-[70vh]">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Fondo PROYECTO.jpg" 
            alt="Fondo Proyecto Soplón" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 text-center z-10 w-full">
          <span className="rounded-full bg-sky-500/20 px-5 py-2 text-sm font-bold text-sky-300 uppercase tracking-widest border border-sky-400/30">
            Fundamentos en IoT y Aplicaciones
          </span>
          <h1 className="mt-8 text-6xl font-extrabold tracking-tight sm:text-8xl text-white drop-shadow-lg">
            SOPLÓN
          </h1>
          <p className="mt-6 text-2xl md:text-3xl italic text-sky-400 font-medium drop-shadow-md">
            "El que te sopla la estrategia, no el secreto"
          </p>
          
          <div className="mt-12 text-slate-300 text-sm md:text-base font-medium flex flex-wrap justify-center gap-x-8 gap-y-4">
            <p>Samuel Castrillón</p>
            <p>Juan Pablo Arenas</p>
            <p>David Alvarez</p>
            <p>Samuel Montoya</p>
          </div>
        </div>
      </section>

      {/* 2. CONTEXTO Y USUARIO OBJETIVO */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">El Contexto Deportivo</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                SOPLÓN es una solución IoT desplegada en entornos abiertos para deportes como el <strong>ciclismo de ruta, duatlón y triatlón</strong>. 
                En estos escenarios, la eficiencia no depende solo de la potencia física, sino de la capacidad del atleta para adaptarse a factores aerodinámicos (ráfagas de viento, inclinaciones) que impactan directamente su consumo energético.
              </p>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Usuario Objetivo</h3>
              <div className="flex flex-col gap-4 mt-4">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-3xl">🚴</div>
                  <p className="text-slate-700">Ciclistas amateurs avanzados, élites y triatletas que buscan maximizar eficiencia.</p>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="text-3xl">⏱️</div>
                  <p className="text-slate-700">Entrenadores y clubes de alto rendimiento que evalúan la técnica en tiempo real.</p>
                </div>
              </div>
            </div>
            
            {/* Video del prototipo a un lado */}
            <div className="rounded-[2rem] shadow-2xl overflow-hidden bg-slate-900 border-[6px] border-slate-100 relative group">
              <video 
                className="w-full h-auto object-cover aspect-video" 
                autoPlay loop muted playsInline controls
              >
                <source src="/Prototipo SOPLON.mp4" type="video/mp4" />
                Tu navegador no soporta la etiqueta de video.
              </video>
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                PROTOTIPO SOPLÓN
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EL PROBLEMA Y LA INNOVACIÓN (Punto Ciego y Comparativa) */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Efectos de luz de fondo */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-[120px]"></div>
        
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white">El "Punto Ciego" Aerodinámico</h2>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
              El viento genera entre el <strong>70% y el 90%</strong> de la resistencia total. Actualmente, los deportistas no cuentan con herramientas en tiempo real para medir el viento relativo y saber cuándo adoptar una postura aerodinámica.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-slate-300 mb-2">Garmin / Potenciómetros</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">Se enfocan en la dinámica del pedaleo y esfuerzo mecánico (Vatios), pero <strong>no analizan el ambiente ni miden el viento.</strong></p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl">
              <h3 className="text-xl font-bold text-slate-300 mb-2">Velocomp / Notio</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">Miden el coeficiente aerodinámico (CdA) y la resistencia, pero son de <strong>alto costo y se orientan a análisis posterior</strong>.</p>
            </div>
            
            {/* Destacado: La solución Soplón */}
            <div className="bg-sky-900/40 border-2 border-sky-500 p-8 rounded-3xl shadow-[0_0_30px_rgba(14,165,233,0.2)] transform scale-105">
              <h3 className="text-xl font-extrabold text-sky-400 mb-2 flex items-center gap-2">
                <span>⚡</span> La Innovación de SOPLÓN
              </h3>
              <p className="text-sm text-slate-300 mb-4 leading-relaxed">
                Eliminamos el túnel de viento llevándolo a la carretera de forma económica. <strong>SOPLÓN procesa todo al instante</strong>, funcionando como un estratega digital que entrega consejos tácticos y alertas durante el pedaleo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INTELIGENCIA Y LÓGICA (Matemáticas y Filtrado) */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-8">Procesamiento y Lógica de Cálculo</h2>
              
              <div className="space-y-6">
                {/* Bernoulli */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-sky-600 text-lg mb-2">1. Velocidad del Viento (Bernoulli)</h4>
                  <p className="text-sm text-slate-600 mb-4">Simplificamos la ecuación para flujo incompresible utilizando la presión diferencial del sensor MPS20N0040D y la densidad del aire en Bogotá (0.9 kg/m³).</p>
                  <div className="bg-slate-900 text-sky-300 p-4 rounded-xl font-mono text-center text-sm">
                    v = √( 2 · ΔP / ρ ) * 3.6  [km/h]
                  </div>
                </div>

                {/* Pitch & Roll */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-sky-600 text-lg mb-2">2. Biomecánica (Pitch & Roll)</h4>
                  <p className="text-sm text-slate-600 mb-4">Utilizando el acelerómetro triaxial (MPU6050), calculamos la orientación exacta del casco mediante funciones trigonométricas para validar la postura aerodinámica.</p>
                  <div className="bg-slate-900 text-sky-300 p-4 rounded-xl font-mono text-center text-sm flex flex-col gap-2">
                    <span>Pitch (θ) = arctan2(ax, √(ay² + az²))</span>
                    <span>Roll (∅) = arctan2(ay, √(ax² + az²))</span>
                  </div>
                </div>

                {/* Filtro EMA */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-bold text-sky-600 text-lg mb-2">3. Filtrado Digital (EMA)</h4>
                  <p className="text-sm text-slate-600 mb-4">Para evitar lecturas erráticas por baches o vibraciones, implementamos un Filtro de Media Exponencial (EMA) con α = 0.3.</p>
                  <div className="bg-slate-900 text-sky-300 p-4 rounded-xl font-mono text-center text-sm">
                    P_filtrada = (α * P_actual) + ((1 - α) * P_anterior)
                  </div>
                </div>
              </div>
            </div>

            {/* Eventos y Alertas */}
            <div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">Detección de Eventos</h3>
              <p className="text-slate-600 mb-8">El sistema evalúa estos cálculos a 10Hz para "soplar" la estrategia en tiempo real.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {eventos.map((evento, index) => (
                  <div key={index} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{evento.icono}</span>
                      <h4 className="font-bold text-slate-800 leading-tight">{evento.titulo}</h4>
                    </div>
                    <div className="mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sky-600 bg-sky-50 px-2 py-1 rounded">
                        {evento.umbral}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{evento.accion}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. ARQUITECTURA DE LA SOLUCIÓN (Usando la imagen solicitada) */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Arquitectura del Sistema</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-12">
            Topología de red centralizada. La <strong>Raspberry Pi 3 B+</strong> actúa como Nodo Máster, adquiriendo datos mediante I2C y 2-Wire, procesando la lógica localmente, y publicando vía MQTT hacia la nube.
          </p>
          
          <div className="relative inline-block rounded-[2rem] p-4 bg-slate-50 border border-slate-200 shadow-2xl">
            {/* Imagen de la arquitectura desde la carpeta public */}
            <img 
              src="/Arq SOPLON.jpeg" 
              alt="Diagrama de Arquitectura Soplón" 
              className="w-full max-w-4xl h-auto rounded-2xl object-contain"
            />
          </div>
        </div>
      </section>

      {/* 6. TABLA DE ENTIDADES (Anexo Técnico) */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-sky-500/5 blur-[100px]"></div>
        
        <div className="mx-auto max-w-5xl px-6 relative z-10">
          <h2 className="text-3xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Resumen de Entidades del Sistema
          </h2>
          <p className="text-slate-400 text-center mb-12">Variables físicas y lógicas que interactúan dentro del ecosistema IoT.</p>
          
          <div className="overflow-x-auto rounded-2xl border border-slate-700 shadow-xl bg-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/50 text-slate-300">
                <tr>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Variable</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Tipo</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Rango / Detalles</th>
                  <th className="px-6 py-5 font-bold uppercase tracking-wider text-xs">Sensor / Origen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {variables.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-white">{row[0]}</td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-700 border border-slate-600 px-2 py-1 rounded text-xs text-slate-300">{row[1]}</span>
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
      <footer className="py-12 bg-black text-slate-500 text-center">
        <div className="mx-auto max-w-6xl px-6">
          <p className="uppercase tracking-[0.2em] text-xs font-bold mb-4 text-slate-600">
            Pontificia Universidad Javeriana - Facultad de Ingeniería
          </p>
          <p className="text-sm italic">
            Proyecto: Fundamentos en IoT y Aplicaciones • Tutor: Wilder Eduardo Castellanos Hernández, PhD
          </p>
          <p className="mt-4 text-xs font-mono text-slate-700">Bogotá DC, Colombia</p>
        </div>
      </footer>
    </div>
  );
}
