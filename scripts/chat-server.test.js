import { strict as assert } from "node:assert";
import { once } from "node:events";
import { request as httpRequest } from "node:http";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createChatServer, validateChatBody, verifyAdmin } from "./chat-server-core.js";
import { createMemorySessionFs } from "./chat-session-fs.js";
import { createQuotaReservation } from "./chat-quota.js";
import { answerWithCopilot } from "./chat-copilot.js";

test("validazione rifiuta output malformati e input fuori limite", () => {
  const valid = { message: "Come funziona React?", history: [], sources: [] };
  assert.equal(validateChatBody(valid), valid);
  assert.throws(() => validateChatBody({ ...valid, history: [{ role: "system", content: "x" }] }));
  assert.throws(() => validateChatBody({ ...valid, sources: [{ name: "x", content: "x".repeat(3501) }] }));
  assert.throws(() => validateChatBody({ ...valid, message: "x".repeat(2001) }));
});

test("autorizzazione verifica token e ruolo tramite Supabase", async () => {
  const originalFetch = globalThis.fetch;
  try {
    let role = "admin";
    globalThis.fetch = async (input) => {
      const path = new URL(String(input)).pathname;
      if (path === "/auth/v1/user") return Response.json({ id: "123" });
      if (path === "/rest/v1/profiles") return Response.json({ role });
      throw new Error(`Unexpected request: ${path}`);
    };
    assert.equal(await verifyAdmin("test-token", "https://example.supabase.co", "anon-key"), true);
    role = "editor";
    assert.equal(await verifyAdmin("test-token", "https://example.supabase.co", "anon-key"), false);
    globalThis.fetch = async () => Response.json({ message: "Invalid JWT" }, { status: 401 });
    assert.equal(await verifyAdmin("invalid", "https://example.supabase.co", "anon-key"), false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("server limita origine, host, autorizzazione, input, frequenza ed errori", async () => {
  let calls = 0;
  const server = createChatServer({
    origins: ["https://example.test"],
    authorize: async (token) => token === "admin",
    reserve: async () => 9,
    answer: async () => { calls += 1; return "Risposta simulata"; },
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const url = `http://127.0.0.1:${server.address().port}/chat`;
  const request = (options = {}) => fetch(url, {
    method: "POST",
    headers: { origin: "https://example.test", authorization: "Bearer admin", "content-type": "application/json", ...options.headers },
    body: options.body ?? JSON.stringify({ message: "React", history: [], sources: [] }),
  });
  try {
    assert.equal((await request({ headers: { origin: "https://attacker.test" } })).status, 403);
    const invalidHost = await new Promise((resolve, reject) => {
      const req = httpRequest(url, { method: "POST", headers: { host: `localhost:${server.address().port}`, origin: "https://example.test" } }, (res) => {
        res.resume();
        resolve(res.statusCode);
      });
      req.on("error", reject);
      req.end();
    });
    assert.equal(invalidHost, 403);
    assert.equal((await request({ headers: { authorization: "Bearer editor" } })).status, 403);
    assert.equal((await request({ body: "{" })).status, 400);
    assert.equal((await request({ body: "x".repeat(27000) })).status, 413);
    const response = await request();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { content: "Risposta simulata", remaining: 9 });
    assert.equal((await request()).status, 429);
    assert.equal(calls, 1);
    const preflight = await fetch(url, { method: "OPTIONS", headers: { origin: "https://example.test" } });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get("access-control-allow-private-network"), "true");
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test("filesystem delle sessioni è separato e solo in memoria", async () => {
  const a = createMemorySessionFs();
  const b = createMemorySessionFs();
  await a.writeFile("/sessions/a/messages", "contenuto privato");
  assert.equal(await a.readFile("/sessions/a/messages"), "contenuto privato");
  assert.equal(await b.exists("/sessions/a/messages"), false);
  await a.rm("/sessions/a", true, false);
  assert.equal(await a.exists("/sessions/a/messages"), false);
});

test("il limite giornaliero persiste fra riavvii e fallisce se il file è corrotto", async () => {
  const dir = await mkdtemp(join(tmpdir(), "devskillmap-quota-test-"));
  const file = join(dir, "quota.json");
  let date = new Date("2026-11-08T10:00:00Z");
  const reserve = createQuotaReservation(file, 2, () => date);
  try {
    assert.equal(await reserve(), 1);
    assert.equal(await createQuotaReservation(file, 2, () => date)(), 0);
    await assert.rejects(reserve(), { code: "CHAT_LIMIT" });
    date = new Date("2026-11-09T00:00:00Z");
    assert.equal(await reserve(), 1);
    await writeFile(file, "{");
    await assert.rejects(reserve(), /contatore locale/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("SDK senza tool né permessi conserva la sessione temporanea e pulisce anche dopo errori", async () => {
  let config;
  let disconnected = 0;
  const client = {
    async createSession(options) {
      config = options;
      return {
        async sendAndWait({ prompt }) {
          assert.equal(JSON.parse(prompt).domanda, "React?");
          throw new Error("errore simulato");
        },
        async abort() {},
        async disconnect() { disconnected += 1; },
      };
    },
  };
  await assert.rejects(answerWithCopilot(client, { message: "React?", history: [], sources: [] }, new AbortController().signal), /errore simulato/);
  assert.deepEqual(config.availableTools, []);
  assert.deepEqual(config.excludedTools, ["builtin:*", "mcp:*", "custom:*"]);
  assert.deepEqual(config.onPermissionRequest(), { kind: "reject" });
  assert.equal(config.infiniteSessions.enabled, false);
  assert.equal(typeof config.createSessionFsProvider, "function");
  assert.equal(disconnected, 1);
});

test("annullamento interrompe il turno e rilascia la sessione", async () => {
  let aborts = 0;
  let disconnected = 0;
  let started;
  const waitStarted = new Promise((resolve) => { started = resolve; });
  let finish;
  const wait = new Promise((resolve) => { finish = resolve; });
  const client = { createSession: async () => ({
    async sendAndWait() { started(); await wait; return undefined; },
    async abort() { aborts += 1; finish(); },
    async disconnect() { disconnected += 1; },
  }) };
  const controller = new AbortController();
  const result = answerWithCopilot(client, { message: "x", history: [], sources: [] }, controller.signal);
  await waitStarted;
  controller.abort();
  await result;
  assert.equal(aborts, 1);
  assert.equal(disconnected, 1);
});
