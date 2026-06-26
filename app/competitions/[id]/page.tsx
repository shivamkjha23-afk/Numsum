import { notFound } from "next/navigation";
import { CommunityThread } from "@/components/community-thread";
import { CompetitionActions } from "@/components/competition-actions";
import { LinkedActions } from "@/components/linked-actions";
import { Card } from "@/components/ui";
import {
  getCommunityPostsByAssociation,
  getCompetitionById,
  getCompetitionBySlug,
  getCompetitionSubmissions,
  getCompetitionTeams,
} from "@/lib/repositories/firestore";

export default async function CompetitionDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [competition, teams, submissions, discussions] = await Promise.all([
    getCompetitionById(id).then((c) => c || getCompetitionBySlug(id)),
    getCompetitionTeams(id),
    getCompetitionSubmissions(id),
    getCommunityPostsByAssociation("competition", id),
  ]);
  if (!competition) notFound();
  const leaderboard = submissions
    .filter((s) => typeof s.score === "number" || s.winner)
    .sort(
      (a, b) =>
        (a.rank || 999) - (b.rank || 999) || (b.score || 0) - (a.score || 0),
    );
  const winner = submissions.find(
    (s) => s.winner || s.id === competition.winnerSubmissionId,
  );
  return (
    <main className="min-h-screen bg-navy px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[.35em] text-blue-300">
          Competition
        </p>
        <h1 className="mt-3 font-display text-5xl">{competition.title}</h1>
        <p className="mt-3 text-white/60">
          {[
            competition.theme,
            competition.status,
            competition.visibility,
            competition.industrySegment,
            competition.competitionType,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <LinkedActions
          associatedType="competition"
          associatedId={competition.id}
          title={competition.title}
        />
        <CompetitionActions
          competition={competition}
          submissions={submissions}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card>
            <h2 className="font-display text-2xl">Eligibility</h2>
            <p className="mt-3 whitespace-pre-wrap text-white/70">
              {competition.eligibility || "Eligibility details pending."}
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Rules</h2>
            <p className="mt-3 whitespace-pre-wrap text-white/70">
              {competition.rules || "Rules pending."}
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Expected outputs</h2>
            <p className="mt-3 whitespace-pre-wrap text-white/70">
              {competition.expectedOutputs || "Expected outputs pending."}
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Evaluation criteria</h2>
            <p className="mt-3 whitespace-pre-wrap text-white/70">
              {competition.evaluationCriteria || "Evaluation criteria pending."}
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Prizes</h2>
            <p className="mt-3 whitespace-pre-wrap text-white/70">
              {competition.prizesOrRecognition || competition.prizes || competition.prize || "Recognition pending."}
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Participants</h2>
            <p className="mt-3 text-white/60">
              {competition.registrations?.length || 0} registered members
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Participation</h2>
            <p className="mt-3 text-white/60">Login/register to participate, create or join a team, and submit a solution while the competition is open.</p>
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Leaderboard</h2>
            {leaderboard.length ? (
              <pre className="mt-3 overflow-auto text-xs text-white/70">
                {JSON.stringify(leaderboard, null, 2)}
              </pre>
            ) : (
              <p className="mt-3 text-white/60">
                Scores will appear after evaluation.
              </p>
            )}
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Winning Solution</h2>
            {winner ? (
              <pre className="mt-3 overflow-auto text-xs text-white/70">
                {JSON.stringify(winner, null, 2)}
              </pre>
            ) : (
              <p className="mt-3 text-white/60">Winner not selected yet.</p>
            )}
          </Card>
          <CommunityThread posts={discussions} />
        </div>
      </div>
    </main>
  );
}
