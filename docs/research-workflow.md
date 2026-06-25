# Research Repository Workflow

NumSum research records are stored as `ResearchItem` documents in `research_posts`. They cover research papers, patents, technology trends, schemes, standards, benchmarks, startup case studies, MSME success stories, innovations, academic projects, and market/regulatory intelligence.

## Lifecycle

Research starts as `draft` or `under_review`, can be `approved`, `published`, `archived`, or `rejected`, and uses visibility values `admin_only`, `submitter_only`, `team_only`, `member_only`, or `public`. Member submissions default to `under_review` and `admin_only`; only admins can approve, publish, or make public.

## General vs problem-linked research

Research should support practical MSME problem solving. Items may be created with `problemStatementId` and are then added to the problem workspace, linked resources, and timeline. Unlinked global items are marked `generalResearch: true` and can later be linked to a problem, producing a `research_linked` timeline event.

## Technology Watch

The admin Technology Watch view focuses on `technology_trend`, `patent`, `startup_case_study`, `product_innovation`, `process_innovation`, and `research_paper` records with actions such as `monitor`, `discuss`, `evaluate_for_pilot`, `convert_to_knowledge`, or `link_to_problem`. Optional fields include `watchPriority`, `nextReviewDate`, and `reviewedInMeetingId`.

## Case studies

MSME and startup success stories use `msme_success_story` and `startup_case_study` with structured fields including `companyName`, `initialChallenge`, `interventionOrInnovation`, `growthJourney`, `measurableImpact`, and `lessonsForIndianMSMEs`.

## Conversion

Admins can convert linked research to a KnowledgeAsset. The conversion carries over summary, key findings, practical relevance, source links, tags, and problem linkage, and creates a `research_converted_to_knowledge` timeline event.

## Timeline events

Research actions use `research_added`, `research_updated`, `research_linked`, `research_approved`, `research_published`, `research_archived`, and `research_converted_to_knowledge`.
