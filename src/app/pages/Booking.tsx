import type { CSSProperties } from "react";
import BookingWizard from "./booking/BookingWizard";
import Seo from "../components/common/Seo";
import { buildBreadcrumbSchema } from "../utils/structuredData";

const BOOKING_DESCRIPTION =
  "Book cleaning, power washing, junk removal, landscaping, auto detailing, bin cleaning, window cleaning, and commercial services online in Kansas City. Fast booking with bundle savings.";

// Sage design system — scoped to the Booking page only, matching Home.tsx.
const PRIMARY = "#1e2319";
const ACCENT = "#3d6b2e";
const ACCENT_2 = "#7fa650";
const BG = "#f4f6f2";
const SURFACE = "#e7ece1";

const sageThemeVars = {
  "--background": BG,
  "--foreground": PRIMARY,
  "--card": "#ffffff",
  "--card-foreground": PRIMARY,
  "--popover": "#ffffff",
  "--popover-foreground": PRIMARY,
  "--primary": ACCENT,
  "--primary-foreground": "#ffffff",
  "--secondary": SURFACE,
  "--secondary-foreground": PRIMARY,
  "--muted": SURFACE,
  "--muted-foreground": "#5f6256",
  "--accent": ACCENT_2,
  "--accent-foreground": PRIMARY,
  "--border": "rgba(30, 35, 25, 0.14)",
  "--input": "transparent",
  "--input-background": SURFACE,
  "--ring": ACCENT,
  "--radius": "1.1rem",
  "--font-display": "var(--font-sage-heading)",
  "--font-body": "var(--font-sage-body)",
} as CSSProperties;

export default function Booking() {
  return (
    <>
      <Seo
        title="Book Your Service | Lunova Services"
        description={BOOKING_DESCRIPTION}
        jsonLd={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Book a Service", path: "/book" },
        ])}
      />
      <div className="font-sans-modern min-h-screen pt-24 pb-20 px-4 sm:px-6" style={{ ...sageThemeVars, backgroundColor: BG, color: PRIMARY }}>
        <BookingWizard />
      </div>
    </>
  );
}
