import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { ComputerHardwareMap } from "./ComputerSystemDiagram";
import { validateVisualGrid } from "../../notebooks/visualGrid";

const WEB_PARTS = [
  { id: "html", label: "HTML", subtitle: "Struttura", x: 30, color: "#fb923c" },
  { id: "css", label: "CSS", subtitle: "Presentazione", x: 280, color: "#38bdf8" },
  { id: "javascript", label: "JavaScript", subtitle: "Comportamento", x: 530, color: "#facc15" },
];

function WebPageMap({ selected, onSelect }) {
  return <figure className="rounded-xl border border-cyan-500/20 bg-slate-950/60 p-3">
    <figcaption className="mb-2 text-sm text-slate-300">Tre ingredienti di una pagina web</figcaption>
    <svg aria-label="Schema interattivo di HTML, CSS e JavaScript" className="h-auto w-full" role="group" viewBox="0 0 760 280">
      <rect x="5" y="5" width="750" height="270" rx="16" fill="#101b2c" />
      <rect x="20" y="18" width="720" height="26" rx="8" fill="#1e293b" />
      <circle cx="37" cy="31" r="4" fill="#fb7185" /><circle cx="52" cy="31" r="4" fill="#fbbf24" /><circle cx="67" cy="31" r="4" fill="#4ade80" />
      {WEB_PARTS.map((part) => <g
        key={part.id} role="button" tabIndex={0} aria-label={`${part.label}: ${part.subtitle}`} aria-pressed={selected === part.id}
        className="cursor-pointer outline-none focus-visible:drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]"
        onClick={() => onSelect(part.id)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(part.id); }
        }}
      >
        <rect x={part.x} y="75" width="200" height="150" rx="14" fill={selected === part.id ? "#164e63" : "#172337"} stroke={selected === part.id ? part.color : "#475569"} strokeWidth={selected === part.id ? "4" : "2"} />
        <text x={part.x + 100} y="135" textAnchor="middle" fill={part.color} fontFamily="ui-monospace, monospace" fontSize="24" fontWeight="bold">{part.label}</text>
        <text x={part.x + 100} y="170" textAnchor="middle" fill="#cbd5e1" fontFamily="ui-sans-serif, sans-serif" fontSize="15">{part.subtitle}</text>
      </g>)}
    </svg>
  </figure>;
}

function GridPanel({ panel }) {
  return <section className="space-y-2 rounded-lg border border-slate-700 bg-slate-950/70 p-3">
    <h3 className="text-xs font-semibold uppercase tracking-wide text-cyan-200">{panel.label}</h3>
    {panel.kind === "table" ? <div className="overflow-x-auto"><table className="w-full text-left text-sm">
      <thead><tr>{panel.columns.map((column, i) => <th className="border-b border-slate-700 p-2" key={i}>{column}</th>)}</tr></thead>
      <tbody>{panel.rows.map((row, i) => <tr className={panel.highlightRows?.includes(i) ? "bg-cyan-400/15" : undefined} key={i}>{row.map((cell, j) => <td className="border-b border-slate-800 p-2" key={j}>{cell}</td>)}</tr>)}</tbody>
    </table></div> : panel.kind === "code" ? <pre className="overflow-x-auto font-mono text-sm text-slate-200"><code>{panel.content.split("\n").map((line, i) => <span className={`block ${panel.highlightLines?.includes(i + 1) ? "bg-fuchsia-500/15" : ""}`} key={i}>{line || " "}</span>)}</code></pre> : <pre className="overflow-x-auto whitespace-pre-wrap font-sans text-sm text-slate-200">{panel.content}</pre>}
  </section>;
}

export default function VisualGridLayout({ grid, onClose }) {
  const reducedMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState(grid.config?.components?.[0]?.id);
  const problem = validateVisualGrid(grid);
  if (problem) return <div className="p-6 text-sm text-rose-300" role="alert">{problem} <button className="underline" onClick={onClose} type="button">Torna indietro</button></div>;
  const selected = grid.config.components.find((component) => component.id === selectedId) ?? grid.config.components[0];
  return <main className="h-full overflow-y-auto bg-[#0b1120] text-slate-100">
    <header className="flex items-start justify-between gap-4 border-b border-cyan-500/20 px-4 py-4 sm:px-6">
      <div><h1 className="text-xl font-bold text-cyan-200">{grid.config.title}</h1><p className="mt-1 text-sm text-slate-400">{grid.config.subtitle}</p></div>
      <button aria-label="Chiudi griglia" className="rounded-lg border border-slate-700 p-2 hover:bg-slate-800" onClick={onClose} type="button"><X size={20} /></button>
    </header>
    <div className="mx-auto grid max-w-7xl gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,25rem)] sm:p-6">
      <section className="min-w-0 space-y-4" aria-label="Schema interattivo">
        <p className="text-sm text-slate-300">Seleziona un componente nello schema o nell’elenco per leggere la sua spiegazione.</p>
        {grid.renderer === "computer" ? <ComputerHardwareMap stepId={selected.id} onSelect={setSelectedId} reducedMotion={reducedMotion} /> : <WebPageMap selected={selected.id} onSelect={setSelectedId} />}
        <div className="flex flex-wrap gap-2" aria-label="Componenti">
          {grid.config.components.map((component) => <button key={component.id} type="button" aria-pressed={selected.id === component.id}
            className={`rounded-lg border px-3 py-2 text-sm ${selected.id === component.id ? "border-cyan-400 bg-cyan-400/15 text-cyan-100" : "border-slate-700 text-slate-300 hover:bg-slate-800"}`}
            onClick={() => setSelectedId(component.id)}>{component.title}</button>)}
        </div>
      </section>
      <aside aria-live="polite" className="space-y-4 rounded-xl border border-fuchsia-500/20 bg-slate-900/70 p-4">
        <h2 className="text-lg font-semibold text-fuchsia-200">{selected.title}</h2>
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{selected.description}</p>
        {selected.panels.map((panel, index) => <GridPanel key={index} panel={panel} />)}
      </aside>
    </div>
  </main>;
}
