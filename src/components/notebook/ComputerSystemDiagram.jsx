import { AppWindow, CircuitBoard, Database, Layers, Settings } from "lucide-react";
import { useEffect, useRef } from "react";
import { COMPUTER_EXPLORER_PARTS } from "../../notebooks/computerExplorerParts.js";

const hardware = [
  { id: "scheda-madre", label: "Scheda madre" },
  { id: "cpu", label: "CPU" },
  { id: "ram", label: "RAM" },
  { id: "archiviazione", label: "SSD" },
  { id: "gpu", label: "GPU" },
  { id: "batteria", label: "Energia" },
  { id: "periferiche", label: "Periferiche" },
];

const routes = [
  { from: "periferiche", to: "scheda-madre", path: "M145 289 C158 289 163 289 180 289" },
  { from: "batteria", to: "cpu", path: "M370 165 C398 165 390 229 410 247", power: true },
  { from: "cpu", to: "ram", path: "M555 255 C594 235 593 184 630 167" },
  { from: "cpu", to: "archiviazione", path: "M555 293 C594 320 596 380 630 400" },
  { from: "cpu", to: "gpu", path: "M410 293 C386 324 363 356 370 385" },
];

const software = [
  { id: "applicazioni", label: "Applicazioni", Icon: AppWindow },
  { id: "sistema-operativo", label: "Sistema operativo", Icon: Layers },
  { id: "kernel", label: "Kernel", Icon: Settings },
  { id: "driver", label: "Driver", Icon: CircuitBoard },
  { id: "dispositivo", label: "Dispositivo", Icon: Database },
];

const softwareActive = {
  "avvio-app": ["applicazioni"],
  applicazioni: ["applicazioni"],
  "sistema-operativo": ["sistema-operativo"],
  kernel: ["kernel"],
  driver: ["driver", "dispositivo"],
  "kernel-driver": ["kernel", "driver"],
  collaborazione: ["applicazioni", "sistema-operativo", "kernel", "driver", "dispositivo"],
};

function CompactDiagram({ title, items, active }) {
  const containerRef = useRef(null);
  const selectedRef = useRef(null);
  const firstActive = active[0];

  useEffect(() => {
    const container = containerRef.current;
    const selected = selectedRef.current;
    if (!container || !selected) return;
    const containerBounds = container.getBoundingClientRect();
    const selectedBounds = selected.getBoundingClientRect();
    if (selectedBounds.left < containerBounds.left) {
      container.scrollLeft += selectedBounds.left - containerBounds.left;
    } else if (selectedBounds.right > containerBounds.right) {
      container.scrollLeft += selectedBounds.right - containerBounds.right;
    }
  }, [firstActive]);

  return (
    <figure className="rounded-lg border border-cyan-500/20 bg-slate-950/50 px-3 py-2">
      <figcaption className="mb-2 text-xs font-semibold text-slate-300">{title}</figcaption>
      <div className="flex gap-2 overflow-x-auto pb-1" ref={containerRef}>
        {items.map(({ id, label, Icon }) => {
          const selected = active.includes(id);
          return (
            <div className={`flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-xs ${selected ? "border-cyan-400 bg-cyan-400/10 font-semibold text-cyan-100" : "border-slate-700 text-slate-400"}`} key={id} ref={id === firstActive ? selectedRef : undefined}>
              <Icon aria-hidden="true" size={16} />
              <span>{label}{selected && <span className="sr-only"> (in evidenza)</span>}</span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

function PartGlyph({ id, x, y }) {
  const centerY = y + 34;
  if (id === "cpu") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x={x + 12} y={y + 17} width="30" height="30" rx="3" />
        <rect x={x + 19} y={y + 24} width="16" height="16" rx="2" />
        <path d={`M${x + 18} ${y + 12}v5m8-5v5m8-5v5m-16 30v5m8-5v5m8-5v5m-24-31h5m-5 8h5m-5 8h5m30-16h5m-5 8h5m-5 8h5`} />
      </g>
    );
  }
  if (id === "ram") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x={x + 13} y={y + 17} width="31" height="12" rx="2" />
        <rect x={x + 13} y={y + 34} width="31" height="12" rx="2" />
        <path d={`M${x + 19} ${y + 20}v6m8-6v6m8-6v6m-16 11v6m8-6v6m8-6v6`} />
      </g>
    );
  }
  if (id === "archiviazione") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x={x + 12} y={y + 18} width="33" height="30" rx="4" />
        <circle cx={x + 28} cy={y + 33} r="7" />
        <path d={`M${x + 38} ${y + 43}h4`} />
      </g>
    );
  }
  if (id === "gpu") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x={x + 8} y={y + 19} width="42" height="28" rx="4" />
        <circle cx={x + 22} cy={centerY} r="7" />
        <circle cx={x + 38} cy={centerY} r="7" />
        <path d={`M${x + 50} ${y + 27}h5m-5 12h5`} />
      </g>
    );
  }
  if (id === "batteria") {
    return (
      <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x={x + 13} y={y + 21} width="34" height="25" rx="3" />
        <path d={`M${x + 47} ${y + 28}h4v11h-4m-25-10v9m-4-4.5h8`} />
      </g>
    );
  }
  return (
    <g aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x={x + 9} y={y + 20} width="40" height="21" rx="3" />
      <path d={`M${x + 14} ${y + 26}h3m4 0h3m4 0h3m4 0h3m-24 6h3m4 0h3m4 0h3m4 0h3m-18 6h14`} />
    </g>
  );
}

function HardwareNode({ part, selected, related, onSelect }) {
  const { x, y, width, height } = COMPUTER_EXPLORER_PARTS[part.id];
  return (
    <g
      aria-label={part.label}
      aria-pressed={selected}
      className="cursor-pointer outline-none focus-visible:drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]"
      onClick={() => onSelect?.(part.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect?.(part.id);
        }
      }}
      role="button"
      tabIndex={0}
    >
      <rect
        fill={selected ? "#164e63" : related ? "#10283b" : "#101b2c"}
        height={height}
        rx="10"
        stroke={selected ? "#67e8f9" : related ? "#155e75" : "#334155"}
        strokeWidth={selected ? "3" : "2"}
        width={width}
        x={x}
        y={y}
      />
      <g color={selected ? "#a5f3fc" : related ? "#67e8f9" : "#94a3b8"}>
        <PartGlyph id={part.id} x={x} y={y} />
      </g>
      <text
        dominantBaseline="middle"
        fill={selected ? "#ecfeff" : "#cbd5e1"}
        fontFamily="ui-monospace, monospace"
        fontSize="13"
        fontWeight={selected ? "700" : "500"}
        x={x + 57}
        y={y + height / 2}
      >
        {part.label}
      </text>
      {selected && <circle cx={x + width - 12} cy={y + 12} fill="#fbbf24" r="4" />}
    </g>
  );
}

export function ComputerHardwareMap({ stepId, onSelect, reducedMotion = false }) {
  const activeRoutes = routes.filter((route) =>
    stepId === "scheda-madre" || route.from === stepId || route.to === stepId
  );
  const relatedParts = new Set(
    stepId === "scheda-madre"
      ? hardware.map((part) => part.id)
      : ["scheda-madre", stepId, ...activeRoutes.flatMap((route) => [route.from, route.to])],
  );

  return (
    <figure className="min-w-0 rounded-lg border border-cyan-500/20 bg-slate-950/60 p-2 sm:p-3">
      <figcaption className="mb-1 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-300">
        <span className="font-semibold">Componenti e collegamenti del PC</span>
        <span className="text-[10px] text-slate-500">Seleziona un componente per seguirne i percorsi</span>
      </figcaption>
      <svg
        aria-label="Schema interattivo dei componenti e dei collegamenti del computer"
        className="h-auto max-h-80 w-full"
        role="group"
        viewBox="0 0 900 540"
      >
        <style>{`@keyframes pc-route-flow{to{stroke-dashoffset:-36}} .pc-route-flow{animation:pc-route-flow 1.2s linear infinite} @media(prefers-reduced-motion:reduce){.pc-route-flow{animation:none}}`}</style>
        <rect fill="#101b2c" height="540" rx="12" width="900" />
        <g aria-hidden="true">
          <path d="M170 95h700v385H170z" fill="#102b31" stroke={relatedParts.has("scheda-madre") ? "#22d3ee" : "#1e4d4a"} strokeWidth={stepId === "scheda-madre" ? "4" : "2"} />
          <path d="M190 115h660v344H190z" fill="none" stroke="#1b4546" strokeDasharray="3 9" />
          <path d="M205 220h175v-45h58m-230 155h145v40h-10m370-155h-50v30m50 115h-48v-40" fill="none" stroke="#1b4c4a" strokeWidth="2" />
          <circle cx="205" cy="220" r="4" fill="#2dd4bf" />
          <circle cx="380" cy="220" r="4" fill="#2dd4bf" />
          <circle cx="578" cy="330" r="4" fill="#2dd4bf" />
          <circle cx="785" cy="315" r="4" fill="#2dd4bf" />
          <text fill="#5eead4" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="2" x="195" y="106">SCHEDA MADRE</text>
        </g>

        <g aria-hidden="true" fill="none" strokeLinecap="round" strokeWidth="4">
          {routes.map((route) => {
            const active = activeRoutes.includes(route);
            return (
              <path
                className={active && !reducedMotion ? "pc-route-flow" : undefined}
                d={route.path}
                key={`${route.from}-${route.to}`}
                opacity={active ? "1" : "0.55"}
                stroke={active ? (route.power ? "#fbbf24" : "#22d3ee") : "#475569"}
                strokeDasharray={active ? "9 9" : "3 8"}
              />
            );
          })}
        </g>

        {hardware.filter((part) => part.id === "scheda-madre").map((part) => (
          <g
            aria-label={part.label}
            aria-pressed={stepId === part.id}
            className="cursor-pointer outline-none focus-visible:drop-shadow-[0_0_6px_rgba(34,211,238,0.9)]"
            key={part.id}
            onClick={() => onSelect?.(part.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect?.(part.id);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <rect
              fill="transparent"
              height={COMPUTER_EXPLORER_PARTS[part.id].height}
              stroke={stepId === part.id ? "#67e8f9" : "transparent"}
              strokeWidth="4"
              width={COMPUTER_EXPLORER_PARTS[part.id].width}
              x={COMPUTER_EXPLORER_PARTS[part.id].x}
              y={COMPUTER_EXPLORER_PARTS[part.id].y}
            />
          </g>
        ))}

        <g aria-hidden="true">
          <rect fill="#0b1725" height="88" rx="10" stroke="#334155" strokeWidth="2" width="135" x="10" y="245" />
          <text fill="#64748b" fontFamily="ui-monospace, monospace" fontSize="10" letterSpacing="1" x="20" y="258">INGRESSO / USCITA</text>
        </g>
        {hardware.filter((part) => part.id !== "scheda-madre").map((part) => (
          <HardwareNode
            key={part.id}
            onSelect={onSelect}
            part={part}
            related={relatedParts.has(part.id)}
            selected={stepId === part.id}
          />
        ))}
        <g aria-hidden="true" fill="#fbbf24" fontFamily="ui-monospace, monospace" fontSize="10">
          <text x="375" y="185">energia</text>
          <text fill="#67e8f9" x="555" y="222">dati</text>
          <text fill="#67e8f9" x="555" y="345">dati</text>
        </g>
      </svg>
    </figure>
  );
}

export default function ComputerSystemDiagram({ stepId, onSelect, reducedMotion }) {
  if (Object.hasOwn(softwareActive, stepId)) {
    return <OperatingSystemDiagram stepId={stepId} />;
  }
  if (!hardware.some((part) => part.id === stepId)) {
    return <p className="text-sm text-amber-200" role="status">Schema non disponibile per questo passaggio.</p>;
  }
  return <ComputerHardwareMap stepId={stepId} onSelect={onSelect} reducedMotion={reducedMotion} />;
}

export function OperatingSystemDiagram({ stepId }) {
  const active = softwareActive[stepId];
  if (!active) {
    return <p className="text-sm text-amber-200" role="status">Schema non disponibile per questo passaggio.</p>;
  }
  return <CompactDiagram title="Software e dispositivi · elementi in evidenza" items={software} active={active} />;
}
