const Stripe = require("stripe");
const { createClient } = require("@supabase/supabase-js");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).end();

  const sig = req.headers["stripe-signature"];
  let event;
  try {
    const raw = await getRawBody(req);
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const obj = event.data.object;

  if (event.type === "checkout.session.completed") {
    const companyId = obj.client_reference_id;
    const subId = obj.subscription;
    await supabase.from("subscriptions").upsert({
      company_id: companyId,
      stripe_subscription_id: subId,
      status: "active",
      stripe_customer_id: obj.customer,
    });
    await supabase.from("companies").update({ is_active: true }).eq("id", companyId);
  }

  if (event.type === "invoice.payment_succeeded") {
    const subId = obj.subscription;
    const { data } = await supabase.from("subscriptions").select("company_id").eq("stripe_subscription_id", subId).single();
    if (data) {
      await supabase.from("subscriptions").update({ status: "active" }).eq("stripe_subscription_id", subId);
      await supabase.from("companies").update({ is_active: true }).eq("id", data.company_id);
    }
  }

  if (event.type === "invoice.payment_failed") {
    const subId = obj.subscription;
    const { data } = await supabase.from("subscriptions").select("company_id").eq("stripe_subscription_id", subId).single();
    if (data) {
      await supabase.from("subscriptions").update({ status: "past_due" }).eq("stripe_subscription_id", subId);
      await supabase.from("companies").update({ is_active: false }).eq("id", data.company_id);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const { data } = await supabase.from("subscriptions").select("company_id").eq("stripe_subscription_id", obj.id).single();
    if (data) {
      await supabase.from("subscriptions").update({ status: "canceled" }).eq("stripe_subscription_id", obj.id);
      await supabase.from("companies").update({ is_active: false }).eq("id", data.company_id);
    }
  }

  res.json({ received: true });
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", c => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
