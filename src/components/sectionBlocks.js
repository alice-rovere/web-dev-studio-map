export function getSectionBlocks(section) {
  const payload = section.payload ?? {};
  if (Array.isArray(payload.blocks)) return payload.blocks;
  return [{ type: section.type, payload }];
}

export function payloadWithBlocks(section, blocks, createId = () => crypto.randomUUID()) {
  return {
    ...section.payload,
    blocks: blocks.map((block) => ({ ...block, id: block.id ?? createId() })),
  };
}

function withoutId(block) {
  const content = { ...block };
  delete content.id;
  return JSON.stringify(content);
}

export function rebaseDraft(draft, latest) {
  if (!latest || latest.id !== draft.section.id) return null;
  if (draft.mode === "section") {
    if (latest.title !== draft.section.title ||
        (latest.payload?.subtitle ?? "") !== (draft.section.payload?.subtitle ?? "")) return null;
    return { ...draft, section: latest };
  }
  if (draft.blockIndex === null) return { ...draft, section: latest };
  const original = getSectionBlocks(draft.section)[draft.blockIndex];
  const blocks = getSectionBlocks(latest);
  const matches = blocks.flatMap((block, index) => {
    const sameIdentity = original.id ? block.id === original.id : withoutId(block) === withoutId(original);
    return sameIdentity && withoutId(block) === withoutId(original) ? [index] : [];
  });
  if (matches.length !== 1) return null;
  const blockIndex = matches[0];
  return {
    ...draft,
    section: latest,
    blockIndex,
    blocks: [{ ...draft.blocks[0], id: blocks[blockIndex].id ?? draft.blocks[0].id }],
  };
}
