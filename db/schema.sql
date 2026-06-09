create extension if not exists pgcrypto;

create table if not exists public.shoes (
  id text primary key,
  brand text not null,
  model text not null,
  official_data jsonb not null default '{}'::jsonb,
  advisor_fit_notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shoes enable row level security;

revoke all on table public.shoes from anon;
revoke all on table public.shoes from authenticated;

grant select, insert, update, delete on table public.shoes to service_role;

create index if not exists shoes_brand_model_idx on public.shoes (brand, model);
create index if not exists shoes_official_data_gin_idx on public.shoes using gin (official_data);
create index if not exists shoes_advisor_fit_notes_gin_idx on public.shoes using gin (advisor_fit_notes);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists shoes_set_updated_at on public.shoes;

create trigger shoes_set_updated_at
before update on public.shoes
for each row
execute function public.set_updated_at();
