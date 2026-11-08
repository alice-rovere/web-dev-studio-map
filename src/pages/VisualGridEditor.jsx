import { useEffect, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import { useMapGraph } from "../hooks/useMapGraph";
import { validateVisualGrid } from "../notebooks/visualGrid";
import { createVisualGrid, fetchVisualGrid, updateVisualGrid } from "../services/visualGridService";
import { WhiteboardEditor } from "../components/content/blocks/WhiteboardBlock";

const fieldClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100";

function Field({ label, children }) {
  return <label className="block space-y-1 text-xs text-slate-300"><span>{label}</span>{children}</label>;
}

function PanelFields({ panel, onChange, onRemove }) {
  const patch = (change) => onChange({ ...panel, ...change });
  return <div className="space-y-3 rounded-lg border border-slate-700 p-3">
    <Field label="Titolo del pannello"><input className={fieldClass} value={panel.label} onChange={(event) => patch({ label: event.target.value })} /></Field>
    <p className="text-xs text-slate-400">Tipo: {panel.kind === "code" ? "codice" : panel.kind === "table" ? "tabella" : "testo"}</p>
    {panel.kind === "code" && <Field label="Linguaggio"><input className={fieldClass} value={panel.language ?? ""} onChange={(event) => patch({ language: event.target.value })} /></Field>}
    {panel.kind !== "table" ? <Field label="Contenuto"><textarea className={fieldClass} rows={5} value={panel.content} onChange={(event) => patch({ content: event.target.value })} /></Field> : <>
      {panel.columns.map((column, i) => <Field label={`Colonna ${i + 1}`} key={i}><input className={fieldClass} value={column} onChange={(event) => patch({ columns: panel.columns.map((value, index) => index === i ? event.target.value : value) })} /></Field>)}
      {panel.rows.map((row, i) => <div key={i} className="space-y-2 border-t border-slate-800 pt-2">
        {row.map((cell, j) => <Field key={j} label={`Riga ${i + 1}: ${panel.columns[j]}`}><input className={fieldClass} value={cell} onChange={(event) => patch({ rows: panel.rows.map((current, rowIndex) => rowIndex === i ? current.map((value, columnIndex) => columnIndex === j ? event.target.value : value) : current) })} /></Field>)}
      </div>)}
    </>}
    <button className="text-xs text-rose-300 underline" onClick={onRemove} type="button">Elimina pannello</button>
  </div>;
}

export default function VisualGridEditor() {
  const { slug: editSlug } = useParams();
  const navigate = useNavigate();
  const { data: graph, loading: graphLoading, error: graphError, reload } = useMapGraph();
  const [grid, setGrid] = useState(() => editSlug ? null : {
    slug: "", description: "", node_id: null, pending_node_slug: null,
    renderer: "excalidraw", config: { title: "", subtitle: "", whiteboard: { elements: [], files: {}, annotations: [] } },
  });
  const [autoLink, setAutoLink] = useState(false);
  const [initial, setInitial] = useState(() => editSlug ? null : JSON.stringify({ grid: {
    slug: "", description: "", node_id: null, pending_node_slug: null,
    renderer: "excalidraw", config: { title: "", subtitle: "", whiteboard: { elements: [], files: {}, annotations: [] } },
  }, autoLink: false }));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(Boolean(editSlug));
  const [busy, setBusy] = useState(false);
  const [boardOpen, setBoardOpen] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const dirty = boardOpen || Boolean(grid && initial !== JSON.stringify({ grid, autoLink }));
  const blocker = useBlocker(dirty && !busy);
  useEffect(() => {
    if (!editSlug) return undefined;
    let active = true;
    fetchVisualGrid(editSlug).then((item) => {
      if (!active) return;
      if (!item) setError("Griglia non trovata.");
      else {
        const problem = validateVisualGrid(item);
        if (problem) setError(`Griglia non valida: ${problem}`);
        else {
          const nextAutoLink = Boolean(item.pending_node_slug);
          setGrid(item); setAutoLink(nextAutoLink); setInitial(JSON.stringify({ grid: item, autoLink: nextAutoLink })); setError(null);
        }
      }
      setLoading(false);
    }).catch((failure) => { if (active) { setError(failure.message); setLoading(false); } });
    return () => { active = false; };
  }, [editSlug, attempt]);
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (window.confirm("Ci sono modifiche non salvate. Uscire?")) blocker.proceed();
    else blocker.reset();
  }, [blocker]);
  const patchConfig = (patch) => setGrid((current) => ({ ...current, config: { ...current.config, ...patch } }));
  const patchComponent = (index, patch) => patchConfig({ components: grid.config.components.map((item, i) => i === index ? { ...item, ...patch } : item) });
  async function save(event) {
    event.preventDefault();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(grid.slug)) { setError("Lo slug deve contenere solo lettere minuscole, numeri e trattini."); return; }
    const problem = validateVisualGrid(grid);
    if (problem) { setError(problem); return; }
    setBusy(true); setError(null);
    try {
      const saved = editSlug
        ? await updateVisualGrid({ slug: editSlug, description: grid.description, nodeId: grid.node_id, pendingNodeSlug: autoLink ? grid.pending_node_slug : null, config: grid.config, updatedAt: grid.updated_at })
        : await createVisualGrid({ slug: grid.slug, description: grid.description, nodeId: grid.node_id, config: grid.config });
      const nextAutoLink = Boolean(saved.pending_node_slug);
      setGrid(saved); setAutoLink(nextAutoLink); setInitial(JSON.stringify({ grid: saved, autoLink: nextAutoLink }));
      if (!editSlug) navigate(`/admin/griglie/${saved.slug}/modifica`, { replace: true });
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }
  if (loading || graphLoading) return <p className="p-6 text-sm text-slate-400">Caricamento…</p>;
  if (!grid || graphError) return <div className="space-y-3 p-6 text-sm"><p role="alert" className="text-rose-300">{error || graphError}</p><button className="underline" onClick={() => { setAttempt((value) => value + 1); reload(); }} type="button">Riprova</button> <Link className="text-cyan-300 underline" to="/percorso-guidato">Torna agli appunti</Link></div>;
  const problem = validateVisualGrid(grid);
  if (problem && grid.renderer !== "excalidraw" && !Array.isArray(grid.config?.components)) return <div className="p-6 text-rose-300" role="alert">{problem} <Link className="underline" to="/percorso-guidato">Torna agli appunti</Link></div>;
  return <main className="h-full overflow-y-auto p-4 sm:p-6">
    <form className="mx-auto max-w-4xl space-y-5" onSubmit={save}>
      <header><h1 className="text-xl font-bold">{editSlug ? "Modifica griglia visiva" : "Nuova griglia visiva"}</h1><p className="mt-1 text-sm text-slate-400">I contenuti sono pubblici al salvataggio. {grid.renderer === "excalidraw" ? "Disegna e associa le spiegazioni nella lavagna." : "Lo schema SVG si modifica nel codice."}</p></header>
      {error && <p className="rounded border border-rose-500 p-3 text-sm text-rose-300" role="alert">{error}</p>}
      {!dirty && editSlug && <p className="text-sm text-emerald-300" role="status">Griglia salvata.</p>}
      <fieldset disabled={busy} className="space-y-5">
      <section className="space-y-3 rounded-xl border border-slate-800 p-4">
        <h2 className="font-semibold">Informazioni generali</h2>
        <Field label="Slug"><input className={fieldClass} disabled={Boolean(editSlug)} value={grid.slug} onChange={(event) => setGrid((current) => ({ ...current, slug: event.target.value }))} /></Field>
        <Field label="Titolo"><input className={fieldClass} value={grid.config.title} onChange={(event) => patchConfig({ title: event.target.value })} /></Field>
        <Field label="Sottotitolo"><input className={fieldClass} value={grid.config.subtitle ?? ""} onChange={(event) => patchConfig({ subtitle: event.target.value })} /></Field>
        <Field label="Descrizione per il catalogo"><textarea className={fieldClass} value={grid.description} onChange={(event) => setGrid((current) => ({ ...current, description: event.target.value }))} /></Field>
        <Field label="Nodo associato (facoltativo)"><select className={fieldClass} value={grid.node_id ?? ""} onChange={(event) => setGrid((current) => ({ ...current, node_id: event.target.value || null }))}><option value="">Nessun nodo</option>{graph.nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}</select></Field>
        {grid.pending_node_slug && !grid.node_id && <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={autoLink} onChange={(event) => setAutoLink(event.target.checked)} /> Collega automaticamente al nodo «{grid.pending_node_slug}» se viene creato.</label>}
      </section>
      {grid.renderer === "excalidraw" && <section className="rounded-xl border border-slate-800 p-4"><h2 className="font-semibold">Disegno interattivo</h2><WhiteboardEditor payload={grid.config.whiteboard} onOpenChange={setBoardOpen} update={(updater) => patchConfig({ whiteboard: updater(grid.config.whiteboard) })} /></section>}
      {grid.renderer !== "excalidraw" && grid.config.components.map((component, index) => <section key={component.id} className="space-y-3 rounded-xl border border-slate-800 p-4">
        <h2 className="font-semibold text-cyan-200">Componente: {component.id}</h2>
        <Field label="Titolo"><input className={fieldClass} value={component.title} onChange={(event) => patchComponent(index, { title: event.target.value })} /></Field>
        <Field label="Spiegazione"><textarea className={fieldClass} rows={4} value={component.description} onChange={(event) => patchComponent(index, { description: event.target.value })} /></Field>
        {component.panels.map((panel, panelIndex) => <PanelFields key={panelIndex} panel={panel} onChange={(next) => patchComponent(index, { panels: component.panels.map((item, i) => i === panelIndex ? next : item) })} onRemove={() => { if (window.confirm("Eliminare questo pannello?")) patchComponent(index, { panels: component.panels.filter((_, i) => i !== panelIndex) }); }} />)}
        <div className="flex gap-3"><button className="text-xs text-cyan-300 underline" type="button" onClick={() => patchComponent(index, { panels: [...component.panels, { kind: "text", label: "", content: "" }] })}>Aggiungi testo</button><button className="text-xs text-cyan-300 underline" type="button" onClick={() => patchComponent(index, { panels: [...component.panels, { kind: "code", label: "", language: "", content: "" }] })}>Aggiungi codice</button></div>
      </section>)}
      </fieldset>
      <div className="flex gap-4"><button className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50" disabled={busy || !dirty} type="submit">{busy ? "Salvataggio…" : "Salva"}</button><button className="text-sm text-slate-300 underline" onClick={() => navigate("/percorso-guidato")} type="button">Torna agli appunti</button></div>
    </form>
  </main>;
}
