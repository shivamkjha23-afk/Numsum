import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  getCountFromServer,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type WithFieldValue,
} from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { cache } from "react";
import { auth, db } from "@/lib/firebase";
import {
  getInitializationStatus,
  initializePlatform,
} from "@/lib/platform-initialization";
export { getInitializationStatus, initializePlatform };
import type {
  AdminApplication,
  AdminAuditLog,
  AdminInboxComment,
  AdminInboxItem,
  AssociatedType,
  AuditLog,
  CareerApplication,
  CareerOpening,
  ChallengeReview,
  ChallengeParticipation,
  ChallengeTeam,
  ChallengeTeamInvite,
  ChallengeSubmission,
  ChallengeEvaluation,
  ChallengeResult,
  CollaborationRequest,
  Bookmark,
  CommunityComment,
  CommunityPost,
  DiscussionTargetType,
  Competition,
  CompetitionSubmission,
  Role,
  CompetitionTeam,
  CompetitionParticipation,
  CompetitionEvaluation,
  CompetitionResult,
  ConstitutionDocument,
  ObjectiveTargetDocument,
  DiscussionComment,
  DiscussionPost,
  DiscussionThread,
  DiscussionThreadComment,
  DiscussionReport,
  ModerationAction,
  DiscussionVisibility,
  InternalThread,
  KnowledgeAsset,
  LinkedResource,
  FileLink,
  TimelineEvent,
  MsmeCase,
  Notification,
  Organization,
  PrivateCollaborationGroup,
  PlatformStatus,
  ProblemOnboardingSession,
  ProblemMeetingNote,
  ProblemPublicReview,
  PublicImpactMetrics,
  CaseStudyComment,
  CaseStudyUpvote,
  ProblemStatement,
  QuestionnaireResponse,
  QuestionnaireTemplate,
  ProblemQuestionnaireResponse,
  ProblemMeetingNotePdf,
  ResearchPost,
  ResearchItem,
  SOPDocument,
  SuccessStory,
  TestimonialRating,
  PilotTrack,
  PilotMilestone,
  PilotUpdate,
  PilotMetric,
  MeetingLog,
  SearchResult,
  SystemStats,
  TeamMember,
  UserProfile,
  GovernanceDocument,
  GovernanceAmendment,
  GovernanceDocumentVersion,
  ObjectiveTarget,
  GovernanceAuditEvent,
  GovernanceDocumentType,
  ExecutionWorkItem, ExecutionReview, MeetingRecord, ActionItem, DecisionRecord, EvidenceRecord, ContributionRecord, ContributionScoreRule, ContributionReviewCycle, ContributorReviewSummary, RecognitionRecord, ContributionClaim, ContributionType, ContributionCategory, ContributionEntityType,
} from "@/lib/types";

export const COLLECTIONS = {
  users: "users",
  organizations: "organizations",
  problemStatements: "problem_statements",
  questionnaireTemplates: "questionnaire_templates",
  questionnaireResponses: "questionnaire_responses",
  problemOnboardingSessions: "problem_onboarding_sessions",
  problemReviews: "problem_reviews",
  internalThreads: "internal_threads",
  communityPosts: "community_posts",
  discussionThreads: "discussion_threads",
  discussionComments: "discussion_comments",
  discussionReports: "discussion_reports",
  moderationActions: "moderation_actions",
  researchPosts: "research_posts",
  knowledgeAssets: "knowledge_assets",
  sopDocuments: "sop_documents",
  pilotTracks: "pilot_tracks",
  pilotMilestones: "pilot_milestones",
  pilotUpdates: "pilot_updates",
  pilotMetrics: "pilot_metrics",
  meetingLogs: "meeting_logs",
  problemMeetingNotes: "problem_meeting_notes",
  problemQuestionnaireResponses: "problem_questionnaire_responses",
  problemMeetingNotePdfs: "problem_meeting_note_pdfs",
  linkedResources: "linked_resources",
  timelineEvents: "timeline_events",
  fileLinks: "file_links",
  successStories: "success_stories",
  testimonialRatings: "testimonial_ratings",
  constitutionDocuments: "constitution_documents",
  objectiveTargetDocuments: "objective_target_documents",
  governanceDocuments: "governance_documents",
  governanceDocumentVersions: "governance_document_versions",
  governanceAmendments: "governance_amendments",
  objectiveTargets: "objective_targets",
  governanceAuditEvents: "governance_audit_events",
  executionWorkItems: "execution_work_items",
  actionItems: "action_items",
  meetingRecords: "meeting_records",
  executionReviews: "execution_reviews",
  decisionRecords: "decision_records",
  evidenceRecords: "evidence_records",
  contributionRecords: "contribution_records",
  contributionScoreRules: "contribution_score_rules",
  contributionReviewCycles: "contribution_review_cycles",
  contributorReviewSummaries: "contributor_review_summaries",
  recognitionRecords: "recognition_records",
  contributionClaims: "contribution_claims",
  competitions: "competitions",
  collaborationRequests: "collaboration_requests",
  careerOpenings: "career_openings",
  careerApplications: "career_applications",
  notifications: "notifications",
  adminApplications: "admin_applications",
  adminInbox: "admin_inbox",
  adminAuditLogs: "admin_audit_logs",
  bootstrapAdmins: "bootstrap_admins",
  userRoleRequests: "user_role_requests",
  teamMembers: "team_members",
  systemStats: "system_stats",
  systemDocuments: "system_documents",
  settings: "settings",
  roleDefinitions: "role_definitions",
  auditLogs: "audit_logs",
  bookmarks: "bookmarks",
  msmeCases: "msme_cases",
  privateCollaborationGroups: "private_collaboration_groups",
  comments: "comments",
  problemPublicReviews: "problem_reviews_public",
  caseStudyComments: "case_study_comments",
  caseStudyUpvotes: "case_study_upvotes",
  replies: "replies",
  communityAnalytics: "community_analytics",
  competitionTeams: "competition_teams",
  competitionSubmissions: "competition_submissions",
  competitionParticipations: "competition_participations",
  competitionEvaluations: "competition_evaluations",
  competitionResults: "competition_results",
  challengeParticipations: "challenge_participations",
  challengeTeams: "challenge_teams",
  challengeTeamInvites: "challenge_team_invites",
  challengeSubmissions: "challenge_submissions",
  challengeEvaluations: "challenge_evaluations",
  challengeResults: "challenge_results",
  problemAdminMetadata: "problem_admin_metadata",
  onboardingAdminMetadata: "onboarding_admin_metadata",
  pilotAdminMetadata: "pilot_admin_metadata",
  competitionSubmissionAdminMetadata: "competition_submission_admin_metadata",
  contributionReviewMetadata: "contribution_review_metadata",
  challenges: "problem_statements",
  challengeReviews: "problem_reviews",
} as const;
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

const SENSITIVE_FIELD_NAMES = ["adminNotes", "internalNotes", "adminInternalNotes", "reviewNotes", "notes"] as const;
type SensitiveFieldName = (typeof SENSITIVE_FIELD_NAMES)[number];

function splitSensitiveFields<T extends Record<string, unknown>>(data: T, fields: readonly SensitiveFieldName[] = SENSITIVE_FIELD_NAMES) {
  const safe = { ...data } as Record<string, unknown>;
  const metadata: Record<string, unknown> = {};
  for (const field of fields) {
    if (field in safe && safe[field] !== undefined) {
      metadata[field] = safe[field];
      delete safe[field];
    }
  }
  return { safe: safe as T, metadata };
}

async function upsertAdminMetadata(collectionName: CollectionName, id: string, metadata: Record<string, unknown>, actorId?: string) {
  if (Object.keys(metadata).length === 0) return;
  await upsertRecord(collectionName, id, { ...metadata, sourceId: id, updatedBy: actorId || uid() || "system", updatedAt: serverTimestamp() });
}

function sensitiveFieldDeletes(fields: readonly SensitiveFieldName[] = SENSITIVE_FIELD_NAMES) {
  return Object.fromEntries(fields.map((field) => [field, deleteField()])) as Record<string, unknown>;
}

function publicSafeProblem(problem: ProblemStatement): ProblemStatement {
  const { safe } = splitSensitiveFields(problem as unknown as Record<string, unknown>, ["adminNotes"]);
  return safe as unknown as ProblemStatement;
}
function publicSafePilot(pilot: PilotTrack): PilotTrack {
  const { safe } = splitSensitiveFields(pilot as unknown as Record<string, unknown>, ["adminInternalNotes"]);
  return safe as unknown as PilotTrack;
}
function publicSafeCompetitionSubmission(submission: CompetitionSubmission): CompetitionSubmission {
  const { safe } = splitSensitiveFields(submission as unknown as Record<string, unknown>, ["adminNotes", "reviewNotes"]);
  return safe as unknown as CompetitionSubmission;
}

function withId<T>(snapshot: { id: string; data: () => DocumentData }): T {
  return { id: snapshot.id, ...snapshot.data() } as T;
}
function ref(name: CollectionName) {
  return collection(db, name);
}
function queryFor(name: CollectionName, constraints: QueryConstraint[] = []) {
  return constraints.length ? query(ref(name), ...constraints) : ref(name);
}
export function sanitizeFirestorePayload<T>(value: T): T {
  if (Array.isArray(value))
    return value
      .map((item) => sanitizeFirestorePayload(item))
      .filter((item) => item !== undefined) as T;
  if (value && typeof value === "object") {
    if (
      value instanceof Date ||
      "seconds" in (value as Record<string, unknown>) ||
      "_methodName" in (value as Record<string, unknown>)
    )
      return value;
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, sanitizeFirestorePayload(item)]),
    ) as T;
  }
  return value;
}
function currentUserForLog() {
  return {
    uid: auth.currentUser?.uid || null,
    email: auth.currentUser?.email || null,
    role: null as string | null,
  };
}
function traceRepositoryRead(
  collectionName: CollectionName,
  filters: string[],
  order: string[],
) {
  console.info("[FIRESTORE_TRACE]", {
    collection: collectionName,
    filters,
    orderBy: order,
    currentUser: currentUserForLog(),
    currentRole: null,
  });
}
export const listCollection = cache(
  async <T>(name: CollectionName, constraints: QueryConstraint[] = []) =>
    (await getDocs(queryFor(name, constraints))).docs.map((item) =>
      withId<T>(item),
    ),
);
export async function getRecord<T>(name: CollectionName, id: string) {
  const snap = await getDoc(doc(db, name, id));
  return snap.exists() ? withId<T>(snap) : null;
}
export async function createRecord<T extends object>(
  name: CollectionName,
  data: WithFieldValue<Omit<T, "id">>,
) {
  return addDoc(ref(name), sanitizeFirestorePayload(data));
}
export async function updateRecord(
  name: CollectionName,
  id: string,
  data: Record<string, unknown>,
) {
  return setDoc(
    doc(db, name, id),
    sanitizeFirestorePayload({ ...data, updatedAt: serverTimestamp() }),
    { merge: true },
  );
}
export async function upsertRecord(
  name: CollectionName,
  id: string,
  data: Record<string, unknown>,
) {
  return setDoc(doc(db, name, id), sanitizeFirestorePayload(data), { merge: true });
}
export async function deleteRecord(name: CollectionName, id: string) {
  return deleteDoc(doc(db, name, id));
}

export async function logAudit(data: Omit<AuditLog, "id" | "createdAt">) {
  return createRecord<AuditLog>(COLLECTIONS.auditLogs, {
    ...data,
    createdAt: serverTimestamp(),
  } as WithFieldValue<Omit<AuditLog, "id">>);
}
export async function bumpStats(
  field: keyof Omit<SystemStats, "id" | "lastUpdated">,
  by = 1,
) {
  return upsertRecord(COLLECTIONS.systemStats, "platform", {
    [field]: increment(by),
    lastUpdated: serverTimestamp(),
  });
}
export async function routeToAdminInbox(
  data: Omit<AdminInboxItem, "id" | "createdAt" | "updatedAt" | "status">,
) {
  return createRecord<AdminInboxItem>(COLLECTIONS.adminInbox, {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as WithFieldValue<Omit<AdminInboxItem, "id">>);
}
export async function createNotification(
  data: Omit<Notification, "id" | "createdAt" | "read">,
) {
  return createRecord<Notification>(COLLECTIONS.notifications, {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  } as WithFieldValue<Omit<Notification, "id">>);
}

const BOOTSTRAP_ADMIN_EMAIL = "subhshivam22@gmail.com";
const BOOTSTRAP_ADMIN_NAME = "Roopveer Jha";
export function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || "";
}
export async function ensureBootstrapAdminRegistry() {
  return upsertRecord(COLLECTIONS.bootstrapAdmins, BOOTSTRAP_ADMIN_EMAIL, {
    email: BOOTSTRAP_ADMIN_EMAIL,
    name: BOOTSTRAP_ADMIN_NAME,
    role: "admin",
    active: true,
    updatedAt: serverTimestamp(),
  });
}
export async function isBootstrapAdminEmail(email?: string | null) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  if (normalized === BOOTSTRAP_ADMIN_EMAIL) {
    try {
      await ensureBootstrapAdminRegistry();
    } catch (error) {
      console.warn(
        "[ADMIN] Unable to update bootstrap admin registry; continuing with configured bootstrap email",
        error,
      );
    }
  }
  const admin = await getRecord<{ active?: boolean; role?: string }>(
    COLLECTIONS.bootstrapAdmins,
    normalized,
  );
  return Boolean(admin?.active !== false && admin?.role === "admin");
}

function authProvider(user: FirebaseUser) {
  return user.providerData.find((provider) => provider.providerId === "google.com")
    ? "google"
    : user.providerData.find((provider) => provider.providerId === "password")
      ? "password"
      : "unknown";
}


function membershipNumberFromUid(uid: string) {
  let hash = 0;
  for (let i = 0; i < uid.length; i += 1) hash = (hash * 31 + uid.charCodeAt(i)) % 999999;
  return String(hash + 1).padStart(6, "0");
}

export function generateMembershipId(uid: string) {
  return `NSM-${membershipNumberFromUid(uid)}`;
}

const PROTECTED_ROLES: Role[] = ["admin", "super_admin"];
const DEFAULT_MEMBER_ROLES: Role[] = ["member"];

function hasProtectedRole(profile: Partial<UserProfile>) {
  const roles = Array.isArray(profile.roles) ? profile.roles : profile.role ? [profile.role] : [];
  return roles.some((role) => PROTECTED_ROLES.includes(role as Role));
}

function defaultMemberProfile(user: FirebaseUser) {
  const displayName = user.displayName || user.email || "Member";
  return {
    uid: user.uid,
    email: user.email || "",
    fullName: displayName,
    displayName,
    name: displayName,
    photoURL: user.photoURL || "",
    phoneNumber: user.phoneNumber || "",
    membershipId: generateMembershipId(user.uid),
    roles: DEFAULT_MEMBER_ROLES,
    primaryRole: "member",
    role: "member",
    memberStatus: "pending_profile_completion",
    status: "active",
    profileComplete: false,
    authProvider: authProvider(user),
    provider: authProvider(user),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export async function ensureUserProfile(
  user: FirebaseUser,
): Promise<UserProfile> {
  console.info("[AUTH] Ensuring user profile", {
    uid: user.uid,
    email: user.email,
  });
  const existing = await getRecord<UserProfile>(COLLECTIONS.users, user.uid);

  if (!existing) {
    const profile = defaultMemberProfile(user);
    console.info("[PROFILE] Creating first-login member profile", {
      uid: user.uid,
      email: profile.email,
      roles: profile.roles,
    });
    await upsertRecord(COLLECTIONS.users, user.uid, profile);
    // Basic member access is automatic. Auxiliary stat writes must not block login.
    await bumpStats("memberCount").catch((error) =>
      console.warn("[PROFILE] Unable to bump member count", error),
    );
    return { id: user.uid, ...profile } as unknown as UserProfile;
  }

  const roles = Array.isArray(existing.roles) ? existing.roles.filter((role): role is Role => DEFAULT_MEMBER_ROLES.includes(role as Role) || PROTECTED_ROLES.includes(role as Role)) : [];
  const preserveProtectedRoles = hasProtectedRole(existing);
  const patch: Record<string, unknown> = {};
  if (!existing.uid) patch.uid = user.uid;
  if (!existing.email && user.email) patch.email = user.email;
  if (!existing.displayName && user.displayName) patch.displayName = user.displayName;
  if (!existing.name && (user.displayName || user.email)) patch.name = user.displayName || user.email;
  if (!existing.fullName && user.displayName) patch.fullName = user.displayName;
  if (!existing.photoURL && user.photoURL) patch.photoURL = user.photoURL;
  if (!existing.phoneNumber && user.phoneNumber) patch.phoneNumber = user.phoneNumber;
  if (!existing.membershipId) patch.membershipId = generateMembershipId(user.uid);
  if (!existing.authProvider) patch.authProvider = authProvider(user);
  if (!existing.provider) patch.provider = authProvider(user);
  if (!existing.createdAt) patch.createdAt = serverTimestamp();
  if (!existing.status) patch.status = "active";
  if (!existing.memberStatus) patch.memberStatus = existing.profileComplete ? "active" : "pending_profile_completion";
  if (roles.length === 0) patch.roles = DEFAULT_MEMBER_ROLES;
  const fallbackPrimaryRole = preserveProtectedRoles ? roles[0] : "member";
  if (!existing.primaryRole || !(DEFAULT_MEMBER_ROLES.includes(existing.primaryRole) || PROTECTED_ROLES.includes(existing.primaryRole))) patch.primaryRole = fallbackPrimaryRole;
  if (!existing.role || !(DEFAULT_MEMBER_ROLES.includes(existing.role) || PROTECTED_ROLES.includes(existing.role))) patch.role = fallbackPrimaryRole;
  if (existing.profileComplete === undefined) patch.profileComplete = false;

  if (Object.keys(patch).length > 0) {
    patch.updatedAt = serverTimestamp();
    console.info("[PROFILE] Repairing user profile bootstrap fields", {
      uid: user.uid,
      patchedFields: Object.keys(patch),
    });
    await upsertRecord(COLLECTIONS.users, user.uid, patch);
  }

  return {
    ...existing,
    ...patch,
    uid: existing.uid || user.uid,
    email: existing.email || user.email || "",
    membershipId: existing.membershipId || (patch.membershipId as string | undefined) || generateMembershipId(user.uid),
    roles: roles.length ? roles.filter((role) => DEFAULT_MEMBER_ROLES.includes(role) || PROTECTED_ROLES.includes(role)) : DEFAULT_MEMBER_ROLES,
    primaryRole: (patch.primaryRole as Role | undefined) || (DEFAULT_MEMBER_ROLES.includes(existing.primaryRole as Role) || PROTECTED_ROLES.includes(existing.primaryRole as Role) ? existing.primaryRole : undefined) || roles[0] || "member",
    role: (patch.role as Role | undefined) || (DEFAULT_MEMBER_ROLES.includes(existing.role as Role) || PROTECTED_ROLES.includes(existing.role as Role) ? existing.role : undefined) || roles[0] || "member",
    profileComplete: existing.profileComplete ?? false,
  } as UserProfile;
}


export const organizationProfileTypes = ["msme_owner"] as const;
export const academicProfileTypes = ["researcher", "student"] as const;
export const professionalProfileTypes = ["engineer_professional", "consultant_industry_expert"] as const;
export const startupProfileTypes = ["startup_technology_provider"] as const;

function hasText(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}
function hasListOrText(value: unknown) {
  return Array.isArray(value) ? value.some(hasText) : hasText(value);
}
export function isProfileComplete(profile?: Partial<UserProfile> | null) {
  if (!profile) return false;
  const commonComplete = [
    profile.fullName || profile.name || profile.displayName,
    profile.email,
    profile.phoneNumber,
    profile.profileType,
    profile.city,
    profile.state,
    profile.country,
    profile.shortBio || profile.professionalSummary,
  ].every(hasText);
  if (!commonComplete) return false;
  const profileType = profile.profileType;
  if (!profileType) return false;
  if ((organizationProfileTypes as readonly string[]).includes(profileType)) {
    return [profile.organizationName, profile.organizationType, profile.industrySegment, profile.manufacturingOrServiceFocus, profile.productsOrServices, profile.companySize, profile.website].every(hasText);
  }
  if ((academicProfileTypes as readonly string[]).includes(profileType)) {
    return [profile.institutionName, profile.departmentOrDiscipline, profile.researchInterests, profile.currentRole].every(hasText) && hasListOrText(profile.skills);
  }
  if ((professionalProfileTypes as readonly string[]).includes(profileType)) {
    return [profile.domainExpertise, profile.yearsOfExperience, profile.industriesWorkedWith].every(hasText) && hasListOrText(profile.skills);
  }
  if ((startupProfileTypes as readonly string[]).includes(profileType)) {
    return [profile.startupOrCompanyName, profile.solutionArea, profile.targetIndustries, profile.productStage].every(hasText);
  }
  return true;
}

export async function getCurrentUserProfile() {
  const user = auth.currentUser;
  if (!user) return null;
  return getRecord<UserProfile>(COLLECTIONS.users, user.uid);
}

export async function createUserProfileIfMissing(user: FirebaseUser) {
  return ensureUserProfile(user);
}

const SELF_PROFILE_BLOCKED_FIELDS = new Set(["role", "roles", "primaryRole", "status", "contributionScore", "recognition", "adminNotes", "internalNotes", "adminInternalNotes", "reviewNotes", "reviewerNotes", "isAdmin", "isSuperAdmin"]);

function safeUserProfilePatch(patch: Partial<UserProfile>) {
  return Object.fromEntries(Object.entries(patch).filter(([key]) => !SELF_PROFILE_BLOCKED_FIELDS.has(key))) as Partial<UserProfile>;
}

export async function updateUserProfile(userId: string, patch: Partial<UserProfile>) {
  const existing = await getRecord<UserProfile>(COLLECTIONS.users, userId);
  patch = safeUserProfilePatch(patch);
  const profileComplete = isProfileComplete({ ...existing, ...patch, id: userId });
  const payload: Record<string, unknown> = {
    ...patch,
    profileComplete,
    memberStatus: profileComplete ? "active" : existing?.memberStatus || "pending_profile_completion",
    updatedAt: serverTimestamp(),
  };
  if (profileComplete && !existing?.profileCompletedAt) payload.profileCompletedAt = serverTimestamp();
  await updateRecord(COLLECTIONS.users, userId, payload);
  return { ...(existing || { id: userId }), ...patch, profileComplete } as UserProfile;
}

export async function notifyAdmins(
  type: Notification["type"],
  title: string,
  message: string,
  problemStatementId?: string,
) {
  return createNotification({
    userId: "admins",
    type,
    title,
    message,
    problemStatementId,
  });
}

const PUBLIC_COMPETITION_STATUSES = ["published", "upcoming", "open", "closed", "results_declared"] as const;

function publicConstraints(publicOnly = true) {
  return publicOnly ? [where("visibility", "==", "public"), where("status", "==", "published")] : [];
}
function publicCompetitionConstraints() {
  return [where("visibility", "==", "public"), where("status", "in", [...PUBLIC_COMPETITION_STATUSES])];
}
function byCreatedAtDesc<T extends { createdAt?: unknown }>(rows: T[]) {
  return [...rows].sort((a, b) =>
    String(b.createdAt || "").localeCompare(String(a.createdAt || "")),
  );
}
export const getProblemStatements = cache(
  async (maxItems = 12, publicOnly = true): Promise<ProblemStatement[]> => {
    traceRepositoryRead(
      COLLECTIONS.problemStatements,
      publicOnly ? ["visibility == public"] : [],
      publicOnly ? ["client: createdAt desc"] : ["createdAt desc"],
    );
    const rows = await listCollection<ProblemStatement>(
      COLLECTIONS.problemStatements,
      publicOnly
        ? [...publicConstraints(true), limit(maxItems)]
        : [orderBy("createdAt", "desc"), limit(maxItems)],
    );
    return publicOnly ? byCreatedAtDesc(rows).map(publicSafeProblem) : rows;
  },
);
export const getChallenges = getProblemStatements;
export const getAllProblemStatements = cache(
  async (maxItems = 100): Promise<ProblemStatement[]> =>
    listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [
      orderBy("createdAt", "desc"),
      limit(maxItems),
    ]),
);
export const getAllChallenges = getAllProblemStatements;
export const getSubmittedProblemStatements = cache(async () =>
  listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [
    where("status", "in", ["submitted", "under_review", "needs_more_info", "needs_information"]),
    limit(100),
  ]),
);
export const getSubmittedChallenges = getSubmittedProblemStatements;
export const getProblemStatementsByOrganization = cache(
  async (organizationId: string, admin = false) =>
    listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [
      where("organizationId", "==", organizationId),
      ...(admin ? [] : [where("visibility", "==", "public")]),
      limit(100),
    ]),
);
export const getChallengesByOrganization = getProblemStatementsByOrganization;
export const getOrganizations = cache(
  async (maxItems = 50): Promise<Organization[]> =>
    listCollection<Organization>(COLLECTIONS.organizations, [
      orderBy("name", "asc"),
      limit(maxItems),
    ]),
);
export const getTeamMembers = cache(
  async (): Promise<TeamMember[]> =>
    listCollection<TeamMember>(COLLECTIONS.teamMembers, [
      orderBy("displayOrder", "asc"),
      limit(100),
    ]).catch(() =>
      listCollection<TeamMember>(COLLECTIONS.teamMembers, [limit(100)]),
    ),
);
export const getUsers = cache(
  async (maxItems = 100): Promise<UserProfile[]> =>
    listCollection<UserProfile>(COLLECTIONS.users, [limit(maxItems)]),
);
export const getPlatformStats = cache(
  async (): Promise<SystemStats | null> =>
    getRecord<SystemStats>(COLLECTIONS.systemStats, "platform").catch(
      () => null,
    ),
);
export async function getOrCreatePlatformStats(): Promise<SystemStats> {
  const existing = await getPlatformStats();
  if (existing) return existing;
  const [members, organizations, problems, research, competitions, knowledge] =
    await Promise.all([
      getCountFromServer(ref(COLLECTIONS.users)),
      getCountFromServer(ref(COLLECTIONS.organizations)),
      getCountFromServer(ref(COLLECTIONS.problemStatements)),
      getCountFromServer(ref(COLLECTIONS.researchPosts)),
      getCountFromServer(ref(COLLECTIONS.competitions)),
      getCountFromServer(ref(COLLECTIONS.knowledgeAssets)),
    ]);
  const stats = {
    memberCount: members.data().count,
    organizationCount: organizations.data().count,
    problemStatementCount: problems.data().count,
    challengeCount: problems.data().count,
    researchCount: research.data().count,
    competitionCount: competitions.data().count,
    knowledgeCount: knowledge.data().count,
    lastUpdated: serverTimestamp(),
  };
  await upsertRecord(COLLECTIONS.systemStats, "platform", stats);
  return { id: "platform", ...stats, lastUpdated: null } as SystemStats;
}
export const getQuestionnaireTemplates = cache(async () =>
  listCollection<QuestionnaireTemplate>(COLLECTIONS.questionnaireTemplates, [
    orderBy("category", "asc"),
  ]),
);
export async function getQuestionnaireByType(category: string) {
  const rows = await listCollection<QuestionnaireTemplate>(
    COLLECTIONS.questionnaireTemplates,
    [where("category", "==", category), limit(1)],
  );
  return rows[0] || null;
}

export async function getActiveQuestionnaireForSector(sector: string, usageType: QuestionnaireTemplate["usageType"] = "problem_submission") {
  const rows = await listCollection<QuestionnaireTemplate>(COLLECTIONS.questionnaireTemplates, [where("status", "==", "active"), where("usageType", "==", usageType), limit(100)]).catch(() => []);
  const normalized = sector.trim().toLowerCase();
  return rows.find((row) => String(row.sector || row.category || row.industrySegment || "").toLowerCase() == normalized) || rows.find((row) => String(row.sector || row.category || "").toLowerCase() == "other") || null;
}
export async function createQuestionnaireTemplate(data: Omit<QuestionnaireTemplate, "id" | "createdAt" | "updatedAt">) {
  const sections = data.sections || [{ id: "default", title: data.title || data.name || "Questions", description: data.description || "", order: 1, questions: data.questions || [] }];
  return createRecord<QuestionnaireTemplate>(COLLECTIONS.questionnaireTemplates, { ...data, title: data.title || data.name || data.category, name: data.name || data.title || data.category, sector: data.sector || String(data.category || data.industrySegment || "Other"), usageType: data.usageType || "onboarding_meeting", questions: data.questions || sections.flatMap((section) => section.questions), sections, status: data.status || "draft", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<QuestionnaireTemplate, "id">>);
}
export async function updateQuestionnaireTemplate(id: string, patch: Partial<QuestionnaireTemplate>) {
  await updateRecord(COLLECTIONS.questionnaireTemplates, id, { ...patch, updatedAt: serverTimestamp() });
}
export const getActiveQuestionnaireTemplates = cache(async () => {
  const rows = await listCollection<QuestionnaireTemplate>(COLLECTIONS.questionnaireTemplates, [where("status", "==", "active"), limit(100)]).catch(() => []);
  return rows.length ? rows : getQuestionnaireTemplates();
});
export async function getQuestionnaireTemplateById(id: string) {
  return getRecord<QuestionnaireTemplate>(COLLECTIONS.questionnaireTemplates, id);
}
export async function archiveQuestionnaireTemplate(id: string) {
  return updateQuestionnaireTemplate(id, { status: "archived" });
}
export const getAdminApplications = cache(async () =>
  listCollection<AdminApplication>(COLLECTIONS.adminApplications, [
    orderBy("createdAt", "desc"),
    limit(100),
  ]),
);
export const getAdminInbox = cache(async () =>
  listCollection<AdminInboxItem>(COLLECTIONS.adminInbox, [
    orderBy("createdAt", "desc"),
    limit(100),
  ]),
);
export const getNotificationsForUser = cache(async (userId: string) =>
  listCollection<Notification>(COLLECTIONS.notifications, [
    where("userId", "in", [userId, "admins"]),
    orderBy("createdAt", "desc"),
    limit(50),
  ]).catch(() =>
    listCollection<Notification>(COLLECTIONS.notifications, [
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(50),
    ]),
  ),
);
export const getResearchPosts = cache(async (publicOnly = true) => {
  traceRepositoryRead(
    COLLECTIONS.researchPosts,
    publicOnly ? ["visibility == public"] : [],
    publicOnly ? ["client: createdAt desc"] : ["createdAt desc"],
  );
  const rows = await listCollection<ResearchPost>(
    COLLECTIONS.researchPosts,
    publicOnly
      ? [...publicConstraints(true), limit(100)]
      : [orderBy("createdAt", "desc"), limit(100)],
  );
  return publicOnly ? byCreatedAtDesc(rows) : rows;
});
export const getKnowledgeAssets = cache(async (publicOnly = true) => {
  traceRepositoryRead(
    COLLECTIONS.knowledgeAssets,
    publicOnly ? ["visibility == public"] : [],
    publicOnly ? ["client: createdAt desc"] : ["createdAt desc"],
  );
  const rows = await listCollection<KnowledgeAsset>(
    COLLECTIONS.knowledgeAssets,
    publicOnly
      ? [where("visibility", "==", "public"), limit(100)]
      : [orderBy("createdAt", "desc"), limit(100)],
  );
  return publicOnly ? byCreatedAtDesc(rows).filter((a) => ["approved", "published"].includes(a.status || "")) : rows;
});
export const getCommunityPosts = cache(async (filter?: string) => {
  traceRepositoryRead(
    COLLECTIONS.communityPosts,
    ["visibility == public"],
    ["client: createdAt desc"],
  );
  return byCreatedAtDesc(
    await listCollection<CommunityPost>(COLLECTIONS.communityPosts, [
      where("visibility", "==", "public"),
      ...(filter && filter !== "latest" ? [where("type", "==", filter)] : []),
      limit(100),
    ]),
  );
});

export const getCommunityPost = cache(async (id: string) =>
  getRecord<CommunityPost>(COLLECTIONS.communityPosts, id),
);
export const getCommunityPostsByEntity = cache(
  async (linkedEntityType: DiscussionTargetType, linkedEntityId: string) =>
    listCollection<CommunityPost>(COLLECTIONS.communityPosts, [
      where("linkedEntityType", "==", linkedEntityType),
      where("linkedEntityId", "==", linkedEntityId),
      limit(20),
    ]).catch(() =>
      listCollection<CommunityPost>(COLLECTIONS.communityPosts, [
        where("associatedType", "==", linkedEntityType),
        where("associatedId", "==", linkedEntityId),
        limit(20),
      ]),
    ),
);
export const getCollaborationRequestsForEntity = cache(
  async (associatedType: AssociatedType, associatedId: string) =>
    listCollection<CollaborationRequest>(COLLECTIONS.collaborationRequests, [
      where("associatedType", "==", associatedType),
      where("associatedId", "==", associatedId),
      limit(20),
    ]).catch(() => []),
);
export const getBookmarksForUser = cache(async (userId: string) =>
  listCollection<Bookmark>(COLLECTIONS.bookmarks, [
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(100),
  ]).catch(() => []),
);

export const getMsmeCases = cache(async () =>
  listCollection<MsmeCase>(COLLECTIONS.msmeCases, [limit(100)]),
);

export const getCompetitions = cache(async (publicOnly = true) => {
  traceRepositoryRead(
    COLLECTIONS.competitions,
    publicOnly ? ["visibility == public"] : [],
    publicOnly ? ["client: createdAt desc"] : ["createdAt desc"],
  );
  const rows = await listCollection<Competition>(
    COLLECTIONS.competitions,
    publicOnly
      ? [...publicConstraints(true), limit(100)]
      : [orderBy("createdAt", "desc"), limit(100)],
  );
  return publicOnly ? byCreatedAtDesc(rows) : rows;
});

export const getCompetitionBySlug = cache(async (slug: string) => (await listCollection<Competition>(COLLECTIONS.competitions, [where("slug", "==", slug), limit(1)]))[0] || null);
export const getAdminCompetitions = cache(async () => getCompetitions(false));
export const getPublicCompetitions = cache(async () =>
  byCreatedAtDesc(
    await listCollection<Competition>(COLLECTIONS.competitions, [
      ...publicCompetitionConstraints(),
      limit(100),
    ]),
  ),
);
export const getPublicCompetitionsSafe = getPublicCompetitions;
export const getMemberCompetitions = cache(async () => listCollection<Competition>(COLLECTIONS.competitions, [limit(100)]));
export async function publishCompetition(competition: Competition, userId: string) { await updateCompetitionStatus(competition, userId, "open", "public"); const problemId = competition.linkedProblemStatementId || competition.sourceProblemId; if (problemId) await createRecord<TimelineEvent>(COLLECTIONS.timelineEvents, { problemStatementId: problemId, eventType: "competition_published" as never, title: `Competition published: ${competition.title}`, actorUserId: userId, visibility: "member_only", createdAt: serverTimestamp() } as never); }
export async function archiveCompetition(competition: Competition, userId: string) { await updateRecord(COLLECTIONS.competitions, competition.id, { status: "archived", archivedAt: serverTimestamp(), updatedBy: userId, updatedAt: serverTimestamp() }); }
export async function linkCompetitionToProblem(competitionId: string, problemStatementId: string, userId: string) { const comp = await getRecord<Competition>(COLLECTIONS.competitions, competitionId); await updateRecord(COLLECTIONS.competitions, competitionId, { linkedProblemStatementId: problemStatementId, sourceProblemId: problemStatementId, sourceType: "problem_statement", sourceId: problemStatementId, updatedBy: userId, updatedAt: serverTimestamp() }); await updateDoc(doc(db, COLLECTIONS.problemStatements, problemStatementId), { competitionIds: arrayUnion(competitionId), linkedResources: arrayUnion({ type: "competition", resourceType: "competition", resourceId: competitionId, title: comp?.title || competitionId, collection: COLLECTIONS.competitions, linkedAt: new Date().toISOString(), linkedBy: userId }), updatedAt: serverTimestamp() }); await createRecord<TimelineEvent>(COLLECTIONS.timelineEvents, { problemStatementId, eventType: "competition_linked", title: `Competition linked: ${comp?.title || competitionId}`, actorUserId: userId, visibility: "member_only", createdAt: serverTimestamp() } as never); }
export async function unlinkCompetitionFromProblem(competitionId: string, problemStatementId: string, userId: string) { await updateRecord(COLLECTIONS.competitions, competitionId, { linkedProblemStatementId: null, sourceProblemId: null, updatedBy: userId, updatedAt: serverTimestamp() } as never); await updateDoc(doc(db, COLLECTIONS.problemStatements, problemStatementId), { competitionIds: arrayRemove(competitionId), updatedAt: serverTimestamp() }); }



export const getAdminChallenges = cache(async () => listCollection<Competition>(COLLECTIONS.competitions, [limit(500)]).catch(() => []));
export async function createAdminChallenge(data: Partial<Competition>, actorId: string) { const payload = { ...data, title: data.title || "Untitled challenge", slug: data.slug || String(data.title || "challenge").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), visibility: data.visibility || "public", status: data.status || "draft", createdBy: actorId, updatedBy: actorId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }; return createRecord<Competition>(COLLECTIONS.competitions, payload as never); }
export async function updateAdminChallenge(id: string, patch: Partial<Competition>, actorId: string) { return updateRecord(COLLECTIONS.competitions, id, { ...patch, updatedBy: actorId, updatedAt: serverTimestamp() } as Record<string, unknown>); }
export const getChallengeEvaluations = cache(async (challengeId: string) => listCollection<ChallengeEvaluation>(COLLECTIONS.challengeEvaluations, [where("challengeId", "==", challengeId), limit(200)]).catch(() => []));
export const getChallengeResults = cache(async (challengeId: string) => listCollection<ChallengeResult>(COLLECTIONS.challengeResults, [where("challengeId", "==", challengeId), limit(10)]).catch(() => []));
export async function upsertChallengeEvaluation(data: Omit<ChallengeEvaluation, "id" | "createdAt" | "updatedAt"> & { id?: string }) { const payload = { ...data, updatedAt: serverTimestamp() }; if (data.id) { await updateRecord(COLLECTIONS.challengeEvaluations, data.id, payload as Record<string, unknown>); return { ...data, id: data.id } as ChallengeEvaluation; } const ref = await createRecord<ChallengeEvaluation>(COLLECTIONS.challengeEvaluations, { ...payload, createdAt: serverTimestamp() } as never); return { ...data, id: ref.id } as ChallengeEvaluation; }
export async function declareChallengeResult(data: Omit<ChallengeResult, "id" | "createdAt" | "updatedAt" | "declaredAt">) { const ref = await createRecord<ChallengeResult>(COLLECTIONS.challengeResults, { ...data, approvedForPublic: true, declaredAt: serverTimestamp(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); await updateRecord(COLLECTIONS.competitions, data.challengeId, { status: "results_declared", winnerSubmissionId: data.winnerSubmissionId || "", winningTeamId: data.winnerTeamId || "", updatedAt: serverTimestamp() }); return { ...data, id: ref.id, approvedForPublic: true } as ChallengeResult; }
export const getChallengeById = cache(async (id: string) => getRecord<Competition>(COLLECTIONS.competitions, id));
export const getChallengeBySlug = cache(async (slug: string) => (await listCollection<Competition>(COLLECTIONS.competitions, [where("slug", "==", slug), limit(1)]).catch(() => []))[0] || null);
export const getPublicChallenges = cache(async () => listCollection<Competition>(COLLECTIONS.competitions, [where("visibility", "==", "public"), where("status", "in", ["published", "open", "registration_closed", "submission_closed", "evaluation", "results_declared"]), limit(100)]).catch(() => []));
export async function findUserByMembershipId(membershipId: string) { return (await listCollection<UserProfile>(COLLECTIONS.users, [where("membershipId", "==", membershipId.trim().toUpperCase()), limit(1)]).catch(() => []))[0] || null; }
export async function createChallengeParticipation(data: Omit<ChallengeParticipation, "id" | "createdAt" | "updatedAt">) { const ref = await createRecord<ChallengeParticipation>(COLLECTIONS.challengeParticipations, { ...data, status: data.status || "registered", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); return { id: ref.id, ...data, status: data.status || "registered" } as ChallengeParticipation; }
export const getMyChallengeParticipations = cache(async (memberId: string) => listCollection<ChallengeParticipation>(COLLECTIONS.challengeParticipations, [where("memberId", "==", memberId), limit(100)]).catch(() => []));
export const getChallengeParticipations = cache(async (challengeId: string) => listCollection<ChallengeParticipation>(COLLECTIONS.challengeParticipations, [where("challengeId", "==", challengeId), limit(200)]).catch(() => []));
export async function getMyChallengeParticipation(challengeId: string, memberId: string) { return (await listCollection<ChallengeParticipation>(COLLECTIONS.challengeParticipations, [where("challengeId", "==", challengeId), where("memberId", "==", memberId), limit(1)]).catch(() => []))[0] || null; }
export async function createChallengeTeam(data: Omit<ChallengeTeam, "id" | "createdAt" | "updatedAt">) { const payload = { ...data, memberIds: Array.from(new Set(data.memberIds || [data.leaderMemberId])), acceptedMemberIds: Array.from(new Set(data.acceptedMemberIds || [data.leaderMemberId])), memberMembershipIds: Array.from(new Set(data.memberMembershipIds || [data.leaderMembershipId || ""].filter(Boolean))), invitedMembershipIds: data.invitedMembershipIds || [], rejectedMemberIds: data.rejectedMemberIds || [], status: data.status || "active" } as ChallengeTeam; const ref = await createRecord<ChallengeTeam>(COLLECTIONS.challengeTeams, { ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); return { ...payload, id: ref.id } as ChallengeTeam; }
export const getMyChallengeTeams = cache(async (memberId: string) => listCollection<ChallengeTeam>(COLLECTIONS.challengeTeams, [where("memberIds", "array-contains", memberId), limit(100)]).catch(() => []));
export const getTeamsForChallenge = cache(async (challengeId: string) => listCollection<ChallengeTeam>(COLLECTIONS.challengeTeams, [where("challengeId", "==", challengeId), limit(100)]).catch(() => []));
export async function createChallengeTeamInvite(data: Omit<ChallengeTeamInvite, "id" | "createdAt" | "updatedAt" | "respondedAt">) { return createRecord<ChallengeTeamInvite>(COLLECTIONS.challengeTeamInvites, { ...data, status: data.status || "pending", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); }
export const getPendingChallengeInvitesForMember = cache(async (memberId: string) => listCollection<ChallengeTeamInvite>(COLLECTIONS.challengeTeamInvites, [where("invitedMemberId", "==", memberId), where("status", "==", "pending"), limit(100)]).catch(() => []));
export async function respondToChallengeInvite(invite: ChallengeTeamInvite, status: "accepted" | "rejected", memberId: string) { if (invite.invitedMemberId !== memberId) throw new Error("You can only respond to your own invite."); await updateRecord(COLLECTIONS.challengeTeamInvites, invite.id, { status, respondedAt: serverTimestamp() }); const team = await getRecord<ChallengeTeam>(COLLECTIONS.challengeTeams, invite.teamId); if (team) await updateRecord(COLLECTIONS.challengeTeams, invite.teamId, status === "accepted" ? { memberIds: arrayUnion(memberId), acceptedMemberIds: arrayUnion(memberId), memberMembershipIds: arrayUnion(invite.invitedMembershipId), updatedAt: serverTimestamp() } : { rejectedMemberIds: arrayUnion(memberId), updatedAt: serverTimestamp() }); }
export async function createOrUpdateChallengeSubmission(data: Omit<ChallengeSubmission, "id" | "createdAt" | "updatedAt"> & { id?: string }) { const payload = { ...data, evidenceLinks: data.evidenceLinks || [], locked: data.status === "submitted" ? true : Boolean(data.locked), evaluationStatus: data.evaluationStatus || "pending", resultApproved: data.resultApproved || false, ...(data.status === "submitted" ? { submittedAt: serverTimestamp() } : {}), updatedAt: serverTimestamp() }; if (data.id) { await updateRecord(COLLECTIONS.challengeSubmissions, data.id, payload as Record<string, unknown>); return { ...data, id: data.id } as ChallengeSubmission; } const ref = await createRecord<ChallengeSubmission>(COLLECTIONS.challengeSubmissions, { ...payload, createdAt: serverTimestamp() } as never); return { ...data, id: ref.id } as ChallengeSubmission; }
export const getMyChallengeSubmissions = cache(async (memberId: string) => listCollection<ChallengeSubmission>(COLLECTIONS.challengeSubmissions, [where("submittedByMemberId", "==", memberId), limit(100)]).catch(() => []));
export const getSubmissionsForTeam = cache(async (teamId: string) => listCollection<ChallengeSubmission>(COLLECTIONS.challengeSubmissions, [where("teamId", "==", teamId), limit(20)]).catch(() => []));

export const getInternalThreads = cache(async () =>
  listCollection<InternalThread>(COLLECTIONS.internalThreads, [
    orderBy("createdAt", "desc"),
    limit(100),
  ]),
);
export const getCareerOpenings = cache(async () =>
  listCollection<CareerOpening>(COLLECTIONS.careerOpenings, [
    where("visibility", "==", "public"),
    orderBy("createdAt", "desc"),
    limit(100),
  ]).catch(() =>
    listCollection<CareerOpening>(COLLECTIONS.careerOpenings, [
      orderBy("createdAt", "desc"),
      limit(100),
    ]),
  ),
);


export async function createMemberProblemStatement(data: Omit<ProblemStatement, "id" | "createdAt" | "updatedAt"> & { status: "draft" | "submitted" }) {
  if (!data.title?.trim()) throw new Error("Problem title is required.");
  const memberId = data.memberId || data.submittedByUserId || data.createdBy || data.submittedBy || data.submitterId || "";
  if (!memberId) throw new Error("Member ID is required.");
  const isSubmitted = data.status === "submitted";
  const evidenceLinks = data.evidenceLinks || data.attachmentsOrDriveLinks || data.attachments || [];
  const payload = {
    ...data,
    category: data.category || data.sector || "Other",
    industrySegment: data.industrySegment || data.sector || "",
    shortDescription: data.shortDescription || data.summary || "",
    description: data.summary || data.shortDescription || "",
    detailedDescription: data.detailedDescription || data.problemDescription || data.summary || "",
    problemDescription: data.problemDescription || data.detailedDescription || data.summary || "",
    questionnaireAnswers: data.questionnaireAnswers || {},
    questionnaireResponses: data.questionnaireAnswers || data.questionnaireResponses || {},
    impactEstimate: data.impactEstimate || {},
    impactMetrics: data.impactMetrics || { isPublic: false },
    adminVisibilityFlags: data.adminVisibilityFlags || { meetingNotesVisibleToMemberDefault: false },
    evidenceLinks,
    attachmentsOrDriveLinks: evidenceLinks,
    attachments: evidenceLinks,
    memberId,
    createdBy: data.createdBy || memberId,
    submittedBy: data.submittedBy || memberId,
    submittedByUserId: memberId,
    submitterId: data.submitterId || memberId,
    ownerIds: Array.from(new Set([memberId, ...(data.ownerIds || [])].filter(Boolean))),
    status: data.status,
    adminReviewStatus: data.status,
    visibility: data.visibility || "submitter_only",
    priority: data.priority || data.urgency || "medium",
    onboardingSessionIds: data.onboardingSessionIds || [],
    questionnaireResponseIds: data.questionnaireResponseIds || [],
    sopIds: data.sopIds || [],
    knowledgeAssetIds: data.knowledgeAssetIds || [],
    researchItemIds: data.researchItemIds || [],
    pilotTrackIds: data.pilotTrackIds || [],
    meetingLogIds: data.meetingLogIds || [],
    competitionIds: data.competitionIds || [],
    discussionPostIds: data.discussionPostIds || [],
    linkedResources: data.linkedResources || [],
    ...(isSubmitted ? { submittedAt: serverTimestamp() } : {}),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const created = await createRecord<ProblemStatement>(COLLECTIONS.problemStatements, payload as WithFieldValue<Omit<ProblemStatement, "id">>);
  if (isSubmitted) {
    await bumpStats("problemStatementCount");
    await routeToAdminInbox({ type: "problem_submission", title: data.title, description: payload.summary || payload.shortDescription, sourceCollection: COLLECTIONS.problemStatements, sourceId: created.id, createdBy: memberId });
    await logAudit({ actorId: memberId, action: "problem_submitted", collectionName: COLLECTIONS.problemStatements, documentId: created.id, after: { status: "submitted", visibility: "submitter_only" } });
    await createProblemTimelineEvent(created.id, "problem_submitted", "Problem submitted", memberId, { title: data.title }, "submitter_only");
    await createNotification({ userId: memberId, type: "problem_submission", title: "Problem statement submitted", message: data.title, problemStatementId: created.id });
    await notifyAdmins("problem_submission", "New MSME Problem Submitted", data.title, created.id);
  }
  return created;
}

export async function updateMemberDraftProblemStatement(id: string, data: Partial<ProblemStatement> & { status?: "draft" | "submitted" }, actorId: string) {
  const current = await getProblemStatementById(id);
  if (!current) throw new Error("Problem not found.");
  if (current.status !== "draft") throw new Error("Only draft problems can be edited by members.");
  if (![current.memberId, current.submittedByUserId, current.createdBy, current.submitterId].includes(actorId)) throw new Error("You can only edit your own draft problems.");
  const isSubmitted = data.status === "submitted";
  const patch: Partial<ProblemStatement> = { ...data, updatedAt: serverTimestamp() as never, adminReviewStatus: data.status || current.adminReviewStatus, ...(isSubmitted ? { submittedAt: serverTimestamp() as never } : {}) };
  await updateRecord(COLLECTIONS.problemStatements, id, patch as Record<string, unknown>);
  if (isSubmitted) {
    await routeToAdminInbox({ type: "problem_submission", title: data.title || current.title, description: data.summary || current.summary, sourceCollection: COLLECTIONS.problemStatements, sourceId: id, createdBy: actorId });
    await createProblemTimelineEvent(id, "problem_submitted", "Problem submitted", actorId, { title: data.title || current.title }, "submitter_only");
    await notifyAdmins("problem_submission", "New MSME Problem Submitted", data.title || current.title, id);
  }
}

export const getMemberVisibleProblemMeetingNotes = cache(async (problemId: string) =>
  listCollection<ProblemMeetingNote>(COLLECTIONS.problemMeetingNotes, [where("problemId", "==", problemId), where("visibleToMember", "==", true), limit(100)]).catch(() => []),
);


export const demoImpactMetrics: PublicImpactMetrics = { totalProblemsSubmitted: 48, totalProblemsSolved: 9, totalChallengesLaunched: 7, totalChallengeParticipants: 126, totalCaseStudiesPublished: 4, totalCommunityPosts: 38, totalMonetarySavings: "₹18.4L", totalTimeSaved: "1,240 hrs", totalWasteReduction: "11.8%", totalProductivityGain: "14.5%", totalClientsGained: 23, totalPublicReviews: 6 };
export async function getPublicProblemReviews() { return listCollection<ProblemPublicReview>(COLLECTIONS.problemPublicReviews, [where("approvedForPublic", "==", true), limit(20)]).catch(() => []); }
export const getProblemReviewsForMember = cache(async (memberId: string) => listCollection<ProblemPublicReview>(COLLECTIONS.problemPublicReviews, [where("memberId", "==", memberId), limit(100)]).catch(() => []));
export async function getProblemReviewForMember(problemId: string, memberId: string) { return (await listCollection<ProblemPublicReview>(COLLECTIONS.problemPublicReviews, [where("problemId", "==", problemId), where("memberId", "==", memberId), limit(1)]).catch(() => []))[0] || null; }
export async function upsertProblemPublicReview(data: Omit<ProblemPublicReview, "id" | "createdAt" | "updatedAt" | "approvedForPublic" | "adminTags"> & { id?: string }) { const payload = { ...data, approvedForPublic: false, adminTags: [], updatedAt: serverTimestamp() }; if (data.id) { await updateRecord(COLLECTIONS.problemPublicReviews, data.id, payload as Record<string, unknown>); return { ...data, id: data.id, approvedForPublic: false, adminTags: [] } as ProblemPublicReview; } const ref = await createRecord<ProblemPublicReview>(COLLECTIONS.problemPublicReviews, { ...payload, createdAt: serverTimestamp() } as never); return { ...data, id: ref.id, approvedForPublic: false, adminTags: [] } as ProblemPublicReview; }
export async function getCaseStudyComments(caseStudyId: string) { return listCollection<CaseStudyComment>(COLLECTIONS.caseStudyComments, [where("caseStudyId", "==", caseStudyId), where("status", "in", ["approved", "pending"]), limit(100)]).catch(() => []); }
export async function createCaseStudyComment(data: Omit<CaseStudyComment, "id" | "createdAt" | "updatedAt" | "status">) { const ref = await createRecord<CaseStudyComment>(COLLECTIONS.caseStudyComments, { ...data, status: "pending", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); return { ...data, id: ref.id, status: "pending" } as CaseStudyComment; }
export async function getCaseStudyUpvote(caseStudyId: string, memberId: string) { return (await listCollection<CaseStudyUpvote>(COLLECTIONS.caseStudyUpvotes, [where("caseStudyId", "==", caseStudyId), where("memberId", "==", memberId), limit(1)]).catch(() => []))[0] || null; }
export async function toggleCaseStudyUpvote(caseStudyId: string, memberId: string, membershipId?: string) { const existing = await getCaseStudyUpvote(caseStudyId, memberId); if (existing) { await deleteRecord(COLLECTIONS.caseStudyUpvotes, existing.id); return false; } await createRecord<CaseStudyUpvote>(COLLECTIONS.caseStudyUpvotes, { caseStudyId, memberId, membershipId, createdAt: serverTimestamp() } as never); return true; }
export async function getPublicImpactMetrics(): Promise<PublicImpactMetrics> { const [problems, solved, challenges, participants, cases, posts, reviews] = await Promise.all([listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [limit(200)]).catch(() => []), listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [where("status", "==", "solved"), limit(100)]).catch(() => []), getPublicChallenges().catch(() => []), listCollection<ChallengeParticipation>(COLLECTIONS.challengeParticipations, [limit(500)]).catch(() => []), listCollection(COLLECTIONS.msmeCases, [where("visibility", "==", "public"), limit(100)]).catch(() => []), listPublicDiscussionThreads().catch(() => []), getPublicProblemReviews().catch(() => [])]); const publicMetrics = problems.map((p) => p.impactMetrics).filter((m) => m?.isPublic); return { ...demoImpactMetrics, totalProblemsSubmitted: Math.max(problems.length, demoImpactMetrics.totalProblemsSubmitted), totalProblemsSolved: Math.max(solved.length, demoImpactMetrics.totalProblemsSolved), totalChallengesLaunched: Math.max(challenges.length, demoImpactMetrics.totalChallengesLaunched), totalChallengeParticipants: Math.max(participants.length, demoImpactMetrics.totalChallengeParticipants), totalCaseStudiesPublished: Math.max(cases.length, demoImpactMetrics.totalCaseStudiesPublished), totalCommunityPosts: Math.max(posts.length, demoImpactMetrics.totalCommunityPosts), totalPublicReviews: Math.max(reviews.length, demoImpactMetrics.totalPublicReviews), totalClientsGained: Math.max(publicMetrics.reduce((sum, m) => sum + Number(m?.clientsGained || 0), 0), demoImpactMetrics.totalClientsGained) }; }



export const getProblemQuestionnaireResponsesAdmin = cache(async (problemId: string) => listCollection<ProblemQuestionnaireResponse>(COLLECTIONS.problemQuestionnaireResponses, [where("problemId", "==", problemId), limit(100)]).catch(() => []));
export const getMemberVisibleProblemQuestionnaireResponses = cache(async (problemId: string) => listCollection<ProblemQuestionnaireResponse>(COLLECTIONS.problemQuestionnaireResponses, [where("problemId", "==", problemId), where("visibleToMember", "==", true), limit(100)]).catch(() => []));
export async function createProblemQuestionnaireResponse(data: Omit<ProblemQuestionnaireResponse, "id" | "createdAt" | "updatedAt">) { const ref = await createRecord<ProblemQuestionnaireResponse>(COLLECTIONS.problemQuestionnaireResponses, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); return { ...data, id: ref.id } as ProblemQuestionnaireResponse; }
export const getProblemMeetingNotePdfsAdmin = cache(async (problemId: string) => listCollection<ProblemMeetingNotePdf>(COLLECTIONS.problemMeetingNotePdfs, [where("problemId", "==", problemId), limit(100)]).catch(() => []));
export const getMemberVisibleProblemMeetingNotePdfs = cache(async (problemId: string) => listCollection<ProblemMeetingNotePdf>(COLLECTIONS.problemMeetingNotePdfs, [where("problemId", "==", problemId), where("visibleToMember", "==", true), limit(100)]).catch(() => []));
export async function createProblemMeetingNotePdf(data: Omit<ProblemMeetingNotePdf, "id" | "createdAt" | "updatedAt">) { const ref = await createRecord<ProblemMeetingNotePdf>(COLLECTIONS.problemMeetingNotePdfs, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); return { ...data, id: ref.id } as ProblemMeetingNotePdf; }
export const getProblemMeetingNotesAdmin = cache(async (problemId: string) => listCollection<ProblemMeetingNote>(COLLECTIONS.problemMeetingNotes, [where("problemId", "==", problemId), limit(100)]).catch(() => []));
export async function createProblemMeetingNote(data: Omit<ProblemMeetingNote, "id" | "createdAt" | "updatedAt">) { const ref = await createRecord<ProblemMeetingNote>(COLLECTIONS.problemMeetingNotes, { ...data, title: data.meetingTitle || data.title || "Meeting note", createdByAdminId: data.createdByAdminId || data.adminId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); return { ...data, id: ref.id } as ProblemMeetingNote; }
export async function updateProblemImpactMetrics(problemId: string, impactMetrics: ProblemStatement["impactMetrics"], actorId: string) { await updateRecord(COLLECTIONS.problemStatements, problemId, { impactMetrics, updatedAt: serverTimestamp() }); await logAudit({ actorId, action: "problem_impact_metrics_updated", collectionName: COLLECTIONS.problemStatements, documentId: problemId, after: impactMetrics as never }); }
export async function moderateProblemPublicReview(reviewId: string, patch: Pick<ProblemPublicReview, "approvedForPublic" | "adminTags"> & { reviewedBy?: string; moderationStatus?: ProblemPublicReview["moderationStatus"] }) { return updateRecord(COLLECTIONS.problemPublicReviews, reviewId, { ...patch, reviewedAt: serverTimestamp(), updatedAt: serverTimestamp() }); }

export async function createProblemStatement(
  data: Omit<
    ProblemStatement,
    "id" | "createdAt" | "updatedAt" | "status" | "visibility"
  >,
) {
  if (!data.title?.trim())
    throw new Error("Problem statement title is required.");
  const createdBy = data.submittedByUserId || data.createdBy || data.submittedBy || data.submitterId || "";
  const shortDescription = data.shortDescription || data.summary || data.description || "";
  const detailedDescription =
    data.detailedDescription ||
    data.problemDescription ||
    data.problemStatement ||
    data.description ||
    "";
  const attachmentsOrDriveLinks = data.attachmentsOrDriveLinks || data.attachments || [];
  const payload = {
    ...data,
    shortDescription,
    detailedDescription,
    summary: shortDescription,
    description: shortDescription,
    problemDescription: detailedDescription,
    problemStatement: detailedDescription,
    attachmentsOrDriveLinks,
    attachments: attachmentsOrDriveLinks,
    questionnaireResponses: data.questionnaireResponses || data.questionnaire || {},
    createdBy,
    submittedBy: data.submittedBy || createdBy,
    submittedByUserId: createdBy,
    submitterId: data.submitterId || createdBy,
    ownerIds: Array.from(new Set([createdBy, ...(data.ownerIds || [])].filter(Boolean))),
    status: "submitted",
    adminReviewStatus: "submitted",
    visibility: "submitter_only",
    priority: data.priority || "medium",
    onboardingSessionIds: data.onboardingSessionIds || [],
    questionnaireResponseIds: data.questionnaireResponseIds || [],
    sopIds: data.sopIds || [],
    knowledgeAssetIds: data.knowledgeAssetIds || [],
    researchItemIds: data.researchItemIds || [],
    pilotTrackIds: data.pilotTrackIds || [],
    meetingLogIds: data.meetingLogIds || [],
    competitionIds: data.competitionIds || [],
    discussionPostIds: data.discussionPostIds || [],
    linkedResources: data.linkedResources || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const created = await createRecord<ProblemStatement>(
    COLLECTIONS.problemStatements,
    payload as WithFieldValue<Omit<ProblemStatement, "id">>,
  );
  await bumpStats("problemStatementCount");
  await routeToAdminInbox({
    type: "problem_submission",
    title: data.title,
    description: payload.shortDescription,
    sourceCollection: COLLECTIONS.problemStatements,
    sourceId: created.id,
    createdBy,
  });
  await logAudit({
    actorId: createdBy || "system",
    action: "problem_submitted",
    collectionName: COLLECTIONS.problemStatements,
    documentId: created.id,
    after: { status: "submitted", visibility: "submitter_only" },
  });
  await createProblemTimelineEvent(created.id, "problem_submitted", "Problem submitted", createdBy || "system", { title: data.title }, "submitter_only");
  if (createdBy)
    await createNotification({
      userId: createdBy,
      type: "problem_submission",
      title: "Problem statement submitted",
      message: data.title,
      problemStatementId: created.id,
    });
  await notifyAdmins(
    "problem_submission",
    "New MSME Problem Submitted",
    data.title,
    created.id,
  );
  return created;
}
export const createChallengeFromProblem = createProblemStatement;
export async function createResearchPost(
  data: Omit<
    ResearchPost,
    "id" | "createdAt" | "updatedAt" | "status" | "visibility"
  >,
) {
  const problemStatementId =
    data.problemStatementId || data.associatedProblemId;
  const payload = {
    ...data,
    problemStatementId,
    associatedProblemId: problemStatementId,
    documentLinks:
      data.documentLinks ||
      [
        data.documentLink,
        data.supportingFolderLink,
        ...(data.externalReferences || []),
      ].filter(Boolean),
    status: "under_review",
    visibility: "admin_only",
    submittedBy: data.submittedBy || data.createdBy || data.author,
    researchType: data.researchType || "other",
    generalResearch: !problemStatementId,
    isGeneralResearch: !problemStatementId,
    recommendedAction: data.recommendedAction || (problemStatementId ? "discuss" : "link_to_problem"),
    implementationDifficulty: data.implementationDifficulty || "unknown",
    costImplication: data.costImplication || "unknown",
    maturityLevel: data.maturityLevel || "unknown",
    evidenceStrength: data.evidenceStrength || "unknown",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const created = await createRecord<ResearchPost>(
    COLLECTIONS.researchPosts,
    payload as WithFieldValue<Omit<ResearchPost, "id">>,
  );
  await bumpStats("researchCount");
  await routeToAdminInbox({
    type: "research_submission",
    title: data.title,
    description: data.summary || data.abstract,
    sourceCollection: COLLECTIONS.researchPosts,
    sourceId: created.id,
    createdBy: data.createdBy || data.author,
  });
  await logAudit({
    actorId: data.createdBy || data.author || "system",
    action: "research_submitted",
    collectionName: COLLECTIONS.researchPosts,
    documentId: created.id,
    after: { status: "under_review", visibility: "admin_only", problemStatementId },
  });
  if (data.createdBy || data.author)
    await createNotification({
      userId: data.createdBy || data.author || "",
      type: "research_submission",
      title: "Research submitted",
      message: data.title,
      problemStatementId,
    });
  if (problemStatementId) {
    const problem = await getRecord<ProblemStatement>(
      COLLECTIONS.problemStatements,
      problemStatementId,
    );
    const creator = problem?.createdBy || problem?.submittedBy;
    if (creator)
      await createNotification({
        userId: creator,
        type: "research_submission",
        title: "Research linked",
        message: data.title,
        problemStatementId,
      });
  }
  await notifyAdmins(
    "research_submission",
    "New Research",
    data.title,
    problemStatementId,
  );

  if (problemStatementId) {
    await linkCreatedResource(problemStatementId, { type: "research_item", resourceType: "research_item", collection: COLLECTIONS.researchPosts, resourceId: created.id, title: data.title, description: data.summary || data.abstract, url: data.sourceLink || data.driveLink || data.documentLink || data.researchLink, visibility: "admin_only", status: "under_review" }, data.createdBy || data.author || "");
    await updateRecord(COLLECTIONS.problemStatements, problemStatementId, { researchItemIds: arrayUnion(created.id) });
    await createProblemTimelineEvent(problemStatementId, "research_added", data.title || "Research added", data.createdBy || data.author || "", { resourceId: created.id }, "admin_only");
  }
  return created;
}

export const createResearchItem = createResearchPost as (data: Omit<ResearchItem, "id" | "createdAt" | "updatedAt" | "status" | "visibility">) => ReturnType<typeof createResearchPost>;
export async function updateResearchItem(id: string, patch: Partial<ResearchItem>, actorId = "") {
  const existing = await getRecord<ResearchItem>(COLLECTIONS.researchPosts, id);
  await updateRecord(COLLECTIONS.researchPosts, id, { ...patch, updatedAt: serverTimestamp() });
  const problemStatementId = patch.problemStatementId || existing?.problemStatementId;
  if (problemStatementId) await createProblemTimelineEvent(problemStatementId, "research_updated", patch.title || existing?.title || "Research updated", actorId, { resourceId: id }, patch.visibility || existing?.visibility || "admin_only");
}
export const getResearchItemById = cache(async (id: string) => getRecord<ResearchItem>(COLLECTIONS.researchPosts, id));
export const getResearchItemsForProblem = cache(async (problemStatementId: string) => listCollection<ResearchItem>(COLLECTIONS.researchPosts, [where("problemStatementId", "==", problemStatementId), limit(100)]));
export const getGeneralResearchItems = cache(async () => listCollection<ResearchItem>(COLLECTIONS.researchPosts, [where("generalResearch", "==", true), limit(100)]).catch(() => listCollection<ResearchItem>(COLLECTIONS.researchPosts, [limit(100)]).then((rows) => rows.filter((r) => !r.problemStatementId))));
export const getMyResearchItems = cache(async (userId: string) => listCollection<ResearchItem>(COLLECTIONS.researchPosts, [where("createdBy", "==", userId), limit(100)]));
export const getAdminResearchItems = cache(async () => listCollection<ResearchItem>(COLLECTIONS.researchPosts, [orderBy("createdAt", "desc"), limit(300)]));
export const getPublicResearchItems = cache(async () => (await listCollection<ResearchItem>(COLLECTIONS.researchPosts, [where("visibility", "==", "public"), limit(200)])).filter((r) => ["approved", "published", "public"].includes(r.status || "")));
export const getPublicResearchItemsSafe = getPublicResearchItems;
export async function updateResearchItemStatus(id: string, status: ResearchItem["status"], actorId = "") {
  const existing = await getRecord<ResearchItem>(COLLECTIONS.researchPosts, id);
  const patch: Partial<ResearchItem> = { status, reviewedBy: actorId, reviewedAt: serverTimestamp() as never };
  if (status === "approved") patch.approvedBy = actorId;
  if (status === "published") patch.publishedAt = serverTimestamp() as never;
  await updateResearchItem(id, patch, actorId);
  if (["approved","published","public"].includes(status || "") && existing) await autoLogContribution({ contributorUserId: existing.createdBy || existing.submittedBy || actorId, contributionTitle: existing.title, contributionSummary: existing.summary || existing.abstract, contributionCategory: "research", contributionType: existing.researchType === "technology_trend" ? "technology_watch_item" : String(existing.researchType) === "industry_study" ? "industry_study" : "research_report", relatedEntityType: "research_item", relatedEntityId: id, relatedEntityTitle: existing.title, evidenceLinks: [existing.sourceLink, existing.driveLink, ...(existing.attachmentLinks || [])].filter(Boolean) as string[], impactSummary: existing.practicalRelevance, measurableImpact: existing.measurableImpact, createdBy: actorId });
  if (existing?.problemStatementId && status === "approved") await createProblemTimelineEvent(existing.problemStatementId, "research_approved", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only");
  if (existing?.problemStatementId && status === "published") await createProblemTimelineEvent(existing.problemStatementId, "research_published", existing.title, actorId, { resourceId: id }, existing.visibility || "public");
}
export async function updateResearchItemVisibility(id: string, visibility: ResearchItem["visibility"], actorId = "") { return updateResearchItem(id, { visibility }, actorId); }
export async function archiveResearchItem(id: string, actorId = "") { const existing = await getRecord<ResearchItem>(COLLECTIONS.researchPosts, id); await updateResearchItem(id, { status: "archived", recommendedAction: "archive" }, actorId); if (existing?.problemStatementId) await createProblemTimelineEvent(existing.problemStatementId, "research_archived", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only"); }
export async function linkResearchItemToProblem(id: string, problemStatementId: string, actorId = "") {
  const item = await getRecord<ResearchItem>(COLLECTIONS.researchPosts, id);
  if (!item) throw new Error("Research item not found");
  await updateRecord(COLLECTIONS.researchPosts, id, { problemStatementId, associatedProblemId: problemStatementId, generalResearch: false, isGeneralResearch: false, recommendedAction: "discuss" });
  await linkCreatedResource(problemStatementId, { type: "research_item", resourceType: "research_item", collection: COLLECTIONS.researchPosts, resourceId: id, title: item.title, description: item.summary || item.abstract, url: item.sourceLink || item.driveLink || item.documentLink || item.researchLink, visibility: item.visibility || "admin_only", status: (item.status || "under_review") as PlatformStatus }, actorId);
  await updateRecord(COLLECTIONS.problemStatements, problemStatementId, { researchItemIds: arrayUnion(id) });
  await createProblemTimelineEvent(problemStatementId, "research_linked", item.title || "Research linked", actorId, { resourceId: id }, item.visibility || "admin_only");
}
export async function unlinkResearchItemFromProblem(id: string, actorId = "") {
  const item = await getRecord<ResearchItem>(COLLECTIONS.researchPosts, id);
  if (item?.problemStatementId) await updateRecord(COLLECTIONS.problemStatements, item.problemStatementId, { researchItemIds: arrayRemove(id) });
  await updateRecord(COLLECTIONS.researchPosts, id, { problemStatementId: null, associatedProblemId: null, generalResearch: true, isGeneralResearch: true, recommendedAction: "link_to_problem" });
}
export async function convertResearchItemToKnowledgeAsset(id: string, actorId = "") {
  const item = await getRecord<ResearchItem>(COLLECTIONS.researchPosts, id);
  if (!item || !item.problemStatementId) throw new Error("Research must be linked to a problem before conversion.");
  const asset = await createKnowledgeAsset({ problemStatementId: item.problemStatementId, title: item.title, shortDescription: item.summary || item.abstract || item.practicalRelevance || "", detailedContent: [item.keyFindings, item.practicalRelevance, item.relevanceToMSME, item.relevanceToProblem].filter(Boolean).join("\n\n"), category: item.researchType === "startup_case_study" ? "startup_success_story" : item.researchType === "msme_success_story" ? "msme_success_story" : "report", sourceType: "research_derived", sourceName: item.sourceName, sourceLink: item.sourceLink, driveLink: item.driveLink, attachmentLinks: item.attachmentLinks, tags: item.tags || item.keywords, industrySegment: item.industrySegment, problemCategory: item.problemCategory, relevanceToProblem: item.relevanceToProblem || item.practicalRelevance, keyTakeaways: item.keyFindings ? item.keyFindings.split("\n").filter(Boolean) : [], sourceId: item.id, sourceResearchId: item.id, createdBy: actorId || item.createdBy || "system", status: "under_review", visibility: "admin_only" });
  await updateResearchItem(id, { recommendedAction: "convert_to_knowledge" }, actorId);
  await createProblemTimelineEvent(item.problemStatementId, "research_converted_to_knowledge", item.title || "Research converted to knowledge", actorId, { resourceId: id, knowledgeAssetId: asset.id }, "admin_only");
  return asset;
}

export async function createCollaborationRequest(
  data: Omit<CollaborationRequest, "id" | "createdAt" | "updatedAt" | "status">,
) {
  const created = await createRecord<CollaborationRequest>(
    COLLECTIONS.collaborationRequests,
    {
      ...data,
      sourceType: data.sourceType || data.associatedType,
      sourceId: data.sourceId || data.associatedId,
      status: "submitted",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as WithFieldValue<Omit<CollaborationRequest, "id">>,
  );
  await routeToAdminInbox({
    type: "collaboration_request",
    title: data.title,
    description: data.description,
    sourceCollection: COLLECTIONS.collaborationRequests,
    sourceId: created.id,
    createdBy: data.createdBy,
  });
  await notifyAdmins(
    "collaboration_request",
    "New Collaboration Request",
    data.title,
  );
  if (data.createdBy)
    await createNotification({
      userId: data.createdBy,
      type: "collaboration_request",
      title: "Collaboration requested",
      message: data.title,
    });
  return created;
}

export async function createCommunityPost(
  data: Omit<
    CommunityPost,
    "id" | "createdAt" | "updatedAt" | "upvotes" | "bookmarks" | "comments"
  >,
) {
  const associatedType = (data.associatedType || data.linkedEntityType || data.targetType || "general") as DiscussionTargetType;
  const associatedId = data.associatedId || data.linkedEntityId || data.targetId || null;
  if (associatedType !== "general" && !associatedId) throw new Error("Linked entity is required for non-general discussions.");
  const typeByEntity: Partial<Record<DiscussionTargetType, CommunityPost["type"]>> = { problem_statement: "problem", research: "research", competition: "competition", knowledge_asset: "knowledge", organization: "organization", msme_case: "msme", team: "team", community: "general", general: "general" };
  const discussionType = data.type || typeByEntity[associatedType] || "general";
  const problemStatementId =
    associatedType === "problem_statement"
      ? associatedId
      : data.problemStatementId || null;
  const created = await createRecord<CommunityPost>(
    COLLECTIONS.communityPosts,
    {
      ...data,
      type: discussionType,
      linkedEntityType: associatedType,
      linkedEntityId: associatedId,
      associatedType,
      associatedId,
      targetType: associatedType,
      targetId: associatedId,
      problemStatementId,
      upvotes: [],
      bookmarks: [],
      comments: [],
      views: 0,
      status: data.status || "public",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as WithFieldValue<Omit<CommunityPost, "id">>,
  );
  await bumpStats("communityCount");
  await logAudit({
    actorId: data.createdBy || data.author || "system",
    action: "community_post_created",
    collectionName: COLLECTIONS.communityPosts,
    documentId: created.id,
  });
  return created;
}
export async function addCommunityComment(
  post: CommunityPost,
  userId: string,
  content: string,
  parentCommentId?: string,
) {
  const comment: CommunityComment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    content,
    createdBy: userId,
    createdAt: new Date().toISOString(),
    replies: [],
  };
  const comments = [...(post.comments || [])];
  if (parentCommentId) {
    const parent = comments.find((item) => item.id === parentCommentId);
    if (!parent) throw new Error("Parent comment was not found.");
    parent.replies = [...(parent.replies || []), comment];
  } else {
    comments.push(comment);
  }
  const mentions = extractMentions(content);
  comment.mentions = mentions;
  await updateRecord(COLLECTIONS.communityPosts, post.id, { comments });
  await createRecord<CommunityComment>(parentCommentId ? COLLECTIONS.replies : COLLECTIONS.comments, { ...comment, postId: post.id, parentCommentId: parentCommentId || null } as never);
  await Promise.all(mentions.map((userId) => createNotification({ userId, type: "mention", title: "You were mentioned", message: post.title })));
  await createNotification({
    userId: post.createdBy || post.author,
    type: parentCommentId ? "reply" : "comment",
    title: "New comment",
    message: post.title,
  });
}


function extractMentions(content: string) {
  return Array.from(new Set((content.match(/@([a-zA-Z0-9_.-]+)/g) || []).map((m) => m.slice(1))));
}
export async function incrementCommunityView(postId: string) {
  await updateRecord(COLLECTIONS.communityPosts, postId, { views: increment(1) });
  return upsertRecord(COLLECTIONS.communityAnalytics, postId, { postId, views: increment(1), updatedAt: serverTimestamp() });
}
export async function toggleCommunityBookmark(post: CommunityPost, userId: string) {
  const bookmarked = post.bookmarks?.includes(userId);
  await updateRecord(COLLECTIONS.communityPosts, post.id, { bookmarks: bookmarked ? arrayRemove(userId) : arrayUnion(userId) });
  if (!bookmarked) {
    await createRecord<Bookmark>(COLLECTIONS.bookmarks, { userId, targetType: "community", targetId: post.id, title: post.title, href: `/community/${post.id}`, createdAt: serverTimestamp() } as WithFieldValue<Omit<Bookmark, "id">>);
    await createNotification({ userId: post.createdBy || post.author, type: "bookmark", title: "Discussion bookmarked", message: post.title });
  }
}
export async function reportCommunityComment(post: CommunityPost, commentId: string, userId: string) {
  const comments = (post.comments || []).map((comment) => comment.id === commentId ? { ...comment, reportedBy: Array.from(new Set([...(comment.reportedBy || []), userId])) } : comment);
  await updateRecord(COLLECTIONS.communityPosts, post.id, { comments });
  return notifyAdmins("community_report", "Community comment reported", post.title);
}
export async function editCommunityComment(post: CommunityPost, commentId: string, userId: string, content: string) {
  const comments = (post.comments || []).map((comment) => comment.id === commentId && comment.createdBy === userId ? { ...comment, content, updatedAt: new Date().toISOString() } : comment);
  return updateRecord(COLLECTIONS.communityPosts, post.id, { comments });
}
export async function deleteCommunityComment(post: CommunityPost, commentId: string, userId: string) {
  const comments = (post.comments || []).map((comment) => comment.id === commentId && comment.createdBy === userId ? { ...comment, content: "[deleted]", deleted: true, updatedAt: new Date().toISOString() } : comment);
  return updateRecord(COLLECTIONS.communityPosts, post.id, { comments });
}

export async function upvoteCommunityPost(postId: string, userId: string) {
  return updateRecord(COLLECTIONS.communityPosts, postId, { upvotes: arrayUnion(userId) });
}
export async function bookmarkCommunityPost(postId: string, userId: string) {
  return updateRecord(COLLECTIONS.communityPosts, postId, { bookmarks: arrayUnion(userId) });
}
export async function removeCommunityBookmark(postId: string, userId: string) {
  return updateRecord(COLLECTIONS.communityPosts, postId, { bookmarks: arrayRemove(userId) });
}
export async function editOwnCommunityPost(
  post: CommunityPost,
  userId: string,
  patch: Pick<CommunityPost, "title" | "content" | "tags">,
) {
  if ((post.createdBy || post.author) !== userId)
    throw new Error("Only the post owner can edit this discussion.");
  await updateRecord(
    COLLECTIONS.communityPosts,
    post.id,
    patch as Record<string, unknown>,
  );
  await logAudit({
    actorId: userId,
    action: "community_post_edited",
    collectionName: COLLECTIONS.communityPosts,
    documentId: post.id,
  });
}
export async function deleteOwnCommunityPost(
  post: CommunityPost,
  userId: string,
) {
  if ((post.createdBy || post.author) !== userId)
    throw new Error("Only the post owner can delete this discussion.");
  await deleteRecord(COLLECTIONS.communityPosts, post.id);
  await logAudit({
    actorId: userId,
    action: "community_post_deleted",
    collectionName: COLLECTIONS.communityPosts,
    documentId: post.id,
  });
}
export async function moderateCommunityPost(
  postId: string,
  reviewerId: string,
  status: "public" | "archived",
) {
  await updateRecord(COLLECTIONS.communityPosts, postId, {
    status,
    visibility: status === "archived" ? "private" : "public",
  });
  await logAudit({
    actorId: reviewerId,
    action: "community_moderated",
    collectionName: COLLECTIONS.communityPosts,
    documentId: postId,
    after: { status },
  });
}
export async function createPrivateCollaborationGroup(
  data: Omit<
    PrivateCollaborationGroup,
    "id" | "createdAt" | "updatedAt" | "visibility"
  >,
) {
  return createRecord<PrivateCollaborationGroup>(
    COLLECTIONS.privateCollaborationGroups,
    {
      ...data,
      visibility: "private",
      members: data.members || [],
      admins: data.admins || [data.createdBy].filter(Boolean),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as WithFieldValue<Omit<PrivateCollaborationGroup, "id">>,
  );
}
export async function reviewResearchPost(
  post: ResearchPost,
  reviewerId: string,
  action: "approve" | "reject" | "request_changes" | "publish" | "archive",
) {
  const status =
    action === "approve"
      ? "under_review"
      : action === "publish"
        ? "public"
        : action === "archive"
          ? "archived"
          : action === "reject"
            ? "archived"
            : "draft";
  const visibility = action === "publish" ? "public" : post.visibility;
  await updateRecord(COLLECTIONS.researchPosts, post.id, {
    status,
    visibility,
  });
  await logAudit({
    actorId: reviewerId,
    action: `research_${action}`,
    collectionName: COLLECTIONS.researchPosts,
    documentId: post.id,
    before: { status: post.status, visibility: post.visibility },
    after: { status, visibility },
  });
  if (post.createdBy || post.author)
    await createNotification({
      userId: post.createdBy || post.author || "",
      type: "research_submission",
      title: `Research ${action.replace("_", " ")}`,
      message: post.title,
      problemStatementId: post.problemStatementId || post.associatedProblemId,
    });
}
export async function closeCollaborationRequest(
  request: CollaborationRequest,
  reviewerId: string,
) {
  await updateRecord(COLLECTIONS.collaborationRequests, request.id, {
    status: "archived",
  });
  await logAudit({
    actorId: reviewerId,
    action: "collaboration_closed",
    collectionName: COLLECTIONS.collaborationRequests,
    documentId: request.id,
  });
}
export async function createCareerApplication(
  data: Omit<CareerApplication, "id" | "createdAt" | "status">,
) {
  const created = await createRecord<CareerApplication>(
    COLLECTIONS.careerApplications,
    {
      ...data,
      status: "submitted",
      createdAt: serverTimestamp(),
    } as WithFieldValue<Omit<CareerApplication, "id">>,
  );
  await routeToAdminInbox({
    type: "career_application",
    title: data.name,
    description: data.email,
    sourceCollection: COLLECTIONS.careerApplications,
    sourceId: created.id,
    createdBy: data.email,
  });
  await notifyAdmins("career_application", "New Career Application", data.name);
  return created;
}
export async function createAdminApplication(
  data: Omit<AdminApplication, "id" | "createdAt" | "status">,
) {
  const created = await createRecord<AdminApplication>(
    COLLECTIONS.adminApplications,
    {
      ...data,
      status: "pending",
      createdAt: serverTimestamp(),
    } as WithFieldValue<Omit<AdminApplication, "id">>,
  );
  await upsertRecord(COLLECTIONS.users, data.userId, {
    role: data.requestedRole && data.requestedRole !== "admin" ? "member" : "pending_admin",
    email: data.email,
    name: data.name,
    updatedAt: serverTimestamp(),
  });
  await routeToAdminInbox({
    type: "role_request",
    title: `New Role Request: ${data.name}`,
    description: `${data.email} requested ${data.requestedRole || "admin"}`,
    sourceCollection: COLLECTIONS.adminApplications,
    sourceId: created.id,
    createdBy: data.userId,
  });
  await notifyAdmins("role_request", "New Admin Applicant", data.name);
  return created;
}
export async function reviewAdminApplication(
  application: AdminApplication,
  reviewerId: string,
  status: "approved" | "rejected",
) {
  await updateRecord(COLLECTIONS.adminApplications, application.id, {
    status,
    reviewedBy: reviewerId,
    reviewedAt: serverTimestamp(),
  });
  await updateRecord(COLLECTIONS.users, application.userId, {
    role: status === "approved" ? application.requestedRole || "admin" : "member",
  });
  return logAudit({
    actorId: reviewerId,
    action: `admin_application_${status}`,
    collectionName: COLLECTIONS.adminApplications,
    documentId: application.id,
  });
}
export async function addChallengeReview(
  data: Omit<ChallengeReview, "id" | "createdAt">,
) {
  const problemStatementId = data.problemStatementId || data.challengeId || "";
  const before = await getRecord<ProblemStatement>(
    COLLECTIONS.problemStatements,
    problemStatementId,
  );
  const review = await createRecord<ChallengeReview>(
    COLLECTIONS.problemReviews,
    {
      ...data,
      problemStatementId,
      createdAt: serverTimestamp(),
    } as WithFieldValue<Omit<ChallengeReview, "id">>,
  );
  const patch: Record<string, unknown> = {};
  if (data.statusTo) patch.status = data.statusTo;
  if (data.visibilityTo) patch.visibility = data.visibilityTo;
  if (data.assignedTo) patch.assignedReviewer = data.assignedTo;
  if (data.comment || data.requestedInfo)
    patch.adminNotes = data.comment || data.requestedInfo;
  if (Object.keys(patch).length)
    await updateRecord(
      COLLECTIONS.problemStatements,
      problemStatementId,
      patch,
    );
  await logAudit({
    actorId: data.createdBy,
    action: data.action,
    collectionName: COLLECTIONS.problemStatements,
    documentId: problemStatementId,
    before: before
      ? {
          status: before.status,
          visibility: before.visibility,
          assignedReviewer: before.assignedReviewer,
        }
      : null,
    after: patch,
  });
  const creator = before?.createdBy || before?.submittedBy;
  if (creator && (data.statusTo || data.visibilityTo || data.requestedInfo))
    await createNotification({
      userId: creator,
      type: "problem_review",
      title: "Problem statement updated",
      message:
        data.requestedInfo || `Status: ${data.statusTo || before?.status}`,
      problemStatementId,
    });
  if (data.assignedTo)
    await createNotification({
      userId: data.assignedTo,
      type: "problem_review",
      title: "Problem statement assigned",
      message: before?.title || problemStatementId,
      problemStatementId,
    });
  return review;
}
export async function createCompetition(
  data: Omit<Competition, "id" | "createdAt" | "updatedAt" | "registrations" | "teams" | "submissions">,
) {
  const payload = {
    ...data,
    sourceType:
      data.sourceType ||
      (data.sourceResearchId
        ? "research"
        : data.sourceProblemId
          ? "problem_statement"
          : "general"),
    sourceId:
      data.sourceId ||
      data.sourceResearchId ||
      data.sourceProblemId ||
      "general",
    slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    shortDescription: data.shortDescription || data.description?.slice(0, 180) || "",
    detailedDescription: data.detailedDescription || data.description || "",
    linkedProblemStatementId: data.linkedProblemStatementId || data.sourceProblemId,
    competitionType: data.competitionType || "problem_challenge",
    participationMode: data.participationMode || "both",
    status: data.status || "draft",
    visibility: data.visibility || "admin_only",
    registrations: [],
    teams: [],
    submissions: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const created = await createRecord<Competition>(
    COLLECTIONS.competitions,
    payload as WithFieldValue<Omit<Competition, "id">>,
  );
  await bumpStats("competitionCount");
  await routeToAdminInbox({
    type: "competition_request",
    title: data.title,
    description: data.description,
    sourceCollection: COLLECTIONS.competitions,
    sourceId: created.id,
    createdBy: data.createdBy,
  });
  await logAudit({
    actorId: data.createdBy || "admin",
    action: "competition_created",
    collectionName: COLLECTIONS.competitions,
    documentId: created.id,
    after: { sourceType: payload.sourceType, sourceId: payload.sourceId },
  });
  await notifyAdmins("competition_request", "Competition created", data.title);
  return created;
}
export async function convertProblemToCompetition(
  problem: ProblemStatement,
  createdBy: string,
) {
  const created = await createCompetition({
    title: problem.title,
    description:
      problem.description ||
      problem.problemStatement ||
      problem.problemDescription ||
      problem.summary ||
      "",
    theme: problem.category,
    sourceType: "problem_statement",
    sourceId: problem.id,
    sourceProblemId: problem.id,
    rules: "Admin-defined rules pending.",
    prizes: "Admin-defined prizes pending.",
    createdBy,
  });
  await addChallengeReview({
    problemStatementId: problem.id,
    action: "convert_to_competition",
    statusFrom: problem.status,
    statusTo: "structured",
    createdBy,
  });
  return created;
}
export async function convertResearchToCompetition(
  research: ResearchPost,
  createdBy: string,
) {
  const created = await createCompetition({
    title: research.title,
    description: research.summary || research.abstract || "",
    theme: research.category,
    sourceType: "research",
    sourceId: research.id,
    sourceResearchId: research.id,
    rules: "Admin-defined rules pending.",
    prizes: "Admin-defined prizes pending.",
    createdBy,
  });
  await logAudit({
    actorId: createdBy,
    action: "research_converted_to_competition",
    collectionName: COLLECTIONS.researchPosts,
    documentId: research.id,
    after: { competitionId: created.id },
  });
  return created;
}
export async function addAdminInboxComment(item: AdminInboxItem, authorId: string, authorName: string, body: string) {
  const comment: AdminInboxComment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    body,
    authorId,
    authorName,
    createdAt: new Date().toISOString(),
  };
  await updateRecord(COLLECTIONS.adminInbox, item.id, {
    comments: [...(item.comments || []), comment],
  });
  return comment;
}

export async function updateAdminInboxStatus(item: AdminInboxItem, status: AdminInboxItem["status"], assignedTo?: string) {
  return updateRecord(COLLECTIONS.adminInbox, item.id, { status, assignedTo });
}

export async function updateCompetitionStatus(
  competition: Competition,
  reviewerId: string,
  status: Competition["status"],
  visibility: Competition["visibility"] = competition.visibility,
) {
  await updateRecord(COLLECTIONS.competitions, competition.id, {
    status,
    visibility,
  });
  await logAudit({
    actorId: reviewerId,
    action: `competition_${status}`,
    collectionName: COLLECTIONS.competitions,
    documentId: competition.id,
    before: { status: competition.status, visibility: competition.visibility },
    after: { status, visibility },
  });
  const type: Notification["type"] =
    status === "completed" ? "competition_update" : "competition_request";
  await notifyAdmins(type, `Competition ${status}`, competition.title);
}
export async function registerForCompetition(
  competition: Competition,
  userId: string,
) {
  await updateDoc(doc(db, COLLECTIONS.competitions, competition.id), {
    registrations: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  });
  await createNotification({
    userId,
    type: "competition_update",
    title: "Registration approved",
    message: competition.title,
  });
  await logAudit({
    actorId: userId,
    action: "competition_registered",
    collectionName: COLLECTIONS.competitions,
    documentId: competition.id,
  });
}

export async function registerForCompetitionParticipation(data: Omit<CompetitionParticipation, "id" | "createdAt" | "updatedAt">) { return createRecord<CompetitionParticipation>(COLLECTIONS.competitionParticipations, { ...data, status: data.status || "registered", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); }
export const getMyCompetitionParticipations = cache(async (userId: string) => listCollection<CompetitionParticipation>(COLLECTIONS.competitionParticipations, [where("participantUserId", "==", userId), limit(100)]));
export const getCompetitionParticipants = cache(async (competitionId: string) => listCollection<CompetitionParticipation>(COLLECTIONS.competitionParticipations, [where("competitionId", "==", competitionId), limit(200)]));
export async function approveParticipation(id: string) { return updateRecord(COLLECTIONS.competitionParticipations, id, { status: "approved", approvedAt: serverTimestamp(), updatedAt: serverTimestamp() }); }
export async function rejectParticipation(id: string) { return updateRecord(COLLECTIONS.competitionParticipations, id, { status: "rejected", updatedAt: serverTimestamp() }); }
export async function withdrawParticipation(id: string) { return updateRecord(COLLECTIONS.competitionParticipations, id, { status: "withdrawn", updatedAt: serverTimestamp() }); }

export async function createCompetitionTeam(
  data: Omit<CompetitionTeam, "id" | "createdAt" | "updatedAt">,
) {
  const team = await createRecord<CompetitionTeam>(
    COLLECTIONS.competitionTeams,
    {
      ...data,
      members: Array.from(new Set([data.leader, ...(data.members || [])])),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as WithFieldValue<Omit<CompetitionTeam, "id">>,
  );
  await updateDoc(doc(db, COLLECTIONS.competitions, data.competitionId), {
    teams: arrayUnion(team.id),
    updatedAt: serverTimestamp(),
  });
  return team;
}
export async function joinCompetitionTeam(
  team: CompetitionTeam,
  userId: string,
) {
  await updateDoc(doc(db, COLLECTIONS.competitionTeams, team.id), {
    members: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  });
}
export async function leaveCompetitionTeam(
  team: CompetitionTeam,
  userId: string,
) {
  if (team.leader === userId)
    throw new Error(
      "Team leader cannot leave without transferring leadership.",
    );
  await updateDoc(doc(db, COLLECTIONS.competitionTeams, team.id), {
    members: arrayRemove(userId),
    updatedAt: serverTimestamp(),
  });
}
export async function submitCompetitionSolution(
  data: Omit<CompetitionSubmission, "id" | "submittedAt">,
) {
  const created = await createRecord<CompetitionSubmission>(
    COLLECTIONS.competitionSubmissions,
    {
      ...data,
      solutionLinks: data.solutionLinks || [],
      supportingLinks: data.supportingLinks || [],
      submittedAt: serverTimestamp(),
    } as WithFieldValue<Omit<CompetitionSubmission, "id">>,
  );
  await updateDoc(doc(db, COLLECTIONS.competitions, data.competitionId), {
    submissions: arrayUnion(created.id),
    updatedAt: serverTimestamp(),
  });
  await routeToAdminInbox({
    type: "competition_request",
    title: data.title,
    description: "Competition submission received",
    sourceCollection: COLLECTIONS.competitionSubmissions,
    sourceId: created.id,
    createdBy: data.submittedBy || data.submittedByUserId || "unknown",
  });
  await notifyAdmins(
    "competition_submission",
    "Submission received",
    data.title,
  );
  await createNotification({
    userId: data.submittedBy || data.submittedByUserId || "unknown",
    type: "competition_submission",
    title: "Submission received",
    message: data.title,
  });
  return created;
}
export async function scoreCompetitionSubmission(
  submission: CompetitionSubmission,
  reviewerId: string,
  score: number,
  rank?: number,
  reviewNotes?: string,
  winner = false,
) {
  await updateRecord(COLLECTIONS.competitionSubmissions, submission.id, { winner, updatedAt: serverTimestamp() });
  await upsertAdminMetadata(COLLECTIONS.competitionSubmissionAdminMetadata, submission.id, { score, rank, reviewNotes, evaluatedBy: reviewerId, evaluatedAt: serverTimestamp() }, reviewerId);
  if (winner)
    await updateRecord(COLLECTIONS.competitions, submission.competitionId, {
      winnerSubmissionId: submission.id,
      winningTeamId: submission.teamId,
      status: "completed",
    });
  await logAudit({
    actorId: reviewerId,
    action: winner
      ? "competition_winner_selected"
      : "competition_submission_scored",
    collectionName: COLLECTIONS.competitionSubmissions,
    documentId: submission.id,
    after: { score, rank, winner },
  });
}

export async function updateCompetitionTeam(teamId: string, data: Partial<CompetitionTeam>) { return updateRecord(COLLECTIONS.competitionTeams, teamId, { ...data, updatedAt: serverTimestamp() }); }
export const getCompetitionTeamById = cache(async (id: string) => getRecord<CompetitionTeam>(COLLECTIONS.competitionTeams, id));
export const getTeamsForCompetition = cache(async (competitionId: string) => listCollection<CompetitionTeam>(COLLECTIONS.competitionTeams, [where("competitionId", "==", competitionId), limit(100)]));
export const getMyCompetitionTeams = cache(async (userId: string) => listCollection<CompetitionTeam>(COLLECTIONS.competitionTeams, [where("members", "array-contains", userId), limit(100)]));
export async function requestToJoinTeam(team: CompetitionTeam, userId: string) { return updateRecord(COLLECTIONS.competitionTeams, team.id, { requestedMemberIds: arrayUnion(userId), updatedAt: serverTimestamp() } as never); }
export async function approveCompetitionTeam(teamId: string, adminId: string) { return updateRecord(COLLECTIONS.competitionTeams, teamId, { status: "active", approvedAt: serverTimestamp(), updatedAt: serverTimestamp(), adminNotes: `Approved by ${adminId}` }); }
export async function rejectCompetitionTeam(teamId: string, adminId: string, adminNotes?: string) { return updateRecord(COLLECTIONS.competitionTeams, teamId, { status: "rejected", adminNotes: adminNotes || `Rejected by ${adminId}`, updatedAt: serverTimestamp() }); }
export const addTeamMember = joinCompetitionTeam;
export const removeTeamMember = leaveCompetitionTeam;
export async function withdrawTeam(teamId: string) { return updateRecord(COLLECTIONS.competitionTeams, teamId, { status: "withdrawn", updatedAt: serverTimestamp() }); }
export async function updateCompetitionSubmission(id: string, data: Partial<CompetitionSubmission>) { const { safe, metadata } = splitSensitiveFields(data as Record<string, unknown>, ["adminNotes", "reviewNotes"]); await updateRecord(COLLECTIONS.competitionSubmissions, id, { ...safe, ...sensitiveFieldDeletes(["adminNotes", "reviewNotes"]), updatedAt: serverTimestamp() }); await upsertAdminMetadata(COLLECTIONS.competitionSubmissionAdminMetadata, id, metadata); }
export async function createCompetitionSubmission(data: Omit<CompetitionSubmission, "id" | "updatedAt">) { const { safe, metadata } = splitSensitiveFields(data as Record<string, unknown>, ["adminNotes", "reviewNotes"]); const created = await createRecord<CompetitionSubmission>(COLLECTIONS.competitionSubmissions, { ...safe, status: data.status || "draft", visibility: data.visibility || "team_only", updatedAt: serverTimestamp() } as never); await upsertAdminMetadata(COLLECTIONS.competitionSubmissionAdminMetadata, created.id, metadata, data.submittedByUserId); return created; }
export async function submitCompetitionSubmission(submission: CompetitionSubmission) { const updated = await updateRecord(COLLECTIONS.competitionSubmissions, submission.id, { status: "submitted", submittedAt: serverTimestamp(), updatedAt: serverTimestamp() }); await updateDoc(doc(db, COLLECTIONS.competitions, submission.competitionId), { submissions: arrayUnion(submission.id), updatedAt: serverTimestamp() }); return updated; }
export const getCompetitionSubmissionById = cache(async (id: string) => getRecord<CompetitionSubmission>(COLLECTIONS.competitionSubmissions, id));
export const getSubmissionsForCompetition = cache(async (competitionId: string) => listCollection<CompetitionSubmission>(COLLECTIONS.competitionSubmissions, [where("competitionId", "==", competitionId), limit(100)]));
export const getMyCompetitionSubmissions = cache(async (userId: string) => (await listCollection<CompetitionSubmission>(COLLECTIONS.competitionSubmissions, [where("submittedByUserId", "==", userId), limit(100)])).map(publicSafeCompetitionSubmission));
export async function updateSubmissionStatus(submission: CompetitionSubmission, status: CompetitionSubmission["status"], reviewerId?: string) { const out = await updateRecord(COLLECTIONS.competitionSubmissions, submission.id, { status, reviewedBy: reviewerId, reviewedAt: serverTimestamp(), updatedAt: serverTimestamp() }); if (["selected", "winner"].includes(status || "")) await logAudit({ actorId: reviewerId || "system", action: `competition_submission_${status}`, collectionName: COLLECTIONS.competitionSubmissions, documentId: submission.id }); return out; }
export const shortlistSubmission = (s: CompetitionSubmission, id?: string) => updateSubmissionStatus(s, "shortlisted", id);
export const selectSubmission = (s: CompetitionSubmission, id?: string) => updateSubmissionStatus(s, "selected", id);
export const markWinnerSubmission = (s: CompetitionSubmission, id?: string) => updateSubmissionStatus(s, "winner", id);
export async function createCompetitionEvaluation(data: Omit<CompetitionEvaluation, "id" | "createdAt" | "updatedAt">) { return createRecord<CompetitionEvaluation>(COLLECTIONS.competitionEvaluations, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); }
export async function updateCompetitionEvaluation(id: string, data: Partial<CompetitionEvaluation>) { return updateRecord(COLLECTIONS.competitionEvaluations, id, { ...data, updatedAt: serverTimestamp() }); }
export const getEvaluationsForSubmission = cache(async (submissionId: string) => listCollection<CompetitionEvaluation>(COLLECTIONS.competitionEvaluations, [where("submissionId", "==", submissionId), limit(100)]));
export const getEvaluationsForCompetition = cache(async (competitionId: string) => listCollection<CompetitionEvaluation>(COLLECTIONS.competitionEvaluations, [where("competitionId", "==", competitionId), limit(200)]));
export async function createCompetitionResult(data: Omit<CompetitionResult, "id" | "createdAt" | "updatedAt">) { return createRecord<CompetitionResult>(COLLECTIONS.competitionResults, { ...data, status: data.status || "draft", visibility: data.visibility || "member_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as never); }
export async function updateCompetitionResult(id: string, data: Partial<CompetitionResult>) { return updateRecord(COLLECTIONS.competitionResults, id, { ...data, updatedAt: serverTimestamp() }); }
export async function declareCompetitionResult(result: CompetitionResult, adminId: string) { await updateRecord(COLLECTIONS.competitionResults, result.id, { status: "declared", declaredBy: adminId, declaredAt: serverTimestamp(), updatedAt: serverTimestamp() }); await updateRecord(COLLECTIONS.competitions, result.competitionId, { status: "results_declared", updatedAt: serverTimestamp() }); }
export async function publishCompetitionResult(result: CompetitionResult) { return updateRecord(COLLECTIONS.competitionResults, result.id, { status: "published", visibility: "public", publishedAt: serverTimestamp(), updatedAt: serverTimestamp() }); }
export const getResultForCompetition = cache(async (competitionId: string) => (await listCollection<CompetitionResult>(COLLECTIONS.competitionResults, [where("competitionId", "==", competitionId), limit(1)]))[0] || null);
export const getPublicCompetitionResults = cache(async () => listCollection<CompetitionResult>(COLLECTIONS.competitionResults, [where("visibility", "==", "public"), where("status", "==", "published"), limit(100)]));
export async function updateCompetition(id: string, data: Partial<Competition>) { return updateRecord(COLLECTIONS.competitions, id, { ...data, updatedAt: serverTimestamp() }); }

export async function createKnowledgeAsset(data: Omit<KnowledgeAsset, "id" | "createdAt" | "updatedAt">) {
  if (!data.problemStatementId && !data.linkedProblemStatementId) throw new Error("Knowledge assets must be linked to a problem statement.");
  const problemStatementId = data.problemStatementId || data.linkedProblemStatementId || "";
  const created = await createRecord<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, {
    ...data,
    problemStatementId,
    linkedProblemStatementId: problemStatementId,
    shortDescription: data.shortDescription || data.description || data.summary || "",
    detailedContent: data.detailedContent || data.content || "",
    description: data.description || data.shortDescription || data.summary || "",
    content: data.content || data.detailedContent || "",
    attachmentLinks: data.attachmentLinks || data.references || [],
    status: data.status || "under_review",
    visibility: data.visibility || "admin_only",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as WithFieldValue<Omit<KnowledgeAsset, "id">>);
  await bumpStats("knowledgeCount");
  await linkCreatedResource(problemStatementId, { type: "knowledge_asset", resourceType: "knowledge_asset", collection: COLLECTIONS.knowledgeAssets, resourceId: created.id, title: data.title, description: data.shortDescription || data.description || data.summary, url: data.sourceLink || data.driveLink || data.documentLink, visibility: data.visibility || "admin_only", status: (data.status || "under_review") as PlatformStatus }, data.createdBy || data.submittedBy || "");
  await createProblemTimelineEvent(problemStatementId, "knowledge_added", data.title || "Knowledge asset added", data.createdBy || data.submittedBy || "", { resourceId: created.id }, data.visibility || "admin_only");
  await routeToAdminInbox({ type: "knowledge_submission", title: data.title, description: data.shortDescription || data.description || data.summary, sourceCollection: COLLECTIONS.knowledgeAssets, sourceId: created.id, createdBy: data.createdBy });
  return created;
}
export async function updateKnowledgeAsset(id: string, patch: Partial<KnowledgeAsset>, actorId = "") {
  const existing = await getRecord<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, id);
  await updateRecord(COLLECTIONS.knowledgeAssets, id, { ...patch, updatedAt: serverTimestamp() });
  if (existing?.problemStatementId) await createProblemTimelineEvent(existing.problemStatementId, "knowledge_updated", patch.title || existing.title || "Knowledge asset updated", actorId, { resourceId: id }, patch.visibility || existing.visibility || "admin_only");
}
export const getKnowledgeAssetsForProblem = cache(async (problemStatementId: string) => listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [where("problemStatementId", "==", problemStatementId), limit(50)]));
export const getMyKnowledgeAssets = cache(async (userId: string) => listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [where("createdBy", "==", userId), limit(100)]));
export const getPublicKnowledgeAssets = cache(async () => (await listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [where("visibility", "==", "public"), limit(100)])).filter((a) => ["approved", "published"].includes(a.status || "")));
export const getPublicKnowledgeAssetsSafe = getPublicKnowledgeAssets;
export const getAdminKnowledgeAssets = cache(async () => listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [orderBy("createdAt", "desc"), limit(200)]));
export async function updateKnowledgeAssetStatus(id: string, status: KnowledgeAsset["status"], actorId = "") {
  const existing = await getRecord<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, id);
  const patch: Partial<KnowledgeAsset> = { status, reviewedBy: actorId, reviewedAt: serverTimestamp() as never };
  if (status === "approved") patch.approvedBy = actorId;
  if (status === "published") patch.publishedAt = serverTimestamp() as never;
  await updateKnowledgeAsset(id, patch, actorId);
  if (["approved","published"].includes(status || "") && existing) await autoLogContribution({ contributorUserId: existing.createdBy || existing.submittedBy || actorId, contributionTitle: existing.title, contributionSummary: existing.shortDescription || existing.summary || existing.description, contributionCategory: "knowledge", contributionType: "knowledge_asset", relatedEntityType: "knowledge_asset", relatedEntityId: id, relatedEntityTitle: existing.title, objectiveTargetId: undefined, evidenceLinks: [existing.sourceLink, existing.driveLink, ...(existing.attachmentLinks || [])].filter(Boolean) as string[], createdBy: actorId });
  if (existing?.problemStatementId && status === "approved") await createProblemTimelineEvent(existing.problemStatementId, "knowledge_approved", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only");
  if (existing?.problemStatementId && status === "published") await createProblemTimelineEvent(existing.problemStatementId, "knowledge_published", existing.title, actorId, { resourceId: id }, existing.visibility || "public");
}
export async function updateKnowledgeAssetVisibility(id: string, visibility: KnowledgeAsset["visibility"], actorId = "") { return updateKnowledgeAsset(id, { visibility }, actorId); }
export async function archiveKnowledgeAsset(id: string, actorId = "") { const existing = await getRecord<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, id); await updateKnowledgeAsset(id, { status: "archived" }, actorId); if (existing?.problemStatementId) await createProblemTimelineEvent(existing.problemStatementId, "knowledge_archived", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only"); }
export async function publishKnowledgeAsset(asset: KnowledgeAsset, reviewerId: string) { await updateKnowledgeAssetStatus(asset.id, "published", reviewerId); await updateKnowledgeAssetVisibility(asset.id, "public", reviewerId); }
export async function createKnowledgeFromWinningSolution(
  competition: Competition,
  submission: CompetitionSubmission,
  reviewerId: string,
) {
  return createKnowledgeAsset({
    problemStatementId: competition.sourceProblemId || competition.sourceId || "",
    title: submission.title,
    summary: `Winning solution for ${competition.title}`,
    content: submission.description,
    tags: [competition.theme || "competition"].filter(Boolean),
    sourceType: "competition",
    sourceId: competition.id,
    sourceCompetitionId: competition.id,
    references: [
      ...(submission.solutionLinks || []),
      ...(submission.supportingLinks || []),
    ],
    createdBy: reviewerId,
  });
}

async function linkCreatedResource(problemStatementId: string, resource: LinkedResource, actorId: string) {
  const problem = await getProblemStatementById(problemStatementId);
  if (problem) await addLinkedResourceToProblem(problem, resource, actorId);
}

export async function createTimelineEvent(data: Omit<TimelineEvent, "id" | "createdAt">) {
  return createRecord<TimelineEvent>(COLLECTIONS.timelineEvents, {
    ...data,
    visibility: data.visibility || "admin_only",
    createdAt: serverTimestamp(),
  } as WithFieldValue<Omit<TimelineEvent, "id">>);
}

export async function getTimelineEventsForProblem(problemStatementId: string) {
  return listCollection<TimelineEvent>(COLLECTIONS.timelineEvents, [where("problemStatementId", "==", problemStatementId), limit(100)]);
}

async function createProblemTimelineEvent(problemStatementId: string, eventType: TimelineEvent["eventType"], title: string, actorUserId?: string, metadata?: Record<string, unknown>, visibility: TimelineEvent["visibility"] = "submitter_only") {
  return createTimelineEvent({ problemStatementId, eventType, title, actorUserId, visibility, metadata }).catch(() => undefined);
}
export async function createProblemOnboardingSession(data: Omit<ProblemOnboardingSession, "id" | "createdAt" | "updatedAt">) {
  const actorId = data.adminOwnerId || data.createdBy || data.facilitatorId || "";
  const { safe, metadata } = splitSensitiveFields(data as Record<string, unknown>, ["internalNotes"]);
  const created = await createRecord<ProblemOnboardingSession>(COLLECTIONS.problemOnboardingSessions, { ...safe, status: data.status || "scheduled", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<ProblemOnboardingSession, "id">>);
  await upsertAdminMetadata(COLLECTIONS.onboardingAdminMetadata, created.id, metadata, actorId);
  await linkCreatedResource(data.problemStatementId, { type: "onboarding_session", resourceType: "onboarding_session", collection: COLLECTIONS.problemOnboardingSessions, resourceId: created.id, title: data.sessionTitle || "Onboarding session", visibility: data.visibility || "admin_only", status: (data.status || "scheduled") as PlatformStatus }, actorId);
  await createProblemTimelineEvent(data.problemStatementId, data.status === "completed" ? "onboarding_completed" : "onboarding_started", data.sessionTitle || "Onboarding session created", actorId, { resourceId: created.id }, data.visibility || "admin_only");
  return created;
}
export async function updateProblemOnboardingSession(id: string, patch: Partial<ProblemOnboardingSession>) {
  const { safe, metadata } = splitSensitiveFields(patch as Record<string, unknown>, ["internalNotes"]);
  await updateRecord(COLLECTIONS.problemOnboardingSessions, id, { ...safe, ...sensitiveFieldDeletes(["internalNotes"]), updatedAt: serverTimestamp() });
  await upsertAdminMetadata(COLLECTIONS.onboardingAdminMetadata, id, metadata);
}
export async function completeProblemOnboardingSession(id: string, actorId: string, problemStatus?: ProblemStatement["status"]) {
  const session = await getRecord<ProblemOnboardingSession>(COLLECTIONS.problemOnboardingSessions, id);
  await updateProblemOnboardingSession(id, { status: "completed", completedAt: serverTimestamp() as never });
  if (session?.problemStatementId) await createProblemTimelineEvent(session.problemStatementId, "onboarding_completed", session.sessionTitle || "Onboarding completed", actorId, { resourceId: id }, session.visibility || "admin_only");
  if (session?.problemStatementId && problemStatus) await updateProblemStatus(session.problemStatementId, problemStatus, actorId);
}
export async function getOnboardingSessionsForProblem(problemStatementId: string) {
  return listCollection<ProblemOnboardingSession>(COLLECTIONS.problemOnboardingSessions, [where("problemStatementId", "==", problemStatementId), limit(50)]);
}
export async function createQuestionnaireResponse(data: Omit<QuestionnaireResponse, "id" | "createdAt" | "updatedAt">) {
  const actorId = data.submittedByAdminId || data.createdBy || data.respondentId || "";
  const responses = data.responses || data.answers || {};
  const { safe, metadata } = splitSensitiveFields(data as Record<string, unknown>, ["internalNotes"]);
  const created = await createRecord<QuestionnaireResponse>(COLLECTIONS.questionnaireResponses, { ...safe, responses, answers: data.answers || responses, status: data.status || "draft", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<QuestionnaireResponse, "id">>);
  await upsertAdminMetadata(COLLECTIONS.onboardingAdminMetadata, created.id, metadata, actorId);
  await linkCreatedResource(data.problemStatementId, { type: "questionnaire_response", resourceType: "questionnaire_response", collection: COLLECTIONS.questionnaireResponses, resourceId: created.id, title: data.templateTitle || "Questionnaire response", visibility: data.visibility || "admin_only", status: (data.status || "draft") as PlatformStatus }, actorId);
  await createProblemTimelineEvent(data.problemStatementId, data.status === "completed" ? "questionnaire_completed" : "questionnaire_created", data.templateTitle || "Questionnaire response created", actorId, { resourceId: created.id }, data.visibility || "admin_only");
  if (data.sessionId) await updateProblemOnboardingSession(data.sessionId, { linkedQuestionnaireResponseIds: arrayUnion(created.id) as never });
  return created;
}
export async function updateQuestionnaireResponse(id: string, patch: Partial<QuestionnaireResponse>) {
  const { safe, metadata } = splitSensitiveFields(patch as Record<string, unknown>, ["internalNotes"]);
  await updateRecord(COLLECTIONS.questionnaireResponses, id, { ...safe, ...sensitiveFieldDeletes(["internalNotes"]), answers: patch.answers || patch.responses, responses: patch.responses || patch.answers, updatedAt: serverTimestamp() });
  await upsertAdminMetadata(COLLECTIONS.onboardingAdminMetadata, id, metadata);
}
export async function completeQuestionnaireResponse(id: string, answers: Record<string, unknown>, actorId: string) {
  const response = await getRecord<QuestionnaireResponse>(COLLECTIONS.questionnaireResponses, id);
  await updateQuestionnaireResponse(id, { answers, responses: answers, status: "completed", submittedByAdminId: actorId, completedAt: serverTimestamp() as never });
  if (response?.problemStatementId) await createProblemTimelineEvent(response.problemStatementId, "questionnaire_completed", response.templateTitle || "Questionnaire completed", actorId, { resourceId: id }, response.visibility || "admin_only");
}
export async function getQuestionnaireResponsesForProblem(problemStatementId: string) {
  return listCollection<QuestionnaireResponse>(COLLECTIONS.questionnaireResponses, [where("problemStatementId", "==", problemStatementId), limit(50)]);
}
export async function createSOPDocument(data: Omit<SOPDocument, "id" | "createdAt" | "updatedAt">) {
  if (!data.problemStatementId) throw new Error("SOP documents must be linked to a problem statement.");
  const created = await createRecord<SOPDocument>(COLLECTIONS.sopDocuments, { ...data, version: data.version || 1, steps: data.steps || [], status: data.status || "draft", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<SOPDocument, "id">>);
  await linkCreatedResource(data.problemStatementId, { type: "sop_document", resourceType: "sop_document", collection: COLLECTIONS.sopDocuments, resourceId: created.id, title: data.title, description: data.objective || data.summary, url: data.driveLink || data.documentLink, visibility: data.visibility || "admin_only", status: (data.status || "draft") as PlatformStatus }, data.createdBy || "");
  await createProblemTimelineEvent(data.problemStatementId, "sop_added", data.title || "SOP added", data.createdBy || "", { resourceId: created.id }, data.visibility || "admin_only");
  return created;
}
export async function updateSOPDocument(id: string, patch: Partial<SOPDocument>, actorId = "") { const existing = await getRecord<SOPDocument>(COLLECTIONS.sopDocuments, id); await updateRecord(COLLECTIONS.sopDocuments, id, { ...patch, updatedAt: serverTimestamp() }); if (existing?.problemStatementId) await createProblemTimelineEvent(existing.problemStatementId, "sop_updated", patch.title || existing.title || "SOP updated", actorId, { resourceId: id }, patch.visibility || existing.visibility || "admin_only"); }
export const getSOPDocumentById = cache(async (id: string) => getRecord<SOPDocument>(COLLECTIONS.sopDocuments, id));
export const getSOPDocumentsForProblem = cache(async (problemStatementId: string) => listCollection<SOPDocument>(COLLECTIONS.sopDocuments, [where("problemStatementId", "==", problemStatementId), limit(50)]));
export const getMySOPDocuments = cache(async (userId: string) => listCollection<SOPDocument>(COLLECTIONS.sopDocuments, [where("createdBy", "==", userId), limit(100)]));
export const getPublicSOPDocuments = cache(async () => (await listCollection<SOPDocument>(COLLECTIONS.sopDocuments, [where("visibility", "==", "public"), limit(100)])).filter((s) => ["approved", "published"].includes(s.status || "")));
export const getAdminSOPDocuments = cache(async () => listCollection<SOPDocument>(COLLECTIONS.sopDocuments, [orderBy("createdAt", "desc"), limit(200)]));
export async function updateSOPStatus(id: string, status: SOPDocument["status"], actorId = "") { const existing = await getRecord<SOPDocument>(COLLECTIONS.sopDocuments, id); const patch: Partial<SOPDocument> = { status }; if (status === "approved") { patch.approvedBy = actorId; patch.approvedAt = serverTimestamp() as never; } if (status === "published") patch.publishedAt = serverTimestamp() as never; await updateSOPDocument(id, patch, actorId); if (existing?.problemStatementId && status === "approved") await createProblemTimelineEvent(existing.problemStatementId, "sop_approved", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only"); if (existing?.problemStatementId && status === "published") await createProblemTimelineEvent(existing.problemStatementId, "sop_published", existing.title, actorId, { resourceId: id }, existing.visibility || "public"); if (["approved","published"].includes(status || "") && existing) await autoLogContribution({ contributorUserId: existing.createdBy || actorId, contributionTitle: existing.title, contributionSummary: existing.summary || existing.objective || existing.content, contributionCategory: "documentation", contributionType: "sop_created", relatedEntityType: "sop_document", relatedEntityId: id, relatedEntityTitle: existing.title, evidenceLinks: [existing.driveLink, existing.documentLink, ...(existing.attachmentLinks || [])].filter(Boolean) as string[], createdBy: actorId }); }
export async function updateSOPVisibility(id: string, visibility: SOPDocument["visibility"], actorId = "") { return updateSOPDocument(id, { visibility }, actorId); }
export async function archiveSOPDocument(id: string, actorId = "") { const existing = await getRecord<SOPDocument>(COLLECTIONS.sopDocuments, id); await updateSOPDocument(id, { status: "archived" }, actorId); if (existing?.problemStatementId) await createProblemTimelineEvent(existing.problemStatementId, "sop_archived", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only"); }
export async function createNewSOPVersion(id: string, actorId = "") { const existing = await getRecord<SOPDocument>(COLLECTIONS.sopDocuments, id); if (!existing) throw new Error("SOP not found"); return createSOPDocument({ ...existing, title: `${existing.title} v${(existing.version || 1) + 1}`, version: (existing.version || 1) + 1, status: "draft", visibility: "admin_only", createdBy: actorId || existing.createdBy, problemStatementId: existing.problemStatementId }); }

export async function createPilotTrack(data: Omit<PilotTrack, "id" | "createdAt" | "updatedAt">) {
  if (!data.problemStatementId) throw new Error("Pilot tracks must be linked to a problem statement.");
  const { safe, metadata } = splitSensitiveFields(data as Record<string, unknown>, ["adminInternalNotes"]);
  const created = await createRecord<PilotTrack>(COLLECTIONS.pilotTracks, { ...safe, status: data.status || "proposed", visibility: data.visibility || "admin_only", priority: data.priority || "medium", riskLevel: data.riskLevel || "unknown", implementationDifficulty: data.implementationDifficulty || "unknown", teamMemberIds: data.teamMemberIds || [], evidenceLinks: data.evidenceLinks || [], attachmentLinks: data.attachmentLinks || [], createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<PilotTrack, "id">>);
  await upsertAdminMetadata(COLLECTIONS.pilotAdminMetadata, created.id, metadata, data.createdBy);
  await linkCreatedResource(data.problemStatementId, { type: "pilot_track", resourceType: "pilot_track", collection: COLLECTIONS.pilotTracks, resourceId: created.id, title: data.title, description: data.pilotObjective || data.problemSummary || data.summary, url: data.driveLink, visibility: data.visibility || "admin_only", status: (data.status || "proposed") as PlatformStatus }, data.createdBy || "");
  await createProblemTimelineEvent(data.problemStatementId, "pilot_created", data.title || "Pilot created", data.createdBy || "", { resourceId: created.id, status: data.status || "proposed" }, data.visibility || "admin_only");
  return created;
}
export async function updatePilotTrack(id: string, patch: Partial<PilotTrack>, actorId = "") {
  const existing = await getRecord<PilotTrack>(COLLECTIONS.pilotTracks, id);
  const { safe, metadata } = splitSensitiveFields(patch as Record<string, unknown>, ["adminInternalNotes"]);
  await updateRecord(COLLECTIONS.pilotTracks, id, { ...safe, ...sensitiveFieldDeletes(["adminInternalNotes"]), updatedAt: serverTimestamp() });
  await upsertAdminMetadata(COLLECTIONS.pilotAdminMetadata, id, metadata, actorId);
  if (existing?.problemStatementId) await createProblemTimelineEvent(existing.problemStatementId, "pilot_updated", patch.title || existing.title || "Pilot updated", actorId, { resourceId: id }, patch.visibility || existing.visibility || "admin_only");
}
export const getPilotTrackById = cache(async (id: string) => getRecord<PilotTrack>(COLLECTIONS.pilotTracks, id));
export const getPilotTracksForProblem = cache(async (problemStatementId: string) => listCollection<PilotTrack>(COLLECTIONS.pilotTracks, [where("problemStatementId", "==", problemStatementId), limit(50)]));
export const getAdminPilotTracks = cache(async () => listCollection<PilotTrack>(COLLECTIONS.pilotTracks, [orderBy("createdAt", "desc"), limit(200)]));
export const getPublicPilotTracks = cache(async () => (await listCollection<PilotTrack>(COLLECTIONS.pilotTracks, [where("visibility", "==", "public"), limit(100)])).filter((p) => ["completed", "scaled"].includes(p.status || "") || !!p.publishedAt).map(publicSafePilot));
export const getPublicPilotsSafe = getPublicPilotTracks;
export async function updatePilotStatus(id: string, status: PilotTrack["status"], actorId = "") {
  const existing = await getRecord<PilotTrack>(COLLECTIONS.pilotTracks, id);
  const patch: Partial<PilotTrack> = { status };
  if (status === "approved") { patch.approvedBy = actorId; patch.approvedAt = serverTimestamp() as never; }
  if (status === "active" && !existing?.startDate) patch.startDate = serverTimestamp() as never;
  if (status === "completed" || status === "scaled") { patch.completedAt = serverTimestamp() as never; patch.actualEndDate = serverTimestamp() as never; }
  await updateRecord(COLLECTIONS.pilotTracks, id, patch as Record<string, unknown>);
  if (existing?.problemStatementId) {
    await createProblemTimelineEvent(existing.problemStatementId, "pilot_status_changed", `Pilot status changed to ${status}`, actorId, { resourceId: id, from: existing.status, to: status }, existing.visibility || "admin_only");
    if (status === "active") await createProblemTimelineEvent(existing.problemStatementId, "pilot_started", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only");
    if (status === "completed" || status === "scaled") await createProblemTimelineEvent(existing.problemStatementId, "pilot_completed", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only");
  }
}
export async function updatePilotVisibility(id: string, visibility: PilotTrack["visibility"], actorId = "") {
  const existing = await getRecord<PilotTrack>(COLLECTIONS.pilotTracks, id);
  await updatePilotTrack(id, { visibility, ...(visibility === "public" ? { publishedAt: serverTimestamp() as never } : {}) }, actorId);
  if (existing?.problemStatementId && visibility === "public") await createProblemTimelineEvent(existing.problemStatementId, "pilot_published", existing.title, actorId, { resourceId: id }, "public");
}
export async function archivePilotTrack(id: string, actorId = "") { return updatePilotStatus(id, "cancelled", actorId); }
export async function completePilotTrack(id: string, patch: Partial<PilotTrack>, actorId = "") { await updatePilotTrack(id, { ...patch, status: "completed", completedAt: serverTimestamp() as never, actualEndDate: serverTimestamp() as never }, actorId); const existing = await getRecord<PilotTrack>(COLLECTIONS.pilotTracks, id); if (existing?.problemStatementId) await createProblemTimelineEvent(existing.problemStatementId, "pilot_completed", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only"); }
export async function createPilotMilestone(data: Omit<PilotMilestone, "id" | "createdAt" | "updatedAt">) { const created = await createRecord<PilotMilestone>(COLLECTIONS.pilotMilestones, { ...data, status: data.status || "pending", evidenceLinks: data.evidenceLinks || [], createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<PilotMilestone, "id">>); await createProblemTimelineEvent(data.problemStatementId, "pilot_milestone_added", data.title, data.ownerId || "", { resourceId: created.id, pilotTrackId: data.pilotTrackId }, "admin_only"); return created; }
export async function updatePilotMilestone(id: string, patch: Partial<PilotMilestone>) { return updateRecord(COLLECTIONS.pilotMilestones, id, patch as Record<string, unknown>); }
export const getPilotMilestonesForPilot = cache(async (pilotTrackId: string) => listCollection<PilotMilestone>(COLLECTIONS.pilotMilestones, [where("pilotTrackId", "==", pilotTrackId), limit(100)]));
export async function completePilotMilestone(id: string, actorId = "") { const existing = await getRecord<PilotMilestone>(COLLECTIONS.pilotMilestones, id); await updatePilotMilestone(id, { status: "completed", completedDate: serverTimestamp() as never }); if (existing?.problemStatementId) await createProblemTimelineEvent(existing.problemStatementId, "pilot_milestone_completed", existing.title, actorId, { resourceId: id, pilotTrackId: existing.pilotTrackId }, "admin_only"); }
export async function createPilotUpdate(data: Omit<PilotUpdate, "id" | "createdAt" | "updatedAt">) { const created = await createRecord<PilotUpdate>(COLLECTIONS.pilotUpdates, { ...data, updateDate: data.updateDate || serverTimestamp(), visibility: data.visibility || "admin_only", evidenceLinks: data.evidenceLinks || [], actionItems: data.actionItems || [], createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<PilotUpdate, "id">>); await createProblemTimelineEvent(data.problemStatementId, "pilot_update_added", data.title, data.createdBy || "", { resourceId: created.id, pilotTrackId: data.pilotTrackId }, data.visibility || "admin_only"); return created; }
export async function updatePilotUpdate(id: string, patch: Partial<PilotUpdate>) { return updateRecord(COLLECTIONS.pilotUpdates, id, patch as Record<string, unknown>); }
export const getPilotUpdatesForPilot = cache(async (pilotTrackId: string) => listCollection<PilotUpdate>(COLLECTIONS.pilotUpdates, [where("pilotTrackId", "==", pilotTrackId), limit(100)]));
export async function createPilotMetric(data: Omit<PilotMetric, "id" | "createdAt" | "updatedAt">) { const created = await createRecord<PilotMetric>(COLLECTIONS.pilotMetrics, { ...data, improvementDirection: data.improvementDirection || "decrease_is_good", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<PilotMetric, "id">>); await createProblemTimelineEvent(data.problemStatementId, "pilot_metric_added", data.metricName, "", { resourceId: created.id, pilotTrackId: data.pilotTrackId }, "admin_only"); return created; }
export async function updatePilotMetric(id: string, patch: Partial<PilotMetric>) { return updateRecord(COLLECTIONS.pilotMetrics, id, patch as Record<string, unknown>); }
export const getPilotMetricsForPilot = cache(async (pilotTrackId: string) => listCollection<PilotMetric>(COLLECTIONS.pilotMetrics, [where("pilotTrackId", "==", pilotTrackId), limit(100)]));
export async function convertPilotToSuccessStory(pilotId: string, actorId = "") { const pilot = await getRecord<PilotTrack>(COLLECTIONS.pilotTracks, pilotId); if (!pilot || !pilot.problemStatementId) throw new Error("Completed linked pilot required."); if (!["completed", "scaled"].includes(pilot.status || "")) throw new Error("Only completed pilots can become success stories."); const created = await createSuccessStory({ problemStatementId: pilot.problemStatementId, pilotTrackId: pilot.id, title: pilot.title, organizationName: pilot.visibility === "public" ? pilot.partnerOrganization : undefined, industrySegment: pilot.industrySegment, challengeSummary: pilot.problemSummary, interventionSummary: pilot.proposedSolution, measurableImpact: pilot.finalResults || pilot.expectedImpact || String(pilot.estimatedSavings || ""), publicSummary: pilot.publicSummary || pilot.submitterVisibleSummary || pilot.finalResults || "", visibility: "admin_only", status: "draft", createdBy: actorId, summary: pilot.publicSummary || pilot.finalResults || pilot.title }); await createProblemTimelineEvent(pilot.problemStatementId, "success_story_created", `Success story drafted: ${pilot.title}`, actorId, { resourceId: created.id, pilotTrackId: pilot.id }, "admin_only"); return created; }
export async function createMeetingLog(data: Omit<MeetingLog, "id" | "createdAt" | "updatedAt">) {
  const { safe, metadata } = splitSensitiveFields(data as Record<string, unknown>, ["internalNotes"]);
  const created = await createRecord<MeetingLog>(COLLECTIONS.meetingLogs, { ...safe, title: data.title || data.meetingTitle || "Meeting log", occurredAt: data.occurredAt || data.meetingDate, status: data.status || "completed", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<MeetingLog, "id">>);
  await upsertAdminMetadata(COLLECTIONS.onboardingAdminMetadata, created.id, metadata, data.createdBy);
  await linkCreatedResource(data.problemStatementId, { type: "meeting_log", resourceType: "meeting_log", collection: COLLECTIONS.meetingLogs, resourceId: created.id, title: data.meetingTitle || data.title || "Meeting log", visibility: data.visibility || "admin_only", status: data.status || "completed" }, data.createdBy || "");
  await createProblemTimelineEvent(data.problemStatementId, "meeting_logged", data.meetingTitle || data.title || "Meeting logged", data.createdBy || "", { resourceId: created.id }, data.visibility || "admin_only");
  return created;
}
export async function updateMeetingLog(id: string, patch: Partial<MeetingLog>) {
  const { safe, metadata } = splitSensitiveFields(patch as Record<string, unknown>, ["internalNotes"]);
  await updateRecord(COLLECTIONS.meetingLogs, id, { ...safe, ...sensitiveFieldDeletes(["internalNotes"]), updatedAt: serverTimestamp() });
  await upsertAdminMetadata(COLLECTIONS.onboardingAdminMetadata, id, metadata);
}
export async function getMeetingLogsForProblem(problemStatementId: string) {
  return listCollection<MeetingLog>(COLLECTIONS.meetingLogs, [where("problemStatementId", "==", problemStatementId), limit(50)]);
}
export async function createSuccessStory(data: Omit<SuccessStory, "id" | "createdAt" | "updatedAt">) {
  return createRecord<SuccessStory>(COLLECTIONS.successStories, { ...data, status: data.status || "under_review", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<SuccessStory, "id">>);
}
export async function createTestimonialRating(data: Omit<TestimonialRating, "id" | "createdAt" | "updatedAt">) {
  return createRecord<TestimonialRating>(COLLECTIONS.testimonialRatings, { ...data, status: data.status || "under_review", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<TestimonialRating, "id">>);
}
export const getLinkedProblemResources = cache(async (problemStatementId: string) => {
  const [onboardingSessions, questionnaireResponses, researchItems, knowledgeAssets, sopDocuments, pilotTracks, meetingLogs, fileLinks, competitions, discussions, successStories, testimonialRatings] = await Promise.all([
    listCollection<ProblemOnboardingSession>(COLLECTIONS.problemOnboardingSessions, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    listCollection<QuestionnaireResponse>(COLLECTIONS.questionnaireResponses, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    getResearchByProblem(problemStatementId).catch(() => []),
    getKnowledgeByProblem(problemStatementId).catch(() => []),
    listCollection<SOPDocument>(COLLECTIONS.sopDocuments, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    listCollection<PilotTrack>(COLLECTIONS.pilotTracks, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    listCollection<MeetingLog>(COLLECTIONS.meetingLogs, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    listCollection<FileLink>(COLLECTIONS.fileLinks, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    getCompetitionsByProblem(problemStatementId).catch(() => []),
    getCommunityByProblem(problemStatementId).catch(() => []),
    listCollection<SuccessStory>(COLLECTIONS.successStories, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    listCollection<TestimonialRating>(COLLECTIONS.testimonialRatings, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
  ]);
  return { onboardingSessions, questionnaireResponses, researchItems, knowledgeAssets, sopDocuments, pilotTracks, meetingLogs, fileLinks, competitions, discussions: discussions as DiscussionPost[], successStories, testimonialRatings };
});
export async function upsertConstitutionDocument(id: string, data: Omit<ConstitutionDocument, "id">) { return upsertRecord(COLLECTIONS.constitutionDocuments, id, { ...data, updatedAt: serverTimestamp() }); }
export async function upsertObjectiveTargetDocument(id: string, data: Omit<ObjectiveTargetDocument, "id">) { return upsertRecord(COLLECTIONS.objectiveTargetDocuments, id, { ...data, updatedAt: serverTimestamp() }); }

export async function getAdminProblemWorkspaceMetrics() {
  const [totalProblems, submittedProblems, underReview, needsMoreInfo, onboarded, published, onboardingSessions, questionnaireResponses, meetingLogs, fileLinks, timelineEvents, knowledgeAssets, knowledgeUnderReview, knowledgePublished, sopDocuments, sopDraftReview, sopApprovedPublished, researchItems, researchUnderReview, researchPublished, technologyWatchItems, highPriorityWatchItems, caseStudies, linkedResearchItems, unlinkedResearchItems, totalPilots, proposedPilots, approvedPlannedPilots, activePilots, pausedPilots, completedPilots, failedCancelledPilots, publicSuccessStories] = await Promise.all([
    getCountFromServer(ref(COLLECTIONS.problemStatements)),
    getCountFromServer(queryFor(COLLECTIONS.problemStatements, [where("status", "==", "submitted")])),
    getCountFromServer(queryFor(COLLECTIONS.problemStatements, [where("status", "==", "under_review")])),
    getCountFromServer(queryFor(COLLECTIONS.problemStatements, [where("status", "in", ["needs_more_info", "needs_information"])])),
    getCountFromServer(queryFor(COLLECTIONS.problemStatements, [where("status", "==", "onboarded")])),
    getCountFromServer(queryFor(COLLECTIONS.problemStatements, [where("status", "==", "published")])),
    getCountFromServer(ref(COLLECTIONS.problemOnboardingSessions)),
    getCountFromServer(ref(COLLECTIONS.questionnaireResponses)),
    getCountFromServer(ref(COLLECTIONS.meetingLogs)),
    getCountFromServer(ref(COLLECTIONS.fileLinks)),
    getCountFromServer(ref(COLLECTIONS.timelineEvents)),
    getCountFromServer(ref(COLLECTIONS.knowledgeAssets)),
    getCountFromServer(queryFor(COLLECTIONS.knowledgeAssets, [where("status", "==", "under_review")])),
    getCountFromServer(queryFor(COLLECTIONS.knowledgeAssets, [where("status", "==", "published")])),
    getCountFromServer(ref(COLLECTIONS.sopDocuments)),
    getCountFromServer(queryFor(COLLECTIONS.sopDocuments, [where("status", "in", ["draft", "review"])])),
    getCountFromServer(queryFor(COLLECTIONS.sopDocuments, [where("status", "in", ["approved", "published"])])),
    getCountFromServer(ref(COLLECTIONS.researchPosts)),
    getCountFromServer(queryFor(COLLECTIONS.researchPosts, [where("status", "==", "under_review")])),
    getCountFromServer(queryFor(COLLECTIONS.researchPosts, [where("status", "in", ["approved", "published"])])),
    getCountFromServer(queryFor(COLLECTIONS.researchPosts, [where("researchType", "in", ["technology_trend", "patent", "startup_case_study", "product_innovation", "process_innovation", "research_paper"])])),
    getCountFromServer(queryFor(COLLECTIONS.researchPosts, [where("watchPriority", "in", ["high", "strategic"])])),
    getCountFromServer(queryFor(COLLECTIONS.researchPosts, [where("researchType", "in", ["startup_case_study", "msme_success_story"])])),
    getCountFromServer(queryFor(COLLECTIONS.researchPosts, [where("generalResearch", "==", false)])),
    getCountFromServer(queryFor(COLLECTIONS.researchPosts, [where("generalResearch", "==", true)])),
    getCountFromServer(ref(COLLECTIONS.pilotTracks)),
    getCountFromServer(queryFor(COLLECTIONS.pilotTracks, [where("status", "==", "proposed")])),
    getCountFromServer(queryFor(COLLECTIONS.pilotTracks, [where("status", "in", ["approved", "planned"])])),
    getCountFromServer(queryFor(COLLECTIONS.pilotTracks, [where("status", "==", "active")])),
    getCountFromServer(queryFor(COLLECTIONS.pilotTracks, [where("status", "==", "paused")])),
    getCountFromServer(queryFor(COLLECTIONS.pilotTracks, [where("status", "in", ["completed", "scaled"])])),
    getCountFromServer(queryFor(COLLECTIONS.pilotTracks, [where("status", "in", ["failed", "cancelled"])])),
    getCountFromServer(queryFor(COLLECTIONS.successStories, [where("visibility", "==", "public"), where("status", "==", "published")])),
  ]);
  return {
    totalProblems: totalProblems.data().count,
    submittedProblems: submittedProblems.data().count,
    underReview: underReview.data().count,
    needsMoreInfo: needsMoreInfo.data().count,
    onboarded: onboarded.data().count,
    published: published.data().count,
    onboardingSessions: onboardingSessions.data().count,
    questionnaireResponses: questionnaireResponses.data().count,
    meetingLogs: meetingLogs.data().count,
    fileLinks: fileLinks.data().count,
    timelineEvents: timelineEvents.data().count,
    knowledgeAssets: knowledgeAssets.data().count,
    knowledgeUnderReview: knowledgeUnderReview.data().count,
    knowledgePublished: knowledgePublished.data().count,
    sopDocuments: sopDocuments.data().count,
    sopDraftReview: sopDraftReview.data().count,
    sopApprovedPublished: sopApprovedPublished.data().count,
    researchItems: researchItems.data().count,
    researchUnderReview: researchUnderReview.data().count,
    researchPublished: researchPublished.data().count,
    technologyWatchItems: technologyWatchItems.data().count,
    highPriorityWatchItems: highPriorityWatchItems.data().count,
    caseStudies: caseStudies.data().count,
    linkedResearchItems: linkedResearchItems.data().count,
    unlinkedResearchItems: unlinkedResearchItems.data().count,
    totalPilots: totalPilots.data().count,
    proposedPilots: proposedPilots.data().count,
    approvedPlannedPilots: approvedPlannedPilots.data().count,
    activePilots: activePilots.data().count,
    pausedPilots: pausedPilots.data().count,
    completedPilots: completedPilots.data().count,
    failedCancelledPilots: failedCancelledPilots.data().count,
    publicSuccessStories: publicSuccessStories.data().count,
  };
}

export async function globalSearch(term: string): Promise<SearchResult[]> {
  const needle = term.toLowerCase();
  const [problems, orgs, research, knowledge, community, competitions] =
    await Promise.all([
      getProblemStatements(50),
      getOrganizations(50),
      getResearchPosts(),
      getKnowledgeAssets(),
      getCommunityPosts(),
      getCompetitions(),
    ]);
  return [
    ...problems.map((x) => ({
      id: x.id,
      type: "Problem Statement",
      title: x.title,
      description: x.description,
      href: `/problem-statements/${x.id}`,
      tags: [x.category || ""],
    })),
    ...orgs.map((x) => ({
      id: x.id,
      type: "Organization",
      title: x.name,
      description: x.description,
      href: `/organizations/${x.id}`,
      tags: [x.industry || ""],
    })),
    ...research.map((x) => ({
      id: x.id,
      type: "Research",
      title: x.title,
      description: x.summary,
      href: "/research",
      tags: x.tags,
    })),
    ...knowledge.map((x) => ({
      id: x.id,
      type: "Knowledge",
      title: x.title,
      description: x.description,
      href: "/knowledge",
      tags: x.tags,
    })),
    ...community.map((x) => ({
      id: x.id,
      type: "Community",
      title: x.title,
      description: x.content,
      href: "/community",
      tags: x.tags,
    })),
    ...competitions.map((x) => ({
      id: x.id,
      type: "Competition",
      title: x.title,
      description: x.description,
      href: "/competitions",
      tags: [x.theme || ""],
    })),
  ].filter((x) =>
    [x.title, x.description, ...(x.tags || [])]
      .join(" ")
      .toLowerCase()
      .includes(needle),
  );
}

export const getProblemStatementById = cache(async (id: string) =>
  getRecord<ProblemStatement>(COLLECTIONS.problemStatements, id),
);

export const getMyProblemStatements = cache(async (userId: string) =>
  listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [
    where("submittedByUserId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(100),
  ]).catch(() =>
    listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [
      where("createdBy", "==", userId),
      limit(100),
    ]),
  ),
);
export const getPublicProblemStatements = getProblemStatements;
export const getPublicProblemsSafe = getPublicProblemStatements;
export const getAdminProblemStatements = getAllProblemStatements;
export async function updateProblemStatement(id: string, patch: Partial<ProblemStatement>, actorId?: string) {
  const before = await getProblemStatementById(id).catch(() => null);
  const { safe, metadata } = splitSensitiveFields(patch as Record<string, unknown>, ["adminNotes"]);
  await updateRecord(COLLECTIONS.problemStatements, id, { ...safe, ...sensitiveFieldDeletes(["adminNotes"]) });
  await upsertAdminMetadata(COLLECTIONS.problemAdminMetadata, id, metadata, actorId);
  if (actorId) await logAudit({ actorId, action: "problem_updated", collectionName: COLLECTIONS.problemStatements, documentId: id, after: patch });
  if (actorId && before && patch.status && patch.status !== before.status) await createProblemTimelineEvent(id, patch.status === "published" ? "problem_published" : patch.status === "archived" ? "problem_archived" : "status_changed", `Status changed to ${patch.status}`, actorId, { from: before.status, to: patch.status }, patch.visibility || before.visibility || "submitter_only");
  if (actorId && before && patch.visibility && patch.visibility !== before.visibility) await createProblemTimelineEvent(id, "visibility_changed", `Visibility changed to ${patch.visibility}`, actorId, { from: before.visibility, to: patch.visibility }, patch.visibility);
}
export async function updateProblemStatus(id: string, status: ProblemStatement["status"], actorId: string, notes?: string) {
  const patch: Partial<ProblemStatement> = { status, adminReviewStatus: status, reviewedAt: serverTimestamp() as never };
  if (notes !== undefined) patch.adminNotes = notes;
  if (status === "published") {
    patch.visibility = "public";
    patch.publishedAt = serverTimestamp() as never;
  }
  return updateProblemStatement(id, patch, actorId);
}
export async function updateProblemVisibility(id: string, visibility: ProblemStatement["visibility"], actorId: string) {
  const patch: Partial<ProblemStatement> = { visibility };
  if (visibility === "public") patch.publishedAt = serverTimestamp() as never;
  return updateProblemStatement(id, patch, actorId);
}
export async function assignProblemToAdmin(id: string, assignedAdminId: string, actorId: string) {
  return updateProblemStatement(id, { assignedAdminId, assignedReviewer: assignedAdminId }, actorId);
}
function resourceIdField(type: LinkedResource["type"]) {
  const fields: Partial<Record<LinkedResource["type"], keyof ProblemStatement>> = {
    onboarding_session: "onboardingSessionIds",
    questionnaire_response: "questionnaireResponseIds",
    sop_document: "sopIds",
    knowledge_asset: "knowledgeAssetIds",
    research: "researchItemIds",
    research_item: "researchItemIds",
    pilot_track: "pilotTrackIds",
    meeting_log: "meetingLogIds",
    competition: "competitionIds",
    community: "discussionPostIds",
    discussion: "discussionPostIds",
    file_link: "attachments",
  };
  return fields[type];
}
export async function addLinkedResourceToProblem(problem: ProblemStatement | string, resource: LinkedResource, actorId: string) {
  const loadedProblem = typeof problem === "string" ? await getProblemStatementById(problem) : problem;
  if (!loadedProblem) return;
  const field = resourceIdField(resource.type);
  const linkedResources = [...(loadedProblem.linkedResources || []), { ...resource, problemStatementId: loadedProblem.id, resourceType: resource.resourceType || resource.type, linkedAt: new Date().toISOString(), linkedBy: actorId }];
  const patch: Partial<ProblemStatement> = { linkedResources };
  if (field) patch[field] = Array.from(new Set([...(loadedProblem[field] as string[] | undefined || []), resource.resourceId])) as never;
  await createRecord<LinkedResource>(COLLECTIONS.linkedResources, { ...resource, problemStatementId: loadedProblem.id, resourceType: resource.resourceType || resource.type, createdBy: actorId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<LinkedResource, "id">>).catch(() => undefined);
  return updateProblemStatement(loadedProblem.id, patch, actorId);
}
export async function removeLinkedResourceFromProblem(problem: ProblemStatement | string, resource: LinkedResource, actorId: string) {
  const loadedProblem = typeof problem === "string" ? await getProblemStatementById(problem) : problem;
  if (!loadedProblem) return;
  const field = resourceIdField(resource.type);
  const linkedResources = (loadedProblem.linkedResources || []).filter((item) => !(item.type === resource.type && item.resourceId === resource.resourceId));
  const patch: Partial<ProblemStatement> = { linkedResources };
  if (field) patch[field] = ((loadedProblem[field] as string[] | undefined) || []).filter((id) => id !== resource.resourceId) as never;
  return updateProblemStatement(loadedProblem.id, patch, actorId);
}

export async function getLinkedResourcesForProblem(problemStatementId: string) {
  const problem = await getProblemStatementById(problemStatementId);
  const collectionRows = await listCollection<LinkedResource>(COLLECTIONS.linkedResources, [where("problemStatementId", "==", problemStatementId), limit(100)]).catch(() => []);
  const embedded = (problem?.linkedResources || []).map((item) => ({ ...item, problemStatementId, resourceType: item.resourceType || item.type }));
  return [...embedded, ...collectionRows];
}

export async function getLinkedResourceCountsForProblem(problemStatementId: string) {
  const resources = await getLinkedResourcesForProblem(problemStatementId);
  return resources.reduce<Record<string, number>>((counts, item) => {
    const key = item.resourceType || item.type;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

export async function createFileLink(data: Omit<FileLink, "id" | "createdAt" | "updatedAt">) {
  const created = await createRecord<FileLink>(COLLECTIONS.fileLinks, { ...data, visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<FileLink, "id">>);
  await linkCreatedResource(data.problemStatementId, { type: "file_link", resourceType: "file_link", collection: COLLECTIONS.fileLinks, resourceId: created.id, title: data.title, description: data.description, url: data.url, visibility: data.visibility || "admin_only", status: "active" }, data.createdBy || "");
  await createProblemTimelineEvent(data.problemStatementId, "file_added", data.title || "File link added", data.createdBy || "", { resourceId: created.id, url: data.url }, data.visibility || "admin_only");
  return created;
}
export async function updateFileLink(id: string, patch: Partial<FileLink>) { return updateRecord(COLLECTIONS.fileLinks, id, patch as Record<string, unknown>); }
export async function deleteFileLink(id: string) { return deleteRecord(COLLECTIONS.fileLinks, id); }

export const getProblemStatementsByCreator = getMyProblemStatements;
export const getProblemReviews = cache(async (problemStatementId: string) =>
  listCollection<ChallengeReview>(COLLECTIONS.problemReviews, [
    where("problemStatementId", "==", problemStatementId),
    limit(100),
  ]),
);
export const getResearchByProblem = cache(async (problemStatementId: string) =>
  listCollection<ResearchPost>(COLLECTIONS.researchPosts, [
    where("problemStatementId", "==", problemStatementId),
    limit(50),
  ]),
);
export const getCommunityByProblem = cache(
  async (problemStatementId: string) => {
    traceRepositoryRead(
      COLLECTIONS.communityPosts,
      [
        "visibility == public",
        `problemStatementId == ${problemStatementId} (client)`,
      ],
      [],
    );
    const rows = await listCollection<CommunityPost>(
      COLLECTIONS.communityPosts,
      [where("visibility", "==", "public"), limit(100)],
    );
    return rows
      .filter(
        (post) =>
          post.problemStatementId === problemStatementId ||
          (post.associatedType === "problem_statement" &&
            post.associatedId === problemStatementId),
      )
      .slice(0, 50);
  },
);
export const getCompetitionsByProblem = cache(
  async (problemStatementId: string) =>
    listCollection<Competition>(COLLECTIONS.competitions, [
      where("sourceProblemId", "==", problemStatementId),
      limit(50),
    ]),
);
export const getCompetitionById = cache(async (id: string) =>
  getRecord<Competition>(COLLECTIONS.competitions, id),
);
export const getCompetitionTeams = cache(async (competitionId: string) =>
  listCollection<CompetitionTeam>(COLLECTIONS.competitionTeams, [
    where("competitionId", "==", competitionId),
    limit(100),
  ]),
);
export const getCompetitionTeamsByUser = cache(async (userId: string) =>
  listCollection<CompetitionTeam>(COLLECTIONS.competitionTeams, [
    where("members", "array-contains", userId),
    limit(100),
  ]),
);
export const getCompetitionSubmissions = cache(async (competitionId: string) =>
  listCollection<CompetitionSubmission>(COLLECTIONS.competitionSubmissions, [
    where("competitionId", "==", competitionId),
    limit(100),
  ]),
);
export const getKnowledgeAssetById = cache(async (id: string) =>
  getRecord<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, id),
);
export const getKnowledgeBySource = cache(
  async (sourceType: string, sourceId: string) =>
    listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [
      where("sourceType", "==", sourceType),
      where("sourceId", "==", sourceId),
      limit(50),
    ]),
);
export const getKnowledgeByProblem = cache(async (problemStatementId: string) =>
  listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [
    where("problemStatementId", "==", problemStatementId),
    limit(50),
  ]),
);
export const getCommunityPostsByAssociation = cache(
  async (associatedType: DiscussionTargetType, associatedId: string) => {
    traceRepositoryRead(
      COLLECTIONS.communityPosts,
      [
        "visibility == public",
        `associatedType == ${associatedType} (client)`,
        `associatedId == ${associatedId} (client)`,
      ],
      [],
    );
    const rows = await listCollection<CommunityPost>(
      COLLECTIONS.communityPosts,
      [where("visibility", "==", "public"), limit(100)],
    );
    return rows
      .filter(
        (post) =>
          post.associatedType === associatedType &&
          post.associatedId === associatedId,
      )
      .slice(0, 50);
  },
);

export const getResearchByCreator = cache(async (userId: string) =>
  listCollection<ResearchPost>(COLLECTIONS.researchPosts, [
    where("createdBy", "==", userId),
    limit(100),
  ]),
);
export const getCollaborationRequestsByCreator = cache(async (userId: string) =>
  listCollection<CollaborationRequest>(COLLECTIONS.collaborationRequests, [
    where("createdBy", "==", userId),
    limit(100),
  ]),
);
export const getCommunityPostsByCreator = cache(async (userId: string) =>
  listCollection<CommunityPost>(COLLECTIONS.communityPosts, [
    where("createdBy", "==", userId),
    limit(100),
  ]),
);
export const getBookmarkedCommunityPosts = cache(async (userId: string) =>
  listCollection<CommunityPost>(COLLECTIONS.communityPosts, [
    where("bookmarks", "array-contains", userId),
    limit(100),
  ]),
);
export const getCollaborationRequests = cache(async () =>
  listCollection<CollaborationRequest>(COLLECTIONS.collaborationRequests, [
    orderBy("createdAt", "desc"),
    limit(100),
  ]),
);

export async function getSystemHealthCounts() {
  const entries = [
    ["users", COLLECTIONS.users],
    ["problems", COLLECTIONS.problemStatements],
    ["research", COLLECTIONS.researchPosts],
    ["competitions", COLLECTIONS.competitions],
    ["knowledgeAssets", COLLECTIONS.knowledgeAssets],
    ["notifications", COLLECTIONS.notifications],
    ["inboxItems", COLLECTIONS.adminInbox],
  ] as const;
  const results = await Promise.all(
    entries.map(async ([key, collectionName]) => {
      try {
        const snap = await getCountFromServer(ref(collectionName));
        return [key, snap.data().count] as const;
      } catch {
        return [key, null] as const;
      }
    }),
  );
  return Object.fromEntries(results) as Record<
    (typeof entries)[number][0],
    number | null
  >;
}


export async function createMsmeCase(data: Omit<MsmeCase, "id" | "createdAt" | "updatedAt">) {
  return createRecord<MsmeCase>(COLLECTIONS.msmeCases, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<MsmeCase, "id">>);
}

async function logGovernanceEvent(event: Omit<GovernanceAuditEvent, "id" | "createdAt">) {
  return createRecord<GovernanceAuditEvent>(COLLECTIONS.governanceAuditEvents, { ...event, createdAt: serverTimestamp() } as WithFieldValue<Omit<GovernanceAuditEvent, "id">>);
}
const actorId = () => auth.currentUser?.uid || "system";

export async function createGovernanceDocument(data: Partial<GovernanceDocument>) {
  const docRef = await createRecord<GovernanceDocument>(COLLECTIONS.governanceDocuments, { title: data.title || "Untitled governance document", documentType: data.documentType || "other", version: data.version || 1, status: data.status || "draft", visibility: data.visibility || "admin_only", summary: data.summary || "", content: data.content || "", sections: data.sections || [], tags: data.tags || [], createdBy: data.createdBy || actorId(), updatedBy: data.updatedBy || actorId(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<GovernanceDocument, "id">>);
  await logGovernanceEvent({ entityType: "governance_document", entityId: docRef.id, action: "created", actorUserId: actorId(), description: `Created ${data.title || "governance document"}` });
  return docRef;
}
export async function updateGovernanceDocument(id: string, data: Partial<GovernanceDocument>) {
  await updateRecord(COLLECTIONS.governanceDocuments, id, { ...data, updatedBy: actorId() });
  await logGovernanceEvent({ entityType: "governance_document", entityId: id, action: data.status === "under_review" ? "submitted_for_review" : "updated", actorUserId: actorId(), description: "Updated governance document" });
}
export const getGovernanceDocumentById = cache(async (id: string) => getRecord<GovernanceDocument>(COLLECTIONS.governanceDocuments, id));
export const getGovernanceDocuments = cache(async () => listCollection<GovernanceDocument>(COLLECTIONS.governanceDocuments, [orderBy("updatedAt", "desc"), limit(200)]));
export const getActiveGovernanceDocumentByType = cache(async (documentType: GovernanceDocumentType) => (await listCollection<GovernanceDocument>(COLLECTIONS.governanceDocuments, [where("documentType", "==", documentType), where("status", "==", "active"), limit(1)]))[0] || null);
export async function createGovernanceDocumentVersion(documentId: string, changeSummary = "Manual version snapshot") {
  const source = await getRecord<GovernanceDocument>(COLLECTIONS.governanceDocuments, documentId);
  if (!source) throw new Error("Governance document not found");
  return createRecord<GovernanceDocumentVersion>(COLLECTIONS.governanceDocumentVersions, { documentId, version: source.version || 1, snapshotTitle: source.title, snapshotContent: source.content || "", snapshotSections: source.sections || [], changeSummary, createdBy: actorId(), createdAt: serverTimestamp() } as WithFieldValue<Omit<GovernanceDocumentVersion, "id">>);
}
export const getGovernanceDocumentVersions = cache(async (documentId: string) => listCollection<GovernanceDocumentVersion>(COLLECTIONS.governanceDocumentVersions, [where("documentId", "==", documentId), orderBy("createdAt", "desc"), limit(100)]));
export async function approveGovernanceDocument(id: string, activate = false) {
  const source = await getRecord<GovernanceDocument>(COLLECTIONS.governanceDocuments, id);
  if (!source) throw new Error("Governance document not found");
  if (activate) {
    const active = await getActiveGovernanceDocumentByType(source.documentType);
    if (active && active.id !== id) await updateRecord(COLLECTIONS.governanceDocuments, active.id, { status: "superseded" });
  }
  await updateRecord(COLLECTIONS.governanceDocuments, id, { status: activate ? "active" : "approved", approvedBy: actorId(), approvedAt: serverTimestamp(), version: (source.version || 0) + 1 });
  await createGovernanceDocumentVersion(id, activate ? "Approved and activated" : "Approved");
  await logGovernanceEvent({ entityType: "governance_document", entityId: id, action: activate ? "activated" : "approved", actorUserId: actorId(), description: activate ? "Activated governance document" : "Approved governance document" });
}
export async function archiveGovernanceDocument(id: string) { await updateRecord(COLLECTIONS.governanceDocuments, id, { status: "archived", archivedAt: serverTimestamp(), updatedBy: actorId() }); await logGovernanceEvent({ entityType: "governance_document", entityId: id, action: "archived", actorUserId: actorId(), description: "Archived governance document" }); }

export async function createGovernanceAmendment(data: Partial<GovernanceAmendment>) { const docRef = await createRecord<GovernanceAmendment>(COLLECTIONS.governanceAmendments, { documentId: data.documentId || "", documentTitle: data.documentTitle || "", proposedTitle: data.proposedTitle || "Untitled amendment", proposedBy: data.proposedBy || actorId(), amendmentType: data.amendmentType || "modification", affectedSectionIds: data.affectedSectionIds || [], currentText: data.currentText || "", proposedText: data.proposedText || "", rationale: data.rationale || "", expectedImpact: data.expectedImpact || "", status: data.status || "proposed", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<GovernanceAmendment, "id">>); await logGovernanceEvent({ entityType: "amendment", entityId: docRef.id, action: "amendment_proposed", actorUserId: actorId(), description: data.proposedTitle || "Amendment proposed" }); return docRef; }
export async function updateGovernanceAmendment(id: string, data: Partial<GovernanceAmendment>) { return updateRecord(COLLECTIONS.governanceAmendments, id, data as Record<string, unknown>); }
export const getGovernanceAmendments = cache(async () => listCollection<GovernanceAmendment>(COLLECTIONS.governanceAmendments, [orderBy("updatedAt", "desc"), limit(200)]));
export const getAmendmentsForDocument = cache(async (documentId: string) => listCollection<GovernanceAmendment>(COLLECTIONS.governanceAmendments, [where("documentId", "==", documentId), limit(100)]));
export async function approveGovernanceAmendment(id: string, decisionNotes = "") { await updateRecord(COLLECTIONS.governanceAmendments, id, { status: "approved", decisionNotes, approvedBy: actorId(), decidedAt: serverTimestamp() }); await logGovernanceEvent({ entityType: "amendment", entityId: id, action: "amendment_approved", actorUserId: actorId(), description: "Approved amendment" }); }
export async function rejectGovernanceAmendment(id: string, decisionNotes = "") { await updateRecord(COLLECTIONS.governanceAmendments, id, { status: "rejected", decisionNotes, decidedAt: serverTimestamp() }); await logGovernanceEvent({ entityType: "amendment", entityId: id, action: "amendment_rejected", actorUserId: actorId(), description: "Rejected amendment" }); }
export async function implementGovernanceAmendment(id: string) { const amendment = await getRecord<GovernanceAmendment>(COLLECTIONS.governanceAmendments, id); if (!amendment) throw new Error("Amendment not found"); const document = await getRecord<GovernanceDocument>(COLLECTIONS.governanceDocuments, amendment.documentId); if (!document) throw new Error("Document not found"); await updateRecord(COLLECTIONS.governanceDocuments, document.id, { content: amendment.proposedText || document.content || "", version: (document.version || 1) + 1, updatedBy: actorId() }); await updateRecord(COLLECTIONS.governanceAmendments, id, { status: "implemented", implementedAt: serverTimestamp() }); await createGovernanceDocumentVersion(document.id, `Implemented amendment: ${amendment.proposedTitle}`); await logGovernanceEvent({ entityType: "amendment", entityId: id, action: "amendment_implemented", actorUserId: actorId(), description: "Implemented amendment" }); }

export async function createObjectiveTarget(data: Partial<ObjectiveTarget>) { return createRecord<ObjectiveTarget>(COLLECTIONS.objectiveTargets, { title: data.title || "Untitled objective target", periodType: data.periodType || "annual", periodLabel: data.periodLabel || "", objectiveSummary: data.objectiveSummary || "", strategicTheme: data.strategicTheme || "", status: data.status || "draft", ownerIds: data.ownerIds || [], workstreams: data.workstreams || [], kpis: data.kpis || [], kras: data.kras || [], progressPercent: data.progressPercent || 0, reviewNotes: data.reviewNotes || "", createdBy: data.createdBy || actorId(), updatedBy: data.updatedBy || actorId(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<ObjectiveTarget, "id">>); }
export async function updateObjectiveTarget(id: string, data: Partial<ObjectiveTarget>) { return updateRecord(COLLECTIONS.objectiveTargets, id, { ...data, updatedBy: actorId() }); }
export const getObjectiveTargetById = cache(async (id: string) => getRecord<ObjectiveTarget>(COLLECTIONS.objectiveTargets, id));
export const getObjectiveTargets = cache(async () => listCollection<ObjectiveTarget>(COLLECTIONS.objectiveTargets, [orderBy("updatedAt", "desc"), limit(200)]));
export const getActiveObjectiveTargets = cache(async () => listCollection<ObjectiveTarget>(COLLECTIONS.objectiveTargets, [where("status", "==", "active"), limit(50)]));
export async function approveObjectiveTarget(id: string) { const target = await getRecord<ObjectiveTarget>(COLLECTIONS.objectiveTargets, id); if (target) { const active = (await getActiveObjectiveTargets()).filter((item) => item.periodType === target.periodType && item.id !== id); await Promise.all(active.map((item) => updateRecord(COLLECTIONS.objectiveTargets, item.id, { status: "archived" }))); } return updateRecord(COLLECTIONS.objectiveTargets, id, { status: "active", approvedBy: actorId(), approvedAt: serverTimestamp() }); }
export async function archiveObjectiveTarget(id: string) { return updateRecord(COLLECTIONS.objectiveTargets, id, { status: "archived" }); }
export async function updateObjectiveProgress(id: string, progressPercent: number, reviewNotes?: string) { await updateRecord(COLLECTIONS.objectiveTargets, id, { progressPercent, reviewNotes, updatedBy: actorId() }); await logGovernanceEvent({ entityType: "objective_target", entityId: id, action: "objective_progress_updated", actorUserId: actorId(), description: `Progress updated to ${progressPercent}%` }); }
export async function updateObjectiveKPIValue(id: string, kpiId: string, currentValue: string | number | boolean) { const target = await getRecord<ObjectiveTarget>(COLLECTIONS.objectiveTargets, id); if (!target) throw new Error("Objective target not found"); await updateRecord(COLLECTIONS.objectiveTargets, id, { kpis: (target.kpis || []).map((kpi) => kpi.id === kpiId ? { ...kpi, currentValue } : kpi), updatedBy: actorId() }); }
export const getGovernanceAuditEvents = cache(async (entityId: string) => listCollection<GovernanceAuditEvent>(COLLECTIONS.governanceAuditEvents, [where("entityId", "==", entityId), orderBy("createdAt", "desc"), limit(100)]));

export async function seedInitialGovernanceDocuments() {
  const existing = await getGovernanceDocuments();
  if (existing.some((doc) => doc.title === "NumSum Labs Constitution")) return { seeded: false, count: existing.length };
  const sections = ["Preamble", "Name, Identity and Purpose", "Foundational Principles", "Organizational Structure", "Membership", "Equity, Ownership and Stewardship", "Target Management System", "Meeting System", "Decision Making", "Knowledge Management", "MSME Innovation Framework", "Conflict Resolution", "Intellectual Property", "Amendment Procedure", "Founding Declaration"].map((title, index) => ({ id: `section-${index + 1}`, title, order: index + 1, content: `${title} placeholder for NumSum Labs institutional governance.` }));
  await createGovernanceDocument({ title: "NumSum Labs Constitution", documentType: "constitution", status: "active", version: 1, visibility: "admin_only", summary: "Foundational constitution placeholder for NumSum Labs.", content: sections.map((s) => `## ${s.title}\n${s.content}`).join("\n\n"), sections, tags: ["constitution", "foundational"] });
  await createGovernanceDocument({ title: "Frozen Core Objective Target", documentType: "objective_target", status: "active", version: 1, visibility: "admin_only", summary: "Frozen first strategic objective for NumSum Labs.", content: "NumSum Labs’ first strategic objective is to become a trusted MSME industrial upgradation and problem-solving institution by systematically discovering real MSME challenges, converting them into structured problem statements, building a reusable knowledge base, developing SOPs and diagnostic frameworks, tracking global research and successful case studies, and delivering validated practical solutions through multidisciplinary engineering collaboration.", tags: ["objective", "frozen"] });
  await createGovernanceDocument({ title: "Governance Manual", documentType: "governance_manual", status: "draft", version: 1, visibility: "admin_only", summary: "Governance operating manual placeholder." });
  await createGovernanceDocument({ title: "Annual Objective 2026", documentType: "annual_objective", status: "draft", version: 1, visibility: "admin_only", summary: "Annual 2026 objective placeholder." });
  await createObjectiveTarget({ title: "Annual Objective 2026", periodType: "annual", periodLabel: "2026", status: "active", strategicTheme: "MSME industrial upgradation", objectiveSummary: "NumSum Labs’ first strategic objective is to become a trusted MSME industrial upgradation and problem-solving institution by systematically discovering real MSME challenges, converting them into structured problem statements, building a reusable knowledge base, developing SOPs and diagnostic frameworks, tracking global research and successful case studies, and delivering validated practical solutions through multidisciplinary engineering collaboration.", workstreams: ["MSME Field Intelligence", "Problem Statement Lab", "SOP & Knowledge Base", "Research & Technology Watch", "Case Study & Success Story", "Solution & Pilot Team", "Governance & Documentation"].map((name, i) => ({ id: `workstream-${i+1}`, name, priority: "high", status: "active", ownerIds: [], targetOutputs: [], expectedEvidence: [] })), kpis: [{ id: "msmes", name: "Study MSMEs", metricType: "count", targetValue: 50, currentValue: 0, unit: "MSMEs", frequency: "annual", status: "active" }, { id: "problems", name: "Document problem statements", metricType: "count", targetValue: 150, currentValue: 0, unit: "problems", frequency: "annual", status: "active" }, { id: "sops", name: "Create SOPs/frameworks/checklists", metricType: "count", targetValue: 25, currentValue: 0, unit: "assets", frequency: "annual", status: "active" }, { id: "cases", name: "Publish MSME/startup case studies", metricType: "count", targetValue: 20, currentValue: 0, unit: "case studies", frequency: "annual", status: "active" }, { id: "research", name: "Track research/technology developments", metricType: "count", targetValue: 100, currentValue: 0, unit: "developments", frequency: "annual", status: "active" }, { id: "pilots", name: "Execute pilot improvement projects", metricType: "count", targetValue: 5, currentValue: 0, unit: "pilots", frequency: "annual", status: "active" }] });
  return { seeded: true, count: 5 };
}

export async function getGovernanceMetrics() {
  const [constitution, objectives, amendments, documents] = await Promise.all([getActiveGovernanceDocumentByType("constitution"), getActiveObjectiveTargets(), getGovernanceAmendments(), getGovernanceDocuments()]);
  const now = new Date();
  return { activeConstitutionVersion: constitution?.version || 0, activeObjectiveTarget: objectives[0]?.title || "None", pendingAmendments: amendments.filter((a) => ["proposed", "under_review"].includes(a.status)).length, activeMonthlyTargets: objectives.filter((o) => o.periodType === "monthly").length, kpiProgressCount: objectives.reduce((sum, o) => sum + (o.kpis || []).filter((k) => Number(k.currentValue || 0) > 0).length, 0), documentsUnderReview: documents.filter((d) => d.status === "under_review").length, documentsApprovedThisMonth: documents.filter((d) => { const v = d.approvedAt as any; const date = v?.toDate ? v.toDate() : v ? new Date(v) : null; return date && date.getUTCFullYear() === now.getUTCFullYear() && date.getUTCMonth() === now.getUTCMonth(); }).length };
}

const uid = () => auth.currentUser?.uid || "system";
const today = new Date();
const dateValue = (v: any) => v?.toDate ? v.toDate() : v ? new Date(v) : null;

export async function createExecutionWorkItem(data: Partial<ExecutionWorkItem>) {
  const created = await createRecord<ExecutionWorkItem>(COLLECTIONS.executionWorkItems, { objectiveTargetId: data.objectiveTargetId || "", workstreamId: data.workstreamId || "", title: data.title || "Untitled work item", description: data.description || "", workType: data.workType || "other", priority: data.priority || "medium", status: data.status || "planned", ownerIds: data.ownerIds || [], reviewerIds: data.reviewerIds || [], startDate: data.startDate || null, dueDate: data.dueDate || null, expectedOutput: data.expectedOutput || "", evidenceRequired: Boolean(data.evidenceRequired), evidenceLinks: data.evidenceLinks || [], relatedProblemStatementIds: data.relatedProblemStatementIds || [], relatedKnowledgeAssetIds: data.relatedKnowledgeAssetIds || [], relatedResearchItemIds: data.relatedResearchItemIds || [], relatedSOPIds: data.relatedSOPIds || [], relatedPilotTrackIds: data.relatedPilotTrackIds || [], relatedGovernanceDocumentIds: data.relatedGovernanceDocumentIds || [], blockerReason: data.blockerReason || "", reviewNotes: data.reviewNotes || "", completionNotes: data.completionNotes || "", createdBy: data.createdBy || uid(), updatedBy: uid(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any);
  await logGovernanceEvent({ entityType: "execution_work_item", entityId: created.id, action: "created", actorUserId: uid(), description: data.title || "Work item created" });
  return created;
}
export const updateExecutionWorkItem = (id: string, data: Partial<ExecutionWorkItem>) => updateRecord(COLLECTIONS.executionWorkItems, id, { ...data, updatedBy: uid() } as any);
export const getExecutionWorkItemById = cache(async (id: string) => getRecord<ExecutionWorkItem>(COLLECTIONS.executionWorkItems, id));
export const getExecutionWorkItemsForObjective = cache(async (objectiveTargetId: string) => listCollection<ExecutionWorkItem>(COLLECTIONS.executionWorkItems, [where("objectiveTargetId", "==", objectiveTargetId), limit(200)]));
export const getMyExecutionWorkItems = cache(async (userId: string) => listCollection<ExecutionWorkItem>(COLLECTIONS.executionWorkItems, [where("ownerIds", "array-contains", userId), limit(100)]));
export const getAdminExecutionWorkItems = cache(async () => listCollection<ExecutionWorkItem>(COLLECTIONS.executionWorkItems, [orderBy("updatedAt", "desc"), limit(300)]));
export const updateExecutionWorkItemStatus = (id: string, status: ExecutionWorkItem["status"], blockerReason = "") => updateRecord(COLLECTIONS.executionWorkItems, id, { status, blockerReason, updatedBy: uid() });
export async function completeExecutionWorkItem(id: string, completionNotes = "", evidenceLinks: string[] = []) { const item = await getRecord<ExecutionWorkItem>(COLLECTIONS.executionWorkItems, id); if (!item) throw new Error("Work item not found"); if (item.evidenceRequired && !completionNotes && !evidenceLinks.length && !(item.evidenceLinks || []).length) throw new Error("Completion notes or evidence are required"); await updateRecord(COLLECTIONS.executionWorkItems, id, { status: "completed", completedAt: serverTimestamp(), completionNotes, evidenceLinks: [...(item.evidenceLinks || []), ...evidenceLinks], updatedBy: uid() }); await Promise.all((item.ownerIds || [uid()]).map((ownerId)=>autoLogContribution({ contributorUserId: ownerId, contributionTitle: item.title, contributionSummary: completionNotes || item.description, contributionCategory: "execution", contributionType: "work_item_completed", relatedEntityType: "execution_work_item", relatedEntityId: id, relatedEntityTitle: item.title, objectiveTargetId: item.objectiveTargetId, workstreamId: item.workstreamId, evidenceLinks: [...(item.evidenceLinks || []), ...evidenceLinks], impactSummary: item.expectedOutput, createdBy: uid() }))); const all = await getExecutionWorkItemsForObjective(item.objectiveTargetId); const total = Math.max(all.length, 1); const completed = all.filter((w) => w.id === id || w.status === "completed").length; await updateObjectiveProgress(item.objectiveTargetId, Math.round((completed / total) * 100), "Progress recalculated from completed execution work items.").catch(()=>{}); }
export const linkEvidenceToWorkItem = (id: string, url: string) => updateRecord(COLLECTIONS.executionWorkItems, id, { evidenceLinks: arrayUnion(url), updatedBy: uid() });

export async function createActionItem(data: Partial<ActionItem>) { return createRecord<ActionItem>(COLLECTIONS.actionItems, { title: data.title || "Untitled action item", description: data.description || "", sourceType: data.sourceType || "manual", sourceId: data.sourceId || "", ownerIds: data.ownerIds || [], reviewerIds: data.reviewerIds || [], priority: data.priority || "medium", status: data.status || "open", dueDate: data.dueDate || null, evidenceRequired: Boolean(data.evidenceRequired), evidenceLinks: data.evidenceLinks || [], blockerReason: data.blockerReason || "", completionNotes: data.completionNotes || "", createdBy: data.createdBy || uid(), updatedBy: uid(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any); }
export const updateActionItem = (id: string, data: Partial<ActionItem>) => updateRecord(COLLECTIONS.actionItems, id, { ...data, updatedBy: uid() } as any);
export const getActionItemById = cache(async (id: string) => getRecord<ActionItem>(COLLECTIONS.actionItems, id));
export const getActionItemsForSource = cache(async (sourceType: string, sourceId: string) => listCollection<ActionItem>(COLLECTIONS.actionItems, [where("sourceType", "==", sourceType), where("sourceId", "==", sourceId), limit(100)]));
export const getMyActionItems = cache(async (userId: string) => listCollection<ActionItem>(COLLECTIONS.actionItems, [where("ownerIds", "array-contains", userId), limit(100)]));
export const getAdminActionItems = cache(async () => listCollection<ActionItem>(COLLECTIONS.actionItems, [orderBy("updatedAt", "desc"), limit(300)]));
export const updateActionItemStatus = (id: string, status: ActionItem["status"], blockerReason = "") => updateRecord(COLLECTIONS.actionItems, id, { status, blockerReason, updatedBy: uid() });
export async function completeActionItem(id: string, completionNotes = "", evidenceLinks: string[] = []) { const item = await getRecord<ActionItem>(COLLECTIONS.actionItems, id); if (!item) throw new Error("Action item not found"); await updateRecord(COLLECTIONS.actionItems, id, { status: "completed", completedAt: serverTimestamp(), completionNotes, evidenceLinks: arrayUnion(...evidenceLinks), updatedBy: uid() }); await Promise.all((item.ownerIds || [uid()]).map((ownerId)=>autoLogContribution({ contributorUserId: ownerId, contributionTitle: item.title, contributionSummary: completionNotes || item.description, contributionCategory: "execution", contributionType: "action_item_completed", relatedEntityType: "action_item", relatedEntityId: id, relatedEntityTitle: item.title, evidenceLinks: [...(item.evidenceLinks || []), ...evidenceLinks], createdBy: uid() }))); }

export async function createMeetingRecord(data: Partial<MeetingRecord>) { return createRecord<MeetingRecord>(COLLECTIONS.meetingRecords, { meetingType: data.meetingType || "weekly_sprint_review", title: data.title || "Untitled meeting", meetingDate: data.meetingDate || null, startTime: data.startTime || "", endTime: data.endTime || "", mode: data.mode || "online", attendees: data.attendees || [], absentMembers: data.absentMembers || [], agenda: data.agenda || [], progressUpdates: data.progressUpdates || [], blockers: data.blockers || [], keyLearnings: data.keyLearnings || [], decisions: data.decisions || [], actionItemIds: data.actionItemIds || [], linkedObjectiveTargetIds: data.linkedObjectiveTargetIds || [], linkedProblemStatementIds: data.linkedProblemStatementIds || [], linkedPilotTrackIds: data.linkedPilotTrackIds || [], linkedGovernanceDocumentIds: data.linkedGovernanceDocumentIds || [], minutes: data.minutes || "", status: data.status || "scheduled", visibility: data.visibility || "internal_member", createdBy: data.createdBy || uid(), updatedBy: uid(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any); }
export const updateMeetingRecord = (id: string, data: Partial<MeetingRecord>) => updateRecord(COLLECTIONS.meetingRecords, id, { ...data, updatedBy: uid() } as any);
export const getMeetingRecordById = cache(async (id: string) => getRecord<MeetingRecord>(COLLECTIONS.meetingRecords, id));
export const getMeetingRecords = cache(async () => listCollection<MeetingRecord>(COLLECTIONS.meetingRecords, [orderBy("meetingDate", "desc"), limit(200)]));
export const getMeetingRecordsByType = cache(async (meetingType: string) => listCollection<MeetingRecord>(COLLECTIONS.meetingRecords, [where("meetingType", "==", meetingType), limit(100)]));
export const getMeetingRecordsForObjective = cache(async (objectiveId: string) => listCollection<MeetingRecord>(COLLECTIONS.meetingRecords, [where("linkedObjectiveTargetIds", "array-contains", objectiveId), limit(100)]));
export const getMeetingRecordsForProblem = cache(async (problemId: string) => listCollection<MeetingRecord>(COLLECTIONS.meetingRecords, [where("linkedProblemStatementIds", "array-contains", problemId), limit(100)]));
export const getMeetingRecordsForPilot = cache(async (pilotId: string) => listCollection<MeetingRecord>(COLLECTIONS.meetingRecords, [where("linkedPilotTrackIds", "array-contains", pilotId), limit(100)]));
export async function completeMeetingRecord(id: string, patch: Partial<MeetingRecord> = {}, actionPoints: Partial<ActionItem>[] = [], decisionPoints: Partial<DecisionRecord>[] = []) { await updateMeetingRecord(id, { ...patch, status: "completed" }); const actions = await Promise.all(actionPoints.map((a) => createActionItem({ ...a, sourceType: "meeting", sourceId: id }))); await Promise.all(decisionPoints.map((d) => createDecisionRecord({ ...d, meetingRecordId: id }))); if (actions.length) await updateMeetingRecord(id, { actionItemIds: actions.map((a) => a.id) }); }

export async function createExecutionReview(data: Partial<ExecutionReview>) { return createRecord<ExecutionReview>(COLLECTIONS.executionReviews, { objectiveTargetId: data.objectiveTargetId || "", reviewType: data.reviewType || "weekly_sprint", title: data.title || "Execution review", reviewDate: data.reviewDate || serverTimestamp(), periodStart: data.periodStart || null, periodEnd: data.periodEnd || null, summary: data.summary || "", progressHighlights: data.progressHighlights || [], blockers: data.blockers || [], decisions: data.decisions || [], lessonsLearned: data.lessonsLearned || [], nextPriorities: data.nextPriorities || [], reviewedKpiIds: data.reviewedKpiIds || [], reviewedKraIds: data.reviewedKraIds || [], reviewedWorkItemIds: data.reviewedWorkItemIds || [], attendees: data.attendees || [], createdBy: data.createdBy || uid(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any); }
export const updateExecutionReview = (id: string, data: Partial<ExecutionReview>) => updateRecord(COLLECTIONS.executionReviews, id, data as any);
export const getExecutionReviewsForObjective = cache(async (objectiveTargetId: string) => listCollection<ExecutionReview>(COLLECTIONS.executionReviews, [where("objectiveTargetId", "==", objectiveTargetId), limit(100)]));
export const getExecutionReviewsByType = cache(async (reviewType: string) => listCollection<ExecutionReview>(COLLECTIONS.executionReviews, [where("reviewType", "==", reviewType), limit(100)]));

export const createDecisionRecord = (data: Partial<DecisionRecord>) => createRecord<DecisionRecord>(COLLECTIONS.decisionRecords, { decisionTitle: data.decisionTitle || "Untitled decision", decisionType: data.decisionType || "operational", description: data.description || "", optionsConsidered: data.optionsConsidered || [], decisionOutcome: data.decisionOutcome || "", rationale: data.rationale || "", evidenceLinks: data.evidenceLinks || [], meetingRecordId: data.meetingRecordId || "", objectiveTargetId: data.objectiveTargetId || "", problemStatementId: data.problemStatementId || "", pilotTrackId: data.pilotTrackId || "", governanceDocumentId: data.governanceDocumentId || "", decidedBy: data.decidedBy || [uid()], decisionDate: data.decisionDate || serverTimestamp(), status: data.status || "approved", createdBy: data.createdBy || uid(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any);
export const updateDecisionRecord = (id: string, data: Partial<DecisionRecord>) => updateRecord(COLLECTIONS.decisionRecords, id, data as any);
export const getDecisionRecords = cache(async () => listCollection<DecisionRecord>(COLLECTIONS.decisionRecords, [orderBy("decisionDate", "desc"), limit(200)]));
export const getDecisionRecordsForMeeting = cache(async (meetingRecordId: string) => listCollection<DecisionRecord>(COLLECTIONS.decisionRecords, [where("meetingRecordId", "==", meetingRecordId), limit(100)]));
export const getDecisionRecordsForObjective = cache(async (objectiveTargetId: string) => listCollection<DecisionRecord>(COLLECTIONS.decisionRecords, [where("objectiveTargetId", "==", objectiveTargetId), limit(100)]));
export const getDecisionRecordsForProblem = cache(async (problemStatementId: string) => listCollection<DecisionRecord>(COLLECTIONS.decisionRecords, [where("problemStatementId", "==", problemStatementId), limit(100)]));
export const getDecisionRecordsForPilot = cache(async (pilotTrackId: string) => listCollection<DecisionRecord>(COLLECTIONS.decisionRecords, [where("pilotTrackId", "==", pilotTrackId), limit(100)]));

export const createEvidenceRecord = (data: Partial<EvidenceRecord>) => createRecord<EvidenceRecord>(COLLECTIONS.evidenceRecords, { title: data.title || "Evidence link", description: data.description || "", evidenceType: data.evidenceType || "drive_link", url: data.url || "", relatedEntityType: data.relatedEntityType || "objective_target", relatedEntityId: data.relatedEntityId || "", visibility: data.visibility || "internal_member", uploadedBy: data.uploadedBy || uid(), status: "active", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any);
export const updateEvidenceRecord = (id: string, data: Partial<EvidenceRecord>) => updateRecord(COLLECTIONS.evidenceRecords, id, data as any);
export const getEvidenceRecordsForEntity = cache(async (relatedEntityType: string, relatedEntityId: string) => listCollection<EvidenceRecord>(COLLECTIONS.evidenceRecords, [where("relatedEntityType", "==", relatedEntityType), where("relatedEntityId", "==", relatedEntityId), limit(100)]));
export const archiveEvidenceRecord = (id: string) => updateRecord(COLLECTIONS.evidenceRecords, id, { status: "archived", archivedAt: serverTimestamp() });

export async function getExecutionMetrics(userId?: string) {
  const [work, actions, meetings, decisions, evidence, objectives] = await Promise.all([userId ? getMyExecutionWorkItems(userId) : getAdminExecutionWorkItems(), userId ? getMyActionItems(userId) : getAdminActionItems(), getMeetingRecords().catch(()=>[]), getDecisionRecords().catch(()=>[]), listCollection<EvidenceRecord>(COLLECTIONS.evidenceRecords, [limit(200)]).catch(()=>[]), getActiveObjectiveTargets().catch(()=>[])]);
  const now = new Date(); const weekAgo = new Date(now); weekAgo.setDate(now.getDate()-7); const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const overdue = (x:any) => { const d=dateValue(x.dueDate); return d && d < now && !["completed","cancelled"].includes(x.status); };
  return { activeObjectives: objectives.length, openWorkItems: work.filter(w=>!["completed","cancelled"].includes(w.status)).length, overdueWorkItems: work.filter(overdue).length, blockedWorkItems: work.filter(w=>w.status==="blocked").length, completedThisWeek: work.filter(w=>w.status==="completed" && dateValue(w.completedAt) && dateValue(w.completedAt)! >= weekAgo).length, completedThisMonth: work.filter(w=>w.status==="completed" && dateValue(w.completedAt) && dateValue(w.completedAt)! >= monthStart).length, openActionItems: actions.filter(a=>!["completed","cancelled"].includes(a.status)).length, overdueActionItems: actions.filter(overdue).length, upcomingMeetings: meetings.filter(m=>m.status==="scheduled").length, meetingsCompletedThisMonth: meetings.filter(m=>m.status==="completed" && dateValue(m.meetingDate) && dateValue(m.meetingDate)! >= monthStart).length, decisionsRecordedThisMonth: decisions.filter(d=>dateValue(d.decisionDate) && dateValue(d.decisionDate)! >= monthStart).length, evidenceRecordsThisMonth: evidence.filter(e=>dateValue(e.createdAt) && dateValue(e.createdAt)! >= monthStart).length };
}


// Contribution Tracking, Evidence, Recognition, and Review System
const contributionDefaults = { qualityRating: "not_reviewed", impactRating: "not_reviewed", alignmentRating: "not_reviewed", reviewStatus: "submitted", visibility: "contributor_only" } as const;
async function getContributorName(userId?: string) { if (!userId) return "Contributor"; const u = await getRecord<UserProfile>(COLLECTIONS.users, userId).catch(()=>null); return u?.displayName || u?.fullName || u?.name || u?.email || "Contributor"; }
export async function createContributionRecord(data: Partial<ContributionRecord>) { const contributorUserId = data.contributorUserId || data.createdBy || uid(); return createRecord<ContributionRecord>(COLLECTIONS.contributionRecords, { ...contributionDefaults, ...data, contributorUserId, contributorName: data.contributorName || await getContributorName(contributorUserId), contributionTitle: data.contributionTitle || data.relatedEntityTitle || "Contribution", contributionSummary: data.contributionSummary || "", contributionCategory: (data.contributionCategory || "other") as ContributionCategory, contributionType: (data.contributionType || "other") as ContributionType, relatedEntityType: (data.relatedEntityType || "manual") as ContributionEntityType, evidenceLinks: data.evidenceLinks || [], evidenceRecordIds: data.evidenceRecordIds || [], createdBy: data.createdBy || uid(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any); }
export const updateContributionRecord = (id: string, patch: Partial<ContributionRecord>) => updateRecord(COLLECTIONS.contributionRecords, id, patch as any);
export const getContributionRecordById = cache(async (id: string) => getRecord<ContributionRecord>(COLLECTIONS.contributionRecords, id));
export const getContributionRecordsForContributor = cache(async (userId: string) => listCollection<ContributionRecord>(COLLECTIONS.contributionRecords, [where("contributorUserId", "==", userId), limit(200)]));
export const getContributionRecordsForEntity = cache(async (relatedEntityType: ContributionEntityType, relatedEntityId: string) => listCollection<ContributionRecord>(COLLECTIONS.contributionRecords, [where("relatedEntityType", "==", relatedEntityType), where("relatedEntityId", "==", relatedEntityId), limit(100)]));
export const getAdminContributionRecords = cache(async () => listCollection<ContributionRecord>(COLLECTIONS.contributionRecords, [orderBy("updatedAt", "desc"), limit(500)]).catch(()=>listCollection<ContributionRecord>(COLLECTIONS.contributionRecords, [limit(500)])));
export async function reviewContributionRecord(id: string, patch: Partial<ContributionRecord> & { reviewerId?: string; reviewerName?: string }) { return updateContributionRecord(id, { ...patch, reviewStatus: patch.reviewStatus || "under_review", reviewedAt: serverTimestamp() as any }); }
export const acceptContributionRecord = (id: string, reviewerId = uid(), approvedScore?: number, notes = "") => reviewContributionRecord(id, { reviewStatus: "accepted", reviewerId, approvedScore, reviewNotes: notes });
export const rejectContributionRecord = (id: string, reviewerId = uid(), notes = "") => reviewContributionRecord(id, { reviewStatus: "rejected", reviewerId, reviewNotes: notes });
export const archiveContributionRecord = (id: string) => updateContributionRecord(id, { reviewStatus: "archived" });
async function autoLogContribution(data: Partial<ContributionRecord>) { const contributorUserId = data.contributorUserId; if (!contributorUserId || !data.relatedEntityId || !data.contributionType) return null; const existing = await getContributionRecordsForEntity(data.relatedEntityType || "manual", data.relatedEntityId).catch(()=>[]); if (existing.some((r)=>r.contributorUserId===contributorUserId && r.contributionType===data.contributionType)) return null; return createContributionRecord({ ...data, reviewStatus: "auto_logged", visibility: "internal_member", createdBy: data.createdBy || "system" }); }

export async function createContributionScoreRule(data: Partial<ContributionScoreRule>) { return createRecord<ContributionScoreRule>(COLLECTIONS.contributionScoreRules, { ...data, contributionType: data.contributionType || "other", contributionCategory: data.contributionCategory || "other", title: data.title || "Contribution rule", description: data.description || "Illustrative internal contribution score; not equity entitlement.", baseScore: data.baseScore ?? 1, minScore: data.minScore ?? 0, maxScore: data.maxScore ?? 5, evidenceRequired: data.evidenceRequired ?? true, reviewRequired: data.reviewRequired ?? true, active: data.active ?? true, createdBy: data.createdBy || uid(), updatedBy: data.updatedBy || uid(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any); }
export const updateContributionScoreRule = (id: string, patch: Partial<ContributionScoreRule>) => updateRecord(COLLECTIONS.contributionScoreRules, id, { ...patch, updatedBy: uid() } as any);
export const getActiveContributionScoreRules = cache(async () => listCollection<ContributionScoreRule>(COLLECTIONS.contributionScoreRules, [where("active", "==", true), limit(100)]));
export async function seedDefaultContributionScoreRules(actorId = uid()) { const defaults: Array<[string, ContributionType, ContributionCategory, number, number, number]> = [["Research Report","research_report","research",4,1,8],["Industry Study","industry_study","research",4,1,8],["Knowledge Framework","knowledge_asset","knowledge",5,1,10],["SOP Created","sop_created","documentation",4,1,8],["Product Prototype","platform_development","product",8,2,15],["Customer/MSME Engagement","customer_or_msme_engagement","business",5,1,10],["Strategic Partnership","partnership_support","strategic",8,2,15],["Patent Filing","other","technical",10,3,20],["Commercial Product Launch","platform_development","product",15,5,30],["Funding Secured","other","business",15,5,30]]; const existing = await listCollection<ContributionScoreRule>(COLLECTIONS.contributionScoreRules,[limit(100)]).catch(()=>[]); return Promise.all(defaults.filter(([title])=>!existing.some((r)=>r.title===title)).map(([title, contributionType, contributionCategory, baseScore, minScore, maxScore])=>createContributionScoreRule({ title, contributionType, contributionCategory, baseScore, minScore, maxScore, evidenceRequired: true, reviewRequired: true, active: true, createdBy: actorId, updatedBy: actorId, description: "Illustrative internal contribution score for governance review only. This is not equity entitlement." }))); }
export const archiveContributionScoreRule = (id: string) => updateContributionScoreRule(id, { active: false });

export async function createContributionReviewCycle(data: Partial<ContributionReviewCycle>) { return createRecord<ContributionReviewCycle>(COLLECTIONS.contributionReviewCycles, { ...data, title: data.title || "Contribution review cycle", periodType: data.periodType || "monthly", status: data.status || "draft", reviewerIds: data.reviewerIds || [], contributorIds: data.contributorIds || [], summary: data.summary || "", decisions: data.decisions || "", createdBy: data.createdBy || uid(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any); }
export const updateContributionReviewCycle = (id: string, patch: Partial<ContributionReviewCycle>) => updateRecord(COLLECTIONS.contributionReviewCycles, id, patch as any);
export const getContributionReviewCycles = cache(async () => listCollection<ContributionReviewCycle>(COLLECTIONS.contributionReviewCycles, [orderBy("updatedAt", "desc"), limit(100)]).catch(()=>listCollection<ContributionReviewCycle>(COLLECTIONS.contributionReviewCycles,[limit(100)])));
export const getContributionReviewCycleById = cache(async (id: string) => getRecord<ContributionReviewCycle>(COLLECTIONS.contributionReviewCycles, id));
export const completeContributionReviewCycle = (id: string) => updateContributionReviewCycle(id, { status: "completed", completedAt: serverTimestamp() as any });
export async function generateContributorReviewSummary(reviewCycleId: string, contributorUserId: string) { const cycle = await getContributionReviewCycleById(reviewCycleId); const rows = await getContributionRecordsForContributor(contributorUserId); const cats: Record<string, number> = {}; rows.forEach((r)=>cats[r.contributionCategory]=(cats[r.contributionCategory]||0)+1); return createRecord<ContributorReviewSummary>(COLLECTIONS.contributorReviewSummaries, { reviewCycleId, contributorUserId, contributorName: await getContributorName(contributorUserId), periodStart: cycle?.periodStart, periodEnd: cycle?.periodEnd, totalContributions: rows.length, acceptedContributions: rows.filter(r=>r.reviewStatus==="accepted").length, rejectedContributions: rows.filter(r=>r.reviewStatus==="rejected").length, totalApprovedScore: rows.reduce((n,r)=>n+(r.approvedScore||0),0), categoryBreakdown: cats, strongestContributions: rows.filter(r=>r.reviewStatus==="accepted").slice(0,5).map(r=>r.contributionTitle), improvementAreas: "", reviewerNotes: "", recognitionRecommendation: "none", finalStatus: "draft", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any); }
export const getContributorReviewSummariesForCycle = cache(async (reviewCycleId: string) => listCollection<ContributorReviewSummary>(COLLECTIONS.contributorReviewSummaries, [where("reviewCycleId", "==", reviewCycleId), limit(200)]));
export const getContributorReviewSummariesForUser = cache(async (contributorUserId: string) => listCollection<ContributorReviewSummary>(COLLECTIONS.contributorReviewSummaries, [where("contributorUserId", "==", contributorUserId), limit(100)]));

export async function createRecognitionRecord(data: Partial<RecognitionRecord>) { return createRecord<RecognitionRecord>(COLLECTIONS.recognitionRecords, { ...data, contributorUserId: data.contributorUserId || uid(), contributorName: data.contributorName || await getContributorName(data.contributorUserId || uid()), recognitionTitle: data.recognitionTitle || "Contributor recognition", recognitionType: data.recognitionType || "appreciation", description: data.description || "", relatedContributionRecordIds: data.relatedContributionRecordIds || [], visibility: data.visibility || "contributor_only", status: data.status || "draft", awardedBy: data.awardedBy || uid(), createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any); }
export const updateRecognitionRecord = (id: string, patch: Partial<RecognitionRecord>) => updateRecord(COLLECTIONS.recognitionRecords, id, patch as any);
export const getRecognitionRecordsForContributor = cache(async (contributorUserId: string) => listCollection<RecognitionRecord>(COLLECTIONS.recognitionRecords, [where("contributorUserId", "==", contributorUserId), limit(100)]));
export const getAdminRecognitionRecords = cache(async () => listCollection<RecognitionRecord>(COLLECTIONS.recognitionRecords, [orderBy("updatedAt", "desc"), limit(200)]).catch(()=>listCollection<RecognitionRecord>(COLLECTIONS.recognitionRecords, [limit(200)])));
export const approveRecognitionRecord = (id: string) => updateRecognitionRecord(id, { status: "approved", awardedAt: serverTimestamp() as any });
export const publishRecognitionRecord = (id: string) => updateRecognitionRecord(id, { status: "published", awardedAt: serverTimestamp() as any });
export const archiveRecognitionRecord = (id: string) => updateRecognitionRecord(id, { status: "archived" });

export async function createContributionClaim(data: Partial<ContributionClaim>) { return createRecord<ContributionClaim>(COLLECTIONS.contributionClaims, { ...data, contributorUserId: data.contributorUserId || uid(), contributorName: data.contributorName || await getContributorName(data.contributorUserId || uid()), claimTitle: data.claimTitle || "Contribution claim", claimSummary: data.claimSummary || "", relatedEntityType: data.relatedEntityType || "manual", evidenceLinks: data.evidenceLinks || [], requestedCategory: data.requestedCategory || "other", requestedType: data.requestedType || "other", status: "submitted", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as any); }
export const updateContributionClaim = (id: string, patch: Partial<ContributionClaim>) => updateRecord(COLLECTIONS.contributionClaims, id, patch as any);
export const getMyContributionClaims = cache(async (contributorUserId: string) => listCollection<ContributionClaim>(COLLECTIONS.contributionClaims, [where("contributorUserId", "==", contributorUserId), limit(100)]));
export const getAdminContributionClaims = cache(async () => listCollection<ContributionClaim>(COLLECTIONS.contributionClaims, [orderBy("updatedAt", "desc"), limit(200)]).catch(()=>listCollection<ContributionClaim>(COLLECTIONS.contributionClaims,[limit(200)])));
export const reviewContributionClaim = (id: string, status: ContributionClaim["status"], adminNotes = "") => updateContributionClaim(id, { status, adminNotes, reviewedAt: serverTimestamp() as any });
export async function convertContributionClaimToRecord(id: string, reviewerId = uid()) { const claim = await getRecord<ContributionClaim>(COLLECTIONS.contributionClaims, id); if (!claim) throw new Error("Contribution claim not found"); const record = await createContributionRecord({ contributorUserId: claim.contributorUserId, contributorName: claim.contributorName, contributionTitle: claim.claimTitle, contributionSummary: claim.claimSummary, contributionCategory: claim.requestedCategory, contributionType: claim.requestedType, relatedEntityType: claim.relatedEntityType, relatedEntityId: claim.relatedEntityId, evidenceLinks: claim.evidenceLinks, reviewStatus: "under_review", visibility: "contributor_only", createdBy: reviewerId }); await reviewContributionClaim(id, "accepted", "Converted to contribution record."); return record; }

export async function getContributionMetrics(userId?: string) { const [records, claims, cycles, recognition] = await Promise.all([userId?getContributionRecordsForContributor(userId):getAdminContributionRecords(), userId?getMyContributionClaims(userId):getAdminContributionClaims(), getContributionReviewCycles().catch(()=>[]), userId?getRecognitionRecordsForContributor(userId):getAdminRecognitionRecords()]); const month = new Date(); month.setDate(1); month.setHours(0,0,0,0); const dt=(v:any)=>v?.toDate?.() || (v?new Date(v):null); return { total: records.length, pending: records.filter(r=>["auto_logged","submitted","under_review","needs_revision"].includes(r.reviewStatus)).length, accepted: records.filter(r=>r.reviewStatus==="accepted").length, rejected: records.filter(r=>r.reviewStatus==="rejected").length, autoLogged: records.filter(r=>r.reviewStatus==="auto_logged").length, acceptedThisMonth: records.filter(r=>r.reviewStatus==="accepted" && dt(r.reviewedAt) && dt(r.reviewedAt)>=month).length, claimsPending: claims.filter(c=>["submitted","under_review","needs_revision"].includes(c.status)).length, activeReviewCycles: cycles.filter(c=>["open","under_review"].includes(c.status)).length, recognitionThisMonth: recognition.filter(r=>dt(r.awardedAt)||dt(r.createdAt)).filter(r=>(dt(r.awardedAt)||dt(r.createdAt))>=month).length }; }


export const getUserRoleRequests = cache(async () => listCollection<any>(COLLECTIONS.userRoleRequests, [limit(500)]));
export const getMyUserRoleRequests = cache(async (userId: string) => listCollection<any>(COLLECTIONS.userRoleRequests, [where("userId", "==", userId), limit(50)]));
export async function createUserRoleRequest(_user: UserProfile, _requestedRole: Role, _reason: string) {
  throw new Error("Role requests are deprecated. Every signup is a member; only super admins assign admins by membership ID.");
}
export async function reviewUserRoleRequest(requestId: string, decision: "approved" | "rejected", actor: UserProfile) {
  if (actor.role !== "admin" && actor.role !== "super_admin") throw new Error("Admin access required.");
  const request = await getRecord<any>(COLLECTIONS.userRoleRequests, requestId);
  if (!request) throw new Error("Role request not found.");
  if (decision === "approved") await updateUserRoleAndStatus(request.userId, { role: request.requestedRole }, actor);
  await updateRecord(COLLECTIONS.userRoleRequests, requestId, { status: decision, reviewedBy: actor.uid, reviewedAt: serverTimestamp(), updatedAt: serverTimestamp() });
}

export const getUsersForRoleManagement = cache(async () => listCollection<UserProfile>(COLLECTIONS.users, [limit(500)]));
export const getSuperAdminUsers = getUsersForRoleManagement;
export async function getUserByMembershipId(membershipId: string) { return findUserByMembershipId(membershipId); }
export const getAdminAuditLogs = cache(async (targetUserId?: string) => listCollection<AdminAuditLog>(COLLECTIONS.adminAuditLogs, targetUserId ? [where("targetUserId", "==", targetUserId), limit(50)] : [limit(100)]).catch(() => []));
export async function createAdminAuditLog(data: Omit<AdminAuditLog, "id" | "createdAt">) { return createRecord<AdminAuditLog>(COLLECTIONS.adminAuditLogs, { ...data, createdAt: serverTimestamp() } as never); }
export async function hasAnotherActiveSuperAdmin(targetUserId: string) { const rows = await listCollection<UserProfile>(COLLECTIONS.users, [where("role", "==", "super_admin"), limit(10)]).catch(() => []); return rows.some((u) => (u.uid || u.id) !== targetUserId && u.status !== "inactive"); }

export async function updateUserRoleAndStatus(targetUserId: string, patch: { role?: Role; status?: string }, actor: UserProfile) {
  if (!actor.uid) throw new Error("Admin profile missing uid.");
  if (targetUserId === actor.uid && patch.role && patch.role !== actor.role) throw new Error("You cannot change your own role.");
  const target = await getRecord<UserProfile>(COLLECTIONS.users, targetUserId);
  if (!target) throw new Error("User not found.");
  if (actor.role !== "super_admin") throw new Error("Super admin access required.");
  if (target.role === "super_admin" && patch.role && patch.role !== "super_admin") {
    const superAdmins = (await listCollection<UserProfile>(COLLECTIONS.users, [where("role", "==", "super_admin"), limit(2)])).filter((u) => u.status !== "inactive");
    if (superAdmins.length <= 1) throw new Error("Cannot demote the last active super-admin.");
  }
  const safePatch = { ...patch, updatedAt: serverTimestamp() } as Record<string, unknown>;
  await updateRecord(COLLECTIONS.users, targetUserId, safePatch);
  await createAdminAuditLog({ actionType: patch.role && patch.role !== target.role ? "role_changed" : "status_changed", targetUserId, targetMembershipId: target.membershipId, targetEmail: target.email, previousRole: target.role || "member", newRole: patch.role || target.role || "member", previousStatus: target.status || "active", newStatus: patch.status || target.status || "active", performedByUserId: actor.uid, performedByMembershipId: actor.membershipId, performedByName: actor.fullName || actor.name || actor.email || "Super admin", reason: "Super admin user management action" });
  await logAudit({ actorId: actor.uid, action: "user_role_status_updated", entityType: "users", entityId: targetUserId, summary: `Updated ${target.email || targetUserId}`, metadata: { beforeRole: target.role, afterRole: patch.role || target.role, status: patch.status || target.status } } as any).catch(() => undefined);
}

function slugifyDiscussionTitle(title: string) {
  const base = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
  return `${base || "discussion"}-${Date.now().toString(36)}`;
}

export function canModerateDiscussion(profile?: Pick<UserProfile, "role"> | null) {
  return profile?.role === "admin" || profile?.role === "super_admin";
}
export function canCreateDiscussionThread(profile?: Pick<UserProfile, "profileComplete" | "role"> | null) {
  return Boolean(profile?.profileComplete || canModerateDiscussion(profile));
}
export function canReadTeamDiscussion(thread: Pick<DiscussionThread, "visibility" | "teamMemberIds" | "relatedTeamId">, userId?: string, profile?: Pick<UserProfile, "role"> | null) {
  return canModerateDiscussion(profile) || Boolean(userId && thread.visibility === "private_team" && (thread.teamMemberIds || []).includes(userId));
}
export function canReadProblemDiscussion(thread: Pick<DiscussionThread, "visibility" | "problemOwnerIds" | "assignedUserIds" | "authorId">, userId?: string, profile?: Pick<UserProfile, "role"> | null) {
  return canModerateDiscussion(profile) || Boolean(userId && thread.visibility === "private_problem" && (thread.authorId === userId || (thread.problemOwnerIds || []).includes(userId) || (thread.assignedUserIds || []).includes(userId)));
}
export function canReadDiscussionThread(thread: DiscussionThread, userId?: string, profile?: Pick<UserProfile, "profileComplete" | "role"> | null) {
  if (canModerateDiscussion(profile)) return true;
  if (thread.visibility === "public" && thread.status === "open") return true;
  if (thread.visibility === "members" && profile?.profileComplete && !["hidden", "under_review"].includes(thread.status)) return true;
  if (thread.visibility === "private_team") return canReadTeamDiscussion(thread, userId, profile) && !["hidden", "under_review"].includes(thread.status);
  if (thread.visibility === "private_problem") return canReadProblemDiscussion(thread, userId, profile) && !["hidden", "under_review"].includes(thread.status);
  return false;
}
export function canCommentOnThread(thread: DiscussionThread, userId?: string, profile?: Pick<UserProfile, "profileComplete" | "role"> | null) {
  return Boolean(userId && canCreateDiscussionThread(profile) && canReadDiscussionThread(thread, userId, profile) && (thread.status === "open" || canModerateDiscussion(profile)));
}

export async function createDiscussionThread(data: Omit<DiscussionThread, "id" | "slug" | "createdAt" | "updatedAt" | "lastActivityAt" | "commentCount" | "participantIds" | "pinned" | "moderationStatus" | "status"> & { status?: DiscussionThread["status"]; slug?: string; }) {
  const isPublic = data.visibility === "public";
  const status = data.status || (isPublic ? "under_review" : "open");
  if (data.visibility === "admin_only") throw new Error("Members cannot create admin-only discussions.");
  return createRecord<DiscussionThread>(COLLECTIONS.discussionThreads, { ...data, slug: data.slug || slugifyDiscussionTitle(data.title), status, moderationStatus: "clean", commentCount: 0, participantIds: [data.authorId], pinned: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), lastActivityAt: serverTimestamp() } as WithFieldValue<Omit<DiscussionThread, "id">>);
}
export async function updateDiscussionThread(id: string, patch: Partial<DiscussionThread>) { return updateRecord(COLLECTIONS.discussionThreads, id, patch as Record<string, unknown>); }
export const getDiscussionThreadById = cache(async (id: string) => getRecord<DiscussionThread>(COLLECTIONS.discussionThreads, id));
export const getDiscussionThreadBySlug = cache(async (slug: string) => (await listCollection<DiscussionThread>(COLLECTIONS.discussionThreads, [where("slug", "==", slug), limit(1)]))[0] || null);
export const listPublicDiscussionThreads = cache(async () => byCreatedAtDesc(await listCollection<DiscussionThread>(COLLECTIONS.discussionThreads, [where("visibility", "==", "public"), where("status", "==", "open"), limit(100)])));
export const listMemberDiscussionThreads = cache(async () => byCreatedAtDesc(await listCollection<DiscussionThread>(COLLECTIONS.discussionThreads, [where("visibility", "==", "members"), limit(100)])));
export const listThreadsByScope = cache(async (scopeType: DiscussionThread["scopeType"], scopeId: string) => byCreatedAtDesc(await listCollection<DiscussionThread>(COLLECTIONS.discussionThreads, [where("scopeType", "==", scopeType), where("scopeId", "==", scopeId), limit(50)])));
export const listMyDiscussionThreads = cache(async (userId: string) => byCreatedAtDesc(await listCollection<DiscussionThread>(COLLECTIONS.discussionThreads, [where("participantIds", "array-contains", userId), limit(100)])));
export const listModerationThreads = cache(async () => byCreatedAtDesc(await listCollection<DiscussionThread>(COLLECTIONS.discussionThreads, [limit(100)])));
export async function lockThread(id: string, actorId: string) { return updateDiscussionThread(id, { status: "locked", lockedBy: actorId, lockedAt: serverTimestamp() as never }); }
export async function archiveThread(id: string) { return updateDiscussionThread(id, { status: "archived" }); }
export async function hideThread(id: string, actorId: string) { return updateDiscussionThread(id, { status: "hidden", hiddenBy: actorId, hiddenAt: serverTimestamp() as never, moderationStatus: "action_taken" }); }
export async function pinThread(id: string, pinned = true) { return updateDiscussionThread(id, { pinned }); }
export async function createDiscussionComment(data: Omit<DiscussionThreadComment, "id" | "createdAt" | "updatedAt" | "status" | "moderationStatus" | "helpfulCount" | "reportCount">) { const created = await createRecord<DiscussionThreadComment>(COLLECTIONS.discussionComments, { ...data, status: "visible", moderationStatus: "clean", helpfulCount: 0, reportCount: 0, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<DiscussionThreadComment, "id">>); await updateRecord(COLLECTIONS.discussionThreads, data.threadId, { commentCount: increment(1), participantIds: arrayUnion(data.authorId), lastActivityAt: serverTimestamp() }); return created; }
export async function updateDiscussionComment(id: string, body: string) { return updateRecord(COLLECTIONS.discussionComments, id, { body, editedAt: serverTimestamp() }); }
export const listCommentsForThread = cache(async (threadId: string) => byCreatedAtDesc(await listCollection<DiscussionThreadComment>(COLLECTIONS.discussionComments, [where("threadId", "==", threadId), limit(200)])));
export async function hideComment(id: string) { return updateRecord(COLLECTIONS.discussionComments, id, { status: "hidden", moderationStatus: "action_taken" }); }
export async function deleteOwnComment(id: string) { return updateRecord(COLLECTIONS.discussionComments, id, { status: "deleted", body: "[deleted]" }); }
export async function countComments(threadId: string) { return (await getCountFromServer(queryFor(COLLECTIONS.discussionComments, [where("threadId", "==", threadId), where("status", "==", "visible")]))).data().count; }
export async function reportThread(threadId: string, reportedBy: string, reason: DiscussionReport["reason"], details?: string) { return createRecord<DiscussionReport>(COLLECTIONS.discussionReports, { targetType: "thread", targetId: threadId, threadId, reason, details, reportedBy, status: "open", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<DiscussionReport, "id">>); }
export async function reportComment(threadId: string, commentId: string, reportedBy: string, reason: DiscussionReport["reason"], details?: string) { return createRecord<DiscussionReport>(COLLECTIONS.discussionReports, { targetType: "comment", targetId: commentId, threadId, reason, details, reportedBy, status: "open", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<DiscussionReport, "id">>); }
export const listOpenDiscussionReports = cache(async () => byCreatedAtDesc(await listCollection<DiscussionReport>(COLLECTIONS.discussionReports, [where("status", "==", "open"), limit(100)])));
export async function reviewDiscussionReport(id: string, status: DiscussionReport["status"], reviewedBy: string) { return updateRecord(COLLECTIONS.discussionReports, id, { status, reviewedBy, reviewedAt: serverTimestamp() }); }
export async function createModerationAction(data: Omit<ModerationAction, "id" | "createdAt">) { return createRecord<ModerationAction>(COLLECTIONS.moderationActions, { ...data, createdAt: serverTimestamp() } as WithFieldValue<Omit<ModerationAction, "id">>); }
