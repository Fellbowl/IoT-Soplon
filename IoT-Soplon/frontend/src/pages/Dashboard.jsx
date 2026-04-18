import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function parseReadings(result) {
  if (!Array.isArray(result)) {
    return [];
  }
  return result.map((item, index) => ({
    id: item.id || `${item.time}-${index}`,
    time: item.time,
    field: item.field || 'measurement',
    value: typeof item.value === 'number' ? item.value : parseFloat(item.value) || 0,
  }));
}

export default function Dashboard() {
  const REFRESH_INTERVAL = 2000;
  const { isLoaded } = useAuth();
  const bridgeUrl = import.meta.env.VITE_BRIDGE_URL;
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(null);
  const [lastFetchHadError, setLastFetchHadError] = useState(false);
  const [showStaleWarning, setShowStaleWarning] = useState(false);
  const pollingIntervalRef = useRef(null);

  const loadData = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    if (!bridgeUrl) {
      setError('Bridge URL is missing. Set VITE_BRIDGE_URL in the frontend environment.');
      setLastFetchHadError(true);
      setShowStaleWarning(readings.length > 0);
      setLoading(false);
      return;
    }

    try {
      if (readings.length === 0) {
        setLoading(true);
      }
      const response = await fetch(`${bridgeUrl}/api/readings`);

      if (!response.ok) {
        throw new Error(`Bridge request failed with status ${response.status}`);
      }

      const result = await response.json();
      setReadings(parseReadings(result));
      setError('');
      setLastFetchHadError(false);
      setShowStaleWarning(false);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError('Unable to load sensor readings. Confirm your bridge service is running and VITE_BRIDGE_URL is correct.');
      setLastFetchHadError(true);
      setShowStaleWarning(readings.length > 0);
    } finally {
      setLoading(false);
    }
  }, [bridgeUrl, isLoaded, readings.length]);

  const resetPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    pollingIntervalRef.current = setInterval(() => {
      loadData();
    }, REFRESH_INTERVAL);
  }, [REFRESH_INTERVAL, loadData]);

  useEffect(() => {
    if (!isLoaded) {
      return undefined;
    }

    loadData();
    resetPolling();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isLoaded, loadData, resetPolling]);

  useEffect(() => {
    if (!lastUpdated) {
      setSecondsSinceUpdate(null);
      return undefined;
    }

    const tick = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
      setSecondsSinceUpdate(elapsed);
    };

    tick();
    const timer = setInterval(tick, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [lastUpdated]);

  const lastUpdatedText = useMemo(() => {
    if (secondsSinceUpdate === null) {
      return 'Esperando primera actualización...';
    }
    if (secondsSinceUpdate < 5) {
      return 'Justo ahora';
    }
    if (secondsSinceUpdate < 60) {
      return `Hace ${secondsSinceUpdate} seg`;
    }
    return `Hace ${Math.floor(secondsSinceUpdate / 60)} min`;
  }, [secondsSinceUpdate]);

  const handleManualRefresh = async () => {
    await loadData();
    resetPolling();
  };

  const chartData = useMemo(() => {
    const pivot = {};

    readings.forEach((reading) => {
      const t = reading.time;
      if (!pivot[t]) {
        pivot[t] = { time: t };
      }
      pivot[t][reading.field] = reading.value;
    });

    return Object.values(pivot).sort((a, b) => new Date(a.time) - new Date(b.time));
  }, [readings]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-20">
      
      {/* CABECERA (HERO) DEL DASHBOARD */}
      <section className="relative bg-slate-900 pt-16 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-violet-500/10 blur-[100px]"></div>
        
        <div className="relative mx-auto max-w-7xl z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-block rounded-full bg-sky-500/20 border border-sky-400/30 px-4 py-1.5 text-xs font-bold text-sky-300 uppercase tracking-widest mb-4">
              Telemetría Activa
            </span>
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
              Dashboard de Rendimiento
            </h1>
            <p className="mt-3 text-slate-400 text-lg max-w-2xl">
              Monitoreo en tiempo real de variables ambientales y biomecánicas desde el casco SOPLÓN hacia InfluxDB.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-800/50 backdrop-blur-md p-4 rounded-2xl border border-slate-700">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  lastFetchHadError ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {lastFetchHadError ? (
                  <span className="h-2 w-2 rounded-full bg-red-500" aria-hidden="true" />
                ) : (
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                )}
                {lastFetchHadError ? 'Pausado' : 'En Vivo'}
              </span>
            </div>
            
            <div className="h-8 w-px bg-slate-700 hidden sm:block"></div>
            
            <div className="text-right">
              <p className="text-xs text-slate-400 font-medium">Última actualización</p>
              <p className="text-sm text-white font-semibold">{lastUpdatedText}</p>
            </div>

            <button
              type="button"
              onClick={handleManualRefresh}
              className="rounded-full bg-sky-500 px-5 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-sky-400 hover:scale-105"
            >
              Actualizar
            </button>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="mx-auto max-w-7xl px-6 -mt-16 relative z-20">
        
        {/* Alerta de pérdida de conexión */}
        {showStaleWarning && (
          <div className="mb-8 flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 text-2xl">⚠️</span>
              <span className="text-sm font-semibold text-amber-200">Señal perdida — Mostrando últimos datos conocidos</span>
            </div>
            <button
              type="button"
              onClick={() => setShowStaleWarning(false)}
              className="text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Ocultar
            </button>
          </div>
        )}

        {/* Estados de Carga y Error */}
        {loading ? (
          <div className="rounded-[2.5rem] bg-white border border-slate-200 p-16 text-center shadow-xl">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-sky-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
            <h3 className="text-xl font-bold text-slate-900">Sincronizando con SOPLÓN...</h3>
            <p className="text-slate-500 mt-2">Cargando lecturas recientes de los sensores.</p>
          </div>
        ) : error && readings.length === 0 ? (
          <div className="rounded-[2.5rem] bg-red-50 border border-red-200 p-12 text-center shadow-xl">
            <span className="text-4xl mb-4 block">🔌</span>
            <h3 className="text-xl font-bold text-red-800 mb-2">Error de Conexión</h3>
            <p className="text-red-600">{error}</p>
          </div>
        ) : readings.length === 0 ? (
          <div className="rounded-[2.5rem] bg-white border border-slate-200 p-16 text-center shadow-xl">
            <span className="text-5xl mb-4 block">📡</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Esperando datos</h3>
            <p className="text-slate-500">No hay lecturas disponibles. Asegúrate de que el casco esté encendido y transmitiendo a InfluxDB.</p>
          </div>
        ) : (
          
          /* GRÁFICOS Y TABLA DE DATOS */
          <div className="space-y-8">
            
            {/* Grid de Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Temp */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-rose-100 p-2 rounded-lg text-rose-600">🌡️</div>
                  <h2 className="text-lg font-bold text-slate-900">Temperatura (°C)</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="temperature" name="Temp. Ambiente" stroke="#f43f5e" strokeWidth={4} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Pressure */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-sky-100 p-2 rounded-lg text-sky-600">💨</div>
                  <h2 className="text-lg font-bold text-slate-900">Presión Dinámica (kPa)</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="pressure" name="Presión Diferencial" stroke="#0ea5e9" strokeWidth={4} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Acceleration */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">🚀</div>
                  <h2 className="text-lg font-bold text-slate-900">Aceleración (m/s²)</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="accel_x" name="Eje X" stroke="#10b981" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="accel_y" name="Eje Y" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="accel_z" name="Eje Z" stroke="#f59e0b" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Gyroscope */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-violet-100 p-2 rounded-lg text-violet-600">⚖️</div>
                  <h2 className="text-lg font-bold text-slate-900">Giroscopio (°/s)</h2>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="time" stroke="#94a3b8" tick={{fontSize: 12}} tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                    <YAxis stroke="#94a3b8" tick={{fontSize: 12}} />
                    <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="gyro_x" name="Pitch" stroke="#10b981" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="gyro_y" name="Roll" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="gyro_z" name="Yaw" stroke="#f59e0b" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tabla de Lecturas Recientes */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg mt-8">
              <div className="bg-slate-900 px-6 py-5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Lecturas Recientes</h3>
                <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">Mostrando últimas 20</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-xs">Marca de Tiempo</th>
                      <th className="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-xs">Métrica</th>
                      <th className="px-6 py-4 font-bold text-slate-700 uppercase tracking-wider text-xs">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {readings.map((reading) => (
                      <tr key={reading.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                          {new Date(reading.time).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-slate-800 font-medium">{reading.field}</td>
                        <td className="px-6 py-4 font-bold text-sky-600">{reading.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
