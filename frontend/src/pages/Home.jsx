// src/pages/Home.jsx
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Viento Relativo Real',
    description: 'Mide la presión dinámica frontal para calcular la velocidad exacta del viento utilizando la ecuación de Bernoulli.',
    icon: '💨',
  },
  {
    title: 'Biomecánica de Postura',
    description: 'Sensores MPU6050 evalúan el Pitch y Roll para garantizar que te mantienes en tu zona de máxima eficiencia aerodinámica.',
    icon: '📐',
  },
  {
    title: 'Alertas Inteligentes',
    description: 'Recibe notificaciones inmediatas sobre ráfagas peligrosas, oportunidades de sprint o recomendaciones de postura.',
    icon: '⚡',
  },
  {
    title: 'Seguridad en Ruta',
    description: 'El sistema detecta irregularidades severas en el terreno y caídas inminentes gracias a la medición de magnitudes de fuerza G.',
    icon: '🛡️',
  }
];

const sensors = [
  {
    name: 'Presión Diferencial',
    model: 'MPS20N0040D + HX710B',
    desc: 'Captura la presión del viento (-10 a 10 kPa) mediante protocolo serial para calcular la velocidad relativa.'
  },
  {
    name: 'Sensor Inercial IMU',
    model: 'MPU6050 (MEMS)',
    desc: 'Combina acelerómetro triaxial y giroscopio (I2C) para detectar la inclinación del casco y estabilidad.'
  },
  {
    name: 'Temperatura Ambiente',
    model: 'LM75A/B',
    desc: 'Termómetro digital (I2C) para ajustar la densidad del aire en los cálculos aerodinámicos en tiempo real.'
  }
];

export default function Home() {
  return (
    <div style={{ paddingBottom: '2rem' }}>
      
      {/* HERO SECTION - DOS COLUMNAS */}
      <section className="container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '4rem', 
        alignItems: 'center', 
        paddingTop: '5rem', 
        paddingBottom: '5rem' 
      }}>
        {/* Lado Izquierdo: Textos */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <img src="/Logo SOPLON.png" alt="Logo SOPLON" style={{ height: '40px', objectFit: 'contain' }} />
            <span style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
              El que te sopla la estrategia
            </span>
          </div>
          
          <h1 style={{ fontSize: '3.8rem', fontWeight: '800', margin: '0 0 1.5rem 0', lineHeight: '1.1', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Domina el viento.<br />
            <span style={{ color: 'var(--text-secondary)' }}>Maximiza tu energía.</span>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', margin: '0 0 2.5rem 0', lineHeight: '1.6' }}>
            El 70% al 90% de tu resistencia total es aerodinámica. SOPLÓN elimina tu "punto ciego" llevando la tecnología de un túnel de viento directamente a tu casco mediante IoT.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/sign-up" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', backgroundColor: 'var(--accent)', color: '#fff' }}>
              Empezar ahora
            </Link>
            <Link to="/sign-in" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem', backgroundColor: '#fff', color: 'var(--text-primary)', border: '1px solid var(--border)' }}>
              Iniciar sesión
            </Link>
          </div>
        </div>

        {/* Lado Derecho: Celular/Video Vertical */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100%', 
            maxWidth: '300px', 
            borderRadius: '40px', 
            overflow: 'hidden', 
            border: '8px solid var(--text-primary)', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            backgroundColor: '#000',
            position: 'relative'
          }}>
            <video 
              src="/Ciclista con SOPLON.mp4" 
              autoPlay loop muted playsInline 
              style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '9/16', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <span style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                🟢 Telemetría en Ruta
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: EL PROBLEMA (PUNTO CIEGO) Y FEATURES */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto' }}>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.9rem' }}>
            El Desafío Aerodinámico
          </span>
          <h2 className="section-title" style={{ marginTop: '0.5rem' }}>El secreto mejor guardado de los campeones</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            En la actualidad, los deportistas pedalean a ciegas contra el viento relativo. A diferencia de otros equipos que solo guardan datos para análisis posterior, <strong>SOPLÓN</strong> procesa todo al instante para indicarte cuándo adoptar una postura compacta o cuándo aprovechar una oportunidad de ataque.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {features.map((feature, idx) => (
            <FeatureCard 
              key={idx}
              icon={feature.icon}
              title={feature.title} 
              desc={feature.description}
            />
          ))}
        </div>
      </section>

      {/* SECCIÓN HARDWARE E IOT - DOS COLUMNAS */}
      <section className="container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '4rem', 
        alignItems: 'center', 
        marginBottom: '6rem',
        paddingTop: '4rem',
        borderTop: '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Video del prototipo */}
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
            <video 
              src="/Prototipo SOPLON.mp4" 
              autoPlay loop muted playsInline 
              style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
            />
          </div>
          {/* Imagen de uso */}
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
            <img 
              src="/Uso SOPLON.jpg" 
              alt="Ciclista usando SOPLON" 
              style={{ width: '100%', height: '220px', display: 'block', objectFit: 'cover' }}
            />
          </div>
        </div>

        <div>
          <span style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            Arquitectura Centralizada
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0 1.5rem 0', lineHeight: '1.2' }}>
            Ingeniería embebida de bajo consumo
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
            SOPLÓN utiliza una Raspberry Pi 3 B+ como nodo maestro (Master) conectada a un ecosistema de sensores a través de protocolos de bajo consumo energético (I2C y Serial de dos hilos).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sensors.map((sensor, idx) => (
              <div key={idx} style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem 1.5rem', borderRadius: '12px', borderLeft: '4px solid var(--accent)' }}>
                <h4 style={{ margin: '0 0 0.2rem 0', color: 'var(--text-primary)', fontSize: '1rem' }}>{sensor.name} <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 'normal' }}>| {sensor.model}</span></h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{sensor.desc}</p>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#111827', color: '#fff', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>MQTT Protocol</span>
            <span style={{ backgroundColor: '#111827', color: '#fff', padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold' }}>10 Hz Sampling</span>
          </div>
        </div>
      </section>

      {/* MEDIA SHOWCASE EN ACCIÓN */}
      <section className="container" style={{ marginBottom: '6rem', textAlign: 'center' }}>
        <span style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
          La Innovación
        </span>
        <h2 className="section-title" style={{ marginTop: '0.5rem' }}>Túnel de viento en tu Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto 3rem auto', lineHeight: '1.6' }}>
          Procesamos las variables en tiempo real. Estimamos la pérdida de potencia aerodinámica, aplicamos filtros de media exponencial (EMA) para evitar lecturas erráticas por baches, y visualizamos todo para ti.
        </p>

        {/* Video Principal Horizontal */}
        <div style={{ 
          backgroundColor: '#000', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          aspectRatio: '16/9', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          maxWidth: '1000px',
          margin: '0 auto',
          border: '1px solid var(--border)'
        }}>
          <video 
            src="/SOPLON en accion.mp4" 
            autoPlay loop muted playsInline controls
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        <div style={{ marginTop: '3rem' }}>
          <Link to="/dashboard" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}>
            Explorar el Dashboard Interactivo
          </Link>
        </div>
      </section>

      {/* FOOTER Y CRÉDITOS */}
      <footer style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        padding: '4rem 2rem', 
        textAlign: 'center',
        borderTop: '1px solid var(--border)' 
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img src="/Logo SOPLON.png" alt="SOPLON" style={{ height: '50px', marginBottom: '2rem', filter: 'grayscale(100%)', opacity: 0.5 }} />
          
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Desarrollado por el equipo
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <Badge text="Samuel S. Castrillón" />
            <Badge text="Juan Pablo Arenas" />
            <Badge text="David E. Alvarez" />
            <Badge text="Samuel Montoya" />
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Proyecto Académico de Ingeniería Electrónica
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
            Pontificia Universidad Javeriana • Fundamentos en IoT y Aplicaciones<br/>
            Tutor: Wilder Eduardo Castellanos Hernández, PhD
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1.5rem', fontFamily: 'monospace' }}>
            Bogotá DC, Colombia | 2026
          </p>
        </div>
      </footer>

    </div>
  );
}

// COMPONENTES AUXILIARES

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: 'var(--bg-primary)', 
      borderRadius: '20px', 
      border: '1px solid var(--border)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'default',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.02)';
    }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem', backgroundColor: 'var(--bg-secondary)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.8rem', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0 }}>{desc}</p>
    </div>
  );
}

function Badge({ text }) {
  return (
    <span style={{ 
      backgroundColor: 'var(--bg-primary)', 
      color: 'var(--text-primary)', 
      padding: '0.5rem 1.2rem', 
      borderRadius: '9999px', 
      fontSize: '0.9rem', 
      fontWeight: '600',
      border: '1px solid var(--border)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    }}>
      {text}
    </span>
  );
}
