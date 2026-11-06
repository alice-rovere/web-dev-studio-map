import assert from "node:assert/strict";
import test from "node:test";
import config from "./configs/internetBrowserConfig.js";
import { hasNotebook, loadNotebookConfig } from "./registry.js";

test("Internet & Browser è registrato e copre rete e rendering", async () => {
  assert.equal(hasNotebook("internet-browser"), true);
  assert.equal(await loadNotebookConfig("internet-browser"), config);
  assert.equal(config.slug, "internet-browser");
  assert.deepEqual(config.steps.map((step) => step.id), [
    "url", "dns", "connection", "request", "html", "css", "javascript", "tree", "layout", "pixels",
  ]);
  const phases = new Set(config.phases.map((phase) => phase.id));
  assert.equal(phases.size, config.phases.length);
  for (const step of config.steps) {
    assert.ok(phases.has(step.phase), step.id);
    assert.equal(step.illustration, "internet-browser");
    assert.ok(step.title && step.description && step.panels.length > 0, step.id);
    assert.ok(step.panels.every((panel) => ["text", "code", "table"].includes(panel.kind)), step.id);
  }
});

test("il notebook Prisma rimane registrato", async () => {
  assert.equal(hasNotebook("prisma-orm"), true);
  assert.equal((await loadNotebookConfig("prisma-orm")).slug, "prisma-orm");
  assert.equal(await loadNotebookConfig("inesistente"), null);
});
