import { useState } from "react";
import { ArrowLeft, Pencil, Save, X } from "lucide-react";

// MOCKUP UTILS: Funzioni temporanee per i cataloghi, sostituibili in futuro con Supabase
const getCategoryColor = (category) => {
  const colors = {
    frontend:
      "text-[#7ab8ff] border-[#7ab8ff] shadow-[#7ab8ff]/20 bg-[#7ab8ff]/5",
    backend:
      "text-[#64d9bd] border-[#64d9bd] shadow-[#64d9bd]/20 bg-[#64d9bd]/5",
    database:
      "text-[#c49aff] border-[#c49aff] shadow-[#c49aff]/20 bg-[#c49aff]/5",
  };
  return (
    colors[category?.toLowerCase()] ||
    "text-zinc-400 border-zinc-700 bg-zinc-800/20"
  );
};

const getCategoryLabel = (cat) => (cat ? cat.toUpperCase() : "TECNOLOGIA");

// Componente helper per il rendering dinamico dei blocchi di contenuto
function ContentBlock({ block }) {
  if (!block || typeof block !== "object") {
    return (
      <p className="text-red-400/80 italic text-sm border-l-2 border-red-500 pl-3 my-2">
        Sezione non disponibile.
      </p>
    );
  }

  if (block.type === "text" && typeof block.text === "string") {
    return (
      <p className="text-zinc-300 leading-relaxed text-base mb-4 font-light whitespace-pre-line">
        {block.text}
      </p>
    );
  }

  if (block.type === "list" && Array.isArray(block.items)) {
    return (
      <ul className="list-none space-y-2 mb-4">
        {block.items.map((item, index) => (
          <li
            key={`${index}-${item}`}
            className="flex items-start text-zinc-300 text-sm"
          >
            <span className="text-[#64d9bd] mr-2 select-none">⚡</span>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (
    block.type === "table" &&
    Array.isArray(block.columns) &&
    Array.isArray(block.rows)
  ) {
    return (
      <div className="w-full overflow-x-auto border border-zinc-800 rounded-lg bg-zinc-950/40 my-4 backdrop-blur-sm">
        <table className="w-full border-collapse text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/60 uppercase tracking-wider text-xs font-mono text-zinc-400 border-b border-zinc-800">
            <tr>
              {block.columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 font-light">
            {block.rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-zinc-900/30 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`} className="px-4 py-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "timeline" && Array.isArray(block.entries)) {
    return (
      <ol className="relative border-l border-zinc-800 space-y-6 my-6 ml-2">
        {block.entries.map((entry) => (
          <li key={`${entry.date}-${entry.title}`} className="mb-4 ml-6 group">
            <span className="absolute w-3 h-3 bg-zinc-950 border border-[#7ab8ff] shadow-[0_0_8px_rgba(122,184,255,0.5)] rounded-full -left-1.5 top-1.5 group-hover:scale-125 transition-transform" />
            <span className="inline-block text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded mb-1">
              {entry.date}
            </span>
            <h4 className="text-zinc-200 text-sm font-semibold tracking-wide">
              {entry.title}
            </h4>
            <p className="text-zinc-400 text-xs font-light mt-1">
              {entry.description}
            </p>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "code" && typeof block.code === "string") {
    return (
      <pre className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-4 font-mono text-xs text-emerald-400 shadow-inner my-4 overflow-x-auto selection:bg-emerald-500/20">
        <code>{block.code}</code>
      </pre>
    );
  }

  return (
    <p className="text-zinc-500 italic text-sm">
      Formato della sezione non riconosciuto.
    </p>
  );
}

export default function NodeKnowledgePage({
  node,
  content,
  canEdit = true, // Default true per il mockup locale
  onBack,
  onClose,
  onSaveContent,
}) {
  const sections = Array.isArray(content) ? content : [];
  const category = node?.data?.category?.toLowerCase() || "frontend";
  const categoryTheme = getCategoryColor(category);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function startEditing() {
    setDraft(JSON.stringify(sections, null, 2));
    setError("");
    setIsEditing(true);
  }

  async function handleSave(event) {
    event.preventDefault();
    let parsedContent;
    try {
      parsedContent = JSON.parse(draft);
    } catch {
      setError(
        "Il JSON non è valido. Controlla parentesi, virgole e virgolette.",
      );
      return;
    }

    setIsSaving(true);
    try {
      if (onSaveContent) {
        await onSaveContent(parsedContent);
      } else {
        // Simulazione salvataggio mockup locale
        console.log("Mockup salvato localmente:", parsedContent);
      }
      setIsEditing(false);
      setError("");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Errore imprevisto durante il salvataggio.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10 font-sans border border-zinc-900 rounded-xl relative shadow-2xl overflow-hidden before:absolute before:top-0 before:left-0 before:w-full before:h-px before:bg-linear-to-r before:from-transparent before:via-zinc-700 before:to-transparent">
      {/* Header navigazione con stile fluttuante / minimal */}
      <header className="flex justify-between items-center border-b border-zinc-900 pb-4 mb-6">
        <button
          className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-400 hover:text-white transition-colors uppercase border border-zinc-800 bg-zinc-900/40 px-3 py-1.5 rounded-md backdrop-blur-sm"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={14} />
          Torna ai dettagli
        </button>
        <button
          aria-label="Chiudi e torna alla mappa"
          className="text-zinc-500 hover:text-white transition-colors border border-zinc-900 hover:border-zinc-800 p-1.5 rounded-md bg-zinc-950"
          onClick={onClose}
          type="button"
        >
          <X size={16} />
        </button>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Meta / Tag della categoria con bagliore neon */}
        <div className="flex gap-2 mb-3">
          <span
            className={`text-[10px] font-mono tracking-widest font-bold px-2 py-0.5 rounded border uppercase shadow-[0_0_15px_rgba(0,0,0,0.5)] ${categoryTheme}`}
          >
            {getCategoryLabel(node?.data?.category)}
          </span>
        </div>

        {/* Titolo Principale */}
        <h2
          id="node-knowledge-title"
          className="text-3xl font-extrabold tracking-tight text-white mb-6 uppercase border-b border-zinc-900 pb-2"
        >
          {node?.data?.label || "Tecnologia Mockup"}
        </h2>

        {isEditing && canEdit ? (
          /* Form Editor JSON stile Terminale Cyberpunk */
          <form
            className="border border-zinc-800 bg-zinc-900/30 backdrop-blur-md rounded-xl p-5 mb-8 space-y-4"
            onSubmit={handleSave}
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="node-knowledge-json"
                className="text-xs font-mono text-zinc-400 uppercase tracking-wider"
              >
                Contenuto esteso (JSON Editor)
              </label>
              <p className="text-xs text-zinc-500 font-light">
                Usa blocchi con tipo{" "}
                <code className="text-zinc-300 font-mono">text</code>,{" "}
                <code className="text-zinc-300 font-mono">list</code>,{" "}
                <code className="text-zinc-300 font-mono">table</code>,{" "}
                <code className="text-zinc-300 font-mono">timeline</code> o{" "}
                <code className="text-zinc-300 font-mono">code</code>.
              </p>
            </div>

            <textarea
              autoFocus
              disabled={isSaving}
              id="node-knowledge-json"
              onChange={(event) => setDraft(event.target.value)}
              spellCheck="false"
              value={draft}
              className="w-full h-80 bg-zinc-950 font-mono text-xs text-emerald-400 border border-zinc-800 rounded-lg p-4 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-shadow disabled:opacity-50 resize-y"
            />

            {error && (
              <p
                aria-live="polite"
                className="text-xs font-mono text-red-400 bg-red-950/20 border border-red-900/50 p-3 rounded-lg"
                role="alert"
              >
                🛑 {error}
              </p>
            )}

            <div className="flex justify-end gap-3 pt-2 border-t border-zinc-900">
              <button
                className="text-xs font-mono text-zinc-400 hover:text-white px-4 py-2 border border-zinc-800 bg-zinc-950 rounded-lg transition-colors"
                disabled={isSaving}
                onClick={() => {
                  setIsEditing(false);
                  setError("");
                }}
                type="button"
              >
                Annulla
              </button>
              <button
                className="flex items-center gap-1.5 text-xs font-mono text-zinc-950 bg-zinc-100 hover:bg-white px-4 py-2 rounded-lg font-semibold transition-all shadow-[0_0_10px_rgba(255,255,255,0.15)] disabled:opacity-50"
                disabled={isSaving}
                type="submit"
              >
                <Save size={13} />
                {isSaving ? "Salvataggio…" : "Salva"}
              </button>
            </div>
          </form>
        ) : canEdit ? (
          /* Pulsante Modifica */

          <button
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white border border-zinc-800 bg-zinc-900/50 px-4 py-2 rounded-lg transition-all mb-8 hover:border-zinc-700 shadow-sm"
            onClick={startEditing}
            type="button"
          >
            <Pencil size={13} />
            Inserisci o modifica contenuti
          </button>
        ) : (
          <p className="text-xs font-mono text-zinc-500 border border-zinc-900 bg-zinc-950/80 px-4 py-3 rounded-lg mb-8">
            🔒 Modalità sola lettura. Accedi per modificare questi
            approfondimenti.
          </p>
        )}

        {/* Visualizzazione delle Sezioni Renderizzate */}
        {sections.length > 0 ? (
          <div className="space-y-8 mt-4">
            {sections.map((section, index) => (
              <article
                className="border border-zinc-900/60 bg-zinc-900/10 p-5 rounded-xl backdrop-blur-sm"
                key={`${section.title}-${index}`}
              >
                <h3 className="text-base font-bold font-mono tracking-wide text-zinc-200 border-b border-zinc-800/80 pb-2 mb-4 uppercase">
                  {section.title}
                </h3>
                <ContentBlock block={section} />
              </article>
            ))}
          </div>
        ) : (
          <p className="text-zinc-500 italic text-sm font-light text-center py-12 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/30">
            Gli approfondimenti strutturati per questo nodo non sono ancora
            disponibili.
          </p>
        )}
      </div>
    </section>
  );
}
