export default function DatabaseIcon({
  x = 0,
  y = 0,
  stroke = "currentColor",
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinejoin="round"
    >
      <path d="M -25 -16 C -25 -26 25 -26 25 -16 V 14 C 25 24 -25 24 -25 14 Z" />
      <ellipse cx="0" cy="-16" rx="25" ry="9" />
      <path d="M -25 -2 C -25 8 25 8 25 -2" />
    </g>
  );
}
