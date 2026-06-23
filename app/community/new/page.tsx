import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui";

export default function NewDiscussion() {
  return <AuthGate><main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Create Discussion Post</h1><Card className="mt-8"><p className="text-white/60">Authenticated members can start new community discussions.</p><input placeholder="Post title" className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3" /><textarea placeholder="Discussion body" className="mt-3 h-32 w-full rounded-xl border border-white/10 bg-black/30 p-3" /></Card></main></AuthGate>;
}
