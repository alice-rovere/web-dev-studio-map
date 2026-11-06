import { strict as assert } from "node:assert";
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
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};

const vite = await createServer({ server: { middlewareMode: true, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
after(async () => {
  globalThis.fetch = originalFetch;
  await vite.close();
});
const { updateSection, deleteSection } = await vite.ssrLoadModule("/src/services/mapService.js");

test("conditional update uses the original version and reports conflicts", async () => {
  const version = "2026-01-01T12:00:00.123456+00:00";
  response = [{ id: "section", updated_at: "next" }];
  assert.equal((await updateSection("section", { title: "Nuovo" }, version)).updated_at, "next");
  assert.equal(requests.at(-1).url.searchParams.get("updated_at"), `eq.${version}`);
  assert.equal(requests.at(-1).url.searchParams.get("id"), "eq.section");
  response = [];
  await assert.rejects(updateSection("section", { title: "Nuovo" }, version), /modificata o eliminata/);
});

test("conditional delete does not silently succeed on a stale version", async () => {
  response = [];
  await assert.rejects(deleteSection("section", "old"), /modificata o eliminata/);
  assert.equal(requests.at(-1).url.searchParams.get("updated_at"), "eq.old");
  assert.equal(requests.at(-1).init.method, "DELETE");
});
