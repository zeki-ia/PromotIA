-- ============================================================
-- PromotIA — Schema de Supabase
-- Ejecutar en: supabase.com → tu proyecto → SQL Editor → New query
-- ============================================================

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Mi Empresa',
  industry text,
  stripe_customer_id text unique,
  plan_id text default 'start',
  is_active boolean default false,
  created_at timestamptz default now()
);

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references companies(id) on delete cascade,
  email text not null,
  role text default 'admin' check (role in ('admin', 'viewer')),
  created_at timestamptz default now()
);

create table if not exists plans (
  id text primary key,
  name text not null,
  price integer not null,
  max_clients integer,
  features jsonb,
  stripe_price_id text
);

insert into plans (id, name, price, max_clients, features) values
  ('start',  'Start',  49,  3,    '["Hasta 3 clientes","1.000 respuestas/mes","Dashboard NPS","Plan de acción con IA"]'),
  ('growth', 'Growth', 149, 10,   '["Hasta 10 clientes","5.000 respuestas/mes","Todo Start + Cross-sell IA","Soporte prioritario"]'),
  ('scale',  'Scale',  399, null, '["Clientes ilimitados","Respuestas ilimitadas","Todo Growth + API access","Onboarding dedicado"]')
on conflict (id) do nothing;

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade unique,
  stripe_subscription_id text unique,
  plan_id text references plans(id),
  status text default 'trialing' check (status in ('trialing','active','past_due','canceled','unpaid')),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table companies enable row level security;
alter table users enable row level security;
alter table subscriptions enable row level security;

-- Cada usuario ve solo su empresa
create policy "users_own_company" on companies
  for all using (
    id = (select company_id from users where id = auth.uid())
  );

create policy "users_own_profile" on users
  for all using (
    company_id = (select company_id from users where id = auth.uid())
  );

create policy "users_own_subscription" on subscriptions
  for all using (
    company_id = (select company_id from users where id = auth.uid())
  );

-- Service role puede hacer todo (para el webhook)
create policy "service_all_companies" on companies
  for all to service_role using (true);

create policy "service_all_users" on users
  for all to service_role using (true);

create policy "service_all_subscriptions" on subscriptions
  for all to service_role using (true);
