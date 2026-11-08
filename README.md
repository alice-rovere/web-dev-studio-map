# DevSkillMap

Mappa interattiva delle competenze per lo sviluppo web full-stack. I nodi tecnologici sono disposti su un canvas React Flow, espandibili in gerarchie padre-figlio e arricchiti con descrizioni, best practice, convenzioni di naming, link di studio e approfondimenti strutturati. I dati e i contenuti modificabili sono persistiti su Supabase.

## Funzionalità

- Mappa interattiva React Flow con nodi espandibili, relazioni padre-figlio e categorie `frontend`, `backend`, `database`, `devops` e `tools`.
- Ricerca di nodi e termini del glossario, con selezione rapida e navigazione da tastiera.
- Vista ad albero ottimizzata per dispositivi mobili.
- Dettaglio del nodo: click su un nodo per aprire il pannello e inquadrare il nodo e i suoi figli nello spazio libero della mappa, adattando lo zoom quando necessario (il resto della mappa si opacizza). Il click sullo sfondo non cambia la selezione; il pannello si chiude con X o Esc. Il pannello mostra padri e figli in un elenco espandibile e consultabile e il pulsante **Apri nodo** per l'approfondimento; i figli si aprono anche con il pulsante **+** del nodo.
- Approfondimenti per nodo organizzati in sezioni e blocchi di contenuto, con best practice e convenzioni di naming sempre visibili e modificabili dagli editor, collegamenti esterni richiudibili e un box dedicato ai nodi figli nella colonna sinistra, lasciando spazio a destra per i post-it.
- Nella pagina del nodo e nella scheda Contenuti dell'admin i blocchi supportati si modificano, aggiungono, riordinano o eliminano separatamente; l'eliminazione richiede conferma. Le liste esistenti restano consultabili ma non modificabili e non si possono aggiungere nuove liste. I blocchi di testo supportano grassetto, corsivo, sottolineatura, evidenziatore e dimensioni carattere. I precedenti blocchi Mermaid non sono più visualizzabili o modificabili, ma i loro dati rimangono salvati.
- Le lavagne Excalidraw nei nodi e nelle nuove griglie occupano tutta la larghezza disponibile. Gli elementi associati a una spiegazione si evidenziano al passaggio del mouse o al focus e aprono un riquadro con click, tocco o tastiera, opacizzando solo la lavagna; il riquadro si chiude anche con Esc.
- Appunti visivi: percorsi a step con diagrammi SVG animati e griglie esplorabili senza Play per i componenti del PC e per HTML, CSS e JavaScript.
- Glossario consultabile per iniziale o ricerca, con termini apribili in una modale, definizioni su più paragrafi e tooltip automatici con anteprima nei testi. Nella pagina knowledge è evidenziata solo la prima occorrenza di ogni termine: selezionandola si apre la definizione completa. Gli editor possono aggiungere termini anche dalla mappa e dalla pagina knowledge.
- Percorso guidato che illustra il ciclo di vita di una richiesta web.
- Pagine dedicate a linee guida e sicurezza.
- Pagina "AI nel Web Dev" con best practice per i prompt, gestione dei token, OpenRouter, `AGENTS.md`, OpenSpec, sicurezza e link utili (contenuti statici nel codice).
- Post-it personali associati alle pagine e ai nodi, salvati su Supabase.
- Pannello di amministrazione per editor/admin: ricerca gerarchica dei nodi con antenati, scorrimento automatico ai dettagli del nodo selezionato, relazioni, categorie, sezioni di contenuto e glossario.
- Creazione e modifica dei nodi con slug generato dal nome, categorie obbligatorie e salvataggio atomico di nodo, categorie e relazioni.
- Autenticazione Supabase con ruoli `viewer`, `editor`, `admin` e Row Level Security.
- Chat di studio per admin, nell'app locale e su Vercel, utilizzabile solo con il servizio Copilot in esecuzione sullo stesso computer. Questa prima versione risponde alle domande, ma non propone né salva modifiche.

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

In VS Code, installa l'estensione Tailwind CSS IntelliSense per il supporto alle direttive e alle classi Tailwind. L'impostazione del workspace disattiva gli avvisi `unknownAtRules` del validatore CSS integrato, anche per eventuali altre direttive sconosciute.

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

### Chat Copilot sul computer

La chat è disponibile solo per un utente Supabase con ruolo **admin**. L'app pubblicata su `https://web-dev-studio-map.vercel.app` può collegarsi al servizio soltanto sul computer su cui è aperto il browser: non è un servizio remoto e Vercel non riceve né esegue l'SDK. Per un altro dominio o una porta Vite diversa, occorre modificare esplicitamente le origini consentite in `scripts/chat-server-core.js`. Il browser può chiedere il permesso di accesso alla rete locale; alcuni browser potrebbero bloccare la connessione da una pagina HTTPS a loopback.

Prerequisiti: Node.js 20.19+ oppure 22.12+, `pnpm install`, GitHub CLI (`gh`) autenticata con un account che ha accesso a Copilot. Installa GitHub CLI seguendo la [guida ufficiale](https://github.com/cli/cli#installation), poi esegui `gh auth login` e `gh auth status`. Non incollare token nel progetto o nella chat. Il servizio recupera le credenziali tramite `gh` sul computer; la CLI e l'SDK sono necessari solo per il servizio locale. Se `gh` non è riconosciuto dopo l'installazione, riapri il terminale.

Imposta in `.env` l'URL e la chiave pubblica dello **stesso** progetto Supabase usato dall'app su Vercel, poi avvia:

```bash
pnpm chat:local
```

Il servizio ascolta solo su `127.0.0.1:43175`; lascialo aperto mentre usi la chat e premi **Ctrl+C** nel suo terminale per arrestarlo. Per l'app locale, avvia anche `pnpm dev` in un altro terminale. La mappa continua a funzionare anche con il servizio spento. Accedi all'app come admin, apri **Chat studio**, e consenti l'accesso alla rete locale se il browser lo richiede. Il servizio verifica ogni token Supabase e il ruolo admin tramite Supabase, senza chiave service-role; le origini e l'host sono verificati anche sul server.

Dopo un aggiornamento del progetto, riavvia il servizio locale per usare la versione aggiornata; se le dipendenze sono cambiate, esegui prima `pnpm install`.

**Quota e costi:** il servizio usa il modello Copilot `auto` e l'account di `gh`; le risposte consumano la quota e rispettano le impostazioni del piano. Le domande brevi e il contesto limitato possono ridurre il consumo, ma non garantiscono un costo specifico: ogni domanda può comportare più chiamate e la quota è condivisa con gli altri utilizzi Copilot. Come salvaguardia aggiuntiva, il servizio accetta al massimo **10 invii al giorno UTC**, uno alla volta e distanziati di almeno 10 secondi. Il contatore locale, senza messaggi, è in `~/.devskillmap-chat/quota.json`, persiste ai riavvii ed è incrementato prima della chiamata, anche se questa fallisce o viene annullata. Non misura i crediti reali né gli utilizzi su altri dispositivi. Per evitare spese aggiuntive, verifica su [GitHub Billing](https://github.com/settings/billing) un **Bundled AI credits budget** a 0 USD con **Stop usage when budget limit is reached** abilitato. Consulta anche i [prezzi dei modelli](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing).

**Dati inviati:** la modalità predefinita è generica: invia la domanda e fino a quattro messaggi precedenti, senza consultare né inviare la mappa. Attivando **Usa la mappa**, ogni invio include anche al massimo tre nodi e due percorsi selezionati per corrispondenza con la domanda o con il nodo aperto sulla mappa. Per i nodi si includono campi descrittivi, categorie, alcune relazioni e fino a tre sezioni; i contenuti sono troncati. L'interfaccia elenca le fonti effettivamente inviate e avvisa se non ne trova. Cambiando modalità, i messaggi precedenti rimangono visibili ma non vengono più inviati come cronologia, evitando di trasferire in modalità generica risposte basate sulla mappa. Il modello non può garantire che le sue risposte siano corrette: verificale. Non include automaticamente post-it o note personali; non inserire nella domanda dati che non vuoi inviare a Copilot. I contenuti della mappa e le risposte sono dati non attendibili. L'SDK è configurato senza tool, skill o scritture autonome e usa un filesystem di sessione in memoria; i messaggi dell'interfaccia restano in memoria fino a ricarica, logout o nuova conversazione. Le conversazioni e la memoria dell'IDE non sono importate.

Se la chat non risponde, verifica che il servizio sia aperto, che `gh auth status` sia autenticato, che il ruolo sia admin nel progetto Supabase corretto e che il browser consenta l'accesso locale; consulta eventuali errori nel terminale. In caso di limite locale attendi il giorno UTC successivo. Se Copilot segnala esaurimento della quota o un modello non disponibile, controlla il piano e le impostazioni su GitHub.

#### Prossimi passi per un agente AI

La chat attuale risponde alle domande e non modifica dati. La fase successiva è da progettare e verificare separatamente:

1. Aggiungere proposte strutturate e validate, modificabili dall'admin, per creare o aggiornare nodi e percorsi guidati; mostrare target, campi, relazioni e differenze rispetto ai dati correnti. Per proporre modifiche, raccogliere esplicitamente il contesto pertinente della mappa anche se la chat generica è predefinita.
2. Riutilizzare gli editor e i servizi esistenti, `validateNotebook` e i controlli grafici; ammettere solo illustrazioni già supportate, mai renderer o codice eseguibile generato dal modello. Trattare contesto e output come dati non attendibili.
3. Richiedere conferma esplicita prima di ogni salvataggio, impedire applicazioni ripetute e conservare la bozza in caso di errori o conflitti. Per i percorsi usare il controllo `updated_at` esistente; per i nodi introdurre una nuova migrazione RLS-compatibile con controllo atomico delle versioni e delle relazioni. Non presentare operazioni parzialmente riuscite come complete; ricaricare la mappa dopo il salvataggio.
4. Mantenere l'accesso admin verificato dal servizio locale, le restrizioni di origine, i limiti e l'isolamento delle sessioni. Aggiungere test simulati per output malformati, conferma, salvataggi, conflitti e interruzioni; verificare l'interfaccia desktop e mobile ed eseguire `pnpm test`, `pnpm lint` e `pnpm build`.

### Database e ruoli

Applica in ordine numerico tutte le migrazioni in `supabase/migrations/`. Per un database vuoto, esegui poi `supabase/seed.sql` una sola volta. Il seed contiene i dati iniziali e non va rieseguito su un database già popolato.

I ruoli sono gestiti nei profili Supabase: `viewer` può consultare i contenuti, `editor` e `admin` possono gestirli, inclusi i percorsi guidati. Il ruolo `admin` mantiene inoltre il permesso di gestire i profili secondo le policy RLS. L'accesso a `/admin` richiede un utente autenticato con ruolo editor o admin.

La migrazione `0007_atomic_node_save.sql` è necessaria per creare o modificare nodi dal pannello: salva i campi del nodo, le categorie e i padri in un'unica transazione, così un errore non lascia dati parziali. La creazione di un nodo aggiunge una voce alla mappa, non una nuova route o pagina; le sezioni di approfondimento si creano separatamente dalla scheda **Contenuti**. **Quick Add** aggiunge solo link a un nodo o all'inbox.

La migrazione `0008_internet_browser_notebook.sql` inserisce la teoria del nodo `internet-browser` se il nodo è già presente. Sostituisce solo le quattro sezioni originali riconosciute per titolo, salvandone una copia completa nella tabella protetta `internet_browser_section_backup`; le altre sezioni sono conservate. Se trova solo alcune sezioni originali o una teoria parziale, interrompe l'operazione: controlla i dati prima di riprovare. La copia è consultabile solo con privilegi amministrativi. Per un eventuale ripristino, confronta le righe salvate con i contenuti correnti e ripristina le sezioni desiderate da un backup del database con un amministratore, evitando di sovrascrivere modifiche successive.

Su un'installazione nuova le migrazioni possono precedere la creazione di `internet-browser`: dopo aver applicato le migrazioni e il seed, lo script `supabase/roadmaps/01_frontend.sql` crea il nodo e richiama l'installazione della teoria. Lo script roadmap elimina e ricrea sezioni anche di altri nodi: non rieseguirlo su un database già popolato. Se il nodo viene creato successivamente con un'altra procedura, esegui `select public.install_internet_browser_theory();` come amministratore. La funzione non è esposta ai client.

Le migrazioni `0009_guided_notebooks.sql` e `0010_seed_guided_notebooks.sql` sono necessarie per consultare e gestire i percorsi guidati. La migrazione `0011_guided_notebooks_editor_access.sql` estende la gestione ai ruoli editor e admin anche tramite RLS e va applicata prima di distribuire la relativa versione dell'app. Il catalogo resta pubblico. I tre percorsi originali sono copiati senza modificare gli URL; se i nodi corrispondenti non esistono ancora, vengono collegati alla loro successiva creazione, salvo scelta diversa dell'editor. Eliminare un nodo non elimina il percorso. `scripts/generate-notebook-migration.js` documenta come sono stati generati i dati originali: non rigenerare una migrazione già applicata per apportare modifiche successive.

La migrazione `0012_seed_dentro_il_pc.sql` aggiunge il percorso originale **Dentro il PC**. La successiva `0013_separa_percorsi_pc.sql` lo sostituisce con il percorso sui componenti fisici e aggiunge **Sistema operativo, kernel e driver**. Entrambi sono consultabili anche senza nodo associato e possono collegarsi a un nodo con lo stesso slug. Se il contenuto originale è stato modificato, la migrazione 0013 si interrompe senza sovrascriverlo: confronta i dati e risolvi il conflitto prima di applicarla. Anche un percorso `sistema-operativo` preesistente con contenuto diverso blocca la migrazione.

La migrazione `0014_seed_linguaggi_programmazione.sql` aggiunge il percorso **Linguaggi di programmazione** e lo collega a `backend-languages` quando il nodo è presente; in caso contrario resta consultabile e in attesa del collegamento.

La migrazione `0015_visual_grids.sql` crea le griglie visive con lettura pubblica e modifica riservata a editor/admin. Prima di applicarla **esegui un backup del database**: trasferisce la versione corrente di «Dentro il PC» (compresi pannelli e collegamento al nodo) in una griglia ed elimina il vecchio percorso. Mantiene anche la configurazione originale nella griglia per non perdere metadati; il vecchio URL pubblico viene reindirizzato e lo slug `dentro-il-pc` è riservato alla griglia. Se i passaggi o i pannelli personalizzati non possono essere rappresentati, la migrazione si interrompe: confronta e trasferisci quei contenuti prima di riprovare, senza eliminare il percorso manualmente. Crea inoltre la griglia «La pagina web». Applica la migrazione prima di pubblicare la nuova versione dell'app.

La migrazione `0016_excalidraw_grids.sql` abilita la creazione delle griglie Excalidraw nel catalogo; non modifica le griglie esistenti. Va applicata prima di distribuire la versione dell'app che le crea.

I blocchi rimangono nel JSON della rispettiva sezione; il salvataggio verifica `updated_at` per evitare di sovrascrivere cambiamenti avvenuti in un'altra scheda. In caso di conflitto la bozza rimane nell'editor: si possono aggiornare i dati senza perderla e, se il blocco interessato non è cambiato, riprovare il salvataggio. Se invece è cambiato, confrontare e copiare la bozza prima di annullare. Le immagini già salvate non vengono eliminate automaticamente dallo storage quando si rimuove o sostituisce un blocco, perché potrebbero essere ancora utilizzate altrove.

## Script

| Comando        | Descrizione                                 |
| -------------- | ------------------------------------------- |
| `pnpm dev`     | Avvia Vite in modalità sviluppo con HMR.    |
| `pnpm build`   | Genera la build di produzione in `dist/`.   |
| `pnpm preview` | Anteprima locale della build di produzione. |
| `pnpm lint`    | Esegue ESLint su tutto il progetto.         |
| `pnpm test`    | Esegue tutti i test con il runner integrato di Node.js. |

## Rotte

| Percorso            | Pagina                 | Accesso                  |
| ------------------- | ---------------------- | ------------------------ |
| `/`                 | Mappa delle competenze | Pubblico                 |
| `/linee-guida`      | Linee guida            | Pubblico                 |
| `/sicurezza`        | Sicurezza              | Pubblico                 |
| `/ai-web-dev`       | AI nel Web Dev         | Pubblico                 |
| `/percorso-guidato` | Catalogo appunti visivi | Pubblico                |
| `/glossario`        | Glossario              | Pubblico                 |
| `/login`            | Accesso                | Pubblico                 |
| `/admin`            | Pannello editor        | Editor/admin autenticati |
| `/quick-add`        | Aggiunta rapida link   | Editor/admin autenticati |
| `/notebook/:slug`   | Percorso a step        | Pubblico                 |
| `/griglia/:slug`    | Griglia esplorabile    | Pubblico                 |
| `/admin/griglie/nuova` | Nuova griglia       | Editor/admin autenticati |
| `/admin/griglie/:slug/modifica` | Modifica griglia | Editor/admin autenticati |
| `/admin/percorsi/nuovo` | Nuovo percorso     | Editor/admin autenticati |
| `/admin/percorsi/:slug/modifica` | Modifica percorso | Editor/admin autenticati |

### Appunti visivi

Dalla pagina di approfondimento di un nodo con un notebook associato compare il pulsante **Apri Appunti Visivi**, che apre `/notebook/:slug` a schermo intero (frecce ←/→ per gli step, Esc per chiudere).

Nel nodo **Internet & Browser** il pulsante è disponibile sia in cima alla pagina sia dopo le sezioni teoriche; il diagramma distingue il percorso di rete dalla pipeline di rendering.

La voce **Appunti visivi** mostra un unico catalogo con sezioni distinte per percorsi guidati e griglie esplorabili. Ogni risorsa può essere collegata a un nodo; un nodo può offrire sia un percorso sia una o più griglie.

Le griglie **Dentro il PC** e **La pagina web** consentono di selezionare un componente nello schema o nell'elenco e leggere spiegazione e pannelli, senza progressione né Play. La selezione funziona con mouse, tocco e tastiera; lo schema del PC evidenzia i collegamenti e rispetta la preferenza di movimento ridotto. Non richiedono WebGL. **Sistema operativo, kernel e driver** rimane un percorso a step.

Il percorso **Linguaggi di programmazione** segue il codice sorgente attraverso compilazione nativa, bytecode e runtime fino alle istruzioni della CPU, chiarendo dove queste strategie si sovrappongono. Lo schema evidenzia la strada del passaggio corrente; sugli schermi stretti si può scorrere in orizzontale per confrontare le tre colonne.

Gli editor e gli admin possono creare percorsi dal catalogo o dalla scheda **Appunti visivi** nel pannello admin; la scheda permette anche di modificarli ed eliminarli. Il form gestisce titolo, descrizione, nodo facoltativo, fasi, icone, passaggi e pannelli di testo, codice e tabella, con anteprima prima del salvataggio. Lo slug è scelto alla creazione e rimane stabile; ogni nodo può avere al massimo un percorso associato. Il salvataggio rende immediatamente pubblico il percorso e verifica che non sia stato modificato contemporaneamente altrove.

Dalle schede delle griglie e dal pannello admin gli editor possono modificare titolo, sottotitolo, descrizione, nodo, spiegazioni e pannelli dei componenti esistenti. Si possono aggiungere pannelli di testo e codice e modificare le celle delle tabelle già presenti. Il salvataggio è immediatamente pubblico e verifica la versione per evitare sovrascritture; in caso di conflitto la bozza rimane nell'editor, quindi copiala prima di ricaricare. Gli schemi personalizzati PC e pagina web restano invariati e i loro disegni si modificano nel codice.

Per creare una griglia libera scegli **Nuova griglia**, apri la lavagna Excalidraw e disegna. Seleziona una singola forma e inserisci titolo e spiegazione nel pannello; ripeti per gli altri elementi, premi **Applica** e poi **Salva**. La stessa funzione è disponibile nei blocchi **Lavagna** dei nodi. In consultazione, lo spazio accanto alla lavagna è riservato alle spiegazioni e invita a selezionare un elemento; su schermi stretti si trova sotto il disegno. Puoi chiudere la spiegazione o selezionare un altro elemento senza ridimensionare il disegno. Le aree cliccabili sono rettangoli invisibili attorno agli elementi: se si sovrappongono, usa Tab per raggiungerle e Invio o Spazio per selezionarle. Il contorno appare solo quando un elemento riceve il focus da tastiera. Le lavagne precedenti continuano a funzionare senza spiegazioni. Se elimini una forma associata, alla conferma della lavagna viene chiesto se eliminare anche la spiegazione; duplicare una forma non duplica l'associazione. Disegni, immagini incorporate e spiegazioni sono salvati nel JSON su Supabase; usa immagini di dimensioni contenute.

Per i nuovi passaggi si può scegliere uno schema generico delle fasi con icone predefinite o nessuna illustrazione. Le scene originali dei percorsi con diagrammi personalizzati restano disponibili sui rispettivi passaggi: sono componenti React legati ai loro identificativi, non disegni personalizzabili dal form. Nuove scene su misura richiedono codice. Le configurazioni in `src/notebooks/configs/` e il registry conservano i dati sorgente delle migrazioni e i riferimenti alle scene originali, non sono il catalogo usato dall'app.

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
- `pnpm test` esegue tutti i file `*.test.js` con il runner integrato di Node.js.
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
