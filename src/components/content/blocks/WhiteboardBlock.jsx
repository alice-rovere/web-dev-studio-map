import { lazy, Suspense, useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Loader2, PenLine, X } from "lucide-react";

const WhiteboardModal = lazy(() => import("./WhiteboardModal"));

export function WhiteboardView({ payload }) {
  const containerRef = useRef(null);
  const activeHotspotRef = useRef(null);
  const interactedOutsideRef = useRef(false);
  const [failed, setFailed] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const elements = payload.elements;
  const files = payload.files;
  const annotations = payload.annotations;
  const isEmpty = !Array.isArray(elements) || elements.length === 0;
  const hasAnnotations = annotations?.length > 0;
  const selected = annotations?.find((item) => item.elementId === selectedId);

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
          hotspot.setAttribute("rx", "8");
          hotspot.setAttribute("fill", "transparent");
          hotspot.setAttribute("stroke", "transparent");
          hotspot.setAttribute("stroke-width", "2");
          hotspot.setAttribute("class", "whiteboard-hotspot");
          hotspot.setAttribute("vector-effect", "non-scaling-stroke");
          hotspot.setAttribute("role", "button");
          hotspot.setAttribute("tabindex", "0");
          hotspot.setAttribute("aria-label", `Apri spiegazione: ${item.title}`);
          hotspot.setAttribute("aria-haspopup", "dialog");
          hotspot.dataset.elementId = item.elementId;
          hotspot.style.cursor = "pointer";
          const openExplanation = () => {
            activeHotspotRef.current = hotspot;
            interactedOutsideRef.current = false;
            setSelectedId(item.elementId);
          };
          hotspot.addEventListener("click", openExplanation);
          hotspot.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openExplanation();
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
    <div className="my-4">
      {hasAnnotations && (
        <p className="mb-2 text-xs text-zinc-400">Seleziona un elemento evidenziato per leggere la sua spiegazione. Puoi usare anche Tab e Invio.</p>
      )}
      <div className="relative min-w-0 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
        <div ref={containerRef} />
        {selected && <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-lg bg-zinc-950/75 backdrop-blur-sm" />}
        {failed && (
          <p className="text-xs text-rose-300" role="alert">
            Impossibile mostrare la lavagna.
          </p>
        )}
      </div>
      <Dialog.Root modal={false} open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <Dialog.Portal>
          <Dialog.Content
            className="fixed top-1/2 left-1/2 z-111 flex max-h-[85dvh] w-[min(94vw,25rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-fuchsia-500/30 bg-zinc-950 p-4 shadow-[0_0_24px_rgba(217,70,239,0.12)] focus:outline-none"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              if (!interactedOutsideRef.current && activeHotspotRef.current?.isConnected) activeHotspotRef.current.focus();
            }}
            onPointerDownOutside={(event) => {
              const target = event.detail.originalEvent.target;
              if (target instanceof Element && target.closest(".whiteboard-hotspot") && containerRef.current?.contains(target)) event.preventDefault();
            }}
            onInteractOutside={(event) => { if (!event.defaultPrevented) interactedOutsideRef.current = true; }}
          >
            <div className="flex items-start justify-between gap-3">
              <Dialog.Title className="min-w-0 wrap-break-word font-mono text-sm font-bold uppercase tracking-widest text-fuchsia-200">{selected?.title}</Dialog.Title>
              <Dialog.Close asChild>
                <button
                  aria-label="Chiudi spiegazione"
                  className="shrink-0 rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10 p-1 text-fuchsia-200 hover:bg-fuchsia-500/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
                  type="button"
                ><X size={16} /></button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="mt-3 min-h-0 overflow-y-auto whitespace-pre-wrap wrap-break-word text-sm leading-6 text-zinc-300">{selected?.description}</Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
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
