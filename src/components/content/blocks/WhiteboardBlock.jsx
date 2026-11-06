import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Loader2, PenLine } from "lucide-react";

const WhiteboardModal = lazy(() => import("./WhiteboardModal"));

export function WhiteboardView({ payload }) {
  const containerRef = useRef(null);
  const [failed, setFailed] = useState(false);
  const elements = payload.elements;
  const files = payload.files;
  const isEmpty = !Array.isArray(elements) || elements.length === 0;

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container || isEmpty) return undefined;

    (async () => {
      try {
        const { exportToSvg } = await import("@excalidraw/excalidraw");
        const svg = await exportToSvg({
          elements,
          files: files ?? {},
          appState: { exportBackground: false, exportWithDarkMode: true },
        });
        if (cancelled) return;
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.style.width = "100%";
        svg.style.height = "auto";
        svg.style.maxHeight = "32rem";
        container.replaceChildren(svg);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [elements, files, isEmpty]);

  if (isEmpty) {
    return <p className="text-sm italic text-zinc-500">Lavagna vuota.</p>;
  }

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
      <div ref={containerRef} />
      {failed && (
        <p className="text-xs text-rose-300" role="alert">
          Impossibile mostrare la lavagna.
        </p>
      )}
    </div>
  );
}

export function WhiteboardEditor({ payload, update }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-3">
      <WhiteboardView payload={payload} />
      <button
        className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800/50"
        onClick={() => setOpen(true)}
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
            onClose={() => setOpen(false)}
            onSave={(next) => {
              update(() => next);
              setOpen(false);
            }}
            payload={payload}
          />
        </Suspense>
      )}
    </div>
  );
}
