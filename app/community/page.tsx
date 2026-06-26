import { CommunityPageClient } from "@/components/community-page-client";
import { listPublicDiscussionThreads } from "@/lib/repositories/firestore";
export default async function Community({ searchParams }: { searchParams: Promise<{ category?: string; q?: string }> }) {
  const { category = "all", q = "" } = await searchParams;
  const rows = await listPublicDiscussionThreads();
  const query = q.toLowerCase();
  const threads = rows.filter((t) => (category === "all" || t.category === category) && (!query || `${t.title} ${t.body} ${(t.tags || []).join(" ")}`.toLowerCase().includes(query)));
  return <CommunityPageClient threads={threads} category={category} q={q} />;
}
