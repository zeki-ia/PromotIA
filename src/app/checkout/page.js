"use client";
import { useState } from "react";
import { PLANS } from "@/lib/stripe";

export default function CheckoutPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId: selectedPlan }),
    });
    const { url, error } = await res.json();
    if (error) { alert(error); setLoading(false); return; }
    window.location.href = url; // Redirige a Stripe Checkout
  };

  const plan = PLANS.find(p => p.id === selectedPlan);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ width: 460, background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{ width: 28, height: 28, background: "#0F1E3C", borderRadius: 7, fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>📊</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#0F1E3C" }}>PromotIA</span>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>Elegí tu plan</h2>
        <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>14 días gratis, luego se cobra mensualmente</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {PLANS.map(p => (
            <div key={p.id} onClick={() => setSelectedPlan(p.id)}
              style={{ border: `2px solid ${selectedPlan === p.id ? "#10B981" : "#E2E8F0"}`, borderRadius: 10, padding: "13px 16px", cursor: "pointer", background: selectedPlan === p.id ? "#D1FAE5" : "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: "#1E293B", fontSize: 14 }}>{p.name} {p.popular ? "⭐" : ""}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#64748B" }}>{p.features[0]} · {p.features[1]}</p>
              </div>
              <div>
                <span style={{ fontWeight: 700, color: "#1E293B", fontSize: 18 }}>${p.price}</span>
                <span style={{ color: "#94A3B8", fontSize: 11 }}>/mes</span>
              </div>
            </div>
          ))}
        </div>

        <button onClick={handleCheckout} disabled={loading}
          style={{ width: "100%", background: "#0F1E3C", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Redirigiendo a Stripe..." : `Continuar con Plan ${plan?.name} →`}
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", marginTop: 10 }}>🔒 Pago seguro con Stripe · Cancelá en cualquier momento</p>
      </div>
    </div>
  );
}
