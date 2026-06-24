import { TeamManager } from "@/components/team-manager";
import { getTeamMembers } from "@/lib/repositories/firestore";

const fallbackMembers = [
  { id: "roopveer-jha", name: "Roopveer Jha", institution: "IIT Dhanbad", discipline: "Mechanical Engineering", displayOrder: 1 },
  { id: "vickey-sharma", name: "Vickey Sharma", institution: "NIT Nagpur", discipline: "Electrical Engineering", displayOrder: 2 },
  { id: "stephen-jain", name: "Stephen Jain", institution: "RGIPT", discipline: "Chemical Engineering", displayOrder: 3 },
  { id: "aderid-jeph", name: "Aderid Jeph", institution: "NSUT", discipline: "Electrical Engineering", displayOrder: 4 },
  { id: "ramesh-kumar", name: "Ramesh Kumar", institution: "NIT Surathkal", discipline: "Mechanical Engineering", displayOrder: 5 },
];

export default async function TeamPage() {
  const members = await getTeamMembers().catch(() => []);
  return <main className="min-h-screen bg-navy px-6 py-10"><p className="text-sm uppercase tracking-[.35em] text-blue-300">Our Team</p><h1 className="mt-3 font-display text-5xl">NumSum Team</h1><p className="mt-3 max-w-3xl text-white/60">A multidisciplinary founding team focused on converting industrial and societal problem statements into validated solutions.</p><TeamManager initialMembers={members.length ? members : fallbackMembers} /></main>;
}
