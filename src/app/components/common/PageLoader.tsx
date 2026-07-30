/** Full-page loading fallback shown while a lazy-loaded route chunk is fetched. */
export default function PageLoader() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="w-10 h-10 rounded-full border-4 border-primary/25 border-t-primary animate-spin" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
