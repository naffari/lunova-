import { useCallback, useRef, useState } from "react";
import { ChevronsLeftRight } from "lucide-react";
import { BRAND } from "../../constants/brand";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** Handle + label accent color. Defaults to a neutral gold. */
  accentColor?: string;
  className?: string;
}

const STEP = 5;

/**
 * Draggable before/after image comparison slider. Supports mouse, touch
 * (via the Pointer Events API, which unifies both), and keyboard (arrow
 * keys, Home/End) for accessibility.
 */
export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt,
  afterAlt,
  beforeLabel = "Before",
  afterLabel = "After",
  accentColor = BRAND.primary,
  className = "",
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(50);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.min(100, Math.max(0, raw)));
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    updateFromClientX(event.clientX);
  }, [updateFromClientX]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(event.clientX);
  }, [updateFromClientX]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      setPercent((p) => Math.max(0, p - STEP));
    } else if (event.key === "ArrowRight") {
      setPercent((p) => Math.min(100, p + STEP));
    } else if (event.key === "Home") {
      setPercent(0);
    } else if (event.key === "End") {
      setPercent(100);
    } else {
      return;
    }
    event.preventDefault();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden touch-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* AFTER (base layer, always full width) */}
      <img src={afterImage} alt={afterAlt} className="absolute inset-0 w-full h-full object-cover pointer-events-none" draggable={false} loading="lazy" />
      <span className="absolute bottom-4 right-4 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white" style={{ backgroundColor: `${accentColor}` , color: '#1a1410'}}>
        {afterLabel}
      </span>

      {/* BEFORE (clipped to the left of the handle) */}
      <img
        src={beforeImage}
        alt={beforeAlt}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
        draggable={false}
        loading="lazy"
      />
      <span
        className="absolute bottom-4 left-4 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white bg-black/60"
        style={{ opacity: percent > 12 ? 1 : 0, transition: "opacity 0.15s ease" }}
      >
        {beforeLabel}
      </span>

      {/* Divider + drag handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 pointer-events-none"
        style={{ left: `${percent}%`, backgroundColor: "#ffffff" }}
      />
      <div
        role="slider"
        tabIndex={0}
        aria-label="Before and after image comparison slider"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className="absolute top-1/2 w-10 h-10 -mt-5 -ml-5 rounded-full flex items-center justify-center shadow-lg cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ left: `${percent}%`, backgroundColor: "#ffffff", color: "#1a1410" }}
      >
        <ChevronsLeftRight size={18} />
      </div>
    </div>
  );
}
