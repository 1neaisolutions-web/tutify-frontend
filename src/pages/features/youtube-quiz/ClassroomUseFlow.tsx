import { useState, type ElementType } from 'react'
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

type StepStatus = 'available' | 'demo' | 'future'

// TODO: Replace with backend API response later.
const WORKFLOW_STEPS: {
  id: string
  number: number
  title: string
  Icon: ElementType
  whatTeacher: string
  whatSystem: string
  backendReq: string
  status: StepStatus
}[] = [
  {
    id: 'choose-video',
    number: 1,
    title: 'Choose or paste video',
    Icon: LinkIcon,
    whatTeacher: 'Paste a YouTube link or select from Quick Start sources below.',
    whatSystem: 'Validates URL, fetches video metadata, and confirms transcript availability.',
    backendReq: 'YouTube Data API v3 + transcript extraction service.',
    status: 'available',
  },
  {
    id: 'generate-quiz',
    number: 2,
    title: 'Generate quiz blueprint',
    Icon: Sparkles,
    whatTeacher: 'Set grade band, subject lens, and question styles — then click Generate.',
    whatSystem: 'Runs AI pipeline: transcript segmentation → DOK alignment → question generation.',
    backendReq: 'LLM inference endpoint (already live). Transcript extraction API.',
    status: 'available',
  },
  {
    id: 'review-questions',
    number: 3,
    title: 'Review questions',
    Icon: ListChecks,
    whatTeacher: 'Preview generated questions, edit or remove items, and reorder sections.',
    whatSystem: 'Renders structured quiz preview with answer keys and difficulty tags.',
    backendReq: 'Quiz edit/patch endpoint (planned). Answer-key validation.',
    status: 'available',
  },
  {
    id: 'select-strategy',
    number: 4,
    title: 'Select teaching strategy',
    Icon: Layers,
    whatTeacher: 'Choose a lesson flow strategy. Preview configuration and apply to quiz.',
    whatSystem: 'Stores strategy preference against the quiz session for export customisation.',
    backendReq: 'Quiz strategy save endpoint + teacher session storage.',
    status: 'demo',
  },
  {
    id: 'export',
    number: 5,
    title: 'Export, print, or save',
    Icon: Download,
    whatTeacher: 'Download as PDF, copy to Google Forms, or generate a shareable link.',
    whatSystem: 'Formats quiz into the selected template. Generates share token or file blob.',
    backendReq: 'PDF renderer, Google Forms API integration, link shortener service.',
    status: 'demo',
  },
  {
    id: 'reuse',
    number: 6,
    title: 'Reuse for future lessons',
    Icon: RefreshCw,
    whatTeacher: 'Save to quiz library. Tag by topic. Search and clone for new classes.',
    whatSystem: 'Persists quiz to teacher library with tagging, versioning, and class assignment.',
    backendReq: 'Quiz library CRUD, tag index, class roster linking.',
    status: 'future',
  },
]

// TODO: Replace with real progress derived from backend state later.
const PROGRESS_INDICATORS = [
  { label: 'Video selected', status: 'complete' as const },
  { label: 'Quiz generated', status: 'complete' as const },
  { label: 'Strategy selected', status: 'in-progress' as const },
  { label: 'Export ready', status: 'demo' as const },
]

const STATUS_CONFIG: Record<StepStatus, { label: string; badgeCls: string }> = {
  available: { label: 'Available now', badgeCls: 'border-green-200 bg-green-100 text-green-700' },
  demo: { label: 'Demo only', badgeCls: 'border-amber-200 bg-amber-100 text-amber-700' },
  future: { label: 'Future backend', badgeCls: 'border-gray-200 bg-gray-100 text-gray-600' },
}

export function ClassroomUseFlow() {
  const [activeId, setActiveId] = useState<string | null>(null)

  const active = WORKFLOW_STEPS.find((s) => s.id === activeId) ?? null

  return (
    <section>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Layers className="h-5 w-5 text-red-500" />
              How to Use This Quiz in Class
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Click each step to see what you do, what the system prepares, and what's coming next.
            </p>
          </div>

          {/* Progress tracker */}
          <div className="flex flex-wrap gap-2">
            {PROGRESS_INDICATORS.map((p) => (
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
          {WORKFLOW_STEPS.map((step) => {
            const isActive = activeId === step.id
            const cfg = STATUS_CONFIG[step.status]
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
                  className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${STATUS_CONFIG[active.status].badgeCls}`}
                >
                  {STATUS_CONFIG[active.status].label}
                </span>
              </div>
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-3">
              <StepDetail
                title="What the teacher does"
                content={active.whatTeacher}
                cls="border-blue-200 bg-blue-50 text-blue-900"
              />
              <StepDetail
                title="What the system prepares"
                content={active.whatSystem}
                cls="border-green-200 bg-green-50 text-green-900"
              />
              <StepDetail
                title="Backend requirement"
                content={active.backendReq}
                cls="border-gray-200 bg-white text-gray-700"
                note="Backend-handoff note"
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
