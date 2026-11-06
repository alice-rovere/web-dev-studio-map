// TEMPLATE per un nuovo Visual Notebook. Non è registrato: copialo, rinominalo
// (es. `miaTecnologiaFlowConfig.js`) e compila i campi.
//
// Checklist:
//  1. Copia questo file in `src/notebooks/configs/` con il nuovo nome.
//  2. Compila `slug`, `title`, `subtitle`, `phases`, `steps`.
//  3. Registra lo slug in `src/notebooks/registry.js`:
//       "mio-slug": () => import("./configs/miaTecnologiaFlowConfig.js"),
//  4. Lo slug deve coincidere con quello del nodo da cui si apre il notebook.
//  5. (Opzionale) Crea una scena SVG in `src/components/notebook/` usando le
//     icone di `src/notebooks/icons/` e mappala su `illustration` in
//     `VisualNotebookLayout.jsx`.
//  6. Esegui `pnpm lint` e `pnpm build`.
//
// Regole: config pura (niente funzioni/JSX), testi in italiano,
// salvabile 1:1 su Supabase.

// Snippet riutilizzati dai pannelli: definiscili qui sopra come costanti.
const exampleCode = `// codice di esempio`;

export const nuovoFlowConfig = {
  // Identificatore univoco: uguale allo slug del nodo e a quello nel registry.
  slug: "mio-slug",
  title: "Titolo del notebook",
  subtitle: "Sottotitolo: da dove a dove va il flusso",

  // Fasi: le tappe visibili nella barra del layout (ordine = ordine a schermo).
  // `icon` è una chiave di PHASE_ICONS in VisualNotebookLayout.jsx
  // (es. "server", "code", "terminal", "database").
  phases: [
    { id: "fase-1", label: "Fase 1", hint: "Descrizione breve", icon: "server" },
    { id: "fase-2", label: "Fase 2", hint: "Descrizione breve", icon: "database" },
  ],

  // Step: ogni step spiega UN passaggio significativo.
  steps: [
    {
      // Univoco nel notebook; la scena SVG lo riceve come `stepId`.
      id: "primo-step",
      // Deve coincidere con l'id di una fase sopra.
      phase: "fase-1",
      // Id della scena SVG registrata nel layout (opzionale).
      illustration: "mio-flusso",
      title: "Titolo dello step",
      description: "Cosa succede in questo passaggio e perché.",

      // Pannelli supportati: "code", "table", "text".
      panels: [
        {
          kind: "code",
          label: "nomefile.js",
          language: "js", // js | sql | ...
          content: exampleCode,
          highlightLines: [1], // righe evidenziate (base 1), opzionale
        },
        {
          kind: "text",
          label: "Output / richiesta / risposta",
          content: "Testo libero, anche su più righe.",
        },
        {
          kind: "table",
          label: "Tabella di esempio",
          columns: ["id", "nome"],
          rows: [
            ["1", "Ada"],
            ["2", "Grace"],
          ],
          highlightRows: [1], // indici di riga evidenziati (base 0), opzionale
        },
      ],
    },
    // ...aggiungi altri step copiando il blocco sopra
  ],
};

export default nuovoFlowConfig;
