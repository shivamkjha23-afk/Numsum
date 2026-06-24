import { notFound } from "next/navigation";
import { CompetitionActions } from "@/components/competition-actions";
import { LinkedActions } from "@/components/linked-actions";
import { Card } from "@/components/ui";
import { getCompetitionById, getCompetitionSubmissions, getCompetitionTeams } from "@/lib/repositories/firestore";

export default async function CompetitionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [competition, teams, submissions] = await Promise.all([getCompetitionById(id), getCompetitionTeams(id), getCompetitionSubmissions(id)]);
  if (!competition) notFound();
  const leaderboard = submissions.filter((s) => typeof s.score === "number" || s.winner).sort((a, b) => (a.rank || 999) - (b.rank || 999) || (b.score || 0) - (a.score || 0));
  const winner = submissions.find((s) => s.winner || s.id === competition.winnerSubmissionId);
  return <main className="min-h-screen bg-navy px-6 py-10"><div className="mx-auto max-w-5xl"><p className="text-sm uppercase tracking-[.35em] text-blue-300">Competition</p><h1 className="mt-3 font-display text-5xl">{competition.title}</h1><p className="mt-3 text-white/60">{[competition.theme, competition.status, competition.visibility, competition.sourceType].filter(Boolean).join(" · ")}</p><LinkedActions associatedType="competition" associatedId={competition.id} title={competition.title} /><CompetitionActions competition={competition} submissions={submissions} /><div className="mt-8 grid gap-4 md:grid-cols-2"><Card><h2 className="font-display text-2xl">Rules</h2><p className="mt-3 whitespace-pre-wrap text-white/70">{competition.rules || "Rules pending."}</p></Card><Card><h2 className="font-display text-2xl">Prizes</h2><p className="mt-3 whitespace-pre-wrap text-white/70">{competition.prizes || "Prizes pending."}</p></Card><Card><h2 className="font-display text-2xl">Participants</h2><p className="mt-3 text-white/60">{competition.registrations?.length || 0} registered members</p></Card><Card><h2 className="font-display text-2xl">Teams</h2>{teams.length ? <pre className="mt-3 overflow-auto text-xs text-white/70">{JSON.stringify(teams, null, 2)}</pre> : <p className="mt-3 text-white/60">No teams yet.</p>}</Card><Card><h2 className="font-display text-2xl">Leaderboard</h2>{leaderboard.length ? <pre className="mt-3 overflow-auto text-xs text-white/70">{JSON.stringify(leaderboard, null, 2)}</pre> : <p className="mt-3 text-white/60">Scores will appear after evaluation.</p>}</Card><Card><h2 className="font-display text-2xl">Winning Solution</h2>{winner ? <pre className="mt-3 overflow-auto text-xs text-white/70">{JSON.stringify(winner, null, 2)}</pre> : <p className="mt-3 text-white/60">Winner not selected yet.</p>}</Card></div></div></main>;
}
