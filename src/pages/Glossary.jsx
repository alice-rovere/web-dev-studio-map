import { BookOpen } from "lucide-react";
import GlossaryManager from "../components/admin/GlossaryManager";

export default function Glossary() {
  return (
    <main className="absolute inset-0 overflow-y-auto bg-[#0b1120]">
      <div className="mx-auto max-w-4xl space-y-5 p-4 pb-16 sm:p-6">
        <header className="rounded-xl border border-slate-800 bg-slate-950/40 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="shrink-0 text-cyan-400" size={22} />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500">
                Riferimento
              </p>
              <h1 className="text-xl font-bold text-white">Glossario</h1>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Consulta i termini tecnici usati nella mappa e nei contenuti.
          </p>
        </header>

        <GlossaryManager />
      </div>
    </main>
  );
}
