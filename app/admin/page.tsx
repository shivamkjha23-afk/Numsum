import { AuthGate } from "@/components/auth-gate";
import { AdminPanel } from "@/components/admin-panel";
import { ErrorState } from "@/components/data-states";
import { getAdminApplications, getAllChallenges, getCommunityPosts, getCompetitions, getInternalThreads, getKnowledgeAssets, getOrganizations, getPlatformStats, getQuestionnaireTemplates, getResearchPosts, getUsers } from "@/lib/repositories/firestore";

export default async function Admin() {
  try {
    const [challenges, organizations, users, stats, adminApplications, questionnaireTemplates, internalThreads, researchPosts, knowledgeAssets, competitions, communityPosts] = await Promise.all([getAllChallenges(100), getOrganizations(100), getUsers(100), getPlatformStats(), getAdminApplications(), getQuestionnaireTemplates(), getInternalThreads(), getResearchPosts(), getKnowledgeAssets(), getCompetitions(), getCommunityPosts()]);
    return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Admin Dashboard</h1><p className="mt-3 text-white/60">Moderate challenges, applications, research, knowledge, competitions, organizations, users and platform statistics.</p><div className="mt-8"><AuthGate label="Admin access requires authentication."><AdminPanel challenges={challenges} organizations={organizations} users={users} stats={stats} adminApplications={adminApplications} questionnaireTemplates={questionnaireTemplates} internalThreads={internalThreads} researchPosts={researchPosts} knowledgeAssets={knowledgeAssets} competitions={competitions} communityPosts={communityPosts} /></AuthGate></div></main>;
  } catch (error) { return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Admin Dashboard</h1><div className="mt-8"><ErrorState retryHref="/admin" message={error instanceof Error ? error.message : "Unable to load admin data."} /></div></main>; }
}
