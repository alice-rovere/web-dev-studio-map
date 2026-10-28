import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Code2,
  ExternalLink,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import GlossaryText from "./GlossaryText";
import { updateNode } from "../services/mapService";

const INFO_SECTIONS = {
  best_practices: {
    title: "Best practice",
    icon: BookOpen,
    empty: "Nessuna best practice registrata.",
  },
  naming_conventions: {
    title: "Naming convention",
    icon: Code2,
    empty: "Nessuna naming convention registrata.",
  },
  study_urls: {
    title: "Collegamenti esterni",
    icon: ExternalLink,
    empty: "Nessun link disponibile per questo modulo.",
  },
};

const inputClass =
  "w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-zinc-600";

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value.split(/\r?\n/).filter((entry) => entry.trim().length > 0);
  }
  return [];
}

function InfoList({ values }) {
  return (
    <ul className="list-inside list-disc space-y-1.5 text-xs font-mono text-zinc-400">
      {values.map((value) => (
        <li key={value}>
          <GlossaryText>{value}</GlossaryText>
        </li>
      ))}
    </ul>
  );
}

function LinkList({ links }) {
  if (links.length === 0) {
    return (
      <p className="text-xs font-mono italic text-zinc-500">
        {INFO_SECTIONS.study_urls.empty}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {links.map((link, index) => (
        <li key={`${link.url}-${index}`}>
          <a
            className="flex items-center justify-between gap-3 rounded border border-zinc-800 bg-zinc-900/40 p-2 text-xs text-zinc-400 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
            href={link.url}
            rel="noreferrer"
            target="_blank"
          >
            <span className="min-w-0 wrap-break-word">
              <GlossaryText>{link.label || link.url}</GlossaryText>
            </span>
            <ExternalLink className="shrink-0" size={12} />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function NodeGenericInfo({
  nodeId,
  nodeData,
  canEdit = false,
  onNodeUpdated,
}) {
  const [editingSection, setEditingSection] = useState(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function startEditing(section) {
    setError("");
    setEditingSection(section);
    if (section === "study_urls") {
      setDraft(
        Array.isArray(nodeData.study_urls)
          ? nodeData.study_urls.map((link) => ({
              label: link.label ?? "",
              url: link.url ?? "",
            }))
          : [],
      );
    } else {
      setDraft(normalizeList(nodeData[section]).join("\n"));
    }
  }

  function stopEditing() {
    setEditingSection(null);
    setDraft("");
    setError("");
  }

  function updateLink(index, field, value) {
    setDraft((current) =>
      current.map((link, linkIndex) =>
        linkIndex === index ? { ...link, [field]: value } : link,
      ),
    );
  }

  async function saveSection(event) {
    event.preventDefault();
    setError("");

    let value;
    if (editingSection === "study_urls") {
      value = draft
        .map((link) => ({
          label: link.label.trim(),
          url: link.url.trim(),
        }))
        .filter((link) => link.label || link.url);

      if (value.some((link) => !link.label || !link.url)) {
        setError("Ogni link deve avere sia etichetta sia URL.");
        return;
      }
    } else {
      value = draft
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean);
    }

    setSaving(true);
    try {
      const savedNode = await updateNode(nodeId, {
        [editingSection]: value,
      });
      onNodeUpdated?.(savedNode);
      stopEditing();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Impossibile salvare le informazioni del nodo.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-3">
      {Object.entries(INFO_SECTIONS).map(([section, config]) => {
        const Icon = config.icon;
        const isEditing = editingSection === section;
        const value =
          section === "study_urls"
            ? Array.isArray(nodeData.study_urls)
              ? nodeData.study_urls
              : []
            : normalizeList(nodeData[section]);

        return (
          <details
            className="group rounded-lg border border-zinc-800 bg-zinc-950/60"
            key={section}
          >
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-300 marker:hidden">
              <Icon className="text-cyan-400" size={14} />
              <span>{config.title}</span>
              <ChevronDown
                className="ml-auto text-zinc-600 transition-transform group-open:rotate-180"
                size={14}
              />
            </summary>

            <div className="border-t border-zinc-800 px-4 py-4">
              {isEditing ? (
                <form className="space-y-3" onSubmit={saveSection}>
                  {section === "study_urls" ? (
                    <div className="space-y-3">
                      {draft.map((link, index) => (
                        <div
                          className="flex items-start gap-2"
                          key={`link-${index}`}
                        >
                          <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-2">
                            <input
                              aria-label={`Etichetta link ${index + 1}`}
                              className={inputClass}
                              onChange={(event) =>
                                updateLink(index, "label", event.target.value)
                              }
                              placeholder="Etichetta"
                              value={link.label}
                            />
                            <input
                              aria-label={`URL link ${index + 1}`}
                              className={inputClass}
                              onChange={(event) =>
                                updateLink(index, "url", event.target.value)
                              }
                              placeholder="https://..."
                              type="url"
                              value={link.url}
                            />
                          </div>
                          <button
                            aria-label={`Rimuovi link ${index + 1}`}
                            className="rounded border border-zinc-800 p-2 text-zinc-500 hover:text-rose-400"
                            onClick={() =>
                              setDraft((current) =>
                                current.filter(
                                  (_, linkIndex) => linkIndex !== index,
                                ),
                              )
                            }
                            type="button"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                      <button
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300"
                        onClick={() =>
                          setDraft((current) => [
                            ...current,
                            { label: "", url: "" },
                          ])
                        }
                        type="button"
                      >
                        <Plus size={13} />
                        Aggiungi link
                      </button>
                    </div>
                  ) : (
                    <textarea
                      aria-label={config.title}
                      className={`${inputClass} min-h-28 resize-y`}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder="Un elemento per riga"
                      value={draft}
                    />
                  )}

                  {error && (
                    <p className="text-xs text-rose-400" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      className="inline-flex items-center gap-1.5 rounded border border-cyan-500/30 bg-cyan-950/30 px-3 py-2 text-xs text-cyan-300 hover:bg-cyan-950/60 disabled:opacity-50"
                      disabled={saving}
                      type="submit"
                    >
                      <Save size={13} />
                      {saving ? "Salvataggio..." : "Salva"}
                    </button>
                    <button
                      className="inline-flex items-center gap-1.5 rounded border border-zinc-800 px-3 py-2 text-xs text-zinc-400 hover:text-white disabled:opacity-50"
                      disabled={saving}
                      onClick={stopEditing}
                      type="button"
                    >
                      <X size={13} />
                      Annulla
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  {section === "study_urls" ? (
                    <LinkList links={value} />
                  ) : value.length > 0 ? (
                    <InfoList values={value} />
                  ) : (
                    <p className="text-xs font-mono italic text-zinc-500">
                      {config.empty}
                    </p>
                  )}
                  {canEdit && (
                    <button
                      className="inline-flex items-center gap-1.5 rounded border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={Boolean(editingSection)}
                      onClick={() => startEditing(section)}
                      type="button"
                    >
                      <Pencil size={12} />
                      Modifica
                    </button>
                  )}
                </div>
              )}
            </div>
          </details>
        );
      })}
    </div>
  );
}
