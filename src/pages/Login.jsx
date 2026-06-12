import { useState } from 'react'
import { supabase } from '../lib/supabase'

const C = {
  bg: '#FFFFFF', surface: '#F7F2FA', line: '#E7DEEC', tx: '#1A0A1C', tx2: '#5E4E64', tx3: '#A99BB0',
  primary: '#73017B', magenta: '#E40993', lila3: '#EFD9F1',
  grad: 'linear-gradient(120deg,#73017B 0%,#A8108F 55%,#E40993 100%)',
  gradHero: 'linear-gradient(125deg,#0c01a4 0%,#52015A 38%,#73017B 64%,#E40993 100%)',
  criticoBg: '#FCE7E5', critico: '#E5564B', excBg: '#E0F3EA', exc: '#1E9E6A',
}
const DISP = "'Quicksand','Trebuchet MS',sans-serif"
const BODY = "'Archivo','Segoe UI',system-ui,-apple-system,sans-serif"

function Mark({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id="pg2" x1="0" y1="48" x2="48" y2="0"><stop offset="0" stopColor="#52015A"/><stop offset="0.5" stopColor="#A8108F"/><stop offset="1" stopColor="#E40993"/></linearGradient></defs>
      <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="url(#pg2)"/>
      <path d="M14 16h20a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H22l-6 5v-5h-2a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3Z" fill="#fff" opacity=".94"/>
      <path d="M24 28.5l-4.2-4c-1.2-1.15-1.1-3 .2-3.9 1.05-.72 2.45-.45 3.25.5l.75.9.75-.9c.8-.95 2.2-1.22 3.25-.5 1.3.9 1.4 2.75.2 3.9L24 28.5Z" fill="#E40993"/>
    </svg>
  )
}

export default function LoginPage({ onSuccess, onRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError('Email o contraseña incorrectos.')
      setLoading(false)
    } else {
      onSuccess()
    }
  }

  const inp = { width: '100%', padding: '11px 13px', borderRadius: 11, border: `1px solid ${C.line}`, fontSize: 14, fontFamily: BODY, color: C.tx, background: '#fff', boxSizing: 'border-box', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', fontFamily: BODY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&family=Archivo:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box}
        @keyframes spin{to{transform:rotate(360deg)}}
        input:focus{outline:none;border-color:${C.primary}!important;box-shadow:0 0 0 3px ${C.lila3}!important}
        @media(max-width:700px){.login-grid{grid-template-columns:1fr!important}.login-left{display:none!important}}
      `}</style>

      {/* Left panel */}
      <div className="login-left" style={{ background: C.gradHero, color: '#fff', padding: '56px 54px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -80, top: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }}/>
        <div style={{ position: 'absolute', left: -50, bottom: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.07)' }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Mark size={44}/>
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: DISP, fontWeight: 700, fontSize: 26, color: '#fff' }}>Promot<span style={{ color: '#F46BC2' }}>IA</span></div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.8)', fontWeight: 600, letterSpacing: .3, marginTop: 2 }}>NPS B2B · by Delenio People</div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <svg width="100%" height="64" viewBox="0 0 380 64" style={{ marginBottom: 26, opacity: .9 }}>
            <path d="M0 48 H60 L88 18 L120 50 L150 30 H210 L238 12 L268 44 L298 26 H380" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={{ fontFamily: DISP, fontSize: 34, fontWeight: 700, margin: 0, lineHeight: 1.1 }}>El NPS de tus clientes B2B,<br/>medido mes a mes.</h1>
          <p style={{ fontSize: 15, opacity: .9, lineHeight: 1.6, marginTop: 16, maxWidth: 430 }}>Una sola pregunta, la metodología NPS de siempre. Dashboards, voz del cliente con IA y planes de acción para subir tu score.</p>
        </div>
        <div style={{ fontSize: 12.5, opacity: .8 }}>Un microservicio de Delenio People · delenio.net</div>
      </div>

      {/* Right panel */}
      <div style={{ display: 'grid', placeItems: 'center', padding: 40, background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ fontSize: 13, color: C.tx3, fontWeight: 700, marginBottom: 6, fontFamily: DISP }}>BIENVENIDO</div>
          <h2 style={{ fontFamily: DISP, fontSize: 26, fontWeight: 700, margin: '0 0 4px', color: C.tx }}>Ingresá a PromotIA</h2>
          <p style={{ fontSize: 13.5, color: C.tx2, margin: '0 0 28px' }}>Usá tu email y contraseña.</p>

          <form onSubmit={handleLogin}>
            <label style={{ display: 'block', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.tx2, marginBottom: 6 }}>Email</div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="tu@empresa.com" style={inp}/>
            </label>
            <label style={{ display: 'block', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.tx2, marginBottom: 6 }}>Contraseña</div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={inp}/>
            </label>

            {error && (
              <div style={{ background: C.criticoBg, color: C.critico, borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', borderRadius: 11, border: 'none', background: C.grad, color: '#fff', fontFamily: DISP, fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading && <span style={{ width: 16, height: 16, border: '2px solid #fff5', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }}/>}
              {loading ? 'Ingresando…' : 'Ingresar'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 22 }}>
            <span style={{ fontSize: 13.5, color: C.tx2 }}>¿No tenés cuenta? </span>
            <button onClick={onRegister} style={{ background: 'none', border: 'none', color: C.primary, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: BODY }}>Registrate</button>
          </div>
        </div>
      </div>
    </div>
  )
}
