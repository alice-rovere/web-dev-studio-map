begin;
alter table public.visual_grids drop constraint visual_grids_renderer_check;
alter table public.visual_grids add constraint visual_grids_renderer_check
  check (renderer in ('computer', 'web-page', 'excalidraw'));
commit;
