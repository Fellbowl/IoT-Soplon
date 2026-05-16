// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      
      {/* HERO SECTION */}
      <section className="container" style={{ paddingTop: '6rem', paddingBottom: '4rem', textAlign: 'center' }}>
        <span style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
          IoT Aerodinámico Avanzado
        </span>
        <h1 style={{ fontSize: '4rem', fontWeight: '800', margin: '1rem 0', lineHeight: '1.1', letterSpacing: '-0.03em' }}>
          El que te sopla la estrategia,<br /> no el secreto.
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
          Monitoreo aerodinámico en tiempo real para ciclistas de ruta, duatletas y triatletas. 
          Descubre tu punto ciego aerodinámico y maximiza tu eficiencia en carrera.
        </p>
        <Link to="/dashboard" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
          Acceder al Dashboard
        </Link>
      </section>

      {/* MEDIA SHOWCASE (IMÁGENES Y VIDEOS) */}
      <section className="container" style={{ marginBottom: '5rem' }}>
        <div style={{ backgroundColor: '#000', borderRadius: '24px', overflow: 'hidden', aspectRatio: '16/9', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          {/* REEMPLAZA ESTE DIV POR TU ETIQUETA <video> O <img> PRINCIPAL */}
          <img 
            src="/ruta-a-tu-foto-casco.jpg" 
            alt="Prototipo de Soplón integrado en casco"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            // Si prefieres video:
            // <video autoPlay loop muted playsInline src="/tu-video-demostracion.mp4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          />
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="container" style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 className="section-title">Lleva el túnel de viento a la carretera</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <FeatureCard 
            icon="💨"
            title="Viento Relativo en Tiempo Real" 
            desc="Mide la presión dinámica frontal para calcular la velocidad exacta del viento que enfrentas mediante la ecuación de Bernoulli."
          />
          <FeatureCard 
            icon="📐"
            title="Biomecánica de Postura" 
            desc="Sensores inerciales de alta precisión (Pitch & Roll) evalúan continuamente tu posición para asegurar que te mantienes en la zona aero."
          />
          <FeatureCard 
            icon="⚡"
            title="Estrategia Inmediata" 
            desc="No revises los datos al llegar a casa. El sistema procesa la telemetría vía MQTT y te da alertas tácticas al instante."
          />
        </div>
      </section>

      {/* GALERÍA DE USO - DOS COLUMNAS */}
      <section className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center', marginBottom: '4rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Ingeniería compacta en tu casco.</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Diseñado con una topología de red centralizada usando Raspberry Pi y sensores I2C de ultra bajo consumo. Capturamos aceleración, inclinación, temperatura ambiente y presión diferencial.
          </p>
          <ul style={{ color: 'var(--text-secondary)', listStylePosition: 'inside', lineHeight: '2' }}>
            <li>Conectividad MQTT cifrada.</li>
            <li>Frecuencia de muestreo a 10 Hz.</li>
            <li>Detección de caídas e irregularidades.</li>
          </ul>
        </div>
        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '400px', backgroundColor: 'var(--bg-secondary)' }}>
           {/* REEMPLAZA CON OTRA FOTO DEL HARDWARE O ENTRENAMIENTO */}
           <img 
            src="/ruta-a-tu-foto-hardware.jpg" 
            alt="Hardware de Soplón"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </section>

    </div>
  );
}

// Componente auxiliar para las características
function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{desc}</p>
    </div>
  );
}
