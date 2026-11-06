import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { GlossaryForm } from "./GlossaryForm";
import { useGlossary } from "../../hooks/useGlossary";

export default function QuickGlossaryAdd({ className }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addTerm } = useGlossary();

  return (
    <Dialog.Root open={open} onOpenChange={(nextOpen) => { if (!saving) setOpen(nextOpen); }}>
      <Dialog.Trigger asChild>
        <button className={className} title="Aggiungi termine" type="button">
          <Plus size={14} />
          <span>Aggiungi termine</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-100 bg-[#060b13]/75 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-101 max-h-[90dvh] w-[min(94vw,36rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-[#33445d] bg-[#0b1120] p-5 shadow-2xl focus:outline-none"
          onEscapeKeyDown={(event) => { if (saving) event.preventDefault(); }}
          onPointerDownOutside={(event) => { if (saving) event.preventDefault(); }}
        >
          <Dialog.Title className="sr-only">Nuovo termine</Dialog.Title>
          <GlossaryForm onAddTerm={addTerm} onClose={() => setOpen(false)} onSubmittingChange={setSaving} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
