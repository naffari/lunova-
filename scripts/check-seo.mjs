/**
 * Pre-build SEO lint.
 *
 * Catches the three things that are invisible in review, silently wrong in
 * production, and only surface weeks later in a third-party audit:
 *
 *   1. Meta descriptions outside the 120–160 character window. Google truncates
 *      past ~160 and pads or rewrites under ~120. The live homepage shipped at
 *      180 and got cut mid-sentence in the SERP snippet.
 *   2. Titles outside 30–60 characters, same reason.
 *   3. Booking links carrying a URL slug instead of a catalogue id. `bookPath`
 *      makes this a type error now, but a hand-written string in new markup
 *      would still compile, and the failure is silent: the wizard drops the
 *      parameter and opens on step 1 with nothing chosen.
 *
 * Runs as part of `pnpm build`. Exits non-zero on any error so a broken deploy
 * fails at build time rather than in an audit.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const SRC = path.join(ROOT, "src");

const DESC_MIN = 120;
const DESC_MAX = 160;
const TITLE_MIN = 30;
const TITLE_MAX = 60;

/** Must stay in step with the ServiceId union in constants/services.ts. */
const SERVICE_IDS = new Set(["cleaning", "auto", "bin"]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.tsx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

const errors = [];
const warnings = [];

function rel(file) {
  return path.relative(ROOT, file).replace(/\\/g, "/");
}

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

/**
 * Only `<Seo>` props are meta tags.
 *
 * `description` is also a prop on ServiceHero and PageHero, where it is
 * on-page body copy that SHOULD run long. An earlier version of this check
 * matched every `description=` in the tree and flagged perfectly good hero
 * copy as an over-length meta description, so the scan is anchored to the Seo
 * element and follows `description={CONST}` back to its declaration.
 */
/**
 * Template literals are interpolated at render time (city name, service name),
 * so their final length is not knowable here. `estimate` measures the static
 * skeleton with each `${…}` stood in for by a typical value, which is close
 * enough to catch a description that is structurally too long.
 */
const INTERPOLATION_ESTIMATE = "Overland Park".length;

function measureTemplate(raw) {
  return raw.replace(/\$\{[^}]*\}/g, "x".repeat(INTERPOLATION_ESTIMATE)).length;
}

function seoProp(source, block, prop) {
  const literal = block.match(new RegExp(`${prop}=\\{?"((?:[^"\\\\]|\\\\.)*)"`));
  if (literal) return { text: literal[1], length: literal[1].length, exact: true };

  const template = block.match(new RegExp(`${prop}=\\{\`((?:[^\`\\\\]|\\\\.)*)\``));
  if (template) {
    return { text: template[1], length: measureTemplate(template[1]), exact: false };
  }

  const ref = block.match(new RegExp(`${prop}=\\{([A-Za-z_$][\\w$]*)\\}`));
  if (!ref) return null;

  const asString = source.match(
    new RegExp(`(?:const|let)\\s+${ref[1]}\\s*=\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`)
  );
  if (asString) return { text: asString[1], length: asString[1].length, exact: true };

  const asTemplate = source.match(
    new RegExp(`(?:const|let)\\s+${ref[1]}\\s*=\\s*\\n?\\s*\`((?:[^\`\\\\]|\\\\.)*)\``)
  );
  if (asTemplate) {
    return { text: asTemplate[1], length: measureTemplate(asTemplate[1]), exact: false };
  }

  return null;
}

for (const file of await walk(SRC)) {
  const source = await readFile(file, "utf8");

  for (const match of source.matchAll(/<Seo\b[\s\S]*?\/>/g)) {
    const block = match[0];
    const line = lineOf(source, match.index);

    const description = seoProp(source, block, "description");
    // `description={guide.description}` / `{city.metaDescription}` — the value
    // lives in a data file, and DATA_DRIVEN below measures every entry in it.
    // Warning here would just duplicate that with less information.
    const fromDataFile = /description=\{\w+\.\w+\}/.test(block);

    if (description === null) {
      if (!fromDataFile) {
        warnings.push(`${rel(file)}:${line} <Seo> description could not be resolved statically.`);
      }
    } else {
      const about = description.exact ? "" : " (estimated)";
      if (description.length > DESC_MAX) {
        errors.push(
          `${rel(file)}:${line} meta description is ${description.length} chars${about} (max ${DESC_MAX}): "${description.text.slice(0, 60)}…"`
        );
      } else if (description.length < DESC_MIN) {
        warnings.push(
          `${rel(file)}:${line} meta description is ${description.length} chars${about} (aim for ${DESC_MIN}+)`
        );
      }
    }

    const title = seoProp(source, block, "title");
    // Only flag titles we measured exactly. A template's real length depends on
    // what gets interpolated, and the data behind those templates is checked
    // directly below — guessing here just produces noise.
    if (title !== null && title.exact && (title.length > TITLE_MAX || title.length < TITLE_MIN)) {
      warnings.push(
        `${rel(file)}:${line} title is ${title.length} chars (aim ${TITLE_MIN}–${TITLE_MAX}): "${title.text}"`
      );
    }
  }

  // Hand-written booking links that bypass bookPath().
  for (const match of source.matchAll(/\/book\?service=([a-z-]+)/g)) {
    if (rel(file).endsWith("constants/services.ts")) continue; // the definition
    if (!SERVICE_IDS.has(match[1])) {
      errors.push(
        `${rel(file)}:${lineOf(source, match.index)} "/book?service=${match[1]}" is not a catalogue id. ` +
          `The wizard will ignore it and open on step 1. Use bookPath() from constants/services.`
      );
    }
  }
}

/**
 * Guides and city pages, checked against their data rather than their template.
 *
 * Both render `title={`${something} | suffix`}`, so the JSX scan above can only
 * estimate. These entries are literals, so measure them properly — including
 * the suffix each page appends at render time.
 */
const DATA_DRIVEN = [
  { file: "src/app/constants/guides.ts", suffix: " | Lunova" },
  { file: "src/app/constants/cities.ts", suffix: "", key: "metaDescription" },
];

for (const { file, suffix, key = "description" } of DATA_DRIVEN) {
  const source = await readFile(path.join(ROOT, file), "utf8");

  for (const match of source.matchAll(
    new RegExp(`\\b${key}:\\s*\\n?\\s*"((?:[^"\\\\]|\\\\.)*)"`, "g")
  )) {
    const text = match[1];
    if (text.length > DESC_MAX) {
      errors.push(
        `${file}:${lineOf(source, match.index)} ${key} is ${text.length} chars (max ${DESC_MAX}): "${text.slice(0, 60)}…"`
      );
    } else if (text.length < DESC_MIN) {
      warnings.push(`${file}:${lineOf(source, match.index)} ${key} is ${text.length} chars (aim ${DESC_MIN}+)`);
    }
  }

  for (const match of source.matchAll(/\btitle:\s*\n?\s*"((?:[^"\\]|\\.)*)"/g)) {
    const full = match[1] + suffix;
    if (full.length > TITLE_MAX || full.length < TITLE_MIN) {
      warnings.push(
        `${file}:${lineOf(source, match.index)} title renders as ${full.length} chars (aim ${TITLE_MIN}–${TITLE_MAX}): "${full}"`
      );
    }
  }
}

for (const warning of warnings) console.warn(`  warn  ${warning}`);

if (errors.length > 0) {
  console.error(`\nSEO check failed with ${errors.length} error(s):\n`);
  for (const error of errors) console.error(`  error  ${error}`);
  console.error("");
  process.exit(1);
}

console.log(`SEO check passed (${warnings.length} warning(s)).`);
