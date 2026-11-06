import { requireSupabase } from "./supabase";

const NODE_COLUMNS =
  "id, slug, label, description, best_practices, naming_conventions, study_urls, position_x, position_y, created_at, updated_at";

function toServiceError(error, fallback) {
  const code = error?.code;

  if (code === "23505") {
    return new Error(
      error?.message?.includes("slug") || error?.message?.includes("nodes_slug_key")
        ? "Esiste già un nodo con questo slug."
        : "Esiste già un elemento con questi dati.",
    );
  }

  if (code === "23503") {
    return new Error(
      "Impossibile completare l'operazione: il nodo o il padre selezionato non esiste più.",
    );
  }

  if (code === "23514") {
    return new Error(
      error?.message?.includes("ciclo")
        ? "Relazione non valida: creerebbe un ciclo padre-figlio."
        : "Dati non validi. Controlla categorie, padri e campi obbligatori.",
    );
  }

  if (code === "22023") {
    return new Error(error?.message ?? fallback);
  }

  if (code === "P0002") {
    return new Error("Il nodo da aggiornare non esiste più.");
  }

  if (code === "PGRST202") {
    return new Error(
      "Funzione di salvataggio non disponibile: applica la migrazione 0007 e aggiorna la cache API di Supabase.",
    );
  }

  if (code === "42501" || code === "PGRST301") {
    return new Error("Permessi insufficienti: serve un ruolo editor o admin.");
  }

  return new Error(fallback);
}

export async function fetchMapGraph() {
  const client = requireSupabase();

  const [nodesResult, parentsResult, categoriesResult] = await Promise.all([
    client.from("nodes").select(NODE_COLUMNS).order("label"),
    client
      .from("node_parents")
      .select("parent_id, child_id, sort_order, is_primary"),
    client.from("node_categories").select("node_id, category, is_primary"),
  ]);

  const error =
    nodesResult.error || parentsResult.error || categoriesResult.error;

  if (error) {
    throw toServiceError(error, "Impossibile caricare la mappa.");
  }

  return {
    nodes: nodesResult.data ?? [],
    parents: parentsResult.data ?? [],
    categories: categoriesResult.data ?? [],
  };
}

export async function fetchNodeSections(nodeId) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("node_content_sections")
    .select("id, node_id, sort_order, title, type, payload, updated_at")
    .eq("node_id", nodeId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw toServiceError(error, "Impossibile caricare gli approfondimenti.");
  }

  return data ?? [];
}

export async function saveNodeWithRelations({
  nodeId,
  payload,
  categoryLinks,
  parentLinks,
}) {
  const client = requireSupabase();
  const { data, error } = await client.rpc("save_node_with_relations", {
    p_node_id: nodeId,
    p_slug: payload.slug,
    p_label: payload.label,
    p_description: payload.description,
    p_best_practices: payload.best_practices,
    p_naming_conventions: payload.naming_conventions,
    p_study_urls: payload.study_urls,
    p_position_x: payload.position_x,
    p_position_y: payload.position_y,
    p_categories: categoryLinks,
    p_parents: parentLinks,
  });

  if (error) {
    throw toServiceError(error, "Impossibile salvare il nodo.");
  }

  if (!data) {
    throw new Error("Il salvataggio non ha restituito l'identificativo del nodo.");
  }
  return data;
}

export async function updateNode(nodeId, payload) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("nodes")
    .update(payload)
    .eq("id", nodeId)
    .select(NODE_COLUMNS)
    .single();

  if (error) {
    throw toServiceError(error, "Impossibile aggiornare il nodo.");
  }

  return data;
}

export async function saveNodePosition(nodeId, x, y) {
  const client = requireSupabase();
  const { error } = await client
    .from("nodes")
    .update({ position_x: x, position_y: y })
    .eq("id", nodeId);

  if (error) {
    throw toServiceError(error, "Impossibile salvare la posizione del nodo.");
  }
}

export async function deleteNode(nodeId) {
  const client = requireSupabase();
  const { error } = await client.from("nodes").delete().eq("id", nodeId);

  if (error) {
    throw toServiceError(error, "Impossibile eliminare il nodo.");
  }
}

export async function createSection(nodeId, payload) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("node_content_sections")
    .insert({ node_id: nodeId, ...payload })
    .select("id, node_id, sort_order, title, type, payload, updated_at")
    .single();

  if (error) {
    throw toServiceError(error, "Impossibile creare la sezione.");
  }

  return data;
}

export async function updateSection(sectionId, payload, expectedUpdatedAt) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("node_content_sections")
    .update(payload)
    .eq("id", sectionId)
    .eq("updated_at", expectedUpdatedAt)
    .select("id, node_id, sort_order, title, type, payload, updated_at")
    .maybeSingle();

  if (error) {
    throw toServiceError(error, "Impossibile aggiornare la sezione.");
  }

  if (!data) {
    throw new Error("La sezione è stata modificata o eliminata in un'altra scheda. Aggiorna i dati e controlla eventuali bozze prima di riprovare.");
  }
  return data;
}

export async function deleteSection(sectionId, expectedUpdatedAt) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("node_content_sections")
    .delete()
    .eq("id", sectionId)
    .eq("updated_at", expectedUpdatedAt)
    .select("id")
    .maybeSingle();

  if (error) {
    throw toServiceError(error, "Impossibile eliminare la sezione.");
  }
  if (!data) {
    throw new Error("La sezione è stata modificata o eliminata in un'altra scheda. Ricarica prima di riprovare.");
  }
}

const NOTE_IMAGES_BUCKET = "note-images";
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export async function uploadNoteImage(file) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Il file selezionato non è un'immagine.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("L'immagine supera il limite di 5 MB.");
  }

  const client = requireSupabase();
  const extension = (file.type.split("/")[1] || "png").replace("jpeg", "jpg");
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;

  const { error } = await client.storage
    .from(NOTE_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000" });

  if (error) {
    throw toServiceError(error, "Impossibile caricare l'immagine.");
  }

  const { data } = client.storage.from(NOTE_IMAGES_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteNoteImages(paths) {
  const valid = paths.filter(Boolean);
  if (valid.length === 0) return;

  const client = requireSupabase();
  const { error } = await client.storage.from(NOTE_IMAGES_BUCKET).remove(valid);
  if (error) {
    throw toServiceError(error, "Impossibile rimuovere le immagini non utilizzate.");
  }
}

export async function addNodeStudyUrl(nodeId, url) {
  const client = requireSupabase();
  const { data: node, error: readError } = await client
    .from("nodes")
    .select("study_urls")
    .eq("id", nodeId)
    .single();

  if (readError) {
    throw toServiceError(readError, "Impossibile leggere il nodo selezionato.");
  }

  const current = Array.isArray(node.study_urls) ? node.study_urls : [];
  if (current.some((entry) => entry?.url === url)) {
    throw new Error("Questo link è già presente nel nodo.");
  }

  let label = url;
  try {
    label = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // URL già validato dal chiamante
  }

  const { error } = await client
    .from("nodes")
    .update({ study_urls: [...current, { label, url }] })
    .eq("id", nodeId);

  if (error) {
    throw toServiceError(error, "Impossibile aggiungere il link al nodo.");
  }
}

export async function fetchInboxLinks() {
  const client = requireSupabase();
  const { data, error } = await client
    .from("inbox_links")
    .select("id, url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw toServiceError(error, "Impossibile caricare l'inbox.");
  }

  return data ?? [];
}

export async function addInboxLink(url) {
  const client = requireSupabase();
  const { error } = await client.from("inbox_links").insert({ url });

  if (error) {
    throw toServiceError(error, "Impossibile salvare il link nell'inbox.");
  }
}

export async function deleteInboxLink(id) {
  const client = requireSupabase();
  const { error } = await client.from("inbox_links").delete().eq("id", id);

  if (error) {
    throw toServiceError(error, "Impossibile rimuovere il link dall'inbox.");
  }
}

export async function countInboxLinks() {
  const client = requireSupabase();
  const { count, error } = await client
    .from("inbox_links")
    .select("id", { count: "exact", head: true });

  if (error) {
    throw toServiceError(error, "Impossibile contare i link in inbox.");
  }

  return count ?? 0;
}

export const INBOX_CHANGED_EVENT = "inbox-changed";

export async function reorderSections(sections) {
  const client = requireSupabase();

  const results = await Promise.all(
    sections.map((section, index) =>
      client
        .from("node_content_sections")
        .update({ sort_order: index })
        .eq("id", section.id),
    ),
  );

  const failed = results.find((result) => result.error);
  if (failed) {
    throw toServiceError(
      failed.error,
      "Impossibile riordinare le sezioni.",
    );
  }
}
