const config = {
  slug: "dentro-il-pc",
  title: "Dentro il PC",
  subtitle: "I componenti fisici del computer",
  phases: [
    { id: "componenti", label: "Componenti", hint: "Come è fatto un computer", icon: "monitor" },
  ],
  steps: [
    {
      id: "scheda-madre", phase: "componenti", illustration: "computer-system",
      title: "La scheda madre collega i componenti",
      description: "La scheda madre ospita e collega componenti, circuiti e connettori. Non esegue da sola i programmi: permette ai vari elementi di comunicare tramite bus e controller.",
      panels: [{ kind: "text", label: "Da ricordare", content: "Scheda madre: la base su cui sono collegati processore, memoria, archiviazione e altri dispositivi.\nNei portatili alcuni componenti possono essere saldati." }],
    },
    {
      id: "cpu", phase: "componenti", illustration: "computer-system",
      title: "La CPU esegue istruzioni",
      description: "La CPU esegue istruzioni e operazioni sui dati. Contiene uno o più core e lavora con registri e cache, piccole memorie molto veloci vicine alle unità di calcolo.",
      panels: [{ kind: "text", label: "Il suo ruolo", content: "CPU → esegue istruzioni\nCore → unità di elaborazione\nCache → conserva temporaneamente dati e istruzioni usati di frequente" }],
    },
    {
      id: "ram", phase: "componenti", illustration: "computer-system",
      title: "La RAM conserva i dati in uso",
      description: "La RAM è la memoria di lavoro del computer: contiene temporaneamente dati e istruzioni necessari ai programmi. È volatile: il suo contenuto non viene conservato quando manca l'alimentazione.",
      panels: [{ kind: "text", label: "RAM e CPU", content: "La CPU accede ai dati in RAM attraverso una gerarchia di memoria e cache.\nPiù RAM può permettere di mantenere più dati e programmi disponibili contemporaneamente." }],
    },
    {
      id: "archiviazione", phase: "componenti", illustration: "computer-system",
      title: "SSD e archiviazione",
      description: "Un SSD conserva file, applicazioni e dati anche quando il computer è spento. È diverso dalla RAM: mantiene i dati nel tempo, mentre la RAM serve principalmente come spazio di lavoro temporaneo.",
      panels: [{ kind: "text", label: "Confronto", content: "SSD: archiviazione persistente.\nRAM: memoria di lavoro volatile.\nEsistono anche altre forme di archiviazione, come gli hard disk." }],
    },
    {
      id: "gpu", phase: "componenti", illustration: "computer-system",
      title: "La GPU elabora la grafica",
      description: "La GPU è specializzata nell'elaborazione parallela e viene usata, tra le altre cose, per produrre immagini. Può essere integrata nel processore oppure presente come componente dedicato.",
      panels: [{ kind: "text", label: "Grafica", content: "GPU → elabora grafica e altri calcoli paralleli.\nSchermo → mostra le immagini prodotte.\nLa GPU può condividere la RAM o avere memoria dedicata." }],
    },
    {
      id: "batteria", phase: "componenti", illustration: "computer-system",
      title: "Alimentazione e batteria",
      description: "L'alimentatore e i circuiti di gestione forniscono energia ai componenti. Nei portatili la batteria permette di usare il computer anche senza collegarlo alla rete elettrica.",
      panels: [{ kind: "text", label: "Energia, non dati", content: "Alimentatore o batteria → circuiti di alimentazione → componenti.\nUn computer fisso può funzionare senza batteria principale." }],
    },
    {
      id: "periferiche", phase: "componenti", illustration: "computer-system",
      title: "Periferiche e collegamenti",
      description: "Tastiera e mouse permettono di inserire informazioni; schermo e altoparlanti restituiscono risultati. Porte e interfacce collegano dispositivi interni ed esterni.",
      panels: [{ kind: "text", label: "Ingresso e uscita", content: "Ingresso: tastiera, mouse, microfono.\nUscita: schermo, altoparlanti.\nAlcuni dispositivi, come le interfacce di rete, inviano e ricevono dati." }],
    },
  ],
};

export default config;
