import type { ServiceId } from "./services";

/**
 * The operational facts a customer needs BEFORE the crew turns up.
 *
 * Everything here is a statement about how Lunova actually works, so the bar
 * for adding an entry is that someone has confirmed it — not that it sounds
 * good or that a competitor says it. Three rules, learned the expensive way
 * when this site shipped a "200°F hot water, kills 99.9% of bacteria" claim
 * for a rig that runs unheated and has never been tested:
 *
 *   1. No temperature, percentage, or efficacy claim without evidence behind it.
 *   2. No "eco-friendly", "non-toxic", "pet-safe" or "disinfectant" unless it is
 *      literally true — "disinfectant" in particular is a regulated term for an
 *      EPA-registered product, which a biodegradable detergent is not.
 *   3. Aspirations are not facts. Wastewater reclamation is on the roadmap and
 *      therefore is not written down here.
 *
 * Every field is optional. A service with nothing confirmed renders nothing,
 * which is the correct outcome — an empty section is better than a plausible
 * guess.
 */

export interface ServicePolicy {
  /** What the customer should do before the crew arrives. */
  prepare?: string[];
  /** What we physically need on site. Access, water, power. */
  siteNeeds?: string[];
  /** Hard refusals. Say the reason — "we just don't" reads as laziness. */
  cannotTake?: { heading: string; intro: string; items: string[]; footer?: string };
  /** What we put on your property, in plain terms. */
  chemicals?: string;
}

export const SERVICE_POLICY: Partial<Record<ServiceId, ServicePolicy>> = {
  bin: {
    prepare: [
      "Have the bins empty. Anytime after your collection day is the easy window — a bin with a full bag in it cannot be washed.",
      "Leave them somewhere we can get to them. You do not need to be home for this part.",
      "Tell us the number of bins when you book. Two are in the price and the rest are cheap, but they are not free and they are not instant.",
    ],
    chemicals:
      "A biodegradable detergent for the wash and a biodegradable deodorising treatment afterwards. No solvents. Scrubbed by hand rather than pressure washed — we do not own a pressure washer — and we do not publish a bacterial kill rate because ours has never been tested. What the wash removes is the built-up film and the smell that comes with it.",
  },

  auto: {
    siteNeeds: [
      "Access to an outdoor water spigot. We bring everything else, but for now the water is yours — a self-contained tank is being built and this note comes down the day it is on the truck.",
      "A parking space with room to open every door fully, and ideally out of direct sun.",
    ],
    prepare: [
      "Clear personal items out of the cabin and the trunk. We will work around a car seat, but we will not empty a glovebox.",
      "Tell us up front about pet hair or a spill that has soaked in. Both are priced as add-ons and both take longer than they look.",
    ],
  },

  cleaning: {
    prepare: [
      "Pick up clutter and personal items so the crew is cleaning surfaces rather than tidying around them. It is the single biggest thing that changes how much gets done in the time.",
      "Secure pets somewhere they will be comfortable, and leave gate or door codes in the booking notes.",
      "Strip beds if you want linens changed, or leave fresh sets out where we will find them.",
    ],
    chemicals:
      "We bring all products and equipment, and the detergents are biodegradable. If you would rather we used something of yours, leave it out and say so in the notes.",
  },

};

export function getServicePolicy(serviceKey: ServiceId): ServicePolicy | undefined {
  return SERVICE_POLICY[serviceKey];
}
