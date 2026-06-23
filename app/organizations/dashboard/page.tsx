import { Card } from "@/components/ui";

export default function OrganizationDashboard() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Organization Dashboard</h1><div className="mt-8 grid gap-4 md:grid-cols-3">{["Challenges", "Teams", "Submissions", "Profile", "Analytics", "Billing"].map((item) => <Card key={item}><h2 className="font-display text-2xl">{item}</h2><p className="mt-3 text-white/60">Manage organization-only workflows and private operational data.</p></Card>)}</div></main>;
}
