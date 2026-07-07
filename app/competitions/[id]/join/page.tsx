import { redirect } from "next/navigation";
export default async function CompetitionJoinRedirect({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; redirect(`/challenges/${id}/participate`); }
