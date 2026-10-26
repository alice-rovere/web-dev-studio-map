import { MarkerType } from "@xyflow/react";

// Solo i nodi sequenziali del flusso di chiamata
export const FLOW_NODES = [
  {
    id: "demo-client",
    label: "User / Client",
    category: "Client",
    description: "Il browser usato dalla persona.",
    position: { x: 0, y: 250 },
  },
  {
    id: "demo-frontend",
    label: "Frontend",
    category: "Interfaccia",
    description: "Mostra l'interfaccia e avvia le richieste.",
    position: { x: 250, y: 250 },
  },
  {
    id: "demo-http-request",
    label: "HTTP Request",
    category: "Richiesta",
    description: "Trasporta la richiesta dal client al backend.",
    position: { x: 500, y: 250 },
  },
  {
    id: "demo-api-server",
    label: "Server API",
    category: "Server",
    description: "Riceve la richiesta HTTP e la inoltra all'applicazione backend.",
    position: { x: 750, y: 250 },
  },
  {
    id: "demo-backend",
    label: "Backend",
    category: "Applicazione",
    description: "Elabora la richiesta e coordina l'accesso ai dati.",
    position: { x: 1000, y: 250 },
  },
  {
    id: "demo-database-query",
    label: "Database Query",
    category: "Lettura dati",
    description: "Interroga il database per recuperare le informazioni.",
    position: { x: 1250, y: 250 },
  },
  {
    id: "demo-database",
    label: "Database",
    category: "Persistenza",
    description: "Conserva i dati dell'applicazione.",
    position: { x: 1500, y: 250 },
  },
  {
    id: "demo-query-result",
    label: "Query Result",
    category: "Risultato",
    description: "I dati recuperati tornano al backend.",
    position: { x: 1250, y: 450 },
  },
  {
    id: "demo-json-response",
    label: "JSON Response",
    category: "Risposta",
    description: "Il backend restituisce i dati in formato JSON.",
    position: { x: 625, y: 450 },
  },
];

export const FLOW_EDGES = [
  { id: "flow-client-frontend", source: "demo-client", target: "demo-frontend", label: "usa" },
  { id: "flow-frontend-request", source: "demo-frontend", target: "demo-http-request", label: "invia" },
  { id: "flow-request-backend", source: "demo-http-request", target: "demo-api-server", label: "HTTP" },
  { id: "flow-server-backend", source: "demo-api-server", target: "demo-backend", label: "inoltra" },
{ id: "flow-backend-query", source: "demo-backend", target: "demo-database-query", label: "interroga" },
  { id: "flow-query-database", source: "demo-database-query", target: "demo-database", label: "query" },
  
    {
    id: "flow-database-result",
    source: "demo-database",
    target: "demo-query-result",
    label: "restituisce",
    sourceHandle: "source-bottom", // Corretto
    targetHandle: "target-top",    // Corretto
    data: { direction: "response" }
  },
  
  // CORREZIONE 2: Dal query-result (source-left) torna al backend (target-bottom)
  {
    id: "flow-result-backend",
    source: "demo-query-result",
    target: "demo-backend",
    label: "risultato",
    sourceHandle: "source-left",   // Corretto
    targetHandle: "target-bottom", // Corretto
    data: { direction: "response", customRoute: true }
  },
  
  // CORREZIONE 3: Dal backend (source-bottom) va alla json-response (target-right)
  {
    id: "flow-backend-json",
    source: "demo-backend",
    target: "demo-json-response",
    label: "serializza",
    sourceHandle: "source-bottom", // Corretto
    targetHandle: "target-left",   // Corretto (cambiato in left per fluidità verso sinistra)
    data: { direction: "response", customRoute: true }
  },
  
  {
    id: "flow-json-client",
    source: "demo-json-response",
    target: "demo-client",
    label: "JSON",
    sourceHandle: "source-left",
    targetHandle: "target-bottom",
    data: { direction: "response" }
  },
];
export const GUIDED_LESSONS = [
  {
    title: "1. Inizio nel Client",
    description: "L'utente interagisce con il browser (Client), avviando l'esperienza utente.",
    focusedNodeId: "demo-client",
    focusedEdgeId: null,
  },
  {
    title: "2. Elaborazione dell'Interfaccia",
    description: "Il Frontend intercetta l'azione ed esegue il codice necessario a preparare l'operazione.",
    focusedNodeId: "demo-frontend",
    focusedEdgeId: "flow-client-frontend",
  },
  {
    title: "3. Creazione della Richiesta",
    description: "Viene generata una richiesta HTTP formattata per essere spedita sulla rete internet.",
    focusedNodeId: "demo-http-request",
    focusedEdgeId: "flow-frontend-request",
  },
  {
    title: "4. Ricezione del Server",
    description: "Il Server API di front-end accetta il pacchetto HTTP in ingresso e smista la chiamata verso i servizi interni.",
    focusedNodeId: "demo-api-server",
    focusedEdgeId: "flow-request-backend",
  },
  {
    title: "5. Logica di Business",
    description: "Il Backend centrale riceve l'evento, convalida i dati e determina l'azione da compiere.",
    focusedNodeId: "demo-backend",
    focusedEdgeId: "flow-server-backend",
  },
  {
    title: "6. Interrogazione Dati",
    description: "La logica esegue una Query strutturata destinata allo strato di persistenza.",
    focusedNodeId: "demo-database-query",
    focusedEdgeId: "flow-backend-query",
  },
  {
    title: "7. Estrazione dal Database",
    description: "Il Database elabora la richiesta sui propri dischi e isola i record richiesti.",
    focusedNodeId: "demo-database",
    focusedEdgeId: "flow-query-database",
  },
  {
    title: "8. Ritorno dei Dati Grezzi",
    description: "Il Database produce un Query Result che viene riaffidato all'applicazione di Backend.",
    focusedNodeId: "demo-query-result",
    focusedEdgeId: "flow-database-result",
  },
  {
    title: "9. Impacchettamento JSON",
    description: "Il backend trasforma i dati in una stringa JSON standardizzata pronta per viaggiare in rete e la invia al client.",
    focusedNodeId: "demo-json-response",
    focusedEdgeId: "flow-backend-json",
  },
];

export function getFlowGraph(activeLessonIndex) {
  const lesson = GUIDED_LESSONS[activeLessonIndex] || GUIDED_LESSONS[0];

  const nodes = FLOW_NODES.map((node) => ({
    id: node.id,
    type: "flowPathNode",
    position: node.position,
    draggable: false,
    data: {
      label: node.label,
      category: node.category,
      description: node.description,
      isFocused: node.id === lesson.focusedNodeId,
    },
  }));

  const edges = FLOW_EDGES.map((edge) => {
    const isResponse = edge.data?.direction === "response";
    const color = isResponse ? "#10b981" : "#3b82f6"; // Tailwind emerald-500 o blue-500
    const isCurrentEdge = edge.id === lesson.focusedEdgeId;
    const isInvertedReturn = ["flow-result-backend", "flow-backend-json", "flow-json-client"].includes(edge.id);


    return {
      ...edge,
      type: edge.data?.customRoute ? "customRouteEdge" : "smoothstep",
markerEnd: isInvertedReturn ? undefined : { type: MarkerType.ArrowClosed, color },
      markerStart: isInvertedReturn ? { type: MarkerType.ArrowClosed, color } : undefined,
      
      animated: isCurrentEdge,
      style: {
        stroke: color,
        strokeWidth: isCurrentEdge ? 3 : 1.5,
        opacity: isCurrentEdge ? 1 : 0.25,
      },
      labelStyle: { fill: isResponse ? "#a7f3d0" : "#bfdbfe", fontSize: 11 },
      labelBgStyle: { fill: "#1e293b", fillOpacity: 0.85 },
    };
  });

  return { nodes, edges };
}
