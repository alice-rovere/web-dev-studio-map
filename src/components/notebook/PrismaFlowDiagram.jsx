const NODES = [
  { id: "browser", label: ["Browser"], completedAt: 0, icon: "browser" },
  { id: "express", label: ["Express", "API"], completedAt: 0, icon: "server" },
  { id: "prisma", label: ["Prisma", "Client"], completedAt: 1, icon: "prisma" },
  {
    id: "query",
    label: ["Query engine", "SQL"],
    completedAt: 2,
    icon: "terminal",
  },
  {
    id: "database",
    label: ["MySQL", "User"],
    completedAt: 3,
    icon: "database",
  },
];

const CONNECTIONS = [
  {
    id: "request",
    label: "HTTP",
    path: "M 166 221 H 232",
  },
  {
    id: "client-call",
    label: "create()",
    path: "M 366 221 H 432",
  },
  {
    id: "translation",
    label: "SQL",
    path: "M 566 221 H 632",
  },
  {
    id: "write",
    label: "INSERT",
    path: "M 766 221 H 832",
  },
  {
    id: "response",
    label: "201 JSON",
    path: "M 900 132 C 820 34 180 34 100 132",
  },
];

const ACTIVE_NODES_BY_STEP = {
  request: ["browser", "express"],
  "client-call": ["express", "prisma"],
  translation: ["prisma", "query"],
  write: ["query", "database"],
  response: ["database", "browser"],
};

function NodeIcon({ icon, x, stroke }) {
  if (icon === "browser") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round">
        <rect x={x - 24} y="169" width="48" height="34" rx="4" />
        <path d={`M ${x - 30} 210 H ${x + 30} L ${x + 23} 216 H ${x - 23} Z`} />
        <path d={`M ${x - 18} 178 H ${x + 18} M ${x - 18} 185 H ${x + 5}`} />
      </g>
    );
  }

  if (icon === "server") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round">
        <rect x={x - 24} y="165" width="48" height="21" rx="4" />
        <rect x={x - 24} y="190" width="48" height="21" rx="4" />
        <path d={`M ${x - 14} 176 H ${x + 13} M ${x - 14} 201 H ${x + 13}`} />
        <circle cx={x - 16} cy="176" r="2" fill={stroke} />
        <circle cx={x - 16} cy="201" r="2" fill={stroke} />
      </g>
    );
  }

  if (icon === "prisma") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round">
        <path
          d={`M ${x - 23} 200 L ${x - 4} 164 L ${x + 24} 207 L ${x - 11} 215 Z`}
        />
        <path
          d={`M ${x - 4} 164 L ${x - 11} 215 M ${x - 23} 200 L ${x + 24} 207`}
        />
      </g>
    );
  }

  if (icon === "terminal") {
    return (
      <g fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round">
        <rect x={x - 26} y="166" width="52" height="45" rx="5" />
        <path
          d={`M ${x - 16} 179 L ${x - 8} 186 L ${x - 16} 193 M ${x - 3} 194 H ${x + 13}`}
        />
      </g>
    );
  }

  return (
    <g fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round">
      <path
        d={`M ${x - 25} 174 C ${x - 25} 164 ${x + 25} 164 ${x + 25} 174 V 204 C ${x + 25} 214 ${x - 25} 214 ${x - 25} 204 Z`}
      />
      <ellipse cx={x} cy="174" rx="25" ry="9" />
      <path d={`M ${x - 25} 188 C ${x - 25} 198 ${x + 25} 198 ${x + 25} 188`} />
    </g>
  );
}

export default function PrismaFlowDiagram({ stepId, isPlaying }) {
  const stepIndex = CONNECTIONS.findIndex(
    (connection) => connection.id === stepId,
  );
  const activeNodes = new Set(ACTIVE_NODES_BY_STEP[stepId] ?? []);
  const isKnownStep = stepIndex >= 0;

  return (
    <div className="overflow-x-auto rounded-xl border border-cyan-500/20 bg-[#080b14]/80 p-2 sm:p-3">
      <svg
        aria-label="Flusso illustrato da browser ed Express a Prisma, SQL e Postgres"
        className="block h-auto max-h-57.5 w-full"
        role="img"
        viewBox="0 0 1000 360"
      >
        <title>Flusso dei dati con Prisma ORM</title>
        <defs>
          <pattern
            height="28"
            id="prisma-flow-grid"
            patternUnits="userSpaceOnUse"
            width="28"
          >
            <path
              d="M 28 0 H 0 V 28"
              fill="none"
              stroke="#1e293b"
              strokeOpacity=".35"
            />
          </pattern>
          <marker
            id="prisma-flow-arrow-active"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="4"
          >
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#67e8f9" />
          </marker>
          <marker
            id="prisma-flow-arrow-done"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="4"
          >
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#22d3ee" />
          </marker>
          <marker
            id="prisma-flow-arrow-muted"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="7"
            refY="4"
          >
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#475569" />
          </marker>
        </defs>
        <rect fill="url(#prisma-flow-grid)" height="360" width="1000" />

        <text
          fill="#94a3b8"
          fontFamily="monospace"
          fontSize="20"
          letterSpacing="3"
          x="22"
          y="34"
        >
          FLUSSO DEI DATI
        </text>

        {CONNECTIONS.map((connection, index) => {
          const isActive = connection.id === stepId;
          const isComplete = isKnownStep && index < stepIndex;
          const stroke = isActive
            ? "#67e8f9"
            : isComplete
              ? "#22d3ee"
              : "#475569";
          const arrow = isActive
            ? "url(#prisma-flow-arrow-active)"
            : isComplete
              ? "url(#prisma-flow-arrow-done)"
              : "url(#prisma-flow-arrow-muted)";

          return (
            <g key={connection.id}>
              <path
                d={connection.path}
                fill="none"
                markerEnd={arrow}
                opacity={isActive ? 1 : isComplete ? 0.6 : 0.42}
                stroke={stroke}
                strokeDasharray={isActive ? "8 8" : undefined}
                strokeLinecap="round"
                strokeWidth={isActive ? 4 : 3}
              />
              {isActive && isPlaying && (
                <path
                  className="prisma-flow-dash"
                  d={connection.path}
                  fill="none"
                  stroke="#cffafe"
                  strokeDasharray="2 18"
                  strokeLinecap="round"
                  strokeWidth="5"
                />
              )}
              <text
                fill={isActive ? "#a5f3fc" : isComplete ? "#67e8f9" : "#64748b"}
                fontFamily="monospace"
                fontSize="18"
                fontWeight="bold"
                textAnchor="middle"
                x={connection.id === "response" ? 500 : 200 + index * 200}
                y={connection.id === "response" ? 76 : 207}
              >
                {connection.label}
              </text>
            </g>
          );
        })}

        {NODES.map((node, index) => {
          const x = 100 + index * 200;
          const isActive = activeNodes.has(node.id);
          const isComplete = isKnownStep && stepIndex > node.completedAt;
          const stroke = isActive
            ? "#67e8f9"
            : isComplete
              ? "#22d3ee"
              : "#475569";
          const labelColor = isActive
            ? "#e0f2fe"
            : isComplete
              ? "#a5f3fc"
              : "#94a3b8";

          return (
            <g key={node.id}>
              <rect
                fill={isActive ? "#083344" : "#0f172a"}
                fillOpacity={isActive ? 0.82 : 0.92}
                height="174"
                rx="16"
                stroke={stroke}
                strokeOpacity={isActive ? 0.9 : 0.55}
                strokeWidth={isActive ? 3 : 2}
                width="136"
                x={x - 68}
                y="126"
              />
              <NodeIcon icon={node.icon} stroke={stroke} x={x} />
              <text
                fill={labelColor}
                fontFamily="monospace"
                fontSize="26"
                fontWeight={isActive ? "bold" : "normal"}
                textAnchor="middle"
                x={x}
                y="258"
              >
                {node.label.map((part, labelIndex) => (
                  <tspan dy={labelIndex === 0 ? 0 : 25} key={part} x={x}>
                    {part}
                  </tspan>
                ))}
              </text>
              <circle
                cx={x + 48}
                cy="143"
                fill={isActive ? "#22d3ee" : isComplete ? "#0e7490" : "#334155"}
                r="5"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
