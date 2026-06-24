"use client";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { addCommunityComment } from "@/lib/repositories/firestore";
import type { CommunityComment, CommunityPost } from "@/lib/types";

function CommentItem({
  comment,
  post,
  onReply,
}: {
  comment: CommunityComment;
  post: CommunityPost;
  onReply: (post: CommunityPost, parentId?: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm text-white/75">{comment.content}</p>
      <p className="mt-2 text-xs text-white/40">By {comment.createdBy}</p>
      <button
        className="mt-3 text-sm text-blue-200"
        onClick={() => onReply(post, comment.id)}
      >
        Reply
      </button>
      <div className="mt-3 space-y-3 pl-4">
        {comment.replies?.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            post={post}
            onReply={onReply}
          />
        ))}
      </div>
    </div>
  );
}

export function CommunityThread({ posts }: { posts: CommunityPost[] }) {
  const { user, requestAuth } = useAuth();
  const [message, setMessage] = useState("");
  async function submit(post: CommunityPost, parentId?: string) {
    if (!user) return requestAuth({ message: "Sign in to comment." });
    const content = window.prompt(
      parentId ? "Write your reply" : "Write your comment",
    );
    if (!content?.trim()) return;
    await addCommunityComment(post, user.uid, content.trim(), parentId);
    setMessage("Comment saved. Refresh to see the latest thread.");
  }
  return (
    <Card className="mt-8">
      <h2 className="font-display text-2xl">Community comments</h2>
      <p className="mt-2 text-sm text-white/60">
        Posts, comments, and replies stay attached to this associated object.
      </p>
      {message && <p className="mt-3 text-sm text-blue-200">{message}</p>}
      <div className="mt-5 space-y-5">
        {posts.length === 0 ? (
          <p className="text-white/50">No linked community posts yet.</p>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="rounded-3xl border border-white/10 bg-black/20 p-5"
            >
              <h3 className="font-display text-xl">{post.title}</h3>
              <p className="mt-2 text-white/70">{post.content}</p>
              <button
                className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
                onClick={() => submit(post)}
              >
                Comment
              </button>
              <div className="mt-4 space-y-3">
                {post.comments?.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    post={post}
                    onReply={submit}
                  />
                ))}
              </div>
            </article>
          ))
        )}
      </div>
    </Card>
  );
}
