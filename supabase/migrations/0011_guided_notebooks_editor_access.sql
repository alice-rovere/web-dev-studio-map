drop policy if exists guided_notebooks_admin_insert on public.guided_notebooks;
drop policy if exists guided_notebooks_admin_update on public.guided_notebooks;
drop policy if exists guided_notebooks_admin_delete on public.guided_notebooks;

drop policy if exists guided_notebooks_editor_insert on public.guided_notebooks;
create policy guided_notebooks_editor_insert on public.guided_notebooks
  for insert to authenticated with check (public.is_editor());

drop policy if exists guided_notebooks_editor_update on public.guided_notebooks;
create policy guided_notebooks_editor_update on public.guided_notebooks
  for update to authenticated using (public.is_editor()) with check (public.is_editor());

drop policy if exists guided_notebooks_editor_delete on public.guided_notebooks;
create policy guided_notebooks_editor_delete on public.guided_notebooks
  for delete to authenticated using (public.is_editor());
