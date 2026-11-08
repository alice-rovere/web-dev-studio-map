import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("lo schema mostra le tre strade e mette in evidenza quella selezionata", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { default: Diagram } = await server.ssrLoadModule("/src/components/notebook/LanguageExecutionDiagram.jsx");
    const render = (stepId) => renderToStaticMarkup(createElement(Diagram, { stepId }));
    const html = render("bytecode-runtime");

    assert.match(html, /Codice sorgente scritto da te/);
    assert.match(html, /Strada A · Compilazione nativa/);
    assert.match(html, /Strada B · Bytecode \/ IL/);
    assert.match(html, /Strada C · Interprete \/ JIT/);
    assert.match(html, /Bytecode o IL/);
    assert.match(html, /Runtime · JVM \/ .NET/);
    assert.match(html, /CPU · esegue istruzioni macchina/);
    const sections = [...html.matchAll(/<section\b[\s\S]*?<\/section>/g)].map(([section]) => section);
    assert.equal(sections.length, 3);
    assert.doesNotMatch(sections[0], /In evidenza/);
    assert.match(sections[1], /In evidenza/);
    assert.doesNotMatch(sections[2], /In evidenza/);
    assert.match(render("runtime-interprete-jit"), /Strada C · Interprete \/ JIT[\s\S]*?In evidenza/);
  } finally {
    await server.close();
  }
});
