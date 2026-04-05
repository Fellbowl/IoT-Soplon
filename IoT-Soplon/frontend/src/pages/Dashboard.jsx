import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
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
  const { isLoaded } = useAuth();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!isLoaded) {
        return;
      }

      const bridgeUrl = import.meta.env.VITE_BRIDGE_URL;
      if (!bridgeUrl) {
        setError('Bridge URL is missing. Set VITE_BRIDGE_URL in the frontend environment.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const response = await fetch(`${bridgeUrl}/api/readings`);

        if (!response.ok) {
          throw new Error(`Bridge request failed with status ${response.status}`);
        }

        const result = await response.json();
        setReadings(parseReadings(result));
      } catch (err) {
        console.error(err);
        setError('Unable to load sensor readings. Confirm your bridge service is running and VITE_BRIDGE_URL is correct.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [isLoaded]);

  const chartData = useMemo(
    () => readings.slice().reverse().map((reading) => ({
      time: new Date(reading.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: reading.value,
    })),
    [readings]
  );

  return (
    <div className="mx-auto max-w-7xl py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 sm:flex sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">Recent sensor readings from InfluxDB Cloud and a simple performance chart.</p>
          </div>
          <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:mt-0">
            Showing up to 20 latest readings
          </div>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-600">
            Loading recent sensor readings...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
            {error}
          </div>
        ) : readings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-slate-600">
            No sensor readings are available yet. The bridge service may not have written data to InfluxDB.
          </div>
        ) : (
          <div className="space-y-10">
            <div className="h-[320px] rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="time" stroke="#475569" />
                  <YAxis stroke="#475569" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
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
