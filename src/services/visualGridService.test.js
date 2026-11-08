import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { after, test } from "node:test";
import { createServer } from "vite";

process.env.VITE_SUPABASE_URL = "http://127.0.0.1:54321";
process.env.VITE_SUPABASE_ANON_KEY = "test-anon-key";
const originalFetch = globalThis.fetch;
const requests = [];
let response = [];
globalThis.fetch = async (input, init) => {
  const url = new URL(String(input));
  assert.equal(url.origin, "http://127.0.0.1:54321");
  requests.push({ url, init });
  return new Response(JSON.stringify(response), { status: 200, headers: { "content-type": "application/json" } });
};
const cacheDir = mkdtempSync(join(tmpdir(), "visual-grid-test-"));
const vite = await createServer({ cacheDir, server: { middlewareMode: true, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
after(async () => { globalThis.fetch = originalFetch; await vite.close(); rmSync(cacheDir, { recursive: true, force: true }); });
const { updateVisualGrid, fetchVisualGridsForNode } = await vite.ssrLoadModule("/src/services/visualGridService.js");

test("il salvataggio verifica versione e conflitti senza perdere la bozza", async () => {
  const draft = { slug: "pc", description: "Test", nodeId: null, pendingNodeSlug: "pc", config: { title: "Test" }, updatedAt: "old" };
  response = [{ slug: "pc", updated_at: "new" }];
  assert.equal((await updateVisualGrid(draft)).updated_at, "new");
  assert.equal(requests.at(-1).url.searchParams.get("updated_at"), "eq.old");
  assert.equal(requests.at(-1).url.searchParams.get("slug"), "eq.pc");
  assert.equal(JSON.parse(requests.at(-1).init.body).pending_node_slug, "pc");
  response = [];
  await assert.rejects(updateVisualGrid(draft), /modificata o eliminata/);
  assert.equal(draft.config.title, "Test");
  await assert.rejects(updateVisualGrid({ ...draft, updatedAt: null }), /Versione/);
});

test("il nodo può avere più griglie associate", async () => {
  response = [{ slug: "pc" }, { slug: "web" }];
  assert.equal((await fetchVisualGridsForNode("node")).length, 2);
  assert.equal(requests.at(-1).url.searchParams.get("node_id"), "eq.node");
});
