import assert from "node:assert/strict";
import test from "node:test";
import { missingAnnotations, validateWhiteboard } from "./interactiveWhiteboard.js";

test("lavagne esistenti senza spiegazioni restano valide", () => {
  assert.equal(validateWhiteboard({ elements: [{ id: "one" }], files: {} }), null);
  assert.match(validateWhiteboard({ elements: [], files: {} }, { requireContent: true }), /Disegna/);
});

test("spiegazioni richiedono un elemento esistente, titolo, testo e ID univoci", () => {
  const payload = { elements: [{ id: "one" }], files: {}, annotations: [{ elementId: "one", title: "HTML", description: "Testo" }] };
  assert.equal(validateWhiteboard(payload), null);
  assert.match(validateWhiteboard({ ...payload, annotations: [...payload.annotations, payload.annotations[0]] }), /spiegazione/i);
  assert.match(validateWhiteboard({ ...payload, annotations: [{ ...payload.annotations[0], elementId: "missing" }] }), /spiegazione/i);
  assert.match(validateWhiteboard({ ...payload, annotations: [{ ...payload.annotations[0], title: "" }] }), /spiegazione/i);
  assert.deepEqual(missingAnnotations([], payload.annotations), payload.annotations);
  assert.deepEqual(missingAnnotations(payload.elements, payload.annotations), []);
});
