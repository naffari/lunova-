/**
 * Pricing and estimator-handoff checks.
 *
 * The service-page estimator and step 2 of the booking wizard now quote the
 * same job through the same functions, and the selection travels between them
 * in the URL. That contract is exactly the kind of thing that breaks silently:
 * rename a question id, add a package, tighten a range, and the page still
 * renders — it just quotes one number and hands the wizard a different one, or
 * drops the answers and asks for them again. Neither shows up in a typecheck
 * and neither is visible without clicking through every service.
 *
 * So the arithmetic and the round trip are asserted here instead.
 *
 * Runs as part of `pnpm build`, before anything is rendered. Exits non-zero on
 * the first failure.
 *
 * Run alone:  pnpm check:estimator
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformWithEsbuild } from "vite";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const TMP = path.join(ROOT, "node_modules", ".cache", "lunova-checks");

/**
 * Load a TypeScript constants module under plain node.
 *
 * These two files are pure data and pure functions with no React and no
 * imports outside each other, so stripping the types is enough — there is no
 * need to stand up the whole Vite pipeline to read them. `transformWithEsbuild`
 * is Vite's public API, which is why this does not reach for esbuild directly
 * (pnpm does not hoist it to a resolvable path).
 */
async function loadModule(relative, rewrites = {}) {
  const source = await readFile(path.join(ROOT, relative), "utf8");
  const { code } = await transformWithEsbuild(source, relative, { loader: "ts", format: "esm" });

  let out = code;
  for (const [from, to] of Object.entries(rewrites)) {
    out = out.replaceAll(`"${from}"`, `"${to}"`);
  }

  const file = path.join(TMP, `${path.basename(relative, ".ts")}.mjs`);
  await writeFile(file, out, "utf8");
  return import(pathToFileURL(file).href);
}

await mkdir(TMP, { recursive: true });

const details = await loadModule("src/app/constants/serviceDetails.ts");
const link = await loadModule("src/app/constants/estimatorLink.ts", {
  "./serviceDetails": "./serviceDetails.mjs",
});

const { getServiceDetail, priceDetail, defaultAnswers, withLivePrices, SERVICE_DETAILS } = details;
const { estimateBookingPath, readEstimateParams } = link;

const failures = [];

function check(label, actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failures.push(`${label}\n           got      ${JSON.stringify(actual)}\n           expected ${JSON.stringify(expected)}`);
  }
}

// ── The arithmetic, on a selection with every kind of adjustment in it ───────
const cleaning = getServiceDetail("cleaning");
const answers = { bedrooms: 5, bathrooms: 3, condition: "behind" };
const estimate = priceDetail(cleaning, "deep", answers, ["oven", "fridge"]);

// 280 base + 2 extra bedrooms × 30 + 1 extra bathroom × 35 + 60 condition + 45 + 45
check("deep clean 5bed/3bath/behind + oven + fridge", estimate.subtotal, 525);
check("  priced, not deferred to a visit", estimate.needsVisit, false);
check("  counters under the included threshold add nothing", priceDetail(cleaning, "deep", { bedrooms: 3, bathrooms: 2, condition: "maintained" }, []).subtotal, 280);

// ── The URL contract, both directions ───────────────────────────────────────
const url = estimateBookingPath({
  categoryId: "cleaning",
  packageId: "deep",
  answers,
  addOnIds: ["oven", "fridge"],
});
const parsed = readEstimateParams("cleaning", new URLSearchParams(url.split("?")[1]));

check("round trip preserves answers", parsed.answers, answers);
check("round trip preserves add-ons", parsed.addOnIds, ["oven", "fridge"]);
check(
  "the wizard re-prices to the number the page promised",
  priceDetail(cleaning, "deep", parsed.answers, parsed.addOnIds).subtotal,
  estimate.subtotal
);

// ── Hostile and stale URLs degrade, they do not misprice ─────────────────────
const hostile = readEstimateParams(
  "cleaning",
  new URLSearchParams("bedrooms=999&bathrooms=abc&condition=free&addons=oven,nope,oven")
);
check("out-of-range counter is dropped", hostile.answers.bedrooms, undefined);
check("non-numeric counter is dropped", hostile.answers.bathrooms, undefined);
check("unknown choice value is dropped", hostile.answers.condition, undefined);
check("unknown add-on is dropped, known one kept once", hostile.addOnIds, ["oven"]);

// ── A tier that needs a site visit must never show a number ─────────────────
const commercial = getServiceDetail("commercial");
check(
  "commercial stays quote-only",
  priceDetail(commercial, commercial.packages[0].id, defaultAnswers("commercial"), []).needsVisit,
  true
);

// ── Live CRM floors replace the price and nothing else ──────────────────────
const live = withLivePrices(cleaning, { "deep clean": 249 });
const liveDeep = live.packages.find((pkg) => pkg.id === "deep");
check("CRM floor is applied", liveDeep.from, 249);
check("CRM does not touch the checklist", liveDeep.includes, cleaning.packages.find((p) => p.id === "deep").includes);
check("a package the CRM did not return keeps its local price", live.packages.find((p) => p.id === "standard").from, 175);

// ── Every service prices its own defaults ───────────────────────────────────
// Catches a new service, or a renamed question id, that leaves the estimator
// rendering $0 under a "Continue with" button.
for (const id of Object.keys(SERVICE_DETAILS)) {
  const detail = getServiceDetail(id);
  const first = detail.packages.find((pkg) => pkg.popular) ?? detail.packages[0];
  const result = priceDetail(detail, first.id, defaultAnswers(id), []);
  if (!result.needsVisit && result.subtotal <= 0) {
    failures.push(`${id}: default selection prices at ${result.subtotal} without asking for a visit`);
  }
}

if (failures.length > 0) {
  console.error(`\nEstimator check failed with ${failures.length} failure(s):\n`);
  for (const failure of failures) console.error(`  fail   ${failure}`);
  console.error("");
  process.exit(1);
}

console.log(`Estimator check passed (${Object.keys(SERVICE_DETAILS).length} services priced).`);
