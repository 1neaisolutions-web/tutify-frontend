export function SkeletonLine({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
}

export function TableSkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-2 rounded-2xl border border-gray-200 bg-white p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <SkeletonLine className="h-4 w-8" />
          <SkeletonLine className="h-4 flex-1" />
          <SkeletonLine className="h-4 w-24" />
          <SkeletonLine className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export function CardGridSkeleton({ n = 6 }: { n?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <SkeletonLine className="mb-3 h-5 w-2/3" />
          <SkeletonLine className="mb-2 h-3 w-full" />
          <SkeletonLine className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  const heights = ['h-16', 'h-24', 'h-20', 'h-32', 'h-28', 'h-36', 'h-22', 'h-30']
  return (
    <div className="flex h-48 items-end justify-between gap-2 rounded-2xl border border-gray-200 bg-white p-4">
      {heights.map((h, i) => (
        <SkeletonLine key={i} className={`w-full ${h}`} />
      ))}
    </div>
  )
}
