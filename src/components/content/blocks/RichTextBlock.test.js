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
const { RichTextView } = await vite.ssrLoadModule("/src/components/content/blocks/RichTextBlock.jsx");
const { NativeGlossaryContext } = await vite.ssrLoadModule("/src/context/GlossaryContext.jsx");

test("rendering preserves formatting and recognizes glossary terms across styles", () => {
  const document = {
    type: "doc",
    content: [{
      type: "paragraph",
      content: [
        { type: "text", text: "Re", marks: [{ type: "bold" }] },
        { type: "text", text: "act", marks: [{ type: "italic" }, { type: "underline" }, { type: "highlight", attrs: { color: "#fef08a" } }, { type: "textStyle", attrs: { fontSize: "18px" } }] },
      ],
    }],
  };
  const html = renderToStaticMarkup(createElement(
    NativeGlossaryContext.Provider,
    { value: { glossary: [{ id: "1", term: "React", definition: "Libreria" }] } },
    createElement(RichTextView, { document }),
  ));
  assert.match(html, /cursor-help/);
  assert.match(html, /<strong>Re<\/strong>/);
  assert.match(html, /<em>act<\/em>/);
  assert.match(html, /<u>/);
  assert.match(html, /background-color:#fef08a/);
  assert.match(html, /font-size:18px/);
});
