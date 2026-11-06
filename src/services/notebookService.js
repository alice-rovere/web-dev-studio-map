import { requireSupabase } from "./supabase";

const COLUMNS = "slug, description, node_id, pending_node_slug, config, updated_at";

function serviceError(error, fallback) {
  if (error?.code === "23505") {
    return new Error("Esiste già un percorso con questo slug o collegato al nodo selezionato.");
  }
  if (error?.code === "23503") {
    return new Error("Il nodo selezionato non esiste più.");
  }
  if (error?.code === "42501" || error?.code === "PGRST301") {
    return new Error("Permessi insufficienti: serve il ruolo admin.");
  }
  return new Error(fallback);
}

export async function fetchNotebooks() {
  const { data, error } = await requireSupabase()
    .from("guided_notebooks").select(COLUMNS).order("created_at");
  if (error) throw serviceError(error, "Impossibile caricare i percorsi guidati. Verifica la connessione e le migrazioni Supabase.");
  return data;
}

export async function fetchNotebook(slug) {
  const { data, error } = await requireSupabase()
    .from("guided_notebooks").select(COLUMNS).eq("slug", slug).maybeSingle();
  if (error) throw serviceError(error, "Impossibile caricare il percorso guidato.");
  return data;
}

export async function fetchNotebookForNode(nodeId) {
  const { data, error } = await requireSupabase()
    .from("guided_notebooks").select("slug").eq("node_id", nodeId).maybeSingle();
  if (error) throw serviceError(error, "Impossibile verificare il percorso collegato al nodo.");
  return data;
}

export async function saveNotebook({ slug, description, nodeId, pendingNodeSlug, config, updatedAt }) {
  const client = requireSupabase();
  const payload = {
    description,
    node_id: nodeId || null,
    pending_node_slug: nodeId ? null : pendingNodeSlug || null,
    config,
  };
  const query = updatedAt
    ? client.from("guided_notebooks").update(payload).eq("slug", slug).eq("updated_at", updatedAt)
    : client.from("guided_notebooks").insert({ ...payload, slug });
  const { data, error } = await query.select(COLUMNS).maybeSingle();
  if (error) throw serviceError(error, "Impossibile salvare il percorso.");
  if (!data) throw new Error("Il percorso è stato modificato o eliminato, oppure non hai più i permessi. Ricarica prima di salvare.");
  return data;
}

export async function deleteNotebook(slug, updatedAt) {
  const { data, error } = await requireSupabase()
    .from("guided_notebooks").delete().eq("slug", slug).eq("updated_at", updatedAt)
    .select("slug").maybeSingle();
  if (error) throw serviceError(error, "Impossibile eliminare il percorso.");
  if (!data) throw new Error("Il percorso è stato modificato o eliminato, oppure non hai più i permessi. Ricarica la pagina.");
}
