import { useEffect, useRef } from "react";
import { getExplorableSteps } from "../../notebooks/computerExplorerParts.js";
import { ComputerHardwareMap } from "./ComputerSystemDiagram.jsx";

export default function ComputerExplorer({ steps, stepId, onSelect, onClose, reducedMotion }) {
  const availableSteps = getExplorableSteps(steps);
  const selected = availableSteps.find((step) => step.id === stepId)?.id ?? availableSteps[0]?.id;
  const closeRef = useRef(null);
  const selectedStep = availableSteps.find((step) => step.id === selected);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const selectPart = (id) => {
    if (!availableSteps.some((step) => step.id === id)) return;
    onSelect?.(id);
  };

  return (
    <div
      aria-labelledby="computer-explorer-title"
      aria-modal="true"
      className="fixed inset-0 z-60 flex flex-col bg-[#0b1120] text-slate-100"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") event.stopPropagation();
        if (event.key === "Tab") {
          const focusable = event.currentTarget.querySelectorAll("button:not(:disabled), [href], [tabindex]:not([tabindex='-1'])");
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
          else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
        }
      }}
      role="dialog"
    >
      <header className="flex items-center justify-between gap-3 border-b border-cyan-500/20 px-4 py-3">
        <div>
          <h2 className="text-base font-bold text-cyan-200" id="computer-explorer-title">Esplora i componenti del PC</h2>
          <p className="text-xs text-slate-400">Schema SVG interattivo · modello didattico, non in scala</p>
        </div>
        <button ref={closeRef} type="button" onClick={onClose} className="rounded-lg border border-slate-600 px-3 py-2 text-sm hover:bg-slate-800">
          Torna agli appunti
        </button>
      </header>
      <div className="flex min-h-0 grow flex-col overflow-y-auto lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:overflow-hidden">
        <section className="flex shrink-0 flex-col gap-3 p-4 lg:min-h-0 lg:overflow-y-auto" aria-label="Schema interattivo dei componenti">
          <p className="text-sm text-slate-300">Seleziona un componente per evidenziare i collegamenti con gli altri elementi.</p>
          <div className="min-w-0">
            <ComputerHardwareMap stepId={selected} onSelect={selectPart} reducedMotion={reducedMotion} />
          </div>
          <button
            type="button"
            onClick={() => selectPart("scheda-madre")}
            disabled={!availableSteps.some((step) => step.id === "scheda-madre")}
            className="self-start rounded border border-cyan-500/40 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-500/10 disabled:opacity-40"
          >
            Vista d’insieme
          </button>
        </section>
        <aside className="shrink-0 space-y-4 border-t border-cyan-500/20 p-4 lg:min-h-0 lg:overflow-y-auto lg:border-t-0 lg:border-l">
          <h3 className="font-semibold text-cyan-200">Componenti</h3>
          <div className="flex flex-wrap gap-2" aria-label="Seleziona un componente">
            {availableSteps.map((step) => (
              <button
                key={step.id}
                type="button"
                aria-pressed={selected === step.id}
                onClick={() => selectPart(step.id)}
                className={`rounded-lg border px-3 py-2 text-left text-xs ${selected === step.id ? "border-cyan-400 bg-cyan-400/15 text-cyan-100" : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
              >
                {step.title}
              </button>
            ))}
          </div>
          {selectedStep ? (
            <section aria-live="polite" className="rounded-xl border border-fuchsia-500/20 bg-slate-900/70 p-4">
              <h3 className="font-semibold text-fuchsia-200">{selectedStep.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedStep.description}</p>
              {selected === "batteria" && <p className="mt-2 text-xs text-slate-400">Batteria illustrata separatamente come esempio di portatile; nei computer fissi l’alimentazione è diversa.</p>}
            </section>
          ) : <p className="text-sm text-slate-400">Seleziona un componente dall’elenco.</p>}
        </aside>
      </div>
    </div>
  );
}
