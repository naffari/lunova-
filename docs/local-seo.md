# Local SEO: what the site does, and what only you can do

The site now carries the on-page half of local search. The other half lives
outside the repo and cannot be committed. This document is the split.

## Why any of this

For a business with a storefront, Google ranks local results on three things:
relevance, proximity and prominence. Lunova is a **service-area business**, with
no address and no map pin, so proximity mostly drops out and the weight shifts
to relevance and prominence.

The rough weighting of local ranking signals as of 2026:

| Signal group | Weight | Where it lives |
|---|---|---|
| Google Business Profile | ~32% | Off-site, you |
| On-page | ~19% | This repo |
| Reviews | ~16% | Off-site, you |
| Links | ~15% | Off-site, mostly you |
| Behavioral | ~8% | Both |
| Citations | ~7% | Off-site, you |

Roughly two thirds of the outcome is work that happens outside this codebase.
The site is necessary and not sufficient.

## What the site does now

- **12 city landing pages** at `/service-areas/<slug>`, prerendered to static
  HTML. Content lives in `src/app/constants/cities.ts`.
- **`/service-areas`** hub, linked from the main nav. The crawl entry point.
- **`/about`** and **`/contact`**, the E-E-A-T and NAP pages.
- **LocalBusiness JSON-LD** with a stable `@id`, `areaServed` as City nodes, a
  GeoCircle for the metro, `openingHoursSpecification`, the full service
  catalogue as an `OfferCatalog`, and `sameAs` pointing at the Business Profile.
  Built in `src/app/utils/structuredData.ts`.
- **Per-city Service schema**, one node per service a city page features, scoped
  to that city's coordinates.
- **robots.txt** explicitly allows AI training and retrieval crawlers.
- **Sitemap** with `lastmod`, regenerated from source on every build.

### The doorway-page rule

Google has demoted templated location pages since 2015. Twelve pages that differ
only by city name would take the whole `/service-areas` section down with them.

So: **every paragraph of substance on a city page comes from that city's own
record.** Its neighborhoods, its housing stock, its service mix, its FAQs. The
component is shared. The content is not. If you add a city and find yourself
copying another city's `localNotes` and changing the place name, stop. That page
is a liability rather than an asset. Either write real content for it or leave
the city out and let the ZIP checker cover it.

### Adding a city

Add one record to `SERVICE_CITIES` in `src/app/constants/cities.ts` and nothing
else. The route, the prerendered page, the sitemap entry, the footer link, the
ZIP lookup and the schema all derive from it.

## What only you can do

### 1. Google Business Profile, the biggest single lever

Roughly a third of local ranking weight. Non-negotiable items:

- Set the business as a **service-area business**, address hidden, with all 12
  cities listed. Do not list cities you do not serve. Google checks.
- **Primary category:** House Cleaning Service. Secondaries for junk removal,
  landscaping, pressure washing, window cleaning and car detailing.
- Fill the **Services** section completely, using the same names as
  `src/app/constants/services.ts`.
- **Photos.** Profiles with 100 or more consistently outperform those with
  fewer. Add them steadily rather than in one dump.
- **Post weekly.** Business activity is a ranking signal in its own right.
- Turn on **Q&A** and seed it with the questions from the city pages' FAQs.

Then paste the canonical Maps URL and the Place ID into `GOOGLE_BUSINESS` in
`src/app/constants/business.ts`. With the Place ID set, `hasMap` appears in the
schema and `REVIEW_URL` becomes a direct "leave a review" link.

### 2. Reviews, where velocity beats volume

Four fresh reviews a month outweigh fifty old ones. Concretely:

- Text `GOOGLE_BUSINESS.REVIEW_URL` to every customer the day the job finishes.
- **Reply to every review within 48 hours**, positive or negative.
- Ask customers to name the service and the city. "Best window cleaning in
  Overland Park" carries measurably more weight than five stars and no words.

Once real reviews exist, set `REVIEWS` in `src/app/constants/proof.ts` and wire
`aggregateRating` into `buildLocalBusinessSchema`. Google will **not** show stars
for self-hosted LocalBusiness ratings, which has been explicit policy for a
while. It still feeds AI Overviews, which is why it is worth adding anyway.

Do not fabricate reviews. The site is currently built to be honest about having
none, and getting caught costs more than the reviews were worth.

### 3. Citations and NAP consistency

Businesses with consistent NAP across 15 or more platforms are about 23% more
likely to appear in the Maps 3-pack. Across the top 20, about 3x more likely to
surface in AI-generated local recommendations.

The details must match **character for character** everywhere:

```
Lunova Services
(816) 315-1305
https://www.lunovaservices.com
```

Tier 1, do these first: Google Business Profile, Apple Business Connect, Bing
Places, Yelp, Facebook.
Tier 2: Better Business Bureau, Foursquare, Nextdoor, Yellow Pages, local
Chamber of Commerce.

Angi, Thumbtack and HomeAdvisor are worth claiming as **citations**. Contractor
sentiment on their paid lead products is broadly negative on cost per lead, so
treat them as listings rather than as a channel.

Also: `EMAIL` in `src/app/constants/contact.ts` is currently a personal Yahoo
address. It will appear on every listing you create. Change it to a domain
address before you start building citations, because changing it afterwards
means editing every listing by hand.

### 4. AI search

An increasing share of "who cleans houses in Overland Park" is answered inside
an assistant rather than on a results page, and where AI Overviews appear they
cut click-through on the top organic result by up to 58%.

What earns a citation: answer-first content, concrete verifiable numbers, and a
named business entity. The city pages are written that way. The `intro` field of
each city record is built to stand alone as a liftable answer. Google's AI
surfaces additionally draw on the Business Profile directly, which is another
reason item 1 is item 1.

## Verifying changes

```bash
pnpm typecheck
pnpm build          # regenerates sitemap, prerenders every route
```

The build prints one line per prerendered URL, 27 as of writing, 12 of them city
pages. After deploying, check the schema with Google's Rich Results Test and
submit the sitemap in Search Console.

## Things deliberately not done

- **No fabricated street address.** Google cross-checks schema against the
  Business Profile, and a service-area business inventing a storefront address
  conflicts with itself.
- **No `aggregateRating`** until reviews exist.
- **No email in the JSON-LD.** It earns nothing in structured data and would
  undo the obfuscation in `src/app/utils/obfuscate.ts`.
- **No blog.** Worth adding for long-tail and AI citations, but a neglected blog
  is worse than none. Only start if posts will actually keep coming.
