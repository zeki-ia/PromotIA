import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    priceId: process.env.STRIPE_PRICE_STARTER,
    features: ["1 encuesta activa", "100 respuestas/mes", "Dashboard básico", "Soporte por email"],
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    priceId: process.env.STRIPE_PRICE_PRO,
    popular: true,
    features: ["5 encuestas activas", "500 respuestas/mes", "Insights con IA", "Exportar reportes", "Soporte prioritario"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 399,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE,
    features: ["Encuestas ilimitadas", "Respuestas ilimitadas", "IA avanzada", "API access", "White-label", "Soporte dedicado"],
  },
];
