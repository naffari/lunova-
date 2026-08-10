import { useParams, Link, Navigate } from "react-router";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import Seo from "../components/common/Seo";
import FaqSection from "../components/FaqSection";
import ContactStrip from "../components/common/ContactStrip";
import { BRAND } from "../constants/brand";
import { SERVICE_BY_ID, bookPath, startingAtLabel } from "../constants/services";
import { GUIDE_BY_SLUG, guidePath, readMinutes, relatedGuides } from "../constants/guides";
import type { Guide as GuideType, GuideSection } from "../constants/guides";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
} from "../utils/structuredData";
import { heroOgImage, heroSize } from "../constants/seo";
import { HIGH_FETCH_PRIORITY } from "../utils/dom";
import { preloadRoute } from "../routeModules";

const PRIMARY = BRAND.primary;
const ACCENT = BRAND.accent;

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Long-form guide page.
 *
 * One component for every guide, driven by constants/guides.ts — the same
 * pattern as ServiceAreaCity and the twelve city pages. Adding a guide is a
 * data change plus a slug in routeConfig's prerender expansion; there is no
 * new component to write and no layout to keep in step.
 *
 * The measure is deliberately narrow (max-w-[68ch]). These pages exist to be
 * read start to finish, and a service page's 7xl container is unreadable at
 * body size.
 */
export default function Guide() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? GUIDE_BY_SLUG[slug] : undefined;

  /**
   * Unknown slug.
   *
   * Only real slugs are prerendered, so a crawler or a hard page load asking
   * for /guides/nonsense never reaches this component — it gets the static
   * 404 from the CDN. This branch only fires on a client-side navigation to a
   * slug that no longer exists (a stale link in someone's open tab after a
   * guide is removed), where bouncing to the index is more useful than a 404
   * screen and costs nothing in indexing terms.
   */
  if (!guide) return <Navigate to="/guides" replace />;

  const service = SERVICE_BY_ID[guide.service];
  const related = relatedGuides(guide.slug);
  const minutes = readMinutes(guide);

  /**
   * The guide shares a picture of the work it is about, not the site-wide
   * composite: a link to the power-washing guide should preview as a driveway
   * being washed. Same image feeds the Article schema, which is what an AI
   * answer engine and Google Discover pick up.
   */
  const shareImage = heroOgImage(service.hero);
  const shareImageAlt = `${service.name} by Lunova Services in Kansas City`;

  return (
    <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.ink }}>
      <Seo
        title={`${guide.title} | Lunova`}
        description={guide.description}
        type="article"
        image={shareImage}
        imageAlt={shareImageAlt}
        jsonLd={[
          buildArticleSchema({
            title: guide.title,
            description: guide.description,
            path: guidePath(guide.slug),
            datePublished: guide.published,
            dateModified: guide.updated ?? guide.published,
            image: shareImage,
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.heading, path: guidePath(guide.slug) },
          ]),
          buildFaqSchema(guide.faqs),
        ]}
      />

      <article>
        <header className="pt-28 pb-10 px-4 sm:px-6" style={{ backgroundColor: BRAND.raised }}>
          <div className="max-w-[68ch] mx-auto">
            <nav aria-label="Breadcrumb" className="mb-5 text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>
              <Link to="/guides" className="hover:underline">
                Guides
              </Link>
              <span aria-hidden="true"> / </span>
              <span>{guide.category}</span>
            </nav>

            <h1 className="font-serif-display text-4xl sm:text-5xl leading-[1.08] mb-4" style={{ color: "#ffffff" }}>
              {guide.heading}
            </h1>

            <p className="text-base sm:text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
              {guide.standfirst}
            </p>

            <div
              className="mt-7 pt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs"
              style={{ borderTop: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.6)" }}
            >
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} aria-hidden="true" />
                <time dateTime={guide.published}>{formatDate(guide.published)}</time>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} aria-hidden="true" />
                {minutes} min read
              </span>
            </div>
          </div>
        </header>

        {/*
          A picture of the work the guide is about.

          These four pages shipped with no image at all — 1,100 to 1,400 words
          of text between a dark header and a cream body, which is a wall to
          read and nothing for Google Images or a Discover card to pick up.
          It is the same photo as the share card and the Article schema's
          `image`, so what a reader sees and what a crawler is told match.
        */}
        <figure className="m-0 w-full overflow-hidden" style={{ backgroundColor: BRAND.raised }}>
          <picture>
            <source
              type="image/avif"
              sizes="100vw"
              srcSet={`/images/hero/${service.hero}-640.avif 640w, /images/hero/${service.hero}-1280.avif 1280w`}
            />
            <source
              type="image/webp"
              sizes="100vw"
              srcSet={`/images/hero/${service.hero}-640.webp 640w, /images/hero/${service.hero}-1280.webp 1280w`}
            />
            <img
              src={`/images/hero/${service.hero}-1280.jpg`}
              alt={shareImageAlt}
              className="block w-full object-cover h-[30vw] min-h-[160px] max-h-[360px]"
              width={heroSize(service.hero).width}
              height={heroSize(service.hero).height}
              loading="eager"
              decoding="async"
              {...HIGH_FETCH_PRIORITY}
            />
          </picture>
        </figure>

        {/*
          THE SHORT ANSWER, before anything else.

          This is the block that gets lifted into an AI Overview or a featured
          snippet, and the block a reader who is in a hurry actually needs. It
          is written in constants/guides.ts to stand alone with no context, so
          it survives being quoted somewhere else.
        */}
        <div className="px-4 sm:px-6 pt-10">
          <div className="max-w-[68ch] mx-auto">
            <div
              className="rounded-2xl p-6 sm:p-7"
              style={{ backgroundColor: BRAND.surface, borderLeft: `3px solid ${ACCENT}` }}
            >
              <h2 className="text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: ACCENT }}>
                The short answer
              </h2>
              <p className="text-[15px] sm:text-base leading-relaxed" style={{ color: PRIMARY }}>
                {guide.answer}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-12">
          <div className="max-w-[68ch] mx-auto">
            {guide.sections.map((section) => (
              <Section key={section.heading} section={section} />
            ))}

            {/* In-context CTA, at the end of the argument rather than on top of it. */}
            {service && (
              <aside
                className="mt-14 rounded-2xl p-6 sm:p-7"
                style={{ backgroundColor: BRAND.surface, border: `1px solid ${BRAND.hairline}` }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>
                  If you'd rather not do it yourself
                </p>
                <h2 className="font-serif-display text-2xl mb-2" style={{ color: PRIMARY }}>
                  {service.name} across the Kansas City metro
                </h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: BRAND.muted }}>
                  {startingAtLabel(service)}. Flat rates confirmed before any work starts, insured and
                  background-checked crews, and no charge for the quote.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to={bookPath(guide.service)}
                    onMouseEnter={() => preloadRoute("/book")}
                    onFocus={() => preloadRoute("/book")}
                    className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-sm"
                    style={{ backgroundColor: ACCENT, color: BRAND.ink }}
                  >
                    Get a price
                    <ArrowUpRight size={15} />
                  </Link>
                  <Link
                    to={service.to}
                    onMouseEnter={() => preloadRoute(service.to)}
                    onFocus={() => preloadRoute(service.to)}
                    className="text-sm font-semibold underline"
                    style={{ color: PRIMARY }}
                  >
                    See what's included
                  </Link>
                </div>
              </aside>
            )}
          </div>
        </div>

        <section className="px-4 sm:px-6 py-14" style={{ backgroundColor: BRAND.surface }}>
          <div className="max-w-[68ch] mx-auto">
            <FaqSection items={guide.faqs} title="Common questions" subtitle="FAQ" />
          </div>
        </section>

        {related.length > 0 && (
          <section className="px-4 sm:px-6 py-14">
            <div className="max-w-[68ch] mx-auto">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: PRIMARY }}>
                Read next
              </h2>
              <div className="grid gap-3">
                {related.map((other) => (
                  <GuideLink key={other.slug} guide={other} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <ContactStrip
        heading="Still want a straight price?"
        subtext="Two minutes online, or one phone call. We confirm the figure before anyone starts work."
        primaryColor={BRAND.raised}
        accentColor={ACCENT}
        ctaLabel="Get a quote"
        ctaTo={bookPath(guide.service)}
      />
    </div>
  );
}

function Section({ section }: { section: GuideSection }) {
  return (
    <section className="mb-11">
      <h2 className="font-serif-display text-2xl sm:text-3xl mb-4" style={{ color: PRIMARY }}>
        {section.heading}
      </h2>

      {section.body?.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="text-[15px] leading-[1.75] mb-4" style={{ color: BRAND.muted }}>
          {paragraph}
        </p>
      ))}

      {section.list && (
        <ul className="grid gap-2.5 my-5">
          {section.list.map((item) => (
            <li key={item.slice(0, 40)} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="mt-[0.6em] w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: ACCENT }}
              />
              <span className="text-[15px] leading-[1.7]" style={{ color: BRAND.muted }}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}

      {section.table && (
        // Tables are the one element wider than the measure, so it scrolls
        // inside its own box rather than making the page scroll sideways.
        <div className="my-6 -mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left border-collapse">
            <thead>
              <tr>
                {section.table.columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="text-[11px] font-bold uppercase tracking-wider pb-2.5 pr-4"
                    style={{ color: ACCENT, borderBottom: `1px solid ${BRAND.hairlineStrong}` }}
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td
                      key={cell}
                      className={`py-3 pr-4 text-sm align-top ${index === 0 ? "font-semibold" : ""}`}
                      style={{
                        color: index === 0 ? PRIMARY : BRAND.muted,
                        borderBottom: `1px solid ${BRAND.hairline}`,
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.note && (
        <p
          className="text-[13px] leading-relaxed mt-5 pl-4"
          style={{ color: BRAND.muted, borderLeft: `2px solid ${BRAND.hairlineStrong}` }}
        >
          {section.note}
        </p>
      )}
    </section>
  );
}

export function GuideLink({ guide }: { guide: GuideType }) {
  return (
    <Link
      to={guidePath(guide.slug)}
      className="group flex items-start justify-between gap-4 rounded-2xl p-5 transition-colors"
      style={{ backgroundColor: BRAND.surface, border: `1px solid ${BRAND.hairline}` }}
    >
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>
          {guide.category} · {readMinutes(guide)} min
        </span>
        <span className="block font-serif-display text-lg leading-snug mb-1" style={{ color: PRIMARY }}>
          {guide.heading}
        </span>
        <span className="block text-xs leading-relaxed" style={{ color: BRAND.muted }}>
          {guide.standfirst}
        </span>
      </span>
      <ArrowUpRight
        size={16}
        className="shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        style={{ color: ACCENT }}
        aria-hidden="true"
      />
    </Link>
  );
}
