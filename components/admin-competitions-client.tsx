"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { ErrorState, LoadingState } from "@/components/data-states";
import { Card, Button } from "@/components/ui";
import { getAdminCompetitions, getCompetitionParticipants, getCompetitionSubmissions, getTeamsForCompetition } from "@/lib/repositories/firestore";
import type { Competition } from "@/lib/types";

type Summary = { id: string; participants: number; teams: number; submissions: number };
function AdminCompetitionsContent() {
  const [competitions, setCompetitions] = useState<Competition[] | null>(null);
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    getAdminCompetitions().then(async (items) => {
      if (!mounted) return;
      setCompetitions(items);
      const rows = await Promise.all(items.map(async (c) => ({ id: c.id, participants: (await getCompetitionParticipants(c.id).catch(() => [])).length, teams: (await getTeamsForCompetition(c.id).catch(() => [])).length, submissions: (await getCompetitionSubmissions(c.id).catch(() => [])).length })));
      if (mounted) setSummaries(rows);
    }).catch((err) => setError(err instanceof Error ? err.message : "Unable to load challenges."));
    return () => { mounted = false; };
  }, []);
  const byId = useMemo(() => new Map(summaries.map((s) => [s.id, s])), [summaries]);
  if (error) return <ErrorState message={error} retryHref="/admin/challenges" />;
  if (!competitions) return <LoadingState label="Loading challenges" />;
  return <main className="min-h-screen bg-navy px-6 py-10"><div className="mx-auto max-w-6xl"><h1 className="font-display text-5xl">Challenge Management</h1><p className="mt-3 text-white/60">Manage problem-linked challenges, teams, submissions, evaluations and results.</p><div className="mt-6 grid gap-3 md:grid-cols-4">{[["Total", competitions.length],["Open", competitions.filter(c=>c.status==="open").length],["Evaluation", competitions.filter(c=>c.status==="evaluation"||c.status==="evaluating").length],["Results", competitions.filter(c=>c.status==="results_declared").length]].map(([l,v])=><Card key={String(l)}><p className="text-white/50">{l}</p><p className="text-3xl text-blue-200">{v}</p></Card>)}</div><Card className="mt-6"><div className="flex items-center justify-between"><h2 className="font-display text-2xl">All challenges</h2><Button href="/admin">Create via admin dashboard</Button></div><div className="mt-4 grid gap-3">{competitions.map((c)=>{const s=byId.get(c.id); return <Link key={c.id} href={`/admin/challenges/${c.id}`} className="rounded-2xl border border-white/10 p-4 hover:bg-white/5"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-xl text-blue-100">{c.title}</h3><p className="text-sm text-white/55">{[c.competitionType,c.status,c.visibility,c.industrySegment,c.linkedProblemStatementId?"linked":"unlinked"].filter(Boolean).join(" · ")}</p></div><p className="text-sm text-white/60">{s?.participants||0} participants · {s?.teams||0} teams · {s?.submissions||0} submissions</p></div></Link>})}</div>{!competitions.length && <p className="mt-4 text-white/60">No challenges found.</p>}</Card></div></main>;
}
export function AdminCompetitionsClient(){ return <AuthGate adminOnly label="Admin access requires authentication."><AdminCompetitionsContent /></AuthGate>; }
