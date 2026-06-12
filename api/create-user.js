export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, password, role, clientCode } = req.body || {}

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
  }

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

  if (!SUPABASE_URL || !SERVICE_KEY) {
    return res.status(500).json({ error: 'Variables de entorno SUPABASE_URL o SUPABASE_SERVICE_KEY no configuradas' })
  }

  try {
    // 1. Crear usuario en Supabase Auth via REST Admin API
    const authRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
        user_metadata: { name: name || '' },
      }),
    })

    const authData = await authRes.json()

    if (!authRes.ok) {
      return res.status(400).json({ error: authData.message || authData.msg || 'Error al crear usuario en Auth' })
    }

    const userId = authData.id

    // 2. Insertar en tabla users
    const supabaseRole = role === 'Admin' ? 'admin' : 'viewer'
    const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        id: userId,
        email,
        role: supabaseRole,
        client_code: clientCode || null,
      }),
    })

    if (!dbRes.ok) {
      const dbErr = await dbRes.text()
      return res.status(500).json({ error: 'Usuario creado en Auth pero error en tabla users: ' + dbErr })
    }

    return res.status(200).json({ ok: true, userId })

  } catch (e) {
    return res.status(500).json({ error: 'Error interno: ' + e.message })
  }
}
