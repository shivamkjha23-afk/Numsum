"use client";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { EmptyState, LoadingState } from "@/components/data-states";
import { NewDiscussionForm } from "@/components/discussion-actions";
import { Button, Card } from "@/components/ui";
import { canParticipateInCommunity } from "@/lib/permissions";
import type { DiscussionThread } from "@/lib/types";

const filters = [
  ["all", "All post types"],
  ["msme_need", "MSME problem suggestion request"],
  ["research_discussion", "Research collaboration / patent / technology"],
  ["question", "Student interest / general question"],
  ["field_observation", "Product/service offering"],
  ["competition_discussion", "Challenge discussion"],
  ["technical_discussion", "Case study discussion"],
] as const;
const demoThreads: DiscussionThread[] = [
  { id: "demo-textile-inventory", slug: "demo-textile-inventory", title: "How can a textile MSME reduce dead stock before export season?", body: "Looking for practical inventory classification ideas that do not require a full ERP rollout.", summary: "Public example: a textile inventory discussion asking for low-cost classification ideas.", scopeType: "general", visibility: "public", status: "open", category: "msme_need", tags: ["textile", "inventory"], authorId: "demo", authorName: "Example MSME owner", authorRoleLabel: "msme_owner", moderationStatus: "clean", commentCount: 3 },
  { id: "demo-research-collaboration", slug: "demo-research-collaboration", title: "Seeking collaborators for low-cost visual inspection research", body: "A researcher wants to validate a camera-based quality inspection method with small manufacturers.", summary: "Public example: research collaboration post linked to quality inspection.", scopeType: "research", visibility: "public", status: "open", category: "research_discussion", tags: ["quality", "computer vision"], authorId: "demo", authorName: "Example researcher", authorRoleLabel: "researcher", moderationStatus: "clean", commentCount: 5 },
];

export function CommunityPageClient({ threads, category, q }: { threads: DiscussionThread[]; category: string; q: string }) {
  const { user, profile, loading, authReady, requestAuth } = useAuth();
  const [openComposer, setOpenComposer] = useState(false);
  const ready = !loading && authReady;
  const canPost = canParticipateInCommunity(profile);
  const shownThreads = threads.length ? threads : demoThreads;
  return <main className="min-h-screen bg-navy px-6 py-10">
    <section className="mx-auto max-w-7xl">
      <p className="text-sm uppercase tracking-[.3em] text-blue-300">Community / Social</p>
      <h1 className="mt-3 font-display text-5xl">MSME Problem-Solving Community</h1>
      <p className="mt-4 max-w-3xl text-white/70">Public visitors can read approved/example discussions. Members with complete profiles can post, comment, collaborate, and link discussions to problems, challenges, case studies, research items, and sectors.</p>
      {!ready ? <div className="mt-6"><LoadingState label="Loading your participation status" /></div> : <div className="mt-6 flex flex-wrap gap-3">
        {!user && <button onClick={() => requestAuth({ message: "Sign in to participate in community discussions.", returnTo: "/community" })} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Join to participate</button>}
        {user && !canPost && <Button href="/profile/complete" variant="secondary">Complete your profile to post</Button>}
        {canPost && <button onClick={() => setOpenComposer(true)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-blue-100">Create post</button>}
        <Button href="/submit-problem" variant="secondary">Submit MSME Problem</Button>
      </div>}
      {openComposer && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Create community post"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-2xl"><div className="mb-4 flex items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[.25em] text-blue-300">New community post</p><h2 className="font-display text-3xl">Choose post type and link context</h2><p className="mt-1 text-sm text-white/55">Post fields are Phase 1-ready and keep moderation/status fields available for Phase 2.</p></div><button onClick={() => setOpenComposer(false)} className="rounded-full border border-white/10 px-3 py-1 text-white/70" aria-label="Close discussion form">✕</button></div><NewDiscussionForm onDone={() => setOpenComposer(false)} /></div></div>}
      <Card className="mt-6 border-amber-300/20 bg-amber-300/10"><p className="text-sm text-amber-100">Do not post confidential MSME data, contact numbers, private drawings, financials, or proprietary process details. Public posts may require admin approval before publication.</p></Card>
      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_280px]"><aside className="space-y-4"><Card><h2 className="font-display text-2xl">Filters</h2><form className="mt-4 grid gap-3"><input name="q" defaultValue={q} placeholder="Search public posts" className="rounded-xl border border-white/10 bg-black/30 p-3" /><select name="category" defaultValue={category} className="rounded-xl border border-white/10 bg-black/30 p-3">{filters.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><input name="sector" placeholder="Sector / topic" className="rounded-xl border border-white/10 bg-black/30 p-3" /><button className="rounded-full bg-white px-5 py-3 font-semibold text-black">Filter</button></form></Card></aside><section className="grid content-start gap-4">{shownThreads.length ? shownThreads.map((thread) => <Card key={thread.id}><div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[.2em] text-blue-300"><span>{thread.category.replaceAll("_", " ")}</span><span>•</span><span>{thread.scopeType}</span><span>•</span><span>{thread.status}</span></div><a href={`/community/${thread.slug}`} className="mt-2 block font-display text-2xl hover:text-blue-200">{thread.title}</a><p className="mt-2 line-clamp-3 text-white/70">{thread.summary || thread.body}</p><div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/45"><span>By {thread.authorName}</span><span>·</span><a href={`/community/${thread.slug}#comments`} className="rounded-full border border-white/10 px-3 py-1 text-blue-100 hover:border-blue-300">Open comments ({thread.commentCount || 0})</a><span>{(thread.tags || []).join(", ") || "No tags"}</span></div></Card>) : <Card><EmptyState message="Public MSME discussions will appear here after they are reviewed and published." /></Card>}</section><aside className="space-y-4"><Card><h2 className="font-display text-2xl">Trending topics</h2><div className="mt-4 flex flex-wrap gap-2 text-sm">{["manufacturing", "quality", "textile", "food processing", "automation"].map((topic)=><span key={topic} className="rounded-full bg-white/10 px-3 py-1">#{topic}</span>)}</div></Card><Card><h2 className="font-display text-2xl">Active challenges</h2><p className="mt-3 text-sm text-white/60">Challenge-linked discussions will appear here as public challenge data grows.</p><Button href="/challenges" variant="secondary">Explore Challenges</Button></Card><Card><h2 className="font-display text-2xl">Suggested collaborators</h2><p className="mt-3 text-sm text-white/60">Member recommendations will be powered by profile type, sector, and tags in a later Phase 1 iteration.</p></Card></aside></div>
    </section>
  </main>;
}
