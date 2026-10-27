-- ============================================================================
-- DEVSKILLMAP - ROADMAP MACROCATEGORIA 5: DEVELOPER TOOLS & WORKFLOW
-- File: supabase/roadmaps/05_tools.sql
-- ============================================================================
-- Include:
-- - Git & Collaboration Tools: Git, GitHub, GitLab, Trunk-based & Git Flow
-- - API Development & Testing Tools: Postman, Insomnia, Swagger/OpenAPI, Mock Servers
-- - Code Quality & Static Analysis: ESLint, Prettier, Husky & Git Hooks
-- - Browser Automation & E2E Testing: Playwright, Cypress, Visual Regression
-- - Package & Environment Management: npm, pnpm, yarn, npx, DevContainers
--
-- NOTA DI ESECUZIONE:
-- Richiede l'esecuzione preventiva della migrazione 0003_add_devops_category.sql
-- che abilita sia 'devops' che 'tools' nel vincolo CHECK di public.node_categories.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. NODI TECNOLOGICI (public.nodes)
-- ----------------------------------------------------------------------------
insert into public.nodes (slug, label, description, best_practices, naming_conventions, study_urls, position_x, position_y)
values
  -- Root 1: Git & Collaboration Tools (Quadrante Tools, Destra)
  (
    'git-tools',
    'Git & Version Control Tools',
    'Strumenti di controllo versione distribuito (Git, GitHub, GitLab) per il tracciamento cronologico del codice, branching strategy e collaborazione di team.',
    array[
      'Fai commit atomici e frequenti con messaggi conformi alla specifica Conventional Commits (feat:, fix:, docs:, refactor:).',
      'Proteggi il branch principale (main/master) richiedendo review obbligatoria della Pull Request e test CI verdi prima del merge.',
      'Configura un file .gitignore completo per non tracciare file d''ambiente, build artifacts e cartelle di dipendenze.'
    ],
    array['Branch in kebab-case (es. feat/auth-modal, fix/navbar-mobile)', 'Tag delle release con prefisso v e SemVer (es. v1.4.0)'],
    '[
      {"label":"Git Official Documentation","url":"https://git-scm.com/doc"},
      {"label":"GitHub Docs: Pull Request Workflow","url":"https://docs.github.com/en/pull-requests"},
      {"label":"Conventional Commits 1.0.0","url":"https://www.conventionalcommits.org/"}
    ]'::jsonb,
    1400, 180
  ),

  -- Figlio di git-tools: Git Workflow & Branching
  (
    'git-workflow-branching',
    'Branching Strategy (Trunk & GitFlow)',
    'Metodologie di branching: Trunk-Based Development per integrazione continua rapida con branch a vita breve, e Git Flow per rilasci programmati complessi.',
    array[
      'Preferisci il Trunk-Based Development per rilasci frequenti e continui senza merge hell.',
      'Usa feature flags (toggles) per integrare codice incompleto nel branch principale senza esporlo agli utenti finali.',
      'Effettua rebase interattivo (git rebase -i) per pulire la cronologia dei commit locali prima di aprire la Pull Request.'
    ],
    array['Prefissi di branch standard: feat/, fix/, chore/, refactor/, hotfix/'],
    '[
      {"label":"Trunk Based Development Guide","url":"https://trunkbaseddevelopment.com/"},
      {"label":"Atlassian Git Branching Strategies","url":"https://www.atlassian.com/git/tutorials/comparing-workflows"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di git-tools: GitHub Collaboration
  (
    'github-collaboration',
    'GitHub PR & Code Review',
    'Processi di revisione collaborativa del codice tramite Pull Request, issue tracking, template di PR e discussioni inline per elevare la qualità del software.',
    array[
      'Fornisci descrizioni chiare nelle PR con contesto del problema, soluzione adottata e screenshot per modifiche visive.',
      'Mantieni le review costruttive ed empatiche, spiegando il "perché" dietro ogni suggerimento.',
      'Imposta PR Template (.github/pull_request_template.md) per guidare gli sviluppatori nella compilazione della checklist di rilascio.'
    ],
    array['File template in .github/ con estensione .md', 'Etichette GitHub chiare (bug, enhancement, documentation)'],
    '[
      {"label":"Google Engineering Practices: Code Review","url":"https://google.github.io/eng-practices/review/"},
      {"label":"GitHub PR Templates Guide","url":"https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests"}
    ]'::jsonb,
    null, null
  ),

  -- Root 2: API Testing & Client Tools (Quadrante Tools, Destra)
  (
    'api-client-tools',
    'Postman & API Client Tools',
    'Strumenti di interazione, collaudo, documentazione e simulazione delle API: Postman, Insomnia, Hoppscotch e contratti OpenAPI/Swagger.',
    array[
      'Esporta e versiona le Postman Collection nel repository del progetto per allineare tutto il team.',
      'Configura ambienti separati (Localhost, Staging, Production) usando variabili dinamiche per gli endpoint e token di autenticazione.',
      'Scrivi test automatici negli script Postman per validare status code, tempi di risposta e schema del JSON restituito.'
    ],
    array['Collezioni nominate con il nome del servizio o microservizio', 'Variabili di collezione in camelCase (es. baseUrl, jwtToken)'],
    '[
      {"label":"Postman Learning Center","url":"https://learning.postman.com/docs/"},
      {"label":"Insomnia REST Client Documentation","url":"https://docs.insomnia.rest/"}
    ]'::jsonb,
    1460, 380
  ),

  -- Figlio di api-client-tools: OpenAPI & Swagger
  (
    'swagger-openapi',
    'OpenAPI & Swagger UI',
    'Specifica standard indipendente dal linguaggio per descrivere contratti REST, con generazione automatica di documentazione interattiva e client SDK.',
    array[
      'Adotta l''approccio Design-First scrivendo la specifica OpenAPI (YAML) prima di implementare il codice backend.',
      'Usa Swagger UI o Redoc per fornire documentazione pubblica o interna navigabile e testabile con un click.',
      'Genera interfacce TypeScript dal file OpenAPI tramite tool come openapi-typescript per garantire type-safety end-to-end.'
    ],
    array['File di specifica openapi.yaml o swagger.json', 'Tipi di schema in PascalCase'],
    '[
      {"label":"OpenAPI Specification Official","url":"https://spec.openapis.org/oas/latest.html"},
      {"label":"Swagger UI Getting Started","url":"https://swagger.io/tools/swagger-ui/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di api-client-tools: Mock Servers
  (
    'mock-servers-tools',
    'Mock Servers (MSW & Postman)',
    'Simulazione di API e servizi esterni tramite server fittizi e Mock Service Worker (MSW) per sviluppare il frontend prima del completamento del backend.',
    array[
      'Usa Mock Service Worker (MSW) per intercettare richieste di rete tramite Service Worker nativo nel browser senza modificare il codice di produzione.',
      'Condividi i mock handler tra i test unitari (Vitest) e l''ambiente di sviluppo locale per massima coerenza.',
      'Simula condizioni di errore (401 Unauthorized, 500 Server Error) e latenze lente di rete per testare la resilienza dell''interfaccia.'
    ],
    array['File handler con suffisso .handlers.js o .mock.js', 'Cartella dei mock nominata mocks/'],
    '[
      {"label":"Mock Service Worker (MSW) Documentation","url":"https://mswjs.io/"},
      {"label":"Postman Mock Servers Guide","url":"https://learning.postman.com/docs/designing-and-developing-your-api/mocking-data/setting-up-mock/"}
    ]'::jsonb,
    null, null
  ),

  -- Root 3: Code Quality & Linters (Quadrante Tools, Destra)
  (
    'code-quality-tools',
    'Code Quality & Linters (ESLint, Prettier)',
    'Strumenti di analisi statica del codice (linter) per intercettare bug ed errori semantici, uniti a formattatori automatici per uniformare lo stile del team.',
    array[
      'Separa la formattazione visiva automatica (Prettier) dalle regole logiche e semantiche del codice (ESLint).',
      'Integra eslint-config-prettier per disabilitare tutte le regole di formattazione ESLint in conflitto con Prettier.',
      'Esegui lint e format in CI e impedisci merge di codice che non superi i controlli qualitativi.'
    ],
    array['File di configurazione moderni: eslint.config.js (Flat Config), .prettierrc.json'],
    '[
      {"label":"ESLint Official Documentation","url":"https://eslint.org/"},
      {"label":"Prettier Documentation","url":"https://prettier.io/"}
    ]'::jsonb,
    1400, 580
  ),

  -- Figlio di code-quality-tools: Husky & Git Hooks
  (
    'husky-lint-staged',
    'Husky & Git Hooks (Pre-Commit)',
    'Automazione dei controlli di qualità prima dell''invio del codice: Husky intercetta commit e push eseguendo linters e test solo sui file modificati (lint-staged).',
    array[
      'Usa lint-staged per eseguire ESLint e Prettier unicamente sui file in staging, mantenendo il commit quasi istantaneo.',
      'Valida il messaggio di commit con commitlint nell''hook commit-msg per imporre convenzioni di team.',
      'Non inserire test End-to-End lunghi nell''hook pre-commit; riservali alla pipeline CI remota.'
    ],
    array['Script hooks nella cartella .husky/ (pre-commit, commit-msg)', 'Configurazione in package.json o .lintstagedrc.json'],
    '[
      {"label":"Husky Official Documentation","url":"https://typicode.github.io/husky/"},
      {"label":"lint-staged GitHub Repository","url":"https://github.com/lint-staged/lint-staged"}
    ]'::jsonb,
    null, null
  ),

  -- Root 4: Browser Automation & E2E Testing (Quadrante Tools, Destra)
  (
    'e2e-testing-tools',
    'Testing E2E (Playwright & Cypress)',
    'Framework di automazione del browser reale per simulare percorsi utente completi, interazioni con il DOM, download e scenari cross-browser (Chromium, Firefox, WebKit).',
    array[
      'Usa Playwright per test paralleli ultraveloci, auto-waiting integrato e registrazione video/trace dei fallimenti.',
      'Seleziona gli elementi della pagina usando ruoli accessibili (page.getByRole(''button'', { name: ''Accedi'' })) anziché classi CSS fragili.',
      'Salva e ricarica lo stato di autenticazione dell''utente (storageState) per evitare di effettuare il login manuale in ogni singolo test.'
    ],
    array['File di test con estensione .spec.ts o .test.js in cartella e2e/ o tests/'],
    '[
      {"label":"Playwright Documentation","url":"https://playwright.dev/docs/intro"},
      {"label":"Cypress Official Documentation","url":"https://docs.cypress.io/"}
    ]'::jsonb,
    1460, 780
  ),

  -- Figlio di e2e-testing-tools: Visual Regression
  (
    'visual-regression-testing',
    'Visual Regression Testing',
    'Confronto pixel-by-pixel di screenshot dell''interfaccia generati automaticamente per individuare anomalie grafiche o rotture di layout CSS impreviste.',
    array[
      'Cattura screenshot di confronto (toMatchSnapshot) solo su componenti visivamente stabili eliminando animazioni CSS fluttuanti.',
      'Genera gli screenshot di riferimento negli stessi container Docker/OS usati dalla pipeline CI per evitare differenze di rendering font.',
      'Imposta una soglia di tolleranza minima (es. maxDiffPixelRatio: 0.01) per tollerare minimi artefatti di antialiasing.'
    ],
    array['File snapshot salvati con estensione .png in cartelle __snapshots__'],
    '[
      {"label":"Playwright Visual Comparisons","url":"https://playwright.dev/docs/test-snapshots"},
      {"label":"Percy Visual Testing Platform","url":"https://percy.io/"}
    ]'::jsonb,
    null, null
  )

on conflict (slug) do update set
  label = excluded.label,
  description = excluded.description,
  best_practices = excluded.best_practices,
  naming_conventions = excluded.naming_conventions,
  study_urls = excluded.study_urls,
  position_x = coalesce(excluded.position_x, public.nodes.position_x),
  position_y = coalesce(excluded.position_y, public.nodes.position_y);


-- ----------------------------------------------------------------------------
-- 2. CATEGORIE (public.node_categories)
-- ----------------------------------------------------------------------------
-- Assegna TOOLS come categoria primaria
insert into public.node_categories (node_id, category, is_primary)
select id, 'tools', true from public.nodes where slug in (
  'git-tools',
  'git-workflow-branching',
  'github-collaboration',
  'api-client-tools',
  'swagger-openapi',
  'mock-servers-tools',
  'code-quality-tools',
  'husky-lint-staged',
  'e2e-testing-tools',
  'visual-regression-testing'
)
on conflict (node_id, category) do update set is_primary = excluded.is_primary;

-- Categorie secondarie di connessione verso Frontend, Backend e DevOps
insert into public.node_categories (node_id, category, is_primary)
select id, 'frontend', false from public.nodes where slug in (
  'git-tools',
  'code-quality-tools',
  'e2e-testing-tools',
  'mock-servers-tools'
)
on conflict (node_id, category) do update set is_primary = excluded.is_primary;

insert into public.node_categories (node_id, category, is_primary)
select id, 'backend', false from public.nodes where slug in (
  'git-tools',
  'api-client-tools',
  'swagger-openapi',
  'code-quality-tools'
)
on conflict (node_id, category) do update set is_primary = excluded.is_primary;

insert into public.node_categories (node_id, category, is_primary)
select id, 'devops', false from public.nodes where slug in (
  'git-tools',
  'husky-lint-staged',
  'e2e-testing-tools'
)
on conflict (node_id, category) do update set is_primary = excluded.is_primary;


-- ----------------------------------------------------------------------------
-- 3. RELAZIONI PADRE-FIGLIO (public.node_parents)
-- ----------------------------------------------------------------------------
delete from public.node_parents
where child_id in (
  select id from public.nodes where slug in (
    'git-workflow-branching', 'github-collaboration',
    'swagger-openapi', 'mock-servers-tools',
    'husky-lint-staged', 'visual-regression-testing'
  )
);

insert into public.node_parents (parent_id, child_id, sort_order, is_primary)
select p.id, c.id, rel.sort_order, true
from (
  values
    -- Sotto git-tools
    ('git-tools', 'git-workflow-branching', 0),
    ('git-tools', 'github-collaboration', 1),

    -- Sotto api-client-tools
    ('api-client-tools', 'swagger-openapi', 0),
    ('api-client-tools', 'mock-servers-tools', 1),

    -- Sotto code-quality-tools
    ('code-quality-tools', 'husky-lint-staged', 0),

    -- Sotto e2e-testing-tools
    ('e2e-testing-tools', 'visual-regression-testing', 0)
) as rel(parent_slug, child_slug, sort_order)
join public.nodes p on p.slug = rel.parent_slug
join public.nodes c on c.slug = rel.child_slug
on conflict (parent_id, child_id) do update set
  sort_order = excluded.sort_order,
  is_primary = excluded.is_primary;


-- ----------------------------------------------------------------------------
-- 4. SEZIONI DI CONTENUTO STRUTTURATO (public.node_content_sections)
-- ----------------------------------------------------------------------------
delete from public.node_content_sections
where node_id in (
  select id from public.nodes where slug in (
    'git-tools', 'api-client-tools', 'code-quality-tools', 'e2e-testing-tools'
  )
);

-- Git Tools
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Convenzione Messaggi di Commit (Conventional Commits)', 'table',
  '{"columns":["Prefisso","Significato","Esempio d''uso"],"rows":[["feat","Nuova funzionalità o caratteristica per l''utente","feat: add dark mode toggle to navigation bar"],["fix","Correzione di un bug o comportamento anomalo","fix: resolve memory leak in circular canvas nodes"],["docs","Modifiche alla sola documentazione o commenti","docs: update API endpoints guide in README"],["refactor","Ristrutturazione del codice senza alterare il comportamento esterno","refactor: simplify state selector logic in useMapGraph"],["chore","Aggiornamento dipendenze o task di manutenzione build","chore: bump pnpm dependencies to latest patch"]]}'::jsonb
from public.nodes where slug = 'git-tools';

-- API Client Tools
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Contratti OpenAPI e Generazione Tipi TypeScript', 'code',
  '{"code":"# Esempio comando CLI per generare interfacce TypeScript dal contratto API\nnpx openapi-typescript https://api.devskillmap.local/v1/openapi.yaml -o src/types/api.ts\n\n# Utilizzo nel client API frontend con type safety totale\nimport type { paths } from ''@/types/api'';\n\ntype SkillNodesResponse = paths[''/api/nodes''][''get''][''responses''][''200''][''content''][''application/json''];","language":"bash"}'::jsonb
from public.nodes where slug = 'api-client-tools';

-- Code Quality
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Configurazione lint-staged in package.json', 'code',
  '{"code":"{\n  \"lint-staged\": {\n    \"*.{js,jsx,ts,tsx}\": [\n      \"eslint --fix\",\n      \"prettier --write\"\n    ],\n    \"*.{css,md,json}\": [\n      \"prettier --write\"\n    ]\n  }\n}","language":"json"}'::jsonb
from public.nodes where slug = 'code-quality-tools';

-- Testing E2E
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Test End-to-End con Playwright', 'code',
  '{"code":"import { test, expect } from ''@playwright/test'';\n\ntest(''verifica apertura modale al click su un nodo'', async ({ page }) => {\n  await page.goto(''http://localhost:5173/'');\n  \n  // Seleziona il nodo React con accessibilità esplicita\n  const reactNode = page.getByRole(''button'', { name: /react/i });\n  await expect(reactNode).toBeVisible();\n  \n  // Click per aprire i dettagli\n  await reactNode.click();\n  \n  // Verifica apertura modale\n  const modalDialog = page.getByRole(''dialog'');\n  await expect(modalDialog).toBeVisible();\n  await expect(modalDialog).toContainText(''Component-Based'');\n});","language":"js"}'::jsonb
from public.nodes where slug = 'e2e-testing-tools';
