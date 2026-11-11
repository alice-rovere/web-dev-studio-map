const config = {
  slug: "web-infrastructure",
  title: "Server e infrastruttura Web",
  subtitle: "Dal computer che risponde alle richieste al cloud",
  displayMode: "focus",
  phases: [
    { id: "server", label: "Server", hint: "Ruolo e software", icon: "server" },
    { id: "datacenter", label: "Data center", hint: "Macchine e reti", icon: "hard-drive" },
    { id: "traffico", label: "Traffico", hint: "Distribuzione e continuità", icon: "network" },
    { id: "cloud", label: "Cloud", hint: "Servizi gestiti", icon: "cloud" },
  ],
  steps: [
    {
      id: "ruolo-server",
      phase: "server",
      title: "Che cosa significa server",
      description:
        "Server indica il ruolo di un sistema che offre un servizio ad altri sistemi, detti client. Anche un normale computer può svolgere questo ruolo: ciò che conta è il software in esecuzione e il modo in cui è configurato.",
      panels: [
        {
          kind: "text",
          label: "Client e server",
          content:
            "Browser (client) → richiesta → server\nBrowser (client) ← risposta ← server\n\nUn server può offrire pagine, API, file o altri servizi.",
        },
      ],
    },
    {
      id: "server-software",
      phase: "server",
      title: "Macchina, web server e applicazione",
      description:
        "Il computer server è la macchina o l'ambiente di calcolo. Un web server è il programma che riceve richieste HTTP; l'applicazione elabora le regole del prodotto e può interrogare un database. In un progetto semplice questi componenti possono convivere sulla stessa macchina.",
      panels: [
        {
          kind: "table",
          label: "Tre livelli distinti",
          columns: ["Livello", "Esempi"],
          rows: [
            ["Macchina o ambiente", "Server fisico, macchina virtuale, container"],
            ["Web server / proxy", "Nginx, Apache, Caddy"],
            ["Applicazione", "API Node.js, Express, backend"],
          ],
        },
      ],
    },
    {
      id: "datacenter",
      phase: "datacenter",
      title: "Dentro un data center",
      description:
        "Un data center è una struttura che ospita computer e apparecchiature di rete. Oltre ai server servono alimentazione, raffreddamento, connessioni e sistemi di controllo per mantenere l'infrastruttura operativa.",
      panels: [
        {
          kind: "text",
          label: "Non solo server",
          content:
            "Server e rack → elaborazione e organizzazione delle macchine.\nRete → collegamenti tra sistemi e verso Internet.\nAlimentazione e raffreddamento → condizioni operative adeguate.\nControlli e monitoraggio → rilevamento di accessi e problemi.",
        },
      ],
    },
    {
      id: "server-farm",
      phase: "datacenter",
      title: "Perché usare una server farm",
      description:
        "Una server farm coordina più server per servire le richieste di un servizio. Distribuire il lavoro può aumentare la capacità e aiutare a continuare a servire gli utenti quando una macchina ha un problema; richiede però configurazione e monitoraggio.",
      panels: [
        {
          kind: "text",
          label: "Da una macchina a più istanze",
          content:
            "Una macchina: tutta la capacità dipende da un solo sistema.\nPiù macchine: il lavoro può essere distribuito e la capacità aumentata.\nRidondanza: un guasto può essere tollerato, se il servizio è progettato per gestirlo.",
        },
      ],
    },
    {
      id: "bilanciatore",
      phase: "traffico",
      title: "Bilanciatore e reverse proxy",
      description:
        "Un bilanciatore distribuisce le richieste tra più istanze disponibili. Un reverse proxy riceve richieste per conto dei servizi e le inoltra alla destinazione corretta; può anche contribuire a terminare TLS o gestire connessioni.",
      panels: [
        {
          kind: "text",
          label: "Percorso semplificato",
          content:
            "Browser → bilanciatore / reverse proxy → server applicativo A\n                                                     → server applicativo B\n\nLa destinazione viene scelta in base alla configurazione e allo stato dei server.",
        },
      ],
    },
    {
      id: "disponibilita",
      phase: "traffico",
      title: "Scalabilità, disponibilità e backup",
      description:
        "La scalabilità verticale assegna più risorse a una macchina; quella orizzontale aggiunge istanze. Ridondanza e controlli di salute aiutano la disponibilità, ma non sostituiscono i backup, che servono a recuperare dati persi o danneggiati.",
      panels: [
        {
          kind: "table",
          label: "Tre obiettivi diversi",
          columns: ["Concetto", "Serve a"],
          rows: [
            ["Scalabilità", "Gestire più lavoro aggiungendo o aumentando risorse."],
            ["Alta disponibilità", "Ridurre interruzioni quando un componente si guasta."],
            ["Backup e ripristino", "Recuperare dati e servizio dopo una perdita o un incidente."],
          ],
        },
      ],
    },
    {
      id: "modelli-cloud",
      phase: "cloud",
      title: "IaaS, PaaS e serverless",
      description:
        "Nel cloud un provider offre risorse e servizi gestiti. I modelli si distinguono per quanta infrastruttura viene amministrata dal provider e quanta rimane responsabilità del team.",
      panels: [
        {
          kind: "table",
          label: "Quanto gestisce il provider",
          columns: ["Modello", "In breve"],
          rows: [
            ["IaaS", "Macchine virtuali e rete; il team gestisce sistema operativo e applicazione."],
            ["PaaS", "Il provider gestisce anche la piattaforma; il team distribuisce e configura l'app."],
            ["Serverless", "Il provider gestisce l'esecuzione delle funzioni; si curano codice, dati, permessi e costi."],
            ["SaaS", "Si usa un'applicazione pronta, configurandone il servizio."],
          ],
        },
      ],
    },
    {
      id: "serverless",
      phase: "cloud",
      title: "Serverless non significa senza server",
      description:
        "I server ci sono, ma sono gestiti dal provider e non amministrati direttamente dal team. Il modello può semplificare il rilascio e adattare le risorse alla domanda, mantenendo limiti e costi da valutare.",
      panels: [
        {
          kind: "text",
          label: "Che cosa resta da gestire",
          content:
            "Codice e configurazione.\nPermessi e protezione dei dati.\nTempi di risposta, limiti e costi.\nVerifica del comportamento del servizio.",
        },
      ],
    },
    {
      id: "pacchetti",
      phase: "traffico",
      title: "La richiesta attraversa Internet",
      description:
        "I dati viaggiano in pacchetti attraverso reti, router e collegamenti fisici, che possono includere fibra ottica e cavi sottomarini. Internet è un insieme di reti: il percorso effettivo dipende dalle connessioni disponibili.",
      panels: [
        {
          kind: "text",
          label: "Una mappa semplificata",
          content:
            "Dispositivo → rete locale → provider Internet → reti interconnesse → rete che ospita il servizio\n\nDNS aiuta a trovare l'indirizzo del servizio; i protocolli regolano la comunicazione.",
        },
      ],
    },
  ],
};

export default config;
