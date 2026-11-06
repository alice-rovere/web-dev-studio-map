// Nodo: http-protocol
export default function HttpIcon({ x = 0, y = 0, stroke = "currentColor" }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M -26 -12 H 24 M 14 -22 L 24 -12 L 14 -2" />
      <path d="M 26 12 H -24 M -14 2 L -24 12 L -14 22" />
    </g>
  );
}
