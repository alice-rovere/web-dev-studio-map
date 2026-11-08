export function validateWhiteboard(payload, { requireContent = false } = {}) {
  if (!payload || !Array.isArray(payload.elements) || !payload.files || typeof payload.files !== "object" || Array.isArray(payload.files)) return "La lavagna non è valida.";
  if (requireContent && !payload.elements.length) return "Disegna almeno un elemento nella lavagna.";
  if (payload.annotations != null && !Array.isArray(payload.annotations)) return "Le spiegazioni della lavagna non sono valide.";
  const ids = new Set(payload.elements.map((element) => element?.id));
  const seen = new Set();
  for (const annotation of payload.annotations ?? []) {
    if (!annotation || typeof annotation.elementId !== "string" || !ids.has(annotation.elementId) || seen.has(annotation.elementId) ||
      typeof annotation.title !== "string" || !annotation.title.trim() ||
      typeof annotation.description !== "string" || !annotation.description.trim()) {
      return "Ogni spiegazione deve riferirsi a un elemento presente e avere titolo e testo.";
    }
    seen.add(annotation.elementId);
  }
  return null;
}

export function missingAnnotations(elements, annotations) {
  const ids = new Set(elements.map((element) => element.id));
  return annotations.filter((annotation) => !ids.has(annotation.elementId));
}
