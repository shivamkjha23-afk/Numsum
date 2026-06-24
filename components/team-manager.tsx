"use client";
import { serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { useIsAdmin } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { COLLECTIONS, createRecord, deleteRecord, updateRecord } from "@/lib/repositories/firestore";
import type { TeamMember } from "@/lib/types";

const fields = ["name", "institution", "degree", "discipline", "designation", "bio", "photoUrl", "linkedinUrl", "displayOrder"] as const;
export function TeamManager({ initialMembers }: { initialMembers: TeamMember[] }) {
  const isAdmin = useIsAdmin();
  const [members, setMembers] = useState(initialMembers);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [message, setMessage] = useState("");
  async function save(formData: FormData) {
    setMessage("Saving team member...");
    const payload: Record<string, unknown> = Object.fromEntries(formData.entries());
    payload.displayOrder = Number(payload.displayOrder || members.length + 1);
    try {
      if (editing?.id) { await updateRecord(COLLECTIONS.teamMembers, editing.id, payload); setMembers((rows) => rows.map((row) => row.id === editing.id ? { ...row, ...payload } as TeamMember : row).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))); }
      else { const created = await createRecord<TeamMember>(COLLECTIONS.teamMembers, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); setMembers((rows) => [...rows, { id: created.id, ...payload } as TeamMember].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))); }
      setEditing(null); setMessage("Team directory updated.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update team member."); }
  }
  async function remove(member: TeamMember) { await deleteRecord(COLLECTIONS.teamMembers, member.id); setMembers((rows) => rows.filter((row) => row.id !== member.id)); setMessage("Team member removed."); }
  return <><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{members.map((member) => <Card key={member.id}><div className="flex gap-4">{member.photoUrl && <img src={member.photoUrl} alt="" className="h-16 w-16 rounded-2xl object-cover" />}<div><h2 className="font-display text-2xl">{member.name}</h2><p className="mt-2 text-blue-300">{member.designation || member.institution}</p></div></div><p className="mt-3 text-white/70">{[member.degree, member.discipline, member.institution].filter(Boolean).join(" · ")}</p>{member.bio && <p className="mt-4 text-sm text-white/55">{member.bio}</p>}<div className="mt-4 flex flex-wrap gap-2 text-sm">{member.linkedinUrl && <a className="text-blue-300 underline" href={member.linkedinUrl}>LinkedIn</a>}</div>{isAdmin && <div className="mt-5 flex gap-2"><button className="rounded-full bg-blue-400/20 px-4 py-2 text-blue-100" onClick={() => setEditing(member)}>Edit</button><button className="rounded-full bg-red-500/20 px-4 py-2 text-red-100" onClick={() => remove(member)}>Remove</button></div>}</Card>)}</div>{isAdmin && <Card className="mt-8"><h2 className="font-display text-2xl">{editing ? `Edit ${editing.name}` : "Add Team Member"}</h2><form action={save} className="mt-4 grid gap-3 md:grid-cols-2">{fields.map((field) => field === "bio" ? <textarea key={field} name={field} defaultValue={String(editing?.[field] || "")} placeholder={field} className="rounded-xl border border-white/10 bg-black/30 p-3 md:col-span-2" /> : <input key={field} name={field} type={field === "displayOrder" ? "number" : "text"} defaultValue={String(editing?.[field] || "")} required={field === "name"} placeholder={field} className="rounded-xl border border-white/10 bg-black/30 p-3" />)}<button className="rounded-full bg-white px-5 py-3 font-semibold text-black">Save Team Member</button>{editing && <button type="button" className="rounded-full border border-white/10 px-5 py-3" onClick={() => setEditing(null)}>Cancel</button>}</form>{message && <p className="mt-3 text-white/60">{message}</p>}</Card>}</>;
}
