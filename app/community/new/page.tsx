import { AuthGate } from "@/components/auth-gate";
import { NewDiscussionForm } from "@/components/discussion-actions";
import { Card } from "@/components/ui";
import { getAdminCompetitions, getAllProblemStatements, getTeamMembers, getAdminResearchItems } from "@/lib/repositories/firestore";
import type { DiscussionScopeType } from "@/lib/types";

type ScopeOption = { type: DiscussionScopeType; id: string; label: string };

export default async function NewDiscussion() {
  const [problems, competitions, teams, research] = await Promise.all([
    getAllProblemStatements(100).catch(() => []),
    getAdminCompetitions().catch(() => []),
    getTeamMembers().catch(() => []),
    getAdminResearchItems().catch(() => []),
  ]);
  const scopeOptions: ScopeOption[] = [
    ...problems.map((problem) => ({ type: "problem" as const, id: problem.id, label: problem.title || problem.id })),
    ...competitions.map((competition) => ({ type: "competition" as const, id: competition.id, label: competition.title || competition.id })),
    ...teams.map((member) => ({ type: "team" as const, id: member.id, label: member.name || member.designation || member.id })),
    ...research.map((item) => ({ type: "research" as const, id: item.id, label: item.title || item.id })),
  ];

  return (
    <AuthGate requireComplete>
      <main className="min-h-screen bg-navy px-6 py-10">
        <section className="mx-auto max-w-4xl">
          <p className="text-sm uppercase tracking-[.3em] text-blue-300">Community workflow</p>
          <h1 className="mt-3 font-display text-5xl">Create MSME Discussion</h1>
          <Card className="mt-6 border-blue-300/20 bg-blue-500/10">
            <h2 className="font-display text-2xl">Posting → moderation → listing</h2>
            <p className="mt-2 text-sm text-blue-100">Member-only posts open immediately for eligible members. Public posts go to Community Moderation first, then appear in the public discussion listing after admin approval.</p>
          </Card>
          <Card className="mt-6 border-amber-300/20 bg-amber-300/10">
            <p className="text-sm text-amber-100">Discussions should be practical, respectful, and focused on MSME problem solving. Do not post confidential MSME data, contact numbers, private drawings, financials, or proprietary process details. Public posts may be moderated.</p>
          </Card>
          <Card className="mt-6"><NewDiscussionForm scopeOptions={scopeOptions} /></Card>
        </section>
      </main>
    </AuthGate>
  );
}
