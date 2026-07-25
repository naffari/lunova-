import { Phone, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import type { ReactNode } from "react";
import { PHONE, PHONE_DISPLAY } from "../constants/contact";

interface ServiceHeroProps {
  badge: string;
  titleContent: ReactNode;
  description: string;
  primaryColor: string;
  accentColor: string;
  ctaLabel: string;
  ctaTo: string;
  trustItems: string[];
  heroImage: string;
  heroImageAlt: string;
}

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
      {/* Full-bleed background image */}
      <img
        src={heroImage}
        alt={heroImageAlt}
        className="absolute inset-0 w-full h-full object-cover z-0"
        loading="eager"
        fetchPriority="high"
      />

      {/* Gradient overlay for text legibility */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(100deg, ${primaryColor}f2 0%, ${primaryColor}d9 30%, ${primaryColor}80 55%, ${primaryColor}26 80%)`,
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{ background: `linear-gradient(to top, ${primaryColor}e6 0%, transparent 35%)` }}
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
                {idx > 0 && <span style={{ color: 'rgba(255,255,255,0.4)' }}>•</span>}
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
