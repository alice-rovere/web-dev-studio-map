import { requireSupabase } from "./supabase";

const COLUMNS = "slug, description, node_id, pending_node_slug, renderer, config, updated_at";

function gridError(error, fallback) {
  if (error?.code === "42501" || error?.code === "PGRST301") return new Error("Permessi insufficienti: serve un ruolo editor o admin.");
  if (error?.code === "23503") return new Error("Il nodo selezionato non esiste più.");
  return new Error(fallback);
}

export async function fetchVisualGrids() {
  const { data, error } = await requireSupabase().from("visual_grids").select(COLUMNS).order("created_at");
  if (error) throw gridError(error, "Impossibile caricare le griglie visive. Verifica la connessione e le migrazioni Supabase.");
  return data;
}

export async function fetchVisualGrid(slug) {
  const { data, error } = await requireSupabase().from("visual_grids").select(COLUMNS).eq("slug", slug).maybeSingle();
  if (error) throw gridError(error, "Impossibile caricare la griglia visiva.");
  return data;
}

export async function fetchVisualGridsForNode(nodeId) {
  const { data, error } = await requireSupabase().from("visual_grids").select("slug, config").eq("node_id", nodeId).order("created_at");
  if (error) throw gridError(error, "Impossibile verificare le griglie collegate al nodo.");
  return data;
}

export async function updateVisualGrid({ slug, description, nodeId, pendingNodeSlug, config, updatedAt }) {
  if (!updatedAt) throw new Error("Versione della griglia mancante: ricarica prima di salvare.");
  const { data, error } = await requireSupabase().from("visual_grids")
    .update({ description, node_id: nodeId || null, pending_node_slug: nodeId ? null : pendingNodeSlug || null, config })
    .eq("slug", slug).eq("updated_at", updatedAt).select(COLUMNS).maybeSingle();
  if (error) throw gridError(error, "Impossibile salvare la griglia.");
  if (!data) throw new Error("La griglia è stata modificata o eliminata, oppure non hai più i permessi. Ricarica prima di salvare.");
  return data;
}
