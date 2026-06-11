import Link from "next/link";

export default function BlockedPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 48, maxWidth: 420, textAlign: "center", border: "1px solid #E2E8F0" }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🚫</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1E293B", marginBottom: 8 }}>Tu plan fue suspendido</h2>
        <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
          No pudimos procesar el pago de tu suscripción. Tu acceso está temporalmente bloqueado.
        </p>
        <div style={{ background: "#FEF3C7", borderRadius: 10, padding: 14, marginBottom: 28, textAlign: "left", fontSize: 13, color: "#92400E" }}>
          ⚠️ Stripe intentó cobrar tu tarjeta pero el pago fue rechazado. Actualizá tu método de pago para continuar. Tus datos están seguros por 30 días.
        </div>
        <Link href="/billing"
          style={{ display: "block", background: "#10B981", color: "#fff", borderRadius: 8, padding: "12px 0", fontWeight: 600, fontSize: 14, textDecoration: "none", marginBottom: 10 }}>
          💳 Actualizar método de pago
        </Link>
        <p style={{ color: "#94A3B8", fontSize: 12 }}>¿Necesitás ayuda? soporte@promotia.app</p>
      </div>
    </div>
  );
}
