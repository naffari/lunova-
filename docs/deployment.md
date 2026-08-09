# Deployment

Vercel, from `main`. `vercel.json` is the source of truth for build and routing.

## Do not put comments in vercel.json

Vercel validates the file against
[its published schema](https://openapi.vercel.sh/vercel.json), and that schema
sets `additionalProperties: false` at the top level **and** on every entry inside
`rewrites` and `headers`. An unknown key fails the build before it starts, with
no compile output to read.

Allowed keys are exactly:

- `rewrites[]` — `source`, `destination`, `transforms`, `has`, `missing`, `statusCode`, `env`, `respectOriginCacheControl`
- `headers[]` — `source`, `headers`, `has`, `missing`

JSON has no comment syntax and Vercel does not accept a `comment` field. Rationale
for each rule lives here instead.

## Why each rule exists

**`buildCommand: pnpm build`** — the build is three steps, not one: generate the
sitemap, build the client, build the SSR entry, then prerender every route to
static HTML. The default Vite preset would only run `vite build` and skip the
prerender, which is what makes the site crawlable.

**No `rewrites` at all** — this is deliberate and was a change. There used to be
a catch-all `/((?!api/).*) → /index.html` SPA fallback, which meant an unmatched
URL rendered the in-app 404 page with an HTTP **200**. Google reads that as a
soft 404 and can leave the URL indexed. It got worse when city pages landed:
`/service-areas/:city` is a pattern, so every mistyped slug hit that path.

Now every route in `ROUTE_CONFIG` is prerendered to its own
`dist/<path>/index.html`, and `scripts/prerender.mjs` also writes `dist/404.html`.
Vercel checks the filesystem first, serves the real page when there is one, and
falls back to `404.html` **with a 404 status** when there is not.

The tradeoff: **a route that is not prerendered will hard-404 on a direct load.**
If you add one, set `prerender: true` in `src/app/routeConfig.ts` rather than
restoring the rewrite. Dynamic patterns need expanding in `expandPrerenderPaths`,
the way `CITY_SLUGS` already is.

**`/assets/` immutable for a year** — Vite content-hashes these filenames, so a
changed file is a changed URL. Safe to cache forever.

**`/images/` only one day** — images are **not** content-hashed. `pnpm images`
regenerates the same filenames, so `immutable` would pin returning visitors to an
old photo for up to a year with no way to purge their browser. `stale-while-revalidate`
keeps it CDN-fast without losing correctability. Do not raise this without adding
content hashes to the image filenames first.

**`cleanUrls` / `trailingSlash: false`** — one canonical URL per page, matching
the `<link rel="canonical">` that `Seo.tsx` emits.

## Node version

Build scripts run on Node. `engines.node` and `.nvmrc` pin >= 20.11 / 22, but the
scripts deliberately avoid `import.meta.dirname` (Node >= 20.11 only) in favour of
`fileURLToPath(import.meta.url)`, so they work on any ESM-capable runtime even if
the Vercel project's Node version is set lower than the pin.

## Serverless functions

Everything under `api/` compiles to ESM. **Relative imports must carry a `.js`
extension** (`from "./_crm.js"`, not `from "./_crm"`) or Node fails to resolve
them at runtime — the build passes and the endpoint 500s. See commit `3582b30`.

## Environment variables

Set in the Vercel project, not in the repo. Every one of them degrades to a
warning rather than an error, so a missing key never turns a captured lead into
an error screen. That also means a missing key is silent, so check them here
first when something "works but nothing arrives".

| Variable | Used by | Missing means |
|---|---|---|
| `RESEND_API_KEY` | all three form endpoints | No email at all. Bookings survive only if the CRM key is set. |
| `WEBSITE_API_KEY` | `api/_crm.ts` | No CRM lead, and `/api/pricing` returns 503. Bookings survive by email. |
| `CRM_API_URL` | `api/_crm.ts` | Defaults to `https://crm.lunovaservices.com`. |
| `BOOKING_INBOX` | `api/_mail.ts` | Falls back to `EMAIL` in `constants/contact.ts`, currently a personal address. |
| `REVIEW_REQUEST_TOKEN` | `api/review-request.ts` | Endpoint returns 503. Unset is disabled, never unprotected. |

Both `bookings@lunovaservices.com` and `hello@lunovaservices.com` must be
verified senders on the domain in Resend, or customer mail silently lands in
spam.

## Sending a review request

The website cannot know when a job finishes, so this is a hook the CRM (or a
person, or a Zap) calls once a job is marked complete. Send it the day after,
not the same evening.

```bash
curl -X POST https://www.lunovaservices.com/api/review-request \
  -H "Authorization: Bearer $REVIEW_REQUEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Dana Reyes","email":"dana@example.com","service":"Deep clean"}'
```

The response includes `usedDirectReviewLink`. It stays `false` until `PLACE_ID`
is filled in `src/app/constants/business.ts`; until then the email links to the
profile page rather than straight to the review form, which converts worse.

## Rolling back

Either works, nothing here touches a database or runs a migration:

- Promote the previous deployment in the Vercel dashboard — instant, no git.
- `git revert -m 1 <merge sha>` — slower, stays in history.

## Verifying a deploy

```
pnpm typecheck        # no errors. Covers src AND api (see tsconfig.api.json)
pnpm build            # ends "Prerendered 27 routes to static HTML, plus 404.html."
pnpm check:prices     # reports service-page vs booking-flow price drift
```

Then confirm a deep link serves its own metadata rather than the homepage's —
`vite preview` cannot test this because it does blanket SPA fallback. Use any
filesystem-first static server:

```
cd dist && python -m http.server 4321
curl -s http://localhost:4321/services/power-washing/ | grep '<title'
```

It should return the Power Washing title, not the Lunova homepage title.
