import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, SimpleBarChart } from '../components'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import { questionDifficultyForQuiz, scoreDistributionForQuiz } from '../utils/analyticsDemoSeries'

type AnalyticsRangeId = '7d' | '30d' | 'all'

export default function QuizAnalytics() {
  const { t } = useTranslation()
  const ranges = useMemo(
    () =>
      [
        { id: '7d' as const, label: t('teacherTools.range7d') },
        { id: '30d' as const, label: t('teacherTools.range30d') },
        { id: 'all' as const, label: t('teacherTools.rangeAll') },
      ] satisfies { id: AnalyticsRangeId; label: string }[],
    [t],
  )
  const { quizId } = useParams()
  const { allQuizzes } = useTeacherToolsDemo()
  const quiz = useMemo(() => allQuizzes.find((q) => q.id === quizId), [allQuizzes, quizId])
  const [range, setRange] = useState<AnalyticsRangeId>('30d')

  const scorePoints = useMemo(
    () => (quiz ? scoreDistributionForQuiz(quiz, range) : []),
    [quiz, range]
  )
  const diffPoints = useMemo(() => (quiz ? questionDifficultyForQuiz(quiz) : []), [quiz])

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
        title={`${t('quiz.analytics.titlePrefix')} ${quiz.title}`}
        breadcrumbs={[
          { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
          { label: t('quiz.breadcrumb'), to: '/teacher-tools/quiz' },
          { label: quiz.title, to: `/teacher-tools/quiz/${quiz.id}` },
          { label: t('exam.detail.tabs.analytics') },
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
            <span className="font-semibold">{t('teacherTools.previewData')}</span>
            <span>{t('teacherTools.previewDataHint')}</span>
          </div>
          <SimpleBarChart
            title={t('quiz.analytics.chartScoreDistribution')}
            subtitle={t('quiz.analytics.submissionsSubtitle', {
              count: quiz.submissionCount,
              range: ranges.find((x) => x.id === range)?.label ?? '',
            })}
            points={scorePoints.map((p) => ({ ...p, max: p.max }))}
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
            <span className="font-semibold">{t('teacherTools.previewData')}</span>
            <span>{t('teacherTools.previewDataHint')}</span>
          </div>
          <SimpleBarChart title={t('quiz.analytics.chartQuestionDifficulty')} subtitle={t('quiz.analytics.chartSubtitleMissRate')} points={diffPoints} />
        </div>
      </div>

      <Link to={`/teacher-tools/quiz/${quiz.id}`} className="text-sm font-semibold text-primary-600">
        {t('teacherTools.backToQuiz')}
      </Link>
    </div>
  )
}
