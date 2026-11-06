import { NODE_ICONS, hasNodeIcon } from "../notebooks/icons/index.js";

// Icona del nodo in base allo slug; non rende nulla se non esiste.
export default function NodeIcon({ slug, size = 20, color = "currentColor" }) {
  if (!slug || !hasNodeIcon(slug)) return null;
  const Icon = NODE_ICONS[slug];

  return (
    <svg
      aria-hidden="true"
      className="shrink-0"
      height={size}
      viewBox="-32 -32 64 64"
      width={size}
    >
      <Icon stroke={color} />
    </svg>
  );
}
