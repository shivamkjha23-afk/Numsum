import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
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
  AdminInboxComment,
  AdminInboxItem,
  AssociatedType,
  AuditLog,
  CareerApplication,
  CareerOpening,
  ChallengeReview,
  CollaborationRequest,
  Bookmark,
  CommunityComment,
  CommunityPost,
  DiscussionTargetType,
  Competition,
  CompetitionSubmission,
  CompetitionTeam,
  ConstitutionDocument,
  ObjectiveTargetDocument,
  DiscussionComment,
  DiscussionPost,
  InternalThread,
  KnowledgeAsset,
  LinkedResource,
  MsmeCase,
  Notification,
  Organization,
  PrivateCollaborationGroup,
  ProblemOnboardingSession,
  ProblemStatement,
  QuestionnaireResponse,
  QuestionnaireTemplate,
  ResearchPost,
  SOPDocument,
  SuccessStory,
  TestimonialRating,
  PilotTrack,
  MeetingLog,
  SearchResult,
  SystemStats,
  TeamMember,
  UserProfile,
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
  researchPosts: "research_posts",
  knowledgeAssets: "knowledge_assets",
  sopDocuments: "sop_documents",
  pilotTracks: "pilot_tracks",
  meetingLogs: "meeting_logs",
  successStories: "success_stories",
  testimonialRatings: "testimonial_ratings",
  constitutionDocuments: "constitution_documents",
  objectiveTargetDocuments: "objective_target_documents",
  competitions: "competitions",
  collaborationRequests: "collaboration_requests",
  careerOpenings: "career_openings",
  careerApplications: "career_applications",
  notifications: "notifications",
  adminApplications: "admin_applications",
  adminInbox: "admin_inbox",
  bootstrapAdmins: "bootstrap_admins",
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
  replies: "replies",
  communityAnalytics: "community_analytics",
  competitionTeams: "competition_teams",
  competitionSubmissions: "competition_submissions",
  challenges: "problem_statements",
  challengeReviews: "problem_reviews",
} as const;
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

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
export async function ensureUserProfile(
  user: FirebaseUser,
): Promise<UserProfile> {
  console.info("[AUTH] Ensuring user profile", {
    uid: user.uid,
    email: user.email,
  });
  const existing = await getRecord<UserProfile>(COLLECTIONS.users, user.uid);
  const isBootstrapAdmin = await isBootstrapAdminEmail(user.email);
  console.info("[ADMIN] Bootstrap admin check", {
    uid: user.uid,
    email: normalizeEmail(user.email),
    bootstrapMatch: isBootstrapAdmin,
  });
  const base = {
    email: user.email || "",
    displayName:
      user.displayName ||
      (isBootstrapAdmin ? BOOTSTRAP_ADMIN_NAME : user.email || "Member"),
    name:
      user.displayName ||
      (isBootstrapAdmin ? BOOTSTRAP_ADMIN_NAME : user.email || "Member"),
    updatedAt: serverTimestamp(),
  };
  if (!existing) {
    const profile = {
      uid: user.uid,
      ...base,
      role: isBootstrapAdmin ? "admin" : "member",
      status: "active",
      profileComplete: false,
      createdAt: serverTimestamp(),
    };
    console.info("[PROFILE] Creating user profile", {
      uid: user.uid,
      email: base.email,
      role: profile.role,
    });
    await upsertRecord(COLLECTIONS.users, user.uid, profile);
    await bumpStats("memberCount");
    return { id: user.uid, ...profile } as UserProfile;
  }
  const patch: Record<string, unknown> = { uid: user.uid, ...base };
  if (!existing.createdAt) patch.createdAt = serverTimestamp();
  if (!existing.status) patch.status = "active";
  if (!existing.role) patch.role = "member";
  if (existing.profileComplete === undefined) patch.profileComplete = isProfileComplete(existing);
  if (
    isBootstrapAdmin &&
    existing.role !== "admin" &&
    existing.role !== "super_admin"
  )
    patch.role = "admin";
  console.info("[PROFILE] Updating user profile", {
    uid: user.uid,
    role: patch.role || existing.role,
  });
  await upsertRecord(COLLECTIONS.users, user.uid, patch);
  return {
    ...existing,
    uid: user.uid,
    email: base.email,
    displayName: base.displayName,
    name: base.name,
    status: (patch.status as string) || existing.status || "active",
    role: (patch.role as UserProfile["role"]) || existing.role || "member",
  } as UserProfile;
}


export const organizationProfileTypes = [
  "msme_owner",
  "msme_representative",
  "industrialist",
  "academic_institution_representative",
  "government_incubator_association",
] as const;
export const academicProfileTypes = ["researcher", "student"] as const;
export const professionalProfileTypes = ["engineer_professional", "consultant"] as const;
export const startupProfileTypes = ["startup_founder", "technology_provider"] as const;

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

export async function updateUserProfile(userId: string, patch: Partial<UserProfile>) {
  const existing = await getRecord<UserProfile>(COLLECTIONS.users, userId);
  const profileComplete = isProfileComplete({ ...existing, ...patch, id: userId });
  const payload: Record<string, unknown> = {
    ...patch,
    profileComplete,
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

function publicConstraints(publicOnly = true) {
  return publicOnly ? [where("visibility", "==", "public"), where("status", "==", "published")] : [];
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
    return publicOnly ? byCreatedAtDesc(rows) : rows;
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
  return publicOnly ? byCreatedAtDesc(rows) : rows;
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
    status: "submitted",
    visibility: "private",
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
    after: { status: "submitted", visibility: "private", problemStatementId },
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
  return created;
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
  data: Omit<
    Competition,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "status"
    | "visibility"
    | "registrations"
    | "teams"
    | "submissions"
  >,
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
    status: "draft",
    visibility: "private",
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
    createdBy: data.submittedBy,
  });
  await notifyAdmins(
    "competition_submission",
    "Submission received",
    data.title,
  );
  await createNotification({
    userId: data.submittedBy,
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
  await updateRecord(COLLECTIONS.competitionSubmissions, submission.id, {
    score,
    rank,
    reviewNotes,
    winner,
    evaluatedBy: reviewerId,
    evaluatedAt: serverTimestamp(),
  });
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
export async function createKnowledgeAsset(
  data: Omit<
    KnowledgeAsset,
    "id" | "createdAt" | "updatedAt" | "status" | "visibility" | "description"
  > & { description?: string },
) {
  const created = await createRecord<KnowledgeAsset>(
    COLLECTIONS.knowledgeAssets,
    {
      ...data,
      description: data.description || data.summary || "",
      references: data.references || [],
      status: "draft",
      visibility: "private",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    } as WithFieldValue<Omit<KnowledgeAsset, "id">>,
  );
  await bumpStats("knowledgeCount");
  await routeToAdminInbox({
    type: "knowledge_submission",
    title: data.title,
    description: data.summary || data.description,
    sourceCollection: COLLECTIONS.knowledgeAssets,
    sourceId: created.id,
    createdBy: data.createdBy,
  });
  return created;
}
export async function publishKnowledgeAsset(
  asset: KnowledgeAsset,
  reviewerId: string,
) {
  await updateRecord(COLLECTIONS.knowledgeAssets, asset.id, {
    status: "published",
    visibility: "public",
  });
  await logAudit({
    actorId: reviewerId,
    action: "knowledge_published",
    collectionName: COLLECTIONS.knowledgeAssets,
    documentId: asset.id,
    before: { status: asset.status, visibility: asset.visibility },
    after: { status: "published", visibility: "public" },
  });
  await notifyAdmins(
    "knowledge_update",
    "Knowledge asset published",
    asset.title,
  );
}
export async function createKnowledgeFromWinningSolution(
  competition: Competition,
  submission: CompetitionSubmission,
  reviewerId: string,
) {
  return createKnowledgeAsset({
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

export async function createProblemOnboardingSession(data: Omit<ProblemOnboardingSession, "id" | "createdAt" | "updatedAt">) {
  return createRecord<ProblemOnboardingSession>(COLLECTIONS.problemOnboardingSessions, { ...data, status: data.status || "draft", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<ProblemOnboardingSession, "id">>);
}
export async function createQuestionnaireResponse(data: Omit<QuestionnaireResponse, "id" | "createdAt" | "updatedAt">) {
  return createRecord<QuestionnaireResponse>(COLLECTIONS.questionnaireResponses, { ...data, status: data.status || "submitted", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<QuestionnaireResponse, "id">>);
}
export async function createSOPDocument(data: Omit<SOPDocument, "id" | "createdAt" | "updatedAt">) {
  return createRecord<SOPDocument>(COLLECTIONS.sopDocuments, { ...data, status: data.status || "draft", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<SOPDocument, "id">>);
}
export async function createPilotTrack(data: Omit<PilotTrack, "id" | "createdAt" | "updatedAt">) {
  return createRecord<PilotTrack>(COLLECTIONS.pilotTracks, { ...data, status: data.status || "draft", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<PilotTrack, "id">>);
}
export async function createMeetingLog(data: Omit<MeetingLog, "id" | "createdAt" | "updatedAt">) {
  return createRecord<MeetingLog>(COLLECTIONS.meetingLogs, { ...data, status: data.status || "completed", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<MeetingLog, "id">>);
}
export async function createSuccessStory(data: Omit<SuccessStory, "id" | "createdAt" | "updatedAt">) {
  return createRecord<SuccessStory>(COLLECTIONS.successStories, { ...data, status: data.status || "under_review", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<SuccessStory, "id">>);
}
export async function createTestimonialRating(data: Omit<TestimonialRating, "id" | "createdAt" | "updatedAt">) {
  return createRecord<TestimonialRating>(COLLECTIONS.testimonialRatings, { ...data, status: data.status || "under_review", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<TestimonialRating, "id">>);
}
export const getLinkedProblemResources = cache(async (problemStatementId: string) => {
  const [onboardingSessions, questionnaireResponses, researchItems, knowledgeAssets, sopDocuments, pilotTracks, meetingLogs, competitions, discussions, successStories, testimonialRatings] = await Promise.all([
    listCollection<ProblemOnboardingSession>(COLLECTIONS.problemOnboardingSessions, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    listCollection<QuestionnaireResponse>(COLLECTIONS.questionnaireResponses, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    getResearchByProblem(problemStatementId).catch(() => []),
    getKnowledgeByProblem(problemStatementId).catch(() => []),
    listCollection<SOPDocument>(COLLECTIONS.sopDocuments, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    listCollection<PilotTrack>(COLLECTIONS.pilotTracks, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    listCollection<MeetingLog>(COLLECTIONS.meetingLogs, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    getCompetitionsByProblem(problemStatementId).catch(() => []),
    getCommunityByProblem(problemStatementId).catch(() => []),
    listCollection<SuccessStory>(COLLECTIONS.successStories, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
    listCollection<TestimonialRating>(COLLECTIONS.testimonialRatings, [where("problemStatementId", "==", problemStatementId), limit(50)]).catch(() => []),
  ]);
  return { onboardingSessions, questionnaireResponses, researchItems, knowledgeAssets, sopDocuments, pilotTracks, meetingLogs, competitions, discussions: discussions as DiscussionPost[], successStories, testimonialRatings };
});
export async function upsertConstitutionDocument(id: string, data: Omit<ConstitutionDocument, "id">) { return upsertRecord(COLLECTIONS.constitutionDocuments, id, { ...data, updatedAt: serverTimestamp() }); }
export async function upsertObjectiveTargetDocument(id: string, data: Omit<ObjectiveTargetDocument, "id">) { return upsertRecord(COLLECTIONS.objectiveTargetDocuments, id, { ...data, updatedAt: serverTimestamp() }); }

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
export const getAdminProblemStatements = getAllProblemStatements;
export async function updateProblemStatement(id: string, patch: Partial<ProblemStatement>, actorId?: string) {
  await updateRecord(COLLECTIONS.problemStatements, id, patch as Record<string, unknown>);
  if (actorId) await logAudit({ actorId, action: "problem_updated", collectionName: COLLECTIONS.problemStatements, documentId: id, after: patch });
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
    pilot_track: "pilotTrackIds",
    meeting_log: "meetingLogIds",
    competition: "competitionIds",
    community: "discussionPostIds",
  };
  return fields[type];
}
export async function addLinkedResourceToProblem(problem: ProblemStatement, resource: LinkedResource, actorId: string) {
  const field = resourceIdField(resource.type);
  const linkedResources = [...(problem.linkedResources || []), { ...resource, linkedAt: new Date().toISOString(), linkedBy: actorId }];
  const patch: Partial<ProblemStatement> = { linkedResources };
  if (field) patch[field] = Array.from(new Set([...(problem[field] as string[] | undefined || []), resource.resourceId])) as never;
  return updateProblemStatement(problem.id, patch, actorId);
}
export async function removeLinkedResourceFromProblem(problem: ProblemStatement, resource: LinkedResource, actorId: string) {
  const field = resourceIdField(resource.type);
  const linkedResources = (problem.linkedResources || []).filter((item) => !(item.type === resource.type && item.resourceId === resource.resourceId));
  const patch: Partial<ProblemStatement> = { linkedResources };
  if (field) patch[field] = ((problem[field] as string[] | undefined) || []).filter((id) => id !== resource.resourceId) as never;
  return updateProblemStatement(problem.id, patch, actorId);
}

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
    where("linkedProblemStatementId", "==", problemStatementId),
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


export async function updateUserRoleAndStatus(userId: string, reviewerId: string, patch: { role?: UserProfile["role"]; status?: string; organization?: string }) {
  await updateRecord(COLLECTIONS.users, userId, patch as Record<string, unknown>);
  await logAudit({ actorId: reviewerId, action: "user_governance_updated", collectionName: COLLECTIONS.users, documentId: userId, after: patch });
}

export async function createMsmeCase(data: Omit<MsmeCase, "id" | "createdAt" | "updatedAt">) {
  return createRecord<MsmeCase>(COLLECTIONS.msmeCases, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<MsmeCase, "id">>);
}
