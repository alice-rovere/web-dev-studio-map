export default function TerminalIcon({
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
      <rect x="-26" y="-24" width="52" height="45" rx="5" />
      <path d="M -16 -11 L -8 -4 L -16 3 M -3 4 H 13" />
    </g>
  );
}
