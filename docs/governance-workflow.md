# Governance Workflow

NumSum Labs governance records are admin-only in Prompt 6A. No public or member reads are enabled yet.

## Document lifecycle

1. Admin creates or seeds a governance document.
2. The document starts as `draft` with `admin_only` visibility.
3. Admins edit metadata, markdown-style content and ordered section cards.
4. Admins can submit for review by setting `under_review`.
5. Approval changes the status to `approved` and creates a version snapshot.
6. Activation changes the status to `active`, creates a version snapshot and supersedes any older active document of the same type.
7. Archive moves the document to `archived` and records archive metadata.

## Amendment lifecycle

1. Admin proposes an amendment against a document with affected section IDs, current text, proposed text, rationale and expected impact.
2. Admins approve or reject the amendment with decision notes.
3. Implementing an approved amendment updates the linked document content, marks the amendment `implemented` and creates a new document version snapshot.

## Versioning model

`governance_document_versions` stores snapshots of title, full content and sections. Snapshots are created during approval/activation, manual snapshot actions and amendment implementation.

## Seed strategy

The seed action creates the NumSum Labs Constitution, Frozen Core Objective Target, Governance Manual placeholder, Annual Objective 2026 placeholder and an active Annual Objective 2026 target with first-year KPIs and workstreams.

## Future access

The data model includes `visibility` for founders, members and public audiences, but Firestore rules intentionally restrict all reads to admins/super-admins for this prompt.
