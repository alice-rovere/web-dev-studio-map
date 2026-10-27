import PageTabs from "../components/PageTabs";
import { StickyNotesCanvas } from "../components/StickyNotesCanvas";

const namingConventions = [
  {
    name: "camelCase",
    usage: "Variabili e funzioni JavaScript",
    example: "selectedNodeId, loadStudioMap()",
  },
  {
    name: "PascalCase",
    usage: "Componenti React e classi",
    example: "NodeDetailsPanel.jsx, function NodeDetailsPanel()",
  },
  {
    name: "snake_case",
    usage: "Colonne e campi del database, quando richiesto dallo schema",
    example: "position_x, best_practices",
  },
  {
    name: "kebab-case",
    usage: "Classi CSS e nomi di cartelle o file non-componenti",
    example: "studio-map__heading, user-settings/",
  },
  {
    name: "UPPER_SNAKE_CASE",
    usage: "Variabili d'ambiente e costanti globali davvero immutabili",
    example: "VITE_SUPABASE_URL",
  },
  {
    name: "Train-Case",
    usage: "Alcuni header HTTP e nomi composti in contesti specifici",
    example: "Content-Type",
  },
];

const fileConventions = [
  "Organizza il codice per responsabilità: componenti in src/components/, servizi e integrazioni in src/lib/ e dati condivisi in src/data/.",
  "Usa PascalCase per i file dei componenti React; mantieni i nomi degli altri moduli brevi e descrittivi, in kebab-case o camelCase secondo il ruolo e le convenzioni già presenti.",
  "Mantieni componenti, funzioni e file focalizzati; estrai un modulo solo quando ha una responsabilità chiara e riutilizzabile.",
];

const qualityPractices = [
  "Segui la formattazione e i pattern già usati nel progetto; evita variazioni di stile nello stesso modulo.",
  "Esegui pnpm lint e pnpm build prima di condividere una modifica.",
  "Aggiungi o aggiorna test per comportamenti e casi limite interessati dalla modifica.",
  "Preferisci cambiamenti piccoli e leggibili; rimuovi codice inutilizzato e dipendenze non necessarie.",
];

const accessibilityPractices = [
  "Usa elementi HTML semantici, etichette associate ai campi e nomi accessibili per i controlli.",
  "Assicurati che tutte le funzioni siano utilizzabili da tastiera e che il focus sia visibile.",
  "Non comunicare informazioni solo tramite colore; gestisci chiaramente caricamento, successo ed errore.",
  "Verifica contrasto, testi alternativi pertinenti e layout su schermi piccoli.",
];

const securityPractices = [
  "Non inserire segreti nel codice, nei commit o nel frontend; usa variabili d'ambiente per la configurazione.",
  "Le variabili VITE_* sono incluse nel bundle client: usale solo per valori pubblici, mai per password o chiavi service_role.",
  "Per Supabase, proteggi i dati con autenticazione e policy RLS appropriate; una chiave anon pubblica non sostituisce le policy.",
  "Valida i dati in ingresso e mostra errori espliciti senza esporre credenziali o dettagli interni non necessari.",
];

function GuidelineList({ items }) {
  return (
    <ul className="list-disc pl-5 space-y-2 text-slate-300">
      {items.map((item) => (
        <li key={item} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

function GuidelineCard({ id, title, items }) {
  return (
    <section
      aria-labelledby={id}
      className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
    >
      <h3
        id={id}
        className="text-xl font-bold text-white border-b border-slate-800 pb-2"
      >
        {title}
      </h3>
      <GuidelineList items={items} />
    </section>
  );
}

const TABS = [
  {
    id: "naming",
    label: "Naming convention",
    content: (
      <section
        aria-labelledby="guidelines-naming-title"
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6"
      >
        <div className="space-y-2">
          <h3
            id="guidelines-naming-title"
            className="text-xl font-bold text-white"
          >
            Naming convention
          </h3>
          <p className="text-slate-300 text-sm">
            Scegli la forma in base al contesto e mantienila coerente nel
            progetto. Non cambiare la convenzione richiesta da un framework o
            da uno schema esistente.
          </p>
          <p className="pt-2">
            <a
              href="https://aulab.it/blog/le-convenzioni-del-naming-nella-programmazione-informatica"
              rel="noreferrer"
              target="_blank"
              className="text-sm font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
            >
              Approfondisci le convenzioni del naming →
            </a>
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="p-4">Stile</th>
                <th className="p-4">Uso tipico</th>
                <th className="p-4">Esempio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {namingConventions.map(({ name, usage, example }) => (
                <tr
                  key={name}
                  className="hover:bg-slate-900/30 transition-colors"
                >
                  <td className="p-4 font-mono text-indigo-400 font-medium whitespace-nowrap">
                    {name}
                  </td>
                  <td className="p-4 text-slate-300">{usage}</td>
                  <td className="p-4">
                    <code className="font-mono text-xs bg-slate-900 border border-slate-800 text-amber-400 px-2 py-1 rounded block md:inline-block max-w-xs md:max-w-none overflow-x-auto">
                      {example}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    ),
  },
  {
    id: "files",
    label: "File e cartelle",
    content: (
      <GuidelineCard
        id="guidelines-files-title"
        items={fileConventions}
        title="File e cartelle"
      />
    ),
  },
  {
    id: "quality",
    label: "Qualità del codice",
    content: (
      <GuidelineCard
        id="guidelines-quality-title"
        items={qualityPractices}
        title="Qualità del codice"
      />
    ),
  },
  {
    id: "accessibility",
    label: "Accessibilità e UX",
    content: (
      <GuidelineCard
        id="guidelines-accessibility-title"
        items={accessibilityPractices}
        title="Accessibilità e UX"
      />
    ),
  },
  {
    id: "security",
    label: "Sicurezza di base",
    content: (
      <GuidelineCard
        id="guidelines-security-title"
        items={securityPractices}
        title="Sicurezza di base"
      />
    ),
  },
];

export default function Guidelines() {
  return (
    <section
      aria-labelledby="guidelines-page-title"
      className="relative h-full w-full bg-slate-950 text-slate-100 p-6 md:p-12 font-sans overflow-y-auto"
    >
      <StickyNotesCanvas boardId="page-linee-guida" />

      <div className="max-w-4xl mx-auto space-y-12 pb-5">
        <header className="space-y-3">
          <h2
            id="guidelines-page-title"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
          >
            Linee guida dello studio
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
            Convenzioni condivise per mantenere il codice leggibile, accessibile
            e sicuro. Le regole specifiche di una tecnologia possono essere
            approfondite nella relativa scheda della mappa.
          </p>
        </header>

        <PageTabs
          accent="indigo"
          ariaLabel="Sezioni delle linee guida"
          tabs={TABS}
        />
      </div>
    </section>
  );
}
