import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const BRIDGE_URL = import.meta.env.VITE_BRIDGE_URL

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString()
}

export default function Dashboard() {
  const { getToken } = useAuth()
  const [data, setData] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [warning, setWarning] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BRIDGE_URL}/api/readings`)
        const json = await res.json()
        const formatted = json.map(row => ({
          ...row,
          time: formatTime(row.timestamp)
        }))
        setData(formatted)
        setLastUpdated(new Date().toLocaleTimeString())
        setWarning(false)
      } catch {
        setWarning(true)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ margin: 0 }}>Dashboard</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {lastUpdated && <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Actualizado: {lastUpdated}</span>}
          <span style={{
            backgroundColor: '#22c55e', color: 'white',
            padding: '0.2rem 0.7rem', borderRadius: '9999px', fontSize: '0.8rem'
          }}>● Live</span>
        </div>
      </div>

      {warning && (
        <div style={{
          backgroundColor: '#fef3c7', border: '1px solid #f59e0b',
          padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem'
        }}>
          ⚠️ No se pudo conectar al bridge — mostrando últimos datos disponibles.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <ChartCard title="Temperatura (°C)">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" stroke="#ef4444" dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Presión (kPa)">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="pressure" stroke="#3b82f6" dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Aceleración (m/s²)">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="accel_x" stroke="#8b5cf6" dot={false} />
            <Line type="monotone" dataKey="accel_y" stroke="#ec4899" dot={false} />
            <Line type="monotone" dataKey="accel_z" stroke="#06b6d4" dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Giroscopio (°/s)">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="gyro_x" stroke="#f97316" dot={false} />
            <Line type="monotone" dataKey="gyro_y" stroke="#84cc16" dot={false} />
            <Line type="monotone" dataKey="gyro_z" stroke="#14b8a6" dot={false} />
          </LineChart>
        </ChartCard>
      </div>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div style={{
      backgroundColor: '#ffffff', borderRadius: '12px',
      padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#111827' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}