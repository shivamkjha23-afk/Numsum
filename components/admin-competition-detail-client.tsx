"use client";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { ErrorState, LoadingState, EmptyState } from "@/components/data-states";
import { Card } from "@/components/ui";
import { getCompetitionById, getCompetitionParticipants, getTeamsForCompetition, getCompetitionSubmissions, getEvaluationsForCompetition, getResultForCompetition } from "@/lib/repositories/firestore";
import type { Competition } from "@/lib/types";

type DetailData = { competition: Competition; participants: unknown[]; teams: unknown[]; submissions: unknown[]; evaluations: unknown[]; result: unknown };
function DetailContent({ id }: { id: string }) {
  const [data, setData] = useState<DetailData | null>(null);
  const [missing, setMissing] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    Promise.all([getCompetitionById(id), getCompetitionParticipants(id).catch(()=>[]), getTeamsForCompetition(id).catch(()=>[]), getCompetitionSubmissions(id).catch(()=>[]), getEvaluationsForCompetition(id).catch(()=>[]), getResultForCompetition(id).catch(()=>null)])
      .then(([competition, participants, teams, submissions, evaluations, result]) => {
        if (!mounted) return;
        if (!competition) { setMissing(true); return; }
        setData({ competition, participants, teams, submissions, evaluations, result });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load competition details."));
    return () => { mounted = false; };
  }, [id]);
  if (error) return <ErrorState message={error} retryHref="/admin/competitions" />;
  if (missing) return <EmptyState title="Competition not found" message="The requested competition could not be loaded." />;
  if (!data) return <LoadingState label="Loading competition" />;
  const { competition, participants, teams, submissions, evaluations, result } = data;
  const tabs = { Overview: competition, "Linked Problem": { linkedProblemStatementId: competition.linkedProblemStatementId || competition.sourceProblemId }, Participants: participants, Teams: teams, Submissions: submissions, Evaluations: evaluations, Results: result || {}, "Timeline / Activity": { status: competition.status, publishedAt: competition.publishedAt, archivedAt: competition.archivedAt } };
  return <main className="min-h-screen bg-navy px-6 py-10"><div className="mx-auto max-w-6xl"><p className="text-sm uppercase tracking-[.3em] text-blue-300">Admin Competition</p><h1 className="mt-3 font-display text-5xl">{competition.title}</h1><p className="mt-3 text-white/60">Use repository actions to publish/archive/cancel, approve teams, evaluate submissions, and declare results.</p><div className="mt-8 grid gap-4">{Object.entries(tabs).map(([label, value]) => <Card key={label}><h2 className="font-display text-2xl">{label}</h2><pre className="mt-3 max-h-[420px] overflow-auto text-xs text-white/70">{JSON.stringify(value, null, 2)}</pre></Card>)}</div></div></main>;
}
export function AdminCompetitionDetailClient({ id }: { id: string }) { return <AuthGate adminOnly label="Admin access requires authentication."><DetailContent id={id} /></AuthGate>; }
