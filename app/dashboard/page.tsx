"use client";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { AuthModal } from "@/components/auth-modal";
import { LoadingState } from "@/components/data-states";
import { Card } from "@/components/ui";
import { auth } from "@/lib/firebase";

export default function Dashboard() {
  const [loading, setLoading] = useState(true); const [user, setUser] = useState<User | null>(null); const [modal, setModal] = useState(false);
  useEffect(() => onAuthStateChanged(auth, (next) => { setUser(next); setLoading(false); }), []);
  if (loading) return <main className="min-h-screen bg-navy px-6 py-10"><LoadingState label="Loading dashboard" /></main>;
  if (!user) return <main className="min-h-screen bg-navy px-6 py-10"><Card className="mx-auto max-w-2xl"><h1 className="font-display text-4xl">Dashboard requires sign in.</h1><p className="mt-4 text-white/65">Sign in to unlock contributor workflows.</p><ul className="mt-5 grid gap-2 text-white/70"><li>Track challenges</li><li>Create teams</li><li>Participate in competitions</li><li>Access contributor features</li></ul><button className="mt-6 rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy" onClick={() => setModal(true)}>Sign In</button></Card><AuthModal open={modal} onClose={() => setModal(false)} returnTo="/dashboard" /></main>;
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Dashboard</h1><p className="mt-3 text-white/60">Welcome back, {user.displayName || user.email}. Your live Firebase-backed workspace is ready.</p><div className="mt-8 grid gap-4 md:grid-cols-3">{["Tracked Challenges", "Teams", "Competitions", "Contributor Profile", "Notifications", "Research Uploads"].map((item) => <Card key={item}><h2 className="font-display text-2xl">{item}</h2><p className="mt-3 text-white/60">Firestore-driven records will appear here as you participate.</p></Card>)}</div></main>;
}
