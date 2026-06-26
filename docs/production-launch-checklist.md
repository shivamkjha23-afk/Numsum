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
- [ ] Deploy or run the app and have the founder sign in once with the founder email.
- [ ] Confirm the founder Firebase Auth user exists and copy the UID, or confirm the exact founder email.
- [ ] Run the admin bootstrap script with `--confirm-admin-bootstrap` to set the founder `role` to `super_admin` or `admin`.
- [ ] Have the founder log out and log back in.
- [ ] Verify `/admin` is visible and accessible to the founder.
- [ ] Verify the admin dashboard loads.
- [ ] Verify public visitors cannot access `/admin`.
- [ ] Verify a logged-in non-admin user cannot access `/admin`.
- [ ] Decide whether to skip the optional baseline seed and create starter content manually from the admin UI.
- [ ] If using the optional baseline seed, confirm it contains no fake users, fake MSME claims, fake success stories, or fake metrics before running it.
- [ ] Verify public pages.
- [ ] Verify member signup and profile completion.
- [ ] Verify submit problem flow.
- [ ] Verify public/private access boundaries.

## Founder manual starter-content path

The current launch path does not require multiple seeded test users or fake personas. After founder admin bootstrap, the founder may manually create real starter content from the admin interface:

- [ ] Default questionnaire template.
- [ ] Governance document.
- [ ] Objective target.
- [ ] Problem review for a real submitted problem.
- [ ] Knowledge item.
- [ ] SOP.
- [ ] Research item.
- [ ] Pilot.
- [ ] Competition draft.

## Minimal admin route verification

- [ ] `/admin`
- [ ] `/admin/problems`
- [ ] `/admin/questionnaires`
- [ ] `/admin/knowledge`
- [ ] `/admin/sops`
- [ ] `/admin/research`
- [ ] `/admin/pilots`
- [ ] `/admin/competitions`
- [ ] `/admin/governance`
- [ ] `/admin/objectives`
- [ ] `/admin/execution`
- [ ] `/admin/contributions`

## After deployment

- [ ] Smoke test public pages.
- [ ] Smoke test login.
- [ ] Smoke test profile completion.
- [ ] Smoke test submit MSME challenge.
- [ ] Smoke test founder admin review.
- [ ] Smoke test public routes.
- [ ] Check browser console.
- [ ] Check deployment logs.
- [ ] Check Firestore permission errors.
- [ ] Check mobile layout.
