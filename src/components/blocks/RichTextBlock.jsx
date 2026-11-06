import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { FontSize, TextStyle } from "@tiptap/extension-text-style";
import GlossaryText from "../GlossaryText";

const sizes = ["12px", "14px", "16px", "18px", "24px"];
const highlights = ["#fef08a", "#bbf7d0", "#bfdbfe", "#fbcfe8"];
const extensions = [
  StarterKit.configure({
    blockquote: false,
    bulletList: false,
    code: false,
    codeBlock: false,
    heading: false,
    horizontalRule: false,
    link: false,
    listItem: false,
    orderedList: false,
    strike: false,
  }),
  TextStyle,
  FontSize,
  Highlight.configure({ multicolor: true }),
];

function legacyDocument(text) {
  return {
    type: "doc",
    content: String(text ?? "").split("\n").map((line) => ({
      type: "paragraph",
      content: line ? [{ type: "text", text: line }] : [],
    })),
  };
}

export function RichTextEditor({ payload, update }) {
  const editor = useEditor({
    extensions,
    shouldRerenderOnTransaction: true,
    content: payload.richText ?? legacyDocument(payload.text),
    editorProps: {
      attributes: {
        class: "min-h-28 rounded-b-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-zinc-600 whitespace-pre-wrap",
        "aria-label": "Testo del contenuto",
      },
    },
    onUpdate: ({ editor: current }) =>
      update((previous) => ({ ...previous, richText: current.getJSON() })),
  });

  if (!editor) return null;
  const button = (label, active, action) => (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`rounded px-2 py-1 text-xs ${active ? "bg-cyan-900 text-white" : "text-zinc-300 hover:bg-zinc-800"}`}
      onMouseDown={(event) => event.preventDefault()}
      onClick={action}
      title={label}
      type="button"
    >
      {label}
    </button>
  );
  return (
    <div>
      <div aria-label="Formattazione testo" className="flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-zinc-800 bg-zinc-900 p-2" role="toolbar">
        {button("Grassetto", editor.isActive("bold"), () => editor.chain().focus().toggleBold().run())}
        {button("Corsivo", editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run())}
        {button("Sottolineato", editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run())}
        <label className="text-xs text-zinc-300">
          Dimensione
          <select
            aria-label="Dimensione carattere"
            className="ml-1 rounded bg-zinc-800 p-1"
            onChange={(event) => {
              const chain = editor.chain().focus();
              if (event.target.value) chain.setFontSize(event.target.value).run();
              else chain.unsetFontSize().run();
            }}
            value={editor.getAttributes("textStyle").fontSize ?? ""}
          >
            <option value="">Normale</option>
            {sizes.map((size) => <option key={size} value={size}>{size}</option>)}
          </select>
        </label>
        <label className="text-xs text-zinc-300">
          Evidenziatore
          <select
            aria-label="Colore evidenziatore"
            className="ml-1 rounded bg-zinc-800 p-1"
            onChange={(event) => {
              const chain = editor.chain().focus();
              if (event.target.value) chain.setHighlight({ color: event.target.value }).run();
              else chain.unsetHighlight().run();
            }}
            value={editor.getAttributes("highlight").color ?? ""}
          >
            <option value="">Nessuno</option>
            {highlights.map((color, index) => <option key={color} value={color}>{["Giallo", "Verde", "Azzurro", "Rosa"][index]}</option>)}
          </select>
        </label>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function renderRun(text, marks, key) {
  let result = text;
  for (const mark of marks ?? []) {
    if (mark.type === "bold") result = <strong className="font-semibold">{result}</strong>;
    if (mark.type === "italic") result = <em>{result}</em>;
    if (mark.type === "underline") result = <u>{result}</u>;
    if (mark.type === "highlight" && highlights.includes(mark.attrs?.color)) {
      result = <mark style={{ backgroundColor: mark.attrs.color, color: "#18181b" }}>{result}</mark>;
    }
    if (mark.type === "textStyle" && sizes.includes(mark.attrs?.fontSize)) {
      result = <span style={{ fontSize: mark.attrs.fontSize }}>{result}</span>;
    }
  }
  return <span key={key}>{result}</span>;
}

function paragraphRuns(paragraph) {
  let cursor = 0;
  return (paragraph.content ?? []).flatMap((node) => {
    const text = node.type === "text" ? node.text : node.type === "hardBreak" ? "\n" : "";
    if (typeof text !== "string" || !text) return [];
    const run = { text, marks: node.marks, start: cursor, end: cursor + text.length };
    cursor = run.end;
    return [run];
  });
}

function RichParagraph({ paragraph }) {
  const runs = paragraphRuns(paragraph);
  const text = runs.map((run) => run.text).join("");
  return (
    <p className="min-h-4 whitespace-pre-wrap">
      <GlossaryText renderText={(start, end) => runs.flatMap((run, index) => {
        const from = Math.max(start, run.start);
        const to = Math.min(end, run.end);
        return from < to ? [renderRun(run.text.slice(from - run.start, to - run.start), run.marks, `${index}-${from}`)] : [];
      })}>{text}</GlossaryText>
    </p>
  );
}

export function RichTextView({ document }) {
  if (document?.type !== "doc" || !Array.isArray(document.content)) {
    return <p role="alert" className="text-sm text-rose-300">Testo formattato non valido.</p>;
  }
  return (
    <div className="mb-4 space-y-2 text-base font-light leading-relaxed text-zinc-300">
      {document.content.map((paragraph, index) =>
        paragraph.type === "paragraph" ? <RichParagraph key={index} paragraph={paragraph} /> : null,
      )}
    </div>
  );
}
