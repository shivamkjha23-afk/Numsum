"use client";
import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthModal } from "@/components/auth-modal";
import { auth } from "@/lib/firebase";
import { ensureUserProfile, isProfileComplete } from "@/lib/repositories/firestore";
import type { UserProfile } from "@/lib/types";

type PendingAuth = { message?: string; returnTo?: string; onSuccess?: () => void | Promise<void> } | null;
type AuthContextValue = { user: User | null; profile: UserProfile | null; role: UserProfile["role"] | null; loading: boolean; authReady: boolean; profileComplete: boolean; requestAuth: (options?: NonNullable<PendingAuth>) => void; closeAuth: () => void; refreshProfile: () => Promise<UserProfile | null>; };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingAuth, setPendingAuth] = useState<PendingAuth>(null);
  const [profileError, setProfileError] = useState("");

  useEffect(() => onAuthStateChanged(auth, async (next) => {
    setLoading(true);
    setUser(next);
    if (!next) { setProfile(null); setProfileError(""); setLoading(false); return; }
    try { setProfileError(""); const loadedProfile = await ensureUserProfile(next); setProfile(loadedProfile); } catch { setProfileError("Could not create member profile. Please retry or contact admin."); setProfile(null); }
    setLoading(false);
  }), []);

  const requestAuth = useCallback((options: NonNullable<PendingAuth> = {}) => setPendingAuth({ message: "Please sign in to continue", ...options }), []);
  const closeAuth = useCallback(() => setPendingAuth(null), []);
  const refreshProfile = useCallback(async () => {
    if (!auth.currentUser) { setProfile(null); return null; }
    setProfileError("");
    const loadedProfile = await ensureUserProfile(auth.currentUser);
    setProfile(loadedProfile);
    return loadedProfile;
  }, []);
  const handleSuccess = useCallback(async () => { const resume = pendingAuth?.onSuccess; setPendingAuth(null); await resume?.(); }, [pendingAuth]);
  const profileComplete = isProfileComplete(profile);
  // Profile completion is enforced only by protected member action routes via AuthGate.
  // Incomplete members can still browse public pages and learn the platform before acting.
  const value = useMemo(() => ({ user, profile, role: profile?.role || null, loading, authReady: !loading && (!user || Boolean(profile?.role)), profileComplete, requestAuth, closeAuth, refreshProfile }), [user, profile, loading, profileComplete, requestAuth, closeAuth, refreshProfile]);

  return <AuthContext.Provider value={value}>{profileError && <div className="fixed left-4 right-4 top-4 z-[120] rounded-2xl border border-red-300/30 bg-red-950/95 p-4 text-sm text-red-50 shadow-2xl">{profileError}</div>}{children}<AuthModal open={Boolean(pendingAuth)} onClose={closeAuth} returnTo={pendingAuth?.returnTo} message={pendingAuth?.message} onSuccess={handleSuccess} /></AuthContext.Provider>;
}

export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error("useAuth must be used inside AuthProvider"); return ctx; }
export function useIsAdmin() { const { profile } = useAuth(); return profile?.role === "admin" || profile?.role === "super_admin"; }

export function useProfileComplete() { return useAuth().profileComplete; }
