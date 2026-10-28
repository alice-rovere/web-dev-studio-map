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
      <p className="text-xs text-zinc-500 font-mono italic">
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
  const [activeSection, setActiveSection] = useState(null);
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
      setEditingSection(null);
      setDraft("");
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

  function renderSectionContent(section) {
    const config = INFO_SECTIONS[section];
    const isEditing = editingSection === section;
    const value =
      section === "study_urls"
        ? Array.isArray(nodeData.study_urls)
          ? nodeData.study_urls
          : []
        : normalizeList(nodeData[section]);

    return (
      <>
        {isEditing ? (
          <form className="space-y-3" onSubmit={saveSection}>
            {section === "study_urls" ? (
              <div className="space-y-3">
                {draft.map((link, index) => (
                  <div className="flex items-start gap-2" key={`link-${index}`}>
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
                    setDraft((current) => [...current, { label: "", url: "" }])
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
              <p className="text-xs text-zinc-500 font-mono italic">
                {config.empty}
              </p>
            )}
            {canEdit && (
              <button
                className="inline-flex items-center gap-1.5 rounded border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-400 hover:border-zinc-700 hover:text-white"
                onClick={() => startEditing(section)}
                type="button"
              >
                <Pencil size={12} />
                Modifica
              </button>
            )}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <aside
        aria-label="Informazioni del nodo"
        className="hidden min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-3 2xl:grid"
      >
        {activeSection && (
          <section
            id={`node-info-${activeSection}`}
            aria-label={INFO_SECTIONS[activeSection].title}
            className="min-w-0 rounded-lg border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl"
          >
            <h3 className="mb-3 flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs font-semibold uppercase tracking-wider text-zinc-300">
              {(() => {
                const Icon = INFO_SECTIONS[activeSection].icon;
                return <Icon className="text-cyan-400" size={14} />;
              })()}
              {INFO_SECTIONS[activeSection].title}
            </h3>
            {renderSectionContent(activeSection)}
          </section>
        )}

        <nav
          aria-label="Informazioni generiche"
          className="flex flex-col gap-2 lg:col-start-2"
        >
          {Object.entries(INFO_SECTIONS).map(([section, config]) => {
            const Icon = config.icon;
            const expanded = activeSection === section;
            return (
              <button
                aria-controls={
                  expanded ? `node-info-${section}` : undefined
                }
                aria-expanded={expanded}
                aria-label={`${expanded ? "Chiudi" : "Apri"} ${config.title}`}
                className={`inline-flex h-10 w-10 items-center justify-center gap-1 rounded-lg border transition-colors ${
                  expanded
                    ? "border-cyan-500/40 bg-cyan-950/30 text-cyan-300"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white"
                }`}
                key={section}
                onClick={() =>
                  setActiveSection((current) =>
                    current === section ? null : section,
                  )
                }
                title={config.title}
                type="button"
              >
                <Icon size={15} />
                <ChevronDown
                  className={`transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                  size={11}
                />
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="space-y-3 2xl:hidden">
        {Object.entries(INFO_SECTIONS).map(([section, config]) => {
          const Icon = config.icon;
          return (
            <details
              className="group rounded-lg border border-zinc-800 bg-zinc-950/60"
              key={section}
            >
              <summary
                aria-label={config.title}
                className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-zinc-300 marker:hidden"
                title={config.title}
              >
                <Icon className="text-cyan-400" size={16} />
                <span className="sr-only">{config.title}</span>
                <ChevronDown
                  className="ml-auto text-zinc-500 transition-transform group-open:rotate-180"
                  size={14}
                />
              </summary>
              <div
                className="border-t border-zinc-800 px-4 py-4"
                id={`mobile-node-info-${section}`}
              >
                {renderSectionContent(section)}
              </div>
            </details>
          );
        })}
      </div>
    </>
  );
}
