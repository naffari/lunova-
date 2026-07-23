import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export interface GalleryImage {
  src: string;
  alt: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  className?: string;
}

/**
 * Responsive image grid that opens a keyboard-navigable lightbox (built on
 * the existing Radix Dialog primitive) when a thumbnail is clicked. Images
 * lazy-load and the lightbox supports Left/Right arrow keys in addition to
 * on-screen prev/next controls.
 */
export default function PhotoGallery({ images, className = "" }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const showPrev = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") showPrev();
      else if (event.key === "ArrowRight") showNext();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, showPrev, showNext]);

  const active = activeIndex !== null ? images[activeIndex] : null;

  return (
    <>
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 ${className}`}>
        {images.map((image, idx) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`View larger image: ${image.alt}`}
            className="relative aspect-square overflow-hidden rounded-2xl group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Dialog open={activeIndex !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-4xl w-full sm:max-w-4xl p-3">
          <DialogTitle className="sr-only">{active?.alt ?? "Gallery image"}</DialogTitle>
          {active && (
            <div className="relative rounded-md overflow-hidden bg-black">
              <img
                src={active.src}
                alt={active.alt}
                className="w-full max-h-[75vh] object-contain"
              />
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrev}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
