import { Handle, Position } from "@xyflow/react";
import { GitFork, Info, Minus, Plus } from "lucide-react";
import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
} from "../../data/baseNodes";

const TechNode = ({ data }) => {
  const {
    label,
    isSubNode,
    isRoot,
    isDragEnabled = false,
    isSelected,
    categories = [],
    primaryCategory = "frontend",
    hasChildren,
    isOpen,
    parentCount = 0,
    onToggleChildren,
    onOpenModal,
  } = data;

  const accent = CATEGORY_COLORS[primaryCategory] ?? "#94a3b8";
  const secondaryCategories = categories.filter(
    (entry) => entry.category !== primaryCategory,
  );

  const cursorClass =
    isRoot && isDragEnabled
      ? "cursor-grab active:cursor-grabbing"
      : "cursor-pointer";

  const containerClasses = isSubNode
    ? `px-3 py-1.5 bg-[#141d2d]/90 border rounded-[6px] text-xs text-[#aebbd0] min-w-[110px] ${cursorClass}`
    : `px-4 py-3 border rounded-[12px] bg-gradient-to-br from-[#192336]/98 to-[#111928]/98 text-[13px] font-medium min-w-[190px] transition-all duration-150 ease-in-out ${cursorClass}`;

  return (
    <div
      className={`flex flex-col gap-1.25 group select-none ${containerClasses} hover:-translate-y-0.5`}
      style={{
        borderColor: isSelected ? accent : `${accent}66`,
        boxShadow: isSelected
          ? `0 0 0 2px ${accent}, 0 0 24px ${accent}60`
          : isSubNode
            ? `0 0 8px ${accent}18`
            : `0 0 0 1px ${accent}12, 0 8px 24px rgba(0,0,0,0.25)`,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: accent }}
        className="w-1.5 h-1.5"
      />

      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate">{label}</span>
          {(secondaryCategories.length > 0 || parentCount > 1) && (
            <span className="flex items-center gap-1.5">
              {secondaryCategories.map((entry) => (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  key={entry.category}
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[entry.category] ?? "#94a3b8",
                  }}
                  title={CATEGORY_LABELS[entry.category] ?? entry.category}
                />
              ))}
              {parentCount > 1 && (
                <span
                  className="flex items-center gap-0.5 text-[9px] font-mono text-slate-500"
                  title={`Visibile da ${parentCount} padri`}
                >
                  <GitFork size={9} />
                  {parentCount}
                </span>
              )}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onOpenModal?.();
            }}
            className="p-1 text-slate-400 hover:text-cyan-300 rounded hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Mostra dettagli"
            type="button"
          >
            <Info size={isSubNode ? 12 : 14} />
          </button>

          {hasChildren && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                onToggleChildren?.();
              }}
              className="p-1 rounded hover:bg-slate-800/60 transition-colors cursor-pointer flex items-center justify-center"
              style={{ color: isOpen ? accent : "#94a3b8" }}
              title={isOpen ? "Riduci" : "Espandi"}
              type="button"
            >
              {isOpen ? <Minus size={14} /> : <Plus size={14} />}
            </button>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: accent }}
        className="w-1.5 h-1.5"
      />
    </div>
  );
};

export default TechNode;
