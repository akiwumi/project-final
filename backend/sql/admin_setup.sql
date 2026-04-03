-- Admin subsystem setup for Connect Africa
-- Run this script in Supabase SQL Editor before using /api/admin endpoints.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'super_admin'
    check (role in ('super_admin', 'admin', 'support')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_admin_users_set_updated_at on public.admin_users;
create trigger trg_admin_users_set_updated_at
before update on public.admin_users
for each row execute procedure public.set_updated_at();

alter table public.admin_users enable row level security;

-- Optional direct-access policies (backend service role bypasses RLS anyway).
drop policy if exists "admin_users_self_read" on public.admin_users;
create policy "admin_users_self_read"
  on public.admin_users
  for select
  using (auth.uid() = id);

drop policy if exists "admin_users_self_update" on public.admin_users;
create policy "admin_users_self_update"
  on public.admin_users
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Views used by admin API for dynamic table discovery.
create or replace view public.admin_schema_tables as
select
  t.table_name,
  true::boolean as is_admin_enabled
from information_schema.tables t
where t.table_schema = 'public'
  and t.table_type = 'BASE TABLE'
  and t.table_name not like 'pg_%'
  and t.table_name not like 'sql_%';

create or replace view public.admin_schema_columns as
select
  c.table_name,
  c.column_name,
  c.data_type,
  c.is_nullable,
  c.ordinal_position
from information_schema.columns c
where c.table_schema = 'public';

revoke all on table public.admin_users from anon, authenticated;
revoke all on table public.admin_schema_tables from anon, authenticated;
revoke all on table public.admin_schema_columns from anon, authenticated;

grant all on table public.admin_users to service_role;
grant select on table public.admin_schema_tables to service_role;
grant select on table public.admin_schema_columns to service_role;

-- To manually seed an existing auth user as admin, run (replace values):
-- insert into public.admin_users (id, email, full_name, role)
-- values ('<auth-user-uuid>', 'admin@example.com', 'Main Admin', 'super_admin')
-- on conflict (id) do update set
--   email = excluded.email,
--   full_name = excluded.full_name,
--   role = excluded.role,
--   is_active = true;
