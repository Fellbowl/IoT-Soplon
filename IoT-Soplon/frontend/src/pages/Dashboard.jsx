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
  const REFRESH_INTERVAL = 5000;
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
      return 'waiting for first update';
    }
    if (secondsSinceUpdate < 5) {
      return 'just now';
    }
    if (secondsSinceUpdate < 60) {
      return `${secondsSinceUpdate}s ago`;
    }
    return `${Math.floor(secondsSinceUpdate / 60)}m ago`;
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
    <div className="mx-auto max-w-7xl py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 sm:flex sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
                  lastFetchHadError ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {lastFetchHadError ? (
                  <span className="h-2 w-2 rounded-full bg-slate-400" aria-hidden="true" />
                ) : (
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                )}
                {lastFetchHadError ? 'Paused' : 'Live'}
              </span>
              <button
                type="button"
                onClick={handleManualRefresh}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-600">Last updated: {lastUpdatedText}</p>
            <p className="mt-2 text-sm text-slate-600">Recent sensor readings from InfluxDB Cloud and a simple performance chart.</p>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:mt-0">
            Showing up to 20 latest readings
          </div>
        </div>

        {showStaleWarning ? (
          <div className="mb-6 flex items-start justify-between rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span>Connection lost — showing last known data</span>
            <button
              type="button"
              onClick={() => setShowStaleWarning(false)}
              className="ml-4 font-medium text-amber-900 underline underline-offset-2"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-600">
            Loading recent sensor readings...
          </div>
        ) : error && readings.length === 0 ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
            {error}
          </div>
        ) : readings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-600">
            No sensor readings are available yet. The bridge service may not have written data to InfluxDB.
          </div>
        ) : (
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h2 className="mb-4 text-sm font-semibold text-slate-900">Temperature (°C)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="time" stroke="#475569" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                    <YAxis stroke="#475569" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temperature" stroke="#E8593C" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h2 className="mb-4 text-sm font-semibold text-slate-900">Pressure (kPa)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="time" stroke="#475569" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                    <YAxis stroke="#475569" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pressure" stroke="#3B8BD4" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h2 className="mb-4 text-sm font-semibold text-slate-900">Acceleration (m/s²)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="time" stroke="#475569" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                    <YAxis stroke="#475569" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="accel_x" stroke="#1D9E75" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="accel_y" stroke="#7F77DD" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="accel_z" stroke="#D85A30" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h2 className="mb-4 text-sm font-semibold text-slate-900">Gyroscope (°/s)</h2>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                    <XAxis dataKey="time" stroke="#475569" tickFormatter={(t) => new Date(t).toLocaleTimeString()} />
                    <YAxis stroke="#475569" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gyro_x" stroke="#1D9E75" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="gyro_y" stroke="#7F77DD" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="gyro_z" stroke="#D85A30" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Timestamp</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Metric</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {readings.map((reading) => (
                    <tr key={reading.id}>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {new Date(reading.time).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">{reading.field}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{reading.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
