import { useState, useEffect, useRef, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Home,
  Building2,
  Trash2,
  Leaf,
  Car,
  Droplets,
  AppWindow,
  Phone,
  Mail,
  MessageSquare,
  User,
  Calendar,
  ShieldCheck,
  Clock,
  Tag,
} from "lucide-react";
import { Link } from "react-router";
import ZipValidator from "../components/ZipValidator";
import { PHONE, PHONE_DISPLAY, EMAIL } from "../constants/contact";

/* ----------------------------------------------------------
   PRICING ENGINE  (uses real Lunova rate sheet)
---------------------------------------------------------- */
function priceFor(
  service: string,
  opts: Record<string, unknown>
): [number, number] {
  if (service === "cleaning") {
    const sqft = (opts.sqft as number) || 1000;
    const rateMap: Record<string, number> = {
      recurring: 0.13,
      standard: 0.16,
      deep: 0.22,
      move: 0.28,
    };
    const minMap: Record<string, number> = {
      recurring: 130,
      standard: 150,
      deep: 220,
      move: 250,
    };
    const type = (opts.type as string) || "standard";
    const raw = sqft * (rateMap[type] ?? 0.16);
    const min = minMap[type] ?? 150;
    const base = Math.max(raw, min);
    return [Math.round(base * 0.95), Math.round(base * 1.05)];
  }
  if (service === "junk") {
    const map: Record<string, [number, number]> = {
      single: [99, 130],
      quarter: [175, 200],
      half: [299, 340],
      three_quarter: [425, 470],
      full: [550, 600],
    };
    const load = (opts.load as string) || "quarter";
    let [lo, hi] = map[load] ?? [99, 130];
    if (opts.rush) { lo += 30; hi += 30; }
    if (opts.stairs) { lo += 25; hi += 50; }
    return [lo, hi];
  }
  if (service === "power") {
    const sqft = (opts.sqft as number) || 500;
    const rateMap: Record<string, number> = {
      house: 0.2,
      driveway: 0.18,
      deck: 0.2,
    };
    const minMap: Record<string, number> = {
      house: 175,
      driveway: 100,
      deck: 120,
    };
    const surface = (opts.surface as string) || "driveway";
    const raw = sqft * (rateMap[surface] ?? 0.2);
    const min = minMap[surface] ?? 100;
    const base = Math.max(raw, min);
    return [Math.round(base * 0.95), Math.round(base * 1.05)];
  }
  if (service === "window") {
    const count = (opts.count as number) || 10;
    const base = Math.max(count * 10, 150);
    const screens = opts.screens ? count * 3 : 0;
    const hard = opts.hardwater ? count * 15 : 0;
    return [base + screens + hard, Math.round((base + screens + hard) * 1.05)];
  }
  if (service === "auto") {
    const pkgMap: Record<string, [number, number]> = {
      exterior: [95, 105],
      interior: [135, 145],
      full: [215, 230],
      full_suv: [255, 270],
    };
    const pkg = (opts.pkg as string) || "full";
    let [lo, hi] = pkgMap[pkg] ?? [215, 230];
    if (opts.mobile) { lo += 25; hi += 25; }
    return [lo, hi];
  }
  if (service === "bin") {
    const plan = (opts.plan as string) || "onetime";
    const extraBins = (opts.extraBins as number) || 0;
    const baseMap: Record<string, number> = {
      onetime: 55,
      monthly: 28,
      quarterly: 45,
    };
    const base = baseMap[plan] ?? 55;
    return [base + extraBins * 8, base + extraBins * 8];
  }
  return [0, 0];
}

/* COUNT-UP HOOK */
function useCountUp(target: number, duration = 450) {
  const [value, setValue] = useState(target);
  const fromRef = useRef(target);
  useEffect(() => {
    const from = fromRef.current;
    const start = performance.now();
    let raf: number;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = target;
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/* PRICE GAUGE */
function PriceGauge({ low, high, maxScale = 700 }: { low: number; high: number; maxScale?: number }) {
  const lo = useCountUp(low);
  const hi = useCountUp(high);
  const leftPct = Math.min(95, (low / maxScale) * 100);
  const widthPct = Math.max(5, ((high - low) / maxScale) * 100);
  const isSingle = low === high;

  return (
    <div className="rounded-xl p-6 bg-card border border-border">
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-primary text-xs font-semibold uppercase tracking-widest">
          Estimated {isSingle ? "price" : "range"}
        </span>
        <span className="text-muted-foreground text-xs">confirmed on-site</span>
      </div>
      <div className="flex items-end gap-2 mb-5">
        <span style={{ fontFamily: "var(--font-display)" }} className="text-4xl sm:text-5xl font-bold text-foreground">
          ${lo}
        </span>
        {!isSingle && (
          <>
            <span className="text-2xl text-muted-foreground mb-1">–</span>
            <span style={{ fontFamily: "var(--font-display)" }} className="text-4xl sm:text-5xl font-bold text-foreground">
              ${hi}
            </span>
          </>
        )}
      </div>
      <div className="relative h-2 rounded-full overflow-hidden bg-secondary">
        <div
          className="absolute top-0 h-full rounded-full transition-all duration-500 bg-primary"
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
      </div>
      <p className="text-muted-foreground text-xs mt-3">
        Exact quote confirmed before any work begins — zero surprise fees.
      </p>
    </div>
  );
}

function StepDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            width: i === step ? 20 : 8,
            background: i <= step ? "var(--primary)" : "var(--border)",
            opacity: i <= step ? 1 : 0.5,
          }}
        />
      ))}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1.0 + Math.random() * 0.7,
        color: ["#c8960e", "#F1EBD9", "#3C312A", "#E8A830"][i % 4],
        size: 5 + Math.random() * 5,
      })),
    []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
      <style>{`
        @keyframes lunovaFall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity:1; }
          100% { transform: translateY(320px) rotate(360deg); opacity:0; }
        }
      `}</style>
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * 0.4,
            background: p.color,
            borderRadius: 1,
            animation: `lunovaFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

function PillGroup({
  options,
  value,
  onChange,
  multi = false,
  wrap = false,
}: {
  options: { id: string; label: string }[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
  multi?: boolean;
  wrap?: boolean;
}) {
  function isActive(id: string) {
    return multi ? (value as string[]).includes(id) : value === id;
  }
  function toggle(id: string) {
    if (!multi) return onChange(id);
    const arr = value as string[];
    onChange(arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id]);
  }
  return (
    <div className={`flex gap-2 ${wrap ? "flex-wrap" : ""}`}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => toggle(o.id)}
          className={`rounded-lg px-4 py-2 text-sm font-medium border transition-colors ${
            isActive(o.id)
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-secondary text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Stepper({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 rounded-full border border-border text-foreground font-medium hover:border-primary/50 transition-colors"
      >
        −
      </button>
      <span style={{ fontFamily: "var(--font-display)" }} className="text-lg font-bold text-foreground w-5 text-center">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-8 h-8 rounded-full border border-border text-foreground font-medium hover:border-primary/50 transition-colors"
      >
        +
      </button>
    </div>
  );
}

function TextField({
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon: React.ElementType;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-3.5 text-muted-foreground" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg pl-10 pr-4 py-3 text-sm bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
      />
    </div>
  );
}

function CheckToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium border transition-colors text-left w-full ${
        checked
          ? "bg-primary/10 border-primary/40 text-foreground"
          : "bg-secondary border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      <div
        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-colors ${
          checked ? "bg-primary border-primary" : "border-border"
        }`}
      >
        {checked && <Check size={10} className="text-primary-foreground" />}
      </div>
      {label}
    </button>
  );
}

const SERVICES = [
  { id: "cleaning", label: "Residential Cleaning", icon: Home, desc: "Standard, deep, move-in/out" },
  { id: "junk", label: "Junk Removal", icon: Trash2, desc: "Single item to full truckload" },
  { id: "power", label: "Power Washing", icon: Droplets, desc: "Siding, driveway, deck/patio" },
  { id: "window", label: "Window Cleaning", icon: AppWindow, desc: "Interior & exterior, hard water" },
  { id: "auto", label: "Auto Detailing", icon: Car, desc: "Interior, exterior, full detail" },
  { id: "bin", label: "Bin Cleaning", icon: Trash2, desc: "2-bin service, recurring plans" },
  { id: "landscaping", label: "Landscaping", icon: Leaf, desc: "Custom lawn care & clean-ups" },
  { id: "commercial", label: "Commercial Cleaning", icon: Building2, desc: "Office, restaurant, medical" },
];

function ServiceDetailsStep({
  service,
  opts,
  setOpts,
  range,
  onBack,
  onNext,
}: {
  service: string;
  opts: Record<string, unknown>;
  setOpts: (o: Record<string, unknown>) => void;
  range: [number, number];
  onBack: () => void;
  onNext: () => void;
}) {
  const maxScale =
    service === "cleaning" ? 1200
    : service === "junk" ? 700
    : service === "power" ? 500
    : service === "window" ? 800
    : service === "auto" ? 400
    : service === "bin" ? 200
    : 200;

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-foreground uppercase mb-1">
        Tell us the details
      </h2>
      <p className="text-muted-foreground text-sm mb-6">Your estimate updates live as you adjust options.</p>

      <div className="space-y-5 mb-6">
        {service === "cleaning" && (
          <>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Home size (sq ft)</p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={500}
                  max={4000}
                  step={100}
                  value={(opts.sqft as number) || 1000}
                  onChange={(e) => setOpts({ ...opts, sqft: Number(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span style={{ fontFamily: "var(--font-display)" }} className="text-primary font-bold text-lg w-20 text-right">
                  {(opts.sqft as number) || 1000} ft²
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Service type</p>
              <PillGroup
                options={[
                  { id: "recurring", label: "Recurring" },
                  { id: "standard", label: "One-time" },
                  { id: "deep", label: "Deep clean" },
                  { id: "move", label: "Move in/out" },
                ]}
                value={(opts.type as string) || "standard"}
                onChange={(v) => setOpts({ ...opts, type: v })}
                wrap
              />
            </div>
          </>
        )}

        {service === "junk" && (
          <>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Load size</p>
              <PillGroup
                options={[
                  { id: "single", label: "Single item" },
                  { id: "quarter", label: "¼ load" },
                  { id: "half", label: "½ load" },
                  { id: "three_quarter", label: "¾ load" },
                  { id: "full", label: "Full truck" },
                ]}
                value={(opts.load as string) || "quarter"}
                onChange={(v) => setOpts({ ...opts, load: v })}
                wrap
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Add-ons</p>
              <div className="space-y-2">
                <CheckToggle
                  label="Same-day / rush service (+$30)"
                  checked={!!opts.rush}
                  onChange={(v) => setOpts({ ...opts, rush: v })}
                />
                <CheckToggle
                  label="Stairs or long carry — 2+ flights / 75ft+ (+$25–50)"
                  checked={!!opts.stairs}
                  onChange={(v) => setOpts({ ...opts, stairs: v })}
                />
              </div>
            </div>
          </>
        )}

        {service === "power" && (
          <>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Surface</p>
              <PillGroup
                options={[
                  { id: "house", label: "House siding" },
                  { id: "driveway", label: "Driveway" },
                  { id: "deck", label: "Deck / patio" },
                ]}
                value={(opts.surface as string) || "driveway"}
                onChange={(v) => setOpts({ ...opts, surface: v })}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Area (sq ft)</p>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={100}
                  max={3000}
                  step={50}
                  value={(opts.sqft as number) || 500}
                  onChange={(e) => setOpts({ ...opts, sqft: Number(e.target.value) })}
                  className="flex-1 accent-primary"
                />
                <span style={{ fontFamily: "var(--font-display)" }} className="text-primary font-bold text-lg w-20 text-right">
                  {(opts.sqft as number) || 500} ft²
                </span>
              </div>
            </div>
          </>
        )}

        {service === "window" && (
          <>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Number of windows</p>
              <div className="flex items-center gap-4">
                <Stepper
                  value={(opts.count as number) || 10}
                  onChange={(v) => setOpts({ ...opts, count: v })}
                  min={1}
                  max={80}
                />
                <span className="text-muted-foreground text-sm">windows</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-3">Add-ons</p>
              <div className="space-y-2">
                <CheckToggle
                  label="Screen & track cleaning (+$3/window)"
                  checked={!!opts.screens}
                  onChange={(v) => setOpts({ ...opts, screens: v })}
                />
                <CheckToggle
                  label="Hard water / mineral removal (+$15/window)"
                  checked={!!opts.hardwater}
                  onChange={(v) => setOpts({ ...opts, hardwater: v })}
                />
              </div>
            </div>
          </>
        )}

        {service === "auto" && (
          <>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Package</p>
              <PillGroup
                options={[
                  { id: "exterior", label: "Exterior wash & wax" },
                  { id: "interior", label: "Interior detail" },
                  { id: "full", label: "Full detail" },
                  { id: "full_suv", label: "Full detail — SUV/truck" },
                ]}
                value={(opts.pkg as string) || "full"}
                onChange={(v) => setOpts({ ...opts, pkg: v })}
                wrap
              />
            </div>
            <div className="space-y-2">
              <CheckToggle
                label="Mobile / travel fee — outside core area (+$25)"
                checked={!!opts.mobile}
                onChange={(v) => setOpts({ ...opts, mobile: v })}
              />
            </div>
          </>
        )}

        {service === "bin" && (
          <>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Plan (includes 2 bins)</p>
              <PillGroup
                options={[
                  { id: "onetime", label: "One-time ($55)" },
                  { id: "monthly", label: "Monthly ($28/mo)" },
                  { id: "quarterly", label: "Quarterly ($45/qtr)" },
                ]}
                value={(opts.plan as string) || "onetime"}
                onChange={(v) => setOpts({ ...opts, plan: v })}
                wrap
              />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Additional bins (+$8 each)</p>
              <div className="flex items-center gap-4">
                <Stepper
                  value={(opts.extraBins as number) || 0}
                  onChange={(v) => setOpts({ ...opts, extraBins: v })}
                  min={0}
                  max={10}
                />
                <span className="text-muted-foreground text-sm">extra bins</span>
              </div>
            </div>
          </>
        )}

        {(service === "landscaping" || service === "commercial") && (
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-5 py-5">
            <p style={{ fontFamily: "var(--font-display)" }} className="text-foreground font-bold text-xl uppercase mb-2">
              Custom Quote Required
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              {service === "landscaping"
                ? "Landscaping rates depend on property size and frequency. We confirm exact pricing in one quick call."
                : "Commercial cleaning requires a brief site visit to give an exact estimate. We respond fast!"}
            </p>
            <a
              href={`tel:+1${PHONE}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              <Phone size={16} /> Call {PHONE_DISPLAY}
            </a>
          </div>
        )}
      </div>

      {!["landscaping", "commercial"].includes(service) && (
        <PriceGauge low={range[0]} high={range[1]} maxScale={maxScale} />
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg py-3 px-4 text-sm font-semibold flex items-center gap-2 border border-border text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        {["landscaping", "commercial"].includes(service) ? (
          <Link
            to="/book"
            className="flex-1 rounded-lg py-3 font-semibold text-sm flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Or Book Online Directly <ArrowRight size={16} />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="flex-1 rounded-lg py-3 font-bold text-sm flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Continue <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

type QuoteStep = "service" | "details" | "contact" | "success";

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  date: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export default function Quote() {
  const [step, setStep] = useState<QuoteStep>("service");
  const [service, setService] = useState<string | null>(null);
  const [opts, setOpts] = useState<Record<string, unknown>>({
    sqft: 1200,
    type: "standard",
    load: "quarter",
    rush: false,
    stairs: false,
    surface: "driveway",
    count: 10,
    screens: false,
    hardwater: false,
    pkg: "full",
    mobile: false,
    plan: "onetime",
    extraBins: 0,
  });
  const [contact, setContact] = useState<ContactInfo>({
    name: "", email: "", phone: "", date: "", notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const range = service ? priceFor(service, opts) : [0, 0] as [number, number];

  const stepIndex: Record<QuoteStep, number> = {
    service: 0,
    details: 1,
    contact: 2,
    success: 3,
  };

  function validateForm(): boolean {
    const newErrors: FormErrors = {};
    
    if (!contact.name.trim()) {
      newErrors.name = "Name is required";
    } else if (contact.name.trim().length < 2) {
      newErrors.name = "Please enter a valid name";
    }
    
    if (!contact.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (contact.phone && !/^\d{10}$/.test(contact.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;
    const serviceLabel = SERVICES.find((s) => s.id === service)?.label ?? service;
    const subject = encodeURIComponent(`Quote Request — ${serviceLabel}`);
    const body = encodeURIComponent(
      `Hi Lunova,\n\nI'd like a quote for ${serviceLabel}.\n\nEstimated range: $${range[0]}–$${range[1]}\n\nName: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone}\nPreferred date: ${contact.date}\nNotes: ${contact.notes}\n`
    );
    window.open(`mailto:${EMAIL}?subject=${subject}&body=${body}`);
    setStep("success");
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <>
      <Helmet>
        <title>Get a Free Instant Quote | Lunova Services</title>
        <meta name="description" content="Get an instant, transparent quote for cleaning, power washing, junk removal, landscaping, auto detailing, bin cleaning, window cleaning, and commercial services in Kansas City." />
        <meta property="og:title" content="Get a Free Instant Quote | Lunova Services" />
        <meta property="og:description" content="Instant cost estimator for all Lunova services. Pick your service, adjust preferences, and receive a transparent price range in seconds." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="bg-background text-foreground min-h-screen">
      {/* Page Hero */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: '#2A2118', borderBottom: '1px solid rgba(241,235,217,0.1)' }}>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: '#c8960e', backgroundColor: 'rgba(200,150,14,0.12)', border: '1px solid rgba(200,150,14,0.25)' }}>
            Instant Cost Estimator
          </span>
          <h1
            style={{ fontFamily: "var(--font-display)", color: '#F1EBD9' }}
            className="text-4xl sm:text-6xl font-bold uppercase leading-tight mt-4 mb-3"
          >
            Get a Free <span style={{ color: '#c8960e' }}>Instant Quote</span>
          </h1>
          <p className="text-base max-w-lg mx-auto" style={{ color: 'rgba(241,235,217,0.6)' }}>
            Pick your service, adjust your preferences, and receive a transparent price range in seconds.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
          {/* ---- LEFT: calculator ---- */}
          <div>
            {step !== "success" && (
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <StepDots step={stepIndex[step]} total={3} />
                  <span className="text-muted-foreground text-xs font-medium">
                    Step {stepIndex[step] + 1} of 3
                  </span>
                </div>
                <Link
                  to="/book"
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  Ready to book date now? <ArrowRight size={13} />
                </Link>
              </div>
            )}

            {/* STEP 1: Service Pick */}
            {step === "service" && (
              <div>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-foreground uppercase mb-1">
                  What do you need done?
                </h2>
                <p className="text-muted-foreground text-sm mb-6">Select a service to calculate your live estimate.</p>
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {SERVICES.map((s) => {
                    const Icon = s.icon;
                    const active = service === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setService(s.id)}
                        className={`flex items-center gap-4 rounded-xl p-4 text-left border transition-all ${
                          active
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border bg-card hover:border-primary/40"
                        }`}
                      >
                        <div className={`rounded-lg p-2.5 shrink-0 ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
                          <Icon size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-foreground">{s.label}</p>
                          <p className="text-muted-foreground text-xs">{s.desc}</p>
                        </div>
                        {active && <Check size={16} className="text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  disabled={!service}
                  onClick={() => setStep("details")}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-lg font-bold text-base hover:bg-primary/90 transition-colors disabled:opacity-40"
                >
                  Continue to Details <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 2: Details */}
            {step === "details" && service && (
              <ServiceDetailsStep
                service={service}
                opts={opts}
                setOpts={setOpts}
                range={range as [number, number]}
                onBack={() => setStep("service")}
                onNext={() => setStep("contact")}
              />
            )}

            {/* STEP 3: Contact */}
            {step === "contact" && (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontFamily: "var(--font-display)" }} className="text-3xl font-bold text-foreground uppercase mb-1">
                  Almost ready
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Provide your details and we'll confirm your date & exact price.
                </p>

                <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
                  <p className="text-primary text-sm font-semibold">
                    📋 {SERVICES.find((s) => s.id === service)?.label}
                  </p>
                  <p style={{ fontFamily: "var(--font-display)" }} className="text-foreground font-bold text-lg">
                    ${range[0]}–${range[1]}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <TextField icon={User} placeholder="Full name *" value={contact.name} onChange={(v) => setContact({ ...contact, name: v })} />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <TextField icon={Mail} placeholder="Email address *" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} type="email" />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <TextField icon={Phone} placeholder="Phone number" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: v })} type="tel" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                  <TextField icon={Calendar} placeholder="Preferred date (e.g. Next Tuesday)" value={contact.date} onChange={(v) => setContact({ ...contact, date: v })} />
                  <textarea
                    placeholder="Special instructions or notes (optional)"
                    value={contact.notes}
                    onChange={(e) => setContact({ ...contact, notes: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg px-4 py-3 text-sm bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="rounded-lg py-3 px-4 text-sm font-semibold flex items-center gap-2 border border-border text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={!contact.name || !contact.email}
                    className="flex-1 rounded-lg py-3 font-bold text-sm flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
                  >
                    Send Quote Request <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Success */}
            {step === "success" && (
              <div className="relative rounded-xl border border-border bg-card p-8 text-center py-14 overflow-hidden">
                <Confetti />
                <div className="relative z-10">
                  <div className="mx-auto mb-5 rounded-full p-4 w-fit bg-primary/10">
                    <Sparkles size={32} className="text-primary" />
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)" }} className="text-4xl font-bold text-foreground uppercase mb-3">
                    Quote Request Sent{contact.name ? `, ${contact.name.split(" ")[0]}` : ""}!
                  </h2>
                  <p className="text-muted-foreground text-base max-w-md mx-auto mb-8">
                    Our team will contact you within 1 business hour to confirm your{" "}
                    <strong className="text-foreground">${range[0]}–${range[1]}</strong> estimate and lock in your service window.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={`tel:+1${PHONE}`}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                    >
                      <Phone size={16} /> Call {PHONE_DISPLAY}
                    </a>
                    <Link
                      to="/book"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary border border-border text-foreground rounded-lg font-semibold text-sm hover:border-primary/50 transition-colors"
                    >
                      Book Online Directly
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---- RIGHT: Sidebar ---- */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <ZipValidator title="Check Zip Coverage" />

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold text-foreground uppercase mb-4 flex items-center gap-2">
                <ShieldCheck size={20} className="text-primary" /> Why Lunova?
              </h3>
              <ul className="space-y-3">
                {[
                  { text: "Licensed, bonded & fully insured", icon: ShieldCheck },
                  { text: "Flat-rate pricing — no surprise fees", icon: Tag },
                  { text: "Same-day & next-day slots available", icon: Clock },
                  { text: "10% off when you bundle 2+ services", icon: Sparkles },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t border-border flex gap-2">
                <a
                  href={`tel:+1${PHONE}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:bg-primary/90 transition-colors"
                >
                  <Phone size={13} /> Call Us
                </a>
                <a
                  href={`sms:+1${PHONE}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-border text-foreground rounded-lg font-semibold text-xs hover:border-primary/50 hover:text-primary transition-colors"
                >
                  <MessageSquare size={13} /> Text Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
