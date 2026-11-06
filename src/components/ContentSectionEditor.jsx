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
import { WhiteboardEditor } from "./blocks/WhiteboardBlock";
import { RichTextEditor } from "./blocks/RichTextBlock";
import { getSectionBlocks, payloadWithBlocks, rebaseDraft } from "./sectionBlocks";
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
      return { ...source, text: typeof source.text === "string" ? source.text : "" };
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
              Array.from({ length: Math.max(columns.length, Array.isArray(row) ? row.length : 0) }, (_, index) =>
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
              ...entry,
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

function IconButton({ label, onClick, children, danger = false, disabled = false }) {
  return (
    <button
      aria-label={label}
      className={`inline-flex min-h-8 min-w-8 items-center justify-center rounded border border-zinc-800 p-1.5 transition-colors hover:bg-zinc-800/60 ${
        danger ? "text-rose-400" : "text-zinc-400 hover:text-white"
      }`}
      onClick={onClick}
      disabled={disabled}
      title={label}
      type="button"
    >
      {children}
    </button>
  );
}

function PayloadEditor({ draft, setDraft, onUploadingChange, onUploaded }) {
  const { type, payload } = draft;

  const update = (updater) =>
    setDraft((previous) => ({
      ...previous,
      payload: { ...previous.payload, ...updater(previous.payload) },
    }));

  if (type === "text") {
    return (
      <div>
        <Label>Testo</Label>
        <RichTextEditor payload={payload} update={update} />
      </div>
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

  const shared = { payload, update, fieldClass: fieldClass(), Label, onUploadingChange, onUploaded };

  if (type === "callout") return <CalloutEditor {...shared} />;
  if (type === "image") return <ImageEditor {...shared} />;
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

export default function ContentSectionEditor({ nodeId, canEdit = false, onDraftChange }) {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(Boolean(nodeId));
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [activeSectionId, setActiveSectionId] = useState(null);
  const tabRefs = useRef(new Map());
  const [uploading, setUploading] = useState(false);
  const uploadedPaths = useRef([]);

  const activeSection =
    sections.find((section) => section.id === activeSectionId) ??
    sections[0] ??
    null;
  const activeIndex = activeSection
    ? sections.findIndex((section) => section.id === activeSection.id)
    : -1;

  useEffect(() => {
    if (!draft) return undefined;
    const warn = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [draft]);

  const cleanupUploads = useCallback(async (paths) => {
    if (!paths.length) return;
    await deleteNoteImages(paths);
    uploadedPaths.current = uploadedPaths.current.filter((path) => !paths.includes(path));
  }, []);

  const discardDraft = useCallback(async () => {
    if (uploading || saving) return false;
    if (draft && !window.confirm("Abbandonare le modifiche non salvate?")) return false;
    setActionError("");
    const paths = [...uploadedPaths.current];
    try {
      if (paths.length) {
        setSaving(true);
        await cleanupUploads(paths);
      }
    } catch (cleanupError) {
      setActionError(cleanupError instanceof Error ? cleanupError.message : "Impossibile rimuovere le immagini non utilizzate.");
      return false;
    } finally {
      if (paths.length) setSaving(false);
    }
    setDraft(null);
    return true;
  }, [cleanupUploads, draft, saving, uploading]);

  useEffect(() => {
    onDraftChange?.(draft ? discardDraft : null);
    return () => onDraftChange?.(null);
  }, [discardDraft, draft, onDraftChange]);

  async function handleTabKeyDown(event) {
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
    if (!(await discardDraft())) return;

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

  async function refreshDraft() {
    setSaving(true);
    try {
      const latestSections = await fetchNodeSections(nodeId);
      setSections(latestSections);
      const latest = latestSections.find((section) => section.id === draft.section.id);
      const rebased = rebaseDraft(draft, latest);
      if (!rebased) {
        setActionError("Il contenuto che stai modificando è cambiato o è stato eliminato. La tua bozza rimane qui: confrontala con la sezione aggiornata e copiala prima di annullare.");
      } else {
        setDraft(rebased);
        setActionError("Dati aggiornati: la tua bozza è conservata e puoi riprovare a salvarla.");
      }
    } catch (refreshError) {
      setActionError(refreshError instanceof Error ? refreshError.message : "Impossibile aggiornare la sezione.");
    } finally {
      setSaving(false);
    }
  }

  function startNew() {
    setDraft({
      mode: "section",
      id: null,
      title: "",
      subtitle: "",
      blocks: [],
    });
    setActionError("");
  }

  function startEdit(section) {
    setDraft({
      mode: "section",
      id: section.id,
      section,
      title: section.title,
      subtitle: section.payload?.subtitle ?? "",
      blocks: [],
    });
    setActiveSectionId(section.id);
    setActionError("");
  }

  function addBlock(type) {
    setDraft({
      mode: "block",
      section: activeSection,
      blockIndex: null,
      blocks: [{ id: crypto.randomUUID(), type, payload: emptyPayload(type) }],
    });
    setActionError("");
  }

  function startBlock(section, index) {
    const block = getSectionBlocks(section)[index];
    setDraft({
      mode: "block",
      section,
      blockIndex: index,
      blocks: [{ ...block, payload: { ...block.payload, ...ensurePayload(block.type, block.payload) } }],
    });
    setActionError("");
  }

  function updateBlock(index, updater) {
    setDraft((previous) => ({
      ...previous,
      blocks: previous.blocks.map((block, blockIndex) =>
        blockIndex === index ? updater(block) : block,
      ),
    }));
  }

  async function changeBlocks(section, blocks) {
    setSaving(true);
    setActionError("");
    try {
      await updateSection(section.id, {
        type: "text",
        payload: payloadWithBlocks(section, blocks),
      }, section.updated_at);
      await loadSections();
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : "Impossibile aggiornare il contenuto.");
    } finally {
      setSaving(false);
    }
  }

  function moveBlock(index, direction) {
    const target = index + direction;
    const blocks = [...getSectionBlocks(activeSection)];
    if (target < 0 || target >= blocks.length) return;
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    changeBlocks(activeSection, blocks);
  }

  function removeBlock(index) {
    if (!window.confirm("Eliminare questo contenuto? L'operazione non può essere annullata.")) return;
    changeBlocks(activeSection, getSectionBlocks(activeSection).filter((_, current) => current !== index));
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!draft) return;

    if (draft.mode === "section" && !draft.title.trim()) {
      setActionError("Il titolo della sezione è obbligatorio.");
      return;
    }

    setSaving(true);
    setActionError("");

    try {
      if (draft.mode === "block") {
        const section = draft.section;
        const blocks = [...getSectionBlocks(section)];
        if (draft.blockIndex === null) blocks.push(draft.blocks[0]);
        else blocks[draft.blockIndex] = draft.blocks[0];
        await updateSection(section.id, {
          type: "text",
          payload: payloadWithBlocks(section, blocks),
        }, section.updated_at);
        const keptPath = draft.blocks[0].type === "image" ? draft.blocks[0].payload.path : null;
        const unusedPaths = uploadedPaths.current.filter((path) => path !== keptPath);
        uploadedPaths.current = unusedPaths;
        try {
          await cleanupUploads(unusedPaths);
        } catch (cleanupError) {
          setActionError(cleanupError instanceof Error ? cleanupError.message : "Impossibile rimuovere le immagini non utilizzate.");
        }
      } else if (draft.id) {
        await updateSection(draft.id, {
          title: draft.title.trim(),
          payload: { ...draft.section.payload, subtitle: draft.subtitle.trim() },
        }, draft.section.updated_at);
      } else {
        const created = await createSection(nodeId, {
          title: draft.title.trim(),
          type: "text",
          payload: { subtitle: draft.subtitle.trim(), blocks: [] },
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
      await deleteSection(section.id, section.updated_at);
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
            disabled={saving}
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
                onClick={async () => {
                  if (section.id === activeSection?.id) return;
                  if (!(await discardDraft())) return;
                  setActiveSectionId(section.id);
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
                {draft.mode === "block" ? "Modifica contenuto" : draft.id ? "Modifica sezione" : "Nuova sezione"}
              </h3>
              <button
                aria-label="Annulla modifica"
                className="rounded border border-zinc-800 p-1.5 text-zinc-400 hover:text-white"
                onClick={discardDraft}
                type="button"
              >
                <X size={14} />
              </button>
            </div>

            {draft.mode === "section" && <div className="grid gap-3">
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
            </div>}

            {draft.mode === "block" && <div className="space-y-3">
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
                  </div>
                  <PayloadEditor
                    draft={block}
                    onUploadingChange={setUploading}
                    onUploaded={(path) => uploadedPaths.current.push(path)}
                    setDraft={(updater) => updateBlock(index, updater)}
                  />
                </div>
              ))}

            </div>}

            {actionError && (
              <div
                className="rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300"
                role="alert"
              >
                <p>{actionError}</p>
                {draft.section && (
                  <button className="mt-2 underline" disabled={saving} onClick={refreshDraft} type="button">
                    Aggiorna la sezione mantenendo la bozza
                  </button>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-zinc-900 pt-3">
              <button
                className="min-h-10 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800/50"
                onClick={discardDraft}
                type="button"
              >
                Annulla
              </button>
              <button
                className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-white disabled:opacity-50"
                disabled={saving || uploading}
                type="submit"
              >
                <Save size={13} />
                {saving ? "Salvataggio…" : draft.mode === "block" ? "Salva contenuto" : "Salva sezione"}
              </button>
            </div>
          </form>
        )}

        {draft && actionError && activeSection && (
          <div>
            <p className="mb-2 text-xs text-zinc-400">Versione caricata della sezione</p>
            <SectionCard section={activeSection} />
          </div>
        )}
        {!loading && !error && sections.length === 0 && !draft && (
          <p className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/30 py-12 text-center text-sm italic text-zinc-500">
            Gli approfondimenti strutturati per questo nodo non sono ancora
            disponibili.
          </p>
        )}

        {!loading && sections.length > 0 && activeSection && !draft && (
          <>
          <SectionCard
            actions={
              canEdit ? (
                <div className="flex items-center gap-1.5">
                  <IconButton
                    label="Sposta su"
                    disabled={saving}
                    onClick={() => moveSection(activeIndex, -1)}
                  >
                    <ArrowUp size={13} />
                  </IconButton>
                  <IconButton
                    label="Sposta giù"
                    disabled={saving}
                    onClick={() => moveSection(activeIndex, 1)}
                  >
                    <ArrowDown size={13} />
                  </IconButton>
                  <IconButton
                    label="Modifica sezione"
                    disabled={saving}
                    onClick={() => startEdit(activeSection)}
                  >
                    <Pencil size={13} />
                  </IconButton>
                  <IconButton
                    danger
                    label="Elimina sezione"
                    disabled={saving}
                    onClick={() => handleDelete(activeSection)}
                  >
                    <Trash2 size={13} />
                  </IconButton>
                </div>
              ) : null
            }
            blockActions={canEdit ? (block, index) => (
              <div className="flex items-center justify-between gap-2 border-b border-zinc-800/50 pb-1">
                <span className="font-mono text-[10px] uppercase text-zinc-500">
                  {SECTION_TYPES.find((entry) => entry.value === block.type)?.label ?? "Contenuto sconosciuto"}
                </span>
                <div className="flex gap-1">
                  <IconButton disabled={saving || index === 0} label="Sposta contenuto su" onClick={() => moveBlock(index, -1)}><ArrowUp size={12} /></IconButton>
                  <IconButton disabled={saving || index === getSectionBlocks(activeSection).length - 1} label="Sposta contenuto giù" onClick={() => moveBlock(index, 1)}><ArrowDown size={12} /></IconButton>
                  {SECTION_TYPES.some((entry) => entry.value === block.type) && (
                    <IconButton disabled={saving} label="Modifica contenuto" onClick={() => startBlock(activeSection, index)}><Pencil size={12} /></IconButton>
                  )}
                  <IconButton disabled={saving} danger label="Elimina contenuto" onClick={() => removeBlock(index)}><Trash2 size={12} /></IconButton>
                </div>
              </div>
            ) : undefined}
            key={activeSection.id}
            section={activeSection}
          />
          {canEdit && (
            <div className="flex flex-wrap gap-2">
              {SECTION_TYPES.map((type) => (
                <button
                  className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-zinc-800 px-2.5 py-1.5 text-[11px] text-zinc-300 hover:bg-zinc-800/50 disabled:opacity-50"
                  disabled={saving}
                  key={type.value}
                  onClick={() => addBlock(type.value)}
                  type="button"
                >
                  <Plus size={12} /> {type.label}
                </button>
              ))}
            </div>
          )}
          </>
        )}
      </div>

      {actionError && !draft && (
        <div
          className="rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300"
          role="alert"
        >
          <p>{actionError}</p>
          <button className="mt-2 underline" onClick={retryLoad} type="button">Ricarica sezioni</button>
        </div>
      )}
    </section>
  );
}
