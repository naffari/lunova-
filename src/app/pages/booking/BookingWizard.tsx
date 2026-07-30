import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, ChevronRight, AlertCircle, Info } from "lucide-react";
import { PHONE_DISPLAY } from "../../constants/contact";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  CITIES,
  HEAR_ABOUT_OPTIONS,
  STEP_LABELS,
  FREQUENCY_OPTIONS,
  TIME_WINDOWS,
} from "./wizardData";
import {
  SERVICE_BY_ID,
  SERVICE_NAME_BY_ID,
  buildEstimate,
  formatDollars,
  formatPrice,
  startingAtLabel,
  BUNDLE_DISCOUNT,
} from "../../constants/services";
import { checkCoverage, isServable, normalizeZip } from "../../constants/serviceArea";
import { trackBookingStep, trackEvent } from "../../utils/analytics";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors";

const labelClass = "block text-xs font-medium text-muted-foreground mb-1.5";

const rowClass = (checked: boolean) =>
  `flex items-center gap-2.5 px-3.5 py-3 rounded-xl border cursor-pointer transition-colors ${
    checked ? "bg-primary/10 border-primary/30" : "bg-background border-border"
  }`;

const checkboxClass = (checked: boolean) =>
  `w-[18px] h-[18px] rounded-[5px] flex-none flex items-center justify-center border-2 transition-colors ${
    checked ? "border-primary bg-primary text-white" : "border-muted-foreground/40 bg-transparent"
  }`;

const btnPrimary =
  "inline-flex items-center gap-1.5 font-bold px-6 py-3 rounded-full text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

const btnSecondary =
  "inline-flex items-center gap-1.5 font-semibold px-6 py-3 rounded-full text-sm border border-border text-foreground hover:bg-secondary transition-colors";

const TOTAL_STEPS = STEP_LABELS.length;

/** sessionStorage key. Bumped when the shape changes so stale drafts are dropped. */
const DRAFT_KEY = "lunova:booking-draft:v1";

interface WizardState {
  step: number;
  category: string;
  subservices: string[];
  addons: string[];
  frequency: string;
  notes: string;
  date: string;
  timeWindow: string;
  street: string;
  city: string;
  zip: string;
  name: string;
  phone: string;
  email: string;
  hearAbout: string;
  /**
   * Honeypot. Hidden from humans and never populated by them; bots that fill
   * every input will set it, and the API drops those submissions. Kept in
   * wizard state rather than read off the DOM so it survives step navigation.
   */
  website: string;
  submitted: boolean;
}

const INITIAL_STATE: WizardState = {
  step: 1,
  category: "",
  subservices: [],
  addons: [],
  frequency: "One-Time",
  notes: "",
  date: "",
  timeWindow: "",
  street: "",
  city: "",
  zip: "",
  name: "",
  phone: "",
  email: "",
  hearAbout: "",
  website: "",
  submitted: false,
};

/**
 * Restore an in-progress booking.
 *
 * Wizard state was previously bare `useState`: a refresh, an accidental back
 * swipe, or following a link out to check a gate code wiped all five steps. A
 * partly-filled form is the most valuable state on the site, so it survives
 * reloads. Never restore `submitted` — that would show a fake confirmation.
 */
function loadDraft(): WizardState {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<WizardState>;
    return { ...INITIAL_STATE, ...parsed, submitted: false };
  } catch {
    return INITIAL_STATE;
  }
}

export default function BookingWizard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<WizardState>(loadDraft);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const hydrated = useRef(false);

  // Read deep-link params once on mount. The ZIP checker on the homepage and
  // service-area section hands off `zip`, `city`, and `service` this way, so a
  // visitor who already answered those questions is never asked twice.
  useEffect(() => {
    const service = searchParams.get("service");
    const zip = normalizeZip(searchParams.get("zip") || "");
    const city = searchParams.get("city") || "";
    const step = Number(searchParams.get("step"));

    setState((s) => {
      const next = { ...s };
      if (service && CATEGORY_LABELS[service]) {
        next.category = service;
        next.step = Math.max(next.step, 2);
      }
      if (zip.length === 5) next.zip = zip;
      if (city && CITIES.includes(city)) next.city = city;
      if (Number.isInteger(step) && step >= 1 && step <= TOTAL_STEPS) next.step = step;
      return next;
    });

    hydrated.current = true;
    // Deep-link is read on first mount only; later navigation is driven by state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the draft on every change.
  useEffect(() => {
    if (state.submitted) {
      sessionStorage.removeItem(DRAFT_KEY);
      return;
    }
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch {
      // Private-mode or quota failure — the wizard still works, it just won't resume.
    }
  }, [state]);

  // Keep ?step= in sync so the browser back button walks back through the
  // wizard instead of leaving the site, and report the step for funnel analytics.
  useEffect(() => {
    if (!hydrated.current || state.submitted) return;

    const params = new URLSearchParams(searchParams);
    params.set("step", String(state.step));
    setSearchParams(params, { replace: true });

    trackBookingStep(state.step, STEP_LABELS[state.step - 1], state.category || undefined);
    stepHeadingRef.current?.focus();
    // searchParams is intentionally omitted: including it re-fires on our own write.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step]);

  const categoryLabel = SERVICE_NAME_BY_ID[state.category] || "";
  const service = SERVICE_BY_ID[state.category];

  const estimate = buildEstimate({
    serviceId: state.category,
    selected: state.subservices,
    addonIds: state.addons,
  });

  const coverage = state.zip.length === 5 ? checkCoverage(state.zip) : null;

  function next() {
    setState((s) => ({ ...s, step: Math.min(TOTAL_STEPS, s.step + 1) }));
  }
  function back() {
    setState((s) => ({ ...s, step: Math.max(1, s.step - 1) }));
  }
  function selectCategory(id: string) {
    // Add-ons are keyed to the chosen service, so a change invalidates them.
    setState((s) => (s.category === id ? s : { ...s, category: id, subservices: [], addons: [] }));
  }
  function toggleSubservice(name: string) {
    setState((s) => ({
      ...s,
      subservices: s.subservices.includes(name)
        ? s.subservices.filter((v) => v !== name)
        : [...s.subservices, name],
    }));
  }
  function toggleAddon(id: string) {
    setState((s) => ({
      ...s,
      addons: s.addons.includes(id) ? s.addons.filter((v) => v !== id) : [...s.addons, id],
    }));
  }
  function update<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }
  function resetAll() {
    sessionStorage.removeItem(DRAFT_KEY);
    setState(INITIAL_STATE);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: state.category,
          categoryLabel,
          // Send the priced display strings the customer actually saw.
          subservices: selectedWithPrices(),
          addons: state.addons.map((id) => `${SERVICE_NAME_BY_ID[id]} — ${addonPriceLabel(id)}`),
          frequency: state.frequency,
          notes: state.notes,
          date: state.date,
          timeWindow: state.timeWindow,
          street: state.street,
          city: state.city,
          zip: state.zip,
          name: state.name,
          phone: state.phone,
          email: state.email,
          hearAbout: state.hearAbout,
          website: state.website,
          estimateFloor: estimate.total,
          estimateHasCustomItems: estimate.hasCustom,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong submitting your request.");
      }
      trackEvent("booking_submitted", {
        service: state.category,
        services: estimate.serviceCount,
        estimate: estimate.total,
      });
      setState((s) => ({ ...s, submitted: true }));
    } catch (err) {
      trackEvent("booking_error", { service: state.category });
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong submitting your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function selectedWithPrices(): string[] {
    if (!service) return state.subservices;
    return service.subservices
      .filter((sub) => state.subservices.includes(sub.name))
      .map((sub) => `${sub.name} — ${formatPrice(sub)}`);
  }

  function addonPriceLabel(id: string): string {
    const addon = SERVICE_BY_ID[id];
    return addon ? startingAtLabel(addon).replace(/^From /, "from ") : "";
  }

  const step1NextDisabled = !state.category;
  const step2NextDisabled = state.subservices.length === 0;
  // ZIP is required (not just collected) because the CRM rejects an address
  // without one, and a lead that only lands in email is a lead we lose track of.
  const step3NextDisabled = !(
    state.date &&
    state.timeWindow &&
    state.street &&
    state.city &&
    state.zip.length === 5
  );
  const step4NextDisabled = !(state.name && state.phone && state.email);

  const scheduleParts: string[] = [];
  if (state.date) {
    scheduleParts.push(
      new Date(`${state.date}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  }
  if (state.timeWindow) scheduleParts.push(state.timeWindow);

  if (state.submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto mb-5">
          <Check size={30} strokeWidth={2.75} />
        </div>
        <h1 className="font-serif-display text-3xl mb-3 text-foreground">Request received!</h1>
        <p className="text-sm leading-relaxed text-muted-foreground mb-8 max-w-md mx-auto">
          We'll call {state.phone || "you"} within one business hour to confirm your{" "}
          {categoryLabel || "service"} appointment.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button type="button" onClick={resetAll} className={btnPrimary}>
            Book another service
          </button>
          <Link to="/" className={btnSecondary}>
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[760px] mx-auto">
      <h1 className="font-serif-display text-3xl mb-1.5 text-foreground">Book your service</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Serving the Kansas City metro. We'll confirm your appointment by phone.
      </p>

      {/* Step indicator */}
      <div className="flex gap-1.5 mb-9">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = state.step > n;
          const active = state.step === n;
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className={`w-[30px] h-[30px] rounded-full flex items-center justify-center font-serif-display text-sm ${
                  done || active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/50"
                }`}
              >
                {n}
              </div>
              <div className={`text-[11px] ${active ? "font-bold opacity-100" : "font-normal opacity-60"}`}>
                {label}
              </div>
            </div>
          );
        })}
      </div>

      {/* STEP 1 — Service */}
      {state.step === 1 && (
        <div>
          <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif-display text-xl mb-5 text-foreground outline-none">
            What do you need done?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 mb-7">
            {CATEGORIES.map((cat, idx) => {
              const Icon = cat.icon;
              const active = state.category === cat.id;
              const iconTint = idx % 2 === 0 ? "bg-primary/15 text-primary" : "bg-accent/20 text-accent";
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => selectCategory(cat.id)}
                  aria-pressed={active}
                  className={`relative flex flex-col gap-0.5 p-4 rounded-2xl text-left border-2 transition-colors ${
                    active ? "bg-primary/10 border-primary" : "bg-secondary border-transparent"
                  }`}
                >
                  {cat.popular && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                      Popular
                    </span>
                  )}
                  <div className={`w-[38px] h-[38px] rounded-full flex items-center justify-center ${iconTint}`}>
                    <Icon size={18} />
                  </div>
                  <div className="font-serif-display text-base mt-2.5 text-foreground">{cat.name}</div>
                  <div className="text-xs font-semibold text-primary">{cat.price}</div>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={next} disabled={step1NextDisabled} className={btnPrimary}>
              Continue <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — Details */}
      {state.step === 2 && (
        <div>
          <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif-display text-xl mb-1 text-foreground outline-none">
            Tell us more
          </h2>
          <p className="text-sm text-muted-foreground mb-6">{categoryLabel}</p>

          <div className="mb-6">
            <span className={labelClass}>Select all that apply</span>
            <div className="grid gap-2">
              {(service?.subservices || []).map((sub) => {
                const checked = state.subservices.includes(sub.name);
                return (
                  <label key={sub.name} className={rowClass(checked)}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSubservice(sub.name)}
                      className="sr-only"
                    />
                    <span className={checkboxClass(checked)}>
                      {checked && <Check size={11} strokeWidth={3.25} />}
                    </span>
                    <span className="flex-1 text-sm text-foreground">{sub.name}</span>
                    <span className="text-xs text-muted-foreground">{formatPrice(sub)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {(service?.upsells.length ?? 0) > 0 && (
            <div className="rounded-2xl p-5 mb-6 bg-accent/15">
              <div className="font-serif-display text-sm mb-0.5 text-foreground">You might also like</div>
              <p className="text-xs text-muted-foreground mb-3">
                Add another service to this visit and {Math.round(BUNDLE_DISCOUNT * 100)}% comes off the
                combined total.
              </p>
              <div className="grid gap-2">
                {(service?.upsells || []).map((id) => {
                  const checked = state.addons.includes(id);
                  return (
                    <label key={id} className={rowClass(checked)}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(id)}
                        className="sr-only"
                      />
                      <span className={checkboxClass(checked)}>
                        {checked && <Check size={11} strokeWidth={3.25} />}
                      </span>
                      <span className="flex-1 text-sm text-foreground">{SERVICE_NAME_BY_ID[id]}</span>
                      <span className="text-xs text-muted-foreground">{addonPriceLabel(id)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-5">
            <span className={`${labelClass} mb-2`}>How often?</span>
            <div className="inline-flex rounded-full border border-border overflow-hidden">
              {FREQUENCY_OPTIONS.map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => update("frequency", freq)}
                  aria-pressed={state.frequency === freq}
                  className={`px-4 py-2 text-sm transition-colors ${
                    state.frequency === freq
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-7">
            <label htmlFor="notes" className={labelClass}>
              Anything else we should know? (optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={state.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Gate code, pets, special requests..."
              className={inputClass}
            />
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={back} className={btnSecondary}>
              Back
            </button>
            <button type="button" onClick={next} disabled={step2NextDisabled} className={btnPrimary}>
              Continue <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Schedule */}
      {state.step === 3 && (
        <div>
          <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif-display text-xl mb-5 text-foreground outline-none">
            When &amp; where
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="date" className={labelClass}>Preferred date</label>
              <input
                id="date"
                type="date"
                value={state.date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => update("date", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <span className={labelClass}>Preferred time</span>
              <div className="flex rounded-full border border-border overflow-hidden w-full">
                {TIME_WINDOWS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => update("timeWindow", w)}
                    aria-pressed={state.timeWindow === w}
                    className={`flex-1 px-3 py-2.5 text-sm transition-colors ${
                      state.timeWindow === w
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="street" className={labelClass}>Street address</label>
            <input
              id="street"
              value={state.street}
              onChange={(e) => update("street", e.target.value)}
              placeholder="123 Main St"
              autoComplete="address-line1"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-[2fr_1fr] gap-4 mb-2">
            <div>
              <label htmlFor="city" className={labelClass}>City</label>
              <select
                id="city"
                value={state.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass}
              >
                <option value="">Select your city</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                {/* Escape hatch: the twelve named cities are not the whole
                    service area, and a visitor in a covered suburb previously
                    had no valid option here at all. */}
                <option value="Other (nearby)">Other nearby city</option>
              </select>
            </div>
            <div>
              <label htmlFor="zip" className={labelClass}>ZIP</label>
              <input
                id="zip"
                value={state.zip}
                onChange={(e) => update("zip", normalizeZip(e.target.value))}
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="64106"
                aria-describedby="zip-coverage"
                className={inputClass}
              />
            </div>
          </div>

          {/* Coverage feedback, resolved from the ZIP rather than the dropdown. */}
          <p id="zip-coverage" className="text-xs mb-7 flex items-start gap-1.5">
            {coverage && isServable(coverage.status) ? (
              <>
                <Check size={13} className="mt-0.5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{coverage.message}</span>
              </>
            ) : coverage?.status === "outside" ? (
              <>
                <Info size={13} className="mt-0.5 shrink-0 text-destructive" />
                <span className="text-muted-foreground">
                  That ZIP is outside our usual routes. Submit anyway and we'll call to see what we can
                  do — or reach us on {PHONE_DISPLAY}.
                </span>
              </>
            ) : (
              <span className="text-muted-foreground">
                Enter your ZIP and we'll confirm coverage. Not sure? Call {PHONE_DISPLAY}.
              </span>
            )}
          </p>

          <div className="flex justify-between">
            <button type="button" onClick={back} className={btnSecondary}>
              Back
            </button>
            <button type="button" onClick={next} disabled={step3NextDisabled} className={btnPrimary}>
              Continue <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — Contact */}
      {state.step === 4 && (
        <div>
          <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif-display text-xl mb-5 text-foreground outline-none">
            Your contact info
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className={labelClass}>Full name</label>
              <input
                id="name"
                value={state.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone number</label>
              <input
                id="phone"
                type="tel"
                value={state.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="(816) 555-0100"
                autoComplete="tel"
                className={inputClass}
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className={labelClass}>Email</label>
            <input
              id="email"
              type="email"
              value={state.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="jane@example.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>
          {/*
            Honeypot. `aria-hidden` + `tabIndex={-1}` keep it away from screen
            readers and the keyboard; the off-screen positioning keeps it out of
            sight without `display:none`, which some bots specifically skip.
            Do not add a visible label and do not remove `autoComplete="off"` —
            a browser autofilling this would drop a real customer's booking.
          */}
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, overflow: "hidden" }}>
            <label htmlFor="website">Website (leave blank)</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={state.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>

          <div className="mb-7">
            <label htmlFor="hearAbout" className={labelClass}>How did you hear about us? (optional)</label>
            <select
              id="hearAbout"
              value={state.hearAbout}
              onChange={(e) => update("hearAbout", e.target.value)}
              className={inputClass}
            >
              <option value="">Select one</option>
              {HEAR_ABOUT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={back} className={btnSecondary}>
              Back
            </button>
            <button type="button" onClick={next} disabled={step4NextDisabled} className={btnPrimary}>
              Review <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5 — Review */}
      {state.step === 5 && (
        <div>
          <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif-display text-xl mb-5 text-foreground outline-none">
            Review &amp; confirm
          </h2>
          <div className="rounded-3xl border border-border p-6 mb-6 grid gap-3.5">
            <ReviewRow label="Service" value={categoryLabel} />
            <ReviewRow label="Selected" value={selectedWithPrices().join(", ") || "—"} />
            {state.addons.length > 0 && (
              <ReviewRow
                label="Add-ons"
                value={state.addons.map((id) => SERVICE_NAME_BY_ID[id]).join(", ")}
              />
            )}
            <ReviewRow label="Frequency" value={state.frequency} />
            <ReviewRow label="Date & time" value={scheduleParts.join(" · ") || "—"} />
            <ReviewRow label="Address" value={[state.street, state.city, state.zip].filter(Boolean).join(", ") || "—"} />
            <ReviewRow label="Contact" value={[state.name, state.phone, state.email].filter(Boolean).join(" · ") || "—"} />
            {state.notes && <ReviewRow label="Notes" value={state.notes} />}
          </div>

          {submitError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 mb-6 text-sm text-destructive">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{submitError} Please try again, or call us at {PHONE_DISPLAY}.</span>
            </div>
          )}

          <div className="flex justify-between">
            <button type="button" onClick={back} disabled={submitting} className={btnSecondary}>
              Back
            </button>
            <button type="button" onClick={handleSubmit} disabled={submitting} className={btnPrimary}>
              {submitting ? "Submitting…" : "Submit request"} <Check size={14} />
            </button>
          </div>
        </div>
      )}

      {/*
        Running estimate. Appears from step 2, once there is something to price.

        Every figure is a FLOOR, and the copy says so — the wizard previously
        showed per-item prices and then never summed them, so a customer could
        tick a $220 deep clean plus a $60 add-on and reach the submit button
        without ever seeing a total.
      */}
      {state.step >= 2 && !state.submitted && estimate.serviceCount > 0 && (
        <div className="sticky bottom-4 mt-8">
          <div className="rounded-2xl border border-primary/25 bg-card shadow-lg px-5 py-4">
            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Estimated starting price
                </p>
                <p className="font-serif-display text-2xl text-foreground mt-0.5">
                  {estimate.subtotal > 0 ? `${formatDollars(estimate.total)}+` : "Custom quote"}
                  {estimate.hasRecurring && estimate.subtotal > 0 && (
                    <span className="text-sm font-sans font-medium text-muted-foreground"> incl. recurring</span>
                  )}
                </p>
              </div>
              {estimate.discount > 0 && (
                <p className="text-xs font-bold text-primary">
                  −{formatDollars(estimate.discount)} bundle discount applied
                </p>
              )}
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground mt-2">
              {estimate.hasCustom
                ? "Some of what you've picked needs a look at the property before we can price it — we'll confirm the full figure on the phone."
                : "A starting figure, not a quote. We confirm the final price before any work begins."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}
