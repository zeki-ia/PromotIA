import { stripe, PLANS } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { planId } = await request.json();
  const supabase = createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return NextResponse.json({ error: "Plan inválido" }, { status: 400 });

  // Buscar o crear customer en Stripe
  const { data: company } = await supabase
    .from("companies")
    .select("stripe_customer_id")
    .eq("id", session.user.user_metadata?.company_id)
    .single();

  let customerId = company?.stripe_customer_id;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { company_id: session.user.user_metadata?.company_id },
    });
    customerId = customer.id;
    await supabase
      .from("companies")
      .update({ stripe_customer_id: customerId })
      .eq("id", session.user.user_metadata?.company_id);
  }

  // Crear sesión de Stripe Checkout
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    mode: "subscription",
    subscription_data: { trial_period_days: 14 },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    metadata: {
      company_id: session.user.user_metadata?.company_id,
      plan_id: planId,
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
