# NumSum Labs Firebase Data Model

NumSum Labs is organized as a three-module MSME-first operating system. The data model centers every workflow on a `problem_statements` document and links public, member, and admin artifacts back to that problem where applicable.

## Platform modules

### Public Module
Public users can read only documents explicitly approved for public access: `visibility: "public"` plus a public lifecycle state such as `status: "published"`, `"public"`, `"active"`, or `"completed"`.

Public collections/pages are powered by:

- `problem_statements`: public MSME challenges/problem statements.
- `msme_cases`: public MSME intelligence and case records.
- `knowledge_assets`, `sop_documents`, `research_posts`: approved knowledge, SOP, and research assets.
- `competitions`: public/open competitions.
- `success_stories`, `testimonial_ratings`: moderated stories, testimonials, and ratings.

### Member Module
Authenticated members can create or participate in content that belongs to them, their teams, or the member community:

- `users`: member profile and mandatory profile-completion state.
- `organizations`: MSME/research/partner organization profiles.
- `problem_statements`: submitted problems default to `visibility: "submitter_only"` and `status: "submitted"`.
- `research_posts`: member research contributions.
- `competition_teams`, `competition_submissions`: team membership and competition deliverables.
- `community_posts`, `comments`, `replies`: public/member discussions and permitted private team/problem discussions.

### Admin Module
Admins can read/write all platform data and manage the operating workflow:

- Review submitted problems.
- Schedule/record onboarding sessions.
- Fill questionnaire responses against the same submitted problem.
- Convert a problem to a structured challenge or competition.
- Link SOPs, knowledge assets, research items, meetings, pilot tracks, files, and competitions to problems.
- Control `visibility` on every governed object.
- Moderate success stories, testimonials, ratings, discussions, teams, submissions, and results.
- Version constitution and objective/target documents.

## Shared enums

### Visibility

All governed content should use one of the following values:

- `admin_only`: only admins can read/write.
- `submitter_only`: admins and the original submitter/owners can read; admin controls publishing.
- `team_only`: admins and permitted team members can read.
- `member_only`: authenticated members can read.
- `public`: anonymous public users can read only when status is also public-approved.

Legacy `private` remains accepted in TypeScript for backward compatibility, but new data should use `admin_only` or `submitter_only`.

### Status

Core lifecycle values are:

- `draft`
- `submitted`
- `under_review`
- `onboarded`
- `structured`
- `active`
- `completed`
- `published`
- `archived`
- `rejected`

Compatibility values still seen in older records include `needs_information`, `member_only`, `public`, `researching`, `competition`, and `solved`.

## Core collections

### `users` (`UserProfile`)
Member identity and profile state.

Key fields: `uid`, `displayName`, `name`, `email`, `role`, `status`, `profileComplete`, `organizationId`, `organizationIds`, `memberModuleEnabled`, `onboardingCompletedAt`, `createdAt`, `updatedAt`.

### `organizations` (`OrganizationProfile`)
Organization/MSME profile.

Key fields: `name`, `publicLabel`, `industry`, `description`, `website`, `logo`, `verificationStatus`, `city`, `state`, `country`, `status`, `createdBy`.

### `problem_statements` (`ProblemStatement`)
Canonical problem/challenge record. All major workflows link back here.

Key fields: `title`, `summary`, `description`, `problemDescription`, `category`, `organizationId`, `createdBy`, `submittedBy`, `submitterId`, `ownerIds`, `teamIds`, `status`, `visibility`, `questionnaireResponses`, `attachments`, `linkedResources`, `structuredChallengeId`, `convertedCompetitionId`, `publishedAt`.

Default submission behavior: `status: "submitted"`, `visibility: "submitter_only"`; readable only by admins and the submitter until admin changes visibility.

### `problem_onboarding_sessions` (`ProblemOnboardingSession`)
Admin-created one-to-one onboarding session for a submitted problem.

Key fields: `problemStatementId`, `scheduledAt`, `recordedAt`, `facilitatorId`, `participantIds`, `notes`, `meetingUrl`, `recordingUrl`, `questionnaireResponseId`, `status`, `visibility`.

### `questionnaire_templates` (`QuestionnaireTemplate`)
Admin-managed reusable templates.

Key fields: `category`, `name`, `questions[]`, `createdBy`.

### `questionnaire_responses` (`QuestionnaireResponse`)
Admin-filled or admin-reviewed answers linked to a problem/session.

Key fields: `problemStatementId`, `templateId`, `sessionId`, `respondentId`, `responses`, `status`, `visibility`.

### Linked work collections

Each of these can link to a problem through `problemStatementId` and/or through `ProblemStatement.linkedResources[]`:

- `knowledge_assets` (`KnowledgeAsset`): approved knowledge, templates, guides, cases, reports.
- `sop_documents` (`SOPDocument`): SOP content and document links.
- `research_posts` / `ResearchItem`: research submissions and published research.
- `pilot_tracks` (`PilotTrack`): pilot implementation tracks and milestones.
- `meeting_logs` (`MeetingLog`): notes, action items, files, and meeting metadata.
- `competitions` (`Competition`): problem-derived or standalone competitions.
- `community_posts` (`DiscussionPost`): problem, research, competition, knowledge, organization, MSME, team, or general discussions.

### Competition collections

- `competitions` (`Competition`): public/admin-managed competition/challenge record with `sourceType`, `sourceId`, and `sourceProblemId` for problem conversions.
- `competition_teams` (`CompetitionTeam`): team leader and members.
- `competition_submissions` (`CompetitionSubmission`): individual or team deliverables, evaluation, rank, and winner state.

### Moderated public proof collections

- `success_stories` (`SuccessStory`): outcome stories linked to problems/organizations.
- `testimonial_ratings` (`TestimonialRating`): moderated ratings and testimonials.

### Governance/versioned document collections

- `constitution_documents` (`ConstitutionDocument`): versioned constitution text/file records.
- `objective_target_documents` (`ObjectiveTargetDocument`): versioned objectives, target documents, and target metrics.

## LinkedResource pattern

`LinkedResource` is a lightweight embedded pointer used by `ProblemStatement.linkedResources[]` and future linking UIs.

Fields: `type`, `collection`, `resourceId`, `title`, `visibility`, `status`, `url`, `linkedAt`, `linkedBy`.

Use this to show the complete problem workspace in one place while still keeping each artifact in its own collection for permissions, moderation, and lifecycle management.

## Firestore security posture

- Admins (`admin`, `super_admin`, and the configured bootstrap admin) can read/write all platform data.
- Public users can read only public-approved documents.
- Members can read `member_only` and public-approved content.
- Submitters can read their own `submitter_only` problems and related onboarding/questionnaire records when ownership fields identify them.
- Team-only data requires membership fields such as `members`, `ownerIds`, or `teamMemberIds`.
- New submitted MSME problems are not public by default.

## Problem statement lifecycle and private submission workflow

`problem_statements` is the central operating object for MSME challenge intake. Member-facing labels may say “MSME Challenge” or “Problem Statement,” but repository functions and linked workflows should use `ProblemStatement`.

### Submission defaults

When a completed-profile member submits a problem:

- `status` is set to `submitted`.
- `adminReviewStatus` is set to `submitted`.
- `visibility` is set to `submitter_only`.
- `submittedByUserId`, `submittedByName`, `submittedByEmail`, and `submittedByProfileType` are copied from the member profile.
- `ownerIds` includes the submitter UID.
- Linked-resource id arrays are initialized for onboarding sessions, questionnaire responses, SOPs, knowledge assets, research items, pilot tracks, meeting logs, competitions, and discussions.

A submitted problem is therefore readable only by admins/super-admins and the submitter until an admin changes visibility.

### Admin review statuses

Admin review may move a problem through these lifecycle values:

- `submitted`
- `under_review`
- `needs_more_info`
- `onboarded`
- `structured`
- `pilot_shortlisted`
- `competition_candidate`
- `published`
- `archived`
- `rejected`

Only admins can set `visibility: "public"`. Public problem pages and listings must require both `status: "published"` and `visibility: "public"`.

### Access model

- Public visitors: read only `status: "published"` and `visibility: "public"` problems.
- Completed members: create problems for themselves and read member/public problems where visibility allows.
- Submitters: read their own `submitter_only` submissions and limited admin notes intended for submitter visibility.
- Submitters may edit only non-governance problem fields while status is `submitted` or `needs_more_info`.
- Admins/super-admins: read/write all problem statements, including status, visibility, priority, assignment, internal notes, submitter-visible notes, and linked-resource arrays.

### Linked resources

Future admin enrichment attaches resources through both `linkedResources[]` and typed id arrays:

- `onboardingSessionIds`
- `questionnaireResponseIds`
- `sopIds`
- `knowledgeAssetIds`
- `researchItemIds`
- `pilotTrackIds`
- `meetingLogIds`
- `competitionIds`
- `discussionPostIds`

This allows the detail page and future admin workspaces to show the complete operating context for a problem without exposing admin-only resources publicly.

## Problem Workspace Foundation

`problem_statements` is the central operating collection for MSME work. Workspace artifacts must include `problemStatementId` and should also be represented as a linked resource when practical.

### linked_resources

Reusable pointer records for problem workspace artifacts.

- `id`
- `problemStatementId`
- `resourceType`: `onboarding_session`, `questionnaire_response`, `meeting_log`, `knowledge_asset`, `sop_document`, `research_item`, `pilot_track`, `file_link`, `competition`, `discussion`, `timeline_event`
- `resourceId`
- `title`
- `description`
- `visibility`: `admin_only`, `submitter_only`, `member_only`, `public`
- `status`
- `createdBy`
- `createdAt`
- `updatedAt`

Existing arrays on `problem_statements` are still supported for compatibility: `onboardingSessionIds`, `questionnaireResponseIds`, `meetingLogIds`, `knowledgeAssetIds`, `sopIds`, `researchItemIds`, `pilotTrackIds`, `competitionIds`, and `discussionPostIds`.

### timeline_events

Chronological problem activity records.

- `id`
- `problemStatementId`
- `eventType`
- `title`
- `description`
- `actorUserId`
- `actorName`
- `visibility`
- `metadata`
- `createdAt`

### file_links

Lightweight workspace files and external references.

- `id`
- `problemStatementId`
- `title`
- `description`
- `url`
- `fileType`
- `visibility`
- `createdBy`
- `createdAt`
- `updatedAt`

### Visibility rules

Admins can read/write all workspace records. Submitters can read records linked to their own problem when the record visibility is `submitter_only`, `member_only`, or `public`. Members can read `member_only` and `public` records. Public users can read only `public` records. Internal admin notes must not be copied into public or submitter-visible fields.

## Problem-linked Knowledge Assets and SOP Documents

### `knowledge_assets`
Every Knowledge Asset must include `problemStatementId`; repository creation also mirrors it to `linkedProblemStatementId` for legacy readers. Assets capture reusable institutional learning with `title`, `shortDescription`, `detailedContent`, `category`, `sourceType`, source/Drive/attachment links, `tags`, industry and problem category, relevance, key takeaways, lifecycle status, visibility, submitter/creator/reviewer/approver metadata, and timestamps.

Lifecycle: `draft` or member `under_review` → `approved` → `published`; assets may be `rejected` or `archived`. Member contributions default to `under_review` and `admin_only`; only admins publish or make assets public.

### `sop_documents`
Every SOP must include `problemStatementId`. SOPs store `title`, objective, scope, applicability, process area, industry, version/SOP number, structured `steps`, requirements, deliverables, acceptance criteria, safety/quality checks, standards, links, tags, status, visibility, reviewer/approver metadata, and timestamps.

Lifecycle: `draft` → `review` → `approved` → `published`; SOPs may be archived. SOP writes are admin-only.

Both collections create a linked resource on the parent `problem_statements` document and emit workspace timeline events when created, updated, approved, published, or archived.

## Research Repository (`research_posts` / `ResearchItem`)

ResearchItem records support the Prompt 5C research repository, global technology watch, and MSME/startup case-study library. Key fields include `problemStatementId`, `generalResearch`, `title`, `abstract`, `researchType`, source metadata, publication metadata, `authors`, `organizationOrInstitution`, `country`, `industrySegment`, `problemCategory`, `technologyArea`, `keywords`, `summary`, `keyFindings`, `practicalRelevance`, `relevanceToMSME`, `relevanceToProblem`, `possibleApplications`, `implementationDifficulty`, `costImplication`, `maturityLevel`, `evidenceStrength`, `recommendedAction`, links, tags, status/visibility, submitter/reviewer/approver audit fields, and timestamps.

Technology Watch uses the same collection with watch fields such as `watchPriority`, `nextReviewDate`, and `reviewedInMeetingId`. Case studies use `companyName`, `initialChallenge`, `interventionOrInnovation`, `growthJourney`, `measurableImpact`, and `lessonsForIndianMSMEs`.

## Pilot Tracker and Implementation Validation

- `pilot_tracks`: problem-linked implementation pilots. Required linkage: `problemStatementId`. Fields include objective, problem summary, proposed solution, intervention type, status, visibility, priority, risk, implementation difficulty, cost/savings estimates, baseline/target/current/final values, evidence links, lessons learned, next steps, safe summaries, and admin internal notes.
- `pilot_milestones`: `pilotTrackId`, `problemStatementId`, title, description, target/completed dates, status, owner, evidence, and notes.
- `pilot_updates`: `pilotTrackId`, `problemStatementId`, update date, progress percent, current metrics, blockers, decisions, action items, evidence, and visibility.
- `pilot_metrics`: metric name/unit, baseline, target, current, final value, measurement method, improvement direction, and evidence link.
- `success_stories`: admin-created official impact stories linked to a problem and pilot. Public reads require `visibility = public` and `status = published`.

Pilot timeline event types: `pilot_created`, `pilot_updated`, `pilot_status_changed`, `pilot_started`, `pilot_milestone_added`, `pilot_milestone_completed`, `pilot_update_added`, `pilot_metric_added`, `pilot_completed`, `pilot_published`, and `success_story_created`.

## Prompt 6A: Governance and Objective Target Collections

### `governance_documents`
Admin-only foundational documents for NumSum Labs, including constitution, frozen objective target, governance manual, annual/quarterly/monthly targets, policies, appendices, resolutions and templates. Each document stores `documentType`, `version`, `status`, `visibility`, `summary`, markdown-friendly `content`, ordered `sections`, tags and approval/archive metadata.

### `governance_document_versions`
Admin-only immutable snapshots created when a document is approved, activated, manually snapshotted or changed through an implemented amendment. Stores document ID, version number, snapshot title/content/sections and change summary.

### `governance_amendments`
Admin-only amendment proposals linked to governance documents. Tracks amendment type, affected sections, current/proposed text, rationale, expected impact, review/decision notes, approval metadata and implementation timestamp.

### `objective_targets`
Admin-only institutional target records for annual, quarterly, monthly and sprint periods. Stores objective summary, strategic theme, owners, workstreams, KPIs, KRAs, progress percentage and approval metadata.

### `governance_audit_events`
Admin-only audit trail for governance documents, amendments and objective targets. Events record entity type, action, actor, description, metadata and creation timestamp.

## Target Execution and Meeting Operating System

Prompt 6B adds private execution collections. They are never public-readable; admins/super-admins manage all records, while assigned members only see and update their own limited execution fields.

- `execution_work_items`: objective-linked executable work with `objectiveTargetId`, optional `workstreamId`, type, priority, status, owners/reviewers, dates, expected output, evidence requirements, related problem/knowledge/research/SOP/pilot/governance IDs, blockers, review notes, and completion notes.
- `action_items`: meeting/objective/problem/pilot/governance/manual follow-up tasks with owners, reviewers, priority, due dates, evidence, blockers, and completion notes.
- `meeting_records`: internal daily sync, weekly sprint review, monthly system review, special agenda, onboarding, pilot, and governance meetings with agenda, attendees, blockers, learnings, decisions, action item IDs, linked objectives/problems/pilots/governance documents, minutes, status, and internal visibility.
- `execution_reviews`: admin-authored daily/weekly/monthly/quarterly/special progress reviews connected to objective targets, KPIs, KRAs, and work items.
- `decision_records`: admin-written operational/product/governance/financial/strategic/technical decisions linked to meetings, objectives, problems, pilots, or governance documents.
- `evidence_records`: internal evidence links for objectives, work items, action items, meetings, problem statements, knowledge assets, SOPs, research items, pilots, and governance documents.

Security rules added for these collections enforce admin write authority, assigned-member read access for work/action items and meetings, limited member status/evidence updates, admin-only reviews and decisions, and no public execution reads.

## Contribution Tracking, Evidence, Recognition, and Review

Prompt 6C adds these Firestore collections:

### `contribution_records`
Tracks who contributed what, where it is connected, which evidence supports it, and how admins reviewed it. Key fields include `contributorUserId`, `contributionTitle`, `contributionCategory`, `contributionType`, `relatedEntityType`, `relatedEntityId`, `objectiveTargetId`, `workstreamId`, `evidenceLinks`, `evidenceRecordIds`, `qualityRating`, `impactRating`, `alignmentRating`, `reviewStatus`, `visibility`, `reviewNotes`, `recognitionNotes`, `suggestedScore`, and `approvedScore`.

### `contribution_score_rules`
Stores illustrative internal scoring guidance by contribution type/category. These rules include `baseScore`, `minScore`, `maxScore`, `evidenceRequired`, `reviewRequired`, and `active`. Scores are governance review aids only and are not automatic equity entitlement.

### `contribution_review_cycles`
Defines monthly, quarterly, annual, or special contribution review windows with reviewers, contributors, summary, decisions, and completion metadata.

### `contributor_review_summaries`
Stores per-contributor summaries for a review cycle, including totals, accepted/rejected counts, approved score totals, category breakdown, strongest contributions, improvement areas, reviewer notes, recognition recommendation, and final status.

### `recognition_records`
Stores appreciation, certificates, featured contributor records, monthly/project recognition, leadership responsibility, and special mentions. Visibility supports `admin_only`, `contributor_only`, `internal_member`, and `public`, but public display is intentionally deferred.

### `contribution_claims`
Allows members to claim contribution work with related entity references and evidence links. Admins can review claims and convert accepted claims into contribution records.

## Competition Module (Prompt 7A)

Collections: `competitions`, `competition_teams`, `competition_participations`, `competition_submissions`, `competition_evaluations`, and `competition_results` model problem-linked challenges, team formation, participation, submissions, admin evaluation, and result declaration. Competitions can reference problem statements, objective targets, knowledge assets, research items, SOPs, and pilot tracks. Team and submission data is private to admins and owners/team members; evaluations are admin-only; public results require `visibility: public` and `status: published`.
