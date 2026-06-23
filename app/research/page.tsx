import { EmptyState } from "@/components/data-states";
import { Button } from "@/components/ui";
export default function Research() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Research Library</h1><p className="mt-3 text-white/60">Browse public research pages freely. Research records will appear when a Firestore-backed research collection is introduced.</p><div className="mt-6"><Button href="/research/upload">Upload Research</Button></div><div className="mt-8"><EmptyState message="Be among the first contributors" /></div></main>;
}
