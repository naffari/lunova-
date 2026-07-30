import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, ChevronRight, ChevronLeft, AlertCircle, Info, Loader2 } from "lucide-react";
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
  cheapestSubservice,
  formatDollars,
  startingAtLabel,
  BUNDLE_DISCOUNT,
} from "../../constants/services";
import {
  defaultAnswers,
  findPackage,
  getServiceDetail,
  priceDetail,
  type Answers,
} from "../../constants/serviceDetails";
import { checkCoverage, isServable, normalizeZip } from "../../constants/serviceArea";
import { trackBookingStep, trackEvent } from "../../utils/analytics";
import { useCrmPricing } from "../../hooks/useCrmPricing";
import { Field, PrivacyNote, StepNav } from "./WizardChrome";
import ServiceDetailStep from "./ServiceDetailStep";
import ConfettiBurst from "../../components/common/ConfettiBurst";
import { SERVICE_THEMES } from "../../constants/theme";
import { BRAND } from "../../constants/brand";

const inputClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow";

const inputErrorClass =
  "w-full rounded-xl border border-destructive bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-destructive/20 transition-shadow";

const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 font-bold px-7 py-3.5 rounded-full text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors";

const btnSecondary =
  "inline-flex items-center justify-center gap-1.5 font-semibold px-5 py-3.5 rounded-full text-sm border border-border text-foreground hover:bg-secondary transition-colors";

const TOTAL_STEPS = STEP_LABELS.length;
/** Bumped: the shape changed from a subservice list to package + answers. */
const DRAFT_KEY = "lunova:booking-draft:v3";

interface WizardState {
  step: number;
  furthest: number;
  category: string;
  /** Chosen package id within the category, e.g. "deep". */
  packageId: string;
  /** Answers to the category's qualifying questions, keyed by question id. */
  answers: Answers;
  /** In-service add-on ids, e.g. "oven". */
  extras: string[];
  /** Other departments bundled into the same visit, by service id. */
  bundles: string[];
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
  website: string;
  submitted: boolean;
}

const INITIAL_STATE: WizardState = {
  step: 1,
  furthest: 1,
  category: "",
  packageId: "",
  answers: {},
  extras: [],
  bundles: [],
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

/** Loose on purpose — the goal is catching typos, not policing valid addresses. */
function isEmailish(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

/** US numbers only; the crew calls to confirm, so 10 digits is the real bar. */
function isPhoneish(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

export default function BookingWizard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<WizardState>(loadDraft);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  /**
   * Which steps the user has tried to leave. Errors only render for those, so
   * the form never scolds someone about a field they haven't reached yet —
   * validate-on-submit-attempt, not validate-on-render.
   */
  const [touched, setTouched] = useState<Set<number>>(new Set());
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    const service = searchParams.get("service");
    const packageParam = searchParams.get("package");
    const zip = normalizeZip(searchParams.get("zip") || "");
    const city = searchParams.get("city") || "";
    const step = Number(searchParams.get("step"));

    setState((s) => {
      const next = { ...s };
      if (service && CATEGORY_LABELS[service]) {
        next.category = service;
        next.step = Math.max(next.step, 2);
        next.answers = { ...defaultAnswers(service), ...next.answers };

        /**
         * The service-page → wizard deep link. Clicking "Book this" under a
         * package on a service page (see PackageGrid) lands here with both
         * `service` and `package` set — the exact tier the visitor was
         * reading is already selected, so step 2 opens on the qualifying
         * questions instead of asking them to re-pick a package that's
         * literally still on their screen a click ago.
         */
        if (packageParam && findPackage(service, packageParam)) {
          next.packageId = packageParam;
          next.step = Math.max(next.step, 2);
        }
      }
      if (zip.length === 5) next.zip = zip;
      if (city && CITIES.includes(city)) next.city = city;
      if (Number.isInteger(step) && step >= 1 && step <= TOTAL_STEPS) next.step = step;
      next.furthest = Math.max(next.furthest, next.step);
      return next;
    });

    hydrated.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state.submitted) {
      sessionStorage.removeItem(DRAFT_KEY);
      return;
    }
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch {
      // Private mode / quota — the wizard works, it just won't resume.
    }
  }, [state]);

  useEffect(() => {
    if (!hydrated.current || state.submitted) return;
    const params = new URLSearchParams(searchParams);
    params.set("step", String(state.step));
    setSearchParams(params, { replace: true });
    trackBookingStep(state.step, STEP_LABELS[state.step - 1], state.category || undefined);
    stepHeadingRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.step]);

  const categoryLabel = SERVICE_NAME_BY_ID[state.category] || "";
  const service = SERVICE_BY_ID[state.category];

  // Live CRM prices, matched onto the configured packages by name. The
  // structure (checklists, exclusions, durations) always comes from
  // serviceDetails.ts — the CRM only supplies the number, and only when it
  // recognises the tier. Never blocks: the configured price shows immediately.
  const { overrides: crmPrices, source: pricingSource } = useCrmPricing(state.category);

  const detail = useMemo(() => {
    const base = getServiceDetail(state.category);
    if (!base || Object.keys(crmPrices).length === 0) return base;
    return {
      ...base,
      packages: base.packages.map((pkg) => {
        const live = crmPrices[pkg.name.trim().toLowerCase()];
        return live === undefined || pkg.custom ? pkg : { ...pkg, from: live };
      }),
    };
  }, [state.category, crmPrices]);

  /**
   * The estimate, assembled from the chosen package, the qualifying answers,
   * the in-service extras, and any bundled departments.
   *
   * Bundled departments contribute their cheapest entry price, because the
   * customer hasn't configured them — we'll pin those down on the call.
   */
  const estimate = useMemo(() => {
    const detailPrice = priceDetail(detail, state.packageId, state.answers, state.extras);

    let bundleTotal = 0;
    let bundleNeedsVisit = false;
    for (const id of state.bundles) {
      const cheapest = cheapestSubservice(SERVICE_BY_ID[id]);
      if (cheapest?.from === undefined) bundleNeedsVisit = true;
      else bundleTotal += cheapest.from;
    }

    const serviceCount = (state.packageId ? 1 : 0) + state.bundles.length;
    const subtotal = detailPrice.subtotal + bundleTotal;
    const discount = serviceCount > 1 ? Math.round(subtotal * BUNDLE_DISCOUNT) : 0;

    return {
      ...detailPrice,
      bundleTotal,
      subtotal,
      discount,
      total: subtotal - discount,
      serviceCount,
      needsVisit: detailPrice.needsVisit || bundleNeedsVisit,
    };
  }, [state.category, state.packageId, state.answers, state.extras, state.bundles]);

  const coverage = state.zip.length === 5 ? checkCoverage(state.zip) : null;

  /** Per-step field errors. Keyed by field id so Field can pull its own. */
  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (state.step === 2 && !state.packageId) {
      e.packageId = "Choose a package so we know what to quote.";
    }
    if (state.step === 3) {
      if (!state.date) e.date = "Choose a preferred date.";
      if (!state.timeWindow) e.timeWindow = "Pick a time window.";
      if (!state.street.trim()) e.street = "We need the street address to route the crew.";
      if (!state.city) e.city = "Select your city.";
      if (state.zip.length !== 5) e.zip = "Enter a 5-digit ZIP.";
    }
    if (state.step === 4) {
      if (!state.name.trim()) e.name = "Tell us who to ask for.";
      if (!isPhoneish(state.phone)) e.phone = "Enter a 10-digit phone number we can reach you on.";
      if (!isEmailish(state.email)) e.email = "Enter a valid email for your confirmation.";
    }
    return e;
  }, [state]);

  const showErrors = touched.has(state.step);
  const errorFor = (field: string) => (showErrors ? errors[field] : undefined);
  const stepValid = Object.keys(errors).length === 0;

  function next() {
    setTouched((t) => new Set(t).add(state.step));
    if (!stepValid) {
      trackEvent("booking_step_blocked", { step: state.step, fields: Object.keys(errors).join(",") });
      return;
    }
    setState((s) => {
      const step = Math.min(TOTAL_STEPS, s.step + 1);
      return { ...s, step, furthest: Math.max(s.furthest, step) };
    });
  }

  function back() {
    setState((s) => ({ ...s, step: Math.max(1, s.step - 1) }));
  }

  function jumpTo(step: number) {
    setState((s) => (step <= s.furthest ? { ...s, step } : s));
  }

  function selectCategory(id: string) {
    // Package, answers and extras are all keyed to the category, so switching
    // service invalidates every one of them. Seed the answers with sensible
    // defaults so the estimate is meaningful before anyone touches a control.
    setState((s) =>
      s.category === id
        ? s
        : { ...s, category: id, packageId: "", answers: defaultAnswers(id), extras: [], bundles: [] }
    );
  }

  function selectPackage(id: string) {
    setState((s) => ({ ...s, packageId: id }));
  }

  function setAnswer(questionId: string, value: string | number) {
    setState((s) => ({ ...s, answers: { ...s.answers, [questionId]: value } }));
  }

  function toggleExtra(id: string) {
    setState((s) => ({
      ...s,
      extras: s.extras.includes(id) ? s.extras.filter((v) => v !== id) : [...s.extras, id],
    }));
  }

  function toggleBundle(id: string) {
    setState((s) => ({
      ...s,
      bundles: s.bundles.includes(id) ? s.bundles.filter((v) => v !== id) : [...s.bundles, id],
    }));
  }

  function update<K extends keyof WizardState>(key: K, value: WizardState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  function resetAll() {
    sessionStorage.removeItem(DRAFT_KEY);
    setTouched(new Set());
    setState(INITIAL_STATE);
  }

  const chosenPackage = findPackage(state.category, state.packageId);

  /**
   * The priced breakdown as plain text, for the review screen and the crew's
   * email. Every line the customer saw, in the order they saw it — so the
   * person doing the job knows exactly what was sold.
   */
  function breakdownLines(): string[] {
    return estimate.lines.map((line) =>
      line.custom ? `${line.label} — quote on site` : `${line.label} — ${formatDollars(line.amount ?? 0)}`
    );
  }

  /** The answers, written out for a human rather than as raw ids. */
  function answerSummary(): string[] {
    if (!detail) return [];
    return detail.questions.flatMap((question) => {
      const value = state.answers[question.id];
      if (value === undefined || value === "") return [];
      if (question.kind === "counter") return [`${question.label}: ${value}`];
      const option = question.options.find((o) => o.value === value);
      return option ? [`${question.label}: ${option.label}`] : [];
    });
  }

  function bundlePriceLabel(id: string): string {
    const bundled = SERVICE_BY_ID[id];
    return bundled ? startingAtLabel(bundled).replace(/^From /, "from ") : "";
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
          // `subservices` keeps its name so the CRM payload contract doesn't
          // change; it now carries the package plus the full priced breakdown.
          subservices: [
            chosenPackage ? `${chosenPackage.name} (${chosenPackage.duration ?? "duration TBC"})` : "",
            ...answerSummary(),
            ...breakdownLines(),
          ].filter(Boolean),
          addons: state.bundles.map((id) => `${SERVICE_NAME_BY_ID[id]} — ${bundlePriceLabel(id)}`),
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
          estimateHasCustomItems: estimate.needsVisit,
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
        package: state.packageId,
        extras: state.extras.length,
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

  const scheduleParts: string[] = [];
  if (state.date) {
    scheduleParts.push(
      new Date(`${state.date}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    );
  }
  if (state.timeWindow) scheduleParts.push(state.timeWindow);

  if (state.submitted) {
    const dept = SERVICE_THEMES[state.category as keyof typeof SERVICE_THEMES];
    const confettiColors = dept
      ? [dept.accent, BRAND.primary, BRAND.accent, "#ffffff"]
      : [BRAND.primary, BRAND.accent, "#ffffff"];

    return (
      <div className="max-w-lg mx-auto text-center py-12">
        {/* The one moment in the flow that gets to be a little loud — a
            booking just landed. Everything else in this wizard stays quiet
            on purpose; see the artifact-design note on spending boldness
            in one place. */}
        <ConfettiBurst colors={confettiColors} />
        <div className="w-16 h-16 rounded-full bg-primary/12 text-primary flex items-center justify-center mx-auto mb-5 animate-in zoom-in-50 duration-300">
          <Check size={30} strokeWidth={2.75} />
        </div>
        <h1 className="font-serif-display text-3xl mb-3 text-foreground">Request received</h1>
        <p className="text-sm leading-relaxed text-muted-foreground mb-8 max-w-md mx-auto">
          We'll call {state.phone || "you"} within one business hour to confirm your{" "}
          {categoryLabel || "service"} appointment. Nothing is charged until we've agreed the price.
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
    <div className="max-w-[820px] mx-auto">
      <div className="mb-8">
        <h1 className="font-serif-display text-3xl sm:text-4xl mb-1.5 text-foreground">Book your service</h1>
        <p className="text-sm text-muted-foreground">
          Takes about two minutes. No payment now — we confirm the price by phone first.
        </p>
      </div>

      <StepNav labels={STEP_LABELS} current={state.step} furthest={state.furthest} onJump={jumpTo} />

      {/*
        One card per step. The previous version laid steps directly on the page
        background with no container, which is most of why it read as an
        unstyled form rather than a product.
      */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        {/* STEP 1 — Service */}
        {state.step === 1 && (
          <div>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif-display text-2xl mb-1 text-foreground outline-none">
              What do you need done?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Pick one. You can bundle more in the next step.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = state.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => selectCategory(cat.id)}
                    aria-pressed={active}
                    className={`relative flex flex-col items-start gap-3 p-4 rounded-2xl text-left border-2 transition-all duration-150 ${
                      active
                        ? "border-primary bg-primary/[0.07] scale-[1.02] shadow-[0_0_0_3px_var(--tw-shadow-color)] shadow-primary/15"
                        : "border-border bg-background hover:border-primary/40 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0"
                    }`}
                  >
                    {cat.popular && (
                      <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wide text-primary">
                        Popular
                      </span>
                    )}
                    {/* The tick replaces the icon on select — an unmistakable
                        state change, rather than a border colour a colourblind
                        user may not register — and pops in rather than fading,
                        the small immediate "you picked it" reward. */}
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        active ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                      }`}
                    >
                      {active ? (
                        <Check size={18} strokeWidth={3} className="animate-in zoom-in-50 spin-in-12 duration-200" />
                      ) : (
                        <Icon size={18} />
                      )}
                    </span>
                    <span className="text-sm font-semibold leading-tight text-foreground">{cat.name}</span>
                    <span className="text-xs font-bold text-primary -mt-1.5">{cat.price}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={next} disabled={!state.category} className={btnPrimary}>
                Continue <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — Details */}
        {state.step === 2 && detail && (
          <div>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif-display text-2xl mb-1 text-foreground outline-none">
              {detail.heading}
            </h2>
            <p className="text-sm text-muted-foreground mb-7">
              {detail.blurb}
              {pricingSource === "crm" && (
                <span className="ml-2 text-[11px] font-semibold text-primary whitespace-nowrap">
                  Live pricing
                </span>
              )}
            </p>

            <ServiceDetailStep
              detail={detail}
              packageId={state.packageId}
              answers={state.answers}
              addOnIds={state.extras}
              onPackage={selectPackage}
              onAnswer={setAnswer}
              onToggleAddOn={toggleExtra}
              packageError={errorFor("packageId")}
            />

            {(service?.upsells.length ?? 0) > 0 && (
              <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 mt-8">
                <p className="text-sm font-semibold text-foreground mb-0.5">
                  Need another department while we're there?
                </p>
                <p className="text-xs text-muted-foreground mb-3.5">
                  One visit, one crew, {Math.round(BUNDLE_DISCOUNT * 100)}% off the combined total. We'll
                  pin down the details for these on the call.
                </p>
                <div className="grid gap-2">
                  {(service?.upsells || []).map((id) => {
                    const checked = state.bundles.includes(id);
                    return (
                      <label
                        key={id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                          checked ? "border-primary bg-card" : "border-border/60 bg-card hover:border-primary/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleBundle(id)}
                          className="sr-only"
                        />
                        <span
                          className={`w-5 h-5 rounded-md flex-none flex items-center justify-center border-2 transition-colors ${
                            checked ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/35"
                          }`}
                        >
                          {checked && <Check size={12} strokeWidth={3.5} />}
                        </span>
                        <span className="flex-1 text-sm text-foreground">{SERVICE_NAME_BY_ID[id]}</span>
                        <span className="text-xs font-semibold text-muted-foreground">{bundlePriceLabel(id)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}


            <fieldset className="mb-7">
              <legend className="text-xs font-semibold text-foreground mb-2.5">How often?</legend>
              {/* Segmented control rather than a drop-down: Baymard found 55% of
                  users open a drop-down purely to see what's inside, and with
                  four options a drop-down saves nothing. */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FREQUENCY_OPTIONS.map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => update("frequency", freq)}
                    aria-pressed={state.frequency === freq}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                      state.frequency === freq
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/30"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mb-8">
              <Field id="notes" label="Anything else we should know?" hint="Gate codes, pets, parking, access instructions.">
                <textarea
                  id="notes"
                  rows={3}
                  value={state.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Side gate code is 4821, dog in the back yard…"
                  className={inputClass}
                />
              </Field>
            </div>

            <StepFooter onBack={back} onNext={next} nextLabel="Continue" />
          </div>
        )}

        {/* STEP 3 — Schedule */}
        {state.step === 3 && (
          <div>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif-display text-2xl mb-1 text-foreground outline-none">
              When &amp; where
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Pick a preference — we'll confirm the exact slot when we call.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <Field id="date" label="Preferred date" required error={errorFor("date")}>
                <input
                  id="date"
                  type="date"
                  value={state.date}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => update("date", e.target.value)}
                  className={errorFor("date") ? inputErrorClass : inputClass}
                />
              </Field>

              <Field id="timeWindow" label="Preferred time" required error={errorFor("timeWindow")}>
                <div className="grid grid-cols-3 gap-2" id="timeWindow">
                  {TIME_WINDOWS.map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => update("timeWindow", w)}
                      aria-pressed={state.timeWindow === w}
                      className={`py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                        state.timeWindow === w
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/30"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="mb-5">
              <Field id="street" label="Street address" required error={errorFor("street")}>
                <input
                  id="street"
                  value={state.street}
                  onChange={(e) => update("street", e.target.value)}
                  placeholder="123 Main St"
                  autoComplete="address-line1"
                  className={errorFor("street") ? inputErrorClass : inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_1fr] gap-5 mb-4">
              <Field id="city" label="City" required error={errorFor("city")}>
                {/*
                  Native datalist rather than a <select>. Baymard: drop-downs are
                  the wrong control above ~10 options, and this list is 13. A
                  text field with suggestions lets someone in a covered suburb we
                  don't list type their own city — the old <select> gave them no
                  valid choice at all.
                */}
                <input
                  id="city"
                  list="lunova-cities"
                  value={state.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="Start typing your city"
                  autoComplete="address-level2"
                  className={errorFor("city") ? inputErrorClass : inputClass}
                />
                <datalist id="lunova-cities">
                  {CITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>

              <Field id="zip" label="ZIP" required error={errorFor("zip")}>
                <input
                  id="zip"
                  value={state.zip}
                  onChange={(e) => update("zip", normalizeZip(e.target.value))}
                  inputMode="numeric"
                  autoComplete="postal-code"
                  placeholder="64106"
                  className={errorFor("zip") ? inputErrorClass : inputClass}
                />
              </Field>
            </div>

            <div className="mb-8">
              {coverage && isServable(coverage.status) ? (
                <p className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check size={13} className="mt-0.5 shrink-0 text-primary" />
                  {coverage.message}
                </p>
              ) : coverage?.status === "outside" ? (
                <p className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info size={13} className="mt-0.5 shrink-0 text-destructive" />
                  That ZIP is outside our usual routes. Submit anyway and we'll call to see what we can do —
                  or reach us on {PHONE_DISPLAY}.
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  We serve the Kansas City metro. Not sure about your street? Call {PHONE_DISPLAY}.
                </p>
              )}
            </div>

            <StepFooter onBack={back} onNext={next} nextLabel="Continue" />
          </div>
        )}

        {/* STEP 4 — Contact */}
        {state.step === 4 && (
          <div>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif-display text-2xl mb-1 text-foreground outline-none">
              How do we reach you?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Last step before you review.</p>

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <Field id="name" label="Full name" required error={errorFor("name")}>
                <input
                  id="name"
                  value={state.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                  className={errorFor("name") ? inputErrorClass : inputClass}
                />
              </Field>

              <Field
                id="phone"
                label="Phone number"
                required
                hint="So we can confirm your slot — one call, no marketing."
                error={errorFor("phone")}
              >
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={state.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="(816) 555-0100"
                  autoComplete="tel"
                  className={errorFor("phone") ? inputErrorClass : inputClass}
                />
              </Field>
            </div>

            <div className="mb-5">
              <Field
                id="email"
                label="Email"
                required
                hint="Your written confirmation goes here."
                error={errorFor("email")}
              >
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  value={state.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="jane@example.com"
                  autoComplete="email"
                  className={errorFor("email") ? inputErrorClass : inputClass}
                />
              </Field>
            </div>

            <div className="mb-5">
              <Field id="hearAbout" label="How did you hear about us?">
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
              </Field>
            </div>

            {/*
              Honeypot. Off-screen rather than display:none, which some bots skip.
              autoComplete="off" matters — a browser autofilling this would drop a
              real customer's booking.
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

            <div className="mb-8">
              <PrivacyNote>
                We use your details to schedule and confirm this job. We don't sell them, and we don't
                add you to a marketing list.
              </PrivacyNote>
            </div>

            <StepFooter onBack={back} onNext={next} nextLabel="Review" />
          </div>
        )}

        {/* STEP 5 — Review */}
        {state.step === 5 && (
          <div>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="font-serif-display text-2xl mb-1 text-foreground outline-none">
              Review &amp; confirm
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Check anything looks wrong? Tap a step above to go back and fix it.
            </p>

            <dl className="rounded-2xl border border-border divide-y divide-border mb-6">
              <ReviewRow label="Service" value={categoryLabel} />
              <ReviewRow label="Package" value={chosenPackage?.name || "—"} />
              {answerSummary().length > 0 && (
                <ReviewRow label="Details" value={answerSummary().join(" · ")} />
              )}
              {state.extras.length > 0 && (
                <ReviewRow
                  label="Add-ons"
                  value={(detail?.addOns || [])
                    .filter((a) => state.extras.includes(a.id))
                    .map((a) => a.name)
                    .join(", ")}
                />
              )}
              {state.bundles.length > 0 && (
                <ReviewRow
                  label="Also booking"
                  value={state.bundles.map((id) => SERVICE_NAME_BY_ID[id]).join(", ")}
                />
              )}
              <ReviewRow label="Frequency" value={state.frequency} />
              <ReviewRow label="Date & time" value={scheduleParts.join(" · ") || "—"} />
              <ReviewRow label="Address" value={[state.street, state.city, state.zip].filter(Boolean).join(", ") || "—"} />
              <ReviewRow label="Contact" value={[state.name, state.phone, state.email].filter(Boolean).join(" · ") || "—"} />
              {state.notes && <ReviewRow label="Notes" value={state.notes} />}
            </dl>

            {submitError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 mb-6 text-sm text-destructive">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{submitError} Please try again, or call us at {PHONE_DISPLAY}.</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={back} disabled={submitting} className={btnSecondary}>
                <ChevronLeft size={15} /> Back
              </button>
              <button type="button" onClick={handleSubmit} disabled={submitting} className={btnPrimary}>
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    Submit request <Check size={15} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/*
        Running estimate. Sits BELOW the card in normal flow rather than as a
        fixed overlay: Baymard notes the touch keyboard can take ~70% of a
        landscape phone screen, and a pinned bar competes with the very inputs
        the user is typing into. It is sticky only from `sm` up, where there is
        room for it.
      */}
      {state.step >= 2 && estimate.serviceCount > 0 && (
        <div className="mt-5 sm:sticky sm:bottom-5">
          <div className="rounded-2xl border border-primary/25 bg-card shadow-lg px-5 py-4">
            {/*
              Itemised, not just a total. An unexplained number is the thing
              that makes people abandon a quote — "why is it $315?" has to be
              answerable on the screen, not on the phone.
            */}
            {estimate.lines.length > 0 && (
              <ul className="mb-3 pb-3 border-b border-border grid gap-1">
                {estimate.lines.map((line, i) => (
                  <li key={`${line.label}-${i}`} className="flex justify-between gap-4 text-xs">
                    <span className="text-muted-foreground">{line.label}</span>
                    <span className="font-semibold text-foreground tabular-nums whitespace-nowrap">
                      {line.custom ? "on site" : formatDollars(line.amount ?? 0)}
                    </span>
                  </li>
                ))}
                {estimate.bundleTotal > 0 && (
                  <li className="flex justify-between gap-4 text-xs">
                    <span className="text-muted-foreground">
                      {state.bundles.length} bundled service{state.bundles.length === 1 ? "" : "s"}, from
                    </span>
                    <span className="font-semibold text-foreground tabular-nums whitespace-nowrap">
                      {formatDollars(estimate.bundleTotal)}
                    </span>
                  </li>
                )}
                {estimate.discount > 0 && (
                  <li className="flex justify-between gap-4 text-xs">
                    <span className="text-primary font-semibold">
                      Bundle discount, {Math.round(BUNDLE_DISCOUNT * 100)}%
                    </span>
                    <span className="font-bold text-primary tabular-nums whitespace-nowrap">
                      −{formatDollars(estimate.discount)}
                    </span>
                  </li>
                )}
              </ul>
            )}

            <div className="flex items-baseline justify-between gap-4 flex-wrap">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {chosenPackage?.unit === "month" ? "Estimated monthly" : "Estimated starting price"}
              </p>
              <p className="font-serif-display text-2xl text-foreground">
                {estimate.subtotal > 0
                  ? `${formatDollars(estimate.total)}${chosenPackage?.unit === "month" ? "/mo" : "+"}`
                  : "Custom quote"}
              </p>
            </div>

            <p className="text-[11px] leading-relaxed text-muted-foreground mt-2">
              {estimate.needsVisit
                ? "Some of what you've picked needs a look at the property before we can price it — we'll confirm the full figure on the phone."
                : "A starting figure, not a quote. We confirm the final price before any work begins."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StepFooter({
  onBack,
  onNext,
  nextLabel,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <button type="button" onClick={onBack} className={btnSecondary}>
        <ChevronLeft size={15} /> Back
      </button>
      {/*
        Deliberately NOT disabled. A disabled Continue button tells the user
        nothing about what's wrong — they just tap a dead button. Letting the tap
        through and surfacing per-field errors is what makes the blocker legible.
      */}
      <button type="button" onClick={onNext} className={btnPrimary}>
        {nextLabel} <ChevronRight size={15} />
      </button>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 px-5 py-3.5">
      <dt className="text-xs text-muted-foreground shrink-0 pt-0.5">{label}</dt>
      <dd className="text-sm font-semibold text-foreground text-right">{value}</dd>
    </div>
  );
}
