import { strict as assert } from "node:assert";
import { after, test } from "node:test";
import { createServer } from "vite";

const vite = await createServer({ server: { middlewareMode: true, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
after(() => vite.close());
const { prepareChatRequest } = await vite.ssrLoadModule("/src/services/chatRequest.js");

test("modalità generica non consulta la mappa né invia conversazioni di altre modalità", async () => {
  const body = await prepareChatRequest({
    message: "Come funziona React?",
    messages: [
      { role: "user", content: "Contenuto precedente della mappa", conversationSegment: 0 },
      { role: "assistant", content: "Risposta relativa alla mappa", conversationSegment: 0 },
      { role: "user", content: "Domanda generica", conversationSegment: 1 },
      { role: "assistant", content: "Risposta generica", conversationSegment: 1 },
    ],
    conversationSegment: 1,
    useMap: false,
    selectedNodeId: "nodo",
    collectContext: () => { throw new Error("La mappa non deve essere consultata"); },
  });
  assert.deepEqual(body, {
    message: "Come funziona React?",
    history: [
      { role: "user", content: "Domanda generica" },
      { role: "assistant", content: "Risposta generica" },
    ],
    sources: [],
  });
});

test("modalità mappa consulta il contesto selezionato e inoltra errori", async () => {
  const sources = [{ name: "Nodo: React", content: "Contesto" }];
  const options = {
    message: "React?",
    messages: [],
    conversationSegment: 0,
    useMap: true,
    selectedNodeId: "nodo",
  };
  const body = await prepareChatRequest({
    ...options,
    collectContext: async (message, nodeId) => {
      assert.equal(message, "React?");
      assert.equal(nodeId, "nodo");
      return sources;
    },
  });
  assert.deepEqual(body.sources, sources);
  await assert.rejects(prepareChatRequest({
    ...options,
    collectContext: async () => { throw new Error("Errore Supabase"); },
  }), /Errore Supabase/);
});

test("cronologia limitata ai quattro messaggi recenti del segmento", async () => {
  const messages = Array.from({ length: 6 }, (_, index) => ({
    role: "user", content: String(index).repeat(3001), conversationSegment: 3,
  }));
  const body = await prepareChatRequest({
    message: "Domanda",
    messages,
    conversationSegment: 3,
    useMap: false,
  });
  assert.equal(body.history.length, 4);
  assert.equal(body.history[0].content, "2".repeat(3000));
});
