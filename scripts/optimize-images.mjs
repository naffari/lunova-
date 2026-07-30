/**
 * Hero image build step.
 *
 * Reads full-size originals from assets-src/hero/ (NOT deployed) and emits a
 * responsive AVIF + WebP + JPG set into public/images/hero/ (deployed).
 * Originals live outside public/ on purpose: they are 96–666 KB each and were
 * previously shipped to every visitor at every viewport.
 *
 * Heroes always render behind a heavy dark gradient scrim (see ServiceHero),
 * so quality can be pushed well below what a standalone photo would need.
 *
 * Run:  pnpm images
 * Idempotent — safe to re-run after dropping a new original into assets-src/hero/.
 */
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SRC_DIR = path.join(ROOT, "assets-src/hero");
const OUT_DIR = path.join(ROOT, "public/images/hero");

/**
 * Real job photography, one folder per department.
 *   assets-src/work/<service-key>/<name>.jpg   (source, not deployed)
 *   public/images/work/<service-key>/<name>-{640,1280}.{avif,webp}  (+1280.jpg)
 * Names must match the `file` fields in src/app/constants/serviceGallery.ts.
 */
const WORK_SRC_DIR = path.join(ROOT, "assets-src/work");
const WORK_OUT_DIR = path.join(ROOT, "public/images/work");

/** 640 covers phones (incl. 2x DPR on small screens); 1280 covers laptop/desktop. */
const WIDTHS = [640, 1280];
const QUALITY = { avif: 50, webp: 66, jpg: 72 };

function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)} KB`;
}

await mkdir(OUT_DIR, { recursive: true });

const files = (await readdir(SRC_DIR)).filter((f) => /\.jpe?g$/i.test(f));
if (files.length === 0) throw new Error(`No source images found in ${SRC_DIR}`);

const manifest = {};
let sourceTotal = 0;
let worstPhone = 0;
let worstDesktop = 0;

for (const file of files) {
  const abs = path.join(SRC_DIR, file);
  const base = file.replace(/\.jpe?g$/i, "");
  sourceTotal += (await stat(abs)).size;

  const { width: srcWidth, height: srcHeight } = await sharp(abs).metadata();
  manifest[base] = { width: srcWidth, height: srcHeight };

  const sizes = {};
  for (const width of WIDTHS) {
    const resize = { width: Math.min(width, srcWidth), withoutEnlargement: true };
    const variants = [
      ["avif", sharp(abs).resize(resize).avif({ quality: QUALITY.avif })],
      ["webp", sharp(abs).resize(resize).webp({ quality: QUALITY.webp })],
    ];
    // Only the wide tier needs a JPG fallback — any browser without WebP
    // support is served the single 1280 JPG regardless of viewport.
    if (width === Math.max(...WIDTHS)) {
      variants.push(["jpg", sharp(abs).resize(resize).jpeg({ quality: QUALITY.jpg, mozjpeg: true })]);
    }
    for (const [ext, pipeline] of variants) {
      const out = path.join(OUT_DIR, `${base}-${width}.${ext}`);
      await pipeline.toFile(out);
      sizes[`${width}.${ext}`] = (await stat(out)).size;
    }
  }

  worstPhone = Math.max(worstPhone, sizes["640.webp"]);
  worstDesktop = Math.max(worstDesktop, sizes["1280.webp"]);

  console.log(
    `${base.padEnd(28)} phone ${kb(sizes["640.avif"]).padStart(7)} avif / ${kb(sizes["640.webp"]).padStart(7)} webp` +
      `   desktop ${kb(sizes["1280.avif"]).padStart(7)} avif / ${kb(sizes["1280.webp"]).padStart(7)} webp / ${kb(sizes["1280.jpg"]).padStart(7)} jpg`
  );
}

await writeFile(path.join(OUT_DIR, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`\n${files.length} heroes processed from ${kb(sourceTotal)} of originals (originals not deployed).`);
console.log(`Worst-case single hero request: ${kb(worstPhone)} on phone, ${kb(worstDesktop)} on desktop (WebP tier).`);

/**
 * Work photography. Emits the same variant set as heroes, but keeps the JPG at
 * 1280 as well because BeforeAfterSlider takes plain `src` strings rather than a
 * <picture> element (it layers two absolutely-positioned images and clips one).
 */
const workDirs = await readdir(WORK_SRC_DIR, { withFileTypes: true }).catch(() => []);
const serviceDirs = workDirs.filter((d) => d.isDirectory());

/**
 * Records which work photos actually exist on disk, keyed by department.
 *
 * This is what makes the gallery safe to declare ahead of the photography:
 * serviceGallery.ts can name a photo before the file arrives, and WorkGallery
 * filters against this manifest so the section stays hidden rather than
 * rendering a broken image.
 */
const workManifest = {};

if (serviceDirs.length === 0) {
  console.log(`\nNo work photography found in assets-src/work/.`);
  console.log(`Drop originals into assets-src/work/<service-key>/ and re-run to publish them.`);
} else {
  console.log(`\nWork photography:`);
  let workCount = 0;

  for (const dir of serviceDirs) {
    const serviceKey = dir.name;
    const srcDir = path.join(WORK_SRC_DIR, serviceKey);
    const outDir = path.join(WORK_OUT_DIR, serviceKey);
    await mkdir(outDir, { recursive: true });

    const photos = (await readdir(srcDir)).filter((f) => /\.(jpe?g|png)$/i.test(f));

    for (const photo of photos) {
      const abs = path.join(srcDir, photo);
      const base = photo.replace(/\.(jpe?g|png)$/i, "");
      const { width: srcWidth } = await sharp(abs).metadata();

      let produced = 0;
      for (const width of WIDTHS) {
        const resize = { width: Math.min(width, srcWidth), withoutEnlargement: true };
        const variants = [
          [`${base}-${width}.avif`, sharp(abs).resize(resize).avif({ quality: QUALITY.avif })],
          [`${base}-${width}.webp`, sharp(abs).resize(resize).webp({ quality: QUALITY.webp })],
        ];
        if (width === Math.max(...WIDTHS)) {
          variants.push([
            `${base}-${width}.jpg`,
            sharp(abs).resize(resize).jpeg({ quality: QUALITY.jpg, mozjpeg: true }),
          ]);
        }
        for (const [name, pipeline] of variants) {
          const out = path.join(outDir, name);
          await pipeline.toFile(out);
          produced += (await stat(out)).size;
        }
      }

      console.log(`  ${`${serviceKey}/${base}`.padEnd(40)} ${kb(produced).padStart(8)} across variants`);
      (workManifest[serviceKey] ??= []).push(base);
      workCount += 1;
    }
  }

  console.log(`\n${workCount} work photo(s) processed.`);
}

const manifestEntries = Object.entries(workManifest)
  .map(([key, names]) => `  ${JSON.stringify(key)}: [${names.map((n) => JSON.stringify(n)).join(", ")}],`)
  .join("\n");

await writeFile(
  path.join(ROOT, "src/app/constants/workManifest.ts"),
  `/**
 * GENERATED FILE — do not edit by hand.
 * Written by scripts/optimize-images.mjs (\`pnpm images\`).
 *
 * Lists the work photos that actually exist in public/images/work/, keyed by
 * department. WorkGallery filters the declarations in serviceGallery.ts against
 * this, so naming a photo before its file lands hides the section instead of
 * rendering a broken image.
 */
export const WORK_MANIFEST: Record<string, string[]> = {
${manifestEntries}
};

export function hasWorkPhoto(serviceKey: string, file: string): boolean {
  return WORK_MANIFEST[serviceKey]?.includes(file) ?? false;
}
`,
  "utf8"
);

console.log(`\nWrote src/app/constants/workManifest.ts`);
