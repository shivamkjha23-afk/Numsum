import type { Timestamp } from "firebase/firestore";

export type Role = "visitor" | "member" | "reviewer" | "moderator" | "organization" | "pending_admin" | "admin" | "super_admin";
export type PlatformStatus = "draft" | "submitted" | "under_review" | "needs_information" | "needs_more_info" | "onboarded" | "structured" | "active" | "completed" | "published" | "archived" | "rejected" | "member_only" | "public" | "researching" | "competition" | "solved" | "scheduled" | "in_progress" | "cancelled" | "needs_follow_up";
export type ContentStatus = PlatformStatus;
export type ProblemStatementStatus = ContentStatus;
export type Visibility = "admin_only" | "submitter_only" | "team_only" | "member_only" | "public" | "private";
export type ReviewAction = "comment" | "request_information" | "assign_research" | "assign_reviewer" | "change_status" | "change_visibility" | "approve_publication" | "approve" | "reject" | "assign" | "publish" | "archive" | "convert_to_competition" | "request_clarification";
export type AdminApplicationStatus = "pending" | "approved" | "rejected";
export type NotificationType = "admin_application" | "problem_submission" | "problem_review" | "research_submission" | "role_request" | "career_application" | "competition_request" | "competition_submission" | "knowledge_submission" | "collaboration_request" | "collaboration_acceptance" | "community_report" | "comment" | "reply" | "mention" | "bookmark" | "discussion_assignment" | "moderation_action" | "competition_update" | "knowledge_update";
export type KnowledgeAssetType = "Research" | "Case Study" | "Framework" | "Template" | "Guide" | "Best Practice" | "Industry Report";
export type CompetitionSourceType = "problem_statement" | "research" | "community_discussion" | "direct_admin" | "general";
export type CompetitionStatus = "draft" | "published" | "open" | "active" | "closed" | "evaluating" | "completed" | "archived";
export type KnowledgeSourceType = "problem_statement" | "research" | "competition" | "community" | "manual";
export type KnowledgeStatus = "draft" | "under_review" | "approved" | "published" | "archived" | "rejected";
export type KnowledgeAssetCategory = "case_study" | "framework" | "methodology" | "checklist" | "best_practice" | "lesson_learned" | "report" | "guide" | "template" | "benchmark" | "standard_reference" | "startup_success_story" | "msme_success_story" | "other";
export type KnowledgeAssetSourceType = "internal" | "external" | "user_contributed" | "admin_created" | "field_learning" | "research_derived" | "case_based";
export type SOPStatus = "draft" | "review" | "approved" | "published" | "archived";
export type ProblemCategory = "Manufacturing" | "Reliability" | "Quality" | "Energy" | "Digital Transformation" | "Supply Chain" | "Product Development" | "Export" | "Finance" | "Other";
export type ChallengeStatus = ProblemStatementStatus;
export type ChallengeCategory = ProblemCategory;
export type DateLike = Timestamp | Date | string | number | null;
export type AdminInboxType = "problem_submission" | "research_submission" | "role_request" | "competition_request" | "career_application" | "knowledge_submission" | "community_report" | "collaboration_request";
export type AssociatedType = "problem_statement" | "research" | "competition" | "knowledge_asset" | "sop_document" | "pilot_track" | "meeting_log" | "questionnaire_response" | "constitution_document" | "objective_target_document" | "organization" | "msme_case" | "team" | "community";
export type DiscussionTargetType = AssociatedType | "general";
export type DiscussionType = "general" | "problem" | "research" | "competition" | "knowledge" | "organization" | "msme" | "team";
export type ResearchStatus = "draft" | "submitted" | "under_review" | "approved" | "member_only" | "public" | "published" | "archived" | "rejected";
export type ResearchType = "research_paper" | "patent" | "startup_case_study" | "msme_success_story" | "technology_trend" | "government_scheme" | "industrial_benchmark" | "market_report" | "standard" | "regulatory_update" | "product_innovation" | "process_innovation" | "academic_project" | "other";
export type ResearchDifficulty = "low" | "medium" | "high" | "unknown";
export type ResearchCostImplication = "low_cost" | "moderate" | "high_cost" | "unknown";
export type ResearchMaturityLevel = "concept" | "lab_validated" | "pilot_tested" | "commercially_available" | "widely_adopted" | "unknown";
export type ResearchEvidenceStrength = "weak" | "moderate" | "strong" | "unknown";
export type ResearchRecommendedAction = "monitor" | "discuss" | "convert_to_knowledge" | "convert_to_sop" | "evaluate_for_pilot" | "link_to_problem" | "archive";
export type WatchPriority = "low" | "medium" | "high" | "strategic";
export type LinkedResourceType = "onboarding_session" | "questionnaire_response" | "meeting_log" | "knowledge_asset" | "sop_document" | "research_item" | "pilot_track" | "file_link" | "competition" | "discussion" | "timeline_event" | "file" | "external_link" | "research" | "community";
export type DocumentVersionStatus = "draft" | "under_review" | "published" | "archived";
export type UserProfileType =| "msme_owner"| "msme_representative"| "industrialist" | "researcher" | "student" | "engineer_professional"| "consultant" | "startup_founder"| "academic_institution" | "academic_institution_representative" | "technology_provider"| "government_incubator_association"| "investor" | "other";

export interface FirestoreEntity { id: string; }
export interface TeamMember extends FirestoreEntity { name: string; institution?: string; degree?: string; discipline?: string; designation?: string; bio?: string; photoUrl?: string; linkedinUrl?: string; displayOrder?: number; createdAt?: DateLike; updatedAt?: DateLike; }
export interface UserProfile extends FirestoreEntity {
  uid?: string;
  displayName?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: Role;
  status?: string;
  profileComplete?: boolean;
  profileCompletedAt?: DateLike;
  profileType?: UserProfileType;
  city?: string;
  state?: string;
  country?: string;
  shortBio?: string;
  professionalSummary?: string;
  organizationId?: string;
  organizationIds?: string[];
  organizationName?: string;
  organizationType?: string;
  industrySegment?: string;
  manufacturingOrServiceFocus?: string;
  productsOrServices?: string;
  companySize?: string;
  website?: string;
  gstOrUdyam?: string;
  majorChallenges?: string;
  institutionName?: string;
  departmentOrDiscipline?: string;
  researchInterests?: string;
  currentRole?: string;
  portfolioOrLinkedIn?: string;
  domainExpertise?: string;
  yearsOfExperience?: string;
  industriesWorkedWith?: string;
  startupOrCompanyName?: string;
  solutionArea?: string;
  targetIndustries?: string;
  productStage?: string;
  skills?: string[];
  memberModuleEnabled?: boolean;
  onboardingCompletedAt?: DateLike;
  createdAt?: DateLike;
  updatedAt?: DateLike;
}
export interface OrganizationProfile extends FirestoreEntity { name: string; publicLabel?: string; industry?: string; description?: string; website?: string; logo?: string; verificationStatus?: "unverified" | "pending" | "verified" | "rejected"; city?: string; state?: string; country?: string; status?: string; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; }
export interface Organization extends OrganizationProfile {}
export interface LinkedResource { id?: string; problemStatementId?: string; resourceType?: LinkedResourceType; type: LinkedResourceType; collection?: string; resourceId: string; title?: string; description?: string; visibility?: Visibility; status?: PlatformStatus; url?: string; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; linkedAt?: DateLike; linkedBy?: string; }
export type TimelineEventType = "problem_submitted" | "problem_reviewed" | "status_changed" | "visibility_changed" | "onboarding_started" | "onboarding_completed" | "questionnaire_created" | "questionnaire_completed" | "meeting_logged" | "knowledge_added" | "knowledge_updated" | "knowledge_approved" | "knowledge_published" | "knowledge_archived" | "sop_added" | "sop_updated" | "sop_approved" | "sop_published" | "sop_archived" | "research_added" | "research_updated" | "research_linked" | "research_approved" | "research_published" | "research_archived" | "research_converted_to_knowledge" | "pilot_created" | "pilot_updated" | "pilot_status_changed" | "pilot_started" | "pilot_milestone_added" | "pilot_milestone_completed" | "pilot_update_added" | "pilot_metric_added" | "pilot_completed" | "pilot_published" | "success_story_created" | "file_added" | "competition_linked" | "problem_published" | "problem_archived";
export interface TimelineEvent extends FirestoreEntity { problemStatementId: string; eventType: TimelineEventType; title: string; description?: string; actorUserId?: string; actorName?: string; visibility?: Visibility; metadata?: Record<string, unknown>; createdAt?: DateLike; }
export interface FileLink extends FirestoreEntity { problemStatementId: string; title: string; description?: string; url: string; fileType?: string; visibility?: Visibility; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; }
export interface ProblemStatement extends FirestoreEntity {
  title: string;
  summary?: string;
  description?: string;
  shortDescription?: string;
  detailedDescription?: string;
  problemDescription?: string;
  problemStatement?: string;
  category?: ProblemCategory | string;
  subCategory?: string;
  affectedProcess?: string;
  problemFrequency?: string;
  urgency?: "low" | "medium" | "high" | "critical" | string;
  estimatedImpact?: string;
  currentWorkaround?: string;
  expectedOutcome?: string;
  availableData?: string;
  questionnaireResponses?: Record<string, unknown>;
  questionnaire?: Record<string, unknown>;
  attachments?: string[];
  attachmentsOrDriveLinks?: string[];
  tags?: string[];
  contactConsent?: boolean;
  createdBy?: string;
  submittedBy?: string;
  submittedByUserId?: string;
  submittedByName?: string;
  submittedByEmail?: string;
  submittedByProfileType?: string;
  submitterId?: string;
  organizationType?: string;
  organization?: string;
  organizationId?: string;
  organizationName?: string;
  industrySegment?: string;
  manufacturingOrServiceFocus?: string;
  locationCity?: string;
  locationState?: string;
  locationCountry?: string;
  publicOrganizationLabel?: string;
  visibility?: Visibility;
  status?: ProblemStatementStatus;
  adminReviewStatus?: ProblemStatementStatus;
  priority?: string;
  assignedAdminId?: string;
  assignedResearcher?: string;
  assignedReviewer?: string;
  adminNotes?: string;
  submitterVisibleNotes?: string;
  onboardingRequired?: boolean;
  onboardingSessionIds?: string[];
  questionnaireResponseIds?: string[];
  sopIds?: string[];
  knowledgeAssetIds?: string[];
  researchItemIds?: string[];
  pilotTrackIds?: string[];
  meetingLogIds?: string[];
  competitionIds?: string[];
  discussionPostIds?: string[];
  ownerIds?: string[];
  teamIds?: string[];
  structuredChallengeId?: string;
  convertedCompetitionId?: string;
  linkedResources?: LinkedResource[];
  publishedAt?: DateLike;
  reviewedAt?: DateLike;
  reviewedBy?: string;
  createdAt?: DateLike;
  updatedAt?: DateLike;
}
export type Challenge = ProblemStatement;
export type QuestionnaireQuestionType = "text" | "textarea" | "number" | "select" | "multiselect" | "checkbox" | "radio" | "date" | "file_link" | "rating" | "dropdown" | "url" | "email";
export interface QuestionnaireQuestion { id: string; label: string; helpText?: string; type: QuestionnaireQuestionType; required?: boolean; options?: string[]; order?: number; placeholder?: string; }
export interface QuestionnaireSection { id: string; title: string; description?: string; order: number; questions: QuestionnaireQuestion[]; }
export interface QuestionnaireTemplate extends FirestoreEntity { title?: string; description?: string; purpose?: string; category: ProblemCategory | string; industrySegment?: string; createdBy?: string; isDefault?: boolean; status?: "draft" | "active" | "archived"; visibility?: "admin_only"; sections?: QuestionnaireSection[]; name?: string; questions: QuestionnaireQuestion[]; createdAt?: DateLike; updatedAt?: DateLike; }
export interface ProblemReview extends FirestoreEntity { problemStatementId: string; action: ReviewAction; comment?: string; requestedInfo?: string; assignedTo?: string; statusFrom?: ProblemStatementStatus; statusTo?: ProblemStatementStatus; visibilityFrom?: Visibility; visibilityTo?: Visibility; createdBy: string; createdAt?: DateLike; }
export type ChallengeReview = ProblemReview & { challengeId?: string };
export interface ThreadReply { id: string; body: string; author: string; mentions?: string[]; attachments?: string[]; createdAt?: DateLike; }
export interface InternalThread extends FirestoreEntity { problemStatementId?: string; challengeId?: string; title: string; body?: string; replies?: ThreadReply[]; mentions?: string[]; attachments?: string[]; auditHistory?: string[]; createdBy: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface Notification extends FirestoreEntity { userId: string; type: NotificationType; title: string; message: string; read: boolean; problemStatementId?: string; createdAt?: DateLike; }
export interface AdminApplication extends FirestoreEntity { userId: string; name: string; email: string; requestedRole?: Role; experience?: string; motivation?: string; skills?: string[]; status: AdminApplicationStatus; createdAt?: DateLike; reviewedBy?: string; reviewedAt?: DateLike; }
export interface AdminInboxComment { id: string; body: string; authorId: string; authorName?: string; createdAt?: DateLike; }
export interface AdminInboxItem extends FirestoreEntity { type: AdminInboxType; title: string; description?: string; sourceCollection: string; sourceId: string; status?: "pending" | "assigned" | "under_review" | "resolved" | "archived" | "open" | "approved" | "rejected" | "published" | "clarification_requested"; assignedTo?: string; comments?: AdminInboxComment[]; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; }
export interface CommunityAttachment { type: "pdf" | "image" | "github" | "google_drive" | "doi" | "researchgate" | "website" | "video"; label: string; url: string; }
export interface CommunityComment { id: string; content: string; createdBy: string; createdAt?: DateLike; updatedAt?: DateLike; replies?: CommunityComment[]; likes?: string[]; bookmarks?: string[]; mentions?: string[]; reportedBy?: string[]; deleted?: boolean; }
export interface CommunityPost extends FirestoreEntity { title: string; content: string; type?: DiscussionType; linkedEntityType?: DiscussionTargetType; linkedEntityId?: string; associatedType?: DiscussionTargetType; associatedId?: string; targetType?: DiscussionTargetType; targetId?: string; problemStatementId?: string; groupId?: string; visibility?: Visibility; tags?: string[]; author: string; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; upvotes?: string[]; bookmarks?: string[]; comments?: CommunityComment[]; status?: string; views?: number; attachments?: CommunityAttachment[]; mentions?: string[]; organization?: string; reportedBy?: string[]; }
export interface ResearchPost extends FirestoreEntity { title: string; abstract?: string; summary: string; researchType?: ResearchType; sourceName?: string; sourceLink?: string; publicationYear?: number; publicationDate?: DateLike; researchGate?: string; github?: string; pdf?: string; seekCollaboration?: boolean; researchLink?: string; documentLinks?: string[]; supportingFolderLink?: string; problemStatementId?: string; associatedProblemId?: string; generalResearch?: boolean; isGeneralResearch?: boolean; author?: string; authors?: string[]; organizationOrInstitution?: string; country?: string; industrySegment?: string; problemCategory?: string; technologyArea?: string; category?: string; keywords?: string[]; keyFindings?: string; practicalRelevance?: string; relevanceToMSME?: string; relevanceToProblem?: string; possibleApplications?: string[]; implementationDifficulty?: ResearchDifficulty; costImplication?: ResearchCostImplication; maturityLevel?: ResearchMaturityLevel; evidenceStrength?: ResearchEvidenceStrength; recommendedAction?: ResearchRecommendedAction; driveLink?: string; attachmentLinks?: string[]; tags?: string[]; watchPriority?: WatchPriority; nextReviewDate?: DateLike; reviewedInMeetingId?: string; companyName?: string; initialChallenge?: string; interventionOrInnovation?: string; growthJourney?: string; measurableImpact?: string; lessonsForIndianMSMEs?: string; documentLink?: string; externalReferences?: string[]; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; upvotes?: string[]; bookmarks?: string[]; status?: ResearchStatus; visibility?: Visibility; }
export interface KnowledgeAsset extends FirestoreEntity { problemStatementId: string; title: string; shortDescription?: string; detailedContent?: string; description?: string; summary?: string; content?: string; category?: KnowledgeAssetCategory | string; sourceType?: KnowledgeAssetSourceType | KnowledgeSourceType | string; sourceName?: string; sourceLink?: string; driveLink?: string; attachmentLinks?: string[]; tags?: string[]; industrySegment?: string; problemCategory?: string; relevanceToProblem?: string; keyTakeaways?: string[]; status?: KnowledgeStatus; visibility?: Visibility; submittedBy?: string; createdBy: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; references?: string[]; sourceId?: string; type?: KnowledgeAssetType; documentLink?: string; originSource?: string; linkedProblemStatementId?: string; sourceProblemId?: string; sourceResearchId?: string; sourceCompetitionId?: string; }
export interface CollaborationRequest extends FirestoreEntity { title: string; description: string; requiredSkills?: string[]; expertiseRequired?: string[]; duration?: string; organization?: string; visibility?: Visibility; adminReviewRequired?: boolean; expectedContribution?: string; associatedType: AssociatedType; associatedId: string; sourceType?: AssociatedType; sourceId?: string; problemStatementId?: string; status?: ContentStatus; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; }
export interface PrivateCollaborationGroup extends FirestoreEntity { name: string; description?: string; associatedType?: AssociatedType; associatedId?: string; associatedProblemId?: string; members?: string[]; owner?: string; admins?: string[]; messages?: Array<{ id: string; body: string; createdBy: string; createdAt?: DateLike }>; documents?: CommunityAttachment[]; activityLog?: string[]; permissions?: Record<string, string[]>; createdBy?: string; visibility: "private"; createdAt?: DateLike; updatedAt?: DateLike; }
export interface Competition extends FirestoreEntity { title: string; description: string; eligibility?: string; deadline?: DateLike; submissionFormId?: string; judges?: string[]; rewards?: string; theme?: string; sourceType?: CompetitionSourceType; sourceId?: string; sourceProblemId?: string; sourceResearchId?: string; submissionTemplate?: string; evaluationCriteria?: string; visibility?: Visibility; winnerSubmissionId?: string; winningTeamId?: string; startDate?: DateLike; endDate?: DateLike; rules?: string; prize?: string; prizes?: string; status?: CompetitionStatus; registrations?: string[]; teams?: string[]; submissions?: string[]; evaluation?: Record<string, unknown>; leaderboard?: Array<{ team: string; score: number }>; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; }
export interface CompetitionTeam extends FirestoreEntity { competitionId: string; name: string; leader: string; members?: string[]; emails?: string[]; institute?: string; organization?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface CompetitionSubmission extends FirestoreEntity { competitionId: string; teamId?: string; submissionType?: "individual" | "team"; proposal?: string; documents?: string[]; links?: string[]; presentation?: string; title: string; proposalTitle?: string; description: string; driveLink?: string; githubLink?: string; documentLink?: string; solutionLinks?: string[]; supportingLinks?: string[]; submittedBy: string; submittedAt?: DateLike; score?: number; rank?: number; reviewNotes?: string; winner?: boolean; evaluatedBy?: string; evaluatedAt?: DateLike; }
export interface ProblemOnboardingSession extends FirestoreEntity { problemStatementId: string; sessionTitle?: string; sessionDate?: DateLike; sessionMode?: "phone" | "video_call" | "in_person" | "email" | "other"; attendees?: string[]; adminOwnerId?: string; status?: "scheduled" | "in_progress" | "completed" | "cancelled" | "needs_follow_up" | PlatformStatus; agenda?: string; discussionSummary?: string; internalNotes?: string; submitterVisibleNotes?: string; nextSteps?: string; linkedQuestionnaireResponseIds?: string[]; scheduledAt?: DateLike; recordedAt?: DateLike; facilitatorId?: string; participantIds?: string[]; notes?: string; meetingUrl?: string; recordingUrl?: string; questionnaireResponseId?: string; visibility?: Visibility; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; completedAt?: DateLike; }
export interface QuestionnaireResponse extends FirestoreEntity { problemStatementId: string; templateId?: string; templateTitle?: string; sessionId?: string; submittedByAdminId?: string; respondentId?: string; answers?: Record<string, unknown>; responses: Record<string, unknown>; status?: "draft" | "completed" | PlatformStatus; visibility?: Visibility; internalNotes?: string; submitterVisibleSummary?: string; publicSummary?: string; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; completedAt?: DateLike; }
export interface SOPStep { stepNumber: number; title: string; description?: string; responsibleRole?: string; toolsRequired?: string[]; safetyNotes?: string; qualityCheckpoints?: string[]; }
export interface SOPDocument extends FirestoreEntity { problemStatementId: string; title: string; objective?: string; scope?: string; applicability?: string; processArea?: string; industrySegment?: string; version?: number; sopNumber?: string; steps?: SOPStep[]; inputRequirements?: string[]; outputDeliverables?: string[]; acceptanceCriteria?: string[]; safetyConsiderations?: string; qualityChecks?: string[]; requiredTools?: string[]; relatedStandards?: string[]; driveLink?: string; attachmentLinks?: string[]; tags?: string[]; status?: SOPStatus; visibility?: Visibility; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; approvedAt?: DateLike; publishedAt?: DateLike; summary?: string; content?: string; documentLink?: string; }
export interface ResearchItem extends ResearchPost {}
export type PilotInterventionType = "process_improvement" | "quality_improvement" | "maintenance_reliability" | "energy_efficiency" | "digital_transformation" | "automation" | "inspection_system" | "training" | "product_development" | "market_export_readiness" | "compliance_safety" | "other";
export type PilotStatus = "idea" | "proposed" | "approved" | "planned" | "active" | "paused" | "completed" | "cancelled" | "failed" | "scaled";
export type PilotPriority = "low" | "medium" | "high" | "strategic";
export type PilotRiskLevel = "low" | "medium" | "high" | "unknown";
export type PilotDifficulty = "low" | "medium" | "high" | "unknown";
export type PilotMilestoneStatus = "pending" | "in_progress" | "completed" | "delayed" | "cancelled";
export type PilotImprovementDirection = "increase_is_good" | "decrease_is_good" | "target_range";
export interface PilotTrack extends FirestoreEntity { problemStatementId: string; title: string; pilotCode?: string; pilotObjective?: string; problemSummary?: string; proposedSolution?: string; interventionType?: PilotInterventionType; pilotLocation?: string; partnerOrganization?: string; partnerContactName?: string; partnerContactEmail?: string; partnerContactPhone?: string; industrySegment?: string; processArea?: string; pilotOwnerAdminId?: string; teamMemberIds?: string[]; startDate?: DateLike; expectedEndDate?: DateLike; actualEndDate?: DateLike; status?: PilotStatus; visibility?: Visibility; priority?: PilotPriority; riskLevel?: PilotRiskLevel; implementationDifficulty?: PilotDifficulty; estimatedCost?: string | number; estimatedSavings?: string | number; expectedImpact?: string; successMetrics?: string; baselineValues?: string; targetValues?: string; currentValues?: string; finalResults?: string; evidenceLinks?: string[]; driveLink?: string; attachmentLinks?: string[]; lessonsLearned?: string; nextSteps?: string; adminInternalNotes?: string; submitterVisibleSummary?: string; publicSummary?: string; createdBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; approvedAt?: DateLike; completedAt?: DateLike; publishedAt?: DateLike; summary?: string; ownerIds?: string[]; }
export interface PilotMilestone extends FirestoreEntity { pilotTrackId: string; problemStatementId: string; title: string; description?: string; targetDate?: DateLike; completedDate?: DateLike; status?: PilotMilestoneStatus; ownerId?: string; evidenceLinks?: string[]; notes?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface PilotUpdate extends FirestoreEntity { pilotTrackId: string; problemStatementId: string; updateDate?: DateLike; title: string; summary?: string; progressPercent?: number; currentMetrics?: string; blockers?: string; decisions?: string; actionItems?: string[]; evidenceLinks?: string[]; visibility?: Visibility; createdBy?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface PilotMetric extends FirestoreEntity { pilotTrackId: string; problemStatementId: string; metricName: string; metricUnit?: string; baselineValue?: string | number; targetValue?: string | number; currentValue?: string | number; finalValue?: string | number; measurementMethod?: string; improvementDirection?: PilotImprovementDirection; evidenceLink?: string; createdAt?: DateLike; updatedAt?: DateLike; }
export interface MeetingLog extends FirestoreEntity { id: string; problemStatementId: string; onboardingSessionId?: string; meetingTitle?: string; meetingDate?: DateLike; mode?: "phone" | "video_call" | "in_person" | "email" | "other" | string; attendees?: string[]; summary?: string; decisions?: string; actionItems?: string[]; internalNotes?: string; title?: string; occurredAt?: DateLike; participantIds?: string[]; notes?: string; files?: string[]; status?: PlatformStatus; visibility?: Visibility; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; }
export interface DiscussionPost extends CommunityPost {}
export interface DiscussionComment extends CommunityComment { postId?: string; parentCommentId?: string; }
export interface SuccessStory extends FirestoreEntity { problemStatementId?: string; pilotTrackId?: string; title: string; organizationName?: string; industrySegment?: string; challengeSummary?: string; interventionSummary?: string; measurableImpact?: string; testimonial?: string; rating?: number; publicSummary?: string; visibility?: Visibility; status?: "draft" | "under_review" | "published" | "archived" | PlatformStatus; createdBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; publishedAt?: DateLike; summary?: string; organizationId?: string; outcomeMetrics?: Record<string, unknown>; reviewedBy?: string; reviewedAt?: DateLike; }
export interface TestimonialRating extends FirestoreEntity { title?: string; body?: string; rating?: number; problemStatementId?: string; organizationId?: string; authorId?: string; status?: PlatformStatus; visibility?: Visibility; createdAt?: DateLike; updatedAt?: DateLike; }
export interface VersionedDocumentVersion { version: number; body?: string; fileUrl?: string; amendedBy?: string; amendedAt?: DateLike; status?: DocumentVersionStatus; changeSummary?: string; }
export interface ConstitutionDocument extends FirestoreEntity { title: string; currentVersion?: number; versions?: VersionedDocumentVersion[]; status?: PlatformStatus; visibility?: Visibility; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; }
export interface ObjectiveTargetDocument extends FirestoreEntity { title: string; objectivePeriod?: string; targets?: Array<{ label: string; metric?: string; targetValue?: string; status?: PlatformStatus }>; currentVersion?: number; versions?: VersionedDocumentVersion[]; status?: PlatformStatus; visibility?: Visibility; submittedBy?: string; createdBy?: string; reviewedBy?: string; approvedBy?: string; createdAt?: DateLike; updatedAt?: DateLike; reviewedAt?: DateLike; publishedAt?: DateLike; }
export interface CareerOpening extends FirestoreEntity { position: string; type: "Full Time" | "Part Time" | "Volunteer" | "Equity Based" | "Paid"; skills?: string[]; description?: string; closingDate?: DateLike; status?: ContentStatus; createdBy?: string; createdAt?: DateLike; }
export interface CareerApplication extends FirestoreEntity { openingId?: string; name: string; email: string; cvLink: string; sopLink?: string; expectedCompensation?: "Money" | "Equity" | "Hybrid"; createdAt?: DateLike; status?: ContentStatus; }
export interface AuditLog extends FirestoreEntity { actorId: string; action: string; collectionName: string; documentId: string; before?: unknown; after?: unknown; createdAt?: DateLike; }
export interface MsmeCase extends FirestoreEntity { title: string; category: "Digital Transformation" | "Quality" | "Manufacturing" | "Inspection" | "Reliability" | "Maintenance" | "Energy" | "Automation" | string; problem: string; solution: string; technology?: string; investment?: string; roi?: string; outcome?: string; visibility?: Visibility; createdAt?: DateLike; updatedAt?: DateLike; }
export interface Bookmark extends FirestoreEntity { userId: string; targetType: AssociatedType | "community"; targetId: string; title?: string; href?: string; createdAt?: DateLike; }
export interface CommunityAnalytics extends FirestoreEntity { postId: string; views?: number; bookmarks?: number; likes?: number; comments?: number; replies?: number; participation?: string[]; updatedAt?: DateLike; }
export interface SystemStats extends FirestoreEntity { memberCount?: number; organizationCount?: number; problemStatementCount?: number; challengeCount?: number; researchCount?: number; competitionCount?: number; knowledgeCount?: number; communityCount?: number; lastUpdated?: DateLike; }
export type PlatformModuleKey = "core" | "organizations" | "competitions" | "knowledge_hub" | "msme_intelligence" | "community" | "teams" | "admin_governance";
export interface InitializationStatus extends FirestoreEntity { initialized: boolean; version: number; modules: PlatformModuleKey[]; missingRecords: string[]; lastRunAt?: DateLike; updatedAt?: DateLike; }
export interface PlatformInitializationResult { initialized: boolean; version: number; changes: Array<{ collection: string; id: string; status: "created" | "patched" | "unchanged" }>; }
export interface SearchResult { id: string; type: string; title: string; description?: string; href: string; tags?: string[]; }
export interface OrganizationStats { organizations: number; problemStatements: number; challenges?: number; }
export interface LabelItem { id: string; label: string; sortOrder?: number; description?: string; }
export interface IndustrySector extends LabelItem { slug?: string; icon?: string; }
export interface CommunityStats { members: number; researchers: number; engineers: number; professionals: number; organizations: number; }
