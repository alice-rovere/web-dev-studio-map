-- DevSkillMap - Bucket per le immagini dei blocchi "image"
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'note-images',
  'note-images',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists note_images_public_read on storage.objects;
create policy note_images_public_read
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'note-images');

drop policy if exists note_images_editor_insert on storage.objects;
create policy note_images_editor_insert
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'note-images' and public.is_editor());

drop policy if exists note_images_editor_update on storage.objects;
create policy note_images_editor_update
  on storage.objects for update
  to authenticated
  using (bucket_id = 'note-images' and public.is_editor())
  with check (bucket_id = 'note-images' and public.is_editor());

drop policy if exists note_images_editor_delete on storage.objects;
create policy note_images_editor_delete
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'note-images' and public.is_editor());
