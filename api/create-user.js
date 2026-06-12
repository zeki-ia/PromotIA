import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, password, role, clientCode } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' })
  if (password.length < 6) return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

  // Crear usuario en Supabase Auth (sin email de confirmación)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  })

  if (authError) return res.status(400).json({ error: authError.message })

  const userId = authData.user.id
  const supabaseRole = role === 'Admin' ? 'admin' : 'viewer'

  // Insertar en tabla users
  const { error: dbError } = await supabase.from('users').upsert({
    id: userId,
    email,
    role: supabaseRole,
    client_code: clientCode || null,
  })

  if (dbError) return res.status(500).json({ error: dbError.message })

  return res.status(200).json({ ok: true, userId })
}
