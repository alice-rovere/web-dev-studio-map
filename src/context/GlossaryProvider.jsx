import { useCallback, useEffect, useState } from "react";
import { NativeGlossaryContext } from "./GlossaryContext";
import {
  createGlossaryTerm,
  deleteGlossaryTerm,
  fetchGlossaryTerms,
  updateGlossaryTerm,
} from "../services/glossaryService";

export function GlossaryProvider({ children }) {
  const [glossary, setGlossary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTerms = useCallback(async () => {
    try {
      const terms = await fetchGlossaryTerms();
      setGlossary(terms);
      setError(null);
    } catch (fetchError) {
      setGlossary([]);
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Impossibile caricare il glossario.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Caricamento iniziale: gli aggiornamenti di stato avvengono dopo la richiesta.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTerms();
  }, [loadTerms]);

  const refresh = useCallback(async () => {
    setLoading(true);
    await loadTerms();
  }, [loadTerms]);

  const addTerm = useCallback(async ({ term, definition }) => {
    try {
      const created = await createGlossaryTerm({ term, definition });
      setGlossary((previous) =>
        [...previous, created].sort((a, b) =>
          a.term.localeCompare(b.term, "it", { sensitivity: "base" }),
        ),
      );
      setError(null);
      return null;
    } catch (createError) {
      return createError instanceof Error
        ? createError.message
        : "Impossibile salvare il termine.";
    }
  }, []);

  const editTerm = useCallback(async (id, { term, definition }) => {
    try {
      const updated = await updateGlossaryTerm(id, { term, definition });
      setGlossary((previous) =>
        previous
          .map((item) => (item.id === id ? updated : item))
          .sort((a, b) =>
            a.term.localeCompare(b.term, "it", { sensitivity: "base" }),
          ),
      );
      setError(null);
      return null;
    } catch (updateError) {
      return updateError instanceof Error
        ? updateError.message
        : "Impossibile aggiornare il termine.";
    }
  }, []);

  const removeTerm = useCallback(async (id) => {
    try {
      await deleteGlossaryTerm(id);
      setGlossary((previous) => previous.filter((item) => item.id !== id));
      setError(null);
      return null;
    } catch (deleteError) {
      return deleteError instanceof Error
        ? deleteError.message
        : "Impossibile eliminare il termine.";
    }
  }, []);

  return (
    <NativeGlossaryContext.Provider
      value={{
        glossary,
        loading,
        error,
        refresh,
        addTerm,
        updateTerm: editTerm,
        deleteTerm: removeTerm,
      }}
    >
      {children}
    </NativeGlossaryContext.Provider>
  );
}
