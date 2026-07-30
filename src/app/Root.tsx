import { Outlet, useLocation, Link } from "react-router";
import { useEffect, Component, Suspense } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Phone, RotateCcw } from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageLoader from "./components/common/PageLoader";
import MobileCTABar from "./components/common/MobileCTABar";
import CookieConsent from "./components/common/CookieConsent";
import Analytics from "./components/common/Analytics";
import { PHONE, PHONE_DISPLAY } from "./constants/contact";

const HIDE_MOBILE_CTA_PATHS = ["/book", "/book/success"];

class ErrorBoundary extends Component<
  { children: ReactNode; resetKey: string },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; resetKey: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Logged for local debugging; wire up to an error-reporting service
    // (e.g. Sentry) here once one is provisioned.
    console.error("Unhandled error rendering route:", error, errorInfo.componentStack);
  }

  componentDidUpdate(prevProps: { resetKey: string }) {
    // Recover automatically when the user navigates away from the page
    // that threw, so a stale error screen doesn't follow them around.
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center bg-background text-foreground">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5 bg-primary/10">
            <AlertTriangle size={28} className="text-primary" />
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl mb-4">Something went wrong</h1>
          <p className="text-base mb-8 max-w-md text-foreground/70">
            We hit an unexpected error loading this page. You can try again, or head back to the homepage.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-sm transition-colors bg-primary text-foreground"
            >
              <RotateCcw size={16} /> Try Again
            </button>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full text-sm transition-colors border border-foreground/20 text-foreground"
            >
              Back to Home
            </Link>
          </div>
          <a
            href={`tel:+1${PHONE}`}
            className="inline-flex items-center gap-2 text-sm font-semibold mt-6 transition-colors text-foreground/70"
          >
            <Phone size={14} /> Or call us at {PHONE_DISPLAY}
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Root() {
  const location = useLocation();
  const hideMobileCTA = HIDE_MOBILE_CTA_PATHS.includes(location.pathname);

  useEffect(() => {
    // Jump, don't animate. A smooth scroll here scrolls the *outgoing* page
    // up before the new route paints, which reads as lag on every navigation.
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${hideMobileCTA ? "" : "pb-[4.75rem] sm:pb-0"}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm focus:bg-primary focus:text-foreground"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" role="main">
        <ErrorBoundary resetKey={location.pathname}>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      {!hideMobileCTA && <MobileCTABar />}
      <CookieConsent mobileCtaVisible={!hideMobileCTA} />
      <Analytics />
    </div>
  );
}
