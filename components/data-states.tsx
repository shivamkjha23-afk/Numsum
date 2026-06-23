import { Card } from "@/components/ui";
export function LoadingState({ label = "Loading data" }: { label?: string }) { return <Card className="animate-pulse text-white/60">{label}…</Card>; }
export function ErrorState({ message }: { message: string }) { return <Card className="border-red-400/40 text-red-100">{message}</Card>; }
export function EmptyState({ message }: { message: string }) { return <Card className="text-white/60">{message}</Card>; }
