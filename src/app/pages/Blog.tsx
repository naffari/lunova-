import { Link } from "react-router";
import { Calendar, Clock } from "lucide-react";
import { BLOG_POSTS } from "../constants/blog";
import Seo from "../components/common/Seo";
import { buildBreadcrumbSchema } from "../utils/structuredData";
import { BRAND, CHROME } from "../constants/brand";

const BLOG_DESCRIPTION =
  "Tips and guides on home cleaning, lawn care, and junk removal from the Lunova Services team, serving the Kansas City metro area.";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blog() {
  return (
    <>
      <Seo
        title="Blog | Lunova Services"
        description={BLOG_DESCRIPTION}
        jsonLd={buildBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <div className="bg-background text-foreground min-h-screen">
        <section
          className="relative pt-24 pb-16 px-4 sm:px-6 overflow-hidden"
          style={{ backgroundColor: CHROME.bg, borderBottom: `1px solid ${CHROME.border}` }}
        >
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color: BRAND.accent, backgroundColor: `${BRAND.accent}1f`, border: `1px solid ${BRAND.accent}40` }}
            >
              From the Lunova Team
            </span>
            <h1
              style={{ fontFamily: "var(--font-display)", color: CHROME.text }}
              className="text-4xl sm:text-6xl font-bold uppercase leading-tight mt-4 mb-3"
            >
              The Lunova <span style={{ color: BRAND.accent }}>Blog</span>
            </h1>
            <p className="text-base leading-relaxed max-w-lg mx-auto" style={{ color: CHROME.muted }}>
              {BLOG_DESCRIPTION}
            </p>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.imageAlt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2">{post.category}</span>
                  <h2 className="font-serif-display text-xl mb-2 text-foreground">{post.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> {formatDate(post.date)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} /> {post.readMinutes} min read
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
