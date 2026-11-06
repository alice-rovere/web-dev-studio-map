import { Code2 } from "lucide-react";
import { PHASE_ICONS } from "../../notebooks/phaseIcons.js";

function PanelPreview({ panel }) {
  const content =
    panel.kind === "table"
      ? `${panel.columns?.length ?? 0} colonne · ${panel.rows?.length ?? 0} righe`
      : panel.kind === "code"
        ? String(panel.content ?? "")
            .split("\n")
            .slice(0, 3)
            .join("\n")
        : panel.content;

  return (
    <div className="min-w-0 rounded-md border border-cyan-500/15 bg-black/30 p-2">
      <p className="mb-1 truncate font-mono text-[9px] uppercase tracking-wider text-fuchsia-300/80">
        {panel.label || "Pannello"}
      </p>
      <pre className="max-h-16 overflow-hidden whitespace-pre-wrap wrap-break-word font-mono text-[10px] leading-4 text-zinc-400">
        {content || "Il contenuto del pannello apparirà qui."}
      </pre>
    </div>
  );
}

export default function NotebookEditorPreview({
  config,
  stepIndex,
  onStepSelect,
}) {
  const steps = config.steps ?? [];
  const phases = config.phases ?? [];
  const selectedIndex = Math.min(stepIndex, Math.max(steps.length - 1, 0));
  const currentStep = steps[selectedIndex];
  const phaseStep = new Map();
  steps
    .slice(0, selectedIndex + 1)
    .forEach((step) => phaseStep.set(step.phase, step));

  return (
    <aside className="order-first space-y-3 lg:sticky lg:top-4 lg:order-last lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
      <div>
        <p className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-300">
          Anteprima della struttura
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          Le modifiche si riflettono qui. Le animazioni personalizzate sono
          visibili nell’anteprima completa.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-fuchsia-500/20 bg-[#0b1120] shadow-xl">
        <header className="border-b border-fuchsia-500/20 bg-slate-950/50 px-3 py-3">
          <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-cyan-500">
            1 · Intestazione · titolo e sottotitolo
          </p>
          <h2 className="truncate font-mono text-sm font-bold uppercase tracking-wider text-cyan-200">
            {config.title || "Titolo del percorso"}
          </h2>
          <p className="mt-1 truncate font-mono text-[10px] text-fuchsia-300/70">
            {config.subtitle || "Sottotitolo del percorso"}
          </p>
        </header>

        <div className="grid min-h-0 sm:grid-cols-[minmax(105px,0.36fr)_minmax(0,1fr)]">
          <nav
            aria-label="Anteprima passaggi"
            className="space-y-1 border-b border-fuchsia-500/15 p-2 sm:border-r sm:border-b-0"
          >
            <p className="px-1 pb-1 font-mono text-[9px] uppercase tracking-widest text-fuchsia-300/70">
              2 · Navigazione · passaggi
            </p>
            {steps.length ? (
              steps.map((step, index) => (
                <button
                  aria-current={index === selectedIndex ? "step" : undefined}
                  className={`flex w-full items-start gap-2 rounded-md border px-2 py-1.5 text-left ${
                    index === selectedIndex
                      ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-100"
                      : "border-transparent text-slate-500 hover:bg-white/5"
                  }`}
                  key={step.id}
                  onClick={() => onStepSelect(index)}
                  type="button"
                >
                  <span className="font-mono text-[9px]">{index + 1}</span>
                  <span className="truncate font-mono text-[9px]">
                    {step.title || "Nuovo passaggio"}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-1 text-[10px] text-slate-500">
                Aggiungi un passaggio.
              </p>
            )}
          </nav>

          <div className="min-w-0 space-y-2 p-3">
            <div>
              <p className="mb-1 font-mono text-[9px] uppercase tracking-widest text-fuchsia-300/70">
                3 · Titolo e descrizione del passaggio
              </p>
              <h3 className="font-mono text-xs font-bold text-fuchsia-200">
                {currentStep?.title || "Titolo del passaggio"}
              </h3>
              <p className="mt-1 line-clamp-3 text-[10px] leading-relaxed text-zinc-400">
                {currentStep?.description ||
                  "La descrizione spiega cosa succede in questo passaggio."}
              </p>
            </div>
            <div className="flex min-h-12 items-center justify-center rounded-lg border border-dashed border-cyan-500/25 bg-cyan-500/5 px-2 text-center font-mono text-[9px] text-cyan-200/60">
              Illustrazione ·{" "}
              {currentStep?.illustration &&
              currentStep.illustration !== "generic"
                ? currentStep.illustration
                : "area animata o schema generico"}
            </div>
          </div>
        </div>

        <section className="border-t border-fuchsia-500/15 p-2">
          <p className="mb-2 font-mono text-[9px] uppercase tracking-widest text-cyan-500">
            4 · Fasi e icone · colonne con pannelli
          </p>
          {phases.length ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {phases.map((phase) => {
                const Icon = PHASE_ICONS[phase.icon] ?? Code2;
                const shown = phaseStep.get(phase.id);
                const active = phase.id === currentStep?.phase;
                return (
                  <section
                    className={`min-w-0 rounded-lg border p-2 ${
                      active
                        ? "border-cyan-400/50 bg-cyan-400/5"
                        : "border-slate-800 bg-slate-900/40"
                    }`}
                    key={phase.id}
                  >
                    <div className="flex min-w-0 items-center gap-1.5">
                      <Icon
                        aria-hidden="true"
                        className="shrink-0 text-cyan-300"
                        size={13}
                      />
                      <h4 className="truncate font-mono text-[10px] font-bold text-slate-200">
                        {phase.label || "Fase senza titolo"}
                      </h4>
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[9px] text-slate-500">
                      {phase.hint || "Descrizione breve"}
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {shown?.panels?.length ? (
                        shown.panels.map((panel, index) => (
                          <PanelPreview
                            key={`${shown.id}-${index}`}
                            panel={panel}
                          />
                        ))
                      ) : (
                        <p className="rounded border border-dashed border-slate-800 p-2 font-mono text-[9px] text-slate-600">
                          Pannelli in attesa…
                        </p>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <p className="text-[10px] text-slate-500">
              Aggiungi una fase per creare le colonne del diagramma.
            </p>
          )}
        </section>
      </div>
    </aside>
  );
}
