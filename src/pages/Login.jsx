import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { KeyRound, LogIn, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { session, signIn, configError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (session) {
      navigate(redirectTo, { replace: true });
    }
  }, [session, navigate, redirectTo]);

  if (session) {
    return <Navigate replace to={redirectTo} />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Inserisci email e password.");
      return;
    }

    setIsSubmitting(true);
    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center p-6 overflow-y-auto">
      <div className="w-full max-w-sm rounded-xl border border-[#33445d] bg-[#0e1624] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
        <div className="mb-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-500 mb-1">
            &gt;_ access control
          </p>
          <h1 className="text-xl font-bold text-white">Accedi a DevSkillMap</h1>
          <p className="mt-1 text-xs text-slate-400">
            Le credenziali sono gestite da Supabase Auth. La registrazione
            pubblica è disattivata.
          </p>
        </div>

        {configError && (
          <p className="mb-4 rounded-md border border-amber-500/30 bg-amber-950/20 px-3 py-2 text-xs text-amber-300">
            {configError}
          </p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b9c5d6]">
              Email
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-[#33445d] bg-[#0b1120] px-3 py-2 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30">
              <Mail className="text-slate-500" size={15} />
              <input
                autoComplete="email"
                autoFocus
                className="w-full bg-transparent text-sm text-[#e8edf5] outline-none placeholder:text-[#53657d]"
                disabled={isSubmitting}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="editor@example.com"
                required
                type="email"
                value={email}
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b9c5d6]">
              Password
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-[#33445d] bg-[#0b1120] px-3 py-2 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/30">
              <KeyRound className="text-slate-500" size={15} />
              <input
                autoComplete="current-password"
                className="w-full bg-transparent text-sm text-[#e8edf5] outline-none placeholder:text-[#53657d]"
                disabled={isSubmitting}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                required
                type="password"
                value={password}
              />
            </span>
          </label>

          {error && (
            <p
              aria-live="polite"
              className="rounded-md border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs text-rose-300"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            className="mt-1 flex h-10 items-center justify-center gap-2 rounded-lg bg-cyan-400 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting || Boolean(configError)}
            type="submit"
          >
            <LogIn size={15} />
            {isSubmitting ? "Accesso…" : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
}
