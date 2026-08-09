# SEO: what's left, and why it isn't in the code

Everything in this file came out of the August 2026 third-party audit and
**cannot be fixed by changing this repo.** It needs a DNS record, a Google
account, a camera, or a decision only the owner can make. Ordered by what
actually moves rankings.

The code-side items from that audit are done — see the notes at the bottom for
what changed and how to verify it.

---

## 0. Show up when someone searches "Lunova Services" — do this first

This is the one that pays this week, and **none of it can be done from the
codebase.** A site does not appear in Google because it exists; it appears
because Google has crawled it and has a reason to believe it is the answer.

Work through these in order. Total time: about an hour.

**a. Google Business Profile.** For a local service business this outranks
everything else combined. A brand search for "Lunova Services" should return a
map panel with your phone number and hours, and that panel comes from here, not
from the website.

1. Create or claim the profile at <https://business.google.com>.
2. Set it up as a **service-area business** — no storefront address, service
   area set to the Kansas City metro. This matches the site's schema, which
   deliberately carries locality and region but no street line.
3. Name, phone and hours must match `src/app/constants/contact.ts` and
   `OPENING_HOURS` in `business.ts` **character for character**. A mismatch is
   the most common reason a local business fails to consolidate into one entity
   in Google's index.
4. Complete verification (postcard, phone or video, depending on what they
   offer). Nothing ranks until this is done.
5. Then do §2 below and paste the Place ID into the code.

**b. Google Search Console.** This is how you get crawled quickly instead of
eventually.

1. Add the property at <https://search.google.com/search-console>. Use the
   **Domain** property type and verify with a DNS TXT record — it covers www,
   apex and both protocols in one go.
2. Submit the sitemap: `https://www.lunovaservices.com/sitemap.xml`. It is
   regenerated on every build and currently lists 32 URLs.
3. Use **URL Inspection → Request indexing** on the homepage, `/book`, and
   `/contact`. That is a queue jump, not a guarantee, but it usually turns
   weeks into days.
4. Check **Coverage** a few days later for anything excluded, and **Links** to
   watch the backlink profile.

**c. Bing Webmaster Tools.** <https://www.bing.com/webmasters> — import
directly from Search Console, it takes about two minutes. Bing feeds DuckDuckGo
and, increasingly, ChatGPT's web results.

**d. Say the name out loud everywhere else.** Google confirms an entity by
seeing it described consistently in more than one place. Same name, same phone,
same service area on the Business Profile, Bing Places, Apple Business Connect,
Yelp, and any invoice or vehicle livery. Consistency beats volume.

### What the site already does for brand search

Done in code, no action needed:

- Brand first in the homepage `<title>`, and the company name now appears in
  the opening line of body copy rather than only inside the logo image.
- `alternateName` on the Organization, LocalBusiness and WebSite schema, so
  "Lunova", "Lunova KC" and "Lunova Cleaning" resolve to the same entity —
  see `ALTERNATE_NAMES` in `src/app/constants/business.ts`.
- One `@id` shared across every schema block sitewide, so 32 pages describe one
  business rather than 32 similar ones.
- Every page prerendered to static HTML, so a crawler that does not run
  JavaScript still sees the content and the metadata.

---

## 1. Backlinks — the real problem (High priority)

The audit found **3 backlinks from 1 referring domain**, and that one domain is
a Russian redirect spam site (`8pw.ru`). That is effectively zero authority, and
it is the single biggest reason this site will not rank for anything
competitive no matter how good the on-page work is.

**On removing that spam link:** you can't, and neither can anyone else except
whoever runs `8pw.ru`. A backlink is a link on *their* server; there is no
mechanism to delete it from here. The only lever is Google's disavow tool, which
does not remove the link either — it tells Google not to count it.
`docs/disavow.txt` is prepared and ready to upload, but read the header first:
Google's guidance is that most sites should never use it, and at this volume the
link is not doing damage. **The problem is having no good links, not having one
bad one.** Spend the effort below instead.

What works for a local service business, roughly in order of return per hour
spent:

- **Local citations.** Get the business listed with identical name, phone and
  service area on: Google Business Profile (see §2), Bing Places, Apple Business
  Connect, Yelp, Angi, Thumbtack, Nextdoor, BBB, and the Kansas City and
  Overland Park chambers of commerce. Consistency matters more than volume — the
  NAP has to match `src/app/constants/contact.ts` character for character.
- **Supplier and partner links.** Equipment suppliers, the insurer, any trade
  association, any franchise-adjacent network. These are the easiest real links
  a new company gets.
- **Local sponsorship.** A youth sports team, a school fundraiser, a
  neighbourhood association. Usually gets a link from a `.org` that nobody else
  in the trade has.
- **Real estate agents and property managers.** They need move-out cleaners
  constantly, they have websites, and a "who we use" page is a normal thing for
  them to publish.

Do not buy links, and do not use a service offering hundreds of directory
submissions. That profile is what a manual action looks like.

## 2. Google Business Profile

`GOOGLE_BUSINESS.PLACE_ID` in `src/app/constants/business.ts` is empty. Fill it
and two things switch on automatically:

- `hasMap` appears in the LocalBusiness schema, resolving straight to the profile.
- `GOOGLE_BUSINESS.REVIEW_URL` becomes a direct "leave a review" link instead of
  falling back to the share shortener. That is the link to text a customer after
  a job, and review velocity is a large share of local ranking weight.

Find the ID at
<https://developers.google.com/maps/documentation/places/web-service/place-id>,
then paste it into that constant. One-line change, no other edits needed.

While you are in there: confirm the opening hours in `OPENING_HOURS` match the
profile exactly. There is a `TODO(before launch)` on that constant because
nobody has verified it, and Google cross-checks hours against the profile.

## 3. Reviews

There are none, and the site correctly refuses to invent any — see the comment
at the top of `src/app/constants/proof.ts`. The whole trust architecture
(`TestimonialsSection`, `ProofStrip`, the named guarantee) is built to switch
over the moment real reviews exist:

1. Set `REVIEWS.rating` and `REVIEWS.count` in `src/app/constants/proof.ts`.
2. Add entries to `TESTIMONIALS` in `src/app/components/TestimonialsSection.tsx`.

Both are data-only changes. Nothing needs rebuilding.

## 4. Job photography — still the biggest visible gap

`assets-src/work/` contains a README and nothing else, so
`src/app/constants/workManifest.ts` is empty and the "What done looks like"
section renders nothing on every service page. Four galleries are already
declared in `src/app/constants/serviceGallery.ts` and are waiting on files,
including the power-washing before/after slider the page copy is written around.

To publish photos:

```
assets-src/work/<service-key>/<name>.jpg     # service-key: power-washing, landscaping, …
pnpm images                                   # generates variants + rewrites workManifest.ts
```

The `name` must match the `file` field in `serviceGallery.ts`. For power washing
that means `driveway-before.jpg` and `driveway-after.jpg`.

**Do not flip `own: true` on a photo that is not a real Lunova job.** With no
reviews yet, a reverse-image hit on a stock photo would cost the credibility of
every other claim on the site.

## 5. SPF record (DNS)

The domain has a valid DMARC record (`v=DMARC1; p=none;`) but **no SPF record**.
Booking confirmations and review requests go out through Resend, so without SPF
a share of them will land in spam or be rejected outright.

Add a TXT record on the root domain:

```
v=spf1 include:_spf.resend.com ~all
```

Then verify the sending domain inside Resend, which will also give you the DKIM
records to add. Once both are in place and passing, consider tightening DMARC
from `p=none` to `p=quarantine`.

## 6. Social profiles

The audit flags no linked Facebook, Instagram, X, LinkedIn or YouTube. Two
things to know before treating that as a task list:

- The direct SEO value of *having* profiles is close to nil. The value is that
  each one is a `sameAs` entry that helps Google consolidate the entity, and for
  a home-services business, **Facebook and Instagram are where the job photos
  actually earn work**. The other three are not worth the effort here.
- Once a profile exists and its name and phone match `contact.ts` exactly, add
  its URL to `SAME_AS` in `src/app/constants/business.ts`. It flows into the
  schema automatically. Do not add a URL for a profile that is unclaimed or
  inconsistent — a NAP conflict does more damage than a missing link.

## 7. Facebook Pixel — recommend skipping for now

The audit suggests installing one. Only worth it if you are actually going to
run Facebook ads. Until then it is a third-party script on every page, a real
consent obligation, and a measurable performance cost, in exchange for
retargeting data you have no way to use.

If you do start running ads, load it through
`src/app/components/common/Analytics.tsx` and gate it on
`getConsent() === "granted"` — a pixel *is* the kind of tracking that needs
prior consent, unlike the cookieless analytics that component loads by default.

## 8. Apex → www redirect

The audit measured ~0.63s of mobile load time lost to "multiple page
redirects", which is `lunovaservices.com` → `www.lunovaservices.com` → HTTPS.
This is configured in the Vercel dashboard under Project → Domains, not in
`vercel.json`: set `www.lunovaservices.com` as the primary domain and the apex
as a redirect to it. Make sure the apex redirects **straight to the HTTPS www
URL** in one hop rather than chaining.

---

## What was already fixed in the repo

For reference, so nobody re-does it:

| Audit finding | Where it was fixed |
| --- | --- |
| Meta description 180 chars | Rewritten; `scripts/check-seo.mjs` now fails the build past 160 |
| No analytics detected | `Analytics.tsx` — Umami is cookieless, so it loads by default with an opt-out, instead of only after an "Accept" nobody clicked |
| No Local Business schema | `structuredData.ts` — `@type` is now `["LocalBusiness", "HomeAndConstructionBusiness"]` |
| Missing business address | `structuredData.ts` — `PostalAddress` with locality and region, no street line (the correct shape for a service-area business) |
| No llms.txt | Generated by `scripts/generate-llms.mjs` on every build |
| Poor mobile PageSpeed / CLS 0.40 | Fonts self-hosted and preloaded instead of a render-blocking Google Fonts stylesheet; hero image aspect ratios corrected |
| Thin content, no keyword coverage | Four long-form guides at `/guides`, targeting the highest-volume gaps the audit identified |
| `/blog` listed as a crawled URL | 308 redirect to `/guides` in `vercel.json` |

Two audit items were deliberately **not** actioned:

- **"Remove inline styles."** True, and it is the largest piece of technical
  debt in the frontend — roughly 400 inline `style={{}}` objects that should be
  Tailwind tokens, which `src/styles/theme.css` already defines. It is a
  multi-day refactor with real regression risk across every page, and its SEO
  impact is approximately zero. Worth doing; not worth doing under an SEO
  heading.
- **"Update link URLs to be more readable."** This refers to `/book?service=X`.
  Those are booking-funnel URLs, not landing pages, and `Seo.tsx` already
  canonicalises every variant to `/book`, so there is no duplicate-content
  exposure. No change needed.
