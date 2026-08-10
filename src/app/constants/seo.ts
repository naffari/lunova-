import heroManifest from "../../../public/images/hero/manifest.json";

// Production domain, used to build absolute canonical/OG/JSON-LD URLs.
export const SITE_URL = "https://www.lunovaservices.com";

/** Directory the responsive hero variants are generated into. */
const HERO_PATH = "/images/hero";

/**
 * Widest variant `scripts/optimize-images.mjs` emits, and the only one it
 * writes as JPEG. Share crawlers do not negotiate AVIF or WebP reliably, so the
 * JPEG is the one that goes in `og:image`.
 */
const OG_WIDTH = 1280;

type HeroDimensions = Record<string, { width: number; height: number }>;
const HERO_DIMENSIONS = heroManifest as HeroDimensions;

/**
 * The manifest keys, as a closed set — a hero name that has not been generated
 * is a type error rather than a 404 in a share card nobody previews.
 */
export type HeroName = keyof typeof heroManifest & string;

/**
 * Absolute URL of a hero's share image.
 *
 * `base` is the manifest key — the filename with no directory, width suffix or
 * extension ("power-washing-hero"), exactly as passed to `<ServiceHero>`.
 *
 * Every page used to share the same DEFAULT_OG_IMAGE, so a link to the
 * landscaping page previewed as a photo of someone cleaning a kitchen. The
 * variants already exist for the on-page hero; this only points the card at
 * the right one.
 */
export function heroOgImage(base: HeroName): string {
  return `${SITE_URL}${HERO_PATH}/${base}-${OG_WIDTH}.jpg`;
}

/**
 * Intrinsic size of a hero's source image.
 *
 * For an `<img>` the browser only wants the aspect ratio, so the source
 * dimensions are the right thing to hand it — it reserves the correct box
 * before the file lands whichever variant the `<picture>` ends up choosing.
 * Hardcoding one pair across every hero (which PageHero did) reserves the
 * wrong shape for every image that is not the composite, and the page jumps
 * when the real one arrives.
 */
export function heroSize(base: HeroName): { width: number; height: number } {
  return HERO_DIMENSIONS[base];
}

/**
 * Rendered pixel size of an OG image, when it is one of ours.
 *
 * Facebook, LinkedIn and iMessage lay the card out before the image has
 * finished downloading, and without these they either guess or reflow. The
 * manifest records the SOURCE dimensions, so the height is scaled to the 1280
 * variant rather than read off directly.
 *
 * Returns null for anything that is not a generated hero — better no tag than
 * a wrong one.
 */
export function ogImageDimensions(url: string): { width: number; height: number } | null {
  const match = url.match(new RegExp(`${HERO_PATH}/([a-z0-9-]+)-${OG_WIDTH}\\.jpg$`));
  const source = match ? HERO_DIMENSIONS[match[1]] : undefined;
  if (!source) return null;

  const width = Math.min(OG_WIDTH, source.width);
  return { width, height: Math.round((source.height / source.width) * width) };
}

/**
 * Site-wide share image: the composite hero showing all three lines of the
 * business side by side. Used for pages with no hero of their own (about,
 * contact, privacy, the booking wizard). It replaced a close-up of a kitchen
 * clean, which mis-sold every non-cleaning page that fell back to it.
 */
export const DEFAULT_OG_IMAGE = heroOgImage("lunova-services-hero");
export const DEFAULT_OG_IMAGE_ALT =
  "Lunova Services in Kansas City: interior window cleaning, a freshly mown lawn, and a cleared household load ready for hauling";

export const DEFAULT_TITLE = "Lunova Services | KC House Cleaning & Mobile Detailing";
export const DEFAULT_DESCRIPTION =
  "Lunova Services cleans homes and details cars across the Kansas City metro. Flat-rate quotes, confirmed before we start, nothing charged at booking.";
