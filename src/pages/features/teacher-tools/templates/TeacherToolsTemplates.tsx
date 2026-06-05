import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FileText, Star } from 'lucide-react'
import { TeacherToolsPageHeader, TableSkeletonRows } from '../components'
import { useDemoAsync } from '../hooks/useDemoAsync'
import { demoTemplates } from '../demo/teacherToolsDemoData'
import { templateCreatePath, templatePrefillSearchParams } from '../utils/templateNavigate'
import type { ToolType } from '../types'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

const tabs: Array<'all' | ToolType> = ['all', 'quiz', 'assignment', 'worksheet', 'exam']

export default function TeacherToolsTemplates() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { toast } = useSnackbar()
  const [tab, setTab] = useState<(typeof tabs)[number]>('all')
  const loader = useMemo(() => async () => demoTemplates, [])
  const { state } = useDemoAsync(loader, { delayMs: 280 })

  const filtered = demoTemplates.filter((t) => tab === 'all' || t.toolType === tab)

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={t('teacherTools.templates.title')}
        subtitle={t('teacherTools.templates.subtitle')}
        breadcrumbs={[{ label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' }, { label: t('teacherTools.breadcrumbTemplates') }]}
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${
              tab === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t === 'all' ? 'All' : t}
          </button>
        ))}
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {demoTemplates
          .filter((x) => x.isFeatured)
          .map((x) => (
            <div key={x.id} className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm shadow-sm">
              <div className="flex items-center gap-2 text-amber-900">
                <Star className="h-4 w-4" /> Featured
              </div>
              <p className="mt-2 font-semibold text-gray-900">{x.name}</p>
              <p className="mt-1 text-gray-600">{x.summary}</p>
            </div>
          ))}
      </section>

      {state === 'loading' && <TableSkeletonRows rows={4} />}
      {state === 'success' && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">{t('teacherTools.colTemplate')}</th>
                <th className="px-3 py-3 text-left">{t('teacherTools.colTool')}</th>
                <th className="px-3 py-3 text-left">{t('teacherTools.subject')}</th>
                <th className="px-3 py-3 text-left">{t('teacherTools.colLastUsed')}</th>
                <th className="px-3 py-3 text-left">{t('teacherTools.colActions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-3 font-medium">
                    <span className="inline-flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary-500" />
                      {t.name}
                    </span>
                  </td>
                  <td className="px-3 py-3 capitalize">{t.toolType}</td>
                  <td className="px-3 py-3">{t.subject}</td>
                  <td className="px-3 py-3">{t.lastUsedAt}</td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      className="mr-2 text-primary-600 font-semibold"
                      onClick={() => {
                        const path = `${templateCreatePath(t.toolType)}?${templatePrefillSearchParams(t)}`
                        navigate(path)
                        toast.success(t('teacherTools.templates.toastOpenedTemplate'))
                      }}
                    >
                      Use
                    </button>
                    <button
                      type="button"
                      className="text-gray-600"
                      onClick={() => {
                        const path = `${templateCreatePath(t.toolType)}?${templatePrefillSearchParams(t, { duplicate: true })}`
                        navigate(path)
                        toast.success(t('teacherTools.templates.toastOpenedCopy'))
                      }}
                    >
                      Duplicate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
