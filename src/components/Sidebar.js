"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const items = [
  { id: "dashboard", ico: "📊", label: "Dashboard" },
  { id: "insights", ico: "💡", label: "Insights IA" },
  { id: "billing", ico: "💳", label: "Facturación" },
  { id: "settings", ico: "⚙️", label: "Configuración" },
];

export default function Sidebar({ activeTab, onTab }) {
  const router = useRouter();
  const supabase = createClient();

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{ width: 210, background: "#0F1E3C", minHeight: "100vh", display: "flex", flexDirection: "column", flexShrink: 0 }}>
      <div style={{ padding: "18px 18px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 26, height: 26, background: "#10B981", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>📊</div>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>PromotIA</span>
        </div>
      </div>

      <nav style={{ padding: "10px 10px", flex: 1 }}>
        {items.map(({ id, ico, label }) => (
          <button key={id} onClick={() => onTab(id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", marginBottom: 2,
              background: activeTab === id ? "rgba(16,185,129,0.15)" : "transparent",
              color: activeTab === id ? "#10B981" : "rgba(255,255,255,0.6)",
              fontSize: 12, fontWeight: activeTab === id ? 600 : 400,
              borderLeft: activeTab === id ? "3px solid #10B981" : "3px solid transparent" }}>
            {ico} {label}
          </button>
        ))}
      </nav>

      <div style={{ padding: "10px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <button onClick={logout}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", background: "transparent", color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
          🚪 Cerrar sesión
        </button>
      </div>
    </div>
  );
}
