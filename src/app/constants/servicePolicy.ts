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
  junk: {
    prepare: [
      "Point at it and we do the rest. Nothing needs to be moved to the curb first — carrying distance is priced in the estimate, not sprung on you on the day.",
      "If a piece has to come apart to get through a door or down a stairwell, tell us when you book so the right crew size turns up.",
      "Park a car off the driveway if you can. The truck needs the space more than the street does.",
    ],
    cannotTake: {
      heading: "What we cannot haul",
      intro:
        "These are refused on every job, without exception. It is not fussiness — hazardous waste has its own disposal chain, and a transfer station will reject an entire truckload over one item of it.",
      items: [
        "Chemicals, solvents and oils",
        "Asbestos, or anything suspected of containing it",
        "Storage and oil drums",
        "Oil and waste storage tanks",
      ],
      footer:
        "If you are not sure what something is, send a photo before the booking rather than on the day. We would rather answer a question than turn up and leave it on your driveway.",
    },
  },

  bin: {
    prepare: [
      "Leave the bins at the curb, empty, on or right after your collection day. That is the whole job on your side.",
      "You do not need to be home, and nothing needs unlocking.",
    ],
    chemicals:
      "A biodegradable detergent for the wash and a biodegradable deodorizing treatment afterwards. No solvents. The water is not heated, and we do not publish a bacterial kill rate because ours has never been tested — what the wash removes is the built-up film and the smell that comes with it.",
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

  power: {
    siteNeeds: [
      "Access to an outdoor water spigot, and a clear path to the surface being washed.",
    ],
    prepare: [
      "Close the windows on the elevation we are washing, and move planters, cushions and door mats clear.",
      "Point out any cracked or lifting siding before we start. Water gets behind it and we would rather adjust the method than find out afterwards.",
    ],
    chemicals:
      "Biodegradable detergents, and low pressure on anything that can be damaged by force. Our rig runs unheated, which is why we turn down set-in oil and rust rather than leaving a shadow on your concrete.",
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

  landscaping: {
    prepare: [
      "Unlock the side gate, or leave us the code. A locked gate is the most common reason a crew leaves without doing the job.",
      "Clear toys, hoses and furniture off the lawn. Anything left out gets mown around rather than moved.",
      "Secure pets, and tell us about anything buried shallow — irrigation heads, dog fencing, cable runs.",
    ],
  },
};

export function getServicePolicy(serviceKey: ServiceId): ServicePolicy | undefined {
  return SERVICE_POLICY[serviceKey];
}
