import { AdminCompetitionDetailClient } from "@/components/admin-competition-detail-client";
export default async function AdminCompetitionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminCompetitionDetailClient id={id} />;
}
