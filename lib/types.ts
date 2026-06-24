import type { Timestamp } from "firebase/firestore";

export type Role = "visitor" | "member" | "pending_admin" | "admin" | "super_admin";
export type ContentStatus = "draft" | "submitted" | "under_review" | "needs_information" | "member_only" | "public" | "researching" | "competition" | "solved" | "archived";
export type ProblemStatementStatus = ContentStatus;
export type Visibility = "public" | "member_only" | "private";
export type ReviewAction = "comment" | "request_information" | "assign_research" | "assign_reviewer" | "change_status" | "change_visibility" | "approve_publication" | "approve" | "reject" | "assign" | "publish" | "archive" | "convert_to_competition" | "request_clarification";
export type AdminApplicationStatus = "pending" | "approved" | "rejected";
export type NotificationType = "admin_application" | "problem_submission" | "problem_review" | "research_submission" | "role_request" | "career_application" | "competition_request" | "competition_submission" | "knowledge_submission" | "collaboration_request" | "community_report" | "comment" | "mention" | "competition_update" | "knowledge_update";
export type KnowledgeAssetType = "Research" | "Case Study" | "Framework" | "Template" | "Guide" | "Best Practice" | "Industry Report";
export type CompetitionSourceType = "problem_statement" | "research" | "general";
export type CompetitionStatus = "draft" | "active" | "evaluation" | "completed" | "archived";
export type KnowledgeSourceType = "problem_statement" | "research" | "competition" | "community" | "manual";
export type KnowledgeStatus = "draft" | "published" | "archived";
export type ProblemCategory = "Manufacturing" | "Reliability" | "Quality" | "Energy" | "Digital Transformation" | "Supply Chain" | "Product Development" | "Export" | "Finance" | "Other";
export type ChallengeStatus = ProblemStatementStatus;
export type ChallengeCategory = ProblemCategory;
export type DateLike = Timestamp | Date | string | number | null;
export type AdminInboxType = "problem_submission" | "research_submission" | "role_request" | "competition_request" | "career_application" | "knowledge_submission" | "community_report" | "collaboration_request";
export type AssociatedType = "problem_statement" | "research" | "competition" | "knowledge_asset";
export type DiscussionTargetType = AssociatedType | "general";
export type ResearchStatus = "draft" | "submitted" | "under_review" | "member_only" | "public" | "archived";

export interface FirestoreEntity { id: string; }
export interface TeamMember extends FirestoreEntity { name: string; institution?: string; degree?: string; discipline?: string; designation?: string; bio?: string; photoUrl?: string; linkedinUrl?: string; displayOrder?: number; createdAt?: DateLike; updatedAt?: DateLike; }
export interface UserProfile extends FirestoreEntity { uid?: string; displayName?: string; name?: string; email?: string; role?: Role; status?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface Organization extends FirestoreEntity { name: string; publicLabel?: string; industry?: string; description?: string; website?: string; city?: string; state?: string; country?: string; status?: string; createdBy?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface ProblemStatement extends FirestoreEntity { title: string; summary?: string; description?: string; problemDescription?: string; category?: ProblemCategory | string; questionnaireResponses?: Record<string, unknown>; attachments?: string[]; createdBy?: string; organizationType?: string; visibility?: Visibility; status?: ProblemStatementStatus; createdAt?: DateLike; updatedAt?: DateLike; organization?: string; organizationId?: string; publicOrganizationLabel?: string; problemStatement?: string; submittedBy?: string; assignedResearcher?: string; assignedReviewer?: string; questionnaire?: Record<string, unknown>; adminNotes?: string; }
export type Challenge = ProblemStatement;
export interface QuestionnaireQuestion { id: string; label: string; type: "text" | "textarea" | "number" | "dropdown" | "select" | "checkbox" | "radio" | "url"; required?: boolean; options?: string[]; placeholder?: string; }
export interface QuestionnaireTemplate extends FirestoreEntity { category: ProblemCategory | string; name?: string; questions: QuestionnaireQuestion[]; createdBy?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface ProblemReview extends FirestoreEntity { problemStatementId: string; action: ReviewAction; comment?: string; requestedInfo?: string; assignedTo?: string; statusFrom?: ProblemStatementStatus; statusTo?: ProblemStatementStatus; visibilityFrom?: Visibility; visibilityTo?: Visibility; createdBy: string; createdAt?: DateLike; }
export type ChallengeReview = ProblemReview & { challengeId?: string };
export interface ThreadReply { id: string; body: string; author: string; mentions?: string[]; attachments?: string[]; createdAt?: DateLike; }
export interface InternalThread extends FirestoreEntity { problemStatementId?: string; challengeId?: string; title: string; body?: string; replies?: ThreadReply[]; mentions?: string[]; attachments?: string[]; auditHistory?: string[]; createdBy: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface Notification extends FirestoreEntity { userId: string; type: NotificationType; title: string; message: string; read: boolean; problemStatementId?: string; createdAt?: DateLike; }
export interface AdminApplication extends FirestoreEntity { userId: string; name: string; email: string; experience?: string; motivation?: string; skills?: string[]; status: AdminApplicationStatus; createdAt?: DateLike; reviewedBy?: string; reviewedAt?: DateLike; }
export interface AdminInboxItem extends FirestoreEntity { type: AdminInboxType; title: string; description?: string; sourceCollection: string; sourceId: string; status?: "open" | "approved" | "rejected" | "assigned" | "published" | "archived" | "clarification_requested"; assignedTo?: string; createdBy?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface CommunityComment { id: string; content: string; createdBy: string; createdAt?: DateLike; updatedAt?: DateLike; replies?: CommunityComment[]; }
export interface CommunityPost extends FirestoreEntity { title: string; content: string; associatedType?: DiscussionTargetType; associatedId?: string; targetType?: DiscussionTargetType; targetId?: string; problemStatementId?: string; groupId?: string; visibility?: Visibility; tags?: string[]; author: string; createdBy?: string; createdAt?: DateLike; updatedAt?: DateLike; upvotes?: string[]; bookmarks?: string[]; comments?: CommunityComment[]; status?: string; }
export interface ResearchPost extends FirestoreEntity { title: string; abstract?: string; summary: string; researchLink?: string; documentLinks?: string[]; supportingFolderLink?: string; problemStatementId?: string; associatedProblemId?: string; author?: string; authors?: string[]; category?: string; tags?: string[]; documentLink?: string; externalReferences?: string[]; createdBy?: string; createdAt?: DateLike; updatedAt?: DateLike; upvotes?: string[]; bookmarks?: string[]; status?: ResearchStatus; visibility?: Visibility; }
export interface KnowledgeAsset extends FirestoreEntity { title: string; description: string; summary?: string; content?: string; references?: string[]; sourceType?: KnowledgeSourceType; sourceId?: string; type?: KnowledgeAssetType; category?: string; documentLink?: string; originSource?: string; linkedProblemStatementId?: string; sourceProblemId?: string; sourceResearchId?: string; sourceCompetitionId?: string; tags?: string[]; createdBy: string; createdAt?: DateLike; status?: ContentStatus; visibility?: Visibility; }
export interface CollaborationRequest extends FirestoreEntity { title: string; description: string; requiredSkills?: string[]; expectedContribution?: string; associatedType: AssociatedType; associatedId: string; sourceType?: AssociatedType; sourceId?: string; problemStatementId?: string; status?: ContentStatus; createdBy?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface PrivateCollaborationGroup extends FirestoreEntity { name: string; description?: string; associatedProblemId?: string; members?: string[]; admins?: string[]; createdBy?: string; visibility: "private"; createdAt?: DateLike; updatedAt?: DateLike; }
export interface Competition extends FirestoreEntity { title: string; description: string; theme?: string; sourceType?: CompetitionSourceType; sourceId?: string; sourceProblemId?: string; sourceResearchId?: string; visibility?: Visibility; winnerSubmissionId?: string; winningTeamId?: string; startDate?: DateLike; endDate?: DateLike; rules?: string; prizes?: string; status?: CompetitionStatus; registrations?: string[]; teams?: string[]; submissions?: string[]; evaluation?: Record<string, unknown>; leaderboard?: Array<{ team: string; score: number }>; createdBy?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface CompetitionTeam extends FirestoreEntity { competitionId: string; name: string; leader: string; members?: string[]; createdAt?: DateLike; updatedAt?: DateLike; }
export interface CompetitionSubmission extends FirestoreEntity { competitionId: string; teamId?: string; title: string; description: string; solutionLinks?: string[]; supportingLinks?: string[]; submittedBy: string; submittedAt?: DateLike; score?: number; rank?: number; reviewNotes?: string; winner?: boolean; evaluatedBy?: string; evaluatedAt?: DateLike; }
export interface CareerOpening extends FirestoreEntity { position: string; type: "Full Time" | "Part Time" | "Volunteer" | "Equity Based" | "Paid"; skills?: string[]; description?: string; closingDate?: DateLike; status?: ContentStatus; createdBy?: string; createdAt?: DateLike; }
export interface CareerApplication extends FirestoreEntity { openingId?: string; name: string; email: string; cvLink: string; sopLink?: string; expectedCompensation?: "Money" | "Equity" | "Hybrid"; createdAt?: DateLike; status?: ContentStatus; }
export interface AuditLog extends FirestoreEntity { actorId: string; action: string; collectionName: string; documentId: string; before?: unknown; after?: unknown; createdAt?: DateLike; }
export interface SystemStats extends FirestoreEntity { memberCount?: number; organizationCount?: number; problemStatementCount?: number; challengeCount?: number; researchCount?: number; competitionCount?: number; knowledgeCount?: number; communityCount?: number; lastUpdated?: DateLike; }
export type PlatformModuleKey = "core" | "organizations" | "competitions" | "knowledge_hub" | "msme_intelligence";
export interface InitializationStatus extends FirestoreEntity { initialized: boolean; version: number; modules: PlatformModuleKey[]; missingRecords: string[]; lastRunAt?: DateLike; updatedAt?: DateLike; }
export interface PlatformInitializationResult { initialized: boolean; version: number; changes: Array<{ collection: string; id: string; status: "created" | "patched" | "unchanged" }>; }
export interface SearchResult { id: string; type: string; title: string; description?: string; href: string; tags?: string[]; }
export interface OrganizationStats { organizations: number; problemStatements: number; challenges?: number; }
export interface LabelItem { id: string; label: string; sortOrder?: number; description?: string; }
export interface IndustrySector extends LabelItem { slug?: string; icon?: string; }
export interface CommunityStats { members: number; researchers: number; engineers: number; professionals: number; organizations: number; }
