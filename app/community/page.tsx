import { EmptyState } from "@/components/data-states";
import { Button, Card } from "@/components/ui";
import { getCommunityPosts } from "@/lib/repositories/firestore";

const filters = [
  ["latest", "Latest"],
  ["problem", "Problem Discussions"],
  ["research", "Research Discussions"],
  ["competition", "Competition Discussions"],
  ["knowledge", "Knowledge Discussions"],
  ["organization", "Organization Discussions"],
  ["msme", "MSME Discussions"],
  ["team", "Team Discussions"],
];

export default async function Community({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter = "latest" } = await searchParams;
  const posts = await getCommunityPosts(filter);
  const trendingWeek = [...posts].sort((a, b) => ((b.views || 0) + (b.comments?.length || 0) + (b.bookmarks?.length || 0)) - ((a.views || 0) + (a.comments?.length || 0) + (a.bookmarks?.length || 0))).slice(0, 5);
  return (
    <main className="min-h-screen bg-navy px-6 py-10">
      <h1 className="font-display text-5xl">Community Ecosystem</h1>
      <p className="mt-3 max-w-3xl text-white/60">Collaboration layer for Problems, Research, Competitions, Organizations, Teams, MSME cases and Knowledge. Discussions must be linked to a platform object unless marked General Discussion.</p>
      <div className="mt-6 flex flex-wrap gap-3"><Button href="/community/new">Create Discussion</Button>{filters.map(([key, label]) => <Button key={key} href={`/community?filter=${key}`} variant={filter === key ? "primary" : "secondary"}>{label}</Button>)}</div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="grid gap-4">{posts.length ? posts.map((post) => <Card key={post.id}><p className="text-xs uppercase tracking-[.25em] text-blue-300">{post.type || post.associatedType || "general"}</p><a href={`/community/${post.id}`} className="mt-2 block font-display text-2xl hover:text-blue-200">{post.title}</a><p className="mt-2 line-clamp-3 text-white/70">{post.content}</p><p className="mt-3 text-sm text-white/45">Linked: {post.linkedEntityType || post.associatedType || "general"} {post.linkedEntityId || post.associatedId || ""} · {post.comments?.length || 0} comments · {post.bookmarks?.length || 0} bookmarks · {post.views || 0} views</p></Card>) : <Card><EmptyState message="Be among the first contributors" /></Card>}</section>
        <aside className="space-y-4"><Card><h2 className="font-display text-2xl">Trending This Week</h2>{trendingWeek.map((post) => <a className="mt-3 block text-blue-200" href={`/community/${post.id}`} key={post.id}>{post.title}</a>)}</Card><Card><h2 className="font-display text-2xl">Trending This Month</h2>{trendingWeek.map((post) => <p className="mt-3 text-white/70" key={post.id}>{post.title}</p>)}</Card><Card><h2 className="font-display text-2xl">Search</h2><p className="mt-2 text-sm text-white/60">Use browser search for title, tags, author, organization, linked entity, date and content on this loaded feed.</p></Card></aside>
      </div>
    </main>
  );
}
