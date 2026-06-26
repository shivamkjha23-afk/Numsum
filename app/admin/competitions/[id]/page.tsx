import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { getCompetitionById, getCompetitionParticipants, getTeamsForCompetition, getCompetitionSubmissions, getEvaluationsForCompetition, getResultForCompetition } from "@/lib/repositories/firestore";

export default async function AdminCompetitionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [competition, participants, teams, submissions, evaluations, result] = await Promise.all([getCompetitionById(id), getCompetitionParticipants(id).catch(()=>[]), getTeamsForCompetition(id).catch(()=>[]), getCompetitionSubmissions(id).catch(()=>[]), getEvaluationsForCompetition(id).catch(()=>[]), getResultForCompetition(id).catch(()=>null)]);
  if (!competition) notFound();
  const tabs = { Overview: competition, "Linked Problem": { linkedProblemStatementId: competition.linkedProblemStatementId || competition.sourceProblemId }, Participants: participants, Teams: teams, Submissions: submissions, Evaluations: evaluations, Results: result || {}, "Timeline / Activity": { status: competition.status, publishedAt: competition.publishedAt, archivedAt: competition.archivedAt } };
  return <main className="min-h-screen bg-navy px-6 py-10"><div className="mx-auto max-w-6xl"><p className="text-sm uppercase tracking-[.3em] text-blue-300">Admin Competition</p><h1 className="mt-3 font-display text-5xl">{competition.title}</h1><p className="mt-3 text-white/60">Use repository actions to publish/archive/cancel, approve teams, evaluate submissions, and declare results.</p><div className="mt-8 grid gap-4">{Object.entries(tabs).map(([label, value]) => <Card key={label}><h2 className="font-display text-2xl">{label}</h2><pre className="mt-3 max-h-[420px] overflow-auto text-xs text-white/70">{JSON.stringify(value, null, 2)}</pre></Card>)}</div></div></main>;
}
