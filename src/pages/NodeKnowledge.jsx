import { ArrowLeft, Lock, X } from "lucide-react";
import ContentSectionEditor from "../components/ContentSectionEditor";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from "../data/baseNodes";

export default function NodeKnowledgePage({
  node,
  canEdit = false,
  onBack,
  onClose,
}) {
  const nodeData = node?.data ?? {};
  const categories = nodeData.categories ?? [];
  const primaryCategory = nodeData.primaryCategory ?? "frontend";
  const accent = CATEGORY_COLORS[primaryCategory] ?? "#94a3b8";

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-sans border border-zinc-900 rounded-xl relative shadow-2xl overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-linear-to-r before:from-transparent before:via-zinc-700 before:to-transparent">
      <header className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
        <button
          className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 hover:text-white transition-colors uppercase border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 rounded-md backdrop-blur-sm"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={14} />
          Torna ai dettagli
        </button>
        <button
          aria-label="Chiudi e torna alla mappa"
          className="text-zinc-500 hover:text-white transition-colors border border-zinc-900 hover:border-zinc-800 p-1.5 rounded-md bg-zinc-950"
          onClick={onClose}
          type="button"
        >
          <X size={16} />
        </button>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-3">
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
                {entry.is_primary ? " · primary" : ""}
              </span>
            ))
          ) : (
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              Senza categoria
            </span>
          )}
        </div>

        <h2
          className="text-3xl font-extrabold tracking-tight text-white mb-2 uppercase border-b border-zinc-900 pb-2"
          id="node-knowledge-title"
        >
          {nodeData.label || "Nodo"}
        </h2>

        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-zinc-400">
          {nodeData.description ||
            "Approfondimento strutturato del nodo selezionato."}
        </p>

        {!canEdit && (
          <p className="mb-6 flex items-center gap-2 rounded-lg border border-zinc-900 bg-zinc-950/80 px-4 py-3 text-xs font-mono text-zinc-500">
            <Lock size={13} />
            Modalità sola lettura. Accedi con un ruolo editor per modificare
            questi contenuti.
          </p>
        )}

        <div style={{ borderTopColor: `${accent}22` }} className="border-t pt-6">
          <ContentSectionEditor canEdit={canEdit} nodeId={node?.id} />
        </div>
      </div>
    </section>
  );
}
