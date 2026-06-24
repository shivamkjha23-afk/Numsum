import { Card } from "@/components/ui";

const members = [
  ["Roopveer Jha", "IIT Dhanbad", "Mechanical Engineering"],
  ["Vickey Sharma", "NIT Nagpur", "Electrical Engineering"],
  ["Stephen Jain", "RGIPT", "Chemical Engineering"],
  ["Aderid Jeph", "NSUT", "Electrical Engineering"],
  ["Ramesh Kumar", "NIT Surathkal", "Mechanical Engineering"],
];

export default function TeamPage() {
  return <main className="min-h-screen bg-navy px-6 py-10"><p className="text-sm uppercase tracking-[.35em] text-blue-300">Our Team</p><h1 className="mt-3 font-display text-5xl">NumSum Team</h1><p className="mt-3 max-w-3xl text-white/60">A multidisciplinary founding team focused on converting industrial and societal problem statements into validated solutions.</p><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{members.map(([name, institution, discipline]) => <Card key={name}><h2 className="font-display text-2xl">{name}</h2><p className="mt-3 text-blue-300">{institution}</p><p className="mt-2 text-white/70">{discipline}</p><p className="mt-4 text-sm text-white/45">Expertise and LinkedIn details can be attached from Firestore as the public team directory grows.</p></Card>)}</div></main>;
}
