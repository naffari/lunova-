# Work photography — drop-in guide

Originals go here. They are **not deployed**. Run `pnpm images` and the
responsive AVIF/WebP/JPG variants are generated into
`public/images/work/<service-key>/`, which is what the site serves.

Filenames must match the `file` fields in
`src/app/constants/serviceGallery.ts` exactly — that manifest drives the
"What done looks like" section on each service page. A missing file means a
broken image, not a hidden section.

## Files expected right now

| Save as | Photo |
|---|---|
| `power-washing/driveway-before.jpg` | The driveway **with** moss/algae — ladder and orange cone visible |
| `power-washing/driveway-after.jpg` | The **same** driveway cleaned, even grey finish |
| `landscaping/lawn-front-yard.jpg` | The green front lawn with the edged sidewalk line |
| `auto-detailing/sedan-exterior.jpg` | The dark red Chrysler on the driveway |
| `auto-detailing/engine-bay.jpg` | The clean ECOTEC engine bay |
| `residential-cleaning/bedroom-styled.jpg` | The dark bedroom with the desk setup |

`.png` works too — the script accepts `.jpg`, `.jpeg`, `.png` and always emits
optimised output regardless of input format. Feed it the largest version you
have; it downscales and never upscales.

## The before/after pair

`power-washing` uses a drag slider, so the two frames must line up:

- Shot from **the same position** and roughly the same angle.
- Same crop and aspect ratio, or the slider will appear to jump as you drag.

The supplied pair is close but not identical framing. Crop both to the same
aspect before saving if the slider looks off.

## Before you mark anything as your own work

`serviceGallery.ts` carries an `own` flag per department:

- `own: true` — shot on a real Lunova job. The section claims the result.
- `own: false` — reference imagery. The section says so on the page.

`residential-cleaning` is currently `own: false`, because the bedroom photo
looks like styled interior-design photography rather than a completed clean.
**If it is a real Lunova job, set `own: true` and rewrite the blurb.** If it
isn't, replace it — the note rendered on the page is what keeps the section
honest, and it should not be removed while the photo stays.

## Adding a new department's photos

1. `mkdir assets-src/work/<service-key>/` — key must match a `SERVICE_THEMES` key.
2. Add the photos.
3. Add a `SERVICE_GALLERIES` entry in `src/app/constants/serviceGallery.ts`.
4. Render `<WorkGallery serviceKey="<service-key>" … />` on that page.
5. `pnpm images && pnpm build`

Step 3 is what makes it appear. `WorkGallery` renders `null` for any department
with no manifest entry, so an unwired folder silently does nothing.
