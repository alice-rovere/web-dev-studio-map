export default function ServerIcon({ x = 0, y = 0, stroke = "currentColor" }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinejoin="round"
    >
      <rect x="-24" y="-25" width="48" height="21" rx="4" />
      <rect x="-24" y="0" width="48" height="21" rx="4" />
      <path d="M -14 -14 H 13 M -14 11 H 13" />
      <circle cx="-16" cy="-14" r="2" fill={stroke} />
      <circle cx="-16" cy="11" r="2" fill={stroke} />
    </g>
  );
}
