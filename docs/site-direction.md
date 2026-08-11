# Where the site goes next

Written 2026-08-10, from a read of nine Kansas City competitors and the
current crop of best-converting service-company sites in the US.

Nothing in this document is built. It is a set of proposals with the reasoning
attached, so the ones that are wrong can be argued with rather than discovered
later.

---

## Part 1 — What the competitors are actually doing

### Kansas City detailing

Four local operators publish full menus. The relevant ones:

| | Their price | Ours |
|---|---|---|
| Eye Detail — Complete Package (2.5 hr) | $299 | Full detail $269 |
| Eye Detail — Showroom Package (3.5 hr) | $399 | — |
| Eye Detail — Premium Interior (2 hr) | $175 | Interior $199 |
| KC Pro — Interior, sedan | $185 | Interior $199 |
| KC Pro — Interior, large SUV | $235 | $199 + $55 size |
| Eye Detail — Exterior Detail (1.5 hr) | $175 | Express wash $119 |

Read that table the right way round. After the August repricing we are no
longer cheap — we are mid-market and slightly under on the full detail, which
is the correct place for a company with no reviews. The one line still well
under the market is the express wash, and that is defensible: an hour of work
should not cost $175.

Three things they all do that we did not:

**Duration published next to every price.** Eye Detail lists hours on every
line, including add-ons down to "15 min". It is a confidence signal — you only
publish a duration you can hit. We have durations on packages and now publish
them; they are missing from add-ons.

**Multi-vehicle discount.** Eye Detail cuts roughly $50 a vehicle for two or
more at the same address. This is now built (second car, same package, 20%
off). It is the highest-margin thing on the site: the drive, the setup and the
pack-down are already paid for.

**A $50 deposit to hold the slot.** Every one of them takes one. We take
nothing at booking and advertise it, which is a genuine differentiator for a
company nobody has heard of — and it is also how a two-person operation loses
half a day to a no-show. Recommendation below.

### Kansas City house cleaning

The published bands: standard recurring $120–250 a visit, deep clean $200–450,
move-out $250–700, and $25–50 an hour per cleaner. Our $175 / $280 / $350 sit
inside all three, low-to-middle. Move-out at $350 is at the bottom of a very
wide band, which is right for now and worth revisiting after five of them.

The frequency ladder locally is 15% weekly / 10% bi-weekly / 5% monthly. We
run 10 / 5 / 0. That is deliberate and should stay: a weekly standard clean is
five person-hours, and at 15% off $175 the best customer in the book becomes
the worst-paying work in it. Raise it when routes are dense enough to fund it.

**The one real mispricing found:** Airbnb turnover. Short-term-rental
turnovers bill 30–50% above the equivalent residential clean in every market
where the rate is published, and KC runs $85–130 for a one-bed up to $180–250
for a three-bed. We were at $120 flat for work that is harder than a standard
clean — linens, restock, damage report, fixed window. Now $150 and scaling by
bedroom. This is fixed.

### What nobody in Kansas City publishes

No competitor found publishes: what they will not do, what a job excludes,
what their equipment actually is, or why a price is what it is.

That is the opening, and it is the one this site is already structurally built
for.

---

## Part 2 — The positioning that follows

Lunova cannot compete on the two things the franchises lead with. The Maids,
Molly Maid and Two Maids all lead with insurance badges and four-figure review
counts. We have neither, and will not have the reviews for months.

What we have that they structurally cannot copy:

- **Two named people.** Every conversion roundup credits founder-photo sites
  with lifting bookings. A franchise cannot put a face on a page because the
  face changes per franchisee. We can, and currently do not — there are no
  photographs of either owner anywhere on the site.
- **Published prices with durations and exclusions.** Most local sites make
  you fill in a form to learn anything.
- **Published honesty.** The site already says it is uninsured, says it has no
  reviews, says the bins are scrubbed by hand and not pressure washed, says
  which detailing jobs it turns down. That is unusual enough to be the
  positioning rather than an embarrassment to be minimised.

**The line: the only Kansas City cleaner and detailer that tells you the price,
the time, and what it will not do — before you call.**

---

## Part 3 — Structural proposals

Ordered by expected return per hour of work.

### 3.1 Put the estimator in the first viewport — recommended

The single most consistent finding across the conversion roundups. Two Maids
runs dual hero CTAs, "Book Your Cleaning" and "Calculate Your Price", for the
two buyer stages. Tidy Casa's room-count selector *is* the price — there is no
separate estimate step. eMaids puts a working booking engine above the fold.

Ours is one screen and a marquee below the hero on service pages, and absent
from the homepage entirely. A visitor who wants a number has to scroll past a
photo and a scrolling text band to find one.

Proposal: a compact three-control estimator inside the hero on `/`,
`/services/residential-cleaning` and `/services/auto-detailing` — bedrooms +
bathrooms + condition for cleaning, package + vehicle size for detailing — that
shows a live number and hands off to the wizard with the answers already in the
URL. The handoff already works and is under test; this is a placement change,
not new pricing.

### 3.2 A real price book at `/prices` — recommended

Every published price on one page: both services, every tier, every add-on,
duration on each, exclusions on each, and the discount rules stated plainly.

Two reasons. Commercially, "house cleaning prices kansas city" is the highest
intent query in this market and every result is a vague blog post — including
ours. A page that answers it completely outranks a page that dances around it.
Operationally, it is the page to text someone who asks "how much for…", and it
is the page that stops the two of you quoting different numbers.

`scripts/check-prices.mjs` already forbids dollar literals outside the
catalogue, so this page cannot drift from the wizard.

### 3.3 `/for-hosts` — short-term rental and small property managers

The strongest B2B fit for two people. STR turnovers bill above residential, the
work is repeatable, the same property every time gets faster, and one host with
three units is worth more than fifteen one-off deep cleans and costs a fraction
of the marketing.

The page needs to answer host questions specifically: turnaround window,
same-day capability, linen handling, restocking, damage reporting, what happens
when a guest checks out late. Distinct enough from the cleaning page to rank on
its own, and it is a page a host will actually forward to another host.

Pair with the pricing already built: turnover from $150, scaling by bedroom.

### 3.4 Faces and names — recommended, blocked on the user

Two photographs and roughly 150 words each. Who you are, what you did before,
why this. This is the highest-trust element available to a company with no
reviews, it costs nothing but a photo, and it is the one thing a franchise
cannot answer back.

### 3.5 Seasonal packages — cheap, high return

Eye Detail sells "Summer Shine" and "Winter Ready" at $225 each. Same work,
seasonal framing, sells twice a year to the same list.

Missouri gives a genuine reason rather than a marketing one: road salt is
corrosive and sits in wheel arches and door sills through February, and spring
pollen bonds to warm clear coat. A "Winter Salt Strip" in March and a "Spring
Reset" in May are real jobs with real justifications, and they are a reason to
email the existing customer list — which is otherwise a list nobody ever
contacts twice.

### 3.6 A guarantee with a number in it

MoreHands promises "$100 if we cancel on you". Tidy Casa runs a "200%
guarantee". Ours is the "Done-Right Promise", which is a name, not a promise.

Proposal: "Tell us within 24 hours and we come back and fix it free. If we
cancel on you with less than 24 hours' notice, your next clean is half price."
Symmetrical with the $25 late-cancellation fee already charged, which currently
runs one way only. Cheap to honour, and a specific number is worth more than a
paragraph of reassurance.

### 3.7 Before/after — blocked on photography

The single most persuasive element on every detailing site reviewed, and the
one thing detailing sells better than any other trade. `WorkGallery` and the
before/after slider component are already built and already wired. There are no
photographs.

This should become an SOP rather than a project: same corner, same angle,
before and after, every job, on the phone. Ten jobs and the gallery fills
itself. It is the highest-value thing that can be done without writing code.

### 3.8 A "what we don't do" page — worth considering

Unusual, and it fits everything above. One page: the five services withdrawn
and why, the detailing jobs turned down (multi-stage correction, ceramic
coating, set-in oil), the cleaning jobs turned down, and what to call instead.

The argument for it: it converts the biggest weakness — a small menu — into the
reason to trust the rest of the site. The argument against: it invites a
visitor to leave. Worth building only if the referrals are real, and they
should be — a plumber you sent someone to is a plumber who sends someone back.

### 3.9 Deposits — recommended against, for now

Every competitor takes $50. Do not, yet. "Nothing charged at booking" is
currently one of the few reasons to risk an unknown company, and it is in the
meta description of every page.

Revisit the moment no-shows cost more than the bookings the policy wins —
which will be visible in the calendar, not in an argument. Until then, a
confirmation text the day before is most of the benefit at none of the cost.

---

## Part 4 — What is not being proposed, and why

**More services.** The research question was whether the menu has gaps. It does
not, at two people. Every gap found was in the add-on menu, and those are
built. Adding a sixth way to spend a Saturday is the opposite of what the
last month of work was for.

**Ozone, ceramic coating, paint correction.** Still no. Ozone costs a slot;
the other two are multi-year promises from someone who has not done one.

**A chat widget.** Molly Maid runs one with a "book in under 2 minutes"
promise. That promise is staffed. Ours would be answered from a ladder, and an
unanswered chat widget is worse than no chat widget.

**A blog cadence.** Four guides that each answer a real commercial query beat
twenty that do not. The next one should be the STR turnover guide, and only
once `/for-hosts` exists to point it at.

---

## Part 5 — Suggested order

Nothing here is started. This is the order the reasoning supports:

1. Photograph the first ten jobs. No code, unblocks 3.7, starts today.
2. `/prices` (3.2) — highest commercial-intent page on the site.
3. Estimator into the hero (3.1) — placement change, existing components.
4. Guarantee with a number (3.6) — a copy change and a flag.
5. Faces and names (3.4) — waiting on two photographs.
6. `/for-hosts` (3.3) — new page, new audience, needs the STR guide behind it.
7. Seasonal packages (3.5) — build in January, not August.
8. `/what-we-dont-do` (3.8) — only with real referral partners behind it.

Deposits (3.9) and any sixth service are decisions to revisit with a calendar
in front of you, not now.
