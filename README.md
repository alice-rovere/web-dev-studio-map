# DevSkillMap

Mappa interattiva delle competenze per lo sviluppo web full-stack. I nodi tecnologici sono disposti su un canvas React Flow, espandibili in gerarchie padre-figlio e arricchiti con descrizioni, best practice, convenzioni di naming, link di studio e approfondimenti strutturati. I dati sono persistiti su Supabase.

## Funzionalità

- Mappa interattiva con nodi espandibili, accesso diretto agli approfondimenti e categorie `frontend`, `backend`, `database`.
- Dettaglio del nodo con relazioni padre/figlio, best practice e risorse esterne.
- Glossario con tooltip automatici sui termini presenti nei testi.
- Percorso guidato che illustra il ciclo di vita di una richiesta web.
- Pagine dedicate a linee guida e sicurezza.
- Pagina "AI nel Web Dev" con best practice per i prompt, gestione dei token, OpenCode/OpenRouter, `AGENTS.md`, OpenSpec, sicurezza e link utili (contenuti statici nel codice).
- Pannello di amministrazione per editor/admin: nodi, relazioni, categorie, sezioni di contenuto e glossario.
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

Ruoli disponibili: `viewer` (lettura), `editor` (gestione contenuti), `admin` (gestione contenuti e profili a livello database).

## Script

| Comando        | Descrizione                                 |
| -------------- | ------------------------------------------- |
| `pnpm dev`     | Avvia Vite in modalità sviluppo con HMR.    |
| `pnpm build`   | Genera la build di produzione in `dist/`.   |
| `pnpm preview` | Anteprima locale della build di produzione. |
| `pnpm lint`    | Esegue ESLint su tutto il progetto.         |

## Rotte

| Percorso            | Pagina                 | Accesso                  |
| ------------------- | ---------------------- | ------------------------ |
| `/`                 | Mappa delle competenze | Pubblico                 |
| `/linee-guida`      | Linee guida            | Pubblico                 |
| `/sicurezza`        | Sicurezza              | Pubblico                 |
| `/percorso-guidato` | Percorso guidato       | Pubblico                 |
| `/login`            | Accesso                | Pubblico                 |
| `/admin`            | Pannello editor        | Editor/admin autenticati |

## Struttura del progetto

```text
src/
├── components/          # UI generica, modali, glossario e viste contenuto
│   └── admin/           # Gestione nodi, albero e glossario
├── context/             # Auth e glossario globali
├── data/                # Configurazione nodi, categorie e percorso guidato
├── flow/                # Nodi React Flow e algoritmi di layout
│   ├── nodes/
│   └── utils/
├── hooks/               # useAuth, useGlossary, useMapGraph
├── pages/               # SkillMap, Admin, Login, contenuti e percorso
├── services/            # Client Supabase e chiamate CRUD
├── App.jsx              # Router e provider globali
├── index.css            # Tailwind e stili React Flow
└── main.jsx             # Entry point
supabase/
├── migrations/          # Schema, trigger e policy RLS
└── seed.sql             # Dati iniziali
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

## Sistema Sticky Notes (Memo Fluttuanti)

Il progetto include un sistema centralizzato di post-it fluttuanti, trascinabili e ridimensionabili in puro JavaScript/JSX, integrato nativamente con il tema scuro del progetto e persistito su Supabase.

### Architettura e Componenti

- **`src/hooks/useStickyNotes.js`**: Gestisce lo stato ottimistico locale e sincronizza le operazioni CRUD su Supabase (`select`, `insert`, `update`, `delete`).
- **`src/components/StickyNotesCanvas.jsx`**: Canvas invisibile che intercetta i movimenti del mouse, gestisce il riposizionamento in primo piano al click (`z-index`) e renderizza il pulsante fluttuante unificato in basso a destra.

### Sicurezza (Row Level Security)

La tabella `public.sticky_notes` è protetta da politiche RLS su Supabase. Ogni utente autenticato può interagire ed editare **esclusivamente i propri post-it**, garantendo la totale privacy degli appunti di studio.

### Come utilizzarlo in una nuova pagina

Per abilitare i post-it fluttuanti in una rotta o in un componente, segui questi due passaggi:

1. Assicurati che il contenitore principale della pagina abbia la classe Tailwind `relative` (necessaria per calcolare correttamente le coordinate assolute dei post-it).
2. Importa `StickyNotesCanvas` e istanzialo passandogli un `boardId` testuale **univoco** a tua scelta.

#### Esempio pratico:

```jsx
import React from "react";
import { StickyNotesCanvas } from "../components/StickyNotesCanvas";

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

# Da implementare

Funzionalità di cerca nodo !
Collegamento file Percorso Guidato con i nodi reali nel database
Media Queries per mobile css
