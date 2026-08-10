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
import {
  ACTIVE_SERVICES,
  SERVICES,
  SERVICE_BY_ID,
  SERVICE_NAME_BY_ID,
  startingAtLabel,
} from "../../constants/services";
import { SERVICE_AREA_CITIES } from "../../constants/serviceArea";

export { SERVICES, SERVICE_BY_ID, SERVICE_NAME_BY_ID };

/**
 * Service picker tiles for step 1.
 *
 * Active services only. A parked line in this list is a booking the crew
 * cannot turn up for, taken from someone who then stops looking — the most
 * expensive way to lose a customer, because it costs the referral as well as
 * the job.
 *
 * `SERVICE_BY_ID` is still exported whole, because a deep link carrying a
 * parked id has to be recognised in order to be rejected. See the guard in
 * BookingWizard.
 */
export const CATEGORIES = ACTIVE_SERVICES.map((s) => ({
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

/**
 * Arrival windows.
 *
 * "Evening" used to be the third option, which we could not honour: the crew
 * is off at 7pm on a weekday and 5pm on a Saturday (see OPENING_HOURS in
 * constants/business.ts). Someone picking an evening slot for a Saturday was
 * booking a time we are shut, and finding that out on the confirmation call.
 * "Late day" is the window we can actually work, and the hint below the
 * buttons in the wizard spells out the hours rather than leaving it to guess.
 */
export const TIME_WINDOWS = ["Morning", "Afternoon", "Late day"];

/** Concrete hours behind the labels above, shown under the picker. */
export const TIME_WINDOW_HINT = "Roughly 8am–12pm, 12–4pm, or 4–7pm. Saturdays finish at 5pm.";
