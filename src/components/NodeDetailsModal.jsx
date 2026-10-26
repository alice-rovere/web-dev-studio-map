import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Code2,
  ExternalLink,
  GitFork,
  Link2,
  X,
} from "lucide-react";
import GlossaryText from "./GlossaryText.jsx";

const emptyDetails = {
  description:
    "Esplora questa tecnologia e il suo ruolo nell'ecosistema dello studio.",
  best_practices: [],
  naming_conventions: [],
  associated_software: [],
  study_urls: [],
};

// Componente helper interno convertito in Tailwind
function RelationGroup({ title, icon, nodes, empty, onSelect, accentColor }) {
  if (nodes.length === 0 && !empty) return null;

  return (
    <div className="mb-4">
      <h4 className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">
        {icon}
        {title}
      </h4>
      {nodes.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {nodes.map((relatedNode) => {
            return (
              <li key={relatedNode.id}>
                <button
                  className="px-2.5 py-1 text-xs font-mono rounded bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
                  style={
                    accentColor
                      ? {
                          borderColor: accentColor,
                          boxShadow: `0 0 5px ${accentColor}20`,
                        }
                      : undefined
                  }
                  onClick={() => onSelect(relatedNode.id)}
                  type="button"
                >
                  {relatedNode.data?.label || relatedNode.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-slate-500 italic font-mono">{empty}</p>
      )}
    </div>
  );
}

export default function NodeDetailsModal({
  isOpen,
  onClose,
  node,
  details,
  glossary,
  relations,
  onSelectRelated,
  onOpenKnowledge,
}) {
  if (!node) return null;

  const nodeInfo = details || emptyDetails;

  // Mappatura dinamica degli accenti Neon Cyberpunk ereditati dalla categoria
  const category = node.data?.category || "frontend";
  const accentColor =
    category === "frontend"
      ? "#7ab8ff"
      : category === "backend"
        ? "#64d9bd"
        : category === "database"
          ? "#c49aff"
          : "#94a3b8";

  const studyUrls = Array.isArray(nodeInfo.study_urls)
    ? nodeInfo.study_urls
    : [];
  const bestPractices =
    typeof nodeInfo.best_practices === "string"
      ? nodeInfo.best_practices.split(/\r?\n/).filter(Boolean)
      : [];

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop animato scuro semitrasparente in linea con l'effetto opacizzazione */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs data-[state=open]:animate-fade-in" />

        {/* Pannello Laterale (Asides/Drawer) ancorato a destra con tema Cyber Glass */}
        <Dialog.Content
          className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-slate-950/85 backdrop-blur-xl border-l border-slate-900 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] flex flex-col focus:outline-hidden"
          style={{ borderColor: `${accentColor}30` }}
        >
          {/* Header del modulo */}
          <header className="p-4 border-b border-slate-900 flex justify-between items-start bg-slate-950/50">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-500 block mb-0.5 animate-pulse">
                &gt;_ NODE INSPECTOR
              </span>
              <div className="flex gap-2 text-xs font-mono">
                <span className="text-slate-400 capitalize">{category}</span>
                {node.data?.subcategory && (
                  <span className="text-slate-600">
                    · {node.data.subcategory}
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

          {/* Contenuto scrollabile */}
          <div className="flex-1 overflow-y-auto p-5 font-sans space-y-6 text-sm text-slate-300">
            {/* Titolo stile Terminale */}
            <div className="flex items-center gap-2 border-b border-slate-900/50 pb-3">
              <span
                className="text-cyan-400 font-mono font-bold text-lg"
                aria-hidden="true"
              >
                &gt;_
              </span>
              <Dialog.Title className="text-xl font-bold font-mono tracking-tight text-white">
                {node.data?.label || node.label}
              </Dialog.Title>
            </div>

            {/* Descrizione con Glossario */}
            <p className="text-slate-400 leading-relaxed font-mono text-xs p-3 bg-slate-900/30 rounded border border-slate-900">
              <GlossaryText glossary={glossary}>
                {nodeInfo.description || emptyDetails.description}
              </GlossaryText>
            </p>

            {/* Pulsante di Approfondimento */}
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

            {/* Sezione Relazioni */}
            {relations && (
              <section className="border-t border-slate-900 pt-4">
                <h3 className="flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider mb-4">
                  <GitFork size={14} style={{ color: accentColor }} />
                  Mappatura Relazioni
                </h3>
                <RelationGroup
                  empty="Nessun prerequisito diretto nella mappa."
                  icon={<ArrowDown size={12} />}
                  nodes={relations.prerequisites || []}
                  onSelect={onSelectRelated}
                  title="Prerequisiti"
                  accentColor={accentColor}
                />
                <RelationGroup
                  icon={<ArrowUp size={12} />}
                  nodes={relations.enables || []}
                  onSelect={onSelectRelated}
                  title="Abilita"
                  accentColor={accentColor}
                />
                <RelationGroup
                  icon={<GitFork size={12} />}
                  nodes={relations.alternatives || []}
                  onSelect={onSelectRelated}
                  title="Alternative"
                  accentColor={accentColor}
                />
                <RelationGroup
                  icon={<Link2 size={12} />}
                  nodes={relations.related || []}
                  onSelect={onSelectRelated}
                  title="Correlati"
                  accentColor={accentColor}
                />
              </section>
            )}

            {/* Best Practices */}
            <section className="border-t border-slate-900 pt-4">
              <h3 className="flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider mb-2">
                <BookOpen size={14} className="text-emerald-400" />
                Best Practice Standard
              </h3>
              <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-400 font-mono">
                {bestPractices.map((practice) => (
                  <li key={practice}>
                    <GlossaryText glossary={glossary}>{practice}</GlossaryText>
                  </li>
                ))}
              </ul>
            </section>

            {/* Naming Convention */}
            <section className="border-t border-slate-900 pt-4">
              <h3 className="flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider mb-2">
                <Code2 size={14} className="text-purple-400" />
                Naming Convention
              </h3>
              <ul className="list-inside list-disc space-y-1.5 text-xs text-slate-400 font-mono">
                {(nodeInfo.naming_conventions || []).map((convention) => (
                  <li key={convention}>
                    <GlossaryText glossary={glossary}>
                      {convention}
                    </GlossaryText>
                  </li>
                ))}
              </ul>
            </section>
            {/* Sezione Collegamenti / Link Esterni */}
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
                        <span>{link.label}</span>
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

          {/* Footer fisso del pannello */}
          <footer className="p-3 border-t border-slate-900 bg-slate-950 text-center font-mono text-[10px] text-slate-600 tracking-widest flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            DEV CORE MAP SYSTEM <span className="text-slate-800">·</span>{" "}
            INSPECTOR ONLINE
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
