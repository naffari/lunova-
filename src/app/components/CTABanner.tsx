import { Phone, ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { PHONE, PHONE_DISPLAY } from "../constants/contact";

interface CTABannerProps {
  heading?: string;
  subtext?: string;
  primaryColor?: string;
  accentColor?: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export default function CTABanner({
  heading = "Ready to Get Started?",
  subtext = "Book today and get a free estimate. We serve the Kansas City metro — same-day slots available.",
  primaryColor = "#0E202F",
  accentColor = "#F1EBD9",
  ctaLabel = "Get a Free Quote",
  ctaTo = "/quote",
}: CTABannerProps) {
  return (
    <section className="py-16 px-4 sm:px-6" style={{ backgroundColor: primaryColor }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="font-serif-display text-4xl sm:text-5xl text-white mb-3"
        >
          {heading}
        </h2>
        <p className="text-sm mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {subtext}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={ctaTo}
            className="inline-flex items-center gap-3 font-bold px-8 py-4 rounded-full text-base transition-all group w-full sm:w-auto justify-center"
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
            className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-full border-2 text-white text-base transition-colors hover:bg-white/10 w-full sm:w-auto"
            style={{ borderColor: 'rgba(255,255,255,0.35)' }}
          >
            <Phone size={18} />
            {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    </section>
  );
}
