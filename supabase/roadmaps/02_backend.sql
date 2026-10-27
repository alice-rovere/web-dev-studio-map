-- ============================================================================
-- DEVSKILLMAP - ROADMAP MACROCATEGORIA 2: BACKEND DEVELOPMENT
-- File: supabase/roadmaps/02_backend.sql
-- ============================================================================
-- Include:
-- - Node.js Runtime & Alternative moderne (Bun, Deno)
-- - Framework Node.js: Express.js, NestJS, Fastify
-- - API Architecture: RESTful API, GraphQL, gRPC, WebSocket, Postman Testing, MVC Pattern
-- - Sicurezza & Autenticazione: JWT, OAuth 2.0, Sessioni, OWASP Top 10, Hashing bcrypt/Argon2
-- - Performance & Asincronia: Caching Backend (Redis in-memory), Message Brokers (RabbitMQ, Kafka)
-- - Linguaggi Backend: Python (FastAPI/Django), .NET Core / C#, Java Spring Boot, Go, PHP Laravel
-- - Testing Backend (Unit & Integration)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. NODI TECNOLOGICI (public.nodes)
-- ----------------------------------------------------------------------------
insert into public.nodes (slug, label, description, best_practices, naming_conventions, study_urls, position_x, position_y)
values
  -- Figlio di javascript con categoria primaria backend: Node.js
  (
    'nodejs',
    'Node.js Runtime',
    'Ambiente di runtime JavaScript server-side basato sul motore V8 di Chrome, architettura orientata agli eventi e I/O non bloccante.',
    array[
      'Non bloccare mai l''Event Loop con operazioni CPU-intensive sincrone; delega ai Worker Threads.',
      'Gestisci sempre unhandledRejection e uncaughtException per evitare crash improvvisi del processo.',
      'Usa variabili d''ambiente (process.env) per configurazioni e segreti applicativi.'
    ],
    array['File di modulo con estensione .js o .mjs', 'Nomi di script in package.json in kebab-case'],
    '[
      {"label":"Node.js Official Documentation","url":"https://nodejs.org/docs/latest/api/"},
      {"label":"Node.js Best Practices GitHub","url":"https://github.com/goldbergyoni/nodebestpractices"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di nodejs: Bun & Deno
  (
    'bun-deno',
    'Bun & Deno (Alternative Runtimes)',
    'Runtime JavaScript/TypeScript moderni: Bun con engine JavaScriptCore ad altissime prestazioni e Deno con permessi di sicurezza granulari.',
    array[
      'Sfrutta il supporto nativo a TypeScript senza necessitare di tsc o bundler aggiuntivi.',
      'In Deno, dichiara esplicitamente i permessi di accesso al filesystem e rete (--allow-net, --allow-read).',
      'Usa Bun come package manager ultraveloce per accelerare i tempi di installazione in locale e CI.'
    ],
    array['Flag permessi espliciti in Deno CLI', 'Script di avvio compatibili con package.json in Bun'],
    '[
      {"label":"Bun Official Docs","url":"https://bun.sh/docs"},
      {"label":"Deno Official Manual","url":"https://docs.deno.com/runtime/manual"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di nodejs: Express.js
  (
    'expressjs',
    'Express.js',
    'Framework web minimalista e flessibile per Node.js, standard de facto per la composizione di API REST e pipeline di middleware.',
    array[
      'Organizza l''applicazione in router modulari (express.Router).',
      'Inserisci sempre un middleware di gestione errori globale a 4 argomenti (err, req, res, next) alla fine della catena.',
      'Adotta middleware di sicurezza essenziali come helmet e cors.'
    ],
    array['File router con suffisso .routes.js', 'Funzioni middleware con firma (req, res, next)'],
    '[
      {"label":"Express.js Official Guide","url":"https://expressjs.com/en/guide/routing.html"},
      {"label":"MDN: Express Web Framework","url":"https://developer.mozilla.org/docs/Learn/Server-side/Express_Nodejs"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di nodejs: NestJS
  (
    'nestjs',
    'NestJS',
    'Framework Node.js progressivo per applicazioni enterprise scalabili, ispirato ad Angular con architettura modulare, Dependency Injection e TypeScript.',
    array[
      'Struttura l''applicazione in moduli autonomi con Controller e Provider/Service separati.',
      'Usa ValidationPipe e class-validator per validare i DTO (Data Transfer Objects) in ingresso.',
      'Sfrutta i Guards per proteggere gli endpoint in base a ruoli o token JWT.'
    ],
    array['Classi Controller con decoratore @Controller()', 'Classi servizio con @Injectable() e suffisso Service'],
    '[
      {"label":"NestJS Documentation","url":"https://docs.nestjs.com/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di nodejs: Fastify
  (
    'fastify',
    'Fastify',
    'Framework web focalizzato sulle massime prestazioni computazionali e basso overhead, con validazione tramite JSON Schema nativa.',
    array[
      'Dichiara JSON Schema per parametri e payload per velocizzare la serializzazione (fast-json-stringify).',
      'Usa il sistema di plugin incapsulati per una modularità pulita.',
      'Sfrutta il logger Pino integrato ad alte prestazioni.'
    ],
    array['Nomi di route in camelCase', 'Schema di validazione con naming univoco'],
    '[
      {"label":"Fastify Documentation","url":"https://fastify.dev/docs/latest/"}
    ]'::jsonb,
    null, null
  ),

  -- Root: API Design & Architettura Backend
  (
    'api-architettura',
    'API Design & Architettura',
    'Progettazione di interfacce applicative robuste, contratti di comunicazione, formati di scambio dati e pattern architetturali.',
    array[
      'Pianifica la compatibilità retroattiva con versionamento chiaro delle API (/v1, /v2).',
      'Definisci contratti chiari con specifiche OpenAPI / Swagger prima di iniziare l''implementazione.',
      'Evita accoppiamenti stretti tra layer di persistenza e layer di trasporto HTTP.'
    ],
    array['Prefisso versione nelle route: /api/v1/...', 'Nomi delle risorse al plurale nei percorsi REST'],
    '[
      {"label":"Google Cloud API Design Guide","url":"https://cloud.google.com/apis/design"},
      {"label":"OpenAPI Specification","url":"https://swagger.io/specification/"}
    ]'::jsonb,
    740, 180
  ),

  -- Figlio di api-architettura: RESTful API
  (
    'rest-api',
    'RESTful API',
    'Stile architetturale basato su risorse identificate da URI, operazioni con verbi HTTP (GET, POST, PUT, DELETE, PATCH) e statelessness.',
    array[
      'Usa nomi di sostantivi plurali per gli endpoint (/users, /products) invece di verbi.',
      'Rispetta l''idempotenza di PUT, DELETE e GET.',
      'Includi paginazione, filtri e ordinamento come query string (es. ?page=1&limit=20).'
    ],
    array['Endpoint in kebab-case e plurale', 'Parametri di rotta in camelCase (es. /users/:userId)'],
    '[
      {"label":"Microsoft REST API Guidelines","url":"https://github.com/microsoft/api-guidelines"},
      {"label":"RESTful API Tutorial","url":"https://restfulapi.net/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di api-architettura: GraphQL & gRPC
  (
    'graphql-grpc',
    'GraphQL & gRPC',
    'Alternative ad alte prestazioni: GraphQL per eliminare over-fetching/under-fetching e gRPC basato su Protocol Buffers ed HTTP/2 per microservizi.',
    array[
      'Usa GraphQL quando il client deve comporre query flessibili su entità correlate in un''unica richiesta.',
      'Usa gRPC per comunicazioni interne tra microservizi grazie al payload binario leggero e streaming bidirezionale.',
      'Difendi le API GraphQL con limiti sulla profondità massima delle query (query complexity depth).'
    ],
    array['Tipi GraphQL in PascalCase', 'Servizi gRPC definiti in file con estensione .proto'],
    '[
      {"label":"GraphQL Official Documentation","url":"https://graphql.org/learn/"},
      {"label":"gRPC Official Documentation","url":"https://grpc.io/docs/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di api-architettura: WebSockets
  (
    'websockets',
    'WebSockets & Real-Time',
    'Canale di comunicazione bidirezionale full-duplex persistente su singola connessione TCP per chat, notifiche live, giochi e grafi interattivi.',
    array[
      'Gestisci reconnect automatici esponenziali sul client in caso di disconnessione.',
      'Implementa heartbeat (ping/pong) per rilevare connessioni zombie o interruzioni silenziose.',
      'Proteggi l''handshake iniziale WebSocket con gli stessi controlli di autenticazione dell''API.'
    ],
    array['Eventi websocket con sintassi namespace:azione (es. chat:message, node:updated)'],
    '[
      {"label":"MDN: The WebSocket API","url":"https://developer.mozilla.org/docs/Web/API/WebSockets_API"},
      {"label":"Socket.io Documentation","url":"https://socket.io/docs/v4/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di api-architettura: Postman & API Tools
  (
    'postman-api-tools',
    'Postman & Test API',
    'Piattaforme di sviluppo, collaudo, documentazione e simulazione di richieste API con collezioni esportabili, variabili d''ambiente e mock server.',
    array[
      'Organizza le chiamate in Postman Collections versionate nel repository del team.',
      'Usa Environment Variables (es. {{baseUrl}}, {{authToken}}) per passare agevolmente tra localhost, staging e production.',
      'Scrivi test automatici negli script Postman per validare status code e schema della risposta JSON.'
    ],
    array['Variabili d''ambiente in camelCase', 'Collezioni con nome del microservizio o release'],
    '[
      {"label":"Postman Learning Center","url":"https://learning.postman.com/docs/getting-started/introduction/"},
      {"label":"Insomnia API Client","url":"https://insomnia.rest/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di api-architettura: Architettura MVC
  (
    'architettura-mvc',
    'Pattern Architetturale MVC',
    'Pattern Model-View-Controller e separazione delle responsabilità: separazione logica dati (Model), presentazione (View) e business/routing (Controller).',
    array[
      'Mantieni i Controller leggeri (Thin Controller) delegando le regole di business ai Service (Fat Service/Model).',
      'Non iniettare query SQL direttamente all''interno dei controller o viste.',
      'Favorisci architetture esagonali o Clean Architecture nei progetti di grandi dimensioni.'
    ],
    array['Cartelle canoniche: models/, views/, controllers/, services/'],
    '[
      {"label":"Martin Fowler: GUI Architectures","url":"https://martinfowler.com/eaaDev/uiArchs.html"},
      {"label":"MDN: Model-View-Controller","url":"https://developer.mozilla.org/docs/Glossary/MVC"}
    ]'::jsonb,
    null, null
  ),

  -- Root: Sicurezza & Autenticazione Backend
  (
    'backend-security',
    'Sicurezza & Autenticazione',
    'Protezione dell''infrastruttura backend: gestione identità, token crittografici, prevenzione delle minacce web e cifratura dei dati.',
    array[
      'Non considerare mai affidabile l''input proveniente dal client (Zero Trust).',
      'Applica il principio del minor privilegio (Least Privilege) su credenziali e accessi al database.',
      'Mantieni le dipendenze costantemente aggiornate per correggere vulnerabilità note.'
    ],
    array['Header di sicurezza con prefisso X- o Content-Security-Policy'],
    '[
      {"label":"OWASP Top 10 Web Application Security","url":"https://owasp.org/www-project-top-ten/"},
      {"label":"Auth0 Architecture Guides","url":"https://auth0.com/docs/get-started/authentication-and-authorization-flow"}
    ]'::jsonb,
    960, 180
  ),

  -- Figlio di backend-security: Auth JWT & OAuth
  (
    'auth-jwt-oauth',
    'Autenticazione (JWT, OAuth 2.0)',
    'Standard di autenticazione e autorizzazione delegata: token stateless JSON Web Tokens, flusso OAuth 2.0 e protocollo OpenID Connect.',
    array[
      'Imposta tempi di scadenza brevi (es. 15 minuti) per gli Access Token e gestisci un Refresh Token persistito in modo sicuro.',
      'Memorizza i refresh token in cookie HTTP-Only con flag Secure e SameSite=Strict per proteggerli da attacchi XSS.',
      'Firma i token con algoritmi crittografici asimmetrici (RS256) per consentire la verifica della chiave pubblica tra microservizi.'
    ],
    array['Claims standard JWT: sub, exp, iat, iss, aud'],
    '[
      {"label":"JSON Web Token Introduction (jwt.io)","url":"https://jwt.io/introduction"},
      {"label":"OAuth 2.0 Simplified","url":"https://aaronparecki.com/oauth-2-simplified/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di backend-security: OWASP Security
  (
    'owasp-security',
    'Sicurezza Web (OWASP Top 10)',
    'Mitigazione delle vulnerabilità più critiche: SQL Injection, Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF) e CORS errato.',
    array[
      'Usa sempre query parametrizzate o ORM per prevenire al 100% attacchi di SQL Injection.',
      'Sanifica ed effettua escape dell''output per neutralizzare codice HTML/JavaScript maligno (XSS).',
      'Configura intestazioni CORS restrittive consentendo solo i domini autorizzati del client applicativo.'
    ],
    array['Policy CORS con domini espliciti (mai Access-Control-Allow-Origin: * con credenziali)'],
    '[
      {"label":"OWASP Top 10 Official Document","url":"https://owasp.org/Top10/"},
      {"label":"MDN: Cross-Origin Resource Sharing (CORS)","url":"https://developer.mozilla.org/docs/Web/HTTP/CORS"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di backend-security: Password Hashing
  (
    'password-hashing',
    'Password Hashing (Argon2, bcrypt)',
    'Conservazione sicura delle credenziali utente tramite funzioni crittografiche unidirezionali lente e resistenti a brute-force e rainbow table.',
    array[
      'Non usare mai MD5, SHA-1 o semplici funzioni di digest senza salt per memorizzare password.',
      'Adotta Argon2id come prima scelta moderna, oppure bcrypt con cost factor calibrato (minimo 10-12).',
      'Genera automaticamente un salt crittografico univoco per ogni singola password memorizzata.'
    ],
    array['Algoritmo prefissato nell''hash risultante (es. $2b$ o $argon2id$)'],
    '[
      {"label":"OWASP Password Storage Cheat Sheet","url":"https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di backend-security: Caching Backend
  (
    'backend-caching',
    'Caching Backend & Redis',
    'Strategie di memorizzazione temporanea in-memory (Cache-Aside, Write-Through) per alleggerire il carico sul database e ridurre i tempi di risposta.',
    array[
      'Definisci sempre una scadenza temporale (TTL - Time to Live) per evitare dati stantii persistenti.',
      'Usa chiavi di cache descrittive con namespace per facilitare invalidazioni selettive.',
      'Proteggiti dal fenomeno del Cache Stampede tramite lock distribuiti o calcoli asincroni in background.'
    ],
    array['Chiavi di cache a segmenti: entita:id:attributo (es. user:42:profile)'],
    '[
      {"label":"Redis Caching Documentation","url":"https://redis.io/docs/latest/develop/use/caching/"},
      {"label":"AWS Caching Overview","url":"https://aws.amazon.com/caching/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di backend-security: Message Brokers
  (
    'message-brokers',
    'Message Brokers (Kafka & RabbitMQ)',
    'Sistemi di messaggistica asincrona e code per disaccoppiare microservizi, gestire picchi di traffico e architetture guidate da eventi (EDA).',
    array[
      'Scegli RabbitMQ per code di lavoro con routing flessibile (AMQP); scegli Apache Kafka per streaming continuo di eventi e riproduzione log.',
      'Garantisci l''idempotenza dei consumatori di messaggi in caso di reinvio della coda.',
      'Configura Dead Letter Queues (DLQ) per analizzare i messaggi non elaborabili a causa di errori.'
    ],
    array['Nomi di exchange e code in kebab-case', 'Eventi descritti al passato (es. user-registered, order-placed)'],
    '[
      {"label":"RabbitMQ Tutorials","url":"https://www.rabbitmq.com/tutorials"},
      {"label":"Apache Kafka Quickstart","url":"https://kafka.apache.org/quickstart"}
    ]'::jsonb,
    null, null
  ),

  -- Root: Linguaggi Backend Multiparadigma
  (
    'backend-languages',
    'Linguaggi Backend Multiparadigma',
    'Panoramica dei principali ecosistemi di programmazione lato server per web, API ad alta concorrenza e sistemi distribuiti.',
    array[
      'Seleziona il linguaggio in base ai requisiti di prestazione, manutenibilità ed ecosistema del team.',
      'Applica i principi SOLID e Clean Code in qualsiasi stack prescelto.',
      'Imposta sempre linters e formattatori automatici specifici di linguaggio.'
    ],
    array['Convenzioni idiomatiche native per ogni rispettivo linguaggio'],
    '[
      {"label":"roadmap.sh Backend Developer","url":"https://roadmap.sh/backend"}
    ]'::jsonb,
    850, 380
  ),

  -- Figlio di backend-languages: Python Backend
  (
    'python-backend',
    'Python Backend (FastAPI & Django)',
    'Sviluppo backend in Python: framework moderni come FastAPI basati su async e type hints, o completi "batteries-included" come Django.',
    array[
      'Usa FastAPI per microservizi veloci, documentazione OpenAPI automatica e validazione con Pydantic.',
      'Usa Django per applicazioni monolitiche con ORM potente, pannello di amministrazione pronto e gestione auth.',
      'Crea sempre ambienti virtuali isolati (venv o poetry) per gestire le dipendenze di progetto.'
    ],
    array['snake_case per variabili e funzioni', 'PascalCase per classi e modelli'],
    '[
      {"label":"FastAPI Official Documentation","url":"https://fastapi.tiangolo.com/"},
      {"label":"Django Project Documentation","url":"https://docs.djangoproject.com/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di backend-languages: .NET / C#
  (
    'dotnet',
    'C# & .NET Core',
    'Piattaforma Microsoft multipiattaforma ad alte prestazioni, con tipizzazione forte, garbage collector avanzato ed ecosistema enterprise robusto.',
    array[
      'Sfrutta ASP.NET Core Minimal APIs per microservizi veloci o controller per API complesse.',
      'Usa Entity Framework Core (EF Core) per la persistenza relazionale tramite LINQ.',
      'Approfitta della Dependency Injection nativa del container IoC di .NET.'
    ],
    array['PascalCase per classi, metodi e proprietà pubbliche', 'Prefisso I per le interfacce (es. IUserService)'],
    '[
      {"label":"Microsoft .NET Documentation","url":"https://learn.microsoft.com/dotnet/"},
      {"label":"ASP.NET Core Tutorials","url":"https://learn.microsoft.com/aspnet/core/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di backend-languages: Java & Spring Boot
  (
    'java-spring',
    'Java & Spring Boot',
    'Piattaforma enterprise matura basata su JVM, standard nell''industria bancaria e corporate grazie a robustezza, concorrenza e Spring Boot.',
    array[
      'Usa Spring Boot starters per configurazione automatica delle dipendenze (convention-over-configuration).',
      'Separa i DTO dalle entità JPA per evitare leak di dettagli del database verso l''esterno.',
      'Sfrutta Spring Security per gestire JWT, OAuth2 e autorizzazioni granulari tramite annotazioni.'
    ],
    array['camelCase per metodi e variabili', 'PascalCase per classi ed entità @Entity'],
    '[
      {"label":"Spring Boot Guides","url":"https://spring.io/guides"},
      {"label":"Baeldung Java Tutorials","url":"https://www.baeldung.com/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di backend-languages: Go (Golang)
  (
    'golang',
    'Go (Golang)',
    'Linguaggio compilato sviluppato da Google con tempi di build istantanei, concorrenza nativa tramite goroutine e canali, ed eseguibili binari unici.',
    array[
      'Gestisci gli errori esplicitamente (if err != nil) anziché fare affidamento su eccezioni.',
      'Usa goroutine leggere per operazioni I/O concorrenti e synchronizza tramite channel o sync.WaitGroup.',
      'Mantieni i pacchetti semplici evitando astrazioni premature.'
    ],
    array['Iniziale maiuscola per identificatori esportati pubblici, minuscola per privati', 'camelCase per nomi di funzioni'],
    '[
      {"label":"A Tour of Go","url":"https://go.dev/tour/"},
      {"label":"Go Documentation","url":"https://go.dev/doc/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di backend-languages: PHP & Laravel
  (
    'php-laravel',
    'PHP & Laravel',
    'Framework PHP elegante e moderno con routing espressivo, Eloquent ORM, migrazioni integrate e vasto ecosistema (Queues, Horizon, Sanctum).',
    array[
      'Sfrutta Eloquent per query intuitive mantenendo le relazioni modellate nei file di Model.',
      'Usa i Form Request per incapsulare le regole di validazione e autorizzazione fuori dai Controller.',
      'Esegui job lenti (invio email, elaborazione file) tramite code asincrone integrate.'
    ],
    array['File Model al singolare in PascalCase (es. User.php)', 'Tabelle nel database al plurale in snake_case (es. users)'],
    '[
      {"label":"Laravel Official Documentation","url":"https://laravel.com/docs"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di nodejs: Testing Backend
  (
    'testing-backend',
    'Testing Backend (Unit & Integration)',
    'Metodologie di verifica del codice server: test unitari isolati con mock dei database e test di integrazione con istanze test reali (Testcontainers).',
    array[
      'Usa il pattern Arrange-Act-Assert (AAA) per rendere i test leggibili e manutenibili.',
      'Testa i casi limite e le risposte di errore 4xx e 5xx, non soltanto il percorso positivo (happy path).',
      'Evita di mockare completamente il database nei test di integrazione; usa SQLite in-memory o container PostgreSQL temporanei.'
    ],
    array['File di test con estensione .test.js o .spec.js', 'Descrizione del test incentrata sul comportamento atteso'],
    '[
      {"label":"Vitest Guide for Node","url":"https://vitest.dev/guide/"},
      {"label":"Supertest HTTP Assertions","url":"https://github.com/ladjs/supertest"}
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
  'nodejs',
  'bun-deno',
  'expressjs',
  'nestjs',
  'fastify',
  'api-architettura',
  'rest-api',
  'graphql-grpc',
  'websockets',
  'postman-api-tools',
  'architettura-mvc',
  'backend-security',
  'auth-jwt-oauth',
  'owasp-security',
  'password-hashing',
  'backend-caching',
  'message-brokers',
  'backend-languages',
  'python-backend',
  'dotnet',
  'java-spring',
  'golang',
  'php-laravel',
  'testing-backend'
)
on conflict (node_id, category) do update set is_primary = excluded.is_primary;

-- Node.js ha anche pertinenza secondaria in frontend per l'ecosistema di bundling/tooling
insert into public.node_categories (node_id, category, is_primary)
select id, 'frontend', false from public.nodes where slug in ('nodejs', 'websockets')
on conflict (node_id, category) do update set is_primary = excluded.is_primary;


-- ----------------------------------------------------------------------------
-- 3. RELAZIONI PADRE-FIGLIO (public.node_parents)
-- ----------------------------------------------------------------------------
delete from public.node_parents
where child_id in (
  select id from public.nodes where slug in (
    'nodejs', 'bun-deno', 'expressjs', 'nestjs', 'fastify',
    'rest-api', 'graphql-grpc', 'websockets', 'postman-api-tools', 'architettura-mvc',
    'auth-jwt-oauth', 'owasp-security', 'password-hashing', 'backend-caching', 'message-brokers',
    'python-backend', 'dotnet', 'java-spring', 'golang', 'php-laravel', 'testing-backend'
  )
);

insert into public.node_parents (parent_id, child_id, sort_order, is_primary)
select p.id, c.id, rel.sort_order, true
from (
  values
    -- Sotto javascript
    ('javascript', 'nodejs', 11),

    -- Sotto nodejs
    ('nodejs', 'bun-deno', 0),
    ('nodejs', 'expressjs', 1),
    ('nodejs', 'nestjs', 2),
    ('nodejs', 'fastify', 3),
    ('nodejs', 'testing-backend', 4),

    -- Sotto api-architettura
    ('api-architettura', 'rest-api', 0),
    ('api-architettura', 'graphql-grpc', 1),
    ('api-architettura', 'websockets', 2),
    ('api-architettura', 'postman-api-tools', 3),
    ('api-architettura', 'architettura-mvc', 4),

    -- Sotto backend-security
    ('backend-security', 'auth-jwt-oauth', 0),
    ('backend-security', 'owasp-security', 1),
    ('backend-security', 'password-hashing', 2),
    ('backend-security', 'backend-caching', 3),
    ('backend-security', 'message-brokers', 4),

    -- Sotto backend-languages
    ('backend-languages', 'python-backend', 0),
    ('backend-languages', 'dotnet', 1),
    ('backend-languages', 'java-spring', 2),
    ('backend-languages', 'golang', 3),
    ('backend-languages', 'php-laravel', 4)
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
    'nodejs', 'expressjs', 'nestjs', 'api-architettura', 'rest-api',
    'architettura-mvc', 'auth-jwt-oauth', 'owasp-security', 'password-hashing',
    'dotnet', 'postman-api-tools'
  )
);

-- Node.js
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Event Loop & Architettura Asincrona', 'text',
  '{"text":"Node.js esegue il codice JavaScript su un singolo thread principale, delegando operazioni di I/O (filesystem, database, socket di rete) al pool di thread C++ di libuv. Questo consente di gestire decine di migliaia di connessioni concorrenti con memoria minima."}'::jsonb
from public.nodes where slug = 'nodejs';

-- Express.js
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Server REST Minimale con Express', 'code',
  '{"code":"import express from ''express'';\n\nconst app = express();\napp.use(express.json());\n\n// Middleware di autenticazione fittizio\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next();\n});\n\napp.get(''/api/health'', (req, res) => {\n  res.status(200).json({ status: ''ok'', timestamp: new Date() });\n});\n\napp.listen(4000, () => console.log(''Server attivo sulla porta 4000''));","language":"js"}'::jsonb
from public.nodes where slug = 'expressjs';

-- Architettura MVC
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Separazione dei Ruoli MVC', 'table',
  '{"columns":["Componente","Responsabilità","Esempio concreto"],"rows":[["Model","Rappresenta i dati, lo schema e le regole di business del dominio","Classe User con hash password e salvataggio DB"],["View","Formatta la risposta da restituire al client","Template HTML, JSON serializzato, XML"],["Controller","Intercetta la richiesta HTTP, invoca il Model e restituisce la View","UserController con metodo registerUser(req, res)"]]}'::jsonb
from public.nodes where slug = 'architettura-mvc';

-- JWT & Auth
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Anatomia di un JSON Web Token', 'text',
  '{"text":"Un JWT è composto da tre segmenti codificati Base64URL separati da punti: Header (algoritmo e tipo), Payload (claims sui dati dell''utente come id e ruoli) e Signature (hash firmato con chiave segreta per verificare che il token non sia stato manomesso)."}'::jsonb
from public.nodes where slug = 'auth-jwt-oauth';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Flusso Access & Refresh Token', 'table',
  '{"columns":["Tipo Token","Durata Tipica","Memorizzazione Consigliata","Uso"],"rows":[["Access Token","10 - 15 minuti","Memoria JavaScript o header Authorization","Inviato a ogni richiesta API protetta"],["Refresh Token","7 - 30 giorni","Cookie HTTP-Only, Secure, SameSite","Usato solo per richiedere un nuovo Access Token"]]}'::jsonb
from public.nodes where slug = 'auth-jwt-oauth';

-- Password Hashing
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Hashing Sicuro con bcrypt in Node.js', 'code',
  '{"code":"import bcrypt from ''bcrypt'';\n\nconst SALT_ROUNDS = 12;\n\n// Hashing della password al momento della registrazione\nexport async function hashPassword(plainPassword) {\n  return await bcrypt.hash(plainPassword, SALT_ROUNDS);\n}\n\n// Verifica della password al momento del login\nexport async function verifyPassword(plainPassword, storedHash) {\n  return await bcrypt.compare(plainPassword, storedHash);\n}","language":"js"}'::jsonb
from public.nodes where slug = 'password-hashing';

-- .NET / C#
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'ASP.NET Core Minimal API Esempio', 'code',
  '{"code":"var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\n\napp.MapGet(\"/api/v1/skills\", () => new [] {\n    new { Id = 1, Name = \"C#\", Level = \"Enterprise\" },\n    new { Id = 2, Name = \".NET Core\", Level = \"High-Perf\" }\n});\n\napp.Run();","language":"csharp"}'::jsonb
from public.nodes where slug = 'dotnet';

-- Postman
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Automazione dei Test in Postman', 'text',
  '{"text":"Negli script di test Postman è possibile scrivere asserzioni JavaScript che vengono eseguite automaticamente dopo ogni risposta HTTP, consentendo di verificare status code, header di sicurezza e il corpo del JSON."}'::jsonb
from public.nodes where slug = 'postman-api-tools';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Script di Test Postman', 'code',
  '{"code":"// Verifica automatica dello status code 200\npm.test(\"Status code is 200 OK\", function () {\n    pm.response.to.have.status(200);\n});\n\n// Estrazione automatica del token JWT nella variabile d''ambiente\nconst jsonData = pm.response.json();\npm.environment.set(\"authToken\", jsonData.token);","language":"js"}'::jsonb
from public.nodes where slug = 'postman-api-tools';
