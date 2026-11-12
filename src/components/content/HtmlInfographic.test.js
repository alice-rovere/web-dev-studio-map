import { strict as assert } from "node:assert";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

const cacheDir = mkdtempSync(join(tmpdir(), "web-dev-studio-test-"));
const vite = await createServer({ cacheDir, server: { middlewareMode: true, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
after(async () => {
  await vite.close();
  rmSync(cacheDir, { recursive: true, force: true });
});
const { InfographicSections } = await vite.ssrLoadModule("/src/components/content/HtmlInfographic.jsx");
const { NativeGlossaryContext } = await vite.ssrLoadModule("/src/context/GlossaryContext.jsx");

function render(element) {
  return renderToStaticMarkup(createElement(
    NativeGlossaryContext.Provider,
    { value: { glossary: [] } },
    element,
  ));
}

test("infographic renders every section in order using the existing block renderer", () => {
  const sections = [
    { id: "first", title: "Prima", type: "text", payload: { blocks: [
      { id: "timeline", type: "timeline", payload: { entries: [{ date: "1993", title: "Inizio", description: "Descrizione timeline" }] } },
      { id: "whiteboard", type: "whiteboard", payload: { elements: [], files: {} } },
      { id: "text", type: "text", payload: { text: "Testo originale" } },
    ] } },
    { id: "second", title: "Seconda", type: "table", payload: { columns: ["Colonna"], rows: [["Cella"]] } },
    { id: "third", title: "Terza", type: "list", payload: { items: ["Voce legacy"] } },
    { id: "fourth", title: "Quarta", type: "mermaid", payload: { code: "legacy" } },
  ];
  const html = render(createElement(InfographicSections, { sections }));
  for (const text of ["Prima", "Descrizione timeline", "Lavagna vuota.", "Testo originale", "Seconda", "Cella", "Terza", "Voce legacy", "Quarta", "Formato del contenuto non supportato"]) {
    assert.ok(html.includes(text), `Manca: ${text}`);
  }
  assert.ok(html.indexOf("Prima") < html.indexOf("Seconda"));
  assert.ok(html.indexOf("Seconda") < html.indexOf("Terza"));
  const updated = [{ ...sections[0], payload: { blocks: [{ type: "text", payload: { text: "Testo aggiornato" } }] } }];
  const updatedHtml = render(createElement(InfographicSections, { sections: updated }));
  assert.match(updatedHtml, /Testo aggiornato/);
  assert.doesNotMatch(updatedHtml, /Testo originale/);
});

test("the visual guide uses actual sections and keeps tag lists and rich text intact", () => {
  const sections = [
    { id: "syntax", title: "Sintassi", type: "text", payload: { subtitle: "Regole", blocks: [
      { type: "text", payload: { richText: { type: "doc", content: [
        { type: "paragraph", content: [{ type: "text", text: "Tag vuoti", marks: [{ type: "bold" }] }] },
        { type: "paragraph" },
        { type: "paragraph", content: [{ type: "text", text: "Attributi" }, { type: "hardBreak" }, { type: "text", text: "Valori" }] },
      ] } } },
    ] } },
    { id: "media", title: "Multimedia", type: "text", payload: { text: "• <img> → src, alt\n• <audio> → controls, autoplay" } },
    { id: "other", title: "Altro", type: "text", payload: { text: "• <p> → un elemento\nUna riga non strutturata" } },
  ];
  const html = render(createElement(InfographicSections, { sections }));
  for (const text of ["3 tappe da esplorare", "Indice delle tappe HTML", "Sintassi", "Regole", "Tag vuoti", "Attributi", "Valori", "&lt;img&gt;", "src, alt", "&lt;audio&gt;", "controls, autoplay", "Una riga non strutturata"]) {
    assert.ok(html.includes(text), `Manca: ${text}`);
  }
  assert.match(html, /<strong class="font-semibold">Tag vuoti<\/strong>/);
  assert.match(html, /href="#html-step-media"/);
  assert.match(html, /id="html-step-media"/);
  assert.match(html, /• &lt;p&gt; → un elemento/);
});

test("the infographic selects layouts from the content structure and uses live data", () => {
  const sections = [
    {
      id: "history",
      title: "HTML nel tempo",
      type: "timeline",
      payload: {
        entries: [
          { date: "1989", title: "Proposta", description: "Nasce il Web." },
          { date: "1990", title: "Primo browser", description: "Arriva HTML." },
        ],
      },
    },
    {
      id: "comparison",
      title: "HTML e JSX a confronto",
      type: "table",
      payload: {
        columns: ["HTML", "JSX"],
        rows: [["class", "className"]],
      },
    },
    {
      id: "process",
      title: "Passaggi per creare una pagina",
      type: "list",
      payload: { items: ["Definisci la struttura", "Aggiungi i contenuti"] },
    },
    {
      id: "concepts",
      title: "Elementi semantici",
      type: "list",
      payload: {
        items: [
          "<header> → introduce la pagina",
          "<main> → contiene il contenuto principale",
          "<footer> → chiude la pagina",
        ],
      },
    },
    {
      id: "request-lifecycle",
      title: "Percorso di una richiesta HTTP",
      type: "text",
      payload: {
        subtitle: "Sequenza richiesta e risposta",
        blocks: [
          {
            type: "list",
            payload: {
              items: [
                "Passo 1. Il browser prepara la richiesta",
                "Passo 2. Il server valida e risponde",
              ],
            },
          },
          {
            type: "text",
            payload: { text: "Il body dipende dal metodo e dal tipo di contenuto." },
          },
        ],
      },
    },
  ];

  const html = render(createElement(InfographicSections, { sections }));
  for (const text of [
    "cronologia",
    "Proposta",
    "Nasce il Web.",
    "confronto",
    "HTML",
    "className",
    "procedura",
    "Definisci la struttura",
    "mappa di concetti",
    "Elementi semantici",
    "introduce la pagina",
    "Percorso di una richiesta HTTP",
    "Il browser prepara la richiesta",
    "Il body dipende dal metodo",
  ]) {
    assert.ok(html.includes(text), `Manca il contenuto/layout: ${text}`);
  }
  assert.doesNotMatch(html, /Ecosistema Web: Bento Grid|HTML Standard|CSS Grid|60fps/);
});
