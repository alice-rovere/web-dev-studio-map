import { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";

import { nodeTypes } from "../flow/nodes/index.jsx";
import { calculateCircularPositions } from "../flow/utils/geometry.js";
import NodeDetailsModal from "../components/NodeDetailsModal.jsx";
import NodeKnowledgePage from "./NodeKnowledge.jsx";

// Importazione delle configurazioni e dei database di mockup esterni
import {
  MOCK_CHILDREN_DB,
  MOCK_DETAILS_DB,
  initialNodes,
  initialEdges,
} from "../data/mockData.js";

import "@xyflow/react/dist/style.css";

const SkillMapContent = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const { setCenter } = useReactFlow();

  // Stati per il controllo dei moduli di interfaccia sovrapposti
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  // Stati per la gestione della pagina di conoscenza estesa e del DB reattivo locale
  const [activeKnowledgeNode, setActiveKnowledgeNode] = useState(null);
  const [detailsDb, setDetailsDb] = useState(MOCK_DETAILS_DB);

  const handleOpenModal = useCallback((node) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedNode(null);
  }, []);

  const handleOpenKnowledge = useCallback(() => {
    if (selectedNode) {
      setActiveKnowledgeNode(selectedNode);
      setIsModalOpen(false);
    }
  }, [selectedNode]);

  const handleSaveKnowledgeContent = useCallback(
    async (parsedContent) => {
      if (!activeKnowledgeNode) return;
      const knowledgeKey = activeKnowledgeNode.id.replace(/.*-child-/, "");

      setDetailsDb((prevDb) => ({
        ...prevDb,
        [knowledgeKey]: {
          ...prevDb[knowledgeKey],
          extended_content: parsedContent,
        },
      }));

      console.log(
        `Salvataggio mockup completato per il modulo: ${knowledgeKey}`,
      );
      return null;
    },
    [activeKnowledgeNode],
  );

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

        const positions = calculateCircularPositions(
          parentX,
          parentY,
          childrenData.length,
          150,
        );

        const centerX = parentX + 160 / 2;
        const centerY = parentY + 44 / 2;

        setCenter(centerX, centerY, { zoom: 1.3, duration: 800 });

        const newNodes = childrenData.map((child, index) => ({
          id: `${parentId}-child-${child.id}`,
          type: "tech",
          data: { label: child.label, isSubNode: true },
          position: positions[index],
          style: { opacity: 1 },
        }));

        const newEdges = childrenData.map((child) => ({
          id: `edge-${parentId}-${child.id}`,
          source: parentId,
          target: `${parentId}-child-${child.id}`,
          animated: true,
          style: { stroke: edgeColor, strokeWidth: 2, opacity: 1 },
        }));

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

        return currentNodes
          .map((n) =>
            n.id === parentId ? { ...n, data: { ...n.data, isOpen: true } } : n,
          )
          .concat(newNodes);
      });
    },
    [setNodes, setEdges, setCenter],
  );

  // Iniezione dinamica delle funzioni di callback e categorie ereditate nei nodi grafici
  const finalNodes = nodes.map((node) => {
    if (node.type === "tech") {
      const nodeCategory =
        node.id.includes("html") || node.id.includes("css")
          ? "frontend"
          : node.id.includes("javascript")
            ? "backend"
            : "database";

      return {
        ...node,
        data: {
          ...node.data,
          category: nodeCategory,
          onToggleChildren: () =>
            toggleChildren(node.id, node.position.x, node.position.y),
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

  const currentDetailsKey = selectedNode
    ? selectedNode.id.replace(/.*-child-/, "")
    : null;
  const currentDetails = selectedNode ? detailsDb[currentDetailsKey] : null;

  // RITORNO CONDIZIONALE: Se attiva la vista estesa, monta NodeKnowledgePage
  if (activeKnowledgeNode) {
    const knowledgeKey = activeKnowledgeNode.id.replace(/.*-child-/, "");
    const knowledgeDetails = detailsDb[knowledgeKey] || {};

    return (
      <NodeKnowledgePage
        node={activeKnowledgeNode}
        content={knowledgeDetails.extended_content || []}
        canEdit={true}
        onBack={() => {
          setActiveKnowledgeNode(null);
          setIsModalOpen(true);
        }}
        onClose={() => {
          setActiveKnowledgeNode(null);
          handleCloseModal();
        }}
        onSaveContent={handleSaveKnowledgeContent}
      />
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0b1120] bg-linear-to-b from-[#182741]/30 to-transparent">
      <ReactFlow nodes={finalNodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background variant="dots" gap={20} size={1} color="#1e293b" />
        <Controls
          className="bg-slate-950/70! backdrop-blur-md! border! border-slate-800! rounded-lg! p-1! shadow-[0_0_15px_rgba(0,0,0,0.5)]!"
          position="bottom-left"
        />
      </ReactFlow>

      <NodeDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        node={selectedNode}
        details={currentDetails}
        glossary={[]}
        onOpenKnowledge={handleOpenKnowledge}
        onSelectRelated={(relatedId) =>
          console.log(`Naviga a relazione: ${relatedId}`)
        }
      />
    </div>
  );
};

export default function SkillMap() {
  return (
    <ReactFlowProvider>
      <SkillMapContent />
    </ReactFlowProvider>
  );
}
