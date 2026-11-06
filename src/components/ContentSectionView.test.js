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
const { SectionCard } = await vite.ssrLoadModule("/src/components/ContentSectionView.jsx");
const { RichTextView } = await vite.ssrLoadModule("/src/components/blocks/RichTextBlock.jsx");
const { NativeGlossaryContext } = await vite.ssrLoadModule("/src/context/GlossaryContext.jsx");
const { getSectionBlocks, payloadWithBlocks } = await import("./sectionBlocks.js");

test("legacy unsupported blocks are reported and preserved when other blocks change", () => {
  const legacy = { id: "diagram", type: "mermaid", payload: { code: "flowchart LR; A-->B" } };
  const section = {
    title: "Test",
    type: "text",
    payload: { blocks: [legacy, { id: "text", type: "text", payload: { text: "prima" } }] },
  };
  const html = renderToStaticMarkup(createElement(
    NativeGlossaryContext.Provider,
    { value: { glossary: [] } },
    createElement(SectionCard, { section }),
  ));
  assert.match(html, /Formato del contenuto non supportato/);
  assert.doesNotMatch(html, /flowchart LR/);
  const blocks = getSectionBlocks(section).map((block) =>
    block.id === "text" ? { ...block, payload: { text: "dopo" } } : block,
  );
  assert.deepEqual(payloadWithBlocks(section, blocks).blocks[0], legacy);
});

test("bold rich text uses a visible font weight", () => {
  const html = renderToStaticMarkup(createElement(
    NativeGlossaryContext.Provider,
    { value: { glossary: [] } },
    createElement(RichTextView, {
      document: {
        type: "doc",
        content: [{
          type: "paragraph",
          content: [{ type: "text", text: "grassetto", marks: [{ type: "bold" }] }],
        }],
      },
    }),
  ));
  assert.match(html, /<strong class="font-semibold">grassetto<\/strong>/);
});
