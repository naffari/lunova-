import Seo from "../components/common/Seo";
import { buildBreadcrumbSchema } from "../utils/structuredData";
import { COMPANY_NAME, EMAIL } from "../constants/contact";

const PRIMARY = "#3C312A";
const BG = "#F1EBD9";

const PRIVACY_DESCRIPTION =
  `${COMPANY_NAME}'s privacy policy: what information we collect, how it's used, and your choices around cookies and data.`;

/**
 * NOTE: this is a generic, standard-structure privacy policy template
 * (contact-form data, cookies/analytics, no data resale, contact info)
 * meant to satisfy the cookie-consent banner's link target. It has not
 * been reviewed by legal counsel and MUST be replaced with reviewed
 * copy — reflecting the business's actual data practices and any
 * jurisdiction-specific requirements (e.g. CCPA) — before launch.
 */
export default function Privacy() {
  return (
    <div className="font-sans-modern min-h-screen px-4 py-16 sm:py-24" style={{ backgroundColor: BG, color: PRIMARY }}>
      <Seo
        title={`Privacy Policy | ${COMPANY_NAME}`}
        description={PRIVACY_DESCRIPTION}
        jsonLd={buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy" }])}
      />
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif-display text-4xl sm:text-5xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm mb-10" style={{ color: `${PRIMARY}bb` }}>Last updated: {new Date().getFullYear()}</p>

        <div className="space-y-8 text-sm leading-relaxed" style={{ color: `${PRIMARY}bb` }}>
          <section>
            <h2 className="text-xl font-bold mb-2" style={{ color: PRIMARY }}>Information We Collect</h2>
            <p>
              When you request a quote, book a service, or contact us, we collect the information you provide directly,
              such as your name, phone number, email address, and service address. We do not sell this information to
              third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2" style={{ color: PRIMARY }}>Analytics</h2>
            <p>
              With your consent, we use Umami, a privacy-focused analytics service, to understand in aggregate how
              visitors use our site so we can improve it. Umami does not use tracking cookies and does not collect
              personally identifiable information. You can accept or decline this from the banner shown on your first
              visit, and change your choice at any time by clearing your browser's site data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2" style={{ color: PRIMARY }}>How We Use Your Information</h2>
            <p>
              We use the information you provide to respond to quote requests, schedule and deliver booked services,
              and communicate with you about your service (e.g. arrival windows, confirmations, and receipts).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-2" style={{ color: PRIMARY }}>Contact Us</h2>
            <p>
              If you have questions about this policy or want to request that we delete your information, email us at{" "}
              <a href={`mailto:${EMAIL}`} className="underline font-semibold">{EMAIL}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
