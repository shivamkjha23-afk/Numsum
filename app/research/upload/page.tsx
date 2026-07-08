"use client";
import { useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { createResearchPost } from "@/lib/repositories/firestore";

const input = "rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-white/45";
export default function UploadResearch() {
  const { user, profile } = useAuth();
  const [message, setMessage] = useState("");
  async function submit(formData: FormData) {
    if (!user) return;
    setMessage("Submitting research...");
    const links = String(formData.get("documentLinks") || "").split("\n").map((x) => x.trim()).filter(Boolean);
    await createResearchPost({ title: String(formData.get("title") || ""), abstract: String(formData.get("summary") || ""), summary: String(formData.get("summary") || ""), researchType: String(formData.get("researchType") || "research_paper") as never, sourceLink: String(formData.get("pdf") || ""), pdf: String(formData.get("pdf") || ""), documentLinks: links, authors: String(formData.get("authors") || profile?.name || user.email || "").split(",").map((x) => x.trim()).filter(Boolean), tags: String(formData.get("tags") || "").split(",").map((x) => x.trim()).filter(Boolean), problemStatementId: String(formData.get("problemStatementId") || ""), practicalRelevance: String(formData.get("practicalRelevance") || ""), createdBy: user.uid, submittedBy: user.uid });
    setMessage("Research submitted for admin review and peer publishing.");
  }
  return <AuthGate><main className="min-h-screen bg-navy px-6 py-10"><section className="mx-auto max-w-3xl"><p className="text-sm uppercase tracking-[.3em] text-blue-300">Knowledge & Research</p><h1 className="mt-3 font-display text-5xl">Add research / work</h1><Card className="mt-8"><p className="text-white/60">Simple submission: title, summary, MSME relevance, optional challenge link, and a PDF/source link. Admins can review and publish it for peer review and upvotes.</p><form action={submit} className="mt-4 grid gap-3"><input name="title" required placeholder="Title" className={input} /><textarea name="summary" required placeholder="Short summary of research / practical work" className={`${input} h-28`} /><textarea name="practicalRelevance" placeholder="How can this help MSMEs?" className={`${input} h-24`} /><input name="authors" placeholder="Authors (comma-separated)" className={input} /><select name="researchType" className={input}>{["research_paper","academic_project","patent","technology_trend","startup_case_study","msme_success_story","industrial_benchmark","other"].map((x)=><option key={x}>{x}</option>)}</select><input name="problemStatementId" placeholder="Linked MSME challenge / problem ID (optional)" className={input} /><input name="pdf" placeholder="PDF / DOI / Drive / source link" className={input} /><textarea name="documentLinks" placeholder="Supporting links, one per line" className={`${input} h-24`} /><input name="tags" placeholder="Tags (comma-separated)" className={input} /><button className="rounded-full bg-white px-5 py-3 font-semibold text-black">Submit for review</button></form>{message && <p className="mt-3 text-white/60">{message}</p>}</Card></section></main></AuthGate>;
}
