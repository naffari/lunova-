import { Link } from "react-router";
import { MessageSquare, MapPin, Calendar, Sparkles } from "lucide-react";

import { PHONE } from "../constants/contact";
import { CHROME } from "../constants/brand";
import { EmailLink, PhoneLink } from "./common/ContactLinks";

const FT_BG = CHROME.bg;
const FT_TEXT = CHROME.text;
const FT_MUTED = CHROME.muted;
const FT_ACCENT = CHROME.accent;
const FT_BORDER = CHROME.border;

export default function Footer() {
  return (
    <footer role="contentinfo" className="pt-12 pb-6" style={{ backgroundColor: FT_BG, borderTop: `1px solid ${FT_BORDER}` }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <span style={{ fontFamily: "var(--font-display)", color: FT_TEXT }} className="text-2xl font-bold tracking-wide">
            LUNOVA
          </span>
          <p className="text-sm mt-3 leading-relaxed max-w-sm" style={{ color: FT_MUTED }}>
            Professional house cleaning, janitorial, junk removal, power washing, window cleaning, auto detailing, bin sanitation, and landscaping — Kansas City metro.
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
              iconSize={13}
              className="px-4 py-2 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
              style={{ border: `1px solid ${FT_BORDER}`, color: FT_TEXT }}
            />
          </div>
        </div>

        {/* Specialized Cleaning */}
        <div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: FT_TEXT }}>Cleaning Services</p>
          <ul className="space-y-2 text-xs" style={{ color: FT_MUTED }}>
            <li><Link to="/services/residential-cleaning" className="hover:text-white transition-colors">Residential Cleaning</Link></li>
            <li><Link to="/services/commercial-cleaning" className="hover:text-white transition-colors">Commercial Cleaning</Link></li>
            <li><Link to="/services/bin-cleaning" className="hover:text-white transition-colors">Trash Bin Cleaning</Link></li>
            <li><Link to="/cleaning" className="font-medium transition-colors hover:text-white">View Services Hub →</Link></li>
          </ul>
        </div>

        {/* Exterior & Hauling */}
        <div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: FT_TEXT }}>Exterior &amp; Hauling</p>
          <ul className="space-y-2 text-xs" style={{ color: FT_MUTED }}>
            <li><Link to="/services/power-washing" className="hover:text-white transition-colors">Power Washing</Link></li>
            <li><Link to="/services/window-cleaning" className="hover:text-white transition-colors">Window Cleaning</Link></li>
            <li><Link to="/services/auto-detailing" className="hover:text-white transition-colors">Auto Detailing</Link></li>
            <li><Link to="/junk-removal" className="hover:text-white transition-colors">Junk Removal</Link></li>
            <li><Link to="/landscaping" className="hover:text-white transition-colors">Landscaping</Link></li>
          </ul>
        </div>

        {/* Contact & Hours */}
        <div>
          <p className="font-semibold text-xs uppercase tracking-wider mb-3" style={{ color: FT_TEXT }}>Contact &amp; Hours</p>
          <ul className="space-y-2 text-xs mb-4" style={{ color: FT_MUTED }}>
            <li>
              <PhoneLink iconSize={13} className="flex items-center gap-2 hover:text-white transition-colors" />
            </li>
            <li>
              <a href={`sms:+1${PHONE}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <MessageSquare size={13} /> Text Us
              </a>
            </li>
            <li>
              <EmailLink iconSize={13} className="flex items-center gap-2 hover:text-white transition-colors" />
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={13} /> Kansas City Metro
            </li>
          </ul>
          <div className="pt-2 text-[11px] space-y-1" style={{ borderTop: `1px solid ${FT_BORDER}`, color: FT_MUTED }}>
            <div className="flex justify-between"><span>Mon–Fri</span><span>7am–7pm</span></div>
            <div className="flex justify-between"><span>Sat</span><span>8am–5pm</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ borderTop: `1px solid ${FT_BORDER}`, color: FT_MUTED }}>
        <div className="flex items-center gap-4">
          <span>© {new Date().getFullYear()} Lunova Services. All rights reserved.</span>
          <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        </div>
        <span className="flex items-center gap-1" style={{ color: FT_ACCENT }}>
          <Sparkles size={12} /> Bundle 2+ services for 10% off
        </span>
      </div>
    </footer>
  );
}
