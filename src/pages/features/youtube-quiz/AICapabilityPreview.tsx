import { useMemo, useState, type ElementType } from 'react'
import {
  Clock,
  Sparkles,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  FileText,
  ListChecks,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

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

export function AICapabilityPreview() {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState<string | null>(null)

  const statusConfig = useMemo(
    () =>
      ({
        demo: {
          label: t('youtubeQuizPage.capabilities.previewBadge'),
          badgeCls: 'border-amber-400 bg-amber-100 text-amber-800',
        },
        future: {
          label: t('youtubeQuizPage.capabilities.futureBadge'),
          badgeCls: 'border-gray-400 bg-gray-200 text-gray-700',
        },
      }) satisfies Record<CapabilityStatus, { label: string; badgeCls: string }>,
    [t]
  )

  const capabilities = useMemo<Capability[]>(
    () => [
      {
        id: 'adaptive-difficulty',
        title: t('youtubeQuizPage.capabilities.adaptiveDifficulty.title'),
        Icon: Sparkles,
        tagline: t('youtubeQuizPage.capabilities.adaptiveDifficulty.tagline'),
        whatItIs: t('youtubeQuizPage.capabilities.adaptiveDifficulty.whatItIs'),
        purpose: t('youtubeQuizPage.capabilities.adaptiveDifficulty.purpose'),
        howToUse: t('youtubeQuizPage.capabilities.adaptiveDifficulty.howToUse'),
        status: 'demo',
        isActiveMvp: true,
      },
      {
        id: 'curriculum-tagging',
        title: t('youtubeQuizPage.capabilities.curriculumTagging.title'),
        Icon: BookOpen,
        tagline: t('youtubeQuizPage.capabilities.curriculumTagging.tagline'),
        whatItIs: t('youtubeQuizPage.capabilities.curriculumTagging.whatItIs'),
        purpose: t('youtubeQuizPage.capabilities.curriculumTagging.purpose'),
        howToUse: t('youtubeQuizPage.capabilities.curriculumTagging.howToUse'),
        status: 'demo',
      },
      {
        id: 'playlist-analytics',
        title: t('youtubeQuizPage.capabilities.playlistAnalytics.title'),
        Icon: GraduationCap,
        tagline: t('youtubeQuizPage.capabilities.playlistAnalytics.tagline'),
        whatItIs: t('youtubeQuizPage.capabilities.playlistAnalytics.whatItIs'),
        purpose: t('youtubeQuizPage.capabilities.playlistAnalytics.purpose'),
        howToUse: t('youtubeQuizPage.capabilities.playlistAnalytics.howToUse'),
        status: 'future',
      },
      {
        id: 'accessibility',
        title: t('youtubeQuizPage.capabilities.accessibility.title'),
        Icon: ShieldCheck,
        tagline: t('youtubeQuizPage.capabilities.accessibility.tagline'),
        whatItIs: t('youtubeQuizPage.capabilities.accessibility.whatItIs'),
        purpose: t('youtubeQuizPage.capabilities.accessibility.purpose'),
        howToUse: t('youtubeQuizPage.capabilities.accessibility.howToUse'),
        status: 'demo',
        isActiveMvp: true,
      },
      {
        id: 'lesson-plan',
        title: t('youtubeQuizPage.capabilities.lessonPlan.title'),
        Icon: FileText,
        tagline: t('youtubeQuizPage.capabilities.lessonPlan.tagline'),
        whatItIs: t('youtubeQuizPage.capabilities.lessonPlan.whatItIs'),
        purpose: t('youtubeQuizPage.capabilities.lessonPlan.purpose'),
        howToUse: t('youtubeQuizPage.capabilities.lessonPlan.howToUse'),
        status: 'future',
      },
      {
        id: 'worksheet-from-quiz',
        title: t('youtubeQuizPage.capabilities.worksheetFromQuiz.title'),
        Icon: ListChecks,
        tagline: t('youtubeQuizPage.capabilities.worksheetFromQuiz.tagline'),
        whatItIs: t('youtubeQuizPage.capabilities.worksheetFromQuiz.whatItIs'),
        purpose: t('youtubeQuizPage.capabilities.worksheetFromQuiz.purpose'),
        howToUse: t('youtubeQuizPage.capabilities.worksheetFromQuiz.howToUse'),
        status: 'demo',
        isActiveMvp: true,
      },
    ],
    [t]
  )

  const visibleCapabilities = useMemo(
    () => capabilities.filter((cap) => cap.isActiveMvp),
    [capabilities]
  )

  return (
    <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-md">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-white/70">
        <Clock className="h-4 w-4 text-amber-300" />
        {t('youtubeQuizPage.capabilities.title')}
      </h3>
      <p className="mt-1 text-xs text-white/50">{t('youtubeQuizPage.capabilities.hint')}</p>

      <ul className="mt-4 space-y-2 text-sm">
        {visibleCapabilities.map((cap) => {
          const isActive = activeId === cap.id
          const cfg = statusConfig[cap.status]
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
                    <p className="mb-1 font-semibold text-amber-300">
                      {t('youtubeQuizPage.capabilities.whatItIs')}
                    </p>
                    <p className="text-white/80 leading-relaxed">{cap.whatItIs}</p>
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-amber-300">
                      {t('youtubeQuizPage.capabilities.purpose')}
                    </p>
                    <p className="text-white/80 leading-relaxed">{cap.purpose}</p>
                  </div>
                  <div>
                    <p className="mb-1 font-semibold text-amber-300">
                      {t('youtubeQuizPage.capabilities.howToUse')}
                    </p>
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
