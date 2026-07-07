"use client";
import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth-gate";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AuthGate adminOnly requireComplete={false} label="Admin access requires authentication.">{children}</AuthGate>;
}
