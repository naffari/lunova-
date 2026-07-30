/**
 * Booking wizard view-data.
 *
 * Everything price- or service-shaped now comes from
 * src/app/constants/services.ts — this module only holds things that are
 * genuinely specific to the wizard (step labels, the cities dropdown, the
 * attribution question).
 *
 * It previously carried its own copy of all eight services and their prices,
 * which had already drifted from the homepage and the service pages.
 */
import { SERVICES, SERVICE_BY_ID, SERVICE_NAME_BY_ID, startingAtLabel } from "../../constants/services";
import { SERVICE_AREA_CITIES } from "../../constants/serviceArea";

export { SERVICES, SERVICE_BY_ID, SERVICE_NAME_BY_ID };

/** Service picker tiles for step 1, in catalogue order. */
export const CATEGORIES = SERVICES.map((s) => ({
  id: s.id,
  name: s.name,
  price: startingAtLabel(s),
  icon: s.icon,
  popular: s.popular ?? false,
}));

export const CATEGORY_LABELS = SERVICE_NAME_BY_ID;

/** Cities offered in the address step — the same list the service-area section renders. */
export const CITIES = SERVICE_AREA_CITIES.map((c) => c.label);

export const HEAR_ABOUT_OPTIONS = [
  "Google search",
  "Friend or family referral",
  "Social media",
  "Saw a truck / crew",
  "Repeat customer",
  "Other",
];

export const STEP_LABELS = ["Service", "Details", "Schedule", "Contact", "Review"];

export const FREQUENCY_OPTIONS = ["One-Time", "Weekly", "Bi-Weekly", "Monthly"];

export const TIME_WINDOWS = ["Morning", "Afternoon", "Evening"];
