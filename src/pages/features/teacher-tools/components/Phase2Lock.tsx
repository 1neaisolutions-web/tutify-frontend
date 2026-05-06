import type { ReactNode } from 'react'

export function Phase2Badge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${className}`}
    >
      Phase 2
    </span>
  )
}

/** Use on disabled controls; provides hover/focus hint for Phase 2 gating. */
export function LockedTooltip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex cursor-not-allowed ${className}`} tabIndex={0} title="Available in Phase 2">
      {children}
    </span>
  )
}

export function Phase2Section({
  title,
  footnote = 'Live roster sync, student release rules, and SIS integration ship in Phase 2.',
  children,
}: {
  title?: string
  footnote?: string
  children: ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/80 to-white p-5 shadow-inner">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Phase2Badge />
        {title ? <h4 className="text-sm font-semibold text-gray-900">{title}</h4> : null}
      </div>
      <div className="pointer-events-none select-none opacity-55">{children}</div>
      <div
        className="pointer-events-auto absolute inset-0 cursor-not-allowed bg-white/35 backdrop-blur-[0.5px]"
        role="presentation"
        title="This workflow is locked until Phase 2."
      />
      <p className="pointer-events-none absolute bottom-3 left-4 right-4 text-center text-xs leading-snug text-indigo-900/90">{footnote}</p>
    </div>
  )
}
