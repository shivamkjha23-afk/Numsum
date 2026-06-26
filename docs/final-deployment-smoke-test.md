# Final Deployment Smoke Test Checklist

Run this checklist after deployment and before soft launch. Do not check an item until it has been verified in the deployed environment.

## Public/incognito checks

- [ ] Homepage loads.
- [ ] Homepage hero text appears correctly.
- [ ] Network visual appears below hero text, not awkwardly side-by-side.
- [ ] About page loads.
- [ ] Submit MSME challenge CTA works.
- [ ] Public challenges page loads.
- [ ] Knowledge page loads.
- [ ] SOP page loads.
- [ ] Research page loads.
- [ ] Competitions page loads.
- [ ] Pilots/impact page loads.
- [ ] Admin page is blocked.
- [ ] Dashboard page is blocked.
- [ ] No fake metrics appear.
- [ ] No internal/admin wording appears publicly.
- [ ] No community, organization, team-directory, or notifications links appear publicly.

## Founder admin checks

- [ ] Founder login works.
- [ ] `profileComplete` is true.
- [ ] `/admin` opens.
- [ ] Admin dashboard loads.
- [ ] Admin modules open.
- [ ] Create/edit basic records works.
- [ ] Publish/unpublish behavior works.
- [ ] Admin metadata is visible only to admin.

## Member/non-admin checks

- [ ] Non-admin login works.
- [ ] Incomplete profile redirects correctly.
- [ ] Completed profile can submit MSME challenge.
- [ ] Member cannot access admin.
- [ ] Member cannot publish own challenge.
- [ ] Member cannot see admin metadata.

## Mobile checks

- [ ] Homepage works.
- [ ] Hero text and network visual stack correctly.
- [ ] Navigation works.
- [ ] Submit challenge form works.
- [ ] Admin dashboard is usable enough for MVP.
- [ ] No major horizontal overflow.

## Runtime checks

- [ ] No major browser console errors.
- [ ] No unexpected Firebase permission-denied errors.
- [ ] No missing index errors on core pages.
- [ ] No hydration errors.
- [ ] No broken critical routes.
