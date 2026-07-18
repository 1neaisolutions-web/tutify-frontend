import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import {
  TeacherToolsPageHeader,
  TeacherToolsSideReviewDrawer,
  TeacherToolsStatusBadge,
  Phase2Section,
} from '../components'
import { demoSubmissions } from '../demo/teacherToolsDemoData'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

export default function QuizSubmissions() {
  const { t } = useTranslation()
  const { quizId } = useParams()
  const { toast } = useSnackbar()
  const { allQuizzes } = useTeacherToolsDemo()
  const quiz = useMemo(() => allQuizzes.find((q) => q.id === quizId), [allQuizzes, quizId])
  const rows = useMemo(
    () =>
      quiz ? demoSubmissions.filter((s) => s.toolType === 'quiz' && s.contentId === quiz.id) : [],
    [quiz]
  )
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<(typeof rows)[0] | null>(null)

  if (!quiz) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">{t('quiz.detail.notFound')}</p>
        <Link to="/teacher-tools/quiz" className="text-sm font-semibold text-primary-600">
          {t('teacherTools.backToQuizzes')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`${t('quiz.submissions.titlePrefix')} ${quiz.title}`}
        breadcrumbs={[
          { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
          { label: t('quiz.breadcrumb'), to: '/teacher-tools/quiz' },
          { label: quiz.title, to: `/teacher-tools/quiz/${quiz.id}` },
          { label: t('quiz.detail.statSubmissions') },
        ]}
      />

      <Phase2Section title={t('quiz.submissions.phase2Title')} footnote={t('quiz.submissions.phase2Footnote')}>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('quiz.submissions.colStudent')}</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('quiz.submissions.colClass')}</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('quiz.submissions.colSubmitted')}</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('teacherTools.status')}</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">{t('quiz.submissions.colScore')}</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-3 py-3 font-medium text-gray-900">{r.studentName}</td>
                <td className="px-3 py-3 text-gray-600">{r.classKey}</td>
                <td className="px-3 py-3 text-gray-600">{r.submittedAt ?? '—'}</td>
                <td className="px-3 py-3">
                  <TeacherToolsStatusBadge kind="submission" value={r.status} />
                </td>
                <td className="px-3 py-3">
                  {r.score}/{r.totalMarks}
                </td>
                <td className="px-3 py-3 text-right">
                  <button
                    type="button"
                    className="text-primary-600 text-sm font-semibold"
                    onClick={() => {
                      setActive(r)
                      setOpen(true)
                    }}
                  >
                    {t('quiz.submissions.reviewButton')}
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
          active
            ? t('quiz.submissions.reviewTitleStudent', { name: active.studentName })
            : t('quiz.submissions.reviewTitle')
        }
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => {
                toast.success(t('quiz.submissions.toastFeedbackSaved'))
                setOpen(false)
              }}
            >
              {t('quiz.submissions.saveFeedback')}
            </button>
          </div>
        }
      >
        {active && (
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              {t('quiz.submissions.attemptLabel')} {active.attempt}
            </p>
            <p>
              {t('quiz.submissions.timeSpent')} {active.timeSpentMinutes} min
            </p>
            <label className="block">
              {t('teacherTools.comments')}
              <textarea className="mt-1 w-full rounded-xl border px-3 py-2" rows={4} />
            </label>
          </div>
        )}
      </TeacherToolsSideReviewDrawer>

      <Link to={`/teacher-tools/quiz/${quiz.id}`} className="text-sm font-semibold text-primary-600">
        {t('teacherTools.backToQuiz')}
      </Link>
    </div>
  )
}
