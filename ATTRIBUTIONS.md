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

`lunova-services-hero` is not a photograph in its own right — it is a
three-panel band composed from the cleaning, landscaping and junk-removal
originals by `scripts/compose-hero.mjs`. Re-run that script (then `pnpm images`)
after replacing any of the three sources.

**Note:** stock photography must not be presented as Lunova's own completed
work. Any gallery or before/after section using these images has to be labelled
as illustrative until real job photos exist — see the `own` flag in
`src/app/constants/serviceGallery.ts`.
