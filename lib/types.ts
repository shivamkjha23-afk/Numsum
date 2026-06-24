import type { Timestamp } from "firebase/firestore";

export type Role = "visitor" | "member" | "admin" | "super_admin";
export type ChallengeStatus = "draft" | "submitted" | "under_review" | "researching" | "public" | "solved" | "archived";
export type Visibility = "public" | "private" | "admin";
export type ReviewAction = "comment" | "request_information" | "assign_research" | "assign_reviewer" | "change_status" | "approve_publication";
export type AdminApplicationStatus = "pending" | "approved" | "rejected";
export type NotificationType = "admin_application" | "challenge_submission" | "challenge_review" | "research_submission" | "comment" | "mention" | "competition_update";
export type KnowledgeAssetType = "Research" | "Case Study" | "Framework" | "Template" | "Guide" | "Best Practice" | "Industry Report";
export type CompetitionStatus = "draft" | "active" | "completed" | "archived";
export type ChallengeCategory = "Manufacturing" | "Reliability" | "Quality" | "Energy" | "Digital Transformation" | "Supply Chain" | "Product Development" | "Export" | "Finance" | "Other";
export type DateLike = Timestamp | Date | string | number | null;

export interface FirestoreEntity { id: string; }
export interface UserProfile extends FirestoreEntity { displayName?: string; name?: string; email?: string; role?: Role; status?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface Organization extends FirestoreEntity { name: string; industry?: string; description?: string; website?: string; city?: string; state?: string; country?: string; status?: string; createdBy?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface Challenge extends FirestoreEntity { title: string; description?: string; category?: ChallengeCategory | string; organization?: string; organizationId?: string; problemStatement?: string; attachments?: string[]; createdBy?: string; submittedBy?: string; assignedResearcher?: string; assignedReviewer?: string; status?: ChallengeStatus; visibility?: Visibility; createdAt?: DateLike; updatedAt?: DateLike; questionnaire?: Record<string, unknown>; }
export interface QuestionnaireQuestion { id: string; label: string; type: "text" | "textarea" | "number" | "select" | "url" | "date" | "checkbox"; required?: boolean; options?: string[]; placeholder?: string; }
export interface QuestionnaireTemplate extends FirestoreEntity { category: ChallengeCategory | string; questions: QuestionnaireQuestion[]; createdBy?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface ChallengeReview extends FirestoreEntity { challengeId: string; action: ReviewAction; comment?: string; requestedInfo?: string; assignedTo?: string; statusFrom?: ChallengeStatus; statusTo?: ChallengeStatus; createdBy: string; createdAt?: DateLike; }
export interface InternalThread extends FirestoreEntity { challengeId?: string; title: string; body?: string; replies?: ThreadReply[]; mentions?: string[]; attachments?: string[]; auditHistory?: string[]; createdBy: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface ThreadReply { id: string; body: string; author: string; mentions?: string[]; attachments?: string[]; createdAt?: DateLike; }
export interface Notification extends FirestoreEntity { userId: string; type: NotificationType; title: string; message: string; read: boolean; createdAt?: DateLike; }
export interface AdminApplication extends FirestoreEntity { userId: string; name: string; email: string; experience: string; motivation: string; skills: string[]; status: AdminApplicationStatus; createdAt?: DateLike; reviewedBy?: string; reviewedAt?: DateLike; }
export interface CommunityPost extends FirestoreEntity { title: string; content: string; tags?: string[]; author: string; createdAt?: DateLike; updatedAt?: DateLike; upvotes?: string[]; bookmarks?: string[]; status?: string; }
export interface ResearchPost extends FirestoreEntity { title: string; summary: string; authors: string[]; category?: string; tags?: string[]; documentLink: string; externalReferences?: string[]; createdBy: string; createdAt?: DateLike; referencedChallenges?: string[]; referencedOrganizations?: string[]; upvotes?: string[]; bookmarks?: string[]; status?: string; }
export interface KnowledgeAsset extends FirestoreEntity { title: string; description: string; type?: KnowledgeAssetType; category?: string; documentLink: string; tags?: string[]; createdBy: string; createdAt?: DateLike; status?: string; }
export interface Competition extends FirestoreEntity { title: string; description: string; theme?: string; startDate?: DateLike; endDate?: DateLike; rules?: string; prizes?: string; status?: CompetitionStatus; registrations?: string[]; leaderboard?: Array<{ team: string; score: number }>; createdBy?: string; createdAt?: DateLike; }
export interface AuditLog extends FirestoreEntity { actorId: string; action: string; collectionName: string; documentId: string; before?: unknown; after?: unknown; createdAt?: DateLike; }
export interface SystemStats extends FirestoreEntity { memberCount?: number; organizationCount?: number; challengeCount?: number; researchCount?: number; competitionCount?: number; knowledgeCount?: number; communityCount?: number; lastUpdated?: DateLike; }
export interface SearchResult { id: string; type: string; title: string; description?: string; href: string; tags?: string[]; }
export interface OrganizationStats { organizations: number; challenges: number; }
export interface LabelItem { id: string; label: string; sortOrder?: number; description?: string; }
export interface IndustrySector extends LabelItem { slug?: string; icon?: string; }
export interface CommunityStats { members: number; researchers: number; engineers: number; professionals: number; organizations: number; }
