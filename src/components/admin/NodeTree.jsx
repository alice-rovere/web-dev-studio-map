import { useMemo } from "react";
import { GitFork, Network } from "lucide-react";
import { CATEGORY_COLORS } from "../../data/baseNodes";

export default function NodeTree({ nodes, parents, categories, selectedId, onSelect }) {
  const { roots, nodeById, childrenByParent, categoriesByNode } = useMemo(() => {
      const nodeMap = new Map(nodes.map((node) => [node.id, node]));
      const categoryMap = new Map();

      for (const entry of categories) {
        const list = categoryMap.get(entry.node_id) ?? [];
        list.push(entry);
        categoryMap.set(entry.node_id, list);
      }

      const primaryParent = new Map();
      const childRelations = new Map();

      for (const relation of parents) {
        if (!nodeMap.has(relation.parent_id) || !nodeMap.has(relation.child_id)) {
          continue;
        }

        if (relation.is_primary) {
          primaryParent.set(relation.child_id, relation.parent_id);
        }

        const list = childRelations.get(relation.parent_id) ?? [];
        list.push(relation);
        childRelations.set(relation.parent_id, list);
      }

      for (const list of childRelations.values()) {
        list.sort((a, b) => a.sort_order - b.sort_order);
      }

      return {
        roots: nodes.filter((node) => !primaryParent.has(node.id)),
        nodeById: nodeMap,
        childrenByParent: childRelations,
        categoriesByNode: categoryMap,
      };
    }, [nodes, parents, categories]);

  function renderNode(nodeId, depth, visited) {
    if (visited.has(nodeId)) return null;
    const node = nodeById.get(nodeId);
    if (!node) return null;

    const nodeCategories = categoriesByNode.get(nodeId) ?? [];
    const primary =
      nodeCategories.find((entry) => entry.is_primary) ?? nodeCategories[0];
    const parentCount = parents.filter(
      (relation) => relation.child_id === nodeId,
    ).length;
    const children = (childrenByParent.get(nodeId) ?? []).filter(
      (relation) => relation.is_primary,
    );
    const nextVisited = new Set(visited).add(nodeId);

    return (
      <div key={nodeId}>
        <button
          className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left transition-colors ${
            selectedId === nodeId
              ? "border-cyan-500/40 bg-cyan-500/10 text-white"
              : "border-transparent text-slate-300 hover:bg-slate-900/60"
          }`}
          onClick={() => onSelect(nodeId)}
          style={{ paddingLeft: `${8 + depth * 14}px` }}
          type="button"
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              backgroundColor: CATEGORY_COLORS[primary?.category] ?? "#64748b",
            }}
          />
          <span className="min-w-0 flex-1 truncate text-xs font-medium">
            {node.label}
          </span>
          {parentCount > 1 && (
            <span
              className="flex items-center gap-0.5 font-mono text-[9px] text-slate-500"
              title={`${parentCount} padri`}
            >
              <GitFork size={9} />
              {parentCount}
            </span>
          )}
        </button>

        {children.map((relation) =>
          renderNode(relation.child_id, depth + 1, nextVisited),
        )}
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-800 p-4 text-center text-xs text-slate-500">
        Nessun nodo presente.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
        <Network size={12} />
        Gerarchia nodi
      </div>
      {roots.map((node) => renderNode(node.id, 0, new Set()))}
    </div>
  );
}
