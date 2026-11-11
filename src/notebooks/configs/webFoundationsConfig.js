const config = {
  slug: "web-foundations",
  title: "Professioni e infrastruttura del Web",
  subtitle: "Dalle persone che costruiscono il Web ai server che lo fanno funzionare",
  phases: [
    { id: "ruoli", label: "Professioni", hint: "Competenze e collaborazione", icon: "users" },
    { id: "server", label: "Server", hint: "Hardware e software", icon: "server" },
    { id: "datacenter", label: "Server farm", hint: "Infrastrutture affidabili", icon: "hard-drive" },
    { id: "scalabilita", label: "Scalabilità", hint: "Distribuire le richieste", icon: "network" },
    { id: "cloud", label: "Cloud", hint: "Modelli di servizio", icon: "cloud" },
  ],
  steps: [
    {
      id: "ruoli-web",
      phase: "ruoli",
      title: "Le figure professionali del Web",
      description:
        "Un prodotto Web coinvolge competenze diverse. I nomi dei ruoli non sono titoli rigidi: nelle aziende più piccole una persona può coprire più aree, mentre nei team grandi le responsabilità sono più specializzate.",
      panels: [
        {
          kind: "table",
          label: "Competenze e responsabilità",
          columns: ["Ruolo", "Attività principale"],
          rows: [
            ["Frontend developer", "Costruisce l'interfaccia nel browser, gestisce interazioni, accessibilità e collegamento alle API."],
            ["Backend developer", "Implementa API, regole applicative, autenticazione e accesso ai dati lato server."],
            ["Full-stack developer", "Lavora sia sul frontend sia sul backend; la profondità delle competenze varia da progetto a progetto."],
            ["Web designer / UI designer", "Progetta struttura visiva, flussi e componenti dell'interfaccia; può realizzare prototipi e design system."],
            ["UX designer / researcher", "Studia bisogni e usabilità, organizza i flussi e verifica l'esperienza con le persone."],
            ["3D / WebGL developer", "Realizza esperienze tridimensionali nel browser con WebGL e librerie come Three.js."],
            ["QA / software tester", "Progetta verifiche manuali e automatiche per individuare regressioni e comportamenti errati."],
            ["DevOps / cloud engineer", "Automatizza build e rilasci e cura infrastruttura, monitoraggio, disponibilità e costi."],
            ["Sistemista / system administrator", "Configura e mantiene sistemi operativi, reti, account, aggiornamenti e servizi."],
          ],
        },
      ],
    },
    {
      id: "lavoro-di-squadra",
      phase: "ruoli",
      title: "Come collaborano in un progetto",
      description:
        "I ruoli si coordinano durante tutto il ciclo di vita: si chiariscono obiettivi e requisiti, si progetta l'esperienza, si implementano interfaccia e servizi, si verifica il risultato e si distribuisce l'applicazione. Le responsabilità possono sovrapporsi e cambiano in base al contesto.",
      panels: [
        {
          kind: "text",
          label: "Un esempio",
          content:
            "Designer e team definiscono un flusso di acquisto accessibile.\nFrontend realizza le schermate e dialoga con le API.\nBackend valida l'ordine e salva i dati.\nQA verifica i casi riusciti e gli errori.\nDevOps cura il rilascio e il monitoraggio.",
        },
      ],
    },
    {
      id: "server-software-hardware",
      phase: "server",
      title: "Server: il ruolo e il computer",
      description:
        "Server descrive prima di tutto una funzione: un sistema che offre un servizio e risponde alle richieste di altri sistemi, i client. Può essere un computer fisico, una macchina virtuale o un ambiente cloud. Il web server è invece un software che riceve richieste HTTP; l'applicazione e il database possono essere processi o servizi distinti.",
      panels: [
        {
          kind: "table",
          label: "Non confondere i termini",
          columns: ["Termine", "Che cos'è", "Esempio"],
          rows: [
            ["Server (ruolo)", "Sistema che offre un servizio a uno o più client.", "Un computer che ospita un sito."],
            ["Server fisico", "Computer con CPU, RAM, archiviazione, rete e alimentazione.", "Una macchina installata in un data center."],
            ["Web server (software)", "Programma che riceve richieste HTTP e può servire file o inoltrare richieste.", "Nginx, Apache o Caddy."],
            ["Server applicativo", "Processo che esegue le regole e la logica dell'applicazione.", "Un servizio Node.js con Express."],
          ],
        },
        {
          kind: "text",
          label: "Da ricordare",
          content:
            "Un normale computer può svolgere il ruolo di server. In produzione si scelgono sistemi e configurazioni adatti al carico, agli aggiornamenti, alla protezione dei dati e alla continuità del servizio.",
        },
      ],
    },
    {
      id: "server-farm-datacenter",
      phase: "datacenter",
      title: "Data center e server farm",
      description:
        "Un data center è una struttura progettata per ospitare sistemi informatici e apparati di rete. Una server farm è un insieme di server coordinati: permette di distribuire il lavoro, gestire guasti e servire più richieste rispetto a una singola macchina.",
      panels: [
        {
          kind: "table",
          label: "Cosa serve oltre ai computer",
          columns: ["Componente", "Funzione"],
          rows: [
            ["Rack e server", "Ospitano e organizzano le macchine fisiche."],
            ["Switch e router", "Collegano server, reti interne e Internet."],
            ["Alimentazione ridondata e UPS", "Riduce le interruzioni dovute a guasti o brevi blackout."],
            ["Raffreddamento", "Mantiene condizioni operative adeguate per le apparecchiature."],
            ["Controllo degli accessi e monitoraggio", "Aiuta a proteggere la struttura e a rilevare problemi."],
          ],
        },
      ],
    },
    {
      id: "bilanciamento-affidabilita",
      phase: "scalabilita",
      title: "Più server: carico e disponibilità",
      description:
        "Quando un'applicazione usa più istanze, un bilanciatore distribuisce le richieste tra i server disponibili. Il reverse proxy può anche inoltrare le richieste al servizio corretto; una CDN serve copie di contenuti da nodi vicini agli utenti. Ridondanza e controlli di salute aiutano a gestire alcuni guasti, ma non sostituiscono backup e ripristino.",
      panels: [
        {
          kind: "text",
          label: "Un percorso semplificato",
          content:
            "Browser → DNS → rete → bilanciatore / reverse proxy → istanza applicativa → database\n\nSe un'istanza non è disponibile, il bilanciatore può smettere di inviarle traffico. La configurazione concreta dipende dal servizio e dall'infrastruttura.",
        },
        {
          kind: "table",
          label: "Concetti collegati",
          columns: ["Concetto", "A cosa serve"],
          rows: [
            ["Scalabilità verticale", "Aumenta le risorse assegnate a una macchina."],
            ["Scalabilità orizzontale", "Aggiunge altre istanze per distribuire il carico."],
            ["Bilanciamento", "Distribuisce il traffico tra destinazioni disponibili."],
            ["CDN", "Distribuisce copie di risorse da nodi vicini agli utenti."],
            ["Backup", "Permette di recuperare dati; non equivale a tenere più server attivi."],
          ],
        },
      ],
    },
    {
      id: "cloud-modelli",
      phase: "cloud",
      title: "Cloud: IaaS, PaaS e serverless",
      description:
        "Il cloud offre risorse informatiche tramite servizi gestiti da un provider. Non significa che i server siano scomparsi: cambia quanto dell'infrastruttura viene gestito direttamente dal team.",
      panels: [
        {
          kind: "table",
          label: "Modelli di servizio",
          columns: ["Modello", "Cosa gestisce il provider", "Cosa resta al team"],
          rows: [
            ["IaaS", "Macchine virtuali, rete e risorse di base.", "Sistema operativo, runtime, applicazione e dati."],
            ["PaaS", "Anche runtime e piattaforma di esecuzione.", "Codice, configurazione applicativa e dati."],
            ["Serverless", "Provisioning e scalabilità dell'ambiente di esecuzione.", "Funzioni, dati, permessi, limiti e costi."],
            ["SaaS", "Applicazione pronta e infrastruttura sottostante.", "Configurazione e uso del servizio."],
          ],
        },
        {
          kind: "text",
          label: "Serverless non vuol dire senza server",
          content:
            "Il provider gestisce i server e l'allocazione delle risorse; chi sviluppa distribuisce codice o funzioni senza amministrare direttamente le macchine sottostanti. Restano da considerare disponibilità, limiti, latenza e costi.",
        },
      ],
    },
    {
      id: "viaggio-pacchetti",
      phase: "datacenter",
      title: "Come viaggiano i dati",
      description:
        "La richiesta non attraversa un collegamento unico e immutabile. I dati sono trasportati in pacchetti attraverso reti, router e collegamenti fisici, che possono includere fibra ottica e cavi sottomarini. Il percorso dipende dalle reti e dalle condizioni del momento.",
      panels: [
        {
          kind: "text",
          label: "Internet è un insieme di reti",
          content:
            "Dispositivo → rete locale → provider Internet → reti di transito e interconnessione → rete che ospita il servizio\n\nI pacchetti di una comunicazione seguono le regole dei protocolli; router e reti li inoltrano verso la destinazione.",
        },
      ],
    },
    {
      id: "riepilogo-web",
      phase: "scalabilita",
      title: "Dalla persona al servizio online",
      description:
        "Una persona usa un browser; il frontend invia richieste a un servizio raggiungibile attraverso la rete. DNS, infrastruttura, web server e applicazione collaborano per elaborare la richiesta e restituire una risposta. Database e altri servizi possono intervenire quando servono.",
      panels: [
        {
          kind: "text",
          label: "La mappa mentale",
          content:
            "Persona → browser / client → Internet e DNS → web server o gateway → applicazione → database o servizi esterni → risposta al client\n\nUn piccolo progetto può riunire più componenti sulla stessa macchina; un servizio più grande può distribuirli su più server e data center.",
        },
      ],
    },
  ],
};

export default config;
