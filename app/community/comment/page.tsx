import { AuthGate } from "@/components/auth-gate";
import { Card } from "@/components/ui";

export default function Comment() {
  return <AuthGate><main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Comment</h1><Card className="mt-8"><p className="text-white/60">Authenticated members can comment on discussions.</p><textarea placeholder="Write your comment" className="mt-3 h-32 w-full rounded-xl border border-white/10 bg-black/30 p-3" /></Card></main></AuthGate>;
}
