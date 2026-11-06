import { useState } from "react";
import GlossaryDialog from "./GlossaryDialog";
import { GlossaryPageContext } from "../context/GlossaryPageContext";

function createOccurrenceStore() {
  const occurrences = new Map();
  const listeners = new Set();

  function notify() {
    listeners.forEach((listener) => listener());
  }

  return {
    register(element, termId) {
      occurrences.set(element, termId);
      notify();
      return () => {
        occurrences.delete(element);
        notify();
      };
    },
    isFirst(element, termId) {
      if (!element || !occurrences.has(element)) return false;
      for (const [other, otherTermId] of occurrences) {
        if (
          otherTermId === termId &&
          other !== element &&
          (element.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_PRECEDING)
        ) return false;
      }
      return true;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function GlossaryPageScope({ children }) {
  const [store] = useState(createOccurrenceStore);
  const [selected, setSelected] = useState(null);
  const [trigger, setTrigger] = useState(null);

  function openTerm(term, element) {
    setTrigger(element);
    setSelected(term);
  }

  return (
    <GlossaryPageContext.Provider value={{ store, openTerm }}>
      {children}
      <GlossaryDialog
        open={Boolean(selected)}
        onOpenChange={(open) => { if (!open) setSelected(null); }}
        term={selected}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (trigger?.isConnected) trigger.focus();
        }}
      />
    </GlossaryPageContext.Provider>
  );
}
