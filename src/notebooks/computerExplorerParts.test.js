import assert from "node:assert/strict";
import test from "node:test";
import config from "./configs/dentroIlPcConfig.js";
import { COMPUTER_EXPLORER_PARTS, getExplorableSteps } from "./computerExplorerParts.js";

test("ogni componente del notebook ha una posizione e un'inquadratura 3D", () => {
  assert.deepEqual(getExplorableSteps(config.steps), config.steps);
  for (const step of config.steps) {
    const focus = COMPUTER_EXPLORER_PARTS[step.id];
    assert.equal(focus.position.length, 3, step.id);
    assert.equal(focus.camera.length, 3, step.id);
    assert.ok([...focus.position, ...focus.camera].every(Number.isFinite), step.id);
  }
});

test("passaggi personalizzati senza modello non diventano selezioni 3D", () => {
  assert.deepEqual(getExplorableSteps([{ id: "estraneo" }, { id: "cpu" }]), [{ id: "cpu" }]);
});
