import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Phone, Mail, Menu, X, MessageSquare } from "lucide-react";

const PHONE = "8163151305";
const PHONE_DISPLAY = "(816) 315-1305";
const EMAIL = "naffari@myyahoo.com";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/cleaning", label: "Cleaning" },
  { to: "/junk-removal", label: "Junk Removal" },
  { to: "/landscaping", label: "Landscaping" },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#070f1f]/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L14 7L9 12L4 7L9 2Z" fill="#0a1628" />
              <path d="M5 10L9 14L13 10" stroke="#0a1628" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <span style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground tracking-wide">
            LUNOVA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors relative pb-0.5 ${
                  active
                    ? "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <a
            href={`sms:+1${PHONE}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <MessageSquare size={14} />
            Text Us
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <Mail size={14} />
            Email
          </a>
          <a
            href={`tel:+1${PHONE}`}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Phone size={14} />
            {PHONE_DISPLAY}
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-[#070f1f] border-t border-border px-4 pb-4 pt-2 flex flex-col gap-2">
          {navLinks.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`py-2 text-base font-medium transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
            <a
              href={`tel:+1${PHONE}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-md bg-primary text-primary-foreground font-semibold"
            >
              <Phone size={16} /> {PHONE_DISPLAY}
            </a>
            <a
              href={`sms:+1${PHONE}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-border text-foreground"
            >
              <MessageSquare size={16} /> Text Us
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-md border border-border text-foreground"
            >
              <Mail size={16} /> {EMAIL}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
