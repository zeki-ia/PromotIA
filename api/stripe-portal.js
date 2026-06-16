import Stripe from 'stripe'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()

  const { stripeCustomerId, returnUrl } = req.body || {}
  if (!stripeCustomerId) return res.status(400).json({ error: 'stripeCustomerId requerido' })

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl || process.env.APP_URL || 'https://app.promotia.talenio.tech',
    })
    return res.status(200).json({ url: session.url })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
