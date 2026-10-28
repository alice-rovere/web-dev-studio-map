import { useEffect, useId, useRef, useState } from "react";

let mermaidPromise;

function loadMermaid() {
  mermaidPromise ??= import("mermaid").then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "dark",
    });
    return mermaid;
  });
  return mermaidPromise;
}

export function MermaidView({ payload }) {
  const containerRef = useRef(null);
  const renderId = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [error, setError] = useState("");
  const code = payload.code ?? "";

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;
    if (!container) return undefined;

    const timer = setTimeout(async () => {
      if (!code.trim()) {
        container.innerHTML = "";
        setError("");
        return;
      }

      try {
        const mermaid = await loadMermaid();
        const { svg } = await mermaid.render(renderId, code);
        if (cancelled) return;
        container.innerHTML = svg;
        setError("");
      } catch (renderError) {
        if (cancelled) return;
        // Mermaid lascia un elemento di errore nel body: lo rimuoviamo.
        document.getElementById(`d${renderId}`)?.remove();
        container.innerHTML = "";
        setError(
          renderError instanceof Error ? renderError.message : "Sintassi non valida.",
        );
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [code, renderId]);

  return (
    <div className="my-4">
      <div
        className="flex justify-center overflow-x-auto rounded-lg border border-zinc-800 bg-zinc-950/40 p-3 [&_svg]:h-auto [&_svg]:max-w-full"
        ref={containerRef}
      />
      {error && (
        <p className="mt-2 whitespace-pre-line font-mono text-[11px] text-rose-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function MermaidEditor({ payload, update, fieldClass, Label }) {
  return (
    <div className="grid gap-3">
      <label className="block">
        <Label>Codice Mermaid</Label>
        <textarea
          className={`${fieldClass} min-h-32 resize-y font-mono`}
          onChange={(event) => update(() => ({ code: event.target.value }))}
          placeholder={"flowchart LR\n  A[Client] --> B[API] --> C[(DB)]"}
          spellCheck="false"
          value={payload.code}
        />
      </label>
      <div>
        <Label>Anteprima</Label>
        <MermaidView payload={payload} />
      </div>
    </div>
  );
}
