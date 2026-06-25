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
