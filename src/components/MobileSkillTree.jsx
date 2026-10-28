import { BookOpen, Info, Minus, Plus } from "lucide-react";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../data/baseNodes";

function TreeNode({
  graph,
  nodeId,
  expandedIds,
  onToggleNode,
  onOpenDetails,
  onOpenKnowledge,
  ancestors,
}) {
  const node = graph.nodesById.get(nodeId);
  if (!node || ancestors.has(nodeId)) return null;

  const childIds = graph.getChildIds(nodeId);
  const hasChildren = childIds.length > 0;
  const isExpanded = expandedIds.has(nodeId);
  const accent = CATEGORY_COLORS[node.primaryCategory] ?? "#94a3b8";
  const nextAncestors = new Set(ancestors).add(nodeId);

  return (
    <li className="min-w-0">
      <div className="flex min-h-12 items-center gap-2 rounded-lg border border-slate-800/80 bg-slate-900/55 px-2">
        <button
          className="min-h-11 min-w-0 flex-1 truncate py-2 text-left text-sm font-medium text-slate-200"
          onClick={() => onOpenDetails(nodeId)}
          type="button"
        >
          {node.label}
        </button>
        <button
          aria-label={`Mostra dettagli di ${node.label}`}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-cyan-300"
          onClick={() => onOpenDetails(nodeId)}
          type="button"
        >
          <Info size={16} />
        </button>
        <button
          aria-label={`Apri approfondimento di ${node.label}`}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-800 hover:text-cyan-300"
          onClick={() => onOpenKnowledge(nodeId)}
          title="Apri approfondimento"
          type="button"
        >
          <BookOpen size={16} />
        </button>
        {hasChildren && (
          <button
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? "Riduci" : "Espandi"} ${node.label}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-slate-800"
            onClick={() => onToggleNode(nodeId)}
            style={{ color: isExpanded ? accent : "#94a3b8" }}
            type="button"
          >
            {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
          </button>
        )}
      </div>

      {hasChildren && isExpanded && (
        <ul className="ml-4 mt-2 space-y-2 border-l border-slate-800 pl-3">
          {childIds.map((childId) => (
            <TreeNode
              ancestors={nextAncestors}
              expandedIds={expandedIds}
              graph={graph}
              key={childId}
              nodeId={childId}
              onOpenDetails={onOpenDetails}
              onOpenKnowledge={onOpenKnowledge}
              onToggleNode={onToggleNode}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function MobileSkillTree({
  graph,
  expandedIds,
  onToggleNode,
  onOpenDetails,
  onOpenKnowledge,
}) {
  const rootsByCategory = new Map(
    Object.keys(CATEGORY_LABELS).map((category) => [category, []]),
  );

  for (const rootId of graph.roots) {
    const root = graph.nodesById.get(rootId);
    if (!root) continue;

    const category = rootsByCategory.has(root.primaryCategory)
      ? root.primaryCategory
      : "frontend";
    rootsByCategory.get(category).push(rootId);
  }

  return (
    <div className="absolute inset-x-0 bottom-0 top-24 z-10 overflow-y-auto overscroll-contain px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-2 md:hidden">
      <div className="mx-auto max-w-xl space-y-5">
        {[...rootsByCategory].map(([category, rootIds]) => {
          if (rootIds.length === 0) return null;

          const accent = CATEGORY_COLORS[category] ?? "#94a3b8";

          return (
            <section aria-label={CATEGORY_LABELS[category]} key={category}>
              <h2
                className="mb-2 flex items-center gap-2 px-1 text-[11px] font-mono font-bold uppercase tracking-[0.16em]"
                style={{ color: accent }}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                {CATEGORY_LABELS[category]}
                <span className="text-[10px] font-normal text-slate-500">
                  {rootIds.length}
                </span>
              </h2>
              <ul className="space-y-2">
                {rootIds.map((rootId) => (
                  <TreeNode
                    ancestors={new Set()}
                    expandedIds={expandedIds}
                    graph={graph}
                    key={rootId}
                    nodeId={rootId}
                    onOpenDetails={onOpenDetails}
                    onOpenKnowledge={onOpenKnowledge}
                    onToggleNode={onToggleNode}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
