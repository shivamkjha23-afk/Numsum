import { Card } from "@/components/ui";

export default function CreateTeam() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Create Team</h1><Card className="mt-8"><p className="text-white/60">Authenticated members can create teams, invite collaborators and manage roles.</p>{["Team Name", "Focus Area", "Required Skills", "Challenge Interest"].map((field) => <input key={field} placeholder={field} className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3" />)}</Card></main>;
}
