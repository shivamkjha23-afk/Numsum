import { EmptyState } from "@/components/data-states";
export default function Competitions() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Competitions</h1><p className="mt-3 text-white/60">Competition browsing remains public. Competition data will be connected after the Firestore competition model is introduced.</p><div className="mt-8"><EmptyState message="Be among the first contributors" /></div></main>;
}
