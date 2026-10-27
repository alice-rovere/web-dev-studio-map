import { ExternalLink } from "lucide-react";
import PageTabs from "../components/PageTabs";

const learningResources = [
  {
    label: "OWASP Top 10",
    description: "Panoramica dei principali rischi per le applicazioni web.",
    href: "https://owasp.org",
  },
  {
    label: "PortSwigger Web Security Academy",
    description: "Percorsi e laboratori interattivi in un ambiente didattico.",
    href: "https://portswigger.net",
  },
];

const TABS = [
  {
    id: "injection",
    label: "Script injection",
    content: (
      <section
        aria-labelledby="security-injection-title"
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
      >
        <h3
          id="security-injection-title"
          className="text-xl font-bold text-white border-b border-slate-800 pb-2"
        >
          Che cos’è la script injection?
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          È una famiglia di vulnerabilità in cui contenuti controllati da un
          utente vengono interpretati dal browser come codice invece che come
          testo. Una forma nota è XSS (Cross-Site Scripting): può coinvolgere
          dati salvati, inviati in una richiesta o gestiti dal codice della
          pagina.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300 text-sm">
          <li className="leading-relaxed">
            Usa l’escaping automatico del framework per mostrare testo.
          </li>
          <li className="leading-relaxed">
            Evita di inserire HTML non fidato; se serve HTML formattato,
            sanificalo con una libreria mantenuta.
          </li>
          <li className="leading-relaxed">
            Valida i dati per il loro contesto e usa una Content Security Policy
            come difesa aggiuntiva, non come unica protezione.
          </li>
        </ul>
      </section>
    ),
  },
  {
    id: "load",
    label: "DoS e test di carico",
    content: (
      <section
        aria-labelledby="security-load-title"
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
      >
        <h3
          id="security-load-title"
          className="text-xl font-bold text-white border-b border-slate-800 pb-2"
        >
          Cosa significa “bombardare” un server?
        </h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          In genere ci si riferisce a un attacco denial of service (DoS), o
          DDoS quando il traffico proviene da più sistemi: il servizio può
          diventare lento o irraggiungibile. Generare traffico contro sistemi
          senza permesso può danneggiare servizi e utenti ed è illegale.
        </p>
        <p className="text-slate-300 text-sm leading-relaxed">
          Per imparare a misurare le prestazioni, usa test di carico solo su
          applicazioni locali o infrastrutture per cui hai un’autorizzazione
          esplicita. Concorda prima obiettivo e limiti, aumenta il carico in
          modo controllato, monitora il sistema e interrompi il test se
          emergono anomalie.
        </p>
      </section>
    ),
  },
  {
    id: "practice",
    label: "Percorso sicuro",
    content: (
      <section
        aria-labelledby="security-practice-title"
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4"
      >
        <h3
          id="security-practice-title"
          className="text-xl font-bold text-white border-b border-slate-800 pb-2"
        >
          Un percorso sicuro per iniziare
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-sm">
          <li className="leading-relaxed">
            Impara le basi di HTTP, browser, JavaScript e reti.
          </li>
          <li className="leading-relaxed">
            Studia le vulnerabilità e le contromisure, partendo da OWASP.
          </li>
          <li className="leading-relaxed">
            Fai pratica in laboratori didattici progettati per essere
            vulnerabili, non su siti o reti pubbliche.
          </li>
          <li className="leading-relaxed">
            Testa solo sistemi tuoi o coperti da un’autorizzazione scritta che
            definisca chiaramente perimetro e metodi consentiti.
          </li>
        </ol>
      </section>
    ),
  },
  {
    id: "resources",
    label: "Risorse",
    content: (
      <section
        aria-labelledby="security-resources-title"
        className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 pb"
      >
        <h3
          id="security-resources-title"
          className="text-xl font-bold text-white border-b border-slate-800 pb-2"
        >
          Risorse per approfondire
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {learningResources.map(({ label, description, href }) => (
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
              </a>
            </li>
          ))}
        </ul>
      </section>
    ),
  },
];

export default function Security() {
  return (
    <section
      aria-labelledby="security-learning-title"
      className="h-full w-full bg-slate-950 text-slate-100 p-6 md:p-12 font-sans overflow-y-auto"
    >
      <div className="max-w-4xl mx-auto space-y-12 pb-5">
        <header className="space-y-3">
          <h2
            id="security-learning-title"
            className="text-3xl md:text-4xl font-extrabold tracking-tight text-white"
          >
            Sicurezza informatica e hacking etico
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-3xl">
            La sicurezza informatica studia come proteggere applicazioni, dati e
            infrastrutture. L’hacking etico applica le stesse conoscenze per
            individuare e correggere problemi, ma solo con un’autorizzazione
            esplicita e entro un perimetro concordato.
          </p>
        </header>

        <PageTabs
          accent="indigo"
          ariaLabel="Sezioni sulla sicurezza"
          tabs={TABS}
        />
      </div>
    </section>
  );
}
