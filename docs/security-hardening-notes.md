# Prompt 8B Security Hardening Notes

## Internal field safety decisions

Firestore document reads expose every field in a readable document, so Prompt 8B treats admin notes, internal notes, evaluator notes, review notes, reviewer comments, private feedback, decision notes, and admin-only summaries as **document-safety risks** when they live on records that submitters, members, or public users may read.

The repository now separates high-risk note fields on new writes/updates:

- `ProblemStatement.adminNotes` is stripped from `problem_statements` updates and stored in `problem_admin_metadata/{problemId}`.
- `ProblemOnboardingSession.internalNotes`, `QuestionnaireResponse.internalNotes`, and `MeetingLog.internalNotes` are stripped from shared onboarding/workspace documents and stored in `onboarding_admin_metadata/{sourceId}`.
- `PilotTrack.adminInternalNotes` is stripped from `pilot_tracks` and stored in `pilot_admin_metadata/{pilotId}`.
- `CompetitionSubmission.adminNotes` and `CompetitionSubmission.reviewNotes` are stripped from `competition_submissions` and stored in `competition_submission_admin_metadata/{submissionId}`.
- Competition scoring updates now keep score/rank/review notes/evaluator identity in `competition_submission_admin_metadata`; only winner/public-safe state remains on the submission record.

## Safe public data strategy

Public repository functions constrain reads to public visibility and safe statuses, then strip sensitive legacy fields defensively before returning data where sensitive fields historically existed. Public-safe aliases were added for route adoption and future review:

- `getPublicProblemsSafe`
- `getPublicKnowledgeAssetsSafe`
- `getPublicResearchItemsSafe`
- `getPublicPilotsSafe`
- `getPublicCompetitionsSafe`

## Firestore rule assumptions

- Admin-only companion metadata collections are readable/writable only by platform admins.
- New or updated shared records reject known sensitive note fields when those records have non-admin read paths.
- Legacy records may still contain historical sensitive fields until cleaned by an admin migration/export process.
- The legacy `/challenges` route/collection rule is now admin-only; `problem_statements` remains canonical.

## Remaining field-safety follow-up

Historical documents created before Prompt 8B may still contain sensitive fields in shared collections. Run a controlled admin migration after backing up Firestore to move existing sensitive fields into the companion metadata collections and delete them from the original documents.
