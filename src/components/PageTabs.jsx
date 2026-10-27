import { useId, useRef, useState } from "react";

const ACCENTS = {
  indigo: {
    bar: "border-slate-800",
    active: "border-indigo-400 text-white",
    inactive:
      "border-transparent text-slate-500 hover:border-slate-700 hover:text-slate-300",
  },
  cyan: {
    bar: "border-slate-800",
    active: "border-cyan-400 text-white",
    inactive:
      "border-transparent text-slate-500 hover:border-slate-700 hover:text-slate-300",
  },
};

export default function PageTabs({
  tabs = [],
  ariaLabel,
  accent = "indigo",
  defaultTabId,
}) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(
    defaultTabId ?? tabs[0]?.id ?? null,
  );
  const tabRefs = useRef(new Map());

  const activeTab =
    tabs.find((tab) => tab.id === activeId) ?? tabs[0] ?? null;
  const activeIndex = activeTab
    ? tabs.findIndex((tab) => tab.id === activeTab.id)
    : -1;
  const palette = ACCENTS[accent] ?? ACCENTS.indigo;

  function tabId(tab) {
    return `${baseId}-tab-${tab.id}`;
  }

  function panelId(tab) {
    return `${baseId}-panel-${tab.id}`;
  }

  function handleTabKeyDown(event) {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(event.key) || tabs.length === 0) return;

    event.preventDefault();

    let nextIndex;
    if (event.key === "ArrowRight") {
      nextIndex = (activeIndex + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else {
      nextIndex = tabs.length - 1;
    }

    const nextTab = tabs[nextIndex];
    if (!nextTab) return;

    setActiveId(nextTab.id);
    tabRefs.current.get(nextTab.id)?.focus();
  }

  return (
    <div>
      <div
        aria-label={ariaLabel}
        className={`flex items-center gap-1 overflow-x-auto border-b ${palette.bar} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab?.id === tab.id;

          return (
            <button
              aria-controls={panelId(tab)}
              aria-selected={isActive}
              className={`-mb-px shrink-0 cursor-pointer whitespace-nowrap border-b-2 px-3 pt-2 pb-2.5 font-mono text-[11px] tracking-wider uppercase transition-colors ${
                isActive ? palette.active : palette.inactive
              }`}
              id={tabId(tab)}
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={handleTabKeyDown}
              ref={(element) => {
                if (element) {
                  tabRefs.current.set(tab.id, element);
                } else {
                  tabRefs.current.delete(tab.id);
                }
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab && (
        <div
          aria-labelledby={tabId(activeTab)}
          id={panelId(activeTab)}
          role="tabpanel"
          tabIndex={0}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
