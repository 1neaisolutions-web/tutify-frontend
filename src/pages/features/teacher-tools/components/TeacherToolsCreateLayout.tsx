import type { ReactNode } from 'react'

type Props = {
  /** Page title row + configure steppers */
  header: ReactNode
  /** Always-visible action bar (wizard next/back, exit to list, etc.) */
  footer: ReactNode
  children: ReactNode
}

/**
 * Create-flow shell: top navigation and bottom actions stay visible;
 * only the middle section scrolls.
 */
export function TeacherToolsCreateLayout({ header, footer, children }: Props) {
  return (
    <div className="flex min-h-[calc(100dvh-6.25rem)] max-h-[calc(100dvh-6.25rem)] flex-col">
      <div className="shrink-0 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">{header}</div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      <div className="shrink-0 border-t border-gray-200 bg-white/95 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur-sm">
        {footer}
      </div>
    </div>
  )
}
