import { Button, Card } from "@/components/ui";

const research = ["Predictive Maintenance Benchmarks", "Low-cost Vision Inspection", "MSME Energy Optimization", "Supply Chain Resilience"];

export default function Research() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Research Library</h1><p className="mt-3 text-white/60">Browse public research, methods, experiments and implementation notes from the NumSum ecosystem.</p><div className="mt-6"><Button href="/research/upload">Upload Research</Button></div><div className="mt-8 grid gap-4 md:grid-cols-2">{research.map((item) => <Card key={item}><p className="text-blue-300">Public research</p><h2 className="mt-2 font-display text-2xl">{item}</h2><p className="mt-3 text-white/60">Open summary, datasets, findings and practical next steps for teams and organizations.</p></Card>)}</div></main>;
}
