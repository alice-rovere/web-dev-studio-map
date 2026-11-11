import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFile } from "node:fs/promises";
import test from "node:test";
import config from "./configs/webFoundationsConfig.js";
import { getNotebookCatalog, hasNotebook, loadNotebookConfig } from "./registry.js";
import { validateNotebook } from "./validateNotebook.js";

test("Professioni e infrastruttura del Web è registrato e completo", async () => {
  const catalogEntry = getNotebookCatalog().find(
    ({ slug }) => slug === "web-foundations",
  );

  assert.ok(catalogEntry);
  assert.equal(hasNotebook("web-foundations"), true);
  assert.equal(await loadNotebookConfig("web-foundations"), config);
  assert.equal(
    validateNotebook({
      slug: config.slug,
      description: catalogEntry.description,
      config,
    }),
    null,
  );

  const migration = await readFile(
    new URL(
      "../../supabase/migrations/0017_seed_web_foundations.sql",
      import.meta.url,
    ),
    "utf8",
  );
  const payload = migration.match(
    /convert_from\(decode\('([A-Za-z0-9+/=]+)', 'base64'\), 'UTF8'\)::jsonb/,
  );
  assert.ok(payload);
  assert.deepEqual(
    JSON.parse(Buffer.from(payload[1], "base64").toString("utf8")),
    config,
  );
  assert.ok(migration.includes(catalogEntry.description));
  assert.ok(migration.includes("Professioni e infrastruttura Web"));

  const stepIds = new Set(config.steps.map(({ id }) => id));
  for (const id of [
    "ruoli-web",
    "server-software-hardware",
    "server-farm-datacenter",
    "bilanciamento-affidabilita",
    "cloud-modelli",
    "viaggio-pacchetti",
  ]) {
    assert.ok(stepIds.has(id), `manca il passaggio ${id}`);
  }

  const rolesPanel = config.steps
    .find(({ id }) => id === "ruoli-web")
    .panels.find(({ kind }) => kind === "table");
  assert.deepEqual(rolesPanel.rows.map(([role]) => role), [
    "Frontend developer",
    "Backend developer",
    "Full-stack developer",
    "Web designer / UI designer",
    "UX designer / researcher",
    "3D / WebGL developer",
    "QA / software tester",
    "DevOps / cloud engineer",
    "Sistemista / system administrator",
  ]);
});
