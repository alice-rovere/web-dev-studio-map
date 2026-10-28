import { useCallback, useEffect, useRef, useState } from "react";
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
import { CalloutEditor } from "./blocks/CalloutBlock";
import { ImageEditor } from "./blocks/ImageBlock";
import { MermaidEditor } from "./blocks/MermaidBlock";
import { WhiteboardEditor } from "./blocks/WhiteboardBlock";
import {
  createSection,
  deleteNoteImages,
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
  { value: "callout", label: "Callout" },
  { value: "image", label: "Immagine" },
  { value: "mermaid", label: "Diagramma" },
  { value: "whiteboard", label: "Lavagna" },
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
    case "callout":
      return { variant: "note", title: "", text: "" };
    case "image":
      return { url: "", path: "", caption: "", alt: "" };
    case "mermaid":
      return { code: "" };
    case "whiteboard":
      return { elements: [], files: {} };
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
                Array.isArray(row) && row[index] != null
                  ? String(row[index])
                  : "",
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
    case "callout":
      return {
        variant: source.variant || "note",
        title: typeof source.title === "string" ? source.title : "",
        text: typeof source.text === "string" ? source.text : "",
      };
    case "image":
      return {
        url: typeof source.url === "string" ? source.url : "",
        path: typeof source.path === "string" ? source.path : "",
        caption: typeof source.caption === "string" ? source.caption : "",
        alt: typeof source.alt === "string" ? source.alt : "",
      };
    case "mermaid":
      return { code: typeof source.code === "string" ? source.code : "" };
    case "whiteboard":
      return {
        elements: Array.isArray(source.elements) ? source.elements : [],
        files:
          source.files && typeof source.files === "object" ? source.files : {},
      };
    default:
      return emptyPayload(type);
  }
}

function imagePaths(blocks) {
  return blocks
    .filter((block) => block?.type === "image" && block.payload?.path)
    .map((block) => block.payload.path);
}

function getSectionBlocks(section) {
  const payload = section.payload ?? {};

  if (Array.isArray(payload.blocks)) {
    return payload.blocks.map((block) => ({
      type: block?.type ?? "text",
      payload: ensurePayload(block?.type ?? "text", block?.payload),
    }));
  }

  return [
    {
      type: section.type,
      payload: ensurePayload(section.type, payload),
    },
  ];
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
      className={`inline-flex min-h-8 min-w-8 items-center justify-center rounded border border-zinc-800 p-1.5 transition-colors hover:bg-zinc-800/60 ${
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
          onClick={() =>
            update((previous) => ({ items: [...previous.items, ""] }))
          }
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
                  rows: [...previous.rows, previous.columns.map(() => "")],
                }))
              }
              type="button"
            >
              <Plus size={12} /> Riga
            </button>
          </div>
          <div className="grid gap-2">
            {payload.rows.map((row, rowIndex) => (
              <div className="overflow-x-auto" key={rowIndex}>
                <div
                  className="grid min-w-120 items-start gap-2"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const shared = { payload, update, fieldClass: fieldClass(), Label };

  if (type === "callout") return <CalloutEditor {...shared} />;
  if (type === "image") return <ImageEditor {...shared} />;
  if (type === "mermaid") return <MermaidEditor {...shared} />;
  if (type === "whiteboard") return <WhiteboardEditor {...shared} />;

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
  const [activeSectionId, setActiveSectionId] = useState(null);
  const tabRefs = useRef(new Map());

  const activeSection =
    sections.find((section) => section.id === activeSectionId) ??
    sections[0] ??
    null;
  const activeIndex = activeSection
    ? sections.findIndex((section) => section.id === activeSection.id)
    : -1;

  function handleTabKeyDown(event) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key) || sections.length === 0) return;

    event.preventDefault();

    let nextIndex;
    if (event.key === "ArrowRight") {
      nextIndex = (activeIndex + 1) % sections.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (activeIndex - 1 + sections.length) % sections.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else {
      nextIndex = sections.length - 1;
    }

    const nextSection = sections[nextIndex];
    if (!nextSection) return;

    setActiveSectionId(nextSection.id);
    tabRefs.current.get(nextSection.id)?.focus();
  }

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
      subtitle: "",
      blocks: [],
    });
    setActionError("");
  }

  function startEdit(section) {
    setDraft({
      id: section.id,
      title: section.title,
      subtitle: section.payload?.subtitle ?? "",
      blocks: getSectionBlocks(section),
    });
    setActiveSectionId(section.id);
    setActionError("");
  }

  function addBlock(type) {
    setDraft((previous) => ({
      ...previous,
      blocks: [...previous.blocks, { type, payload: emptyPayload(type) }],
    }));
  }

  function updateBlock(index, updater) {
    setDraft((previous) => ({
      ...previous,
      blocks: previous.blocks.map((block, blockIndex) =>
        blockIndex === index ? updater(block) : block,
      ),
    }));
  }

  function moveBlock(index, direction) {
    const target = index + direction;
    setDraft((previous) => {
      if (target < 0 || target >= previous.blocks.length) return previous;
      const blocks = [...previous.blocks];
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...previous, blocks };
    });
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
        const previousSection = sections.find((item) => item.id === draft.id);
        await updateSection(draft.id, {
          title: draft.title.trim(),
          type: "text",
          payload: { subtitle: draft.subtitle.trim(), blocks: draft.blocks },
        });
        if (previousSection) {
          const kept = new Set(imagePaths(draft.blocks));
          await deleteNoteImages(
            imagePaths(getSectionBlocks(previousSection)).filter(
              (path) => !kept.has(path),
            ),
          ).catch(() => {});
        }
      } else {
        const created = await createSection(nodeId, {
          title: draft.title.trim(),
          type: "text",
          payload: { subtitle: draft.subtitle.trim(), blocks: draft.blocks },
          sort_order: sections.length,
        });
        setActiveSectionId(created?.id ?? null);
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
      await deleteNoteImages(imagePaths(getSectionBlocks(section))).catch(
        () => {},
      );
      if (activeSection?.id === section.id) setActiveSectionId(null);
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
      {canEdit && !draft && (
        <div className="flex justify-end">
          <button
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/15"
            onClick={startNew}
            type="button"
          >
            <Plus size={13} /> Nuova sezione
          </button>
        </div>
      )}

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

      {!loading && sections.length > 0 && (
        <div
          aria-label="Sezioni del nodo"
          className="flex items-center gap-1 overflow-x-auto border-b border-zinc-900 scrollbar-none [&::-webkit-scrollbar]:hidden"
          role="tablist"
        >
          {sections.map((section) => {
            const isActive = activeSection?.id === section.id;

            return (
              <button
                aria-controls="node-sections-panel"
                aria-selected={isActive}
                className={`-mb-px min-h-10 shrink-0 whitespace-nowrap border-b-2 px-2.5 pt-2 pb-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors sm:px-3 ${
                  isActive
                    ? "border-cyan-400 text-white"
                    : "border-transparent text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
                id={`node-sections-tab-${section.id}`}
                key={section.id}
                onClick={() => {
                  setActiveSectionId(section.id);
                  setDraft(null);
                  setActionError("");
                }}
                onKeyDown={handleTabKeyDown}
                ref={(element) => {
                  if (element) {
                    tabRefs.current.set(section.id, element);
                  } else {
                    tabRefs.current.delete(section.id);
                  }
                }}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
              >
                {section.title}
              </button>
            );
          })}
        </div>
      )}

      <div
        aria-labelledby={
          activeSection ? `node-sections-tab-${activeSection.id}` : undefined
        }
        className="space-y-4"
        id="node-sections-panel"
        role={sections.length > 0 ? "tabpanel" : undefined}
        tabIndex={sections.length > 0 ? 0 : undefined}
      >
        {draft && (
          <form
            className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-5"
            onSubmit={handleSave}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
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

            <div className="grid gap-3">
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
                <Label>Sottotitolo</Label>
                <input
                  className={fieldClass()}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      subtitle: event.target.value,
                    }))
                  }
                  placeholder="Sottotitolo della sezione (facoltativo)"
                  value={draft.subtitle}
                />
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label>Contenuti della sezione</Label>
                <span className="text-[11px] text-zinc-500">
                  Aggiungi tutti i blocchi che vuoi
                </span>
              </div>

              {draft.blocks.map((block, index) => (
                <div
                  className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
                  key={`${block.type}-${index}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                      {SECTION_TYPES.find((type) => type.value === block.type)
                        ?.label ?? "Contenuto"}
                    </span>
                    <div className="flex items-center gap-1">
                      <IconButton
                        label="Sposta contenuto su"
                        onClick={() => moveBlock(index, -1)}
                      >
                        <ArrowUp size={12} />
                      </IconButton>
                      <IconButton
                        label="Sposta contenuto giù"
                        onClick={() => moveBlock(index, 1)}
                      >
                        <ArrowDown size={12} />
                      </IconButton>
                      <IconButton
                        danger
                        label="Rimuovi contenuto"
                        onClick={() =>
                          setDraft((previous) => ({
                            ...previous,
                            blocks: previous.blocks.filter(
                              (_, blockIndex) => blockIndex !== index,
                            ),
                          }))
                        }
                      >
                        <Trash2 size={12} />
                      </IconButton>
                    </div>
                  </div>
                  <PayloadEditor
                    draft={block}
                    setDraft={(updater) => updateBlock(index, updater)}
                  />
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                {SECTION_TYPES.map((type) => (
                  <button
                    className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-[11px] text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-white"
                    key={type.value}
                    onClick={() => addBlock(type.value)}
                    type="button"
                  >
                    <Plus size={12} /> {type.label}
                  </button>
                ))}
              </div>
            </div>

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
                className="min-h-10 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800/50"
                onClick={() => {
                  setDraft(null);
                  setActionError("");
                }}
                type="button"
              >
                Annulla
              </button>
              <button
                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
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

        {!loading && sections.length > 0 && activeSection && !draft && (
          <SectionCard
            actions={
              canEdit ? (
                <div className="flex items-center gap-1.5">
                  <IconButton
                    label="Sposta su"
                    onClick={() => moveSection(activeIndex, -1)}
                  >
                    <ArrowUp size={13} />
                  </IconButton>
                  <IconButton
                    label="Sposta giù"
                    onClick={() => moveSection(activeIndex, 1)}
                  >
                    <ArrowDown size={13} />
                  </IconButton>
                  <IconButton
                    label="Modifica sezione"
                    onClick={() => startEdit(activeSection)}
                  >
                    <Pencil size={13} />
                  </IconButton>
                  <IconButton
                    danger
                    label="Elimina sezione"
                    onClick={() => handleDelete(activeSection)}
                  >
                    <Trash2 size={13} />
                  </IconButton>
                </div>
              ) : null
            }
            key={activeSection.id}
            section={activeSection}
          />
        )}
      </div>

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
