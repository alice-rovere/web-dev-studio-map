-- DevSkillMap - schema iniziale
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Profili
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'viewer' check (role in ('viewer', 'editor', 'admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, coalesce(new.email, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Nodi
-- ---------------------------------------------------------------------------
create table if not exists public.nodes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  description text not null default '',
  best_practices text[] not null default '{}',
  naming_conventions text[] not null default '{}',
  study_urls jsonb not null default '[]'::jsonb,
  position_x numeric,
  position_y numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Relazioni padre-figlio (DAG)
-- ---------------------------------------------------------------------------
create table if not exists public.node_parents (
  parent_id uuid not null references public.nodes (id) on delete cascade,
  child_id uuid not null references public.nodes (id) on delete cascade,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  primary key (parent_id, child_id),
  constraint node_parents_no_self check (parent_id <> child_id)
);

create unique index if not exists node_parents_one_primary_per_child
  on public.node_parents (child_id)
  where is_primary;

create index if not exists node_parents_child_idx
  on public.node_parents (child_id);

create or replace function public.prevent_node_parent_cycle()
returns trigger
language plpgsql
as $$
declare
  cycle_found boolean;
begin
  with recursive ancestors as (
    select np.parent_id
    from public.node_parents np
    where np.child_id = new.parent_id
    union
    select np.parent_id
    from public.node_parents np
    join ancestors a on np.child_id = a.parent_id
  )
  select exists (
    select 1 from ancestors where parent_id = new.child_id
  ) into cycle_found;

  if cycle_found then
    raise exception 'Relazione padre-figlio non valida: creerebbe un ciclo.'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists node_parents_prevent_cycle on public.node_parents;
create trigger node_parents_prevent_cycle
before insert or update on public.node_parents
for each row execute function public.prevent_node_parent_cycle();

-- ---------------------------------------------------------------------------
-- Categorie
-- ---------------------------------------------------------------------------
create table if not exists public.node_categories (
  node_id uuid not null references public.nodes (id) on delete cascade,
  category text not null check (category in ('frontend', 'backend', 'database')),
  is_primary boolean not null default false,
  primary key (node_id, category)
);

create unique index if not exists node_categories_one_primary_per_node
  on public.node_categories (node_id)
  where is_primary;

create index if not exists node_categories_category_idx
  on public.node_categories (category);

-- ---------------------------------------------------------------------------
-- Approfondimenti strutturati
-- ---------------------------------------------------------------------------
create table if not exists public.node_content_sections (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.nodes (id) on delete cascade,
  sort_order integer not null default 0,
  title text not null,
  type text not null check (type in ('text', 'code', 'list', 'table', 'timeline')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists node_content_sections_node_idx
  on public.node_content_sections (node_id, sort_order);

-- ---------------------------------------------------------------------------
-- Glossario
-- ---------------------------------------------------------------------------
create table if not exists public.glossary_terms (
  id uuid primary key default gen_random_uuid(),
  term text not null,
  definition text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists glossary_terms_term_unique
  on public.glossary_terms (lower(term));

-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists nodes_set_updated_at on public.nodes;
create trigger nodes_set_updated_at
before update on public.nodes
for each row execute function public.set_updated_at();

drop trigger if exists node_content_sections_set_updated_at on public.node_content_sections;
create trigger node_content_sections_set_updated_at
before update on public.node_content_sections
for each row execute function public.set_updated_at();

drop trigger if exists glossary_terms_set_updated_at on public.glossary_terms;
create trigger glossary_terms_set_updated_at
before update on public.glossary_terms
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Ruoli applicativi
-- ---------------------------------------------------------------------------
create or replace function public.is_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke all on function public.is_editor() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_editor() to anon, authenticated;
grant execute on function public.is_admin() to authenticated;

-- Profili mancanti per utenti creati prima del trigger
insert into public.profiles (id, email)
select u.id, coalesce(u.email, '')
from auth.users u
on conflict (id) do nothing;
