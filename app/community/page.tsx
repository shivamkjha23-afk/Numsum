import { EmptyState } from "@/components/data-states";
import { Button, Card } from "@/components/ui";
import { listPublicDiscussionThreads } from "@/lib/repositories/firestore";

const categories = ["question", "field_observation", "technical_discussion", "research_discussion", "competition_discussion", "team_coordination", "msme_need", "announcement"];

export default async function Community({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category = "all", q = "" } = await searchParams;
  const rows = await listPublicDiscussionThreads();
  const query = q.toLowerCase();
  const threads = rows.filter((t) => (category === "all" || t.category === category) && (!query || `${t.title} ${t.body} ${(t.tags || []).join(" ")}`.toLowerCase().includes(query)));
  return <main className="min-h-screen bg-navy px-6 py-10">
    <section className="mx-auto max-w-6xl">
      <p className="text-sm uppercase tracking-[.3em] text-blue-300">Community / Discussions</p>
      <h1 className="mt-3 font-display text-5xl">MSME Problem-Solving Community</h1>
      <p className="mt-4 max-w-3xl text-white/70">Community discussions help MSMEs, engineers, researchers, students, and contributors discuss practical industrial problems, share field knowledge, ask clarifying questions, and collaborate around challenges.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Button href="/sign-in">Sign in to participate</Button><Button href="/profile/complete" variant="secondary">Complete your profile to post</Button><Button href="/submit-challenge" variant="secondary">Submit MSME Challenge</Button></div>
      <Card className="mt-6 border-amber-300/20 bg-amber-300/10"><p className="text-sm text-amber-100">Discussions should be practical, respectful, and focused on MSME problem solving. Do not post confidential MSME data, contact numbers, private drawings, financials, or proprietary process details. Public posts may be moderated. Report inappropriate or confidential content.</p></Card>
      <form className="mt-6 flex flex-wrap gap-3"><input name="q" defaultValue={q} placeholder="Search public discussions" className="min-w-64 rounded-xl border border-white/10 bg-black/30 p-3" /><select name="category" defaultValue={category} className="rounded-xl border border-white/10 bg-black/30 p-3"><option value="all">All categories</option>{categories.map((c)=><option key={c} value={c}>{c.replaceAll("_", " ")}</option>)}</select><button className="rounded-full bg-white px-5 py-3 font-semibold text-black">Filter</button></form>
      <section className="mt-8 grid gap-4">{threads.length ? threads.map((thread) => <Card key={thread.id}><div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[.2em] text-blue-300"><span>{thread.category.replaceAll("_", " ")}</span><span>•</span><span>{thread.scopeType}</span><span>•</span><span>{thread.status}</span></div><a href={`/community/${thread.slug}`} className="mt-2 block font-display text-2xl hover:text-blue-200">{thread.title}</a><p className="mt-2 line-clamp-3 text-white/70">{thread.summary || thread.body}</p><p className="mt-3 text-sm text-white/45">By {thread.authorName} · {thread.commentCount || 0} comments · {(thread.tags || []).join(", ") || "No tags"}</p></Card>) : <Card><EmptyState message="Public MSME discussions will appear here after they are reviewed and published." /></Card>}</section>
    </section>
  </main>;
}
