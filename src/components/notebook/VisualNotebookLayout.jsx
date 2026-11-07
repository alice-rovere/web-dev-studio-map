import { Component, lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Pause,
  Play,
  RotateCcw,
  X,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import PrismaFlowDiagram from "./PrismaFlowDiagram.jsx";
import InternetBrowserDiagram from "./InternetBrowserDiagram.jsx";
import WebRequestCycleDiagram from "./WebRequestCycleDiagram.jsx";
import ComputerSystemDiagram, { OperatingSystemDiagram } from "./ComputerSystemDiagram.jsx";
import { PHASE_ICONS } from "../../notebooks/phaseIcons.js";

const ILLUSTRATIONS = {
  "prisma-flow": PrismaFlowDiagram,
  "internet-browser": InternetBrowserDiagram,
  "web-request-cycle": WebRequestCycleDiagram,
  "computer-system": ComputerSystemDiagram,
  "operating-system": OperatingSystemDiagram,
};

const AUTOPLAY_MS = 3200;
const ComputerExplorer = lazy(() => import("./ComputerExplorer.jsx"));

class ExplorerErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error("Impossibile caricare l'esploratore 3D.", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-4 bg-slate-950 p-6 text-center" role="alert">
          <p>Impossibile caricare l’esploratore 3D. Gli appunti 2D restano disponibili.</p>
          <button type="button" onClick={this.props.onClose} className="rounded border border-cyan-400 px-4 py-2 text-cyan-200">Torna agli appunti</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function CodePanel({ panel }) {
  const highlighted = new Set(panel.highlightLines ?? []);
  const lines = String(panel.content ?? "").split("\n");

  return (
    <pre className="nodrag nowheel overflow-x-auto rounded-md border border-cyan-500/20 bg-black/50 py-2 font-mono text-[11px] leading-5 text-cyan-100">
      <code>
        {lines.map((line, index) => (
          <span
            className={`block px-3 ${
              highlighted.has(index + 1)
                ? "bg-fuchsia-500/15 shadow-[inset_2px_0_0_#d946ef]"
                : ""
            }`}
            key={index}
          >
            {line || " "}
          </span>
        ))}
      </code>
    </pre>
  );
}

function TablePanel({ panel }) {
  const highlighted = new Set(panel.highlightRows ?? []);

  return (
    <div className="nodrag nowheel overflow-x-auto rounded-md border border-cyan-500/20 bg-black/50">
      <table className="w-full border-collapse font-mono text-[11px]">
        <thead>
          <tr className="text-left text-fuchsia-300">
            {(panel.columns ?? []).map((column) => (
              <th
                className="border-b border-cyan-500/20 px-2 py-1.5 font-semibold"
                key={column}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {(panel.rows ?? []).map((row, rowIndex) => (
            <tr
              className={
                highlighted.has(rowIndex)
                  ? "bg-cyan-400/15 text-cyan-100"
                  : "text-zinc-400"
              }
              key={rowIndex}
            >
              {row.map((cell, cellIndex) => (
                <td className="whitespace-nowrap px-2 py-1.5" key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TextPanel({ panel, compactDiagram }) {
  return (
    <pre className={`nodrag nowheel overflow-x-auto whitespace-pre-wrap rounded-md border border-fuchsia-500/20 bg-black/50 p-3 text-zinc-300 ${compactDiagram ? "font-sans text-sm leading-6" : "font-mono text-[11px] leading-5"}`}>
      {panel.content}
    </pre>
  );
}

function Panel({ panel, compactDiagram }) {
  const Body =
    panel.kind === "table"
      ? TablePanel
      : panel.kind === "text"
        ? TextPanel
        : CodePanel;

  return (
    <div className="min-w-0">
      <div className="mb-1 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-zinc-500">
        <span>{panel.label}</span>
        {panel.language && <span className="text-fuchsia-400">{panel.language}</span>}
      </div>
      <Body panel={panel} compactDiagram={compactDiagram} />
    </div>
  );
}

/**
 * Template fullscreen per appunti visivi a step.
 * `config`: { title, subtitle, phases: [{id,label,hint,icon}], steps: [{id,phase,title,description,panels}] }
 */
export default function VisualNotebookLayout({ config, onClose }) {
  const shouldReduceMotion = useReducedMotion();
  const steps = useMemo(() => config?.steps ?? [], [config]);
  const phases = useMemo(() => config?.phases ?? [], [config]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const explorerButton = useRef(null);

  const lastIndex = steps.length - 1;
  const currentStep = steps[stepIndex];

  const goTo = useCallback(
    (index) => setStepIndex(Math.min(Math.max(index, 0), lastIndex)),
    [lastIndex],
  );

  const reset = useCallback(() => {
    setIsPlaying(false);
    setStepIndex(0);
  }, []);

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (stepIndex >= lastIndex) {
      const stop = setTimeout(() => setIsPlaying(false), 0);
      return () => clearTimeout(stop);
    }
    const timer = setTimeout(() => setStepIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [isPlaying, stepIndex, lastIndex]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (explorerOpen) return;
      if (event.key === "ArrowRight") goTo(stepIndex + 1);
      else if (event.key === "ArrowLeft") goTo(stepIndex - 1);
      else if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, stepIndex, onClose, explorerOpen]);

  // Per ogni fase mostra il contenuto dell'ultimo step raggiunto che la riguarda.
  const phaseStep = useMemo(() => {
    const map = new Map();
    steps.slice(0, stepIndex + 1).forEach((step) => map.set(step.phase, step));
    return map;
  }, [steps, stepIndex]);

  if (!currentStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1120] font-mono text-sm text-zinc-400">
        Nessuno step disponibile.
      </div>
    );
  }

  const progress = ((stepIndex + 1) / steps.length) * 100;
  const Illustration = ILLUSTRATIONS[currentStep.illustration];
  const compactDiagram = ["computer-system", "operating-system"].includes(currentStep.illustration);
  const visiblePhases = compactDiagram
    ? phases.filter((phase) => phase.id === currentStep.phase)
    : phases;
  const closeExplorer = () => {
    setExplorerOpen(false);
    requestAnimationFrame(() => explorerButton.current?.focus());
  };

  return (
    <div
      aria-label={config.title}
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#0b1120] text-zinc-200"
      role="dialog"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 20% 0%, rgba(168,85,247,0.16), transparent 70%), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(34,211,238,0.12), transparent 70%)",
        }}
      />

      <header className="relative z-10 flex items-center justify-between gap-4 border-b border-fuchsia-500/20 px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <h1 className="truncate font-mono text-lg font-bold uppercase tracking-[0.2em] text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] sm:text-xl">
            {config.title}
          </h1>
          {config.subtitle && (
            <p className="truncate font-mono text-[11px] uppercase tracking-widest text-fuchsia-300/70">
              {config.subtitle}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-4">
          {config.slug === "dentro-il-pc" && (
            <button
              ref={explorerButton}
              type="button"
              onClick={() => { setIsPlaying(false); setExplorerOpen(true); }}
              className="rounded-lg border border-cyan-400/50 px-3 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-400/10"
            >
              Esplora in 3D
            </button>
          )}
          <span className="hidden font-mono text-xs text-zinc-400 sm:inline">
            STEP {stepIndex + 1} / {steps.length}
          </span>
          <button
            aria-label="Chiudi appunti visivi"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200 transition-colors hover:bg-fuchsia-500/25"
            onClick={onClose}
            title="Chiudi (Esc)"
            type="button"
          >
            <X size={18} />
          </button>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-fuchsia-500 to-cyan-400 transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </header>

      {explorerOpen && (
        <ExplorerErrorBoundary onClose={closeExplorer}>
          <Suspense fallback={
            <div className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-4 bg-slate-950 text-slate-300">
              <p>Caricamento esploratore 3D…</p>
              <button type="button" onClick={closeExplorer} className="rounded border border-cyan-400 px-4 py-2 text-cyan-200">Torna agli appunti</button>
            </div>
          }>
            <ComputerExplorer
              steps={steps}
              stepId={currentStep.id}
              reducedMotion={shouldReduceMotion}
              onClose={closeExplorer}
              onSelect={(id) => {
                const index = steps.findIndex((step) => step.id === id);
                if (index >= 0) goTo(index);
              }}
            />
          </Suspense>
        </ExplorerErrorBoundary>
      )}

      <div className="relative z-10 flex min-h-0 grow flex-col md:flex-row">
        <nav
          aria-label="Step"
          className="nowheel flex shrink-0 gap-2 overflow-x-auto border-b border-fuchsia-500/20 p-3 md:w-72 md:flex-col md:overflow-y-auto md:border-r md:border-b-0"
        >
          {steps.map((step, index) => {
            const active = index === stepIndex;
            return (
              <button
                aria-current={active ? "step" : undefined}
                className={`flex min-w-52 cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors md:min-w-0 ${
                  active
                    ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_14px_rgba(34,211,238,0.18)]"
                    : "border-transparent hover:border-fuchsia-500/30 hover:bg-fuchsia-500/5"
                }`}
                key={step.id}
                onClick={() => {
                  setIsPlaying(false);
                  goTo(index);
                }}
                type="button"
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold ${
                    index <= stepIndex
                      ? "bg-fuchsia-500 text-white"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-xs font-semibold uppercase tracking-wider text-zinc-100">
                    {step.title}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <main className="flex min-h-0 min-w-0 grow flex-col">
          <div className="border-b border-fuchsia-500/10 px-4 py-3 sm:px-6">
            <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-fuchsia-300">
              {currentStep.title}
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-zinc-300">
              {currentStep.description}
            </p>
          </div>

          {Illustration && (
            <div className="shrink-0 px-3 pt-3 sm:px-4">
              <Illustration isPlaying={isPlaying && !shouldReduceMotion} stepId={currentStep.id} />
            </div>
          )}

          {!Illustration && currentStep.illustration === "generic" && (
            <div aria-label="Schema delle fasi" className="flex shrink-0 items-center gap-2 overflow-x-auto px-4 pt-3">
              {phases.map((phase, index) => {
                const Icon = PHASE_ICONS[phase.icon] ?? Code2;
                const active = phase.id === currentStep.phase;
                return (
                  <div className="flex shrink-0 items-center gap-2" key={phase.id}>
                    {index > 0 && <span aria-hidden="true" className="text-cyan-700">→</span>}
                    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${active ? "border-cyan-400 text-cyan-200" : "border-slate-700 text-slate-400"}`}>
                      <Icon aria-hidden="true" size={18} />
                      {phase.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="nowheel grid min-h-0 grow auto-rows-min gap-3 overflow-y-auto p-3 sm:p-4 lg:grid-flow-col lg:auto-cols-fr lg:auto-rows-auto">
            {visiblePhases.map((phase) => {
              const Icon = PHASE_ICONS[phase.icon] ?? Code2;
              const isActive = phase.id === currentStep.phase;
              const shown = phaseStep.get(phase.id);

              return (
                <section
                  className={`flex min-w-0 flex-col gap-3 rounded-xl border p-3 transition-all duration-300 ${
                    isActive
                      ? "border-cyan-400/60 bg-cyan-400/5 shadow-[0_0_24px_rgba(34,211,238,0.15)]"
                      : shown
                        ? "border-fuchsia-500/30 bg-fuchsia-500/5"
                        : "border-zinc-800 bg-zinc-900/30 opacity-50"
                  }`}
                  key={phase.id}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={isActive ? "text-cyan-300" : "text-fuchsia-400"}
                      size={16}
                    />
                    <div className="min-w-0">
                      <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-100">
                        {phase.label}
                      </h3>
                      <p className="font-mono text-[10px] text-zinc-500">{phase.hint}</p>
                    </div>
                  </div>
                  {shown ? (
                    shown.panels.map((panel, index) => (
                      <Panel key={`${shown.id}-${index}`} panel={panel} compactDiagram={compactDiagram} />
                    ))
                  ) : (
                    <p className="font-mono text-[11px] text-zinc-600">In attesa…</p>
                  )}
                </section>
              );
            })}
          </div>

          <footer className="flex flex-wrap items-center justify-center gap-2 border-t border-fuchsia-500/20 px-4 py-3">
            <ControlButton
              disabled={stepIndex === 0}
              label="Indietro"
              onClick={() => {
                setIsPlaying(false);
                goTo(stepIndex - 1);
              }}
            >
              <ChevronLeft size={16} />
            </ControlButton>
            <button
              className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-cyan-400/60 bg-cyan-400/15 px-4 font-mono text-xs font-bold uppercase tracking-widest text-cyan-200 transition-colors hover:bg-cyan-400/25"
              onClick={() => {
                if (stepIndex >= lastIndex) setStepIndex(0);
                setIsPlaying((value) => !value);
              }}
              type="button"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? "Pausa" : "Play"}
            </button>
            <ControlButton
              disabled={stepIndex === lastIndex}
              label="Avanti"
              onClick={() => {
                setIsPlaying(false);
                goTo(stepIndex + 1);
              }}
            >
              <ChevronRight size={16} />
            </ControlButton>
            <ControlButton label="Reset" onClick={reset}>
              <RotateCcw size={14} />
            </ControlButton>
          </footer>
        </main>
      </div>
    </div>
  );
}

function ControlButton({ children, disabled, label, onClick }) {
  return (
    <button
      aria-label={label}
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200 transition-colors hover:bg-fuchsia-500/25 disabled:cursor-not-allowed disabled:opacity-30"
      disabled={disabled}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}
