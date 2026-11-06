import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function RequireAdmin({ children }) {
  const { loading, session, isAdmin } = useAuth();
  const location = useLocation();
  if (loading) return <p className="p-6 text-sm text-slate-400">Verifica autorizzazione…</p>;
  if (!session) return <Navigate replace state={{ from: location }} to="/login" />;
  if (!isAdmin) return <p className="p-6 text-sm text-rose-300" role="alert">Accesso riservato agli admin.</p>;
  return children;
}
