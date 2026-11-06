# DevSkillMap

Mappa interattiva delle competenze per lo sviluppo web full-stack. I nodi tecnologici sono disposti su un canvas React Flow, espandibili in gerarchie padre-figlio e arricchiti con descrizioni, best practice, convenzioni di naming, link di studio e approfondimenti strutturati. I dati e i contenuti modificabili sono persistiti su Supabase.

## Funzionalità

- Mappa interattiva React Flow con nodi espandibili, relazioni padre-figlio e categorie `frontend`, `backend`, `database`, `devops` e `tools`.
- Ricerca di nodi e termini del glossario, con selezione rapida e navigazione da tastiera.
- Vista ad albero ottimizzata per dispositivi mobili.
- Dettaglio del nodo: click su un nodo per zoomare e aprire in automatico il pannello (il resto della mappa si opacizza), con padri e figli in un elenco espandibile e consultabile e il pulsante **Apri nodo** per l'approfondimento; i figli si aprono anche con il pulsante **+** del nodo.
- Approfondimenti per nodo organizzati in sezioni e blocchi di contenuto, con best practice e convenzioni di naming sempre visibili e modificabili dagli editor, collegamenti esterni richiudibili e un box dedicato ai nodi figli nella colonna sinistra, lasciando spazio a destra per i post-it.
- Nella pagina del nodo e nella scheda Contenuti dell'admin ogni blocco supportato si modifica, aggiunge, riordina o elimina separatamente; l'eliminazione richiede conferma. I blocchi di testo supportano grassetto, corsivo, sottolineatura, evidenziatore e dimensioni carattere. I precedenti blocchi Mermaid non sono più visualizzabili o modificabili, ma i loro dati rimangono salvati.
- Appunti Visivi a step, con diagrammi SVG animati per il flusso di Prisma ORM e per il percorso dalla URL al rendering del browser. Il nodo Internet & Browser include anche teoria su Internet, Web, protocolli e browser.
- Glossario consultabile per iniziale o ricerca, con termini apribili in una modale, definizioni su più paragrafi e tooltip automatici con anteprima nei testi. Nella pagina knowledge è evidenziata solo la prima occorrenza di ogni termine: selezionandola si apre la definizione completa. Gli editor possono aggiungere termini anche dalla mappa e dalla pagina knowledge.
- Percorso guidato che illustra il ciclo di vita di una richiesta web.
- Pagine dedicate a linee guida e sicurezza.
- Pagina "AI nel Web Dev" con best practice per i prompt, gestione dei token, OpenCode/OpenRouter, `AGENTS.md`, OpenSpec, sicurezza e link utili (contenuti statici nel codice).
- Post-it personali associati alle pagine e ai nodi, salvati su Supabase.
- Pannello di amministrazione per editor/admin: ricerca gerarchica dei nodi con antenati, scorrimento automatico ai dettagli del nodo selezionato, relazioni, categorie, sezioni di contenuto e glossario.
- Creazione e modifica dei nodi con slug generato dal nome, categorie obbligatorie e salvataggio atomico di nodo, categorie e relazioni.
- Autenticazione Supabase con ruoli `viewer`, `editor`, `admin` e Row Level Security.

## Stack

- React 19 + Vite 8
- Tailwind CSS 4
- React Flow (`@xyflow/react`)
- React Router
- Supabase (`@supabase/supabase-js`)
- Radix UI (dialog e tooltip)
- Lucide React (icone)

## Configurazione Supabase

### Avvio in locale

Prerequisiti: Node.js e pnpm.

```bash
pnpm install
pnpm dev
```

Per collegare l'app a Supabase, copia `.env.example` in `.env` e imposta i valori del tuo progetto:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Vite legge le variabili con prefisso `VITE_` nel browser. Usa solo la chiave anon/publishable: non inserire mai chiavi `service_role` o altri segreti in variabili `VITE_*`.

### Database e ruoli

Applica in ordine numerico tutte le migrazioni in `supabase/migrations/`. Per un database vuoto, esegui poi `supabase/seed.sql` una sola volta. Il seed contiene i dati iniziali e non va rieseguito su un database già popolato.

I ruoli sono gestiti nei profili Supabase: `viewer` può consultare i contenuti, `editor` può gestirli e `admin` può inoltre gestire i profili secondo le policy RLS. L'accesso editor/admin a `/admin` richiede un utente autenticato con il ruolo corrispondente.

La migrazione `0007_atomic_node_save.sql` è necessaria per creare o modificare nodi dal pannello: salva i campi del nodo, le categorie e i padri in un'unica transazione, così un errore non lascia dati parziali. La creazione di un nodo aggiunge una voce alla mappa, non una nuova route o pagina; le sezioni di approfondimento si creano separatamente dalla scheda **Contenuti**. **Quick Add** aggiunge solo link a un nodo o all'inbox.

La migrazione `0008_internet_browser_notebook.sql` inserisce la teoria del nodo `internet-browser` se il nodo è già presente. Sostituisce solo le quattro sezioni originali riconosciute per titolo, salvandone una copia completa nella tabella protetta `internet_browser_section_backup`; le altre sezioni sono conservate. Se trova solo alcune sezioni originali o una teoria parziale, interrompe l'operazione: controlla i dati prima di riprovare. La copia è consultabile solo con privilegi amministrativi. Per un eventuale ripristino, confronta le righe salvate con i contenuti correnti e ripristina le sezioni desiderate da un backup del database con un amministratore, evitando di sovrascrivere modifiche successive.

Su un'installazione nuova le migrazioni possono precedere la creazione di `internet-browser`: dopo aver applicato le migrazioni e il seed, lo script `supabase/roadmaps/01_frontend.sql` crea il nodo e richiama l'installazione della teoria. Lo script roadmap elimina e ricrea sezioni anche di altri nodi: non rieseguirlo su un database già popolato. Se il nodo viene creato successivamente con un'altra procedura, esegui `select public.install_internet_browser_theory();` come amministratore. La funzione non è esposta ai client.

I blocchi rimangono nel JSON della rispettiva sezione; il salvataggio verifica `updated_at` per evitare di sovrascrivere cambiamenti avvenuti in un'altra scheda. In caso di conflitto la bozza rimane nell'editor: si possono aggiornare i dati senza perderla e, se il blocco interessato non è cambiato, riprovare il salvataggio. Se invece è cambiato, confrontare e copiare la bozza prima di annullare. Le immagini già salvate non vengono eliminate automaticamente dallo storage quando si rimuove o sostituisce un blocco, perché potrebbero essere ancora utilizzate altrove.

## Script

| Comando        | Descrizione                                 |
| -------------- | ------------------------------------------- |
| `pnpm dev`     | Avvia Vite in modalità sviluppo con HMR.    |
| `pnpm build`   | Genera la build di produzione in `dist/`.   |
| `pnpm preview` | Anteprima locale della build di produzione. |
| `pnpm lint`    | Esegue ESLint su tutto il progetto.         |

Per eseguire le verifiche mirate sui blocchi, sul testo formattato e sui conflitti:

```bash
node --test src/components/content/sectionBlocks.test.js src/components/content/ContentSectionView.test.js src/components/content/blocks/RichTextBlock.test.js src/services/mapService.test.js src/notebooks/internetBrowserConfig.test.js
```

## Rotte

| Percorso            | Pagina                 | Accesso                  |
| ------------------- | ---------------------- | ------------------------ |
| `/`                 | Mappa delle competenze | Pubblico                 |
| `/linee-guida`      | Linee guida            | Pubblico                 |
| `/sicurezza`        | Sicurezza              | Pubblico                 |
| `/ai-web-dev`       | AI nel Web Dev         | Pubblico                 |
| `/percorso-guidato` | Percorso guidato       | Pubblico                 |
| `/glossario`        | Glossario              | Pubblico                 |
| `/login`            | Accesso                | Pubblico                 |
| `/admin`            | Pannello editor        | Editor/admin autenticati |
| `/quick-add`        | Aggiunta rapida link   | Editor/admin autenticati |
| `/notebook/:slug`   | Appunti Visivi         | Pubblico                 |

### Appunti Visivi (simulazioni a step)

Dalla pagina di approfondimento di un nodo con un notebook associato compare il pulsante **Apri Appunti Visivi**, che apre `/notebook/:slug` a schermo intero (frecce ←/→ per gli step, Esc per chiudere). Per aggiungerne uno:

Nel nodo **Internet & Browser** il pulsante è disponibile sia in cima alla pagina sia dopo le sezioni teoriche; il diagramma distingue il percorso di rete dalla pipeline di rendering.

1. Crea `src/notebooks/configs/<nome>Config.js` con config JSON pura: `{ slug, title, subtitle, phases, steps }` (esempio: `prismaFlowConfig.js`). Ogni step ha `phase`, `title`, `description` e `panels` di tipo `code`, `table` o `text`; il campo facoltativo `illustration` seleziona una scena SVG registrata nel layout.
2. Registra lo slug in `src/notebooks/registry.js`. Lo slug deve coincidere con lo `slug` del nodo.

Le icone dei nodi vivono in `src/notebooks/icons/` (un file `.jsx` per nodo, registrato per slug in `index.js`) e sono usate sia dalla mappa (desktop e mobile) sia dai visualizer. I nodi senza icona registrata non ne mostrano alcuna.

Il nodo `prisma-orm` richiede la migrazione `0006_prisma_orm_node.sql`.

### App installabile e Quick Add (Android)

L'app è una PWA: da Chrome su Android scegli **Installa app**. Tenendo premuta l'icona compare lo shortcut **Quick Add**, e la voce **Quick Add** della navbar (editor/admin) mostra il numero di link in inbox. Una volta installata compare nel menu **Condividi** (ad esempio da Instagram o dal browser): condividendo un link si apre `/quick-add` con l'URL precompilato. Scegli il nodo (ricerca o usati di recente) e salva il link nei suoi collegamenti di studio, oppure salvalo nell'inbox e assegnalo dopo. L'inbox richiede la migrazione `0005_inbox_links.sql`. Lo Share Target funziona solo in HTTPS (deploy Vercel) e non è supportato su iOS.

## Struttura del progetto

```text
src/
├── components/          # Componenti organizzati per area funzionale
│   ├── admin/           # Gestione nodi, albero e glossario
│   ├── auth/            # Controllo accesso editor
│   ├── content/         # Sezioni di approfondimento e blocchi
│   ├── glossary/        # Glossario e dialoghi di inserimento
│   ├── navigation/      # Navbar e navigazione tra pagine
│   ├── notes/           # Canvas dei post-it
│   ├── notebook/        # Layout e diagrammi degli appunti visivi
│   └── skill-map/       # Ricerca, albero mobile e dettagli dei nodi
├── context/             # Provider globali di autenticazione e glossario
├── data/                # Categorie, dati e percorso guidato
├── flow/                # Nodi React Flow e utilità per il grafo
├── hooks/               # Hook per auth, glossario, mappa e post-it
├── pages/               # Pagine applicative e viste di contenuto
├── services/            # Client Supabase e accesso ai dati
├── App.jsx              # Router e provider globali
├── index.css            # Tailwind e stili globali
└── main.jsx             # Entry point
supabase/
├── migrations/          # Schema, trigger, storage e policy RLS
├── roadmaps/            # Script SQL per popolare i nodi per categoria
└── seed.sql             # Dati iniziali per un database vuoto
```

## Deploy su Vercel

1. Pubblica il repository su GitHub e accedi a [Vercel](https://vercel.com/).
2. Seleziona **Add New... > Project**, importa `alice-rovere/web-dev-studio-map` e lascia che Vercel rilevi Vite.
3. Imposta queste variabili in **Settings > Environment Variables**, almeno per l'ambiente **Production** (e anche **Preview** se vuoi provare i deploy di anteprima):

   | Nome                     | Valore                                                             |
   | ------------------------ | ------------------------------------------------------------------ |
   | `VITE_SUPABASE_URL`      | Lo stesso URL già usato nel file `.env` locale                     |
   | `VITE_SUPABASE_ANON_KEY` | La stessa chiave anon/publishable già usata nel file `.env` locale |

   Sono valori pubblici usati dal browser. Non inserire mai una chiave `service_role` o altri segreti nelle variabili `VITE_*`.

4. Fai clic su **Deploy**. Vercel esegue `pnpm build` e pubblica la cartella `dist/`; `vercel.json` inoltra le rotte dell'app a `index.html`, così anche URL come `/login` e `/admin` funzionano se aperti direttamente.
5. Dopo il primo deploy, copia il dominio assegnato (ad esempio `https://<nome-progetto>.vercel.app`) nelle impostazioni Supabase:
   - In **Authentication > URL Configuration**, imposta **Site URL** sul dominio di produzione e aggiungi il dominio tra i **Redirect URLs**. Se usi anteprime Vercel, aggiungi anche i relativi URL di anteprima necessari.
   - In **Authentication > Providers > Email**, lascia disabilitata la registrazione pubblica se vuoi consentire l'accesso solo agli utenti creati da te.
6. Verifica il sito pubblico, l'accesso con l'utente esistente e le operazioni previste per i suoi permessi. Il progetto Supabase, i dati e le policy RLS restano gli stessi; non eseguire di nuovo il seed sul database esistente.

Ogni push sul branch collegato a Production avvia un nuovo deploy. Le modifiche alle variabili d'ambiente richiedono un nuovo deploy per essere incluse nella build client.

Per verificare la build in locale prima della pubblicazione:

```bash
pnpm build
```

## Note

- Il file `.env` è escluso dal repository: non committare chiavi o segreti.
- Attualmente non è presente una suite di test automatici.
- Prima di modificare schema o policy Supabase, crea una nuova migrazione e verifica che sia compatibile con i dati già presenti.

## Sistema Sticky Notes (Memo Fluttuanti)

Il progetto include un sistema centralizzato di post-it fluttuanti, trascinabili e ridimensionabili in puro JavaScript/JSX, integrato nativamente con il tema scuro del progetto e persistito su Supabase.

### Architettura e Componenti

- **`src/hooks/useStickyNotes.js`**: Gestisce lo stato ottimistico locale e sincronizza le operazioni CRUD su Supabase (`select`, `insert`, `update`, `delete`).
- **`src/components/notes/StickyNotesCanvas.jsx`**: Canvas invisibile che intercetta i movimenti del mouse, gestisce il riposizionamento in primo piano al click (`z-index`) e renderizza il pulsante fluttuante unificato in basso a destra.

### Sicurezza (Row Level Security)

La tabella `public.sticky_notes` è protetta da politiche RLS su Supabase. Ogni utente autenticato può interagire ed editare **esclusivamente i propri post-it**, garantendo la totale privacy degli appunti di studio.

### Come utilizzarlo in una nuova pagina

Per abilitare i post-it fluttuanti in una rotta o in un componente, segui questi due passaggi:

1. Assicurati che il contenitore principale della pagina abbia la classe Tailwind `relative` (necessaria per calcolare correttamente le coordinate assolute dei post-it).
2. Importa `StickyNotesCanvas` e istanzialo passandogli un `boardId` testuale **univoco** a tua scelta.

#### Esempio pratico:

```jsx
import React from "react";
import { StickyNotesCanvas } from "../components/notes/StickyNotesCanvas";

export default function NuovaPaginaStudio() {
  return (
    // 1. Il tag radice DEVE essere "relative"
    <section className="relative h-full w-full bg-slate-950 text-slate-100 p-6 overflow-y-auto">
      {/* 2. Inietta il canvas inventando un boardId univoco per questa vista */}
      <StickyNotesCanvas boardId="page-nuovo-argomento" />

      {/* Contenuto standard della pagina */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold">Nuovo Argomento di Studio</h2>
        <p className="text-slate-400">Contenuto didattico...</p>
      </div>
    </section>
  );
}
```

### Convenzioni Naming per `boardId`

| Ambito di Utilizzo              | Formato Consigliato   | Esempio                                  |
| ------------------------------- | --------------------- | ---------------------------------------- |
| Pagine statiche / Rotte globali | `page-<nome-pagina>`  | `"page-sicurezza"`, `"page-linee-guida"` |
| Schede di dettaglio nodi mappa  | `node-<id-nodo-flow>` | `"node-react-19"`, `"node-supabase-db"`  |
