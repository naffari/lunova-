import { useEffect, useRef, useState } from "react";
import type { ReactNode, Ref } from "react";

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  /** Additional delay before the fade/slide starts, in milliseconds. */
  delay?: number;
  /** Element type to render as. Defaults to "div". */
  as?: "div" | "section";
}

/**
 * Wraps content in a fade + slide-up reveal that triggers once the element
 * scrolls into view, using IntersectionObserver. Falls back to always-visible
 * for users with `prefers-reduced-motion` and unmounts the observer after the
 * first reveal (one-shot, not a repeating scroll gimmick).
 */
export default function FadeInSection({
  children,
  className = "",
  delay = 0,
  as = "div",
}: FadeInSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  // Both "div" and "section" accept a plain HTMLElement ref at runtime; the
  // cast below just satisfies JSX.IntrinsicElements' per-tag ref typing.
  const tagRef = ref as Ref<HTMLDivElement & HTMLElement>;

  return (
    <Tag
      ref={tagRef}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
