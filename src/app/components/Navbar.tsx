import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Phone,
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

import { PHONE, PHONE_DISPLAY } from "../constants/contact";
import { preloadRoute } from "../routeModules";

const NAV_ACCENT = "#ffffff";
const NAV_TEXT = "#E8E4DC";
const NAV_MUTED = "rgba(255,255,255,0.55)";
const NAV_BORDER = "rgba(255,255,255,0.08)";
const NAV_BG_SOLID = "#111318";

const serviceCategories = [
  {
    title: "Cleaning Services",
    items: [
      { to: "/services/residential-cleaning", label: "Residential Cleaning", icon: Home, desc: "Standard, deep clean, move-in/out" },
      { to: "/services/commercial-cleaning", label: "Commercial Janitorial", icon: Building2, desc: "Offices, retail & facilities" },
      { to: "/services/bin-cleaning", label: "Trash Bin Cleaning", icon: Trash2, desc: "Curbside 200° hot water wash" },
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
      setScrolled(window.scrollY > 40);
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

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: showSolidBg ? "rgba(17,19,24,0.78)" : "rgba(17,19,24,0.32)",
        backgroundImage: showSolidBg ? "none" : "linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0))",
        backdropFilter: showSolidBg ? "blur(16px) saturate(140%)" : "blur(4px)",
        WebkitBackdropFilter: showSolidBg ? "blur(16px) saturate(140%)" : "blur(4px)",
        borderBottom: showSolidBg ? `1px solid ${NAV_BORDER}` : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/logo.svg"
            alt="Lunova Services"
            className="h-10 w-auto shrink-0"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium transition-colors"
            style={{ color: location.pathname === "/" ? NAV_ACCENT : NAV_MUTED }}
            onMouseEnter={e => { if (location.pathname !== "/") (e.target as HTMLElement).style.color = NAV_TEXT; }}
            onMouseLeave={e => { if (location.pathname !== "/") (e.target as HTMLElement).style.color = NAV_MUTED; }}
          >
            Home
          </Link>

          {/* Services Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-1 text-sm font-medium transition-colors py-2"
              style={{ color: isServicesActive ? NAV_ACCENT : NAV_MUTED }}
            >
              <span>Services</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} style={{ color: dropdownOpen ? NAV_ACCENT : "inherit" }} />
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] rounded-xl shadow-2xl p-6 grid grid-cols-3 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                style={{ backgroundColor: NAV_BG_SOLID, border: `1px solid ${NAV_BORDER}` }}
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
                            className="flex items-start gap-2.5 p-2 rounded-lg transition-colors group"
                            style={{
                              backgroundColor: active ? `${NAV_ACCENT}18` : "transparent",
                              color: active ? NAV_ACCENT : NAV_TEXT,
                            }}
                            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)"; preloadRoute(item.to); }}
                            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
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
                  className="col-span-3 pt-3 flex items-center justify-between -mx-6 -mb-6 p-4 rounded-b-xl"
                  style={{ borderTop: `1px solid ${NAV_BORDER}`, backgroundColor: "rgba(255,255,255,0.03)" }}
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

          <Link
            to="/blog"
            className="text-sm font-medium transition-colors"
            style={{ color: location.pathname.startsWith("/blog") ? NAV_ACCENT : NAV_MUTED }}
            onMouseEnter={e => { if (!location.pathname.startsWith("/blog")) (e.target as HTMLElement).style.color = NAV_TEXT; preloadRoute("/blog"); }}
            onMouseLeave={e => { if (!location.pathname.startsWith("/blog")) (e.target as HTMLElement).style.color = NAV_MUTED; }}
            onFocus={() => preloadRoute("/blog")}
          >
            Blog
          </Link>
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2.5">
          <a
            href={`sms:+1${PHONE}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors"
            style={{ border: `1px solid ${NAV_BORDER}`, color: NAV_MUTED }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = NAV_TEXT; (e.currentTarget as HTMLElement).style.borderColor = `${NAV_ACCENT}60`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = NAV_MUTED; (e.currentTarget as HTMLElement).style.borderColor = NAV_BORDER; }}
          >
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

          <a
            href={`tel:+1${PHONE}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }}
          >
            <Phone size={13} />
            {PHONE_DISPLAY}
          </a>
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
          style={{ backgroundColor: NAV_BG_SOLID, borderTop: `1px solid ${NAV_BORDER}` }}
        >
          <Link to="/" className="text-base font-semibold" style={{ color: NAV_TEXT }}>Home</Link>
          <Link to="/book" className="flex items-center gap-2 py-2 px-3 rounded-lg font-bold text-sm" style={{ backgroundColor: NAV_ACCENT, color: NAV_BG_SOLID }} onTouchStart={() => preloadRoute("/book")}>
            <Calendar size={16} /> Book Online Directly
          </Link>
          <Link to="/blog" className="text-sm font-semibold" style={{ color: NAV_TEXT }} onTouchStart={() => preloadRoute("/blog")}>Blog</Link>

          <div className="space-y-4 pt-2" style={{ borderTop: `1px solid ${NAV_BORDER}` }}>
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: NAV_ACCENT }}>All Services</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/services/residential-cleaning" className="p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }} onTouchStart={() => preloadRoute("/services/residential-cleaning")}>Residential Cleaning</Link>
              <Link to="/services/commercial-cleaning" className="p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }} onTouchStart={() => preloadRoute("/services/commercial-cleaning")}>Commercial Cleaning</Link>
              <Link to="/services/power-washing" className="p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }} onTouchStart={() => preloadRoute("/services/power-washing")}>Power Washing</Link>
              <Link to="/services/window-cleaning" className="p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }} onTouchStart={() => preloadRoute("/services/window-cleaning")}>Window Cleaning</Link>
              <Link to="/services/auto-detailing" className="p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }} onTouchStart={() => preloadRoute("/services/auto-detailing")}>Auto Detailing</Link>
              <Link to="/services/bin-cleaning" className="p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }} onTouchStart={() => preloadRoute("/services/bin-cleaning")}>Trash Bin Cleaning</Link>
              <Link to="/junk-removal" className="p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }} onTouchStart={() => preloadRoute("/junk-removal")}>Junk Removal</Link>
              <Link to="/landscaping" className="p-2 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }} onTouchStart={() => preloadRoute("/landscaping")}>Landscaping</Link>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-3" style={{ borderTop: `1px solid ${NAV_BORDER}` }}>
            <a href={`tel:+1${PHONE}`} className="flex items-center justify-center gap-2 py-2.5 rounded-md font-semibold text-sm" style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${NAV_BORDER}`, color: NAV_TEXT }}>
              <Phone size={16} /> {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
