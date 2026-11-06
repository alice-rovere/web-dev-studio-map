// Nodo: nodejs
export default function NodeJsIcon({ x = 0, y = 0, stroke = "currentColor" }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M 0 -28 L 24 -14 V 14 L 0 28 L -24 14 V -14 Z" />
      <path d="M -9 10 V -10 L 9 10 V -10" />
    </g>
  );
}
