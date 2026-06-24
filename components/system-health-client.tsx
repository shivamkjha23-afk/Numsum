"use client";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { ErrorState, LoadingState } from "@/components/data-states";
import { Card } from "@/components/ui";
import { getSystemHealthCounts } from "@/lib/repositories/firestore";

type Counts = Awaited<ReturnType<typeof getSystemHealthCounts>>;

function HealthContent() {
  const { user, profile, role } = useAuth();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { let mounted = true; getSystemHealthCounts().then((data) => { if (mounted) setCounts(data); }).catch((err) => { if (mounted) setError(err instanceof Error ? err.message : "Unable to load system health."); }); return () => { mounted = false; }; }, []);
  if (error) return <ErrorState retryHref="/admin/system-health" message={error} />;
  if (!counts) return <LoadingState label="Checking Firestore" />;
  const rows = [["Users", counts.users], ["Problems", counts.problems], ["Research", counts.research], ["Competitions", counts.competitions], ["Knowledge Assets", counts.knowledgeAssets], ["Notifications", counts.notifications], ["Inbox Items", counts.inboxItems], ["Current User", user?.email || user?.uid || "unknown"], ["Current Role", role || profile?.role || "unloaded"], ["Firebase Status", Object.values(counts).some((value) => value === null) ? "partial access" : "connected"]] as const;
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{rows.map(([label, value]) => <Card key={label}><p className="text-sm uppercase tracking-[.25em] text-blue-300">{label}</p><p className="mt-3 text-2xl text-white">{value ?? "permission denied"}</p></Card>)}</div>;
}
export function SystemHealthClient() { return <AuthGate adminOnly label="Admin access requires authentication."><HealthContent /></AuthGate>; }
