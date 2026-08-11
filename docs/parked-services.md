# Parked services: what came off the site, and how to put one back

Written 2026-08-10, when the site went from eight service lines to two.

Nothing here is lost. Every line of copy, every price, every hero photo and
every page component for all five withdrawn services still exists, in full, on
a branch that is pushed to GitHub. Relaunching a line is a restore and a
review, not a rewrite.

---

## What was withdrawn

| Service | URL it used to live at | Now |
|---|---|---|
| Junk removal | `/junk-removal` | 301 → `/` |
| Landscaping | `/landscaping` | 301 → `/` |
| Power washing | `/services/power-washing` | 301 → `/` |
| Window cleaning | `/services/window-cleaning` | 301 → `/` |
| Commercial cleaning | `/services/commercial-cleaning` | 301 → `/` |
| Power washing explainer (guide) | `/guides/power-washing-vs-pressure-washing` | 301 → `/guides` |

Still sold, and unaffected: residential cleaning, mobile auto detailing, and
trash bin cleaning as an add-on.

## Where the code is

**Branch: `legacy-full-services`** — pushed to `origin`. It is `main` as it
stood at commit `c67fc23`, before any of this work. It is a snapshot, not a
maintained branch; do not commit to it.

```bash
git fetch origin
git show legacy-full-services:src/app/pages/JunkRemoval.tsx
```

The five page components, their catalogue entries, their package tiers and
qualifying questions, their service policies, their galleries, their themes and
the power-washing guide are all on it, intact.

## Why they came down instead of staying up unlinked

Leaving a page up but unlinked does not take it out of service. It stays in
Google's index, it stays in anyone's bookmarks, and it keeps its booking form.
The failure mode is not a wasted pageview — it is a real person filling in a
real form for work that cannot be delivered, which costs the referral as well
as the job.

There was a middle option — keep each page and swap its booking form for a
"coming soon, join the list" capture — and it was built and shipped briefly.
It only makes sense if somebody actually works the list when a line comes back.
With two people and no line coming back inside a year, it was a promise with
nobody behind it, so it went too.

The cost of this decision is real and worth naming: those pages had rankings,
and the rankings are gone. A 301 to the homepage passes almost nothing when the
destination is not about the same topic — Google treats it as a soft 404. When
power washing comes back it starts from zero, and that is months. That cost was
accepted deliberately, because the alternative was taking bookings for work
nobody could do.

## Putting a line back

The order matters. Steps 1–3 are the business; skip them and the site is
lying again.

**1. Confirm it can actually be delivered.** Equipment owned, not planned. One
job done properly, ideally for free, before anyone is charged for it. For
anything that touches a customer's property irreversibly — a pressure washer on
vinyl siding, a mower near irrigation heads — that means having done it enough
to know what it looks like when it goes wrong.

**2. Confirm it is covered.** General liability is per-line. A policy written
for house cleaning does not cover a driveway you etched or a window you broke.
Ask the broker explicitly about the new line and get it in writing.

**3. Confirm the disposal or licensing chain.** Junk removal needs a transfer
station account. Some cities in the metro license some of these trades
separately — Kansas City MO and the Johnson County cities each have their own
occupational requirements, and that is a per-city check, not a one-time one.

**4. Restore the code.**

```bash
# The page component
git checkout legacy-full-services -- src/app/pages/JunkRemoval.tsx

# Then, by hand, restore that service's entries in:
#   src/app/constants/services.ts        catalogue entry + the ServiceId union
#   src/app/constants/serviceDetails.ts  packages, questions, add-ons
#   src/app/constants/servicePolicy.ts   site needs, prep, hard refusals
#   src/app/constants/theme.ts           department colours
#   src/app/constants/serviceGallery.ts  photos, if any exist
#   src/app/routeConfig.ts               the route
#   src/app/routeModules.ts              the lazy import
```

The `ServiceId` union in `services.ts` is the keystone. Widen it first, then
run `npx tsc --noEmit` — the compiler will list every other place that needs
the id, which is how the takedown was done in reverse.

**5. Delete its redirect from `vercel.json`.** In the same commit that restores
the route. A live route behind a 301 is a page nobody can reach and everybody
assumes is working.

**6. Reprice before publishing.** The restored prices are from before August
2026 and most of them were set before anyone had costed a job. Check them
against `docs/business-readiness.md`, which does the arithmetic in dollars per
labour-hour rather than per job — the only number that matters when the labour
is you.

**7. Update the catch-all copy.** `scripts/generate-llms.mjs` and the homepage
FAQ both describe the line-up in prose. Neither is derived from the catalogue.

Then `npm run build`. `check-seo`, `check-prices` and `check-estimator` all run
before anything renders, and between them they will catch a hardcoded price, a
missing meta description and an estimator that quotes zero.

## Bring them back one at a time

Not all five at once. Each line needs its own equipment, its own insurance
conversation, its own first job done for free, and its own place in a calendar
that two people are already filling. Adding one at a time is also the only way
to tell whether it earns its keep — five at once and the answer is just
"we're busier and we don't know why".

The order the business case supports, on current facts:

1. **Junk removal.** Nearest to what is already owned (truck, trailer) and
   already known — it is prior experience, not a new trade. Needs a disposal
   account and a dump-fee model, and both are solvable in a week.
2. **Power washing.** Highest revenue per hour of the five, but needs a machine
   that does not exist yet and is the easiest one to damage a house with.
3. **Window cleaning.** Pairs naturally with cleaning, low equipment cost, but
   anything above ground floor is a different risk category and a different
   insurance conversation.
4. **Landscaping.** The push mower is not commercial equipment, and lawn care
   is a route business with the same density problem as bin cleaning.
5. **Commercial cleaning.** Last, and not because it is hardest — because it is
   a nightly contract, and a nightly contract cannot be staffed by two people
   who also work days.
