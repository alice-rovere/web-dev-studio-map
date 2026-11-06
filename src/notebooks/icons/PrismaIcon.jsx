export default function PrismaIcon({ x = 0, y = 0, stroke = "currentColor" }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinejoin="round"
    >
      <path d="M -23 10 L -4 -26 L 24 17 L -11 25 Z" />
      <path d="M -4 -26 L -11 25 M -23 10 L 24 17" />
    </g>
  );
}
