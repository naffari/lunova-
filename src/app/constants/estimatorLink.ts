import { SERVICE_DETAILS, type Answers } from "./serviceDetails";

/**
 * The URL contract between a service page's estimator and the booking wizard.
 *
 * WHY IT EXISTS: the estimator asks the same qualifying questions step 2 of the
 * wizard asks. Without carrying the answers across, someone who has just told
 * the page they have four bedrooms and two bathrooms is asked again by the
 * wizard, which is the fastest way to lose them — the page has made a promise
 * ("continue with $240") that the next screen immediately breaks.
 *
 * Both sides go through this module so the parameter names cannot drift. It is
 * deliberately the only place that knows the wire format.
 *
 * Shape:  /book?service=cleaning&package=deep&bedrooms=4&bathrooms=2&addons=oven,fridge&step=3
 *
 * Question ids become parameters directly rather than being packed into one
 * opaque blob, so the URL stays readable, shareable and hand-editable — a
 * visitor can send "the quote I got" to their partner and it still resolves.
 */

/** Comma-separated add-on ids. */
const ADDONS_PARAM = "addons";

/**
 * Reserved parameter names the wizard already owns. A question id colliding
 * with one of these would be silently eaten, so the encoder skips it and the
 * decoder never looks for it.
 */
const RESERVED = new Set(["service", "package", "zip", "city", "step", ADDONS_PARAM]);

export interface EstimatorSelection {
  categoryId: string;
  packageId: string;
  answers: Answers;
  addOnIds: string[];
}

/**
 * Booking URL carrying a finished estimate.
 *
 * `step` lands the visitor past the two steps they have already answered, on
 * the first one that still needs them. The wizard clamps it and keeps its own
 * `furthest` marker, so going back is still possible — this only skips work
 * that is genuinely already done.
 */
export function estimateBookingPath(
  { categoryId, packageId, answers, addOnIds }: EstimatorSelection,
  step = 3
): string {
  const params = new URLSearchParams();
  params.set("service", categoryId);
  if (packageId) params.set("package", packageId);

  const detail = SERVICE_DETAILS[categoryId];
  for (const question of detail?.questions ?? []) {
    if (RESERVED.has(question.id)) continue;
    const value = answers[question.id];
    if (value === undefined || value === "") continue;
    params.set(question.id, String(value));
  }

  if (addOnIds.length > 0) params.set(ADDONS_PARAM, addOnIds.join(","));
  params.set("step", String(step));

  return `/book?${params.toString()}`;
}

/**
 * The inverse, validated against the catalogue rather than trusted.
 *
 * Every value in a URL is attacker- and typo-supplied. A counter that arrives
 * as "abc" or "999999" must not reach the pricing function, and an unknown
 * choice value must not select nothing while looking selected. Anything that
 * does not validate is dropped, and the wizard falls back to that question's
 * default — a bad link degrades to the normal flow instead of a broken quote.
 */
export function readEstimateParams(
  categoryId: string,
  params: URLSearchParams
): { answers: Answers; addOnIds: string[] } {
  const detail = SERVICE_DETAILS[categoryId];
  const answers: Answers = {};
  const addOnIds: string[] = [];

  if (!detail) return { answers, addOnIds };

  for (const question of detail.questions) {
    if (RESERVED.has(question.id)) continue;
    const raw = params.get(question.id);
    if (raw === null) continue;

    if (question.kind === "counter") {
      const value = Number(raw);
      if (!Number.isInteger(value)) continue;
      if (value < question.min || value > question.max) continue;
      answers[question.id] = value;
      continue;
    }

    if (question.options.some((option) => option.value === raw)) {
      answers[question.id] = raw;
    }
  }

  const known = new Set(detail.addOns.map((addOn) => addOn.id));
  for (const id of (params.get(ADDONS_PARAM) ?? "").split(",")) {
    const trimmed = id.trim();
    if (trimmed && known.has(trimmed) && !addOnIds.includes(trimmed)) addOnIds.push(trimmed);
  }

  return { answers, addOnIds };
}
