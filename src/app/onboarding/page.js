"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("tecnología");
  const [size, setSize] = useState("11-50");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const complete = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from("companies")
      .update({ name: companyName, industry, team_size: size, is_active: true })
      .eq("id", session.user.user_metadata?.company_id);
    router.push("/dashboard");
  };

  const steps = ["Tu empresa", "Configuración", "¡Listo!"];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ width: 460, background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 36 }}>
        {/* Progress */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: i < step ? "#10B981" : i === step ? "#0F1E3C" : "#E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: i <= step ? "#fff" : "#64748B" }}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i === step ? "#1E293B" : "#94A3B8", fontWeight: i === step ? 600 : 400 }}>{s}</span>
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: "#E2E8F0", margin: "0 10px" }} />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <div>
            <div style={{ fontSize: 36, marginBottom: 14 }}>🏢</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>¿Cómo se llama tu empresa?</h2>
            <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>Aparecerá en tus reportes y encuestas</p>
            <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Ej: Acme Corp"
              style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, color: "#1E293B", outline: "none", marginBottom: 8 }} />
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ fontSize: 36, marginBottom: 14 }}>⚙️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>Contanos un poco más</h2>
            <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>Para personalizar tu experiencia</p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 5 }}>Industria</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, color: "#1E293B", background: "#fff" }}>
                {["Tecnología", "Fintech", "SaaS", "E-commerce", "Salud", "Educación", "Retail", "Otro"].map(i => (
                  <option key={i} value={i.toLowerCase()}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 5 }}>Tamaño del equipo</label>
              <select value={size} onChange={e => setSize(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, color: "#1E293B", background: "#fff" }}>
                {["1-10", "11-50", "51-200", "201-500", "500+"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", marginBottom: 8 }}>¡Todo listo, {companyName}!</h2>
            <p style={{ color: "#64748B", fontSize: 14, marginBottom: 24 }}>Tu cuenta está configurada. Te esperan tus métricas NPS.</p>
            <div style={{ background: "#D1FAE5", borderRadius: 10, padding: 14, fontSize: 13, color: "#065F46", textAlign: "left" }}>
              ✓ Empresa creada · ✓ Plan activo · ✓ 14 días gratis
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28 }}>
          <button onClick={() => step > 0 && setStep(step - 1)}
            style={{ background: "none", border: "none", cursor: step > 0 ? "pointer" : "default", color: step > 0 ? "#64748B" : "transparent", fontSize: 13 }}>
            ← Anterior
          </button>
          <button
            onClick={() => step < 2 ? setStep(step + 1) : complete()}
            disabled={(step === 0 && !companyName.trim()) || loading}
            style={{ background: "#0F1E3C", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer", opacity: (step === 0 && !companyName.trim()) || loading ? 0.5 : 1 }}>
            {step === 2 ? (loading ? "Entrando..." : "Ir al dashboard →") : "Continuar →"}
          </button>
        </div>
      </div>
    </div>
  );
}
