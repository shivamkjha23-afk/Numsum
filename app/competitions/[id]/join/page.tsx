"use client";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { createCompetitionTeam, getCompetitionById, registerForCompetition } from "@/lib/repositories/firestore";
import type { Competition } from "@/lib/types";

export default function JoinCompetition({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => { params.then(({ id }) => { setId(id); getCompetitionById(id).then(setCompetition); }); }, [params]);
  async function register() { if (!user || !competition) return; await registerForCompetition(competition, user.uid); setMessage("Registered for competition."); }
  async function createTeam(formData: FormData) { if (!user || !id) return; await createCompetitionTeam({ competitionId: id, name: String(formData.get("name") || ""), leader: user.uid, members: [user.uid] }); setMessage("Team created and linked to competition."); }
  return <AuthGate><main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Join {competition?.title || "Competition"}</h1><Card className="mt-8"><p className="text-white/60">Authenticated members can register, create a team, join team workflows, and submit solutions from the competition detail page.</p><button onClick={register} className="mt-4 rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Register</button><form action={createTeam} className="mt-4 grid gap-3"><input name="name" required placeholder="Team name" className="rounded-xl border border-white/10 bg-black/30 p-3" /><button className="rounded-full bg-white px-5 py-3 font-semibold text-black">Create Team</button></form>{message && <p className="mt-3 text-white/60">{message}</p>}</Card></main></AuthGate>;
}
