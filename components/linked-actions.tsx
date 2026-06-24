"use client";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button, Card } from "@/components/ui";
import { createCollaborationRequest, createCommunityPost } from "@/lib/repositories/firestore";
import type { AssociatedType } from "@/lib/types";

export function LinkedActions({ associatedType, associatedId, title }: { associatedType: AssociatedType; associatedId: string; title: string }) {
  const { user, requestAuth } = useAuth();
  const [message, setMessage] = useState("");
  async function seek() {
    if (!user) return requestAuth({ message: "Sign in to seek collaboration." });
    setMessage("Creating collaboration request...");
    await createCollaborationRequest({ title: `Collaboration: ${title}`, description: `Seeking collaborators for ${title}.`, requiredSkills: [], associatedType, associatedId, sourceType: associatedType, sourceId: associatedId, createdBy: user.uid });
    setMessage("Collaboration request routed to admin inbox.");
  }
  async function discuss() {
    if (!user) return requestAuth({ message: "Sign in to create a linked discussion." });
    setMessage("Creating discussion...");
    await createCommunityPost({ title: `Discussion: ${title}`, content: `Structured discussion linked to ${title}.`, associatedType, associatedId, targetType: associatedType, targetId: associatedId, tags: [], visibility: "public", createdBy: user.uid, author: user.uid });
    setMessage("Discussion created.");
  }
  return <Card className="mt-6"><h2 className="font-display text-2xl">Collaborate</h2><p className="mt-2 text-white/60">Create a collaboration request or structured discussion without leaving this workflow.</p><div className="mt-4 flex flex-wrap gap-3"><button onClick={seek} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Seek Collaboration</button><Button href={`/community/new?type=${associatedType}&id=${associatedId}`}>Start Discussion</Button><button onClick={discuss} className="rounded-full bg-white/10 px-5 py-3 font-semibold text-white">Quick Discussion</button></div>{message && <p className="mt-3 text-sm text-white/60">{message}</p>}</Card>;
}
