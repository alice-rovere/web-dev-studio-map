-- Salva i campi del nodo e le sue relazioni nella stessa transazione.
-- SECURITY INVOKER mantiene attive le policy RLS dell'utente chiamante.
create or replace function public.save_node_with_relations(
  p_node_id uuid,
  p_slug text,
  p_label text,
  p_description text,
  p_best_practices text[],
  p_naming_conventions text[],
  p_study_urls jsonb,
  p_position_x numeric,
  p_position_y numeric,
  p_categories jsonb,
  p_parents jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  saved_node_id uuid;
  category_count integer;
  primary_category_count integer;
  parent_count integer;
  primary_parent_count integer;
begin
  if nullif(btrim(p_label), '') is null then
    raise exception 'Il nome del nodo è obbligatorio.'
      using errcode = '22023';
  end if;

  if p_slug is null or p_slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
    raise exception 'Lo slug deve contenere solo lettere minuscole, numeri e trattini.'
      using errcode = '22023';
  end if;

  if jsonb_typeof(p_categories) is distinct from 'array' then
    raise exception 'Le categorie del nodo non sono valide.'
      using errcode = '22023';
  end if;

  select count(*), count(*) filter (where is_primary is true)
    into category_count, primary_category_count
  from jsonb_to_recordset(p_categories) as category_link(
    category text,
    is_primary boolean
  );

  if category_count = 0 or primary_category_count <> 1 then
    raise exception 'Seleziona almeno una categoria e una sola categoria primaria.'
      using errcode = '22023';
  end if;

  if jsonb_typeof(p_parents) is distinct from 'array' then
    raise exception 'Le relazioni padre-figlio non sono valide.'
      using errcode = '22023';
  end if;

  select count(*), count(*) filter (where is_primary is true)
    into parent_count, primary_parent_count
  from jsonb_to_recordset(p_parents) as parent_link(
    parent_id uuid,
    is_primary boolean,
    sort_order integer
  );

  if parent_count > 0 and primary_parent_count <> 1 then
    raise exception 'Seleziona un solo padre primario.'
      using errcode = '22023';
  end if;

  if p_node_id is null then
    insert into public.nodes (
      slug,
      label,
      description,
      best_practices,
      naming_conventions,
      study_urls,
      position_x,
      position_y
    )
    values (
      p_slug,
      btrim(p_label),
      coalesce(p_description, ''),
      coalesce(p_best_practices, '{}'),
      coalesce(p_naming_conventions, '{}'),
      coalesce(p_study_urls, '[]'::jsonb),
      p_position_x,
      p_position_y
    )
    returning id into saved_node_id;
  else
    update public.nodes
    set slug = p_slug,
        label = btrim(p_label),
        description = coalesce(p_description, ''),
        best_practices = coalesce(p_best_practices, '{}'),
        naming_conventions = coalesce(p_naming_conventions, '{}'),
        study_urls = coalesce(p_study_urls, '[]'::jsonb),
        position_x = p_position_x,
        position_y = p_position_y
    where id = p_node_id;

    if not found then
      raise exception 'Il nodo da aggiornare non esiste più.'
        using errcode = 'P0002';
    end if;

    saved_node_id := p_node_id;
  end if;

  delete from public.node_categories
  where node_id = saved_node_id;

  insert into public.node_categories (node_id, category, is_primary)
  select saved_node_id, category_link.category, category_link.is_primary
  from jsonb_to_recordset(p_categories) as category_link(
    category text,
    is_primary boolean
  );

  delete from public.node_parents
  where child_id = saved_node_id;

  insert into public.node_parents (
    parent_id,
    child_id,
    sort_order,
    is_primary
  )
  select
    parent_link.parent_id,
    saved_node_id,
    coalesce(parent_link.sort_order, 0),
    parent_link.is_primary
  from jsonb_to_recordset(p_parents) as parent_link(
    parent_id uuid,
    is_primary boolean,
    sort_order integer
  );

  return saved_node_id;
end;
$$;

revoke all on function public.save_node_with_relations(
  uuid, text, text, text, text[], text[], jsonb, numeric, numeric, jsonb, jsonb
) from public;
grant execute on function public.save_node_with_relations(
  uuid, text, text, text, text[], text[], jsonb, numeric, numeric, jsonb, jsonb
) to authenticated;
