"use client";
import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin-panel";
import { AuthGate } from "@/components/auth-gate";
import { ErrorState, LoadingState } from "@/components/data-states";
import { Button, Card } from "@/components/ui";
import {
  getAdminApplications,
  getAdminInbox,
  getAllChallenges,
  getCollaborationRequests,
  getCommunityPosts,
  getCompetitions,
  getInitializationStatus,
  getInternalThreads,
  getKnowledgeAssets,
  getOrganizations,
  getPlatformStats,
  getQuestionnaireTemplates,
  getResearchPosts,
  getTeamMembers,
  getUsers,
  initializePlatform,
} from "@/lib/repositories/firestore";
import type {
  AdminApplication,
  AdminInboxItem,
  Challenge,
  CollaborationRequest,
  CommunityPost,
  Competition,
  InitializationStatus,
  InternalThread,
  KnowledgeAsset,
  Organization,
  QuestionnaireTemplate,
  ResearchPost,
  SystemStats,
  TeamMember,
  UserProfile,
} from "@/lib/types";

type AdminData = {
  adminInbox: AdminInboxItem[];
  challenges: Challenge[];
  organizations: Organization[];
  users: UserProfile[];
  stats: SystemStats | null;
  adminApplications: AdminApplication[];
  questionnaireTemplates: QuestionnaireTemplate[];
  internalThreads: InternalThread[];
  researchPosts: ResearchPost[];
  knowledgeAssets: KnowledgeAsset[];
  competitions: Competition[];
  communityPosts: CommunityPost[];
  teamMembers: TeamMember[];
  collaborationRequests: CollaborationRequest[];
  initializationStatus: InitializationStatus;
};
function AdminDataLoader() {
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let mounted = true;
    initializePlatform()
      .then(() =>
        Promise.all([
          getAdminInbox(),
          getAllChallenges(100),
          getOrganizations(100),
          getUsers(100),
          getPlatformStats(),
          getAdminApplications(),
          getQuestionnaireTemplates(),
          getInternalThreads(),
          getResearchPosts(false),
          getKnowledgeAssets(false),
          getCompetitions(false),
          getCommunityPosts(),
          getTeamMembers(),
          getCollaborationRequests(),
          getInitializationStatus(),
        ]),
      )
      .then(
        ([
          adminInbox,
          challenges,
          organizations,
          users,
          stats,
          adminApplications,
          questionnaireTemplates,
          internalThreads,
          researchPosts,
          knowledgeAssets,
          competitions,
          communityPosts,
          teamMembers,
          collaborationRequests,
          initializationStatus,
        ]) => {
          if (mounted)
            setData({
              adminInbox,
              challenges,
              organizations,
              users,
              stats,
              adminApplications,
              questionnaireTemplates,
              internalThreads,
              researchPosts,
              knowledgeAssets,
              competitions,
              communityPosts,
              teamMembers,
              collaborationRequests,
              initializationStatus,
            });
        },
      )
      .catch((err) => {
        if (mounted)
          setError(
            err instanceof Error ? err.message : "Unable to load admin data.",
          );
      });
    return () => {
      mounted = false;
    };
  }, []);
  if (error) return <ErrorState retryHref="/admin" message={error} />;
  if (!data) return <LoadingState label="Loading admin data" />;
  return <AdminPanel {...data} />;
}
const moduleCards = [
  ["Problems", "/admin/problems", "Review submissions and workspace activity."],
  ["Onboarding", "/admin/questionnaires", "Manage templates and follow-up data."],
  ["Knowledge/SOP", "/admin/knowledge", "Review knowledge assets and SOP library."],
  ["Research", "/admin/research", "Curate research and technology watch."],
  ["Pilots/Impact", "/admin/pilots", "Track pilots and public success stories."],
  ["Competitions", "/admin/competitions", "Manage challenge teams, submissions and results."],
  ["Governance/Objectives", "/admin/governance", "Admin-only governance and targets."],
  ["Execution", "/admin/execution", "Coordinate internal work items."],
  ["Contributions", "/admin/contributions", "Review contribution records and scoring."],
] as const;

export function AdminDashboardClient() {
  return (
    <AuthGate label="Admin access requires authentication." adminOnly>
      <main className="min-h-screen bg-navy px-6 py-10">
        <h1 className="font-display text-5xl">Admin Dashboard</h1>
        <p className="mt-3 text-white/60">Module-level controls load only after admin authentication is confirmed.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {moduleCards.map(([title, href, description]) => (
            <Card key={href}>
              <h2 className="font-display text-2xl text-white">{title}</h2>
              <p className="mt-2 min-h-10 text-sm text-white/60">{description}</p>
              <div className="mt-4"><Button href={href}>Open</Button></div>
            </Card>
          ))}
        </div>
        <div className="mt-8"><AdminDataLoader /></div>
      </main>
    </AuthGate>
  );
}
