import { AuthGate } from "@/components/auth-gate";
import { AdminPanel } from "@/components/admin-panel";
import { ErrorState } from "@/components/data-states";
import { getChallenges, getOrganizations, getPlatformStats, getUsers } from "@/lib/repositories/firestore";

export default async function Admin() {
  try {
    const [challenges, organizations, users, stats] = await Promise.all([getChallenges(100), getOrganizations(100), getUsers(100), getPlatformStats()]);
    return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Admin Dashboard</h1><div className="mt-8"><AuthGate label="Admin access requires authentication."><AdminPanel challenges={challenges} organizations={organizations} users={users} stats={stats} /></AuthGate></div></main>;
  } catch (error) {
    return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Admin Dashboard</h1><div className="mt-8"><ErrorState retryHref="/admin" message={error instanceof Error ? error.message : "Unable to load admin data."} /></div></main>;
  }
}
