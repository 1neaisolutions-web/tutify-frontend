import { useMemo, useState, type ElementType } from 'react'
import {
  Link as LinkIcon,
  Sparkles,
  ListChecks,
  Layers,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

type StepStatus = 'available' | 'demo' | 'future'

type WorkflowStep = {
  id: string
  number: number
  title: string
  Icon: ElementType
  whatTeacher: string
  whatSystem: string
  backendReq: string
  status: StepStatus
}

type ProgressIndicator = {
  label: string
  status: 'complete' | 'in-progress' | 'demo'
}

export function ClassroomUseFlow() {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState<string | null>(null)

  const statusConfig = useMemo(
    () =>
      ({
        available: {
          label: t('youtubeQuizPage.classroomFlow.availableNow'),
          badgeCls: 'border-green-200 bg-green-100 text-green-700',
        },
        demo: {
          label: t('youtubeQuizPage.classroomFlow.demoOnly'),
          badgeCls: 'border-amber-200 bg-amber-100 text-amber-700',
        },
        future: {
          label: t('youtubeQuizPage.classroomFlow.futureBackend'),
          badgeCls: 'border-gray-200 bg-gray-100 text-gray-600',
        },
      }) satisfies Record<StepStatus, { label: string; badgeCls: string }>,
    [t]
  )

  const workflowSteps = useMemo<WorkflowStep[]>(
    () => [
      {
        id: 'choose-video',
        number: 1,
        title: t('youtubeQuizPage.classroomFlow.steps.chooseVideo.title'),
        Icon: LinkIcon,
        whatTeacher: t('youtubeQuizPage.classroomFlow.steps.chooseVideo.whatTeacher'),
        whatSystem: t('youtubeQuizPage.classroomFlow.steps.chooseVideo.whatSystem'),
        backendReq: t('youtubeQuizPage.classroomFlow.steps.chooseVideo.backendReq'),
        status: 'available',
      },
      {
        id: 'generate-quiz',
        number: 2,
        title: t('youtubeQuizPage.classroomFlow.steps.generateQuiz.title'),
        Icon: Sparkles,
        whatTeacher: t('youtubeQuizPage.classroomFlow.steps.generateQuiz.whatTeacher'),
        whatSystem: t('youtubeQuizPage.classroomFlow.steps.generateQuiz.whatSystem'),
        backendReq: t('youtubeQuizPage.classroomFlow.steps.generateQuiz.backendReq'),
        status: 'available',
      },
      {
        id: 'review-questions',
        number: 3,
        title: t('youtubeQuizPage.classroomFlow.steps.reviewQuestions.title'),
        Icon: ListChecks,
        whatTeacher: t('youtubeQuizPage.classroomFlow.steps.reviewQuestions.whatTeacher'),
        whatSystem: t('youtubeQuizPage.classroomFlow.steps.reviewQuestions.whatSystem'),
        backendReq: t('youtubeQuizPage.classroomFlow.steps.reviewQuestions.backendReq'),
        status: 'available',
      },
      {
        id: 'select-strategy',
        number: 4,
        title: t('youtubeQuizPage.classroomFlow.steps.selectStrategy.title'),
        Icon: Layers,
        whatTeacher: t('youtubeQuizPage.classroomFlow.steps.selectStrategy.whatTeacher'),
        whatSystem: t('youtubeQuizPage.classroomFlow.steps.selectStrategy.whatSystem'),
        backendReq: t('youtubeQuizPage.classroomFlow.steps.selectStrategy.backendReq'),
        status: 'demo',
      },
      {
        id: 'export',
        number: 5,
        title: t('youtubeQuizPage.classroomFlow.steps.export.title'),
        Icon: Download,
        whatTeacher: t('youtubeQuizPage.classroomFlow.steps.export.whatTeacher'),
        whatSystem: t('youtubeQuizPage.classroomFlow.steps.export.whatSystem'),
        backendReq: t('youtubeQuizPage.classroomFlow.steps.export.backendReq'),
        status: 'demo',
      },
      {
        id: 'reuse',
        number: 6,
        title: t('youtubeQuizPage.classroomFlow.steps.reuse.title'),
        Icon: RefreshCw,
        whatTeacher: t('youtubeQuizPage.classroomFlow.steps.reuse.whatTeacher'),
        whatSystem: t('youtubeQuizPage.classroomFlow.steps.reuse.whatSystem'),
        backendReq: t('youtubeQuizPage.classroomFlow.steps.reuse.backendReq'),
        status: 'future',
      },
    ],
    [t]
  )

  const progressIndicators = useMemo<ProgressIndicator[]>(
    () => [
      { label: t('youtubeQuizPage.classroomFlow.progressVideo'), status: 'complete' },
      { label: t('youtubeQuizPage.classroomFlow.progressQuiz'), status: 'complete' },
      { label: t('youtubeQuizPage.classroomFlow.progressStrategy'), status: 'in-progress' },
      { label: t('youtubeQuizPage.classroomFlow.progressExport'), status: 'demo' },
    ],
    [t]
  )

  const active = workflowSteps.find((s) => s.id === activeId) ?? null

  return (
    <section>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Layers className="h-5 w-5 text-red-500" />
              {t('youtubeQuizPage.classroomFlow.title')}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{t('youtubeQuizPage.classroomFlow.hint')}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {progressIndicators.map((p) => (
              <span
                key={p.label}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  p.status === 'complete'
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : p.status === 'in-progress'
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
                }`}
              >
                {p.status === 'complete' && <CheckCircle2 className="h-3 w-3" />}
                {p.status === 'in-progress' && <Clock className="h-3 w-3" />}
                {p.status === 'demo' && <Zap className="h-3 w-3" />}
                {p.label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {workflowSteps.map((step) => {
            const isActive = activeId === step.id
            const cfg = statusConfig[step.status]
            const Icon = step.Icon
            return (
              <button
                key={step.id}
                onClick={() => setActiveId(isActive ? null : step.id)}
                className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                  isActive
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 bg-gray-50 hover:border-red-200 hover:bg-red-50/30'
                }`}
              >
                <span className="mb-2 block text-xs font-bold text-gray-400">
                  {String(step.number).padStart(2, '0')}
                </span>
                <Icon
                  className={`mb-2 h-5 w-5 ${isActive ? 'text-red-500' : 'text-gray-400'}`}
                />
                <p
                  className={`text-xs font-semibold leading-snug ${
                    isActive ? 'text-red-700' : 'text-gray-800'
                  }`}
                >
                  {step.title}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cfg.badgeCls}`}
                >
                  {cfg.label}
                </span>
              </button>
            )
          })}
        </div>

        {active && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <active.Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{active.title}</p>
                <span
                  className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${statusConfig[active.status].badgeCls}`}
                >
                  {statusConfig[active.status].label}
                </span>
              </div>
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-3">
              <StepDetail
                title={t('youtubeQuizPage.classroomFlow.whatTeacherDoes')}
                content={active.whatTeacher}
                cls="border-blue-200 bg-blue-50 text-blue-900"
              />
              <StepDetail
                title={t('youtubeQuizPage.classroomFlow.whatSystemPrepares')}
                content={active.whatSystem}
                cls="border-green-200 bg-green-50 text-green-900"
              />
              <StepDetail
                title={t('youtubeQuizPage.classroomFlow.backendRequirement')}
                content={active.backendReq}
                cls="border-gray-200 bg-white text-gray-700"
                note={t('youtubeQuizPage.classroomFlow.backendNote')}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function StepDetail({
  title,
  content,
  cls,
  note,
}: {
  title: string
  content: string
  cls: string
  note?: string
}) {
  return (
    <div className={`rounded-xl border p-4 ${cls}`}>
      {note && (
        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest opacity-50">{note}</p>
      )}
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide">{title}</p>
      <p className="text-sm leading-relaxed">{content}</p>
    </div>
  )
}
