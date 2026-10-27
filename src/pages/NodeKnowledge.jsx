import { GitFork, Lock, X } from "lucide-react";
import ContentSectionEditor from "../components/ContentSectionEditor";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../data/baseNodes";
import { StickyNotesCanvas } from "../components/StickyNotesCanvas";

export default function NodeKnowledgePage({
  node,
  childNodes = [],
  canEdit = false,
  onClose,
  onSelectChild,
}) {
  const nodeData = node?.data ?? {};
  const categories = nodeData.categories ?? [];
  const primaryCategory = nodeData.primaryCategory ?? "frontend";
  const accent = CATEGORY_COLORS[primaryCategory] ?? "#94a3b8";

  return (
    <section className="relative h-full w-full overflow-y-auto border border-zinc-900 bg-zinc-950 p-4 font-sans text-zinc-100 shadow-2xl before:absolute before:top-0 before:left-0 before:h-px before:w-full before:bg-linear-to-r before:from-transparent before:via-zinc-700 before:to-transparent sm:p-6 md:p-10">
      <StickyNotesCanvas boardId="page-node-knowledge" />

      <div className="max-w-4xl mx-auto pb-16">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.length > 0 ? (
              categories.map((entry) => (
                <span
                  className="text-[10px] font-mono tracking-widest font-bold px-2 py-0.5 rounded border uppercase"
                  key={entry.category}
                  style={{
                    color: CATEGORY_COLORS[entry.category] ?? "#94a3b8",
                    borderColor: `${CATEGORY_COLORS[entry.category] ?? "#94a3b8"
                      }66`,
                    backgroundColor: `${CATEGORY_COLORS[entry.category] ?? "#94a3b8"
                      }12`,
                  }}
                >
                  {CATEGORY_LABELS[entry.category] ?? entry.category}
                </span>
              ))
            ) : (
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                Senza categoria
              </span>
            )}
          </div>

          <button
            aria-label="Chiudi e torna alla mappa"
            title="Chiudi e torna alla mappa"
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 p-2 text-zinc-400 shadow-sm transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <h2
          className="mb-2 border-b border-zinc-900 pb-2 text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl"
          id="node-knowledge-title"
        >
          {nodeData.label || "Nodo"}
        </h2>

        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:mb-8">
          {nodeData.description ||
            "Approfondimento strutturato del nodo selezionato."}
        </p>

        {childNodes.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <GitFork size={13} style={{ color: accent }} />
              Nodi figli
            </h3>
            <ul className="flex flex-wrap gap-2">
              {childNodes.map((child) => (
                <li key={child.id}>
                  <button
                    className="cursor-pointer rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs font-mono text-zinc-300 transition-all hover:text-white"
                    onClick={() => onSelectChild?.(child.id)}
                    style={{
                      borderColor: `${accent}55`,
                      boxShadow: `0 0 5px ${accent}20`,
                    }}
                    type="button"
                  >
                    {child.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!canEdit && (
          <p className="mb-6 flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-950/80 px-4 py-3 text-xs font-mono text-zinc-500">
            <Lock size={13} />
            Modalità sola lettura. Accedi con un ruolo editor per modificare
            questi contenuti.
          </p>
        )}

        <div
          style={{ borderTopColor: `${accent}22` }}
          className="border-t pt-6"
        >
          <ContentSectionEditor canEdit={canEdit} nodeId={node?.id} />
        </div>
      </div>
    </section>
  );
}
