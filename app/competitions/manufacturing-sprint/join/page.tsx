import { Card } from "@/components/ui";

export default function JoinCompetition() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Join Manufacturing Reliability Sprint</h1><Card className="mt-8"><p className="text-white/60">Authenticated members can join the competition, select a team and accept participation rules.</p><input placeholder="Team or participant name" className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3" /></Card></main>;
}
