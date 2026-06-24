import { AdminDashboardClient } from "@/components/admin-dashboard-client";

export default function Admin() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Admin Dashboard</h1><p className="mt-3 text-white/60">Moderate problem statements, inbox items, applications, research, knowledge, competitions, organizations, users, team members and platform statistics.</p><div className="mt-8"><AdminDashboardClient /></div></main>;
}
