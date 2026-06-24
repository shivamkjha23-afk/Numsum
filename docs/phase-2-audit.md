# NumSum Phase 2 Implementation Audit

Date: 2026-06-24

## Authentication
- Firebase auth provider creates/patches profiles on sign-in, but signup role requests are not fully reflected in profile metadata.
- Admin visibility is correctly derived client-side from `admin` and `super_admin`, but mobile flattened links can leak admin links if not filtered.

## Firestore Rules
- Rules cover core collections, but some Phase 2 collections (`bookmarks`, `msme_cases`) are missing explicit matches.
- Community updates are too permissive (`signedIn()` can update/delete any post).
- System stats writes are available to any signed-in user.

## Collections / Initialization
- Initialization exists but only covers core settings, roles, templates, stats, and a few documents.
- Missing verification for community, notifications, admin inbox, team members, collaboration groups, bookmarks, audit logs, MSME cases, and relationship registries.
- Current patch behavior is safe for top-level missing fields but does not deeply patch nested defaults.

## Repository Layer
- A `withoutUndefined` helper exists but is not exported under the requested `sanitizeFirestorePayload()` name.
- Some direct `updateDoc` calls bypass the sanitizer.
- Missing repository helpers for role lifecycle actions, relationship discovery, unified search, MSME cases, and admin user status updates.

## Navigation
- Header has grouped dropdowns but labels do not match the requested IA and Home is nested.
- Search is absent in the header.
- Notification bell exists only when authenticated and has no unread count.

## Admin Dashboard
- Admin data loader fetches many collections, but dashboard still depends on table-heavy `AdminPanel` sections.
- Role request review exists in repository but user lifecycle actions need explicit repository functions.

## Forms
- Questionnaire templates exist and are admin readable/editable, but a complete visual form builder is not evident from the audited files.

## Competition Flow
- Competition collections and submission/team types exist.
- Status vocabulary does not exactly match requested `Open` naming (`active` is used).
- Source conversion fields exist but lifecycle helper coverage is incomplete.

## Community Flow
- Posts support nested replies, likes/upvotes, and bookmarks arrays.
- Associated content excludes organizations and does not enforce dropdown selection in the repository layer.
- Report/share helpers are missing.

## Team Flow
- Competition teams support existing members and invite emails.
- General team/workspace collaboration groups exist, but team creation/invitation repository helpers are incomplete.

## Missing Index Risks
- Compound queries involving `visibility + createdAt`, `userId in + createdAt`, and organization visibility filters may require Firestore composite indexes.

## UI Issues
- Logo asset path is not present in this container (`/mnt/data` is unavailable), so a local NumSum brand asset must be generated from the provided prompt image.
- Footer and login page need brand modernization.
