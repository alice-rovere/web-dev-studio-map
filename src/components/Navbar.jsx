import { NavLink } from "react-router-dom";
import { Map, BookOpen, ShieldAlert, Route, User } from "lucide-react";

const Navbar = () => {
  // Funzione helper per applicare le classi dinamiche di Tailwind ai link attivi
  // Sostituisci la logica dei colori del link attivo/inattivo:
  const linkClass = ({ isActive }) =>
    `inline-flex h-[34px] items-center gap-[7px] px-[10px] border border-transparent rounded-[8px] text-[12px] font-medium whitespace-nowrap transition-all duration-120 ${
      isActive
        ? "border-[#33445d] text-[#e8edf5] bg-[#192536]"
        : "text-[#b9c5d6] hover:border-[#33445d] hover:text-[#e8edf5] hover:bg-[#192536]"
    }`;

  return (
    <header className="flex min-h-13.5 items-center justify-between gap-4.5 padding-[7px_10px] border border-[rgba(51,68,93,0.9)] rounded-xl bg-[#0e1624]/92 shadow-[0_10px_30px_rgba(0,0,0,0.24)] backdrop-blur-[14px]">
      {" "}
      {/* Logo / Titolo */}
      <NavLink
        to="/"
        className="flex items-center gap-1.5 text-slate-900 text-lg font-bold no-underline"
      >
        <Map size={22} className="text-blue-600" />
        <span>DevSkillMap</span>
      </NavLink>
      {/* Navigazione Principale */}
      <nav className="flex gap-6">
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
