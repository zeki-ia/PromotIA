import { useState } from 'react'
import { supabase } from '../lib/supabase'

const C = {
  line: '#E7DEEC', tx: '#1A0A1C', tx2: '#5E4E64', tx3: '#A99BB0',
  primary: '#73017B', magenta: '#E40993', lila3: '#EFD9F1',
  grad: 'linear-gradient(120deg,#73017B 0%,#A8108F 55%,#E40993 100%)',
  criticoBg: '#FCE7E5', critico: '#E5564B', excBg: '#E0F3EA', exc: '#1E9E6A',
}
const DISP = "'Quicksand','Trebuchet MS',sans-serif"
const BODY = "'Archivo','Segoe UI',system-ui,-apple-system,sans-serif"

export default function RegisterPage({ onBack, onSuccess }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    setLoading(true)

    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name, company_name: form.company }
      }
    })

    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  const inp = { width: '100%', padding: '11px 13px', borderRadius: 11, border: `1px solid ${C.line}`, fontSize: 14, fontFamily: BODY, color: C.tx, background: '#fff', boxSizing: 'border-box' }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#F7F2FA', fontFamily: BODY, padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Archivo:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box}
        @keyframes spin{to{transform:rotate(360deg)}}
        input:focus{outline:none;border-color:${C.primary}!important;box-shadow:0 0 0 3px ${C.lila3}!important}
      `}</style>

      <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: '100%', maxWidth: 460, boxShadow: '0 20px 60px -20px rgba(115,1,123,.2)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: C.tx3, cursor: 'pointer', fontSize: 13, fontFamily: BODY, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 5 }}>← Volver</button>

        <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 24, marginBottom: 4, color: C.tx }}>Crear cuenta</div>
        <p style={{ fontSize: 13.5, color: C.tx2, margin: '0 0 24px' }}>Después de registrarte elegís tu plan.</p>

        <form onSubmit={handleRegister}>
          <label style={{ display: 'block', marginBottom: 13 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.tx2, marginBottom: 6 }}>Nombre completo</div>
            <input value={form.name} onChange={set('name')} required placeholder="Juan Pérez" style={inp}/>
          </label>
          <label style={{ display: 'block', marginBottom: 13 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.tx2, marginBottom: 6 }}>Empresa</div>
            <input value={form.company} onChange={set('company')} required placeholder="Mi empresa S.A." style={inp}/>
          </label>
          <label style={{ display: 'block', marginBottom: 13 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.tx2, marginBottom: 6 }}>Email</div>
            <input type="email" value={form.email} onChange={set('email')} required placeholder="tu@empresa.com" style={inp}/>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 13 }}>
            <label style={{ display: 'block' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.tx2, marginBottom: 6 }}>Contraseña</div>
              <input type="password" value={form.password} onChange={set('password')} required placeholder="min. 8 caracteres" style={inp}/>
            </label>
            <label style={{ display: 'block' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.tx2, marginBottom: 6 }}>Confirmar</div>
              <input type="password" value={form.confirm} onChange={set('confirm')} required placeholder="Repetir contraseña" style={inp}/>
            </label>
          </div>

          {error && (
            <div style={{ background: C.criticoBg, color: C.critico, borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: C.grad, color: '#fff', fontFamily: DISP, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading && <span style={{ width: 16, height: 16, border: '2px solid #fff5', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }}/>}
            {loading ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}
