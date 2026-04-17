const variables = [
  ['Temperatura (temp)', 'Numerica', '0-50 C'],
  ['Presion (pressure)', 'Numerica', '-10-10 kPa'],
  ['Aceleracion (ax, ay, az)', 'Numerica', '+/-2g / +/-4g / +/-8g / +/-16g'],
  ['Giroscopio (gx, gy, gz)', 'Numerica', '+/-250 a +/-2000 deg/s'],
  ['Velocidad del viento', 'Numerica', '0-150+ km/h (Bernoulli)'],
  ['Pitch', 'Numerica', '-90 a 90'],
  ['Roll', 'Numerica', '-180 a 180'],
  ['Potencia aerodinamica', 'Numerica', '0-2000 W'],
  ['Magnitud G', 'Numerica', '0-16g'],
  ['Eventos', 'Texto', 'Umbrales (Viento fuerte, Sprint, Caida...)'],
  ['Estrategia', 'Texto', 'Logica de recomendaciones'],
];

const pasos = [
  'Calcular pitch y roll a partir del acelerometro y mostrarlos en el dashboard',
  'Implementar calculo de velocidad de viento con la formula de Bernoulli',
  'Implementar logica de eventos y alertas estrategicas (viento critico, caida, sprint)',
  'Calcular perdida de potencia aerodinamica en vatios',
  'Almacenamiento local en CSV como respaldo en la Raspberry Pi',
  'Optimizar consumo energetico para uso portatil en carrera',
];

export default function Proyecto() {
  return (
    <div className="pb-12">
      <section className="bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">Soplon</h1>
          <p className="mt-4 text-xl italic text-slate-200">El que te sopla la estrategia, no el secreto</p>
          <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-slate-200">
            Soplon es un sistema IoT portatil para ciclistas que mide condiciones aerodinamicas en tiempo real y transmite
            los datos a un dashboard en la nube para apoyar decisiones de postura y estrategia durante el pedaleo.
          </p>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">El problema</h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              A velocidades superiores a 25 km/h, el viento representa entre el 70% y el 90% de la resistencia total.
              Hoy, la mayoria de ciclistas no cuenta con una medicion de viento en tiempo real y no puede saber con
              precision cuando adoptar una postura aerodinamica o cuando conviene ahorrar energia.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Limitaciones actuales</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>Sin medicion de viento en tiempo real</li>
                <li>Sin guia de postura en carrera</li>
                <li>Sin estrategia energetica basada en datos</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Consecuencias</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>Mayor fatiga</li>
                <li>Estrategia ineficiente</li>
                <li>Perdida de rendimiento</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold text-slate-900">Estado actual del sistema</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <article className="rounded-xl border border-slate-200 border-t-4 border-t-sky-500 p-6 shadow-sm">
              <p className="text-3xl">🌐</p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">Plataforma web</h3>
              <p className="mt-3 text-slate-700">
                Aplicacion React desplegada en Vercel con autenticacion mediante Clerk. Incluye pagina de inicio,
                registro, inicio de sesion y dashboard protegido.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 border-t-4 border-t-emerald-500 p-6 shadow-sm">
              <p className="text-3xl">📡</p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">Pipeline de datos</h3>
              <p className="mt-3 text-slate-700">
                El dispositivo Raspberry Pi publica lecturas de sensores por MQTT a HiveMQ Cloud cada segundo. Un
                servicio bridge en Python (Railway) suscribe los datos y los escribe en InfluxDB Cloud.
              </p>
            </article>
            <article className="rounded-xl border border-slate-200 border-t-4 border-t-violet-500 p-6 shadow-sm">
              <p className="text-3xl">📊</p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">Dashboard en tiempo real</h3>
              <p className="mt-3 text-slate-700">
                El dashboard consulta los ultimos 5 minutos de datos cada segundo y los visualiza en 4 graficas en
                vivo: temperatura, presion, aceleracion (3 ejes) y giroscopio (3 ejes).
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold text-slate-900">Variables del sistema</h2>
          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">Variable</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Rango</th>
                </tr>
              </thead>
              <tbody>
                {variables.map((row, index) => (
                  <tr key={row[0]} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="border-t border-slate-200 px-4 py-3 text-sm text-slate-800">{row[0]}</td>
                    <td className="border-t border-slate-200 px-4 py-3 text-sm text-slate-700">{row[1]}</td>
                    <td className="border-t border-slate-200 px-4 py-3 text-sm text-slate-700">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold text-slate-900">Arquitectura del despliegue</h2>
          <div className="mt-8 overflow-x-auto">
            <div className="flex min-w-[980px] items-start justify-between gap-3">
              <div className="w-44 text-center">
                <div className="rounded-xl border border-teal-200 bg-teal-100 p-4 shadow-sm">
                  <p className="font-semibold text-teal-900">Raspberry Pi</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">Sensores + publisher.py</p>
              </div>
              <div className="pt-4 text-2xl text-slate-400">→</div>
              <div className="w-44 text-center">
                <div className="rounded-xl border border-violet-200 bg-violet-100 p-4 shadow-sm">
                  <p className="font-semibold text-violet-900">HiveMQ Cloud</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">Broker MQTT</p>
              </div>
              <div className="pt-4 text-2xl text-slate-400">→</div>
              <div className="w-44 text-center">
                <div className="rounded-xl border border-orange-200 bg-orange-100 p-4 shadow-sm">
                  <p className="font-semibold text-orange-900">Bridge (Railway)</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">Python + Flask API</p>
              </div>
              <div className="pt-4 text-2xl text-slate-400">→</div>
              <div className="w-44 text-center">
                <div className="rounded-xl border border-amber-200 bg-amber-100 p-4 shadow-sm">
                  <p className="font-semibold text-amber-900">InfluxDB Cloud</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">Base de datos serie temporal</p>
              </div>
              <div className="pt-4 text-2xl text-slate-400">→</div>
              <div className="w-44 text-center">
                <div className="rounded-xl border border-sky-200 bg-sky-100 p-4 shadow-sm">
                  <p className="font-semibold text-sky-900">Dashboard (Vercel)</p>
                </div>
                <p className="mt-2 text-xs text-slate-500">React + Clerk</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold text-slate-900">Sensores conectados</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">LM75A</h3>
              <p className="mt-3 text-slate-700">Temperatura ambiente</p>
              <p className="mt-2 text-sm text-slate-600">Protocolo I2C</p>
              <p className="mt-1 text-sm text-slate-600">Direccion 0x48</p>
              <p className="mt-1 text-sm text-slate-600">Rango 0-50 C</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">MPU-6050</h3>
              <p className="mt-3 text-slate-700">IMU (aceleracion e inclinacion)</p>
              <p className="mt-2 text-sm text-slate-600">Protocolo I2C</p>
              <p className="mt-1 text-sm text-slate-600">Direccion 0x68</p>
              <p className="mt-1 text-sm text-slate-600">Entrega accel_x/y/z y gyro_x/y/z calibrados</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">MPS20N0040D-S</h3>
              <p className="mt-3 text-slate-700">Presion barometrica</p>
              <p className="mt-2 text-sm text-slate-600">Protocolo 2-Wire (GPIO 5/6)</p>
              <p className="mt-1 text-sm text-slate-600">Conversion Bernoulli a velocidad de viento en km/h</p>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-semibold text-slate-900">Proximos pasos</h2>
          <ol className="mt-8 grid list-decimal gap-4 pl-5 text-slate-700 md:grid-cols-2">
            {pasos.map((paso) => (
              <li key={paso}>{paso}</li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}