import { useContext } from "react";
import { NativeGlossaryContext } from "../context/GlossaryContext";

export function useGlossary() {
  const context = useContext(NativeGlossaryContext);
  if (!context) {
    throw new Error("useGlossary deve essere utilizzato all'interno di un GlossaryProvider");
  }
  return context;
}
