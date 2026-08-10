import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, MessageSquare, Calendar } from "lucide-react";

import { PHONE } from "../constants/contact";
import { ACTIVE_SERVICES } from "../constants/services";
import { preloadRoute } from "../routeModules";
import { CHROME, CHROME_LIGHT } from "../constants/brand";
import { chromeToneFor } from "../routeConfig";
import { withAlpha } from "../utils/color";
import { PhoneLink } from "./common/ContactLinks";

/**
 * The service links, derived from the catalogue rather than typed out here.
 *
 * This used to be three hand-written categories holding eight links, which is
 * how the navigation ended up advertising work the business could not do: the
 * catalogue is the thing that knows what is sellable, and the navbar had its
 * own opinion. Reading `ACTIVE_SERVICES` means parking a line removes it from
 * the bar, and bringing one back puts it there, with no edit to this file.
 *
 * Two services do not need a mega-menu. They are rendered as two plain links.
 */
const NAV_SERVICES = ACTIVE_SERVICES.map((service) => ({
  to: service.to,
  label: service.name,
  icon: service.icon,
  desc: service.bullets.join(" · "),
}));

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  // Track scroll for transparent → solid transition
  useEffect(() => {
    function handleScroll() {
      // Compare before setting. The bar only has two states, so calling the
      // setter on every scroll event asks React to re-render the whole header
      // hundreds of times per scroll for a value that changes twice.
      const next = window.scrollY > 40;
      setScrolled((current) => (current === next ? current : next));
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobilePanelRef.current &&
        !mobilePanelRef.current.contains(event.target as Node) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close the menu on Escape, returning focus to the toggle button
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (mobileOpen) {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Lock background scroll and trap focus while the mobile menu is open
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = mobilePanelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusables?.[0]?.focus();

    function handleTabTrap(event: KeyboardEvent) {
      if (event.key !== "Tab" || !focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleTabTrap);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleTabTrap);
    };
  }, [mobileOpen]);

  const showSolidBg = scrolled || mobileOpen;

  /*
    Which palette the bar wears, from the route table rather than a guess.

    Cream-topped routes (home, the booking wizard, privacy) invert the whole
    chrome: the logo drops its white filter back to its natural dark mark, the
    links go to ink, and the translucent ground becomes cream instead of a dark
    scrim laid over cream. Everything else keeps the transparent-over-photo
    treatment, which is what the nine service pages and every PageHero page are
    built for.
  */
  const tone = chromeToneFor(location.pathname);
  const isLight = tone === "light";
  const chrome = isLight ? CHROME_LIGHT : CHROME;

  const NAV_ACCENT = chrome.accent;
  const NAV_TEXT = chrome.text;
  const NAV_MUTED = chrome.muted;
  const NAV_BORDER = chrome.border;
  const NAV_BG_SOLID = chrome.bg;
  const NAV_FILL = chrome.fill;
  const NAV_PANEL = chrome.panel;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        /*
          The .nav-link / .nav-pill / .nav-menu-item rules all read these, so
          overriding them here re-tones every control in the bar and both menus
          at once — no per-element branching, and no chance of one control
          being missed and left white on cream.
        */
        ["--chrome-text" as string]: chrome.text,
        ["--chrome-muted" as string]: chrome.muted,
        ["--chrome-accent" as string]: chrome.accent,
        ["--chrome-border" as string]: chrome.border,
        ["--chrome-fill" as string]: chrome.fill,
        ["--chrome-hover" as string]: chrome.hover,
        ["--chrome-hover-strong" as string]: isLight ? "rgba(33, 29, 23, 0.09)" : "rgba(255, 255, 255, 0.09)",
        ["--chrome-border-hover" as string]: isLight ? "rgba(33, 29, 23, 0.38)" : "rgba(255, 255, 255, 0.38)",
        // Derived from the chrome token, not a literal. These two values were
        // hand-written as rgba(17,19,24,…) — a near-match for CHROME.bg that
        // would have quietly diverged the moment the chrome tone was retuned.
        backgroundColor: withAlpha(NAV_BG_SOLID, showSolidBg ? 0.86 : isLight ? 0.55 : 0.32),
        /*
          The top-down black gradient exists to buy contrast against a bright
          patch of photo. Over cream it has nothing to darken and reads as a
          grey smear with a hard edge where it stops, so light routes get none.
        */
        backgroundImage:
          showSolidBg || isLight
            ? "none"
            : "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))",
        backdropFilter: showSolidBg ? "blur(16px) saturate(140%)" : "blur(4px)",
        WebkitBackdropFilter: showSolidBg ? "blur(16px) saturate(140%)" : "blur(4px)",
        borderBottom: showSolidBg ? `1px solid ${NAV_BORDER}` : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          {/*
            Intrinsic size from the SVG's own viewBox (553×424). The height is
            still driven by the `h-10` class — these only give the browser an
            aspect ratio to reserve before the file arrives, so the nav links
            do not shift sideways on first paint. Layout shift in a fixed
            header is counted against CLS on every page of the site.
          */}
          <img
            src="/logo.svg"
            alt="Lunova Services"
            width={553}
            height={424}
            className="h-10 w-auto shrink-0"
            /*
              The mark ships dark on transparent, which is already correct on
              cream — so light routes take no filter at all rather than an
              approximation of the original ink.
            */
            style={isLight ? undefined : { filter: "brightness(0) invert(1)" }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          <Link to="/" className="nav-link text-sm font-medium" data-active={location.pathname === "/"}>
            Home
          </Link>

          {/*
            The two services, as two links.

            This was a mega-menu: a click target that opened three columns of
            eight links across a 680px panel. Two services do not need to be
            discovered — hiding them behind a disclosure adds a click and
            removes the one thing a home page visitor is scanning for, which is
            whether this company does the job they came here about.
          */}
          {NAV_SERVICES.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="nav-link text-sm font-medium"
              data-active={location.pathname === item.to}
              onMouseEnter={() => preloadRoute(item.to)}
              onFocus={() => preloadRoute(item.to)}
            >
              {item.label}
            </Link>
          ))}

          {/*
            Areas and About in the primary nav, not just the footer.

            A link in the main navigation carries materially more weight than
            the same link in a footer, and /service-areas is the hub every city
            page hangs off. Putting it here is what makes twelve local pages a
            section of the site rather than an orphaned branch.
          */}
          <Link
            to="/service-areas"
            className="nav-link text-sm font-medium"
            data-active={location.pathname.startsWith("/service-areas")}
            onMouseEnter={() => preloadRoute("/service-areas")}
            onFocus={() => preloadRoute("/service-areas")}
          >
            Areas
          </Link>

          <Link
            to="/guides"
            className="nav-link text-sm font-medium"
            data-active={location.pathname.startsWith("/guides")}
            onMouseEnter={() => preloadRoute("/guides")}
            onFocus={() => preloadRoute("/guides")}
          >
            Guides
          </Link>

          <Link
            to="/about"
            className="nav-link text-sm font-medium"
            data-active={location.pathname === "/about"}
            onMouseEnter={() => preloadRoute("/about")}
            onFocus={() => preloadRoute("/about")}
          >
            About
          </Link>

          <Link
            to="/contact"
            className="nav-link text-sm font-medium"
            data-active={location.pathname === "/contact"}
            onMouseEnter={() => preloadRoute("/contact")}
            onFocus={() => preloadRoute("/contact")}
          >
            Contact
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          <a href={`sms:+1${PHONE}`} className="nav-pill flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs">
            <MessageSquare size={13} />
            Text Us
          </a>

          <Link
            to="/book"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors shadow-sm"
            style={{ backgroundColor: NAV_ACCENT, color: NAV_BG_SOLID }}
            onMouseEnter={() => preloadRoute("/book")}
            onFocus={() => preloadRoute("/book")}
          >
            <Calendar size={13} />
            Book Online
          </Link>

          <PhoneLink
            source="navbar"
            iconSize={13}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
            style={{ backgroundColor: NAV_FILL, border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }}
          />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          ref={mobileToggleRef}
          className="md:hidden p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          style={{ color: NAV_TEXT }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 top-16 z-40 bg-black/50 animate-in fade-in duration-200"
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          ref={mobilePanelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="md:hidden relative z-50 px-4 pb-6 pt-3 flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200"
          style={{ backgroundColor: NAV_PANEL, borderTop: `1px solid ${NAV_BORDER}` }}
        >
          <Link to="/" className="text-base font-semibold" style={{ color: NAV_TEXT }}>Home</Link>
          {/* No preload-on-touch here: the navigation fires milliseconds later,
              so warming the chunk cache buys nothing. */}
          <Link to="/book" className="flex items-center gap-2 py-2 px-3 rounded-lg font-bold text-sm" style={{ backgroundColor: NAV_ACCENT, color: NAV_BG_SOLID }}>
            <Calendar size={16} /> Book Online Directly
          </Link>
          <div className="space-y-4 pt-2" style={{ borderTop: `1px solid ${NAV_BORDER}` }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: NAV_ACCENT }}>What we do</p>
            {/* Same source as the desktop bar. This was previously a second,
                hand-maintained copy of the same links. */}
            <div className="grid grid-cols-1 gap-2">
              {NAV_SERVICES.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-start gap-2.5 p-3 rounded-lg"
                    style={{ backgroundColor: NAV_FILL, border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }}
                  >
                    <Icon size={16} style={{ color: NAV_ACCENT }} className="shrink-0 mt-0.5" />
                    <span>
                      <span className="block text-sm font-bold leading-tight">{item.label}</span>
                      <span className="block text-[11px] mt-0.5" style={{ color: NAV_MUTED }}>
                        {item.desc}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-3" style={{ borderTop: `1px solid ${NAV_BORDER}` }}>
            <div className="flex flex-wrap gap-2 pb-1">
              {[
                { to: "/service-areas", label: "Service Areas" },
                { to: "/guides", label: "Guides" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="px-3 py-2 rounded text-xs font-semibold"
                  style={{ backgroundColor: NAV_FILL, border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <PhoneLink
              source="navbar_mobile"
              iconSize={16}
              className="flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm"
              style={{ backgroundColor: NAV_FILL, border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }}
            />
          </div>
        </div>
      )}
    </header>
  );
}
