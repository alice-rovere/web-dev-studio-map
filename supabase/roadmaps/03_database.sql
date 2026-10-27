-- ============================================================================
-- DEVSKILLMAP - ROADMAP MACROCATEGORIA 3: DATABASE & STORAGE
-- File: supabase/roadmaps/03_database.sql
-- ============================================================================
-- Include:
-- - Database Relazionali (RDBMS): Modello tabellare, vincoli, integrità referenziale
-- - SQL Fondamentale (DDL, DML, DQL), Normalizzazione (1NF-3NF) e Transazioni ACID
-- - Motori RDBMS principali: PostgreSQL, MySQL, SQLite, SQL Server
-- - Ottimizzazione: Indici (B-Tree, GIN), Piani di Esecuzione (EXPLAIN ANALYZE)
-- - Database Non Relazionali (NoSQL): Document Store (MongoDB), Key-Value (Redis), Search/Graph
-- - Strumenti di Astrazione: ORM / ODM (Prisma, Mongoose, SQLAlchemy, Hibernate)
-- - Database Migrations: Gestione delle evoluzioni di schema come codice
-- - BaaS & Cloud Databases: Supabase (Postgres + RLS) e Firebase
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. NODI TECNOLOGICI (public.nodes)
-- ----------------------------------------------------------------------------
insert into public.nodes (slug, label, description, best_practices, naming_conventions, study_urls, position_x, position_y)
values
  -- Root: Database Relazionali (RDBMS)
  (
    'database-relazionali',
    'Database Relazionali (RDBMS)',
    'Sistemi di gestione dati basati sul modello relazionale di Codd, tabelle strutturate, schemi rigidi e garanzie di integrità ACID.',
    array[
      'Progetta lo schema con chiavi primarie univoche (UUID o BigSerial) e vincoli di chiave esterna (Foreign Keys).',
      'Definisci politiche esplicite su eliminazione dei record correlati (ON DELETE CASCADE o ON DELETE RESTRICT).',
      'Garantisci che ogni tabella rappresenti una singola entità logica ben definita.'
    ],
    array['Tabelle in snake_case e al plurale (es. user_profiles, order_items)', 'Chiavi primarie convenzionali id, chiavi esterne <entita_singolare>_id'],
    '[
      {"label":"PostgreSQL Official Documentation","url":"https://www.postgresql.org/docs/"},
      {"label":"Relational Database Concepts (Stanford)","url":"https://web.stanford.edu/class/cs145/"}
    ]'::jsonb,
    420, 640
  ),

  -- Figlio di database-relazionali: SQL DML / DDL / ACID
  (
    'sql-dml-ddl',
    'SQL & Transazioni ACID',
    'Linguaggio SQL suddiviso in DDL (definizione schema), DML (manipolazione dati), DQL (interrogazioni) e gestione atomica delle transazioni ACID.',
    array[
      'Raggruppa operazioni correlate in transazioni (BEGIN / COMMIT / ROLLBACK) per prevenire stati inconsistenti.',
      'Scegli il corretto livello di isolamento transazionale (Read Committed vs Serializable) in base alla concorrenza.',
      'Evita SELECT * in produzione; elenca sempre e solo le colonne necessarie.'
    ],
    array['Comandi e parole chiave SQL in MAIUSCOLO (SELECT, INSERT, UPDATE, JOIN)', 'Alias di colonna in snake_case'],
    '[
      {"label":"PostgreSQL Tutorial: SQL Basics","url":"https://www.postgresqltutorial.com/"},
      {"label":"ACID Properties in Databases Explained","url":"https://en.wikipedia.org/wiki/ACID"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di database-relazionali: Motori RDBMS
  (
    'rdbms-engines',
    'Motori RDBMS (Postgres, MySQL, SQLite)',
    'Panoramica dei principali database SQL: PostgreSQL per estendibilità e JSONB avanzato, MySQL/MariaDB per popolarità web, SQLite per database serverless file-based.',
    array[
      'Usa SQLite per test locali veloci, app desktop/mobile o database monolitici a basso traffico.',
      'Scegli PostgreSQL come standard moderno per progetti cloud con tipi avanzati (UUID, JSONB, array, PostGIS).',
      'Configura pool di connessioni (es. PgBouncer o HikariCP) per prevenire l''esaurimento delle connessioni server.'
    ],
    array['Database in lowercase', 'File di backup con estensione .sql o .dump'],
    '[
      {"label":"PostgreSQL Features","url":"https://www.postgresql.org/about/"},
      {"label":"SQLite Official Website","url":"https://www.sqlite.org/index.html"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di database-relazionali: Ottimizzazione & Indici
  (
    'database-optimization',
    'Ottimizzazione SQL & Indici',
    'Tecniche per velocizzare le query: indici B-Tree e GIN, interpretazione del piano di esecuzione con EXPLAIN ANALYZE e normalizzazione 1NF/2NF/3NF.',
    array[
      'Aggiungi indici solo sulle colonne usate frequentemente in clausole WHERE, JOIN e ORDER BY; troppi indici rallentano le INSERT.',
      'Analizza i colli di bottiglia con EXPLAIN (ANALYZE, BUFFERS) individuando scansioni sequenziali (Seq Scan) costose.',
      'Normalizza fino alla 3a Forma Normale per evitare ridondanze, denormalizzando selettivamente solo per query analitiche critiche.'
    ],
    array['Indici con naming convenzionale idx_<tabella>_<colonna> (es. idx_users_email)'],
    '[
      {"label":"Use The Index, Luke!","url":"https://use-the-index-luke.com/"},
      {"label":"PostgreSQL EXPLAIN Explained","url":"https://www.depesz.com/tag/explain/"}
    ]'::jsonb,
    null, null
  ),

  -- Root: Database Non Relazionali (NoSQL)
  (
    'database-nosql',
    'Database NoSQL',
    'Sistemi di archiviazione non tabellari progettati per schemi dinamici, scalabilità orizzontale (sharding), elevato throughput e modelli di dati specifici.',
    array[
      'Scegli NoSQL quando il modello di dati non presenta relazioni complesse o quando hai carichi di scrittura distribuiti enormi.',
      'Progetta la struttura dei documenti in base ai pattern di query del client anziché sul modello concettuale.',
      'Valuta il trade-off del teorema CAP (Consistency, Availability, Partition Tolerance) e la consistenza eventuale.'
    ],
    array['Collezioni NoSQL al plurale in lowercase', 'Campi documento in camelCase o snake_case consistente'],
    '[
      {"label":"MongoDB What is NoSQL","url":"https://www.mongodb.com/nosql-explained"},
      {"label":"AWS: What is NoSQL?","url":"https://aws.amazon.com/nosql/"}
    ]'::jsonb,
    700, 640
  ),

  -- Figlio di database-nosql: Document DB (MongoDB)
  (
    'document-db-mongodb',
    'Document Store (MongoDB & BSON)',
    'Database orientato ai documenti JSON/BSON con supporto a schemi flessibili, documenti nidificati e pipeline di aggregazione potenti.',
    array[
      'Includi (embed) dati correlati quando vengono quasi sempre letti insieme; usa riferimenti se il documento rischia di superare il limite di 16MB.',
      'Sfrutta la Aggregation Pipeline per trasformazioni complesse ($match, $group, $lookup, $project).',
      'Crea indici composti per coprire le query frequenti e sfruttare covered queries.'
    ],
    array['ID primario obbligatorio _id generato come ObjectId'],
    '[
      {"label":"MongoDB Documentation","url":"https://www.mongodb.com/docs/"},
      {"label":"MongoDB University Free Courses","url":"https://learn.mongodb.com/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di database-nosql: Key-Value (Redis)
  (
    'key-value-redis',
    'Key-Value Store (Redis)',
    'Archivio di strutture dati in memoria ultraveloce utilizzato come database primario no-sql, caching sub-millisecondo, rate-limiting e message broker.',
    array[
      'Sfrutta strutture dati native oltre le semplici stringhe: Hashes, Sets, Sorted Sets (ZSET) per classifiche temporizzate.',
      'Imposta sempre una politica di memoria massima ed eviction (es. allkeys-lru) per prevenire Out Of Memory (OOM).',
      'Usa Redis Streams o Pub/Sub per scambiare messaggi leggeri tra worker in tempo reale.'
    ],
    array['Chiavi delimitate da due punti con namespace: prefisso:entita:id'],
    '[
      {"label":"Redis Documentation","url":"https://redis.io/docs/latest/"},
      {"label":"Redis University","url":"https://university.redis.io/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di database-nosql: Search & Graph Stores
  (
    'search-graph-stores',
    'Search & Graph Stores (Elasticsearch & Neo4j)',
    'Database specializzati: Elasticsearch per ricerca full-text vettoriale e log analysis; Neo4j per navigazione rapida di grafi e reti di connessione.',
    array[
      'Usa Elasticsearch per motori di ricerca con filtri faceted, fuzzy search ed elaborazione del linguaggio naturale.',
      'Usa Neo4j o database a grafo quando le relazioni tra nodi sono il cuore del dominio (es. social network, frodi, recommendation).',
      'Sincronizza il motore di ricerca dal database primario tramite Change Data Capture (CDC) o messaggistica asincrona.'
    ],
    array['Indici di ricerca con prefisso di contesto in kebab-case', 'Nodi ed archi di grafo tipizzati in PascalCase'],
    '[
      {"label":"Elasticsearch Official Documentation","url":"https://www.elastic.co/guide/index.html"},
      {"label":"Neo4j Graph Database Concepts","url":"https://neo4j.com/docs/getting-started/"}
    ]'::jsonb,
    null, null
  ),

  -- Root: ORM, ODM & Migrazioni
  (
    'orm-odm-tools',
    'ORM, ODM & Migrazioni',
    'Layer di astrazione per interagire con i database attraverso oggetti nativi del linguaggio di programmazione e controllo di versione dello schema.',
    array[
      'Usa un ORM per accelerare lo sviluppo e prevenire injection, ma mantieni la capacità di scrivere query SQL grezze per ottimizzazioni.',
      'Attenzione al problema delle query N+1: usa eager loading o include espliciti per caricare le relazioni con JOIN singole.',
      'Non modificare mai il database di produzione manualmente; applica ogni cambiamento tramite file di migrazione versionati.'
    ],
    array['File di schema con estensioni dedicate (es. schema.prisma)', 'File di migrazione prefissati da timestamp o sequenza numerica'],
    '[
      {"label":"Prisma ORM Documentation","url":"https://www.prisma.io/docs"},
      {"label":"Martin Fowler: Object-Relational Mapping","url":"https://martinfowler.com/bliki/OrmHate.html"}
    ]'::jsonb,
    560, 840
  ),

  -- Figlio di orm-odm-tools: Librerie ORM & ODM
  (
    'orm-libraries',
    'Librerie ORM & ODM (Prisma, Mongoose)',
    'Ecosistema di librerie: Prisma (type-safe per Node/TS), Mongoose (ODM per MongoDB), SQLAlchemy (Python) e Hibernate/JPA (Java).',
    array[
      'In TypeScript, sfrutta Prisma per generare automaticamente i tipi TypeScript derivati direttamente dallo schema del database.',
      'In Mongoose, definisci validatori rigorosi a livello di Schema per compensare la flessibilità di MongoDB.',
      'Disabilita il tracking degli oggetti nelle query di sola lettura (es. AsNoTracking in EF Core o lean() in Mongoose) per dimezzare la RAM.'
    ],
    array['Modelli ORM al singolare in PascalCase (es. User, Post, Category)'],
    '[
      {"label":"Prisma Getting Started","url":"https://www.prisma.io/docs/getting-started"},
      {"label":"Mongoose Official Guide","url":"https://mongoosejs.com/docs/guide.html"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di orm-odm-tools: Database Migrations
  (
    'database-migrations',
    'Database Migrations & Versioning',
    'Gestione dell''evoluzione dello schema del database come codice tracciabile in Git con script incrementali up/down e automazione in CI/CD.',
    array[
      'Scrivi migrazioni backward-compatible: aggiungi colonne con valori di default o nullable prima di rimuovere vecchi campi (Expand and Contract pattern).',
      'Non inserire operazioni lunghe o lock esclusivi su tabelle gigantesche in ore di punta.',
      'Verifica sempre il comando di rollback o assicurati che ogni migrazione sia atomica.'
    ],
    array['Nomi di migrazione: YYYYMMDDHHMMSS_descrizione_azione.sql (es. 20261027_add_avatar_to_users.sql)'],
    '[
      {"label":"Flyway Database Migrations","url":"https://documentation.red-gate.com/fd"},
      {"label":"Evolutionary Database Design (Martin Fowler)","url":"https://martinfowler.com/articles/evodb.html"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di orm-odm-tools: BaaS (Supabase & Firebase)
  (
    'baas-supabase-firebase',
    'BaaS & Cloud DB (Supabase & Firebase)',
    'Piattaforme Backend-as-a-Service che forniscono database cloud gestiti, autenticazione integrata, Row Level Security (RLS) e sincronizzazione real-time.',
    array[
      'In Supabase, abilita tassativamente Row Level Security (RLS) su ogni tabella pubblica per proteggere l''accesso a livello di riga.',
      'Sfrutta le Foreign Table e i trigger SQL in Supabase per automatizzare sincronizzazioni profili utente.',
      'Usa Firebase Firestore per prototipazione rapida e app mobile no-backend, prestando attenzione ai costi di lettura per query frequenti.'
    ],
    array['Policy RLS descrittive con azione (es. "Gli utenti possono modificare solo il proprio profilo")'],
    '[
      {"label":"Supabase Official Documentation","url":"https://supabase.com/docs"},
      {"label":"Supabase Row Level Security Guide","url":"https://supabase.com/docs/guides/database/postgres/row-level-security"},
      {"label":"Firebase Firestore Documentation","url":"https://firebase.google.com/docs/firestore"}
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
select id, 'database', true from public.nodes where slug in (
  'database-relazionali',
  'sql-dml-ddl',
  'rdbms-engines',
  'database-optimization',
  'database-nosql',
  'document-db-mongodb',
  'key-value-redis',
  'search-graph-stores',
  'orm-odm-tools',
  'orm-libraries',
  'database-migrations',
  'baas-supabase-firebase'
)
on conflict (node_id, category) do update set is_primary = excluded.is_primary;

-- Categorie secondarie backend per strumenti di integrazione
insert into public.node_categories (node_id, category, is_primary)
select id, 'backend', false from public.nodes where slug in (
  'key-value-redis',
  'orm-libraries',
  'database-migrations',
  'baas-supabase-firebase'
)
on conflict (node_id, category) do update set is_primary = excluded.is_primary;


-- ----------------------------------------------------------------------------
-- 3. RELAZIONI PADRE-FIGLIO (public.node_parents)
-- ----------------------------------------------------------------------------
delete from public.node_parents
where child_id in (
  select id from public.nodes where slug in (
    'sql-dml-ddl', 'rdbms-engines', 'database-optimization',
    'document-db-mongodb', 'key-value-redis', 'search-graph-stores',
    'orm-libraries', 'database-migrations', 'baas-supabase-firebase'
  )
);

insert into public.node_parents (parent_id, child_id, sort_order, is_primary)
select p.id, c.id, rel.sort_order, true
from (
  values
    -- Sotto database-relazionali
    ('database-relazionali', 'sql-dml-ddl', 0),
    ('database-relazionali', 'rdbms-engines', 1),
    ('database-relazionali', 'database-optimization', 2),

    -- Sotto database-nosql
    ('database-nosql', 'document-db-mongodb', 0),
    ('database-nosql', 'key-value-redis', 1),
    ('database-nosql', 'search-graph-stores', 2),

    -- Sotto orm-odm-tools
    ('orm-odm-tools', 'orm-libraries', 0),
    ('orm-odm-tools', 'database-migrations', 1),
    ('orm-odm-tools', 'baas-supabase-firebase', 2)
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
    'database-relazionali', 'sql-dml-ddl', 'rdbms-engines', 'database-optimization',
    'database-nosql', 'key-value-redis', 'baas-supabase-firebase', 'orm-libraries'
  )
);

-- SQL DML / DDL / Transazioni
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Sottoinsiemi del Linguaggio SQL', 'table',
  '{"columns":["Sottoinsieme","Significato","Comandi Tipici"],"rows":[["DDL","Data Definition Language: crea e modifica strutture","CREATE, ALTER, DROP, TRUNCATE"],["DML","Data Manipulation Language: manipola i record","INSERT, UPDATE, DELETE"],["DQL","Data Query Language: interroga i dati","SELECT con WHERE, GROUP BY, JOIN"],["TCL","Transaction Control Language: gestisce transazioni","BEGIN, COMMIT, ROLLBACK, SAVEPOINT"]]}'::jsonb
from public.nodes where slug = 'sql-dml-ddl';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Transazione Atomica con Rollback Sicuro', 'code',
  '{"code":"BEGIN;\n\n-- Scalo l''importo dal conto mittente\nUPDATE accounts\nSET balance = balance - 150.00\nWHERE id = ''account-a'' AND balance >= 150.00;\n\n-- Accredito l''importo al conto destinatario\nUPDATE accounts\nSET balance = balance + 150.00\nWHERE id = ''account-b'';\n\n-- Registrazione log audit del bonifico\nINSERT INTO transaction_logs (source_id, target_id, amount, created_at)\nVALUES (''account-a'', ''account-b'', 150.00, NOW());\n\nCOMMIT;","language":"sql"}'::jsonb
from public.nodes where slug = 'sql-dml-ddl';

-- Ottimizzazione & Indici
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Analisi di Query con EXPLAIN ANALYZE', 'code',
  '{"code":"-- Esempio di analisi del piano di esecuzione in PostgreSQL\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT u.email, count(o.id) as order_count\nFROM users u\nJOIN orders o ON o.user_id = u.id\nWHERE u.created_at >= NOW() - INTERVAL ''30 days''\nGROUP BY u.email\nORDER BY order_count DESC\nLIMIT 10;","language":"sql"}'::jsonb
from public.nodes where slug = 'database-optimization';

-- BaaS Supabase & Firebase
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Confronto Supabase vs Firebase', 'table',
  '{"columns":["Caratteristica","Supabase","Firebase"],"rows":[["Motore Dati","PostgreSQL (Relazionale con SQL nativo)","Firestore (NoSQL Document Store)"],["Sicurezza Dati","PostgreSQL Row Level Security (RLS con SQL)","Firebase Security Rules proprietarie"],["Hosting & Portabilità","Open Source, self-hostabile su Docker o cloud","Proprietario Google Cloud, lock-in elevato"],["Query Complesse","JOIN, aggregazioni, window functions, trigger","Query limitate a singoli filtri senza JOIN"]]}'::jsonb
from public.nodes where slug = 'baas-supabase-firebase';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Esempio di Policy Row Level Security (RLS)', 'code',
  '{"code":"-- Abilita la sicurezza a livello di riga sulla tabella\nALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;\n\n-- Solo l''utente proprietario autenticato può aggiornare il proprio record\nCREATE POLICY \"Users can update their own profile\"\nON public.user_profiles\nFOR UPDATE\nTO authenticated\nUSING (auth.uid() = id)\nWITH CHECK (auth.uid() = id);","language":"sql"}'::jsonb
from public.nodes where slug = 'baas-supabase-firebase';

-- Prisma ORM
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Definizione Schema Prisma Esempio', 'code',
  '{"code":"datasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\ngenerator client {\n  provider = \"prisma-client-js\"\n}\n\nmodel User {\n  id        String   @id @default(uuid())\n  email     String   @unique\n  name      String?\n  posts     Post[]\n  createdAt DateTime @default(now())\n}\n\nmodel Post {\n  id        String   @id @default(uuid())\n  title     String\n  content   String?\n  authorId  String\n  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)\n}","language":"js"}'::jsonb
from public.nodes where slug = 'orm-libraries';
