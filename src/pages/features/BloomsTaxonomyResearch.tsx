import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { getSectionItemBySlug } from '../../features/learningHub'
import type { LearningHubSectionItem } from '../../features/learningHub/types'
import type { BloomsTaxonomyBody } from '../../features/learningHub/content/researchInsightBodies/bloomsTaxonomyBody'
import {
  ArrowLeft,
  Clock,
  FileText,
  Lightbulb,
  Target,
  CheckCircle2,
  Star,
  Download,
  Share2,
  Bookmark,
  Eye,
  Zap,
  Layers,
} from 'lucide-react'

const BLOOMS_SLUG = 'blooms-taxonomy'

const sidebarIcons = {
  Eye,
  Layers,
  Target,
  FileText,
  Zap,
} as const

export function BloomsTaxonomyResearchView({ item }: { item: LearningHubSectionItem }) {
  const navigate = useNavigate()
  const c = item.researchInsightContent
  const body = (c?.payload ?? null) as BloomsTaxonomyBody | null
  if (!c || !body) return null

  const [activeSection, setActiveSection] = useState<string>(body.sidebarNav[0]?.id ?? 'overview')
  const gradientClass =
    c.headerGradientClass ?? 'from-purple-600 via-indigo-600 to-blue-600'
  const heroSubtitleClass = 'text-purple-100'

  const cognitiveLevels = body.cognitiveLevels
  const lessonExamples = body.lessonExamples
  const researchEvidence = body.researchEvidence
  const quickTips = body.quickTips

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
                <p className={`mt-2 ${heroSubtitleClass}`}>{c.heroDescription}</p>
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
                        ? 'bg-purple-50 border-2 border-purple-300 text-purple-900'
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
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{body.overview.sectionTitle}</h2>
                <div className="prose prose-lg max-w-none">
                  {body.overview.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)} className="text-gray-700 leading-relaxed mb-4 last:mb-6">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                    Why It Matters
                  </h3>
                  <ul className="space-y-2">
                    {body.overview.whyItMatters.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {researchEvidence.map((evidence, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold text-gray-900">{evidence.finding}</h4>
                        <Star className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      </div>
                      <p className="text-xs text-gray-600 mb-2 italic">{evidence.source}</p>
                      <p className="text-sm text-gray-700 mb-3">{evidence.evidence}</p>
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Practical Tip:</p>
                        <p className="text-xs text-gray-700">{evidence.practicalTip}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    Quick Tips for Success
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'levels' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">The Six Cognitive Levels</h2>
                <div className="space-y-6">
                  {cognitiveLevels.map((level, idx) => (
                    <div
                      key={level.level}
                      className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                              {idx + 1}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900">{level.level}</h3>
                            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                              {level.verb}
                            </span>
                          </div>
                          <p className="text-gray-700 ml-10">{level.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Example Verbs</h4>
                          <div className="flex flex-wrap gap-2">
                            {level.exampleVerbs.map((verb, verbIdx) => (
                              <span
                                key={verbIdx}
                                className="px-2 py-1 rounded bg-white text-xs font-medium text-blue-700 border border-blue-200"
                              >
                                {verb}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Classroom Examples</h4>
                          <ul className="space-y-1">
                            {level.classroomExamples.slice(0, 3).map((example, exIdx) => (
                              <li key={exIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                <span className="text-green-600 mt-0.5">•</span>
                                <span>{example}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Assessment Ideas</h4>
                          <ul className="space-y-1">
                            {level.assessmentIdeas.map((idea, ideaIdx) => (
                              <li key={ideaIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span>{idea}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Modern Applications</h4>
                          <ul className="space-y-1">
                            {level.modernApplications.map((app, appIdx) => (
                              <li key={appIdx} className="text-xs text-gray-700 flex items-start gap-1">
                                <Zap className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                                <span>{app}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'applications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Practical Classroom Applications</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Planning Framework</h3>
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                    <ol className="space-y-3">
                      {body.applications.lessonPlanningSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Real Classroom Examples</h3>
                  <div className="space-y-4">
                    {lessonExamples.map((example, idx) => (
                      <div key={idx} className="rounded-xl border-2 border-gray-200 bg-white p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                                {example.subject}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                {example.grade}
                              </span>
                              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                                {example.bloomLevel}
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-gray-900">{example.objective}</h4>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Activities</h5>
                          <ul className="space-y-2">
                            {example.activities.map((activity, actIdx) => (
                              <li key={actIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                <CheckCircle2 className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                          <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Assessment</h5>
                          <p className="text-sm text-gray-700">{example.assessment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Differentiation Strategies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {body.applications.differentiationStrategies.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-green-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.strategy}</h4>
                        <p className="text-xs text-gray-600 mb-2">{item.description}</p>
                        <p className="text-xs text-gray-700 italic">{item.example}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'assessment' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment Design with Bloom&apos;s Taxonomy</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">The Golden Rule</h3>
                  <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-300">
                    <p className="text-base font-semibold text-gray-900 mb-2">{body.assessment.goldenRuleLead}</p>
                    <p className="text-sm text-gray-700">{body.assessment.goldenRuleSupport}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Stems by Level</h3>
                  <div className="space-y-4">
                    {cognitiveLevels.map((level, idx) => (
                      <div key={idx} className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                            {level.level}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {level.assessmentIdeas.map((idea, ideaIdx) => (
                            <div key={ideaIdx} className="bg-white rounded-lg p-3 border border-gray-200">
                              <p className="text-sm text-gray-700">{idea}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Alignment Checklist</h3>
                  <ul className="space-y-2">
                    {body.assessment.checklist.map((checkItem, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{checkItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'modern' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{body.modern.pageTitle}</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{body.modern.digitalTitle}</h3>
                  <p className="text-gray-700 mb-4">{body.modern.digitalIntro}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {body.modern.digitalLevels.map((row, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">{row.level}</h4>
                        <p className="text-xs text-gray-600 mb-1">Digital Skills:</p>
                        <p className="text-sm text-gray-700 mb-2">{row.digital}</p>
                        <p className="text-xs text-gray-600 mb-1">Tools:</p>
                        <p className="text-sm text-gray-700">{row.tools}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrating Technology</h3>
                  <div className="space-y-3">
                    {body.modern.integrationTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Zap className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{body.cta.title}</h3>
          <p className="text-purple-100 mb-6">{body.cta.description}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => navigate(body.cta.primaryPath)}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-purple-600 hover:bg-purple-50 transition"
            >
              {body.cta.primaryLabel}
            </button>
            <button
              type="button"
              onClick={() => navigate(body.cta.secondaryPath)}
              className="rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
            >
              {body.cta.secondaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BloomsTaxonomyResearch() {
  const item = getSectionItemBySlug('research-insights-library', BLOOMS_SLUG)
  if (!item?.researchInsightContent) {
    return <Navigate to="/learning-hub" replace />
  }
  return <BloomsTaxonomyResearchView item={item} />
}
