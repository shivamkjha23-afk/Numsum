# Founder Admin Verification Checklist

Do not check an item until it has been verified on the deployed site or target Firebase project.

## Founder account and profile

- [ ] Founder signs in with a real email address.
- [ ] Founder profile document exists at `users/<firebase-auth-uid>`.
- [ ] Founder profile has `role = "super_admin"`.
- [ ] Founder profile has `status = "active"`.
- [ ] Founder profile has `profileComplete = true`.
- [ ] Founder logs out and logs back in after the profile is confirmed.

## Founder admin access

- [ ] Founder can open `/admin`.
- [ ] Founder can open `/admin/problems`.
- [ ] Founder can open `/admin/questionnaires`.
- [ ] Founder can open `/admin/knowledge`.
- [ ] Founder can open `/admin/sops`.
- [ ] Founder can open `/admin/research`.
- [ ] Founder can open `/admin/pilots`.
- [ ] Founder can open `/admin/competitions`.
- [ ] Founder can open `/admin/governance`.
- [ ] Founder can open `/admin/objectives`.
- [ ] Founder can open `/admin/execution`.
- [ ] Founder can open `/admin/contributions`.

## Access denial checks

- [ ] Public/incognito user cannot open `/admin`.
- [ ] Logged-in non-admin cannot open `/admin`.

## Notes

- Use the real founder account only. Do not create fake seeded users for this launch path.
- If any admin route fails for the founder, pause soft launch until the profile, Firestore rules, indexes, and deployment environment are checked.

## User lifecycle and role assignment update

See [User Lifecycle and Role Management](./user-lifecycle-and-role-management.md) for the canonical signup profile creation flow, profile completion redirect behavior, `user_role_requests` review queue, `/admin/users` role assignment page, and super-admin safety rules.
