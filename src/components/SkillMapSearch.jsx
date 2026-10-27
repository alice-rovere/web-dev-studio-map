import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BookOpen, Search, X } from "lucide-react";

import { useGlossary } from "../hooks/useGlossary";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "../data/baseNodes";

const MAX_RESULTS_PER_GROUP = 12;

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return [value];
  return [];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, terms }) {
  const value = String(text ?? "");

  if (!terms.length) return value;

  const pattern = terms.map(escapeRegExp).join("|");
  const parts = value.split(new RegExp(`(${pattern})`, "gi"));

  return parts.map((part, index) =>
    terms.includes(part.toLowerCase()) ? (
      <mark
        className="rounded bg-cyan-500/20 px-0.5 text-cyan-200"
        key={`${part}-${index}`}
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

export default function SkillMapSearch({ graph, onSelectNode }) {
  const { glossary } = useGlossary();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedTermId, setSelectedTermId] = useState(null);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const itemRefs = useRef([]);

  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalize(deferredQuery);
  const queryTokens = useMemo(
    () => normalizedQuery.split(/\s+/).filter(Boolean),
    [normalizedQuery],
  );

  const nodeResults = useMemo(() => {
    if (!queryTokens.length) return [];

    return [...graph.nodesById.values()]
      .filter((node) => {
        const haystack = normalize(
          [
            node.label,
            node.description,
            ...toList(node.best_practices),
            ...toList(node.naming_conventions),
          ].join(" "),
        );

        return queryTokens.every((token) => haystack.includes(token));
      })
      .sort((a, b) => {
        const aStarts = normalize(a.label).startsWith(queryTokens[0]);
        const bStarts = normalize(b.label).startsWith(queryTokens[0]);
        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return a.label.localeCompare(b.label, "it", { sensitivity: "base" });
      });
  }, [graph, queryTokens]);

  const termResults = useMemo(() => {
    if (!queryTokens.length) return [];

    return glossary.filter((entry) => {
      const haystack = normalize(`${entry.term} ${entry.definition}`);
      return queryTokens.every((token) => haystack.includes(token));
    });
  }, [glossary, queryTokens]);

  const visibleNodeResults = useMemo(
    () => nodeResults.slice(0, MAX_RESULTS_PER_GROUP),
    [nodeResults],
  );
  const visibleTermResults = useMemo(
    () => termResults.slice(0, MAX_RESULTS_PER_GROUP),
    [termResults],
  );

  const results = useMemo(
    () => [
      ...visibleNodeResults.map((node) => ({ type: "node", id: node.id })),
      ...visibleTermResults.map((term) => ({ type: "term", id: term.id })),
    ],
    [visibleNodeResults, visibleTermResults],
  );

  const hasMoreResults =
    nodeResults.length > MAX_RESULTS_PER_GROUP ||
    termResults.length > MAX_RESULTS_PER_GROUP;

  const close = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(0);
    setSelectedTermId(null);
  }, []);

  const handleSelectResult = useCallback(
    (result, index) => {
      if (!result) return;

      setActiveIndex(index);

      if (result.type === "node") {
        onSelectNode(result.id);
        close();
        return;
      }

      setSelectedTermId((previous) =>
        previous === result.id ? null : result.id,
      );
    },
    [close, onSelectNode],
  );

  function handleQueryChange(event) {
    setQuery(event.target.value);
    setActiveIndex(0);
    setSelectedTermId(null);
  }

  function handleInputKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((previous) => (previous + 1) % results.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex(
        (previous) => (previous - 1 + results.length) % results.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      handleSelectResult(results[activeIndex], activeIndex);
    }
  }

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        close();
      }
    }

    function handleWindowKeyDown(event) {
      if (event.key === "Escape") close();
    }

    if (!isOpen) return undefined;

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleWindowKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
  }, [isOpen, close]);

  useEffect(() => {
    function handleShortcut(event) {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        if (isOpen) close();
        else setIsOpen(true);
      }
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [close, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const timer = setTimeout(() => inputRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`flex min-h-9 cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-mono backdrop-blur-md transition-all sm:min-h-0 sm:px-3 ${
          isOpen
            ? "border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
            : "border-slate-700/60 bg-slate-900/70 text-slate-400 hover:border-cyan-500/40 hover:text-slate-200"
        }`}
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        title="Cerca nodi e termini del glossario (Ctrl+K)"
        type="button"
      >
        <Search size={12} />
        <span className="hidden sm:inline">Cerca</span>
        <kbd className="hidden rounded border border-slate-700/70 px-1 text-[9px] text-slate-500 lg:inline">
          Ctrl K
        </kbd>
      </button>

      {isOpen && (
        <div
          aria-label="Ricerca nodi e glossario"
          className="fixed left-3 right-3 top-[calc(env(safe-area-inset-top)_+_4.25rem)] z-50 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950/95 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%_+_8px)] sm:w-[min(380px,calc(100vw-2rem))]"
          role="dialog"
        >
          <div className="flex items-center gap-2 border-b border-slate-800/80 px-3 py-2.5">
            <Search className="shrink-0 text-cyan-400" size={14} />
            <input
              aria-label="Cerca nodi e termini"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-xs font-mono text-slate-200 outline-none placeholder:text-slate-600"
              onChange={handleQueryChange}
              onKeyDown={handleInputKeyDown}
              placeholder="Cerca un nodo o un termine..."
              ref={inputRef}
              spellCheck={false}
              type="text"
              value={query}
            />
            {query && (
              <button
                aria-label="Cancella ricerca"
                className="shrink-0 rounded p-0.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                onClick={() => {
                  setQuery("");
                  setActiveIndex(0);
                  setSelectedTermId(null);
                  inputRef.current?.focus();
                }}
                type="button"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="max-h-[min(360px,45dvh)] overflow-y-auto p-2">
            {!normalizedQuery && (
              <p className="px-2.5 py-6 text-center text-[11px] font-mono text-slate-500">
                Cerca tra i nodi della mappa e i termini del glossario.
              </p>
            )}

            {normalizedQuery && results.length === 0 && (
              <p className="px-2.5 py-6 text-center text-[11px] font-mono text-slate-500">
                Nessun risultato per “{deferredQuery.trim()}”.
              </p>
            )}

            {visibleNodeResults.length > 0 && (
              <section className="mb-2">
                <h3 className="px-2.5 pb-1 pt-1 text-[9px] font-mono uppercase tracking-[0.18em] text-slate-500">
                  Nodi · {nodeResults.length}
                </h3>
                <ul className="space-y-0.5" role="listbox">
                  {visibleNodeResults.map((node, index) => {
                    const color =
                      CATEGORY_COLORS[node.primaryCategory] ?? "#94a3b8";

                    return (
                      <li key={node.id}>
                        <button
                          aria-selected={activeIndex === index}
                          className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                            activeIndex === index
                              ? "bg-slate-800/80"
                              : "hover:bg-slate-900/70"
                          }`}
                          onClick={() => handleSelectResult(results[index], index)}
                          onMouseEnter={() => setActiveIndex(index)}
                          ref={(element) => {
                            itemRefs.current[index] = element;
                          }}
                          role="option"
                          type="button"
                        >
                          <span
                            className="mt-1 h-2 w-2 shrink-0 rounded-full"
                            style={{
                              backgroundColor: color,
                              boxShadow: `0 0 6px ${color}90`,
                            }}
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-mono text-slate-200">
                              <Highlight text={node.label} terms={queryTokens} />
                            </span>
                            <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                              {CATEGORY_LABELS[node.primaryCategory] ??
                                node.primaryCategory}
                              {node.description ? " · " : ""}
                              <Highlight
                                text={node.description}
                                terms={queryTokens}
                              />
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {visibleTermResults.length > 0 && (
              <section>
                <h3 className="px-2.5 pb-1 pt-1 text-[9px] font-mono uppercase tracking-[0.18em] text-slate-500">
                  Glossario · {termResults.length}
                </h3>
                <ul className="space-y-0.5" role="listbox">
                  {visibleTermResults.map((term, index) => {
                    const globalIndex = visibleNodeResults.length + index;
                    const isActive = activeIndex === globalIndex;
                    const isExpanded = selectedTermId === term.id;

                    return (
                      <li key={term.id}>
                        <button
                          aria-expanded={isExpanded}
                          aria-selected={isActive}
                          className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${
                            isActive
                              ? "bg-slate-800/80"
                              : "hover:bg-slate-900/70"
                          }`}
                          onClick={() =>
                            handleSelectResult(results[globalIndex], globalIndex)
                          }
                          onMouseEnter={() => setActiveIndex(globalIndex)}
                          ref={(element) => {
                            itemRefs.current[globalIndex] = element;
                          }}
                          role="option"
                          type="button"
                        >
                          <BookOpen
                            className="mt-0.5 shrink-0 text-cyan-400"
                            size={12}
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-mono text-cyan-200">
                              <Highlight text={term.term} terms={queryTokens} />
                            </span>
                            <span
                              className={`mt-0.5 block text-[10px] leading-relaxed text-slate-400 ${
                                isExpanded ? "" : "line-clamp-2"
                              }`}
                            >
                              <Highlight
                                text={term.definition}
                                terms={queryTokens}
                              />
                            </span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {hasMoreResults && (
              <p className="px-2.5 py-2 text-center text-[10px] font-mono text-slate-500">
                Affina la ricerca per vedere gli altri risultati.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-800/80 px-3 py-1.5 text-[9px] font-mono text-slate-600">
            <span>↑↓ naviga · Invio seleziona</span>
            <span>Esc chiudi</span>
          </div>
        </div>
      )}
    </div>
  );
}
