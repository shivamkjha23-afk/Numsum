"use client";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";

function DashboardContent() {
  const { user } = useAuth();
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Dashboard</h1><p className="mt-3 text-white/60">Welcome back, {user?.displayName || user?.email}. Your live Firebase-backed workspace is ready.</p><div className="mt-8 grid gap-4 md:grid-cols-3">{["Tracked Challenges", "Teams", "Competitions", "Contributor Profile", "Notifications", "Research Uploads"].map((item) => <Card key={item}><h2 className="font-display text-2xl">{item}</h2><p className="mt-3 text-white/60">Firestore-driven records will appear here as you participate.</p></Card>)}</div></main>;
}
export default function Dashboard() { return <AuthGate><DashboardContent /></AuthGate>; }
