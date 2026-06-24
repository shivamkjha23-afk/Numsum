"use client";
import { onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { AuthModal } from "@/components/auth-modal";
import { Card } from "@/components/ui";
import { auth } from "@/lib/firebase";

export default function NotificationsPage() {
  const [user, setUser] = useState<User | null>(null); const [modal, setModal] = useState(false);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  if (!user) return <main className="min-h-screen bg-navy px-6 py-10"><Card className="mx-auto max-w-2xl"><h1 className="font-display text-4xl">Notifications require sign in.</h1><button className="mt-6 rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy" onClick={() => setModal(true)}>Sign In</button></Card><AuthModal open={modal} onClose={() => setModal(false)} returnTo="/notifications" /></main>;
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Notifications</h1><Card className="mt-8"><p className="text-white/60">Unread Firestore notifications for problem, research, role, career, competition, and collaboration events will appear here.</p></Card></main>;
}
