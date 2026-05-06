interface BarPoint {
  label: string
  value: number
  max: number
  colorClass?: string
}

export function SimpleBarChart({ title, subtitle, points }: { title: string; subtitle?: string; points: BarPoint[] }) {
  const max = Math.max(...points.map((p) => p.value), 1)
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div className="flex items-end justify-between gap-2">
        {points.map((p) => (
          <div key={p.label} className="flex flex-1 flex-col items-center gap-2">
            <div
              className={`w-full rounded-t-lg transition ${p.colorClass ?? 'bg-indigo-500'}`}
              style={{ height: `${(p.value / max) * 120}px` }}
            />
            <p className="text-center text-[10px] font-semibold text-gray-500">{p.label}</p>
            <p className="text-xs text-gray-400">{p.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
