import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMapGraph } from "../services/mapService";
import {
  buildNodeGraph,
  getCategoryColor,
  getNodePosition,
} from "../flow/utils/nodeGraph";

export function useMapGraph() {
  const [data, setData] = useState({ nodes: [], parents: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const fetchGraph = useCallback(async () => {
    try {
      const nextData = await fetchMapGraph();
      setData(nextData);
      setError(null);
    } catch (loadError) {
      setData({ nodes: [], parents: [], categories: [] });
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossibile caricare la mappa.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Caricamento iniziale: gli aggiornamenti di stato avvengono dopo la richiesta.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGraph();
  }, [fetchGraph]);

  const reload = useCallback(async () => {
    setLoading(true);
    await fetchGraph();
  }, [fetchGraph]);

  const graph = useMemo(() => buildNodeGraph(data), [data]);

  const toggleNode = useCallback((nodeId) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const expandFocused = useCallback(
    (nodeId) => {
      const next = graph.getAncestorPath(nodeId);
      next.add(nodeId);
      setExpandedIds(next);
    },
    [graph],
  );

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const updateNodePosition = useCallback((nodeId, x, y) => {
    setData((previous) => ({
      ...previous,
      nodes: previous.nodes.map((n) =>
        n.id === nodeId ? { ...n, position_x: x, position_y: y } : n,
      ),
    }));
  }, []);

  const updateNodeData = useCallback((updatedNode) => {
    setData((previous) => ({
      ...previous,
      nodes: previous.nodes.map((node) =>
        node.id === updatedNode.id ? { ...node, ...updatedNode } : node,
      ),
    }));
  }, []);

  const layout = useMemo(() => {
    const { visibleIds, edges } = graph.getVisibleGraph(expandedIds);
    const positionMemo = new Map();

    function resolvePosition(nodeId, visiting = new Set()) {
      if (positionMemo.has(nodeId)) return positionMemo.get(nodeId);

      const node = graph.nodesById.get(nodeId);
      if (!node || visiting.has(nodeId)) {
        return { position: { x: 0, y: 0 }, depth: 0 };
      }

      const primaryParent = (graph.parentsByChild.get(nodeId) ?? [])[0];
      let result;

      if (!primaryParent) {
        const rootIndex = graph.roots.indexOf(nodeId);
        result = {
          position: getNodePosition(
            node,
            null,
            rootIndex,
            graph.roots.length,
            0,
          ),
          depth: 0,
        };
      } else {
        const parentResult = resolvePosition(
          primaryParent.parent_id,
          new Set(visiting).add(nodeId),
        );
        const siblings =
          graph.childrenByParent.get(primaryParent.parent_id) ?? [];
        const index = Math.max(
          0,
          siblings.findIndex((entry) => entry.child_id === nodeId),
        );
        const depth = parentResult.depth + 1;

        result = {
          position: getNodePosition(
            node,
            parentResult.position,
            index,
            siblings.length,
            depth,
          ),
          depth,
        };
      }

      positionMemo.set(nodeId, result);
      return result;
    }

    const visibleNodes = [];

    for (const nodeId of visibleIds) {
      const node = graph.nodesById.get(nodeId);
      if (!node) continue;

      const { position } = resolvePosition(nodeId);

      visibleNodes.push({
        id: node.id,
        type: "tech",
        position,
        draggable: !graph.parentsByChild.has(nodeId), // solo root nodes
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
          isRoot: !graph.parentsByChild.has(nodeId),
        },
      });
    }

    const visibleEdges = edges.map((edge) => {
      const parent = graph.nodesById.get(edge.source);
      return {
        ...edge,
        animated: true,
        style: {
          stroke: getCategoryColor(parent?.primaryCategory),
          strokeWidth: 2,
        },
      };
    });

    return { visibleNodes, visibleEdges };
  }, [graph, expandedIds]);

  return {
    data,
    graph,
    nodes: layout.visibleNodes,
    edges: layout.visibleEdges,
    expandedIds,
    toggleNode,
    expandFocused,
    collapseAll,
    updateNodePosition,
    updateNodeData,
    loading,
    error,
    reload,
  };
}
