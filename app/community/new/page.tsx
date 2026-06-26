import { AuthGate } from "@/components/auth-gate";
import { NewDiscussionForm } from "@/components/discussion-actions";
import { Card } from "@/components/ui";

export default function NewDiscussion() {
  return <AuthGate requireComplete>
    <main className="min-h-screen bg-navy px-6 py-10"><section className="mx-auto max-w-4xl"><h1 className="font-display text-5xl">Create MSME Discussion</h1><Card className="mt-6 border-amber-300/20 bg-amber-300/10"><p className="text-sm text-amber-100">Discussions should be practical, respectful, and focused on MSME problem solving. Do not post confidential MSME data, contact numbers, private drawings, financials, or proprietary process details. Public posts may be moderated.</p></Card><Card className="mt-6"><NewDiscussionForm /></Card></section></main>
  </AuthGate>;
}
