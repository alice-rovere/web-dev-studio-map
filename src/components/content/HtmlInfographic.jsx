import {
  Braces,
  Code2,
  FileCode2,
  Image,
  Layers,
  List,
  MousePointer2,
  Table2,
} from "lucide-react";
import GlossaryText from "../glossary/GlossaryText";
import { ContentBlock } from "./ContentSectionView";
import { RichTextView } from "./blocks/RichTextBlock";
import { getSectionBlocks } from "./sectionBlocks";
import {
  BentoGridInfographic,
  FlowchartInfographic,
  InteractiveRadialInfographic,
  ScrollytellingSticky,
  SplitScreenInfographic,
} from "../../../LayoutDemo";

const STYLES = [
  {
    Icon: Layers,
    badge: "border-orange-400/50 bg-orange-500/15 text-orange-300",
    line: "from-orange-400",
  },
  {
    Icon: Code2,
    badge: "border-sky-400/50 bg-sky-500/15 text-sky-300",
    line: "from-sky-400",
  },
  {
    Icon: FileCode2,
    badge: "border-violet-400/50 bg-violet-500/15 text-violet-300",
    line: "from-violet-400",
  },
  {
    Icon: Image,
    badge: "border-emerald-400/50 bg-emerald-500/15 text-emerald-300",
    line: "from-emerald-400",
  },
  {
    Icon: List,
    badge: "border-amber-400/50 bg-amber-500/15 text-amber-300",
    line: "from-amber-400",
  },
  {
    Icon: Table2,
    badge: "border-cyan-400/50 bg-cyan-500/15 text-cyan-300",
    line: "from-cyan-400",
  },
  {
    Icon: Braces,
    badge: "border-rose-400/50 bg-rose-500/15 text-rose-300",
    line: "from-rose-400",
  },
  {
    Icon: MousePointer2,
    badge: "border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-300",
    line: "from-fuchsia-400",
  },
];

function tagLines(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  const entries = lines.map((line) =>
    line.match(/^\s*•\s+(.+?)\s+→\s+(.+?)\s*$/),
  );
  return entries.length && entries.every(Boolean) ? entries : null;
}

function TagList({ lines }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {lines.map(([, tags, description], index) => (
        <li
          className="min-w-0 rounded-lg border border-slate-700/70 bg-slate-950/70 p-3"
          key={index}
        >
          <p className="font-mono text-sm font-semibold leading-6 text-emerald-300 wrap-break-word">
            <GlossaryText>{tags}</GlossaryText>
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-300 wrap-break-word">
            <GlossaryText>{description}</GlossaryText>
          </p>
        </li>
      ))}
    </ul>
  );
}

function HistoryTimeline({ entries }) {
  return (
    <ol className="space-y-3">
      {entries.map((entry, index) => (
        <li
          className="flex items-start gap-3 rounded-lg border border-slate-700/70 bg-slate-950/60 p-3"
          key={index}
        >
          <span className="shrink-0 rounded-md border border-orange-400/30 bg-orange-500/10 px-2 py-1 font-mono text-xs font-bold text-orange-200">
            <GlossaryText>{entry.date}</GlossaryText>
          </span>
          <div className="min-w-0 text-sm leading-6 text-slate-300">
            {entry.title && (
              <h4 className="font-semibold text-white">
                <GlossaryText>{entry.title}</GlossaryText>
              </h4>
            )}
            <p className="whitespace-pre-line">
              <GlossaryText>{entry.description}</GlossaryText>
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function InfographicBlock({ block }) {
  const payload = block.payload ?? {};
  if (block.type === "timeline" && Array.isArray(payload.entries)) {
    return <HistoryTimeline entries={payload.entries} />;
  }
  if (
    block.type === "text" &&
    payload.richText?.type === "doc" &&
    Array.isArray(payload.richText.content)
  ) {
    const paragraphs = payload.richText.content;
    if (
      paragraphs.every((paragraph) => paragraph.type === "paragraph") &&
      paragraphs.filter((paragraph) => paragraph.content?.length).length > 1
    ) {
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {paragraphs.map((paragraph, index) =>
            paragraph.content?.length ? (
              <div
                className="min-w-0 rounded-lg border border-slate-700/70 bg-slate-950/60 p-3"
                key={index}
              >
                <RichTextView
                  document={{ type: "doc", content: [paragraph] }}
                />
              </div>
            ) : null,
          )}
        </div>
      );
    }
  }
  if (
    block.type === "text" &&
    !payload.richText &&
    typeof payload.text === "string"
  ) {
    const lines = tagLines(payload.text);
    if (lines) return <TagList lines={lines} />;
  }
  return <ContentBlock section={block} />;
}

function InfographicStep({ section, index }) {
  const { Icon, badge, line } = STYLES[index % STYLES.length];
  const blocks = getSectionBlocks(section);
  const subtitle =
    typeof section.payload?.subtitle === "string"
      ? section.payload.subtitle
      : "";
  const layout = getSectionLayout(section, blocks);

  let content;
  if (layout.type === "timeline") {
    content = (
      <ScrollytellingSticky
        chapters={layout.entries.map((entry) => ({
          date: entry.date,
          title: entry.title,
          text: entry.description,
        }))}
      />
    );
  } else if (layout.type === "comparison") {
    content = (
      <SplitScreenInfographic
        columns={layout.columns}
        rows={layout.rows}
      />
    );
  } else if (layout.type === "flow") {
    content = (
      <div className="space-y-4">
        <FlowchartInfographic items={layout.items} />
        {layout.supportingBlocks.length > 0 && (
          <BentoGridInfographic>
            {layout.supportingBlocks.map((block, blockIndex) => (
              <div
                className="min-w-0 rounded-xl border border-slate-700/70 bg-slate-950/50 p-3 sm:p-4"
                key={block.id ?? `${block.type}-${blockIndex}`}
              >
                <InfographicBlock block={block} />
              </div>
            ))}
          </BentoGridInfographic>
        )}
      </div>
    );
  } else if (layout.type === "radial") {
    content = (
      <InteractiveRadialInfographic
        items={layout.items}
        title={section.title}
      />
    );
  } else {
    content = (
      <BentoGridInfographic>
        {blocks.map((block, blockIndex) => (
          <div
            className="min-w-0 rounded-xl border border-slate-700/70 bg-slate-950/50 p-3 sm:p-4"
            key={block.id ?? `${block.type}-${blockIndex}`}
          >
            <InfographicBlock block={block} />
          </div>
        ))}
      </BentoGridInfographic>
    );
  }

  return (
    <article
      className="relative min-w-0 scroll-mt-24 overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900/90 shadow-xl shadow-black/20"
      id={`html-step-${section.id}`}
    >
      <div
        aria-hidden="true"
        className={`h-1 bg-linear-to-r ${line} to-transparent`}
      />
      <div className="p-4 sm:p-6">
        <header className="mb-5 flex items-start gap-3 border-b border-slate-700/70 pb-4">
          <div
            aria-hidden="true"
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${badge}`}
          >
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <p className="mb-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Sezione {String(index + 1).padStart(2, "0")} · {layout.label}
            </p>
            <h3 className="text-lg font-bold leading-snug text-white sm:text-xl">
              <GlossaryText>{section.title}</GlossaryText>
            </h3>
            {subtitle && (
              <p className="mt-2 text-sm leading-6 text-slate-300">
                <GlossaryText>{subtitle}</GlossaryText>
              </p>
            )}
          </div>
        </header>
        {content}
      </div>
    </article>
  );
}

function getSectionLayout(section, blocks) {
  const processBlockIndex = blocks.findIndex((block) => {
    const items = block.payload?.items;
    return (
      block.type === "list" &&
      Array.isArray(items) &&
      items.length > 1 &&
      isProcessList(section, items)
    );
  });

  if (processBlockIndex !== -1) {
    const processBlock = blocks[processBlockIndex];
    return {
      type: "flow",
      label: "procedura",
      items: processBlock.payload.items,
      supportingBlocks: blocks.filter(
        (_, index) => index !== processBlockIndex,
      ),
    };
  }

  if (blocks.length === 1) {
    const [block] = blocks;
    const payload = block.payload ?? {};

    if (
      block.type === "timeline" &&
      Array.isArray(payload.entries) &&
      payload.entries.length > 1
    ) {
      return {
        type: "timeline",
        label: "cronologia",
        entries: payload.entries,
      };
    }

    if (
      block.type === "table" &&
      Array.isArray(payload.columns) &&
      payload.columns.length === 2 &&
      Array.isArray(payload.rows) &&
      payload.rows.length > 0
    ) {
      return {
        type: "comparison",
        label: "confronto",
        columns: payload.columns,
        rows: payload.rows,
      };
    }

    if (block.type === "list" && Array.isArray(payload.items)) {
      const items = payload.items.filter(
        (item) => typeof item === "string" && item.trim(),
      );
      if (items.length >= 3 && items.length <= 6) {
        return {
          type: "radial",
          label: "mappa di concetti",
          items: items.map(toRadialItem),
        };
      }
    }
  }

  return { type: "bento", label: "concetti" };
}

function isProcessList(section, items) {
  const title = `${section.title} ${section.payload?.subtitle ?? ""}`;
  return (
    /\b(passaggi|procedura|processo|sequenza|fasi|workflow|step)\b/i.test(
      title,
    ) ||
    items.every((item) =>
      /^(?:\d+[.)]|(?:passo|fase|step)\s+\d+)/i.test(item.trim()),
    )
  );
}

function toRadialItem(item, index) {
  const parts = item.split(/\s*(?:→|:|—)\s*/, 2);
  return {
    title: parts[0].trim() || `Concetto ${index + 1}`,
    description: parts[1]?.trim() || item,
  };
}

export function InfographicSections({ sections }) {
  if (!sections.length) return null;

  return (
    <div className="space-y-8">
      <header className="relative overflow-hidden rounded-2xl border border-orange-400/20 bg-slate-950 px-5 py-8 text-center sm:px-8 sm:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-br from-orange-500/10 via-transparent to-fuchsia-500/10"
        />
        <div className="relative">
          <p className="inline-flex rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 font-mono text-xs font-semibold tracking-wide text-orange-300">
            GUIDA VISIVA INTERATTIVA
          </p>
          <h3 className="mt-4 bg-linear-to-r from-orange-300 via-amber-200 to-rose-300 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
            Alla scoperta di HTML
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Confronti, procedure, relazioni e cronologie: ogni contenuto prende
            la forma visiva più adatta alla sua logica.
          </p>
          <p className="mt-5 font-mono text-xs uppercase tracking-widest text-orange-200">
            {sections.length} {sections.length === 1 ? "tappa" : "tappe"} da
            esplorare
          </p>
        </div>
      </header>

      <nav
        aria-label="Indice delle tappe HTML"
        className="flex flex-wrap gap-2"
      >
        {sections.map((section, index) => (
          <a
            className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 transition-colors hover:border-orange-400/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-300"
            href={`#html-step-${section.id}`}
            key={section.id}
          >
            <span className="mr-1 font-mono text-orange-300">
              {String(index + 1).padStart(2, "0")}
            </span>{" "}
            {section.title}
          </a>
        ))}
      </nav>

      <div className="space-y-6">
        {sections.map((section, index) => (
          <InfographicStep key={section.id} index={index} section={section} />
        ))}
      </div>
    </div>
  );
}
