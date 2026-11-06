const html = `<!doctype html>
<html lang="it">
  <head><link rel="stylesheet" href="/stile.css"></head>
  <body><h1>Ciao Web</h1></body>
</html>`;

const config = {
  slug: "internet-browser",
  title: "Internet & Browser",
  subtitle: "Dall'indirizzo ai pixel",
  phases: [
    { id: "navigation", label: "Navigazione", hint: "URL e DNS", icon: "terminal" },
    { id: "network", label: "Rete", hint: "Connessione e HTTP", icon: "server" },
    { id: "documents", label: "Documenti", hint: "HTML, CSS e JavaScript", icon: "code" },
    { id: "rendering", label: "Rendering", hint: "Dagli alberi ai pixel", icon: "code" },
  ],
  steps: [
    {
      id: "url", phase: "navigation", illustration: "internet-browser",
      title: "Un indirizzo nel browser",
      description: "Il browser interpreta la URL: lo schema indica il protocollo, il dominio identifica l'host e il percorso la risorsa richiesta.",
      panels: [{ kind: "text", label: "Esempio", content: "https://esempio.it/articoli\nhttps = schema · esempio.it = host · /articoli = percorso" }],
    },
    {
      id: "dns", phase: "navigation", illustration: "internet-browser",
      title: "Risoluzione DNS",
      description: "Se serve, il nome di dominio viene risolto in un indirizzo IP. Le risposte possono essere già presenti in cache; il resolver può altrimenti consultare la gerarchia DNS.",
      panels: [{ kind: "text", label: "Risoluzione", content: "esempio.it → resolver DNS → indirizzo IP\nLa cache può evitare una nuova ricerca." }],
    },
    {
      id: "connection", phase: "network", illustration: "internet-browser",
      title: "Connessione sicura",
      description: "Per HTTPS il browser stabilisce o riutilizza una connessione sicura e verifica il certificato del server. Il trasporto dipende dalla versione HTTP: HTTP/3 usa QUIC su UDP.",
      panels: [{ kind: "text", label: "HTTPS", content: "HTTP/1.1 e HTTP/2: normalmente TCP + TLS\nHTTP/3: QUIC su UDP, con TLS integrato" }],
    },
    {
      id: "request", phase: "network", illustration: "internet-browser",
      title: "Richiesta e risposta HTTP",
      description: "Il browser invia una richiesta; il server restituisce uno stato, degli header e, quando previsto, un corpo. Cache, redirect ed errori possono cambiare il percorso.",
      panels: [{ kind: "text", label: "Esempio semplificato", content: "GET /articoli HTTP/1.1\nHost: esempio.it\n\nHTTP/1.1 200 OK\nContent-Type: text/html" }],
    },
    {
      id: "html", phase: "documents", illustration: "internet-browser",
      title: "HTML e DOM",
      description: "Il browser analizza l'HTML e costruisce il DOM, una rappresentazione ad albero del documento. Può iniziare mentre la risposta è ancora in arrivo.",
      panels: [{ kind: "code", label: "index.html", language: "html", content: html }, { kind: "text", label: "DOM semplificato", content: "document → html → body → h1 → «Ciao Web»" }],
    },
    {
      id: "css", phase: "documents", illustration: "internet-browser",
      title: "CSS e CSSOM",
      description: "I fogli di stile vengono scaricati e analizzati per costruire il CSSOM. Le regole determinate dalla cascata contribuiscono agli stili calcolati degli elementi.",
      panels: [{ kind: "code", label: "stile.css", language: "css", content: "h1 {\n  color: teal;\n  font-size: 2rem;\n}" }],
    },
    {
      id: "javascript", phase: "documents", illustration: "internet-browser",
      title: "Il ruolo di JavaScript",
      description: "Gli script possono leggere e modificare DOM e stili, avviare richieste e rendere necessario un nuovo rendering. Il caricamento dipende anche da async, defer e tipo di script.",
      panels: [{ kind: "code", label: "Esempio", language: "js", content: 'document.querySelector("h1").textContent = "Ciao browser";' }],
    },
    {
      id: "tree", phase: "rendering", illustration: "internet-browser",
      title: "Dai dati alla rappresentazione visiva",
      description: "Il browser combina DOM e stili calcolati in una rappresentazione per il rendering. Gli elementi senza box visibile, come quelli con display: none, non sono disegnati.",
      panels: [{ kind: "text", label: "Modello semplificato", content: "DOM + stili calcolati → render tree\nNon tutti i nodi DOM producono un box visibile." }],
    },
    {
      id: "layout", phase: "rendering", illustration: "internet-browser",
      title: "Layout e paint",
      description: "Il layout calcola dimensioni e posizioni dei box; il paint determina le operazioni di disegno, come testo, colori e bordi.",
      panels: [{ kind: "text", label: "Dal box al disegno", content: "Layout → posizione e dimensione\nPaint → testo, sfondi, bordi e altri elementi visivi" }],
    },
    {
      id: "pixels", phase: "rendering", illustration: "internet-browser",
      title: "Compositing e pixel",
      description: "Il browser combina i livelli necessari per mostrare il risultato sullo schermo. Le modifiche successive possono riattivare solo alcune fasi, non sempre l'intera pipeline.",
      panels: [{ kind: "text", label: "Un processo continuo", content: "Compositing → immagine sullo schermo\nInterazioni, animazioni o nuove risorse possono aggiornare la pagina." }],
    },
  ],
};

export default config;
