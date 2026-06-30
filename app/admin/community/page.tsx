import { AuthGate } from "@/components/auth-gate";
import { AdminCommunityClient } from "@/components/admin-community-client";
import { getUsers, listModerationThreads, listOpenDiscussionReports } from "@/lib/repositories/firestore";

export default async function AdminCommunity() {
  const [threads, reports, users] = await Promise.all([
    listModerationThreads().catch(() => []),
    listOpenDiscussionReports().catch(() => []),
    getUsers(300).catch(() => []),
  ]);

  return (
    <AuthGate adminOnly>
      <main className="min-h-screen bg-navy px-6 py-10">
        <section className="mx-auto max-w-6xl">
          <AdminCommunityClient threads={threads} reports={reports} users={users} />
        </section>
      </main>
    </AuthGate>
  );
}
