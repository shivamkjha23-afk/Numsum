# Community Discussions

Step 7B adds MSME-first discussions for practical industrial problem solving, field knowledge, clarifying questions, competitions, and responsible collaboration.

## Models
- `discussion_threads`: scoped thread records for general, problem, competition, team, knowledge, research, SOP, and pilot contexts.
- `discussion_comments`: visible/hidden/deleted/under-review comments and replies through `parentCommentId`.
- `discussion_reports`: member reports for spam, abuse, confidential information, misleading claims, irrelevant posts, or other concerns.
- `moderation_actions`: admin-only moderation audit actions.

## Visibility and posting
Public visitors can read only `visibility=public` and `status=open` threads and visible comments. Completed members can create member discussions and comment on readable open threads. Public thread creation defaults to `under_review` for moderation. Incomplete-profile users cannot create threads, comments, or reports.

## Private spaces
Private problem discussions are for problem submitters, assigned internal users, and admins. Private team discussions are for team members and admins. These records must not be shown on public lists and should never include private submissions, evaluations, drawings, financials, contact numbers, or proprietary process details.

## Moderation workflow
Members can report threads/comments. Admins and super-admins can read all discussions, view reports, hide/unhide, lock/unlock, archive, and mark reports reviewed/dismissed/action-taken. Hidden and under-review content is admin-only.

## Safety standard
Discussions should be practical, respectful, and focused on MSME problem solving. Public posts may be moderated and confidential MSME data must not be posted.

## Future enhancements not included
Real-time chat, notifications, file attachments, rich mentions, email digests, organization forums, and reputation systems are intentionally out of scope.
