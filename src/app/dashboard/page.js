"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardView from "@/components/DashboardView";
import InsightsView from "@/components/InsightsView";
import BillingView from "@/components/BillingView";

export default function DashboardPage() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar activeTab={tab} onTab={setTab} />
      <div style={{ flex: 1, background: "#F8FAFC", overflowY: "auto" }}>
        {tab === "dashboard" && <DashboardView />}
        {tab === "insights" && <InsightsView />}
        {tab === "billing" && <BillingView />}
        {tab === "settings" && (
          <div style={{ padding: 32 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B" }}>Configuración</h1>
            <p style={{ color: "#64748B", marginTop: 8 }}>Próximamente: gestión de usuarios, roles y notificaciones.</p>
          </div>
        )}
      </div>
    </div>
  );
}
