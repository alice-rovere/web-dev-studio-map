import { useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { StickyNotesCanvas } from "../components/StickyNotesCanvas";
import {
  agentFileExample,
  agentFileSections,
  aiSecurityPractices,
  aiTools,
  openSpecCommands,
  openSpecFlow,
  openSpecTree,
  promptBestPractices,
  promptTemplates,
  resources,
  tokenConcepts,
} from "../data/aiWebDev";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-[11px] font-medium text-slate-300 transition-colors hover:border-indigo-500/50 hover:text-indigo-300"
      onClick={handleCopy}
      title={copied ? "Copiato" : "Copia negli appunti"}
      type="button"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span>{copied ? "Copiato" : "Copia"}</span>
    </button>
  );
}

function Card({ children, className = "" }) {
  return (
    <section
      className={`bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionTitle({ id, children }) {
  return (
    <h3
      id={id}
      className="text-xl font-bold text-white border-b border-slate-800 pb-2"
    >
      {children}
    </h3>
  );
}

function PracticeList({ items }) {
  return (
    <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
      {items.map((item) => (
        <li key={item} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function AiWebDev() {
  return (
    <section
      aria-labelledby="ai-web-dev-title"
      className="relative h-full w-full bg-slate-950 text-slate-100 p-6 md:p-12 font-sans overflow-y-auto"
    >
      <StickyNotesCanvas boardId="page-ai-web-dev" />

      <div className="max-w-4xl mx-auto space-y-12 pb-5">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
            <Sparkles size={14} />
            <span>AI nel web development</span>
          </div>
          <h2
            id="ai-web-dev-title"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
          >
            Lavorare con l&apos;AI senza perdere il controllo
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
            Prompt efficaci, gestione dei token, agenti da terminale e
            specifiche versionate: pratiche concrete per usare l&apos;AI come
            strumento di sviluppo, con revisione e sicurezza al centro.
          </p>
        </header>

        <section aria-labelledby="ai-prompt-title" className="space-y-4">
          <Card>
            <SectionTitle id="ai-prompt-title">
              Best practice per i prompt
            </SectionTitle>
            <p className="text-slate-300 text-sm leading-relaxed">
              Un buon prompt non e una formula magica: e una richiesta chiara,
              verificabile e con il contesto giusto. Questi criteri valgono sia
              per una chat sia per un agente che modifica il repository.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {promptBestPractices.map(({ title, description, tip }) => (
                <article
                  key={title}
                  className="h-full rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2"
                >
                  <h4 className="text-sm font-semibold text-white">{title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {description}
                  </p>
                  <p className="text-xs text-indigo-300 leading-relaxed">
                    {tip}
                  </p>
                </article>
              ))}
            </div>
          </Card>
        </section>

        <section aria-labelledby="ai-templates-title" className="space-y-4">
          <Card>
            <SectionTitle id="ai-templates-title">
              Template pronti all&apos;uso
            </SectionTitle>
            <p className="text-slate-300 text-sm leading-relaxed">
              Sostituisci i segnaposto tra parentesi angolari. Adatta i vincoli
              al progetto e cancella le parti che non servono: un template pieno
              di rumore e peggio di un prompt breve.
            </p>
            <div className="grid grid-cols-1 gap-4 pt-2">
              {promptTemplates.map(({ id, title, description, prompt }) => (
                <article
                  key={id}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white">
                        {title}
                      </h4>
                      <p className="text-xs text-slate-400">{description}</p>
                    </div>
                    <CopyButton text={prompt} />
                  </div>
                  <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-[#0b1120] p-4 text-xs font-mono leading-relaxed text-slate-300 whitespace-pre-wrap">
                    {prompt}
                  </pre>
                </article>
              ))}
            </div>
          </Card>
        </section>

        <section aria-labelledby="ai-tokens-title" className="space-y-4">
          <Card>
            <SectionTitle id="ai-tokens-title">
              Token, contesto e costi
            </SectionTitle>
            <p className="text-slate-300 text-sm leading-relaxed">
              I modelli non leggono parole ma token. Capire come si riempie il
              contesto aiuta a spendere meno, ottenere risposte piu precise e
              riconoscere quando un task va spezzato.
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                    <th className="p-4">Concetto</th>
                    <th className="p-4">Significato</th>
                    <th className="p-4">In pratica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tokenConcepts.map(({ term, meaning, tip }) => (
                    <tr
                      key={term}
                      className="hover:bg-slate-900/30 transition-colors"
                    >
                      <td className="p-4 font-mono text-indigo-400 font-medium whitespace-nowrap align-top">
                        {term}
                      </td>
                      <td className="p-4 text-slate-300 align-top">{meaning}</td>
                      <td className="p-4 text-slate-400 align-top">{tip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        <section aria-labelledby="ai-tools-title" className="space-y-4">
          <SectionTitle id="ai-tools-title">OpenCode e OpenRouter</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiTools.map(({ name, role, description, points, href, label }) => (
              <Card key={name} className="h-full">
                <div className="flex items-center gap-2 text-indigo-400">
                  {name === "OpenCode" ? (
                    <Terminal size={18} />
                  ) : (
                    <GitBranch size={18} />
                  )}
                  <h4 className="text-lg font-bold text-white">{name}</h4>
                </div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-cyan-500">
                  {role}
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {description}
                </p>
                <PracticeList items={points} />
                <a
                  href={href}
                  rel="noreferrer"
                  target="_blank"
                  className="inline-flex items-center gap-1 text-sm font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
                >
                  {label} <ExternalLink size={13} />
                </a>
              </Card>
            ))}
          </div>
        </section>

        <section aria-labelledby="ai-agents-title" className="space-y-4">
          <Card>
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-indigo-400" />
              <SectionTitle id="ai-agents-title">
                File degli agenti: AGENTS.md
              </SectionTitle>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              AGENTS.md e il punto di ingresso delle istruzioni per un agente.
              Vive nel repository, viene versionato e vale per tutte le sessioni.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {agentFileSections.map(({ title, description }) => (
                <article
                  key={title}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-2"
                >
                  <h4 className="text-sm font-semibold text-white">{title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {description}
                  </p>
                </article>
              ))}
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-white">
                  Esempio di AGENTS.md
                </h4>
                <CopyButton text={agentFileExample} />
              </div>
              <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-[#0b1120] p-4 text-xs font-mono leading-relaxed text-slate-300 whitespace-pre-wrap">
                {agentFileExample}
              </pre>
            </div>
          </Card>
        </section>

        <section aria-labelledby="ai-openspec-title" className="space-y-4">
          <Card>
            <SectionTitle id="ai-openspec-title">
              OpenSpec: prima le specifiche, poi il codice
            </SectionTitle>
            <p className="text-slate-300 text-sm leading-relaxed">
              OpenSpec aggiunge un livello leggero di specifiche in Markdown
              dentro il repository. L&apos;accordo su cosa costruire avviene
              prima dell&apos;implementazione e resta consultabile anche quando
              la chat finisce.
            </p>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {openSpecFlow.map(({ step, description }) => (
                <li
                  key={step}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-1"
                >
                  <h4 className="text-sm font-semibold text-indigo-300">
                    {step}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-semibold text-white">
                  Struttura delle cartelle
                </h4>
                <CopyButton text={openSpecTree} />
              </div>
              <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-[#0b1120] p-4 text-xs font-mono leading-relaxed text-slate-300 whitespace-pre">
                {openSpecTree}
              </pre>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Comandi principali</h4>
              <ul className="divide-y divide-slate-800/60 rounded-lg border border-slate-800 bg-slate-950">
                {openSpecCommands.map(({ command, description }) => (
                  <li
                    key={command}
                    className="flex flex-wrap items-center justify-between gap-3 p-3"
                  >
                    <div className="space-y-1">
                      <code className="font-mono text-xs text-amber-400">
                        {command}
                      </code>
                      <p className="text-xs text-slate-400">{description}</p>
                    </div>
                    <CopyButton text={command} />
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </section>

        <section aria-labelledby="ai-security-title" className="space-y-4">
          <Card>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-indigo-400" />
              <SectionTitle id="ai-security-title">
                Sicurezza e responsabilita
              </SectionTitle>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Un agente con accesso al repository e al terminale amplifica sia i
              benefici sia i rischi. Tratta prompt, codice generato e
              dipendenze come input non fidati da verificare.
            </p>
            <PracticeList items={aiSecurityPractices} />
          </Card>
        </section>

        <section aria-labelledby="ai-resources-title" className="space-y-4">
          <Card>
            <SectionTitle id="ai-resources-title">Link utili</SectionTitle>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {resources.map(({ label, description, href, category }) => (
                <li key={href} className="group h-full">
                  <a
                    href={href}
                    rel="noreferrer"
                    target="_blank"
                    className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-indigo-500/50 hover:bg-slate-900/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span className="flex items-center justify-between text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors gap-2">
                      {label}
                      <ExternalLink
                        aria-hidden="true"
                        size={14}
                        className="shrink-0 text-slate-500 group-hover:text-indigo-400 transition-colors"
                      />
                    </span>
                    <span className="text-xs text-slate-400 mt-2 leading-relaxed grow">
                      {description}
                    </span>
                    <span className="mt-3 text-[10px] font-mono uppercase tracking-wider text-cyan-500">
                      {category}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </section>
  );
}
