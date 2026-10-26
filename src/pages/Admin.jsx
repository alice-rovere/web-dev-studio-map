import { useMemo, useState } from "react";
import {
  BookOpen,
  Boxes,
  FileText,
  Gauge,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
} from "lucide-react";
import NodeTree from "../components/admin/NodeTree";
import NodeForm from "../components/admin/NodeForm";
import GlossaryManager from "../components/admin/GlossaryManager";
import ContentSectionEditor from "../components/ContentSectionEditor";
import { useMapGraph } from "../hooks/useMapGraph";
import { useAuth } from "../hooks/useAuth";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from "../data/baseNodes";

const TABS = [
  { id: "nodes", label: "Nodi", icon: Boxes },
  { id: "content", label: "Contenuti", icon: FileText },
  { id: "glossary", label: "Glossario", icon: BookOpen },
];

export default function Admin() {
  const { profile } = useAuth();
  const { data, loading, error, reload } = useMapGraph();

  const [tab, setTab] = useState("nodes");
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [mode, setMode] = useState(null);
  const [defaultParentId, setDefaultParentId] = useState(null);
  const [contentNodeId, setContentNodeId] = useState("");

  const nodes = data.nodes;
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const selectedCategories = useMemo(
    () =>
      data.categories
        .filter((entry) => entry.node_id === selectedNodeId)
        .sort((a, b) => Number(b.is_primary) - Number(a.is_primary)),
    [data.categories, selectedNodeId],
  );

  const selectedParents = useMemo(
    () =>
      data.parents
        .filter((entry) => entry.child_id === selectedNodeId)
        .map((entry) => ({
          ...entry,
          label:
            nodes.find((node) => node.id === entry.parent_id)?.label ??
            entry.parent_id,
        })),
    [data.parents, nodes, selectedNodeId],
  );

  const selectedChildren = useMemo(
    () =>
      data.parents
        .filter((entry) => entry.parent_id === selectedNodeId)
        .map((entry) => ({
          ...entry,
          label:
            nodes.find((node) => node.id === entry.child_id)?.label ??
            entry.child_id,
        })),
    [data.parents, nodes, selectedNodeId],
  );

  function selectNode(nodeId) {
    setSelectedNodeId(nodeId);
    setMode(null);
    setDefaultParentId(null);
  }

  function startCreate(parentId = null) {
    setMode("create");
    setDefaultParentId(parentId);
    if (!parentId) setSelectedNodeId(null);
  }

  function startEdit() {
    if (selectedNodeId) setMode("edit");
  }

  async function handleSaved(nodeId) {
    await reload({ clearPositions: true });
    setSelectedNodeId(nodeId);
    setDefaultParentId(null);
    setMode(nodeId ? "edit" : null);
  }

  const nodeFormKey = `${mode ?? "view"}-${selectedNodeId ?? "new"}-${
    defaultParentId ?? "root"
  }`;

  return (
    <div className="absolute inset-0 overflow-y-auto bg-[#0b1120]">
      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500">
              &gt;_ admin console
            </p>
            <h1 className="text-xl font-bold text-white">Pannello editor</h1>
            <p className="mt-1 text-xs text-slate-500">
              {profile?.email ?? "utente autenticato"} · ruolo{" "}
              {profile?.role ?? "sconosciuto"}
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-slate-300 hover:bg-slate-900"
            onClick={() => reload({ clearPositions: true })}
            type="button"
          >
            <RefreshCw size={13} />
            Ricarica dati
          </button>
        </header>

        <nav className="mb-6 flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {TABS.map((entry) => {
            const Icon = entry.icon;
            return (
              <button
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  tab === entry.id
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
                key={entry.id}
                onClick={() => setTab(entry.id)}
                type="button"
              >
                <Icon size={14} />
                {entry.label}
              </button>
            );
          })}
        </nav>

        {loading && (
          <p className="mb-4 flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="animate-spin" size={14} />
            Caricamento dati…
          </p>
        )}

        {error && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-rose-500/30 bg-rose-950/10 px-3 py-2 text-xs text-rose-300">
            <span>{error}</span>
            <button
              className="font-semibold hover:underline"
              onClick={() => reload({ clearPositions: true })}
              type="button"
            >
              Riprova
            </button>
          </div>
        )}

        {tab === "nodes" && (
          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <aside className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <button
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-3 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/15"
                onClick={() => startCreate(null)}
                type="button"
              >
                <Plus size={13} /> Nuovo nodo radice
              </button>

              <NodeTree
                categories={data.categories}
                nodes={nodes}
                onSelect={selectNode}
                parents={data.parents}
                selectedId={selectedNodeId}
              />
            </aside>

            <section>
              {mode && (
                <NodeForm
                  categories={data.categories}
                  defaultParentId={defaultParentId}
                  key={nodeFormKey}
                  node={mode === "edit" ? selectedNode : null}
                  nodes={nodes}
                  onCancel={() => setMode(null)}
                  onSaved={handleSaved}
                  parents={data.parents}
                />
              )}

              {!mode && selectedNode && (
                <div className="space-y-5 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {selectedNode.label}
                      </h2>
                      <p className="font-mono text-xs text-slate-500">
                        /{selectedNode.slug}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-900"
                        onClick={startEdit}
                        type="button"
                      >
                        <Pencil size={13} /> Modifica
                      </button>
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-900"
                        onClick={() => startCreate(selectedNode.id)}
                        type="button"
                      >
                        <Plus size={13} /> Crea figlio
                      </button>
                      <button
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 px-3 py-2 text-xs text-slate-300 hover:bg-slate-900"
                        onClick={() => {
                          setContentNodeId(selectedNode.id);
                          setTab("content");
                        }}
                        type="button"
                      >
                        <FileText size={13} /> Contenuti
                      </button>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-400">
                    {selectedNode.description || "Nessuna descrizione."}
                  </p>

                  <div>
                    <h3 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                      Categorie
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.length > 0 ? (
                        selectedCategories.map((entry) => (
                          <span
                            className="rounded border px-2 py-0.5 text-[10px] font-mono uppercase"
                            key={entry.category}
                            style={{
                              color:
                                CATEGORY_COLORS[entry.category] ?? "#94a3b8",
                              borderColor: `${
                                CATEGORY_COLORS[entry.category] ?? "#94a3b8"
                              }55`,
                            }}
                          >
                            {CATEGORY_LABELS[entry.category] ?? entry.category}
                            {entry.is_primary ? " · primary" : ""}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-600">
                          Nessuna categoria.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        Padri ({selectedParents.length})
                      </h3>
                      <ul className="space-y-1 text-xs text-slate-400">
                        {selectedParents.length === 0 && (
                          <li className="italic text-slate-600">
                            Nodo radice
                          </li>
                        )}
                        {selectedParents.map((parent) => (
                          <li key={parent.parent_id}>
                            {parent.label}
                            {parent.is_primary ? " · primary" : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                        Figli ({selectedChildren.length})
                      </h3>
                      <ul className="space-y-1 text-xs text-slate-400">
                        {selectedChildren.length === 0 && (
                          <li className="italic text-slate-600">
                            Nessun figlio
                          </li>
                        )}
                        {selectedChildren.map((child) => (
                          <li key={child.child_id}>
                            {child.label}
                            {child.is_primary ? " · primary" : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {!mode && !selectedNode && (
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-950/20 text-center">
                  <Gauge className="mb-3 text-slate-600" size={28} />
                  <p className="text-sm text-slate-400">
                    Seleziona un nodo dall&apos;albero
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Oppure crea un nuovo nodo radice.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "content" && (
          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
            <label className="block max-w-md">
              <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-slate-500">
                Nodo
              </span>
              <select
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-slate-600"
                onChange={(event) => setContentNodeId(event.target.value)}
                value={contentNodeId}
              >
                <option value="">Seleziona un nodo…</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
            </label>

            {contentNodeId ? (
              <ContentSectionEditor
                canEdit
                key={contentNodeId}
                nodeId={contentNodeId}
              />
            ) : (
              <p className="py-8 text-center text-xs italic text-slate-600">
                Seleziona un nodo per gestire le sezioni strutturate.
              </p>
            )}
          </div>
        )}

        {tab === "glossary" && <GlossaryManager />}
      </div>
    </div>
  );
}
