# Target Execution and Meeting Operating System

The execution system converts approved objective targets into operating work: workstreams, work items, meetings, action items, reviews, decisions, blockers, lessons, and evidence.

## Objective-to-execution workflow

1. Admin approves or activates an objective target.
2. Admin opens `/admin/objectives/[id]`, now the operating page for the objective.
3. Workstreams, KPIs, and KRAs stay visible beside execution tabs.
4. Admin creates work items under the objective/workstream and assigns owners/reviewers.
5. Admin or assigned members update status, blockers, completion notes, and evidence links.
6. Completion recalculates objective progress where work items are available.

## Work item lifecycle

`backlog → planned → in_progress → blocked/under_review → completed` or `cancelled`.

Evidence-required work items cannot be completed without completion notes or evidence links. Work items support related problem statements, knowledge assets, research items, SOPs, pilot tracks, and governance documents.

## Action item lifecycle

`open → in_progress → blocked → completed` or `cancelled`.

Action items may originate from meetings, objectives, problems, pilots, governance work, or manual admin entry. Assigned members can update only status, blocker reason, completion notes, evidence links, and updated timestamp.

## Meeting system

Admin meeting routes:

- `/admin/meetings`: list, filter, search, create from templates, and open records.
- `/admin/meetings/[id]`: view/edit metadata, agenda, minutes, decisions, and completion status.

Supported templates:

- Daily Sync: progress since previous meeting, priorities, blockers, help required, key learning, 5-minute KKS topic.
- Weekly Sprint Review: completed outputs, demonstrations, research findings, product/prototype review, blockers, critique, next priorities.
- Monthly System Review: goal achievement, process effectiveness, knowledge growth, governance concerns, resources, KPI/KRA review, decisions and minutes.
- Special Agenda: agenda, context, options, evidence, required decision, action items.

## Review cadence

Execution reviews are admin-authored records for daily syncs, weekly sprints, monthly reviews, quarterly reviews, and special reviews. Reviews connect objective targets with KPI IDs, KRA IDs, reviewed work item IDs, highlights, blockers, decisions, lessons, and next priorities.

## Evidence records

Evidence records preserve links to documents, spreadsheets, presentations, images, videos, drive links, code, reports, dashboards, and meeting minutes. Evidence can be linked to objectives, work items, action items, meetings, problems, knowledge assets, SOPs, research, pilots, and governance documents.

## Decision records

Decision records are admin-write only. They capture options considered, outcome, rationale, evidence, deciding contributors, date, status, and links to meetings/objectives/problems/pilots/governance documents.

## Permission model

- Admin/super-admin: read/write all execution records.
- Assigned member: read own work items/action items and attended meetings.
- Assigned member limited updates: status, completion notes, blocker reason, evidence links, updatedAt.
- Members can create internal evidence records that they uploaded.
- Decision records and execution reviews are admin-write only.
- No public read is allowed for execution collections.

## Notifications and future signals

The repository currently has notification data structures, but no stable cross-module assignment signal pipeline. Future work should notify owners on assignment, notify admins on blocked items and evidence submissions, and send due-date reminders.
