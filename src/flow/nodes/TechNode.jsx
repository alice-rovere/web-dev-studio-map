import { Handle, Position } from "@xyflow/react";
import { Info, Plus, Minus } from "lucide-react";

const TechNode = ({ data }) => {
  const {
    label,
    isSubNode,
    hasChildren,
    isOpen,
    onToggleChildren,
    onOpenModal,
  } = data;

  const containerClasses = isSubNode
    ? "px-3 py-1.5 bg-[#141d2d]/90 border border-slate-700 rounded-[6px] text-xs text-[#aebbd0] min-w-[110px]"
    : "px-4 py-3 border rounded-[12px] bg-gradient-to-br from-[#192336]/98 to-[#111928]/98 shadow-[0_8px_24px_rgba(0,0,0,0.2)] text-[13px] font-medium min-w-[190px] transition-all duration-150 ease-in-out";

  return (
    <div
      className={`flex flex-col gap-1.25 group select-none ${containerClasses} hover:-translate-y-0.5`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="bg-slate-400 w-1.5 h-1.5"
      />

      <div className="flex items-center justify-between w-full gap-3">
        <span>{label}</span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal?.(label);
            }}
            className="p-1 text-slate-400 hover:text-blue-500 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            title="Mostra dettagli"
          >
            <Info size={isSubNode ? 12 : 14} />
          </button>

          {hasChildren && !isSubNode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleChildren?.();
              }}
              className="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
              title={isOpen ? "Riduci" : "Espandi"}
            >
              {isOpen ? <Minus size={14} /> : <Plus size={14} />}
            </button>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-slate-400 w-1.5 h-1.5"
      />
    </div>
  );
};

export default TechNode;
