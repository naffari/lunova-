/**
 * Price consistency check.
 *
 * Every price the site shows now comes from one catalogue,
 * src/app/constants/services.ts, formatted at the edge with `startingAtLabel` /
 * `formatPrice` / `formatDollars`. The service pages used to carry their own
 * hand-written figures, and they had drifted badly — a visitor could read "From
 * $175" on the power washing page and be quoted $120 in the wizard, and the
 * residential page contradicted *itself* ($130 in the stat band and pricing
 * table, $120 in the package grid directly above them).
 *
 * The earlier version of this script compared those hand-written figures against
 * the catalogue and reported the gap. There is nothing left to compare: the
 * figures are gone. So the check flipped from "do the two lists agree" to "did
 * anyone hand-write a price again", which is the thing that actually causes the
 * bug.
 *
 * This one DOES gate. The previous version deliberately exited 0 because it was
 * reporting a pre-existing data problem nobody had decided on. That decision has
 * been made, so a new hardcoded price is a regression, not a finding.
 *
 * Run:  pnpm check:prices
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");

/** Directories whose files render customer-facing prices. */
const SCAN_DIRS = ["src/app/pages", "src/app/components"];

/**
 * Files allowed to contain a bare dollar figure, with the reason.
 *
 * The catalogue and its formatters obviously hold real numbers. The rest are
 * fees and examples that are not a service price and have no catalogue entry to
 * drift from.
 */
const ALLOWED = new Map([
  ["src/app/constants/services.ts", "the catalogue itself"],
  ["src/app/constants/serviceDetails.ts", "package/add-on floors, the catalogue's other half"],
  ["src/app/components/FaqSection.tsx", "late-cancellation fee, not a service price"],
]);

/**
 * A literal like $130, $0.10, $15.
 *
 * `$0` alone is excluded: it is the wizard's "this option costs nothing"
 * placeholder, not a price that can drift. Template reads such as
 * `${formatDollars(x)}` never match, since the `$` is followed by `{`.
 */
const HARDCODED_PRICE = /\$\d[\d,.]*/;
const BARE_ZERO = /^\$0$/;

/**
 * Blanks out comments so prose about prices doesn't trip the check — including
 * the notes explaining which wrong numbers were removed, which are exactly the
 * kind of text that would otherwise flag forever. Newlines are preserved so
 * reported line numbers stay accurate.
 */
function stripComments(source) {
  return source
    .replace(/\{?\/\*[\s\S]*?\*\/\}?/g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/\/\/.*$/gm, "");
}

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) out.push(...(await walk(rel)));
    else if (/\.tsx?$/.test(entry.name)) out.push(rel);
  }
  return out;
}

const findings = [];

for (const dir of SCAN_DIRS) {
  for (const file of await walk(dir)) {
    if (ALLOWED.has(file)) continue;

    const source = await readFile(path.join(ROOT, file), "utf8");
    stripComments(source)
      .split("\n")
      .forEach((line, i) => {
        const match = line.match(HARDCODED_PRICE);
        if (!match || BARE_ZERO.test(match[0])) return;
        findings.push({ file, line: i + 1, text: line.trim().slice(0, 90), price: match[0] });
      });
  }
}

if (findings.length === 0) {
  console.log("Prices consistent: no hand-written price literals outside the catalogue.");
  process.exit(0);
}

console.log(`\n${findings.length} hand-written price literal(s) found outside the catalogue:\n`);
for (const f of findings) {
  console.log(`  ${f.file}:${f.line}  ${f.price}`);
  console.log(`    ${f.text}`);
}
console.log(
  `\nA price written into a component drifts from the booking wizard the moment` +
    `\nthe catalogue changes, and the customer sees one number on the page and a` +
    `\ndifferent one at checkout. Read it from src/app/constants/services.ts instead:` +
    `\n  startingAtLabel(SERVICE_BY_ID.<id>)  ·  formatPrice(sub)  ·  formatDollars(n)\n`
);

process.exit(1);
