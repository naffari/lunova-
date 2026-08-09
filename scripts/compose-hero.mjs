/**
 * Builds the sitewide three-panel hero band from the department originals.
 *
 * The homepage and every PageHero page (about, contact, service areas, the
 * twelve city pages) reference `lunova-services-hero`. That file was referenced
 * in code but had never existed on disk, so sixteen prerendered URLs shipped
 * with a broken <img> where their only photograph should be.
 *
 * Rather than invent a photo, this composes one from three originals we already
 * own — cleaning, lawn care, hauling — in the order the copy names them. Each
 * panel is cover-cropped so its subject stays near the middle, which is the
 * whole reason PageHero lays its copy ABOVE the band instead of over it: no
 * scrim, nothing buried.
 *
 * Run:  node scripts/compose-hero.mjs && pnpm images
 * Idempotent. Re-run after replacing any of the three source photos.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SRC_DIR = path.join(ROOT, "assets-src/hero");

/**
 * Left to right: clean, cut, haul. This order is load-bearing — the homepage
 * headline ("Clean. Cut. Haul.") and PageHero's lead copy both read across the
 * panels, so reordering here silently desyncs the picture from the sentence.
 */
const PANELS = [
  // She stands in the left third of the frame; a centre crop cuts her in half.
  { file: "cleaning-hero.jpg", focus: "left" },
  { file: "landscaping-hero.jpg", focus: "centre" },
  { file: "junk-removal-hero.jpg", focus: "centre" },
];

/**
 * 2400x864 is 25:9 — the ratio the band is ACTUALLY displayed at.
 *
 * This matters more than it looks. Both callers render the band as
 * `w-full h-[42vw] max-h-[460px] object-cover`, so on a 1280 viewport the box
 * is roughly 1280x460. Composing at a taller ratio and letting object-cover
 * fix it up means each panel is cropped twice: once here into a portrait
 * slice, then again by the browser. The first version of this file composed at
 * 20:11 and the lawn panel came out as a swimming pool.
 *
 * Composing at the display ratio means the crop you see here is the crop that
 * ships, and the width/height attributes on the <img> describe it honestly.
 */
const OUT_W = 2400;
const OUT_H = 864;
/** Page cream (--background). Reads as three cards on the ground, not one seam. */
const GUTTER = 9;
const GUTTER_COLOUR = "#F1EBD9";

const panelWidth = Math.round((OUT_W - GUTTER * (PANELS.length - 1)) / PANELS.length);

const composites = await Promise.all(
  PANELS.map(async ({ file, focus }, index) => ({
    input: await sharp(path.join(SRC_DIR, file))
      .resize(panelWidth, OUT_H, { fit: "cover", position: focus })
      .toBuffer(),
    left: index * (panelWidth + GUTTER),
    top: 0,
  }))
);

const out = path.join(SRC_DIR, "lunova-services-hero.jpg");

await sharp({
  create: {
    width: OUT_W,
    height: OUT_H,
    channels: 3,
    background: GUTTER_COLOUR,
  },
})
  .composite(composites)
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(out);

console.log(
  `Composed ${OUT_W}x${OUT_H} three-panel hero from ${PANELS.map((p) => p.file).join(", ")}`
);
console.log(`Wrote ${path.relative(ROOT, out)} — now run \`pnpm images\` to emit the variants.`);
