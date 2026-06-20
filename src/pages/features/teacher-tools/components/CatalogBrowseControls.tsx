import { useTranslation } from 'react-i18next'
import { subjectToTeacherToolsLabel } from '@/catalog/adapters/subjectAdapters'
import { gradeToLabel } from '@/catalog/adapters/gradeAdapters'

type Props = {
  subject: string
  grade: string
  browseAllCatalog: boolean
  onBrowseAllChange: (value: boolean) => void
}

export function CatalogBrowseControls({
  subject,
  grade,
  browseAllCatalog,
  onBrowseAllChange,
}: Props) {
  const { t } = useTranslation()
  const subjectLabel = subjectToTeacherToolsLabel(subject)
  const gradeLabel = gradeToLabel(grade)

  return (
    <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3">
      {!browseAllCatalog ? (
        <p className="text-xs font-medium text-gray-600">
          {t('teacherTools.catalogFilterSummary', {
            subject: subjectLabel,
            grade: gradeLabel,
          })}
        </p>
      ) : (
        <p className="text-xs font-medium text-emerald-800">
          {t('teacherTools.browseAllCatalogActive', {
            subject: subjectLabel,
            grade: gradeLabel,
          })}
        </p>
      )}
      <label className="inline-flex items-start gap-3 text-sm text-gray-800">
        <input
          type="checkbox"
          checked={browseAllCatalog}
          onChange={(e) => onBrowseAllChange(e.target.checked)}
          className="mt-0.5 rounded border-gray-300"
        />
        <span>
          <span className="block font-semibold text-gray-900">{t('teacherTools.browseAllCatalog')}</span>
          <span className="mt-0.5 block text-xs text-gray-600">{t('teacherTools.browseAllCatalogHint')}</span>
        </span>
      </label>
    </div>
  )
}
