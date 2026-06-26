"use client";
import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthModal } from "@/components/auth-modal";
import { auth } from "@/lib/firebase";
import { ensureUserProfile, isProfileComplete } from "@/lib/repositories/firestore";
import type { UserProfile } from "@/lib/types";

type PendingAuth = { message?: string; returnTo?: string; onSuccess?: () => void | Promise<void> } | null;
type AuthContextValue = { user: User | null; profile: UserProfile | null; role: UserProfile["role"] | null; loading: boolean; authReady: boolean; profileComplete: boolean; bootstrapAdminDetected: boolean; requestAuth: (options?: NonNullable<PendingAuth>) => void; closeAuth: () => void; refreshProfile: () => Promise<UserProfile | null>; };
const BOOTSTRAP_ADMIN_EMAIL = "subhshivam22@gmail.com";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingAuth, setPendingAuth] = useState<PendingAuth>(null);

  useEffect(() => onAuthStateChanged(auth, async (next) => {
    setLoading(true);
    setUser(next);
    if (!next) { console.info("[AUTH] No authenticated Firebase user"); setProfile(null); setLoading(false); return; }
    console.info("[AUTH] Firebase user detected", { uid: next.uid, email: next.email });
    try { const loadedProfile = await ensureUserProfile(next); console.info("[AUTH] Profile loaded", { uid: next.uid, email: loadedProfile.email, role: loadedProfile.role }); setProfile(loadedProfile); } catch (error) { console.error("[AUTH] Profile initialization failed", error); setProfile(null); }
    setLoading(false);
  }), []);

  const requestAuth = useCallback((options: NonNullable<PendingAuth> = {}) => setPendingAuth({ message: "Please sign in to continue", ...options }), []);
  const closeAuth = useCallback(() => setPendingAuth(null), []);
  const refreshProfile = useCallback(async () => {
    if (!auth.currentUser) { setProfile(null); return null; }
    const loadedProfile = await ensureUserProfile(auth.currentUser);
    setProfile(loadedProfile);
    return loadedProfile;
  }, []);
  const handleSuccess = useCallback(async () => { const resume = pendingAuth?.onSuccess; setPendingAuth(null); await resume?.(); }, [pendingAuth]);
  const bootstrapAdminDetected = (user?.email || "").trim().toLowerCase() === BOOTSTRAP_ADMIN_EMAIL;
  const profileComplete = isProfileComplete(profile);
  const value = useMemo(() => ({ user, profile, role: profile?.role || null, loading, authReady: !loading && (!user || Boolean(profile?.role)), profileComplete, bootstrapAdminDetected, requestAuth, closeAuth, refreshProfile }), [user, profile, loading, profileComplete, bootstrapAdminDetected, requestAuth, closeAuth, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}<AuthModal open={Boolean(pendingAuth)} onClose={closeAuth} returnTo={pendingAuth?.returnTo} message={pendingAuth?.message} onSuccess={handleSuccess} /></AuthContext.Provider>;
}

export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used inside AuthProvider"); return ctx; }
export function useIsAdmin() { const { profile } = useAuth(); return profile?.role === "admin" || profile?.role === "super_admin"; }

export function useProfileComplete() { return useAuth().profileComplete; }
