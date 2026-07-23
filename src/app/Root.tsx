import { Outlet, useLocation, Link } from "react-router";
import { useEffect, Component, Suspense } from "react";
import type { ReactNode } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageLoader from "./components/common/PageLoader";
import MobileCTABar from "./components/common/MobileCTABar";

const HIDE_MOBILE_CTA_PATHS = ["/book", "/quote", "/book/success", "/quote/success"];

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: "#F1EBD9", color: "#3C312A" }}>
          <h1 className="font-serif-display text-4xl sm:text-5xl mb-4">Something went wrong</h1>
          <p className="text-base mb-8 max-w-md" style={{ color: "#3C312Abb" }}>
            We hit an unexpected error. Please try refreshing the page.
          </p>
          <Link
            to="/"
            onClick={() => this.setState({ hasError: false })}
            className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-sm transition-colors"
            style={{ backgroundColor: "#c8960e", color: "#3C312A" }}
          >
            Back to Home
          </Link>
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${hideMobileCTA ? "" : "pb-[4.75rem] sm:pb-0"}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:text-sm"
        style={{ backgroundColor: "#c8960e", color: "#3C312A" }}
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" role="main">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      {!hideMobileCTA && <MobileCTABar />}
    </div>
  );
}
