import { withAlpha } from "../utils/color";
import { Link } from "react-router";
import { Camera } from "lucide-react";
import BeforeAfterSlider from "./common/BeforeAfterSlider";
import { getGallery } from "../constants/serviceGallery";

interface WorkGalleryProps {
  /** SERVICE_GALLERIES key, e.g. "power-washing". */
  serviceKey: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  /** Deep link for the section's CTA. */
  bookTo: string;
}

const WORK_PATH = "/images/work";

/**
 * "What done looks like" — the real-work section on each service page.
 *
 * Renders nothing when the department has no photography yet, rather than
 * showing an empty state or padding it out with stock: an absent section costs
 * less trust than a section that promises evidence and delivers filler.
 *
 * When `own` is false the heading and blurb come from the manifest already
 * worded as reference imagery, and an explicit note is rendered. That note is
 * not decoration — it is what keeps the section honest while real photos are
 * still being collected.
 */
export default function WorkGallery({
  serviceKey,
  primaryColor,
  accentColor,
  bgColor,
  bookTo,
}: WorkGalleryProps) {
  const gallery = getGallery(serviceKey);
  if (!gallery) return null;

  const dir = `${WORK_PATH}/${serviceKey}`;
  const single = gallery.photos.length === 1 && !gallery.beforeAfter;

  return (
    <section
      className="py-20 px-4 sm:px-6"
      style={{
        backgroundColor: bgColor,
        borderTop: `1px solid ${withAlpha(primaryColor, 0.082)}`,
        borderBottom: `1px solid ${withAlpha(primaryColor, 0.082)}`,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-10">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: primaryColor }}
          >
            <span className="w-6 h-0.5" style={{ backgroundColor: accentColor }} />
            <span>{gallery.own ? "Our Work" : "The Standard"}</span>
          </div>
          <h2 className="font-serif-display text-4xl sm:text-5xl mb-3" style={{ color: primaryColor }}>
            {gallery.heading}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: withAlpha(primaryColor, 0.69) }}>
            {gallery.blurb}
          </p>
        </div>

        {gallery.beforeAfter && (
          <BeforeAfterSlider
            className="rounded-3xl h-[340px] sm:h-[480px] shadow-2xl border-4 border-[var(--card)] mb-8"
            beforeImage={`${dir}/${gallery.beforeAfter.before}-1280.jpg`}
            afterImage={`${dir}/${gallery.beforeAfter.after}-1280.jpg`}
            beforeAlt={gallery.beforeAfter.beforeAlt}
            afterAlt={gallery.beforeAfter.afterAlt}
            accentColor={accentColor}
          />
        )}

        {gallery.photos.length > 0 && (
          <div className={`grid gap-6 ${single ? "" : "sm:grid-cols-2"}`}>
            {gallery.photos.map((photo) => (
              <figure key={photo.file} className="group">
                <div
                  className="relative overflow-hidden rounded-3xl shadow-lg aspect-[4/3]"
                  style={{ border: `4px solid #ffffff` }}
                >
                  <picture>
                    <source
                      type="image/avif"
                      sizes={single ? "100vw" : "(min-width: 640px) 50vw, 100vw"}
                      srcSet={`${dir}/${photo.file}-640.avif 640w, ${dir}/${photo.file}-1280.avif 1280w`}
                    />
                    <source
                      type="image/webp"
                      sizes={single ? "100vw" : "(min-width: 640px) 50vw, 100vw"}
                      srcSet={`${dir}/${photo.file}-640.webp 640w, ${dir}/${photo.file}-1280.webp 1280w`}
                    />
                    <img
                      src={`${dir}/${photo.file}-1280.jpg`}
                      alt={photo.alt}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                </div>
                {photo.caption && (
                  <figcaption
                    className="mt-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
                    style={{ color: withAlpha(primaryColor, 0.6) }}
                  >
                    <span className="w-4 h-0.5" style={{ backgroundColor: accentColor }} />
                    {photo.caption}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}

        <div className="mt-9 flex flex-wrap items-center gap-5">
          <Link
            to={bookTo}
            className="inline-block font-bold py-3 px-8 rounded-full text-sm text-white"
            style={{ backgroundColor: accentColor, color: primaryColor }}
          >
            Get this done at your place →
          </Link>
          {!gallery.own && (
            <p
              className="flex items-center gap-1.5 text-xs"
              style={{ color: withAlpha(primaryColor, 0.5) }}
            >
              <Camera size={13} />
              Reference photography, not a completed Lunova job.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
