import { Helmet } from "react-helmet-async";
import { QuoteProvider } from "./quote/QuoteContext";
import QuoteStepper from "./quote/QuoteStepper";
import QuoteForm from "./quote/QuoteForm";
import QuoteSidebar from "./quote/QuoteSidebar";

export default function Quote() {
  return (
    <>
      <Helmet>
        <title>Get a Free Instant Quote | Lunova Services</title>
        <meta name="description" content="Get an instant, transparent quote for cleaning, power washing, junk removal, landscaping, auto detailing, bin cleaning, window cleaning, and commercial services in Kansas City." />
        <meta property="og:title" content="Get a Free Instant Quote | Lunova Services" />
        <meta property="og:description" content="Instant cost estimator for all Lunova services. Pick your service, adjust preferences, and receive a transparent price range in seconds." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="bg-background text-foreground min-h-screen">
        {/* Page Hero */}
        <section className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden" style={{ backgroundColor: '#2A2118', borderBottom: '1px solid rgba(241,235,217,0.1)' }}>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full" style={{ color: '#c8960e', backgroundColor: 'rgba(200,150,14,0.12)', border: '1px solid rgba(200,150,14,0.25)' }}>
              Instant Cost Estimator
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)", color: '#F1EBD9' }}
              className="text-4xl sm:text-6xl font-bold uppercase leading-tight mt-4 mb-3"
            >
              Get a Free <span style={{ color: '#c8960e' }}>Instant Quote</span>
            </h1>
            <p className="text-base leading-relaxed max-w-lg mx-auto" style={{ color: 'rgba(241,235,217,0.6)' }}>
              Pick your service, adjust your preferences, and receive a transparent price range in seconds.
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <QuoteProvider>
            <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
              {/* ---- LEFT: calculator ---- */}
              <div>
                <QuoteStepper />
                <QuoteForm />
              </div>

              {/* ---- RIGHT: Sidebar ---- */}
              <QuoteSidebar />
            </div>
          </QuoteProvider>
        </div>
      </div>
    </>
  );
}
