const nodes = [
  { id: "browser", label: "Browser", detail: "azione utente" },
  { id: "frontend", label: "Frontend", detail: "prepara la chiamata" },
  { id: "api", label: "API / Server", detail: "riceve HTTP" },
  { id: "backend", label: "Backend", detail: "applica la logica" },
  { id: "database", label: "Database", detail: "legge o salva dati" },
];

const activeByStep = {
  interaction: ["browser"],
  prepare: ["browser", "frontend"],
  "http-request": ["frontend", "api"],
  routing: ["api", "backend"],
  "business-logic": ["backend"],
  "database-query": ["backend", "database"],
  "database-result": ["database", "backend"],
  "http-response": ["backend", "api", "frontend"],
  "render-ui": ["frontend", "browser"],
};

export default function WebRequestCycleDiagram({ stepId, isPlaying }) {
  const active = activeByStep[stepId] ?? [];

  return (
    <div className="overflow-x-auto rounded-xl border border-cyan-500/20 bg-[#080b14]/80 p-2">
      <svg
        aria-label="Ciclo di una richiesta web: dal browser al database e ritorno"
        className="block h-auto w-full min-w-190"
        role="img"
        viewBox="0 0 1000 200"
      >
        <title>Richiesta e risposta tra browser, server e database</title>
        <defs>
          <marker
            id="web-request-arrow"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="6"
            refY="4"
          >
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#22d3ee" />
          </marker>
          <marker
            id="web-response-arrow"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="6"
            refY="4"
          >
            <path d="M 8 0 L 0 4 L 8 8 z" fill="#34d399" />
          </marker>
        </defs>

        <text
          fill="#67e8f9"
          fontFamily="monospace"
          fontSize="11"
          fontWeight="bold"
          letterSpacing="2"
          textAnchor="middle"
          x="500"
          y="23"
        >
          RICHIESTA · CLIENT → SERVER
        </text>
        <text
          fill="#6b7280"
          fontFamily="monospace"
          fontSize="10"
          textAnchor="middle"
          x="500"
          y="41"
        >
          {isPlaying ? "IN VIAGGIO…" : "INVIO"}
        </text>
        <path
          className={isPlaying ? "internet-flow-dash" : undefined}
          d="M 36 52 H 964"
          fill="none"
          markerEnd="url(#web-request-arrow)"
          stroke="#22d3ee"
          strokeDasharray="5 8"
          strokeOpacity=".7"
          strokeWidth="2"
        />
        <path
          className={isPlaying ? "internet-flow-dash" : undefined}
          d="M 964 155 H 36"
          fill="none"
          markerEnd="url(#web-response-arrow)"
          stroke="#34d399"
          strokeDasharray="5 8"
          strokeOpacity=".7"
          strokeWidth="2"
        />
        <text
          fill="#6ee7b7"
          fontFamily="monospace"
          fontSize="11"
          fontWeight="bold"
          letterSpacing="2"
          textAnchor="middle"
          x="500"
          y="187"
        >
          ← RISPOSTA · SERVER → CLIENT
        </text>

        {nodes.map((node, index) => {
          const x = 100 + index * 200;
          const selected = active.includes(node.id);
          const color = selected ? "#67e8f9" : "#64748b";

          return (
            <g key={node.id}>
              <path
                d={`M ${x} 52 V 70 M ${x} 130 V 155`}
                fill="none"
                stroke={color}
                strokeOpacity={selected ? ".65" : ".25"}
                strokeWidth="1.5"
              />
              <rect
                fill={selected ? "#10212c" : "#0b1120"}
                height="60"
                rx="12"
                stroke={color}
                strokeOpacity={selected ? "1" : ".55"}
                strokeWidth={selected ? "2" : "1"}
                width="132"
                x={x - 66}
                y="70"
              />
              <text
                fill={selected ? "#e0faff" : "#cbd5e1"}
                fontFamily="monospace"
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                x={x}
                y="96"
              >
                {node.label}
              </text>
              <text
                fill={selected ? "#a5f3fc" : "#94a3b8"}
                fontFamily="monospace"
                fontSize="9"
                textAnchor="middle"
                x={x}
                y="114"
              >
                {node.detail}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
