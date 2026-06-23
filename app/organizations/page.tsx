import { Button, Card } from "@/components/ui";

const organizations = ["PrecisionWorks MSME Cluster", "BlueLine Automation", "GreenGrid Energy", "ForgeLab Manufacturing"];

export default function Organizations() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Organizations</h1><p className="mt-3 text-white/60">Browse public organization profiles, sectors, capabilities and active challenges.</p><div className="mt-6"><Button href="/organizations/dashboard">Organization Dashboard</Button></div><div className="mt-8 grid gap-4 md:grid-cols-2">{organizations.map((organization) => <Card key={organization}><p className="text-blue-300">Public profile</p><h2 className="mt-2 font-display text-2xl">{organization}</h2><p className="mt-3 text-white/60">Capabilities, focus areas, posted challenges and collaboration interests.</p></Card>)}</div></main>;
}
