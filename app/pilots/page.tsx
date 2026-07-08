"use client";
import { useEffect, useState } from "react";
import { LoadingState } from "@/components/data-states";
import { Card } from "@/components/ui";
import { getPublicPilotTracks } from "@/lib/repositories/firestore";
import type { PilotTrack } from "@/lib/types";

export default function PublicPilotsPage() {
  const [items, setItems] = useState<PilotTrack[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getPublicPilotTracks().then(setItems).finally(() => setLoading(false)); }, []);
  if (loading) return <LoadingState label="Loading impact pilots" />;
  const active = items.filter((p) => ["active", "planned", "approved"].includes(p.status || ""));
  const completed = items.filter((p) => ["completed", "scaled"].includes(p.status || "") || p.publishedAt);
  return <main className="min-h-screen bg-navy px-6 py-10"><section className="mx-auto max-w-7xl"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[.3em] text-blue-300">Impact / Pilots</p><h1 className="mt-3 font-display text-5xl">Pilot implementation tracker</h1><p className="mt-3 max-w-3xl text-white/65">Public and approved in-progress pilots, completed impact stories, and measurable MSME improvement without exposing private identity unless explicitly public.</p></div><a href="/admin/pilots" className="rounded-full border border-blue-300/30 px-5 py-3 text-blue-100">Admin: add pilot</a></div><div className="mt-8 grid gap-4 md:grid-cols-4"><Metric label="In progress" value={active.length} /><Metric label="Completed / scaled" value={completed.length} /><Metric label="Total public pilots" value={items.length} /><Metric label="With impact metrics" value={items.filter((p) => p.expectedImpact || p.finalResults || p.estimatedSavings).length} /></div><PilotSection title="Currently in progress" empty="No public in-progress pilots yet." items={active} /><PilotSection title="Completed impact pilots" empty="Completed and published pilots will appear here." items={completed} /></section></main>;
}
function Metric({ label, value }: { label: string; value: number }) { return <Card><p className="text-sm text-white/50">{label}</p><p className="mt-2 text-3xl text-blue-200">{value}</p></Card>; }
function PilotSection({ title, empty, items }: { title: string; empty: string; items: PilotTrack[] }) { return <section className="mt-8"><h2 className="font-display text-3xl">{title}</h2><div className="mt-4 grid gap-5 md:grid-cols-2">{items.length ? items.map((p) => <article key={p.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><p className="text-xs uppercase tracking-[0.2em] text-blue-200">{[p.status, p.industrySegment, p.interventionType].filter(Boolean).join(" · ")}</p><h3 className="mt-2 text-2xl font-semibold">{p.title}</h3><p className="mt-3 text-white/70">{p.publicSummary || p.submitterVisibleSummary || p.problemSummary || p.pilotObjective}</p><dl className="mt-4 grid gap-3 text-sm text-white/65"><div><dt className="text-white/35">Current impact / target</dt><dd>{p.currentValues || p.expectedImpact || p.estimatedSavings || "—"}</dd></div><div><dt className="text-white/35">Final results</dt><dd>{p.finalResults || "Pending while execution continues"}</dd></div><div><dt className="text-white/35">Next steps</dt><dd>{p.nextSteps || p.successMetrics || "—"}</dd></div></dl><a href={`/pilots/${p.id}`} className="mt-4 inline-block text-blue-200">Open pilot details →</a></article>) : <Card><p className="text-white/60">{empty}</p></Card>}</div></section>; }
