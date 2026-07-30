/**
 * Price consistency check.
 *
 * The booking funnel (homepage cards + wizard) is now driven by one catalogue:
 * src/app/constants/services.ts. The individual service pages still carry their
 * own hand-written package tables, and several of them disagree with the
 * catalogue — in one case by nearly 2x.
 *
 * These are NOT typos to be auto-fixed. The service pages describe a richer
 * product range (ceramic coating, headlight restoration, three-bin plans,
 * quarter-truck loads) that the wizard does not offer at all, so the two lists
 * are not the same list. Reconciling them requires knowing what Lunova actually
 * charges, which is a business decision.
 *
 * So this reports rather than rewrites. Run it after touching either side.
 *
 * Run:  pnpm check:prices
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const PAGES_DIR = path.join(ROOT, "src/app/pages");

/** Catalogue floors, parsed out of the TS source (no TS loader in plain node). */
const catalogSource = await readFile(path.join(ROOT, "src/app/constants/services.ts"), "utf8");

const catalog = {};
for (const block of catalogSource.split(/\n  \{\n/).slice(1)) {
  const id = block.match(/id:\s*"([^"]+)"/)?.[1];
  if (!id) continue;
  const floors = [...block.matchAll(/from:\s*(\d+)(?![^}]*surcharge)/g)].map(([, n]) => Number(n));
  if (floors.length > 0) catalog[id] = Math.min(...floors);
}

/** Maps a page file to the catalogue id it advertises. */
const PAGE_TO_SERVICE = {
  "Cleaning.tsx": "cleaning",
  "services/ResidentialCleaning.tsx": "cleaning",
  "services/CommercialCleaning.tsx": "commercial",
  "services/PowerWashing.tsx": "power",
  "services/WindowCleaning.tsx": "window",
  "services/AutoDetailing.tsx": "auto",
  "services/BinCleaning.tsx": "bin",
  "JunkRemoval.tsx": "junk",
  "Landscaping.tsx": "landscaping",
};

async function listPageFiles() {
  const top = (await readdir(PAGES_DIR)).filter((f) => f.endsWith(".tsx"));
  const nested = (await readdir(path.join(PAGES_DIR, "services"))).map((f) => `services/${f}`);
  return [...top, ...nested];
}

const findings = [];

for (const file of await listPageFiles()) {
  const serviceId = PAGE_TO_SERVICE[file];
  if (!serviceId) continue;

  const source = await readFile(path.join(PAGES_DIR, file), "utf8");

  // The "Starting Price" stat is the page's headline claim — the number a
  // visitor anchors on before they ever reach the booking flow.
  const stat = source.match(/val:\s*"From \$(\d+)",\s*label:\s*"Starting Price"/);
  const catalogFloor = catalog[serviceId];

  if (stat && catalogFloor !== undefined) {
    const pageFloor = Number(stat[1]);
    if (pageFloor !== catalogFloor) {
      findings.push({
        file: `src/app/pages/${file}`,
        service: serviceId,
        page: pageFloor,
        wizard: catalogFloor,
        delta: `${pageFloor > catalogFloor ? "+" : ""}${pageFloor - catalogFloor}`,
      });
    }
  }
}

if (findings.length === 0) {
  console.log("Prices consistent: every service page's starting price matches the catalogue.");
  process.exit(0);
}

console.log(`\n${findings.length} service page(s) advertise a different starting price than the booking flow:\n`);
console.log(`  ${"page".padEnd(46)} ${"page says".padStart(10)} ${"wizard says".padStart(12)} ${"delta".padStart(7)}`);
for (const f of findings) {
  console.log(
    `  ${f.file.padEnd(46)} ${`$${f.page}`.padStart(10)} ${`$${f.wizard}`.padStart(12)} ${f.delta.padStart(7)}`
  );
}
console.log(
  `\nA visitor can see one number on the service page and a different one at checkout.` +
    `\nDecide which is correct, then update src/app/constants/services.ts (the funnel) ` +
    `\nand/or the page's PACKAGES/STATS table. This check does not guess.\n`
);

// Exit 0: this is a report, not a gate. Wiring it into `build` would block
// deploys on a pre-existing data problem nobody has decided on yet.
process.exit(0);
