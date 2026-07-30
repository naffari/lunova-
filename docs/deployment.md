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

**`rewrites` → `/index.html`** — the SPA fallback for routes that are *not*
prerendered: `/blog/:slug` for posts added after a build, and anything unmatched
so the in-app 404 renders. Prerendered paths resolve to their own
`dist/<path>/index.html` first, because Vercel checks the filesystem before
applying rewrites. `(?!api/)` keeps the serverless functions out of it.

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

## Rolling back

Either works, nothing here touches a database or runs a migration:

- Promote the previous deployment in the Vercel dashboard — instant, no git.
- `git revert -m 1 <merge sha>` — slower, stays in history.

## Verifying a deploy

```
pnpm typecheck        # no errors
pnpm build            # should end "Prerendered 17 routes to static HTML."
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
