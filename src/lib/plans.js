export const PLANS = [
  {
    id: "starter",
    name: "Start",
    price: 49,
    priceEnvKey: "STRIPE_PRICE_STARTER",
    features: ["1 encuesta activa", "100 respuestas/mes", "Dashboard básico", "Soporte por email"],
  },
  {
    id: "pro",
    name: "Growth",
    price: 149,
    popular: true,
    priceEnvKey: "STRIPE_PRICE_PRO",
    features: ["5 encuestas activas", "500 respuestas/mes", "Insights con IA", "Exportar reportes", "Soporte prioritario"],
  },
  {
    id: "enterprise",
    name: "Scale",
    price: 399,
    priceEnvKey: "STRIPE_PRICE_ENTERPRISE",
    features: ["Encuestas ilimitadas", "Respuestas ilimitadas", "IA avanzada", "API access", "White-label", "Soporte dedicado"],
  },
];
