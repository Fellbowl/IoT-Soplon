// src/pages/Proyecto.jsx
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
    <div style={{ paddingBottom: '0' }}>
      
      {/* 1. HERO SECTION: PORTADA DE LA EXPOSICIÓN */}
      <section style={{ 
        position: 'relative', 
        padding: '8rem 2rem', 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'url("/Fondo PROYECTO.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        {/* Overlay oscuro para que el texto resalte */}
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(17, 24, 39, 0.85)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <span style={{ 
            display: 'inline-block', 
            backgroundColor: 'rgba(56, 189, 248, 0.1)', 
            border: '1px solid rgba(56, 189, 248, 0.3)', 
            color: '#7dd3fc', 
            padding: '0.5rem 1.5rem', 
            borderRadius: '9999px', 
            fontSize: '0.85rem', 
            fontWeight: '800', 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase', 
            marginBottom: '2rem' 
          }}>
            Fundamentos en IoT y Aplicaciones
          </span>
          
          <h1 style={{ 
            fontSize: 'clamp(4rem, 10vw, 8rem)', 
            fontWeight: '900', 
            margin: '0 0 1rem 0', 
            letterSpacing: '0.1em', 
            color: '#ffffff',
            textShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            SOPLÓN
          </h1>
          
          <p style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#bae6fd', fontStyle: 'italic', fontWeight: '300', marginBottom: '4rem' }}>
            "El que te sopla la estrategia, no el secreto"
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
            <BadgeDark text="Samuel S. Castrillón" />
            <BadgeDark text="Juan Pablo Arenas" />
            <BadgeDark text="David E. Alvarez" />
            <BadgeDark text="Samuel Montoya" />
          </div>
          
          <div style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>Proyecto Académico de Ingeniería</p>
            <p style={{ margin: 0, color: '#38bdf8' }}>Tutor: Wilder E. Castellanos, PhD</p>
          </div>
        </div>
      </section>

      {/* 2. QUIÉNES SOMOS */}
      <section className="container" style={{ padding: '6rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <img src="/Logo SOPLON.png" alt="Logo de Soplón" style={{ maxWidth: '280px', width: '100%', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }} />
          </div>
          <div>
            <span style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>
              Nuestra Identidad
            </span>
            <h2 style={{ fontSize: '3rem', fontWeight: '800', margin: '0.5rem 0 2rem 0', color: 'var(--text-primary)' }}>¿Quiénes Somos?</h2>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                <strong>SOPLÓN</strong> es una empresa tecnológica emergente nacida en un entorno académico de ingeniería, cuyo fin principal es democratizar el acceso a la telemetría profesional en el deporte. Nos apasiona la intersección entre el alto rendimiento físico y las tecnologías de vanguardia.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Nuestro propósito es transformar datos complejos en decisiones estratégicas claras. A través de soluciones de Internet de las Cosas (IoT) accesibles, portátiles y precisas, buscamos empoderar a atletas y entrenadores para que alcancen su máximo potencial.
              </p>
              <blockquote style={{ borderLeft: '4px solid var(--accent)', paddingLeft: '1.5rem', fontStyle: 'italic', backgroundColor: 'var(--bg-secondary)', padding: '1rem 1.5rem', borderRadius: '0 12px 12px 0', margin: 0 }}>
                "Llevamos el análisis aerodinámico de un costoso túnel de viento directamente a la carretera."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTEXTO Y USUARIO OBJETIVO */}
      <section className="container" style={{ padding: '6rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>El Contexto Deportivo</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
              SOPLÓN se despliega en entornos abiertos (ciclismo de ruta, duatlón, triatlón) donde el deportista enfrenta ráfagas de viento y cambios de inclinación. <strong>Aquí la eficiencia no es solo potencia física</strong>, sino adaptación a factores aerodinámicos.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <InfoBox icon="🚴" title="Deportistas de Alto Rendimiento" desc="Élites y amateurs avanzados que buscan maximizar su eficiencia adaptándose al viento en ruta." />
              <InfoBox icon="⏱️" title="Entrenadores y Clubes" desc="Requieren telemetría precisa en tiempo real para evaluar y perfeccionar la técnica de sus ciclistas." />
            </div>
          </div>
          
          <div style={{ borderRadius: '40px', overflow: 'hidden', border: '8px solid var(--text-primary)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', backgroundColor: '#000', position: 'relative' }}>
            <video src="/a-high-tech-cycling-helmet-with-a-small-sleek-iot-.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
              <span style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                ⚡ VISIÓN DEL PRODUCTO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPETENCIA */}
      <section className="container" style={{ padding: '6rem 2rem', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: 'var(--accent)', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>Estado del Arte</span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0 1.5rem 0' }}>El "Punto Ciego" Aerodinámico</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto 4rem auto', lineHeight: '1.6' }}>
          El viento representa entre el <strong>70% y el 90% de la resistencia total</strong>. Actualmente los ciclistas corren a ciegas. ¿Cómo lo resolvemos en comparación con el mercado?
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', textAlign: 'left' }}>
          <CompetitorCard title="Garmin / Potenciómetros" desc="Solo miden dinámica del pedaleo y esfuerzo mecánico (Vatios)." tag="No miden el viento" isMain={false} />
          <CompetitorCard title="Velocomp / Notio" desc="Calculan CdA y resistencia al aire, pero son extremadamente costosos." tag="Análisis posterior" isMain={false} />
          <CompetitorCard title="SOPLÓN" desc="Integra biomecánica y variables ambientales. Procesa todo al instante para indicar qué hacer en el momento exacto." tag="Estratega en Tiempo Real" isMain={true} />
        </div>
      </section>

      {/* 5. INGENIERÍA */}
      <section className="container" style={{ padding: '6rem 2rem', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1.5rem 0' }}>Ingeniería y Procesamiento Digital</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            La Raspberry Pi 3 B+ procesa continuamente los datos de la capa de percepción mediante tres bloques matemáticos fundamentales.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <MathCard step="1" title="Velocidad del Viento" desc="Simplificamos la ecuación de Bernoulli usando la presión del sensor MPS20N0040D y la densidad del aire local." formula="v = √( 2 · ΔP / ρ ) * 3.6" />
          <MathCard step="2" title="Biomecánica (MPU6050)" desc="Determinamos la orientación del casco mediante trigonometría para evaluar si se mantiene la postura aero." formula="Pitch = arctan2(ax, √(ay² + az²))" formula2="Roll = arctan2(ay, √(ax² + az²))" />
          <MathCard step="3" title="Filtro Exponencial (EMA)" desc="Filtramos lecturas erráticas por vibraciones o pedaleo de pie implementando un EMA a 10 Hz." formula="P_filt = (α * P_act) + ((1-α) * P_ant)" />
        </div>
      </section>

      {/* 6. EVENTOS */}
      <section className="container" style={{ padding: '6rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1.5rem 0' }}>Inteligencia en el Terreno</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            El algoritmo evalúa continuamente umbrales para "soplar" la mejor táctica, convirtiendo datos crudos en estrategias mientras el deportista está en acción.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ borderRadius: '40px', overflow: 'hidden', border: '8px solid var(--text-primary)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxWidth: '300px', width: '100%', position: 'relative' }}>
              <img src="/Uso SOPLON.jpg" alt="Uso SOPLON" style={{ width: '100%', height: 'auto', display: 'block', aspectRatio: '9/16', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <span style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                  🟢 Sensores Activos
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {eventos.map((evt, i) => (
              <EventCard key={i} icon={evt.icono} title={evt.titulo} umbral={evt.umbral} desc={evt.accion} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. DIAGRAMA DE ARQUITECTURA (CSS PURO) */}
      <section style={{ backgroundColor: '#0f172a', padding: '6rem 2rem', color: '#fff' }}>
        <div className="container" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1.5rem 0' }}>Arquitectura Centralizada</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Descubre cómo viajan los datos en tiempo real desde el casco del ciclista hasta la pantalla de su entrenador mediante nuestra infraestructura en la nube.
          </p>
        </div>

        <div className="container" style={{ backgroundColor: '#1e293b', borderRadius: '24px', padding: '3rem', overflowX: 'auto', border: '1px solid #334155' }}>
          <div style={{ minWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            
            {/* ROW 1: Dispositivo */}
            <div style={{ backgroundColor: '#334155', border: '2px solid #f97316', padding: '1.5rem', borderRadius: '16px', width: '250px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem' }}>📟</span>
              <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>Dispositivo IoT</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Raspberry Pi + Sensores</p>
            </div>

            {/* Arrow */}
            <DiagramArrow color="#f97316" text="MQTT Publish" />

            {/* ROW 2: Broker */}
            <div style={{ backgroundColor: '#334155', border: '2px solid #eab308', padding: '1.5rem', borderRadius: '16px', width: '250px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem' }}>☁️</span>
              <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>HiveMQ Cloud</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Broker MQTT</p>
            </div>

            {/* Arrow */}
            <DiagramArrow color="#eab308" text="MQTT Subscribe" />

            {/* ROW 3: Backend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'center' }}>
              <SideBox icon="🐙" title="GitHub" subtitle="Auto-Deploy" />
              <div style={{ color: '#94a3b8', fontWeight: 'bold' }}>▶</div>
              <div style={{ backgroundColor: '#334155', border: '2px solid #0ea5e9', padding: '1.5rem', borderRadius: '16px', width: '300px', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem' }}>🚂</span>
                <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>Railway: Bridge</h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>Python Flask (API)</p>
              </div>
              <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '0.8rem' }}>◀ ▶</div>
              <SideBox icon="🗄️" title="InfluxDB" subtitle="Series Temporales" borderColor="#3b82f6" />
            </div>

            {/* Arrow */}
            <DiagramArrow color="#10b981" text="GET /api/readings" />

            {/* ROW 4: Frontend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', justifyContent: 'center' }}>
              <SideBox icon="🐙" title="GitHub" subtitle="Auto-Deploy" />
              <div style={{ color: '#94a3b8', fontWeight: 'bold' }}>▶</div>
              <div style={{ backgroundColor: '#334155', border: '2px solid #fff', padding: '1.5rem', borderRadius: '16px', width: '300px', textAlign: 'center' }}>
                <span style={{ fontSize: '2rem' }}>▲</span>
                <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem' }}>Vercel: Frontend</h3>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>React + Vite</p>
              </div>
              <div style={{ color: '#8b5cf6', fontWeight: 'bold', fontSize: '0.8rem' }}>◀ Session ▶</div>
              <SideBox icon="🔐" title="Clerk" subtitle="Auth & JWT" borderColor="#8b5cf6" />
            </div>
            
          </div>
        </div>
      </section>

      {/* 8. TABLA DE ENTIDADES */}
      <section className="container" style={{ padding: '6rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1.5rem 0' }}>Entidades del Sistema</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Resumen técnico de variables de entrada y salida.</p>
        </div>
        
        <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border)', backgroundColor: 'var(--bg-primary)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>Variable</th>
                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>Tipo</th>
                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>Rango / Lógica</th>
                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>Sensor</th>
              </tr>
            </thead>
            <tbody>
              {variables.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: idx !== variables.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{row[0]}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ backgroundColor: 'var(--bg-secondary)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem' }}>{row[1]}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{row[2]}</td>
                  <td style={{ padding: '1rem 1.5rem', fontFamily: 'monospace', color: 'var(--accent)', fontWeight: 'bold' }}>{row[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 9. VIDEO FINAL Y FOOTER */}
      <section style={{ backgroundColor: '#111827', padding: '6rem 2rem', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0 0 1rem 0' }}>Prueba de Concepto (Prototipo)</h2>
        <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem' }}>Integración física de la Raspberry Pi y sensores en casco aerodinámico.</p>
        
        <div style={{ maxWidth: '900px', margin: '0 auto 4rem auto', borderRadius: '24px', overflow: 'hidden', border: '1px solid #334155' }}>
          <video src="/Prototipo SOPLON.mp4" autoPlay loop muted controls playsInline style={{ width: '100%', display: 'block' }} />
        </div>

        <Link to="/dashboard" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem', backgroundColor: 'var(--accent)', color: '#fff', border: 'none' }}>
          Iniciar Telemetría en Vivo
        </Link>
      </section>

      {/* FOOTER ACADÉMICO */}
      <footer style={{ backgroundColor: '#0f172a', padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '1rem' }}>
            Proyecto Académico de Ingeniería
          </p>
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: '#94a3b8' }}>
            Pontificia Universidad Javeriana • Fundamentos en IoT y Aplicaciones<br/>
            Tutor: Wilder Eduardo Castellanos Hernández, PhD
          </p>
          <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', fontFamily: 'monospace', color: '#64748b' }}>Bogotá DC, Colombia</p>
        </div>
      </footer>

    </div>
  );
}

// COMPONENTES AUXILIARES PARA MANTENER EL CÓDIGO LIMPIO

function BadgeDark({ text }) {
  return (
    <span style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: '600', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)' }}>
      {text}
    </span>
  );
}

function InfoBox({ icon, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <div>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{title}</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>{desc}</p>
      </div>
    </div>
  );
}

function CompetitorCard({ title, desc, tag, isMain }) {
  return (
    <div style={{ 
      padding: '2rem', 
      borderRadius: '20px', 
      border: isMain ? '2px solid var(--accent)' : '1px solid var(--border)', 
      backgroundColor: isMain ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-secondary)' 
    }}>
      <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{desc}</p>
      <span style={{ 
        backgroundColor: isMain ? 'var(--accent)' : '#ef4444', 
        color: '#fff', 
        padding: '0.3rem 0.8rem', 
        borderRadius: '6px', 
        fontSize: '0.8rem', 
        fontWeight: 'bold', 
        textTransform: 'uppercase' 
      }}>
        {tag}
      </span>
    </div>
  );
}

function MathCard({ step, title, desc, formula, formula2 }) {
  return (
    <div style={{ padding: '2rem', backgroundColor: 'var(--bg-primary)', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--text-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        {step}
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>{desc}</p>
      <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--accent)', fontWeight: 'bold' }}>
        {formula}
        {formula2 && <><br/>{formula2}</>}
      </div>
    </div>
  );
}

function EventCard({ icon, title, umbral, desc }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border)' }}>
      <span style={{ fontSize: '2rem' }}>{icon}</span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{title}</h3>
          <span style={{ backgroundColor: 'var(--bg-primary)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            {umbral}
          </span>
        </div>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{desc}</p>
      </div>
    </div>
  );
}

// Sub-componentes para el diagrama de arquitectura
function DiagramArrow({ color, text }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: color, fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold' }}>
      <div style={{ width: '2px', height: '20px', backgroundColor: color, opacity: 0.5 }}></div>
      <span style={{ padding: '0.3rem 1rem', border: `1px solid ${color}`, borderRadius: '20px', backgroundColor: '#1e293b' }}>{text}</span>
      <div style={{ width: '2px', height: '20px', backgroundColor: color, opacity: 0.5 }}></div>
      <div style={{ marginTop: '-8px', fontSize: '1.2rem' }}>▼</div>
    </div>
  );
}

function SideBox({ icon, title, subtitle, borderColor = '#475569' }) {
  return (
    <div style={{ backgroundColor: '#334155', border: `1px solid ${borderColor}`, padding: '1rem', borderRadius: '12px', width: '120px', textAlign: 'center' }}>
      <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '0.2rem' }}>{icon}</span>
      <h3 style={{ margin: 0, fontSize: '0.8rem', color: '#fff' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8' }}>{subtitle}</p>
    </div>
  );
}
