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
            return { ...n, style: { ...n.style, opacity: 0.3 } };
          }
          return { ...n, style: { ...n.style, opacity: 0.15 } };
        });

        return [...mappedNodes, ...newNodes];
      });
    },
    [setCenter],
  ); // Aggiungi setCenter alle dipendenze del useCallback

  // Mantiene intatto il passaggio delle funzioni di callback ai nodi
  const finalNodes = nodes.map((node) => {
    if (node.type === "tech") {
      return {
        ...node,
        data: {
          ...node.data,
          onToggleChildren: () =>
            toggleChildren(node.id, node.position.x, node.position.y),
          onOpenModal: (label) => alert(`Modale per: ${label}`),
        },
      };
    }
    return node;
  });

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0b1120] bg-linear-to-b from-[#182741]/30 to-transparent">
      <ReactFlow nodes={finalNodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background variant="dots" gap={20} size={1} color="#1e293b" />
        <Controls
          className="bg-slate-950/70! backdrop-blur-md! border! border-slate-800! rounded-lg! p-1! shadow-[0_0_15px_rgba(0,0,0,0.5)]!"
          position="bottom-left"
        />
        {/* <MiniMap
          position="bottom-right"
          className="bg-slate-50"
          zoomable
          pannable
        /> */}
      </ReactFlow>
    </div>
  );
};

// ESPORTAZIONE FINALE: Il wrapper che inietta il Provider di React Flow
const SkillMap = () => {
  return (
    <ReactFlowProvider>
      <SkillMapContent />
    </ReactFlowProvider>
  );
};

export default SkillMap;
