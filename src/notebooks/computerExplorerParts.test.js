import assert from "node:assert/strict";
import test from "node:test";
import config from "./configs/dentroIlPcConfig.js";
import { COMPUTER_EXPLORER_PARTS, getExplorableSteps } from "./computerExplorerParts.js";

test("ogni componente del notebook ha un'area visiva selezionabile nello schema SVG", () => {
  assert.deepEqual(getExplorableSteps(config.steps), config.steps);
  for (const step of config.steps) {
    const area = COMPUTER_EXPLORER_PARTS[step.id];
    assert.ok([area.x, area.y, area.width, area.height].every(Number.isFinite), step.id);
    assert.ok(area.width > 0 && area.height > 0, step.id);
  }
});

test("passaggi non hardware non diventano selezioni nello schema", () => {
  assert.deepEqual(getExplorableSteps([{ id: "estraneo" }, { id: "cpu" }]), [{ id: "cpu" }]);
});
