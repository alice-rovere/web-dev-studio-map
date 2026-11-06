// Nodo: css
export default function CssIcon({ x = 0, y = 0, stroke = "currentColor" }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M -24 -26 H 24 L 20 18 L 0 26 L -20 18 Z" />
      <path d="M 12 -14 H -10 L -8 -2 H 10 L 8 10 L 0 13 L -8 10" />
    </g>
  );
}
