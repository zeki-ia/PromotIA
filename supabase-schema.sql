-- ============================================================
-- PromotIA — Schema de Supabase
-- Ejecutar en: supabase.com → tu proyecto → SQL Editor → New query
-- ============================================================

-- Tabla de empresas (cada cliente de PromotIA)
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Mi Empresa',
  industry text,
  team_size text,
  stripe_customer_id text unique,
  plan_id text default 'starter',
  is_active boolean default false,
  created_at timestamptz default now()
);

-- Tabla de usuarios (vinculados a una empresa)
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  email text not null,
  role text default 'admin' check (role in ('admin', 'viewer')),
  created_at timestamptz default now()
);

-- Tabla de planes disponibles
create table plans (
  id text primary key,  -- 'starter', 'pro', 'enterprise'
  name text not null,
  price integer not null,
  max_users integer,
  max_surveys integer,
  features jsonb,
  stripe_price_id text
);

insert into plans (id, name, price, max_users, max_surveys, features) values
  ('starter', 'Starter', 49, 3, 1, '["1 encuesta activa", "100 respuestas/mes", "Dashboard básico"]'),
  ('pro', 'Pro', 149, 10, 5, '["5 encuestas activas", "500 respuestas/mes", "Insights con IA"]'),
  ('enterprise', 'Enterprise', 399, null, null, '["Ilimitado", "IA avanzada", "API access", "White-label"]');

-- Tabla de suscripciones (estado de pago por empresa)
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade unique,
  stripe_subscription_id text unique,
  plan_id text references plans(id),
  status text default 'trialing' check (status in ('trialing', 'active', 'past_due', 'canceled', 'unpaid')),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla de respuestas NPS
create table nps_responses (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  score integer check (score >= 0 and score <= 10),
  comment text,
  respondent_email text,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security (RLS) — cada empresa solo ve sus datos
-- ============================================================

alter table companies enable row level security;
alter table users enable row level security;
alter table subscriptions enable row level security;
alter table nps_responses enable row level security;

-- Usuarios ven solo su empresa
create policy "users_own_company" on companies
  for all using (
    id = (select company_id from users where id = auth.uid())
  );

create policy "users_own_profile" on users
  for all using (company_id = (select company_id from users where id = auth.uid()));

create policy "users_own_subscription" on subscriptions
  for all using (company_id = (select company_id from users where id = auth.uid()));

create policy "users_own_nps" on nps_responses
  for all using (company_id = (select company_id from users where id = auth.uid()));
