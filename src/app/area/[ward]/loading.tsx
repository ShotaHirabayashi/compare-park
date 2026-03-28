export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-4 w-4 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>

      {/* Title */}
      <div className="mb-8">
        <div className="h-9 w-56 rounded bg-muted" />
        <div className="mt-2 h-5 w-40 rounded bg-muted" />
      </div>

      {/* Parking list skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="h-5 w-40 rounded bg-muted" />
            <div className="mt-2 h-4 w-56 rounded bg-muted" />
            <div className="mt-2 h-4 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
