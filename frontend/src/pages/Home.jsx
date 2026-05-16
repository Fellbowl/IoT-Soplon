// src/pages/Home.jsx
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
    <div style={{ paddingBottom: '2rem' }}>
      
      {/* HERO SECTION - DOS COLUMNAS */}
      <section className="container" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '4rem', 
        alignItems: 'center', 
        paddingTop: '6rem', 
        paddingBottom: '6rem' 
      }}>
        {/* Lado Izquierdo: Textos */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <img src="/Logo SOPLON.png" alt="Logo SOPLON" style={{ height: '40px', objectFit: 'contain' }} />
            <span style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
              Tu Ventaja Competitiva
            </span>
          </div>
          
          <h1 style={{ fontSize: '4rem', fontWeight: '800', margin: '0 0 1.5rem 0', lineHeight: '1.1', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Domina el viento.<br />
            <span style={{ color: 'var(--text-secondary)' }}>Maximiza tu energía.</span>
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', margin: '0 0 2.5rem 0', lineHeight: '1.6' }}>
            Bienvenido a SOPLÓN. Deja de pedalear a ciegas y lleva la tecnología de un túnel de viento directamente a tu casco. 
            Transforma tu esfuerzo en pura velocidad.
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
            {/* Etiqueta flotante sobre el video */}
            <div style={{ position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
              <span style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                🟢 Sincronizado en Ruta
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN INTRODUCTORIA Y FEATURES */}
      <section className="container" style={{ marginBottom: '6rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem auto' }}>
          <h2 className="section-title">El secreto mejor guardado de los campeones</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Ya seas un ciclista amateur buscando romper sus propias marcas, o un entrenador analizando el rendimiento de tu equipo, <strong>SOPLÓN</strong> traduce los datos de la carretera en una estrategia clara y fácil de leer.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
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
        <div>
          <span style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
            Arquitectura IoT
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0 1.5rem 0', lineHeight: '1.2' }}>
            Diseño aerodinámico e integrado
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.6' }}>
            El hardware no debe ser un obstáculo. SOPLÓN se integra de manera imperceptible en tu casco. Su red de sensores de ultra bajo consumo captura presión diferencial, temperatura y biomecánica sin añadir peso innecesario.
          </p>
          <ul style={{ color: 'var(--text-primary)', fontWeight: '600', listStyle: 'none', lineHeight: '2.5' }}>
            <li>✓ Muestreo a 10 Hz.</li>
            <li>✓ Transmisión MQTT cifrada en tiempo real.</li>
            <li>✓ Detección de baches, inclinación y caídas.</li>
          </ul>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Video del prototipo */}
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
            <video 
              src="/Prototipo SOPLON.mp4" 
              autoPlay loop muted playsInline 
              style={{ width: '100%', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
            />
          </div>
          {/* Imagen de uso (opcional, para dar más contexto visual) */}
          <div style={{ borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid var(--border)' }}>
            <img 
              src="/Uso SOPLON.jpg" 
              alt="Ciclista usando SOPLON" 
              style={{ width: '100%', height: '200px', display: 'block', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* MEDIA SHOWCASE EN ACCIÓN */}
      <section className="container" style={{ marginBottom: '6rem', textAlign: 'center' }}>
        <h2 className="section-title">Descubre SOPLÓN en acción</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
          Mira cómo nuestra tecnología proyecta dinámicamente la información para el deportista en la ruta.
        </p>

        {/* Video Principal Horizontal */}
        <div style={{ 
          backgroundColor: '#000', 
          borderRadius: '24px', 
          overflow: 'hidden', 
          aspectRatio: '16/9', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <video 
            src="/SOPLON en accion.mp4" 
            autoPlay loop muted playsInline controls
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        <div style={{ marginTop: '3rem' }}>
          <Link to="/dashboard" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}>
            Explorar el Dashboard
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
          <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '800', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            Desarrollado por el equipo SOPLÓN
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <Badge text="Samuel S. Castrillón" />
            <Badge text="Juan Pablo Arenas" />
            <Badge text="David E. Alvarez" />
            <Badge text="Samuel Montoya" />
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Proyecto Académico de Ingeniería
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
            Pontificia Universidad Javeriana • Fundamentos en IoT y Aplicaciones<br/>
            Tutor: Wilder Eduardo Castellanos Hernández, PhD
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1.5rem', fontFamily: 'monospace' }}>
            Bogotá DC, Colombia
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
      padding: '2.5rem 2rem', 
      backgroundColor: 'var(--bg-secondary)', 
      borderRadius: '20px', 
      border: '1px solid var(--border)',
      transition: 'transform 0.2s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6' }}>{desc}</p>
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
