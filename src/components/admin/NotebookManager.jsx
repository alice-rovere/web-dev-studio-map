import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteNotebook, fetchNotebooks } from "../../services/notebookService";
import { deleteVisualGrid, fetchVisualGrids } from "../../services/visualGridService";

export default function NotebookManager() {
  const [state, setState] = useState({ items: [], loading: true, error: null });
  const [attempt, setAttempt] = useState(0);
  const [grids, setGrids] = useState({ items: [], loading: true, error: null });
  const [busy, setBusy] = useState(null);
  useEffect(() => {
    let active = true;
    fetchNotebooks().then((items) => {
      if (active) setState({ items, loading: false, error: null });
    }).catch((error) => {
      if (active) setState({ items: [], loading: false, error: error.message });
    });
    fetchVisualGrids().then((items) => {
      if (active) setGrids({ items, loading: false, error: null });
    }).catch((error) => {
      if (active) setGrids({ items: [], loading: false, error: error.message });
    });
    return () => { active = false; };
  }, [attempt]);
  async function remove(item) {
    if (!window.confirm(`Eliminare definitivamente "${item.config.title}"?`)) return;
    setBusy(item.slug);
    try {
      await deleteNotebook(item.slug, item.updated_at);
      setState((previous) => ({ ...previous, items: previous.items.filter((entry) => entry.slug !== item.slug), error: null }));
    } catch (error) {
      setState((previous) => ({ ...previous, error: error.message }));
    } finally {
      setBusy(null);
    }
  }
  async function removeGrid(item) {
    if (!window.confirm(`Eliminare definitivamente la griglia "${item.config.title}"?`)) return;
    setBusy(item.slug);
    try {
      await deleteVisualGrid(item.slug, item.updated_at);
      setGrids((previous) => ({ ...previous, items: previous.items.filter((entry) => entry.slug !== item.slug), error: null }));
    } catch (error) {
      setGrids((previous) => ({ ...previous, error: error.message }));
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/40 p-5">
      <h2 className="font-semibold">Percorsi guidati</h2>
      <Link className="inline-block rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950" to="/admin/percorsi/nuovo">Nuovo percorso</Link>
      {state.loading && <p className="text-sm text-slate-400">Caricamento…</p>}
      {state.error && <p className="text-sm text-rose-300" role="alert">{state.error} <button className="underline" onClick={() => setAttempt((value) => value + 1)} type="button">Riprova</button></p>}
      {!state.loading && !state.error && !state.items.length && <p className="text-sm text-slate-400">Nessun percorso disponibile.</p>}
      {state.items.map((item) => (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3" key={item.slug}>
          <div><p className="font-semibold">{item.config.title}</p><p className="text-xs text-slate-400">{item.slug}</p></div>
          <div className="flex gap-3 text-sm">
            <Link className="text-cyan-300 underline" to={`/notebook/${item.slug}`}>Apri</Link>
            <Link className="text-cyan-300 underline" to={`/admin/percorsi/${item.slug}/modifica`}>Modifica</Link>
            <button className="text-rose-300 underline disabled:opacity-50" disabled={Boolean(busy)} onClick={() => remove(item)} type="button">Elimina</button>
          </div>
        </div>
      ))}
      <h2 className="border-t border-slate-800 pt-4 font-semibold">Griglie esplorabili</h2>
      <Link className="inline-block rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950" to="/admin/griglie/nuova">Nuova griglia</Link>
      {grids.loading && <p className="text-sm text-slate-400">Caricamento griglie…</p>}
      {grids.error && <p role="alert" className="text-sm text-rose-300">{grids.error} <button className="underline" onClick={() => setAttempt((value) => value + 1)} type="button">Riprova</button></p>}
      {!grids.loading && !grids.error && !grids.items.length && <p className="text-sm text-slate-400">Nessuna griglia disponibile.</p>}
      {grids.items.map((item) => <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3" key={item.slug}>
        <div><p className="font-semibold">{item.config.title}</p><p className="text-xs text-slate-400">{item.slug}</p></div>
        <div className="flex gap-3 text-sm"><Link className="text-cyan-300 underline" to={`/griglia/${item.slug}`}>Apri</Link><Link className="text-cyan-300 underline" to={`/admin/griglie/${item.slug}/modifica`}>Modifica</Link><button className="text-rose-300 underline disabled:opacity-50" disabled={Boolean(busy)} onClick={() => removeGrid(item)} type="button">Elimina</button></div>
      </div>)}
    </section>
  );
}
