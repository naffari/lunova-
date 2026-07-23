/** Full-page loading fallback shown while a lazy-loaded route chunk is fetched. */
export default function PageLoader() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div
        className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: "rgba(200,150,14,0.25)", borderTopColor: "#c8960e" }}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
