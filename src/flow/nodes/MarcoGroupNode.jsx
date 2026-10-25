const MacroGroupNode = ({ data }) => {
  return (
    <div
      className={`w-full h-full rounded-full border-2 border-dashed ${data.borderColor} ${data.bgColor} flex items-start justify-center p-6 select-none pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.5)]`}
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
