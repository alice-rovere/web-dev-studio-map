export const COMPUTER_EXPLORER_PARTS = {
  "scheda-madre": { position: [0, 0, 0], camera: [6, 8, 8] },
  cpu: { position: [-0.9, 0.3, -0.5], camera: [1.4, 3.2, 3.2] },
  ram: { position: [0.55, 0.35, -0.4], camera: [3, 3, 3] },
  archiviazione: { position: [1.4, 0.3, 1.15], camera: [4, 3, 4] },
  gpu: { position: [-0.7, 0.65, 1.2], camera: [2.4, 3.1, 4.8] },
  batteria: { position: [3.65, 0.25, 0.3], camera: [6, 3, 4.3] },
  periferiche: { position: [-2.4, 0.4, -1.3], camera: [-5, 3, 2.5] },
};

export function getExplorableSteps(steps) {
  return steps.filter((step) => Object.hasOwn(COMPUTER_EXPLORER_PARTS, step.id));
}
