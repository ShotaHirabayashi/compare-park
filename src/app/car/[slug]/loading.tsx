export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-4 w-4 rounded bg-muted" />
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-4 w-4 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>

      {/* Title */}
      <div className="mb-8">
        <div className="h-9 w-64 rounded bg-muted" />
        <div className="mt-2 h-5 w-40 rounded bg-muted" />
      </div>

      {/* Dimension cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="h-4 w-12 rounded bg-muted" />
            <div className="mt-2 h-7 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Parking match list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="h-6 w-16 rounded bg-muted" />
            </div>
            <div className="mt-2 h-4 w-64 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
