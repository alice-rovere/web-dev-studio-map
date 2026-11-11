const config = {
  slug: "web-professions",
  title: "Professioni nel Web",
  subtitle: "Chi progetta, sviluppa e mantiene un prodotto digitale",
  displayMode: "focus",
  phases: [
    { id: "ruoli", label: "I ruoli", hint: "Competenze diverse", icon: "users" },
    { id: "team", label: "Il team", hint: "Collaborazione", icon: "workflow" },
  ],
  steps: [
    {
      id: "frontend",
      phase: "ruoli",
      title: "Frontend developer",
      description:
        "Realizza la parte dell'applicazione con cui le persone interagiscono nel browser. Traduce i progetti dell'interfaccia in pagine accessibili e responsive e collega l'interfaccia ai servizi tramite API.",
      panels: [
        {
          kind: "text",
          label: "In pratica",
          content:
            "HTML struttura i contenuti.\nCSS definisce presentazione e layout.\nJavaScript aggiunge interazioni e comunica con le API.",
        },
      ],
    },
    {
      id: "backend",
      phase: "ruoli",
      title: "Backend developer",
      description:
        "Sviluppa i servizi che elaborano le richieste: API, regole di business, autenticazione e accesso ai dati. Il codice backend viene eseguito lato server, non nel browser dell'utente.",
      panels: [
        {
          kind: "text",
          label: "In pratica",
          content:
            "Riceve e valida le richieste.\nApplica le regole del prodotto.\nLegge o salva dati e restituisce risposte al frontend.",
        },
      ],
    },
    {
      id: "full-stack",
      phase: "ruoli",
      title: "Full-stack developer",
      description:
        "Lavora sia sul frontend sia sul backend. È una descrizione dell'ampiezza delle competenze, non la promessa di conoscere ogni tecnologia in modo ugualmente approfondito.",
      panels: [
        {
          kind: "text",
          label: "Un profilo trasversale",
          content:
            "Può seguire una funzionalità dal componente dell'interfaccia all'API e ai dati.\nIn base al team, può avere maggiore esperienza in uno dei due ambiti.",
        },
      ],
    },
    {
      id: "design-ux",
      phase: "ruoli",
      title: "Web designer, UI e UX",
      description:
        "Web e UI designer curano gerarchia visiva, componenti e prototipi. UX designer e researcher studiano bisogni e flussi d'uso e verificano che il prodotto sia comprensibile e utilizzabile.",
      panels: [
        {
          kind: "table",
          label: "Due prospettive complementari",
          columns: ["Ambito", "Domanda guida"],
          rows: [
            ["UI e visual design", "Come si presenta e si organizza visivamente l'interfaccia?"],
            ["UX e ricerca", "Le persone riescono a raggiungere i propri obiettivi?"],
          ],
        },
      ],
    },
    {
      id: "qualita-infrastruttura",
      phase: "ruoli",
      title: "QA, DevOps e sistemisti",
      description:
        "Altri ruoli contribuiscono alla qualità e al funzionamento del servizio: QA verifica il comportamento; DevOps automatizza rilascio e operazioni; sistemisti amministrano sistemi, reti e servizi.",
      panels: [
        {
          kind: "table",
          label: "Altri contributi al prodotto",
          columns: ["Ruolo", "Responsabilità"],
          rows: [
            ["QA / software tester", "Progetta verifiche per trovare difetti e regressioni."],
            ["DevOps / cloud engineer", "Automatizza build e deploy e cura osservabilità e infrastruttura."],
            ["Sistemista", "Configura e mantiene sistemi operativi, reti e servizi."],
            ["3D / WebGL developer", "Realizza esperienze tridimensionali interattive nel browser."],
          ],
        },
      ],
    },
    {
      id: "collaborazione",
      phase: "team",
      title: "Un prodotto, un lavoro di squadra",
      description:
        "I ruoli si coordinano dall'analisi dei bisogni fino alla manutenzione. Nei team piccoli le responsabilità possono sovrapporsi; in quelli più grandi sono spesso distribuite tra persone specializzate.",
      panels: [
        {
          kind: "text",
          label: "Esempio: un ordine online",
          content:
            "Design e ricerca definiscono un flusso chiaro.\nFrontend costruisce schermate e interazioni.\nBackend valida e registra l'ordine.\nQA verifica successi e casi di errore.\nDevOps cura il rilascio e il monitoraggio.",
        },
      ],
    },
  ],
};

export default config;
