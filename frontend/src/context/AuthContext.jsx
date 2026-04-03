import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  const loadProfile = useCallback(async (uid) => {
    if (!uid) {
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setIsProfileLoading(true);
    const { data, error } = await supabase
      .from("entrepreneurs")
      .select("*")
      .eq("id", uid)
      .maybeSingle();

    if (error) {
      console.error("Failed to load authenticated profile:", error);
      setProfile(null);
      setIsProfileLoading(false);
      return;
    }

    setProfile(data || null);
    setIsProfileLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile(user?.id || null);
  }, [loadProfile, user?.id]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function bootstrapAuth() {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error) {
        console.error("Failed to get current session:", error);
      }

      const currentSession = data?.session || null;
      setSession(currentSession);
      setUser(currentSession?.user || null);
      setIsLoading(false);
    }

    bootstrapAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null);
      setUser(nextSession?.user || null);
      setIsLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    loadProfile(user?.id || null);
  }, [loadProfile, user?.id]);

  const displayName = useMemo(() => {
    if (profile?.first_name || profile?.last_name) {
      return [profile.first_name, profile.last_name].filter(Boolean).join(" ").trim();
    }

    const metaName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.user_metadata?.first_name;

    if (typeof metaName === "string" && metaName.trim()) {
      return metaName.trim();
    }

    return user?.email || null;
  }, [profile, user]);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      displayName,
      isAuthenticated: Boolean(user),
      isLoading,
      isProfileLoading,
      refreshProfile,
      signOut,
    }),
    [
      session,
      user,
      profile,
      displayName,
      isLoading,
      isProfileLoading,
      refreshProfile,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
