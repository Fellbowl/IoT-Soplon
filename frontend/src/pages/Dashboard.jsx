import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts'

const BRIDGE_URL = import.meta.env.VITE_BRIDGE_URL

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export default function Dashboard() {
  const { getToken } = useAuth()
  const [data, setData] = useState([])
  const [currentData, setCurrentData] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [warning, setWarning] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BRIDGE_URL}/api/readings`)
        const json = await res.json()
        
        const formatted = json.map(row => ({
          ...row,
          time: formatTime(row.timestamp),
          // Aseguramos que los valores existan para las gráficas
          pitch: row.pitch_deg || 0,
          roll: row.roll_deg || 0,
          viento: row.wind_speed_kmh || 0,
          temperatura: row.temperature_c || 0,
          presion: row.pressure_pa || 0
        }))
        
        setData(formatted)
        if (formatted.length > 0) {
          setCurrentData(formatted[formatted.length - 1])
        }
        
        setLastUpdated(new Date().toLocaleTimeString())
        setWarning(false)
      } catch {
        setWarning(true)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 2000) // Refresco cada 2 segundos
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f3f4f6', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0, color: '#1f2937' }}>🚴‍♂️ Dashboard AeroTact (Soplón)</h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#6b7280' }}>Monitor de Rendimiento y Seguridad en Ruta</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {lastUpdated && <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Actualizado: {lastUpdated}</span>}
          <span style={{
            backgroundColor: '#22c55e', color: 'white', fontWeight: 'bold',
            padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.85rem'
          }}>● LIVE</span>
        </div>
      </div>

      {warning && (
        <div style={{
          backgroundColor: '#fef3c7', border: '1px solid #f59e0b', color: '#92400e',
          padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: '500'
        }}>
          ⚠️ Error de conexión con el servidor MQTT/Bridge. Mostrando datos cacheados.
        </div>
      )}

      {/* PANEL DE ALERTAS CRÍTICAS */}
      {currentData && currentData.fall_detected && (
        <div style={{
          backgroundColor: '#fef2f2', border: '2px solid #ef4444', color: '#991b1b',
          padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem'
        }}>
          <span style={{ fontSize: '2rem' }}>🚨</span>
          <div>
            <h2 style={{ margin: 0 }}>¡CAÍDA DETECTADA!</h2>
            <p style={{ margin: 0 }}>El acelerómetro registró un impacto severo seguido de inmovilidad.</p>
          </div>
        </div>
      )}

      {currentData && currentData.alerts && currentData.alerts.length > 0 && !currentData.fall_detected && (
        <div style={{
          backgroundColor: '#fffbeb', border: '1px solid #f59e0b', color: '#92400e',
          padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem'
        }}>
          <strong>⚠️ Alertas Activas: </strong> 
          {currentData.alerts.map((a, i) => (
            <span key={i} style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem', backgroundColor: '#fde68a', borderRadius: '4px', fontSize: '0.9rem' }}>
              {a.type}: {a.msg}
            </span>
          ))}
        </div>
      )}

      {/* TARJETAS DE ESTADO EN VIVO (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <StatusCard 
          title="Postura Actual" 
          value={currentData ? `${currentData.pitch}°` : '--'}
          subtitle={currentData ? currentData.posture_status.toUpperCase() : 'Buscando...'}
          color={currentData?.posture_bad ? '#ef4444' : '#10b981'}
        />
        
        <StatusCard 
          title="Viento Frontal" 
          value={currentData ? `${currentData.viento} km/h` : '--'}
          subtitle={currentData ? currentData.wind_category.toUpperCase() : 'Buscando...'}
          color={currentData?.wind_category === 'peligroso' ? '#ef4444' : (currentData?.wind_favorable ? '#10b981' : '#3b82f6')}
        />
        
        <StatusCard 
          title="Temperatura" 
          value={currentData ? `${currentData.temperatura}°C` : '--'}
          subtitle={currentData ? currentData.temp_status.toUpperCase() : 'Buscando...'}
          color={currentData?.temp_status === 'critica' ? '#ef4444' : (currentData?.temp_status === 'caliente' ? '#f59e0b' : '#3b82f6')}
        />

      </div>

      {/* GRÁFICAS DE TENDENCIA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        <ChartCard title="Evolución de Postura (Grados)">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{fontSize: 12}} />
            <YAxis domain={[-90, 90]} tick={{fontSize: 12}} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={5} stroke="red" strokeDasharray="3 3" label="Erguido (Malo)" />
            <ReferenceLine y={-45} stroke="red" strokeDasharray="3 3" label="Muy bajo" />
            <Line type="monotone" name="Cabeceo (Pitch)" dataKey="pitch" stroke="#8b5cf6" strokeWidth={2} dot={false} />
            <Line type="monotone" name="Inclinación (Roll)" dataKey="roll" stroke="#ec4899" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Velocidad del Viento Relativo (km/h)">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip />
            <ReferenceLine y={8} stroke="#10b981" strokeDasharray="3 3" label="Ideal" />
            <ReferenceLine y={14} stroke="#ef4444" strokeDasharray="3 3" label="Fuerte" />
            <Line type="monotone" name="Viento" dataKey="viento" stroke="#3b82f6" strokeWidth={3} dot={false} fill="#3b82f6" />
          </LineChart>
        </ChartCard>

        <ChartCard title="Presión Dinámica Frontal (Pa)">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip />
            <Line type="monotone" name="Presión (Pa)" dataKey="presion" stroke="#f59e0b" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Temperatura Ambiente (°C)">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{fontSize: 12}} />
            <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{fontSize: 12}} />
            <Tooltip />
            <ReferenceLine y={35} stroke="#f59e0b" strokeDasharray="3 3" label="Caliente" />
            <ReferenceLine y={40} stroke="#ef4444" strokeDasharray="3 3" label="Crítico" />
            <Line type="monotone" name="Temp" dataKey="temperatura" stroke="#ef4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>

      </div>
    </div>
  )
}

// COMPONENTES AUXILIARES

function ChartCard({ title, children }) {
  return (
    <div style={{
      backgroundColor: '#ffffff', borderRadius: '12px',
      padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ margin: '0 0 1.5rem 0', color: '#374151', fontSize: '1.1rem' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

function StatusCard({ title, value, subtitle, color }) {
  return (
    <div style={{
      backgroundColor: '#ffffff', borderRadius: '12px', padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb',
      borderLeft: `6px solid ${color}`
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '0.9rem', textTransform: 'uppercase' }}>{title}</h4>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.2rem' }}>{value}</div>
      <div style={{ fontSize: '0.9rem', color: color, fontWeight: '600' }}>{subtitle}</div>
    </div>
  )
}