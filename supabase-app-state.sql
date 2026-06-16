-- Ejecutar en: supabase.com → tu proyecto → SQL Editor → New query
-- Tabla para persistir el estado de la app (clientes, datos NPS, planes, voces)

create table if not exists app_state (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Sin RLS — solo accede el service role desde las API functions
-- (nunca se expone al cliente con la anon key)
