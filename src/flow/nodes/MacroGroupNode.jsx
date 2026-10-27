const MacroGroupNode = ({ data }) => {
  const align =
    data.align ||
    (data.label?.toLowerCase() === "database"
      ? "bottom"
      : data.label?.toLowerCase() === "devops"
        ? "left"
        : data.label?.toLowerCase() === "tools"
          ? "right"
          : "top");

  let containerAlignment = "justify-center items-start";
  if (align === "bottom") containerAlignment = "justify-center items-end";
  if (align === "left") containerAlignment = "justify-start items-center";
  if (align === "right") containerAlignment = "justify-end items-center";
  if (align === "top-left") containerAlignment = "justify-start items-start";
  if (align === "top-right") containerAlignment = "justify-end items-start";

  return (
    <div
      className={`w-full h-full rounded-full border border-dashed ${data.borderColor} ${data.bgColor} flex ${containerAlignment} p-8 select-none pointer-events-none transition-all duration-300`}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-950/80 px-4 py-1 text-[11px] font-semibold tracking-[0.16em] uppercase backdrop-blur-md shadow-lg ${data.textColor}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]" />
        {data.label}
      </span>
    </div>
  );
};

export default MacroGroupNode;
