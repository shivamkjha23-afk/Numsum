"use client";
import { useEffect, useState } from "react";
import { AdminPanel } from "@/components/admin-panel";
import { AuthGate } from "@/components/auth-gate";
import { ErrorState, LoadingState } from "@/components/data-states";
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
export function AdminDashboardClient() {
  return (
    <AuthGate label="Admin access requires authentication." adminOnly>
      <AdminDataLoader />
    </AuthGate>
  );
}
