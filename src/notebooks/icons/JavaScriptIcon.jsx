// Nodo: javascript
export default function JavaScriptIcon({
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
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="-26" y="-26" width="52" height="52" rx="5" />
      <path d="M -6 -12 V 8 C -6 14 -16 14 -16 7" />
      <path d="M 18 -12 C 8 -14 6 -2 14 0 C 22 2 20 14 8 12" />
    </g>
  );
}
