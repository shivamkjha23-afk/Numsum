import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { CommentAndReport } from "@/components/discussion-actions";
import { getDiscussionThreadById, getDiscussionThreadBySlug, listCommentsForThread } from "@/lib/repositories/firestore";

export default async function CommunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const thread = (await getDiscussionThreadBySlug(id).catch(() => null)) || (await getDiscussionThreadById(id).catch(() => null));
  if (!thread) notFound();
  if (["hidden", "under_review"].includes(thread.status)) return <main className="min-h-screen bg-navy px-6 py-10"><Card><h1 className="font-display text-3xl">Discussion is awaiting moderation</h1><p className="mt-3 text-white/60">This discussion is not listed yet. An admin can approve it from Community Moderation.</p></Card></main>;
  const comments = (await listCommentsForThread(thread.id)).filter((c) => c.status === "visible");
  return <main className="min-h-screen bg-navy px-6 py-10"><section className="mx-auto max-w-4xl space-y-6"><Card><div className="text-xs uppercase tracking-[.2em] text-blue-300">{(thread.category || "question").replaceAll("_", " ")} · {thread.scopeType || "general"} · {thread.visibility || "public"} · {thread.status || "open"}</div><h1 className="mt-3 font-display text-4xl">{thread.title}</h1><p className="mt-2 text-sm text-white/45">By {thread.authorName || "Member"}</p><p className="mt-6 whitespace-pre-wrap text-white/75">{thread.body}</p></Card><Card><h2 id="comments" className="font-display text-2xl">Comment thread</h2>{comments.length ? comments.map((c)=><div key={c.id} className="mt-4 rounded-2xl border border-white/10 p-4"><p className="text-sm text-white/45">{c.authorName}</p><p className="mt-2 whitespace-pre-wrap text-white/75">{c.body}</p></div>) : <p className="mt-3 text-white/50">No replies yet.</p>}</Card><Card><h2 className="font-display text-2xl">Reply or report</h2><div className="mt-4"><CommentAndReport thread={JSON.parse(JSON.stringify(thread))} /></div></Card></section></main>;
}
