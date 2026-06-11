"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MONTHLY = [
  { m: "Ene", n: 28 }, { m: "Feb", n: 31 }, { m: "Mar", n: 35 },
  { m: "Abr", n: 29 }, { m: "May", n: 38 }, { m: "Jun", n: 42 },
];

const COMMENTS = [
  { score: 9, text: "El soporte es excelente, responden muy rápido.", type: "promoter" },
  { score: 10, text: "Increíble plataforma, nos ahorró horas de trabajo.", type: "promoter" },
  { score: 4, text: "La integración con nuestro CRM fue complicada.", type: "detractor" },
  { score: 7, text: "Buena herramienta pero falta documentación.", type: "passive" },
];

export default function DashboardView() {
  const pPct = 43, dPct = 29, paPct = 28;

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", margin: 0 }}>Dashboard NPS</h1>
        <p style={{ color: "#64748B", fontSize: 13, marginTop: 3 }}>Junio 2025 · 247 respuestas totales</p>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { l: "NPS Score", v: "42", s: "+8 vs mes anterior", ico: "📈", bg: "#D1FAE5" },
          { l: "Promotores", v: pPct + "%", s: "Score 9-10", ico: "⭐", bg: "#D1FAE5" },
          { l: "Pasivos", v: paPct + "%", s: "Score 7-8", ico: "👥", bg: "#FEF3C7" },
          { l: "Detractores", v: dPct + "%", s: "Score 0-6", ico: "⚠️", bg: "#FEE2E2" },
        ].map(({ l, v, s, ico, bg }) => (
          <div key={l} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 11, color: "#64748B", fontWeight: 500 }}>{l}</p>
              <div style={{ width: 30, height: 30, background: bg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{ico}</div>
            </div>
            <p style={{ margin: "0 0 3px", fontSize: 26, fontWeight: 700, color: "#1E293B" }}>{v}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#64748B" }}>{s}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 18, marginBottom: 24 }}>
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "#1E293B" }}>Evolución del NPS</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 60]} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
              <Line type="monotone" dataKey="n" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 22 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "#1E293B" }}>Distribución</h3>
          {[{ l: "Promotores", p: pPct, c: "#10B981" }, { l: "Pasivos", p: paPct, c: "#F59E0B" }, { l: "Detractores", p: dPct, c: "#EF4444" }].map(({ l, p, c }) => (
            <div key={l} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: "#334155" }}>{l}</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{p}%</span>
              </div>
              <div style={{ height: 5, background: "#F1F5F9", borderRadius: 3 }}>
                <div style={{ width: p + "%", height: "100%", background: c, borderRadius: 3 }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 18, padding: 12, background: "#D1FAE5", borderRadius: 10, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#059669" }}>42</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#059669", fontWeight: 500 }}>NPS actual</p>
          </div>
        </div>
      </div>

      {/* Recent comments */}
      <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 22 }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 600, color: "#1E293B" }}>Respuestas recientes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {COMMENTS.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", background: "#F8FAFC", borderRadius: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700,
                background: c.type === "promoter" ? "#D1FAE5" : c.type === "detractor" ? "#FEE2E2" : "#FEF3C7",
                color: c.type === "promoter" ? "#059669" : c.type === "detractor" ? "#EF4444" : "#92400E" }}>{c.score}</div>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: "#334155", lineHeight: 1.5 }}>{c.text}</p>
                <span style={{ fontSize: 11, fontWeight: 500, color: c.type === "promoter" ? "#059669" : c.type === "detractor" ? "#EF4444" : "#92400E" }}>{c.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
