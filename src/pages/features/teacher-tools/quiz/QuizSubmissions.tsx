import { useMemo, useState } from 'react'
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
        <p className="text-sm text-gray-700">Quiz not found.</p>
        <Link to="/teacher-tools/quiz" className="text-sm font-semibold text-primary-600">
          ← Back to quizzes
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`Submissions · ${quiz.title}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Quiz', to: '/teacher-tools/quiz' },
          { label: quiz.title, to: `/teacher-tools/quiz/${quiz.id}` },
          { label: 'Submissions' },
        ]}
      />

      <Phase2Section title="Student submissions view" footnote="Bulk actions, exports, and SIS sync unlock in Phase 2.">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">Student</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">Class</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">Submitted</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-3 py-3 text-left font-semibold text-gray-700">Score</th>
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
                    Review
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
        title={active ? `Review · ${active.studentName}` : 'Review'}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
              onClick={() => {
                toast.success('Feedback saved')
                setOpen(false)
              }}
            >
              Save feedback
            </button>
          </div>
        }
      >
        {active && (
          <div className="space-y-3 text-sm text-gray-700">
            <p>Attempt: {active.attempt}</p>
            <p>Time spent: {active.timeSpentMinutes} min</p>
            <label className="block">
              Comments
              <textarea className="mt-1 w-full rounded-xl border px-3 py-2" rows={4} />
            </label>
          </div>
        )}
      </TeacherToolsSideReviewDrawer>

      <Link to={`/teacher-tools/quiz/${quiz.id}`} className="text-sm font-semibold text-primary-600">
        ← Back to quiz
      </Link>
    </div>
  )
}
