import { CommunityPageClient } from "@/components/community-page-client";
import { listPublicDiscussionThreads } from "@/lib/repositories/firestore";
export default async function Community({ searchParams }: { searchParams: Promise<{ category?: string; q?: string; sector?: string }> }) {
  const { category = "all", q = "", sector = "" } = await searchParams;
  const rows = await listPublicDiscussionThreads().catch(() => []);
  const query = q.toLowerCase();
  const sectorQuery = sector.toLowerCase();
  const threads = rows.filter((t) => (category === "all" || t.category === category) && (!query || `${t.title} ${t.body} ${(t.tags || []).join(" ")}`.toLowerCase().includes(query)) && (!sectorQuery || (t.tags || []).join(" ").toLowerCase().includes(sectorQuery)));
  return <CommunityPageClient threads={threads} category={category} q={q} />;
}
