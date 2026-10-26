-- DevSkillMap - dati iniziali
-- Eseguibile una sola volta su un database vuoto (dopo 0001_init e 0002_rls).

insert into public.nodes (id, slug, label, description, best_practices, naming_conventions, study_urls, position_x, position_y)
values
  (
    'a0000000-0000-4000-8000-000000000001', 'html', 'HTML',
    'HyperText Markup Language. Struttura portante del web per l''organizzazione semantica del contenuto applicativo.',
    array['Usa marcatori semantici nativi.', 'Valida costantemente i tag secondo specifiche W3C.'],
    array['Tag e attributi rigorosamente minuscoli', 'Classi in kebab-case'],
    '[{"label":"MDN HTML Basics","url":"https://developer.mozilla.org/docs/Web/HTML"}]'::jsonb,
    220, 200
  ),
  (
    'a0000000-0000-4000-8000-000000000002', 'css', 'CSS',
    'Cascading Style Sheets. Gestione dello stile visivo, layout responsivi e implementazioni grafiche neon dell''HUD.',
    array['Mantieni l''architettura atomica.', 'Sfrutta le variabili native o utility classes.'],
    array['Metodologia BEM o utility pure'],
    '[{"label":"Tailwind CSS Documentation","url":"https://tailwindcss.com"}]'::jsonb,
    180, 300
  ),
  (
    'a0000000-0000-4000-8000-000000000003', 'javascript', 'JavaScript',
    'Linguaggio runtime asincrono ad eventi. Logica computazionale ed interazioni dinamiche dei grafi di rete.',
    array['Evita mutazioni dirette degli stati condivisi.', 'Prediligi astrazioni funzionali.'],
    array['camelCase per metodi e variabili', 'PascalCase per costruttori'],
    '[{"label":"MDN JavaScript Guide","url":"https://developer.mozilla.org/docs/Web/JavaScript"}]'::jsonb,
    550, 250
  ),
  (
    'a0000000-0000-4000-8000-000000000011', 'tag-nativi', 'Tag Nativi',
    'Elementi HTML nativi e attributi fondamentali per costruire interfacce accessibili e semantiche.',
    array['Preferisci elementi nativi ai div generici.', 'Associa sempre label e controlli.'],
    array['Attributi in kebab-case'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000012', 'form-validazione', 'Form & Validazione',
    'Costruzione di form accessibili, validazione lato client e gestione degli stati di errore.',
    array['Usa attributi di validazione nativi quando possibile.', 'Mostra errori vicini al campo interessato.'],
    array['name dei campi in camelCase'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000013', 'seo-semantic', 'SEO Semantic',
    'Struttura semantica e metadati per migliorare indicizzazione, condivisione e leggibilità da parte dei crawler.',
    array['Un solo h1 per pagina.', 'Descrivi le immagini con alt significativi.'],
    array['URL in kebab-case'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000014', 'dom-manipulation', 'DOM Manipulation',
    'Selezione e aggiornamento degli elementi del documento, gestione di eventi e rendering dinamico.',
    array['Delega gli eventi quando possibile.', 'Evita letture e scritture alternate nel DOM.'],
    array['Variabili DOM con prefisso del contesto'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000015', 'async-fetch', 'Async/Fetch',
    'Gestione delle operazioni asincrone, delle richieste HTTP e degli stati di caricamento ed errore.',
    array['Gestisci sempre timeout ed errori di rete.', 'Annulla le richieste non più necessarie.'],
    array['Funzioni async con verbo esplicito'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000016', 'es6-features', 'ES6+ Features',
    'Moduli, destructuring, classi, iteratori e le funzionalità moderne del linguaggio JavaScript.',
    array['Preferisci const e let a var.', 'Usa moduli ES nativi.'],
    array['PascalCase per classi e componenti'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000017', 'local-storage', 'Local Storage',
    'Persistenza di piccole quantità di dati nel browser e gestione del ciclo di vita lato client.',
    array['Non memorizzare segreti nel browser.', 'Gestisci quota e dati corrotti.'],
    array['Chiavi con namespace applicativo'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000018', 'bootstrap', 'Bootstrap',
    'Framework CSS con griglia, componenti e utility per prototipare rapidamente interfacce responsive.',
    array['Personalizza le variabili invece di sovrascrivere tutto.', 'Rimuovi i componenti non usati.'],
    array['Classi Bootstrap invariate'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000019', 'tailwind', 'Tailwind',
    'Framework utility-first per comporre stili direttamente nel markup con un sistema di design coerente.',
    array['Estrai componenti quando le utility si ripetono.', 'Mantieni una palette centralizzata.'],
    array['Utility in ordine canonico'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000020', 'validazione', 'Validazione',
    'Controllo dei dati in input con regole condivise tra interfaccia, API e persistenza.',
    array['Valida sia lato client sia lato server.', 'Restituisci messaggi di errore specifici.'],
    array['Regole con nomi descrittivi'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000021', 'accessibilita-form', 'Accessibilità Form',
    'Progettazione di form utilizzabili da tastiera e con tecnologie assistive.',
    array['Collega label e input con id/for.', 'Indica gli errori con testo e non solo colore.'],
    array['id descrittivi e stabili'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000022', 'promises', 'Promises',
    'Composizione di operazioni asincrone, catene di then/catch e gestione degli errori.',
    array['Preferisci async/await per flussi lineari.', 'Evita promise non gestite.'],
    array['Promise con suffisso Async'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000023', 'fetch-api', 'Fetch API',
    'Interfaccia nativa per le richieste HTTP, con Response, Headers e gestione degli stream.',
    array['Controlla response.ok prima di leggere il body.', 'Imposta gli header espliciti necessari.'],
    array['Wrapper con verbo e risorsa'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000024', 'utility-classes', 'Utility Classes',
    'Classi atomiche riutilizzabili per spaziature, colori, tipografia e layout.',
    array['Raggruppa le utility in componenti.', 'Documenta le convenzioni del team.'],
    array['Prefissi coerenti per varianti'],
    '[]'::jsonb, null, null
  ),
  (
    'a0000000-0000-4000-8000-000000000025', 'responsive-design', 'Responsive Design',
    'Adattamento dell''interfaccia a viewport, densità e capacità di input differenti.',
    array['Parti da mobile e aggiungi breakpoint.', 'Testa con contenuti reali e zoom elevato.'],
    array['Breakpoint con nomi semantici'],
    '[]'::jsonb, null, null
  );

insert into public.node_categories (node_id, category, is_primary)
values
  ('a0000000-0000-4000-8000-000000000001', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000002', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000003', 'frontend', false),
  ('a0000000-0000-4000-8000-000000000003', 'backend', true),
  ('a0000000-0000-4000-8000-000000000011', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000012', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000013', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000014', 'frontend', false),
  ('a0000000-0000-4000-8000-000000000014', 'backend', true),
  ('a0000000-0000-4000-8000-000000000015', 'frontend', false),
  ('a0000000-0000-4000-8000-000000000015', 'backend', true),
  ('a0000000-0000-4000-8000-000000000016', 'frontend', false),
  ('a0000000-0000-4000-8000-000000000016', 'backend', true),
  ('a0000000-0000-4000-8000-000000000017', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000018', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000019', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000020', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000021', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000022', 'frontend', false),
  ('a0000000-0000-4000-8000-000000000022', 'backend', true),
  ('a0000000-0000-4000-8000-000000000023', 'frontend', false),
  ('a0000000-0000-4000-8000-000000000023', 'backend', true),
  ('a0000000-0000-4000-8000-000000000024', 'frontend', true),
  ('a0000000-0000-4000-8000-000000000025', 'frontend', true);

insert into public.node_parents (parent_id, child_id, sort_order, is_primary)
values
  ('a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000011', 0, true),
  ('a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000012', 1, true),
  ('a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000013', 2, true),
  ('a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000018', 0, true),
  ('a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000019', 1, true),
  ('a0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000014', 0, true),
  ('a0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000015', 1, true),
  ('a0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000016', 2, true),
  ('a0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000017', 3, true),
  ('a0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000020', 0, true),
  ('a0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000020', 4, false),
  ('a0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000021', 1, true),
  ('a0000000-0000-4000-8000-000000000015', 'a0000000-0000-4000-8000-000000000022', 0, true),
  ('a0000000-0000-4000-8000-000000000015', 'a0000000-0000-4000-8000-000000000023', 1, true),
  ('a0000000-0000-4000-8000-000000000019', 'a0000000-0000-4000-8000-000000000024', 0, true),
  ('a0000000-0000-4000-8000-000000000024', 'a0000000-0000-4000-8000-000000000025', 0, true);

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
values
  (
    'a0000000-0000-4000-8000-000000000001', 0, 'Struttura Semantica Core', 'text',
    '{"text":"L''uso corretto degli elementi semantici garantisce una leggibilità eccellente per motori di ricerca ed assistenti digitali."}'::jsonb
  ),
  (
    'a0000000-0000-4000-8000-000000000001', 1, 'Specifiche W3C', 'list',
    '{"items":["Utilizzo tassativo di main, article, section","Tag ALT obbligatori sulle primitive d''immagine"]}'::jsonb
  ),
  (
    'a0000000-0000-4000-8000-000000000002', 0, 'Integrazione Tailwind Utility-First', 'text',
    '{"text":"Ottimizzazione totale dei pacchetti CSS eliminando la ridondanza dei fogli di stile nativi tradizionali."}'::jsonb
  ),
  (
    'a0000000-0000-4000-8000-000000000002', 1, 'Performance Monitor', 'table',
    '{"columns":["Config","Peso Bundle","Stato"],"rows":[["Tailwind v4","< 10kB","Nominale"],["CSS Tradizionale","140kB","Rilevato Overhead"]]}'::jsonb
  ),
  (
    'a0000000-0000-4000-8000-000000000003', 0, 'Runtime Engine & Event Loop', 'text',
    '{"text":"Gestione dei thread e delle code asincrone tramite macro e micro task per l''aggiornamento grafico del canvas in tempo reale."}'::jsonb
  ),
  (
    'a0000000-0000-4000-8000-000000000003', 1, 'Milestone di Ottimizzazione', 'timeline',
    '{"entries":[{"date":"Fase 1","title":"Refactor Geometrie","description":"Spostamento dei calcoli trigonometrici fuori dal ciclo di render principale."},{"date":"Fase 2","title":"Aggancio Supabase","description":"Attivazione della persistenza cloud tramite chiamate RPC asincrone."}]}'::jsonb
  ),
  (
    'a0000000-0000-4000-8000-000000000003', 2, 'Calcolo Posizione Vettoriale', 'code',
    '{"code":"const theta = (2 * Math.PI) / total;\nconst x = parentX + radius * Math.cos(theta * i);","language":"js"}'::jsonb
  ),
  (
    'a0000000-0000-4000-8000-000000000020', 0, 'Regole condivise', 'text',
    '{"text":"Definisci le regole di validazione una sola volta e riusale tra client, API e database per evitare divergenze."}'::jsonb
  ),
  (
    'a0000000-0000-4000-8000-000000000020', 1, 'Checklist rapida', 'list',
    '{"items":["Campi obbligatori","Formato email e URL","Limiti di lunghezza","Messaggi di errore chiari"]}'::jsonb
  );

insert into public.glossary_terms (term, definition)
values
  ('Deployment', 'Rilascio e attivazione dell''applicazione sul server di produzione.'),
  ('Frontend', 'La parte di un''applicazione visibile ed accessibile all''utente finale.'),
  ('Backend', 'Logica server-side, gestione dei dati e sicurezza dell''infrastruttura.');
