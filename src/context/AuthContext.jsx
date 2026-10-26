import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, supabaseConfigError } from "../services/supabase";
import { AuthContext } from "./authContextStore";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let mounted = true;

    async function applySession(nextSession) {
      if (!mounted) return;

      setSession(nextSession);

      if (!nextSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role")
        .eq("id", nextSession.user.id)
        .maybeSingle();

      if (!mounted) return;

      setProfile(error ? null : data);
      setLoading(false);
    }

    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!supabase) {
      return { error: supabaseConfigError };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    return { error: error ? error.message : null };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return { error: supabaseConfigError };
    const { error } = await supabase.auth.signOut();
    return { error: error ? error.message : null };
  }, []);

  const role = profile?.role ?? null;

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      role,
      loading,
      isEditor: role === "editor" || role === "admin",
      isAdmin: role === "admin",
      signIn,
      signOut,
      configError: supabaseConfigError,
    }),
    [session, profile, role, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
