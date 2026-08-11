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

### `home-hero.jpg` — buy this one

The homepage hero is now a full-bleed photograph with the headline laid over
it, which is what all five of the strongest competitor homepages do. It reads
`assets-src/hero/home-hero.jpg` and nothing else, so replacing it is:

```bash
# save the purchased file over the seed, then
pnpm images
```

Nothing in `Home.tsx` changes. The one thing that does not follow automatically
is `HERO_IMAGE_ALT` in that file — update the sentence to describe what is
actually in the new frame.

**It is currently a copy of `auto-detailing-hero.jpg`, which is free Unsplash
stock.** It works, and it is not the photo this page should ship with.

What to buy, in order of how much it matters:

| | Why |
| --- | --- |
| **Landscape, 2200px wide or more** | `pnpm images` emits 640w and 1280w variants; anything narrower upscales and softens. |
| **Subject in the RIGHT half of the frame** | The scrim is heaviest on the left, where the headline, ZIP field and proof strip sit. A subject on the left gets buried under it. |
| **A person, mid-job** | The single strongest competitor hero in this market ([eyedetailmobile.com](https://www.eyedetailmobile.com/)) is the owner detailing a car at dusk. Not a finished car — a car being worked on. |
| **Quiet upper-left corner** | Sky, a wall, a garage door. That is where the largest type lands. |
| **Warm light** | Late afternoon. The site's ground is cream (`#F1EBD9`) and its accents are sage and olive; a cold blue-grey photo fights all three. |

Avoid: heavily colour-graded teal-and-orange stock, anything with legible
foreign branding or a licence plate, a spotless studio car on a black
background (reads as a dealership, not a mobile service), and anyone in
disposable gloves and a hairnet (reads as a franchise).

Search terms that land closest: *"mobile car detailing driveway"*,
*"car wash by hand outdoors"*, *"house cleaner living room natural light"*.

The best version of this file is not bought at all — it is one photograph of
you or your partner working, taken on a phone in late afternoon light. That is
literally what the competitor beating you on this is using.

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
