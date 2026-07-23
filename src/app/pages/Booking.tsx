import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  Plus,
  Sparkles,
  ShieldCheck,
  MapPin,
  User,
  Mail,
  Phone,
  ArrowRight,
  Home,
  Trash2,
  Droplets,
  AppWindow,
  Car,
  Leaf,
  Building2,
  CheckCircle2,
  X,
  FileText,
} from "lucide-react";
import { Link, useSearchParams } from "react-router";
import ZipValidator, { SERVICE_ZIPS } from "../components/ZipValidator";
import { PHONE, PHONE_DISPLAY, EMAIL } from "../constants/contact";

interface ServiceDef {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  priceNote: string;
  icon: React.ElementType;
  desc: string;
}

const PRIMARY_SERVICES: ServiceDef[] = [
  {
    id: "cleaning",
    name: "Residential Cleaning",
    category: "Cleaning",
    basePrice: 150,
    priceNote: "Standard home clean",
    icon: Home,
    desc: "Kitchen, bathrooms, dusting, vacuuming & floor wash.",
  },
  {
    id: "junk",
    name: "Junk Removal",
    category: "Hauling",
    basePrice: 175,
    priceNote: "¼ truck load base",
    icon: Trash2,
    desc: "Furniture, appliances, debris, yard waste haul-away.",
  },
  {
    id: "power",
    name: "Power Washing",
    category: "Exterior",
    basePrice: 160,
    priceNote: "Driveway or patio",
    icon: Droplets,
    desc: "Pressure clean driveways, siding, decks, and walkways.",
  },
  {
    id: "window",
    name: "Window Cleaning",
    category: "Exterior",
    basePrice: 140,
    priceNote: "Up to 12 windows",
    icon: AppWindow,
    desc: "Interior & exterior streak-free window washing.",
  },
  {
    id: "auto",
    name: "Auto Detailing",
    category: "Mobile Auto",
    basePrice: 195,
    priceNote: "Full interior & exterior",
    icon: Car,
    desc: "Mobile vehicle wash, wax, vacuum & interior steam clean.",
  },
  {
    id: "bin",
    name: "Trash Bin Cleaning",
    category: "Sanitation",
    basePrice: 55,
    priceNote: "2 bins high-pressure wash",
    icon: Trash2,
    desc: "Sanitize & deodorize dirty trash & recycle bins.",
  },
  {
    id: "landscaping",
    name: "Landscaping & Yard Care",
    category: "Lawn",
    basePrice: 120,
    priceNote: "Mowing, edging & cleanup",
    icon: Leaf,
    desc: "Lawn maintenance, trimming, flowerbed edging & clean-up.",
  },
  {
    id: "commercial",
    name: "Commercial Cleaning",
    category: "Commercial",
    basePrice: 200,
    priceNote: "Office / storefront",
    icon: Building2,
    desc: "Scheduled office, retail, or facility cleaning.",
  },
];

interface AddonDef {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  forServices: string[]; // service IDs where this cross-sell is relevant
  desc: string;
}

const CROSS_SELL_ADDONS: AddonDef[] = [
  {
    id: "bin_add",
    name: "Trash Bin Cleaning & Sanitization",
    price: 35,
    originalPrice: 55,
    badge: "Popular 35% Off",
    forServices: ["cleaning", "junk", "power", "landscaping"],
    desc: "We high-pressure wash & sanitize your bins right after service.",
  },
  {
    id: "window_add",
    name: "Exterior Window Polish (Up to 10 Windows)",
    price: 85,
    originalPrice: 110,
    badge: "Save $25",
    forServices: ["cleaning", "power"],
    desc: "Sparkling streak-free glass while we're already at your property.",
  },
  {
    id: "deep_oven",
    name: "Oven & Microwave Interior Deep Scrub",
    price: 40,
    originalPrice: 50,
    badge: "Popular Add-on",
    forServices: ["cleaning"],
    desc: "Remove baked-on grease and odors from appliances.",
  },
  {
    id: "driveway_seal",
    name: "Driveway Surface Sealant",
    price: 95,
    originalPrice: 130,
    badge: "Save 25%",
    forServices: ["power"],
    desc: "Protective clear seal applied after power washing.",
  },
  {
    id: "garage_sweep",
    name: "Garage Floor Sweep & De-clutter",
    price: 45,
    originalPrice: 65,
    badge: "Great Pair",
    forServices: ["junk"],
    desc: "Deep sweep and organize garage space after junk haul.",
  },
  {
    id: "gutter_clean",
    name: "Gutter Cleanout & Flush",
    price: 85,
    originalPrice: 115,
    badge: "Seasonal Deal",
    forServices: ["landscaping", "power"],
    desc: "Clear leaves, twigs, and flushing downspouts.",
  },
  {
    id: "headlight_resto",
    name: "Headlight Oxidation Restoration",
    price: 40,
    originalPrice: 60,
    badge: "Save $20",
    forServices: ["auto"],
    desc: "Restore cloudy headlight lenses to crystal clarity.",
  },
];

export default function Booking() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get("service") || "cleaning";

  const [primaryId, setPrimaryId] = useState<string>(
    PRIMARY_SERVICES.some((s) => s.id === initialService) ? initialService : "cleaning"
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [rushOption, setRushOption] = useState(false);

  // Booking Details
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("morning");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Primary service details
  const primaryService = PRIMARY_SERVICES.find((s) => s.id === primaryId)!;

  // Relevant cross-sells
  const relevantAddons = useMemo(() => {
    return CROSS_SELL_ADDONS.filter((a) => a.forServices.includes(primaryId));
  }, [primaryId]);

  // Pricing calculations
  const baseSubtotal = primaryService.basePrice;
  const addonsSubtotal = selectedAddons.reduce((sum, addonId) => {
    const item = CROSS_SELL_ADDONS.find((a) => a.id === addonId);
    return sum + (item ? item.price : 0);
  }, 0);
  const rushFee = rushOption ? 30 : 0;

  const rawTotal = baseSubtotal + addonsSubtotal + rushFee;

  // Bundle discount applies if 1 or more add-ons selected
  const hasBundleDiscount = selectedAddons.length > 0;
  const bundleDiscount = hasBundleDiscount ? Math.round(rawTotal * 0.1) : 0;
  const finalTotal = rawTotal - bundleDiscount;

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Please enter a valid name";
    }
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!zip.trim()) {
      newErrors.zip = "Zip code is required";
    } else if (!/^\d{5}$/.test(zip)) {
      newErrors.zip = "Please enter a valid 5-digit zip code";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    const newId = `LN-${Math.floor(10000 + Math.random() * 90000)}`;
    setBookingId(newId);

    // Prepare email string
    const addonNames = selectedAddons
      .map((id) => CROSS_SELL_ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const subject = encodeURIComponent(`Booking #${newId} — ${primaryService.name}`);
    const body = encodeURIComponent(
      `Booking Details:\n` +
      `Reference: ${newId}\n` +
      `Service: ${primaryService.name}\n` +
      `Add-ons: ${addonNames || "None"}\n` +
      `Rush Service: ${rushOption ? "Yes (+$30)" : "No"}\n` +
      `Estimated Total: $${finalTotal} (Saved $${bundleDiscount})\n\n` +
      `Customer Information:\n` +
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Address: ${address}, ${zip}\n` +
      `Date & Time: ${date || "First available"} (${timeSlot})\n` +
      `Notes: ${notes}\n`
    );

    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`);
    setBookingConfirmed(true);
  }

  return (
    <>
      <Helmet>
        <title>Book Your Service | Lunova Services</title>
        <meta name="description" content="Book cleaning, power washing, junk removal, landscaping, auto detailing, bin cleaning, window cleaning, and commercial services online in Kansas City. Fast booking with bundle savings." />
        <meta property="og:title" content="Book Your Service | Lunova Services" />
        <meta property="og:description" content="Select your service, add discounted cross-sell add-ons, pick your date, and lock in your appointment in 60 seconds." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="bg-background text-foreground min-h-screen">
      {/* Page Hero */}
      <section className="relative pt-24 pb-14 px-4 sm:px-6 overflow-hidden border-b border-border bg-gradient-to-b from-[#0a1628] to-background">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <span className="text-primary text-xs font-semibold uppercase tracking-widest bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">
            Fast Online Booking
          </span>
          <h1
            style={{ fontFamily: "var(--font-display)" }}
            className="text-4xl sm:text-6xl font-bold text-foreground uppercase leading-tight mt-4 mb-3"
          >
            Book Your Service <span className="text-primary">&amp; Bundle Savings</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Select your service, add discounted cross-sell add-ons, pick your date, and lock in your appointment in 60 seconds.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <form onSubmit={handleBookingSubmit} className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">
          {/* ---- LEFT: Selection Steps ---- */}
          <div className="space-y-10">
            {/* STEP 1: Select Service */}
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                  1
                </span>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground uppercase">
                    Select Service
                  </h2>
                  <p className="text-muted-foreground text-xs">Choose the primary work needed</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {PRIMARY_SERVICES.map((s) => {
                  const Icon = s.icon;
                  const active = primaryId === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setPrimaryId(s.id);
                        setSelectedAddons([]); // reset add-ons for new service type
                      }}
                      className={`flex flex-col p-4 rounded-xl border text-left transition-all ${
                        active
                          ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                          : "border-border bg-secondary/60 hover:border-primary/40 hover:bg-secondary"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon size={22} className={active ? "text-primary" : "text-muted-foreground"} />
                        {active && <CheckCircle2 size={18} className="text-primary" />}
                      </div>
                      <p className="font-bold text-sm text-foreground mb-1">{s.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{s.desc}</p>
                      <div className="mt-auto pt-2 border-t border-border/50 flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground">From</span>
                        <span style={{ fontFamily: "var(--font-display)" }} className="text-base font-bold text-primary">
                          ${s.basePrice}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Cross-Sell Add-ons Engine */}
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                    2
                  </span>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground uppercase">
                      Recommended Add-ons &amp; Cross-Sells
                    </h2>
                    <p className="text-muted-foreground text-xs">Bundle 2+ services for an instant 10% total discount!</p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  <Sparkles size={14} /> 10% Bundle Discount
                </span>
              </div>

              {relevantAddons.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {relevantAddons.map((addon) => {
                    const isSelected = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border cursor-pointer transition-all gap-4 ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border bg-secondary/40 hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                              isSelected ? "bg-primary border-primary" : "border-border"
                            }`}
                          >
                            {isSelected && <Check size={12} className="text-primary-foreground" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm text-foreground">{addon.name}</span>
                              {addon.badge && (
                                <span className="text-[11px] font-bold text-primary bg-primary/15 px-2 py-0.5 rounded">
                                  {addon.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-muted-foreground text-xs mt-0.5">{addon.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 ml-8 sm:ml-0">
                          {addon.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${addon.originalPrice}
                            </span>
                          )}
                          <span style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-primary">
                            +${addon.price}
                          </span>
                          <button
                            type="button"
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                              isSelected
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border text-foreground hover:border-primary/50"
                            }`}
                          >
                            {isSelected ? "Added" : "+ Add"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm mb-4">No additional cross-sells for this service.</p>
              )}

              {/* Rush option */}
              <div
                onClick={() => setRushOption(!rushOption)}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                  rushOption ? "border-primary bg-primary/10" : "border-border bg-secondary/30 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border transition-colors ${
                      rushOption ? "bg-primary border-primary" : "border-border"
                    }`}
                  >
                    {rushOption && <Check size={12} className="text-primary-foreground" />}
                  </div>
                  <div>
                    <span className="font-semibold text-sm text-foreground">Same-Day / Rush Priority Booking</span>
                    <p className="text-muted-foreground text-xs">Dispatch closest crew within 2–4 hours</p>
                  </div>
                </div>
                <span style={{ fontFamily: "var(--font-display)" }} className="text-base font-bold text-primary">
                  +$30
                </span>
              </div>
            </div>

            {/* STEP 3: Date & Time Picker */}
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                  3
                </span>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground uppercase">
                    Choose Preferred Date &amp; Time
                  </h2>
                  <p className="text-muted-foreground text-xs">We will confirm exact arrival window</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <CalendarIcon size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    Arrival Window Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "morning", label: "Morning", sub: "8am–12pm" },
                      { id: "afternoon", label: "Afternoon", sub: "12pm–4pm" },
                      { id: "evening", label: "Evening", sub: "4pm–7pm" },
                    ].map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setTimeSlot(slot.id)}
                        className={`p-2.5 rounded-lg border text-center transition-colors ${
                          timeSlot === slot.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <p className="font-bold text-xs">{slot.label}</p>
                        <p className="text-[10px] opacity-80">{slot.sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 4: Customer Details & Service Address */}
            <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                  4
                </span>
                <div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-2xl font-bold text-foreground uppercase">
                    Contact &amp; Location
                  </h2>
                  <p className="text-muted-foreground text-xs">Where should our crew arrive?</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Full Name *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                    <input
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                    <input
                      required
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                    <input
                      required
                      type="tel"
                      placeholder="(816) 555-0199"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Zip Code *</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
                    <input
                      required
                      placeholder="64111"
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                      className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
                    />
                  </div>
                  {errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-foreground mb-1">Street Address</label>
                <input
                  placeholder="1234 Main St, Kansas City, MO"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Access Notes or Gate Code (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Side gate code 1234, park in driveway..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 text-sm bg-secondary border border-border text-foreground focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>
            </div>
          </div>

          {/* ---- RIGHT: Summary & Checkout Card ---- */}
          <div className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-foreground uppercase mb-4 flex items-center gap-2">
                <FileText size={18} className="text-primary" /> Booking Summary
              </h3>

              {/* Itemized list */}
              <div className="space-y-3 mb-6 border-b border-border pb-4">
                <div className="flex justify-between items-start text-sm">
                  <div>
                    <p className="font-semibold text-foreground">{primaryService.name}</p>
                    <p className="text-xs text-muted-foreground">{primaryService.priceNote}</p>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)" }} className="font-bold text-foreground">
                    ${baseSubtotal}
                  </span>
                </div>

                {selectedAddons.map((addonId) => {
                  const item = CROSS_SELL_ADDONS.find((a) => a.id === addonId)!;
                  return (
                    <div key={addonId} className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Check size={12} className="text-primary" /> {item.name}
                      </span>
                      <span style={{ fontFamily: "var(--font-display)" }} className="font-semibold text-primary">
                        +${item.price}
                      </span>
                    </div>
                  );
                })}

                {rushOption && (
                  <div className="flex justify-between items-center text-xs text-primary">
                    <span>Same-day priority rush</span>
                    <span style={{ fontFamily: "var(--font-display)" }} className="font-semibold">+$30</span>
                  </div>
                )}
              </div>

              {/* Bundle discount highlight */}
              {hasBundleDiscount && (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 mb-6">
                  <div className="flex items-center justify-between text-xs text-primary font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles size={14} /> 10% Bundle Discount
                    </span>
                    <span>-${bundleDiscount}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Multi-service bundle savings applied automatically!
                  </p>
                </div>
              )}

              {/* Total display */}
              <div className="flex items-baseline justify-between mb-6">
                <div>
                  <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                    Total Estimate
                  </span>
                  <p className="text-[11px] text-muted-foreground">Pay after work complete</p>
                </div>
                <div className="text-right">
                  <span style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-primary">
                    ${finalTotal}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!name || !email || !phone}
                className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-bold text-base hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-40"
              >
                Confirm &amp; Book Appointment <ArrowRight size={18} />
              </button>

              <div className="mt-4 pt-4 border-t border-border space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-primary" />
                  <span>No payment required until job completion.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} className="text-primary" />
                  <span>Free cancellation up to 24h before.</span>
                </div>
              </div>
            </div>

            {/* Support contact box */}
            <div className="bg-secondary/60 border border-border rounded-xl p-5 text-center">
              <p className="text-xs text-muted-foreground mb-2">Prefer to talk directly to a technician?</p>
              <a
                href={`tel:+1${PHONE}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
              >
                <Phone size={14} /> Call {PHONE_DISPLAY}
              </a>
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Modal */}
      {bookingConfirmed && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setBookingConfirmed(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <Sparkles size={32} />
              </div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                Booking Confirmed
              </span>
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-foreground uppercase mt-2">
                You're All Set!
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Reference ID: <strong className="text-foreground">{bookingId}</strong>
              </p>
            </div>

            <div className="bg-secondary border border-border rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-semibold text-foreground">{primaryService.name}</span>
              </div>
              {selectedAddons.length > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Add-ons:</span>
                  <span className="text-primary font-medium">{selectedAddons.length} bundled items</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Schedule:</span>
                <span className="font-semibold text-foreground">{date || "First available"} ({timeSlot})</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border">
                <span className="font-bold text-foreground">Total:</span>
                <span style={{ fontFamily: "var(--font-display)" }} className="font-bold text-primary text-xl">
                  ${finalTotal}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center mb-6">
              A Lunova dispatcher will text you at <strong>{phone}</strong> to confirm crew arrival details.
            </p>

            <div className="flex gap-3">
              <a
                href={`tel:+1${PHONE}`}
                className="flex-1 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-lg text-center hover:bg-primary/90 transition-colors"
              >
                Call Support
              </a>
              <Link
                to="/"
                className="flex-1 py-3 border border-border text-foreground font-semibold text-sm rounded-lg text-center hover:bg-secondary transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
