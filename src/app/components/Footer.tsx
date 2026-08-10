import { Link } from "react-router";
import { MessageSquare, MapPin, Calendar, Sparkles } from "lucide-react";

import { PHONE, SERVICE_AREA } from "../constants/contact";
import { CHROME } from "../constants/brand";
import { HOURS_DISPLAY } from "../constants/business";
import { SERVICE_CITIES, cityPath } from "../constants/cities";
import { GUIDES, guidePath } from "../constants/guides";
import { ACTIVE_SERVICES } from "../constants/services";
import { EmailLink, PhoneLink } from "./common/ContactLinks";

const FT_BG = CHROME.bg;
const FT_TEXT = CHROME.text;
const FT_MUTED = CHROME.muted;
const FT_ACCENT = CHROME.accent;
const FT_BORDER = CHROME.border;

export default function Footer() {
  return (
    <footer role="contentinfo" className="pt-12 pb-6" style={{ backgroundColor: FT_BG, borderTop: `1px solid ${FT_BORDER}` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 mb-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <span style={{ fontFamily: "var(--font-display)", color: FT_TEXT }} className="text-2xl font-bold tracking-wide">
            LUNOVA
          </span>
          <p className="text-sm mt-3 leading-relaxed max-w-sm" style={{ color: FT_MUTED }}>
            House cleaning and mobile auto detailing across the Kansas City metro. Flat-rate quotes, confirmed before we start, nothing charged at booking.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <Link
              to="/book"
              className="px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
              style={{ backgroundColor: FT_ACCENT, color: FT_BG }}
            >
              <Calendar size={14} /> Book Online
            </Link>
            <PhoneLink
              source="footer_cta"
              iconSize={13}
              className="px-4 py-2 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
              style={{ border: `1px solid ${FT_BORDER}`, color: FT_TEXT }}
            />
          </div>
        </div>

        {/*
          What we sell, from the catalogue.

          This was two hand-written columns listing eight services, six of
          which the business cannot currently deliver — the footer is on every
          page, so it was the most-rendered wrong claim on the site. It reads
          ACTIVE_SERVICES now, which means it cannot say yes to something the
          booking flow says no to.
        */}
        <div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: FT_TEXT }}>What We Do</p>
          <ul className="space-y-2 text-xs" style={{ color: FT_MUTED }}>
            {ACTIVE_SERVICES.map((service) => (
              <li key={service.id}>
                <Link to={service.to} className="hover:text-white transition-colors">{service.name}</Link>
              </li>
            ))}
            <li><Link to="/book" className="font-medium transition-colors hover:text-white">Get a price →</Link></li>
          </ul>
        </div>

        {/*
          Service areas.

          Every city page linked from the sitewide footer, deliberately. City
          pages are the on-page half of local SEO for a business with no
          storefront, and a page reachable only from the sitemap is a page
          Google crawls late and ranks worse. This is the cheapest internal
          linking available, and it puts all twelve one hop from every page.
        */}
        <div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: FT_TEXT }}>Service Areas</p>
          <ul className="space-y-2 text-xs" style={{ color: FT_MUTED }}>
            {SERVICE_CITIES.map((city) => (
              <li key={city.slug}>
                <Link to={cityPath(city.slug)} className="hover:text-white transition-colors">
                  {city.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/service-areas" className="font-medium transition-colors hover:text-white">
                All areas →
              </Link>
            </li>
          </ul>
        </div>

        {/*
          Guides.

          Sitewide, same reasoning as the city list: a guide reachable only
          from /guides is one hop further from every other page than it needs
          to be, and these are the pages meant to pull in people who are not
          searching for us by name yet.
        */}
        <div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: FT_TEXT }}>Guides</p>
          <ul className="space-y-2 text-xs" style={{ color: FT_MUTED }}>
            {GUIDES.map((guide) => (
              <li key={guide.slug}>
                <Link to={guidePath(guide.slug)} className="hover:text-white transition-colors">
                  {guide.category}: {guide.title.replace(/\s*\|.*$/, "")}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/guides" className="font-medium transition-colors hover:text-white">
                All guides →
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Hours */}
        <div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: FT_TEXT }}>Contact &amp; Hours</p>
          <ul className="space-y-2 text-xs mb-4" style={{ color: FT_MUTED }}>
            <li>
              <PhoneLink source="footer" iconSize={13} className="flex items-center gap-2 hover:text-white transition-colors" />
            </li>
            <li>
              <a href={`sms:+1${PHONE}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <MessageSquare size={13} /> Text Us
              </a>
            </li>
            <li>
              <EmailLink iconSize={13} className="flex items-center gap-2 hover:text-white transition-colors" />
            </li>
            <li>
              <Link to="/service-areas" className="flex items-center gap-2 hover:text-white transition-colors">
                <MapPin size={13} /> {SERVICE_AREA}
              </Link>
            </li>
          </ul>
          {/* Hours come from constants/business.ts, the same source as the
              openingHoursSpecification in the LocalBusiness schema, so the page
              and the markup cannot drift apart. */}
          <div className="pt-2 text-[11px] space-y-1" style={{ borderTop: `1px solid ${FT_BORDER}`, color: FT_MUTED }}>
            {HOURS_DISPLAY.map((row) => (
              <div key={row.label} className="flex justify-between">
                <span>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ borderTop: `1px solid ${FT_BORDER}`, color: FT_MUTED }}>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <span>© {new Date().getFullYear()} Lunova Services. All rights reserved.</span>
          <Link to="/guides" className="hover:text-white transition-colors">Guides</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
        <span className="flex items-center gap-1" style={{ color: FT_ACCENT }}>
          <Sparkles size={12} /> Bundle 2+ services for 10% off
        </span>
      </div>
    </footer>
  );
}
