import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Map,
  BookOpen,
  ShieldAlert,
  Route,
  User,
  BookPlus,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGlossary } from "../hooks/useGlossary";
import { GlossaryForm } from "./GlossaryForm";

const Navbar = () => {
  const { error, addTerm } = useGlossary();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Funzione helper per applicare le classi dinamiche di Tailwind ai link attivi
  const linkClass = ({ isActive }) =>
    `inline-flex h-[34px] items-center gap-[7px] px-[10px] border border-transparent rounded-[8px] text-[12px] font-medium whitespace-nowrap transition-all duration-120 ${
      isActive
        ? "border-[#33445d] text-[#e8edf5] bg-[#192536]"
        : "text-[#b9c5d6] hover:border-[#33445d] hover:text-[#e8edf5] hover:bg-[#192536]"
    }`;

  return (
    <header className="flex min-h-13.5 items-center justify-around gap-4.5 p-[7px_10px] border border-[rgba(51,68,93,0.9)] rounded-xl bg-[#0e1624]/92 shadow-[0_10px_30px_rgba(0,0,0,0.24)] backdrop-blur-[14px]">
      {/* Logo / Titolo */}
      <NavLink
        to="/"
        className="flex items-center gap-1.5 text-slate-100 text-lg font-bold no-underline"
      >
        <Map size={22} className="text-blue-500" />
        <span>DevSkillMap</span>
      </NavLink>

      {/* Navigazione Principale */}
      <nav className="flex gap-6 items-center">
        <NavLink to="/linee-guida" className={linkClass}>
          <BookOpen size={18} />
          <span>Linee Guida</span>
        </NavLink>
        <NavLink to="/sicurezza" className={linkClass}>
          <ShieldAlert size={18} />
          <span>Sicurezza</span>
        </NavLink>
        <NavLink to="/percorso-guidato" className={linkClass}>
          <Route size={18} />
          <span>Percorso Guidato</span>
        </NavLink>

        {/* Divisore interno verticale */}
        <div className="w-[1px] h-4 bg-[#33445d]" />

        {/* Pulsantino Piccolo per il Glossario */}
        <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
          <Dialog.Trigger asChild>
            <button
              title="Aggiungi termine al Glossario"
              type="button"
              className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-[8px] border border-[#33445d]/40 bg-[#192536]/30 text-cyan-400 hover:bg-[#192536] hover:border-[#33445d] hover:text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.05)] hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-150 cursor-pointer"
            >
              <BookPlus size={16} />
            </button>
          </Dialog.Trigger>

          <Dialog.Portal>
            {/* Overlay Sfondo Oscurato e Sfocato */}
            <Dialog.Overlay className="fixed inset-0 z-50 bg-[#060b13]/60 backdrop-blur-sm animate-in fade-in duration-150" />

            {/* Contenitore Modale Dark Cyberpunk coordinato con i tuoi colori */}
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 rounded-xl border border-[#33445d] bg-[#0e1624] shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus:outline-none animate-in fade-in zoom-in-95 duration-150">
              <GlossaryForm
                error={error}
                onAddTerm={addTerm}
                onClose={() => setIsFormOpen(false)}
              />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </nav>

      {/* Area Utente / Login */}
      <div>
        <NavLink to="/login" className={linkClass}>
          <User size={18} />
          <span>Accedi</span>
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
