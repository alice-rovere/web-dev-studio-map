import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Loader2, PenLine } from "lucide-react";

const WhiteboardModal = lazy(() => import("./WhiteboardModal"));

export function WhiteboardView({ payload }) {
  const containerRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const elements = payload.elements;
  const files = payload.files;
  const annotations = payload.annotations;
  const isEmpty = !Array.isArray(elements) || elements.length === 0;

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container || isEmpty) return undefined;

    (async () => {
      try {
        const { exportToSvg, getCommonBounds } = await import("@excalidraw/excalidraw");
        const svg = await exportToSvg({
          elements,
          files: files ?? {},
          exportPadding: 10,
          appState: { exportBackground: false, exportWithDarkMode: true },
        });
        if (cancelled) return;
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.style.width = "100%";
        svg.style.height = "auto";
        svg.style.maxHeight = "32rem";
        const [left, top] = getCommonBounds(elements);
        for (const item of annotations ?? []) {
          const element = elements.find((entry) => entry.id === item.elementId);
          if (!element) continue;
          const [x1, y1, x2, y2] = getCommonBounds([element]);
          const hotspot = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          hotspot.setAttribute("x", String(x1 - left + 10));
          hotspot.setAttribute("y", String(y1 - top + 10));
          hotspot.setAttribute("width", String(Math.max(x2 - x1, 16)));
          hotspot.setAttribute("height", String(Math.max(y2 - y1, 16)));
          hotspot.setAttribute("fill", "transparent");
          hotspot.setAttribute("stroke", "#22d3ee");
          hotspot.setAttribute("stroke-dasharray", "5 4");
          hotspot.setAttribute("stroke-width", "2");
          hotspot.setAttribute("role", "button");
          hotspot.setAttribute("tabindex", "0");
          hotspot.setAttribute("aria-label", item.title);
          hotspot.style.cursor = "pointer";
          hotspot.addEventListener("click", () => setSelectedId(item.elementId));
          hotspot.addEventListener("focus", () => hotspot.setAttribute("stroke", "#fbbf24"));
          hotspot.addEventListener("blur", () => hotspot.setAttribute("stroke", "#22d3ee"));
          hotspot.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setSelectedId(item.elementId);
            }
          });
          svg.appendChild(hotspot);
        }
        container.replaceChildren(svg);
        setFailed(false);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [elements, files, annotations, isEmpty]);

  if (isEmpty) {
    return <p className="text-sm italic text-zinc-500">Lavagna vuota.</p>;
  }

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
      <div ref={containerRef} />
      {annotations?.length > 0 && <>
        <p className="mt-3 text-xs text-zinc-400">Seleziona un elemento evidenziato o usa l’elenco.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {annotations.map((item) => <button key={item.elementId} type="button" aria-pressed={selectedId === item.elementId}
            className="rounded border border-cyan-500/40 px-2 py-1 text-xs text-cyan-200 hover:bg-cyan-500/10"
            onClick={() => setSelectedId(item.elementId)}>{item.title}</button>)}
        </div>
        {annotations.filter((item) => item.elementId === selectedId).map((item) => <section key={item.elementId} aria-live="polite" className="mt-3 rounded border border-zinc-700 p-3">
          <h3 className="font-semibold text-cyan-200">{item.title}</h3>
          <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-300">{item.description}</p>
        </section>)}
      </>}
      {failed && (
        <p className="text-xs text-rose-300" role="alert">
          Impossibile mostrare la lavagna.
        </p>
      )}
    </div>
  );
}

export function WhiteboardEditor({ payload, update, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const setEditorOpen = (value) => { setOpen(value); onOpenChange?.(value); };

  return (
    <div className="grid gap-3">
      <WhiteboardView payload={payload} />
      <button
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800/50"
        onClick={() => setEditorOpen(true)}
        type="button"
      >
        <PenLine size={13} />
        {payload.elements?.length ? "Modifica lavagna" : "Apri lavagna"}
      </button>
      {open && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-100 flex items-center justify-center bg-zinc-950/90 text-zinc-400">
              <Loader2 className="animate-spin" size={20} />
            </div>
          }
        >
          <WhiteboardModal
            onClose={() => setEditorOpen(false)}
            onSave={(next) => {
              update(() => next);
              setEditorOpen(false);
            }}
            payload={payload}
          />
        </Suspense>
      )}
    </div>
  );
}
