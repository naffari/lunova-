import { Link } from "react-router";
import { Phone, Mail, MessageSquare, MapPin } from "lucide-react";

const PHONE = "8163151305";
const PHONE_DISPLAY = "(816) 315-1305";
const EMAIL = "naffari@myyahoo.com";

export default function Footer() {
  return (
    <footer className="bg-[#070f1f] border-t border-border pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {/* Brand */}
        <div>
          <span style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground tracking-wide">
            LUNOVA
          </span>
          <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
            Professional cleaning, junk removal, and landscaping services you can count on — Kansas City metro.
          </p>
        </div>

        {/* Services */}
        <div>
          <p className="text-foreground font-semibold text-sm uppercase tracking-wider mb-3">Services</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/cleaning" className="hover:text-primary transition-colors">Residential Cleaning</Link></li>
            <li><Link to="/cleaning" className="hover:text-primary transition-colors">Commercial Cleaning</Link></li>
            <li><Link to="/cleaning" className="hover:text-primary transition-colors">Bin Cleaning</Link></li>
            <li><Link to="/cleaning" className="hover:text-primary transition-colors">Auto Detailing</Link></li>
            <li><Link to="/cleaning" className="hover:text-primary transition-colors">Power Washing</Link></li>
            <li><Link to="/cleaning" className="hover:text-primary transition-colors">Window Cleaning</Link></li>
            <li><Link to="/junk-removal" className="hover:text-primary transition-colors">Junk Removal</Link></li>
            <li><Link to="/landscaping" className="hover:text-primary transition-colors">Landscaping</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-foreground font-semibold text-sm uppercase tracking-wider mb-3">Contact</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={`tel:+1${PHONE}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={14} /> {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={`sms:+1${PHONE}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <MessageSquare size={14} /> Text Us
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={14} /> {EMAIL}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} /> Kansas City Metro Area
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div>
          <p className="text-foreground font-semibold text-sm uppercase tracking-wider mb-3">Hours</p>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex justify-between gap-4"><span>Mon – Fri</span><span>7am – 7pm</span></li>
            <li className="flex justify-between gap-4"><span>Saturday</span><span>8am – 5pm</span></li>
            <li className="flex justify-between gap-4"><span>Sunday</span><span>By Request</span></li>
          </ul>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Same-day available
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Lunova Services. All rights reserved.</span>
        <span>Licensed &amp; Insured — Kansas City, MO</span>
      </div>
    </footer>
  );
}
