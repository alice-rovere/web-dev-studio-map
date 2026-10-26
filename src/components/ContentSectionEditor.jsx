import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { SectionCard } from "./ContentSectionView";
import {
  createSection,
  deleteSection,
  fetchNodeSections,
  reorderSections,
  updateSection,
} from "../services/mapService";

const SECTION_TYPES = [
  { value: "text", label: "Testo" },
  { value: "code", label: "Codice" },
  { value: "list", label: "Lista" },
  { value: "table", label: "Tabella" },
  { value: "timeline", label: "Timeline" },
];

const CODE_LANGUAGES = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "html",
  "css",
  "json",
  "sql",
  "bash",
  "text",
];

function emptyPayload(type) {
  switch (type) {
    case "code":
      return { code: "", language: "js" };
    case "list":
      return { items: [""] };
    case "table":
      return { columns: ["Colonna 1"], rows: [[""]] };
    case "timeline":
      return { entries: [{ date: "", title: "", description: "" }] };
    default:
      return { text: "" };
  }
}

function ensurePayload(type, payload) {
  const source = payload && typeof payload === "object" ? payload : {};

  switch (type) {
    case "text":
      return { text: typeof source.text === "string" ? source.text : "" };
    case "code":
      return {
        code: typeof source.code === "string" ? source.code : "",
        language: source.language || "js",
      };
    case "list":
      return {
        items:
          Array.isArray(source.items) && source.items.length > 0
            ? source.items.map(String)
            : [""],
      };
    case "table": {
      const columns =
        Array.isArray(source.columns) && source.columns.length > 0
          ? source.columns.map(String)
          : ["Colonna 1"];
      const rows =
        Array.isArray(source.rows) && source.rows.length > 0
          ? source.rows.map((row) =>
              columns.map((_, index) =>
                Array.isArray(row) && row[index] != null ? String(row[index]) : "",
              ),
            )
          : [columns.map(() => "")];
      return { columns, rows };
    }
    case "timeline":
      return {
        entries:
          Array.isArray(source.entries) && source.entries.length > 0
            ? source.entries.map((entry) => ({
                date: entry?.date ?? "",
                title: entry?.title ?? "",
                description: entry?.description ?? "",
              }))
            : [{ date: "", title: "", description: "" }],
      };
    default:
      return emptyPayload(type);
  }
}

function fieldClass() {
  return "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-600";
}

function Label({ children }) {
  return (
    <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-zinc-500">
      {children}
    </span>
  );
}

function IconButton({ label, onClick, children, danger = false }) {
  return (
    <button
      aria-label={label}
      className={`rounded border border-zinc-800 p-1.5 transition-colors hover:bg-zinc-800/60 ${
        danger ? "text-rose-400" : "text-zinc-400 hover:text-white"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function PayloadEditor({ draft, setDraft }) {
  const { type, payload } = draft;

  const update = (updater) =>
    setDraft((previous) => ({
      ...previous,
      payload: updater(previous.payload),
    }));

  if (type === "text") {
    return (
      <label className="block">
        <Label>Testo</Label>
        <textarea
          className={`${fieldClass()} min-h-28 resize-y`}
          onChange={(event) => update(() => ({ text: event.target.value }))}
          placeholder="Scrivi il contenuto della sezione…"
          value={payload.text}
        />
      </label>
    );
  }

  if (type === "code") {
    return (
      <div className="grid gap-3">
        <label className="block">
          <Label>Codice</Label>
          <textarea
            className={`${fieldClass()} min-h-32 resize-y font-mono`}
            onChange={(event) => update(() => ({ code: event.target.value }))}
            placeholder="// codice di esempio"
            spellCheck="false"
            value={payload.code}
          />
        </label>
        <label className="block">
          <Label>Linguaggio</Label>
          <select
            className={fieldClass()}
            onChange={(event) =>
              update(() => ({
                code: payload.code,
                language: event.target.value,
              }))
            }
            value={payload.language}
          >
            {CODE_LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="grid gap-2">
        <Label>Voci della lista</Label>
        {payload.items.map((item, index) => (
          <div className="flex gap-2" key={index}>
            <input
              className={fieldClass()}
              onChange={(event) =>
                update((previous) => ({
                  items: previous.items.map((value, itemIndex) =>
                    itemIndex === index ? event.target.value : value,
                  ),
                }))
              }
              placeholder={`Voce ${index + 1}`}
              value={item}
            />
            <IconButton
              danger
              label="Rimuovi voce"
              onClick={() =>
                update((previous) => ({
                  items:
                    previous.items.length > 1
                      ? previous.items.filter(
                          (_, itemIndex) => itemIndex !== index,
                        )
                      : [""],
                }))
              }
            >
              <Trash2 size={13} />
            </IconButton>
          </div>
        ))}
        <button
          className="inline-flex w-fit items-center gap-1 rounded border border-zinc-800 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-800/50"
          onClick={() => update((previous) => ({ items: [...previous.items, ""] }))}
          type="button"
        >
          <Plus size={12} /> Aggiungi voce
        </button>
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="grid gap-3">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>Colonne</Label>
            <button
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
              onClick={() =>
                update((previous) => {
                  const columns = [
                    ...previous.columns,
                    `Colonna ${previous.columns.length + 1}`,
                  ];
                  return {
                    columns,
                    rows: previous.rows.map((row) => [...row, ""]),
                  };
                })
              }
              type="button"
            >
              <Plus size={12} /> Colonna
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {payload.columns.map((column, columnIndex) => (
              <div className="flex gap-1" key={columnIndex}>
                <input
                  className={fieldClass()}
                  onChange={(event) =>
                    update((previous) => ({
                      columns: previous.columns.map((value, index) =>
                        index === columnIndex ? event.target.value : value,
                      ),
                      rows: previous.rows,
                    }))
                  }
                  value={column}
                />
                <IconButton
                  danger
                  label="Rimuovi colonna"
                  onClick={() =>
                    update((previous) => ({
                      columns:
                        previous.columns.length > 1
                          ? previous.columns.filter(
                              (_, index) => index !== columnIndex,
                            )
                          : ["Colonna 1"],
                      rows:
                        previous.columns.length > 1
                          ? previous.rows.map((row) =>
                              row.filter((_, index) => index !== columnIndex),
                            )
                          : [[""]],
                    }))
                  }
                >
                  <Trash2 size={12} />
                </IconButton>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label>Righe</Label>
            <button
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
              onClick={() =>
                update((previous) => ({
                  columns: previous.columns,
                  rows: [
                    ...previous.rows,
                    previous.columns.map(() => ""),
                  ],
                }))
              }
              type="button"
            >
              <Plus size={12} /> Riga
            </button>
          </div>
          <div className="grid gap-2">
            {payload.rows.map((row, rowIndex) => (
              <div
                className="grid items-start gap-2"
                key={rowIndex}
                style={{
                  gridTemplateColumns: `repeat(${payload.columns.length}, minmax(0, 1fr)) auto`,
                }}
              >
                {payload.columns.map((_, columnIndex) => (
                  <input
                    className={fieldClass()}
                    key={columnIndex}
                    onChange={(event) =>
                      update((previous) => ({
                        columns: previous.columns,
                        rows: previous.rows.map((currentRow, index) =>
                          index === rowIndex
                            ? currentRow.map((cell, cellIndex) =>
                                cellIndex === columnIndex
                                  ? event.target.value
                                  : cell,
                              )
                            : currentRow,
                        ),
                      }))
                    }
                    value={row[columnIndex] ?? ""}
                  />
                ))}
                <IconButton
                  danger
                  label="Rimuovi riga"
                  onClick={() =>
                    update((previous) => ({
                      columns: previous.columns,
                      rows:
                        previous.rows.length > 1
                          ? previous.rows.filter(
                              (_, index) => index !== rowIndex,
                            )
                          : [previous.columns.map(() => "")],
                    }))
                  }
                >
                  <Trash2 size={13} />
                </IconButton>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <Label>Voci della timeline</Label>
        <button
          className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white"
          onClick={() =>
            update((previous) => ({
              entries: [
                ...previous.entries,
                { date: "", title: "", description: "" },
              ],
            }))
          }
          type="button"
        >
          <Plus size={12} /> Voce
        </button>
      </div>
      {payload.entries.map((entry, index) => (
        <div
          className="relative grid gap-2 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3"
          key={index}
        >
          <div className="grid gap-2 md:grid-cols-[140px_1fr]">
            <input
              className={fieldClass()}
              onChange={(event) =>
                update((previous) => ({
                  entries: previous.entries.map((value, entryIndex) =>
                    entryIndex === index
                      ? { ...value, date: event.target.value }
                      : value,
                  ),
                }))
              }
              placeholder="Data / Fase"
              value={entry.date}
            />
            <input
              className={fieldClass()}
              onChange={(event) =>
                update((previous) => ({
                  entries: previous.entries.map((value, entryIndex) =>
                    entryIndex === index
                      ? { ...value, title: event.target.value }
                      : value,
                  ),
                }))
              }
              placeholder="Titolo"
              value={entry.title}
            />
          </div>
          <textarea
            className={`${fieldClass()} min-h-20 resize-y`}
            onChange={(event) =>
              update((previous) => ({
                entries: previous.entries.map((value, entryIndex) =>
                  entryIndex === index
                    ? { ...value, description: event.target.value }
                    : value,
                ),
              }))
            }
            placeholder="Descrizione"
            value={entry.description}
          />
          <div className="flex justify-end">
            <IconButton
              danger
              label="Rimuovi voce"
              onClick={() =>
                update((previous) => ({
                  entries:
                    previous.entries.length > 1
                      ? previous.entries.filter(
                          (_, entryIndex) => entryIndex !== index,
                        )
                      : [{ date: "", title: "", description: "" }],
                }))
              }
            >
              <Trash2 size={13} />
            </IconButton>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ContentSectionEditor({ nodeId, canEdit = false }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(Boolean(nodeId));
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadSections = useCallback(async () => {
    if (!nodeId) return;

    try {
      const nextSections = await fetchNodeSections(nodeId);
      setSections(nextSections);
      setError(null);
    } catch (loadError) {
      setSections([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Impossibile caricare gli approfondimenti.",
      );
    } finally {
      setLoading(false);
    }
  }, [nodeId]);

  useEffect(() => {
    // Caricamento iniziale: gli aggiornamenti di stato avvengono dopo la richiesta.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSections();
  }, [loadSections]);

  async function retryLoad() {
    setLoading(true);
    await loadSections();
  }

  function startNew() {
    setDraft({
      id: null,
      title: "",
      type: "text",
      payload: emptyPayload("text"),
    });
    setActionError("");
  }

  function startEdit(section) {
    setDraft({
      id: section.id,
      title: section.title,
      type: section.type,
      payload: ensurePayload(section.type, section.payload),
    });
    setActionError("");
  }

  function changeType(type) {
    setDraft((previous) => ({
      ...previous,
      type,
      payload: ensurePayload(type, previous.payload),
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!draft) return;

    if (!draft.title.trim()) {
      setActionError("Il titolo della sezione è obbligatorio.");
      return;
    }

    setSaving(true);
    setActionError("");

    try {
      if (draft.id) {
        await updateSection(draft.id, {
          title: draft.title.trim(),
          type: draft.type,
          payload: draft.payload,
        });
      } else {
        await createSection(nodeId, {
          title: draft.title.trim(),
          type: draft.type,
          payload: draft.payload,
          sort_order: sections.length,
        });
      }

      setDraft(null);
      await loadSections();
    } catch (saveError) {
      setActionError(
        saveError instanceof Error
          ? saveError.message
          : "Impossibile salvare la sezione.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(section) {
    if (!window.confirm(`Eliminare la sezione "${section.title}"?`)) return;

    setSaving(true);
    try {
      await deleteSection(section.id);
      await loadSections();
    } catch (deleteError) {
      setActionError(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossibile eliminare la sezione.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function moveSection(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;

    const nextSections = [...sections];
    [nextSections[index], nextSections[target]] = [
      nextSections[target],
      nextSections[index],
    ];

    setSaving(true);
    try {
      await reorderSections(nextSections);
      await loadSections();
    } catch (moveError) {
      setActionError(
        moveError instanceof Error
          ? moveError.message
          : "Impossibile riordinare le sezioni.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-900 pb-3">
        <div>
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-zinc-200">
            Approfondimenti strutturati
          </h2>
          <p className="text-xs text-zinc-500">
            {sections.length} sezioni caricate dal database
          </p>
        </div>
        {canEdit && !draft && (
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/15"
            onClick={startNew}
            type="button"
          >
            <Plus size={13} /> Nuova sezione
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-rose-500/30 bg-rose-950/10 px-3 py-2 text-xs text-rose-300">
          <span>{error}</span>
          <button
            className="font-semibold hover:underline"
            onClick={retryLoad}
            type="button"
          >
            Riprova
          </button>
        </div>
      )}

      {loading && (
        <p className="flex items-center gap-2 py-8 text-xs text-zinc-500">
          <Loader2 className="animate-spin" size={14} /> Caricamento
          approfondimenti…
        </p>
      )}

      {draft && (
        <form
          className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5"
          onSubmit={handleSave}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-200">
              {draft.id ? "Modifica sezione" : "Nuova sezione"}
            </h3>
            <button
              aria-label="Annulla modifica"
              className="rounded border border-zinc-800 p-1.5 text-zinc-400 hover:text-white"
              onClick={() => {
                setDraft(null);
                setActionError("");
              }}
              type="button"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_180px]">
            <label className="block">
              <Label>Titolo</Label>
              <input
                className={fieldClass()}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    title: event.target.value,
                  }))
                }
                placeholder="Titolo della sezione"
                value={draft.title}
              />
            </label>
            <label className="block">
              <Label>Tipo</Label>
              <select
                className={fieldClass()}
                onChange={(event) => changeType(event.target.value)}
                value={draft.type}
              >
                {SECTION_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <PayloadEditor draft={draft} setDraft={setDraft} />

          {actionError && (
            <p
              className="rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300"
              role="alert"
            >
              {actionError}
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-zinc-900 pt-3">
            <button
              className="rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800/50"
              onClick={() => {
                setDraft(null);
                setActionError("");
              }}
              type="button"
            >
              Annulla
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
              disabled={saving}
              type="submit"
            >
              <Save size={13} />
              {saving ? "Salvataggio…" : "Salva sezione"}
            </button>
          </div>
        </form>
      )}

      {!loading && !error && sections.length === 0 && !draft && (
        <p className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 py-12 text-center text-sm italic text-zinc-500">
          Gli approfondimenti strutturati per questo nodo non sono ancora
          disponibili.
        </p>
      )}

      {!loading && sections.length > 0 && (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <SectionCard
              actions={
                canEdit ? (
                  <div className="flex items-center gap-1.5">
                    <IconButton
                      label="Sposta su"
                      onClick={() => moveSection(index, -1)}
                    >
                      <ArrowUp size={13} />
                    </IconButton>
                    <IconButton
                      label="Sposta giù"
                      onClick={() => moveSection(index, 1)}
                    >
                      <ArrowDown size={13} />
                    </IconButton>
                    <IconButton
                      label="Modifica sezione"
                      onClick={() => startEdit(section)}
                    >
                      <Pencil size={13} />
                    </IconButton>
                    <IconButton
                      danger
                      label="Elimina sezione"
                      onClick={() => handleDelete(section)}
                    >
                      <Trash2 size={13} />
                    </IconButton>
                  </div>
                ) : null
              }
              key={section.id}
              section={section}
            />
          ))}
        </div>
      )}

      {actionError && !draft && (
        <p
          className="rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300"
          role="alert"
        >
          {actionError}
        </p>
      )}
    </section>
  );
}
