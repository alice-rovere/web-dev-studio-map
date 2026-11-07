import assert from "node:assert/strict";
import test from "node:test";
import { getFocusViewport } from "./focusViewport.js";

const node = (x, y, width, height) => ({
  position: { x, y },
  measured: { width, height },
});

test("centra i nodi nello spazio a sinistra del pannello", () => {
  const viewport = getFocusViewport(
    [node(100, 200, 190, 60)],
    { left: 20, width: 1200, height: 800 },
    { left: 772 },
    1.2,
  );

  assert.equal(viewport.zoom, 1.2);
  assert.equal(viewport.x + 195 * viewport.zoom, 376);
  assert.equal(viewport.y + 230 * viewport.zoom, 400);
});

test("riduce lo zoom per includere i figli più distanti", () => {
  const nodes = [
    node(0, 0, 190, 60),
    node(-500, -400, 180, 50),
    node(600, 400, 200, 50),
  ];
  const width = 600;
  const height = 700;
  const viewport = getFocusViewport(
    nodes,
    { left: 0, width: 1048, height },
    { left: width },
    1.2,
  );

  assert.ok(viewport.zoom < 1.2);
  for (const item of nodes) {
    const left = viewport.x + item.position.x * viewport.zoom;
    const right = left + item.measured.width * viewport.zoom;
    const top = viewport.y + item.position.y * viewport.zoom;
    const bottom = top + item.measured.height * viewport.zoom;
    assert.ok(left >= 0 && right <= width);
    assert.ok(top >= 0 && bottom <= height);
  }
});

test("non supera la larghezza della mappa se il pannello è esterno", () => {
  const viewport = getFocusViewport(
    [node(0, 0, 100, 50)],
    { left: 50, width: 800, height: 600 },
    { left: 1000 },
    1,
  );
  assert.equal(viewport.x + 50 * viewport.zoom, 400);
});
