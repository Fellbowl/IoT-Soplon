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

function formatInfluxRows(result) {
  const series = result?.results?.[0]?.series?.[0];
  if (series?.columns && Array.isArray(series.values)) {
    const columns = series.columns;
    const timeIndex = columns.indexOf('_time');
    const valueIndex = columns.indexOf('_value');
    const fieldIndex = columns.indexOf('_field');
    return series.values.map((entry, index) => ({
      id: `${entry[timeIndex]}-${index}`,
      time: entry[timeIndex],
      field: fieldIndex >= 0 ? entry[fieldIndex] : 'measurement',
      value: typeof entry[valueIndex] === 'number' ? entry[valueIndex] : parseFloat(entry[valueIndex]) || 0,
    }));
  }
  const tables = result?.tables?.[0]?.records;
  if (Array.isArray(tables)) {
    return tables.map((record, index) => ({
      id: `record-${index}`,
      time: record._time || record.time || new Date().toISOString(),
      field: record._field || 'measurement',
      value: typeof record._value === 'number' ? record._value : parseFloat(record._value) || 0,
    }));
  }
  return [];
}

export default function Dashboard() {
  const { getToken, isLoaded } = useAuth();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      if (!isLoaded) {
        return;
      }

      try {
        setLoading(true);
        setError('');
        const token = await getToken();
        const query = `from(bucket: "${import.meta.env.VITE_INFLUX_BUCKET || 'sensor_data'}") |> range(start: -24h) |> filter(fn: (r) => r._measurement == "iot_sensor") |> sort(columns:["_time"], desc: true) |> limit(n: 20)`;
        const response = await fetch(import.meta.env.VITE_INFLUX_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`InfluxDB request failed with status ${response.status}`);
        }

        const result = await response.json();
        const rows = formatInfluxRows(result);
        setReadings(rows);
      } catch (err) {
        console.error(err);
        setError('Unable to load sensor readings. Confirm your Influx URL and auth settings.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [getToken, isLoaded]);

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
