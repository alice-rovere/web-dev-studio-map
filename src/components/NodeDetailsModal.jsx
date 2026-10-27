import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Code2,
  ExternalLink,
  GitFork,
  X,
} from "lucide-react";
import GlossaryText from "./GlossaryText.jsx";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from "../data/baseNodes";

const emptyDetails = {
  description:
    "Esplora questa tecnologia e il suo ruolo nell'ecosistema dello studio.",
  best_practices: [],
  naming_conventions: [],
  study_urls: [],
};

function RelationGroup({ title, icon, nodes, empty, onSelect, accentColor }) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="mb-4">
        <h4 className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">
          {icon}
          {title}
        </h4>
        <p className="text-xs text-slate-500 italic font-mono">{empty}</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h4 className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">
        {icon}
        {title}
      </h4>
      <ul className="flex flex-wrap gap-2">
        {nodes.map((relatedNode) => (
          <li key={relatedNode.id}>
            <button
              className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
              style={{
                borderColor: `${accentColor}55`,
                boxShadow: `0 0 5px ${accentColor}20`,
              }}
              onClick={() => onSelect?.(relatedNode.id)}
              type="button"
            >
              {relatedNode.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value.split(/\r?\n/).filter((entry) => entry.trim().length > 0);
  }
  return [];
}

export default function NodeDetailsModal({
  isOpen,
  onClose,
  node,
  parents = [],
  childNodes = [],
  onSelectRelated,
  onOpenKnowledge,
}) {
  if (!node) return null;

  const nodeInfo = node.data ?? emptyDetails;
  const categories = nodeInfo.categories ?? [];
  const primaryCategory = nodeInfo.primaryCategory ?? "frontend";
  const accentColor = CATEGORY_COLORS[primaryCategory] ?? "#94a3b8";

  const studyUrls = Array.isArray(nodeInfo.study_urls)
    ? nodeInfo.study_urls
    : [];
  const bestPractices = normalizeList(nodeInfo.best_practices);
  const namingConventions = normalizeList(nodeInfo.naming_conventions);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs data-[state=open]:animate-fade-in" />

        <Dialog.Content
          className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-slate-950/85 backdrop-blur-xl border-l border-slate-900 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] flex flex-col focus:outline-hidden"
          style={{ borderColor: `${accentColor}30` }}
        >
          <header className="p-4 border-b border-slate-900 flex justify-between items-start bg-slate-950/50">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-500 block mb-0.5 animate-pulse">
                &gt;_ NODE INSPECTOR
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {categories.length > 0 ? (
                  categories.map((entry) => (
                    <span
                      className="rounded border px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider"
                      key={entry.category}
                      style={{
                        color:
                          CATEGORY_COLORS[entry.category] ?? "#94a3b8",
                        borderColor: `${CATEGORY_COLORS[entry.category] ?? "#94a3b8"
                          }55`,
                        backgroundColor: `${CATEGORY_COLORS[entry.category] ?? "#94a3b8"
                          }12`,
                      }}
                    >
                      {CATEGORY_LABELS[entry.category] ?? entry.category}
                      {entry.is_primary ? " · primary" : ""}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 text-[10px] font-mono">
                    senza categoria
                  </span>
                )}
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Chiudi pannello"
                className="p-1 rounded border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900/50 transition-colors cursor-pointer"
                type="button"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </header>

          <div className="flex-1 overflow-y-auto p-5 font-sans space-y-6 text-sm text-slate-300">
            <div className="flex items-center gap-2 border-b border-slate-900/50 pb-3">
              <span
                className="text-cyan-400 font-mono font-bold text-lg"
                aria-hidden="true"
              >
                &gt;_
              </span>
              <Dialog.Title className="text-xl font-bold font-mono tracking-tight text-white">
                {nodeInfo.label || "Nodo"}
              </Dialog.Title>
            </div>

            <p className="text-slate-400 leading-relaxed font-mono text-xs p-3 bg-slate-900/30 rounded border border-slate-900">
              <GlossaryText>
                {nodeInfo.description || emptyDetails.description}
              </GlossaryText>
            </p>

            <button
              className="w-full flex items-center justify-between p-3 rounded font-mono text-xs border border-cyan-500/20 bg-cyan-950/10 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all cursor-pointer group"
              onClick={onOpenKnowledge}
              type="button"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={14} />
                <span>APRI APPROFONDIMENTO LOGICO</span>
              </div>
              <ArrowRight
                size={14}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </button>

            <section className="border-t border-slate-900 pt-4">
              <h3 className="flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider mb-4">
                <GitFork size={14} style={{ color: accentColor }} />
                Mappatura Relazioni
              </h3>
              <RelationGroup
                accentColor={accentColor}
                empty="Nessun padre: questo nodo è una radice della mappa."
                icon={<ArrowUp size={12} />}
                nodes={parents}
                onSelect={onSelectRelated}
                title="Padri tecnici"
              />
              <RelationGroup
                accentColor={accentColor}
                empty="Nessun figlio collegato."
                icon={<ArrowDown size={12} />}
                nodes={childNodes}
                onSelect={onSelectRelated}
                title="Figli"
              />
            </section>

            <section className="border-t border-slate-900 pt-4">
              <h3 className="flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider mb-2">
                <BookOpen size={14} className="text-emerald-400" />
                Best Practice Standard
              </h3>
              {bestPractices.length > 0 ? (
                <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-400 font-mono">
                  {bestPractices.map((practice) => (
                    <li key={practice}>
                      <GlossaryText>{practice}</GlossaryText>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 font-mono italic">
                  Nessuna best practice registrata.
                </p>
              )}
            </section>

            <section className="border-t border-slate-900 pt-4">
              <h3 className="flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider mb-2">
                <Code2 size={14} className="text-purple-400" />
                Naming Convention
              </h3>
              {namingConventions.length > 0 ? (
                <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-400 font-mono">
                  {namingConventions.map((convention) => (
                    <li key={convention}>
                      <GlossaryText>{convention}</GlossaryText>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 font-mono italic">
                  Nessuna naming convention registrata.
                </p>
              )}
            </section>

            <section className="border-t border-slate-900 pt-4">
              <h3 className="flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider mb-2">
                <ExternalLink size={14} className="text-blue-400" />
                Collegamenti Esterni
              </h3>
              {studyUrls.length > 0 ? (
                <ul className="space-y-2">
                  {studyUrls.map((link) => (
                    <li key={link.url}>
                      <a
                        href={link.url}
                        rel="noreferrer"
                        target="_blank"
                        className="flex items-center justify-between p-2 rounded bg-slate-900/40 border border-slate-900 text-xs text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                      >
                        <span>{link.label || link.url}</span>
                        <ExternalLink size={12} />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500 font-mono italic">
                  Nessun link disponibile per questo modulo.
                </p>
              )}
            </section>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
