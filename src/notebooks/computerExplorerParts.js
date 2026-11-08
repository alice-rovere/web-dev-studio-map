export const COMPUTER_EXPLORER_PARTS = {
  "scheda-madre": { x: 170, y: 75, width: 700, height: 405 },
  cpu: { x: 410, y: 230, width: 145, height: 90 },
  ram: { x: 630, y: 132, width: 155, height: 70 },
  archiviazione: { x: 630, y: 365, width: 155, height: 70 },
  gpu: { x: 215, y: 365, width: 155, height: 70 },
  batteria: { x: 215, y: 132, width: 155, height: 70 },
  periferiche: { x: 10, y: 245, width: 135, height: 88 },
};

export function getExplorableSteps(steps) {
  return steps.filter((step) => Object.hasOwn(COMPUTER_EXPLORER_PARTS, step.id));
}
