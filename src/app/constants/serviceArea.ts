/**
 * Kansas City metro service area, and the ZIP lookup behind the coverage checker.
 *
 * DESIGN NOTE — this deliberately has three outcomes, not two.
 *
 * A hard yes/no ZIP gate is the wrong shape for a young local business: the ZIP
 * list will always be incomplete, and a false "we don't serve you" turns a real
 * customer away with no recovery path. So an unrecognised ZIP that still looks
 * like the metro resolves to "likely" — the visitor keeps moving through the
 * funnel and we confirm on the phone. Only a ZIP outside the metro's prefix
 * range is treated as out of area, and even then it captures an email rather
 * than dead-ending.
 *
 * Erring toward "yes" costs a phone call. Erring toward "no" costs the job.
 */

import { SERVICE_CITIES } from "./cities";

export interface ServiceAreaCity {
  label: string;
  /** ZIPs confirmed to be served. Not exhaustive — see the prefix fallback. */
  zips: string[];
  /** URL segment for this city's landing page. */
  slug: string;
}

/**
 * Derived from constants/cities.ts rather than declared here.
 *
 * The ZIP list used to live in this file and the city landing pages did not
 * exist. Now that both exist, two hand-maintained lists would eventually
 * disagree, and the failure mode is a visitor being told by the checker that
 * we serve their ZIP, landing on a city page that never mentions it. One list.
 */
export const SERVICE_AREA_CITIES: ServiceAreaCity[] = SERVICE_CITIES.map((city) => ({
  label: city.label,
  zips: city.zips,
  slug: city.slug,
}));

/** Flat ZIP → city lookup, built from the list above. */
const ZIP_TO_CITY: Record<string, ServiceAreaCity> = {};
for (const city of SERVICE_AREA_CITIES) {
  for (const zip of city.zips) {
    // First city wins on shared ZIPs (66207 and 66227 straddle two cities each).
    if (!ZIP_TO_CITY[zip]) ZIP_TO_CITY[zip] = city;
  }
}

/**
 * Three-digit prefixes covering the greater metro. Broader than the confirmed
 * list on purpose — a ZIP matching one of these is treated as probably servable
 * and confirmed by phone rather than rejected.
 */
const METRO_PREFIXES = ["640", "641", "661", "662"];

export type CoverageStatus = "covered" | "likely" | "outside" | "invalid";

export interface CoverageResult {
  status: CoverageStatus;
  /** Populated only for "covered" — the matching city's display name. */
  city?: string;
  /** Populated only for "covered". Lets the checker deep-link to that city's page. */
  slug?: string;
  /** Customer-facing explanation. Never blames the visitor for the gap. */
  message: string;
}

export function normalizeZip(input: string): string {
  return input.replace(/\D/g, "").slice(0, 5);
}

export function checkCoverage(input: string): CoverageResult {
  const zip = normalizeZip(input);

  if (zip.length !== 5) {
    return { status: "invalid", message: "Enter a 5-digit ZIP code." };
  }

  const city = ZIP_TO_CITY[zip];
  if (city) {
    return { status: "covered", city: city.label, slug: city.slug, message: `Yes, we serve ${city.label}.` };
  }

  if (METRO_PREFIXES.some((prefix) => zip.startsWith(prefix))) {
    return {
      status: "likely",
      message: "Looks like we cover you. We'll confirm the exact address when we call.",
    };
  }

  return {
    status: "outside",
    message: "That's outside our usual Kansas City routes, but tell us where you are and we'll let you know when we expand.",
  };
}

/** True for the two statuses that should let a visitor continue booking. */
export function isServable(status: CoverageStatus): boolean {
  return status === "covered" || status === "likely";
}
