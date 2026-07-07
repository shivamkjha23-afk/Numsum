import { EmptyState } from "@/components/data-states";
import { Card } from "@/components/ui";

export default function AdminCaseStudiesPage() {
  return (
    <main className="px-4 py-8 md:px-8">
      <div>
        <p className="text-sm uppercase tracking-[.28em] text-blue-300">Content publishing</p>
        <h1 className="mt-2 font-display text-4xl md:text-5xl">Case Studies</h1>
        <p className="mt-3 max-w-3xl text-white/65">Admin case study creation and publishing will use solved problems, approved impact metrics, and public client permissions. This placeholder keeps the module visible inside the internal workspace without exposing unfinished editor flows.</p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <EmptyState title="Case study editor coming next" message="Solved problems with public impact approval will be available here for structured case study publishing." />
        <Card>
          <h2 className="font-display text-2xl">Publishing checklist</h2>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li>• Link to solved MSME problem</li>
            <li>• Confirm client/company visibility</li>
            <li>• Reuse approved impact metrics</li>
            <li>• Add solution, lessons, and related challenge links</li>
          </ul>
          <button disabled className="mt-6 rounded-full border border-white/15 px-4 py-2 text-sm text-white/45">Create editor unavailable</button>
        </Card>
      </div>
    </main>
  );
}
