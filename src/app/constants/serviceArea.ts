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

export interface ServiceAreaCity {
  label: string;
  /** ZIPs confirmed to be served. Not exhaustive — see the prefix fallback. */
  zips: string[];
}

export const SERVICE_AREA_CITIES: ServiceAreaCity[] = [
  {
    label: "Kansas City, MO",
    zips: [
      "64105", "64106", "64108", "64109", "64110", "64111", "64112", "64113",
      "64114", "64116", "64117", "64118", "64119", "64123", "64124", "64125",
      "64127", "64128", "64129", "64130", "64131", "64132", "64134", "64136",
      "64137", "64145", "64146", "64147", "64151", "64152", "64153", "64154",
      "64155", "64156", "64157", "64158",
    ],
  },
  { label: "Kansas City, KS", zips: ["66101", "66102", "66103", "66104", "66105", "66106", "66109", "66111", "66112"] },
  { label: "Overland Park", zips: ["66204", "66207", "66210", "66212", "66213", "66214", "66221", "66223", "66224"] },
  { label: "Olathe", zips: ["66061", "66062", "66063"] },
  { label: "Shawnee", zips: ["66203", "66216", "66217", "66218", "66226", "66227"] },
  { label: "Lenexa", zips: ["66215", "66219", "66220", "66227"] },
  { label: "Leawood", zips: ["66206", "66209", "66211"] },
  { label: "Prairie Village", zips: ["66207", "66208"] },
  { label: "Lee's Summit", zips: ["64063", "64064", "64081", "64082", "64086"] },
  { label: "Independence", zips: ["64050", "64052", "64053", "64054", "64055", "64056", "64057", "64058"] },
  { label: "Blue Springs", zips: ["64013", "64014", "64015"] },
  { label: "Raytown", zips: ["64133", "64138"] },
];

/** Flat ZIP → city lookup, built from the list above. */
const ZIP_TO_CITY: Record<string, string> = {};
for (const city of SERVICE_AREA_CITIES) {
  for (const zip of city.zips) {
    // First city wins on shared ZIPs (66207 and 66227 straddle two cities each).
    if (!ZIP_TO_CITY[zip]) ZIP_TO_CITY[zip] = city.label;
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
    return { status: "covered", city, message: `Yes — we serve ${city}.` };
  }

  if (METRO_PREFIXES.some((prefix) => zip.startsWith(prefix))) {
    return {
      status: "likely",
      message: "Looks like we cover you. We'll confirm the exact address when we call.",
    };
  }

  return {
    status: "outside",
    message: "That's outside our usual Kansas City routes — but tell us where you are and we'll let you know when we expand.",
  };
}

/** True for the two statuses that should let a visitor continue booking. */
export function isServable(status: CoverageStatus): boolean {
  return status === "covered" || status === "likely";
}
