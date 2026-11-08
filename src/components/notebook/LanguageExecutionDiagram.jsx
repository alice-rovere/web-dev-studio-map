import { ArrowDown, Cpu, FileCode2 } from "lucide-react";
import { useEffect, useRef } from "react";

const paths = [
  {
    id: "native",
    letter: "A",
    title: "Compilazione nativa",
    examples: "C · C++ · Rust · Go",
    stages: [
      ["Compilatore", "Traduce prima dell'avvio"],
      ["Eseguibile nativo", "Codice macchina per una piattaforma"],
      ["Esecuzione", "La CPU esegue il programma"],
    ],
    style: "border-emerald-400/60 bg-emerald-950/30",
    badge: "bg-emerald-400 text-emerald-950",
  },
  {
    id: "bytecode",
    letter: "B",
    title: "Bytecode / IL",
    examples: "Java · C#",
    stages: [
      ["Compilatore", "Produce un formato intermedio"],
      ["Bytecode o IL", "Non è codice macchina della CPU"],
      ["Runtime · JVM / .NET", "Interpreta e/o compila con JIT"],
    ],
    style: "border-cyan-400/60 bg-cyan-950/30",
    badge: "bg-cyan-400 text-cyan-950",
  },
  {
    id: "runtime",
    letter: "C",
    title: "Interprete / JIT",
    examples: "Python · JavaScript",
    stages: [
      ["Runtime", "Riceve il programma sorgente"],
      ["Interprete e/o bytecode", "Le strategie variano per motore"],
      ["Eventuale JIT", "Può compilare codice durante l'esecuzione"],
    ],
    style: "border-fuchsia-400/60 bg-fuchsia-950/30",
    badge: "bg-fuchsia-400 text-fuchsia-950",
  },
];

const pathByStep = {
  "codice-sorgente": "source",
  "compilazione-nativa": "native",
  "bytecode-runtime": "bytecode",
  "runtime-interprete-jit": "runtime",
  "istruzioni-macchina": "machine",
  "confronto-strade": "all",
};

function Junction({ reverse = false }) {
  return (
    <svg aria-hidden="true" className="block h-8 w-full text-slate-400" preserveAspectRatio="none" viewBox="0 0 900 32">
      {reverse ? (
        <path d="M150 0 V12 H750 V0 M450 12 V26 M445 21 L450 27 L455 21" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      ) : (
        <path d="M450 0 V12 M150 12 H750 M150 12 V26 M450 12 V26 M750 12 V26 M145 21 L150 27 L155 21 M445 21 L450 27 L455 21 M745 21 L750 27 L755 21" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
}

export default function LanguageExecutionDiagram({ stepId }) {
  const activePath = pathByStep[stepId];
  const sourceActive = activePath === "source";
  const machineActive = activePath === "machine" || activePath === "all";
  const containerRef = useRef(null);
  const selectedRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const selected = selectedRef.current;
    if (!container || !selected) return;
    const containerBounds = container.getBoundingClientRect();
    const selectedBounds = selected.getBoundingClientRect();
    if (selectedBounds.left < containerBounds.left) {
      container.scrollLeft += selectedBounds.left - containerBounds.left;
    } else if (selectedBounds.right > containerBounds.right) {
      container.scrollLeft += selectedBounds.right - containerBounds.right;
    }
  }, [activePath]);

  return (
    <figure className="rounded-xl border border-cyan-500/20 bg-slate-950/70 p-3 sm:p-4">
      <figcaption className="mb-2 text-sm font-semibold text-slate-200">
        Dal codice sorgente alla CPU: tre strade possibili
      </figcaption>
      <p className="mb-2 text-xs text-slate-400">
        Schema semplificato: le strategie possono combinarsi. Se necessario, scorri orizzontalmente per vedere tutte le strade.
      </p>
      <div aria-label="Schema delle tre strade, scorribile orizzontalmente" className="overflow-x-auto rounded-lg focus-visible:outline-2 focus-visible:outline-cyan-300" ref={containerRef} role="region" tabIndex={0}>
        <div className="min-w-135">
          <div className={`mx-auto flex w-fit items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold ${sourceActive ? "border-cyan-300 bg-cyan-400/15 text-cyan-100" : "border-slate-600 bg-slate-900 text-slate-100"}`}>
            <FileCode2 aria-hidden="true" size={18} />
            Codice sorgente scritto da te
            {sourceActive && <span className="text-xs text-cyan-300">· passaggio attuale</span>}
          </div>
          <Junction />
          <div className="grid grid-cols-3 gap-3">
            {paths.map((path) => {
              const active = activePath === path.id || activePath === "all";
              return (
                <section className={`rounded-xl border p-2 sm:p-3 ${path.style} ${active ? "ring-2 ring-white/80" : ""}`} key={path.id} ref={activePath === path.id ? selectedRef : undefined}>
                  <div className="flex min-h-16 items-start gap-2">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${path.badge}`}>{path.letter}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white">Strada {path.letter} · {path.title}</h3>
                      <p className="mt-0.5 text-xs text-slate-300">{path.examples}</p>
                      {active && <p className="mt-0.5 text-xs font-semibold text-white">In evidenza</p>}
                    </div>
                  </div>
                  <ol className="mt-2">
                    {path.stages.map(([title, detail], index) => (
                      <li key={title}>
                        {index > 0 && <div aria-hidden="true" className="flex justify-center py-1 text-slate-300"><ArrowDown size={16} /></div>}
                        <div className="flex min-h-16 flex-col justify-center rounded-lg border border-slate-600 bg-slate-950/80 px-2 py-2 text-center">
                          <span className="text-xs font-semibold text-white">{title}</span>
                          <span className="mt-1 text-xs leading-snug text-slate-300">{detail}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
          <Junction reverse />
          <div className={`mx-auto flex w-fit items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold ${machineActive ? "border-cyan-300 bg-cyan-400/15 text-cyan-100" : "border-slate-600 bg-slate-900 text-slate-100"}`}>
            <Cpu aria-hidden="true" size={18} />
            CPU · esegue istruzioni macchina
            {machineActive && <span className="text-xs text-cyan-300">· passaggio attuale</span>}
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">
            La CPU esegue codice nativo: il programma, il runtime o il codice prodotto dal JIT.
          </p>
        </div>
      </div>
    </figure>
  );
}
