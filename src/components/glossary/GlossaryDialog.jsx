import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function GlossaryDialog({
  open,
  onOpenChange,
  term,
  children,
  saving = false,
  onCloseAutoFocus,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-100 bg-[#060b13]/75 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-101 flex max-h-[85dvh] w-[min(94vw,36rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-slate-700 bg-[#0b1120] p-5 shadow-2xl focus:outline-none"
          onCloseAutoFocus={onCloseAutoFocus}
          onEscapeKeyDown={(event) => { if (saving) event.preventDefault(); }}
          onPointerDownOutside={(event) => { if (saving) event.preventDefault(); }}
        >
          <div className="mb-4 flex items-start justify-between gap-3 border-b border-slate-800 pb-4">
            <Dialog.Title className="min-w-0 wrap-break-word text-lg font-bold text-cyan-300">
              {term?.term}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button aria-label="Chiudi" className="rounded p-1 text-slate-400 hover:text-white" disabled={saving} type="button"><X size={18} /></button>
            </Dialog.Close>
          </div>
          <div className="min-h-0 overflow-y-auto">
            {children ?? (
              <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-slate-300">{term?.definition}</p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
