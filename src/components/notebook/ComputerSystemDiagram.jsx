import { AppWindow, BatteryCharging, CircuitBoard, Cpu, Database, HardDrive, Keyboard, Layers, MemoryStick, Monitor, Settings } from "lucide-react";
import { useEffect, useRef } from "react";

const hardware = [
  { id: "scheda-madre", label: "Scheda madre", Icon: CircuitBoard },
  { id: "cpu", label: "CPU", Icon: Cpu },
  { id: "ram", label: "RAM", Icon: MemoryStick },
  { id: "archiviazione", label: "SSD", Icon: HardDrive },
  { id: "gpu", label: "GPU", Icon: Monitor },
  { id: "batteria", label: "Energia", Icon: BatteryCharging },
  { id: "periferiche", label: "Periferiche", Icon: Keyboard },
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

export default function ComputerSystemDiagram({ stepId }) {
  if (Object.hasOwn(softwareActive, stepId)) {
    return <OperatingSystemDiagram stepId={stepId} />;
  }
  if (!hardware.some((part) => part.id === stepId)) {
    return <p className="text-sm text-amber-200" role="status">Schema non disponibile per questo passaggio.</p>;
  }
  return <CompactDiagram title="Componenti fisici · elemento in evidenza" items={hardware} active={[stepId]} />;
}

export function OperatingSystemDiagram({ stepId }) {
  const active = softwareActive[stepId];
  if (!active) {
    return <p className="text-sm text-amber-200" role="status">Schema non disponibile per questo passaggio.</p>;
  }
  return <CompactDiagram title="Software e dispositivi · elementi in evidenza" items={software} active={active} />;
}
