import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight, Minus, Phone, Plus } from "lucide-react";
import {
  defaultAnswers,
  getServiceDetail,
  priceDetail,
  withLivePrices,
  type Answers,
} from "../constants/serviceDetails";
import { estimateBookingPath } from "../constants/estimatorLink";
import { formatDollars, isActive, type ServiceId } from "../constants/services";
import { PHONE, PHONE_DISPLAY } from "../constants/contact";
import { useCrmPricing } from "../hooks/useCrmPricing";
import { preloadRoute } from "../routeModules";
import { trackCall, trackEvent } from "../utils/analytics";
import { withAlpha } from "../utils/color";

interface ServiceEstimatorProps {
  /** Booking-wizard category id, e.g. "power". Keys into serviceDetails.ts. */
  serviceKey: ServiceId;
  primaryColor: string;
  accentColor: string;
}

/**
 * The price estimator that sits directly under each service hero.
 *
 * WHY: every input it asks for was already defined in serviceDetails.ts and
 * already priced by priceDetail() — but the only place a visitor could reach
 * any of it was step 2 of a five-step wizard. So the page showed a "from"
 * number, the real number lived three clicks away, and the add-on prices
 * (inside the oven, pet hair, gutters) were not published anywhere at all,
 * even though the residential page's own copy says "add it below".
 *
 * This is not a second pricing implementation. It renders the same packages,
 * the same questions, the same add-ons, through the same priceDetail(), with
 * the same live CRM floors the wizard uses — then hands the whole selection to
 * the wizard through the URL so nothing is asked twice.
 *
 * Deliberately small. It is a widget under a hero, not a replacement for the
 * booking flow: it never collects an address, a date, or a name, and it never
 * shows a number for a tier that genuinely needs a site visit.
 */
export default function ServiceEstimator({ serviceKey, primaryColor, accentColor }: ServiceEstimatorProps) {
  /*
    Parked services get no estimator.

    It quotes a real number and hands that number to the wizard, which is
    exactly the promise a page for unavailable work must not make.
    ServiceWaitlist takes this slot instead — see `active` in
    constants/services.ts.
  */
  const bookable = isActive(serviceKey);
  const base = getServiceDetail(serviceKey);
  const { overrides } = useCrmPricing(serviceKey);
  const detail = useMemo(() => withLivePrices(base, overrides), [base, overrides]);

  const [packageId, setPackageId] = useState(
    () => base?.packages.find((pkg) => pkg.popular)?.id ?? base?.packages[0]?.id ?? ""
  );
  const [answers, setAnswers] = useState<Answers>(() => defaultAnswers(serviceKey));
  const [addOnIds, setAddOnIds] = useState<string[]>([]);

  const estimate = useMemo(
    () => priceDetail(detail, packageId, answers, addOnIds),
    [detail, packageId, answers, addOnIds]
  );

  if (!detail || detail.packages.length === 0 || !bookable) return null;

  const selected = detail.packages.find((pkg) => pkg.id === packageId);
  const isMonthly = selected?.unit === "month";

  /**
   * One analytics event per estimate handoff, not per keystroke. What matters
   * is whether the widget produces bookings, and at what number people stop.
   */
  function handleContinue() {
    trackEvent("estimate_continue", {
      service: serviceKey,
      package: packageId,
      subtotal: estimate.needsVisit ? "quote" : estimate.subtotal,
      addOns: addOnIds.length,
    });
  }

  function setAnswer(id: string, value: string | number) {
    setAnswers((current) => ({ ...current, [id]: value }));
  }

  function toggleAddOn(id: string) {
    setAddOnIds((current) =>
      current.includes(id) ? current.filter((existing) => existing !== id) : [...current, id]
    );
  }

  const bookingPath = estimateBookingPath({ categoryId: serviceKey, packageId, answers, addOnIds });

  return (
    <section className="py-14 px-4 sm:px-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-6">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: primaryColor }}
          >
            <span className="w-6 h-0.5" style={{ backgroundColor: primaryColor }} />
            <span>Instant estimate</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl mb-2 text-foreground">
            Price it before you book.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Answer what changes the price and the number updates as you go. No email, no phone
            number, nothing to sign up for.
          </p>
        </div>

        <div
          className="grid lg:grid-cols-[minmax(0,1fr)_20rem] gap-px"
          style={{ backgroundColor: "var(--border)", border: "1px solid var(--border)" }}
        >
          {/* ── Controls ─────────────────────────────────────────────── */}
          <div className="p-6 sm:p-8 space-y-7" style={{ backgroundColor: "var(--card)" }}>
            <fieldset>
              {/*
                Deliberately NOT detail.packageLabel. The package grid directly
                below this uses that label as its own heading, and two sections
                titled "Choose your clean" stacked on top of each other read as
                the same control rendered twice rather than as price-then-detail.
              */}
              <legend className="text-[11px] font-bold uppercase tracking-widest mb-3 text-muted-foreground">
                Package
              </legend>
              <div className="flex flex-wrap gap-2">
                {detail.packages.map((pkg) => {
                  const active = pkg.id === packageId;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => setPackageId(pkg.id)}
                      aria-pressed={active}
                      className="px-3.5 py-2 text-sm font-semibold rounded-full border transition-colors"
                      style={{
                        backgroundColor: active ? primaryColor : "transparent",
                        borderColor: active ? primaryColor : "var(--border)",
                        color: active ? "#ffffff" : "var(--foreground)",
                      }}
                    >
                      {pkg.name}
                    </button>
                  );
                })}
              </div>
              {selected?.tagline && (
                <p className="mt-2.5 text-xs text-muted-foreground">{selected.tagline}</p>
              )}
            </fieldset>

            {detail.questions.map((question) => (
              <fieldset key={question.id}>
                <legend className="text-[11px] font-bold uppercase tracking-widest mb-1 text-muted-foreground">
                  {question.label}
                </legend>
                {question.help && (
                  <p className="text-xs text-muted-foreground mb-3">{question.help}</p>
                )}

                {question.kind === "counter" ? (
                  <div className="flex items-center gap-3">
                    {/*
                      Buttons rather than a number input: on a phone a numeric
                      input opens a keyboard over the estimate the visitor is
                      watching change, which is the one thing this widget
                      exists to show them.
                    */}
                    <button
                      type="button"
                      onClick={() =>
                        setAnswer(question.id, Math.max(question.min, Number(answers[question.id] ?? question.default) - 1))
                      }
                      disabled={Number(answers[question.id] ?? question.default) <= question.min}
                      aria-label={`One fewer ${question.noun}`}
                      className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-35"
                      style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                      <Minus size={15} />
                    </button>
                    <span className="min-w-[2.5rem] text-center text-lg font-bold text-foreground" aria-live="polite">
                      {Number(answers[question.id] ?? question.default)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setAnswer(question.id, Math.min(question.max, Number(answers[question.id] ?? question.default) + 1))
                      }
                      disabled={Number(answers[question.id] ?? question.default) >= question.max}
                      aria-label={`One more ${question.noun}`}
                      className="w-9 h-9 rounded-full border flex items-center justify-center disabled:opacity-35"
                      style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
                    >
                      <Plus size={15} />
                    </button>
                    <span className="text-xs text-muted-foreground">
                      {question.includedUpTo} included, then {formatDollars(question.pricePerUnit)} each
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {question.options.map((option) => {
                      const active = answers[question.id] === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setAnswer(question.id, option.value)}
                          aria-pressed={active}
                          className="px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors"
                          style={{
                            backgroundColor: active ? withAlpha(primaryColor, 0.1) : "transparent",
                            borderColor: active ? primaryColor : "var(--border)",
                            color: active ? primaryColor : "var(--muted-foreground)",
                          }}
                        >
                          {option.label}
                          {option.delta ? ` +${formatDollars(option.delta)}` : ""}
                        </button>
                      );
                    })}
                  </div>
                )}
              </fieldset>
            ))}

            {/*
              THE ADD-ON MENU.

              These prices existed in serviceDetails.ts and were published
              nowhere — the residential page's own exclusion list says "add
              below" and then had nothing to add from. Every one is a real
              catalogue price, so the figure here is the figure the wizard and
              the crew's email both use.
            */}
            {detail.addOns.length > 0 && (
              <fieldset>
                <legend className="text-[11px] font-bold uppercase tracking-widest mb-3 text-muted-foreground">
                  Add anything else?
                </legend>
                <div className="grid sm:grid-cols-2 gap-2">
                  {detail.addOns.map((addOn) => {
                    const active = addOnIds.includes(addOn.id);
                    return (
                      <label
                        key={addOn.id}
                        className="flex items-start gap-2.5 p-3 border cursor-pointer transition-colors"
                        style={{
                          borderColor: active ? primaryColor : "var(--border)",
                          backgroundColor: active ? withAlpha(primaryColor, 0.05) : "transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleAddOn(addOn.id)}
                          className="mt-0.5 shrink-0 w-4 h-4 accent-current"
                          style={{ color: primaryColor }}
                        />
                        <span className="min-w-0">
                          <span className="flex items-baseline justify-between gap-2">
                            <span className="text-sm font-semibold text-foreground">{addOn.name}</span>
                            <span className="text-sm font-bold shrink-0" style={{ color: accentColor }}>
                              {addOn.price === 0 ? "Quote" : `+${formatDollars(addOn.price)}`}
                            </span>
                          </span>
                          {addOn.note && (
                            <span className="block text-xs text-muted-foreground mt-0.5">{addOn.note}</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}
          </div>

          {/* ── Running total ────────────────────────────────────────── */}
          <aside className="p-6 sm:p-8 flex flex-col" style={{ backgroundColor: "var(--card)" }}>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-4 text-muted-foreground">
              Your estimate
            </p>

            {estimate.needsVisit ? (
              <>
                <p className="font-serif-display text-3xl mb-2 text-foreground">Custom quote</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">
                  What you've picked needs eyes on it before anyone can put a number to it. We'll
                  look, then quote — no charge for either.
                </p>
              </>
            ) : (
              <>
                <p className="font-serif-display text-4xl mb-1 text-foreground" aria-live="polite">
                  {formatDollars(estimate.subtotal)}
                  {isMonthly && <span className="text-base font-sans-modern">/mo</span>}
                </p>
                <p className="text-xs text-muted-foreground mb-5">
                  Starting price for what you've selected.
                </p>

                <ul className="space-y-1.5 mb-5 pb-5" style={{ borderBottom: "1px solid var(--border)" }}>
                  {estimate.lines.map((line, index) => (
                    <li
                      key={`${line.label}-${index}`}
                      className="flex items-baseline justify-between gap-3 text-xs"
                    >
                      <span className="text-muted-foreground">{line.label}</span>
                      <span className="font-semibold shrink-0 text-foreground">
                        {line.custom ? "Quote" : formatDollars(line.amount ?? 0)}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <Link
              to={bookingPath}
              onClick={handleContinue}
              onMouseEnter={() => preloadRoute("/book")}
              onFocus={() => preloadRoute("/book")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor, color: "#ffffff" }}
            >
              {estimate.needsVisit ? "Request a quote" : `Continue with ${formatDollars(estimate.subtotal)}`}
              <ArrowUpRight size={15} />
            </Link>

            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              Picks up where you left off — you won't be asked any of this twice. Nothing is
              charged at booking, and we confirm the price by phone before any work starts.
            </p>

            <a
              href={`tel:+1${PHONE}`}
              onClick={() => trackCall(`estimator_${serviceKey}`)}
              className="mt-auto pt-5 inline-flex items-center gap-2 text-xs font-semibold"
              style={{ color: primaryColor }}
            >
              <Phone size={13} />
              Rather just ask? {PHONE_DISPLAY}
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
