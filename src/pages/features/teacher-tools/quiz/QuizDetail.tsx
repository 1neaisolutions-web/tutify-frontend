import { useMemo, useState } from 'react'
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

function fmtDate(v: string | undefined) {
  if (!v) return 'Not scheduled'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function QuizDetail() {
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
        toast.success('Created an editable copy from the sample library')
        navigate(`/teacher-tools/quiz/${r.id}/edit`)
        return
      }
      toast.error('Could not create a copy')
      return
    }
    navigate(`/teacher-tools/quiz/${quizId}/edit`)
  }

  if (!quiz) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">This quiz was not found.</p>
        <Link to="/teacher-tools/quiz" className="text-sm font-semibold text-primary-600">
          ← Back to quizzes
        </Link>
      </div>
    )
  }

  const printMeta: QuizPrintMeta = {
    title: quiz.title,
    subject: quiz.subject,
    grade: quiz.grade,
    timeLimitMinutes: quiz.timeLimitMinutes,
    studentInstructions: quiz.studentInstructions ?? 'Answer all questions. Show working where appropriate.',
    topic: quiz.topic,
    sourceSummaryLine: quiz.sourceSummary,
  }

  const detailLayout: HandoutLayoutOpts = { ...DEFAULT_HANDOUT_LAYOUT, ...quiz.handoutLayout }

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={quiz.title}
        subtitle={`${quiz.subject} · ${quiz.grade} · ${quiz.questions} questions`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Quiz', to: '/teacher-tools/quiz' },
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
              Edit
            </button>
            <button
              type="button"
              onClick={() => setPrintOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  downloadQuizPdf(quiz)
                  toast.success('PDF downloaded')
                } catch {
                  toast.error('Could not generate PDF')
                }
              }}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              Download PDF
            </button>
            <LockedTooltip>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-600">
                Submissions
                <Phase2Badge className="ml-1" />
              </span>
            </LockedTooltip>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              if (t === 'Submissions' || t === 'Analytics') return
              setTab(t)
            }}
            title={t === 'Submissions' || t === 'Analytics' ? 'Available in Phase 2' : undefined}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${
              tab === t
                ? 'bg-primary-600 text-white'
                : t === 'Submissions' || t === 'Analytics'
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-gray-100 text-gray-600'
            }`}
          >
            {t}
            {t === 'Submissions' || t === 'Analytics' ? <span className="ml-1.5 align-middle">• P2</span> : null}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Questions</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{quiz.questions}</p>
              <p className="mt-1 text-xs text-gray-500">Total marks: {quiz.totalMarks}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Time limit</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{quiz.timeLimitMinutes} min</p>
              <p className="mt-1 text-xs text-gray-500">Per learner attempt</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Submissions</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{quiz.submissionCount}</p>
              <p className="mt-1 text-xs text-gray-500">Learners submitted</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Average score</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {quiz.submissionCount > 0 ? quiz.avgScore.toFixed(1) : 'N/A'}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {quiz.submissionCount > 0 ? 'Across graded submissions' : 'Available after first submissions'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Summary</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Topic scope</dt>
                  <dd className="text-right text-gray-800">{quiz.topic}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Source strategy</dt>
                  <dd className="text-right text-gray-800">{quiz.sourceSummary ?? 'Topic-only generation'}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Classes</dt>
                  <dd className="text-right text-gray-800">{quiz.classes.length}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Schedule</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Assigned</dt>
                  <dd className="text-right text-gray-800">{fmtDate(quiz.assignedAt)}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Due</dt>
                  <dd className="text-right text-gray-800">{fmtDate(quiz.dueAt)}</dd>
                </div>
              </dl>
              {quiz.status === 'draft' ? (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  This quiz is a draft. Set assignment dates after publishing or when attaching to a class.
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
                kind === 'mcq' ? 'Multiple choice' : kind === 'tf' ? 'True / false' : 'Short answer'
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
              Question text is generated when you publish or edit this quiz. Open <strong>Edit</strong> and publish to
              refresh the question bank.
            </div>
          )}
        </div>
      )}
      {tab === 'Submissions' && (
        <Phase2Section title="Student submissions (locked)">
          <div className="space-y-2 text-sm text-gray-700">
            <p>Submission inbox, grading queue, and late policy actions appear here.</p>
            <p>Integrates with roster sync and student identity in Phase 2.</p>
          </div>
        </Phase2Section>
      )}
      {tab === 'Analytics' && (
        <Phase2Section title="Learner analytics (locked)">
          <div className="space-y-2 text-sm text-gray-700">
            <p>Question difficulty, distractor analysis, and performance trends appear here.</p>
            <p>Requires student attempt telemetry and standards mapping in Phase 2.</p>
          </div>
        </Phase2Section>
      )}
      {tab === 'Settings' && <p className="text-sm text-gray-600">Visibility, late rules, and integrity options (preview).</p>}

      <QuizPrintPreviewModal
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        meta={printMeta}
        stubs={quiz.questionStubs ?? []}
        savedLayout={detailLayout}
        onSaveLayout={(layout) => {
          if (!quizId) return
          if (TEACHER_TOOLS_SEED_QUIZ_IDS.has(quizId)) {
            toast.info('Preview available. Save layout in Edit mode for sample-library quizzes.')
            return
          }
          void api.updateQuiz(quizId, { handoutLayout: layout })
          toast.success('Handout layout saved')
        }}
      />
    </div>
  )
}
