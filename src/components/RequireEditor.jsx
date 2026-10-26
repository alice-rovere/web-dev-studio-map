import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function RequireEditor({ children }) {
  const { loading, session, isEditor } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="font-mono text-xs text-slate-400">
          Verifica autorizzazione…
        </p>
      </div>
    );
  }

  if (!session) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (!isEditor) {
    return (
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="max-w-md w-full rounded-xl border border-rose-500/30 bg-rose-950/10 p-6 text-center">
          <ShieldAlert className="mx-auto mb-3 text-rose-400" size={28} />
          <h1 className="text-lg font-bold text-white mb-1">Accesso negato</h1>
          <p className="text-sm text-slate-400">
            Questa area è riservata agli utenti con ruolo editor o admin.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
