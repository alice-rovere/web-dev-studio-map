import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import test from "node:test";
import professions from "./configs/webProfessionsConfig.js";
import infrastructure from "./configs/webInfrastructureConfig.js";
import { getNotebookCatalog, hasNotebook, loadNotebookConfig } from "./registry.js";
import { validateNotebook } from "./validateNotebook.js";

const configs = [professions, infrastructure];

test("professioni e infrastruttura Web sono percorsi separati e validi", async () => {
  const catalog = getNotebookCatalog();

  assert.notEqual(professions.slug, infrastructure.slug);
  assert.deepEqual(
    catalog
      .filter(({ slug }) => configs.some((config) => config.slug === slug))
      .map(({ slug, nodeLabel, parentLabel }) => ({
        slug,
        nodeLabel,
        parentLabel,
      })),
    [
      {
        slug: "web-professions",
        nodeLabel: "Professioni nel Web",
        parentLabel: null,
      },
      {
        slug: "web-infrastructure",
        nodeLabel: "Server e infrastruttura Web",
        parentLabel: null,
      },
    ],
  );

  for (const config of configs) {
    const entry = catalog.find(({ slug }) => slug === config.slug);
    assert.ok(entry);
    assert.equal(hasNotebook(config.slug), true);
    assert.equal(await loadNotebookConfig(config.slug), config);
    assert.equal(
      validateNotebook({
        slug: config.slug,
        description: entry.description,
        config,
      }),
      null,
    );
    assert.ok(config.steps.length >= 6);
    assert.equal(config.displayMode, "focus");
  }

  assert.ok(professions.steps.every((step) => !/server farm|data center/i.test(step.title)));
  assert.ok(infrastructure.steps.every((step) => !/developer|designer|sistemista/i.test(step.title)));
});

test("la migrazione registra entrambi i percorsi separati", async () => {
  const migration = await readFile(
    new URL(
      "../../supabase/migrations/0017_seed_web_foundations.sql",
      import.meta.url,
    ),
    "utf8",
  );
  const payloads = [
    ...migration.matchAll(
      /convert_from\(decode\('([A-Za-z0-9+/=]+)', 'base64'\), 'UTF8'\)::jsonb/g,
    ),
  ];

  assert.equal(payloads.length, 2);
  assert.deepEqual(
    payloads.map((match) =>
      JSON.parse(Buffer.from(match[1], "base64").toString("utf8")),
    ),
    configs,
  );
  assert.ok(migration.includes("'web-professions'"));
  assert.ok(migration.includes("'web-infrastructure'"));
});
