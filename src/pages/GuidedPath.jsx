import { ArrowUpRight, MapPin, Presentation } from "lucide-react";
import { Link } from "react-router-dom";
import { getNotebookCatalog } from "../notebooks/registry";

export default function GuidedPathPage() {
  const notebooks = getNotebookCatalog();

  return (
    <main className="h-full w-full overflow-y-auto bg-[#0b1120] p-4 font-sans text-slate-100 sm:p-6 lg:p-10">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-8 border-b border-slate-800 pb-5 sm:mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Percorsi guidati
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Scegli un percorso per esplorare un concetto passo dopo passo. Ogni
            appunto è collegato al relativo nodo nella mappa delle competenze.
          </p>
        </header>

        <section aria-label="Elenco dei percorsi guidati">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-400">
            {notebooks.length} percorsi disponibili
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {notebooks.map((notebook) => (
              <Link
                className="group flex min-h-64 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg transition-colors hover:border-cyan-400/50 hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                key={notebook.slug}
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
                  {notebook.title}
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
                    {notebook.nodeLabel}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-200">
                    <span className="text-slate-400">Nodo padre:</span>{" "}
                    {notebook.parentLabel ?? "Nodo radice"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
