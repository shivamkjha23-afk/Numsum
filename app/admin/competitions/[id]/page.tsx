import { redirect } from "next/navigation";
export default async function AdminCompetitionDetailRedirect({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; redirect(`/admin/challenges/${id}`); }
