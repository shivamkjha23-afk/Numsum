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
  FileLink,
  TimelineEvent,
  MsmeCase,
  Notification,
  Organization,
  PrivateCollaborationGroup,
  PlatformStatus,
  ProblemOnboardingSession,
  ProblemStatement,
  QuestionnaireResponse,
  QuestionnaireTemplate,
  ResearchPost,
  ResearchItem,
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
  linkedResources: "linked_resources",
  timelineEvents: "timeline_events",
  fileLinks: "file_links",
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
export async function createQuestionnaireTemplate(data: Omit<QuestionnaireTemplate, "id" | "createdAt" | "updatedAt">) {
  const sections = data.sections || [{ id: "default", title: data.title || data.name || "Questions", description: data.description || "", order: 1, questions: data.questions || [] }];
  return createRecord<QuestionnaireTemplate>(COLLECTIONS.questionnaireTemplates, { ...data, title: data.title || data.name || data.category, name: data.name || data.title || data.category, questions: data.questions || sections.flatMap((section) => section.questions), sections, status: data.status || "draft", visibility: "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<QuestionnaireTemplate, "id">>);
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
export async function updateResearchItemStatus(id: string, status: ResearchItem["status"], actorId = "") {
  const existing = await getRecord<ResearchItem>(COLLECTIONS.researchPosts, id);
  const patch: Partial<ResearchItem> = { status, reviewedBy: actorId, reviewedAt: serverTimestamp() as never };
  if (status === "approved") patch.approvedBy = actorId;
  if (status === "published") patch.publishedAt = serverTimestamp() as never;
  await updateResearchItem(id, patch, actorId);
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
export const getAdminKnowledgeAssets = cache(async () => listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [orderBy("createdAt", "desc"), limit(200)]));
export async function updateKnowledgeAssetStatus(id: string, status: KnowledgeAsset["status"], actorId = "") {
  const existing = await getRecord<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, id);
  const patch: Partial<KnowledgeAsset> = { status, reviewedBy: actorId, reviewedAt: serverTimestamp() as never };
  if (status === "approved") patch.approvedBy = actorId;
  if (status === "published") patch.publishedAt = serverTimestamp() as never;
  await updateKnowledgeAsset(id, patch, actorId);
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
  const created = await createRecord<ProblemOnboardingSession>(COLLECTIONS.problemOnboardingSessions, { ...data, status: data.status || "scheduled", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<ProblemOnboardingSession, "id">>);
  await linkCreatedResource(data.problemStatementId, { type: "onboarding_session", resourceType: "onboarding_session", collection: COLLECTIONS.problemOnboardingSessions, resourceId: created.id, title: data.sessionTitle || "Onboarding session", visibility: data.visibility || "admin_only", status: (data.status || "scheduled") as PlatformStatus }, actorId);
  await createProblemTimelineEvent(data.problemStatementId, data.status === "completed" ? "onboarding_completed" : "onboarding_started", data.sessionTitle || "Onboarding session created", actorId, { resourceId: created.id }, data.visibility || "admin_only");
  return created;
}
export async function updateProblemOnboardingSession(id: string, patch: Partial<ProblemOnboardingSession>) {
  await updateRecord(COLLECTIONS.problemOnboardingSessions, id, { ...patch, updatedAt: serverTimestamp() });
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
  const created = await createRecord<QuestionnaireResponse>(COLLECTIONS.questionnaireResponses, { ...data, responses, answers: data.answers || responses, status: data.status || "draft", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<QuestionnaireResponse, "id">>);
  await linkCreatedResource(data.problemStatementId, { type: "questionnaire_response", resourceType: "questionnaire_response", collection: COLLECTIONS.questionnaireResponses, resourceId: created.id, title: data.templateTitle || "Questionnaire response", visibility: data.visibility || "admin_only", status: (data.status || "draft") as PlatformStatus }, actorId);
  await createProblemTimelineEvent(data.problemStatementId, data.status === "completed" ? "questionnaire_completed" : "questionnaire_created", data.templateTitle || "Questionnaire response created", actorId, { resourceId: created.id }, data.visibility || "admin_only");
  if (data.sessionId) await updateProblemOnboardingSession(data.sessionId, { linkedQuestionnaireResponseIds: arrayUnion(created.id) as never });
  return created;
}
export async function updateQuestionnaireResponse(id: string, patch: Partial<QuestionnaireResponse>) {
  await updateRecord(COLLECTIONS.questionnaireResponses, id, { ...patch, answers: patch.answers || patch.responses, responses: patch.responses || patch.answers, updatedAt: serverTimestamp() });
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
export async function updateSOPStatus(id: string, status: SOPDocument["status"], actorId = "") { const existing = await getRecord<SOPDocument>(COLLECTIONS.sopDocuments, id); const patch: Partial<SOPDocument> = { status }; if (status === "approved") { patch.approvedBy = actorId; patch.approvedAt = serverTimestamp() as never; } if (status === "published") patch.publishedAt = serverTimestamp() as never; await updateSOPDocument(id, patch, actorId); if (existing?.problemStatementId && status === "approved") await createProblemTimelineEvent(existing.problemStatementId, "sop_approved", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only"); if (existing?.problemStatementId && status === "published") await createProblemTimelineEvent(existing.problemStatementId, "sop_published", existing.title, actorId, { resourceId: id }, existing.visibility || "public"); }
export async function updateSOPVisibility(id: string, visibility: SOPDocument["visibility"], actorId = "") { return updateSOPDocument(id, { visibility }, actorId); }
export async function archiveSOPDocument(id: string, actorId = "") { const existing = await getRecord<SOPDocument>(COLLECTIONS.sopDocuments, id); await updateSOPDocument(id, { status: "archived" }, actorId); if (existing?.problemStatementId) await createProblemTimelineEvent(existing.problemStatementId, "sop_archived", existing.title, actorId, { resourceId: id }, existing.visibility || "admin_only"); }
export async function createNewSOPVersion(id: string, actorId = "") { const existing = await getRecord<SOPDocument>(COLLECTIONS.sopDocuments, id); if (!existing) throw new Error("SOP not found"); return createSOPDocument({ ...existing, title: `${existing.title} v${(existing.version || 1) + 1}`, version: (existing.version || 1) + 1, status: "draft", visibility: "admin_only", createdBy: actorId || existing.createdBy, problemStatementId: existing.problemStatementId }); }

export async function createPilotTrack(data: Omit<PilotTrack, "id" | "createdAt" | "updatedAt">) {
  return createRecord<PilotTrack>(COLLECTIONS.pilotTracks, { ...data, status: data.status || "draft", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<PilotTrack, "id">>);
}
export async function createMeetingLog(data: Omit<MeetingLog, "id" | "createdAt" | "updatedAt">) {
  const created = await createRecord<MeetingLog>(COLLECTIONS.meetingLogs, { ...data, title: data.title || data.meetingTitle || "Meeting log", occurredAt: data.occurredAt || data.meetingDate, status: data.status || "completed", visibility: data.visibility || "admin_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<MeetingLog, "id">>);
  await linkCreatedResource(data.problemStatementId, { type: "meeting_log", resourceType: "meeting_log", collection: COLLECTIONS.meetingLogs, resourceId: created.id, title: data.meetingTitle || data.title || "Meeting log", visibility: data.visibility || "admin_only", status: data.status || "completed" }, data.createdBy || "");
  await createProblemTimelineEvent(data.problemStatementId, "meeting_logged", data.meetingTitle || data.title || "Meeting logged", data.createdBy || "", { resourceId: created.id }, data.visibility || "admin_only");
  return created;
}
export async function updateMeetingLog(id: string, patch: Partial<MeetingLog>) {
  await updateRecord(COLLECTIONS.meetingLogs, id, { ...patch, updatedAt: serverTimestamp() });
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
  const [totalProblems, submittedProblems, underReview, needsMoreInfo, onboarded, published, onboardingSessions, questionnaireResponses, meetingLogs, fileLinks, timelineEvents, knowledgeAssets, knowledgeUnderReview, knowledgePublished, sopDocuments, sopDraftReview, sopApprovedPublished, researchItems, researchUnderReview, researchPublished, technologyWatchItems, highPriorityWatchItems, caseStudies, linkedResearchItems, unlinkedResearchItems] = await Promise.all([
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
export const getAdminProblemStatements = getAllProblemStatements;
export async function updateProblemStatement(id: string, patch: Partial<ProblemStatement>, actorId?: string) {
  const before = await getProblemStatementById(id).catch(() => null);
  await updateRecord(COLLECTIONS.problemStatements, id, patch as Record<string, unknown>);
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


export async function updateUserRoleAndStatus(userId: string, reviewerId: string, patch: { role?: UserProfile["role"]; status?: string; organization?: string }) {
  await updateRecord(COLLECTIONS.users, userId, patch as Record<string, unknown>);
  await logAudit({ actorId: reviewerId, action: "user_governance_updated", collectionName: COLLECTIONS.users, documentId: userId, after: patch });
}

export async function createMsmeCase(data: Omit<MsmeCase, "id" | "createdAt" | "updatedAt">) {
  return createRecord<MsmeCase>(COLLECTIONS.msmeCases, { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<MsmeCase, "id">>);
}
