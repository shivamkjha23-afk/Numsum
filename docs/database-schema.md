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
