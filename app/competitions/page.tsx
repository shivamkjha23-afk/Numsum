import { Button, Card } from "@/components/ui";

const competitions = [{ id: "manufacturing-sprint", title: "Manufacturing Reliability Sprint", timeline: "6 weeks", status: "Open" }, { id: "energy-optimization", title: "MSME Energy Optimization Challenge", timeline: "8 weeks", status: "Upcoming" }];

export default function Competitions() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Competitions</h1><p className="mt-3 text-white/60">Explore public competitions, challenge briefs, timelines and prizes before joining.</p><div className="mt-8 grid gap-4 md:grid-cols-2">{competitions.map((competition) => <Card key={competition.id}><p className="text-blue-300">{competition.status} · {competition.timeline}</p><h2 className="mt-2 font-display text-2xl">{competition.title}</h2><p className="mt-3 text-white/60">Public rules, judging criteria and resources are available to every visitor.</p>{competition.id === "manufacturing-sprint" && <div className="mt-5"><Button href="/competitions/manufacturing-sprint/join">Join Competition</Button></div>}</Card>)}</div></main>;
}
