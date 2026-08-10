# Attributions

## Typefaces

Both faces are self-hosted from `public/fonts/` and licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org/), which permits
redistribution and self-hosting.

- [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif) — display
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — body

The `.woff2` files are verbatim Google Fonts builds, latin and latin-ext
subsets. To update, re-download from `fonts.gstatic.com` and keep the
`unicode-range` declarations in `src/styles/fonts.css` in step with the
upstream CSS. Do not re-encode them.

## Photography

Photos are from [Unsplash](https://unsplash.com), used under the
[Unsplash license](https://unsplash.com/license).

Hero photography is self-hosted: full-size originals live in `assets-src/hero/`
(not deployed) and `pnpm images` generates the responsive AVIF/WebP/JPG variants
into `public/images/hero/`. Nothing is hotlinked.

### Two files worth replacing

Both are named for a service they do not show. Nothing is broken — the pages
that used them have been repointed and every alt text now describes what is
actually in the frame — but a correct photograph would be better than the
workaround.

| File | Named for | Actually shows |
| --- | --- | --- |
| `residential-cleaning-hero.jpg` | Cleaning a home interior | Someone wiping down a **car interior** |
| `commercial-cleaning-hero.jpg` | An office janitorial team | One person sweeping up **paint and plaster debris** after a renovation |

Current handling:

- **Residential cleaning** is no longer wired to its own file at all. The
  `cleaning` entry in `src/app/constants/services.ts` points at
  `cleaning-hero`, which genuinely shows a cleaner working inside a house.
  That one photo now has to serve the cleaning hub, the residential page, the
  guides index and the cleaning guides — the single biggest reason one image
  still repeats across the site. Drop in a real interior-cleaning shot as
  `assets-src/hero/residential-cleaning-hero.jpg`, run `pnpm images`, and point
  the catalogue entry back at it.
- **Commercial cleaning** keeps its file. Post-renovation clean-up is real
  commercial work, so the photo is defensible; only the claim that it showed an
  office team was not. An office or warehouse shot would sell the page better.

`lunova-services-hero` is not a photograph in its own right — it is a
three-panel band composed from the cleaning, landscaping and junk-removal
originals by `scripts/compose-hero.mjs`. Re-run that script (then `pnpm images`)
after replacing any of the three sources.

**Note:** stock photography must not be presented as Lunova's own completed
work. Any gallery or before/after section using these images has to be labelled
as illustrative until real job photos exist — see the `own` flag in
`src/app/constants/serviceGallery.ts`.
