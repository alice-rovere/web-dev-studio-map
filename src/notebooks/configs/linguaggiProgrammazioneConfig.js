const sourceCode = `if utente.eta >= 18:
    print("Accesso consentito")`;

const machineCode = `MOV EAX, 5
ADD EAX, 2`;

const machineBytes = `10111000 00000101 00000000 00000000 00000000
10000011 11000000 00000010`;

const config = {
  slug: "linguaggi-programmazione",
  title: "Linguaggi di programmazione",
  subtitle: "Dal codice sorgente alle istruzioni della CPU",
  phases: [
    { id: "sorgente", label: "Codice sorgente", hint: "Astrazioni leggibili", icon: "code" },
    { id: "traduzione", label: "Traduzione e runtime", hint: "Tre strategie comuni", icon: "workflow" },
    { id: "esecuzione", label: "Esecuzione", hint: "Istruzioni macchina", icon: "monitor" },
  ],
  steps: [
    {
      id: "codice-sorgente",
      phase: "sorgente",
      illustration: "language-execution",
      title: "Dal problema al codice sorgente",
      description: "Un linguaggio di alto livello permette di esprimere operazioni con astrazioni più comode delle istruzioni della CPU. La sintassi è formale: il codice non è una frase in linguaggio naturale e deve rispettare le regole del linguaggio.",
      panels: [
        { kind: "code", label: "Esempio in Python", language: "python", content: sourceCode },
        { kind: "text", label: "L'idea", content: "Il programma descrive una condizione e un'azione. Il linguaggio nasconde molti dettagli dell'hardware, ma il programma deve comunque essere tradotto o eseguito da strumenti software." },
      ],
    },
    {
      id: "compilazione-nativa",
      phase: "traduzione",
      illustration: "language-execution",
      title: "Strada A · compilazione nativa",
      description: "Un compilatore può tradurre il sorgente in codice macchina per un obiettivo specifico prima dell'avvio. C, C++ e Rust sono esempi comuni; Go produce anch'esso eseguibili nativi, pur includendo un runtime e, normalmente, un garbage collector.",
      panels: [
        { kind: "text", label: "Flusso tipico", content: "Sorgente → compilatore → eseguibile per sistema e architettura → CPU\nPer un altro sistema operativo o processore, di solito si compila per un nuovo obiettivo." },
        { kind: "text", label: "Vantaggi e compromessi", content: "L'eseguibile può partire senza una VM general purpose e offre buone prestazioni. Portabilità, tempi di compilazione e gestione della memoria dipendono dal linguaggio, dagli strumenti e dalle librerie: non sono uguali per ogni progetto." },
      ],
    },
    {
      id: "bytecode-runtime",
      phase: "traduzione",
      illustration: "language-execution",
      title: "Strada B · bytecode e macchina virtuale",
      description: "Il compilatore produce un formato intermedio, come Java bytecode o .NET IL. Una macchina virtuale compatibile lo esegue e può interpretarlo oppure compilare al volo parti del programma con un JIT.",
      panels: [
        { kind: "text", label: "Flusso tipico", content: "Sorgente Java → compilatore → bytecode (.class) → JVM → CPU\nPer C#, un flusso comune passa da CIL/.NET IL al runtime .NET." },
        { kind: "text", label: "Portabilità con condizioni", content: "Il formato intermedio facilita l'esecuzione su ambienti diversi, ma serve un runtime compatibile e possono esserci dipendenze specifiche della piattaforma. Avvio, memoria e prestazioni dipendono dall'app e dal runtime." },
      ],
    },
    {
      id: "runtime-interprete-jit",
      phase: "traduzione",
      illustration: "language-execution",
      title: "Strada C · interprete e JIT",
      description: "«Interpretato» non significa necessariamente che il runtime legga il testo originale una riga alla volta. Python normalmente compila il sorgente in bytecode per la propria macchina virtuale; motori JavaScript moderni combinano più tecniche, inclusa la compilazione JIT.",
      panels: [
        { kind: "code", label: "Lo stesso esempio", language: "python", content: sourceCode },
        { kind: "text", label: "Due concetti distinti", content: "Il runtime è il software che supporta l'esecuzione; un interprete esegue istruzioni del linguaggio o di una macchina virtuale. Un JIT compila al volo alcune parti. Il tipaggio dinamico riguarda quando e come si controllano i tipi: non stabilisce da solo se un linguaggio sia compilato o interpretato." },
      ],
    },
    {
      id: "istruzioni-macchina",
      phase: "esecuzione",
      illustration: "language-execution",
      title: "Il punto comune · istruzioni macchina",
      description: "Per essere eseguite, le operazioni devono diventare istruzioni comprensibili alla CPU, direttamente o tramite il runtime. Queste istruzioni dipendono dall'architettura del processore; assembly è una rappresentazione testuale, non il linguaggio macchina stesso.",
      panels: [
        { kind: "code", label: "Assembly x86, esempio", language: "asm", content: machineCode },
        { kind: "code", label: "Byte corrispondenti (x86)", language: "binary", content: machineBytes },
        { kind: "text", label: "Da ricordare", content: "Assembly e byte mostrati corrispondono a un esempio x86. Altre architetture usano istruzioni e codifiche diverse. Anche quando il programma parte da bytecode, il runtime lo interpreta o lo traduce in istruzioni per la CPU." },
      ],
    },
    {
      id: "confronto-strade",
      phase: "esecuzione",
      illustration: "language-execution",
      title: "Confrontiamo le strade",
      description: "Non esiste una scala semplice in cui una strategia è sempre più veloce o portabile delle altre. Conta l'implementazione concreta, l'obiettivo di distribuzione, il runtime e il tipo di lavoro svolto.",
      panels: [
        {
          kind: "table",
          label: "Una sintesi",
          columns: ["Strategia", "Risultato intermedio", "Aspetto da valutare"],
          rows: [
            ["Compilazione nativa", "Codice macchina per un obiettivo", "Build e dipendenze per piattaforma"],
            ["Bytecode + runtime", "Formato intermedio", "Compatibilità e caratteristiche della VM"],
            ["Interprete e/o JIT", "Istruzioni eseguite o compilate dal runtime", "Implementazione e comportamento a runtime"],
          ],
        },
        { kind: "text", label: "La mappa mentale", content: "Parti dal sorgente, segui la strategia scelta da compilatore e runtime, e ricorda che la CPU esegue istruzioni macchina. I confini tra le strategie possono sovrapporsi." },
      ],
    },
  ],
};

export default config;
