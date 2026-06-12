// Stripe webhook — maneja eventos de pago y actualiza la suscripción en Supabase
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const config = { api: { bodyParser: false } }

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  )

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  const { type, data } = event

  if (type === 'checkout.session.completed') {
    const session = data.object
    const email = session.customer_details?.email
    const customerId = session.customer
    const subscriptionId = session.subscription

    if (!email) return res.json({ received: true })

    // Buscar el usuario por email en Supabase Auth
    const { data: { users } } = await supabase.auth.admin.listUsers()
    const authUser = users?.find(u => u.email === email)
    if (!authUser) return res.json({ received: true })

    // Crear empresa si no existe
    let { data: userRow } = await supabase
      .from('users')
      .select('company_id')
      .eq('id', authUser.id)
      .maybeSingle()

    let companyId = userRow?.company_id

    if (!companyId) {
      const companyName = authUser.user_metadata?.company_name || email.split('@')[1] || 'Mi empresa'
      const { data: company } = await supabase
        .from('companies')
        .insert({ name: companyName, stripe_customer_id: customerId, is_active: true })
        .select('id')
        .single()
      companyId = company.id

      await supabase
        .from('users')
        .upsert({ id: authUser.id, company_id: companyId, email, role: 'admin' })
    } else {
      await supabase
        .from('companies')
        .update({ stripe_customer_id: customerId, is_active: true })
        .eq('id', companyId)
    }

    // Obtener detalles de la suscripción para saber el plan
    let planId = 'start'
    if (subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId)
      const priceId = sub.items.data[0]?.price?.id
      if (priceId === process.env.STRIPE_PRICE_GROWTH) planId = 'growth'
      else if (priceId === process.env.STRIPE_PRICE_SCALE) planId = 'scale'
    }

    await supabase.from('subscriptions').upsert({
      company_id: companyId,
      stripe_subscription_id: subscriptionId,
      plan_id: planId,
      status: 'active',
      current_period_end: subscriptionId
        ? new Date((await stripe.subscriptions.retrieve(subscriptionId)).current_period_end * 1000)
        : null,
      updated_at: new Date(),
    }, { onConflict: 'company_id' })
  }

  if (type === 'invoice.payment_succeeded') {
    const invoice = data.object
    const subscriptionId = invoice.subscription
    if (!subscriptionId) return res.json({ received: true })
    const sub = await stripe.subscriptions.retrieve(subscriptionId)
    await supabase
      .from('subscriptions')
      .update({ status: 'active', current_period_end: new Date(sub.current_period_end * 1000), updated_at: new Date() })
      .eq('stripe_subscription_id', subscriptionId)
  }

  if (type === 'invoice.payment_failed') {
    const invoice = data.object
    const subscriptionId = invoice.subscription
    if (!subscriptionId) return res.json({ received: true })
    await supabase
      .from('subscriptions')
      .update({ status: 'past_due', updated_at: new Date() })
      .eq('stripe_subscription_id', subscriptionId)
    // Bloquear empresa
    const { data: sub } = await supabase.from('subscriptions').select('company_id').eq('stripe_subscription_id', subscriptionId).single()
    if (sub) await supabase.from('companies').update({ is_active: false }).eq('id', sub.company_id)
  }

  if (type === 'customer.subscription.deleted') {
    const subscription = data.object
    await supabase
      .from('subscriptions')
      .update({ status: 'canceled', updated_at: new Date() })
      .eq('stripe_subscription_id', subscription.id)
    const { data: sub } = await supabase.from('subscriptions').select('company_id').eq('stripe_subscription_id', subscription.id).single()
    if (sub) await supabase.from('companies').update({ is_active: false }).eq('id', sub.company_id)
  }

  res.json({ received: true })
}
