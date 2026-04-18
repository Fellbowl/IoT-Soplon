import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Acceso y Privacidad',
    description: 'Autenticación segura mediante Clerk para proteger el acceso a tus métricas de rendimiento y rutas.',
    icon: '🔒',
  },
  {
    title: 'Telemetría en Ruta',
    description: 'Captura datos del casco vía MQTT y almacénalos en InfluxDB Cloud para un análisis de series temporales sin latencia.',
    icon: '📡',
  },
  {
    title: 'Dashboard Estratégico',
    description: 'Gráficas React en tiempo real que traducen variables complejas (Pitch, Viento, Gs) en estrategias claras.',
    icon: '📈',
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 sm:py-16 lg:px-8">
      
      {/* HERO SECTION CON VIDEO VERTICAL */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-black px-6 py-16 shadow-2xl sm:px-12 lg:px-16 lg:py-20">
        
        {/* Efecto de brillo de fondo */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-500/20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-12">
          
          {/* Columna de Texto (Izquierda) */}
          <div className="text-center lg:col-span-7 lg:text-left">
            <p className="inline-block rounded-full bg-slate-800/50 border border-slate-700 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-sky-400 font-semibold mb-6 shadow-sm">
              Plataforma IoT de Alto Rendimiento
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl xl:text-6xl">
              Tu estratega digital, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200">
                ahora en tiempo real.
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300 max-w-2xl mx-auto lg:mx-0">
              SOPLÓN combina autenticación Clerk, analítica en InfluxDB y un servicio Bridge MQTT para convertir los datos crudos de tus sensores aerodinámicos en ventajas competitivas en la carretera.
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Link
                to="/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(14,165,233,0.4)] transition hover:bg-sky-400 hover:scale-105"
              >
                Comenzar ahora
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-slate-700 hover:border-slate-400"
              >
                Conoce la tecnología
              </a>
            </div>
          </div>

          {/* Columna de Video Vertical (Derecha) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px]">
              {/* Marco simulando un celular moderno */}
              <div className="relative z-10 overflow-hidden rounded-[2.5rem] border-[6px] border-slate-800 bg-slate-900 shadow-2xl ring-1 ring-white/10">
                {/* Agregamos el video vertical desde la carpeta public */}
                <video 
                  className="w-full h-auto aspect-[9/16] object-cover"
                  src="/Ciclista con SOPLON.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                />
                {/* Elementos decorativos (simulación de interfaz encima del video si lo deseas) */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <span className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Grabación en Ruta
                  </span>
                </div>
              </div>
              
              {/* Sombra proyectada del "celular" */}
              <div className="absolute -inset-1 -z-10 rounded-[3rem] bg-gradient-to-br from-sky-500 to-violet-500 opacity-30 blur-2xl"></div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN DE CARACTERÍSTICAS TÉCNICAS */}
      <section id="features" className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div 
            key={feature.title} 
            className="group relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:bg-sky-500">
              {feature.icon}
            </div>
            <h2 className="mt-6 text-xl font-bold text-slate-900">{feature.title}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </section>
      
    </div>
  );
}
