// Icona di nodo: disegnata nel box 64x64 centrato sull'origine (-32..32).
// `x`/`y` posizionano il centro nella scena SVG, `stroke` ne definisce il colore.
export default function BrowserIcon({ x = 0, y = 0, stroke = "currentColor" }) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      fill="none"
      stroke={stroke}
      strokeWidth="3"
      strokeLinejoin="round"
    >
      <rect x="-24" y="-21" width="48" height="34" rx="4" />
      <path d="M -30 20 H 30 L 23 26 H -23 Z" />
      <path d="M -18 -12 H 18 M -18 -5 H 5" />
    </g>
  );
}
