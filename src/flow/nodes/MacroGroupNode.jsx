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
      className={`w-full h-full rounded-full border-2 border-dashed ${data.borderColor} ${data.bgColor} flex ${containerAlignment} p-6 select-none pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]`}
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
