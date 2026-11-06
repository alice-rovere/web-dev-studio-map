import { strict as assert } from "node:assert";
import { test } from "node:test";
import { getSectionBlocks, payloadWithBlocks, rebaseDraft } from "./sectionBlocks.js";

test("legacy section becomes one block without losing payload", () => {
  const section = { type: "table", payload: { subtitle: "S", columns: ["A"], rows: [["B"]], extra: 4 } };
  const blocks = getSectionBlocks(section);
  assert.deepEqual(blocks, [{ type: "table", payload: section.payload }]);
  assert.deepEqual(payloadWithBlocks(section, blocks, () => "new-id"), {
    ...section.payload,
    blocks: [{ ...blocks[0], id: "new-id" }],
  });
});

test("a draft rebases only when its target remains unchanged", () => {
  const original = { type: "text", payload: { text: "originale" } };
  const section = { id: "s", payload: { blocks: [original] }, updated_at: "old" };
  const draft = { mode: "block", section, blockIndex: 0, blocks: [{ ...original, payload: { text: "bozza" } }] };
  const latest = { ...section, updated_at: "new", payload: { blocks: [{ ...original, id: "b" }, { id: "other", type: "text", payload: { text: "altro" } }] } };
  const rebased = rebaseDraft(draft, latest);
  assert.equal(rebased.section.updated_at, "new");
  assert.equal(rebased.blocks[0].payload.text, "bozza");
  assert.equal(rebased.blocks[0].id, "b");
  assert.equal(rebaseDraft(draft, { ...latest, payload: { blocks: [{ ...original, payload: { text: "modificato" } }] } }), null);
  assert.equal(rebaseDraft(draft, null), null);
  assert.equal(rebaseDraft(draft, { ...latest, payload: { blocks: [original, original] } }), null);
});

test("updating one block preserves the rest and unknown fields", () => {
  const other = { id: "other", type: "future", payload: { arbitrary: { data: [1, 2] } }, extra: true };
  const section = { payload: { subtitle: "S", custom: 3, blocks: [{ id: "first", type: "text", payload: { text: "prima" } }, other] } };
  const blocks = getSectionBlocks(section).map((block) =>
    block.id === "first" ? { ...block, payload: { text: "dopo" } } : block,
  );
  const result = payloadWithBlocks(section, blocks, () => { throw new Error("ID non richiesto"); });
  assert.equal(result.custom, 3);
  assert.deepEqual(result.blocks[1], other);
  assert.equal(section.payload.blocks[0].payload.text, "prima");
  assert.equal(result.blocks[0].payload.text, "dopo");
});
