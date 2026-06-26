# Firebase Production Setup

Use a dedicated production Firebase project. Do not reuse local or staging data.

## Steps

1. Create or select the production Firebase project.
2. Register a Web app and copy the Web config into the deployment platform environment variables listed in `.env.example`.
3. Enable Firebase Authentication.
4. Enable Google sign-in.
5. Enable email/password sign-in only if NumSum Labs intends to support it at launch.
6. Enable Cloud Firestore in production mode.
7. Deploy rules: `firebase deploy --only firestore:rules`.
8. Deploy indexes: `firebase deploy --only firestore:indexes`.
9. In Authentication settings, add authorized domains for the production domain, staging domain, and approved preview domains.
10. Configure the deployment domain in Vercel or Firebase Hosting, depending on the selected platform.
11. Create the first admin using `docs/admin-setup.md`.
12. Sign in as a normal user and verify `/profile` creates the user profile document.
13. Verify incomplete profiles are blocked from member-only routes until `profileComplete` is true.
14. Verify public pages are readable while private/admin collections remain protected.

No real secrets belong in this document.

## Deployment commands

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

Run these commands from a machine authenticated to the correct Firebase project. Confirm `firebase use` before deploying.
