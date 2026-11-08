import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { GRID_COMPONENT_IDS, validateVisualGrid } from "./visualGrid.js";
import pc from "./configs/dentroIlPcConfig.js";

const pcGrid = () => ({ renderer: "computer", description: "Descrizione", config: { title: pc.title, components: structuredClone(pc.steps) } });

test("la griglia PC conserva i pannelli e richiede esattamente i componenti dello schema", () => {
  const grid = pcGrid();
  assert.equal(validateVisualGrid(grid), null);
  assert.deepEqual(grid.config.components.map((item) => item.id), GRID_COMPONENT_IDS.computer);
  grid.config.components[0].id = "extra";
  assert.match(validateVisualGrid(grid), /identificativo/);
  grid.config.components[0].id = grid.config.components[1].id;
  assert.match(validateVisualGrid(grid), /identificativo/);
});

test("la validazione segnala dati e pannelli malformati senza lanciare eccezioni", () => {
  const grid = pcGrid();
  grid.config.components[0].description = 42;
  assert.match(validateVisualGrid(grid), /spiegazione/);
  grid.config.components[0].description = "Valida";
  grid.config.components[0].panels = [null];
  assert.match(validateVisualGrid(grid), /pannello/);
  grid.config.components[0].panels = [{ kind: "table", label: "Tabella", columns: ["A"], rows: [["A", "B"]] }];
  assert.match(validateVisualGrid(grid), /colonne/);
});

test("i contenuti iniziali della pagina web corrispondono al renderer", async () => {
  const sql = await readFile(new URL("../../supabase/migrations/0015_visual_grids.sql", import.meta.url), "utf8");
  const match = sql.match(/'(\{\s*"title": "La pagina web"[\s\S]+?\})'::jsonb/);
  assert.ok(match);
  const config = JSON.parse(match[1]);
  assert.deepEqual(config.components.map(({ id }) => id), GRID_COMPONENT_IDS["web-page"]);
  assert.equal(validateVisualGrid({ renderer: "web-page", description: "Descrizione", config }), null);
});

test("le griglie Excalidraw richiedono una lavagna e spiegazioni coerenti", () => {
  const grid = { renderer: "excalidraw", description: "Descrizione", config: { title: "Griglia", whiteboard: { elements: [{ id: "a" }], files: {}, annotations: [{ elementId: "a", title: "Titolo", description: "Descrizione" }] } } };
  assert.equal(validateVisualGrid(grid), null);
  grid.config.whiteboard.elements = [];
  assert.match(validateVisualGrid(grid), /Disegna/);
  grid.config.whiteboard.elements = [{ id: "b" }];
  assert.match(validateVisualGrid(grid), /spiegazione/i);
});
