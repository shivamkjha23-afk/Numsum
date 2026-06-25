import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { Button, Card } from "@/components/ui";
import { getSubmittedProblemStatements } from "@/lib/repositories/firestore";

export default async function Admin() {
  const pendingProblems = await getSubmittedProblemStatements().then((rows) => rows.length).catch(() => null);
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Admin Dashboard</h1><p className="mt-3 text-white/60">Moderate problem statements, inbox items, applications, research, knowledge, competitions, organizations, users, team members and platform statistics.</p><div className="mt-6 grid gap-4 md:grid-cols-[320px_1fr]"><Card><p className="text-sm uppercase tracking-[.25em] text-blue-300">Problem Review</p><p className="mt-3 text-3xl text-white">{pendingProblems ?? "—"}</p><p className="mt-2 text-sm text-white/60">Submitted or under-review MSME problems awaiting review.</p><div className="mt-5"><Button href="/admin/problems">Open Problem Review</Button></div></Card><div><AdminDashboardClient /></div></div></main>;
}
