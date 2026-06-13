export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).end()

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
  if (!SUPABASE_URL || !SERVICE_KEY) return res.status(500).json({ error: 'Env vars no configuradas' })

  try {
    // Traer todos los usuarios de la tabla users (roles)
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/users?select=id,email,role,client_code`, {
      headers: { Authorization: `Bearer ${SERVICE_KEY}`, apikey: SERVICE_KEY },
    })
    const dbUsers = await dbRes.json()
    if (!dbRes.ok) return res.status(500).json({ error: dbUsers.message || 'Error al leer users' })

    // Traer lista de auth.users para nombre y fecha de creación
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=1000`, {
      headers: { Authorization: `Bearer ${SERVICE_KEY}`, apikey: SERVICE_KEY },
    })
    const authData = await authRes.json()
    const authUsers = authData.users || []

    // Partir desde auth.users para incluir TODOS (incluso los sin fila en tabla users)
    const merged = authUsers.map(auth => {
      const u = (dbUsers || []).find(r => r.id === auth.id)
      return {
        id: auth.id,
        email: auth.email || '',
        name: auth.user_metadata?.name || auth.email?.split('@')[0] || '',
        role: u?.role === 'admin' ? 'Admin' : u?.role === 'viewer' ? 'Cliente' : 'Admin',
        clientCode: u?.client_code || '',
        createdAt: auth.created_at || '',
        lastSignIn: auth.last_sign_in_at || '',
        confirmed: !!auth.email_confirmed_at,
      }
    })

    return res.status(200).json({ users: merged })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
