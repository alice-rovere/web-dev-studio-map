import assert from "node:assert/strict";
import test from "node:test";
import config from "./configs/httpProtocolConfig.js";
import { getNotebookCatalog, hasNotebook, loadNotebookConfig } from "./registry.js";

test("l'indice elenca i cinque appunti con la posizione nella mappa", () => {
  const catalog = getNotebookCatalog();
  assert.ok(catalog.every(({ slug }) => hasNotebook(slug)));
  assert.deepEqual(catalog.map((notebook) => notebook.slug), [
    "dentro-il-pc",
    "sistema-operativo",
    "internet-browser",
    "http-protocol",
    "prisma-orm",
  ]);
  assert.deepEqual(
    catalog.map(({ nodeLabel, parentLabel }) => [nodeLabel, parentLabel]),
    [
      ["Dentro il PC", null],
      ["Sistema operativo", null],
      ["Internet & Browser", null],
      ["HTTP & Protocolli Web", "Internet & Browser"],
      ["Prisma ORM", "Librerie ORM & ODM (Prisma, Mongoose)"],
    ],
  );
  assert.ok(catalog.every(({ title, description }) => title && description));
});

test("HTTP & Protocolli Web ha un appunto sul ciclo richiesta-risposta", async () => {
  assert.equal(hasNotebook("http-protocol"), true);
  assert.equal(await loadNotebookConfig("http-protocol"), config);
  assert.equal(config.slug, "http-protocol");
  assert.deepEqual(config.steps.map((step) => step.id), [
    "interaction",
    "prepare",
    "http-request",
    "routing",
    "business-logic",
    "database-query",
    "database-result",
    "http-response",
    "render-ui",
  ]);
  const phases = new Set(config.phases.map((phase) => phase.id));
  assert.equal(phases.size, config.phases.length);
  for (const step of config.steps) {
    assert.ok(phases.has(step.phase), step.id);
    assert.equal(step.illustration, "web-request-cycle");
    assert.ok(step.title && step.description && step.panels.length > 0, step.id);
    assert.ok(step.panels.every((panel) => ["text", "code", "table"].includes(panel.kind)), step.id);
  }
});
