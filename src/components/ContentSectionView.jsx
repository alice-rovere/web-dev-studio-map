export function ContentBlock({ section }) {
  const payload = section?.payload ?? {};

  if (section?.type === "text" && typeof payload.text === "string") {
    return (
      <p className="text-zinc-300 leading-relaxed text-base mb-4 font-light whitespace-pre-line">
        {payload.text}
      </p>
    );
  }

  if (section?.type === "list" && Array.isArray(payload.items)) {
    return (
      <ul className="list-none space-y-2 mb-4">
        {payload.items.map((item, index) => (
          <li
            key={`${index}-${item}`}
            className="flex items-start text-zinc-300 text-sm"
          >
            <span className="text-[#64d9bd] mr-2 select-none">⚡</span>
            {item}
          </li>
        ))}
      </ul>
    );
  }

  if (
    section?.type === "table" &&
    Array.isArray(payload.columns) &&
    Array.isArray(payload.rows)
  ) {
    return (
      <div className="w-full overflow-x-auto border border-zinc-800 rounded-lg bg-zinc-950/40 my-4 backdrop-blur-sm">
        <table className="w-full border-collapse text-left text-sm text-zinc-300">
          <thead className="bg-zinc-900/60 uppercase tracking-wider text-xs font-mono text-zinc-400 border-b border-zinc-800">
            <tr>
              {payload.columns.map((column, index) => (
                <th className="px-4 py-3 font-semibold" key={`${column}-${index}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50 font-light">
            {payload.rows.map((row, rowIndex) => (
              <tr
                className="hover:bg-zinc-900/30 transition-colors"
                key={rowIndex}
              >
                {row.map((cell, cellIndex) => (
                  <td className="px-4 py-3" key={`${rowIndex}-${cellIndex}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (section?.type === "timeline" && Array.isArray(payload.entries)) {
    return (
      <ol className="relative border-l border-zinc-800 space-y-6 my-6 ml-2">
        {payload.entries.map((entry, index) => (
          <li
            className="mb-4 ml-6 group"
            key={`${entry.date}-${entry.title}-${index}`}
          >
            <span className="absolute w-3 h-3 bg-zinc-950 border border-[#7ab8ff] shadow-[0_0_8px_rgba(122,184,255,0.5)] rounded-full -left-1.5 top-1.5 group-hover:scale-125 transition-transform" />
            <span className="inline-block text-xs font-mono bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded mb-1">
              {entry.date}
            </span>
            <h4 className="text-zinc-200 text-sm font-semibold tracking-wide">
              {entry.title}
            </h4>
            <p className="text-zinc-400 text-xs font-light mt-1">
              {entry.description}
            </p>
          </li>
        ))}
      </ol>
    );
  }

  if (section?.type === "code" && typeof payload.code === "string") {
    return (
      <div className="my-4">
        <pre className="bg-zinc-950 border border-zinc-800/80 rounded-lg p-4 font-mono text-xs text-emerald-400 shadow-inner overflow-x-auto selection:bg-emerald-500/20">
          <code>{payload.code}</code>
        </pre>
        {payload.language && (
          <p className="mt-1 text-right font-mono text-[10px] uppercase tracking-wider text-zinc-600">
            {payload.language}
          </p>
        )}
      </div>
    );
  }

  return (
    <p className="text-zinc-500 italic text-sm">
      Formato della sezione non riconosciuto.
    </p>
  );
}

export function SectionCard({ section, actions }) {
  return (
    <article className="border border-zinc-900/60 bg-zinc-900/10 p-5 rounded-xl backdrop-blur-sm">
      <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 pb-2 mb-4">
        <h3 className="text-base font-bold font-mono tracking-wide text-zinc-200 uppercase">
          {section.title}
        </h3>
        {actions}
      </div>
      <ContentBlock section={section} />
    </article>
  );
}
