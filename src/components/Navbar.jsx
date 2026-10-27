import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  BookPlus,
  LogOut,
  Map,
  Route,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useGlossary } from "../hooks/useGlossary";
import { useAuth } from "../hooks/useAuth";
import { GlossaryForm } from "./GlossaryForm";

const Navbar = () => {
  const { error, addTerm, loading: glossaryLoading } = useGlossary();
  const {
    session,
    profile,
    role,
    loading: authLoading,
    isEditor,
    signOut,
  } = useAuth();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `inline-flex h-[34px] items-center gap-[7px] px-[10px] border border-transparent rounded-[8px] text-[12px] font-medium whitespace-nowrap transition-all duration-120 ${
      isActive
        ? "border-[#33445d] text-[#e8edf5] bg-[#192536]"
        : "text-[#b9c5d6] hover:border-[#33445d] hover:text-[#e8edf5] hover:bg-[#192536]"
    }`;

  async function handleLogout() {
    await signOut();
    navigate("/");
  }

  return (
    <header className="flex min-h-13.5 items-center gap-6 p-[7px_10px] border border-[rgba(51,68,93,0.9)] rounded-xl bg-[#0e1624]/92 shadow-[0_10px_30px_rgba(0,0,0,0.24)] backdrop-blur-[14px]">
      {/* SINISTRA: Logo e Brand */}
      <NavLink
        className="flex items-center gap-1.5 text-slate-100 text-lg font-bold no-underline"
        to="/"
      >
        <Map className="text-blue-500" size={22} />
        <span>DevSkillMap</span>
      </NavLink>

      {/* SINISTRA: Menu di navigazione principale (fino a Percorso Guidato) */}
      <nav className="flex gap-6 items-center mr-auto">
        <NavLink className={linkClass} to="/linee-guida">
          <BookOpen size={18} />
          <span>Linee Guida</span>
        </NavLink>
        <NavLink className={linkClass} to="/sicurezza">
          <ShieldAlert size={18} />
          <span>Sicurezza</span>
        </NavLink>
        <NavLink className={linkClass} to="/ai-web-dev">
          <Sparkles size={18} />
          <span>AI nel Web Dev</span>
        </NavLink>
        <NavLink className={linkClass} to="/percorso-guidato">
          <Route size={18} />
          <span>Percorso Guidato</span>
        </NavLink>
      </nav>

      {/* DESTRA: Glossario (+), Separatore e Area Utente */}
      <div className="flex items-center gap-4">
        {/* Il tasto "+" appare qui a destra, solo se l'utente è Editor */}
        {isEditor && (
          <>
            <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
              <Dialog.Trigger asChild>
                <button
                  className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-[#33445d]/40 bg-[#192536]/30 text-cyan-400 hover:bg-[#192536] hover:border-[#33445d] hover:text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.05)] hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-150 cursor-pointer"
                  title="Aggiungi termine al Glossario"
                  type="button"
                >
                  <BookPlus size={16} />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-[#060b13]/60 backdrop-blur-sm animate-in fade-in duration-150" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 rounded-xl border border-[#33445d] bg-[#0e1624] shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus:outline-none animate-in fade-in zoom-in-95 duration-150">
                  <GlossaryForm
                    error={glossaryLoading ? null : error}
                    onAddTerm={addTerm}
                    onClose={() => setIsFormOpen(false)}
                  />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            {/* Separatore verticale */}
            <div className="w-px h-4 bg-[#33445d]" />
          </>
        )}

        {/* Area Autenticazione (Stato caricamento / Logged / Guest) */}
        {authLoading ? (
          <span className="text-[11px] font-mono text-slate-500">…</span>
        ) : session ? (
          <>
            {isEditor && (
              <NavLink className={linkClass} to="/admin">
                <ShieldCheck size={17} />
                <span>Admin</span>
              </NavLink>
            )}
            <div className="hidden flex-col leading-tight md:flex">
              <span className="max-w-40 truncate text-[11px] font-medium text-[#e8edf5]">
                {profile?.email ?? session.user.email}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-cyan-500">
                {role ?? "viewer"}
              </span>
            </div>
            <button
              className="inline-flex h-8.5 items-center gap-1.5 rounded-lg border border-[#33445d]/60 px-2.5 text-[11px] text-[#b9c5d6] hover:bg-[#192536] hover:text-[#e8edf5]"
              onClick={handleLogout}
              title="Esci"
              type="button"
            >
              <LogOut size={14} />
              <span className="hidden lg:inline">Esci</span>
            </button>
          </>
        ) : (
          <NavLink className={linkClass} to="/login">
            <User size={18} />
            <span>Accedi</span>
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Navbar;
