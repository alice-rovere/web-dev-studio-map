-- DevSkillMap - Inbox di link salvati dal "Quick Add" e non ancora assegnati a un nodo
create table if not exists public.inbox_links (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  url text not null check (char_length(url) between 1 and 2048),
  created_at timestamptz not null default now()
);

create index if not exists inbox_links_owner_idx
  on public.inbox_links (owner_id, created_at desc);

alter table public.inbox_links enable row level security;

-- Nessun accesso pubblico: l'inbox e' privata e scoped sul proprietario.
grant select, insert, delete on public.inbox_links to authenticated;

drop policy if exists inbox_links_owner_select on public.inbox_links;
create policy inbox_links_owner_select
  on public.inbox_links for select
  to authenticated
  using (owner_id = auth.uid() and public.is_editor());

drop policy if exists inbox_links_owner_insert on public.inbox_links;
create policy inbox_links_owner_insert
  on public.inbox_links for insert
  to authenticated
  with check (owner_id = auth.uid() and public.is_editor());

drop policy if exists inbox_links_owner_delete on public.inbox_links;
create policy inbox_links_owner_delete
  on public.inbox_links for delete
  to authenticated
  using (owner_id = auth.uid() and public.is_editor());
