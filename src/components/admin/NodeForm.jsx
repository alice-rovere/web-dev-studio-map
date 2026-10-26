import { useMemo, useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from "../../data/baseNodes";
import { buildNodeGraph } from "../../flow/utils/nodeGraph";
import {
  createNode,
  deleteNode,
  setNodeCategories,
  setNodeParents,
  updateNode,
} from "../../services/mapService";

const CATEGORIES = ["frontend", "backend", "database"];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linesToArray(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toNumberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function FieldLabel({ children }) {
  return (
    <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
      {children}
    </span>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-slate-600";

export default function NodeForm({
  node,
  nodes,
  parents,
  categories,
  defaultParentId,
  onSaved,
  onCancel,
}) {
  const nodeCategories = useMemo(
    () => categories.filter((entry) => entry.node_id === node?.id),
    [categories, node],
  );
  const nodeParents = useMemo(
    () => parents.filter((entry) => entry.child_id === node?.id),
    [parents, node],
  );

  const [label, setLabel] = useState(node?.label ?? "");
  const [slug, setSlug] = useState(node?.slug ?? "");
  const [description, setDescription] = useState(node?.description ?? "");
  const [bestPractices, setBestPractices] = useState(
    (node?.best_practices ?? []).join("\n"),
  );
  const [namingConventions, setNamingConventions] = useState(
    (node?.naming_conventions ?? []).join("\n"),
  );
  const [studyUrls, setStudyUrls] = useState(
    Array.isArray(node?.study_urls) && node.study_urls.length > 0
      ? node.study_urls.map((entry) => ({
          label: entry.label ?? "",
          url: entry.url ?? "",
        }))
      : [],
  );
  const [positionX, setPositionX] = useState(
    node?.position_x != null ? String(node.position_x) : "",
  );
  const [positionY, setPositionY] = useState(
    node?.position_y != null ? String(node.position_y) : "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [categoryState, setCategoryState] = useState(() => {
    const state = Object.fromEntries(
      CATEGORIES.map((category) => [
        category,
        { selected: false, primary: false },
      ]),
    );
    for (const entry of nodeCategories) {
      state[entry.category] = {
        selected: true,
        primary: Boolean(entry.is_primary),
      };
    }
    const selected = CATEGORIES.filter((category) => state[category].selected);
    if (selected.length > 0 && !selected.some((c) => state[c].primary)) {
      state[selected[0]].primary = true;
    }
    return state;
  });

  const [parentState, setParentState] = useState(() => {
    const state = {};
    for (const candidate of nodes) {
      state[candidate.id] = {
        selected: false,
        primary: false,
        sort_order: 0,
      };
    }
    for (const relation of nodeParents) {
      state[relation.parent_id] = {
        selected: true,
        primary: Boolean(relation.is_primary),
        sort_order: relation.sort_order ?? 0,
      };
    }
    const selected = Object.entries(state).filter(([, value]) => value.selected);
    if (selected.length > 0 && !selected.some(([, value]) => value.primary)) {
      state[selected[0][0]].primary = true;
    }
    if (defaultParentId && state[defaultParentId]) {
      state[defaultParentId] = {
        ...state[defaultParentId],
        selected: true,
        primary:
          selected.length === 0 ? true : state[defaultParentId].primary,
      };
    }
    return state;
  });

  const graph = useMemo(
    () => buildNodeGraph({ nodes, parents, categories }),
    [nodes, parents, categories],
  );
  const descendants = useMemo(
    () => (node ? graph.getDescendants(node.id) : new Set()),
    [graph, node],
  );

  const selectedCategories = CATEGORIES.filter(
    (category) => categoryState[category].selected,
  );
  const selectedParentIds = Object.entries(parentState)
    .filter(([, value]) => value.selected)
    .map(([id]) => id);
  const hasParents = selectedParentIds.length > 0;

  function toggleCategory(category, checked) {
    setCategoryState((previous) => {
      const next = {
        ...previous,
        [category]: {
          selected: checked,
          primary: checked ? previous[category].primary : false,
        },
      };

      const selected = CATEGORIES.filter((entry) => next[entry].selected);
      if (
        selected.length > 0 &&
        !selected.some((entry) => next[entry].primary)
      ) {
        next[selected[0]].primary = true;
      }

      return next;
    });
  }

  function setPrimaryCategory(category) {
    setCategoryState((previous) =>
      Object.fromEntries(
        CATEGORIES.map((entry) => [
          entry,
          { ...previous[entry], primary: entry === category },
        ]),
      ),
    );
  }

  function toggleParent(parentId, checked) {
    setParentState((previous) => {
      const next = {
        ...previous,
        [parentId]: {
          ...previous[parentId],
          selected: checked,
          primary: checked ? previous[parentId].primary : false,
        },
      };

      const selected = Object.entries(next).filter(
        ([, value]) => value.selected,
      );
      if (selected.length > 0 && !selected.some(([, value]) => value.primary)) {
        next[selected[0][0]].primary = true;
      }

      return next;
    });
  }

  function setPrimaryParent(parentId) {
    setParentState((previous) =>
      Object.fromEntries(
        Object.entries(previous).map(([id, value]) => [
          id,
          { ...value, primary: id === parentId },
        ]),
      ),
    );
  }

  function updateStudyUrl(index, field, value) {
    setStudyUrls((previous) =>
      previous.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry,
      ),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const normalizedLabel = label.trim();
    const normalizedSlug = (slug.trim() || slugify(normalizedLabel)).trim();

    if (!normalizedLabel) {
      setError("La label è obbligatoria.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
      setError(
        "Lo slug deve contenere solo lettere minuscole, numeri e trattini.",
      );
      return;
    }

    if (selectedCategories.length === 0) {
      setError("Seleziona almeno una categoria.");
      return;
    }

    if (!selectedCategories.some((category) => categoryState[category].primary)) {
      setError("Seleziona una categoria primaria.");
      return;
    }

    if (hasParents && !selectedParentIds.some((id) => parentState[id].primary)) {
      setError("Seleziona un padre primario.");
      return;
    }

    if (
      hasParents &&
      selectedParentIds.filter((id) => parentState[id].primary).length > 1
    ) {
      setError("Può esserci un solo padre primario.");
      return;
    }

    if (hasParents && selectedParentIds.some((id) => descendants.has(id))) {
      setError("Uno dei padri selezionati creerebbe un ciclo.");
      return;
    }

    const urls = studyUrls
      .map((entry) => ({
        label: entry.label.trim(),
        url: entry.url.trim(),
      }))
      .filter((entry) => entry.label || entry.url);

    if (urls.some((entry) => !entry.label || !entry.url)) {
      setError("Ogni link deve avere sia etichetta sia URL.");
      return;
    }

    const payload = {
      label: normalizedLabel,
      slug: normalizedSlug,
      description: description.trim(),
      best_practices: linesToArray(bestPractices),
      naming_conventions: linesToArray(namingConventions),
      study_urls: urls,
      position_x: hasParents ? null : toNumberOrNull(positionX),
      position_y: hasParents ? null : toNumberOrNull(positionY),
    };

    const categoryLinks = selectedCategories.map((category) => ({
      category,
      is_primary: categoryState[category].primary,
    }));

    const parentLinks = selectedParentIds.map((parentId, index) => ({
      parent_id: parentId,
      is_primary: parentState[parentId].primary,
      sort_order: Number.isFinite(Number(parentState[parentId].sort_order))
        ? Number(parentState[parentId].sort_order)
        : index,
    }));

    setSaving(true);
    try {
      const savedNode = node
        ? await updateNode(node.id, payload)
        : await createNode(payload);

      await setNodeCategories(savedNode.id, categoryLinks);
      await setNodeParents(savedNode.id, parentLinks);

      await onSaved?.(savedNode.id);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Impossibile salvare il nodo.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!node) return;

    const confirmed = window.confirm(
      `Eliminare il nodo "${node.label}"? Relazioni, categorie e sezioni verranno eliminate. I figli che perdono l'ultimo padre diventeranno radici.`,
    );
    if (!confirmed) return;

    setSaving(true);
    try {
      await deleteNode(node.id);
      await onSaved?.(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Impossibile eliminare il nodo.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="space-y-6 rounded-xl border border-slate-800 bg-slate-950/40 p-5"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-white">
            {node ? `Modifica "${node.label}"` : "Nuovo nodo"}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Slug, categorie, padri e contenuti strutturati.
          </p>
        </div>
        <button
          aria-label="Chiudi form"
          className="rounded border border-slate-800 p-1.5 text-slate-400 hover:text-white"
          onClick={onCancel}
          type="button"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <FieldLabel>Label</FieldLabel>
          <input
            className={inputClass}
            onChange={(event) => {
              setLabel(event.target.value);
              if (!node && !slug) {
                setSlug(slugify(event.target.value));
              }
            }}
            placeholder="Es. Fetch API"
            required
            value={label}
          />
        </label>
        <label className="block">
          <FieldLabel>Slug</FieldLabel>
          <input
            className={inputClass}
            onChange={(event) => setSlug(event.target.value)}
            placeholder="fetch-api"
            required
            value={slug}
          />
        </label>
      </div>

      <label className="block">
        <FieldLabel>Descrizione</FieldLabel>
        <textarea
          className={`${inputClass} min-h-24 resize-y`}
          onChange={(event) => setDescription(event.target.value)}
          value={description}
        />
      </label>

      <section>
        <FieldLabel>Categorie</FieldLabel>
        <div className="grid gap-2 md:grid-cols-3">
          {CATEGORIES.map((category) => {
            const state = categoryState[category];
            return (
              <div
                className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2"
                key={category}
              >
                <label className="flex items-center gap-2 text-xs text-slate-300">
                  <input
                    checked={state.selected}
                    onChange={(event) =>
                      toggleCategory(category, event.target.checked)
                    }
                    type="checkbox"
                  />
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[category] }}
                  />
                  {CATEGORY_LABELS[category]}
                </label>
                <label
                  className={`flex items-center gap-1 text-[10px] font-mono uppercase ${
                    state.selected ? "text-slate-400" : "text-slate-700"
                  }`}
                  title="Categoria primaria"
                >
                  <input
                    checked={state.primary}
                    disabled={!state.selected}
                    name="primary-category"
                    onChange={() => setPrimaryCategory(category)}
                    type="radio"
                  />
                  primary
                </label>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <FieldLabel>Padri tecnici</FieldLabel>
        <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2">
          {nodes.length === 0 && (
            <p className="p-2 text-xs text-slate-500">
              Nessun altro nodo disponibile.
            </p>
          )}
          {nodes.map((candidate) => {
            if (candidate.id === node?.id) return null;
            const state = parentState[candidate.id] ?? {
              selected: false,
              primary: false,
              sort_order: 0,
            };
            const createsCycle = descendants.has(candidate.id);

            return (
              <div
                className={`flex flex-wrap items-center justify-between gap-2 rounded px-2 py-1.5 text-xs ${
                  state.selected ? "bg-slate-900/60" : ""
                }`}
                key={candidate.id}
              >
                <label
                  className={`flex min-w-0 flex-1 items-center gap-2 ${
                    createsCycle ? "text-slate-600" : "text-slate-300"
                  }`}
                  title={
                    createsCycle
                      ? "Questo nodo è un discendente: creerebbe un ciclo"
                      : undefined
                  }
                >
                  <input
                    checked={state.selected}
                    disabled={createsCycle}
                    onChange={(event) =>
                      toggleParent(candidate.id, event.target.checked)
                    }
                    type="checkbox"
                  />
                  <span className="truncate">{candidate.label}</span>
                </label>

                {state.selected && (
                  <span className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-[10px] font-mono uppercase text-slate-400">
                      <input
                        checked={state.primary}
                        name="primary-parent"
                        onChange={() => setPrimaryParent(candidate.id)}
                        type="radio"
                      />
                      primary
                    </label>
                    <label className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                      ordine
                      <input
                        className="w-14 rounded border border-slate-800 bg-slate-950 px-1 py-0.5 text-[10px] text-slate-300"
                        min="0"
                        onChange={(event) =>
                          setParentState((previous) => ({
                            ...previous,
                            [candidate.id]: {
                              ...previous[candidate.id],
                              sort_order: event.target.value,
                            },
                          }))
                        }
                        type="number"
                        value={state.sort_order}
                      />
                    </label>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-1 flex items-center justify-between">
          <FieldLabel>Best practice</FieldLabel>
          <span className="text-[10px] text-slate-600">una per riga</span>
        </div>
        <textarea
          className={`${inputClass} min-h-24 resize-y`}
          onChange={(event) => setBestPractices(event.target.value)}
          value={bestPractices}
        />
      </section>

      <section>
        <div className="mb-1 flex items-center justify-between">
          <FieldLabel>Naming convention</FieldLabel>
          <span className="text-[10px] text-slate-600">una per riga</span>
        </div>
        <textarea
          className={`${inputClass} min-h-20 resize-y`}
          onChange={(event) => setNamingConventions(event.target.value)}
          value={namingConventions}
        />
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <FieldLabel>Study URLs</FieldLabel>
          <button
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
            onClick={() =>
              setStudyUrls((previous) => [...previous, { label: "", url: "" }])
            }
            type="button"
          >
            <Plus size={12} /> Link
          </button>
        </div>
        <div className="space-y-2">
          {studyUrls.length === 0 && (
            <p className="text-xs text-slate-600">Nessun link configurato.</p>
          )}
          {studyUrls.map((entry, index) => (
            <div className="flex gap-2" key={index}>
              <input
                className={inputClass}
                onChange={(event) =>
                  updateStudyUrl(index, "label", event.target.value)
                }
                placeholder="Etichetta"
                value={entry.label}
              />
              <input
                className={inputClass}
                onChange={(event) =>
                  updateStudyUrl(index, "url", event.target.value)
                }
                placeholder="https://…"
                value={entry.url}
              />
              <button
                aria-label="Rimuovi link"
                className="rounded border border-slate-800 p-1.5 text-rose-400 hover:bg-slate-800/60"
                onClick={() =>
                  setStudyUrls((previous) =>
                    previous.filter((_, entryIndex) => entryIndex !== index),
                  )
                }
                type="button"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <FieldLabel>Posizione (solo nodi radice)</FieldLabel>
        <div className="grid grid-cols-2 gap-3">
          <input
            className={inputClass}
            onChange={(event) => setPositionX(event.target.value)}
            placeholder="position_x"
            type="number"
            value={positionX}
          />
          <input
            className={inputClass}
            onChange={(event) => setPositionY(event.target.value)}
            placeholder="position_y"
            type="number"
            value={positionY}
          />
        </div>
        <p className="mt-1 text-[10px] text-slate-600">
          Se il nodo ha padri, le coordinate vengono ignorate. Le radici senza
          coordinate sono posizionate automaticamente vicino alla categoria
          primaria.
        </p>
      </section>

      {error && (
        <p
          className="rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-900 pt-4">
        {node ? (
          <button
            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 disabled:opacity-50"
            disabled={saving}
            onClick={handleDelete}
            type="button"
          >
            <Trash2 size={13} /> Elimina nodo
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/50"
            onClick={onCancel}
            type="button"
          >
            Annulla
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            disabled={saving}
            type="submit"
          >
            <Save size={13} />
            {saving ? "Salvataggio…" : node ? "Salva modifiche" : "Crea nodo"}
          </button>
        </div>
      </div>
    </form>
  );
}
