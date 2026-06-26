# Production Launch Checklist

Do not check an item until it has been verified in the target environment.

## Before deployment

- [ ] Merge latest `main`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Run `npm run test:rules` in CI or a dev environment with emulators.
- [ ] Deploy Firestore rules with `firebase deploy --only firestore:rules`.
- [ ] Deploy Firestore indexes with `firebase deploy --only firestore:indexes`.
- [ ] Configure deployment environment variables.
- [ ] Configure Firebase Auth providers.
- [ ] Configure authorized domains.
- [ ] Create first admin.
- [ ] Seed baseline documents.
- [ ] Verify public pages.
- [ ] Verify member signup and profile completion.
- [ ] Verify admin dashboard.
- [ ] Verify submit problem flow.
- [ ] Verify public/private access boundaries.

## After deployment

- [ ] Smoke test public pages.
- [ ] Smoke test login.
- [ ] Smoke test profile completion.
- [ ] Smoke test submit MSME challenge.
- [ ] Smoke test admin review.
- [ ] Smoke test public routes.
- [ ] Check browser console.
- [ ] Check deployment logs.
- [ ] Check Firestore permission errors.
- [ ] Check mobile layout.
