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
  bgColor?: string;
  ctaLabel: string;
  ctaTo: string;
  trustItems: string[];
  heroImage: string;
  heroImageAlt: string;
  badgeLabel: string;
  badgeSubLabel: string;
}

export default function ServiceHero({
  badge,
  titleContent,
  description,
  primaryColor,
  accentColor,
  bgColor = '#F1EBD9',
  ctaLabel,
  ctaTo,
  trustItems,
  heroImage,
  heroImageAlt,
  badgeLabel,
  badgeSubLabel,
}: ServiceHeroProps) {
  return (
    <section
      className="relative pt-[4.5rem] pb-20 px-4 sm:px-6 overflow-hidden"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_480px] gap-12 items-center">
        {/* Left Hero Column */}
        <div>
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border"
            style={{
              backgroundColor: `${primaryColor}18`,
              color: primaryColor,
              borderColor: `${primaryColor}30`,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
            <span>{badge}</span>
          </div>

          <h1
            className="font-serif-display text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.08] mb-6 tracking-tight"
            style={{ color: primaryColor }}
          >
            {titleContent}
          </h1>

          <p className="text-base sm:text-lg max-w-xl mb-8 leading-relaxed" style={{ color: `${primaryColor}bb` }}>
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
              style={{ backgroundColor: primaryColor, color: '#F1EBD9' }}
            >
              <Phone size={16} style={{ color: accentColor }} />
              Call {PHONE_DISPLAY}
            </a>
          </div>

          {/* Trust bar */}
          <div
            className="mt-10 pt-8 flex flex-wrap items-center gap-4 text-xs"
            style={{ borderTop: `1px solid ${primaryColor}20` }}
          >
            {trustItems.map((item, idx) => (
              <span key={idx} className="flex items-center gap-2">
                {idx > 0 && <span style={{ color: `${primaryColor}40` }}>•</span>}
                <span className="font-semibold" style={{ color: primaryColor }}>
                  {item}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Hero Frame */}
        <div className="relative flex justify-center">
          <div
            className="absolute -inset-4 rounded-[40px] rotate-2 opacity-60 z-0"
            style={{ backgroundColor: `${primaryColor}20` }}
          />

          <div
            className="relative z-10 w-full max-w-md h-[460px] sm:h-[520px] rounded-[36px] overflow-hidden border-4 border-white shadow-2xl"
            style={{ backgroundColor: primaryColor }}
          >
            <img
              src={heroImage}
              alt={heroImageAlt}
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
            />

            {/* Badge overlay */}
            <div
              className="absolute bottom-6 left-6 right-6 backdrop-blur-md p-5 rounded-2xl flex items-center justify-between"
              style={{
                backgroundColor: `${primaryColor}e6`,
                border: `1px solid ${accentColor}50`,
              }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: accentColor }}>
                  {badgeLabel}
                </p>
                <p className="font-serif-display text-xl text-white">{badgeSubLabel}</p>
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                style={{ backgroundColor: accentColor, color: primaryColor }}
              >
                ★ 5.0
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
