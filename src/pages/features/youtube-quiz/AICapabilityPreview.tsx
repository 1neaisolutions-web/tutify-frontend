import { useState, type ElementType } from 'react'
import {
  Clock,
  Sparkles,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  FileText,
  ListChecks,
} from 'lucide-react'

type CapabilityStatus = 'demo' | 'future'

interface Capability {
  id: string
  title: string
  Icon: ElementType
  tagline: string
  whatItIs: string
  purpose: string
  howToUse: string
  status: CapabilityStatus
  isActiveMvp?: boolean
}

// TODO: Replace with backend API response later.
const CAPABILITIES: Capability[] = [
  {
    id: 'adaptive-difficulty',
    title: 'Adaptive difficulty',
    Icon: Sparkles,
    tagline: 'Controls how easy or challenging generated quiz questions should be.',
    whatItIs: 'Controls how easy or challenging the generated quiz questions are.',
    purpose: 'Helps teachers match quiz difficulty to student readiness.',
    howToUse: 'Choose Easy, Medium, or Challenging before generating the quiz.',
    status: 'demo',
    isActiveMvp: true,
  },
  {
    id: 'curriculum-tagging',
    title: 'Curriculum tagging engine',
    Icon: BookOpen,
    tagline: 'Maps each question to district standards — NGSS, Common Core, TEKS, and custom frameworks.',
    whatItIs: 'Maps questions to standards and curriculum frameworks.',
    purpose: 'Reduces manual alignment overhead for teachers.',
    howToUse: 'This capability is currently hidden from the MVP interface.',
    status: 'demo',
  },
  {
    id: 'playlist-analytics',
    title: 'Student playlist analytics',
    Icon: GraduationCap,
    tagline: 'Track mastery by clip, regroup learners, and export insight dashboards.',
    whatItIs: 'Tracks mastery patterns across playlist content.',
    purpose: 'Helps teachers identify struggling students and segments.',
    howToUse: 'This capability is currently hidden from the MVP interface.',
    status: 'future',
  },
  {
    id: 'accessibility',
    title: 'Accessibility assistant',
    Icon: ShieldCheck,
    tagline: 'Simplifies question wording so quizzes are easier to read.',
    whatItIs: 'Simplifies question wording for easier reading.',
    purpose: 'Makes quizzes clearer for students who need accessible language.',
    howToUse: 'Turn Accessibility Mode ON before generating the quiz.',
    status: 'demo',
    isActiveMvp: true,
  },
  {
    id: 'lesson-plan',
    title: 'Auto-generated lesson plan',
    Icon: FileText,
    tagline: 'Converts your quiz into a full 60-minute lesson plan with warm-up, activities, and closure.',
    whatItIs: 'Builds complete lesson plans from generated quizzes.',
    purpose: 'Accelerates lesson planning and pacing.',
    howToUse: 'This capability is currently hidden from the MVP interface.',
    status: 'future',
  },
  {
    id: 'worksheet-from-quiz',
    title: 'Worksheet from quiz',
    Icon: ListChecks,
    tagline: 'Converts a generated quiz into a printable worksheet and answer key.',
    whatItIs: 'Converts the generated quiz into a printable student worksheet.',
    purpose: 'Lets teachers use the quiz offline or in class.',
    howToUse: 'Generate the quiz first, then click Generate Worksheet/export.',
    status: 'demo',
    isActiveMvp: true,
  },
]

const STATUS_CONFIG: Record<CapabilityStatus, { label: string; badgeCls: string }> = {
  demo: {
    label: 'Preview capability',
    badgeCls: 'border-amber-400 bg-amber-100 text-amber-800',
  },
  future: {
    label: 'Backend-ready concept',
    badgeCls: 'border-gray-400 bg-gray-200 text-gray-700',
  },
}

export function AICapabilityPreview() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const visibleCapabilities = CAPABILITIES.filter((cap) => cap.isActiveMvp)

  return (
    <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-md">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/70">
        <Clock className="h-4 w-4 text-amber-300" />
        AI Capability Preview
      </h3>
      <p className="mt-1 text-xs text-white/50">
        Click any capability to explore what it does and how it will work.
      </p>

      <ul className="mt-4 space-y-2 text-sm">
        {visibleCapabilities.map((cap) => {
          const isActive = activeId === cap.id
          const cfg = STATUS_CONFIG[cap.status]
          const Icon = cap.Icon
          return (
            <li key={cap.id}>
              <button
                onClick={() => setActiveId(isActive ? null : cap.id)}
                className={`w-full rounded-xl p-3 text-left transition-all ${
                  isActive
                    ? 'bg-white/15 ring-1 ring-amber-300/60'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0 text-amber-300" />
                  <p className="font-semibold">{cap.title}</p>
                  <span
                    className={`ml-auto flex-shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${cfg.badgeCls}`}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="mt-1 pl-6 text-xs text-white/60">{cap.tagline}</p>
              </button>

              {isActive && (
                <div className="mt-2 rounded-xl bg-white/10 p-4 text-xs space-y-3">
                  <div>
                    <p className="mb-1 font-semibold text-amber-300">What it is</p>
                    <p className="text-white/80 leading-relaxed">{cap.whatItIs}</p>
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-amber-300">Purpose</p>
                    <p className="text-white/80 leading-relaxed">{cap.purpose}</p>
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-amber-300">How to use</p>
                    <p className="text-white/80 leading-relaxed">{cap.howToUse}</p>
                  </div>
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.badgeCls}`}
                  >
                    {cfg.label}
                  </span>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
