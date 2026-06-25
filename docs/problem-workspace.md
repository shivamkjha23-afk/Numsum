# Problem Workspace Foundation

Prompt 5A makes `ProblemStatement` the central operating object for NumSum Labs. Every meaningful activity should be traceable to a real MSME problem statement, either through the existing ID arrays on the problem document or through the reusable linked-resource collection.

## Workspace views

- **Admin**: full workspace with Overview, Onboarding, Knowledge, SOPs, Research, Meetings, Pilots, Files, and Timeline tabs. Admins can change status/visibility, publish/unpublish, request more information, mark onboarded, create onboarding records, create meeting logs, and attach file links.
- **Submitter**: limited workspace with Overview, Shared Updates, visible meetings/next steps, and submitter/member/public resources only.
- **Member**: visible member/public workspace resources only.
- **Public**: only published public problem overview and public summaries/resources.

Internal admin notes remain admin-only. Submitter-visible notes and resource summaries are shown only when record visibility permits it.

## Linked resources

The reusable `linked_resources` collection stores lightweight pointers to workspace artifacts:

- `problemStatementId`
- `resourceType`: `onboarding_session`, `questionnaire_response`, `meeting_log`, `knowledge_asset`, `sop_document`, `research_item`, `pilot_track`, `file_link`, `competition`, `discussion`, `timeline_event`
- `resourceId`
- `title`, `description`, `visibility`, `status`
- `createdBy`, `createdAt`, `updatedAt`

The implementation continues to support existing arrays on `ProblemStatement` (`onboardingSessionIds`, `questionnaireResponseIds`, `meetingLogIds`, etc.) so Prompt 4 data remains intact.

## Timeline events

The `timeline_events` collection records important workspace actions in chronological form. Current automatic events cover problem submission, status/visibility changes, onboarding creation/completion, questionnaire creation/completion, meeting logs, and file links.

Timeline events use:

- `problemStatementId`
- `eventType`
- `title`, `description`
- `actorUserId`, `actorName`
- `visibility`
- `metadata`
- `createdAt`

## File links

The `file_links` collection is intentionally lightweight for Prompt 5A. Admins can attach title, description, URL, file type, and visibility. Visible links appear in the Files tab and also create linked-resource and timeline records.

## Future modules

Knowledge, SOP, Research, Pilot, Competition, and Discussion modules should plug into the workspace by:

1. Writing their own rich collection document.
2. Including `problemStatementId` on the rich record.
3. Calling `addLinkedResourceToProblem` with a matching resource type.
4. Creating a timeline event for meaningful state transitions.
5. Respecting `visibility` consistently.
