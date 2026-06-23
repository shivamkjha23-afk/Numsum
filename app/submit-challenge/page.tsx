"use client";
import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui";

export default function SubmitChallenge() {
  return <AuthGate><main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Submit Challenge</h1><p className="mt-3 text-white/60">Authenticated organizations can submit production challenge records for Firestore review.</p><div className="mt-8 grid gap-5 lg:grid-cols-2"><Card><h2 className="font-display text-2xl">Organization details</h2><input placeholder="Organization ID" className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3" /><input placeholder="Primary contact" className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3" /></Card><Card><h2 className="font-display text-2xl">Challenge details</h2><input placeholder="Title" className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3" /><textarea placeholder="Description" className="mt-3 h-28 w-full rounded-xl border border-white/10 bg-black/30 p-3" /><input placeholder="Category" className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3" /></Card></div></main></AuthGate>;
}
