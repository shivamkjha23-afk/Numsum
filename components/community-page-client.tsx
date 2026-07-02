"use client";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { EmptyState, LoadingState } from "@/components/data-states";
import { NewDiscussionForm } from "@/components/discussion-actions";
import { Button, Card } from "@/components/ui";
import { canParticipateInCommunity, isAdmin } from "@/lib/permissions";
import type { DiscussionThread } from "@/lib/types";

const categories = ["question", "field_observation", "technical_discussion", "research_discussion", "competition_discussion", "team_coordination", "msme_need", "announcement"];

export function CommunityPageClient({ threads, category, q }: { threads: DiscussionThread[]; category: string; q: string }) {
  const { user, profile, loading, authReady, requestAuth } = useAuth();
  const [openComposer, setOpenComposer] = useState(false);
  const ready = !loading && authReady;
  const canPost = canParticipateInCommunity(profile);
  return <main className="min-h-screen bg-navy px-6 py-10">
    <section className="mx-auto max-w-6xl">
      <p className="text-sm uppercase tracking-[.3em] text-blue-300">Community / Discussions</p>
      <h1 className="mt-3 font-display text-5xl">MSME Problem-Solving Community</h1>
      <p className="mt-4 max-w-3xl text-white/70">Community discussions help MSMEs, engineers, researchers, students, and contributors discuss practical industrial problems, share field knowledge, ask clarifying questions, and collaborate around challenges.</p>
      {!ready ? <div className="mt-6"><LoadingState label="Loading your participation status" /></div> : <div className="mt-6 flex flex-wrap gap-3">
        {!user && <button onClick={() => requestAuth({ message: "Sign in to participate in community discussions.", returnTo: "/community" })} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Sign in to participate</button>}
        {user && !canPost && !isAdmin(profile) && <Button href="/profile/complete" variant="secondary">Complete your profile to post</Button>}
        {canPost && <button onClick={() => setOpenComposer(true)} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-blue-100">Create discussion</button>}
        {isAdmin(profile) && <Button href="/admin/community" variant="secondary">Moderation</Button>}
        <Button href="/submit-problem" variant="secondary">Submit MSME Challenge</Button>
      </div>}
      {openComposer && <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Create community discussion"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-2xl"><div className="mb-4 flex items-start justify-between gap-4"><div><p className="text-sm uppercase tracking-[.25em] text-blue-300">New discussion</p><h2 className="font-display text-3xl">Ask the community</h2><p className="mt-1 text-sm text-white/55">Only two fields are required. Optional linking is hidden unless you need it.</p></div><button onClick={() => setOpenComposer(false)} className="rounded-full border border-white/10 px-3 py-1 text-white/70" aria-label="Close discussion form">✕</button></div><NewDiscussionForm onDone={() => setOpenComposer(false)} /></div></div>}
      <Card className="mt-6 border-amber-300/20 bg-amber-300/10"><p className="text-sm text-amber-100">Discussions should be practical, respectful, and focused on MSME problem solving. Do not post confidential MSME data, contact numbers, private drawings, financials, or proprietary process details. Public posts may be moderated.</p></Card>
      <form className="mt-6 flex flex-wrap gap-3"><input name="q" defaultValue={q} placeholder="Search public discussions" className="min-w-64 rounded-xl border border-white/10 bg-black/30 p-3" /><select name="category" defaultValue={category} className="rounded-xl border border-white/10 bg-black/30 p-3"><option value="all">All categories</option>{categories.map((c)=><option key={c} value={c}>{c.replaceAll("_", " ")}</option>)}</select><button className="rounded-full bg-white px-5 py-3 font-semibold text-black">Filter</button></form>
      <section className="mt-8 grid gap-4">{threads.length ? threads.map((thread) => <Card key={thread.id}><div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[.2em] text-blue-300"><span>{thread.category.replaceAll("_", " ")}</span><span>•</span><span>{thread.scopeType}</span><span>•</span><span>{thread.status}</span></div><a href={`/community/${thread.slug}`} className="mt-2 block font-display text-2xl hover:text-blue-200">{thread.title}</a><p className="mt-2 line-clamp-3 text-white/70">{thread.summary || thread.body}</p><div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/45"><span>By {thread.authorName}</span><span>·</span><a href={`/community/${thread.slug}#comments`} className="rounded-full border border-white/10 px-3 py-1 text-blue-100 hover:border-blue-300">Open comment thread ({thread.commentCount || 0})</a><span>{(thread.tags || []).join(", ") || "No tags"}</span></div></Card>) : <Card><EmptyState message="Public MSME discussions will appear here after they are reviewed and published." /></Card>}</section>
    </section>
  </main>;
}
