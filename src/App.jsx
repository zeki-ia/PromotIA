import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import PromotIA from './PromotIA'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import CheckoutPage from './pages/Checkout'
import BlockedPage from './pages/Blocked'
import SurveyPage from './pages/Survey'
import ClientPortal from './pages/ClientPortal'

const C = { primary: '#73017B', magenta: '#E40993', surface: '#F7F2FA' }
const DISP = "'Quicksand','Trebuchet MS',sans-serif"

function LoadingScreen() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: C.surface, fontFamily: DISP }}>
      <div style={{ textAlign: 'center' }}>
        <svg width="52" height="52" viewBox="0 0 48 48" fill="none" style={{ marginBottom: 16 }}>
          <defs><linearGradient id="pg" x1="0" y1="48" x2="48" y2="0"><stop offset="0" stopColor="#52015A"/><stop offset="0.5" stopColor="#A8108F"/><stop offset="1" stopColor="#E40993"/></linearGradient></defs>
          <rect x="1.5" y="1.5" width="45" height="45" rx="13" fill="url(#pg)"/>
          <path d="M14 16h20a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H22l-6 5v-5h-2a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3Z" fill="#fff" opacity=".94"/>
          <path d="M24 28.5l-4.2-4c-1.2-1.15-1.1-3 .2-3.9 1.05-.72 2.45-.45 3.25.5l.75.9.75-.9c.8-.95 2.2-1.22 3.25-.5 1.3.9 1.4 2.75.2 3.9L24 28.5Z" fill="#E40993"/>
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#5E4E64', fontWeight: 600 }}>
          <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid #73017B55', borderTopColor: '#73017B', borderRadius: '50%', animation: 'spin .7s linear infinite' }}/>
          Cargando PromotIA…
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// Detectar rutas públicas antes de montar componentes con hooks
const path = window.location.pathname
const surveyMatch = path.match(/^\/encuesta\/(.+)/)
const portalMatch = path.match(/^\/portal\/(.+)/)

export default function App() {
  const [user, setUser] = useState(null)
  const [clientInfo, setClientInfo] = useState(null) // { clientCode, clientName } para viewers
  const [subscriptionStatus, setSubscriptionStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState('login') // login | register | checkout | blocked | app | portal

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); checkSubscription(session.user.id) }
      else setLoading(false)
    })
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) { setUser(session.user); checkSubscription(session.user.id) }
      else { setUser(null); setSubscriptionStatus(null); setPage('login'); setLoading(false) }
    })
    return () => authListener.unsubscribe()
  }, [])

  async function checkSubscription(userId) {
    try {
      const { data: userRow } = await supabase
        .from('users')
        .select('company_id, role, client_code, email')
        .eq('id', userId)
        .maybeSingle()

      // Admin Delenio — acceso directo (incluye cuando no hay row en users)
      if (!userRow || userRow?.role === 'admin') {
        setPage('app'); setLoading(false); return
      }

      // Viewer (cliente de Delenio) — va al portal con sus datos
      if (userRow?.role === 'viewer' && userRow?.client_code) {
        setClientInfo({ clientCode: userRow.client_code, clientName: userRow.email })
        setPage('portal'); setLoading(false); return
      }

      // Viewer sin client_code asignado — igual va al app (admin puede asignarle un cliente)
      if (userRow?.role === 'viewer') {
        setPage('app'); setLoading(false); return
      }

      if (!userRow?.company_id) {
        setSubscriptionStatus('none'); setPage('checkout'); setLoading(false); return
      }

      const { data: sub } = await supabase
        .from('subscriptions').select('status').eq('company_id', userRow.company_id).maybeSingle()
      const status = sub?.status || 'none'
      setSubscriptionStatus(status)
      setPage(!sub || status === 'canceled' || status === 'unpaid' ? 'blocked' : 'app')
    } catch (e) {
      console.error('checkSubscription error:', e)
      setPage('app')
    }
    setLoading(false)
  }

  async function handleLogout() { await supabase.auth.signOut() }

  // Rutas públicas — sin auth (después de todos los hooks)
  if (surveyMatch) return <SurveyPage clientId={surveyMatch[1]} />
  if (portalMatch) return <ClientPortal clientId={portalMatch[1]} onLogout={() => window.location.href = '/'} />

  if (loading) return <LoadingScreen />
  if (page === 'login') return <LoginPage onSuccess={() => setLoading(true)} onRegister={() => setPage('register')}/>
  if (page === 'register') return <RegisterPage onBack={() => setPage('login')} onSuccess={() => setLoading(true)}/>
  if (page === 'checkout') return <CheckoutPage user={user} onLogout={handleLogout}/>
  if (page === 'blocked') return <BlockedPage status={subscriptionStatus} onLogout={handleLogout} onRecheck={() => { setLoading(true); checkSubscription(user.id) }}/>
  if (page === 'portal') return <ClientPortal clientId={clientInfo?.clientCode} clientName={clientInfo?.clientName} onLogout={handleLogout}/>
  return <PromotIA autoAdmin={true} onLogout={handleLogout}/>
}
