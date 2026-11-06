const requestCode = `const response = await fetch("/api/ordini", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ productId: "p42", quantity: 1 }),
});`;

const responseCode = `if (!response.ok) {
  throw new Error(\`Richiesta fallita: \${response.status}\`);
}

const order = await response.json();
showOrderConfirmation(order);`;

const config = {
  slug: "http-protocol",
  title: "Il ciclo di una richiesta Web",
  subtitle: "Dal browser ai dati e ritorno",
  phases: [
    { id: "client", label: "Client", hint: "Interazione e interfaccia", icon: "terminal" },
    { id: "request", label: "Richiesta HTTP", hint: "Metodo, header e body", icon: "code" },
    { id: "server", label: "Server", hint: "API e logica applicativa", icon: "server" },
    { id: "data", label: "Dati e risposta", hint: "Database e ritorno al client", icon: "database" },
  ],
  steps: [
    {
      id: "interaction",
      phase: "client",
      illustration: "web-request-cycle",
      title: "Un'azione nel browser",
      description:
        "Una persona compie un'azione nell'interfaccia, per esempio confermare un ordine. Il frontend decide quale risorsa contattare e quali dati inviare.",
      panels: [
        {
          kind: "text",
          label: "Esempio",
          content: "Azione: conferma ordine\nRisorsa: /api/ordini\nDati: prodotto p42, quantità 1",
        },
      ],
    },
    {
      id: "prepare",
      phase: "client",
      illustration: "web-request-cycle",
      title: "Il frontend prepara la chiamata",
      description:
        "Il codice client sceglie il metodo HTTP e prepara header e body. I dati strutturati sono serializzati, spesso in JSON, prima di essere inviati.",
      panels: [
        {
          kind: "code",
          label: "frontend.js",
          language: "js",
          content: requestCode,
        },
      ],
    },
    {
      id: "http-request",
      phase: "request",
      illustration: "web-request-cycle",
      title: "La richiesta viaggia via HTTP",
      description:
        "La richiesta identifica il metodo e il percorso; gli header descrivono il contenuto e il body trasporta i dati. Con HTTPS, TLS protegge la comunicazione in transito.",
      panels: [
        {
          kind: "text",
          label: "Richiesta semplificata",
          content:
            'POST /api/ordini\nContent-Type: application/json\n\n{ "productId": "p42", "quantity": 1 }',
        },
      ],
    },
    {
      id: "routing",
      phase: "server",
      illustration: "web-request-cycle",
      title: "L'API riceve e instrada",
      description:
        "Il server web riceve la richiesta e la passa all'endpoint corrispondente. Middleware e controlli, se previsti, possono verificare formato, autenticazione e autorizzazioni.",
      panels: [
        {
          kind: "text",
          label: "Instradamento",
          content: "POST /api/ordini\n→ endpoint che crea un ordine\n→ parsing e controlli della richiesta",
        },
      ],
    },
    {
      id: "business-logic",
      phase: "server",
      illustration: "web-request-cycle",
      title: "Il backend applica le regole",
      description:
        "La logica applicativa controlla che l'operazione sia valida, applica le regole di business e coordina i servizi o l'accesso ai dati necessari.",
      panels: [
        {
          kind: "text",
          label: "Responsabilità",
          content: "Verifica i dati\nApplica le regole dell'ordine\nDecide quali dati leggere o salvare",
        },
      ],
    },
    {
      id: "database-query",
      phase: "data",
      illustration: "web-request-cycle",
      title: "Il server legge o salva i dati",
      description:
        "Se l'operazione richiede persistenza, il backend interroga il database. Una scrittura può creare l'ordine e restituire al server il record risultante.",
      panels: [
        {
          kind: "code",
          label: "Query parametrizzata",
          language: "sql",
          content:
            'INSERT INTO orders (product_id, quantity)\nVALUES ($1, $2)\nRETURNING id, status;',
        },
      ],
    },
    {
      id: "database-result",
      phase: "data",
      illustration: "web-request-cycle",
      title: "Il risultato torna al backend",
      description:
        "Il database restituisce il risultato dell'operazione. Il backend lo usa per costruire una risposta adatta al contratto dell'API.",
      panels: [
        {
          kind: "table",
          label: "Record creato",
          columns: ["id", "status"],
          rows: [["ord_1042", "confirmed"]],
          highlightRows: [0],
        },
      ],
    },
    {
      id: "http-response",
      phase: "data",
      illustration: "web-request-cycle",
      title: "Il server invia la risposta HTTP",
      description:
        "La risposta contiene un codice di stato, header e, quando previsto, un body. Per esempio, 201 indica che una risorsa è stata creata; errori e redirect seguono percorsi diversi.",
      panels: [
        {
          kind: "text",
          label: "Risposta semplificata",
          content:
            'HTTP/1.1 201 Created\nContent-Type: application/json\n\n{ "id": "ord_1042", "status": "confirmed" }',
        },
      ],
    },
    {
      id: "render-ui",
      phase: "client",
      illustration: "web-request-cycle",
      title: "Il frontend aggiorna la pagina",
      description:
        "Il client legge la risposta e aggiorna l'interfaccia. `fetch` non considera automaticamente un 4xx o 5xx un errore di rete: il codice deve controllare `response.ok`; un problema di rete, invece, può interrompere la chiamata.",
      panels: [
        {
          kind: "code",
          label: "Gestione della risposta",
          language: "js",
          content: responseCode,
        },
      ],
    },
  ],
};

export default config;
