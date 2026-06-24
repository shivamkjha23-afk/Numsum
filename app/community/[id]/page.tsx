import { notFound } from "next/navigation";
import { CommunityDetailClient } from "@/components/community-detail-client";
import { Card } from "@/components/ui";
import { getCollaborationRequestsForEntity, getCommunityPost, getCommunityPostsByEntity, incrementCommunityView } from "@/lib/repositories/firestore";
import type { AssociatedType, DiscussionTargetType } from "@/lib/types";

export default async function CommunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getCommunityPost(id);
  if (!post) notFound();
  await incrementCommunityView(id).catch(() => null);
  const entityType = (post.linkedEntityType || post.associatedType || "general") as DiscussionTargetType;
  const entityId = post.linkedEntityId || post.associatedId || "";
  const [related, requests] = await Promise.all([
    entityId && entityType !== "general" ? getCommunityPostsByEntity(entityType, entityId) : Promise.resolve([]),
    getCollaborationRequestsForEntity("community" as AssociatedType, id),
  ]);
  return <main className="min-h-screen bg-navy px-6 py-10"><CommunityDetailClient post={post} /><div className="mt-6 grid gap-6 lg:grid-cols-2"><Card><h2 className="font-display text-2xl">Collaboration Requests</h2>{requests.length ? requests.map((request) => <p key={request.id} className="mt-3 text-white/70">{request.title} — {request.status}</p>) : <p className="mt-3 text-white/50">No requests yet.</p>}</Card><Card><h2 className="font-display text-2xl">Related Discussions</h2>{related.filter((item) => item.id !== id).length ? related.filter((item) => item.id !== id).map((item) => <a key={item.id} href={`/community/${item.id}`} className="mt-3 block text-blue-200">{item.title}</a>) : <p className="mt-3 text-white/50">No related discussions yet.</p>}</Card></div></main>;
}
