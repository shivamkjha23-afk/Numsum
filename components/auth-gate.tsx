"use client";
import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { EmptyState, LoadingState } from "@/components/data-states";
import { useAuth, useProfileComplete } from "@/components/auth-provider";

export function AuthGate({ children, label = "Please sign in to continue", adminOnly = false, requireComplete = true }: { children: ReactNode; label?: string; adminOnly?: boolean; requireComplete?: boolean }) {
  const { user, profile, loading, authReady, requestAuth } = useAuth();
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
  if (!authReady) return <EmptyState title="Account permissions unavailable" message="Your Firebase profile could not be loaded. Please refresh or contact support if this continues." />;
  if (adminOnly && profile?.role !== "admin" && profile?.role !== "super_admin") return <EmptyState title="Admin access required" message="This area is available only to administrators." />;
  if (requireComplete && !adminOnly && !profileComplete && pathname !== "/profile/complete") return <LoadingState label="Redirecting to complete your profile" />;
  return <>{children}</>;
}
