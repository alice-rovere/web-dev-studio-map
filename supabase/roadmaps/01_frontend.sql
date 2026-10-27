-- ============================================================================
-- DEVSKILLMAP - ROADMAP MACROCATEGORIA 1: FRONTEND DEVELOPMENT
-- File: supabase/roadmaps/01_frontend.sql
-- ============================================================================
-- Include:
-- - Internet & Fondamenti Browser (DNS, HTTP/HTTPS, Critical Rendering Path)
-- - HTML5 & Accessibilità Web Avanzata (WCAG, ARIA per non vedenti, screen reader)
-- - CSS3 Layout, Architettura BEM, Media Queries Responsive e UI Libraries
-- - JavaScript Avanzato: Scope, Closures, Axios, Package Managers (npm, pnpm, npx)
-- - Tooling: Vite, Build Tools & Bundlers, TypeScript
-- - Framework Component-Based: React, Next.js, Zustand/Redux, React Three Fiber, React Flow
-- - Altri Framework: Vue.js, Nuxt.js, Angular, Svelte/SvelteKit
-- - Testing Frontend (Vitest, Jest, Playwright) e Git Version Control
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. NODI TECNOLOGICI (public.nodes)
-- ----------------------------------------------------------------------------
insert into public.nodes (slug, label, description, best_practices, naming_conventions, study_urls, position_x, position_y)
values
  -- Root: Internet & Browser
  (
    'internet-browser',
    'Internet & Browser',
    'Comprensione dei protocolli di rete, risoluzione DNS, ciclo di richiesta HTTP/HTTPS e pipeline di rendering del browser.',
    array[
      'Comprendi il ciclo di vita completo da URL digitato a pixel renderizzati.',
      'Riduci le risorse bloccanti per velocizzare First Contentful Paint (FCP).',
      'Configura sempre HTTPS con certificati TLS validi.'
    ],
    array['kebab-case per endpoint e percorsi web', 'lowercase per domini e protocolli'],
    '[
      {"label":"MDN: How the Web Works","url":"https://developer.mozilla.org/docs/Learn/Common_questions/Web_mechanisms/How_does_the_Internet_work"},
      {"label":"web.dev: Critical Rendering Path","url":"https://web.dev/critical-rendering-path/"}
    ]'::jsonb,
    110, 140
  ),

  -- Figlio di internet-browser: HTTP Protocol
  (
    'http-protocol',
    'HTTP & Protocolli Web',
    'Protocollo di comunicazione client-server del web, metodi HTTP, codici di stato, header e sicurezza HTTPS/TLS.',
    array[
      'Usa il metodo HTTP corretto per ogni azione (GET per lettura, POST per creazione, PUT per rimpiazzo, PATCH per modifica parziale).',
      'Rispetta i codici di stato standard (2xx successo, 4xx errore client, 5xx errore server).',
      'Non inviare mai dati sensibili nei parametri di query URL.'
    ],
    array['Metodi HTTP tassativamente in MAIUSCOLO', 'Header in Train-Case (es. Content-Type, Authorization)'],
    '[
      {"label":"MDN HTTP Overview","url":"https://developer.mozilla.org/docs/Web/HTTP/Overview"},
      {"label":"HTTP Status Codes Cheat Sheet","url":"https://httpstatuses.com"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di internet-browser: Browser Rendering
  (
    'browser-rendering',
    'Browser Rendering (DOM & CSSOM)',
    'Come il motore del browser trasforma HTML, CSS e JS in pixel tramite DOM, CSSOM, Render Tree, Layout e Paint.',
    array[
      'Evita modifiche sincrone alternate di lettura e scrittura sul DOM (layout thrashing).',
      'Usa proprietà animate con accelerazione GPU come transform e opacity.',
      'Carica script non critici con defer o async.'
    ],
    array['CamelCase per API DOM', 'Proprietà CSSOM allineate allo standard CSS'],
    '[
      {"label":"web.dev: Rendering Performance","url":"https://web.dev/rendering-performance/"},
      {"label":"MDN: Populating the page","url":"https://developer.mozilla.org/docs/Web/Performance/How_browsers_work"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di html: Accessibilità ARIA & Non Vedenti
  (
    'accessibilita-aria',
    'Accessibilità ARIA & Screen Reader',
    'Linee guida per utenti ipovedenti e non vedenti: semantica WAI-ARIA, attributi aria-label/aria-hidden, navigazione da tastiera e WCAG.',
    array[
      'Prima regola di ARIA: usa elementi HTML nativi prima di ricorrere a ruoli ARIA custom.',
      'Usa aria-hidden="true" per icone puramente decorative così da non confondere gli screen reader.',
      'Fornisci aria-label o aria-labelledby su bottoni iconici privi di testo visibile.',
      'Garantisci sempre un contrasto cromatico minimo di 4.5:1 per il testo normale (WCAG AA).'
    ],
    array['Attributi ARIA sempre prefissati da aria- in kebab-case', 'Valori booleani in formato stringa "true" o "false"'],
    '[
      {"label":"W3C WAI-ARIA Authoring Practices","url":"https://www.w3.org/WAI/ARIA/apg/"},
      {"label":"MDN ARIA Basics","url":"https://developer.mozilla.org/docs/Web/Accessibility/ARIA"},
      {"label":"WebAIM Contrast Checker","url":"https://webaim.org/resources/contrastchecker/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di css: Layout Flexbox & Grid
  (
    'css-layout',
    'CSS Layout (Flexbox & Grid)',
    'Sistemi di impaginazione bidimensionali (CSS Grid) e monodimensionali (Flexbox) per interfacce moderne e flessibili.',
    array[
      'Usa Flexbox per layout a una dimensione (righe o colonne) e allineamento di componenti.',
      'Usa CSS Grid per layout di pagina complessi a due dimensioni.',
      'Sfrutta gap nativo al posto di margini complessi sui figli.'
    ],
    array['Proprietà CSS in kebab-case', 'Classi layout modulari con prefisso l- o layout-'],
    '[
      {"label":"CSS-Tricks: Complete Guide to Flexbox","url":"https://css-tricks.com/snippets/css/a-guide-to-flexbox/"},
      {"label":"CSS-Tricks: Complete Guide to Grid","url":"https://css-tricks.com/snippets/css/complete-guide-grid/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di css: Architettura BEM
  (
    'css-bem-architettura',
    'Architettura CSS & BEM',
    'Metodologia Block-Element-Modifier per scrivere fogli di stile scalabili, riutilizzabili ed evitare conflitti di specificità.',
    array[
      'Evita nesting profondo di selettori per non aumentare la specificità in modo incontrollato.',
      'Non stilizzare tag HTML nudi all''interno dei componenti; assegna sempre una classe elemento.',
      'Mantieni i modificatori indipendenti dallo stile base del blocco.'
    ],
    array['Blocco: .block', 'Elemento: .block__element', 'Modificatore: .block--modifier o .block__element--modifier'],
    '[
      {"label":"BEM Methodology Official","url":"https://en.bem.info/methodology/"},
      {"label":"CSS Wizardry: MindBEMding","url":"https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di responsive-design: Media Queries
  (
    'media-queries',
    'Media Queries & Responsive',
    'Regole @media per adattare tipografia, spaziature e disposizioni a diverse risoluzioni, orientamenti e preferenze utente.',
    array[
      'Adotta un approccio Mobile-First usando query min-width crescenti.',
      'Usa unità relative (rem, ch, %) nei breakpoint anziché pixel fissi.',
      'Supporta preferenze utente come prefers-reduced-motion e prefers-color-scheme.'
    ],
    array['Breakpoint con nomi logici: sm, md, lg, xl', 'Condizioni sintetiche moderne @media (width >= 768px)'],
    '[
      {"label":"MDN: Using Media Queries","url":"https://developer.mozilla.org/docs/Web/CSS/CSS_media_queries/Using_media_queries"},
      {"label":"web.dev: Responsive Web Design Basics","url":"https://web.dev/responsive-web-design-basics/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di css: Librerie UI & Preprocessori
  (
    'ui-frameworks-css',
    'Librerie UI & Preprocessori',
    'Ecosistema stilistico avanzato: Sass/SCSS, Styled Components CSS-in-JS, Shadcn/ui e Material UI per componenti pronti e accessibili.',
    array[
      'Scegli tra utility-first (Tailwind) e headless components (Radix, Shadcn) in base al design system richiesto.',
      'Evita di importare l''intera libreria se puoi usufruire di tree-shaking mirato.',
      'Garantisci la coerenza dei token visivi (colori, spazi, raggi di curvatura).'
    ],
    array['File SCSS con estensione .scss', 'Componenti UI styled in PascalCase'],
    '[
      {"label":"Sass Documentation","url":"https://sass-lang.com/documentation/"},
      {"label":"shadcn/ui Documentation","url":"https://ui.shadcn.com/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di javascript: Scope & Closures
  (
    'js-scope-closures',
    'Scope & Closures (JS Core)',
    'Gestione dei contesti di esecuzione, lexical scoping, closure e modello di concorrenza con Event Loop e microtask.',
    array[
      'Usa closure per incapsulare stato privato senza inquinare lo scope globale.',
      'Fai attenzione ai memory leak trattenendo riferimenti a contesti esterni non più necessari.',
      'Comprendi la differenza di priorità tra microtask (Promise) e macrotask (setTimeout).'
    ],
    array['Variabili private simulate con prefisso _ o simboli', 'Factory function con verbo esplicito create...'],
    '[
      {"label":"MDN: Closures","url":"https://developer.mozilla.org/docs/Web/JavaScript/Closures"},
      {"label":"JavaScript.info: Variable scope and closure","url":"https://javascript.info/closure"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di javascript: TypeScript
  (
    'typescript',
    'TypeScript',
    'Superset con tipizzazione statica di JavaScript che fornisce type-safety, interfacce, generici e controllo errori al tempo di compilazione.',
    array[
      'Abilita la modalità "strict": true in tsconfig.json.',
      'Evita il tipo "any"; usa "unknown" con type narrowing o tipi generici per codice flessibile.',
      'Modella i dati con discriminate unions per gestire stati complessi in modo esaustivo.'
    ],
    array['PascalCase per tipi, interfacce ed enum', 'Nomi descrittivi per generici (es. TItem, TData)'],
    '[
      {"label":"TypeScript Official Handbook","url":"https://www.typescriptlang.org/docs/handbook/intro.html"},
      {"label":"Total TypeScript Tutorials","url":"https://www.totaltypescript.com/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di async-fetch: Axios Client
  (
    'axios-client',
    'Axios Client HTTP',
    'Libreria HTTP basata su Promise con supporto nativo a interceptor di richiesta/risposta, trasformazione JSON e cancellazione con AbortController.',
    array[
      'Crea istanze dedicate con baseURL e timeout configurati per ogni servizio API.',
      'Usa response interceptor per rinfrescare token scaduti (refresh token) in modo trasparente.',
      'Gestisci uniformemente gli errori catturando axios.isAxiosError.'
    ],
    array['Istanze client con prefisso api (es. apiClient, authApi)', 'Funzioni di chiamata asincrone con verbo e risorsa'],
    '[
      {"label":"Axios Official Documentation","url":"https://axios-http.com/docs/intro"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di javascript: Package Managers
  (
    'package-managers',
    'Package Managers (npm, pnpm, yarn)',
    'Gestori delle dipendenze per l''ecosistema Node.js e JavaScript con risoluzione alberi, lockfile e monorepo workspace.',
    array[
      'Fai sempre il commit del lockfile (pnpm-lock.yaml o package-lock.json) nel version control.',
      'Preferisci pnpm per risparmio su disco tramite hard-link e rigore contro le dipendenze fantasma.',
      'Usa audit periodici (pnpm audit) per individuare vulnerabilità note nei pacchetti.'
    ],
    array['Nomi di script in package.json in kebab-case', 'Versionamento semantico SemVer (MAJOR.MINOR.PATCH)'],
    '[
      {"label":"pnpm Official Documentation","url":"https://pnpm.io/"},
      {"label":"npm Docs","url":"https://docs.npmjs.com/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di package-managers: NPX Runner
  (
    'npx-runner',
    'NPX Package Runner',
    'Strumento CLI incluso in npm per eseguire eseguibili binari e template scaffolding direttamente dal registro senza installazione globale.',
    array[
      'Usa npx per avviare generatori one-off (es. create-vite, shadcn-ui) senza inquinare il sistema.',
      'Aggiungi il flag -y in script automatizzati e pipeline CI per evitare prompt interattivi.',
      'Specifica sempre la versione esplicita (es. npx pkg@latest) se desideri l''ultima build.'
    ],
    array['Comandi npx in lowercase', 'Argomenti passati dopo il comando separati da spazi'],
    '[
      {"label":"npm Docs: npx executable runner","url":"https://docs.npmjs.com/cli/v10/commands/npx"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di javascript: Build Tools & Bundlers
  (
    'build-tools-bundlers',
    'Build Tools & Bundlers',
    'Strumenti di compilazione, impacchettamento e controllo qualità del codice sorgente: Webpack, Babel, ESLint e Prettier.',
    array[
      'Separa la formattazione automatica (Prettier) dalle regole di qualità semantica (ESLint).',
      'Configura source maps in sviluppo e disabilita o proteggi in produzione.',
      'Applica tree-shaking per rimuovere dead code dai bundle finali.'
    ],
    array['File di configurazione con estensione esplicita .config.js o .json', 'Regole linter in kebab-case'],
    '[
      {"label":"ESLint Getting Started","url":"https://eslint.org/docs/latest/use/getting-started"},
      {"label":"Prettier Documentation","url":"https://prettier.io/docs/en/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di build-tools-bundlers: Vite
  (
    'vite',
    'Vite Build Tool',
    'Frontend build tool di nuova generazione basato su ES Modules nativi nel browser in dev (HMR istantaneo) e Rollup in build di produzione.',
    array[
      'Sfrutta l''Hot Module Replacement (HMR) per iterazioni istantanee senza ricaricare lo stato applicativo.',
      'Configura alias di percorso (es. @/components) in vite.config.js per import puliti.',
      'Usa dynamic import per implementare il code-splitting a livello di route.'
    ],
    array['Configurazione standard in vite.config.js o vite.config.ts', 'Variabili d''ambiente obbligatoriamente con prefisso VITE_'],
    '[
      {"label":"Vite Official Guide","url":"https://vite.dev/guide/"},
      {"label":"Rollup Documentation","url":"https://rollupjs.org/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di javascript: Framework Component-Based
  (
    'frontend-frameworks',
    'Component-Based Frameworks',
    'Architetture frontend basate su componenti autonomi, reattivi e riutilizzabili per gestire interfacce utente complesse.',
    array[
      'Mantieni i componenti piccoli, focalizzati su una singola responsabilità (SRP).',
      'Distingui tra componenti presentazionali puri e componenti contenitori con logica di stato.',
      'Centralizza lo stato condiviso per evitare prop drilling eccessivo.'
    ],
    array['Componenti sempre con iniziale maiuscola in PascalCase', 'File componenti con estensione .jsx o .tsx'],
    '[
      {"label":"React Documentation","url":"https://react.dev/"},
      {"label":"Vue.js Documentation","url":"https://vuejs.org/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di frontend-frameworks: React
  (
    'react',
    'React',
    'Libreria dichiarativa basata su componenti, Virtual DOM, sintassi JSX e hooks (useState, useEffect, useMemo, useContext).',
    array[
      'Rispetta le regole degli Hooks: chiamali solo al livello più alto del componente.',
      'Non mutare mai direttamente lo stato; usa sempre la funzione di aggiornamento o immutabilità.',
      'Assegna key univoche e stabili negli elenchi renderizzati con map().'
    ],
    array['Componenti in PascalCase', 'Custom hooks con prefisso obbligatorio use (es. useMapGraph)'],
    '[
      {"label":"React Official Learn","url":"https://react.dev/learn"},
      {"label":"React Hook Reference","url":"https://react.dev/reference/react"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di react: Next.js
  (
    'nextjs',
    'Next.js (Meta-Framework)',
    'Meta-framework per React con Server-Side Rendering (SSR), Static Site Generation (SSG), App Router e React Server Components (RSC).',
    array[
      'Default sui Server Components per ridurre il JavaScript inviato al client; aggiungi "use client" solo se necessario.',
      'Sfrutta le route dinamiche e i layout nidificati dell''App Router.',
      'Ottimizza immagini e font con i componenti nativi next/image e next/font.'
    ],
    array['File di pagina obbligatoriamente page.jsx o page.tsx', 'File di layout in layout.jsx'],
    '[
      {"label":"Next.js Documentation","url":"https://nextjs.org/docs"},
      {"label":"Vercel Learn Next.js","url":"https://nextjs.org/learn"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di react: Gestione dello Stato Globale
  (
    'state-management',
    'Gestione Stato Globale',
    'Librerie per la gestione unificata dello stato applicativo complesso: Zustand, Redux Toolkit e Recoil.',
    array[
      'Non inserire tutto nello store globale; mantieni lo stato effimero nei componenti locali.',
      'Usa selettori atomici in Zustand per prevenire re-render inutili di componenti non interessati.',
      'Normalizza le strutture dati complesse con id per aggiornamenti predicibili.'
    ],
    array['Store con prefisso use e suffisso Store (es. useAuthStore, useMapStore)', 'Action con verbi imperativi chiari'],
    '[
      {"label":"Zustand Documentation","url":"https://zustand.docs.pmnd.rs/"},
      {"label":"Redux Toolkit Guide","url":"https://redux-toolkit.js.org/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di react: React Three Fiber (3D)
  (
    'react-three-fiber',
    'React Three Fiber (3D Web)',
    'Renderer React per Three.js che permette di costruire scene 3D, mesh interattive, shader e luci in modo dichiarativo su canvas WebGL.',
    array[
      'Usa useFrame per animazioni continue sincronizzate al refresh rate del browser.',
      'Disponi i modelli complessi in formato glTF/GLB compressi tramite Draco/Meshopt.',
      'Gestisci la distruzione delle geometrie e materiali non più utilizzati per prevenire GPU memory leak.'
    ],
    array['Elementi 3D JSX nativi in lowercase (mesh, boxGeometry, meshStandardMaterial)', 'Componenti di scena in PascalCase'],
    '[
      {"label":"React Three Fiber Documentation","url":"https://r3f.docs.pmnd.rs/"},
      {"label":"Three.js Journey","url":"https://threejs-journey.com/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di react: React Flow (Grafi)
  (
    'react-flow',
    'React Flow (@xyflow/react)',
    'Libreria specializzata per la creazione di grafi nodali interattivi, mappe concettuali, diagrammi e workflow visuali su canvas infinito.',
    array[
      'Memoizza nodi ed archi con useMemo o gestiscili con hook dedicati (useNodesState, useEdgesState).',
      'Definisci i tipi di nodi custom (nodeTypes) all''esterno del componente per evitare re-render del canvas.',
      'Usa Handle con id univoci per controllare la connessione tra porte di input e output.'
    ],
    array['Tipi di nodo in camelCase nel dizionario nodeTypes', 'Nodi personalizzati come componenti React in PascalCase'],
    '[
      {"label":"React Flow Documentation","url":"https://reactflow.dev/docs/quickstart"},
      {"label":"React Flow Examples","url":"https://reactflow.dev/examples"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di frontend-frameworks: Vue.js
  (
    'vuejs',
    'Vue.js',
    'Framework progressivo con sistema di reattività profonda basato su Proxy, Composition API, template dichiarativi e Pinia.',
    array[
      'Preferisci <script setup> e la Composition API per una migliore integrazione TypeScript e riusabilità.',
      'Usa ref() per primitive e reactive() solo per oggetti coerenti.',
      'Non de-strutturare oggetti reattivi senza toRefs() per evitare di perdere la reattività.'
    ],
    array['Single File Component con estensione .vue', 'Componenti in PascalCase e composable con prefisso use'],
    '[
      {"label":"Vue.js Guide","url":"https://vuejs.org/guide/introduction.html"},
      {"label":"Pinia Documentation","url":"https://pinia.vuejs.org/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di vuejs: Nuxt.js
  (
    'nuxtjs',
    'Nuxt.js',
    'Framework full-stack e SSR per Vue.js con routing automatico basato su file, auto-import di componenti e rendering ibrido.',
    array[
      'Sfrutta useAsyncData e useFetch per prevenire fetch duplicati tra server e client.',
      'Organizza server routes e API endpoint nella cartella server/api.',
      'Usa runtimeConfig per proteggere chiavi segrete lato server.'
    ],
    array['Pagine in pages/ con nomi a file kebab-case', 'Composables in composables/ con auto-import'],
    '[
      {"label":"Nuxt Official Documentation","url":"https://nuxt.com/docs"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di frontend-frameworks: Angular
  (
    'angular',
    'Angular',
    'Piattaforma e framework enterprise completo basato su TypeScript, Dependency Injection, RxJS, Signal reattivi e architettura modulare.',
    array[
      'Adotta Standalone Components per eliminare la complessità degli NgModules tradizionali.',
      'Usa Angular Signals per la gestione locale reattiva dello stato con prestazioni superiori.',
      'Disiscriviti sempre dagli Observable RxJS tramite takeUntilDestroyed() per evitare leak di memoria.'
    ],
    array['Componenti con suffisso Component (es. UserListComponent)', 'Servizi con suffisso Service iniettabili tramite @Injectable'],
    '[
      {"label":"Angular Official Documentation","url":"https://angular.dev/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di frontend-frameworks: Svelte & SvelteKit
  (
    'sveltekit',
    'Svelte & SvelteKit',
    'Approccio alternativo che sposta la reattività al momento della compilazione (senza Virtual DOM) con SvelteKit per routing SSR/SSG.',
    array[
      'Usa le rune di Svelte 5 ($state, $derived, $effect) per una reattività dichiarativa e granulare.',
      'Carica i dati tramite le funzioni load in +page.server.js per renderizzare HTML pronto sui bot.',
      'Mantieni il bundle client leggero sfruttando la compilazione nativa.'
    ],
    array['File componenti con estensione .svelte', 'File di pagina SvelteKit nominati +page.svelte'],
    '[
      {"label":"Svelte Official Docs","url":"https://svelte.dev/docs/introduction"},
      {"label":"SvelteKit Interactive Tutorial","url":"https://learn.svelte.dev/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di javascript: Testing Frontend
  (
    'testing-frontend',
    'Testing Frontend (Unit & E2E)',
    'Strategie di validazione del codice frontend: Unit testing rapido con Vitest/Jest e test End-to-End browser con Playwright o Cypress.',
    array[
      'Testa il comportamento visibile all''utente piuttosto che i dettagli di implementazione interna.',
      'Usa Testing Library con query basate su ruoli accessibili (getByRole, getByLabelText).',
      'Esegui test E2E critici su flussi utente chiave (es. registrazione, login, checkout).'
    ],
    array['File di test con estensione .test.jsx o .spec.ts', 'Cartelle di test __tests__ o vicine al componente'],
    '[
      {"label":"Vitest Official Guide","url":"https://vitest.dev/"},
      {"label":"Playwright Documentation","url":"https://playwright.dev/"},
      {"label":"Testing Library Guidelines","url":"https://testing-library.com/"}
    ]'::jsonb,
    null, null
  ),

  -- Figlio di javascript: Git Version Control
  (
    'git-version-control',
    'Git & Version Control',
    'Controllo versione distribuito fondamentale: commit atomici, branching strategy (Git Flow, Trunk-based) e collaborazione tramite Pull Request.',
    array[
      'Scrivi messaggi di commit convenzionali (feat:, fix:, chore:, refactor:).',
      'Mantieni i branch di feature piccoli e integrati frequentemente con la linea principale.',
      'Non committare mai file d''ambiente (.env), credenziali o la cartella node_modules.'
    ],
    array['Branch in kebab-case (es. feat/login-modal, fix/nav-contrast)', 'Tag versioni con prefisso v (es. v1.2.0)'],
    '[
      {"label":"Pro Git Book (Free)","url":"https://git-scm.com/book/en/v2"},
      {"label":"Conventional Commits Specification","url":"https://www.conventionalcommits.org/"}
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
select id, 'frontend', true from public.nodes where slug in (
  'internet-browser',
  'http-protocol',
  'browser-rendering',
  'accessibilita-aria',
  'css-layout',
  'css-bem-architettura',
  'media-queries',
  'ui-frameworks-css',
  'js-scope-closures',
  'typescript',
  'axios-client',
  'package-managers',
  'npx-runner',
  'build-tools-bundlers',
  'vite',
  'frontend-frameworks',
  'react',
  'nextjs',
  'state-management',
  'react-three-fiber',
  'react-flow',
  'vuejs',
  'nuxtjs',
  'angular',
  'sveltekit',
  'testing-frontend',
  'git-version-control'
)
on conflict (node_id, category) do update set is_primary = excluded.is_primary;

-- Categorie secondarie per tecnologie trasversali
insert into public.node_categories (node_id, category, is_primary)
select id, 'backend', false from public.nodes where slug in (
  'typescript',
  'package-managers',
  'git-version-control',
  'http-protocol'
)
on conflict (node_id, category) do update set is_primary = excluded.is_primary;


-- ----------------------------------------------------------------------------
-- 3. RELAZIONI PADRE-FIGLIO (public.node_parents)
-- ----------------------------------------------------------------------------
-- Elimina eventuali vecchie relazioni primarie per i nodi modificati da questo file
delete from public.node_parents
where child_id in (
  select id from public.nodes where slug in (
    'http-protocol', 'browser-rendering', 'accessibilita-aria', 'css-layout',
    'css-bem-architettura', 'media-queries', 'ui-frameworks-css', 'js-scope-closures',
    'typescript', 'axios-client', 'package-managers', 'npx-runner', 'build-tools-bundlers',
    'vite', 'frontend-frameworks', 'react', 'nextjs', 'state-management', 'react-three-fiber',
    'react-flow', 'vuejs', 'nuxtjs', 'angular', 'sveltekit', 'testing-frontend',
    'git-version-control'
  )
);

-- Relazioni primarie
insert into public.node_parents (parent_id, child_id, sort_order, is_primary)
select p.id, c.id, rel.sort_order, true
from (
  values
    -- Sotto internet-browser
    ('internet-browser', 'http-protocol', 0),
    ('internet-browser', 'browser-rendering', 1),

    -- Sotto html
    ('html', 'accessibilita-aria', 3),

    -- Sotto css
    ('css', 'css-layout', 2),
    ('css', 'css-bem-architettura', 3),
    ('css', 'ui-frameworks-css', 4),

    -- Sotto responsive-design
    ('responsive-design', 'media-queries', 0),

    -- Sotto javascript
    ('javascript', 'js-scope-closures', 4),
    ('javascript', 'typescript', 5),
    ('javascript', 'package-managers', 6),
    ('javascript', 'build-tools-bundlers', 7),
    ('javascript', 'frontend-frameworks', 8),
    ('javascript', 'testing-frontend', 9),
    ('javascript', 'git-version-control', 10),

    -- Sotto async-fetch
    ('async-fetch', 'axios-client', 2),

    -- Sotto package-managers
    ('package-managers', 'npx-runner', 0),

    -- Sotto build-tools-bundlers
    ('build-tools-bundlers', 'vite', 0),

    -- Sotto frontend-frameworks
    ('frontend-frameworks', 'react', 0),
    ('frontend-frameworks', 'vuejs', 1),
    ('frontend-frameworks', 'angular', 2),
    ('frontend-frameworks', 'sveltekit', 3),

    -- Sotto react
    ('react', 'nextjs', 0),
    ('react', 'state-management', 1),
    ('react', 'react-three-fiber', 2),
    ('react', 'react-flow', 3),

    -- Sotto vuejs
    ('vuejs', 'nuxtjs', 0)
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
    'internet-browser', 'http-protocol', 'browser-rendering', 'accessibilita-aria',
    'css-layout', 'css-bem-architettura', 'media-queries', 'ui-frameworks-css',
    'js-scope-closures', 'typescript', 'axios-client', 'package-managers',
    'npx-runner', 'build-tools-bundlers', 'vite', 'frontend-frameworks',
    'react', 'nextjs', 'state-management', 'react-three-fiber', 'react-flow',
    'vuejs', 'nuxtjs', 'angular', 'sveltekit', 'testing-frontend', 'git-version-control'
  )
);

-- Accessibilità ARIA & Non Vedenti
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Linee Guida per Utenti Non Vedenti e Screen Reader', 'text',
  '{"text":"L''accessibilità web (A11y) garantisce che persone con disabilità visive possano navigare con screen reader (NVDA, JAWS, VoiceOver). La prima regola è impiegare elementi HTML semantici nativi (button, nav, main, dialog) che contengono già il corretto albero di accessibilità. Gli attributi WAI-ARIA intervengono dove il markup nativo non è sufficiente."}'::jsonb
from public.nodes where slug = 'accessibilita-aria';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Attributi ARIA Fondamentali', 'table',
  '{"columns":["Attributo","Scopo","Esempio d''uso"],"rows":[["aria-label","Fornisce un''etichetta accessibile quando il testo visivo manca","aria-label=\"Chiudi finestra\" su bottone X"],["aria-hidden=\"true\"","Nasconde elementi puramente visivi/decorativi allo screen reader","aria-hidden=\"true\" su icone SVG"],["aria-expanded","Indica se un menu o dropdown è aperto o chiuso","aria-expanded=\"false\" su accordion"],["aria-live=\"polite\"","Notifica annunci dinamici allo screen reader senza interrompere l''utente","Banner di notifica o toast dinamico"]]}'::jsonb
from public.nodes where slug = 'accessibilita-aria';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 2, 'Pattern HTML & ARIA Conforme', 'code',
  '{"code":"<!-- Bottone accessibile con icona decorativa e testo vocale esplicito -->\n<button type=\"button\" class=\"btn-icon\" aria-label=\"Apri impostazioni utente\">\n  <svg aria-hidden=\"true\" focusable=\"false\" width=\"20\" height=\"20\">\n    <use href=\"#gear-icon\" />\n  </svg>\n</button>\n\n<!-- Regione dinamica che notifica i lettori di schermo -->\n<div role=\"status\" aria-live=\"polite\" class=\"sr-only\">\n  Elemento aggiunto con successo al carrello.\n</div>","language":"html"}'::jsonb
from public.nodes where slug = 'accessibilita-aria';

-- Media Queries
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Media Queries & Approccio Mobile-First', 'text',
  '{"text":"La filosofia Mobile-First prevede la stesura iniziale degli stili per schermi piccoli (smartphone), arricchendo poi l''interfaccia per tablet e desktop tramite @media (min-width: ...). Questo riduce il codice sovrascritto e velocizza il rendering sui dispositivi mobili."}'::jsonb
from public.nodes where slug = 'media-queries';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Sintassi Moderna Media Queries', 'code',
  '{"code":"/* Layout base smartphone */\n.grid-container {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n}\n\n/* Da Tablet in su (Sintassi moderna CSS Range) */\n@media (width >= 768px) {\n  .grid-container {\n    display: grid;\n    grid-template-columns: repeat(2, 1fr);\n  }\n}\n\n/* Rispetto delle preferenze utente per animazioni ridotte */\n@media (prefers-reduced-motion: reduce) {\n  * {\n    animation-duration: 0.01ms !important;\n    transition-duration: 0.01ms !important;\n  }\n}","language":"css"}'::jsonb
from public.nodes where slug = 'media-queries';

-- NPX Runner
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Cos''è NPX e Differenza con NPM', 'text',
  '{"text":"NPX è un package runner distribuito insieme a npm. Mentre npm installa librerie nel progetto (node_modules) o a livello globale nel sistema, npx scarica, esegue ed elimina automaticamente lo script binario richiesto. È ideale per CLI temporanee, scaffold di progetti e strumenti di migrazione."}'::jsonb
from public.nodes where slug = 'npx-runner';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Casi d''Uso Comuni di NPX', 'code',
  '{"code":"# Inizializza un nuovo progetto Vite senza installare create-vite nel computer\nnpx -y create-vite@latest mio-progetto --template react\n\n# Inizializza Shadcn UI nel progetto corrente\nnpx -y shadcn@latest init\n\n# Esegue una CLI di test temporanea\nnpx -y lighthouse https://example.com --view","language":"bash"}'::jsonb
from public.nodes where slug = 'npx-runner';

-- Vite
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Architettura a Doppio Motore di Vite', 'text',
  '{"text":"In modalità sviluppo, Vite serve il codice tramite moduli ES nativi (ESM), compilando i moduli su richiesta tramite esbuild in Go (10-100x più veloce dei bundler tradizionali). In fase di produzione crea bundle ultra-ottimizzati tramite Rollup con tree-shaking e code splitting granulare."}'::jsonb
from public.nodes where slug = 'vite';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Configurazione Essenziale vite.config.js', 'code',
  '{"code":"import { defineConfig } from ''vite'';\nimport react from ''@vitejs/plugin-react'';\nimport path from ''path'';\n\nexport default defineConfig({\n  plugins: [react()],\n  resolve: {\n    alias: {\n      ''@'': path.resolve(__dirname, ''./src''),\n    },\n  },\n  server: {\n    port: 3000,\n    open: true,\n  },\n});","language":"js"}'::jsonb
from public.nodes where slug = 'vite';

-- React Three Fiber
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Grafica 3D Dichiarativa nel Web', 'text',
  '{"text":"React Three Fiber (R3F) è un renderer React per Three.js. Permette di costruire scene tridimensionali complesse componendo nodi JSX che si mappano direttamente sulle classi Three.js, integrando il ciclo di vita, i props e gli hook di React."}'::jsonb
from public.nodes where slug = 'react-three-fiber';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Componente Scena R3F Esempio', 'code',
  '{"code":"import { Canvas, useFrame } from ''@react-three/fiber'';\nimport { useRef } from ''react'';\n\nfunction RotatingCube() {\n  const meshRef = useRef();\n  \n  useFrame((state, delta) => {\n    meshRef.current.rotation.x += delta * 0.5;\n    meshRef.current.rotation.y += delta * 0.7;\n  });\n\n  return (\n    <mesh ref={meshRef}>\n      <boxGeometry args={[1.5, 1.5, 1.5]} />\n      <meshStandardMaterial color=\"#64d9bd\" wireframe />\n    </mesh>\n  );\n}\n\nexport default function Scene() {\n  return (\n    <Canvas style={{ height: 400 }}>\n      <ambientLight intensity={0.5} />\n      <pointLight position={[10, 10, 10]} />\n      <RotatingCube />\n    </Canvas>\n  );\n}","language":"js"}'::jsonb
from public.nodes where slug = 'react-three-fiber';

-- React Flow
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Canvas Interattivi e Grafi di Nodi', 'text',
  '{"text":"React Flow (@xyflow/react) è la libreria usata proprio in questo progetto per visualizzare la mappa delle competenze. Fornisce navigazione su canvas con zoom, pan, selezione nodi, porte di connessione (Handle), rendering SVG/HTML personalizzato ed edge interattivi."}'::jsonb
from public.nodes where slug = 'react-flow';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Struttura Nodi ed Archi', 'table',
  '{"columns":["Proprietà","Tipo","Ruolo"],"rows":[["id","string","Identificativo univoco del nodo o arco"],["position","{ x, y }","Coordinate nel canvas virtuale"],["data","object","Payload inviato al componente del nodo"],["type","string","Nome del componente registrato in nodeTypes"],["source / target","string","ID del nodo sorgente e destinazione per gli edge"]]}'::jsonb
from public.nodes where slug = 'react-flow';

-- TypeScript
insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 0, 'Vantaggi della Tipizzazione Statica', 'text',
  '{"text":"TypeScript intercetta refusi, accessi a proprietà inesistenti (undefined is not a function) ed errori di tipo prima che il codice arrivi nel browser. Fornisce un autocompletamento eccellente nell''IDE e documenta le strutture dati direttamente nel codice."}'::jsonb
from public.nodes where slug = 'typescript';

insert into public.node_content_sections (node_id, sort_order, title, type, payload)
select id, 1, 'Esempio Tipi e Discriminated Unions', 'code',
  '{"code":"// Discriminated union per modellare stati asincroni puliti\ntype FetchState<T> =\n  | { status: ''idle'' }\n  | { status: ''loading'' }\n  | { status: ''success''; data: T }\n  | { status: ''error''; error: Error };\n\ninterface SkillNode {\n  id: string;\n  label: string;\n  category: ''frontend'' | ''backend'' | ''database'';\n}\n\nfunction renderNode(state: FetchState<SkillNode>) {\n  switch (state.status) {\n    case ''loading'': return ''Caricamento...'';\n    case ''success'': return `Nodo: ${state.data.label}`;\n    case ''error'':   return `Errore: ${state.error.message}`;\n    default:          return null;\n  }\n}","language":"js"}'::jsonb
from public.nodes where slug = 'typescript';
