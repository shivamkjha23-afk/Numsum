import { Suspense } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-states";
import { OrganizationBrowser } from "@/components/organization-browser";
import { Button } from "@/components/ui";
import { getOrganizations } from "@/lib/repositories/firestore";

async function Directory() {
  try {
    const organizations = await getOrganizations(100);
    return organizations.length === 0 ? <EmptyState message="Be among the first contributors" /> : <OrganizationBrowser organizations={organizations} />;
  } catch (error) {
    return <ErrorState retryHref="/organizations" message={error instanceof Error ? error.message : "Unable to load organizations from Firestore."} />;
  }
}

export default function Organizations() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Organizations</h1><p className="mt-3 text-white/60">Browse public organization profiles loaded from Firestore.</p><div className="mt-6"><Button href="/organizations/dashboard">Organization Dashboard</Button></div><div className="mt-8"><Suspense fallback={<LoadingState label="Loading organizations" />}><Directory /></Suspense></div></main>;
}
