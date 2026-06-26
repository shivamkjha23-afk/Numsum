# Historical Sensitive Field Migration

## Purpose

This optional migration moves historical admin/internal review fields out of shared Firestore documents and into admin-only companion metadata collections. The script remains available for future production use, but current project data is mostly blank/test/junk and does not need recovery before clean development reset work.

## Why it is needed

Prompt 8B prevents new writes from storing sensitive fields on shared records. Older documents may still contain fields that Firestore rules cannot hide once a user can read the parent document. Those fields must be migrated before broader publication/member access is considered fully safe if the project contains real user data. For the current blank/test/junk project state, a clean reset is acceptable and this migration is not the priority.

## Affected collections scanned

- `problem_statements`
- `problem_onboarding_sessions` and legacy `onboarding_sessions`
- `questionnaire_responses`
- `meeting_logs`
- `pilot_tracks`
- `competition_submissions`
- `contribution_records`
- `decision_records` (scanned/documented; admin-only rules mean no shared migration is required)
- `governance_documents` (scanned/documented; admin-only rules mean no shared migration is required)

## Sensitive fields detected

The script detects the explicit migration fields and every field blocked by `hasSensitiveAdminFields()`:

- `adminNotes`
- `internalNotes`
- `adminInternalNotes`
- `reviewNotes`
- `reviewerNotes`
- `decisionNotes`
- `privateFeedback`
- `adminOnlySummary`
- `reviewerComments`
- `evaluatorNotes`
- `scoringNotes`
- `evaluationScores`
- `evaluatorScores`
- `rank`
- `winnerReason`
- `reviewerOnlyComments`
- `recognitionNotes`

## Target companion metadata collections

- `problem_admin_metadata`
- `onboarding_admin_metadata`
- `pilot_admin_metadata`
- `competition_submission_admin_metadata`
- `contribution_review_metadata`

`decision_admin_metadata` and `governance_admin_metadata` are not used currently because `decision_records` and `governance_documents` are already admin-only in Firestore rules.

## Dry-run behavior

Run:

```bash
npm run migrate:sensitive-fields:dry-run
```

The dry run scans affected collections, prints the source collection, document id, detected fields, and target metadata collection/document id. It performs no writes and removes nothing.

For a smaller sample:

```bash
tsx scripts/migrate-sensitive-fields.ts --dry-run --limit=10
```

## Apply behavior

Run only after backup/export and dry-run review:

```bash
npm run migrate:sensitive-fields:apply
```

Apply mode writes detected sensitive values to the mapped admin-only metadata document with `merge: true`, records `sourceCollection`, `sourceDocId`, `migratedFields`, `migratedAt`, and `migratedByScript`, then removes those fields from the shared source document only after the metadata write succeeds.

## Rollback and backup recommendation

Before applying in production or before any real public launch with real user data, revisit and approve the backup, retention, migration, and deletion policy. Export Firestore or take an equivalent point-in-time backup before apply mode. Rollback is restoring the exported collections or copying the metadata fields back from the companion collections if a business-approved reversal is needed.

## Production safety checklist

1. Confirm the current branch and deployed rules contain admin-only metadata collection rules.
2. Export/backup Firestore.
3. Run dry run against the target project.
4. Review every printed collection and target mapping.
5. Use `--limit` on a non-production project first.
6. Run apply with service-account or application-default credentials scoped to the intended project.
7. Save the migration terminal output as an audit artifact.
8. Re-run dry run; expected result is zero remaining migrated shared documents except skipped admin-only collections.

## Verification after migration

- Dry run reports no shared documents with migrated sensitive fields.
- Spot-check metadata documents exist in the target admin-only collections.
- Spot-check source shared documents no longer contain sensitive fields.
- Run Firestore emulator rules tests with `npm run test:rules`.
- Confirm public/member/submitter/team users cannot read admin metadata collections.
