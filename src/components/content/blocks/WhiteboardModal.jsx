import { useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { Save, X } from "lucide-react";

export default function WhiteboardModal({ payload, onSave, onClose }) {
  const [api, setApi] = useState(null);

  function handleSave() {
    if (!api) return;
    const elements = api.getSceneElements().filter((element) => !element.isDeleted);
    const usedFileIds = new Set(
      elements.filter((element) => element.fileId).map((element) => element.fileId),
    );
    const files = Object.fromEntries(
      Object.entries(api.getFiles()).filter(([id]) => usedFileIds.has(id)),
    );
    onSave({ elements, files });
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
            onClick={onClose}
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
      <div className="min-h-0 flex-1">
        <Excalidraw
          excalidrawAPI={setApi}
          initialData={{
            elements: payload.elements ?? [],
            files: payload.files ?? {},
            appState: { theme: "dark" },
          }}
          langCode="it-IT"
          theme="dark"
        />
      </div>
    </div>
  );
}
