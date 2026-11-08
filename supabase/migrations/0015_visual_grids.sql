-- Public content; renderer IDs select existing React components, never executable code.
begin;
create table public.visual_grids (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text not null,
  node_id uuid references public.nodes(id) on delete set null,
  pending_node_slug text,
  renderer text not null check (renderer in ('computer', 'web-page')),
  config jsonb not null check (jsonb_typeof(config) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.visual_grids enable row level security;
grant select on public.visual_grids to anon, authenticated;
grant insert, update, delete on public.visual_grids to authenticated;
create policy visual_grids_public_read on public.visual_grids
  for select to anon, authenticated using (true);
create policy visual_grids_editor_insert on public.visual_grids
  for insert to authenticated with check (public.is_editor());
create policy visual_grids_editor_update on public.visual_grids
  for update to authenticated using (public.is_editor()) with check (public.is_editor());
create policy visual_grids_editor_delete on public.visual_grids
  for delete to authenticated using (public.is_editor());

create function public.visual_grid_before_update()
returns trigger language plpgsql as $$
begin
  if new.slug <> old.slug or new.renderer <> old.renderer then
    raise exception 'Slug e renderer della griglia non possono essere modificati.' using errcode = '23514';
  end if;
  new.updated_at := clock_timestamp();
  return new;
end;
$$;
create trigger visual_grid_before_update before update on public.visual_grids
  for each row execute function public.visual_grid_before_update();

create function public.link_pending_visual_grid()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.visual_grids set node_id = new.id, pending_node_slug = null
  where pending_node_slug = new.slug and node_id is null;
  return new;
end;
$$;
revoke all on function public.link_pending_visual_grid() from public;
create trigger link_pending_visual_grid after insert on public.nodes
  for each row execute function public.link_pending_visual_grid();

-- Fail atomically rather than discard custom steps or unsupported panels.
do $migration$
declare
  pc public.guided_notebooks%rowtype;
  ids text[] := array['scheda-madre', 'cpu', 'ram', 'archiviazione', 'gpu', 'batteria', 'periferiche'];
begin
  select * into pc from public.guided_notebooks where slug = 'dentro-il-pc' for update;
  if not found then
    raise exception 'Percorso dentro-il-pc mancante: verificare i dati prima della migrazione.';
  end if;
  if jsonb_typeof(pc.config->'steps') is distinct from 'array' then
    raise exception 'Passaggi PC non validi: verificare i dati prima della migrazione.';
  end if;
  if jsonb_typeof(pc.config->'title') is distinct from 'string' or nullif(btrim(pc.config->>'title'), '') is null or nullif(btrim(pc.description), '') is null
    or (pc.config ? 'subtitle' and jsonb_typeof(pc.config->'subtitle') not in ('string', 'null'))
    or jsonb_array_length(pc.config->'steps') <> cardinality(ids)
    or (select count(distinct step->>'id') from jsonb_array_elements(pc.config->'steps') step
        where step->>'id' = any(ids)) <> cardinality(ids)
    or exists (
      select 1 from jsonb_array_elements(pc.config->'steps') step
      where jsonb_typeof(step->'title') is distinct from 'string' or nullif(btrim(step->>'title'), '') is null
         or jsonb_typeof(step->'description') is distinct from 'string' or nullif(btrim(step->>'description'), '') is null
         or jsonb_typeof(step->'panels') is distinct from 'array'
    ) then
    raise exception 'Il percorso PC contiene passaggi personalizzati o incompleti: trasferirli manualmente prima di riprovare.';
  end if;
  if exists (
    select 1 from jsonb_array_elements(pc.config->'steps') step,
      lateral jsonb_array_elements(step->'panels') panel
    where jsonb_typeof(panel) is distinct from 'object'
      or coalesce(panel->>'kind', '') not in ('text', 'code', 'table')
      or jsonb_typeof(panel->'label') is distinct from 'string' or nullif(btrim(panel->>'label'), '') is null
      or (panel ? 'highlightLines' and jsonb_typeof(panel->'highlightLines') not in ('array', 'null'))
      or (panel ? 'highlightRows' and jsonb_typeof(panel->'highlightRows') not in ('array', 'null'))
      or (panel->>'kind' in ('text', 'code') and
          (jsonb_typeof(panel->'content') is distinct from 'string' or nullif(btrim(panel->>'content'), '') is null))
      or (panel->>'kind' = 'table' and
          (jsonb_typeof(panel->'columns') is distinct from 'array'
           or jsonb_typeof(panel->'rows') is distinct from 'array'))
  ) then
    raise exception 'Il percorso PC contiene pannelli non supportati: trasferirli manualmente prima di riprovare.';
  end if;
  if exists (
    select 1 from jsonb_array_elements(pc.config->'steps') step,
      lateral jsonb_array_elements(step->'panels') panel
    where case when panel->>'kind' = 'table' then (
      jsonb_array_length(panel->'columns') = 0
      or exists (select 1 from jsonb_array_elements(panel->'columns') col
        where jsonb_typeof(col) <> 'string' or nullif(btrim(col #>> '{}'), '') is null)
      or exists (select 1 from jsonb_array_elements(panel->'rows') row_data
        where jsonb_typeof(row_data) <> 'array'
          or case when jsonb_typeof(row_data) = 'array'
            then jsonb_array_length(row_data) <> jsonb_array_length(panel->'columns')
              or exists (select 1 from jsonb_array_elements(row_data) cell where jsonb_typeof(cell) <> 'string')
            else false end)
    ) else false end
  ) then
    raise exception 'Il percorso PC contiene tabelle non supportate: correggerle prima di riprovare.';
  end if;
  if exists (
    select 1 from jsonb_array_elements(pc.config->'steps') step,
      lateral jsonb_array_elements(step->'panels') panel
    where exists (
      select 1 from jsonb_array_elements(
        case when jsonb_typeof(panel->'highlightLines') = 'array' then panel->'highlightLines' else '[]'::jsonb end
      ) value
      where jsonb_typeof(value) <> 'number' or (value #>> '{}') !~ '^[1-9][0-9]*$'
    ) or exists (
      select 1 from jsonb_array_elements(
        case when jsonb_typeof(panel->'highlightRows') = 'array' then panel->'highlightRows' else '[]'::jsonb end
      ) value
      where jsonb_typeof(value) <> 'number' or (value #>> '{}') !~ '^(0|[1-9][0-9]*)$'
    )
  ) then
    raise exception 'Il percorso PC contiene evidenziazioni non valide: correggerle prima di riprovare.';
  end if;

  insert into public.visual_grids (slug, description, node_id, pending_node_slug, renderer, config)
  values ('dentro-il-pc', pc.description, pc.node_id, pc.pending_node_slug, 'computer',
    jsonb_build_object('title', pc.config->>'title', 'subtitle', pc.config->>'subtitle',
      'components', pc.config->'steps', 'originalNotebook', pc.config));

  delete from public.guided_notebooks where slug = pc.slug;
end;
$migration$;

alter table public.guided_notebooks add constraint guided_notebooks_reserved_pc_slug
  check (slug <> 'dentro-il-pc');

insert into public.visual_grids (slug, description, renderer, config)
values (
  'pagina-web',
  'Esplora i ruoli di HTML, CSS e JavaScript nella costruzione di una pagina web.',
  'web-page',
  '{
    "title": "La pagina web",
    "subtitle": "Struttura, stile e interazione",
    "components": [
      {"id":"html","title":"HTML: la struttura","description":"HTML descrive la struttura e il significato dei contenuti della pagina: titoli, paragrafi, collegamenti e altri elementi.","panels":[{"kind":"code","label":"Un esempio HTML","language":"html","content":"<h1>Ciao mondo</h1>\n<p>Una pagina web.</p>"}]},
      {"id":"css","title":"CSS: la presentazione","description":"CSS definisce la presentazione degli elementi: colori, spazi, dimensioni e disposizione, adattandoli anche ai diversi schermi.","panels":[{"kind":"code","label":"Un esempio CSS","language":"css","content":"h1 {\n  color: teal;\n}"}]},
      {"id":"javascript","title":"JavaScript: il comportamento","description":"JavaScript aggiunge comportamento e interattività: può reagire alle azioni della persona e aggiornare la pagina nel browser.","panels":[{"kind":"code","label":"Un esempio JavaScript","language":"js","content":"button.addEventListener(\"click\", () => {\n  message.textContent = \"Ciao!\";\n});"}]}
    ]
  }'::jsonb
);
commit;
