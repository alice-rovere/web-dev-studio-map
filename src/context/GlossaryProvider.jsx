import { useState } from "react";
import { NativeGlossaryContext } from "./GlossaryContext";

export function GlossaryProvider({ children }) {
  const [glossary, setGlossary] = useState([
    {
      term: "Deployment",
      definition:
        "Rilascio e attivazione dell'applicazione sul server di produzione.",
    },
    {
      term: "Frontend",
      definition:
        "La parte di un'applicazione visibile ed accessibile all'utente finale.",
    },
    {
      term: "Backend",
      definition:
        "Logica server-side, gestione dei dati e sicurezza dell'infrastruttura.",
    },
  ]);
  const [error] = useState(null);

  async function addTerm({ term, definition }) {
    const exists = glossary.some(
      (item) => item.term.toLowerCase() === term.toLowerCase(),
    );
    if (exists) {
      return "Questo termine è già presente nel database di sistema.";
    }

    const newEntry = { term, definition };
    setGlossary((prev) => [...prev, newEntry]);
    return null;
  }

  return (
    <NativeGlossaryContext.Provider value={{ glossary, error, addTerm }}>
      {children}
    </NativeGlossaryContext.Provider>
  );
}
