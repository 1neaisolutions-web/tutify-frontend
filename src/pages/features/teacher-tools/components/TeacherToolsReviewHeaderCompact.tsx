import type { ReactNode } from 'react'

type Stat = { label: string; value: string | number }

type Props = {
  title?: string
  sourceTag?: string
  stats?: Stat[]
  actions?: ReactNode
}

export function TeacherToolsReviewHeaderCompact({
  title = 'Generated question set',
  sourceTag,
  stats = [],
  actions,
}: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-indigo-100 bg-indigo-50/40 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-indigo-700">Review</p>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {sourceTag ? <p className="truncate text-xs text-gray-500">{sourceTag}</p> : null}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {stats.map((s) => (
          <span
            key={s.label}
            className="rounded-md bg-white px-2 py-0.5 text-xs ring-1 ring-gray-100"
          >
            <span className="font-semibold text-gray-900">{s.value}</span>{' '}
            <span className="text-gray-500">{s.label}</span>
          </span>
        ))}
        {actions}
      </div>
    </div>
  )
}
