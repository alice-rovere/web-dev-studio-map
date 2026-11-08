import { strict as assert } from "node:assert";
import { test } from "node:test";
import { createServer } from "vite";

const vite = await createServer({ server: { middlewareMode: true, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
const { selectRelevantItems } = await vite.ssrLoadModule("/src/services/chatContext.js");

test("seleziona solo nodi e percorsi pertinenti o il nodo selezionato", async () => {
  try {
    const graph = { nodes: [
      { id: "r", label: "React", slug: "react", description: "Componenti" },
      { id: "s", label: "SQL", slug: "sql", description: "Database" },
      { id: "h", label: "HTTP", slug: "http", description: "Protocollo" },
    ] };
    const paths = [{ slug: "react-base", description: "Imparare React", config: { title: "React" }, node_id: "r" }];
    const result = selectRelevantItems("Come funziona React?", "s", graph, paths);
    assert.deepEqual(result.nodes.map((node) => node.id), ["s", "r"]);
    assert.deepEqual(result.paths.map((path) => path.slug), ["react-base"]);
    assert.equal(selectRelevantItems("astronomia", null, graph, paths).nodes.length, 0);
  } finally {
    await vite.close();
  }
});
