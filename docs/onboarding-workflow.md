# Admin onboarding workflow

## Lifecycle: raw problem to onboarded problem

1. A member submits a private `problem_statements` record with `status: submitted` and `visibility: submitter_only`.
2. An admin reviews the record from `/admin/problems` and opens `/problem-statements/[id]`.
3. In the admin-only **Onboarding & Questionnaire** workspace, the admin can create one or more `problem_onboarding_sessions`, `questionnaire_responses`, and `meeting_logs` linked by `problemStatementId`.
4. During onboarding, the admin may keep the problem in `under_review`, mark it `needs_more_info`, or mark it `onboarded` after enough root-cause and implementation context has been captured.
5. Public publication remains a separate explicit admin decision. Private onboarding data remains hidden unless a record visibility is intentionally changed and a summary field is populated.

## Questionnaire template structure

`questionnaire_templates` stores admin-managed templates:

- `title`, `description`, `purpose`, `category`, `industrySegment`
- `createdBy`, `isDefault`, `status: draft | active | archived`
- `visibility: admin_only`
- `sections[]`, where each section has `id`, `title`, `description`, `order`, and `questions[]`
- question fields: `id`, `label`, `helpText`, `type`, `required`, `options`, `order`, and `placeholder`

The default MSME onboarding template covers company background, industry/process context, frequency/severity, economic impact, workarounds, data availability, machines/processes, manpower, quality, energy, maintenance, documentation maturity, safety/compliance, desired outcomes, pilot readiness, and confidentiality sensitivity.

## Questionnaire response visibility

`questionnaire_responses` must include `problemStatementId`. They default to `visibility: admin_only` and `status: draft`. A completed response stores structured `answers`/`responses`, `internalNotes`, optional `submitterVisibleSummary`, and optional `publicSummary`.

- Admin can read and write full responses.
- Submitters can read only responses linked to their own problem when visibility is `submitter_only`, `member_only`, or `public`.
- Members can read only `member_only` or `public` visible records.
- Public users can read only records explicitly marked `public`.
- Internal notes are for admin workflows and should not be rendered in submitter/public UI.

## Onboarding session rules

`problem_onboarding_sessions` must include `problemStatementId`. A problem can have many sessions. Sessions capture meeting date, mode, attendees, agenda, discussion summary, internal notes, submitter-visible notes, next steps, and linked questionnaire response IDs. Sessions default to `admin_only`.

## Meeting log rules

`meeting_logs` must include `problemStatementId` and can optionally include `onboardingSessionId`. Logs capture title, date, mode, attendees, summary, decisions, action items, internal notes, visibility, and creator. Logs default to `admin_only`.

## Visibility model

- Admin/super-admin: full onboarding workspace, templates, responses, sessions, meeting logs, and internal notes.
- Submitter: problem status, submitter-visible problem notes, and only linked onboarding/questionnaire/meeting summaries that admins explicitly mark visible.
- Member: only member/public visible onboarding summaries.
- Public: no private onboarding data unless an admin explicitly marks a summary record `public`.

Firestore rules prevent non-admin creation or editing of onboarding sessions, questionnaire responses, questionnaire templates, and meeting logs.
