/**
 * The scrolling capability ticker that sits under every service hero.
 *
 * This markup was copy-pasted across all ten pages — the same flex row, the same
 * 20s timing, the same ✦ separator — with only the item list and text color
 * changing. Same precedent as StatBand.
 *
 * TWO THINGS THIS FIXES BEYOND THE DUPLICATION:
 *
 * 1. The `marquee` keyframe (src/styles/theme.css) translates by -50%, which
 *    only loops seamlessly if the track holds exactly two copies of the list.
 *    Every page satisfied that by writing its items out twice, by hand, in the
 *    source — so a page that ever edited one copy and not the other would have
 *    produced a visible jump at the loop point. The doubling belongs to the
 *    animation, so it lives here, and callers pass their list once.
 *
 * 2. The strip is decorative: it repeats capabilities already stated in the
 *    hero, the package grid, and the stat band. Rendered as plain text it made
 *    a screen reader announce all of them twice over, thanks to the doubling
 *    above. `aria-hidden` keeps it visual-only, which is all it ever was.
 *
 * Motion preference is handled globally by the prefers-reduced-motion block in
 * theme.css, which parks the animation on its first frame.
 */

interface MarqueeProps {
  /** The list, written ONCE. This component handles the loop doubling. */
  items: string[];
  backgroundColor: string;
  /** Text on the strip. Pass whichever of ink/white reads against the band. */
  textColor: string;
}

export default function Marquee({ items, backgroundColor, textColor }: MarqueeProps) {
  const track = [...items, ...items];

  return (
    <div aria-hidden="true" style={{ backgroundColor, overflow: "hidden" }} className="py-3">
      <div
        style={{
          display: "flex",
          gap: "3rem",
          whiteSpace: "nowrap",
          animation: "marquee 20s linear infinite",
          width: "max-content",
        }}
      >
        {track.map((item, i) => (
          <span key={i} className="text-xs font-bold uppercase tracking-widest" style={{ color: textColor }}>
            ✦ {item}
          </span>
        ))}
      </div>
    </div>
  );
}
