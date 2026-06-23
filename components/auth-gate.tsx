"use client";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, type ReactNode } from "react";
import { EmptyState, LoadingState } from "@/components/data-states";
import { Button } from "@/components/ui";
import { auth } from "@/lib/firebase";

export function AuthGate({ children, label = "Sign in to continue" }: { children: ReactNode; label?: string }) {
  const [state, setState] = useState<"loading" | "authed" | "guest">("loading");
  useEffect(() => onAuthStateChanged(auth, (user) => setState(user ? "authed" : "guest")), []);
  if (state === "loading") return <LoadingState label="Checking authentication" />;
  if (state === "guest") return <EmptyState message={label} />;
  return <>{children}</>;
}
