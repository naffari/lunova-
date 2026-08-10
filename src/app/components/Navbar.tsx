import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Menu,
  X,
  MessageSquare,
  ChevronDown,
  Home,
  Building2,
  Droplets,
  AppWindow,
  Car,
  Trash2,
  Truck,
  Leaf,
  Calendar,
} from "lucide-react";

import { PHONE } from "../constants/contact";
import { preloadRoute } from "../routeModules";
import { CHROME, CHROME_LIGHT } from "../constants/brand";
import { chromeToneFor } from "../routeConfig";
import { withAlpha } from "../utils/color";
import { PhoneLink } from "./common/ContactLinks";

const serviceCategories = [
  {
    title: "Cleaning Services",
    items: [
      { to: "/services/residential-cleaning", label: "Residential Cleaning", icon: Home, desc: "Standard, deep clean, move-in/out" },
      { to: "/services/commercial-cleaning", label: "Commercial Janitorial", icon: Building2, desc: "Offices, retail & facilities" },
      { to: "/services/bin-cleaning", label: "Trash Bin Cleaning", icon: Trash2, desc: "Curbside pressure wash and deodorize" },
    ],
  },
  {
    title: "Exterior & Auto",
    items: [
      { to: "/services/power-washing", label: "Power Washing", icon: Droplets, desc: "Siding, driveways & decks" },
      { to: "/services/window-cleaning", label: "Window Cleaning", icon: AppWindow, desc: "Streak-free interior & exterior" },
      { to: "/services/auto-detailing", label: "Auto Detailing", icon: Car, desc: "Mobile interior & exterior wash" },
    ],
  },
  {
    title: "Hauling & Lawn Care",
    items: [
      { to: "/junk-removal", label: "Junk Removal", icon: Truck, desc: "Single item to full truckload" },
      { to: "/landscaping", label: "Landscaping & Lawn", icon: Leaf, desc: "Mowing, edging & yard cleanup" },
    ],
  },
];

/** Flattened service list for the mobile menu, derived from the same source as
 *  the desktop dropdown so the two can no longer disagree. */
const ALL_SERVICES = serviceCategories.flatMap((cat) => cat.items);

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown/mobile menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
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

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // Close menus on Escape, returning focus to the toggle button
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (mobileOpen) {
        setMobileOpen(false);
        mobileToggleRef.current?.focus();
      }
      if (dropdownOpen) setDropdownOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, dropdownOpen]);

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

  const isServicesActive =
    location.pathname.startsWith("/services") ||
    location.pathname === "/cleaning" ||
    location.pathname === "/junk-removal" ||
    location.pathname === "/landscaping";

  const showSolidBg = scrolled || mobileOpen || dropdownOpen;

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

          {/* Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="nav-link flex items-center gap-1 text-sm font-medium py-2"
              data-active={isServicesActive}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span>Services</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} style={{ color: dropdownOpen ? NAV_ACCENT : "inherit" }} />
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-[min(420px,calc(100vw-2rem))] lg:w-[min(680px,calc(100vw-2rem))] rounded-xl shadow-2xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ backgroundColor: NAV_PANEL, border: `1px solid ${NAV_BORDER}` }}
              >
                {serviceCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider pb-1.5" style={{ color: NAV_ACCENT, borderBottom: `1px solid ${NAV_BORDER}` }}>
                      {cat.title}
                    </p>
                    <div className="space-y-1">
                      {cat.items.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="nav-menu-item flex items-start gap-2.5 p-2 rounded-lg group"
                            data-active={active}
                            onMouseEnter={() => preloadRoute(item.to)}
                            onFocus={() => preloadRoute(item.to)}
                          >
                            <Icon size={16} style={{ color: NAV_ACCENT }} className="shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold leading-tight">
                                {item.label}
                              </p>
                              <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color: NAV_MUTED }}>
                                {item.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div
                  className="col-span-1 lg:col-span-3 pt-3 flex items-center justify-between -mx-6 -mb-6 p-4 rounded-b-xl"
                  style={{ borderTop: `1px solid ${NAV_BORDER}`, backgroundColor: chrome.hover }}
                >
                  <span className="text-xs" style={{ color: NAV_MUTED }}>Looking for an umbrella overview?</span>
                  <Link
                    to="/cleaning"
                    className="text-xs font-bold hover:underline flex items-center gap-1"
                    style={{ color: NAV_ACCENT }}
                    onMouseEnter={() => preloadRoute("/cleaning")}
                    onFocus={() => preloadRoute("/cleaning")}
                  >
                    View Services Hub →
                  </Link>
                </div>
              </div>
            )}
          </div>

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
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: NAV_ACCENT }}>All Services</p>
            {/* Derived from serviceCategories — this was previously a second,
                hand-maintained copy of the same eight links. */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {ALL_SERVICES.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="p-2 rounded"
                  style={{ backgroundColor: NAV_FILL, border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }}
                >
                  {item.label}
                </Link>
              ))}
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
