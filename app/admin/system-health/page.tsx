import { SystemHealthClient } from "@/components/system-health-client";

export default function SystemHealthPage() {
  return (
    <main className="px-4 py-8 md:px-8">
      <p className="text-sm uppercase tracking-[.28em] text-blue-300">Diagnostics</p>
      <h1 className="mt-2 font-display text-4xl md:text-5xl">System Health</h1>
      <p className="mt-3 max-w-3xl text-white/65">Grouped checks for auth, Firestore reads, operational collections, audit logs, and MOM/PDF storage readiness.</p>
      <div className="mt-8"><SystemHealthClient /></div>
    </main>
  );
}
