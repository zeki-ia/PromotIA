"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function BillingView() {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from("subscriptions")
        .select("*, plans(name, price)")
        .eq("company_id", session.user.user_metadata?.company_id)
        .single();
      setSub(data);
      setLoading(false);
    })();
  }, []);

  const openPortal = async () => {
    const res = await fetch("/api/billing-portal", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
  };

  if (loading) return <div style={{ padding: 32 }}>Cargando...</div>;

  return (
    <div style={{ padding: 28, maxWidth: 600 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>Facturación</h1>
      <p style={{ color: "#64748B", fontSize: 13, marginBottom: 28 }}>Gestioná tu suscripción y método de pago</p>

      {sub ? (
        <>
          <div style={{ background: "#fff", border: "2px solid #10B981", borderRadius: 14, padding: 22, marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 11, color: "#64748B", fontWeight: 500 }}>PLAN ACTUAL</p>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Plan {sub.plans?.name || sub.plan_id}</h2>
              </div>
              <span style={{ background: sub.status === "active" ? "#D1FAE5" : "#FEE2E2", color: sub.status === "active" ? "#059669" : "#EF4444", fontWeight: 600, fontSize: 12, padding: "4px 12px", borderRadius: 20 }}>
                {sub.status === "active" ? "✓ Activo" : "⚠ Suspendido"}
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, paddingTop: 14, borderTop: "1px solid #E2E8F0" }}>
              {[
                { l: "Precio", v: `$${sub.plans?.price || "—"}/mes` },
                { l: "Próxima renovación", v: sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString("es-AR") : "—" },
                { l: "Estado", v: sub.status === "active" ? "Al día" : "Fallido" },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p style={{ margin: "0 0 3px", fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>{l}</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{v}</p>
                </div>
              ))}
            </div>
          </div>

          <button onClick={openPortal}
            style={{ background: "#0F1E3C", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
            💳 Gestionar suscripción en Stripe
          </button>
          <p style={{ color: "#94A3B8", fontSize: 11, marginTop: 10 }}>Se abre el portal de Stripe donde podés actualizar tarjeta, cambiar plan o cancelar.</p>
        </>
      ) : (
        <div style={{ background: "#FEF3C7", borderRadius: 12, padding: 20 }}>
          <p style={{ color: "#92400E", fontSize: 13 }}>No tenés suscripción activa. <a href="/checkout" style={{ color: "#92400E", fontWeight: 600 }}>Elegí un plan →</a></p>
        </div>
      )}
    </div>
  );
}
