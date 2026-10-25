import { useState, useCallback } from "react";
import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
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
    data: { label: "CSS", hasChildren: false, isOpen: false },
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

const SkillMap = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const toggleChildren = useCallback((parentId, parentX, parentY) => {
    setNodes((currentNodes) => {
      // Controlliamo se i figli sono già visualizzati
      const areChildrenOpen = currentNodes.some((n) =>
        n.id.startsWith(`${parentId}-child-`),
      );

      if (areChildrenOpen) {
        // CHIUSURA: Rimuove i nodi figli e ripulisce in sicurezza gli edge
        setEdges((currentEdges) =>
          currentEdges.filter((e) => !e.id.startsWith(`edge-${parentId}-`)),
        );

        return currentNodes
          .map((n) =>
            n.id === parentId
              ? { ...n, data: { ...n.data, isOpen: false } }
              : n,
          )
          .filter((n) => !n.id.startsWith(`${parentId}-child-`));
      }

      // APERTURA
      const childrenData = MOCK_CHILDREN_DB[parentId] || [];
      if (childrenData.length === 0) return currentNodes;

      const positions = calculateCircularPositions(
        parentX,
        parentY,
        childrenData.length,
        140,
      );

      const newNodes = childrenData.map((child, index) => ({
        id: `${parentId}-child-${child.id}`,
        type: "tech",
        data: { label: child.label, isSubNode: true },
        position: positions[index],
      }));

      const newEdges = childrenData.map((child) => ({
        id: `edge-${parentId}-${child.id}`,
        source: parentId,
        target: `${parentId}-child-${child.id}`,
        animated: true,
        style: { stroke: "#94a3b8", strokeWidth: 1.5 },
      }));

      // Aggiorna gli edge evitando duplicati grazie al filtro preventivo
      setEdges((currentEdges) => {
        const cleanEdges = currentEdges.filter(
          (e) => !e.id.startsWith(`edge-${parentId}-`),
        );
        return [...cleanEdges, ...newEdges];
      });

      // Imposta lo stato del nodo padre su isOpen: true
      return currentNodes
        .map((n) =>
          n.id === parentId ? { ...n, data: { ...n.data, isOpen: true } } : n,
        )
        .concat(newNodes);
    });
  }, []);

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
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          className="bg-slate-50"
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};

export default SkillMap;
