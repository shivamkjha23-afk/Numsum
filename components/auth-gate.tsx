"use client";
import { useEffect, type ReactNode } from "react";
import { EmptyState, LoadingState } from "@/components/data-states";
import { useAuth } from "@/components/auth-provider";

export function AuthGate({ children, label = "Please sign in to continue", adminOnly = false }: { children: ReactNode; label?: string; adminOnly?: boolean }) {
  const { user, profile, loading, requestAuth } = useAuth();
  useEffect(() => { if (!loading && !user) requestAuth({ message: label, returnTo: window.location.pathname }); }, [loading, user, requestAuth, label]);
  if (loading) return <LoadingState label="Checking authentication" />;
  if (!user) return <EmptyState title="Authentication required" message={label} />;
  if (adminOnly && profile?.role !== "admin" && profile?.role !== "super_admin") return <EmptyState title="Admin access required" message="This area is available only to administrators." />;
  return <>{children}</>;
}
