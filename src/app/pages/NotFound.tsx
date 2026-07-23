import { Link } from "react-router";
import { Home, ArrowLeft, Search, Phone } from "lucide-react";
import { PHONE, PHONE_DISPLAY } from "../constants/contact";
import Seo from "../components/common/Seo";

const PRIMARY = "#3C312A";
const ACCENT = "#c8960e";
const BG = "#F1EBD9";

export default function NotFound() {
  return (
    <div className="font-sans-modern min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: BG, color: PRIMARY }}>
      <Seo
        title="Page Not Found | Lunova Services"
        description="The page you're looking for doesn't exist or has been moved. Explore Lunova's cleaning, junk removal, and landscaping services in Kansas City."
        noIndex
      />
      <div className="text-center max-w-lg">
        <div
          className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center"
          style={{ backgroundColor: `${PRIMARY}15` }}
        >
          <Search size={48} style={{ color: PRIMARY }} />
        </div>

        <h1
          className="font-serif-display text-6xl sm:text-7xl font-bold mb-4"
          style={{ color: PRIMARY }}
        >
          404
        </h1>

        <h2
          className="text-2xl sm:text-3xl font-bold mb-4"
          style={{ color: PRIMARY }}
        >
          Page Not Found
        </h2>

        <p className="text-base leading-relaxed mb-10" style={{ color: `${PRIMARY}99` }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-base transition-all shadow-md"
            style={{ backgroundColor: ACCENT, color: PRIMARY }}
          >
            <Home size={18} />
            Back to Home
          </Link>

          <a
            href={`tel:+1${PHONE}`}
            className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full text-base transition-colors text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            <Phone size={18} style={{ color: ACCENT }} />
            {PHONE_DISPLAY}
          </a>
        </div>

        <div className="pt-8" style={{ borderTop: `1px solid ${PRIMARY}20` }}>
          <p className="text-sm mb-4" style={{ color: `${PRIMARY}70` }}>
            Looking for a specific service?
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Link
              to="/services/residential-cleaning"
              className="px-4 py-2 rounded-lg text-center transition-colors"
              style={{ backgroundColor: 'white', border: `1px solid ${PRIMARY}20`, color: PRIMARY }}
            >
              Residential Cleaning
            </Link>
            <Link
              to="/services/power-washing"
              className="px-4 py-2 rounded-lg text-center transition-colors"
              style={{ backgroundColor: 'white', border: `1px solid ${PRIMARY}20`, color: PRIMARY }}
            >
              Power Washing
            </Link>
            <Link
              to="/junk-removal"
              className="px-4 py-2 rounded-lg text-center transition-colors"
              style={{ backgroundColor: 'white', border: `1px solid ${PRIMARY}20`, color: PRIMARY }}
            >
              Junk Removal
            </Link>
            <Link
              to="/landscaping"
              className="px-4 py-2 rounded-lg text-center transition-colors"
              style={{ backgroundColor: 'white', border: `1px solid ${PRIMARY}20`, color: PRIMARY }}
            >
              Landscaping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
