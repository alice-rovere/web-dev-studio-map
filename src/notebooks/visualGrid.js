export const GRID_COMPONENT_IDS = {
  computer: ["scheda-madre", "cpu", "ram", "archiviazione", "gpu", "batteria", "periferiche"],
  "web-page": ["html", "css", "javascript"],
};

export function validateVisualGrid({ description, renderer, config }) {
  const ids = GRID_COMPONENT_IDS[renderer];
  if (!ids && renderer !== "excalidraw") return "Schema della griglia non riconosciuto.";
  if (typeof description !== "string" || !description.trim() || typeof config?.title !== "string" || !config.title.trim()) return "Inserisci il titolo e la descrizione della griglia.";
  if (config.subtitle != null && typeof config.subtitle !== "string") return "Il sottotitolo della griglia non è valido.";
  if (renderer === "excalidraw") return validateWhiteboard(config.whiteboard, { requireContent: true });
  if (!Array.isArray(config.components) || config.components.length !== ids.length) return "La griglia deve contenere tutti i componenti dello schema.";
  const found = new Set();
  for (const component of config.components) {
    if (!component || !ids.includes(component.id) || found.has(component.id) || typeof component.title !== "string" || !component.title.trim() || typeof component.description !== "string" || !component.description.trim()) {
      return "Ogni componente deve avere un identificativo valido, un titolo e una spiegazione.";
    }
    found.add(component.id);
    if (!Array.isArray(component.panels)) return "I pannelli del componente non sono validi.";
    for (const panel of component.panels) {
      if (!panel || typeof panel.label !== "string" || !panel.label.trim() || !["text", "code", "table"].includes(panel.kind)) return "Ogni pannello deve avere un titolo e un tipo valido.";
      if (panel.kind !== "table" && (typeof panel.content !== "string" || !panel.content.trim())) return `Compila il pannello "${panel.label}".`;
      if (panel.highlightLines != null && (!Array.isArray(panel.highlightLines) || panel.highlightLines.some((value) => !Number.isInteger(value) || value < 1))) return `Controlla le righe evidenziate in "${panel.label}".`;
      if (panel.highlightRows != null && (!Array.isArray(panel.highlightRows) || panel.highlightRows.some((value) => !Number.isInteger(value) || value < 0))) return `Controlla le righe evidenziate in "${panel.label}".`;
      if (panel.kind === "table" && (!Array.isArray(panel.columns) || !panel.columns.length || panel.columns.some((column) => typeof column !== "string" || !column.trim()) ||
        !Array.isArray(panel.rows) || panel.rows.some((row) => !Array.isArray(row) || row.length !== panel.columns.length || row.some((cell) => typeof cell !== "string")))) {
        return `Controlla colonne e righe del pannello "${panel.label}".`;
      }
    }
  }
  return null;
}
import { validateWhiteboard } from "../components/content/blocks/interactiveWhiteboard.js";
