const MacroGroupNode = ({ data }) => {
  // Controlla se il nodo corrente è il Database per spingere il testo in basso
  const isDatabase = data.label?.toLowerCase() === "database";

  // Allinea in alto per Frontend/Backend (items-start), in basso per Database (items-end)
  const alignmentClass = isDatabase ? "items-end" : "items-start";

  return (
    <div
      className={`w-full h-full rounded-full border-2 border-dashed ${data.borderColor} ${data.bgColor} flex ${alignmentClass} justify-center p-6 select-none pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]`}
    >
      <span
        className={`text-[17px] font-extrabold tracking-[0.12em] uppercase drop-shadow-[0_2px_12px_rgba(5,10,20,0.9)] ${data.textColor}`}
      >
        {data.label}
      </span>
    </div>
  );
};

export default MacroGroupNode;
