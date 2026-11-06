import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  BookOpen,
  ChevronRight,
  ExternalLink,
  GitFork,
  X,
} from "lucide-react";
import GlossaryText from "./GlossaryText.jsx";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../data/baseNodes";

function RelationTree({
  nodes,
  getRelated,
  direction,
  onSelect,
  accentColor,
  path,
}) {
  return (
    <ul className="space-y-1">
      {nodes.map((relatedNode) => (
        <RelationItem
          accentColor={accentColor}
          direction={direction}
          getRelated={getRelated}
          key={relatedNode.id}
          node={relatedNode}
          onSelect={onSelect}
          path={path}
        />
      ))}
    </ul>
  );
}

function RelationItem({
  node,
  getRelated,
  direction,
  onSelect,
  accentColor,
  path,
}) {
  const [open, setOpen] = useState(false);
  // path evita cicli infiniti in caso di relazioni circolari
  const nextPath = [...path, node.id];
  const nested = getRelated(node.id, direction).filter(
    (entry) => !nextPath.includes(entry.id),
  );
  const expandable = nested.length > 0;

  return (
    <li>
      <div
        className="flex items-center gap-1 rounded border bg-slate-900/60 text-xs font-mono"
        style={{ borderColor: `${accentColor}40` }}
      >
        {expandable ? (
          <button
            aria-expanded={open}
            aria-label={`${open ? "Comprimi" : "Espandi"} ${node.label}`}
            className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center text-slate-400 hover:text-white"
            onClick={() => setOpen((prev) => !prev)}
            type="button"
          >
            <ChevronRight
              className={`transition-transform ${open ? "rotate-90" : ""}`}
              size={14}
            />
          </button>
        ) : (
          <span className="inline-block h-7 w-7 shrink-0" />
        )}
        <button
          className="min-w-0 flex-1 cursor-pointer truncate py-1 pr-2 text-left text-slate-300 transition-colors hover:text-white"
          onClick={() => onSelect?.(node.id)}
          type="button"
        >
          <GlossaryText>{node.label}</GlossaryText>
        </button>
        {expandable && (
          <span className="pr-2 text-[10px] text-slate-500">
            {nested.length}
          </span>
        )}
      </div>
      {expandable && open && (
        <div className="mt-1 ml-3 border-l border-slate-800 pl-2">
          <RelationTree
            accentColor={accentColor}
            direction={direction}
            getRelated={getRelated}
            nodes={nested}
            onSelect={onSelect}
            path={nextPath}
          />
        </div>
      )}
    </li>
  );
}

function RelationGroup({
  title,
  icon,
  nodes,
  empty,
  onSelect,
  accentColor,
  getRelated,
  direction,
  rootId,
}) {
  return (
    <div className="mb-4">
      <h4 className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">
        {icon}
        {title}
        {nodes.length > 0 && (
          <span className="font-mono text-[10px] text-slate-500">
            ({nodes.length})
          </span>
        )}
      </h4>
      {nodes.length === 0 ? (
        <p className="text-xs text-slate-500 italic font-mono">{empty}</p>
      ) : (
        <RelationTree
          accentColor={accentColor}
          direction={direction}
          getRelated={getRelated}
          nodes={nodes}
          onSelect={onSelect}
          path={[rootId]}
        />
      )}
    </div>
  );
}

export default function NodeDetailsModal({
  isOpen,
  onClose,
  node,
  getRelated,
  onSelectRelated,
  onOpenKnowledge,
}) {
  if (!node) return null;

  const parents = getRelated(node.id, "parents");
  const childNodes = getRelated(node.id, "children");

  const nodeInfo = node.data ?? {};
  const categories = nodeInfo.categories ?? [];
  const primaryCategory = nodeInfo.primaryCategory ?? "frontend";
  const accentColor = CATEGORY_COLORS[primaryCategory] ?? "#94a3b8";

  const studyUrls = Array.isArray(nodeInfo.study_urls)
    ? nodeInfo.study_urls
    : [];

  return (
    <Dialog.Root
      modal={false}
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex h-dvh w-full flex-col border-l border-slate-900 bg-slate-950/85 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl focus:outline-hidden sm:max-w-md"
          // La mappa resta interattiva: si chiude solo da X, Esc o click sul fondo mappa
          onInteractOutside={(event) => event.preventDefault()}
          onOpenAutoFocus={(event) => event.preventDefault()}
          style={{ borderColor: `${accentColor}30` }}
        >
          <header className="flex items-start justify-between border-b border-slate-900 bg-slate-950/50 px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 sm:p-4">
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
                        color: CATEGORY_COLORS[entry.category] ?? "#94a3b8",
                        borderColor: `${
                          CATEGORY_COLORS[entry.category] ?? "#94a3b8"
                        }55`,
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
                  <span className="text-slate-500 text-[10px] font-mono">
                    senza categoria
                  </span>
                )}
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Chiudi pannello"
                className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-800 p-2 text-slate-400 transition-colors hover:bg-slate-900/50 hover:text-white sm:h-auto sm:w-auto sm:p-1"
                type="button"
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </header>

          <div className="flex-1 space-y-6 overflow-y-auto px-4 pt-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] font-sans text-sm text-slate-300 sm:p-5">
            <div className="flex items-center gap-2 border-b border-slate-900/50 pb-3">
              <span
                className="text-cyan-400 font-mono font-bold text-lg"
                aria-hidden="true"
              >
                &gt;_
              </span>
              <Dialog.Title className="text-xl font-bold font-mono tracking-tight text-white">
                <GlossaryText>{nodeInfo.label || "Nodo"}</GlossaryText>
              </Dialog.Title>
            </div>

            <button
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-950/30 px-4 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300 transition-colors hover:border-cyan-400 hover:bg-cyan-950/60 hover:text-white"
              onClick={() => onOpenKnowledge(node.id)}
              type="button"
            >
              <BookOpen size={15} />
              Apri approfondimento
            </button>

            <section className="border-t border-slate-900 pt-4">
              <h3 className="flex items-center gap-2 font-mono text-xs text-white uppercase tracking-wider mb-4">
                <GitFork size={14} style={{ color: accentColor }} />
                Mappatura Relazioni
              </h3>
              <RelationGroup
                accentColor={accentColor}
                direction="parents"
                empty="Nessun padre: questo nodo è una radice della mappa."
                getRelated={getRelated}
                icon={<ArrowUp size={12} />}
                key={`parents-${node.id}`}
                nodes={parents}
                onSelect={onSelectRelated}
                rootId={node.id}
                title="Padri tecnici"
              />
              <RelationGroup
                accentColor={accentColor}
                direction="children"
                empty="Nessun figlio collegato."
                getRelated={getRelated}
                icon={<ArrowDown size={12} />}
                key={`children-${node.id}`}
                nodes={childNodes}
                onSelect={onSelectRelated}
                rootId={node.id}
                title="Figli"
              />
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
                        <span>
                          <GlossaryText>{link.label || link.url}</GlossaryText>
                        </span>
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
