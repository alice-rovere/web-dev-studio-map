// Nodi: api-architettura, rest-api
export default function ApiIcon({ x = 0, y = 0, stroke = "currentColor" }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="-18" cy="0" r="8" />
      <circle cx="18" cy="0" r="8" />
      <path d="M -10 -3 H 10 M 5 -8 L 10 -3 M 10 3 H -10 M -5 8 L -10 3" />
      <path d="M -26 -22 C -32 -22 -32 -14 -32 -14 M 26 22 C 32 22 32 14 32 14" />
    </g>
  );
}
