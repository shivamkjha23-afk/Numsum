import { notFound } from "next/navigation";
import { CommunityDetailClient } from "@/components/community-detail-client";
import { Card } from "@/components/ui";
import { getCollaborationRequestsForEntity, getCommunityPost, getCommunityPostsByEntity, incrementCommunityView } from "@/lib/repositories/firestore";
import type { AssociatedType, CommunityPost, DiscussionTargetType } from "@/lib/types";

function toClientValue<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => toClientValue(item)) as T;
  if (value && typeof value === "object") {
    if (value instanceof Date) return value.toISOString() as T;
    const record = value as Record<string, unknown>;
    if (typeof record.toDate === "function") return (record.toDate() as Date).toISOString() as T;
    if (typeof record.seconds === "number" && typeof record.nanoseconds === "number") {
      return new Date(record.seconds * 1000 + Math.floor(record.nanoseconds / 1000000)).toISOString() as T;
    }
    return Object.fromEntries(Object.entries(record).map(([key, item]) => [key, toClientValue(item)])) as T;
  }
  return value;
}

export default async function CommunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getCommunityPost(id);
  if (!post) notFound();

  await incrementCommunityView(id).catch((error) => {
    console.warn("Unable to increment community discussion view", { id, error });
  });

  const entityType = (post.linkedEntityType || post.associatedType || "general") as DiscussionTargetType;
  const entityId = post.linkedEntityId || post.associatedId || "";
  const [related, requests] = await Promise.all([
    entityId && entityType !== "general" ? getCommunityPostsByEntity(entityType, entityId).catch(() => []) : Promise.resolve([]),
    getCollaborationRequestsForEntity("community" as AssociatedType, id).catch(() => []),
  ]);
  const relatedDiscussions = related.filter((item) => item.id !== id);

  return (
    <main className="min-h-screen bg-navy px-6 py-10">
      <CommunityDetailClient post={toClientValue<CommunityPost>(post)} />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl">Collaboration Requests</h2>
          {requests.length ? requests.map((request) => <p key={request.id} className="mt-3 text-white/70">{request.title} — {request.status || "open"}</p>) : <p className="mt-3 text-white/50">No requests yet.</p>}
        </Card>
        <Card>
          <h2 className="font-display text-2xl">Related Discussions</h2>
          {relatedDiscussions.length ? relatedDiscussions.map((item) => <a key={item.id} href={`/community/${item.id}`} className="mt-3 block text-blue-200">{item.title}</a>) : <p className="mt-3 text-white/50">No related discussions yet.</p>}
        </Card>
      </div>
    </main>
  );
}
