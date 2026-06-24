"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { createCommunityPost } from "@/lib/repositories/firestore";
import type { DiscussionTargetType } from "@/lib/types";

export default function NewDiscussion() {
  const params = useSearchParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  async function submit(formData: FormData) {
    if (!user) return;
    setMessage("Creating discussion...");
    try {
      await createCommunityPost({ title: String(formData.get("title") || ""), content: String(formData.get("content") || ""), associatedType: String(formData.get("associatedType") || "general") as DiscussionTargetType, associatedId: String(formData.get("associatedId") || ""), tags: String(formData.get("tags") || "").split(",").map((x) => x.trim()).filter(Boolean), visibility: "public", author: user.uid, createdBy: user.uid });
      setMessage("Discussion created.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to create discussion."); }
  }
  return <AuthGate><main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Create Discussion Post</h1><Card className="mt-8"><p className="text-white/60">Authenticated members can create structured discussions, comments, replies, bookmarks and upvotes around platform objects.</p><form action={submit} className="mt-4 grid gap-3"><input name="title" required placeholder="Post title" className="rounded-xl border border-white/10 bg-black/30 p-3" /><textarea name="content" required placeholder="Discussion body" className="h-32 rounded-xl border border-white/10 bg-black/30 p-3" /><input name="associatedType" defaultValue={params.get("type") || "general"} placeholder="problem_statement/research/competition/knowledge_asset/general" className="rounded-xl border border-white/10 bg-black/30 p-3" /><input name="associatedId" defaultValue={params.get("id") || ""} placeholder="Associated document ID (optional for general discussion)" className="rounded-xl border border-white/10 bg-black/30 p-3" /><input name="tags" placeholder="Tags (comma-separated)" className="rounded-xl border border-white/10 bg-black/30 p-3" /><button className="rounded-full bg-white px-5 py-3 font-semibold text-black">Create Post</button></form>{message && <p className="mt-3 text-white/60">{message}</p>}</Card></main></AuthGate>;
}
