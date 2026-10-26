import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const looksLikePlaceholder = (value) =>
  !value || value.includes("la_tua") || value.includes("your-");

const isSupabaseConfigured =
  !looksLikePlaceholder(supabaseUrl) && !looksLikePlaceholder(supabaseAnonKey);

export const supabaseConfigError = isSupabaseConfigured
  ? null
  : "Supabase non configurato: imposta VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY in .env.";

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(supabaseConfigError);
  }
  return supabase;
}
