import { ArrowLeft, ArrowRight, Calendar, Check, Mail, Phone, User } from "lucide-react";
import { Link } from "react-router";
import { PHONE, PHONE_DISPLAY } from "../../constants/contact";
import { SERVICES } from "../../utils/pricing";
import { CheckToggle, PillGroup, PriceGauge, Stepper, TextField } from "./QuoteAtoms";
import { useQuote } from "./QuoteContext";

function ServiceDetailsStep() {
  const { service, opts, setOpts, range, setStep } = useQuote();
  if (!service) return null;

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
          onClick={() => setStep("service")}
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
            onClick={() => setStep("contact")}
            className="flex-1 rounded-lg py-3 font-bold text-sm flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Continue <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuoteForm() {
  const { step, service, setService, setStep, contact, setContact, errors, range, handleSubmit } = useQuote();

  if (step === "service") {
    return (
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
    );
  }

  if (step === "details") {
    return <ServiceDetailsStep />;
  }

  if (step === "contact") {
    return (
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
    );
  }

  return null;
}
