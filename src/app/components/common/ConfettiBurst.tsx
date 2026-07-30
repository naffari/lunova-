import { useEffect, useRef } from "react";

/**
 * A one-shot confetti burst, fired once on mount.
 *
 * Hand-rolled on canvas rather than pulling in a library (react-rewards etc.)
 * for what's ~40 lines of physics — one dependency avoided for a single
 * moment in the app. Respects `prefers-reduced-motion`: renders nothing and
 * fires no animation frame at all when the user has that set, rather than
 * degrading to a static confetti image (the honest reduced-motion behaviour
 * for a celebratory effect is "don't", not "show it anyway but frozen").
 *
 * Positioned fixed and pointer-events-none — it's a moment, not a UI element.
 */
export default function ConfettiBurst({ colors }: { colors: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    // Narrowed to a non-null local: TS can't carry the `!ctx` guard above
    // into the requestAnimationFrame closure below, since it can't prove the
    // ref's value doesn't change between the check and the callback running.
    const ctx = context;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const COUNT = 90;
    const particles = Array.from({ length: COUNT }, () => ({
      x: width / 2 + (Math.random() - 0.5) * 120,
      y: height * 0.35,
      vx: (Math.random() - 0.5) * 11,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.3,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));

    const gravity = 0.32;
    const drag = 0.988;
    let frame: number;
    const start = performance.now();
    const DURATION = 2200;

    function tick(now: number) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.vx *= drag;
        p.vy = p.vy * drag + gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;

        const fade = Math.max(0, 1 - elapsed / DURATION);
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed < DURATION) {
        frame = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [colors]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[70] pointer-events-none"
      style={{ width: "100vw", height: "100vh" }}
    />
  );
}
