import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

export type TeacherToolsFieldBandVariant = 'student' | 'library' | 'ai'

const VARIANT_STYLES: Record<
  TeacherToolsFieldBandVariant,
  { border: string; kicker: string }
> = {
  student: {
    border: 'border-l-sky-500',
    kicker: 'text-sky-700',
  },
  library: {
    border: 'border-l-gray-400',
    kicker: 'text-gray-600',
  },
  ai: {
    border: 'border-l-violet-500',
    kicker: 'text-violet-700',
  },
}

const TITLE_KEYS: Record<TeacherToolsFieldBandVariant, string> = {
  student: 'teacherTools.fieldBands.student.title',
  library: 'teacherTools.fieldBands.library.title',
  ai: 'teacherTools.fieldBands.ai.title',
}

const DESCRIPTION_KEYS: Record<TeacherToolsFieldBandVariant, string> = {
  student: 'teacherTools.fieldBands.student.description',
  library: 'teacherTools.fieldBands.library.description',
  ai: 'teacherTools.fieldBands.ai.description',
}

type Props = {
  variant: TeacherToolsFieldBandVariant
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function TeacherToolsFieldBand({
  variant,
  title,
  description,
  children,
  className = '',
}: Props) {
  const { t } = useTranslation()
  const styles = VARIANT_STYLES[variant]
  const resolvedTitle = title ?? t(TITLE_KEYS[variant])
  const resolvedDescription = description ?? t(DESCRIPTION_KEYS[variant])

  return (
    <div
      className={`rounded-xl border border-gray-100 border-l-[3px] bg-gray-50/60 p-4 space-y-4 ${styles.border} ${className}`}
    >
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wide ${styles.kicker}`}>
          {resolvedTitle}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">{resolvedDescription}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
