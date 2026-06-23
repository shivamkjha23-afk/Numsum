import { EmptyState } from "@/components/data-states";
import { Button } from "@/components/ui";
export default function Teams(){return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Team Formation</h1><p className="mt-3 text-white/60">Explore public team-building guidance before creating or joining a team.</p><div className="mt-6"><Button href="/teams/create">Create Team</Button></div><div className="mt-8"><EmptyState message="Be among the first contributors" /></div></main>}
