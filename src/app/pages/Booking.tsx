import BookingWizard from "./booking/BookingWizard";
import Seo from "../components/common/Seo";
import { buildBreadcrumbSchema } from "../utils/structuredData";
import { BRAND } from "../constants/brand";

const BOOKING_DESCRIPTION =
  "Book cleaning, power washing, junk removal, landscaping, auto detailing, bin cleaning, window cleaning, and commercial services online in Kansas City. Fast booking with bundle savings.";

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
      <div
        data-theme="booking"
        className="font-sans-modern min-h-screen pt-24 pb-20 px-4 sm:px-6"
        style={{ backgroundColor: BRAND.bg, color: BRAND.ink }}
      >
        <BookingWizard />
      </div>
    </>
  );
}
