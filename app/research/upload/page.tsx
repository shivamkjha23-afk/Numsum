"use client";
import { useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { createResearchPost } from "@/lib/repositories/firestore";

export default function UploadResearch() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  async function submit(formData: FormData) {
    if (!user) return;
    setMessage("Submitting research...");
    const links = String(formData.get("documentLinks") || "").split("\n").map((x) => x.trim()).filter(Boolean);
    await createResearchPost({ title: String(formData.get("title") || ""), abstract: String(formData.get("abstract") || ""), summary: String(formData.get("summary") || formData.get("abstract") || ""), researchLink: String(formData.get("researchLink") || ""), documentLinks: links, authors: String(formData.get("authors") || "").split(",").map((x) => x.trim()).filter(Boolean), tags: String(formData.get("tags") || "").split(",").map((x) => x.trim()).filter(Boolean), category: String(formData.get("category") || ""), problemStatementId: String(formData.get("problemStatementId") || ""), createdBy: user.uid });
    setMessage("Research submitted for admin review.");
  }
  return <AuthGate><main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Submit Research</h1><Card className="mt-8"><p className="text-white/60">Workflow: Research Details → Associated Problem Statement → Supporting Links → Review → Submit. Use Google Drive, GitHub, DOI, ResearchGate, PDF URLs, or folder links. No file uploads.</p><form action={submit} className="mt-4 grid gap-3"><input name="title" required placeholder="Title" className="rounded-xl border border-white/10 bg-black/30 p-3" /><textarea name="abstract" required placeholder="Abstract" className="h-24 rounded-xl border border-white/10 bg-black/30 p-3" /><textarea name="summary" placeholder="Summary" className="h-24 rounded-xl border border-white/10 bg-black/30 p-3" /><input name="authors" placeholder="Authors (comma-separated)" className="rounded-xl border border-white/10 bg-black/30 p-3" /><input name="category" placeholder="Category" className="rounded-xl border border-white/10 bg-black/30 p-3" /><input name="problemStatementId" placeholder="Associated Problem Statement ID (optional)" className="rounded-xl border border-white/10 bg-black/30 p-3" /><input name="researchLink" placeholder="Primary research link / DOI" className="rounded-xl border border-white/10 bg-black/30 p-3" /><textarea name="documentLinks" placeholder="Supporting links, one per line" className="h-24 rounded-xl border border-white/10 bg-black/30 p-3" /><input name="tags" placeholder="Tags (comma-separated)" className="rounded-xl border border-white/10 bg-black/30 p-3" /><button className="rounded-full bg-white px-5 py-3 font-semibold text-black">Submit</button></form>{message && <p className="mt-3 text-white/60">{message}</p>}</Card></main></AuthGate>;
}
