# Firestore Rules Test Plan

No emulator test suite exists in this repository yet. Use this manual matrix until Firebase emulator tests are added.

## Public visitor

- Can read public published `problem_statements` only.
- Can read public approved/published `knowledge_assets`, `research_posts`, public completed/scaled `pilot_tracks`, public safe competitions, public published success stories, public career openings, and public MSME cases.
- Cannot read `problem_admin_metadata`, `onboarding_admin_metadata`, `pilot_admin_metadata`, `competition_submission_admin_metadata`, governance collections, execution collections, competition evaluations, contribution records, or admin inbox.

## Member

- Can read member-visible content only when visibility/status is allowed.
- Cannot read another member's submitter-only problem, team-only competition team/submission, private contribution record, governance document, or execution item unless assigned.

## Submitter

- Can read their own submitted problem and linked workspace records only when the linked records have submitter/member/public visibility and safe statuses.
- Cannot read admin-only companion metadata for their own problem.
- Can update only safe intake fields while the problem status remains editable.

## Competition team member

- Can read own team/submission records.
- Cannot read `competition_evaluations` or submission admin metadata.
- Cannot set scoring, evaluation, result declaration, or reviewer fields.

## Assigned internal member

- Can read assigned execution work/action/meeting records.
- Can update only status, completion notes, blocker reason, evidence links, and `updatedAt` on assigned work/action items.
- Cannot read governance, decisions, execution reviews, or unassigned execution records.

## Admin / super-admin

- Can manage admin workflows, companion metadata, governance, execution, evaluations, contribution review records, and publishing/review actions.
- Super-admin fallback remains available for unmatched documents.

## Negative checks

- Confirm no non-admin write can include `adminNotes`, `internalNotes`, `adminInternalNotes`, `reviewNotes`, `reviewerNotes`, `decisionNotes`, `privateFeedback`, `adminOnlySummary`, or `reviewerComments` on shared documents.
- Confirm public/member reads fail on all companion metadata collections.
