# Pilot Tracker and Implementation Validation

The Pilot Tracker moves a structured `ProblemStatement` from research, knowledge assets, and SOPs into measurable MSME implementation.

## Lifecycle

Every `PilotTrack` is linked to exactly one `problemStatementId`. Typical statuses are `idea`, `proposed`, `approved`, `planned`, `active`, `paused`, `completed`, `cancelled`, `failed`, and `scaled`.

A valid pilot captures the implementation objective, problem summary, proposed solution, intervention type, baseline values, target values, current values, final results, evidence links, lessons learned, and next steps.

## Validation model

Pilot measurement follows a baseline → target → current → final structure:

- `PilotMetric.baselineValue`: starting measurement before intervention.
- `PilotMetric.targetValue`: expected validated outcome.
- `PilotMetric.currentValue`: live tracking during implementation.
- `PilotMetric.finalValue`: validated end result.
- `improvementDirection`: `increase_is_good`, `decrease_is_good`, or `target_range`.

## Supporting records

- `PilotMilestone`: target dates, completion dates, owner, status, notes, and evidence.
- `PilotUpdate`: dated progress update, percent complete, blockers, decisions, action items, metrics, evidence, and visibility.
- `PilotMetric`: individual measurable validation metric.

## Visibility model

Admins can read and write all pilot records. Submitters can read records linked to their own problem only when visibility is `submitter_only`, `member_only`, or `public`. Members can read `member_only` and public records where status permits. Public users see only `public` completed/scaled pilots. `adminInternalNotes` are for admin UI only and must not be surfaced to non-admin views.

## Success stories

Admins can convert completed/scaled pilots to a draft `SuccessStory`. The conversion copies the linked problem id, pilot id, title, industry segment, challenge summary, intervention summary, measurable impact, and safe public summary. Default visibility is `admin_only`; public users see only stories with `visibility = public` and `status = published`.

## Timeline events

Pilot workflow writes these problem timeline events: `pilot_created`, `pilot_updated`, `pilot_status_changed`, `pilot_started`, `pilot_milestone_added`, `pilot_milestone_completed`, `pilot_update_added`, `pilot_metric_added`, `pilot_completed`, `pilot_published`, and `success_story_created`.

## Relationship to research, SOPs, and knowledge

Research identifies candidate interventions, knowledge assets preserve reusable learning, SOPs standardize validated processes, and pilots validate the intervention in the MSME context with evidence and measurable impact.
