import { withAlpha } from "../utils/color";
import { Phone, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import type { ReactNode } from "react";
import { PHONE, PHONE_DISPLAY } from "../constants/contact";
import { HIGH_FETCH_PRIORITY } from "../utils/dom";
import { trackCall } from "../utils/analytics";

interface ServiceHeroProps {
  badge: string;
  titleContent: ReactNode;
  description: string;
  primaryColor: string;
  accentColor: string;
  ctaLabel: string;
  ctaTo: string;
  trustItems: string[];
  /**
   * Base filename of the hero, without directory, width suffix, or extension
   * (e.g. "power-washing-hero"). The responsive AVIF/WebP/JPG variants are
   * generated into public/images/hero/ by `pnpm images` — see
   * scripts/optimize-images.mjs. Do not pass a full path or a remote URL.
   */
  heroImage: string;
  heroImageAlt: string;
}

const HERO_PATH = "/images/hero";

export default function ServiceHero({
  badge,
  titleContent,
  description,
  primaryColor,
  accentColor,
  ctaLabel,
  ctaTo,
  trustItems,
  heroImage,
  heroImageAlt,
}: ServiceHeroProps) {
  return (
    <section
      className="relative flex items-center min-h-[600px] sm:min-h-[720px] pt-[4.5rem] pb-20 px-4 sm:px-6 overflow-hidden"
      style={{ backgroundColor: primaryColor }}
    >
      {/* Full-bleed background image. Phones fetch the 640w variant (~10–51 KB),
          desktop the 1280w; the JPG is only reached by browsers without WebP. */}
      <picture>
        <source
          type="image/avif"
          sizes="100vw"
          srcSet={`${HERO_PATH}/${heroImage}-640.avif 640w, ${HERO_PATH}/${heroImage}-1280.avif 1280w`}
        />
        <source
          type="image/webp"
          sizes="100vw"
          srcSet={`${HERO_PATH}/${heroImage}-640.webp 640w, ${HERO_PATH}/${heroImage}-1280.webp 1280w`}
        />
        <img
          src={`${HERO_PATH}/${heroImage}-1280.jpg`}
          alt={heroImageAlt}
          className="absolute inset-0 w-full h-full object-cover z-0"
          loading="eager"
          decoding="async"
          {...HIGH_FETCH_PRIORITY}
        />
      </picture>

      {/* Gradient overlay for text legibility */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(100deg, ${withAlpha(primaryColor, 0.95)} 0%, ${withAlpha(primaryColor, 0.85)} 30%, ${withAlpha(primaryColor, 0.5)} 55%, ${withAlpha(primaryColor, 0.15)} 80%)`,
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{ background: `linear-gradient(to top, ${withAlpha(primaryColor, 0.9)} 0%, transparent 35%)` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border"
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span>{badge}</span>
          </div>

          <h1
            className="font-serif-display text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.08] mb-6 tracking-tight text-white"
          >
            {titleContent}
          </h1>

          <p className="text-base sm:text-lg max-w-xl mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={ctaTo}
              className="inline-flex items-center gap-3 font-bold px-7 py-4 rounded-full text-base transition-all shadow-md group"
              style={{ backgroundColor: accentColor, color: primaryColor }}
            >
              {ctaLabel}
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                style={{ backgroundColor: primaryColor, color: accentColor }}
              >
                <ArrowUpRight size={16} />
              </span>
            </Link>

            <a
              href={`tel:+1${PHONE}`}
              onClick={() => trackCall("service_hero")}
              className="inline-flex items-center gap-2 font-semibold px-6 py-4 rounded-full text-sm transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }}
            >
              <Phone size={16} style={{ color: accentColor }} />
              Call {PHONE_DISPLAY}
            </a>
          </div>

          {/* Trust bar */}
          <div
            className="mt-10 pt-8 flex flex-wrap items-center gap-4 text-xs"
            style={{ borderTop: '1px solid rgba(255,255,255,0.25)' }}
          >
            {trustItems.map((item, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {/* Purely a visual separator: hidden from screen readers, which
                    already get one list item per <span>. Was white at 0.4, which
                    measured 3.8:1 against every department ground — under the
                    4.5:1 floor for text this size. 0.55 clears it on all nine. */}
                {idx > 0 && <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.55)' }}>•</span>}
                <span className="font-semibold text-white">
                  {item}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
