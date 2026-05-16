import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Análisis de Postura y Viento',
    description: 'Descubre exactamente cuándo tu postura te está frenando y cuánto esfuerzo estás perdiendo contra el viento.',
    // Icono: Viento / Aerodinámica
    icon: (
      <svg className="w-7 h-7 text-sky-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h12M3 8h18M3 16h9M17 16h2a2 2 0 002-2v0a2 2 0 00-2-2h-2" />
      </svg>
    ),
  },
  {
    title: 'Progreso y Rutas Guardadas',
    description: 'Tu perfil almacena de forma segura tu historial de rendimiento para que tú o tu entrenador evalúen tu evolución.',
    // Icono: Gráfica / Rendimiento
    icon: (
      <svg className="w-7 h-7 text-sky-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
      </svg>
    ),
  },
  {
    title: 'Alertas Inteligentes en Ruta',
    description: 'Recibe notificaciones inmediatas sobre ráfagas peligrosas, oportunidades de sprint o posibles caídas.',
    // Icono: Campana / Alerta
    icon: (
      <svg className="w-7 h-7 text-sky-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="bg-slate-900 min-h-screen font-sans antialiased selection:bg-sky-500 selection:text-white">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 px-6 py-24 lg:py-32 border-b border-slate-800">
        {/* Orbes de luz mejorados con opacidad sutil */}
        <div className="absolute top-0 right-1/4 h-[600px] w-[600px] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12">
          
          {/* Texto Motivacional (Izquierda) */}
          <div className="text-center lg:text-left lg:col-span-7 z-10 flex flex-col justify-center">
            <div className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center rounded-full bg-slate-800/90 border border-slate-700/60 px-4 py-1.5 text-xs uppercase tracking-widest text-sky-400 font-semibold mb-6 backdrop-blur-md shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mr-2 animate-pulse"></span>
                Tu Ventaja Competitiva
              </span>
            </div>
            
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl xl:text-7xl mb-6 leading-[1.1]">
              Domina el viento. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-white">
                Maximiza tu energía.
              </span>
            </h1>
            
            <p className="text-base sm:text-lg leading-relaxed text-slate-400 max-w-2xl mx-auto lg:mx-0 mb-10 font-normal">
              Bienvenido a <span className="text-white font-semibold tracking-wider">SOPLÓN</span>. Deja de pedalear a ciegas y lleva la tecnología de un túnel de viento directamente a tu casco. Transforma cada vatio de potencia en pura velocidad.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/sign-up"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-sky-500 px-8 py-4 text-sm font-bold text-white shadow-[0_4px_20px_rgba(14,165,233,0.35)] transition-all hover:bg-sky-400 hover:-translate-y-0.5 active:translate-y-0"
              >
                Crear cuenta y empezar
              </Link>
              <Link
                to="/sign-in"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/40 px-8 py-4 text-sm font-semibold text-slate-200 backdrop-blur-md transition-all hover:bg-slate-800 hover:text-white hover:border-slate-500"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          {/* Celular Flotante (Derecha) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end z-10 w-full">
            <div className="relative w-full max-w-[280px] sm:max-w-[310px] transform transition-transform duration-700 hover:rotate-1">
              {/* Marco del Teléfono Premium */}
              <div className="relative z-10 overflow-hidden rounded-[2.75rem] border-[10px] border-slate-900 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
                <video 
                  className="w-full h-auto aspect-[9/16] object-cover opacity-90"
                  src="/Ciclista con SOPLON.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <span className="bg-slate-950/80 backdrop-blur-lg text-white text-[11px] px-3.5 py-1.5 rounded-full border border-slate-800 flex items-center gap-2 font-semibold tracking-wide shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Sincronizado en Ruta
                  </span>
                </div>
              </div>
              {/* Resplandor de fondo trasero */}
              <div className="absolute -inset-4 -z-10 rounded-[3.5rem] bg-gradient-to-tr from-sky-500/30 to-indigo-500/5 opacity-60 blur-2xl"></div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN CARACTERÍSTICAS */}
      <section className="py-28 bg-slate-950 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-5">
              El secreto mejor guardado de los campeones
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              Ya seas un ciclista amateur buscando romper sus propias marcas, o un entrenador analizando el rendimiento de tu equipo, <strong className="text-sky-400 font-semibold">SOPLÓN</strong> traduce las métricas complejas del entorno en decisiones estratégicas instantáneas.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="group relative rounded-2xl border border-slate-900 bg-slate-900/40 p-8 transition-all duration-300 hover:border-slate-800 hover:bg-slate-900/70 hover:-translate-y-1"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 transition-all duration-300 group-hover:bg-sky-500 group-hover:border-sky-400 group-hover:shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-bold text-white tracking-tight transition-colors group-hover:text-sky-400">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN VIDEO HORIZONTAL */}
      <section 
        className="py-28 relative bg-cover bg-center border-t border-slate-900"
        style={{ backgroundImage: "url('/Fondo PROYECTO.jpg')" }}
      >
        {/* Capa de optimización de contraste oscuro */}
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-[2px]"></div>
        
        <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight">Descubre SOPLÓN en acción</h2>
          <p className="text-base sm:text-lg text-sky-400/80 mb-16 max-w-xl mx-auto font-medium">Mira cómo nuestra arquitectura IoT procesa variables críticas en tiempo real.</p>

          {/* Contenedor del video horizontal estilo Cinemática */}
          <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-800 bg-slate-950 max-w-4xl mx-auto group">
            <video 
              className="w-full h-auto aspect-video object-cover opacity-95 transition-transform duration-500 group-hover:scale-[1.005]"
              src="/SOPLON en accion.mp4" 
              autoPlay 
              loop 
              muted 
              controls
              playsInline
            />
          </div>
          
          {/* CRÉDITOS DEL EQUIPO */}
          <div className="mt-20 pt-12 border-t border-slate-900">
            <h3 className="text-xs text-slate-500 font-bold tracking-[0.25em] uppercase mb-8">Desarrollado por el equipo SOPLÓN</h3>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-400">
              {['Samuel S. Castrillón', 'Juan Pablo Arenas', 'David E. Alvarez', 'Samuel Montoya'].map((name) => (
                <span key={name} className="bg-slate-900/60 border border-slate-800/80 px-4 py-2 rounded-lg backdrop-blur-sm hover:text-white hover:border-slate-700 transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/proyecto"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-10 py-4.5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(14,165,233,0.3)] transition-all hover:bg-sky-400 hover:-translate-y-0.5"
            >
              Explorar la Documentación del Proyecto
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER ACADÉMICO */}
      <footer className="py-14 bg-slate-950 border-t border-slate-900 text-slate-500 text-center text-xs">
        <div className="mx-auto max-w-6xl px-6 space-y-3">
          <p className="uppercase tracking-[0.25em] font-bold text-slate-600">
            Proyecto Académico de Ingeniería
          </p>
          <p className="text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Diseño e Implementación: <span className="text-slate-300">Fundamentos en IoT y Aplicaciones</span> <br className="hidden sm:inline" />
            <span className="text-slate-500 font-normal">Tutor: Wilder Eduardo Castellanos Hernández, PhD</span>
          </p>
          <div className="pt-2">
            <span className="font-mono bg-slate-900 border border-slate-800/60 text-slate-600 px-3 py-1 rounded-md">
              Bogotá DC, Colombia
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
