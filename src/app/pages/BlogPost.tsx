import { Link, useParams } from "react-router";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { getBlogPostBySlug } from "../constants/blog";
import Seo from "../components/common/Seo";
import ContactStrip from "../components/common/ContactStrip";
import { buildArticleSchema, buildBreadcrumbSchema } from "../utils/structuredData";
import { BRAND, CHROME } from "../constants/brand";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <>
        <Seo title="Post Not Found | Lunova Services" description="This blog post could not be found." noIndex />
        <div className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="font-serif-display text-4xl mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            The article you're looking for doesn't exist or may have been moved.
          </p>
          <Link to="/blog" className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full text-sm bg-primary text-primary-foreground">
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo
        title={`${post.title} | Lunova Services`}
        description={post.excerpt}
        image={post.image}
        type="article"
        jsonLd={[
          buildArticleSchema({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            datePublished: post.date,
            image: post.image,
          }),
          buildBreadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />
      <div className="bg-background text-foreground min-h-screen">
        <section
          className="relative pt-24 pb-10 px-4 sm:px-6 overflow-hidden"
          style={{ backgroundColor: CHROME.bg, borderBottom: `1px solid ${CHROME.border}` }}
        >
          <div className="relative z-10 max-w-3xl mx-auto">
            <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: CHROME.muted }}>
              <ArrowLeft size={14} /> Back to Blog
            </Link>
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color: BRAND.accent, backgroundColor: `${BRAND.accent}1f`, border: `1px solid ${BRAND.accent}40` }}
            >
              {post.category}
            </span>
            <h1 style={{ fontFamily: "var(--font-display)", color: CHROME.text }} className="text-3xl sm:text-5xl font-bold leading-tight mt-4 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-xs" style={{ color: CHROME.muted }}>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> {formatDate(post.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} /> {post.readMinutes} min read
              </span>
            </div>
          </div>
        </section>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
            <img src={post.image} alt={post.imageAlt} className="w-full h-[320px] sm:h-[420px] object-cover" loading="lazy" />
          </div>
          <div className="space-y-6">
            {post.body.map((paragraph, idx) => (
              <p key={idx} className="text-base leading-relaxed text-foreground/90">
                {paragraph}
              </p>
            ))}
          </div>
        </article>

        <ContactStrip
          heading="Ready to Get Some Time Back?"
          subtext="Book a Lunova crew for cleaning, lawn care, or junk removal and let us handle the work."
          primaryColor="#14304A"
          accentColor="#E8A830"
          ctaLabel="Book a Service"
          ctaTo="/book"
        />
      </div>
    </>
  );
}
