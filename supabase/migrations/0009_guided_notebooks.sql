create table public.guided_notebooks (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text not null,
  node_id uuid unique references public.nodes(id) on delete set null,
  config jsonb not null check (jsonb_typeof(config) = 'object'),
  pending_node_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guided_notebooks enable row level security;
grant select on public.guided_notebooks to anon, authenticated;
grant insert, update, delete on public.guided_notebooks to authenticated;

create policy guided_notebooks_public_read on public.guided_notebooks
  for select to anon, authenticated using (true);
create policy guided_notebooks_admin_insert on public.guided_notebooks
  for insert to authenticated with check (public.is_admin());
create policy guided_notebooks_admin_update on public.guided_notebooks
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy guided_notebooks_admin_delete on public.guided_notebooks
  for delete to authenticated using (public.is_admin());

create function public.guided_notebook_before_update()
returns trigger language plpgsql as $$
begin
  if new.slug <> old.slug then
    raise exception 'Lo slug del percorso non può essere modificato.' using errcode = '23514';
  end if;
  new.updated_at := clock_timestamp();
  return new;
end;
$$;

create trigger guided_notebook_before_update
before update on public.guided_notebooks
for each row execute function public.guided_notebook_before_update();

-- Only migrated notebooks waiting for a missing node are automatically linked.
create function public.link_pending_guided_notebook()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.guided_notebooks
  set node_id = new.id, pending_node_slug = null
  where pending_node_slug = new.slug and node_id is null
    and not exists (select 1 from public.guided_notebooks where node_id = new.id);
  return new;
end;
$$;

revoke all on function public.link_pending_guided_notebook() from public;
create trigger link_pending_guided_notebook
after insert on public.nodes
for each row execute function public.link_pending_guided_notebook();
