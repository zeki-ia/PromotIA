# PromotIA — Guía de Deploy

**B2B NPS Analytics con IA para SaaS**  
Stack: Next.js 14 · Supabase · Stripe · Anthropic Claude · Vercel

---

## Paso 1 — Crear proyecto en Supabase (15 min)

1. Andá a **supabase.com** → "New project"
2. Elegí un nombre (ej: `promotia`) y una contraseña fuerte → "Create new project"
3. Esperá ~2 minutos a que termine
4. Andá a **SQL Editor** → "New query"
5. Copiá y pegá todo el contenido de `supabase-schema.sql` → "Run"
6. Andá a **Settings → API** y copiá:
   - `Project URL` → va a ser tu `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → va a ser tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → va a ser tu `SUPABASE_SERVICE_KEY` (¡no la expongas nunca!)

---

## Paso 2 — Crear productos en Stripe (10 min)

1. Andá a **dashboard.stripe.com** → activá tu cuenta
2. Andá a **Products** → "Add product"
3. Creá 3 productos:
   - **Starter** → precio recurrente $49/mes
   - **Pro** → precio recurrente $149/mes  
   - **Enterprise** → precio recurrente $399/mes
4. De cada producto copiá el **Price ID** (empieza con `price_...`)
5. Andá a **Developers → API keys** y copiá la `Secret key` y la `Publishable key`
6. Andá a **Developers → Webhooks** → "Add endpoint"
   - URL: `https://TU-APP.vercel.app/api/webhook`
   - Eventos a escuchar:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `customer.subscription.deleted`
   - Copiá el `Signing secret` (empieza con `whsec_...`)

---

## Paso 3 — Obtener API Key de Anthropic

1. Andá a **console.anthropic.com**
2. Creá una cuenta si no tenés
3. Andá a **API Keys** → "Create Key"
4. Copiá la key (empieza con `sk-ant-...`)

---

## Paso 4 — Configurar variables de entorno

Copiá el archivo `.env.example` a `.env.local`:
```
cp .env.example .env.local
```

Abrí `.env.local` y completá todos los valores con lo que copiaste en los pasos anteriores.

---

## Paso 5 — Probar localmente

```bash
# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev
```

Abrí **http://localhost:3000** y probá el flujo completo:
1. Registrate → Elegí plan → Pagá (usá la tarjeta de prueba `4242 4242 4242 4242`, cualquier fecha futura, cualquier CVC)
2. Completá el onboarding
3. Entrá al dashboard y generá insights

---

## Paso 6 — Deploy en Vercel (5 min)

1. Creá cuenta en **vercel.com** (gratis)
2. Subí el proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "PromotIA inicial"
   # Creá un repo en github.com y seguí las instrucciones
   ```
3. En Vercel → "Import Project" → conectá tu repo de GitHub
4. Antes de deployar, andá a **Environment Variables** y cargá todas las variables de `.env.local`
5. Click en **Deploy**
6. Vercel te dará una URL pública (ej: `promotia.vercel.app`)

---

## Paso 7 — Configurar webhook de Stripe con la URL de producción

1. En Stripe → Webhooks → editá el endpoint que creaste
2. Cambiá la URL a `https://promotia.vercel.app/api/webhook`
3. También actualizá `NEXT_PUBLIC_APP_URL` en Vercel con tu URL real

---

## Flujo completo del usuario

```
Landing → Register → Checkout (Stripe) → Webhook activa empresa → Onboarding → Dashboard
                                                ↓ (si falla pago)
                                          Webhook bloquea empresa → Pantalla "Plan suspendido"
```

---

## Costos estimados (fase inicial)

| Servicio | Costo |
|---------|-------|
| Vercel | Gratis (hasta 100GB bandwidth) |
| Supabase | Gratis (hasta 500MB DB) |
| Stripe | 2.9% + $0.30 por transacción |
| Anthropic API | ~$0.003 por análisis de insights |

---

## Soporte

¿Problemas? soporte@promotia.app
