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
    .select("id, node_id, sort_order, title, type, payload")
    .eq("node_id", nodeId)
    .order("sort_order", { ascending: true });

  if (error) {
    throw toServiceError(error, "Impossibile caricare gli approfondimenti.");
  }

  return data ?? [];
}

export async function createNode(payload) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("nodes")
    .insert(payload)
    .select(NODE_COLUMNS)
    .single();

  if (error) {
    throw toServiceError(error, "Impossibile creare il nodo.");
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

export async function setNodeParents(nodeId, parentLinks) {
  const client = requireSupabase();

  const { error: deleteError } = await client
    .from("node_parents")
    .delete()
    .eq("child_id", nodeId);

  if (deleteError) {
    throw toServiceError(deleteError, "Impossibile aggiornare i padri del nodo.");
  }

  if (parentLinks.length === 0) return;

  const rows = parentLinks.map((link, index) => ({
    parent_id: link.parent_id,
    child_id: nodeId,
    sort_order: Number.isFinite(Number(link.sort_order))
      ? Number(link.sort_order)
      : index,
    is_primary: Boolean(link.is_primary),
  }));

  const { error } = await client.from("node_parents").insert(rows);

  if (error) {
    throw toServiceError(error, "Impossibile aggiornare i padri del nodo.");
  }
}

export async function setNodeCategories(nodeId, categoryLinks) {
  const client = requireSupabase();

  const { error: deleteError } = await client
    .from("node_categories")
    .delete()
    .eq("node_id", nodeId);

  if (deleteError) {
    throw toServiceError(
      deleteError,
      "Impossibile aggiornare le categorie del nodo.",
    );
  }

  if (categoryLinks.length === 0) return;

  const rows = categoryLinks.map((link) => ({
    node_id: nodeId,
    category: link.category,
    is_primary: Boolean(link.is_primary),
  }));

  const { error } = await client.from("node_categories").insert(rows);

  if (error) {
    throw toServiceError(error, "Impossibile aggiornare le categorie del nodo.");
  }
}

export async function createSection(nodeId, payload) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("node_content_sections")
    .insert({ node_id: nodeId, ...payload })
    .select("id, node_id, sort_order, title, type, payload")
    .single();

  if (error) {
    throw toServiceError(error, "Impossibile creare la sezione.");
  }

  return data;
}

export async function updateSection(sectionId, payload) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("node_content_sections")
    .update(payload)
    .eq("id", sectionId)
    .select("id, node_id, sort_order, title, type, payload")
    .single();

  if (error) {
    throw toServiceError(error, "Impossibile aggiornare la sezione.");
  }

  return data;
}

export async function deleteSection(sectionId) {
  const client = requireSupabase();
  const { error } = await client
    .from("node_content_sections")
    .delete()
    .eq("id", sectionId);

  if (error) {
    throw toServiceError(error, "Impossibile eliminare la sezione.");
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
  await client.storage.from(NOTE_IMAGES_BUCKET).remove(valid);
}

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
