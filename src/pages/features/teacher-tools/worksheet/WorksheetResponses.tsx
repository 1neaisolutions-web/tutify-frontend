import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge, Phase2Section } from '../components'
import { demoStudents } from '../demo/teacherToolsDemoData'
import { useGetWorksheetQuery } from '../../../../redux/features/teacherTools/worksheet/worksheetApiSlice'

export default function WorksheetResponses() {
  const { t } = useTranslation()
  const { worksheetId } = useParams()
  const { data: w, isLoading, isError } = useGetWorksheetQuery(worksheetId ?? '', { skip: !worksheetId })

  if (isLoading && !w) {
    return <div className="p-6 text-sm text-gray-600">{t('common.loading')}</div>
  }

  if (isError || !w) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">{t('worksheet.detail.notFound')}</p>
        <Link to="/teacher-tools/worksheet" className="text-sm font-semibold text-primary-600">
          {t('worksheet.detail.backToList')}
        </Link>
      </div>
    )
  }

  const f = w.outputFormat

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`${t('worksheet.responses.titlePrefix')} ${w.title}`}
        breadcrumbs={[
          { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
          { label: t('worksheet.breadcrumb'), to: '/teacher-tools/worksheet' },
          { label: w.title, to: `/teacher-tools/worksheet/${w.id}` },
          { label: t('worksheet.detail.tabResponses') },
        ]}
      />
      <p className="text-sm text-gray-600">
        {f === 'printable_pdf'
          ? t('worksheet.responses.formatPrintableDesc')
          : f === 'both'
            ? t('worksheet.responses.formatHybridDesc')
            : t('worksheet.responses.formatDigitalDesc')}
      </p>
      <Phase2Section title={t('worksheet.responses.phase2Title')} footnote={t('worksheet.responses.phase2Footnote')}>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left">{t('quiz.submissions.colStudent')}</th>
                <th className="px-3 py-3 text-left">{t('teacherTools.status')}</th>
                <th className="px-3 py-3 text-left">{t('worksheet.responses.colTime')}</th>
                <th className="px-3 py-3 text-left">{t('quiz.submissions.colScore')}</th>
              </tr>
            </thead>
            <tbody>
              {demoStudents.slice(0, 5).map((s, i) => (
                <tr key={s.id} className="border-t border-gray-100">
                  <td className="px-3 py-3">{s.name}</td>
                  <td className="px-3 py-3">
                    <TeacherToolsStatusBadge kind="submission" value={i % 2 === 0 ? 'graded' : 'submitted'} />
                  </td>
                  <td className="px-3 py-3">{t('worksheet.responses.durationMinutes', { count: 12 + i })}</td>
                  <td className="px-3 py-3">
                    {f === 'interactive_digital' || f === 'both' ? `${80 + i}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Phase2Section>
      <Link to={`/teacher-tools/worksheet/${w.id}`} className="text-sm font-semibold text-primary-600">
        {t('teacherTools.back')}
      </Link>
    </div>
  )
}
