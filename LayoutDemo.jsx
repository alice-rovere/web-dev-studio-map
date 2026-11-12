import { useState } from "react";
import GlossaryText from "./src/components/glossary/GlossaryText";

export function BentoGridInfographic({ children }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function SplitScreenInfographic({ columns, rows }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 text-center text-xs font-bold uppercase tracking-wider">
        {columns.map((column, index) => (
          <div
            className={`rounded-lg border px-3 py-2 ${index === 0 ? "border-orange-400/40 bg-orange-500/10 text-orange-200" : "border-sky-400/40 bg-sky-500/10 text-sky-200"}`}
            key={`${column}-${index}`}
          >
            <GlossaryText>{column}</GlossaryText>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {rows.map((row, index) => (
          <div
            className="grid grid-cols-2 gap-3 rounded-xl border border-slate-700/70 bg-slate-950/60 p-3"
            key={index}
          >
            {columns.map((column, cellIndex) => (
              <p
                className={`min-w-0 text-sm leading-6 wrap-break-word ${cellIndex === 0 ? "text-orange-100" : "text-sky-100"}`}
                key={`${column}-${cellIndex}`}
              >
                <GlossaryText>{String(row[cellIndex] ?? "")}</GlossaryText>
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FlowchartInfographic({ items }) {
  return (
    <ol className="space-y-2">
      {items.map((item, index) => (
        <li className="relative flex gap-3" key={`${index}-${item}`}>
          <div className="flex flex-col items-center">
            <span className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/15 font-mono text-xs font-bold text-emerald-200">
              {String(index + 1).padStart(2, "0")}
            </span>
            {index < items.length - 1 && (
              <span
                aria-hidden="true"
                className="my-1 w-px grow bg-emerald-400/30"
              />
            )}
          </div>
          <p className="mb-2 min-w-0 flex-1 rounded-lg border border-slate-700/70 bg-slate-950/60 p-3 text-sm leading-6 text-slate-200 wrap-break-word">
            <GlossaryText>{item}</GlossaryText>
          </p>
        </li>
      ))}
    </ol>
  );
}

export function InteractiveRadialInfographic({ title, items }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItem = items[selectedIndex];
  const radius = 39;

  return (
    <div className="mx-auto aspect-square w-full max-w-md">
      <div className="relative h-full w-full">
        <div
          aria-hidden="true"
          className="absolute inset-[18%] rounded-full border border-dashed border-slate-700"
        />
        <div className="absolute top-1/2 left-1/2 z-10 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-hidden rounded-full border border-orange-400/50 bg-slate-900 p-3 text-center shadow-xl shadow-orange-950/30 sm:h-40 sm:w-40">
          {selectedItem ? (
            <>
              <p className="line-clamp-2 text-xs font-bold text-orange-200">
                <GlossaryText>{selectedItem.title}</GlossaryText>
              </p>
              <p className="mt-1 line-clamp-4 text-[10px] leading-4 text-slate-300">
                <GlossaryText>{selectedItem.description}</GlossaryText>
              </p>
            </>
          ) : (
            <>
              <p className="line-clamp-3 text-sm font-bold text-white sm:text-base">
                <GlossaryText>{title}</GlossaryText>
              </p>
              <p className="mt-1 text-[10px] text-slate-400">
                Seleziona un concetto
              </p>
            </>
          )}
        </div>
        {items.map((item, index) => {
          const angle = (2 * Math.PI * index) / items.length - Math.PI / 2;
          const left = 50 + radius * Math.cos(angle);
          const top = 50 + radius * Math.sin(angle);
          const isSelected = selectedIndex === index;

          return (
            <button
              aria-pressed={isSelected}
              className={`absolute z-20 flex h-16 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border px-2 text-center transition-colors sm:h-18 sm:w-28 ${isSelected ? "border-orange-400 bg-slate-800" : "border-slate-700 bg-slate-900 hover:border-orange-400/60"}`}
              key={`${item.title}-${index}`}
              onClick={() => setSelectedIndex(isSelected ? null : index)}
              style={{ left: `${left}%`, top: `${top}%` }}
              type="button"
            >
              <span className="line-clamp-2 text-xs font-bold text-slate-100">
                <GlossaryText>{item.title}</GlossaryText>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ScrollytellingSticky({ chapters }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeChapter = chapters[activeIndex];

  return (
    <div className="grid gap-4 md:grid-cols-2 md:items-start">
      <ol className="space-y-2">
        {chapters.map((chapter, index) => (
          <li key={`${chapter.date}-${chapter.title}-${index}`}>
            <button
              aria-pressed={activeIndex === index}
              className={`w-full rounded-xl border p-3 text-left transition-colors ${activeIndex === index ? "border-amber-400/60 bg-amber-500/10" : "border-slate-700/70 bg-slate-950/40 hover:border-slate-500"}`}
              onClick={() => setActiveIndex(index)}
              onMouseEnter={() => setActiveIndex(index)}
              type="button"
            >
              <span className="font-mono text-xs font-semibold text-amber-300">
                <GlossaryText>{chapter.date}</GlossaryText>
              </span>
              <span className="mt-1 block text-sm font-semibold text-white">
                <GlossaryText>{chapter.title}</GlossaryText>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <div className="rounded-xl border border-slate-700/70 bg-slate-950/70 p-4 md:sticky md:top-24">
        <p className="font-mono text-xs uppercase tracking-wider text-amber-300">
          {activeChapter?.date}
        </p>
        <h4 className="mt-2 text-base font-bold text-white">
          <GlossaryText>{activeChapter?.title}</GlossaryText>
        </h4>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          <GlossaryText>{activeChapter?.text}</GlossaryText>
        </p>
      </div>
    </div>
  );
}
