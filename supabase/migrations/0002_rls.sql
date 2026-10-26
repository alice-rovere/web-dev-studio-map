-- DevSkillMap - Row Level Security
alter table public.profiles enable row level security;
alter table public.nodes enable row level security;
alter table public.node_parents enable row level security;
alter table public.node_categories enable row level security;
alter table public.node_content_sections enable row level security;
alter table public.glossary_terms enable row level security;

-- ---------------------------------------------------------------------------
-- Grants espliciti (le policy restringono comunque l'accesso)
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on public.nodes to authenticated;
grant insert, update, delete on public.node_parents to authenticated;
grant insert, update, delete on public.node_categories to authenticated;
grant insert, update, delete on public.node_content_sections to authenticated;
grant insert, update, delete on public.glossary_terms to authenticated;
grant update on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Profili
-- ---------------------------------------------------------------------------
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Lettura pubblica
-- ---------------------------------------------------------------------------
drop policy if exists nodes_public_read on public.nodes;
create policy nodes_public_read
  on public.nodes for select
  to anon, authenticated
  using (true);

drop policy if exists node_parents_public_read on public.node_parents;
create policy node_parents_public_read
  on public.node_parents for select
  to anon, authenticated
  using (true);

drop policy if exists node_categories_public_read on public.node_categories;
create policy node_categories_public_read
  on public.node_categories for select
  to anon, authenticated
  using (true);

drop policy if exists node_content_sections_public_read on public.node_content_sections;
create policy node_content_sections_public_read
  on public.node_content_sections for select
  to anon, authenticated
  using (true);

drop policy if exists glossary_terms_public_read on public.glossary_terms;
create policy glossary_terms_public_read
  on public.glossary_terms for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Scrittura riservata a editor/admin
-- ---------------------------------------------------------------------------
drop policy if exists nodes_editor_insert on public.nodes;
create policy nodes_editor_insert
  on public.nodes for insert
  to authenticated
  with check (public.is_editor());

drop policy if exists nodes_editor_update on public.nodes;
create policy nodes_editor_update
  on public.nodes for update
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists nodes_editor_delete on public.nodes;
create policy nodes_editor_delete
  on public.nodes for delete
  to authenticated
  using (public.is_editor());

drop policy if exists node_parents_editor_insert on public.node_parents;
create policy node_parents_editor_insert
  on public.node_parents for insert
  to authenticated
  with check (public.is_editor());

drop policy if exists node_parents_editor_update on public.node_parents;
create policy node_parents_editor_update
  on public.node_parents for update
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists node_parents_editor_delete on public.node_parents;
create policy node_parents_editor_delete
  on public.node_parents for delete
  to authenticated
  using (public.is_editor());

drop policy if exists node_categories_editor_insert on public.node_categories;
create policy node_categories_editor_insert
  on public.node_categories for insert
  to authenticated
  with check (public.is_editor());

drop policy if exists node_categories_editor_update on public.node_categories;
create policy node_categories_editor_update
  on public.node_categories for update
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists node_categories_editor_delete on public.node_categories;
create policy node_categories_editor_delete
  on public.node_categories for delete
  to authenticated
  using (public.is_editor());

drop policy if exists node_content_sections_editor_insert on public.node_content_sections;
create policy node_content_sections_editor_insert
  on public.node_content_sections for insert
  to authenticated
  with check (public.is_editor());

drop policy if exists node_content_sections_editor_update on public.node_content_sections;
create policy node_content_sections_editor_update
  on public.node_content_sections for update
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists node_content_sections_editor_delete on public.node_content_sections;
create policy node_content_sections_editor_delete
  on public.node_content_sections for delete
  to authenticated
  using (public.is_editor());

drop policy if exists glossary_terms_editor_insert on public.glossary_terms;
create policy glossary_terms_editor_insert
  on public.glossary_terms for insert
  to authenticated
  with check (public.is_editor());

drop policy if exists glossary_terms_editor_update on public.glossary_terms;
create policy glossary_terms_editor_update
  on public.glossary_terms for update
  to authenticated
  using (public.is_editor())
  with check (public.is_editor());

drop policy if exists glossary_terms_editor_delete on public.glossary_terms;
create policy glossary_terms_editor_delete
  on public.glossary_terms for delete
  to authenticated
  using (public.is_editor());
