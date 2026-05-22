import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, AreaChart, Area, BarChart, Bar, Legend
} from "recharts";

// ─── Config ───────────────────────────────────────────────────────────────────
const BRIDGE_URL  = (import.meta.env.VITE_BRIDGE_URL || "").replace(/\/$/, "");
const POLL_MS     = 1500;
const MAX_LIVE_PTS = 120;  // ~2 min de datos live

// ─── Umbrales (deben coincidir con Publisher.py) ───────────────────────────────
const PITCH_MAX   =  20;
const PITCH_MIN   = -15;
const ROLL_MAX    =  15;
const WIND_FAV    =  10;
const WIND_CROSS  =  25;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (v, d = 1) => (v == null ? "—" : Number(v).toFixed(d));
const normalizeAlerts = (alerts) => {
  if (Array.isArray(alerts)) return alerts;
  if (typeof alerts === "string") {
    try {
      const parsed = JSON.parse(alerts);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};
const timeLabel = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

const ALERT_META = {
  HEAD_TOO_HIGH:     { label: "Cabeza muy alta",      color: "#E24B4A", icon: "ti-arrow-up" },
  HEAD_TOO_LOW:      { label: "Cabeza muy baja",       color: "#E24B4A", icon: "ti-arrow-down" },
  LEAN_RIGHT:        { label: "Inclinado a la derecha",color: "#E24B4A", icon: "ti-arrow-right" },
  LEAN_LEFT:         { label: "Inclinado a la izquierda", color: "#E24B4A", icon: "ti-arrow-left" },
  CROSSWIND_WARNING: { label: "Viento cruzado",        color: "#EF9F27", icon: "ti-wind" },
  FALL_DETECTED:     { label: "¡Posible caída!",       color: "#D85A30", icon: "ti-alert-triangle" },
};

const WIND_STATUS_META = {
  CALM:              { label: "Calma",               color: "#888780", dot: "#888780" },
  FAVORABLE:         { label: "Favorable ✓",         color: "#639922", dot: "#639922" },
  HEADWIND:          { label: "Viento frontal",       color: "#185FA5", dot: "#185FA5" },
  CROSSWIND_WARNING: { label: "Viento cruzado ⚠",    color: "#BA7517", dot: "#EF9F27" },
};

// ─── Componentes pequeños ─────────────────────────────────────────────────────
function MetricCard({ label, value, unit, accent, sub }) {
  return (
    <div style={{
      background: "var(--color-background-secondary)",
      borderRadius: "var(--border-radius-md)",
      padding: "1rem",
      display: "flex", flexDirection: "column", gap: 4,
    }}>
      <span style={{ fontSize: 12, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontSize: 26, fontWeight: 500, color: accent || "var(--color-text-primary)" }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>{unit}</span>}
      </div>
      {sub && <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{sub}</span>}
    </div>
  );
}

function PostureGauge({ pitch, roll }) {
  const pitchOk = pitch >= PITCH_MIN && pitch <= PITCH_MAX;
  const rollOk  = Math.abs(roll) <= ROLL_MAX;
  const ok = pitchOk && rollOk;

  // Normalizar pitch y roll para el visor visual
  const pitchPct = Math.max(0, Math.min(1, (pitch - PITCH_MIN) / (PITCH_MAX - PITCH_MIN)));
  const rollPct  = Math.max(0, Math.min(1, (roll + ROLL_MAX) / (ROLL_MAX * 2)));

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: `0.5px solid ${ok ? "var(--color-border-success)" : "var(--color-border-danger)"}`,
      borderRadius: "var(--border-radius-lg)",
      padding: "1rem 1.25rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Postura</span>
        <span style={{
          fontSize: 11, padding: "2px 10px", borderRadius: "var(--border-radius-md)",
          background: ok ? "var(--color-background-success)" : "var(--color-background-danger)",
          color: ok ? "var(--color-text-success)" : "var(--color-text-danger)",
          fontWeight: 500,
        }}>
          {ok ? "Correcta" : "¡Corregir!"}
        </span>
      </div>

      {/* Pitch bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>
          <span>Pitch (cabeza)</span>
          <span style={{ color: pitchOk ? "var(--color-text-success)" : "var(--color-text-danger)", fontWeight: 500 }}>
            {fmt(pitch)}°
          </span>
        </div>
        <div style={{ height: 8, background: "var(--color-background-secondary)", borderRadius: 99, position: "relative" }}>
          <div style={{
            position: "absolute", left: `${pitchPct * 100}%`,
            transform: "translateX(-50%)",
            width: 12, height: 12, borderRadius: "50%", top: -2,
            background: pitchOk ? "#639922" : "#E24B4A",
            border: "2px solid var(--color-background-primary)",
          }} />
          {/* Zona OK */}
          <div style={{
            position: "absolute",
            left: `${((0 - PITCH_MIN) / (PITCH_MAX - PITCH_MIN)) * 100}%`,
            width: `${(PITCH_MAX / (PITCH_MAX - PITCH_MIN)) * 100}%`,
            height: "100%", borderRadius: 99,
            background: "rgba(99,153,34,0.18)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>
          <span>{PITCH_MIN}°</span><span>0°</span><span>{PITCH_MAX}°</span>
        </div>
      </div>

      {/* Roll bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-text-secondary)", marginBottom: 4 }}>
          <span>Roll (lateral)</span>
          <span style={{ color: rollOk ? "var(--color-text-success)" : "var(--color-text-danger)", fontWeight: 500 }}>
            {fmt(roll)}°
          </span>
        </div>
        <div style={{ height: 8, background: "var(--color-background-secondary)", borderRadius: 99, position: "relative" }}>
          <div style={{
            position: "absolute", left: `${rollPct * 100}%`,
            transform: "translateX(-50%)",
            width: 12, height: 12, borderRadius: "50%", top: -2,
            background: rollOk ? "#639922" : "#E24B4A",
            border: "2px solid var(--color-background-primary)",
          }} />
          <div style={{
            position: "absolute", left: "25%", width: "50%", height: "100%",
            borderRadius: 99, background: "rgba(99,153,34,0.18)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>
          <span>-{ROLL_MAX}°</span><span>0°</span><span>+{ROLL_MAX}°</span>
        </div>
      </div>
    </div>
  );
}

function WindCard({ windKmh, windStatus }) {
  const meta = WIND_STATUS_META[windStatus] || WIND_STATUS_META.CALM;
  const pct  = Math.min(1, windKmh / 50);

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "0.5px solid var(--color-border-tertiary)",
      borderRadius: "var(--border-radius-lg)",
      padding: "1rem 1.25rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Viento</span>
        <span style={{
          fontSize: 11, padding: "2px 10px", borderRadius: "var(--border-radius-md)",
          background: "var(--color-background-secondary)",
          color: meta.color, fontWeight: 500, border: `0.5px solid ${meta.dot}`,
        }}>
          {meta.label}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
        <span style={{ fontSize: 28, fontWeight: 500, color: meta.color }}>{fmt(windKmh)}</span>
        <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>km/h</span>
      </div>
      <div style={{ height: 6, background: "var(--color-background-secondary)", borderRadius: 99 }}>
        <div style={{
          height: "100%", borderRadius: 99,
          width: `${pct * 100}%`,
          background: meta.dot,
          transition: "width 0.4s ease",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 3 }}>
        <span>0</span><span>favorable ≥{WIND_FAV}</span><span>cruzado ≥{WIND_CROSS}</span><span>50 km/h</span>
      </div>
    </div>
  );
}

function AlertFeed({ alerts }) {
  if (!alerts.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {alerts.slice(0, 8).map((a, i) => {
        const m = ALERT_META[a.type] || { label: a.type, color: "#888780", icon: "ti-bell" };
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px",
            background: "var(--color-background-primary)",
            border: `0.5px solid var(--color-border-tertiary)`,
            borderLeft: `3px solid ${m.color}`,
            borderRadius: "var(--border-radius-md)",
          }}>
            <i className={`ti ${m.icon}`} style={{ fontSize: 15, color: m.color }} aria-hidden="true" />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>{m.label}</span>
              <span style={{ fontSize: 11, color: "var(--color-text-secondary)", marginLeft: 8 }}>{timeLabel(a.ts)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid var(--color-border-tertiary)", marginBottom: 20 }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: "8px 16px", fontSize: 13, fontWeight: active === t.id ? 500 : 400,
            color: active === t.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            background: "transparent", border: "none", cursor: "pointer",
            borderBottom: active === t.id ? "2px solid var(--color-text-primary)" : "2px solid transparent",
            marginBottom: -0.5,
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Chart helpers ────────────────────────────────────────────────────────────
const chartTooltipStyle = {
  background: "var(--color-background-primary)",
  border: "0.5px solid var(--color-border-tertiary)",
  borderRadius: 8, fontSize: 12, padding: "6px 10px",
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={chartTooltipStyle}>
      <p style={{ margin: "0 0 4px", color: "var(--color-text-secondary)", fontSize: 11 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: 0, color: p.color, fontWeight: 500 }}>
          {p.name}: {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Vista Live ───────────────────────────────────────────────────────────────
function LiveView({ data, alertLog }) {
  const latest = data[data.length - 1];
  if (!latest) return (
    <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-secondary)", fontSize: 14 }}>
      <i className="ti ti-satellite" style={{ fontSize: 32, display: "block", marginBottom: 8 }} aria-hidden="true" />
      Esperando datos del sensor…
    </div>
  );

  const tempColor =
    latest.temperature_c > 35 ? "#E24B4A" :
    latest.temperature_c < 10 ? "#185FA5" : "var(--color-text-primary)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Fila de métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        <MetricCard label="Temperatura" value={fmt(latest.temperature_c)} unit="°C" accent={tempColor} />
        <MetricCard label="Pitch" value={fmt(latest.pitch_deg)} unit="°"
          accent={latest.posture_ok ? "var(--color-text-success)" : "var(--color-text-danger)"} />
        <MetricCard label="Roll" value={fmt(latest.roll_deg)} unit="°"
          accent={Math.abs(latest.roll_deg) <= ROLL_MAX ? "var(--color-text-success)" : "var(--color-text-danger)"} />
        <MetricCard label="Viento" value={fmt(latest.wind_speed_kmh)} unit="km/h"
          accent={(WIND_STATUS_META[latest.wind_status] || {}).color} />
      </div>

      {/* Postura + Viento */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <PostureGauge pitch={latest.pitch_deg ?? 0} roll={latest.roll_deg ?? 0} />
        <WindCard windKmh={latest.wind_speed_kmh ?? 0} windStatus={latest.wind_status} />
      </div>

      {/* Gráfico pitch/roll en tiempo real */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem",
      }}>
        <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
          Postura en tiempo real
        </p>
        <div style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} interval="preserveStartEnd" />
              <YAxis domain={[-30, 30]} tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={PITCH_MAX} stroke="#E24B4A" strokeDasharray="4 2" strokeWidth={1} />
              <ReferenceLine y={PITCH_MIN} stroke="#E24B4A" strokeDasharray="4 2" strokeWidth={1} />
              <ReferenceLine y={ROLL_MAX}  stroke="#EF9F27" strokeDasharray="4 2" strokeWidth={1} />
              <ReferenceLine y={-ROLL_MAX} stroke="#EF9F27" strokeDasharray="4 2" strokeWidth={1} />
              <Line type="monotone" dataKey="pitch_deg" name="Pitch" stroke="#185FA5" dot={false} strokeWidth={1.5} isAnimationActive={false} />
              <Line type="monotone" dataKey="roll_deg"  name="Roll"  stroke="#EF9F27" dot={false} strokeWidth={1.5} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "var(--color-text-secondary)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 3, background: "#185FA5", borderRadius: 2 }} /> Pitch
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 3, background: "#EF9F27", borderRadius: 2 }} /> Roll
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 10, height: 3, background: "#E24B4A", borderRadius: 2, borderTop: "2px dashed #E24B4A" }} /> Límite pitch
          </span>
        </div>
      </div>

      {/* Viento live */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem",
      }}>
        <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
          Velocidad de viento
        </p>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={WIND_FAV}   stroke="#639922" strokeDasharray="4 2" strokeWidth={1} />
              <ReferenceLine y={WIND_CROSS} stroke="#E24B4A" strokeDasharray="4 2" strokeWidth={1} />
              <Area type="monotone" dataKey="wind_speed_kmh" name="Viento" stroke="#1D9E75" fill="rgba(29,158,117,0.12)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feed de alertas */}
      {alertLog.length > 0 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
            Alertas recientes
          </p>
          <AlertFeed alerts={alertLog} />
        </div>
      )}
    </div>
  );
}

// ─── Vista Historial ──────────────────────────────────────────────────────────
function HistoryView({ history }) {
  if (!history.length) return (
    <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-secondary)", fontSize: 14 }}>
      Sin datos de historial
    </div>
  );

  // Contar alertas por tipo
  const alertCounts = {};
  history.forEach(r => {
    (r.alerts || []).forEach(a => { alertCounts[a] = (alertCounts[a] || 0) + 1; });
  });
  const alertData = Object.entries(alertCounts).map(([type, count]) => ({
    name: (ALERT_META[type] || {}).label || type,
    count,
    fill: (ALERT_META[type] || {}).color || "#888780",
  }));

  // % tiempo con buena postura
  const postureOkPct = history.length
    ? Math.round(history.filter(r => r.posture_ok).length / history.length * 100) : 0;
  const avgTemp = history.length
    ? (history.reduce((s, r) => s + (r.temperature_c || 0), 0) / history.length).toFixed(1) : "—";
  const maxWind = history.length
    ? Math.max(...history.map(r => r.wind_speed_kmh || 0)).toFixed(1) : "—";
  const falls = history.filter(r => r.fall_detected).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        <MetricCard label="Postura correcta" value={`${postureOkPct}%`}
          accent={postureOkPct > 70 ? "var(--color-text-success)" : "var(--color-text-danger)"} />
        <MetricCard label="Temp. promedio" value={avgTemp} unit="°C" />
        <MetricCard label="Viento máx." value={maxWind} unit="km/h" />
        <MetricCard label="Posibles caídas" value={falls}
          accent={falls > 0 ? "var(--color-text-danger)" : "var(--color-text-success)"} />
      </div>

      {/* Postura en ruta */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem",
      }}>
        <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
          Postura durante la ruta
        </p>
        <div style={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} interval={Math.floor(history.length / 6)} />
              <YAxis domain={[-30, 30]} tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={PITCH_MAX} stroke="#E24B4A" strokeDasharray="4 2" strokeWidth={1} />
              <ReferenceLine y={PITCH_MIN} stroke="#E24B4A" strokeDasharray="4 2" strokeWidth={1} />
              <ReferenceLine y={0} stroke="var(--color-border-secondary)" strokeWidth={1} />
              <Line type="monotone" dataKey="pitch_deg" name="Pitch" stroke="#185FA5" dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="roll_deg"  name="Roll"  stroke="#EF9F27" dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribución de alertas */}
      {alertData.length > 0 && (
        <div style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem",
        }}>
          <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>
            Distribución de alertas
          </p>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={alertData} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Ocurrencias" radius={[0, 4, 4, 0]}
                  fill="#185FA5"
                  label={{ position: "right", fontSize: 11, fill: "var(--color-text-secondary)" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Temperatura + viento en ruta */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem",
        }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Temperatura</p>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: "var(--color-text-tertiary)" }} interval={Math.floor(history.length / 4)} />
                <YAxis tick={{ fontSize: 9, fill: "var(--color-text-tertiary)" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="temperature_c" name="Temp °C" stroke="#D85A30" fill="rgba(216,90,48,0.1)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)", padding: "1rem 1.25rem",
        }}>
          <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)" }}>Viento</p>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: "var(--color-text-tertiary)" }} interval={Math.floor(history.length / 4)} />
                <YAxis tick={{ fontSize: 9, fill: "var(--color-text-tertiary)" }} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={WIND_FAV}   stroke="#639922" strokeDasharray="3 2" strokeWidth={1} />
                <ReferenceLine y={WIND_CROSS} stroke="#E24B4A" strokeDasharray="3 2" strokeWidth={1} />
                <Area type="monotone" dataKey="wind_speed_kmh" name="km/h" stroke="#1D9E75" fill="rgba(29,158,117,0.1)" strokeWidth={1.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard principal ──────────────────────────────────────────────────────
export default function Dashboard() {
  const [tab, setTab]         = useState("live");
  const [liveData, setLiveData] = useState([]);
  const [history, setHistory]   = useState([]);
  const [alertLog, setAlertLog] = useState([]);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const timerRef = useRef(null);

  const processReadings = useCallback((readings) => {
    const mapped = readings.map(r => ({
      ...r,
      t: timeLabel(r.timestamp),
      alerts: normalizeAlerts(r.alerts),
    }));
    return mapped;
  }, []);

  const fetchData = useCallback(async () => {
    if (!BRIDGE_URL) {
      setConnected(false);
      return;
    }

    try {
      const res = await fetch(`${BRIDGE_URL}/api/readings`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const readings = json.data || json;
      if (!Array.isArray(readings) || readings.length === 0) return;

      setConnected(true);
      setLastUpdate(new Date());

      const processed = processReadings(readings);

      // Live: ventana deslizante de MAX_LIVE_PTS puntos
      setLiveData(prev => {
        const merged = [...prev, ...processed.slice(-(MAX_LIVE_PTS - prev.length))];
        return merged.slice(-MAX_LIVE_PTS);
      });

      // Historial completo (para replay/análisis)
      setHistory(prev => {
        const existingTs = new Set(prev.map(r => r.timestamp));
        const newItems   = processed.filter(r => !existingTs.has(r.timestamp));
        return [...prev, ...newItems].slice(-2000);
      });

      // Acumular alertas con timestamp
      readings.forEach(r => {
        (r.alerts || []).forEach(alertType => {
          setAlertLog(prev => {
            if (prev.length > 0 && prev[0].type === alertType &&
                new Date(r.timestamp) - new Date(prev[0].ts) < 3000) return prev;
            return [{ type: alertType, ts: r.timestamp }, ...prev].slice(0, 50);
          });
        });
      });

    } catch (e) {
      setConnected(false);
    }
  }, [processReadings]);

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, POLL_MS);
    return () => clearInterval(timerRef.current);
  }, [fetchData]);

  const latest = liveData[liveData.length - 1];
  const hasFall = alertLog.some(a => a.type === "FALL_DETECTED" &&
    new Date() - new Date(a.ts) < 30000);

  return (
    <div style={{ padding: "1.5rem", maxWidth: 820, margin: "0 auto" }}>
      <h2 className="sr-only">Dashboard Soplón — monitoreo aerodinámico en tiempo real para ciclistas</h2>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>
            <i className="ti ti-wind" style={{ marginRight: 8, fontSize: 20 }} aria-hidden="true" />
            Soplón
          </h1>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>
            Monitoreo aerodinámico · Casco
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {hasFall && (
            <span style={{
              fontSize: 12, padding: "4px 12px", borderRadius: "var(--border-radius-md)",
              background: "var(--color-background-danger)", color: "var(--color-text-danger)",
              fontWeight: 500, border: "0.5px solid var(--color-border-danger)",
              animation: "pulse 1s infinite",
            }}>
              <i className="ti ti-alert-triangle" style={{ marginRight: 4, fontSize: 13 }} aria-hidden="true" />
              ¡Caída detectada!
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)" }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: connected ? "#639922" : "#E24B4A",
              display: "inline-block",
            }} />
            {connected ? "En línea" : "Sin conexión"}
          </div>
          {lastUpdate && (
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
              {lastUpdate.toLocaleTimeString("es-CO")}
            </span>
          )}
        </div>
      </div>

      <TabBar
        tabs={[
          { id: "live",    label: "En vivo" },
          { id: "history", label: `Historial (${history.length})` },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "live"    && <LiveView    data={liveData} alertLog={alertLog} />}
      {tab === "history" && <HistoryView history={history} />}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.65; }
        }
        .sr-only {
          position: absolute; width: 1px; height: 1px;
          padding: 0; margin: -1px; overflow: hidden;
          clip: rect(0,0,0,0); white-space: nowrap; border: 0;
        }
      `}</style>
    </div>
  );
}