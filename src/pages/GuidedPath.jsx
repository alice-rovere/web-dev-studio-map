import { ArrowUpRight, MapPin, Presentation, Plus, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useMapGraph } from "../hooks/useMapGraph";
import { fetchNotebooks } from "../services/notebookService";

export default function GuidedPathPage() {
  const { isEditor } = useAuth();
  const { graph, loading: graphLoading, error: graphError, reload } = useMapGraph();
  const [state, setState] = useState({ notebooks: [], loading: true, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    fetchNotebooks().then((notebooks) => {
      if (active) setState({ notebooks, loading: false, error: null });
    }).catch((error) => {
      if (active) setState({ notebooks: [], loading: false, error: error.message });
    });
    return () => { active = false; };
  }, [attempt]);
  const notebooks = state.notebooks;

  return (
    <main className="h-full w-full overflow-y-auto bg-[#0b1120] p-4 font-sans text-slate-100 sm:p-6 lg:p-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 border-b border-slate-800 pb-5 sm:mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Percorsi guidati
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Scegli un percorso per esplorare un concetto passo dopo passo. Ogni
            appunto può essere collegato a un nodo nella mappa delle competenze.
          </p>
          {isEditor && (
            <Link className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-sm font-semibold text-slate-950" to="/admin/percorsi/nuovo">
              <Plus size={16} /> Nuovo percorso
            </Link>
          )}
        </header>

        <section aria-label="Elenco dei percorsi guidati">
          {(state.loading || graphLoading) && <p className="mb-4 text-sm text-slate-400">Caricamento percorsi…</p>}
          {(state.error || graphError) && (
            <div className="mb-4 text-sm text-rose-300" role="alert">
              {state.error || graphError}{" "}
              <button className="underline" onClick={() => { setAttempt((value) => value + 1); reload(); }} type="button">Riprova</button>
            </div>
          )}
          {!state.loading && !state.error && (
            <>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-400">
            {notebooks.length} percorsi disponibili
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {notebooks.map((notebook) => {
              const node = graph.nodesById.get(notebook.node_id);
              const parents = (graph.parentsByChild.get(notebook.node_id) ?? [])
                .map((item) => graph.nodesById.get(item.parent_id)?.label)
                .filter(Boolean);
              return (
              <div className="relative" key={notebook.slug}>
              <Link
                className="group flex min-h-64 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg transition-colors hover:border-cyan-400/50 hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                to={`/notebook/${notebook.slug}`}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                    <Presentation size={18} />
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="text-slate-500 transition-colors group-hover:text-cyan-300"
                    size={18}
                  />
                </div>
                <h2 className="text-lg font-bold text-white group-hover:text-cyan-100">
                  {notebook.config.title}
                </h2>
                <p className="mt-2 grow text-sm leading-relaxed text-slate-300">
                  {notebook.description}
                </p>
                <div className="mt-5 border-t border-slate-800 pt-4">
                  <p className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                    <MapPin size={12} />
                    Posizione nella mappa
                  </p>
                  <p className="text-xs leading-relaxed text-slate-200">
                    <span className="text-slate-400">Nodo:</span>{" "}
                    {graphError ? "Non disponibile" : graphLoading ? "Caricamento…" : node?.label ?? "Nessun nodo associato"}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-200">
                    <span className="text-slate-400">Nodo padre:</span>{" "}
                    {graphError ? "Non disponibile" : graphLoading ? "Caricamento…" : node ? parents.join(", ") || "Nodo radice" : "—"}
                  </p>
                </div>
              </Link>
              {isEditor && <Link className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-300 underline" to={`/admin/percorsi/${notebook.slug}/modifica`}><Pencil size={13} /> Modifica</Link>}
              </div>
            );})}
          </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
