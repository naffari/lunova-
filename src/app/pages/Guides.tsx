import Seo from "../components/common/Seo";
import PageHero from "../components/PageHero";
import ContactStrip from "../components/common/ContactStrip";
import { BookOpen } from "lucide-react";
import { BRAND } from "../constants/brand";
import { GUIDES, guidePath } from "../constants/guides";
import { SITE_URL } from "../constants/seo";
import { buildBreadcrumbSchema } from "../utils/structuredData";
import type { JsonLdSchema } from "../utils/structuredData";
import { GuideLink } from "./Guide";

const PRIMARY = BRAND.primary;
const ACCENT = BRAND.accent;

const DESCRIPTION =
  "Straight answers on move-out cleaning, bin sanitising, power washing and what home services actually cost in the Kansas City metro.";

/**
 * Guides index.
 *
 * Also the hub the individual guides hang off, which is the point: a guide
 * reachable only from the sitemap is a guide Google crawls late and ranks
 * badly. Same reasoning as /service-areas and the twelve city pages.
 */
function buildGuideListSchema(): JsonLdSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Lunova Services guides",
    itemListElement: GUIDES.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${guidePath(guide.slug)}`,
      name: guide.heading,
    })),
  };
}

export default function Guides() {
  return (
    <div className="font-sans-modern min-h-screen" style={{ backgroundColor: BRAND.bg, color: BRAND.ink }}>
      <Seo
        title="Home Service Guides | Kansas City | Lunova"
        description={DESCRIPTION}
        jsonLd={[
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ]),
          buildGuideListSchema(),
        ]}
      />

      <PageHero
        eyebrow={
          <>
            <BookOpen size={14} />
            <span>Guides</span>
          </>
        }
        title={
          <>
            Answers before the{" "}
            <span className="italic" style={{ color: ACCENT }}>sales pitch.</span>
          </>
        }
        lead="What a job involves, what it should cost in this metro, and when you are better off doing it yourself. Written by the people who do the work, which is why some of it talks you out of hiring us."
        meta={[`${GUIDES.length} guides`, "Kansas City metro", "No email required"]}
        ctaLabel="Get a flat-rate quote"
      />

      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-[68ch] mx-auto grid gap-3">
          {GUIDES.map((guide) => (
            <GuideLink key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-[68ch] mx-auto">
          <p className="text-sm leading-relaxed" style={{ color: BRAND.muted }}>
            Something you wanted answered and could not find here? Call and ask. We would rather
            spend five minutes on the phone than have you book the wrong service —{" "}
            <span style={{ color: PRIMARY }}>the quote is free either way.</span>
          </p>
        </div>
      </section>

      <ContactStrip
        heading="Know what you need?"
        subtext="Pick a service, answer a few questions, and see the price before you commit to anything."
        primaryColor={BRAND.raised}
        accentColor={ACCENT}
        ctaLabel="Book Online"
        ctaTo="/book"
      />
    </div>
  );
}
