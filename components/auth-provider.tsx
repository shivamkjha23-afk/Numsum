"use client";
import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthModal } from "@/components/auth-modal";
import { auth } from "@/lib/firebase";
import { ensureUserProfile } from "@/lib/repositories/firestore";
import type { UserProfile } from "@/lib/types";

type PendingAuth = { message?: string; returnTo?: string; onSuccess?: () => void | Promise<void> } | null;
type AuthContextValue = { user: User | null; profile: UserProfile | null; role: UserProfile["role"] | null; loading: boolean; authReady: boolean; requestAuth: (options?: NonNullable<PendingAuth>) => void; closeAuth: () => void; };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingAuth, setPendingAuth] = useState<PendingAuth>(null);

  useEffect(() => onAuthStateChanged(auth, async (next) => {
    setLoading(true);
    setUser(next);
    if (!next) { setProfile(null); setLoading(false); return; }
    try { setProfile(await ensureUserProfile(next)); } catch (error) { console.error("[AUTH] Profile initialization failed", error); setProfile(null); }
    setLoading(false);
  }), []);

  const requestAuth = useCallback((options: NonNullable<PendingAuth> = {}) => setPendingAuth({ message: "Please sign in to continue", ...options }), []);
  const closeAuth = useCallback(() => setPendingAuth(null), []);
  const handleSuccess = useCallback(async () => { const resume = pendingAuth?.onSuccess; setPendingAuth(null); await resume?.(); }, [pendingAuth]);
  const value = useMemo(() => ({ user, profile, role: profile?.role || null, loading, authReady: !loading && (!user || Boolean(profile?.role)), requestAuth, closeAuth }), [user, profile, loading, requestAuth, closeAuth]);

  return <AuthContext.Provider value={value}>{children}<AuthModal open={Boolean(pendingAuth)} onClose={closeAuth} returnTo={pendingAuth?.returnTo} message={pendingAuth?.message} onSuccess={handleSuccess} /></AuthContext.Provider>;
}

export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used inside AuthProvider"); return ctx; }
export function useIsAdmin() { const { profile } = useAuth(); return profile?.role === "admin" || profile?.role === "super_admin"; }
