-- DevSkillMap - Nodo "Prisma ORM" (figlio di orm-libraries) con Appunti Visivi.
-- Nessuna modifica a RLS: le policy esistenti su nodes/node_parents/node_categories restano valide.
insert into public.nodes (slug, label, description, best_practices, naming_conventions, study_urls)
values (
  'prisma-orm',
  'Prisma ORM',
  'ORM type-safe per Node.js/TypeScript: dallo schema.prisma genera un client che traduce le chiamate in query SQL parametrizzate.',
  array[
    'Definisci i modelli in schema.prisma e rigenera il client con prisma generate dopo ogni modifica.',
    'Applica le modifiche allo schema solo tramite migrazioni versionate (prisma migrate).',
    'Usa un''unica istanza di PrismaClient condivisa nell''applicazione.'
  ],
  array['Modelli al singolare in PascalCase (es. User, Post)'],
  '[
    {"label":"Prisma ORM Documentation","url":"https://www.prisma.io/docs"},
    {"label":"Prisma Client API","url":"https://www.prisma.io/docs/orm/prisma-client"}
  ]'::jsonb
)
on conflict (slug) do nothing;

insert into public.node_categories (node_id, category, is_primary)
select id, 'backend', true from public.nodes where slug = 'prisma-orm'
on conflict (node_id, category) do nothing;

insert into public.node_categories (node_id, category, is_primary)
select id, 'database', false from public.nodes where slug = 'prisma-orm'
on conflict (node_id, category) do nothing;

insert into public.node_parents (parent_id, child_id, sort_order, is_primary)
select p.id, c.id, 0, true
from public.nodes p, public.nodes c
where p.slug = 'orm-libraries' and c.slug = 'prisma-orm'
on conflict (parent_id, child_id) do nothing;
