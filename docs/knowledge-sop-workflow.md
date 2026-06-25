# Knowledge Asset and SOP Workflow

NumSum Labs uses problem-linked Knowledge Assets and SOP Documents to ensure there is no orphan knowledge and no orphan SOP.

## Knowledge Asset vs SOP

- **Knowledge Asset:** reusable learning such as a framework, case study, checklist, benchmark, guide, template, success story, or lesson learned.
- **SOP Document:** an official operational procedure with objective, scope, applicability, process area, version, acceptance criteria, quality checks, and ordered steps.

## Linking model

Creation requires `problemStatementId`. The repository writes a linked resource into the parent Problem Workspace, appends the asset ID through the linked-resource helper, and creates timeline events.

## Visibility model

- `admin_only`: internal review and drafts.
- `submitter_only`: visible to the problem submitter where appropriate.
- `member_only`: visible to signed-in members after approval/publication.
- `public`: visible publicly only when approved or published.

## Lifecycles

Knowledge: `draft` / `under_review` → `approved` → `published`, or `rejected` / `archived`.

SOP: `draft` → `review` → `approved` → `published`, or `archived`.

## Roles

- Admins manage all linked Knowledge Assets and SOPs from the Problem Workspace and admin listing pages.
- Members can suggest Knowledge Assets; submissions default to `under_review` and `admin_only`.
- Members and public users only see assets and SOPs allowed by visibility and approval/publication state.
- SOP creation and updates are admin-only.

## Timeline events

Repositories emit: `knowledge_added`, `knowledge_updated`, `knowledge_approved`, `knowledge_published`, `knowledge_archived`, `sop_added`, `sop_updated`, `sop_approved`, `sop_published`, and `sop_archived`.
