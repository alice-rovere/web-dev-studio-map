import { useState } from "react";
import { X } from "lucide-react";

export function GlossaryForm({ error, onAddTerm, onClose }) {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const normalizedTerm = term.trim();
    const normalizedDefinition = definition.trim();

    if (!normalizedTerm || !normalizedDefinition) {
      setValidationError("Inserisci sia il termine sia la definizione.");
      return;
    }

    setIsSubmitting(true);
    try {
      const addError = await onAddTerm({
        term: normalizedTerm,
        definition: normalizedDefinition,
      });
      if (addError) {
        setValidationError(addError);
        return;
      }
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      aria-labelledby="glossary-form-title"
      className="w-full text-[#e8edf5]"
    >
      {/* Header del Form */}
      <header className="flex items-center justify-between pb-4 mb-4 border-b border-[#33445d]">
        <h2
          id="glossary-form-title"
          className="text-[14px] font-bold tracking-wider text-cyan-400 uppercase"
        >
          Nuovo termine
        </h2>
        <button
          aria-label="Chiudi form"
          className="p-1 rounded-md text-[#b9c5d6] hover:text-[#e8edf5] hover:bg-[#192536] transition-colors cursor-pointer"
          disabled={isSubmitting}
          onClick={onClose}
          type="button"
        >
          <X aria-hidden="true" size={16} />
        </button>
      </header>

      {/* Campi del Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="glossary-term"
            className="text-[11px] font-semibold tracking-wider text-[#b9c5d6] uppercase"
          >
            Nome del termine
          </label>
          <input
            autoFocus
            id="glossary-term"
            disabled={isSubmitting}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Es. deployment"
            className="w-full px-3 py-2 text-[13px] text-[#e8edf5] bg-[#0e1624] border border-[#33445d] rounded-lg focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-[#53657d]"
            value={term}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="glossary-definition"
            className="text-[11px] font-semibold tracking-wider text-[#b9c5d6] uppercase"
          >
            Definizione
          </label>
          <textarea
            id="glossary-definition"
            disabled={isSubmitting}
            onChange={(event) => setDefinition(event.target.value)}
            placeholder="Descrivi brevemente il termine"
            rows={3}
            className="w-full px-3 py-2 text-[13px] text-[#e8edf5] bg-[#0e1624] border border-[#33445d] rounded-lg focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none placeholder:text-[#53657d]"
            value={definition}
          />
        </div>

        {/* Messaggi di Errore Validation / Supabase */}
        {(validationError || error) && (
          <p
            aria-live="polite"
            className="text-[12px] font-medium text-rose-400 bg-rose-950/20 border border-rose-500/30 px-3 py-1.5 rounded-md"
          >
            {validationError || error}
          </p>
        )}

        {/* Azioni del Form */}
        <div className="flex justify-end gap-3 pt-2 border-t border-[#33445d] mt-2">
          <button
            className="h-8.5 px-3 text-[12px] font-medium text-[#b9c5d6] hover:text-[#e8edf5] bg-[#192536]/50 hover:bg-[#192536] border border-[#33445d]/60 rounded-lg transition-colors cursor-pointer"
            disabled={isSubmitting}
            onClick={onClose}
            type="button"
          >
            Annulla
          </button>
          <button
            className="h-8.5 px-3.5 text-[12px] font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Salvataggio…" : "Aggiungi termine"}
          </button>
        </div>
      </form>
    </section>
  );
}
