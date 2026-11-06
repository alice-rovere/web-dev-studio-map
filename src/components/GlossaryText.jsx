import * as Tooltip from "@radix-ui/react-tooltip";
import {
  useContext,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import { useGlossary } from "../hooks/useGlossary";
import { GlossaryPageContext } from "../context/GlossaryPageContext";

function GlossaryOccurrence({ term, text, scope }) {
  const ref = useRef(null);
  const store = scope?.store;
  const isFirst = useSyncExternalStore(
    store?.subscribe ?? (() => () => {}),
    () => (store ? store.isFirst(ref.current, term.id) : true),
    () => true,
  );

  useLayoutEffect(() => {
    if (!store || !ref.current) return undefined;
    return store.register(ref.current, term.id);
  }, [store, term.id]);

  return (
    <span ref={ref}>
      {isFirst ? (
        <Tooltip.Provider delayDuration={200}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              {scope ? (
                <button
                  className="cursor-pointer border-b border-dashed border-cyan-400 text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200"
                  onClick={(event) => scope.openTerm(term, event.currentTarget)}
                  type="button"
                >
                  {text}
                </button>
              ) : (
                <span
                  tabIndex={0}
                  className="cursor-help border-b border-dashed border-cyan-400 text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 select-none"
                >
                  {text}
                </span>
              )}
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                sideOffset={5}
                className="z-50 max-w-xs rounded border border-cyan-500/30 bg-slate-950/95 px-3 py-2 text-sm text-slate-200 shadow-[0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-md"
              >
                <div className="font-semibold text-cyan-400 mb-0.5">
                  {term.term}
                </div>
                <p className="line-clamp-3 whitespace-pre-wrap wrap-break-word text-xs leading-relaxed text-slate-300">
                  {term.definition}
                </p>
                {scope && (
                  <p className="mt-2 text-[10px] text-cyan-300">
                    Seleziona il termine per leggere la definizione completa.
                  </p>
                )}
                <Tooltip.Arrow className="fill-slate-950 border-t border-cyan-500/30" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      ) : (
        text
      )}
    </span>
  );
}

export default function GlossaryText({ children, renderText }) {
  const { glossary } = useGlossary();
  const scope = useContext(GlossaryPageContext);

  const text = String(children);
  const render = renderText ?? ((start, end) => text.slice(start, end));
  if (!glossary || glossary.length === 0) return render(0, text.length);

  // Mappa per recuperare le definizioni in modo efficiente (O(1))
  const glossaryByTerm = new Map(
    glossary.map((entry) => [entry.term.toLowerCase(), entry]),
  );

  // Creazione del pattern Regex con i termini ordinati per lunghezza decrescente
  const glossaryPattern = glossary
    .map(({ term }) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|");

  const matches = text.matchAll(
    new RegExp(
      `(?<![\\p{L}\\p{N}_])(${glossaryPattern})(?![\\p{L}\\p{N}_])`,
      "giu",
    ),
  );

  const parts = [];
  let cursor = 0;

  for (const [index, match] of Array.from(matches).entries()) {
    const start = match.index;
    const termKey = match[0].toLowerCase();
    const term = glossaryByTerm.get(termKey);
    if (!term) continue;

    // Aggiunge la parte di testo prima del match
    parts.push(render(cursor, start));

    parts.push(
      <GlossaryOccurrence
        key={`${start}-${index}`}
        scope={scope}
        term={term}
        text={render(start, start + match[0].length)}
      />,
    );
    cursor = start + match[0].length;
  }

  if (parts.length === 0) return render(0, text.length);
  parts.push(render(cursor, text.length));
  return parts;
}
