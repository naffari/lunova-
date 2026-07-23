import { BookingProvider } from "./booking/BookingContext";
import BookingForm from "./booking/BookingForm";
import Seo from "../components/common/Seo";
import { buildBreadcrumbSchema } from "../utils/structuredData";

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
      <div className="bg-background text-foreground min-h-screen">
        {/* Page Hero */}
        <section className="relative pt-24 pb-14 px-4 sm:px-6 overflow-hidden border-b border-border bg-gradient-to-b from-[#0a1628] to-background">
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <span className="text-primary text-xs font-semibold uppercase tracking-widest bg-primary/10 border border-primary/20 px-3.5 py-1 rounded-full">
              Fast Online Booking
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)" }}
              className="text-4xl sm:text-6xl font-bold text-foreground uppercase leading-tight mt-4 mb-3"
            >
              Book Your Service <span className="text-primary">&amp; Bundle Savings</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-xl mx-auto">
              Select your service, add discounted cross-sell add-ons, pick your date, and lock in your appointment in 60 seconds.
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <BookingProvider>
            <BookingForm />
          </BookingProvider>
        </div>
      </div>
    </>
  );
}
