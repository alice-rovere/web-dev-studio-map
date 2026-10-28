import { AlertTriangle, Info, Lightbulb, OctagonAlert } from "lucide-react";
import GlossaryText from "../GlossaryText";

const CALLOUT_VARIANTS = {
  note: {
    label: "Nota",
    Icon: Info,
    box: "border-sky-500/30 bg-sky-950/20",
    accent: "text-sky-300",
  },
  tip: {
    label: "Suggerimento",
    Icon: Lightbulb,
    box: "border-emerald-500/30 bg-emerald-950/20",
    accent: "text-emerald-300",
  },
  warning: {
    label: "Attenzione",
    Icon: AlertTriangle,
    box: "border-amber-500/30 bg-amber-950/20",
    accent: "text-amber-300",
  },
  danger: {
    label: "Pericolo",
    Icon: OctagonAlert,
    box: "border-rose-500/30 bg-rose-950/20",
    accent: "text-rose-300",
  },
};

export function CalloutView({ payload }) {
  const variant = CALLOUT_VARIANTS[payload.variant] ?? CALLOUT_VARIANTS.note;
  const { Icon } = variant;

  return (
    <aside className={`my-4 flex gap-3 rounded-lg border p-3 ${variant.box}`}>
      <Icon aria-hidden="true" className={`mt-0.5 shrink-0 ${variant.accent}`} size={16} />
      <div className="min-w-0">
        <p className={`font-mono text-[11px] font-semibold uppercase tracking-wider ${variant.accent}`}>
          <GlossaryText>{payload.title || variant.label}</GlossaryText>
        </p>
        {payload.text && (
          <p className="mt-1 whitespace-pre-line text-sm font-light leading-relaxed text-zinc-300">
            <GlossaryText>{payload.text}</GlossaryText>
          </p>
        )}
      </div>
    </aside>
  );
}

export function CalloutEditor({ payload, update, fieldClass, Label }) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-[180px_1fr]">
        <label className="block">
          <Label>Tipo</Label>
          <select
            className={fieldClass}
            onChange={(event) =>
              update((previous) => ({ ...previous, variant: event.target.value }))
            }
            value={payload.variant}
          >
            {Object.entries(CALLOUT_VARIANTS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <Label>Titolo (facoltativo)</Label>
          <input
            className={fieldClass}
            onChange={(event) =>
              update((previous) => ({ ...previous, title: event.target.value }))
            }
            value={payload.title}
          />
        </label>
      </div>
      <label className="block">
        <Label>Testo</Label>
        <textarea
          className={`${fieldClass} min-h-20 resize-y`}
          onChange={(event) =>
            update((previous) => ({ ...previous, text: event.target.value }))
          }
          value={payload.text}
        />
      </label>
    </div>
  );
}
