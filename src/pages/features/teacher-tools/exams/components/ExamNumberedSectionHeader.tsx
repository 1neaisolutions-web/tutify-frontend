import type { ReactNode } from 'react'

const VARIANT_STYLES = {
  blue: {
    chip: 'bg-[#E6F1FB] text-[#0C447C]',
    bar: 'border-b border-[#E6F1FB] bg-gradient-to-r from-[#E6F1FB]/50 to-white',
  },
  purple: {
    chip: 'bg-[#EEEDFE] text-[#3C3489]',
    bar: 'border-b border-violet-100 bg-gradient-to-r from-[#EEEDFE]/60 to-white',
  },
  coral: {
    chip: 'bg-[#FAECE7] text-[#712B13]',
    bar: 'border-b border-orange-100 bg-gradient-to-r from-[#FAECE7]/55 to-white',
  },
  teal: {
    chip: 'bg-[#E1F5EE] text-[#085041]',
    bar: 'border-b border-teal-100 bg-gradient-to-r from-[#E1F5EE]/55 to-white',
  },
} as const

export type ExamSectionVariant = keyof typeof VARIANT_STYLES

export function ExamNumberedSectionHeader({
  step,
  kicker,
  title,
  subtitle,
  variant,
}: {
  step: number
  kicker: string
  title: string
  subtitle: string
  variant: ExamSectionVariant
}) {
  const v = VARIANT_STYLES[variant]
  return (
    <div className="flex gap-4 border-b border-gray-100 pb-4">
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold shadow-sm ${v.chip}`}
      >
        {step}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold uppercase tracking-wide text-gray-700">{kicker}</p>
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-600">{subtitle}</p>
      </div>
    </div>
  )
}

export function ExamSectionShell({
  variant,
  children,
  header,
}: {
  variant: ExamSectionVariant
  header: ReactNode
  children: ReactNode
}) {
  const v = VARIANT_STYLES[variant]
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className={`px-6 py-5 ${v.bar}`}>{header}</div>
      {children}
    </section>
  )
}
