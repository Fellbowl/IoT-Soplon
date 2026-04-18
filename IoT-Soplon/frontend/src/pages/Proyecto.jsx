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
      
      {/* 1. HERO SECTION: PORTADA DE LA EXPOSICIÓN (Imagen Nítida) */}
      <section className="relative overflow-hidden px-6 py-20 lg:py-32 shadow-2xl flex items-center min-h-[85vh]">
        <div className="absolute inset-0 z-0">
          <img 
            src="/Fondo PROYECTO.jpg" 
            alt="Ciclistas compitiendo - Soplón" 
            className="w-full h-full object-cover object-top" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900/90"></div>
        </div>

        <div className="relative mx-auto max-w-5xl text-center z-10 w-full mt-10">
          <span className="inline-block rounded-full bg-sky-500/20 border border-sky-400/50 px-5 py-2 text-xs uppercase tracking-widest text-sky-300 font-bold mb-6 backdrop-blur-md">
            Fundamentos en IoT y Aplicaciones
          </span>
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-8xl xl:text-9xl mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]">
            SOPLÓN
          </h1>
          <p className="text-2xl md:text-4xl italic leading-relaxed text-sky-300 max-w-3xl mx-auto mb-16 font-light drop-shadow-lg">
            "El que te sopla la estrategia, no el secreto"
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-200 text-sm font-semibold">
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-black/60 transition">Samuel S. Castrillón</div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-black/60 transition">Juan Pablo Arenas</div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-black/60 transition">David E. Alvarez</div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md hover:bg-black/60 transition">Samuel Montoya</div>
          </div>
          
          <div className="mt-8 text-slate-300 text-xs tracking-wider uppercase flex flex-col sm:flex-row justify-center gap-4 sm:gap-12">
            <p className="drop-shadow-md">Pontificia Universidad Javeriana</p>
            <p className="text-sky-400 font-bold drop-shadow-md">Tutor: Wilder E. Castellanos, PhD</p>
          </div>
        </div>
      </section>

      {/* 2. CONTEXTO Y USUARIO OBJETIVO */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6">El Contexto Deportivo</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                SOPLÓN se despliega en entornos abiertos (ciclismo de ruta, duatlón, triatlón) donde el deportista enfrenta ráfagas de viento y cambios de inclinación. <strong>Aquí la eficiencia no es solo potencia física</strong>, sino adaptación a factores aerodinámicos.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="text-4xl">🚴</div>
                  <div>
                    <h3 className="font-bold text-slate-900">Deportistas de Alto Rendimiento</h3>
                    <p className="text-slate-600 text-sm mt-1">Élites y amateurs avanzados que buscan maximizar su eficiencia adaptándose al viento en ruta.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                  <div className="text-4xl">⏱️</div>
                  <div>
                    <h3 className="font-bold text-slate-900">Entrenadores y Clubes</h3>
                    <p className="text-slate-600 text-sm mt-1">Requieren telemetría precisa en tiempo real para evaluar y perfeccionar la técnica de sus ciclistas.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* VIDEO: Ciclista High-Tech */}
            <div className="relative group">
              <div className="rounded-[2.5rem] overflow-hidden bg-slate-900 border-8 border-slate-100 shadow-2xl relative z-10">
                <video 
                  className="w-full h-auto object-cover aspect-video" 
                  autoPlay loop muted playsInline
                  src="/a-high-tech-cycling-helmet-with-a-small-sleek-iot-.mp4" 
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-2">
                  <span className="text-sky-400">⚡</span> VISIÓN DEL PRODUCTO
                </div>
              </div>
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-br from-sky-500/30 to-violet-500/30 blur-2xl -z-10 group-hover:blur-3xl transition-all duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EL PROBLEMA Y LA COMPETENCIA */}
      <section 
        className="py-24 relative bg-fixed bg-center bg-cover overflow-hidden" 
        style={{ backgroundImage: "url('/Fondo PROYECTO.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-sm"></div>
        
        <div className="mx-auto max-w-7xl px-6 relative z-10 text-center">
          <h2 className="text-4xl font-extrabold text-white mb-6">El "Punto Ciego" Aerodinámico</h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-16">
            El viento representa entre el <strong>70% y el 90% de la resistencia total</strong>. Actualmente los ciclistas corren a ciegas: no saben cuándo adoptar una postura más aerodinámica o conservar energía.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800 transition">
              <h3 className="text-2xl font-bold text-slate-200 mb-4">Garmin / Potenciómetros</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">Solo miden dinámica del pedaleo y esfuerzo mecánico (Vatios).</p>
              <span className="inline-block bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">No miden el viento</span>
            </div>
            
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-8 rounded-3xl hover:bg-slate-800 transition">
              <h3 className="text-2xl font-bold text-slate-200 mb-4">Velocomp / Notio</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">Calculan CdA y resistencia al aire, pero son extremadamente costosos.</p>
              <span className="inline-block bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider">Análisis posterior</span>
            </div>
            
            <div className="bg-sky-900/60 backdrop-blur-md border-2 border-sky-400 p-8 rounded-3xl shadow-[0_0_40px_rgba(14,165,233,0.3)] transform md:-translate-y-4">
              <h3 className="text-2xl font-extrabold text-white mb-4">SOPLÓN</h3>
              <p className="text-sky-100 mb-6 leading-relaxed">
                Integra biomecánica y variables ambientales. <strong>Procesa todo al instante</strong> para indicar qué hacer en el momento exacto.
              </p>
              <span className="inline-block bg-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider border border-emerald-400/50">Estratega en Tiempo Real</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LÓGICA DE CÁLCULO E INGENIERÍA */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Ingeniería y Procesamiento Digital</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-16">
            La Raspberry Pi 3 B+ procesa continuamente los datos de la capa de percepción mediante tres bloques matemáticos fundamentales.
          </p>

          <div className="grid lg:grid-cols-3 gap-8 text-left">
            <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white mb-6 group-hover:bg-sky-500 transition-colors">1</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Velocidad del Viento</h3>
              <p className="text-slate-600 mb-6">Simplificamos la ecuación de Bernoulli usando la presión del sensor MPS20N0040D y la densidad del aire local.</p>
              <div className="bg-slate-900 text-sky-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                v = √( 2 · ΔP / ρ ) * 3.6
              </div>
            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white mb-6 group-hover:bg-sky-500 transition-colors">2</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Biomecánica (MPU6050)</h3>
              <p className="text-slate-600 mb-6">Determinamos la orientación del casco mediante trigonometría para evaluar si se mantiene la postura aero.</p>
              <div className="bg-slate-900 text-sky-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 flex flex-col gap-2">
                <span>Pitch = arctan2(ax, √(ay² + az²))</span>
                <span>Roll = arctan2(ay, √(ax² + az²))</span>
              </div>
            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white mb-6 group-hover:bg-sky-500 transition-colors">3</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Filtro Exponencial (EMA)</h3>
              <p className="text-slate-600 mb-6">Filtramos lecturas erráticas por vibraciones o pedaleo de pie implementando un EMA a 10 Hz.</p>
              <div className="bg-slate-900 text-sky-400 p-4 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800">
                P_filt = (α * P_act) + ((1-α) * P_ant)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTELIGENCIA Y EVENTOS (AQUÍ VA LA NUEVA IMAGEN VERTICAL) */}
      <section className="py-24 bg-slate-100 border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Inteligencia en el Terreno</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              El algoritmo evalúa continuamente umbrales para "soplar" la mejor táctica, convirtiendo datos crudos en estrategias mientras el deportista está en acción.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* IMAGEN VERTICAL - USO SOPLON */}
            <div className="lg:col-span-4 flex justify-center relative group">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white relative z-10 w-full max-w-sm transform transition-transform duration-500 group-hover:scale-[1.02]">
                <img 
                  src="/Uso SOPLON.jpg" 
                  alt="Usuario con el casco SOPLÓN instalado" 
                  className="w-full h-auto object-cover aspect-[3/4] sm:aspect-[9/16]"
                />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <span className="bg-black/75 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold flex items-center gap-2 shadow-lg border border-white/20">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></span>
                    Lectura de Sensores Activa
                  </span>
                </div>
              </div>
              <div className="absolute -inset-2 rounded-[3rem] bg-gradient-to-br from-sky-500/30 to-violet-500/30 blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* TARJETAS DE ALERTAS */}
            <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
              {eventos.map((evento, index) => (
                <div key={index} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{evento.icono}</span>
                    <h3 className="font-bold text-slate-900 leading-tight">{evento.titulo}</h3>
                  </div>
                  <div className="mb-4">
                    <span className="text-[11px] font-mono text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md font-semibold border border-sky-100">
                      {evento.umbral}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{evento.accion}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. ARQUITECTURA DE LA SOLUCIÓN (IMAGEN) */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Arquitectura Centralizada</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed">
            Adquisición local de datos por I2C/2-Wire, procesamiento en Raspberry Pi y transmisión a la nube mediante MQTT para visualización en el Dashboard React.
          </p>
          
          <div className="relative inline-block rounded-[2.5rem] p-4 bg-slate-50 border border-slate-200 shadow-xl transition-transform duration-500 hover:scale-[1.02]">
            <img 
              src="/Arq SOPLON.jpeg" 
              alt="Diagrama de Arquitectura Soplón" 
              className="w-full max-w-4xl h-auto rounded-3xl object-contain"
            />
          </div>
        </div>
      </section>

      {/* 7. TABLA DE ENTIDADES TÉCNICAS */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-sky-500/10 blur-[100px]"></div>
        
        <div className="mx-auto max-w-6xl px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white mb-4">Entidades del Sistema</h2>
            <p className="text-slate-400">Resumen técnico de variables de entrada y salida.</p>
          </div>
          
          <div className="overflow-x-auto rounded-3xl border border-slate-700 shadow-2xl bg-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/40 text-slate-300">
                <tr>
                  <th className="px-8 py-5 font-bold uppercase tracking-wider text-xs">Variable</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-wider text-xs">Tipo</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-wider text-xs">Rango / Lógica</th>
                  <th className="px-8 py-5 font-bold uppercase tracking-wider text-xs">Sensor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {variables.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-700/40 transition-colors">
                    <td className="px-8 py-5 font-semibold text-white">{row[0]}</td>
                    <td className="px-8 py-5">
                      <span className="bg-slate-700 border border-slate-600 px-3 py-1 rounded text-xs text-slate-300">{row[1]}</span>
                    </td>
                    <td className="px-8 py-5 text-slate-300">{row[2]}</td>
                    <td className="px-8 py-5 text-sky-400 font-mono text-xs">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. VIDEO DEMOSTRATIVO FINAL (PROTOTIPO) */}
      <section 
        className="py-24 relative bg-fixed bg-center bg-cover border-t border-slate-800"
        style={{ backgroundImage: "url('/Fondo PROYECTO.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"></div>
        
        <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-6 drop-shadow-md">Prueba de Concepto (Prototipo)</h2>
          <p className="text-xl text-sky-200 mb-16 font-medium">Integración física de la Raspberry Pi y sensores en casco aerodinámico.</p>
          
          <div className="rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.3)] border-4 border-slate-700 bg-black relative group max-w-4xl mx-auto">
            <video 
              className="w-full h-auto aspect-video object-cover"
              src="/Prototipo SOPLON.mp4" 
              autoPlay loop muted controls playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none flex items-end justify-center pb-8">
              <span className="px-6 py-2 bg-black/50 backdrop-blur rounded-full text-white font-bold tracking-widest text-sm border border-white/20">
                SOPLÓN V1.0
              </span>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-10 py-5 text-base font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all hover:bg-sky-400 hover:scale-105"
            >
              Iniciar Telemetría en Vivo
            </Link>
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
