import { Suspense } from "react";
import { CollectionBrowser } from "@/components/collection-browser";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-states";
import { Button } from "@/components/ui";
import { getResearchPosts } from "@/lib/repositories/firestore";

async function ResearchDirectory() {
  try { const posts = await getResearchPosts(); return posts.length === 0 ? <EmptyState message="Be among the first contributors" /> : <CollectionBrowser placeholder="Search research, authors, references" items={posts.map((post) => ({ id: post.id, title: post.title, description: post.summary, meta: [post.category, post.authors?.join(", ")].filter(Boolean).join(" · "), tags: post.tags, href: post.documentLink }))} />; }
  catch (error) { return <ErrorState retryHref="/research" message={error instanceof Error ? error.message : "Unable to load research from Firestore."} />; }
}
export default function Research() { return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Research Repository</h1><p className="mt-3 text-white/60">Submit and discover MSME research links from Google Drive, GitHub, DOI, ResearchGate and public PDFs.</p><div className="mt-6"><Button href="/research/upload">Submit Research</Button></div><div className="mt-8"><Suspense fallback={<LoadingState label="Loading research" />}><ResearchDirectory /></Suspense></div></main>; }
