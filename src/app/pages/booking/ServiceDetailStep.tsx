import { Check, Minus, Plus, X } from "lucide-react";
import type { Answers, ServiceDetail } from "../../constants/serviceDetails";
import { formatDollars, SERVICE_NAME_BY_ID, BUNDLE_DISCOUNT, frequencyDiscountLabel } from "../../constants/services";
import { FREQUENCY_OPTIONS } from "./wizardData";

interface ServiceDetailStepProps {
  detail: ServiceDetail;
  packageId: string;
  answers: Answers;
  addOnIds: string[];
  onPackage: (id: string) => void;
  onAnswer: (questionId: string, value: string | number) => void;
  onToggleAddOn: (id: string) => void;
  packageError?: string;
  /** Cross-department services this category can bundle into the same visit. */
  upsells: string[];
  bundles: string[];
  onToggleBundle: (id: string) => void;
  bundlePriceLabel: (id: string) => string;
  frequency: string;
  onFrequency: (freq: string) => void;
  notes: string;
  onNotes: (value: string) => void;
}

const textareaClass =
  "w-full rounded-xl border border-border bg-card px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-shadow";

/** Shared "bento tile" wrapper — a distinct bordered card per section, rather
 *  than sections separated only by vertical spacing. That boundary is most
 *  of what reads as "bento" versus "one long stacked column". */
function Tile({
  span,
  title,
  subtitle,
  children,
}: {
  span?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-background p-5 ${span ?? ""}`}>
      <h3 className="text-sm font-bold text-foreground">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5 mb-4">{subtitle}</p>}
      <div className={subtitle ? "" : "mt-3"}>{children}</div>
    </div>
  );
}

/**
 * Step 2, rebuilt per service.
 *
 * The old version was one flat checkbox list of "name — price", identical for
 * all eight services. Choosing "Deep Clean — from $220" told the customer
 * nothing about what was included, so the most common question on the phone was
 * "what does that actually cover".
 *
 * Packages are mutually exclusive cards (full detail only for the selected
 * one — see the note below). Everything past the package choice — qualifying
 * questions, in-service add-ons, cross-department bundles, frequency, notes —
 * is laid out as an asymmetric bento grid of bordered tiles rather than one
 * long stacked column, so the step reads as a set of small decisions instead
 * of a wall of form.
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
  upsells,
  bundles,
  onToggleBundle,
  bundlePriceLabel,
  frequency,
  onFrequency,
  notes,
  onNotes,
}: ServiceDetailStepProps) {
  const hasQuestions = detail.questions.length > 0;
  const hasAddOns = detail.addOns.length > 0;

  return (
    <div className="flex flex-col gap-5">
      {/* ---------- packages ---------- */}
      <fieldset>
        <legend className="flex items-baseline gap-1.5 mb-3">
          <span className="text-xs font-semibold text-foreground">{detail.packageLabel}</span>
          <span className="text-[10px] font-medium text-primary">Required</span>
        </legend>

        {/*
          Unselected packages are a single compact row — name, price, radio,
          nothing else. Only the selected one expands into the full card with
          tagline, duration and checklist. Three fully-expanded cards stacked
          was step 2's whole length problem; a picked tier and two one-line
          alternatives is the actual "pick one" decision this step is asking
          for.
        */}
        <div className="grid gap-2">
          {detail.packages.map((pkg) => {
            const active = packageId === pkg.id;

            if (!active) {
              return (
                <label
                  key={pkg.id}
                  className="flex items-center gap-3 rounded-xl border-2 border-border bg-background px-4 py-3 cursor-pointer transition-colors hover:border-primary/30 active:scale-[0.99]"
                >
                  <input
                    type="radio"
                    name="package"
                    checked={active}
                    onChange={() => onPackage(pkg.id)}
                    className="sr-only"
                  />
                  <span className="w-5 h-5 rounded-full flex-none border-2 border-muted-foreground/35" />
                  <span className="flex-1 min-w-0 text-sm font-semibold text-foreground truncate">
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
                </label>
              );
            }

            return (
              <label
                key={pkg.id}
                className="relative block rounded-2xl border-2 border-primary bg-primary/[0.06] p-5 cursor-pointer shadow-[0_0_0_3px_var(--tw-shadow-color)] shadow-primary/15"
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
                  <span className="mt-0.5 w-5 h-5 rounded-full flex-none flex items-center justify-center border-2 border-primary bg-primary text-primary-foreground">
                    <Check size={12} strokeWidth={3.5} className="animate-in zoom-in-50 spin-in-12 duration-200" />
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
                          <li key={item} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
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

      {/* ---------- bento grid: questions + add-ons ---------- */}
      {(hasQuestions || hasAddOns) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {hasQuestions && (
            <Tile
              span={hasAddOns ? "lg:col-span-7" : ""}
              title="A few details"
              subtitle="These are the things that actually change the price. Answer them now and the figure below is the figure we quote."
            >
              <div className="flex flex-col gap-6">
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
                        <div className="inline-flex items-center gap-1 rounded-xl border-2 border-border bg-card p-1">
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
                                active ? "border-primary bg-primary/[0.06]" : "border-border bg-card hover:border-primary/30"
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
            </Tile>
          )}

          {hasAddOns && (
            <Tile
              span={hasQuestions ? "lg:col-span-5" : ""}
              title="Add anything else?"
              subtitle="Extras within this service. Skip them all if you don't need them."
            >
              <div className="grid gap-2">
                {detail.addOns.map((addOn) => {
                  const active = addOnIds.includes(addOn.id);
                  return (
                    <label
                      key={addOn.id}
                      className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        active ? "border-primary bg-primary/[0.06]" : "border-border bg-card hover:border-primary/30"
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
            </Tile>
          )}
        </div>
      )}

      {/* ---------- cross-department bundles ---------- */}
      {upsells.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/[0.04] p-5">
          <p className="text-sm font-semibold text-foreground mb-0.5">This would also go great with...</p>
          <p className="text-xs text-muted-foreground mb-3.5">
            One visit, one crew, {Math.round(BUNDLE_DISCOUNT * 100)}% off the combined total. We'll pin down
            the details for these on the call.
          </p>
          <div className="grid gap-2">
            {upsells.map((id) => {
              const checked = bundles.includes(id);
              return (
                <label
                  key={id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                    checked ? "border-primary bg-card" : "border-border/60 bg-card hover:border-primary/30"
                  }`}
                >
                  <input type="checkbox" checked={checked} onChange={() => onToggleBundle(id)} className="sr-only" />
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

      {/* ---------- bento grid: frequency + notes ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        <Tile span="lg:col-span-5" title="How often?">
          {/* Segmented control rather than a drop-down: Baymard found 55% of
              users open a drop-down purely to see what's inside, and with
              four options a drop-down saves nothing. */}
          <div className="grid grid-cols-2 gap-2">
            {FREQUENCY_OPTIONS.map((freq) => {
              // The saving goes ON the control. A discount the customer only
              // discovers on the review screen does not change the choice they
              // made three steps earlier.
              const saving = frequencyDiscountLabel(freq);
              return (
                <button
                  key={freq}
                  type="button"
                  onClick={() => onFrequency(freq)}
                  aria-pressed={frequency === freq}
                  className={`py-3 px-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                    frequency === freq
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="block">{freq}</span>
                  {saving && (
                    <span
                      className={`block text-[11px] font-bold mt-0.5 ${
                        frequency === freq ? "text-primary-foreground/85" : "text-primary"
                      }`}
                    >
                      {saving}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </Tile>

        <Tile span="lg:col-span-7" title="Anything else we should know?" subtitle="Gate codes, pets, parking, access instructions.">
          <textarea
            id="notes"
            rows={3}
            value={notes}
            onChange={(e) => onNotes(e.target.value)}
            placeholder="Side gate code is 4821, dog in the back yard…"
            className={textareaClass}
          />
        </Tile>
      </div>
    </div>
  );
}
