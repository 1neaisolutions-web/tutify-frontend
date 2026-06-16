import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  searchSlot?: ReactNode
  summarySlot?: ReactNode
  children: ReactNode
}

export function ScopeStepChrome({
  title,
  subtitle,
  searchSlot,
  summarySlot,
  children,
}: Props) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs text-gray-600">{subtitle}</p> : null}
      </div>
      {searchSlot ? <div>{searchSlot}</div> : null}
      <div className="space-y-4">{children}</div>
      {summarySlot ? <div>{summarySlot}</div> : null}
    </div>
  )
}
