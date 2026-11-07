import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Layers,
  Lock,
  RefreshCw,
  Unlock,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useLocation } from "react-router-dom";

import { nodeTypes } from "../flow/nodes/index.jsx";
import NodeDetailsModal from "../components/skill-map/NodeDetailsModal.jsx";
import MobileSkillTree from "../components/skill-map/MobileSkillTree.jsx";
import SkillMapSearch from "../components/skill-map/SkillMapSearch.jsx";
import QuickGlossaryAdd from "../components/glossary/QuickGlossaryAdd.jsx";
import NodeKnowledgePage from "./NodeKnowledge.jsx";
import { useMapGraph } from "../hooks/useMapGraph";
import { useAuth } from "../hooks/useAuth";
import { MACRO_GROUPS } from "../data/baseNodes";
import { saveNodePosition } from "../services/mapService";
import { getFocusViewport } from "../flow/utils/focusViewport";

import "@xyflow/react/dist/style.css";

const SkillMapContent = () => {
  const shouldReduceMotion = useReducedMotion();
  const { isEditor } = useAuth();
  const {
    graph,
    nodes,
    edges,
    expandedIds,
    toggleNode,
    collapseAll,
    expandFocused,
    updateNodePosition,
    updateNodeData,
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

  const { fitView, getInternalNode, setViewport } = useReactFlow();
  const location = useLocation();
  const mapRef = useRef(null);
  const panelRef = useRef(null);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeKnowledgeId, setActiveKnowledgeId] = useState(
    () => location.state?.knowledgeNodeId ?? null,
  );
  const [pendingFocus, setPendingFocus] = useState(null);
  const resetViewOnCloseRef = useRef(false);

  const handleOpenKnowledge = useCallback((nodeId) => {
    setPendingFocus(null);
    setActiveKnowledgeId(nodeId);
    setIsModalOpen(false);
    setSelectedNodeId(null);
  }, []);

  const returnToMap = useCallback(() => {
    setPendingFocus(null);
    setActiveKnowledgeId(null);
    setSelectedNodeId(null);
    setIsModalOpen(false);
    collapseAll();
  }, [collapseAll]);

  useEffect(() => {
    const handleReturnToMap = () => returnToMap();
    window.addEventListener("devskillmap:return-to-map", handleReturnToMap);
    return () => {
      window.removeEventListener("devskillmap:return-to-map", handleReturnToMap);
    };
  }, [returnToMap]);

  const toDisplayNode = useCallback(
    (nodeId) => {
      const node = graph.nodesById.get(nodeId);
      if (!node) return null;

      return {
        id: node.id,
        type: "tech",
        data: {
          label: node.label,
          slug: node.slug,
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

  const selectedNode = selectedNodeId ? toDisplayNode(selectedNodeId) : null;

  const knowledgeChildren = useMemo(() => {
    if (!activeKnowledgeId) return [];
    return graph.getChildIds(activeKnowledgeId).map((childId) => ({
      id: childId,
      label: graph.nodesById.get(childId)?.label ?? childId,
    }));
  }, [graph, activeKnowledgeId]);

  const knowledgeParent = useMemo(() => {
    if (!activeKnowledgeId) return null;
    const parentId = graph.getParentIds(activeKnowledgeId)[0];
    if (!parentId) return null;

    return {
      id: parentId,
      label: graph.nodesById.get(parentId)?.label ?? parentId,
    };
  }, [graph, activeKnowledgeId]);

  const handleToggleChildren = useCallback(
    (nodeId) => {
      setSelectedNodeId(nodeId);
      setIsModalOpen(true);

      if (expandedIds.has(nodeId)) {
        setPendingFocus(null);
        toggleNode(nodeId);
        return;
      }

      expandFocused(nodeId);
      setPendingFocus({ nodeId, maxZoom: 1, duration: 500 });
    },
    [expandedIds, toggleNode, expandFocused],
  );

  const getRelatedNodes = useCallback(
    (nodeId, direction) => {
      const ids =
        direction === "parents"
          ? graph.getParentIds(nodeId)
          : graph.getChildIds(nodeId);
      return ids.map((id) => ({
        id,
        label: graph.nodesById.get(id)?.label ?? id,
      }));
    },
    [graph],
  );

  const handleSearchSelectNode = useCallback(
    (nodeId) => {
      if (!graph.nodesById.has(nodeId)) return;

      expandFocused(nodeId);
      setSelectedNodeId(nodeId);
      setIsModalOpen(true);
      setPendingFocus({ nodeId, maxZoom: 1.2, duration: 600 });
    },
    [expandFocused, graph],
  );

  useEffect(() => {
    if (!pendingFocus) return undefined;

    let frame;
    const focus = () => {
      if (window.matchMedia("(max-width: 767px)").matches) {
        setPendingFocus(null);
        return;
      }

      const { nodeId, maxZoom, duration } = pendingFocus;
      const ids = new Set([nodeId, ...graph.getChildIds(nodeId)]);
      const focusNodes = nodes.filter((node) => ids.has(node.id));
      const measuredNodes = focusNodes.map((node) => ({
        ...node,
        measured: getInternalNode(node.id)?.measured,
      }));
      const map = mapRef.current;
      const panel = panelRef.current;

      if (
        !map ||
        !panel ||
        !focusNodes.some((node) => node.id === nodeId) ||
        measuredNodes.some(
          (node) => !node.measured?.width || !node.measured?.height,
        )
      ) {
        frame = requestAnimationFrame(focus);
        return;
      }

      const viewport = getFocusViewport(
        measuredNodes,
        map.getBoundingClientRect(),
        panel.getBoundingClientRect(),
        maxZoom,
      );
      setViewport(viewport, { duration });
      setPendingFocus(null);
    };
    frame = requestAnimationFrame(focus);

    return () => cancelAnimationFrame(frame);
  }, [pendingFocus, nodes, graph, getInternalNode, setViewport]);

  // Con la modale aperta restano in evidenza il nodo selezionato e, se espansi, i suoi figli
  const highlightedIds = useMemo(() => {
    if (!selectedNodeId || !isModalOpen) return null;
    const set = new Set([selectedNodeId]);
    if (expandedIds.has(selectedNodeId)) {
      for (const id of graph.getChildIds(selectedNodeId)) set.add(id);
    }
    return set;
  }, [selectedNodeId, isModalOpen, expandedIds, graph]);

  const handleOpenNodeDetails = useCallback(
    (nodeId) => {
      expandFocused(nodeId);
      setSelectedNodeId(nodeId);
      setIsModalOpen(true);
    },
    [expandFocused],
  );

  const handleNodeClick = useCallback(
    (_, node) => {
      handleOpenNodeDetails(node.id);
      setPendingFocus({ nodeId: node.id, maxZoom: 1.2, duration: 600 });
    },
    [handleOpenNodeDetails],
  );

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
    setPendingFocus(null);
    collapseAll();
    setSelectedNodeId(null);
  }, [collapseAll]);

  // Chiudendo la modale si azzera la selezione e si collassano i nodi aperti
  const handleCloseModal = useCallback(() => {
    setPendingFocus(null);
    resetViewOnCloseRef.current = true;
    setIsModalOpen(false);
    handleCollapseAll();
  }, [handleCollapseAll]);

  useEffect(() => {
    if (!resetViewOnCloseRef.current || expandedIds.size > 0) return undefined;

    resetViewOnCloseRef.current = false;
    const frame = requestAnimationFrame(() => {
      fitView({ padding: 0.2, duration: 500 });
    });

    return () => cancelAnimationFrame(frame);
  }, [expandedIds, fitView]);

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
          onOpenKnowledge: () => handleOpenKnowledge(node.id),
        },
      })),
    ],
    [
      nodes,
      handleToggleChildren,
      handleOpenKnowledge,
      highlightedIds,
      selectedNodeId,
      isDragEnabled,
    ],
  );

  const finalEdges = useMemo(
    () =>
      edges.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          opacity:
            highlightedIds &&
            (!highlightedIds.has(edge.source) ||
              !highlightedIds.has(edge.target))
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
          onNodeUpdated={updateNodeData}
          onBack={() => setActiveKnowledgeId(knowledgeParent.id)}
          onSelectChild={(childId) => setActiveKnowledgeId(childId)}
          parentNode={knowledgeParent}
          onClose={returnToMap}
        />
      );
    }
  }

  return (
    <div className="absolute inset-0 w-full h-full bg-[#0b1120]">
      {/* Glow ambientale */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 38%, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
      />

      {/* HUD superiore */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-2 px-3 py-2 transition-[padding] sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-3 ${
          isModalOpen && selectedNode ? "sm:pr-117" : ""
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-950/60 backdrop-blur-md shadow-[0_0_12px_rgba(99,102,241,0.2)]">
            <Layers size={15} className="text-indigo-400" />
          </div>
          <div>
            <span className="block text-[9px] font-mono text-slate-500 tracking-widest mt-0.5">
              {nodes.length} nodi visibili
            </span>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <SkillMapSearch graph={graph} onSelectNode={handleSearchSelectNode} />

          <AnimatePresence>
            {saveStatus && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
                className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-mono backdrop-blur-md sm:px-3 ${
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
                <span className="hidden sm:inline">
                  {saveStatus === "saving" && "Salvataggio..."}
                  {saveStatus === "saved" && "Posizione salvata"}
                  {saveStatus === "error" && "Errore - controlla RLS"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className={`hidden min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-mono backdrop-blur-md transition-all md:flex md:min-h-0 md:px-3 ${
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
            <span className="hidden sm:inline">
              {isDragEnabled ? "Sposta nodi: ON" : "Sposta nodi: OFF"}
            </span>
            <span
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                isDragEnabled
                  ? "bg-cyan-400 shadow-[0_0_6px_#22d3ee]"
                  : "bg-slate-600"
              }`}
            />
          </button>

          <button
            className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/70 px-2.5 py-1.5 text-[11px] font-mono text-slate-400 backdrop-blur-md transition-all hover:border-indigo-500/40 hover:text-slate-200 sm:min-h-0 sm:px-3"
            onClick={handleCollapseAll}
            title="Collassa tutti i nodi espansi"
            type="button"
          >
            <ChevronDown size={12} />
            <span className="hidden sm:inline">Collassa tutto</span>
          </button>

          {isEditor && (
            <QuickGlossaryAdd className="flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/70 px-2.5 py-1.5 text-[11px] font-mono text-slate-400 backdrop-blur-md transition-all hover:border-cyan-500/40 hover:text-cyan-300 sm:min-h-0 sm:px-3" />
          )}
        </div>
      </div>

      {/* Legenda categorie */}
      <div
        className={`absolute bottom-[calc(1rem+env(safe-area-inset-bottom))] z-20 hidden flex-col gap-1.5 rounded-xl border border-slate-800/60 bg-slate-950/75 p-3 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.4)] md:flex ${
          isModalOpen && selectedNode
            ? "right-116"
            : "right-[calc(1rem+env(safe-area-inset-right))]"
        }`}
      >
        {[
          { label: "Frontend", color: "#7ab8ff" },
          { label: "Backend", color: "#64d9bd" },
          { label: "Database", color: "#c49aff" },
          { label: "DevOps", color: "#fb923c" },
          { label: "Tools", color: "#38bdf8" },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 6px ${color}90`,
              }}
            />
            <span className="text-[10px] font-mono text-slate-400">
              {label}
            </span>
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
      <div className="absolute inset-0 hidden md:block" ref={mapRef}>
        <ReactFlow
          edges={finalEdges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          nodeTypes={nodeTypes}
          nodes={finalNodes}
          nodesDraggable={isDragEnabled}
          onNodeClick={handleNodeClick}
          onNodeDragStop={handleNodeDragStop}
          onPaneClick={handleCloseModal}
          panOnDrag
          zoomOnPinch
          zoomOnScroll
        >
          <Background variant="dots" gap={24} size={1.5} color="#64748b" />
          <Controls
            className="bg-slate-950/70! backdrop-blur-md! border! border-slate-800! rounded-lg! p-1! shadow-[0_0_15px_rgba(0,0,0,0.5)]!"
            position="bottom-left"
          />
        </ReactFlow>
      </div>

      <MobileSkillTree
        expandedIds={expandedIds}
        graph={graph}
        onOpenDetails={handleOpenNodeDetails}
        onOpenKnowledge={handleOpenKnowledge}
        onToggleNode={toggleNode}
      />

      {/* Drawer dettagli nodo */}
      <NodeDetailsModal
        getRelated={getRelatedNodes}
        isOpen={isModalOpen && Boolean(selectedNode)}
        node={selectedNode}
        panelRef={panelRef}
        onClose={handleCloseModal}
        onOpenKnowledge={handleOpenKnowledge}
        onSelectRelated={handleSearchSelectNode}
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
