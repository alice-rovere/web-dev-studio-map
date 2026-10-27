-- ============================================================================
-- DevSkillMap - Migrazione 0003: Aggiunta categorie 'devops' e 'tools'
-- File: supabase/migrations/0003_add_devops_category.sql
-- ============================================================================
-- Estende il vincolo di controllo sulla tabella public.node_categories per
-- consentire 'devops' e 'tools' come categorie ufficiali insieme a 'frontend', 'backend' e 'database'.
-- ============================================================================

alter table public.node_categories
  drop constraint if exists node_categories_category_check;

alter table public.node_categories
  add constraint node_categories_category_check
  check (category in ('frontend', 'backend', 'database', 'devops', 'tools'));
