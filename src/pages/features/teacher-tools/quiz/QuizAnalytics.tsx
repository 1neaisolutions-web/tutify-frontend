import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, SimpleBarChart } from '../components'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import { questionDifficultyForQuiz, scoreDistributionForQuiz } from '../utils/analyticsDemoSeries'

const ranges = [
  { id: '7d' as const, label: 'Last 7 days' },
  { id: '30d' as const, label: 'Last 30 days' },
  { id: 'all' as const, label: 'All time' },
]

export default function QuizAnalytics() {
  const { quizId } = useParams()
  const { allQuizzes } = useTeacherToolsDemo()
  const quiz = useMemo(() => allQuizzes.find((q) => q.id === quizId), [allQuizzes, quizId])
  const [range, setRange] = useState<(typeof ranges)[number]['id']>('30d')

  const scorePoints = useMemo(
    () => (quiz ? scoreDistributionForQuiz(quiz, range) : []),
    [quiz, range]
  )
  const diffPoints = useMemo(() => (quiz ? questionDifficultyForQuiz(quiz) : []), [quiz])

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
        title={`Analytics · ${quiz.title}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Quiz', to: '/teacher-tools/quiz' },
          { label: quiz.title, to: `/teacher-tools/quiz/${quiz.id}` },
          { label: 'Analytics' },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {ranges.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRange(r.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              range === r.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
            <span className="font-semibold">Preview data</span>
            <span>— Real results will appear here after students submit.</span>
          </div>
          <SimpleBarChart
            title="Score distribution"
            subtitle={`${quiz.submissionCount} submissions · ${ranges.find((x) => x.id === range)?.label}`}
            points={scorePoints.map((p) => ({ ...p, max: p.max }))}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
            <span className="font-semibold">Preview data</span>
            <span>— Real results will appear here after students submit.</span>
          </div>
          <SimpleBarChart title="Question difficulty" subtitle="Miss rate %" points={diffPoints} />
        </div>
      </div>

      <Link to={`/teacher-tools/quiz/${quiz.id}`} className="text-sm font-semibold text-primary-600">
        ← Back to quiz
      </Link>
    </div>
  )
}
