import { Button, Card } from "@/components/ui";

export function LoadingState({ label = "Loading data" }: { label?: string }) {
  return <Card className="animate-pulse text-white/60">{label}…</Card>;
}
export function ErrorState({ message, retryHref }: { message: string; retryHref?: string }) {
  return <Card className="border-red-400/40 text-red-100"><p>{message}</p>{retryHref && <div className="mt-4"><Button href={retryHref} variant="secondary">Retry</Button></div>}</Card>;
}
export function EmptyState({ title, message = "Be among the first contributors" }: { title?: string; message?: string }) {
  return <Card className="text-white/60">{title && <h3 className="font-display text-2xl text-white">{title}</h3>}<p className={title ? "mt-2" : ""}>{message}</p></Card>;
}
