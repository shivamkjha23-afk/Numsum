"use client";
import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { EmptyState, LoadingState } from "@/components/data-states";
import { useAuth, useProfileComplete } from "@/components/auth-provider";

export function AuthGate({ children, label = "Please sign in to continue", adminOnly = false, requireComplete = true }: { children: ReactNode; label?: string; adminOnly?: boolean; requireComplete?: boolean }) {
  const { user, profile, loading, authReady, bootstrapAdminDetected, requestAuth } = useAuth();
  const profileComplete = useProfileComplete();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { if (!loading && !user) requestAuth({ message: label, returnTo: window.location.pathname }); }, [loading, user, requestAuth, label]);
  useEffect(() => {
    if (loading || !user || !authReady || adminOnly || !requireComplete || profileComplete || pathname === "/profile/complete") return;
    router.replace(`/profile/complete?returnTo=${encodeURIComponent(`${pathname}${window.location.search || ""}`)}`);
  }, [adminOnly, authReady, loading, pathname, profileComplete, requireComplete, router, user]);
  if (loading) return <LoadingState label="Loading account permissions" />;
  if (!user) return <EmptyState title="Authentication required" message={label} />;
  if (!authReady) return <div className="grid gap-4"><EmptyState title="Account permissions unavailable" message="Your Firebase profile could not be loaded. Check the temporary diagnostics below." /><div className="rounded-3xl border border-amber-300/20 bg-amber-500/10 p-5 text-sm text-white/75"><p className="text-sm uppercase tracking-[.3em] text-amber-200">Temporary auth diagnostics</p><div className="mt-3 grid gap-2 md:grid-cols-2"><p>Email: {profile?.email || user.email || "unknown"}</p><p>UID: {user.uid}</p><p>Role: {profile?.role || "unloaded"}</p><p>Profile Loaded: {profile ? "yes" : "no"}</p><p>Auth Ready: {authReady ? "yes" : "no"}</p><p>Bootstrap Admin Detected: {bootstrapAdminDetected ? "yes" : "no"}</p></div></div></div>;
  if (adminOnly && profile?.role !== "admin" && profile?.role !== "super_admin") return <div className="grid gap-4"><EmptyState title="Admin access required" message="This area is available only to administrators." /><div className="rounded-3xl border border-red-300/20 bg-red-500/10 p-5 text-sm text-white/75"><p className="text-sm uppercase tracking-[.3em] text-red-200">Temporary auth diagnostics</p><div className="mt-3 grid gap-2 md:grid-cols-2"><p>Email: {profile?.email || user?.email || "unknown"}</p><p>UID: {user?.uid || "unknown"}</p><p>Role: {profile?.role || "unloaded"}</p><p>Profile Loaded: {profile ? "yes" : "no"}</p><p>Auth Ready: {authReady ? "yes" : "no"}</p><p>Bootstrap Admin Detected: {bootstrapAdminDetected ? "yes" : "no"}</p></div></div></div>;
  if (requireComplete && !adminOnly && !profileComplete && pathname !== "/profile/complete") return <LoadingState label="Redirecting to complete your profile" />;
  return <>{children}</>;
}
