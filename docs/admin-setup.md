# Admin Setup

Admin access is stored on the user's Firestore profile document in the `users` collection. A normal admin has `role: "admin"`. A super-admin, where used operationally, has `role: "super_admin"` and should be limited to owner-level operators.

## Bootstrap the first admin

Preferred scripted flow:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json GOOGLE_CLOUD_PROJECT=<project-id> npm run admin:bootstrap -- --email admin@example.com --role admin --confirm-admin-bootstrap
```

You may use `--uid <firebase-auth-uid>` instead of `--email`. The script refuses to run in CI and refuses to run without explicit confirmation and Firebase Admin credentials.

## Verify admin access

1. Sign in as the admin user.
2. Confirm the user profile document exists at `users/<uid>`.
3. Confirm `role` is `admin` or `super_admin` and `profileComplete` is true.
4. Open the admin dashboard and verify privileged collections load.

## Remove admin access

Use the Firebase Console or the bootstrap script with `--role member` after confirming another admin remains. Never remove the last working admin until a replacement has signed in and verified access.

## Avoid lockout

Keep at least two verified admins during launch week. Test role changes in staging first. Do not rely on client-side edits for roles; use the Firebase Console or Admin SDK with audited operator credentials.
