-- ============================================================================
-- DEVSKILLMAP - ROADMAP MACROCATEGORIA 4: DEVOPS, CLOUD & DEPLOYMENT
-- File: supabase/roadmaps/04_devops.sql
-- ============================================================================
-- Include:
-- - Containerizzazione: Docker (Dockerfile, OCI Images, Docker Compose)
-- - Orchestrazione: Kubernetes (K8s Clusters, Pods, Services, Ingress)
-- - Automazione CI/CD: GitHub Actions, GitLab CI, Build & Test Pipelines
-- - Hyperscaler Cloud Providers: AWS, Google Cloud Platform, Microsoft Azure
-- - PaaS & Serverless Deploy Rapido: Vercel, Netlify, Render, AWS Lambda
-- - Web Server & Reverse Proxy: Nginx, Apache, Caddy, SSL Termination
-- - Infrastructure as Code (IaC): Terraform, configurazione dichiarativa
-- - Monitoraggio & Osservabilità: Prometheus, Grafana, Datadog, ELK Stack
--
-- NOTA CATEGORIA:
-- Nel rispetto del vincolo CHECK (category in ('frontend', 'backend', 'database')),
-- tutti i nodi DevOps hanno come categoria primaria 'backend', con categoria secondaria
-- 'frontend' per le piattaforme di deploy web (Vercel, PaaS).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. NODI TECNOLOGICI (public.nodes)
-- ----------------------------------------------------------------------------
insert into public.nodes (slug, label, description, best_practices, naming_conventions, study_urls, position_x, position_y)
values
  -- Root: Containerizzazione Docker
  (
    'docker-containers',
    'Docker & Containerizzazione',
    'Standard de facto per impacchettare applicazioni con tutte le loro dipendenze in container leggeri, isolati e riproducibili ovunque.',
    array[
      'Usa build multi-stage nel Dockerfile per mantenere le immagini finali di produzione sotto i 100MB.',
      'Non eseguire mai i container come utente root; specifica sempre un utente non privilegiato (USER node).',
      'Inserisci file non necessari (.git, node_modules, .env) nel file .dockerignore.'
    ],
    array['Immagini taggate con SemVer o commit SHA (mai solo :latest in produzione)', 'File di configurazione docker-compose.yml'],
    '[
      {"label":"Docker Official Documentation","url":"https://docs.docker.com/"},
      {"label":"Docker Multi-stage Builds Guide","url":"https://docs.docker.com/build/building/multi-stage/"}
    ]'::jsonb,
    740, 920
  ),

  -- Figlio di docker-containers: Kubernetes
  (
    'kubernetes',
    'Kubernetes (K8s)',
    'Piattaforma open source di orchestrazione per automatizzare il deployment, lo scaling orizzontale e la gestione di cluster di container complessi.',
    array[
      'Dichiara sempre richieste e limiti di risorse (requests e limits per CPU e memoria) su ogni container nei Pod.',
      'Configura liveness e readiness probe per consentire a K8s di riavviare i container guasti o instradarvi traffico solo quando pronti.',
      'Usa Helm o Kustomize per gestire i manifesti YAML parametrizzati tra ambienti di dev, staging e prod.'
    ],
    array['Risorse Kubernetes nominate in kebab-case nei manifesti YAML', 'Namespace dedicati per ambiente (es. dev, staging, prod)'],
    '[
      {"label":"Kubernetes Documentation","url":"https://kubernetes.io/docs/home/"},
      {"label":"Kubernetes Interactive Tutorials","url":"https://kubernetes.io/docs/tutorials/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di docker-containers: Web Server & Reverse Proxy
  (
    'web-servers-proxy',
    'Web Server & Reverse Proxy',
    'Server HTTP ad alte prestazioni (Nginx, Caddy, Apache) per terminazione SSL/TLS, load balancing, compressione gzip/brotli e reverse proxy verso app node/python.',
    array[
      'Configura HTTP/2 o HTTP/3 e compressione Brotli per accelerare il caricamento delle risorse statiche.',
      'Imposta intestazioni di sicurezza restrittive (HSTS, X-Content-Type-Options, CSP) a livello di web server.',
      'Sfrutta Caddy per certificati SSL gratuiti rilasciati e rinnovati in modo completamente automatico tramite Let''s Encrypt.'
    ],
    array['Configurazione Nginx in /etc/nginx/sites-available/', 'Direttive server block in lowercase'],
    '[
      {"label":"Nginx Documentation & Guides","url":"https://nginx.org/en/docs/"},
      {"label":"Caddy Server Official Site","url":"https://caddyserver.com/"}
    ]'::jsonb,
    null, null
  ),

  -- Root: CI/CD & Pipeline
  (
    'ci-cd-pipelines',
    'CI/CD & Automazione Pipeline',
    'Pratiche di Continuous Integration (test e lint automatici ad ogni push) e Continuous Deployment (rilascio automatico in staging/produzione).',
    array[
      'Fai fallire la pipeline immediatamente al primo errore di lint o test unitario (fail-fast).',
      'Non inserire mai token o credenziali in chiaro nei file di workflow; usa i Secrets cifrati (es. GitHub Actions Secrets).',
      'Fai la build del pacchetto una sola volta e distribuisci lo stesso identico artefatto attraverso i vari ambienti.'
    ],
    array['File di workflow GitHub in .github/workflows/*.yml', 'Job nominati chiaramente (lint, test, build, deploy)'],
    '[
      {"label":"GitHub Actions Documentation","url":"https://docs.github.com/en/actions"},
      {"label":"GitLab CI/CD Documentation","url":"https://docs.gitlab.com/ee/ci/"}
    ]'::jsonb,
    960, 720
  ),

  -- Figlio di ci-cd-pipelines: Monitoraggio & Osservabilità
  (
    'monitoring-observability',
    'Monitoraggio & Log (Grafana, ELK)',
    'Pilastri dell''osservabilità: Metriche temporali (Prometheus), Dashboard visive (Grafana), Logging centralizzato (ELK/Loki) e Tracing distribuito (OpenTelemetry).',
    array[
      'Monitora i 4 segnali d''oro di Google SRE: Latenza, Traffico, Errori e Saturazione (Golden Signals).',
      'Struttura i log dell''applicazione in formato JSON per facilitare la ricerca e l''indicizzazione in ELK o Datadog.',
      'Imposta alert intelligenti con soglie di allarme e notifiche dirette (Slack, PagerDuty).'
    ],
    array['Metriche conformi a OpenTelemetry (es. http_requests_total)', 'Log level rigorosi: DEBUG, INFO, WARN, ERROR, FATAL'],
    '[
      {"label":"Prometheus Getting Started","url":"https://prometheus.io/docs/introduction/overview/"},
      {"label":"Grafana Official Tutorials","url":"https://grafana.com/tutorials/"},
      {"label":"Google SRE Book: Monitoring Distributed Systems","url":"https://sre.google/sre-book/monitoring-distributed-systems/"}
    ]'::jsonb,
    null, null
  ),

  -- Root: Cloud Providers
  (
    'cloud-providers',
    'Cloud Providers (AWS, GCP, Azure)',
    'Infrastrutture hyperscaler per il provisioning scalabile su richiesta di risorse computazionali (EC2, VM), storage a oggetti (S3, GCS) e reti virtuali private (VPC).',
    array[
      'Applica rigorosamente il Least Privilege su ruoli e policy IAM (Identity and Access Management).',
      'Configura alert sul budget per monitorare e prevenire picchi imprevisti nei costi di fatturazione cloud.',
      'Sfrutta le zone di disponibilità multiple (Multi-AZ) per garantire l''alta affidabilità dei servizi critici.'
    ],
    array['Risorse cloud taggate per ambiente, proprietario e centro di costo (es. env=production, team=backend)'],
    '[
      {"label":"AWS Well-Architected Framework","url":"https://aws.amazon.com/architecture/well-architected/"},
      {"label":"Google Cloud Architecture Center","url":"https://cloud.google.com/architecture"}
    ]'::jsonb,
    960, 920
  ),

  -- Figlio di cloud-providers: PaaS & Serverless
  (
    'paas-serverless',
    'PaaS & Serverless (Vercel, Lambda)',
    'Piattaforme di deployment rapido ad alta produttività: deploy Git-driven (Vercel, Netlify, Render) e funzioni di computazione stateless on-demand (AWS Lambda).',
    array[
      'Usa Vercel o Netlify per frontend Jamstack e meta-framework (Next.js, Vite) con preview deployment automatiche su ogni PR.',
      'Ottimizza i cold start delle funzioni serverless riducendo le dipendenze importate e la dimensione del bundle.',
      'Tieni conto del limite massimo di timeout (es. 10-15s) delle funzioni serverless evitando task a lungo termine.'
    ],
    array['File di configurazione vercel.json o netlify.toml nella root del progetto'],
    '[
      {"label":"Vercel Platform Documentation","url":"https://vercel.com/docs"},
      {"label":"AWS Lambda Developer Guide","url":"https://docs.aws.amazon.com/lambda/latest/dg/welcome.html"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di cloud-providers: Infrastructure as Code
  (
    'infrastructure-as-code',
    'Infrastructure as Code (Terraform)',
    'Definizione, provisioning e gestione dell''infrastruttura cloud tramite file di configurazione dichiarativi versionabili (HCL) anziché click manuali su console.',
    array[
      'Salva sempre il file di stato (terraform.tfstate) in un backend remoto sicuro con blocco concorrenza (es. S3 + DynamoDB).',
      'Esegui sempre terraform plan prima di terraform apply per verificare le risorse che verranno create, modificate o distrutte.',
      'Organizza il codice in moduli riutilizzabili per evitare duplicazioni tra ambienti di staging e produzione.'
    ],
    array['File di configurazione con estensione .tf', 'Variabili dichiarate in variables.tf e valori d''ambiente in terraform.tfvars'],
    '[
      {"label":"Terraform Official Documentation","url":"https://developer.hashicorp.com/terraform/docs"},
      {"label":"HashiCorp Learn Terraform","url":"https://developer.hashicorp.com/terraform/tutorials"}
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
insert into public.node_categories (node_id, category, is_primary)
select id, 'backend', true from public.nodes where slug in (
  'docker-containers',
  'kubernetes',
  'web-servers-proxy',
  'ci-cd-pipelines',
  'monitoring-observability',
  'cloud-providers',
  'paas-serverless',
  'infrastructure-as-code'
)
on conflict (node_id, category) do update set is_primary = excluded.is_primary;

-- Categoria secondaria frontend per piattaforme PaaS/Vercel usate per deploy web
insert into public.node_categories (node_id, category, is_primary)
select id, 'frontend', false from public.nodes where slug in ('paas-serverless')
on conflict (node_id, category) do update set is_primary = excluded.is_primary;


-- ----------------------------------------------------------------------------
-- 3. RELAZIONI PADRE-FIGLIO (public.node_parents)
-- ----------------------------------------------------------------------------
delete from public.node_parents
where child_id in (
  select id from public.nodes where slug in (
    'kubernetes', 'web-servers-proxy', 'monitoring-observability',
    'paas-serverless', 'infrastructure-as-code'
  )
);

insert into public.node_parents (parent_id, child_id, sort_order, is_primary)
select p.id, c.id, rel.sort_order, true
from (
  values
    -- Sotto docker-containers
    ('docker-containers', 'kubernetes', 0),
    ('docker-containers', 'web-servers-proxy', 1),

    -- Sotto ci-cd-pipelines
    ('ci-cd-pipelines', 'monitoring-observability', 0),

    -- Sotto cloud-providers
    ('cloud-providers', 'paas-serverless', 0),
    ('cloud-providers', 'infrastructure-as-code', 1)
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
    'docker-containers', 'ci-cd-pipelines', 'web-servers-proxy', 'paas-serverless'
  )
);

-- Docker
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Dockerfile Multi-Stage per Node / Vite', 'code',
  '{"code":"# Stage 1: Build dell''applicazione con Node e pnpm\nFROM node:22-alpine AS builder\nWORKDIR /app\nRUN corepack enable && corepack prepare pnpm@latest --activate\nCOPY package.json pnpm-lock.yaml ./\nRUN pnpm install --frozen-lockfile\nCOPY . .\nRUN pnpm build\n\n# Stage 2: Serve dei file statici con Nginx leggero (15MB)\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\nEXPOSE 80\nCMD [\"nginx\", \"-g\", \"daemon off;\"]","language":"dockerfile"}'::jsonb
from public.nodes where slug = 'docker-containers';

-- CI/CD GitHub Actions
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Workflow GitHub Actions di Validazione', 'code',
  '{"code":"name: CI Pipeline\n\non:\n  push:\n    branches: [main]\n  pull_request:\n    branches: [main]\n\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: pnpm/action-setup@v4\n        with:\n          version: 9\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n          cache: ''pnpm''\n      - run: pnpm install --frozen-lockfile\n      - run: pnpm lint\n      - run: pnpm build","language":"yaml"}'::jsonb
from public.nodes where slug = 'ci-cd-pipelines';

-- Nginx Reverse Proxy
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Configurazione Nginx Reverse Proxy', 'code',
  '{"code":"server {\n    listen 80;\n    server_name api.devskillmap.local;\n\n    # Inoltro chiamate al processo Node in background\n    location / {\n        proxy_pass http://127.0.0.1:4000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection ''upgrade'';\n        proxy_set_header Host $host;\n        proxy_cache_bypass $http_upgrade;\n    }\n}","language":"nginx"}'::jsonb
from public.nodes where slug = 'web-servers-proxy';

-- PaaS & Vercel
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Vantaggi del Deploy PaaS Moderno', 'list',
  '{"items":["Preview environments automatiche su ogni pull request per review visiva immediata","Edge Network globale con caching intelligente e latenze ridotte per gli utenti finali","Configurazione zero per certificati SSL/TLS e domini personalizzati","Integrazione nativa con GitHub e Webhook per continui rilasci senza downtime"]}'::jsonb
from public.nodes where slug = 'paas-serverless';
