import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import type { LearningHubSectionItem } from '../../../features/learningHub/types'
import { isResearchStructuredSectionsPayload } from '../../../features/learningHub/researchInsightStructuredPayload'
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Layers,
  Lightbulb,
  Share2,
  Star,
  Target,
  Zap,
} from 'lucide-react'

type TextBlock = {
  type: 'text'
  heading?: string
  paragraphs: string[]
}

type InteractiveBlock = {
  type: 'interactive'
  title: string
  prompt: string
  tips: string[]
}

type ContentBlock = TextBlock | InteractiveBlock

const SIDEBAR_ICONS: LucideIcon[] = [Eye, FileText, Layers, Target, Zap, Lightbulb]

type NavItem = { id: string; label: string; Icon: LucideIcon }

export function ResearchInsightSectionsPayloadView({ item }: { item: LearningHubSectionItem }) {
  const navigate = useNavigate()
  const c = item.researchInsightContent
  const payload = c?.payload
  if (!c || !isResearchStructuredSectionsPayload(payload)) return null

  const navItems = useMemo((): NavItem[] => {
    const items: NavItem[] = []
    if (payload.summary && payload.summary.length > 0) {
      items.push({ id: 'summary', label: 'Summary', Icon: Eye })
    }
    payload.sections.forEach((s, i) => {
      items.push({
        id: s.id,
        label: s.title,
        Icon: SIDEBAR_ICONS[i % SIDEBAR_ICONS.length]!,
      })
    })
    const hasWrapUp =
      (payload.keyTakeaways && payload.keyTakeaways.length > 0) ||
      (payload.implementationIdeas && payload.implementationIdeas.length > 0) ||
      (payload.references && payload.references.length > 0) ||
      (payload.metadata && Object.keys(payload.metadata).length > 0)
    if (hasWrapUp) {
      items.push({ id: 'wrap-up', label: 'Takeaways & resources', Icon: Star })
    }
    return items
  }, [payload])

  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!navItems.length) return
    if (!navItems.some((n) => n.id === activeId)) {
      setActiveId(navItems[0]!.id)
    }
  }, [navItems, activeId])

  const effectiveId = navItems.some((n) => n.id === activeId) ? activeId : (navItems[0]?.id ?? '')
  const currentIndex = Math.max(
    0,
    navItems.findIndex((n) => n.id === effectiveId)
  )
  const stepLabel = navItems.length > 0 ? `Step ${currentIndex + 1} of ${navItems.length}` : ''

  const goPrev = () => {
    if (currentIndex > 0) setActiveId(navItems[currentIndex - 1]!.id)
  }
  const goNext = () => {
    if (currentIndex < navItems.length - 1) setActiveId(navItems[currentIndex + 1]!.id)
  }

  const gradientClass =
    c.headerGradientClass ?? 'from-purple-600 via-indigo-600 to-blue-600'
  const heroSubtitleClass = 'text-purple-100'

  const renderSectionBody = (sectionId: string) => {
    const section = payload.sections.find((s) => s.id === sectionId)
    if (!section) return null
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
        <div className="space-y-6">
          {(section.contentBlocks as ContentBlock[]).map((block, bi) => {
            if (block.type === 'text') {
              return (
                <div key={bi}>
                  {block.heading ? (
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">{block.heading}</h3>
                  ) : null}
                  <div className="prose prose-sm max-w-none space-y-3 text-gray-700">
                    {block.paragraphs.map((p, pi) => (
                      <p key={pi} className="leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              )
            }
            return (
              <div
                key={bi}
                className="rounded-xl border border-purple-200 bg-purple-50/60 p-5"
              >
                <h3 className="mb-2 text-base font-semibold text-purple-900">{block.title}</h3>
                <p className="text-sm text-gray-700">{block.prompt}</p>
                {block.tips.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm text-gray-700">
                    {block.tips.map((tip, ti) => (
                      <li key={ti} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderMainPanel = () => {
    if (effectiveId === 'summary' && payload.summary && payload.summary.length > 0) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
          <div className="rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50/80 to-indigo-50/50 p-6">
            <ul className="space-y-3 text-sm text-gray-700">
              {payload.summary.map((line, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-600" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )
    }

    if (effectiveId === 'wrap-up') {
      return (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Takeaways & resources</h2>

          {payload.keyTakeaways && payload.keyTakeaways.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-amber-900">
                <Lightbulb className="h-5 w-5 text-amber-700" />
                Key takeaways
              </h3>
              <ul className="space-y-2 text-sm text-amber-950/90">
                {payload.keyTakeaways.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-semibold text-amber-800">{i + 1}.</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {payload.implementationIdeas && payload.implementationIdeas.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Implementation ideas</h3>
              <ul className="list-inside list-disc space-y-2 text-sm text-gray-700">
                {payload.implementationIdeas.map((idea, i) => (
                  <li key={i}>{idea}</li>
                ))}
              </ul>
            </div>
          )}

          {payload.references && payload.references.length > 0 && (
            <div className="border-t border-gray-100 pt-6">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                References
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                {payload.references.map((ref, i) => (
                  <li key={i}>{ref}</li>
                ))}
              </ul>
            </div>
          )}

          {payload.metadata && Object.keys(payload.metadata).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(payload.metadata).map(([k, v]) => (
                <span
                  key={k}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {k}: {v}
                </span>
              ))}
            </div>
          )}
        </div>
      )
    }

    return renderSectionBody(effectiveId)
  }

  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-r ${gradientClass} rounded-3xl p-8 text-white shadow-xl`}>
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/learning-hub')}
                className="rounded-lg p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    Research Insight
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-sm text-white/80">{c.heroSubtitle}</span>
                  <span className="text-white/80">•</span>
                  <span className="flex items-center gap-1 text-sm text-white/80">
                    <Clock className="h-3 w-3" />
                    {c.headerDurationLabel ?? item.duration ?? ''}
                  </span>
                </div>
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <p className={`mt-2 ${heroSubtitleClass}`}>{c.heroDescription}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {(c.headerBadgeLabels ?? []).map((label, idx) => {
                const BadgeIcon = [Star, Lightbulb, Target][idx % 3] ?? Star
                return (
                  <div key={`${label}-${idx}`} className="flex items-center gap-2">
                    <BadgeIcon className="h-4 w-4" />
                    <span>{label}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <Bookmark className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-lg p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
              Sections
            </h3>
            <div className="space-y-1">
              {navItems.map((nav) => {
                const Icon = nav.Icon
                const isActive = nav.id === effectiveId
                return (
                  <button
                    key={nav.id}
                    type="button"
                    onClick={() => setActiveId(nav.id)}
                    className={`flex w-full items-center gap-2 rounded-lg p-3 text-left text-sm font-medium transition ${
                      isActive
                        ? 'border-2 border-purple-300 bg-purple-50 text-purple-900'
                        : 'border-2 border-transparent text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{nav.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 border-b border-gray-100 pb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-700">
                {stepLabel}
              </p>
            </div>

            <div className="min-h-[12rem]">{renderMainPanel()}</div>

            <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex <= 0}
                className="inline-flex items-center justify-center gap-1 rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-800 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={currentIndex >= navItems.length - 1}
                className="inline-flex items-center justify-center gap-1 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
