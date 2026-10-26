# DevSkillMap

Mappa interattiva delle competenze per lo sviluppo web full-stack. I nodi tecnologici sono disposti su un canvas React Flow, espandibili in gerarchie padre-figlio e arricchiti con descrizioni, best practice, convenzioni di naming, link di studio e approfondimenti strutturati. I dati sono persistiti su Supabase.

## Funzionalità

- Mappa interattiva con nodi espandibili e categorie `frontend`, `backend`, `database`.
- Dettaglio del nodo con relazioni padre/figlio, best practice e risorse esterne.
- Glossario con tooltip automatici sui termini presenti nei testi.
- Percorso guidato che illustra il ciclo di vita di una richiesta web.
- Pagine dedicate a linee guida e sicurezza.
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

## Requisiti

- Node.js `^20.19.0 || >=22.12.0`
- pnpm

## Setup

1. Installa le dipendenze:

   ```bash
   pnpm install
   ```

2. Crea il file di ambiente partendo dall'esempio:

   ```bash
   cp .env.example .env
   ```

   Su Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Compila `.env`:

   ```env
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-o-publishable-key>
   ```

4. Configura Supabase (vedi sezione successiva).

5. Avvia il server di sviluppo:

   ```bash
   pnpm dev
   ```

   L'app è disponibile su `http://localhost:5173`.

## Configurazione Supabase

1. Crea un progetto su [supabase.com](https://supabase.com).
2. Apri lo **SQL Editor** ed esegui i file nell'ordine:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/seed.sql`

   Il seed va eseguito una sola volta su un database vuoto.

3. In **Authentication > Providers** abilita Email/Password e disabilita la registrazione pubblica.
4. Crea l'utente amministratore da **Authentication > Users**.
5. Assegna il ruolo desiderato nella tabella `profiles`:

   ```sql
   update public.profiles
   set role = 'editor'
   where email = 'editor@example.com';
   ```

   Ruoli disponibili: `viewer` (lettura), `editor` (gestione contenuti), `admin` (gestione contenuti e profili a livello database).

## Script

| Comando | Descrizione |
| --- | --- |
| `pnpm dev` | Avvia Vite in modalità sviluppo con HMR. |
| `pnpm build` | Genera la build di produzione in `dist/`. |
| `pnpm preview` | Anteprima locale della build di produzione. |
| `pnpm lint` | Esegue ESLint su tutto il progetto. |

## Rotte

| Percorso | Pagina | Accesso |
| --- | --- | --- |
| `/` | Mappa delle competenze | Pubblico |
| `/linee-guida` | Linee guida | Pubblico |
| `/sicurezza` | Sicurezza | Pubblico |
| `/percorso-guidato` | Percorso guidato | Pubblico |
| `/login` | Accesso | Pubblico |
| `/admin` | Pannello editor | Editor/admin autenticati |

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

## Build e deploy

```bash
pnpm build
```

La build statica viene generata in `dist/`. Per un deploy SPA configura il fallback di tutte le rotte su `index.html`. Le variabili `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` devono essere presenti nell'ambiente di build.

## Note

- Il file `.env` è escluso dal repository: non committare chiavi o segreti.
- Attualmente non è presente una suite di test automatici.
