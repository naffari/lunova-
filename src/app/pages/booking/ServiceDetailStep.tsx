import { Check, Minus, Plus, X } from "lucide-react";
import type { Answers, ServiceDetail } from "../../constants/serviceDetails";
import { formatDollars } from "../../constants/services";

interface ServiceDetailStepProps {
  detail: ServiceDetail;
  packageId: string;
  answers: Answers;
  addOnIds: string[];
  onPackage: (id: string) => void;
  onAnswer: (questionId: string, value: string | number) => void;
  onToggleAddOn: (id: string) => void;
  packageError?: string;
}

/**
 * Step 2, rebuilt per service.
 *
 * The old version was one flat checkbox list of "name — price", identical for
 * all eight services. Choosing "Deep Clean — from $220" told the customer
 * nothing about what was included, so the most common question on the phone was
 * "what does that actually cover".
 *
 * Three changes fix that:
 *   1. Packages are mutually exclusive cards with the full inclusion list on
 *      screen, plus an explicit "not included" list. Scope is settled before
 *      anyone books, not argued about on the day.
 *   2. Qualifying questions ask only the facts that move the price, and show
 *      the delta next to each option so nothing is hidden.
 *   3. Add-ons are real extras within the service, separate from the
 *      cross-department bundles on the next screen.
 */
export default function ServiceDetailStep({
  detail,
  packageId,
  answers,
  addOnIds,
  onPackage,
  onAnswer,
  onToggleAddOn,
  packageError,
}: ServiceDetailStepProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* ---------- packages ---------- */}
      <fieldset>
        <legend className="flex items-baseline gap-1.5 mb-3">
          <span className="text-xs font-semibold text-foreground">{detail.packageLabel}</span>
          <span className="text-[10px] font-medium text-primary">Required</span>
        </legend>

        <div className="grid gap-3">
          {detail.packages.map((pkg) => {
            const active = packageId === pkg.id;
            return (
              <label
                key={pkg.id}
                className={`relative block rounded-2xl border-2 p-5 cursor-pointer transition-all duration-150 ${
                  active
                    ? "border-primary bg-primary/[0.06] scale-[1.008] shadow-[0_0_0_3px_var(--tw-shadow-color)] shadow-primary/15"
                    : "border-border bg-background hover:border-primary/30 active:scale-[0.99]"
                }`}
              >
                <input
                  type="radio"
                  name="package"
                  checked={active}
                  onChange={() => onPackage(pkg.id)}
                  className="sr-only"
                />

                <div className="flex items-start gap-3">
                  {/*
                    The checkmark pops in on selection (tw-animate-css's
                    zoom-in, already a dependency) rather than just fading —
                    a small, immediate reward for the tap, which is the whole
                    ask behind "think of it as a game almost".
                  */}
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-full flex-none flex items-center justify-center border-2 transition-colors ${
                      active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/35"
                    }`}
                  >
                    {active && <Check size={12} strokeWidth={3.5} className="animate-in zoom-in-50 spin-in-12 duration-200" />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <span className="text-[15px] font-bold text-foreground">
                        {pkg.name}
                        {pkg.popular && (
                          <span className="ml-2 align-middle text-[9px] font-bold uppercase tracking-wide text-primary">
                            Most booked
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-bold text-primary whitespace-nowrap">
                        {pkg.custom || pkg.from === undefined
                          ? "Custom quote"
                          : `From ${formatDollars(pkg.from)}${pkg.unit === "month" ? "/mo" : pkg.unit === "visit" ? "/visit" : ""}`}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mt-0.5">{pkg.tagline}</p>
                    {pkg.duration && (
                      <p className="text-[11px] text-muted-foreground/80 mt-1">Typically {pkg.duration} on site</p>
                    )}

                    {/*
                      The checklist is always visible, not hidden behind an
                      accordion. Someone comparing two tiers needs to see both
                      lists at once, and a collapsed list is a list nobody reads.
                    */}
                    <ul className="mt-3 grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                      {pkg.includes.map((item) => (
                        <li key={item} className="flex items-start gap-1.5 text-xs text-foreground/85">
                          <Check size={13} className="mt-0.5 shrink-0 text-primary" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {pkg.excludes && pkg.excludes.length > 0 && (
                      <ul className="mt-2.5 pt-2.5 border-t border-border grid sm:grid-cols-2 gap-x-4 gap-y-1.5">
                        {pkg.excludes.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-1.5 text-[11px] text-muted-foreground"
                          >
                            <X size={12} className="mt-0.5 shrink-0 opacity-60" />
                            <span>Not included: {item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>

        {packageError && (
          <p role="alert" className="mt-2 text-[11px] font-semibold text-destructive">
            {packageError}
          </p>
        )}
      </fieldset>

      {/* ---------- qualifying questions ---------- */}
      {detail.questions.length > 0 && (
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-bold text-foreground">A few details</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              These are the things that actually change the price. Answer them now and the figure
              below is the figure we quote.
            </p>
          </div>

          {detail.questions.map((question) => {
            if (question.kind === "counter") {
              const value = Number(answers[question.id] ?? question.default);
              const over = Math.max(0, value - question.includedUpTo);
              return (
                <div key={question.id}>
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <span className="text-xs font-semibold text-foreground">{question.label}</span>
                    {over > 0 && (
                      <span className="text-[11px] font-bold text-primary">
                        +{formatDollars(over * question.pricePerUnit)}
                      </span>
                    )}
                  </div>
                  {question.help && (
                    <p className="text-[11px] text-muted-foreground mb-2">{question.help}</p>
                  )}
                  <div className="inline-flex items-center gap-1 rounded-xl border-2 border-border bg-background p-1">
                    <button
                      type="button"
                      onClick={() => onAnswer(question.id, Math.max(question.min, value - 1))}
                      disabled={value <= question.min}
                      aria-label={`One fewer ${question.noun}`}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span
                      aria-live="polite"
                      className="w-12 text-center text-base font-bold text-foreground tabular-nums"
                    >
                      {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => onAnswer(question.id, Math.min(question.max, value + 1))}
                      disabled={value >= question.max}
                      aria-label={`One more ${question.noun}`}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              );
            }

            const selected = answers[question.id];
            return (
              <fieldset key={question.id}>
                <legend className="text-xs font-semibold text-foreground mb-1.5">{question.label}</legend>
                {question.help && (
                  <p className="text-[11px] text-muted-foreground mb-2">{question.help}</p>
                )}
                <div className="grid sm:grid-cols-2 gap-2">
                  {question.options.map((option) => {
                    const active = selected === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => onAnswer(question.id, option.value)}
                        aria-pressed={active}
                        className={`flex items-center justify-between gap-2 px-4 py-3 rounded-xl border-2 text-left transition-colors ${
                          active ? "border-primary bg-primary/[0.06]" : "border-border bg-background hover:border-primary/30"
                        }`}
                      >
                        <span className="text-sm text-foreground">{option.label}</span>
                        {/* The delta is always shown, including the zero case —
                            "+$0" is reassuring, a blank space is ambiguous. */}
                        <span className="text-xs font-bold text-primary whitespace-nowrap">
                          {option.custom ? "Quote" : option.delta ? `+${formatDollars(option.delta)}` : "+$0"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
        </div>
      )}

      {/* ---------- in-service add-ons ---------- */}
      {detail.addOns.length > 0 && (
        <fieldset>
          <legend className="text-sm font-bold text-foreground mb-1">Add anything else?</legend>
          <p className="text-xs text-muted-foreground mb-3">
            Extras within this service. Skip them all if you don't need them.
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {detail.addOns.map((addOn) => {
              const active = addOnIds.includes(addOn.id);
              return (
                <label
                  key={addOn.id}
                  className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                    active ? "border-primary bg-primary/[0.06]" : "border-border bg-background hover:border-primary/30"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => onToggleAddOn(addOn.id)}
                    className="sr-only"
                  />
                  <span
                    className={`mt-0.5 w-5 h-5 rounded-md flex-none flex items-center justify-center border-2 transition-colors ${
                      active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/35"
                    }`}
                  >
                    {active && <Check size={12} strokeWidth={3.5} />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-foreground">{addOn.name}</span>
                      <span className="text-xs font-bold text-primary whitespace-nowrap">
                        {addOn.price === 0 ? "Quote" : `+${formatDollars(addOn.price)}`}
                      </span>
                    </span>
                    {addOn.note && (
                      <span className="block text-[11px] text-muted-foreground mt-0.5">{addOn.note}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
    </div>
  );
}
