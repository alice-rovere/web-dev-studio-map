import { ArrowLeft, GitFork, Lock, Presentation, X } from "lucide-react";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { hasNotebook } from "../notebooks/registry";
import ContentSectionEditor from "../components/content/ContentSectionEditor";
import NodeGenericInfo from "../components/skill-map/NodeGenericInfo";
import GlossaryText from "../components/glossary/GlossaryText";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../data/baseNodes";
import { StickyNotesCanvas } from "../components/notes/StickyNotesCanvas";
import QuickGlossaryAdd from "../components/glossary/QuickGlossaryAdd";
import { GlossaryPageScope } from "../components/glossary/GlossaryPageScope";

function NotebookButton({ onClick }) {
  return (
    <button
      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-400/50 bg-linear-to-r from-fuchsia-500/10 to-cyan-400/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.15)] transition-colors hover:border-cyan-300 hover:text-white"
      onClick={onClick}
      type="button"
    >
      <Presentation size={14} />
      Apri Appunti Visivi
    </button>
  );
}

export default function NodeKnowledgePage({
  node,
  childNodes = [],
  canEdit = false,
  onClose,
  onBack,
  parentNode,
  onSelectChild,
  onNodeUpdated,
}) {
  const nodeData = node?.data ?? {};
  const categories = nodeData.categories ?? [];
  const primaryCategory = nodeData.primaryCategory ?? "frontend";
  const accent = CATEGORY_COLORS[primaryCategory] ?? "#94a3b8";
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const mainContentRef = useRef(null);
  const draftGuard = useRef(null);
  const onDraftChange = useCallback((guard) => { draftGuard.current = guard; }, []);
  const confirmNavigation = async () => !draftGuard.current || await draftGuard.current();
  const notebookSlug = hasNotebook(nodeData.slug) ? nodeData.slug : null;

  const openNotebook = async () => {
    if (await confirmNavigation()) {
      navigate(`/notebook/${notebookSlug}`, { state: { knowledgeNodeId: node.id } });
    }
  };

  const getDefaultNotePosition = () => {
    const scrollContainer = scrollContainerRef.current;
    const mainContent = mainContentRef.current;
    if (!scrollContainer || !mainContent) return { x_pos: 60, y_pos: 60 };

    const containerRect = scrollContainer.getBoundingClientRect();
    const contentRect = mainContent.getBoundingClientRect();
    const contentOriginX = containerRect.left + scrollContainer.clientLeft;
    const contentOriginY = containerRect.top + scrollContainer.clientTop;
    const preferredX = contentRect.right - contentOriginX + scrollContainer.scrollLeft + 16;
    const rightEdge = scrollContainer.scrollLeft + scrollContainer.clientWidth - 256;

    return {
      x_pos: Math.max(16, Math.min(preferredX, rightEdge)),
      y_pos: scrollContainer.scrollTop + Math.max(24, contentRect.top - contentOriginY + 16),
    };
  };

  return (
    <GlossaryPageScope>
    <section ref={scrollContainerRef} className="relative h-full w-full overflow-y-auto border border-zinc-800 bg-[#0b1120] p-4 font-sans text-zinc-100 shadow-2xl before:absolute before:top-0 before:left-0 before:h-px before:w-full before:bg-linear-to-r before:from-transparent before:via-zinc-700 before:to-transparent sm:p-6 md:p-10">
      {node?.id && (
        <StickyNotesCanvas
          key={node.id}
          boardId={`node-${node.id}`}
          getDefaultPosition={getDefaultNotePosition}
          action={canEdit && <QuickGlossaryAdd className="flex cursor-pointer items-center gap-2 rounded-full border border-cyan-500/20 bg-slate-900 px-4 py-2.5 text-xs font-bold text-cyan-400 shadow-2xl transition-all hover:border-cyan-500/40 hover:bg-slate-800 hover:text-cyan-300 active:scale-95" />}
        />
      )}

      <div className="mx-auto grid w-full items-start gap-5 pb-16 2xl:grid-cols-[minmax(0,1fr)_minmax(0,56rem)_minmax(0,1fr)] 2xl:grid-rows-[auto_minmax(0,1fr)]">
        <div className="min-w-0 2xl:col-start-2 2xl:row-start-1">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {parentNode && (
                <button
                  aria-label={`Torna al nodo ${parentNode.label}`}
                  className="inline-flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  onClick={async () => { if (await confirmNavigation()) onBack?.(); }}
                  title={`Torna al nodo ${parentNode.label}`}
                  type="button"
                >
                  <ArrowLeft size={13} />
                </button>
              )}
              {categories.length > 0 ? (
                categories.map((entry) => (
                  <span
                    className="text-[10px] font-mono tracking-widest font-bold px-2 py-0.5 rounded border uppercase"
                    key={entry.category}
                    style={{
                      color: CATEGORY_COLORS[entry.category] ?? "#94a3b8",
                      borderColor: `${
                        CATEGORY_COLORS[entry.category] ?? "#94a3b8"
                      }66`,
                      backgroundColor: `${
                        CATEGORY_COLORS[entry.category] ?? "#94a3b8"
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
              onClick={async () => { if (await confirmNavigation()) onClose?.(); }}
              type="button"
            >
              <X size={18} />
            </button>
          </div>

          <h2
            className="mb-2 border-b border-zinc-900 pb-2 text-2xl font-extrabold uppercase tracking-tight text-white sm:text-3xl"
            id="node-knowledge-title"
          >
            <GlossaryText>{nodeData.label || "Nodo"}</GlossaryText>
          </h2>

          <p className="mb-6 max-w-3xl text-sm leading-relaxed text-zinc-400 sm:mb-8">
            <GlossaryText>
              {nodeData.description ||
                "Approfondimento strutturato del nodo selezionato."}
            </GlossaryText>
          </p>

          {notebookSlug && (
            <div className="mb-6">
              <NotebookButton onClick={openNotebook} />
            </div>
          )}

          {!canEdit && (
            <p className="mb-6 flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-950/80 px-4 py-3 text-xs font-mono text-zinc-500">
              <Lock size={13} />
              Modalità sola lettura. Accedi con un ruolo editor per modificare
              questi contenuti.
            </p>
          )}
        </div>

        <div className="min-w-0 space-y-3 2xl:sticky 2xl:top-4 2xl:z-10 2xl:col-start-1 2xl:row-span-2 2xl:row-start-1 2xl:self-start">
          <NodeGenericInfo
            canEdit={canEdit}
            nodeData={nodeData}
            nodeId={node?.id}
            onNodeUpdated={onNodeUpdated}
          />
          {childNodes.length > 0 && (
            <aside className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl">
              <h3 className="mb-3 flex items-center gap-2 border-b border-zinc-800 pb-2 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
                <GitFork size={13} style={{ color: accent }} />
                Nodi figli
              </h3>
              <ul className="flex flex-wrap gap-2">
                {childNodes.map((child) => (
                  <li className="min-w-0" key={child.id}>
                    <button
                      className="cursor-pointer rounded border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-left text-xs font-mono text-zinc-300 wrap-break-word transition-all hover:text-white"
                      onClick={async () => { if (await confirmNavigation()) onSelectChild?.(child.id); }}
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
            </aside>
          )}
        </div>

        <div
          ref={mainContentRef}
          className="min-w-0 border-t pt-6 2xl:col-start-2 2xl:row-start-2"
          style={{ borderTopColor: `${accent}22` }}
        >
          <ContentSectionEditor canEdit={canEdit} nodeId={node?.id} onDraftChange={onDraftChange} />
          {notebookSlug === "internet-browser" && (
            <div className="mt-6">
              <NotebookButton onClick={openNotebook} />
            </div>
          )}
        </div>
      </div>
    </section>
    </GlossaryPageScope>
  );
}
