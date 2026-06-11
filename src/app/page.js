import Link from "next/link";
import { PLANS } from "@/lib/plans";

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* Nav */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 48px", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, background: "#fff", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "#0F1E3C", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📊</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#0F1E3C" }}>PromotIA</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login" style={{ padding: "8px 16px", color: "#64748B", textDecoration: "none", fontSize: 13, fontWeight: 500 }}>Ingresar</Link>
          <Link href="/register" style={{ padding: "8px 18px", background: "#0F1E3C", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>Empezar gratis →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "80px 24px 60px", maxWidth: 680, margin: "0 auto" }}>
        <div style={{ display: "inline-block", background: "#D1FAE5", color: "#059669", fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 20, marginBottom: 20 }}>
          ✦ 14 días gratis · Sin tarjeta de crédito
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: "#0F1E3C", lineHeight: 1.15, margin: "0 0 20px" }}>
          Medí tu NPS y actuá<br />
          <span style={{ color: "#10B981" }}>antes de perder clientes</span>
        </h1>
        <p style={{ fontSize: 17, color: "#64748B", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
          PromotIA analiza las respuestas de tus clientes B2B con IA y te dice exactamente qué hacer para mejorar tu retención.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/register" style={{ padding: "14px 28px", background: "#0F1E3C", color: "#fff", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 700 }}>
            Empezar gratis →
          </Link>
          <Link href="#precios" style={{ padding: "14px 28px", background: "#F1F5F9", color: "#334155", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
            Ver precios
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "#F8FAFC", padding: "60px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: "#0F1E3C", marginBottom: 40 }}>Todo lo que necesitás en un solo lugar</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { ico: "📈", t: "Dashboard en tiempo real", d: "Seguí tu NPS, promotores y detractores con gráficos claros y actualizados." },
              { ico: "💡", t: "Insights con IA", d: "Claude analiza los comentarios y te da acciones concretas para mejorar." },
              { ico: "🔔", t: "Alertas automáticas", d: "Recibís un aviso cuando el NPS baja o aparece un detractor importante." },
            ].map(({ ico, t, d }) => (
              <div key={t} style={{ background: "#fff", borderRadius: 14, padding: 24, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{ico}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1E293B", margin: "0 0 8px" }}>{t}</h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, margin: 0 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precios" style={{ padding: "70px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: "#0F1E3C", marginBottom: 8 }}>Precios simples y transparentes</h2>
          <p style={{ textAlign: "center", color: "#64748B", fontSize: 14, marginBottom: 44 }}>Todos los planes incluyen 14 días gratis</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { name: "Start", price: 49, features: ["1 encuesta activa", "100 respuestas/mes", "Dashboard básico", "Soporte por email"], popular: false },
              { name: "Growth", price: 149, features: ["5 encuestas activas", "500 respuestas/mes", "Insights con IA", "Exportar reportes", "Soporte prioritario"], popular: true },
              { name: "Scale", price: 399, features: ["Encuestas ilimitadas", "Respuestas ilimitadas", "IA avanzada", "API access", "White-label", "Soporte dedicado"], popular: false },
            ].map(({ name, price, features, popular }) => (
              <div key={name} style={{ border: `2px solid ${popular ? "#10B981" : "#E2E8F0"}`, borderRadius: 16, padding: 28, position: "relative", background: popular ? "#F0FDF4" : "#fff" }}>
                {popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#10B981", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 14px", borderRadius: 20 }}>MÁS POPULAR</div>}
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: "0 0 6px" }}>{name}</h3>
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, color: "#0F1E3C" }}>${price}</span>
                  <span style={{ color: "#94A3B8", fontSize: 13 }}>/mes</span>
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                  {features.map(f => (
                    <li key={f} style={{ fontSize: 13, color: "#334155", padding: "5px 0", borderBottom: "1px solid #F1F5F9", display: "flex", gap: 7 }}>
                      <span style={{ color: "#10B981" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{ display: "block", textAlign: "center", padding: "11px 0", background: popular ? "#0F1E3C" : "#F1F5F9", color: popular ? "#fff" : "#334155", borderRadius: 8, textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
                  Empezar gratis →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #E2E8F0", padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 22, height: 22, background: "#0F1E3C", borderRadius: 5, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>📊</div>
          <span style={{ fontWeight: 700, fontSize: 13, color: "#0F1E3C" }}>PromotIA</span>
        </div>
        <p style={{ color: "#94A3B8", fontSize: 12, margin: 0 }}>© 2025 PromotIA · soporte@promotia.app</p>
      </footer>
    </div>
  );
}
