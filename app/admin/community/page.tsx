import { EmptyState } from "@/components/data-states";
import { Card } from "@/components/ui";
import { getUsers, listModerationThreads, listOpenDiscussionReports } from "@/lib/repositories/firestore";

export default async function AdminCommunity() {
  const [threads, reports, users] = await Promise.all([
    listModerationThreads().catch(() => []),
    listOpenDiscussionReports().catch(() => []),
    getUsers(300).catch(() => []),
  ]);

  return (
    <main className="px-4 py-8 md:px-8">
      <div>
        <p className="text-sm uppercase tracking-[.28em] text-blue-300">Content & Community</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Community Moderation</h1>
        <p className="mt-3 max-w-3xl text-white/65">The full moderation queue is the next admin module. This placeholder summarizes current community signals without exposing unfinished workflows.</p>
      </div>
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="p-5"><p className="text-xs uppercase tracking-[.22em] text-blue-200">Threads needing review</p><p className="mt-3 text-3xl font-semibold text-white">{threads.length}</p></Card>
        <Card className="p-5"><p className="text-xs uppercase tracking-[.22em] text-blue-200">Open reports</p><p className="mt-3 text-3xl font-semibold text-white">{reports.length}</p></Card>
        <Card className="p-5"><p className="text-xs uppercase tracking-[.22em] text-blue-200">Member profiles</p><p className="mt-3 text-3xl font-semibold text-white">{users.length}</p></Card>
      </section>
      <div className="mt-8">
        <EmptyState title="Moderation workflow coming next" message="Admins will be able to approve, hide, escalate, and link community posts from this workspace in a later Phase 2 module." />
      </div>
    </main>
  );
}
