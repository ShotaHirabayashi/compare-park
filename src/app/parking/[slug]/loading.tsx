export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-16 rounded bg-muted" />
        <div className="h-4 w-4 rounded bg-muted" />
        <div className="h-4 w-28 rounded bg-muted" />
      </div>

      {/* Title */}
      <div className="mb-8">
        <div className="h-9 w-72 rounded bg-muted" />
        <div className="mt-2 h-5 w-56 rounded bg-muted" />
      </div>

      {/* Info cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="mt-2 h-5 w-48 rounded bg-muted" />
        </div>
        <div className="rounded-lg border p-4">
          <div className="h-4 w-20 rounded bg-muted" />
          <div className="mt-2 h-5 w-32 rounded bg-muted" />
        </div>
      </div>

      {/* Restriction table skeleton */}
      <div className="rounded-lg border">
        <div className="border-b p-4">
          <div className="h-5 w-32 rounded bg-muted" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-b p-4 last:border-b-0">
            <div className="h-4 w-24 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
