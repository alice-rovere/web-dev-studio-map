import { useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Save, X } from "lucide-react";
import { missingAnnotations } from "./interactiveWhiteboard";

export default function WhiteboardModal({ payload, onSave, onClose }) {
  const [api, setApi] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [annotations, setAnnotations] = useState(() => payload.annotations ?? []);
  const [error, setError] = useState("");

  const annotation = annotations.find((item) => item.elementId === selectedId);
  function updateAnnotation(patch) {
    setAnnotations((current) => {
      const previous = current.find((item) => item.elementId === selectedId);
      return [...current.filter((item) => item.elementId !== selectedId), { elementId: selectedId, title: "", description: "", ...previous, ...patch }];
    });
  }

  function handleSave() {
    if (!api) return;
    const elements = api.getSceneElements().filter((element) => !element.isDeleted);
    const missing = missingAnnotations(elements, annotations);
    if (missing.length && !window.confirm(`${missing.length} spiegazioni sono associate a elementi eliminati. Eliminarle insieme agli elementi?`)) return;
    const remaining = annotations.filter((item) => !missing.includes(item));
    if (remaining.some((item) => !item.title.trim() || !item.description.trim())) {
      setError("Compila titolo e spiegazione per ogni elemento, oppure rimuovi l'associazione.");
      return;
    }
    const usedFileIds = new Set(
      elements.filter((element) => element.fileId).map((element) => element.fileId),
    );
    const files = Object.fromEntries(
      Object.entries(api.getFiles()).filter(([id]) => usedFileIds.has(id)),
    );
    onSave({ ...payload, elements, files, annotations: remaining });
  }

  return (
    <div
      aria-label="Lavagna"
      aria-modal="true"
      className="fixed inset-0 z-100 flex flex-col bg-zinc-950"
      role="dialog"
    >
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 px-3 py-2">
        <span className="font-mono text-xs uppercase tracking-wider text-zinc-300">
          Lavagna
        </span>
        <div className="flex gap-2">
          <button
            className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-zinc-800 px-3 text-xs text-zinc-300 hover:bg-zinc-800/50"
            onClick={() => {
              if (window.confirm("Chiudere la lavagna senza applicare le modifiche?")) onClose();
            }}
            type="button"
          >
            <X size={13} /> Annulla
          </button>
          <button
            className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-zinc-100 px-3 text-xs font-semibold text-zinc-950 hover:bg-white"
            onClick={handleSave}
            type="button"
          >
            <Save size={13} /> Applica
          </button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <div className="min-h-80 min-w-0 flex-1">
        <Excalidraw
          excalidrawAPI={setApi}
          initialData={{
            elements: payload.elements ?? [],
            files: payload.files ?? {},
            appState: { theme: "dark" },
          }}
          langCode="it-IT"
          theme="dark"
          onChange={(_, appState) => {
            const ids = Object.keys(appState.selectedElementIds).filter((id) => appState.selectedElementIds[id]);
            setSelectedId(ids.length === 1 ? ids[0] : null);
          }}
        />
        </div>
        <aside className="max-h-64 shrink-0 space-y-3 overflow-y-auto border-t border-zinc-800 p-4 text-sm text-zinc-200 md:max-h-none md:w-72 md:border-t-0 md:border-l">
          <h2 className="font-semibold text-cyan-200">Spiegazione elemento</h2>
          <p className="text-xs text-zinc-400">Seleziona una singola forma nella lavagna per associarle una spiegazione. Le copie sono indipendenti.</p>
          {selectedId && <>
            <label className="block text-xs">Titolo<input className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-2 text-sm" value={annotation?.title ?? ""} onChange={(event) => updateAnnotation({ title: event.target.value })} /></label>
            <label className="block text-xs">Spiegazione<textarea className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 p-2 text-sm" rows={5} value={annotation?.description ?? ""} onChange={(event) => updateAnnotation({ description: event.target.value })} /></label>
            {annotation && <button className="text-xs text-rose-300 underline" onClick={() => setAnnotations((current) => current.filter((item) => item.elementId !== selectedId))} type="button">Rimuovi spiegazione</button>}
          </>}
          {error && <p className="text-xs text-rose-300" role="alert">{error}</p>}
        </aside>
      </div>
    </div>
  );
}
