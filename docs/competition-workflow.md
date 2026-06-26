# Competition Workflow

NumSum competitions are problem-linked innovation workflows, not generic events. A competition can link to a `ProblemStatement`, objective target, knowledge assets, research items, SOPs, and pilot tracks.

## Lifecycle

`draft` → `upcoming` → `open` → `closed` → `evaluation` → `results_declared` → `archived` or `cancelled`.

Publishing a problem-linked competition records a problem timeline event (`competition_published`). Linking records `competition_linked` and appends the competition id to `ProblemStatement.competitionIds`.

## Data model

- `competitions`: challenge metadata, deadlines, visibility, participation mode, linked resources and discussion placeholders.
- `competition_teams`: private-by-default teams with lead, members, invited/requested users, skills, mentor, approval state and `teamDiscussionId` placeholder.
- `competition_participations`: per-user registration records for individual and team participation.
- `competition_submissions`: draft/final solutions with PDF, PPT, Drive, video, code and other URL fields.
- `competition_evaluations`: admin-only criteria scores, strengths, weaknesses, recommendations and evaluator notes.
- `competition_results`: declared/published winners with ranks, awards and public summary.

## Participation rules

Completed-profile members may register, create teams, request to join teams and submit solutions before the submission deadline. Individual competitions do not require teams. Team competitions require an approved/active team for final submission.

## Results and visibility

Public pages show only public competitions and published public results. Private teams, submissions, admin notes and evaluations are never exposed publicly. Admins can review all registrations, teams, submissions, evaluations and results.

## Contributions

The repository logs audit/contribution-compatible events for final submissions, selected/winner submissions and result declaration where safe. Scores/equity/ownership are not assigned automatically.

## Future discussion integration

`teamDiscussionId` and `competitionDiscussionId` placeholders are reserved for Prompt 7B discussion/community integration.
