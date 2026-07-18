import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsSideReviewDrawer, TeacherToolsStatusBadge, Phase2Section } from '../components'
import { demoSubmissions } from '../demo/teacherToolsDemoData'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

export default function AssignmentSubmissions() {
  const { t } = useTranslation()
  const { assignmentId } = useParams()
  const { toast } = useSnackbar()
  const { allAssignments } = useTeacherToolsDemo()
  const a = useMemo(() => allAssignments.find((x) => x.id === assignmentId), [allAssignments, assignmentId])
  const rows = a ? demoSubmissions.filter((s) => s.toolType === 'assignment' && s.contentId === a.id) : []
  const [open, setOpen] = useState(false)
  const [sel, setSel] = useState<typeof rows[0] | null>(null)

  if (!a) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">{t('assignment.detail.notFound')}</p>
        <Link to="/teacher-tools/assignment" className="text-sm font-semibold text-primary-600">
          {t('assignment.detail.backToList')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`${t('assignment.submissions.titlePrefix')} ${a.title}`}
        breadcrumbs={[
          { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
          { label: t('assignment.breadcrumb'), to: '/teacher-tools/assignment' },
          { label: a.title, to: `/teacher-tools/assignment/${a.id}` },
          { label: t('quiz.detail.statSubmissions') },
        ]}
      />
      <Phase2Section title={t('assignment.submissions.phase2Title')} footnote={t('assignment.submissions.phase2Footnote')}>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left">{t('quiz.submissions.colStudent')}</th>
              <th className="px-3 py-3 text-left">{t('teacherTools.status')}</th>
              <th className="px-3 py-3 text-left">{t('quiz.submissions.colScore')}</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-gray-100">
                <td className="px-3 py-3 font-medium">{r.studentName}</td>
                <td className="px-3 py-3">
                  <TeacherToolsStatusBadge kind="submission" value={r.status} />
                </td>
                <td className="px-3 py-3">{r.score ?? '—'}</td>
                <td className="px-3 py-3 text-right">
                  <button type="button" className="text-primary-600 font-semibold" onClick={() => { setSel(r); setOpen(true) }}>
                    {t('assignment.submissions.gradeButton')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Phase2Section>
      <TeacherToolsSideReviewDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={
          sel
            ? t('assignment.submissions.gradeTitleStudent', { name: sel.studentName })
            : t('assignment.submissions.gradeTitle')
        }
        footer={
          <button
            type="button"
            className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => { toast.success(t('assignment.submissions.toastGraded')); setOpen(false) }}
          >
            {t('assignment.submissions.saveGrade')}
          </button>
        }
      >
        {sel && (
          <div className="space-y-2 text-sm">
            <p>{t('assignment.submissions.rubricPreview')}</p>
            <label className="block">
              {t('assignment.submissions.feedbackLabel')}
              <textarea rows={4} className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
          </div>
        )}
      </TeacherToolsSideReviewDrawer>
      <Link to={`/teacher-tools/assignment/${a.id}`} className="text-sm font-semibold text-primary-600">
        {t('common.back')}
      </Link>
    </div>
  )
}
