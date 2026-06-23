import { EmptyState, ErrorState } from "@/components/data-states";
import { Button, Card } from "@/components/ui";
import { getOrganizationStats, getOrganizations } from "@/lib/repositories/firestore";
import type { Organization, OrganizationStats } from "@/lib/types";

function OrganizationGrid({ organizations }: { organizations: Organization[] }) {
  if (organizations.length === 0) {
    return <EmptyState message="No organizations have been published yet. Public organization profiles will appear here after Firestore records are created." />;
  }

  return <div className="mt-8 grid gap-4 md:grid-cols-2">{organizations.map((organization) => <Card key={organization.id}><p className="text-blue-300">{[organization.industry, organization.location].filter(Boolean).join(" · ") || "Public profile"}</p><h2 className="mt-2 font-display text-2xl">{organization.name}</h2><p className="mt-3 text-white/60">{organization.description || "Capabilities, focus areas, posted challenges and collaboration interests will appear here."}</p>{typeof organization.activeChallenges === "number" && <p className="mt-3 text-sm text-white/50">{organization.activeChallenges} active challenges</p>}</Card>)}</div>;
}

function OrganizationStats({ stats }: { stats: OrganizationStats }) {
  if (stats.organizations === 0 && stats.challenges === 0) {
    return <EmptyState message="Organization statistics will appear after organizations or challenges are added to Firestore." />;
  }

  return <Card className="mt-8 grid gap-6 md:grid-cols-2">{[[stats.organizations, "Organizations"], [stats.challenges, "Published Challenges"]].map(([value, label]) => <div key={label}><div className="font-display text-4xl text-blue-300">{value}</div><div className="text-white/60">{label}</div></div>)}</Card>;
}

export default async function Organizations() {
  let organizations: Organization[] = [];
  let stats: OrganizationStats | null = null;
  let errorMessage: string | null = null;

  try {
    [organizations, stats] = await Promise.all([getOrganizations(), getOrganizationStats()]);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unable to load organizations from Firestore.";
  }

  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Organizations</h1><p className="mt-3 text-white/60">Browse public organization profiles, sectors, capabilities and active challenges.</p><div className="mt-6"><Button href="/organizations/dashboard">Organization Dashboard</Button></div>{errorMessage ? <div className="mt-8"><ErrorState message={errorMessage} /></div> : <>{stats && <OrganizationStats stats={stats} />}<OrganizationGrid organizations={organizations} /></>}</main>;
}
