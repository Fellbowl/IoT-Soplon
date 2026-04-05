import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Secure authentication',
    description: 'Clerk provides login, registration, and protected route support out of the box.',
    icon: '🔒',
  },
  {
    title: 'Real-time metrics',
    description: 'Capture sensor telemetry over MQTT and persist it to InfluxDB Cloud.',
    icon: '📡',
  },
  {
    title: 'Visual analytics',
    description: 'Dashboard charts and tables make it easy to understand device performance.',
    icon: '📈',
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl py-12 sm:py-16">
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 px-6 py-16 text-white shadow-xl sm:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300">IoT telemetry platform</p>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Connect devices, stream data, and monitor sensors in one polished experience.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            IoT Soplon combines Clerk auth, InfluxDB analytics, and a bridge service for MQTT ingestion so your edge data becomes actionable.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-sky-400"
            >
              Get started
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/10 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="mt-14 grid gap-6 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white">
              {feature.icon}
            </div>
            <h2 className="mt-6 text-xl font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-3 text-slate-600">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
