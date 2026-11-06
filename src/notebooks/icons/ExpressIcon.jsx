// Nodo: expressjs
export default function ExpressIcon({ x = 0, y = 0, stroke = "currentColor" }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="-28" y="-20" width="56" height="40" rx="5" />
      <path d="M -18 -5 H -8 M -18 -5 V 7 H -8 M -18 1 H -10" />
      <path d="M 2 -5 L 14 7 M 14 -5 L 2 7" />
    </g>
  );
}
