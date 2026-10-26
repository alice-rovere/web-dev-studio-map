import * as Tooltip from "@radix-ui/react-tooltip";
import { useGlossary } from "../hooks/useGlossary";

export default function GlossaryText({ children }) {
  const { glossary } = useGlossary();

  if (!glossary || glossary.length === 0) return String(children);

  // Mappa per recuperare le definizioni in modo efficiente (O(1))
  const glossaryByTerm = new Map(
    glossary.map((entry) => [entry.term.toLowerCase(), entry]),
  );

  // Creazione del pattern Regex con i termini ordinati per lunghezza decrescente
  const glossaryPattern = glossary
    .map(({ term }) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((a, b) => b.length - a.length)
    .join("|");

  const text = String(children);
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
    parts.push(text.slice(cursor, start));

    // Inietta il trigger del Tooltip Radix sul termine individuato
    parts.push(
      <Tooltip.Provider key={`${start}-${index}`} delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span
              tabIndex={0}
              className="cursor-help border-b border-dashed border-cyan-400 text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 select-none"
            >
              {match[0]}
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              sideOffset={5}
              className="z-50 max-w-xs rounded border border-cyan-500/30 bg-slate-950/95 px-3 py-2 text-sm text-slate-200 shadow-[0_0_15px_rgba(34,211,238,0.2)] backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none"
            >
              <div className="font-semibold text-cyan-400 mb-0.5">
                {term.term}
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                {term.definition}
              </p>
              <Tooltip.Arrow className="fill-slate-950 border-t border-cyan-500/30" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    cursor = start + match[0].length;
  }

  if (parts.length === 0) return text;
  parts.push(text.slice(cursor));
  return parts;
}
