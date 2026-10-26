const MacroGroupNode = ({ data }) => {
  // Controlla se il nodo corrente è il Database per spingere il testo in basso
  const isDatabase = data.label?.toLowerCase() === "database";

  // Allinea in alto per Frontend/Backend (items-start), in basso per Database (items-end)
  const alignmentClass = isDatabase ? "items-end" : "items-start";

  return (
    <div
      className={`w-full h-full rounded-[120px] border ${data.borderColor} ${data.bgColor} flex ${alignmentClass} justify-center p-8 select-none pointer-events-none`}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full border border-hairline/70 bg-canvas/50 px-3.5 py-1 text-[11px] font-semibold tracking-[0.16em] uppercase backdrop-blur-sm ${data.textColor}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {data.label}
      </span>
    </div>
  );
};

export default MacroGroupNode;
