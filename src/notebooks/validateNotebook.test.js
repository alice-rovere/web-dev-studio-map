import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getNotebookCatalog, loadNotebookConfig } from "./registry.js";
import { validateNotebook } from "./validateNotebook.js";

test("la migrazione conserva tutte le configurazioni e le descrizioni originali", async () => {
  const sql = await readFile(new URL("../../supabase/migrations/0010_seed_guided_notebooks.sql", import.meta.url), "utf8");
  const payloads = [...sql.matchAll(/convert_from\(decode\('([A-Za-z0-9+/=]+)', 'base64'\), 'UTF8'\)::jsonb/g)]
    .map((match) => JSON.parse(Buffer.from(match[1], "base64").toString("utf8")));
  const catalog = getNotebookCatalog();
  assert.equal(payloads.length, catalog.length);
  assert.ok(!sql.includes("INSERT INTO orders"));
  for (const [index, item] of catalog.entries()) {
    const config = await loadNotebookConfig(item.slug);
    assert.deepEqual(payloads[index], config);
    assert.ok(sql.includes(item.description.replaceAll("'", "''")));
    assert.equal(validateNotebook({ slug: item.slug, description: item.description, config }), null);
  }
});

test("la validazione rifiuta slug, fasi, icone, pannelli e riferimenti invalidi", async () => {
  const original = await loadNotebookConfig("prisma-orm");
  const make = () => ({ slug: original.slug, description: "Descrizione", config: structuredClone(original) });
  let data = make(); data.slug = "Slug non valido";
  assert.match(validateNotebook(data), /slug/i);
  data = make(); data.config.phases[0].icon = "sconosciuta";
  assert.match(validateNotebook(data), /icona/i);
  data = make(); data.config.steps[0].phase = "assente";
  assert.match(validateNotebook(data), /fase/i);
  data = make(); data.config.steps[0].panels[0].highlightLines = [999];
  assert.match(validateNotebook(data), /righe evidenziate/i);
  data = make(); data.config.steps[3].panels[0].rows[0].pop();
  assert.match(validateNotebook(data), /colonne e righe/i);
  data = make(); data.config.steps[0].illustration = "arbitraria";
  assert.match(validateNotebook(data), /illustrazione/i);
});
