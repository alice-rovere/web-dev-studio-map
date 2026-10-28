import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  LogOut,
  Map,
  Menu,
  Route,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { to: "/linee-guida", label: "Linee Guida", icon: BookOpen },
  { to: "/sicurezza", label: "Sicurezza", icon: ShieldAlert },
  { to: "/ai-web-dev", label: "AI nel Web Dev", icon: Sparkles },
  { to: "/percorso-guidato", label: "Percorso Guidato", icon: Route },
];

const ACTIVE_CLASSES = "border-[#33445d] text-[#e8edf5] bg-[#192536]";
const INACTIVE_CLASSES =
  "border-transparent text-[#b9c5d6] hover:border-[#33445d] hover:text-[#e8edf5] hover:bg-[#192536]";

const Navbar = () => {
  const {
    session,
    profile,
    role,
    loading: authLoading,
    isEditor,
    signOut,
  } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `inline-flex h-[34px] items-center gap-[7px] px-[10px] border rounded-[8px] text-[12px] font-medium whitespace-nowrap transition-all duration-120 ${
      isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex min-h-11 w-full items-center gap-2.5 rounded-lg border px-3 text-sm font-medium transition-colors ${
      isActive ? ACTIVE_CLASSES : INACTIVE_CLASSES
    }`;

  async function handleLogout() {
    setIsMenuOpen(false);
    await signOut();
    navigate("/");
  }

  return (
    <>
      <header className="flex min-h-14 items-center gap-2 border border-[rgba(51,68,93,0.9)] rounded-xl bg-[#0e1624]/92 p-[7px_10px] shadow-[0_10px_30px_rgba(0,0,0,0.24)] backdrop-blur-[14px] sm:gap-4 sm:px-3 lg:gap-6">
        {/* SINISTRA: Logo e Brand */}
        <NavLink
          className="flex shrink-0 items-center gap-1.5 text-base font-bold text-slate-100 no-underline sm:text-lg"
          onClick={() => setIsMenuOpen(false)}
          to="/"
        >
          <Map className="text-blue-500" size={22} />
          <span>DevSkillMap</span>
        </NavLink>

        {/* DESKTOP: Menu di navigazione principale */}
        <nav className="mr-auto hidden items-center gap-2 lg:flex xl:gap-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink className={linkClass} key={to} to={to}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* DESKTOP: Glossario, Separatore e Area Utente */}
        <div className="hidden items-center gap-2 lg:flex lg:gap-4">
          <NavLink
            aria-label="Glossario"
            className={({ isActive }) =>
              `inline-flex h-8.5 w-8.5 items-center justify-center rounded-lg border shadow-[0_0_10px_rgba(34,211,238,0.05)] transition-all duration-150 ${
                isActive
                  ? "border-cyan-400/50 bg-[#192536] text-cyan-300"
                  : "border-[#33445d]/40 bg-[#192536]/30 text-cyan-400 hover:border-[#33445d] hover:bg-[#192536] hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              }`
            }
            title="Glossario"
            to="/glossario"
          >
            <BookOpen size={16} />
          </NavLink>
          <div className="h-4 w-px bg-[#33445d]" />

          {authLoading ? (
            <span className="font-mono text-[11px] text-slate-500">…</span>
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

        {/* MOBILE: Menu hamburger */}
        <Dialog.Root open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <Dialog.Trigger asChild>
            <button
              aria-label="Apri menu"
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#33445d]/60 text-[#b9c5d6] transition-colors hover:bg-[#192536] hover:text-[#e8edf5] lg:hidden"
              type="button"
            >
              <Menu size={20} />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-[#060b13]/70 backdrop-blur-sm lg:hidden" />
            <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-dvh w-[min(88vw,340px)] flex-col border-l border-[#33445d] bg-[#0e1624] px-4 pt-[calc(1rem+env(safe-area-inset-top))] pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] focus:outline-none lg:hidden">
              <div className="flex items-center justify-between border-b border-[#33445d]/70 pb-3">
                <Dialog.Title className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                  Menu
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    aria-label="Chiudi menu"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#33445d]/60 text-[#b9c5d6] hover:bg-[#192536] hover:text-[#e8edf5]"
                    type="button"
                  >
                    <X size={18} />
                  </button>
                </Dialog.Close>
              </div>

              <nav className="mt-4 flex flex-col gap-1.5">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    className={mobileLinkClass}
                    key={to}
                    onClick={() => setIsMenuOpen(false)}
                    to={to}
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                ))}
                <NavLink
                  className={mobileLinkClass}
                  onClick={() => setIsMenuOpen(false)}
                  to="/glossario"
                >
                  <BookOpen size={18} />
                  <span>Glossario</span>
                </NavLink>
                {session && isEditor && (
                  <NavLink
                    className={mobileLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                    to="/admin"
                  >
                    <ShieldCheck size={18} />
                    <span>Admin</span>
                  </NavLink>
                )}
              </nav>

              <div className="mt-auto space-y-3 border-t border-[#33445d]/60 pt-4">
                {authLoading ? (
                  <span className="font-mono text-[11px] text-slate-500">
                    …
                  </span>
                ) : session ? (
                  <>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium text-[#e8edf5]">
                        {profile?.email ?? session.user.email}
                      </p>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-500">
                        {role ?? "viewer"}
                      </p>
                    </div>

                    <button
                      className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#33445d]/60 px-3 text-xs font-medium text-[#b9c5d6] transition-colors hover:bg-[#192536] hover:text-[#e8edf5]"
                      onClick={handleLogout}
                      type="button"
                    >
                      <LogOut size={16} />
                      Esci
                    </button>
                  </>
                ) : (
                  <NavLink
                    className={mobileLinkClass}
                    onClick={() => setIsMenuOpen(false)}
                    to="/login"
                  >
                    <User size={18} />
                    <span>Accedi</span>
                  </NavLink>
                )}
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </header>
    </>
  );
};

export default Navbar;
