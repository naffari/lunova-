/**
 * GENERATED FILE — do not edit by hand.
 * Written by scripts/optimize-images.mjs (`pnpm images`).
 *
 * Lists the work photos that actually exist in public/images/work/, keyed by
 * department. WorkGallery filters the declarations in serviceGallery.ts against
 * this, so naming a photo before its file lands hides the section instead of
 * rendering a broken image.
 */
export const WORK_MANIFEST: Record<string, string[]> = {

};

export function hasWorkPhoto(serviceKey: string, file: string): boolean {
  return WORK_MANIFEST[serviceKey]?.includes(file) ?? false;
}
