"use client";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { addCommunityComment, toggleCommunityBookmark, upvoteCommunityPost, reportCommunityComment, editCommunityComment, deleteCommunityComment, createCollaborationRequest } from "@/lib/repositories/firestore";
import type { CommunityComment, CommunityPost } from "@/lib/types";

function MentionedContent({ text }: { text: string }) {
  const parts = text.split(/(@[a-zA-Z0-9_.-]+)/g);
  return <>{parts.map((part, i) => part.startsWith("@") ? <a key={i} className="text-blue-200 underline" href={`/profile?user=${part.slice(1)}`}>{part}</a> : part)}</>;
}

function Comment({ comment, post, onChanged }: { comment: CommunityComment; post: CommunityPost; onChanged: (m: string) => void }) {
  const { user, requestAuth } = useAuth();
  async function act(kind: "reply" | "edit" | "delete" | "report") {
    if (!user) return requestAuth({ message: "Sign in to participate." });
    if (kind === "reply") {
      const content = window.prompt("Write your reply. Use @username to mention members.");
      if (content) await addCommunityComment(post, user.uid, content, comment.id);
    }
    if (kind === "edit") {
      const content = window.prompt("Edit comment", comment.content);
      if (content) await editCommunityComment(post, comment.id, user.uid, content);
    }
    if (kind === "delete") await deleteCommunityComment(post, comment.id, user.uid);
    if (kind === "report") await reportCommunityComment(post, comment.id, user.uid);
    onChanged("Saved. Refresh to see updates.");
  }
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p><MentionedContent text={comment.content} /></p><p className="mt-2 text-xs text-white/40">By {comment.createdBy}</p><div className="mt-3 flex flex-wrap gap-3 text-sm text-blue-200"><button onClick={() => act("reply")}>Reply</button><button onClick={() => act("edit")}>Edit</button><button onClick={() => act("delete")}>Delete</button><button onClick={() => act("report")}>Report</button></div><div className="mt-3 space-y-3 pl-4">{comment.replies?.map((reply) => <Comment key={reply.id} comment={reply} post={post} onChanged={onChanged} />)}</div></div>;
}

export function CommunityDetailClient({ post }: { post: CommunityPost }) {
  const { user, requestAuth } = useAuth();
  const [message, setMessage] = useState("");
  async function addComment() { if (!user) return requestAuth({ message: "Sign in to comment." }); const content = window.prompt("Write your comment. Use @username to mention members."); if (content) { await addCommunityComment(post, user.uid, content); setMessage("Comment saved. Refresh to see it."); } }
  async function bookmark() { if (!user) return requestAuth({ message: "Sign in to bookmark." }); await toggleCommunityBookmark(post, user.uid); setMessage("Bookmark updated."); }
  async function like() { if (!user) return requestAuth({ message: "Sign in to like." }); await upvoteCommunityPost(post.id, user.uid); setMessage("Like saved."); }
  async function collaborate(formData: FormData) { if (!user) return requestAuth({ message: "Sign in to collaborate." }); await createCollaborationRequest({ title: `Collaboration: ${post.title}`, description: String(formData.get("description") || ""), expertiseRequired: String(formData.get("expertise") || "").split(",").map((x) => x.trim()).filter(Boolean), duration: String(formData.get("duration") || ""), organization: String(formData.get("organization") || ""), visibility: "member_only", adminReviewRequired: formData.get("adminReview") === "on", associatedType: "community", associatedId: post.id, createdBy: user.uid }); setMessage("Collaboration request submitted."); }
  return <div className="grid gap-6 lg:grid-cols-[1fr_360px]"><Card><div className="flex flex-wrap gap-2 text-xs uppercase tracking-[.2em] text-blue-200"><span>{post.type || "general"}</span><span>{post.linkedEntityType || post.associatedType}</span></div><h1 className="mt-3 font-display text-5xl">{post.title}</h1><p className="mt-3 text-white/50">Author: {post.author || post.createdBy} · Organization: {post.organization || "Not specified"}</p><p className="mt-6 whitespace-pre-wrap text-white/75"><MentionedContent text={post.content} /></p><div className="mt-5 flex flex-wrap gap-2">{post.tags?.map((tag) => <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-sm">#{tag}</span>)}</div><div className="mt-6 grid gap-2 text-sm text-white/60"><p>Associated entity: {post.linkedEntityType || post.associatedType || "general"} {post.linkedEntityId || post.associatedId || ""}</p><p>Views: {post.views || 0} · Likes: {post.upvotes?.length || 0} · Bookmarks: {post.bookmarks?.length || 0} · Comments: {post.comments?.length || 0}</p></div><div className="mt-6 flex gap-3"><button onClick={like} className="rounded-full bg-white px-4 py-2 text-black">Like</button><button onClick={bookmark} className="rounded-full bg-blue-200 px-4 py-2 text-black">Bookmark</button><button onClick={addComment} className="rounded-full border border-white/20 px-4 py-2">Comment</button></div>{message && <p className="mt-3 text-blue-200">{message}</p>}</Card><Card><h2 className="font-display text-2xl">Seek Collaboration</h2><form action={collaborate} className="mt-4 grid gap-3"><input name="expertise" placeholder="Expertise required" className="rounded-xl bg-black/30 p-3" /><input name="duration" placeholder="Duration" className="rounded-xl bg-black/30 p-3" /><input name="organization" placeholder="Organization" className="rounded-xl bg-black/30 p-3" /><textarea name="description" required placeholder="Description" className="h-24 rounded-xl bg-black/30 p-3" /><label className="text-sm"><input name="adminReview" type="checkbox" className="mr-2" />Admin review required</label><button className="rounded-full bg-white px-4 py-2 text-black">Submit</button></form></Card><Card className="lg:col-span-2"><h2 className="font-display text-3xl">Comments & Replies</h2><div className="mt-5 space-y-3">{post.comments?.length ? post.comments.map((comment) => <Comment key={comment.id} comment={comment} post={post} onChanged={setMessage} />) : <p className="text-white/50">No comments yet.</p>}</div></Card></div>;
}
