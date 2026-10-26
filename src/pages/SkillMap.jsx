import { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
//per ora nascosta minimap
// import {  MiniMap } from "@xyflow/react";

import { nodeTypes } from "../flow/nodes/index.jsx";
import { calculateCircularPositions } from "../flow/utils/geometry.js";
import NodeDetailsModal from "../components/NodeDetailsModal.jsx"; // Importazione del componente Radix UI
import "@xyflow/react/dist/style.css";

const MOCK_CHILDREN_DB = {
  html: [
    { id: "tags", label: "Tag Nativi" }, // Semplificati gli ID interni del DB mockup
    { id: "forms", label: "Form & Validazione" },
    { id: "seo", label: "SEO Semantic" },
  ],
  javascript: [
    { id: "dom", label: "DOM Manipulation" },
    { id: "async", label: "Async/Fetch" },
    { id: "es6", label: "ES6+ Features" },
    { id: "storage", label: "Local Storage" },
  ],
  css: [
    { id: "bootstrap", label: "bootstrap" },
    { id: "tailwind", label: "tailwind" },
  ],
};

// Database mockup per alimentare l'Inspector delle tecnologie
const MOCK_DETAILS_DB = {
  html: {
    description:
      "HyperText Markup Language. Struttura portante del web per l'organizzazione semantica del contenuto applicativo.",
    best_practices:
      "Usa marcatori semantici nativi.\nValida costantemente i tag secondo specifiche W3C.",
    naming_conventions: [
      "Tag e attributi rigorosamente minuscoli",
      "Classi in kebab-case",
    ],
    study_urls: [{ label: "MDN HTML Basics", url: "https://mozilla.org" }],
  },
  css: {
    description:
      "Cascading Style Sheets. Gestione dello stile visivo, layout responsivi e implementazioni grafiche neon dell'HUD.",
    best_practices:
      "Mantieni l'architettura atomica.\nSfrutta le variabili native o utility classes.",
    naming_conventions: ["Metodologia BEM o utility pure"],
    study_urls: [
      { label: "Tailwind CSS Documentation", url: "https://tailwindcss.com" },
    ],
  },
  javascript: {
    description:
      "Linguaggio runtime asincrono ad eventi. Logica computazionale ed interazioni dinamiche dei grafi di rete.",
    best_practices:
      "Evita mutazioni dirette degli stati condivisi.\nPrediligi astrazioni funzionali.",
    naming_conventions: [
      "camelCase per metodi e variabili",
      "PascalCase per costruttori",
    ],
    study_urls: [{ label: "MDN JavaScript Guide", url: "https://mozilla.org" }],
  },
};

const initialNodes = [
  {
    id: "group-frontend",
    type: "macroGroup",
    data: {
      label: "Frontend",
      borderColor: "border-blue-300",
      bgColor: "bg-blue-50/30",
      textColor: "text-blue-500",
    },
    position: { x: 100, y: 100 },
    style: { width: 500, height: 500 },
    focusable: false,
    draggable: false,
  },
  {
    id: "group-backend",
    type: "macroGroup",
    data: {
      label: "Backend",
      borderColor: "border-emerald-300",
      bgColor: "bg-emerald-50/30",
      textColor: "text-emerald-500",
    },
    position: { x: 450, y: 100 },
    style: { width: 500, height: 500 },
    focusable: false,
    draggable: false,
  },
  {
    id: "group-database",
    type: "macroGroup",
    data: {
      label: "Database",
      borderColor: "border-purple-300",
      bgColor: "bg-purple-50/30",
      textColor: "text-purple-500",
    },
    position: { x: 275, y: 400 },
    style: { width: 500, height: 500 },
    focusable: false,
    draggable: false,
  },

  {
    id: "html",
    type: "tech",
    data: { label: "HTML", hasChildren: true, isOpen: false },
    position: { x: 220, y: 200 },
  },
  {
    id: "css",
    type: "tech",
    data: { label: "CSS", hasChildren: true, isOpen: false },
    position: { x: 220, y: 300 },
  },
  {
    id: "javascript",
    type: "tech",
    data: { label: "JavaScript", hasChildren: true, isOpen: false },
    position: { x: 500, y: 250 },
  },
];

const initialEdges = [];

const SkillMapContent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { setCenter } = useReactFlow();

  // Stati locali per governare il ciclo vitale del pannello laterale
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // Azione per aprire la modale registrando l'istanza del nodo cliccato
  const handleOpenModal = useCallback((node) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  }, []);

  // Azione per chiudere la modale ripulendo la memoria di tracciamento
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNode(null);
  }, []);
  const handleOpenKnowledge = useCallback(() => {
    if (selectedNode) {
      console.log(`Richiesta documentazione estesa per: ${selectedNode.id}`);
      // In futuro qui inserirai la navigazione (es: navigate('/guided-path'))
      // o l'apertura di un pannello di secondo livello
    }
  }, [selectedNode]);

  const toggleChildren = useCallback(
    (parentId, parentX, parentY) => {
      setNodes((currentNodes) => {
        const areChildrenOpen = currentNodes.some((n) =>
          n.id.startsWith(`${parentId}-child-`),
        );

        // --- CASO CHIUSURA ---
        if (areChildrenOpen) {
          setEdges((currentEdges) =>
            currentEdges
              .filter((e) => !e.id.startsWith(`edge-${parentId}-`))
              .map((e) => ({ ...e, style: { ...e.style, opacity: 1 } })),
          );

          // Quando chiudiamo, ripristiniamo la visuale centrando globalmente l'intero grafo
          // (Opzionale: puoi omettere setCenter qui se preferisci che la telecamera resti ferma alla chiusura)
          setCenter(350, 300, { zoom: 0.9, duration: 800 });

          return currentNodes
            .map((n) =>
              n.id === parentId
                ? {
                    ...n,
                    data: { ...n.data, isOpen: false },
                    style: { ...n.style, opacity: 1 },
                  }
                : { ...n, style: { ...n.style, opacity: 1 } },
            )
            .filter((n) => !n.id.startsWith(`${parentId}-child-`));
        }

        // --- CASO APERTURA ---
        const childrenData = MOCK_CHILDREN_DB[parentId] || [];
        if (childrenData.length === 0) return currentNodes;

        const edgeColor =
          parentId === "html"
            ? "#7ab8ff"
            : parentId === "javascript"
              ? "#64d9bd"
              : "#94a3b8";

        // Raggio a 150px (molto vicini come richiesto)
        const positions = calculateCircularPositions(
          parentX,
          parentY,
          childrenData.length,
          150,
        );

        // 🧠 ANIMAZIONE TELECAMERA: Centralizza il focus sul padre
        // Ipotizzando che il nodo sia largo 160px e alto 44px, troviamo il centro perfetto:
        const centerX = parentX + 160 / 2;
        const centerY = parentY + 44 / 2;

        // Sposta lo sguardo del canvas sul centro del nodo, applica uno zoom ravvicinato (1.3)
        setCenter(centerX, centerY, { zoom: 1.3, duration: 800 });

        // Generazione nodi figli
        const newNodes = childrenData.map((child, index) => ({
          id: `${parentId}-child-${child.id}`,
          type: "tech",
          data: { label: child.label, isSubNode: true },
          position: positions[index],
          style: { opacity: 1 },
        }));

        // Generazione Edges
        const newEdges = childrenData.map((child) => ({
          id: `edge-${parentId}-${child.id}`,
          source: parentId,
          target: `${parentId}-child-${child.id}`,
          animated: true,
          style: { stroke: edgeColor, strokeWidth: 2, opacity: 1 },
        }));

        // Aggiornamento Edges (Opacizza lo sfondo)
        setEdges((currentEdges) => {
          const cleanEdges = currentEdges.filter(
            (e) => !e.id.includes("-child-"),
          );
          const opacifiedEdges = cleanEdges.map((e) => ({
            ...e,
            style: { ...e.style, opacity: 0.15 },
          }));
          return [...opacifiedEdges, ...newEdges];
        });

        // Aggiornamento Nodi (Opacizza lo sfondo)
        const cleanedNodes = currentNodes.filter(
          (n) => !n.id.includes("-child-"),
        );
        const mappedNodes = cleanedNodes.map((n) => {
          if (n.id === parentId) {
            return {
              ...n,
              data: { ...n.data, isOpen: true },
              style: { ...n.style, opacity: 1 },
            };
          }
          if (n.type === "macroGroup") {
            return {
              ...n,
              data: { ...n.data },
              style: { ...n.style, opacity: 0.3 },
            };
          }
          return {
            ...n,
            data: { ...n.data },
            style: { ...n.style, opacity: 0.15 },
          };
        });

        return [...mappedNodes, ...newNodes];
      });
    },
    [setCenter],
  ); // Aggiungi setCenter alle dipendenze del useCallback

  // Mantiene intatto il passaggio delle funzioni di callback ai nodi
  const finalNodes = nodes.map((node) => {
    if (node.type === "tech") {
      // Determiniamo la categoria ereditata in base all'ID o al gruppo di appartenenza visiva
      const nodeCategory =
        node.id.includes("html") || node.id.includes("css")
          ? "frontend"
          : "backend";

      return {
        ...node,
        data: {
          ...node.data,
          category: nodeCategory, // Passiamo la categoria per gli accenti cromatici della modale
          onToggleChildren: () =>
            toggleChildren(node.id, node.position.x, node.position.y),
          // Passiamo l'intera struttura del nodo all'handler dell'Inspector
          onOpenModal: () =>
            handleOpenModal({
              ...node,
              data: { ...node.data, category: nodeCategory },
            }),
        },
      };
    }
    return node;
  });

  // Estraiamo la chiave corretta per il DB dettagli (gestisce sia nodi principali che sotto-nodi child)
  const currentDetailsKey = selectedNode
    ? selectedNode.id.replace(/.*-child-/, "")
    : null;
  const currentDetails = MOCK_DETAILS_DB[currentDetailsKey] || null;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0b1120] bg-linear-to-b from-[#182741]/30 to-transparent">
      <ReactFlow nodes={finalNodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background variant="dots" gap={20} size={1} color="#1e293b" />
        <Controls
          className="bg-slate-950/70! backdrop-blur-md! border! border-slate-800! rounded-lg! p-1! shadow-[0_0_15px_rgba(0,0,0,0.5)]!"
          position="bottom-left"
        />
      </ReactFlow>

      {/* COMPONENTE INTERFACCIA: Montato esternamente al canvas di React Flow */}
      <NodeDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        node={selectedNode}
        details={currentDetails}
        glossary={[]} // Verrà cablato con il GlossaryContext nel prossimo step
        onOpenKnowledge={handleOpenKnowledge}
        onSelectRelated={(relatedId) =>
          console.log(`Naviga a relazione: ${relatedId}`)
        }
      />
    </div>
  );
};

const SkillMap = () => {
  return (
    <ReactFlowProvider>
      <SkillMapContent />
    </ReactFlowProvider>
  );
};

export default SkillMap;
