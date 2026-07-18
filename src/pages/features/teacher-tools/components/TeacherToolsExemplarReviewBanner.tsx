import { Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function TeacherToolsExemplarReviewBanner() {
  const { t } = useTranslation()
  return (
    <div
      role="status"
      className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950"
    >
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden />
      <div>
        <p className="font-semibold">{t('teacherTools.exemplarTitle')}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-amber-900/90">
          {t('teacherTools.exemplarBody', {
            editRequirements: t('teacherTools.editRequirements'),
          })}
        </p>
      </div>
    </div>
  )
}
