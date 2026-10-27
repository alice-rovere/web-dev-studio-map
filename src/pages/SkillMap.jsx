import { useCallback, useMemo, useRef, useState } from "react";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import {
  AlertTriangle,
  ChevronDown,
  LayoutGrid,
  Layers,
  Lock,
  RefreshCw,
  Unlock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { nodeTypes } from "../flow/nodes/index.jsx";
import NodeDetailsModal from "../components/NodeDetailsModal.jsx";
import NodeKnowledgePage from "./NodeKnowledge.jsx";
import { useMapGraph } from "../hooks/useMapGraph";
import { useAuth } from "../hooks/useAuth";
import { MACRO_GROUPS } from "../data/baseNodes";
import { saveNodePosition } from "../services/mapService";

import "@xyflow/react/dist/style.css";

const SkillMapContent = () => {
  const { isEditor } = useAuth();
  const {
    graph,
    nodes,
    edges,
    expandedIds,
    toggleNode,
    expandFocused,
    updateNodePosition,
    loading,
    error,
    reload,
  } = useMapGraph();

  const [saveStatus, setSaveStatus] = useState(null);
  const debounceRef = useRef(null);

  const [isDragEnabled, setIsDragEnabled] = useState(() => {
    const saved = localStorage.getItem("skillmap_drag_enabled");
    return saved !== null ? saved === "true" : false;
  });

  const toggleDragEnabled = useCallback(() => {
    setIsDragEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("skillmap_drag_enabled", String(next));
      return next;
    });
  }, []);

  const { getNode, setCenter } = useReactFlow();

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const knowledgeChildren = useMemo(() => {
    if (!activeKnowledgeId) return [];
    return graph.getChildIds(activeKnowledgeId).map((childId) => ({
      id: childId,
      label: graph.nodesById.get(childId)?.label ?? childId,
    }));
  }, [graph, activeKnowledgeId]);

  const handleToggleChildren = useCallback(
    (nodeId) => {
      if (expandedIds.has(nodeId)) {
        toggleNode(nodeId);
        return;
      }

      expandFocused(nodeId);

      const flowNode = getNode(nodeId);
      const fallbackNode = nodes.find((node) => node.id === nodeId);
      const position = flowNode?.position ?? fallbackNode?.position;
      if (!position) return;

      const isSubNode =
        (flowNode?.data?.parentCount ??
          fallbackNode?.data?.parentCount ??
          0) > 0;
      const width =
        flowNode?.measured?.width ?? (isSubNode ? 110 : 190);
      const height =
        flowNode?.measured?.height ?? (isSubNode ? 30 : 44);

      setCenter(position.x + width / 2, position.y + height / 2, {
        zoom: 1,
        duration: 500,
      });
    },
    [expandedIds, toggleNode, expandFocused, getNode, setCenter, nodes],
  );

  // Nodi rilevanti per focus opacity
  const highlightedIds = useMemo(() => {
    if (!selectedNodeId) return null;
    const set = new Set([selectedNodeId]);
    for (const id of graph.getParentIds(selectedNodeId)) set.add(id);
    for (const id of graph.getChildIds(selectedNodeId)) set.add(id);
    return set;
  }, [selectedNodeId, graph]);

  // Click su un nodo: attiva/disattiva focus e opacità
  const handleNodeClick = useCallback((_, node) => {
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
  }, []);

  // Salvataggio posizione con debounce (solo root nodes se il drag è abilitato)
  const handleNodeDragStop = useCallback(
    async (_, node) => {
      if (!isDragEnabled || !node.draggable) return;

      const posX = Math.round(node.position.x);
      const posY = Math.round(node.position.y);

      // Aggiorna subito lo stato locale in memoria per evitare snap-back al re-render
      updateNodePosition(node.id, posX, posY);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSaveStatus("saving");
      debounceRef.current = setTimeout(async () => {
        try {
          await saveNodePosition(node.id, posX, posY);
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus(null), 2200);
        } catch {
          setSaveStatus("error");
          setTimeout(() => setSaveStatus(null), 3500);
        }
      }, 300);
    },
    [updateNodePosition, isDragEnabled],
  );

  // Collassa tutto
  const handleCollapseAll = useCallback(() => {
    const ids = [...expandedIds];
    for (const id of ids) toggleNode(id);
    setSelectedNodeId(null);
  }, [expandedIds, toggleNode]);

  const finalNodes = useMemo(
    () => [
      ...MACRO_GROUPS,
      ...nodes.map((node) => ({
        ...node,
        draggable: isDragEnabled && Boolean(node.draggable),
        style: {
          ...node.style,
          opacity: highlightedIds && !highlightedIds.has(node.id) ? 0.14 : 1,
          filter:
            highlightedIds && !highlightedIds.has(node.id)
              ? "grayscale(65%)"
              : "none",
          transition: "opacity 0.25s ease, filter 0.25s ease",
        },
        data: {
          ...node.data,
          isDragEnabled,
          isSubNode: node.data.parentCount > 0,
          isSelected: selectedNodeId === node.id,
          onToggleChildren: () => handleToggleChildren(node.id),
          onOpenModal: () => {
            setSelectedNodeId(node.id);
            setIsModalOpen(true);
          },
        },
      })),
    ],
    [nodes, handleToggleChildren, highlightedIds, selectedNodeId, isDragEnabled],
  );

  const finalEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          opacity:
            highlightedIds &&
            (!highlightedIds.has(edge.source) || !highlightedIds.has(edge.target))
              ? 0.04
              : 1,
          transition: "opacity 0.25s ease",
        },
      })),
    [edges, highlightedIds],
  );

  if (activeKnowledgeId) {
    const knowledgeNode = toDisplayNode(activeKnowledgeId);

    if (knowledgeNode) {
      return (
        <NodeKnowledgePage
          canEdit={isEditor}
          childNodes={knowledgeChildren}
          key={activeKnowledgeId}
          node={knowledgeNode}
          onSelectChild={(childId) => setActiveKnowledgeId(childId)}
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
    <div className="absolute inset-0 w-full h-full bg-[#080e1a]">

      {/* Glow ambientale */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 38%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      {/* HUD superiore */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3 pointer-events-none">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-950/60 backdrop-blur-md shadow-[0_0_12px_rgba(99,102,241,0.2)]">
            <Layers size={15} className="text-indigo-400" />
          </div>
          <div>
            <span
              className="block text-[11px] font-mono font-bold tracking-[0.18em] uppercase"
              style={{
                background: "linear-gradient(90deg, #818cf8 0%, #67e8f9 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SKILL MAP
            </span>
            <span className="block text-[9px] font-mono text-slate-500 tracking-widest mt-0.5">
              {nodes.length} nodi visibili
            </span>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <AnimatePresence>
            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-mono backdrop-blur-md ${
                  saveStatus === "saved"
                    ? "border-emerald-500/30 bg-emerald-950/70 text-emerald-400"
                    : saveStatus === "error"
                      ? "border-rose-500/30 bg-rose-950/70 text-rose-400"
                      : "border-slate-700/70 bg-slate-900/70 text-slate-400"
                }`}
              >
                {saveStatus === "saving" && (
                  <span className="h-1.5 w-1.5 animate-spin rounded-full border border-slate-400 border-t-transparent" />
                )}
                {saveStatus === "saved" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
                )}
                {saveStatus === "error" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                )}
                {saveStatus === "saving" && "Salvataggio..."}
                {saveStatus === "saved" && "Posizione salvata"}
                {saveStatus === "error" && "Errore - controlla RLS"}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-mono backdrop-blur-md transition-all ${
              isDragEnabled
                ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-300 hover:border-cyan-400 hover:text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                : "border-slate-700/60 bg-slate-900/70 text-slate-400 hover:border-slate-600 hover:text-slate-200"
            }`}
            onClick={toggleDragEnabled}
            title={
              isDragEnabled
                ? "Disabilita lo spostamento dei nodi"
                : "Abilita lo spostamento dei nodi"
            }
            type="button"
          >
            {isDragEnabled ? (
              <Unlock size={12} className="text-cyan-400" />
            ) : (
              <Lock size={12} className="text-slate-400" />
            )}
            <span>{isDragEnabled ? "Sposta nodi: ON" : "Sposta nodi: OFF"}</span>
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                isDragEnabled
                  ? "bg-cyan-400 shadow-[0_0_6px_#22d3ee]"
                  : "bg-slate-600"
              }`}
            />
          </button>

          <button
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/70 px-3 py-1.5 text-[11px] font-mono text-slate-400 backdrop-blur-md transition-all hover:border-indigo-500/40 hover:text-slate-200"
            onClick={handleCollapseAll}
            title="Collassa tutti i nodi espansi"
            type="button"
          >
            <ChevronDown size={12} />
            Collassa tutto
          </button>

          <button
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/70 px-3 py-1.5 text-[11px] font-mono text-slate-400 backdrop-blur-md transition-all hover:border-rose-500/40 hover:text-rose-300"
            onClick={() => reload()}
            title="Ricarica la mappa"
            type="button"
          >
            <LayoutGrid size={12} />
            Reset layout
          </button>
        </div>
      </div>

      {/* Legenda categorie */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 rounded-xl border border-slate-800/60 bg-slate-950/75 p-3 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.4)]">
        {[
          { label: "Frontend", color: "#7ab8ff" },
          { label: "Backend", color: "#64d9bd" },
          { label: "Database", color: "#c49aff" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}90` }}
            />
            <span className="text-[10px] font-mono text-slate-400">{label}</span>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#080e1a]/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <p className="font-mono text-xs text-slate-400">
              Caricamento mappa neurale...
            </p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
          <div className="w-full max-w-md rounded-xl border border-rose-500/30 bg-rose-950/10 p-6 text-center">
            <AlertTriangle className="mx-auto mb-3 text-rose-400" size={26} />
            <h1 className="mb-1 text-sm font-bold text-white">
              Mappa non disponibile
            </h1>
            <p className="mb-4 text-xs text-slate-400">{error}</p>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/10 cursor-pointer"
              onClick={() => reload()}
              type="button"
            >
              <RefreshCw size={13} />
              Riprova
            </button>
          </div>
        </div>
      )}

      {/* ReactFlow */}
      <ReactFlow
        edges={finalEdges}
        fitView
        nodeTypes={nodeTypes}
        nodes={finalNodes}
        nodesDraggable={isDragEnabled}
        onNodeClick={handleNodeClick}
        onNodeDragStop={handleNodeDragStop}
        onPaneClick={() => {
          setSelectedNodeId(null);
          setIsModalOpen(false);
        }}
        panOnDrag
        zoomOnScroll
      >
        <Background variant="dots" gap={24} size={1} color="#1e2d45" />
        <Controls
          className="bg-slate-950/70! backdrop-blur-md! border! border-slate-800! rounded-lg! p-1! shadow-[0_0_15px_rgba(0,0,0,0.5)]!"
          position="bottom-left"
        />
      </ReactFlow>

      {/* Drawer dettagli nodo */}
      <NodeDetailsModal
        childNodes={selectedChildren}
        isOpen={isModalOpen && Boolean(selectedNode)}
        node={selectedNode}
        onClose={() => setIsModalOpen(false)}
        onOpenKnowledge={() => {
          if (selectedNodeId) {
            setActiveKnowledgeId(selectedNodeId);
            setIsModalOpen(false);
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
