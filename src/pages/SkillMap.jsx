import { useCallback, useMemo, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { nodeTypes } from "../flow/nodes/index.jsx";
import NodeDetailsModal from "../components/NodeDetailsModal.jsx";
import NodeKnowledgePage from "./NodeKnowledge.jsx";
import { useMapGraph } from "../hooks/useMapGraph";
import { useAuth } from "../hooks/useAuth";
import { MACRO_GROUPS } from "../data/baseNodes";

import "@xyflow/react/dist/style.css";

const SkillMapContent = () => {
  const { isEditor } = useAuth();
  const {
    graph,
    nodes,
    edges,
    expandedIds,
    toggleNode,
    loading,
    error,
    reload,
  } = useMapGraph();

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [activeKnowledgeId, setActiveKnowledgeId] = useState(null);

  const toDisplayNode = useCallback(
    (nodeId) => {
      const node = graph.nodesById.get(nodeId);
      if (!node) return null;

      return {
        id: node.id,
        type: "tech",
        data: {
          label: node.label,
          categories: node.categories,
          primaryCategory: node.primaryCategory,
          description: node.description,
          best_practices: node.best_practices,
          naming_conventions: node.naming_conventions,
          study_urls: node.study_urls,
          hasChildren: graph.getChildIds(nodeId).length > 0,
          isOpen: expandedIds.has(nodeId),
          parentCount: graph.getParentIds(nodeId).length,
        },
      };
    },
    [graph, expandedIds],
  );

  const selectedNode = selectedNodeId
    ? toDisplayNode(selectedNodeId)
    : null;

  const selectedParents = useMemo(() => {
    if (!selectedNodeId) return [];
    return graph.getParentIds(selectedNodeId).map((parentId) => ({
      id: parentId,
      label: graph.nodesById.get(parentId)?.label ?? parentId,
    }));
  }, [graph, selectedNodeId]);

  const selectedChildren = useMemo(() => {
    if (!selectedNodeId) return [];
    return graph.getChildIds(selectedNodeId).map((childId) => ({
      id: childId,
      label: graph.nodesById.get(childId)?.label ?? childId,
    }));
  }, [graph, selectedNodeId]);

  const finalNodes = useMemo(
    () => [
      ...MACRO_GROUPS,
      ...nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isSubNode: node.data.parentCount > 0,
          onToggleChildren: () => toggleNode(node.id),
          onOpenModal: () => setSelectedNodeId(node.id),
        },
      })),
    ],
    [nodes, toggleNode],
  );

  if (activeKnowledgeId) {
    const knowledgeNode = toDisplayNode(activeKnowledgeId);

    if (knowledgeNode) {
      return (
        <NodeKnowledgePage
          canEdit={isEditor}
          key={activeKnowledgeId}
          node={knowledgeNode}
          onBack={() => {
            setActiveKnowledgeId(null);
            setSelectedNodeId(activeKnowledgeId);
          }}
          onClose={() => {
            setActiveKnowledgeId(null);
            setSelectedNodeId(null);
          }}
        />
      );
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0b1120] bg-linear-to-b from-[#182741]/30 to-transparent">
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0b1120]/60 backdrop-blur-sm">
          <p className="font-mono text-xs text-slate-400">
            Caricamento mappa neurale…
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-xl border border-rose-500/30 bg-rose-950/10 p-6 text-center">
            <AlertTriangle className="mx-auto mb-3 text-rose-400" size={26} />
            <h1 className="mb-1 text-sm font-bold text-white">
              Mappa non disponibile
            </h1>
            <p className="mb-4 text-xs text-slate-400">{error}</p>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/10"
              onClick={() => reload({ clearPositions: true })}
              type="button"
            >
              <RefreshCw size={13} />
              Riprova
            </button>
          </div>
        </div>
      )}

      <ReactFlow
        edges={edges}
        fitView
        nodeTypes={nodeTypes}
        nodes={finalNodes}
      >
        <Background variant="dots" gap={20} size={1} color="#1e293b" />
        <Controls
          className="bg-slate-950/70! backdrop-blur-md! border! border-slate-800! rounded-lg! p-1! shadow-[0_0_15px_rgba(0,0,0,0.5)]!"
          position="bottom-left"
        />
      </ReactFlow>

      <NodeDetailsModal
        childNodes={selectedChildren}
        isOpen={Boolean(selectedNode)}
        node={selectedNode}
        onClose={() => setSelectedNodeId(null)}
        onOpenKnowledge={() => {
          if (selectedNodeId) {
            setActiveKnowledgeId(selectedNodeId);
            setSelectedNodeId(null);
          }
        }}
        onSelectRelated={(relatedId) => setSelectedNodeId(relatedId)}
        parents={selectedParents}
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
