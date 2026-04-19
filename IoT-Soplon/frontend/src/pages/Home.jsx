import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Análisis de Postura y Viento',
    description: 'Descubre exactamente cuándo tu postura te está frenando y cuánto esfuerzo estás perdiendo contra el viento.',
    icon: '🌪️',
  },
  {
    title: 'Progreso y Rutas Guardadas',
    description: 'Tu perfil almacena de forma segura tu historial de rendimiento para que tú o tu entrenador evalúen tu evolución.',
    icon: '📊',
  },
  {
    title: 'Alertas Inteligentes en Ruta',
    description: 'Recibe notificaciones inmediatas sobre ráfagas peligrosas, oportunidades de sprint o posibles caídas.',
    icon: '🔔',
  },
];

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* HERO SECTION: Atractivo y enfocado en el deportista */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black px-6 py-20 lg:py-24 shadow-2xl">
        {/* Luces de fondo */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[100px]"></div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12">
          
          {/* Texto Motivacional (Izquierda) */}
          <div className="text-center lg:col-span-7 lg:text-left z-10">
            <span className="inline-block rounded-full bg-slate-800/80 border border-slate-700 px-5 py-2 text-xs uppercase tracking-widest text-sky-400 font-bold mb-6 backdrop-blur-sm">
              Tu Ventaja Competitiva
            </span>
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl xl:text-7xl mb-6">
              Domina el viento. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-white">
                Maximiza tu energía.
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-slate-300 max-w-2xl mx-auto lg:mx-0 mb-10">
              Bienvenido a SOPLÓN. Deja de pedalear a ciegas y lleva la tecnología de un túnel de viento directamente a tu casco. Regístrate hoy y transforma tu esfuerzo en pura velocidad.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/sign-up"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.4)] transition-all hover:bg-sky-400 hover:scale-105"
              >
                Crear cuenta y empezar
              </Link>
              <Link
                to="/sign-in"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-slate-700 hover:border-slate-400"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          {/* Celular Flotante con Video Vertical (Derecha) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end z-10">
            <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] transform transition-transform hover:scale-105 duration-500">
              <div className="relative z-10 overflow-hidden rounded-[2.5rem] border-[6px] border-slate-800 bg-black shadow-2xl ring-1 ring-white/10">
                <video 
                  className="w-full h-auto aspect-[9/16] object-cover"
                  src="/Ciclista con SOPLON.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                />
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <span className="bg-black/70 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 font-bold shadow-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sincronizado en Ruta
                  </span>
                </div>
              </div>
              <div className="absolute -inset-2 -z-10 rounded-[3rem] bg-gradient-to-br from-sky-500 to-slate-800 opacity-40 blur-2xl"></div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN INTRODUCTORIA: Entrenadores y Deportistas */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-6">El secreto mejor guardado de los campeones</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-16">
            Ya seas un ciclista amateur buscando romper sus propias marcas, o un entrenador analizando el rendimiento de tu equipo, <strong>SOPLÓN</strong> traduce los datos de la carretera en una estrategia clara y fácil de leer.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
            {features.map((feature) => (
              <div 
                key={feature.title} 
                className="group rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:bg-white"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-3xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-sky-500">
                  {feature.icon}
                </div>
                <h3 className="mt-8 text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">{feature.title}</h3>
                <p className="mt-4 text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CIERRE: VIDEO FINAL, CRÉDITOS Y FOOTER (Igual a Proyecto.jsx) */}
      <section 
        className="py-24 relative bg-fixed bg-center bg-cover border-t border-slate-800"
        style={{ backgroundImage: "url('/Fondo PROYECTO.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"></div>
        
        <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-6 drop-shadow-md">Descubre SOPLÓN en acción</h2>
          <p className="text-xl text-sky-200 mb-16 font-medium">Mira cómo nuestra tecnología acompaña al deportista en el terreno real.</p>

          {/* Contenedor del video horizontal */}
          <div className="rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(14,165,233,0.3)] border-4 border-slate-700 bg-black relative group max-w-4xl mx-auto">
            <video 
              className="w-full h-auto aspect-video object-cover"
              src="/SOPLON en accion.mp4" 
              autoPlay 
              loop 
              muted 
              controls
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none"></div>
          </div>
          
          {/* NOMBRES DEL EQUIPO EN EL CIERRE */}
          <div className="mt-16 pt-10 border-t border-white/10">
            <h3 className="text-sm text-slate-400 font-bold tracking-[0.2em] uppercase mb-6">Desarrollado por el equipo SOPLÓN</h3>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-slate-200 font-medium">
              <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-full">Samuel S. Castrillón</span>
              <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-full">Juan Pablo Arenas</span>
              <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-full">David E. Alvarez</span>
              <span className="bg-white/5 border border-white/10 px-5 py-2 rounded-full">Samuel Montoya</span>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/proyecto"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-10 py-5 text-base font-bold text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all hover:bg-sky-400 hover:scale-105"
            >
              Explorar el Proyecto
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
