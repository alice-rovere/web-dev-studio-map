import { PHASE_ICONS } from "./phaseIcons.js";

export function validateNotebook({ slug, description, config }) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return "Lo slug deve contenere solo lettere minuscole, numeri e trattini.";
  if (!description.trim() || !config.title?.trim()) return "Inserisci il titolo e la descrizione del percorso.";
  if (!Array.isArray(config.phases) || !config.phases.length) return "Aggiungi almeno una fase.";
  if (!Array.isArray(config.steps) || !config.steps.length) return "Aggiungi almeno un passaggio.";
  const phases = new Set();
  for (const phase of config.phases) {
    if (!phase.id || phases.has(phase.id) || !phase.label?.trim()) return "Ogni fase deve avere un titolo e un identificativo univoco.";
    if (!Object.hasOwn(PHASE_ICONS, phase.icon)) return "Seleziona un'icona valida per ogni fase.";
    phases.add(phase.id);
  }
  const steps = new Set();
  for (const step of config.steps) {
    if (!step.id || steps.has(step.id) || !step.title?.trim() || !step.description?.trim() || !phases.has(step.phase)) {
      return "Ogni passaggio deve avere un titolo, una descrizione e una fase valida.";
    }
    steps.add(step.id);
    if (step.illustration && !["generic", "prisma-flow", "internet-browser", "web-request-cycle", "computer-system", "operating-system"].includes(step.illustration)) return "Illustrazione non riconosciuta.";
    if (!Array.isArray(step.panels) || !step.panels.length) return `Aggiungi almeno un pannello al passaggio "${step.title}".`;
    for (const panel of step.panels) {
      if (!panel.label?.trim() || !["text", "code", "table"].includes(panel.kind)) return "Ogni pannello deve avere un titolo e un tipo valido.";
      if (panel.kind !== "table" && !panel.content?.trim()) return `Compila il pannello "${panel.label}".`;
      if (panel.kind === "table" && (!panel.columns?.length || panel.columns.some((column) => !column.trim()) ||
        new Set(panel.columns).size !== panel.columns.length || !Array.isArray(panel.rows) ||
        panel.rows.some((row) => row.length !== panel.columns.length))) return `Controlla colonne e righe del pannello "${panel.label}".`;
      if (panel.highlightLines?.some((n) => !Number.isInteger(n) || n < 1 || n > panel.content.split("\n").length)) return `Controlla le righe evidenziate in "${panel.label}".`;
      if (panel.highlightRows?.some((n) => !Number.isInteger(n) || n < 0 || n >= panel.rows.length)) return `Controlla le righe evidenziate in "${panel.label}".`;
    }
  }
  return null;
}
