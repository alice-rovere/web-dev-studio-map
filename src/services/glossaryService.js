import { requireSupabase } from "./supabase";

function toGlossaryError(error, fallback) {
  if (error?.code === "23505") {
    return new Error("Questo termine è già presente nel glossario.");
  }

  if (error?.code === "42501" || error?.code === "PGRST301") {
    return new Error("Permessi insufficienti: serve un ruolo editor o admin.");
  }

  return new Error(fallback);
}

export async function fetchGlossaryTerms() {
  const client = requireSupabase();
  const { data, error } = await client
    .from("glossary_terms")
    .select("id, term, definition, created_at, updated_at")
    .order("term", { ascending: true });

  if (error) {
    throw toGlossaryError(error, "Impossibile caricare il glossario.");
  }

  return data ?? [];
}

export async function createGlossaryTerm({ term, definition }) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("glossary_terms")
    .insert({ term: term.trim(), definition: definition.trim() })
    .select("id, term, definition, created_at, updated_at")
    .single();

  if (error) {
    throw toGlossaryError(error, "Impossibile salvare il termine.");
  }

  return data;
}

export async function updateGlossaryTerm(id, { term, definition }) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("glossary_terms")
    .update({ term: term.trim(), definition: definition.trim() })
    .eq("id", id)
    .select("id, term, definition, created_at, updated_at")
    .single();

  if (error) {
    throw toGlossaryError(error, "Impossibile aggiornare il termine.");
  }

  return data;
}

export async function deleteGlossaryTerm(id) {
  const client = requireSupabase();
  const { error } = await client
    .from("glossary_terms")
    .delete()
    .eq("id", id);

  if (error) {
    throw toGlossaryError(error, "Impossibile eliminare il termine.");
  }
}
