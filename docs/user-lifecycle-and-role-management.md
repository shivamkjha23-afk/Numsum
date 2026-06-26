# User Lifecycle and Role Management

## Signup and login behavior

Every authenticated Firebase user is normalized into `users/<firebase-auth-uid>` by `ensureUserProfile()` during auth state initialization and explicit sign-in/signup handlers. New Google and email/password accounts default to:

- `role: "member"`
- `status: "active"`
- `profileComplete: false`
- provider detected as `google`, `password`, or `unknown`

Existing `admin` or `super_admin` roles are not overwritten. Existing completed profiles are not reset to incomplete.

## Profile completion

Protected member and admin routes require a loaded user document. Incomplete users redirect to `/profile/complete?returnTo=...` on first login, direct URL access, and refresh. The profile form only writes safe member profile fields and computes `profileComplete` from required founder/MSME ecosystem fields.

## New-user review queue

New member profile creation creates a safe `user_role_requests/<uid>` review document with `requestedRole: "member"` and `status: "pending_review"`. This is an admin review queue, not an admin-access request.

## Admin Users & Roles page

Admins can open `/admin/users` from the Admin Dashboard card “Users & Roles” to view users, provider, profile completion, and review status. Admins can promote/demote members through admin-level roles except `super_admin`. Super-admins can manage all roles.

## Safety rules

- Members cannot edit their own `role`, `status`, admin metadata, contribution score, or recognition fields.
- Users cannot change their own role from the admin table.
- Admins cannot promote anyone to `super_admin` unless they are already super-admin.
- The last active super-admin cannot be demoted by the client helper.
- Role/status changes update `updatedAt`, mark the review record reviewed, and attempt an audit log.

## Manual Firebase fallback

If the UI is unavailable, a founder super-admin may update `users/<uid>.role` manually in Firebase Console. Keep at least one active `super_admin`, set `updatedAt`, and add an audit note in `audit_logs` when possible.
