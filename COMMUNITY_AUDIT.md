# Community Audit — Phase 2.2

## Routes audited
- `/community`: existed, but was a simple list without collaboration filters, trending, search guidance, or detail links. Updated to a structured ecosystem feed.
- `/community/new`: existed, but did not enforce the community architecture strongly enough. Updated to store discussion type-compatible entity metadata and attachment metadata.
- `/community/[id]`: missing. Added a detail page for title, author, organization, tags, linked entity, content, attachments metadata, comments, replies, bookmarks, likes, views, collaboration requests and related discussions.
- Linked community widgets in entity pages were already present through `CommunityThread`, but lacked full detail page navigation and advanced moderation actions.

## Firestore collections audited
- `community_posts`: existed. Missing `type`, `linkedEntityType`, `linkedEntityId`, `views`, `attachments`, `mentions`, and hardened validation. Added repository normalization and security checks.
- `comments`: missing repository writes. Added flattened comment document writes alongside embedded discussion comments for discoverability.
- `replies`: missing repository writes. Added flattened reply document writes alongside embedded reply arrays.
- `bookmarks`: existed, but community bookmarks only updated arrays. Added `bookmarks` documents for profile dashboard display.
- `notifications`: existed. Added generation for reply, mention and bookmark workflows.
- `collaboration_requests`: existed. Expanded request metadata: expertise, duration, organization, visibility and admin review flag.
- `private_collaboration_groups`: existed. Expanded type model for owner, associated entity, messages, documents, activity log and permissions.
- `community_analytics`: missing. Added collection mapping and view counter writes.

## Broken workflows found and addressed
- Community posts had no detail page, so comments and collaboration context had no canonical URL.
- Non-general discussions could be created without a linked entity. Repository now rejects missing linked entity IDs for non-general discussions.
- Mentions were plain text only. UI now renders `@username` as profile links and repository creates mention notifications.
- Community bookmarks did not appear in the profile dashboard. Bookmark documents are now created and displayed.
- Collaboration requests were not available from discussions. The detail page now includes a functional request form.
- Trending was not calculated. Feed now calculates lightweight most-active/trending rankings from views, comments and bookmarks.

## Remaining risks / future hardening
- Username mentions currently assume the `@username` token is a notification user ID or profile query key. A production username-to-UID resolver should be added once usernames are canonicalized in `users`.
- Comments remain embedded in `community_posts` for compatibility while also writing `comments`/`replies` collection records. A migration can later move read paths to subcollections or flat collection queries.
- Full text search is implemented as loaded-feed search guidance. Production scale should use Algolia, Meilisearch or Firestore-compatible search index documents.
- Moderation has report and admin inbox notification hooks, but a richer admin moderation queue should be connected to the admin dashboard in the next admin milestone.

## Missing indexes addressed
- Added `firestore.indexes.json` and linked it from `firebase.json`.
- Covered community feed filtering, linked entity related discussions, collaboration requests by entity, bookmarks by user and notifications by user.

## Permissions addressed
- Added rules for `comments`, `replies` and `community_analytics`.
- Hardened community post creation so non-general posts need linked entity metadata.
- Existing owner/admin read/write rules remain in place; destructive moderation remains admin-controlled where applicable.

## Query efficiency notes
- Feed remains capped to 100 records.
- Related discussions and collaboration requests are capped to 20 records.
- Profile bookmarks are capped to 100 records.
- Current implementation avoids large unbounded reads but should add cursor pagination before public launch.
