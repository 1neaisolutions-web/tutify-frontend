import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge } from '../components'
import { LockedTooltip, Phase2Badge, Phase2Section } from '../components/Phase2Lock'
import { TEACHER_TOOLS_SEED_QUIZ_IDS } from '../demo/teacherToolsDemoData'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import { downloadQuizPdf } from '../utils/generateQuizPdf'
import { DEFAULT_HANDOUT_LAYOUT, type HandoutLayoutOpts } from './config/handoutLayoutConfig'
import { QuizPrintPreviewModal, type QuizPrintMeta } from './components/QuizPrintPreviewModal'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

const tabs = ['Overview', 'Questions', 'Submissions', 'Analytics', 'Settings'] as const

const TAB_I18N: Record<(typeof tabs)[number], string> = {
  Overview: 'quiz.detail.tabs.overview',
  Questions: 'quiz.detail.tabs.questions',
  Submissions: 'quiz.detail.tabs.submissions',
  Analytics: 'quiz.detail.tabs.analytics',
  Settings: 'quiz.detail.tabs.settings',
}

function fmtDate(v: string | undefined, notScheduled: string) {
  if (!v) return notScheduled
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function QuizDetail() {
  const { t } = useTranslation()
  const { quizId } = useParams()
  const navigate = useNavigate()
  const { toast } = useSnackbar()
  const { api, allQuizzes } = useTeacherToolsDemo()
  const quiz = useMemo(() => allQuizzes.find((q) => q.id === quizId), [allQuizzes, quizId])
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')
  const [printOpen, setPrintOpen] = useState(false)

  const goEdit = async () => {
    if (!quizId) return
    if (TEACHER_TOOLS_SEED_QUIZ_IDS.has(quizId)) {
      const r = await api.duplicateQuiz(quizId)
      if (r.ok && 'id' in r && r.id) {
        toast.success(t('teacherTools.toastEditableCopy'))
        navigate(`/teacher-tools/quiz/${r.id}/edit`)
        return
      }
      toast.error(t('teacherTools.toastCopyFailed'))
      return
    }
    navigate(`/teacher-tools/quiz/${quizId}/edit`)
  }

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

  const printMeta: QuizPrintMeta = {
    title: quiz.title,
    subject: quiz.subject,
    grade: quiz.grade,
    timeLimitMinutes: quiz.timeLimitMinutes,
    studentInstructions: quiz.studentInstructions ?? t('quiz.defaultInstructions'),
    topic: quiz.topic,
    sourceSummaryLine: quiz.sourceSummary,
  }

  const detailLayout: HandoutLayoutOpts = { ...DEFAULT_HANDOUT_LAYOUT, ...quiz.handoutLayout }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={quiz.title}
        subtitle={t('teacherTools.subtitleMeta', {
          subject: quiz.subject,
          grade: quiz.grade,
          count: quiz.questions,
        })}
        breadcrumbs={[
          { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
          { label: t('quiz.breadcrumb'), to: '/teacher-tools/quiz' },
          { label: quiz.title },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <TeacherToolsStatusBadge kind="content" value={quiz.status} />
            <button
              type="button"
              onClick={() => void goEdit()}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              {t('teacherTools.edit')}
            </button>
            <button
              type="button"
              onClick={() => setPrintOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              <Eye className="h-4 w-4" />
              {t('teacherTools.preview')}
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  downloadQuizPdf(quiz)
                  toast.success(t('teacherTools.toastPdfDownloaded'))
                } catch {
                  toast.error(t('teacherTools.toastPdfFailed'))
                }
              }}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              {t('teacherTools.downloadPdf')}
            </button>
            <LockedTooltip>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
                {t('quiz.detail.submissions')}
                <Phase2Badge className="ml-1" />
              </span>
            </LockedTooltip>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tabKey) => (
          <button
            key={tabKey}
            type="button"
            onClick={() => {
              if (tabKey === 'Submissions' || tabKey === 'Analytics') return
              setTab(tabKey)
            }}
            title={tabKey === 'Submissions' || tabKey === 'Analytics' ? t('teacherTools.phase2Tooltip') : undefined}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${
              tab === tabKey
                ? 'bg-primary-600 text-white'
                : tabKey === 'Submissions' || tabKey === 'Analytics'
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t(TAB_I18N[tabKey])}
            {tabKey === 'Submissions' || tabKey === 'Analytics' ? (
              <span className="ml-1.5 align-middle">• P2</span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('quiz.detail.tabs.questions')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{quiz.questions}</p>
              <p className="mt-1 text-xs text-gray-500">{t('quiz.detail.totalMarks', { count: quiz.totalMarks })}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('quiz.detail.statTimeLimit')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{quiz.timeLimitMinutes} min</p>
              <p className="mt-1 text-xs text-gray-500">{t('quiz.detail.perAttempt')}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('quiz.detail.statSubmissions')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{quiz.submissionCount}</p>
              <p className="mt-1 text-xs text-gray-500">{t('quiz.detail.learnersSubmitted')}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('quiz.detail.statAvgScore')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {quiz.submissionCount > 0 ? quiz.avgScore.toFixed(1) : t('quiz.detail.na')}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {quiz.submissionCount > 0 ? t('quiz.detail.avgAfterSubmissions') : t('quiz.detail.avgPending')}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{t('quiz.detail.summary')}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('quiz.detail.topicScope')}</dt>
                  <dd className="text-right text-gray-800">{quiz.topic}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('exam.detail.sourceStrategy')}</dt>
                  <dd className="text-right text-gray-800">{quiz.sourceSummary ?? t('quiz.detail.topicOnlyGeneration')}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('exam.detail.classes')}</dt>
                  <dd className="text-right text-gray-800">{quiz.classes.length}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{t('exam.detail.schedule')}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('quiz.detail.assigned')}</dt>
                  <dd className="text-right text-gray-800">{fmtDate(quiz.assignedAt, t('quiz.detail.notScheduled'))}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('quiz.detail.due')}</dt>
                  <dd className="text-right text-gray-800">{fmtDate(quiz.dueAt, t('quiz.detail.notScheduled'))}</dd>
                </div>
              </dl>
              {quiz.status === 'draft' ? (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  {t('quiz.detail.draftScheduleHint')}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {tab === 'Questions' && (
        <div className="space-y-6 text-sm text-gray-800">
          {quiz.questionStubs && quiz.questionStubs.length > 0 ? (
            (['mcq', 'tf', 'short'] as const).map((kind) => {
              const group = quiz.questionStubs!.filter((s) => s.type === kind)
              if (group.length === 0) return null
              const label =
                kind === 'mcq'
                  ? t('teacherTools.multipleChoice')
                  : kind === 'tf'
                    ? t('teacherTools.trueFalse')
                    : t('teacherTools.shortAnswer')
              return (
                <section key={kind} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</h3>
                  <ul className="mt-3 space-y-3">
                    {group.map((s) => (
                      <li key={s.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                        <p>{s.prompt}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })
          ) : (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-gray-700 shadow-sm">
              {t('quiz.detail.questionsEmpty')}
            </div>
          )}
        </div>
      )}
      {tab === 'Submissions' && (
        <Phase2Section title={t('quiz.detail.phase2SubmissionsTitle')}>
          <div className="space-y-2 text-sm text-gray-700">
            <p>{t('quiz.detail.phase2SubmissionsBody1')}</p>
            <p>{t('quiz.detail.phase2SubmissionsBody2')}</p>
          </div>
        </Phase2Section>
      )}
      {tab === 'Analytics' && (
        <Phase2Section title={t('quiz.detail.phase2AnalyticsTitle')}>
          <div className="space-y-2 text-sm text-gray-700">
            <p>{t('quiz.detail.phase2AnalyticsBody1')}</p>
            <p>{t('quiz.detail.phase2AnalyticsBody2')}</p>
          </div>
        </Phase2Section>
      )}
      {tab === 'Settings' && <p className="text-sm text-gray-600">{t('quiz.detail.settingsPreview')}</p>}

      <QuizPrintPreviewModal
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        meta={printMeta}
        stubs={quiz.questionStubs ?? []}
        savedLayout={detailLayout}
        onSaveLayout={(layout) => {
          if (!quizId) return
          if (TEACHER_TOOLS_SEED_QUIZ_IDS.has(quizId)) {
            toast.info(t('quiz.detail.toastLayoutPreviewOnly'))
            return
          }
          void api.updateQuiz(quizId, { handoutLayout: layout })
          toast.success(t('quiz.detail.toastLayoutSaved'))
        }}
      />
    </div>
  )
}
