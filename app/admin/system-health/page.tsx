import { SystemHealthClient } from "@/components/system-health-client";

export default function SystemHealthPage() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">System Health</h1><p className="mt-3 text-white/60">Firestore connectivity, collection counts, and current account diagnostics.</p><div className="mt-8"><SystemHealthClient /></div></main>;
}
