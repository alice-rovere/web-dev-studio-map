import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import test from "node:test";
import config from "./configs/linguaggiProgrammazioneConfig.js";
import { getNotebookCatalog, loadNotebookConfig } from "./registry.js";
import { validateNotebook } from "./validateNotebook.js";

test("il percorso sui linguaggi è valido e presenta tutte e tre le strategie", () => {
  assert.equal(
    validateNotebook({
      slug: config.slug,
      description: "Percorso dal sorgente alla CPU.",
      config,
    }),
    null,
  );
  assert.deepEqual(
    config.steps.map((step) => step.id),
    [
      "codice-sorgente",
      "compilazione-nativa",
      "bytecode-runtime",
      "runtime-interprete-jit",
      "istruzioni-macchina",
      "confronto-strade",
    ],
  );
  assert.ok(config.steps.every((step) => step.illustration === "language-execution"));
});

test("registry e migrazione conservano la stessa configurazione", async () => {
  const catalogEntry = getNotebookCatalog().find(({ slug }) => slug === config.slug);
  assert.ok(catalogEntry);
  assert.deepEqual(await loadNotebookConfig(config.slug), config);

  const sql = await readFile(
    new URL("../../supabase/migrations/0014_seed_linguaggi_programmazione.sql", import.meta.url),
    "utf8",
  );
  const payload = sql.match(/convert_from\(decode\('([A-Za-z0-9+/=]+)', 'base64'\), 'UTF8'\)::jsonb/);
  assert.ok(payload);
  assert.deepEqual(
    JSON.parse(Buffer.from(payload[1], "base64").toString("utf8")),
    config,
  );
  assert.ok(sql.includes(catalogEntry.description));
  assert.ok(sql.includes("on conflict (slug) do nothing"));
});

test("il contenuto distingue runtime, JIT, bytecode e linguaggio macchina", () => {
  const content = JSON.stringify(config);
  assert.match(content, /compila il sorgente in bytecode/i);
  assert.match(content, /compilazione JIT/i);
  assert.match(content, /tipaggio dinamico/i);
  assert.match(content, /architettura del processore/i);
});
