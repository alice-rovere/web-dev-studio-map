import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import test from "node:test";
import pc from "./configs/dentroIlPcConfig.js";
import os from "./configs/sistemaOperativoConfig.js";
import { getNotebookCatalog, loadNotebookConfig } from "./registry.js";
import { validateNotebook } from "./validateNotebook.js";

test("i percorsi PC e sistema operativo sono distinti e validi", async () => {
  for (const [config, illustration] of [[pc, "computer-system"], [os, "operating-system"]]) {
    const item = getNotebookCatalog().find((entry) => entry.slug === config.slug);
    assert.ok(item);
    assert.equal(await loadNotebookConfig(config.slug), config);
    assert.equal(validateNotebook({ slug: config.slug, description: item.description, config }), null);
    assert.ok(config.steps.every((step) => step.illustration === illustration));
  }
  assert.deepEqual(pc.steps.map((step) => step.id), ["scheda-madre", "cpu", "ram", "archiviazione", "gpu", "batteria", "periferiche"]);
  assert.deepEqual(os.steps.map((step) => step.id), ["applicazioni", "sistema-operativo", "kernel", "driver", "collaborazione"]);
});

test("la migrazione confronta il PC originale prima di sostituirlo e crea il secondo percorso", async () => {
  const original = await readFile(new URL("../../supabase/migrations/0012_seed_dentro_il_pc.sql", import.meta.url), "utf8");
  const sql = await readFile(new URL("../../supabase/migrations/0013_separa_percorsi_pc.sql", import.meta.url), "utf8");
  const originalPayload = original.match(/convert_from\(decode\('([A-Za-z0-9+/=]+)'/)[1];
  const payloads = [...sql.matchAll(/convert_from\(decode\('([A-Za-z0-9+/=]+)'/g)]
    .map((match) => JSON.parse(Buffer.from(match[1], "base64").toString("utf8")));

  assert.deepEqual(payloads[0], JSON.parse(Buffer.from(originalPayload, "base64").toString("utf8")));
  assert.deepEqual(payloads[1], pc);
  assert.deepEqual(payloads[2], os);
  assert.match(sql, /if existing_config = old_pc then/i);
  assert.match(sql, /elsif existing_config <> new_pc then\s+raise exception/i);
  assert.match(sql, /if existing_config <> new_os then\s+raise exception/i);
  assert.match(sql, /for update/i);
  assert.match(sql, /pending_node_slug/i);
  for (const slug of [pc.slug, os.slug]) {
    const item = getNotebookCatalog().find((entry) => entry.slug === slug);
    assert.ok(sql.includes(item.description.replaceAll("'", "''")));
  }
});
