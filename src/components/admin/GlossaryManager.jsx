import { useState } from "react";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useGlossary } from "../../hooks/useGlossary";
import { useAuth } from "../../hooks/useAuth";

const inputClass =
  "w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-slate-600";

export default function GlossaryManager() {
  const { isEditor } = useAuth();
  const {
    glossary,
    loading,
    error: loadError,
    refresh,
    addTerm,
    updateTerm,
    deleteTerm,
  } = useGlossary();

  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTerm, setEditTerm] = useState("");
  const [editDefinition, setEditDefinition] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const sortedGlossary = [...glossary].sort((a, b) =>
    a.term.localeCompare(b.term, "it", { sensitivity: "base" }),
  );

  async function handleAdd(event) {
    event.preventDefault();
    setMessage("");

    if (!term.trim() || !definition.trim()) {
      setMessage("Inserisci sia il termine sia la definizione.");
      return;
    }

    setSaving(true);
    const result = await addTerm({ term, definition });
    setSaving(false);

    if (result) {
      setMessage(result);
      return;
    }

    setTerm("");
    setDefinition("");
  }

  function startEdit(entry) {
    setEditingId(entry.id);
    setEditTerm(entry.term);
    setEditDefinition(entry.definition);
    setMessage("");
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setMessage("");

    if (!editTerm.trim() || !editDefinition.trim()) {
      setMessage("Inserisci sia il termine sia la definizione.");
      return;
    }

    setSaving(true);
    const result = await updateTerm(editingId, {
      term: editTerm,
      definition: editDefinition,
    });
    setSaving(false);

    if (result) {
      setMessage(result);
      return;
    }

    setEditingId(null);
  }

  async function handleDelete(entry) {
    if (!window.confirm(`Eliminare il termine "${entry.term}"?`)) return;

    setMessage("");
    setSaving(true);
    const result = await deleteTerm(entry.id);
    setSaving(false);

    if (result) setMessage(result);
  }

  return (
    <div className="space-y-5">
      {isEditor && (
        <form
          className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:p-5"
          onSubmit={handleAdd}
        >
          <div>
            <h2 className="text-sm font-bold text-white">Nuovo termine</h2>
            <p className="mt-1 text-xs text-slate-500">
              Il testo completo sarà visibile nel glossario; nei tooltip comparirà
              un'anteprima.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[240px_1fr]">
            <input
              className={inputClass}
              disabled={saving}
              onChange={(event) => setTerm(event.target.value)}
              aria-label="Termine"
              placeholder="Termine"
              value={term}
            />
            <textarea
              className={`${inputClass} resize-y leading-relaxed`}
              disabled={saving}
              onChange={(event) => setDefinition(event.target.value)}
              aria-label="Definizione"
              placeholder="Definizione (puoi usare più paragrafi)"
              rows={4}
              value={definition}
            />
          </div>

          {message && (
            <p
              className="rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300"
              role="alert"
            >
              {message}
            </p>
          )}

          <button
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            disabled={saving}
            type="submit"
          >
            <Plus size={13} />
            {saving ? "Salvataggio…" : "Aggiungi termine"}
          </button>
        </form>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-white">Termini</h2>
          <button
            className="text-[11px] text-slate-400 hover:text-white"
            onClick={refresh}
            type="button"
          >
            Ricarica
          </button>
        </div>

        {loading && (
          <p className="flex items-center gap-2 py-6 text-xs text-slate-500">
            <Loader2 className="animate-spin" size={14} />
            Caricamento glossario…
          </p>
        )}

        {loadError && !loading && (
          <p className="rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300">
            {loadError}
          </p>
        )}

        {!loading && glossary.length === 0 && !loadError && (
          <p className="py-6 text-center text-xs italic text-slate-600">
            Nessun termine presente.
          </p>
        )}

        <ul className="divide-y divide-slate-900">
          {sortedGlossary.map((entry) => (
            <li className="py-3" key={entry.id}>
              {editingId === entry.id ? (
                <form className="space-y-2" onSubmit={handleUpdate}>
                  <div className="grid gap-2 sm:grid-cols-[240px_1fr]">
                    <input
                      className={inputClass}
                      disabled={saving}
                      onChange={(event) => setEditTerm(event.target.value)}
                      aria-label="Termine"
                      value={editTerm}
                    />
                    <textarea
                      className={`${inputClass} resize-y leading-relaxed`}
                      disabled={saving}
                      onChange={(event) => setEditDefinition(event.target.value)}
                      aria-label="Definizione"
                      rows={4}
                      value={editDefinition}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-800 p-1.5 text-slate-400 hover:text-white"
                      onClick={() => setEditingId(null)}
                      type="button"
                    >
                      <X size={13} />
                    </button>
                    <button
                      className="inline-flex min-h-9 items-center gap-1 rounded border border-cyan-500/30 px-2 py-1 text-[11px] text-cyan-300 hover:bg-cyan-500/10"
                      disabled={saving}
                      type="submit"
                    >
                      <Save size={12} /> Salva
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200">
                      {entry.term}
                    </p>
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-xs leading-relaxed text-slate-400">
                      {entry.definition}
                    </p>
                  </div>
                  {isEditor && (
                    <div className="flex shrink-0 gap-1.5">
                      <button
                        aria-label="Modifica termine"
                        className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-800 p-1.5 text-slate-400 hover:text-white"
                        onClick={() => startEdit(entry)}
                        type="button"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        aria-label="Elimina termine"
                        className="inline-flex h-9 w-9 items-center justify-center rounded border border-slate-800 p-1.5 text-rose-400 hover:bg-slate-800/60"
                        onClick={() => handleDelete(entry)}
                        type="button"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
