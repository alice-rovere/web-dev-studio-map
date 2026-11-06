import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import VisualNotebookLayout from "../components/notebook/VisualNotebookLayout";
import { useMapGraph } from "../hooks/useMapGraph";
import { PHASE_ICONS, PHASE_ICON_LABELS } from "../notebooks/phaseIcons";
import { loadNotebookConfig } from "../notebooks/registry";
import { validateNotebook } from "../notebooks/validateNotebook";
import { fetchNotebook, saveNotebook } from "../services/notebookService";

const fieldClass = "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100";
const buttonClass = "rounded border border-slate-700 px-2 py-1 text-xs text-cyan-200 hover:bg-slate-800 disabled:opacity-40";
const newId = () => crypto.randomUUID();
const emptyPhase = () => ({ id: newId(), label: "", hint: "", icon: "code" });
const emptyStep = (phase) => ({ id: newId(), phase, title: "", description: "", illustration: "generic", panels: [{ kind: "text", label: "", content: "" }] });
const emptyConfig = () => {
  const phase = emptyPhase();
  return { slug: "", title: "", subtitle: "", phases: [phase], steps: [emptyStep(phase.id)] };
};
const move = (items, index, direction) => {
  const copy = [...items];
  const target = index + direction;
  if (target < 0 || target >= items.length) return copy;
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
};
const numberList = (value) => value.trim() ? value.split(",").map((part) => part.trim() ? Number(part.trim()) : NaN) : [];

function Field({ label, children }) {
  return <label className="block space-y-1 text-xs text-slate-300"><span>{label}</span>{children}</label>;
}

function OrderButtons({ index, length, onMove, onRemove }) {
  return <div className="flex flex-wrap gap-2">
    <button className={buttonClass} disabled={index === 0} onClick={() => onMove(-1)} type="button">↑ Sposta</button>
    <button className={buttonClass} disabled={index === length - 1} onClick={() => onMove(1)} type="button">↓ Sposta</button>
    <button className={buttonClass} onClick={onRemove} type="button">Elimina</button>
  </div>;
}

function HighlightInput({ label, numbers, onChange }) {
  const [text, setText] = useState(() => numbers.join(", "));
  const lastChange = useRef(JSON.stringify(numbers));
  const serialized = JSON.stringify(numbers);
  useEffect(() => {
    if (serialized !== lastChange.current) {
      lastChange.current = serialized;
      // The panel may have been reordered or loaded from the server.
      setText(numbers.join(", "));
    }
  }, [numbers, serialized]);
  return <Field label={label}><input className={fieldClass} value={text} onChange={(event) => {
    const value = event.target.value;
    const parsed = numberList(value);
    setText(value);
    lastChange.current = JSON.stringify(parsed);
    onChange(parsed);
  }} /></Field>;
}

function PanelEditor({ panel, onChange }) {
  const update = (patch) => onChange({ ...panel, ...patch });
  return <div className="space-y-3 rounded-lg border border-slate-700 p-3">
    <Field label="Tipo di pannello">
      <select className={fieldClass} value={panel.kind} onChange={(event) => {
        const kind = event.target.value;
        if (kind !== panel.kind && window.confirm("Cambiare tipo elimina il contenuto del pannello. Continuare?")) {
          onChange(kind === "table" ? { kind, label: panel.label, columns: [""], rows: [] } : { kind, label: panel.label, content: "", ...(kind === "code" ? { language: "" } : {}) });
        }
      }}><option value="text">Testo</option><option value="code">Codice</option><option value="table">Tabella</option></select>
    </Field>
    <Field label="Titolo del pannello"><input className={fieldClass} value={panel.label} onChange={(event) => update({ label: event.target.value })} /></Field>
    {panel.kind !== "table" && <>
      {panel.kind === "code" && <Field label="Linguaggio"><input className={fieldClass} value={panel.language ?? ""} onChange={(event) => update({ language: event.target.value })} /></Field>}
      <Field label="Contenuto"><textarea className={fieldClass} rows={5} value={panel.content} onChange={(event) => update({ content: event.target.value })} /></Field>
      {panel.kind === "code" && <HighlightInput label="Righe evidenziate (numeri separati da virgola, a partire da 1)" numbers={panel.highlightLines ?? []} onChange={(highlightLines) => update({ highlightLines })} />}
    </>}
    {panel.kind === "table" && <>
      <p className="text-xs text-slate-400">Colonne</p>
      {panel.columns.map((column, index) => <div className="flex gap-2" key={index}>
        <input aria-label={`Colonna ${index + 1}`} className={fieldClass} value={column} onChange={(event) => update({ columns: panel.columns.map((item, i) => i === index ? event.target.value : item) })} />
        <button className={buttonClass} onClick={() => { if (window.confirm("Eliminare la colonna e le relative celle?")) update({ columns: panel.columns.filter((_, i) => i !== index), rows: panel.rows.map((row) => row.filter((_, i) => i !== index)) }); }} type="button">Elimina</button>
      </div>)}
      <button className={buttonClass} onClick={() => update({ columns: [...panel.columns, ""], rows: panel.rows.map((row) => [...row, ""]) })} type="button">Aggiungi colonna</button>
      {panel.rows.map((row, rowIndex) => <div className="space-y-2 border-t border-slate-700 pt-2" key={rowIndex}>
        <p className="text-xs text-slate-400">Riga {rowIndex + 1}</p>
        {row.map((cell, cellIndex) => <Field key={cellIndex} label={panel.columns[cellIndex] || `Colonna ${cellIndex + 1}`}><input className={fieldClass} value={cell} onChange={(event) => update({ rows: panel.rows.map((r, i) => i === rowIndex ? r.map((c, j) => j === cellIndex ? event.target.value : c) : r) })} /></Field>)}
        <button className={buttonClass} onClick={() => { if (window.confirm("Eliminare la riga?")) update({ rows: panel.rows.filter((_, i) => i !== rowIndex), highlightRows: (panel.highlightRows ?? []).filter((i) => i !== rowIndex).map((i) => i > rowIndex ? i - 1 : i) }); }} type="button">Elimina riga</button>
      </div>)}
      <button className={buttonClass} onClick={() => update({ rows: [...panel.rows, panel.columns.map(() => "")] })} type="button">Aggiungi riga</button>
      <HighlightInput label="Righe evidenziate (numeri separati da virgola, a partire da 0)" numbers={panel.highlightRows ?? []} onChange={(highlightRows) => update({ highlightRows })} />
    </>}
  </div>;
}

export default function NotebookEditor() {
  const { slug: editSlug } = useParams();
  const navigate = useNavigate();
  const { data: graph, loading: graphLoading, error: graphError, reload } = useMapGraph();
  const [config, setConfig] = useState(emptyConfig);
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [nodeId, setNodeId] = useState("");
  const [pendingNodeSlug, setPendingNodeSlug] = useState("");
  const [autoLink, setAutoLink] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [initial, setInitial] = useState(null);
  const [originalScenes, setOriginalScenes] = useState({});
  const [loading, setLoading] = useState(Boolean(editSlug));
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const [search, setSearch] = useState("");
  const [attempt, setAttempt] = useState(0);
  const snapshot = JSON.stringify({ slug, description, nodeId, pendingNodeSlug, autoLink, config });
  const [newInitial] = useState(snapshot);
  const dirty = snapshot !== (initial ?? newInitial);
  const blocker = useBlocker(dirty && !busy);
  const icons = useMemo(() => Object.keys(PHASE_ICONS).filter((name) =>
    `${name} ${PHASE_ICON_LABELS[name]}`.toLowerCase().includes(search.toLowerCase().trim())), [search]);

  useEffect(() => {
    if (!editSlug) return undefined;
    let active = true;
    Promise.all([fetchNotebook(editSlug), loadNotebookConfig(editSlug)]).then(([item, original]) => {
      if (!active) return;
      if (!item) { setError("Percorso non trovato."); setLoading(false); return; }
      const next = { slug: item.slug, description: item.description, nodeId: item.node_id ?? "", pendingNodeSlug: item.pending_node_slug ?? "", autoLink: Boolean(item.pending_node_slug), config: item.config };
      setSlug(next.slug); setDescription(next.description); setNodeId(next.nodeId); setConfig(next.config);
      setPendingNodeSlug(next.pendingNodeSlug); setAutoLink(next.autoLink);
      setOriginalScenes(Object.fromEntries([...(original?.steps ?? []), ...item.config.steps]
        .filter((step) => step.illustration && step.illustration !== "generic")
        .map((step) => [step.id, step.illustration])));
      setUpdatedAt(item.updated_at); setInitial(JSON.stringify(next)); setError(null); setLoading(false);
    }).catch((failure) => { if (active) { setError(failure.message); setLoading(false); } });
    return () => { active = false; };
  }, [editSlug, attempt]);

  useEffect(() => {
    if (!dirty) return undefined;
    const beforeUnload = (event) => { event.preventDefault(); event.returnValue = ""; };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (window.confirm("Ci sono modifiche non salvate. Uscire?")) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  const updateConfig = (patch) => setConfig((previous) => ({ ...previous, ...patch }));
  const updatePhase = (index, patch) => updateConfig({ phases: config.phases.map((phase, i) => i === index ? { ...phase, ...patch } : phase) });
  const updateStep = (index, patch) => updateConfig({ steps: config.steps.map((step, i) => i === index ? { ...step, ...patch } : step) });
  const validate = () => validateNotebook({ slug, description, config });
  async function save(event) {
    event.preventDefault();
    const problem = validate();
    if (problem) { setError(problem); return; }
    setBusy(true); setError(null);
    try {
      const item = await saveNotebook({ slug, description, nodeId, pendingNodeSlug: autoLink ? pendingNodeSlug : null, config: { ...config, slug }, updatedAt });
      setUpdatedAt(item.updated_at);
      const next = { slug: item.slug, description: item.description, nodeId: item.node_id ?? "", pendingNodeSlug: item.pending_node_slug ?? "", autoLink: Boolean(item.pending_node_slug), config: item.config };
      setPendingNodeSlug(next.pendingNodeSlug); setAutoLink(next.autoLink); setConfig(item.config); setInitial(JSON.stringify(next));
      if (!editSlug) navigate(`/admin/percorsi/${item.slug}/modifica`, { replace: true });
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }
  const close = () => navigate("/percorso-guidato");

  if (loading || graphLoading) return <p className="p-6 text-sm text-slate-400">Caricamento…</p>;
  if ((editSlug && !updatedAt) || graphError) return <div className="space-y-3 p-6 text-sm"><p role="alert" className="text-rose-300">{error || graphError}</p><button className={buttonClass} onClick={() => { setAttempt((value) => value + 1); reload(); }} type="button">Riprova</button> <Link className="text-cyan-300 underline" to="/percorso-guidato">Torna ai percorsi</Link></div>;
  if (preview) return <VisualNotebookLayout config={{ ...config, slug }} onClose={() => setPreview(false)} />;

  return <main className="h-full overflow-y-auto p-4 sm:p-6">
    <form className="mx-auto max-w-4xl space-y-6" onSubmit={save}>
      <header><h1 className="text-xl font-bold">{editSlug ? "Modifica percorso" : "Nuovo percorso"}</h1><p className="mt-1 text-sm text-slate-400">Il percorso è pubblico appena salvato. Lo slug non può essere modificato dopo la creazione.</p></header>
      {error && <p className="rounded border border-rose-500 p-3 text-sm text-rose-300" role="alert">{error}</p>}
      {!dirty && updatedAt && <p className="text-sm text-emerald-300" role="status">Percorso salvato e pubblico.</p>}
      <section className="space-y-3 rounded-xl border border-slate-800 p-4">
        <h2 className="font-semibold">Informazioni generali</h2>
        <Field label="Slug"><input className={fieldClass} disabled={Boolean(editSlug)} value={slug} onChange={(event) => setSlug(event.target.value)} /></Field>
        <Field label="Titolo"><input className={fieldClass} value={config.title} onChange={(event) => updateConfig({ title: event.target.value })} /></Field>
        <Field label="Sottotitolo"><input className={fieldClass} value={config.subtitle ?? ""} onChange={(event) => updateConfig({ subtitle: event.target.value })} /></Field>
        <Field label="Descrizione per il catalogo"><textarea className={fieldClass} value={description} onChange={(event) => setDescription(event.target.value)} /></Field>
        <Field label="Nodo associato (facoltativo)"><select className={fieldClass} value={nodeId} onChange={(event) => setNodeId(event.target.value)}><option value="">Nessun nodo</option>{graph.nodes.map((node) => <option key={node.id} value={node.id}>{node.label}</option>)}</select></Field>
        {pendingNodeSlug && !nodeId && <label className="flex items-start gap-2 text-xs text-slate-300"><input checked={autoLink} onChange={(event) => setAutoLink(event.target.checked)} type="checkbox" /> Collega automaticamente al nodo «{pendingNodeSlug}» se viene creato.</label>}
      </section>
      <section className="space-y-3 rounded-xl border border-slate-800 p-4">
        <h2 className="font-semibold">Fasi e icone</h2>
        <Field label="Cerca icona per nome"><input className={fieldClass} value={search} onChange={(event) => setSearch(event.target.value)} /></Field>
        {config.phases.map((phase, index) => {
          const Icon = PHASE_ICONS[phase.icon];
          return <div className="space-y-3 rounded-lg border border-slate-700 p-3" key={phase.id}>
            <h3 className="text-sm font-semibold">Fase {index + 1}</h3>
            <Field label="Titolo"><input className={fieldClass} value={phase.label} onChange={(event) => updatePhase(index, { label: event.target.value })} /></Field>
            <Field label="Descrizione breve"><input className={fieldClass} value={phase.hint ?? ""} onChange={(event) => updatePhase(index, { hint: event.target.value })} /></Field>
            <Field label="Icona"><select className={fieldClass} value={phase.icon} onChange={(event) => updatePhase(index, { icon: event.target.value })}>{!icons.includes(phase.icon) && <option value={phase.icon}>{PHASE_ICON_LABELS[phase.icon]}</option>}{icons.map((name) => <option value={name} key={name}>{PHASE_ICON_LABELS[name]}</option>)}</select></Field>
            {Icon && <Icon aria-label={`Icona ${PHASE_ICON_LABELS[phase.icon]}`} size={24} />}
            <OrderButtons index={index} length={config.phases.length} onMove={(direction) => updateConfig({ phases: move(config.phases, index, direction) })} onRemove={() => {
              if (config.steps.some((step) => step.phase === phase.id)) { setError("Sposta o elimina prima i passaggi associati a questa fase."); return; }
              if (window.confirm("Eliminare questa fase?")) updateConfig({ phases: config.phases.filter((_, i) => i !== index) });
            }} />
          </div>;
        })}
        <button className={buttonClass} onClick={() => updateConfig({ phases: [...config.phases, emptyPhase()] })} type="button">Aggiungi fase</button>
      </section>
      <section className="space-y-3 rounded-xl border border-slate-800 p-4">
        <h2 className="font-semibold">Passaggi</h2>
        <p className="text-xs text-slate-400">Le scene originali sono legate ai passaggi esistenti: modifiche a testi, ordine o rimozioni possono renderle meno coerenti.</p>
        {config.steps.map((step, index) => <div className="space-y-3 rounded-lg border border-slate-700 p-3" key={step.id}>
          <h3 className="text-sm font-semibold">Passaggio {index + 1}</h3>
          <Field label="Titolo"><input className={fieldClass} value={step.title} onChange={(event) => updateStep(index, { title: event.target.value })} /></Field>
          <Field label="Descrizione"><textarea className={fieldClass} value={step.description} onChange={(event) => updateStep(index, { description: event.target.value })} /></Field>
          <Field label="Fase"><select className={fieldClass} value={step.phase} onChange={(event) => updateStep(index, { phase: event.target.value })}>{config.phases.map((phase) => <option key={phase.id} value={phase.id}>{phase.label || "Fase senza titolo"}</option>)}</select></Field>
          <Field label="Illustrazione"><select className={fieldClass} value={step.illustration ?? ""} onChange={(event) => updateStep(index, { illustration: event.target.value || undefined })}>
            <option value="">Nessuna</option><option value="generic">Schema generico</option>
            {originalScenes[step.id] && <option value={originalScenes[step.id]}>Scena originale ({originalScenes[step.id]})</option>}
          </select></Field>
          <OrderButtons index={index} length={config.steps.length} onMove={(direction) => updateConfig({ steps: move(config.steps, index, direction) })} onRemove={() => { if (window.confirm("Eliminare il passaggio e i suoi pannelli?")) updateConfig({ steps: config.steps.filter((_, i) => i !== index) }); }} />
          {step.panels.map((panel, panelIndex) => <div className="space-y-2" key={panelIndex}>
            <PanelEditor panel={panel} onChange={(next) => updateStep(index, { panels: step.panels.map((item, i) => i === panelIndex ? next : item) })} />
            <OrderButtons index={panelIndex} length={step.panels.length} onMove={(direction) => updateStep(index, { panels: move(step.panels, panelIndex, direction) })} onRemove={() => { if (window.confirm("Eliminare il pannello?")) updateStep(index, { panels: step.panels.filter((_, i) => i !== panelIndex) }); }} />
          </div>)}
          <button className={buttonClass} onClick={() => updateStep(index, { panels: [...step.panels, { kind: "text", label: "", content: "" }] })} type="button">Aggiungi pannello</button>
        </div>)}
        <button className={buttonClass} disabled={!config.phases.length} onClick={() => updateConfig({ steps: [...config.steps, emptyStep(config.phases[0].id)] })} type="button">Aggiungi passaggio</button>
      </section>
      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50" disabled={busy} type="submit">{busy ? "Salvataggio…" : "Salva e pubblica"}</button>
        <button className={buttonClass} onClick={() => { const problem = validate(); if (problem) setError(problem); else { setError(null); setPreview(true); } }} type="button">Anteprima</button>
        <button className={buttonClass} onClick={close} type="button">Annulla</button>
      </div>
    </form>
  </main>;
}
