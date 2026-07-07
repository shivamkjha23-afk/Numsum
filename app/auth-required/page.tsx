import { Button, Card } from "@/components/ui";

export default function AuthRequired() {
  return <main className="min-h-screen bg-navy px-6 py-10"><Card className="mx-auto max-w-2xl"><p className="text-sm uppercase tracking-[.35em] text-blue-300">Authentication required</p><h1 className="mt-4 font-display text-4xl">Sign in to continue</h1><p className="mt-4 text-white/65">NumSum is publicly explorable, but actions such as submitting challenges, creating teams, joining challenges, posting discussions, commenting, uploading research, and opening dashboards require an authenticated role.</p><div className="mt-6 flex flex-wrap gap-3"><Button href="/" variant="secondary">Back Home</Button><Button href="/challenges" variant="secondary">Explore Challenges</Button></div></Card></main>;
}
