import { notFound } from "next/navigation";
import { CommunityThread } from "@/components/community-thread";
import { Card } from "@/components/ui";
import {
  getCommunityPostsByAssociation,
  getKnowledgeAssetById,
  getKnowledgeBySource,
} from "@/lib/repositories/firestore";

export default async function KnowledgeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const asset = await getKnowledgeAssetById(id);
  if (!asset) notFound();
  const [related, discussions] = await Promise.all([
    asset.sourceType && asset.sourceId
      ? getKnowledgeBySource(asset.sourceType, asset.sourceId)
      : Promise.resolve([]),
    getCommunityPostsByAssociation("knowledge_asset", id),
  ]);
  return (
    <main className="min-h-screen bg-navy px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm uppercase tracking-[.35em] text-blue-300">
          Knowledge Asset
        </p>
        <h1 className="mt-3 font-display text-5xl">{asset.title}</h1>
        <p className="mt-3 text-white/60">
          {[asset.sourceType, asset.status, asset.visibility]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="mt-8 grid gap-4">
          <Card>
            <h2 className="font-display text-2xl">Summary</h2>
            <p className="mt-3 text-white/70">
              {asset.summary || asset.description}
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Content</h2>
            <p className="mt-3 whitespace-pre-wrap text-white/70">
              {asset.content || asset.description}
            </p>
          </Card>
          <Card>
            <h2 className="font-display text-2xl">References</h2>
            {asset.references?.length ? (
              <ul className="mt-3 grid gap-2 text-blue-200">
                {asset.references.map((link) => (
                  <li key={link}>
                    <a href={link} target="_blank" rel="noreferrer">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-white/60">No references provided.</p>
            )}
          </Card>
          <Card>
            <h2 className="font-display text-2xl">Related Lifecycle Records</h2>
            {related.length ? (
              <pre className="mt-3 overflow-auto text-xs text-white/70">
                {JSON.stringify(related, null, 2)}
              </pre>
            ) : (
              <p className="mt-3 text-white/60">No related assets yet.</p>
            )}
          </Card>
          <CommunityThread posts={discussions} />
        </div>
      </div>
    </main>
  );
}
