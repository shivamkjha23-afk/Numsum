# Admin Setup

Admin access is stored on the user's Firestore profile document at `users/<firebase-auth-uid>`. The app and Firestore rules read `users/<uid>.role`; they do not rely on Firebase Auth custom claims for admin routing or rule checks. A normal admin has `role: "admin"`. A super-admin has `role: "super_admin"` and should be limited to owner/founder-level operators. Admin profiles should also have `status: "active"` and `profileComplete: true` so the founder is not blocked by member onboarding gates.

## Founder-admin bootstrap flow

1. Deploy or run the app against the intended Firebase project.
2. Sign in once using the founder email so Firebase Auth creates the account and the app creates `users/<uid>`.
3. Complete the profile if the app prompts for it. The bootstrap script will set `profileComplete: true`, but completing the profile first keeps the profile useful for audit and operations.
4. Copy the Firebase Auth UID from Firebase Console, or use the exact founder email.
5. Run the admin bootstrap script with the explicit confirmation flag.
6. Log out and log back in so the client reloads the updated profile role.
7. Confirm `/admin` is visible and accessible.
8. Confirm the admin dashboard loads.
9. Confirm a public visitor and a logged-in non-admin user still cannot access `/admin`.

## Bootstrap the founder admin

Preferred scripted flow by email:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json GOOGLE_CLOUD_PROJECT=<project-id> npm run admin:bootstrap -- --email "FOUNDER_EMAIL_HERE" --role super_admin --confirm-admin-bootstrap
```

Equivalent scripted flow by Firebase Auth UID:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json GOOGLE_CLOUD_PROJECT=<project-id> npm run admin:bootstrap -- --uid "FIREBASE_AUTH_UID_HERE" --role super_admin --confirm-admin-bootstrap
```

Use `--role admin` when creating an ordinary operator account. The script defaults to `admin` when `--role` is omitted; `super_admin` must be requested explicitly. For the founder account, `super_admin` is recommended because it preserves owner-level access where the app distinguishes super-admins.

The script refuses to run in CI, refuses to run without `--confirm-admin-bootstrap`, and requires either Firebase Admin credentials (`GOOGLE_APPLICATION_CREDENTIALS`) or explicit emulator targeting (`FIRESTORE_EMULATOR_HOST`). It updates only the existing Firebase Auth user resolved by `--email` or `--uid`, writes the Firestore profile fields used by the app and rules, and logs the updated UID/email/role without printing secrets.

## Manual Firebase Console fallback

Use this only if the script cannot run from a trusted operator machine.

1. In Firebase Console, open **Authentication → Users** and locate the founder account by email.
2. Copy the founder **UID**.
3. Open **Firestore Database**.
4. Go to collection `users` and document `<founder-auth-uid>`.
5. Create the document if it does not exist, or edit the existing document.
6. Set these fields:
   - `uid`: `<founder-auth-uid>`
   - `email`: `<founder email>`
   - `role`: `super_admin` for the founder, or `admin` for a normal operator
   - `status`: `active`
   - `profileComplete`: `true`
7. Do **not** add Firebase custom claims for this launch path; the app and `firestore.rules` check the Firestore user profile role.
8. Ask the founder to log out and log back in.
9. Verify `/admin` and the admin dashboard load for the founder.
10. Verify unauthenticated visitors and logged-in non-admin members still see an admin-access-required state and cannot read admin-only Firestore data.

## Minimal admin verification checklist

After bootstrap, verify the founder admin can open:

- `/admin`
- `/admin/problems`
- `/admin/questionnaires`
- `/admin/knowledge`
- `/admin/sops`
- `/admin/research`
- `/admin/pilots`
- `/admin/competitions`
- `/admin/governance`
- `/admin/objectives`
- `/admin/execution`
- `/admin/contributions`

Then verify the founder can create or manage, manually from the website admin interface:

- Default questionnaire template
- Governance document
- Objective target
- Problem review
- Knowledge item
- SOP
- Research item
- Pilot
- Competition draft

Do not create fake users, fake MSME data, fake success stories, fake claims, or fake metrics as part of this bootstrap.

## Remove admin access

Use the Firebase Console or the bootstrap script with `--role member` after confirming another admin remains. Never remove the last working admin until a replacement has signed in and verified access.

## Avoid lockout

Keep at least two verified admins during launch week when possible. Test role changes in staging first. Do not rely on client-side edits for roles; use the Firebase Console or Admin SDK with audited operator credentials.

## User lifecycle and role assignment update

See [User Lifecycle and Role Management](./user-lifecycle-and-role-management.md) for the canonical signup profile creation flow, profile completion redirect behavior, `user_role_requests` review queue, `/admin/users` role assignment page, and super-admin safety rules.
