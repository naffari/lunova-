import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, ChevronRight, AlertCircle } from "lucide-react";
import { PHONE, PHONE_DISPLAY } from "../../constants/contact";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  SUBSERVICE_CATALOG,
  UPSELL_MAP,
  ADDON_CATALOG,
  CITIES,
  HEAR_ABOUT_OPTIONS,
  STEP_LABELS,
} from "./wizardData";

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
  submitted: false,
};

const FREQUENCY_OPTIONS = ["One-Time", "Weekly", "Bi-Weekly", "Monthly"];
const TIME_WINDOWS = ["Morning", "Afternoon", "Evening"];

export default function BookingWizard() {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<WizardState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const service = searchParams.get("service");
    if (service && CATEGORY_LABELS[service]) {
      setState((s) => ({ ...s, category: service, step: 2 }));
    }
    // Only read the deep-link on first mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categoryLabel = CATEGORY_LABELS[state.category] || "";

  function next() {
    setState((s) => ({ ...s, step: Math.min(5, s.step + 1) }));
  }
  function back() {
    setState((s) => ({ ...s, step: Math.max(1, s.step - 1) }));
  }
  function selectCategory(id: string) {
    setState((s) => ({ ...s, category: id }));
  }
  function toggleSubservice(value: string) {
    setState((s) => ({
      ...s,
      subservices: s.subservices.includes(value)
        ? s.subservices.filter((v) => v !== value)
        : [...s.subservices, value],
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
          subservices: state.subservices,
          addons: state.addons.map((id) => ADDON_CATALOG[id]),
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
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong submitting your request.");
      }
      setState((s) => ({ ...s, submitted: true }));
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong submitting your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
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
          We'll call {state.phone || "you"} within one business hour to confirm your {categoryLabel || "service"} appointment.
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
          <h2 className="font-serif-display text-xl mb-5 text-foreground">What do you need done?</h2>
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
                  className={`flex flex-col gap-0.5 p-4 rounded-2xl text-left border-2 transition-colors ${
                    active ? "bg-primary/10 border-primary" : "bg-secondary border-transparent"
                  }`}
                >
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
          <h2 className="font-serif-display text-xl mb-1 text-foreground">Tell us more</h2>
          <p className="text-sm text-muted-foreground mb-6">{categoryLabel}</p>

          <div className="mb-6">
            <span className={labelClass}>Select all that apply</span>
            <div className="grid gap-2">
              {(SUBSERVICE_CATALOG[state.category] || []).map((opt) => {
                const value = `${opt.name} — ${opt.price}`;
                const checked = state.subservices.includes(value);
                return (
                  <label key={opt.name} className={rowClass(checked)}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSubservice(value)}
                      className="sr-only"
                    />
                    <span className={checkboxClass(checked)}>
                      {checked && <Check size={11} strokeWidth={3.25} />}
                    </span>
                    <span className="flex-1 text-sm text-foreground">{opt.name}</span>
                    <span className="text-xs text-muted-foreground">{opt.price}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {state.category && (UPSELL_MAP[state.category] || []).length > 0 && (
            <div className="rounded-2xl p-5 mb-6 bg-accent/15">
              <div className="font-serif-display text-sm mb-0.5 text-foreground">You might also like</div>
              <p className="text-xs text-muted-foreground mb-3">
                Bundle another service into this visit and save a trip.
              </p>
              <div className="grid gap-2">
                {(UPSELL_MAP[state.category] || []).map((id) => {
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
                      <span className="flex-1 text-sm text-foreground">{ADDON_CATALOG[id]}</span>
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
          <h2 className="font-serif-display text-xl mb-5 text-foreground">When &amp; where</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label htmlFor="date" className={labelClass}>Preferred date</label>
              <input
                id="date"
                type="date"
                value={state.date}
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
              </select>
            </div>
            <div>
              <label htmlFor="zip" className={labelClass}>ZIP</label>
              <input
                id="zip"
                value={state.zip}
                onChange={(e) => update("zip", e.target.value.replace(/\D/g, "").slice(0, 5))}
                inputMode="numeric"
                placeholder="64106"
                className={inputClass}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-7">
            Don't see your city? Call us at {PHONE_DISPLAY} — we may still be able to serve you.
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
          <h2 className="font-serif-display text-xl mb-5 text-foreground">Your contact info</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className={labelClass}>Full name</label>
              <input
                id="name"
                value={state.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone number</label>
              <input
                id="phone"
                value={state.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="(816) 555-0100"
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
              className={inputClass}
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
          <h2 className="font-serif-display text-xl mb-5 text-foreground">Review &amp; confirm</h2>
          <div className="rounded-3xl border border-border p-6 mb-6 grid gap-3.5">
            <ReviewRow label="Service" value={categoryLabel} />
            <ReviewRow label="Selected" value={state.subservices.join(", ") || "—"} />
            {state.addons.length > 0 && (
              <ReviewRow label="Add-ons" value={state.addons.map((id) => ADDON_CATALOG[id]).join(", ")} />
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
