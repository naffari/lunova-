import { Link } from "react-router";
import { Phone, Mail, MessageSquare, MapPin, Calendar, Sparkles } from "lucide-react";

import { PHONE, PHONE_DISPLAY, EMAIL } from "../constants/contact";

const FT_BG = "#111318";
const FT_TEXT = "#E8E4DC";
const FT_MUTED = "rgba(255,255,255,0.55)";
const FT_ACCENT = "#ffffff";
const FT_BORDER = "rgba(255,255,255,0.08)";

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
            <Link
              to="/quote"
              className="px-4 py-2 rounded-lg font-semibold text-xs transition-colors"
              style={{ border: `1px solid ${FT_BORDER}`, color: FT_TEXT }}
            >
              Get Instant Quote
            </Link>
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
              <a href={`tel:+1${PHONE}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone size={13} /> {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`sms:+1${PHONE}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <MessageSquare size={13} /> Text Us
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail size={13} /> {EMAIL}
              </a>
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
