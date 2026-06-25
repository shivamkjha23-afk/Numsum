# Contribution Tracking, Evidence, Recognition, and Review System

NumSum Labs uses contribution tracking to record meaningful work, evidence, impact, review history, and recognition across the platform. It supports contribution-led governance while keeping ownership and equity decisions manual, governance-controlled, and outside automatic scoring.

## Contribution record lifecycle

1. **Auto-logged**: safe system events create a `contribution_records` entry with `reviewStatus = auto_logged`.
2. **Submitted**: a member claim or admin-created record enters the review queue.
3. **Under review**: admins/founders inspect evidence, related entities, quality, impact, and mission alignment.
4. **Accepted / needs revision / rejected**: admins record review notes, ratings, recognition notes, and optional approved score.
5. **Archived**: stale or superseded records can be archived without deleting evidence history.

Approved scores are internal review aids only. They are not automatic equity, ownership, compensation, or entitlement.

## Auto-logging rules

The repository helpers create contribution records when meaningful work is completed or approved:

- Execution work item completed → `work_item_completed`.
- Action item completed → `action_item_completed`.
- Knowledge asset approved/published → `knowledge_asset`.
- Research item approved/published/public → `research_report`, `industry_study`, or `technology_watch_item`.
- SOP approved/published → `sop_created`.

Auto-logging checks existing records for the same contributor, related entity, and contribution type to avoid duplicates. Auto-logged records default to internal visibility and require admin review before any accepted status or approved score.

## Contribution claim process

Members use `/dashboard/contributions` to submit contribution claims with summary, category, type, related entity, and evidence links. Members may edit their own claims only while the claim is `submitted` or `needs_revision`. Admins review claims and may convert accepted claims into contribution records.

## Review cycle process

Admins use `/admin/contributions/review-cycles` to create monthly, quarterly, annual, or special review cycles. A cycle can include contributors, pull records for review, generate contributor summaries, record reviewer notes, and support recognition recommendations.

Review cycles answer:

- What did each contributor deliver?
- What evidence exists?
- What quality and impact did it have?
- Which workstreams benefited?
- What should improve?
- Who deserves recognition?

## Recognition process

Admins can create recognition records manually or from a contribution detail page. Recognition can be admin-only, contributor-only, internal-member visible, or marked public for future public display. Public recognition is not exposed on public pages yet.

## Score rule limitations

Score rules are labeled as **illustrative internal contribution scores**. They define base/min/max review ranges and evidence requirements for consistency, but they never allocate equity automatically. Ownership decisions must remain manual, documented, and governance-controlled.

## Permission model

- Admins and super-admins can read/write all contribution collections.
- Contributors can read their own contribution records, claims, recognition, and finalized summaries.
- Internal members can read contribution/recognition records only when visibility is `internal_member`.
- Members can create their own contribution claims and update them only while open for revision.
- Non-admins cannot approve/reject contribution records, assign approved scores, publish recognition, or finalize review summaries.
- Public reads are disabled for contribution collections, even for records marked `public`, until a dedicated public recognition page exists.
