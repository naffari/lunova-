import { Link } from "react-router";
import { ArrowUpRight, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { BRAND } from "../constants/brand";
import { PHONE, PHONE_DISPLAY } from "../constants/contact";
import { HIGH_FETCH_PRIORITY } from "../utils/dom";
import { trackCall } from "../utils/analytics";
import { heroSize } from "../constants/seo";
import type { HeroName } from "../constants/seo";

const HERO_PATH = "/images/hero";

/**
 * Hero for the non-service pages: service areas, city pages, about, contact.
 *
 * Built differently from ServiceHero on purpose. ServiceHero lays the copy over
 * a full-bleed photo and needs two stacked gradient scrims to keep the text
 * legible, which costs the photo most of its contrast. The image used here is a
 * three-panel set (the house, the car, the bins) where each panel has a
 * subject near the middle, so a scrim across it would bury the exact thing the
 * picture is there to show.
 *
 * So the copy sits above the photo on a solid ground and the photo runs
 * full-bleed underneath it, uncovered. Nothing overlaps, nothing needs a scrim,
 * and the three panels stay readable at every width.
 *
 * The copy order matches the panel order left to right. Anything a caller
 * passes as a lead line should follow the same sequence.
 */
interface PageHeroProps {
  /** Small label above the title. */
  eyebrow: ReactNode;
  title: ReactNode;
  lead: string;
  /** Breadcrumb or any other small element rendered above the eyebrow. */
  above?: ReactNode;
  /** Short factual strings shown under the buttons. */
  meta?: string[];
  ctaLabel?: string;
  ctaTo?: string;
  /** Base filename in public/images/hero, no width suffix or extension. */
  image?: HeroName;
  imageAlt?: string;
  /**
   * Right-hand column, from lg up.
   *
   * Without it the copy sits in a centred measure instead. The wide layout
   * used to run regardless, which left the whole right half of the first
   * screen empty on every page that had nothing to put there.
   */
  aside?: ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  lead,
  above,
  meta = [],
  ctaLabel = "Get a flat-rate quote",
  ctaTo = "/book",
  image = "lunova-services-hero",
  imageAlt = "Three sides of the business, side by side: a cleaner working inside a Kansas City home, a car being detailed on a driveway, and a wheelie bin being washed out",
  aside,
}: PageHeroProps) {
  const { width, height } = heroSize(image);

  return (
    <section>
      <div className="pt-28 pb-12 px-4 sm:px-6" style={{ backgroundColor: BRAND.raised }}>
        <div
          className={
            aside
              ? "max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1fr)_22rem] gap-10 lg:gap-16 items-start"
              : "max-w-3xl mx-auto"
          }
        >
        <div>
          {above}

          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: BRAND.accent }}
          >
            {eyebrow}
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl leading-[1.06] mb-5" style={{ color: "#ffffff" }}>
            {title}
          </h1>

          <p className="text-base sm:text-lg leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.72)" }}>
            {lead}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Link
              to={ctaTo}
              className="inline-flex items-center justify-center gap-3 font-bold px-7 py-3.5 rounded-full text-sm group"
              style={{ backgroundColor: BRAND.accent, color: BRAND.ink }}
            >
              {ctaLabel}
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                style={{ backgroundColor: BRAND.ink, color: BRAND.accent }}
              >
                <ArrowUpRight size={14} />
              </span>
            </Link>
            <a
              href={`tel:+1${PHONE}`}
              onClick={() => trackCall("page_hero")}
              className="inline-flex items-center justify-center gap-2 font-semibold px-7 py-3.5 rounded-full border-2 text-sm"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "#ffffff" }}
            >
              <Phone size={16} />
              {PHONE_DISPLAY}
            </a>
          </div>

          {meta.length > 0 && (
            <div
              className="mt-9 pt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs"
              style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
            >
              {meta.map((item, index) => (
                <span key={item} className="flex items-center gap-4">
                  {/* Separator only. Hidden from screen readers, which already
                      get one item per span. 0.55 alpha clears 4.5:1 on the
                      chrome ground at this size. */}
                  {index > 0 && (
                    <span aria-hidden="true" style={{ color: "rgba(255,255,255,0.55)" }}>
                      •
                    </span>
                  )}
                  <span className="font-semibold text-white">{item}</span>
                </span>
              ))}
            </div>
          )}
        </div>

          {aside ? <div className="lg:pt-2">{aside}</div> : null}
        </div>
      </div>

      {/*
        Photo band. Full bleed, no text on top, no scrim.

        Height is capped rather than left to the source aspect ratio: at 1440
        wide the untouched image would run 790px tall and push everything below
        it off the first screen. object-position sits above center so the crop
        takes more off the ground than off the three subjects.
      */}
      <div className="relative w-full overflow-hidden" style={{ backgroundColor: BRAND.raised }}>
        <picture>
          <source
            type="image/avif"
            sizes="100vw"
            srcSet={`${HERO_PATH}/${image}-640.avif 640w, ${HERO_PATH}/${image}-1280.avif 1280w`}
          />
          <source
            type="image/webp"
            sizes="100vw"
            srcSet={`${HERO_PATH}/${image}-640.webp 640w, ${HERO_PATH}/${image}-1280.webp 1280w`}
          />
          <img
            src={`${HERO_PATH}/${image}-1280.jpg`}
            alt={imageAlt}
            className="block w-full object-cover h-[38vw] min-h-[180px] max-h-[440px]"
            width={width}
            height={height}
            loading="eager"
            decoding="async"
            {...HIGH_FETCH_PRIORITY}
          />
        </picture>
      </div>
    </section>
  );
}
