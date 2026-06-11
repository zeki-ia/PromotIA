"use client";
import { useState, useCallback } from "react";

const COMMENTS = [
  { score: 9, text: "El soporte es excelente, responden muy rápido." },
  { score: 10, text: "Increíble plataforma, nos ahorró horas de trabajo mensualmente." },
  { score: 4, text: "La integración con nuestro CRM fue complicada y tardó semanas." },
  { score: 2, text: "El precio no justifica las funcionalidades actuales." },
  { score: 7, text: "Buena herramienta pero falta documentación más detallada." },
  { score: 8, text: "El onboarding podría ser más guiado para usuarios no técnicos." },
];

export default function InsightsView() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: COMMENTS }),
      });
      const data = await res.json();
      setInsights(data);
    } catch {
      setError("Error al generar insights. Intentá de nuevo.");
    }
    setLoading(false);
  }, []);

  return (
    <div style={{ padding: 28 }}>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", margin: 0 }}>Insights con IA</h1>
          <p style={{ color: "#64748B", fontSize: 13, marginTop: 3 }}>Claude analiza tus comentarios y te dice qué hacer</p>
        </div>
        <button onClick={generate} disabled={loading}
          style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Analizando..." : "💡 Generar insights"}
        </button>
      </div>

      {!insights && !loading && (
        <div style={{ textAlign: "center", padding: "60px 40px", background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💡</div>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: "#1E293B", marginBottom: 6 }}>Análisis IA de tus respuestas NPS</h2>
          <p style={{ color: "#64748B", fontSize: 13, maxWidth: 360, margin: "0 auto 20px" }}>Claude lee todos los comentarios y genera recomendaciones concretas para mejorar tu NPS.</p>
          <button onClick={generate} style={{ background: "#0F1E3C", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            Analizar ahora
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 40px", background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚙️</div>
          <p style={{ color: "#334155", fontSize: 14, fontWeight: 500 }}>Claude está analizando {COMMENTS.length} comentarios...</p>
          <p style={{ color: "#94A3B8", fontSize: 12 }}>Esto puede tardar unos segundos</p>
        </div>
      )}

      {error && (
        <div style={{ background: "#FEE2E2", border: "1px solid #FECACA", borderRadius: 12, padding: 16, color: "#991B1B", fontSize: 13 }}>{error}</div>
      )}

      {insights && (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#0F1E3C", borderRadius: 14, padding: 22, display: "flex", gap: 14 }}>
            <div style={{ fontSize: 28 }}>📊</div>
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>RESUMEN EJECUTIVO</p>
              <p style={{ margin: 0, color: "#fff", fontSize: 15, fontWeight: 500, lineHeight: 1.5 }}>{insights.resumen}</p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1E293B" }}>Puntos fuertes</h3>
              </div>
              {insights.positivos?.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 7, padding: "9px 11px", background: "#D1FAE5", borderRadius: 8, marginBottom: 6, fontSize: 12, color: "#065F46" }}>
                  <span>✓ </span>{p}
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 16 }}>🔴</span>
                <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1E293B" }}>Problemas detectados</h3>
              </div>
              {insights.problemas?.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 7, padding: "9px 11px", background: "#FEE2E2", borderRadius: 8, marginBottom: 6, fontSize: 12, color: "#991B1B" }}>
                  <span>✗ </span>{p}
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 16 }}>🎯</span>
              <h3 style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1E293B" }}>Acciones recomendadas</h3>
            </div>
            {insights.acciones?.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", border: "1px solid #E2E8F0", borderRadius: 10, marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#0F1E3C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{i + 1}</div>
                <p style={{ margin: 0, fontSize: 12, color: "#334155", flex: 1 }}>{a.accion}</p>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: a.impacto === "alto" ? "#D1FAE5" : "#FEF3C7", color: a.impacto === "alto" ? "#059669" : "#92400E" }}>
                  {a.impacto?.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
