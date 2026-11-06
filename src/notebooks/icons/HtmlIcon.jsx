// Nodo: html
export default function HtmlIcon({ x = 0, y = 0, stroke = "currentColor" }) {
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
      <path d="M -8 -10 L -16 -1 L -8 8 M 8 -10 L 16 -1 L 8 8" />
    </g>
  );
}
