"use client";
import { serverTimestamp } from "firebase/firestore";
import { useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { createCompetitionTeam, getUsers } from "@/lib/repositories/firestore";
import type { UserProfile } from "@/lib/types";

function CreateTeamForm() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<UserProfile[]>([]);
  const [invites, setInvites] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  async function search(value: string) { setQuery(value); if (value.trim().length < 2) return; try { setUsers(await getUsers(100)); } catch { setUsers([]); } }
  const matches = useMemo(() => users.filter((u) => `${u.name || ""} ${u.email || ""}`.toLowerCase().includes(query.toLowerCase())).filter((u) => u.id !== user?.uid && !selected.some((s) => s.id === u.id)).slice(0, 6), [users, query, selected, user?.uid]);
  function addInvite() { const email = query.trim().toLowerCase(); if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && !invites.includes(email)) { setInvites((rows) => [...rows, email]); setQuery(""); } }
  async function submit(formData: FormData) {
    if (!user) return;
    setMessage("Creating team...");
    try {
      await createCompetitionTeam({ competitionId: String(formData.get("competitionId") || "general"), name: String(formData.get("name") || ""), leader: user.uid, members: selected.map((u) => u.id), inviteEmails: invites, focusArea: String(formData.get("focusArea") || ""), requiredSkills: String(formData.get("skills") || "").split(",").map((x) => x.trim()).filter(Boolean), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never);
      setMessage(invites.length ? `Team created. Invite emails queued for: ${invites.join(", ")}.` : "Team created.");
    } catch (e) { setMessage(e instanceof Error ? e.message : "Unable to create team."); }
  }
  return <Card className="mt-8"><p className="text-white/60">Create a team, select existing users, or add invite emails for collaborators who have not joined yet.</p><form action={submit} className="mt-4 grid gap-4"><input name="name" required placeholder="Team Name" className="rounded-xl border border-white/10 bg-black/30 p-3" /><input name="focusArea" placeholder="Focus Area" className="rounded-xl border border-white/10 bg-black/30 p-3" /><input name="skills" placeholder="Required Skills (comma-separated)" className="rounded-xl border border-white/10 bg-black/30 p-3" /><input name="competitionId" placeholder="Competition ID (optional)" className="rounded-xl border border-white/10 bg-black/30 p-3" /><div><label className="text-sm text-white/60">Find members by email or name</label><div className="mt-2 flex gap-2"><input value={query} onChange={(e) => search(e.target.value)} placeholder="person@example.com" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 p-3" /><button type="button" onClick={addInvite} className="rounded-xl border border-white/10 px-4">Invite email</button></div>{matches.length > 0 && <div className="mt-2 rounded-2xl border border-white/10 bg-black/30 p-2">{matches.map((u) => <button type="button" key={u.id} onClick={() => { setSelected((rows) => [...rows, u]); setQuery(""); }} className="block w-full rounded-xl p-2 text-left hover:bg-white/10">{u.name || u.email} <span className="text-white/40">{u.email}</span></button>)}</div>}</div><div className="flex flex-wrap gap-2">{selected.map((u) => <span key={u.id} className="rounded-full bg-blue-500/20 px-3 py-1 text-blue-100">{u.name || u.email}</span>)}{invites.map((email) => <span key={email} className="rounded-full bg-amber-500/20 px-3 py-1 text-amber-100">Invite: {email}</span>)}</div><button className="rounded-full bg-white px-5 py-3 font-semibold text-black">Create Team</button></form>{message && <p className="mt-3 text-white/60">{message}</p>}</Card>;
}
export default function CreateTeam() { return <AuthGate><main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Create Team</h1><CreateTeamForm /></main></AuthGate>; }
