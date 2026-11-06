import { NODE_ICONS } from "../../notebooks/icons/index.js";

const nodes = [
  { id: "browser", label: "Browser", icon: "internet-browser" },
  { id: "dns", label: "DNS" },
  { id: "http", label: "HTTP / TLS", icon: "http-protocol" },
  { id: "server", label: "Server", icon: "server" },
  { id: "html", label: "HTML / DOM", icon: "html" },
  { id: "css", label: "CSS / CSSOM", icon: "css" },
  { id: "js", label: "JavaScript", icon: "javascript" },
  { id: "pixels", label: "Pixel" },
];

const activeByStep = {
  url: ["browser"],
  dns: ["browser", "dns"],
  connection: ["browser", "http", "server"],
  request: ["browser", "http", "server"],
  html: ["browser", "html"],
  css: ["browser", "css"],
  javascript: ["browser", "js"],
  tree: ["html", "css"],
  layout: ["html", "css", "pixels"],
  pixels: ["browser", "pixels"],
};

export default function InternetBrowserDiagram({ stepId, isPlaying }) {
  const active = activeByStep[stepId] ?? [];
  return (
    <div className="overflow-x-auto rounded-xl border border-cyan-500/20 bg-[#080b14]/80 p-2">
      <svg
        aria-label="Schema concettuale: browser, DNS, HTTP, server, risorse e pixel"
        className="block h-auto w-full min-w-180"
        role="img"
        viewBox="0 0 1120 180"
      >
        <title>Dal browser alla pagina visualizzata</title>
        <path
          className={isPlaying ? "internet-flow-dash" : undefined}
          d="M 75 82 H 1045"
          fill="none"
          stroke="#22d3ee"
          strokeDasharray="5 8"
          strokeOpacity=".45"
          strokeWidth="2"
        />
        {nodes.map((node, index) => {
          const x = 70 + index * 140;
          const selected = active.includes(node.id);
          const color = selected ? "#a5f3fc" : "#64748b";
          const Icon = node.icon ? NODE_ICONS[node.icon] : null;
          return (
            <g key={node.id}>
              <circle cx={x} cy="82" r="44" fill="#0b1120" stroke={color} strokeWidth={selected ? 3 : 1} />
              {Icon ? (
                <Icon x={x} y={82} stroke={color} />
              ) : (
                <text x={x} y="88" fill={color} textAnchor="middle" fontFamily="monospace" fontSize="18" fontWeight="bold">
                  {node.label}
                </text>
              )}
              <text x={x} y="151" fill={color} textAnchor="middle" fontFamily="monospace" fontSize="14">
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
