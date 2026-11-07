const config = {
  slug: "sistema-operativo",
  title: "Sistema operativo, kernel e driver",
  subtitle: "Come il software usa le risorse del computer",
  phases: [
    { id: "software", label: "Software e sistema", hint: "Servizi e risorse", icon: "layers" },
  ],
  steps: [
    {
      id: "applicazioni", phase: "software", illustration: "operating-system",
      title: "Applicazioni e sistema operativo",
      description: "Un'applicazione usa servizi del sistema operativo per lavorare con finestre, file, rete e dispositivi. Le API offrono interfacce utilizzabili senza conoscere i dettagli di ogni componente fisico.",
      panels: [{ kind: "text", label: "Esempio", content: "Un editor chiede al sistema di aprire un file.\nL'applicazione usa un'interfaccia software, senza dover gestire direttamente ogni modello di SSD." }],
    },
    {
      id: "sistema-operativo", phase: "software", illustration: "operating-system",
      title: "Cosa fa il sistema operativo",
      description: "Il sistema operativo coordina l'uso delle risorse e mette a disposizione servizi alle applicazioni. Comprende il kernel e altre componenti, alcune eseguite con privilegi utente.",
      panels: [{ kind: "text", label: "Responsabilità", content: "Gestione di processi e memoria; accesso ai file e ai dispositivi; protezione e interfacce per i programmi.\nLe implementazioni variano tra sistemi." }],
    },
    {
      id: "kernel", phase: "software", illustration: "operating-system",
      title: "Il kernel",
      description: "Il kernel è una parte centrale del sistema operativo. Gestisce risorse e operazioni privilegiate, come la pianificazione dei processi e l'accesso protetto alla memoria.",
      panels: [{ kind: "text", label: "Una richiesta", content: "Applicazione → interfaccia del sistema → eventuale chiamata al kernel.\nNon ogni operazione di un'app richiede necessariamente una chiamata al kernel." }],
    },
    {
      id: "driver", phase: "software", illustration: "operating-system",
      title: "I driver parlano con i dispositivi",
      description: "Un driver è software che permette al sistema operativo di interagire con un dispositivo o una classe di dispositivi. A seconda della piattaforma può funzionare nello spazio kernel oppure nello spazio utente.",
      panels: [{ kind: "text", label: "Esempio", content: "Una richiesta di stampa passa attraverso servizi e driver appropriati prima di raggiungere la stampante.\nIl percorso preciso dipende dal sistema e dal dispositivo." }],
    },
    {
      id: "collaborazione", phase: "software", illustration: "operating-system",
      title: "Come collaborano",
      description: "Applicazioni, servizi di sistema, kernel e driver collaborano quando serve accedere a una risorsa. Questo schema è un modello concettuale, non un percorso obbligatorio per ogni operazione.",
      panels: [{ kind: "text", label: "Aprire un file", content: "Applicazione → servizi e filesystem → kernel e driver, quando necessari → dispositivo di archiviazione.\nCache e altri livelli possono cambiare il percorso effettivo." }],
    },
  ],
};

export default config;
