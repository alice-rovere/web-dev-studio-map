# DevSkillMap - Roadmap SQL per Macrocategoria

I file contenuti in questa cartella permettono di popolare la mappa delle competenze con la roadmap completa da Full Stack Developer basata sulle specifiche ufficiali di [roadmap.sh](https://roadmap.sh) e sui requisiti definiti in `dainserire.txt`.

## Struttura dei File

I file sono suddivisi rigorosamente per macrocategoria:

1. **`01_frontend.sql` (Frontend Development)**
   - **Internet & Web Fundamentals**: `internet-browser`, `http-protocol`, `browser-rendering`.
   - **HTML5 & A11y**: `accessibilita-aria` (linee guida per non vedenti, screen reader, `aria-label`, `aria-hidden`).
   - **CSS3 Avanzato**: `css-layout` (Flexbox & Grid), `css-bem-architettura` (BEM), `media-queries` (Responsive & Mobile-First), `ui-frameworks-css` (Sass, Shadcn/ui).
   - **JavaScript & Tooling**: `js-scope-closures`, `typescript`, `axios-client`, `package-managers` (npm, pnpm, yarn), `npx-runner` (CLI & one-off runner), `build-tools-bundlers` (Webpack, ESLint, Prettier), `vite`.
   - **Framework Component-Based**: `react`, `nextjs` (SSR/SSG), `state-management` (Zustand/Redux), `react-three-fiber` (3D canvas), `react-flow` (grafi interattivi), `vuejs`, `nuxtjs`, `angular`, `sveltekit`.
   - **Testing & Version Control**: `testing-frontend` (Vitest, Playwright), `git-version-control`.

2. **`02_backend.sql` (Backend Development)**
   - **Node.js & Runtime**: `nodejs`, `bun-deno` (alternative moderne), `expressjs`, `nestjs`, `fastify`.
   - **API Architecture**: `api-architettura` (Root), `rest-api`, `graphql-grpc`, `websockets`, `postman-api-tools` (collezioni e automazione test), `architettura-mvc` (Pattern MVC e separazione delle responsabilità).
   - **Sicurezza & Autenticazione**: `backend-security` (Root), `auth-jwt-oauth` (JWT, OAuth 2.0, Sessioni/Cookie), `owasp-security` (OWASP Top 10, SQLi, XSS, CSRF, CORS), `password-hashing` (bcrypt, Argon2), `backend-caching` (Redis in-memory), `message-brokers` (RabbitMQ, Kafka).
   - **Linguaggi Server**: `backend-languages` (Root), `python-backend` (FastAPI & Django), `dotnet` (C# e .NET Core), `java-spring` (Spring Boot), `golang` (Go), `php-laravel` (Laravel).
   - **Testing**: `testing-backend` (Unit & Integration).

3. **`03_database.sql` (Database & Storage)**
   - **Database Relazionali**: `database-relazionali` (Root RDBMS), `sql-dml-ddl` (SQL DDL/DML, transazioni ACID), `rdbms-engines` (Postgres, MySQL, SQLite), `database-optimization` (indici B-Tree, EXPLAIN ANALYZE, normalizzazione).
   - **Database Non Relazionali**: `database-nosql` (Root NoSQL), `document-db-mongodb` (MongoDB & BSON), `key-value-redis` (Redis), `search-graph-stores` (Elasticsearch, Neo4j).
   - **Astrazione & BaaS**: `orm-odm-tools` (Root), `orm-libraries` (Prisma, Mongoose, Hibernate, SQLAlchemy), `database-migrations` (Flyway, Alembic), `baas-supabase-firebase` (Supabase Postgres/RLS e Firebase).

4. **`04_devops.sql` (DevOps, Cloud & Deployment)**
   - **Containerizzazione & Orchestrazione**: `docker-containers` (Root Docker, Dockerfile multi-stage, Compose), `kubernetes` (K8s pods, cluster, ingress), `web-servers-proxy` (Nginx, Caddy, reverse proxy e SSL).
   - **CI/CD & Monitoraggio**: `ci-cd-pipelines` (Root GitHub Actions, GitLab CI), `monitoring-observability` (Prometheus, Grafana, Datadog, ELK).
   - **Cloud, PaaS & IaC**: `cloud-providers` (Root AWS, GCP, Azure), `paas-serverless` (Vercel, Netlify, Render, AWS Lambda), `infrastructure-as-code` (Terraform HCL).

---

## Come Eseguire gli Script su Supabase

1. Accedi alla dashboard di Supabase sul tuo progetto.
2. Apri lo **SQL Editor**.
3. Assicurati che lo schema iniziale e il seed base siano stati eseguiti (`0001_init.sql`, `0002_rls.sql` e facoltativamente `seed.sql`).
4. Esegui i file nell'ordine desiderato o tutti insieme:
   - `01_frontend.sql`
   - `02_backend.sql`
   - `03_database.sql`
   - `04_devops.sql`

> **Note di Sicurezza e Idempotenza:**
> - Tutti gli script usano `ON CONFLICT DO UPDATE` per `nodes`, `node_categories` e `node_parents`.
> - Non generano errori di chiave duplicata se rieseguiti più volte.
> - Le foreign key vengono collegate dinamicamente tramite subquery su `slug` (`(SELECT id FROM public.nodes WHERE slug = ...)`).
> - Solo i nodi radice definiscono coordinate `position_x` e `position_y`; tutti i nodi figli hanno valori `NULL`, venendo calcolati in geometria circolare dal motore React Flow dell'applicazione.
