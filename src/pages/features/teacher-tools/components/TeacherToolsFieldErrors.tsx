import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
  errors: string[]
  className?: string
}

export function TeacherToolsFieldErrors({ errors, className = '' }: Props) {
  const { t } = useTranslation()
  if (!errors.length) return null
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 ${className}`}
      role="alert"
      aria-label={t('teacherTools.validation.alertLabel')}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
      <ul className="space-y-1 text-sm text-amber-900">
        {errors.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </div>
  )
}
