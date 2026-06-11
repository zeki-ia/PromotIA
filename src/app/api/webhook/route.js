import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Cliente con SERVICE KEY para operaciones de webhook (bypasea RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${err.message}` }, { status: 400 });
  }

  const session = event.data.object;

  switch (event.type) {
    // Pago exitoso → activar suscripción
    case "checkout.session.completed": {
      const companyId = session.metadata?.company_id;
      const planId = session.metadata?.plan_id;
      const subId = session.subscription;

      await supabaseAdmin.from("subscriptions").upsert({
        company_id: companyId,
        stripe_subscription_id: subId,
        status: "active",
        plan_id: planId,
        current_period_end: new Date(session.expires_at * 1000).toISOString(),
      });

      await supabaseAdmin.from("companies")
        .update({ is_active: true, plan_id: planId })
        .eq("id", companyId);
      break;
    }

    // Renovación exitosa → mantener activo
    case "invoice.payment_succeeded": {
      const subId = session.subscription;
      const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("company_id")
        .eq("stripe_subscription_id", subId)
        .single();

      if (sub) {
        await supabaseAdmin.from("subscriptions")
          .update({ status: "active", current_period_end: new Date(session.lines?.data[0]?.period?.end * 1000).toISOString() })
          .eq("stripe_subscription_id", subId);
        await supabaseAdmin.from("companies")
          .update({ is_active: true })
          .eq("id", sub.company_id);
      }
      break;
    }

    // Pago fallido → bloquear acceso
    case "invoice.payment_failed": {
      const subId = session.subscription;
      const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("company_id")
        .eq("stripe_subscription_id", subId)
        .single();

      if (sub) {
        await supabaseAdmin.from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_subscription_id", subId);
        await supabaseAdmin.from("companies")
          .update({ is_active: false })
          .eq("id", sub.company_id);
      }
      break;
    }

    // Cancelación
    case "customer.subscription.deleted": {
      const subId = session.id;
      const { data: sub } = await supabaseAdmin
        .from("subscriptions")
        .select("company_id")
        .eq("stripe_subscription_id", subId)
        .single();

      if (sub) {
        await supabaseAdmin.from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subId);
        await supabaseAdmin.from("companies")
          .update({ is_active: false })
          .eq("id", sub.company_id);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
