import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getCountFromServer, increment, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where, type DocumentData, type QueryConstraint, type WithFieldValue } from "firebase/firestore";
import type { User as FirebaseUser } from "firebase/auth";
import { cache } from "react";
import { db } from "@/lib/firebase";
import type { AdminApplication, AdminInboxItem, AuditLog, CareerApplication, CareerOpening, ChallengeReview, CollaborationRequest, CommunityPost, Competition, InternalThread, KnowledgeAsset, Notification, Organization, ProblemStatement, QuestionnaireTemplate, ResearchPost, SearchResult, SystemStats, TeamMember, UserProfile } from "@/lib/types";

export const COLLECTIONS = {
  users: "users", organizations: "organizations", problemStatements: "problem_statements", questionnaireTemplates: "questionnaire_templates", problemReviews: "problem_reviews", internalThreads: "internal_threads", communityPosts: "community_posts", researchPosts: "research_posts", knowledgeAssets: "knowledge_assets", competitions: "competitions", collaborationRequests: "collaboration_requests", careerOpenings: "career_openings", careerApplications: "career_applications", notifications: "notifications", adminApplications: "admin_applications", adminInbox: "admin_inbox", bootstrapAdmins: "bootstrap_admins", teamMembers: "team_members", systemStats: "system_stats", auditLogs: "audit_logs",
  challenges: "problem_statements", challengeReviews: "problem_reviews",
} as const;
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

function withId<T>(snapshot: { id: string; data: () => DocumentData }): T { return { id: snapshot.id, ...snapshot.data() } as T; }
function ref(name: CollectionName) { return collection(db, name); }
function queryFor(name: CollectionName, constraints: QueryConstraint[] = []) { return constraints.length ? query(ref(name), ...constraints) : ref(name); }
export const listCollection = cache(async <T>(name: CollectionName, constraints: QueryConstraint[] = []) => (await getDocs(queryFor(name, constraints))).docs.map((item) => withId<T>(item)));
export async function getRecord<T>(name: CollectionName, id: string) { const snap = await getDoc(doc(db, name, id)); return snap.exists() ? withId<T>(snap) : null; }
export async function createRecord<T extends object>(name: CollectionName, data: WithFieldValue<Omit<T, "id">>) { return addDoc(ref(name), data); }
export async function updateRecord(name: CollectionName, id: string, data: Record<string, unknown>) { return updateDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() }); }
export async function upsertRecord(name: CollectionName, id: string, data: Record<string, unknown>) { return setDoc(doc(db, name, id), data, { merge: true }); }
export async function deleteRecord(name: CollectionName, id: string) { return deleteDoc(doc(db, name, id)); }

export async function logAudit(data: Omit<AuditLog, "id" | "createdAt">) { return createRecord<AuditLog>(COLLECTIONS.auditLogs, { ...data, createdAt: serverTimestamp() } as WithFieldValue<Omit<AuditLog, "id">>); }
export async function bumpStats(field: keyof Omit<SystemStats, "id" | "lastUpdated">, by = 1) { return upsertRecord(COLLECTIONS.systemStats, "platform", { [field]: increment(by), lastUpdated: serverTimestamp() }); }
export async function routeToAdminInbox(data: Omit<AdminInboxItem, "id" | "createdAt" | "updatedAt" | "status">) { return createRecord<AdminInboxItem>(COLLECTIONS.adminInbox, { ...data, status: "open", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<AdminInboxItem, "id">>); }
export async function createNotification(data: Omit<Notification, "id" | "createdAt" | "read">) { return createRecord<Notification>(COLLECTIONS.notifications, { ...data, read: false, createdAt: serverTimestamp() } as WithFieldValue<Omit<Notification, "id">>); }

const BOOTSTRAP_ADMIN_EMAIL = "subhshivam22@gmail.com";
const BOOTSTRAP_ADMIN_NAME = "Roopveer Jha";
export function normalizeEmail(email?: string | null) { return email?.trim().toLowerCase() || ""; }
export async function ensureBootstrapAdminRegistry() { return upsertRecord(COLLECTIONS.bootstrapAdmins, BOOTSTRAP_ADMIN_EMAIL, { email: BOOTSTRAP_ADMIN_EMAIL, name: BOOTSTRAP_ADMIN_NAME, role: "admin", active: true, updatedAt: serverTimestamp() }); }
export async function isBootstrapAdminEmail(email?: string | null) {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  if (normalized === BOOTSTRAP_ADMIN_EMAIL) await ensureBootstrapAdminRegistry();
  const admin = await getRecord<{ active?: boolean; role?: string }>(COLLECTIONS.bootstrapAdmins, normalized);
  return Boolean(admin?.active !== false && admin?.role === "admin");
}
export async function ensureUserProfile(user: FirebaseUser): Promise<UserProfile> {
  const existing = await getRecord<UserProfile>(COLLECTIONS.users, user.uid);
  const isBootstrapAdmin = await isBootstrapAdminEmail(user.email);
  const base = { email: user.email || "", displayName: user.displayName || (isBootstrapAdmin ? BOOTSTRAP_ADMIN_NAME : user.email || "Member"), name: user.displayName || (isBootstrapAdmin ? BOOTSTRAP_ADMIN_NAME : user.email || "Member"), updatedAt: serverTimestamp() };
  if (!existing) {
    const profile = { ...base, role: isBootstrapAdmin ? "admin" : "member", status: "active", createdAt: serverTimestamp() };
    await upsertRecord(COLLECTIONS.users, user.uid, profile);
    return { id: user.uid, ...profile } as UserProfile;
  }
  const patch: Record<string, unknown> = { ...base };
  if (isBootstrapAdmin && existing.role !== "admin" && existing.role !== "super_admin") patch.role = "admin";
  await upsertRecord(COLLECTIONS.users, user.uid, patch);
  return { ...existing, email: base.email, displayName: base.displayName, name: base.name, role: (patch.role as UserProfile["role"]) || existing.role } as UserProfile;
}

export async function notifyAdmins(type: Notification["type"], title: string, message: string, problemStatementId?: string) { return createNotification({ userId: "admins", type, title, message, problemStatementId }); }

function publicConstraints(publicOnly = true) { return publicOnly ? [where("visibility", "==", "public")] : []; }
export const getProblemStatements = cache(async (maxItems = 12, publicOnly = true): Promise<ProblemStatement[]> => listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [...publicConstraints(publicOnly), orderBy("createdAt", "desc"), limit(maxItems)]).catch(() => listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [orderBy("createdAt", "desc"), limit(maxItems)])));
export const getChallenges = getProblemStatements;
export const getAllProblemStatements = cache(async (maxItems = 100): Promise<ProblemStatement[]> => listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [orderBy("createdAt", "desc"), limit(maxItems)]));
export const getAllChallenges = getAllProblemStatements;
export const getSubmittedProblemStatements = cache(async () => listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [where("status", "in", ["submitted", "under_review", "needs_information"]), limit(100)]));
export const getSubmittedChallenges = getSubmittedProblemStatements;
export const getProblemStatementsByOrganization = cache(async (organizationId: string, admin = false) => listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [where("organizationId", "==", organizationId), ...(admin ? [] : [where("visibility", "==", "public")]), limit(100)]));
export const getChallengesByOrganization = getProblemStatementsByOrganization;
export const getOrganizations = cache(async (maxItems = 50): Promise<Organization[]> => listCollection<Organization>(COLLECTIONS.organizations, [orderBy("name", "asc"), limit(maxItems)]));
export const getTeamMembers = cache(async (): Promise<TeamMember[]> => listCollection<TeamMember>(COLLECTIONS.teamMembers, [orderBy("displayOrder", "asc"), limit(100)]).catch(() => listCollection<TeamMember>(COLLECTIONS.teamMembers, [limit(100)])));
export const getUsers = cache(async (maxItems = 100): Promise<UserProfile[]> => listCollection<UserProfile>(COLLECTIONS.users, [limit(maxItems)]));
export const getPlatformStats = cache(async (): Promise<SystemStats | null> => getRecord<SystemStats>(COLLECTIONS.systemStats, "platform"));
export async function getOrCreatePlatformStats(): Promise<SystemStats> {
  const existing = await getPlatformStats();
  if (existing) return existing;
  const [members, organizations, problems, research, competitions, knowledge] = await Promise.all([
    getCountFromServer(ref(COLLECTIONS.users)),
    getCountFromServer(ref(COLLECTIONS.organizations)),
    getCountFromServer(ref(COLLECTIONS.problemStatements)),
    getCountFromServer(ref(COLLECTIONS.researchPosts)),
    getCountFromServer(ref(COLLECTIONS.competitions)),
    getCountFromServer(ref(COLLECTIONS.knowledgeAssets)),
  ]);
  const stats = { memberCount: members.data().count, organizationCount: organizations.data().count, problemStatementCount: problems.data().count, challengeCount: problems.data().count, researchCount: research.data().count, competitionCount: competitions.data().count, knowledgeCount: knowledge.data().count, lastUpdated: serverTimestamp() };
  await upsertRecord(COLLECTIONS.systemStats, "platform", stats);
  return { id: "platform", ...stats, lastUpdated: null } as SystemStats;
}
export const getQuestionnaireTemplates = cache(async () => listCollection<QuestionnaireTemplate>(COLLECTIONS.questionnaireTemplates, [orderBy("category", "asc")]));
export async function getQuestionnaireByType(category: string) { const rows = await listCollection<QuestionnaireTemplate>(COLLECTIONS.questionnaireTemplates, [where("category", "==", category), limit(1)]); return rows[0] || null; }
export const getAdminApplications = cache(async () => listCollection<AdminApplication>(COLLECTIONS.adminApplications, [orderBy("createdAt", "desc"), limit(100)]));
export const getAdminInbox = cache(async () => listCollection<AdminInboxItem>(COLLECTIONS.adminInbox, [orderBy("createdAt", "desc"), limit(100)]));
export const getNotificationsForUser = cache(async (userId: string) => listCollection<Notification>(COLLECTIONS.notifications, [where("userId", "in", [userId, "admins"]), orderBy("createdAt", "desc"), limit(50)]).catch(() => listCollection<Notification>(COLLECTIONS.notifications, [where("userId", "==", userId), orderBy("createdAt", "desc"), limit(50)])));
export const getResearchPosts = cache(async () => listCollection<ResearchPost>(COLLECTIONS.researchPosts, [where("visibility", "==", "public"), orderBy("createdAt", "desc"), limit(100)]).catch(() => listCollection<ResearchPost>(COLLECTIONS.researchPosts, [orderBy("createdAt", "desc"), limit(100)])));
export const getKnowledgeAssets = cache(async () => listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [where("visibility", "==", "public"), orderBy("createdAt", "desc"), limit(100)]).catch(() => listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [orderBy("createdAt", "desc"), limit(100)])));
export const getCommunityPosts = cache(async () => listCollection<CommunityPost>(COLLECTIONS.communityPosts, [where("visibility", "==", "public"), orderBy("createdAt", "desc"), limit(100)]).catch(() => listCollection<CommunityPost>(COLLECTIONS.communityPosts, [orderBy("createdAt", "desc"), limit(100)])));
export const getCompetitions = cache(async () => listCollection<Competition>(COLLECTIONS.competitions, [orderBy("createdAt", "desc"), limit(100)]));
export const getInternalThreads = cache(async () => listCollection<InternalThread>(COLLECTIONS.internalThreads, [orderBy("createdAt", "desc"), limit(100)]));
export const getCareerOpenings = cache(async () => listCollection<CareerOpening>(COLLECTIONS.careerOpenings, [where("visibility", "==", "public"), orderBy("createdAt", "desc"), limit(100)]).catch(() => listCollection<CareerOpening>(COLLECTIONS.careerOpenings, [orderBy("createdAt", "desc"), limit(100)])));

export async function createProblemStatement(data: Omit<ProblemStatement, "id" | "createdAt" | "updatedAt" | "status" | "visibility">) {
  if (!data.title?.trim()) throw new Error("Problem statement title is required.");
  const createdBy = data.createdBy || data.submittedBy || "";
  const payload = { ...data, summary: data.summary || data.description || "", problemDescription: data.problemDescription || data.problemStatement || data.description || "", questionnaireResponses: data.questionnaireResponses || data.questionnaire || {}, attachments: data.attachments || [], createdBy, submittedBy: data.submittedBy || createdBy, status: "submitted", visibility: "member_only", createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  const created = await createRecord<ProblemStatement>(COLLECTIONS.problemStatements, payload as WithFieldValue<Omit<ProblemStatement, "id">>);
  await bumpStats("problemStatementCount");
  await routeToAdminInbox({ type: "problem_submission", title: data.title, description: payload.summary, sourceCollection: COLLECTIONS.problemStatements, sourceId: created.id, createdBy });
  await logAudit({ actorId: createdBy || "system", action: "problem_submitted", collectionName: COLLECTIONS.problemStatements, documentId: created.id, after: { status: "submitted", visibility: "member_only" } });
  if (createdBy) await createNotification({ userId: createdBy, type: "problem_submission", title: "Problem statement submitted", message: data.title, problemStatementId: created.id });
  await notifyAdmins("problem_submission", "New Problem Statement", data.title, created.id);
  return created;
}
export const createChallengeFromProblem = createProblemStatement;
export async function createResearchPost(data: Omit<ResearchPost, "id" | "createdAt" | "status" | "visibility">) { const created = await createRecord<ResearchPost>(COLLECTIONS.researchPosts, { ...data, status: "submitted", visibility: "private", createdAt: serverTimestamp() } as WithFieldValue<Omit<ResearchPost, "id">>); await routeToAdminInbox({ type: "research_submission", title: data.title, description: data.summary, sourceCollection: COLLECTIONS.researchPosts, sourceId: created.id, createdBy: data.createdBy || data.author }); await notifyAdmins("research_submission", "New Research", data.title); return created; }
export async function createCollaborationRequest(data: Omit<CollaborationRequest, "id" | "createdAt" | "updatedAt" | "status">) { const created = await createRecord<CollaborationRequest>(COLLECTIONS.collaborationRequests, { ...data, status: "submitted", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<CollaborationRequest, "id">>); await routeToAdminInbox({ type: "collaboration_request", title: data.title, description: data.description, sourceCollection: COLLECTIONS.collaborationRequests, sourceId: created.id, createdBy: data.createdBy }); await notifyAdmins("collaboration_request", "New Collaboration Request", data.title); return created; }
export async function createCareerApplication(data: Omit<CareerApplication, "id" | "createdAt" | "status">) { const created = await createRecord<CareerApplication>(COLLECTIONS.careerApplications, { ...data, status: "submitted", createdAt: serverTimestamp() } as WithFieldValue<Omit<CareerApplication, "id">>); await routeToAdminInbox({ type: "career_application", title: data.name, description: data.email, sourceCollection: COLLECTIONS.careerApplications, sourceId: created.id, createdBy: data.email }); await notifyAdmins("career_application", "New Career Application", data.name); return created; }
export async function createAdminApplication(data: Omit<AdminApplication, "id" | "createdAt" | "status">) { const created = await createRecord<AdminApplication>(COLLECTIONS.adminApplications, { ...data, status: "pending", createdAt: serverTimestamp() } as WithFieldValue<Omit<AdminApplication, "id">>); await upsertRecord(COLLECTIONS.users, data.userId, { role: "pending_admin", email: data.email, name: data.name, updatedAt: serverTimestamp() }); await routeToAdminInbox({ type: "role_request", title: `Admin application: ${data.name}`, description: data.email, sourceCollection: COLLECTIONS.adminApplications, sourceId: created.id, createdBy: data.userId }); await notifyAdmins("role_request", "New Admin Applicant", data.name); return created; }
export async function reviewAdminApplication(application: AdminApplication, reviewerId: string, status: "approved" | "rejected") { await updateRecord(COLLECTIONS.adminApplications, application.id, { status, reviewedBy: reviewerId, reviewedAt: serverTimestamp() }); await updateRecord(COLLECTIONS.users, application.userId, { role: status === "approved" ? "admin" : "member" }); return logAudit({ actorId: reviewerId, action: `admin_application_${status}`, collectionName: COLLECTIONS.adminApplications, documentId: application.id }); }
export async function addChallengeReview(data: Omit<ChallengeReview, "id" | "createdAt">) {
  const problemStatementId = data.problemStatementId || data.challengeId || "";
  const before = await getRecord<ProblemStatement>(COLLECTIONS.problemStatements, problemStatementId);
  const review = await createRecord<ChallengeReview>(COLLECTIONS.problemReviews, { ...data, problemStatementId, createdAt: serverTimestamp() } as WithFieldValue<Omit<ChallengeReview, "id">>);
  const patch: Record<string, unknown> = {};
  if (data.statusTo) patch.status = data.statusTo;
  if (data.visibilityTo) patch.visibility = data.visibilityTo;
  if (data.assignedTo) patch.assignedReviewer = data.assignedTo;
  if (data.comment || data.requestedInfo) patch.adminNotes = data.comment || data.requestedInfo;
  if (Object.keys(patch).length) await updateRecord(COLLECTIONS.problemStatements, problemStatementId, patch);
  await logAudit({ actorId: data.createdBy, action: data.action, collectionName: COLLECTIONS.problemStatements, documentId: problemStatementId, before: before ? { status: before.status, visibility: before.visibility, assignedReviewer: before.assignedReviewer } : null, after: patch });
  const creator = before?.createdBy || before?.submittedBy;
  if (creator && (data.statusTo || data.visibilityTo || data.requestedInfo)) await createNotification({ userId: creator, type: "problem_review", title: "Problem statement updated", message: data.requestedInfo || `Status: ${data.statusTo || before?.status}`, problemStatementId });
  if (data.assignedTo) await createNotification({ userId: data.assignedTo, type: "problem_review", title: "Problem statement assigned", message: before?.title || problemStatementId, problemStatementId });
  return review;
}
export async function convertProblemToCompetition(problem: ProblemStatement, createdBy: string) { const created = await createRecord<Competition>(COLLECTIONS.competitions, { title: problem.title, description: problem.description || problem.problemStatement || "", sourceProblemId: problem.id, status: "draft", createdBy, createdAt: serverTimestamp() } as WithFieldValue<Omit<Competition, "id">>); await routeToAdminInbox({ type: "competition_request", title: problem.title, description: "Converted from problem statement", sourceCollection: COLLECTIONS.competitions, sourceId: created.id, createdBy }); return created; }
export async function globalSearch(term: string): Promise<SearchResult[]> { const needle = term.toLowerCase(); const [problems, orgs, research, knowledge, community, competitions] = await Promise.all([getProblemStatements(50), getOrganizations(50), getResearchPosts(), getKnowledgeAssets(), getCommunityPosts(), getCompetitions()]); return [ ...problems.map((x) => ({ id: x.id, type: "Problem Statement", title: x.title, description: x.description, href: `/problem-statements/${x.id}`, tags: [x.category || ""] })), ...orgs.map((x) => ({ id: x.id, type: "Organization", title: x.name, description: x.description, href: `/organizations/${x.id}`, tags: [x.industry || ""] })), ...research.map((x) => ({ id: x.id, type: "Research", title: x.title, description: x.summary, href: "/research", tags: x.tags })), ...knowledge.map((x) => ({ id: x.id, type: "Knowledge", title: x.title, description: x.description, href: "/knowledge", tags: x.tags })), ...community.map((x) => ({ id: x.id, type: "Community", title: x.title, description: x.content, href: "/community", tags: x.tags })), ...competitions.map((x) => ({ id: x.id, type: "Competition", title: x.title, description: x.description, href: "/competitions", tags: [x.theme || ""] })) ].filter((x) => [x.title, x.description, ...(x.tags || [])].join(" ").toLowerCase().includes(needle)); }

export const getProblemStatementById = cache(async (id: string) => getRecord<ProblemStatement>(COLLECTIONS.problemStatements, id));
export const getProblemStatementsByCreator = cache(async (userId: string) => listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [where("createdBy", "==", userId), limit(100)]).catch(() => listCollection<ProblemStatement>(COLLECTIONS.problemStatements, [where("submittedBy", "==", userId), limit(100)])));
export const getProblemReviews = cache(async (problemStatementId: string) => listCollection<ChallengeReview>(COLLECTIONS.problemReviews, [where("problemStatementId", "==", problemStatementId), limit(100)]));
export const getResearchByProblem = cache(async (problemStatementId: string) => listCollection<ResearchPost>(COLLECTIONS.researchPosts, [where("associatedProblemId", "==", problemStatementId), limit(50)]));
export const getCommunityByProblem = cache(async (problemStatementId: string) => listCollection<CommunityPost>(COLLECTIONS.communityPosts, [where("problemStatementId", "==", problemStatementId), limit(50)]));
export const getCompetitionsByProblem = cache(async (problemStatementId: string) => listCollection<Competition>(COLLECTIONS.competitions, [where("sourceProblemId", "==", problemStatementId), limit(50)]));
export const getKnowledgeByProblem = cache(async (problemStatementId: string) => listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [where("linkedProblemStatementId", "==", problemStatementId), limit(50)]));
