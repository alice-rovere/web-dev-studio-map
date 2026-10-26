// Database mockup per i nodi figli (espansione circolare)
export const MOCK_CHILDREN_DB = {
  html: [
    { id: "tags", label: "Tag Nativi" }, 
    { id: "forms", label: "Form & Validazione" },
    { id: "seo", label: "SEO Semantic" },
  ],
  javascript: [
    { id: "dom", label: "DOM Manipulation" },
    { id: "async", label: "Async/Fetch" },
    { id: "es6", label: "ES6+ Features" },
    { id: "storage", label: "Local Storage" },
  ],
  css: [
    { id: "bootstrap", label: "bootstrap" },
    { id: "tailwind", label: "tailwind" },
  ],
};

// Database mockup iniziale per l'Inspector e le sezioni estese di NodeKnowledge
export const MOCK_DETAILS_DB = {
  html: {
    description:
      "HyperText Markup Language. Struttura portante del web per l'organizzazione semantica del contenuto applicativo.",
    best_practices:
      "Usa marcatori semantici nativi.\nValida costantemente i tag secondo specifiche W3C.",
    naming_conventions: [
      "Tag e attributi rigorosamente minuscoli",
      "Classi in kebab-case",
    ],
    study_urls: [{ label: "MDN HTML Basics", url: "https://mozilla.org" }],
    extended_content: [
      {
        title: "Struttura Semantica Core",
        type: "text",
        text: "L'uso corretto degli elementi semantici garantisce una leggibilità eccellente per motori di ricerca ed assistenti digitali."
      },
      {
        title: "Specifiche W3C",
        type: "list",
        items: ["Utilizzo tassativo di main, article, section", "Tag ALT obbligatori sulle primitive d'immagine"]
      }
    ]
  },
  css: {
    description:
      "Cascading Style Sheets. Gestione dello stile visivo, layout responsivi e implementazioni grafiche neon dell'HUD.",
    best_practices:
      "Mantieni l'architettura atomica.\nSfrutta le variabili native o utility classes.",
    naming_conventions: ["Metodologia BEM o utility pure"],
    study_urls: [
      { label: "Tailwind CSS Documentation", url: "https://tailwindcss.com" },
    ],
    extended_content: [
      {
        title: "Integrazione Tailwind Utility-First",
        type: "text",
        text: "Ottimizzazione totale dei pacchetti CSS eliminando la ridondanza dei fogli di stile nativi tradizionali."
      },
      {
        title: "Performance Monitor",
        type: "table",
        columns: ["Config", "Peso Bundle", "Stato"],
        rows: [
          ["Tailwind v4", "< 10kB", "Nominale"],
          ["CSS Tradizionale", "140kB", "Rilevato Overhead"]
        ]
      }
    ]
  },
  javascript: {
    description:
      "Linguaggio runtime asincrono ad eventi. Logica computazionale ed interazioni dinamiche dei grafi di rete.",
    best_practices:
      "Evita mutazioni dirette degli stati condivisi.\nPrediligi astrazioni funzionali.",
    naming_conventions: [
      "camelCase per metodi e variabili",
      "PascalCase per costruttori",
    ],
    study_urls: [{ label: "MDN JavaScript Guide", url: "https://mozilla.org" }],
    extended_content: [
      {
        title: "Runtime Engine & Event Loop",
        type: "text",
        text: "Gestione dei thread e delle code asincrone tramite macro e micro task per l'aggiornamento grafico del canvas in tempo reale."
      },
      {
        title: "Milestone di Ottimizzazione",
        type: "timeline",
        entries: [
          { date: "Fase 1", title: "Refactor Geometrie", description: "Spostamento dei calcoli trigonometrici fuori dal ciclo di render principale." },
          { date: "Fase 2", title: "Aggancio Supabase", description: "Attivazione della persistenza cloud tramite chiamate RPC asincrone." }
        ]
      },
      {
        title: "Calcolo Posizione Vettoriale",
        type: "code",
        code: "const theta = (2 * Math.PI) / total;\nconst x = parentX + radius * Math.cos(theta * i);"
      }
    ]
  },
};

// Configurazione geometrica iniziale del grafo di React Flow
export const initialNodes = [
  {
    id: "group-frontend",
    type: "macroGroup",
    data: {
      label: "Frontend",
      borderColor: "border-blue-300",
      bgColor: "bg-blue-50/30",
      textColor: "text-blue-500",
    },
    position: { x: 100, y: 100 },
    style: { width: 500, height: 500 },
    focusable: false,
    draggable: false,
  },
  {
    id: "group-backend",
    type: "macroGroup",
    data: {
      label: "Backend",
      borderColor: "border-emerald-300",
      bgColor: "bg-emerald-50/30",
      textColor: "text-emerald-500",
    },
    position: { x: 450, y: 100 },
    style: { width: 500, height: 500 },
    focusable: false,
    draggable: false,
  },
  {
    id: "group-database",
    type: "macroGroup",
    data: {
      label: "Database",
      borderColor: "border-purple-300",
      bgColor: "bg-purple-50/30",
      textColor: "text-purple-500",
    },
    position: { x: 275, y: 400 },
    style: { width: 500, height: 500 },
    focusable: false,
    draggable: false,
  },
  {
    id: "html",
    type: "tech",
    data: { label: "HTML", hasChildren: true, isOpen: false },
    position: { x: 220, y: 200 },
  },
  {
    id: "css",
    type: "tech",
    data: { label: "CSS", hasChildren: true, isOpen: false },
    position: { x: 220, y: 300 },
  },
  {
    id: "javascript",
    type: "tech",
    data: { label: "JavaScript", hasChildren: true, isOpen: false },
    position: { x: 500, y: 250 },
  },
];

export const initialEdges = [];
