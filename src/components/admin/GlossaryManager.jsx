import { useRef, useState } from "react";
import { ChevronRight, Loader2, Pencil, Save, Search, Trash2 } from "lucide-react";
import { useGlossary } from "../../hooks/useGlossary";
import { useAuth } from "../../hooks/useAuth";
import QuickGlossaryAdd from "../QuickGlossaryAdd";
import GlossaryDialog from "../GlossaryDialog";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const inputClass =
  "w-full rounded-lg border border-slate-700 bg-[#0e1624] px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/60";

function initialLetter(term) {
  const first = term.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")[0]?.toUpperCase();
  return letters.includes(first) ? first : "#";
}

export default function GlossaryManager() {
  const { isEditor } = useAuth();
  const { glossary, loading, error: loadError, refresh, updateTerm, deleteTerm } =
    useGlossary();
  const [letter, setLetter] = useState("Tutti");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editTerm, setEditTerm] = useState("");
  const [editDefinition, setEditDefinition] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const triggerRef = useRef(null);
  const selected = glossary.find((entry) => entry.id === selectedId);
  const sortedGlossary = [...glossary]
    .filter((entry) =>
      (letter === "Tutti" || initialLetter(entry.term) === letter) &&
      entry.term.toLocaleLowerCase("it").includes(search.trim().toLocaleLowerCase("it")),
    )
    .sort((a, b) => a.term.localeCompare(b.term, "it", { sensitivity: "base" }));

  function closeDetails() {
    if (saving) return;
    setSelectedId(null);
    setEditing(false);
    setMessage("");
  }

  function startEdit() {
    setEditTerm(selected.term);
    setEditDefinition(selected.definition);
    setMessage("");
    setEditing(true);
  }

  async function handleUpdate(event) {
    event.preventDefault();
    setMessage("");
    if (!editTerm.trim() || !editDefinition.trim()) {
      setMessage("Inserisci sia il termine sia la definizione.");
      return;
    }

    setSaving(true);
    try {
      const result = await updateTerm(selectedId, {
        term: editTerm,
        definition: editDefinition,
      });
      if (result) setMessage(result);
      else setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Eliminare il termine "${selected.term}"?`)) return;
    setMessage("");
    setSaving(true);
    try {
      const result = await deleteTerm(selectedId);
      if (result) setMessage(result);
      else {
        setSelectedId(null);
        setEditing(false);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/40 px-3">
          <Search className="shrink-0 text-slate-400" size={16} />
          <span className="sr-only">Cerca un termine</span>
          <input
            className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-slate-200 outline-none"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cerca un termine"
            value={search}
          />
        </label>
        {isEditor && (
          <QuickGlossaryAdd className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300" />
        )}
        <button className="min-h-10 text-xs text-slate-400 hover:text-white" onClick={refresh} type="button">
          Ricarica
        </button>
      </div>

      <div className="flex items-start gap-3">
        <nav aria-label="Filtra per iniziale" className="sticky top-2 flex max-h-[75dvh] shrink-0 flex-col gap-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/40 p-1.5">
          {["Tutti", ...letters, "#"].map((item) => (
            <button
              aria-pressed={letter === item}
              className={`min-h-8 rounded px-2 text-xs font-semibold transition-colors ${letter === item ? "bg-cyan-400 text-slate-950" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
              key={item}
              onClick={() => setLetter(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:p-5">
          <h2 className="mb-3 text-sm font-bold text-white">
            {letter === "Tutti" ? "Tutti i termini" : `Termini: ${letter}`}
          </h2>
          {loading && (
            <p className="flex items-center gap-2 py-6 text-xs text-slate-500">
              <Loader2 className="animate-spin" size={14} /> Caricamento glossario…
            </p>
          )}
          {loadError && !loading && (
            <p className="rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300" role="alert">
              {loadError}
            </p>
          )}
          {!loading && !loadError && sortedGlossary.length === 0 && (
            <p className="py-6 text-center text-xs italic text-slate-500">Nessun termine trovato.</p>
          )}
          {!loading && !loadError && (
            <ul className="divide-y divide-slate-800">
              {sortedGlossary.map((entry) => (
                <li key={entry.id}>
                  <button
                    className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 py-3 text-left text-sm font-semibold text-slate-200 hover:text-cyan-300"
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setSelectedId(entry.id);
                    }}
                    type="button"
                  >
                    <span className="wrap-break-word">{entry.term}</span>
                    <ChevronRight className="shrink-0" size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <GlossaryDialog
        open={Boolean(selected)}
        onOpenChange={(open) => { if (!open) closeDetails(); }}
        term={selected}
        saving={saving}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (triggerRef.current?.isConnected) triggerRef.current.focus();
        }}
      >
              {editing ? (
                <form className="space-y-4" onSubmit={handleUpdate}>
                  <label className="block space-y-1 text-xs text-slate-400">
                    <span>Termine</span>
                    <input className={inputClass} disabled={saving} onChange={(event) => setEditTerm(event.target.value)} value={editTerm} />
                  </label>
                  <label className="block space-y-1 text-xs text-slate-400">
                    <span>Definizione</span>
                    <textarea className={`${inputClass} resize-y leading-relaxed`} disabled={saving} onChange={(event) => setEditDefinition(event.target.value)} rows={10} value={editDefinition} />
                  </label>
                  <div className="flex justify-end gap-2">
                    <button className="rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:text-white" disabled={saving} onClick={() => setEditing(false)} type="button">Annulla</button>
                    <button className="inline-flex items-center gap-1 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50" disabled={saving} type="submit"><Save size={13} /> {saving ? "Salvataggio…" : "Salva"}</button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-slate-300">{selected?.definition}</p>
                  {isEditor && (
                    <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-800 pt-4">
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:text-white" disabled={saving} onClick={startEdit} type="button"><Pencil size={13} /> Modifica</button>
                      <button className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 py-2 text-xs text-rose-300 hover:bg-rose-500/10 disabled:opacity-50" disabled={saving} onClick={handleDelete} type="button"><Trash2 size={13} /> {saving ? "Eliminazione…" : "Elimina"}</button>
                    </div>
                  )}
                </>
              )}
              {message && <p className="mt-4 rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300" role="alert">{message}</p>}
      </GlossaryDialog>
    </div>
  );
}
