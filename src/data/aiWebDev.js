export const promptBestPractices = [
  {
    title: "Dai contesto e obiettivo",
    description:
      "Spiega cosa deve essere costruito, per chi e perche. Indica file, cartelle e tecnologie coinvolte invece di lasciare che l'agente indovini.",
    tip: "Parti da un problema verificabile: «aggiungi la validazione email al form di login» e non «migliora il form».",
  },
  {
    title: "Definisci ruolo e vincoli",
    description:
      "Dichiara il ruolo atteso e i limiti: stack, versioni, convenzioni del progetto, cosa non modificare e cosa non introdurre.",
    tip: "«Usa solo le dipendenze gia presenti nel package.json» evita librerie superflue.",
  },
  {
    title: "Mostra esempi concreti",
    description:
      "Un esempio di input e output atteso chiarisce formato e stile meglio di molte parole. Per i task ripetitivi usa il pattern few-shot.",
    tip: "Incolla una funzione o un test gia presente nel repo come riferimento di stile.",
  },
  {
    title: "Specifica formato e criteri di successo",
    description:
      "Indica dove scrivere il codice, il formato di risposta e come verificare il risultato: test, lint, build, comportamento atteso.",
    tip: "«Al termine esegui pnpm lint e pnpm build e riporta l'esito» rende il lavoro verificabile.",
  },
  {
    title: "Chiedi un piano prima del codice",
    description:
      "Per modifiche non banali fai proporre un piano con file coinvolti e rischi. Approva il piano prima dell'implementazione.",
    tip: "Un piano esplicito riduce le modifiche inattese e rende piu semplice correggere la direzione.",
  },
  {
    title: "Itera in passi piccoli",
    description:
      "Dividi il lavoro in incrementi verificabili. Un task grande produce piu errori e un diff difficile da revisionare.",
    tip: "Un passo, una verifica: implementa, testa, poi passa al passo successivo.",
  },
  {
    title: "Ancora le istruzioni al repository",
    description:
      "Cita percorsi e righe reali e chiedi all'agente di leggere i file prima di scrivere. Evita di incollare interi file se puo leggerli da solo.",
    tip: "«Leggi src/pages/Guidelines.jsx e segui lo stesso pattern» e piu preciso di una descrizione astratta.",
  },
  {
    title: "Rivedi sempre il risultato",
    description:
      "Tratta l'output come una proposta: controlla diff, dipendenze, licenze e sicurezza. L'agente non sostituisce la revisione umana.",
    tip: "Verifica che le API usate esistano davvero: i modelli possono inventare nomi e librerie.",
  },
  {
    title: "Non condividere segreti o dati personali",
    description:
      "Niente chiavi, token, password o dati sensibili nel prompt. Usa variabili d'ambiente e contenuti di esempio anonimizzati.",
    tip: "Se un segreto finisce in una chat o in un commit, revocalo: non basta cancellarlo.",
  },
];

export const promptTemplates = [
  {
    id: "feature",
    title: "Nuova funzionalita",
    description: "Per aggiungere una pagina, un componente o un flusso completo.",
    prompt: `Obiettivo: aggiungi <funzionalita> a <pagina/area>.
Contesto: leggi <file di riferimento> e segui i pattern esistenti.
Vincoli:
- stack e dipendenze gia presenti nel progetto;
- nessuna modifica al database o alle policy RLS;
- testi dell'interfaccia in italiano;
- nessun segreto nel codice o nei commit.
Criteri di successo:
- <comportamento atteso 1>;
- <comportamento atteso 2>;
- pnpm lint e pnpm build passano.
Prima proponi un piano con i file da toccare. Attendi la mia conferma, poi implementa.`,
  },
  {
    id: "bugfix",
    title: "Bug e regressioni",
    description: "Per riprodurre, diagnosticare e correggere un errore.",
    prompt: `Bug: <descrizione>.
Passi per riprodurlo: <passi>.
Comportamento atteso: <risultato>.
Comportamento attuale: <errore o risultato>.
Prima di modificare il codice:
1. individua la causa con riferimenti a file e righe;
2. proponi la correzione minima;
3. indica come verificarla con test o comando.
Non cambiare comportamenti non collegati al bug.`,
  },
  {
    id: "refactor",
    title: "Refactor sicuro",
    description: "Per riordinare il codice senza cambiare il comportamento.",
    prompt: `Refactor di <modulo/componente>.
Obiettivo: <leggibilita, deduplicazione, separazione delle responsabilita>.
Vincoli:
- comportamento pubblico invariato;
- nessuna nuova dipendenza;
- mantieni le convenzioni e la struttura delle cartelle;
- aggiorna o aggiungi i test necessari.
Mostra il diff proposto e spiega i rischi prima di applicarlo.`,
  },
];

export const tokenConcepts = [
  {
    term: "Token",
    meaning:
      "Unita minima con cui i modelli elaborano il testo. Non coincide con parole o caratteri: in italiano un token copre in media meno caratteri rispetto all'inglese.",
    tip: "Per una stima rapida considera circa 4 caratteri per token in inglese, meno per testi tecnici o in italiano.",
  },
  {
    term: "Context window",
    meaning:
      "Quantita massima di token che il modello puo considerare in una singola richiesta, sommando istruzioni, cronologia, file e risposta.",
    tip: "Contesti enormi non sono gratuiti: aumentano costo e latenza e possono distrarre il modello.",
  },
  {
    term: "Token di input e di output",
    meaning:
      "I token di input sono cio che invii (prompt, codice, documenti); quelli di output sono cio che il modello genera. Hanno spesso prezzi diversi.",
    tip: "Ridurre il contesto inutile e chiedere risposte concise abbassa il costo piu di quanto sembri.",
  },
  {
    term: "Costo per milione di token",
    meaning:
      "I provider espongono il prezzo per milione di token, separato tra input e output. Il costo effettivo dipende anche da cache e routing.",
    tip: "Confronta i prezzi sul provider che usi davvero: OpenRouter mostra il listino per modello.",
  },
  {
    term: "Contesto utile e rumore",
    meaning:
      "Ogni informazione occupa spazio. File interi, log lunghi o cronologia vecchia possono nascondere i dettagli rilevanti.",
    tip: "Includi solo i file e le sezioni pertinenti al task; usa riferimenti a percorsi e righe.",
  },
  {
    term: "Compaction e riassunti",
    meaning:
      "Quando la conversazione si avvicina al limite, gli strumenti possono riassumere o comprimere la cronologia per continuare a lavorare.",
    tip: "Riavvia con un riassunto esplicito di obiettivo, decisioni e stato invece di trascinare tutta la chat.",
  },
  {
    term: "Prompt caching",
    meaning:
      "Alcuni provider riutilizzano parti stabili del prompt (istruzioni, documenti) riducendo costo e latenza delle richieste ripetute.",
    tip: "Tieni stabile la parte iniziale del prompt e metti le variazioni in fondo, quando il provider supporta la cache.",
  },
  {
    term: "Chunking e retrieval",
    meaning:
      "Per basi di codice o documenti grandi si recuperano solo i frammenti pertinenti (RAG o ricerca nel repo) invece di inviare tutto.",
    tip: "Preferisci ricerca e riferimenti mirati: e la forma piu economica di contesto.",
  },
];

export const aiTools = [
  {
    name: "OpenCode",
    role: "Agente di coding nel terminale",
    description:
      "CLI open source per lavorare sul repository con un agente: legge i file, propone modifiche ed esegue comandi. E indipendente dal provider e puo usare modelli diversi.",
    points: [
      "Configurazione del progetto in opencode.json o opencode.jsonc.",
      "Legge AGENTS.md per conoscere stack, comandi e convenzioni.",
      "Supporta skill, server MCP e sessioni di lavoro riprendibili.",
      "Le chiavi dei provider vanno nelle variabili d'ambiente, mai nel repository.",
    ],
    href: "https://opencode.ai/docs",
    label: "Documentazione OpenCode",
  },
  {
    name: "OpenRouter",
    role: "Gateway unificato per i modelli",
    description:
      "Espone molti modelli tramite un'unica API compatibile con il formato OpenAI, con listino per token, routing e fallback tra provider.",
    points: [
      "Una sola chiave per modelli di vendor diversi.",
      "Routing, fallback e limiti di spesa configurabili dal pannello.",
      "Utile per confrontare costo e qualita su task reali.",
      "La chiave si conserva in una variabile d'ambiente o in un secret manager.",
    ],
    href: "https://openrouter.ai/docs",
    label: "Documentazione OpenRouter",
  },
];

export const agentFileSections = [
  {
    title: "A cosa serve AGENTS.md",
    description:
      "E un file Markdown alla radice del repository che descrive all'agente come lavorare nel progetto: stack, comandi, struttura, convenzioni e vincoli. Evita di ripetere le stesse istruzioni a ogni sessione.",
  },
  {
    title: "Cosa includere",
    description:
      "Comandi di setup, lint, test e build; architettura e cartelle principali; convenzioni di naming e stile; regole di sicurezza; aree da non modificare senza approvazione.",
  },
  {
    title: "Cosa evitare",
    description:
      "Segreti, dati personali, istruzioni temporanee, muri di testo e regole duplicate. Il file deve restare breve, aggiornato e verificabile.",
  },
  {
    title: "Precedenza e file annidati",
    description:
      "Oltre al file di root puoi avere AGENTS.md nelle sottocartelle: le istruzioni piu vicine al file modificato hanno priorita. Usali per regole specifiche di un'area del progetto.",
  },
  {
    title: "Istruzioni e strumenti",
    description:
      "Molti agenti leggono anche file di configurazione dedicati (per esempio opencode.json) e cartelle di skill. Tieni le regole generali in AGENTS.md e la configurazione tecnica nei file dello strumento.",
  },
];

export const agentFileExample = `# AGENTS.md

## Stack
- React 19 + Vite, Tailwind CSS 4, React Router, Supabase.

## Comandi
- Installazione: pnpm install
- Sviluppo: pnpm dev
- Lint: pnpm lint
- Build: pnpm build

## Struttura
- src/pages: pagine routed
- src/components: componenti riutilizzabili
- src/data: contenuti statici e costanti
- src/services: integrazioni esterne

## Convenzioni
- Componenti in PascalCase, funzioni e variabili in camelCase.
- Testi dell'interfaccia in italiano.
- Segui i pattern gia presenti nei file vicini.

## Sicurezza
- Nessun segreto nel codice: usa variabili d'ambiente.
- Le variabili VITE_* finiscono nel bundle client.

## Da non fare
- Non modificare le policy RLS senza approvazione.
- Non introdurre dipendenze senza necessita.`;

export const openSpecFlow = [
  {
    step: "1. Proposal",
    description:
      "Descrivi il cambiamento, il problema e il risultato atteso. La proposta e il punto di accordo prima di scrivere codice.",
  },
  {
    step: "2. Specs",
    description:
      "Scrivi i requisiti come scenari verificabili (quando succede X, allora Y). Le specifiche vivono nel repository insieme al codice.",
  },
  {
    step: "3. Design",
    description:
      "Per i cambiamenti complessi annota decisioni tecniche, alternative e rischi. Per quelli semplici puo essere implicito.",
  },
  {
    step: "4. Tasks",
    description:
      "Scomponi il lavoro in attivita piccole e tracciabili. Ogni task deve poter essere completato e verificato.",
  },
  {
    step: "5. Implement",
    description:
      "L'agente implementa seguendo specifiche e task, mentre tu revisioni diff e verifiche.",
  },
  {
    step: "6. Archive",
    description:
      "Quando il cambiamento e completo, aggiorna le specifiche correnti e archivia la modifica conclusa.",
  },
];

export const openSpecTree = `openspec/
  config.yaml
  specs/              # specifiche correnti, approvate
    <capability>/
      spec.md
  changes/            # modifiche in corso
    <change-id>/
      proposal.md
      design.md
      tasks.md
      specs/          # delta delle specifiche
  changes/archive/    # modifiche concluse`;

export const openSpecCommands = [
  {
    command: "npm install -g @fission-ai/openspec@latest",
    description: "Installa la CLI OpenSpec.",
  },
  {
    command: "openspec init",
    description: "Inizializza la struttura openspec/ nel repository.",
  },
  {
    command: "openspec new change <nome>",
    description: "Crea una nuova modifica con proposta, specifiche e task.",
  },
  {
    command: "openspec validate <nome> --strict",
    description: "Controlla che il delta delle specifiche sia coerente.",
  },
  {
    command: "openspec archive <nome>",
    description: "Archivia la modifica dopo l'implementazione e l'aggiornamento delle specifiche.",
  },
];

export const aiSecurityPractices = [
  "Non inserire segreti, chiavi API o token nei prompt, nel codice o nei commit: usa variabili d'ambiente e un secret manager.",
  "Tratta i contenuti esterni come dati, non come istruzioni: un testo recuperato dal web o da un documento puo contenere prompt injection.",
  "Riduci al minimo i dati personali inviati al modello; anonimizza gli esempi e verifica le condizioni di conservazione del provider.",
  "Rivedi sempre il codice generato: controlla API inesistenti, dipendenze inventate, licenze e provenienza dei pacchetti.",
  "Limita i permessi dell'agente: esegui in ambienti controllati, approva i comandi distruttivi e revisiona il diff prima del merge.",
  "Non registrare prompt o risposte contenenti dati sensibili nei log applicativi.",
  "Mantieni aggiornati gli strumenti e le dipendenze; un agente che esegue comandi amplifica i rischi della supply chain.",
  "Per i casi d'uso in produzione, applica una policy aziendale su dati consentiti, modelli approvati e revisione umana.",
];

export const resources = [
  {
    label: "OpenCode",
    description: "Documentazione dell'agente di coding open source da terminale.",
    href: "https://opencode.ai/docs",
    category: "Strumenti",
  },
  {
    label: "OpenRouter",
    description: "API unificata, listino per modello, routing e documentazione.",
    href: "https://openrouter.ai/docs",
    category: "Strumenti",
  },
  {
    label: "AGENTS.md",
    description: "Specifica e buone pratiche per il file di istruzioni degli agenti.",
    href: "https://agents.md",
    category: "Agenti",
  },
  {
    label: "OpenSpec",
    description: "Framework leggero di spec-driven development per assistenti AI.",
    href: "https://openspec.dev",
    category: "Agenti",
  },
  {
    label: "OpenSpec su GitHub",
    description: "Codice sorgente, esempi e flusso di lavoro del progetto.",
    href: "https://github.com/Fission-AI/OpenSpec",
    category: "Agenti",
  },
  {
    label: "OWASP LLM Top 10",
    description: "Principali rischi di sicurezza delle applicazioni basate su modelli linguistici.",
    href: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
    category: "Sicurezza",
  },
  {
    label: "Prompt Engineering Guide",
    description: "Tecniche di prompting spiegate con esempi e riferimenti.",
    href: "https://www.promptingguide.ai",
    category: "Prompt",
  },
  {
    label: "Prompt engineering Anthropic",
    description: "Guida operativa a contesto, esempi, formati e valutazione dei prompt.",
    href: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview",
    category: "Prompt",
  },
];
