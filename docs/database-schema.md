# NumSum Firebase Data Model

NumSum uses Firebase Authentication, Firestore, Storage and Hosting. Documents include `tenantId`, `createdAt`, `updatedAt`, `createdBy`, and RBAC metadata where applicable to support multi-organization scale.

## Collections

- `users`: profiles, skills, badges, roles, contribution score, organization memberships.
- `organizations`: organization profile, industry, size, contacts, verification state.
- `challenges`: problem statement, type, category, status, workspace settings, visibility, reward.
- `challenge_categories`: sector taxonomy and challenge metadata.
- `questionnaires`: admin-managed form definitions by challenge type and organization segment.
- `questionnaire_fields`: reusable field definitions, validation, options and conditional visibility rules.
- `teams`: challenge/event teams, purpose, status and public profile.
- `team_members`: user-team role mapping with invitation/application states.
- `submissions`: deliverables, version pointer, team, challenge, review status.
- `events`: hackathons, research competitions and MSME problem-solving events.
- `event_registrations`: user/team registration and certificate state.
- `knowledge_assets`: papers, reports, templates, guides, videos and access policy.
- `research_papers`: structured research metadata and citations.
- `community_posts`: discussion hub posts with tags, mentions and attachment references.
- `comments`: threaded comments for posts, challenges and submissions.
- `reviews`: reviewer assignment, rubric version and moderation state.
- `review_scores`: weighted scores for innovation, practicality, scalability, cost, technical quality, business potential and impact.
- `contribution_logs`: immutable point events for participation, mentoring, reviewing, winning and helping.
- `badges`: badge definitions, criteria and awarded counts.
- `leaderboards`: monthly, quarterly and yearly materialized rankings.
- `notifications`: user and organization notification feed.
- `messages`: direct and workspace messages.
- `admin_settings`: platform feature flags, scoring weights, questionnaire rules and moderation policies.

## Storage paths

- `organizations/{organizationId}/verification/*`
- `challenges/{challengeId}/attachments/*`
- `workspaces/{challengeId}/files/*`
- `submissions/{submissionId}/versions/{versionId}/*`
- `knowledge/{assetId}/*`
- `users/{userId}/profile/*`
