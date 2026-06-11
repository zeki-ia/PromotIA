"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (authError) { setError(authError.message); setLoading(false); return; }

    // 2. Crear empresa (placeholder — se completa en onboarding)
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({ name: "Mi Empresa", is_active: false })
      .select()
      .single();
    if (companyError) { setError("Error al crear empresa"); setLoading(false); return; }

    // 3. Crear perfil de usuario vinculado a la empresa
    await supabase.from("users").insert({
      id: authData.user.id,
      company_id: company.id,
      email,
      role: "admin",
    });

    // 4. Actualizar metadata con company_id
    await supabase.auth.updateUser({ data: { company_id: company.id, full_name: name } });

    router.push("/checkout");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: 380, border: "1px solid #E2E8F0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
          <div style={{ width: 30, height: 30, background: "#0F1E3C", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📊</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#0F1E3C" }}>PromotIA</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>Crear cuenta</h2>
        <p style={{ color: "#64748B", fontSize: 13, marginBottom: 24 }}>Empezá tu prueba gratuita de 14 días</p>

        <form onSubmit={handleRegister}>
          {[["Nombre completo", "text", name, setName, "Ezequiel López"],
            ["Email", "email", email, setEmail, "vos@empresa.com"],
            ["Contraseña", "password", password, setPassword, "••••••••"]].map(([label, type, val, set, ph]) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 5 }}>{label}</label>
              <input type={type} value={val} onChange={e => set(e.target.value)} required placeholder={ph}
                style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13, color: "#1E293B", outline: "none" }} />
            </div>
          ))}
          {error && <p style={{ color: "#EF4444", fontSize: 12, marginBottom: 12 }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: "100%", background: "#0F1E3C", color: "#fff", border: "none", borderRadius: 8, padding: "11px 0", fontWeight: 600, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "#64748B", marginTop: 18 }}>
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" style={{ color: "#059669", fontWeight: 600, textDecoration: "none" }}>Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}
