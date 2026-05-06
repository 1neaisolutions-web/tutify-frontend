import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getSectionItemBySlug } from '../../features/learningHub'
import type { LearningHubSectionItem } from '../../features/learningHub/types'
import type { EvidenceBasedTeachingBody, TeachingStrategy } from '../../features/learningHub/content/researchInsightBodies/evidenceBasedTeachingBody'
import {
  ArrowLeft,
  Clock,
  Lightbulb,
  Target,
  Star,
  Download,
  Share2,
  Bookmark,
  TrendingUp,
  Eye,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react'

const SLUG = 'evidence-based-teaching'

const sidebarIcons = {
  Eye,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
} as const

function getEffectSizeColor(effectSize: number) {
  if (effectSize >= 0.6) return 'text-green-600 bg-green-100'
  if (effectSize >= 0.4) return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
}

function EffectSizeGlyph({ effectSize }: { effectSize: number }) {
  if (effectSize >= 0.6) return <ArrowUp className="h-4 w-4" />
  if (effectSize >= 0.4) return <Minus className="h-4 w-4" />
  return <ArrowDown className="h-4 w-4" />
}

export function EvidenceBasedTeachingResearchView({ item }: { item: LearningHubSectionItem }) {
  const navigate = useNavigate()
  const c = item.researchInsightContent
  const body = (c?.payload ?? null) as EvidenceBasedTeachingBody | null
  if (!c || !body) return null

  const [activeSection, setActiveSection] = useState<string>(body.sidebarNav[0]?.id ?? 'overview')
  const gradientClass =
    c.headerGradientClass ?? 'from-blue-600 via-indigo-600 to-purple-600'
  const teachingStrategies = body.teachingStrategies
  const highImpactStrategies = teachingStrategies.filter((s) => s.category === 'High Impact')
  const mediumImpactStrategies = teachingStrategies.filter((s) => s.category === 'Medium Impact')
  const lowImpactStrategies = teachingStrategies.filter((s) => s.category === 'Low Impact')

  const bandIcon = (icon: 'up' | 'mid' | 'down') => {
    if (icon === 'up') return <ArrowUp className="h-5 w-5 text-green-600" />
    if (icon === 'mid') return <Minus className="h-5 w-5 text-yellow-600" />
    return <ArrowDown className="h-5 w-5 text-red-600" />
  }

  const renderStrategyList = (
    strategies: TeachingStrategy[],
    tone: 'green' | 'yellow' | 'red',
    checkClass: string
  ) => (
    <div className="space-y-4">
      {strategies.map((strategy, idx) => {
        const border =
          tone === 'green'
            ? 'bg-green-50 border-2 border-green-200'
            : tone === 'yellow'
              ? 'bg-yellow-50 border-2 border-yellow-200'
              : 'bg-red-50 border-2 border-red-200'
        const innerBorder =
          tone === 'green' ? 'border-green-100' : tone === 'yellow' ? 'border-yellow-100' : 'border-red-100'
        return (
          <div key={idx} className={`rounded-xl p-6 ${border}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{strategy.strategy}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${getEffectSizeColor(strategy.effectSize)}`}
                  >
                    <EffectSizeGlyph effectSize={strategy.effectSize} />d = {strategy.effectSize}
                  </span>
                </div>
                <p className="text-gray-700 mb-4">{strategy.description}</p>
                <div className={`bg-white rounded-lg p-4 border mb-4 ${innerBorder}`}>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Research Evidence:</p>
                  <p className="text-sm text-gray-700">{strategy.researchEvidence}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Practical Applications:</p>
                  <ul className="space-y-2">
                    {strategy.practicalApplications.map((app, appIdx) => (
                      <li key={appIdx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className={`h-4 w-4 ${checkClass} mt-0.5 flex-shrink-0`} />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className={`bg-gradient-to-r ${gradientClass} rounded-3xl p-8 text-white shadow-xl`}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => navigate('/learning-hub')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    Research Insight
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">{c.heroSubtitle}</span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {c.headerDurationLabel ?? item.duration ?? ''}
                  </span>
                </div>
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <p className="mt-2 text-blue-100">{c.heroDescription}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              {(c.headerBadgeLabels ?? []).map((label, idx) => {
                const BadgeIcon = [Star, Lightbulb, Target][idx % 3] ?? Star
                return (
                  <div key={`${label}-${idx}`} className="flex items-center gap-2">
                    <BadgeIcon className="w-4 h-4" />
                    <span>{label}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Bookmark className="h-5 w-5" />
            </button>
            <button type="button" className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Share2 className="h-5 w-5" />
            </button>
            <button type="button" className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition">
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Sections</h3>
            <div className="space-y-1">
              {body.sidebarNav.map((section) => {
                const Icon = sidebarIcons[section.icon]
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition flex items-center gap-2 ${
                      activeSection === section.id
                        ? 'bg-blue-50 border-2 border-blue-300 text-blue-900'
                        : 'border-2 border-transparent hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{body.overview.sectionTitle}</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">{body.overview.lead}</p>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{body.overview.effectSizeExplainer.title}</h3>
                    <p className="text-gray-700 mb-4">{body.overview.effectSizeExplainer.intro}</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {body.overview.effectSizeExplainer.bands.map((b) => (
                        <div key={b.label} className="bg-white rounded-lg p-4 border border-blue-100">
                          <div className="flex items-center gap-2 mb-2">
                            {bandIcon(b.icon)}
                            <span className="font-semibold text-gray-900">{b.label}</span>
                          </div>
                          <p className="text-sm text-gray-700">{b.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Findings</h3>
                    <ul className="space-y-2">
                      {body.overview.keyFindings.map((finding, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700">
                          <CheckCircle2 className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'high-impact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{body.sections.highImpactTitle}</h2>
                  <p className="text-gray-700 mb-6">{body.sections.highImpactLead}</p>
                  {renderStrategyList(highImpactStrategies, 'green', 'text-green-600')}
                </div>
              </div>
            )}

            {activeSection === 'medium-impact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{body.sections.mediumImpactTitle}</h2>
                  <p className="text-gray-700 mb-6">{body.sections.mediumImpactLead}</p>
                  {renderStrategyList(mediumImpactStrategies, 'yellow', 'text-yellow-600')}
                </div>
              </div>
            )}

            {activeSection === 'low-impact' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{body.sections.lowImpactTitle}</h2>
                  <p className="text-gray-700 mb-6">{body.sections.lowImpactLead}</p>
                  {renderStrategyList(lowImpactStrategies, 'red', 'text-red-600')}
                </div>
              </div>
            )}

            {activeSection === 'implementation' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{body.implementation.title}</h2>
                  <p className="text-gray-700 mb-6">{body.implementation.lead}</p>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Principles for Implementation</h3>
                    <div className="space-y-4">
                      {body.implementation.principles.map((principle) => (
                        <div key={principle.title} className="bg-white rounded-lg p-4 border border-blue-100">
                          <h4 className="font-semibold text-gray-900 mb-2">{principle.title}</h4>
                          <p className="text-sm text-gray-700">{principle.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Action Steps</h3>
                    <ol className="space-y-3">
                      {body.implementation.actionSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EvidenceBasedTeachingResearch() {
  const item = getSectionItemBySlug('research-insights-library', SLUG)
  if (!item?.researchInsightContent) {
    return <Navigate to="/learning-hub" replace />
  }
  return <EvidenceBasedTeachingResearchView item={item} />
}
