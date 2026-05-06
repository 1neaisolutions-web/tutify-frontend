import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getSectionItemBySlug } from '../../features/learningHub'
import type { LearningHubSectionItem } from '../../features/learningHub/types'
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Target,
  Lightbulb,
  Brain,
  BookOpen,
  FileText,
  Video,
  Download,
  Share2,
  Star,
  MessageSquare,
  Eye,
  BarChart3,
  Award,
  X,
  SkipForward,
  SkipBack,
  Volume2,
  AlertTriangle,
  Pause,
  Maximize2,
  Settings,
} from 'lucide-react'
import { youtubeWatchUrlToEmbedUrl, type LearningHubMediaVideo } from '../../features/learningHub/contentModel'
import { useTutorialProgress } from '../../hooks/useTutorialProgress'

interface ClassroomExample {
  scenario: string
  challenge: string
  differentiationStrategy: string
  implementation: string[]
  results: string
  studentFeedback: string[]
}

export function DifferentiationTutorialView({ item }: { item: LearningHubSectionItem }) {
  const navigate = useNavigate()
  const location = useLocation()
  const contentId =
    (location.state as { content_id?: string; contentId?: string } | null)?.content_id ||
    (location.state as { content_id?: string; contentId?: string } | null)?.contentId ||
    item.slug ||
    'ui-tutorial-differentiation-in-action'
  const [showTranscript, setShowTranscript] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const {
    currentStep,
    completedSteps,
    hydrated,
    setStep,
    goNext,
    goPrev,
    finishTutorial,
  } = useTutorialProgress({
    contentId,
    contentType: 'ai_guided_tutorial',
    totalSteps: item.aiGuidedTutorialContent?.steps?.length ?? 1,
  })

  const c = item.aiGuidedTutorialContent!
  const tutorialSteps = c.steps


  const currentStepData = tutorialSteps[currentStep]
  const progress = ((completedSteps.length + (currentStep > 0 ? 1 : 0)) / tutorialSteps.length) * 100

  const handleNext = () => {
    if (currentStep >= tutorialSteps.length - 1) {
      void finishTutorial().then(() => navigate('/learning-hub'))
      return
    }
    goNext()
  }

  const handlePrevious = () => {
    goPrev()
  }

  const handleStepClick = (stepIndex: number) => {
    setStep(stepIndex)
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-sm text-gray-600">
        Restoring your tutorial progress…
      </div>
    )
  }

  return (
    <div className="space-y-6" data-page-kind="tutorial" data-content-id={contentId || ''} data-content-type="ai_guided_tutorial">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate('/learning-hub')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide">
                    {c.heroSubtitle}
                  </span>
                  <span className="text-white/80">•</span>
                  <span className="text-white/80 text-sm">{currentStepData.duration}</span>
                </div>
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <p className="mt-2 text-blue-100">
                  {c.heroDescription}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Progress: {Math.round(progress)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
              </div>
            </div>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Step Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600 mb-4">Tutorial Steps</h3>
            <div className="space-y-2">
              {tutorialSteps.map((step, idx) => {
                const isActive = idx === currentStep
                const isCompleted = completedSteps.includes(idx)

                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(idx)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      isActive
                        ? 'bg-blue-50 border-2 border-blue-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-semibold">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${
                          isActive ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.duration}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* Step Header */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
                    <span>•</span>
                    <span>{currentStepData.duration}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <FileText className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Based on Type */}
            {currentStepData.content.type === 'video' && (
              <div className="space-y-6">
                {(() => {
                  const vd = currentStepData.content.data as {
                    media?: LearningHubMediaVideo
                  }
                  const media = vd.media
                  const ytEmbed =
                    media?.provider === 'youtube' && media.url ? youtubeWatchUrlToEmbedUrl(media.url) : null
                  if (ytEmbed) {
                    return (
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={`${ytEmbed}?rel=0`}
                          title={media?.title ?? currentStepData.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    )
                  }
                  if (media?.provider === 'mp4' && media.url) {
                    return (
                      <video
                        className="aspect-video w-full rounded-xl bg-black"
                        controls={media.controls !== false}
                        src={media.url}
                        title={media.title}
                      />
                    )
                  }
                  return (
                    <div className="relative aspect-video rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition"
                        >
                          {isPlaying ? (
                            <Pause className="h-10 w-10" />
                          ) : (
                            <Play className="h-10 w-10 ml-1" />
                          )}
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-white w-1/3 rounded-full" />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-white text-xs">
                          <span>0:00</span>
                          <span>{currentStepData.duration}</span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button type="button" className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30">
                          <Maximize2 className="h-4 w-4" />
                        </button>
                        <button type="button" className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })()}

                {currentStepData.content.data.description && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Video</h3>
                    <p className="text-sm text-gray-700">{currentStepData.content.data.description}</p>
                  </div>
                )}

                {currentStepData.content.data.keyPoints && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {currentStepData.content.data.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {currentStepData.content.type === 'example' && (() => {
              const d = currentStepData.content.data as Record<string, unknown>
              const classroom = d.classroom as
                | { grade?: unknown; subject?: unknown; students?: unknown; diversity?: unknown }
                | undefined
              const exampleList = Array.isArray(d.examples) ? d.examples : null

              const isDifferentiationCaseCard = (ex: Record<string, unknown>) =>
                ex.differentiationStrategy != null && Array.isArray(ex.implementation)

              return (
                <div className="space-y-6">
                  {exampleList && exampleList.length > 0
                    ? exampleList.map((raw, idx) => {
                        const example = raw as Record<string, unknown>
                        if (isDifferentiationCaseCard(example)) {
                          const ex = example as unknown as ClassroomExample
                          return (
                            <div key={idx} className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6">
                              <div className="mb-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{ex.scenario}</h3>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <span className="px-3 py-1 rounded-full bg-white text-indigo-700 text-xs font-semibold">
                                    {ex.challenge}
                                  </span>
                                </div>
                              </div>

                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                                  Differentiation Strategy
                                </h4>
                                <p className="text-gray-900 font-medium">{ex.differentiationStrategy}</p>
                              </div>

                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                                  Implementation
                                </h4>
                                <ul className="space-y-2">
                                  {ex.implementation.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
                                        {itemIdx + 1}
                                      </span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="mb-4 bg-white rounded-lg p-4 border border-indigo-200">
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Results</h4>
                                <p className="text-gray-900">{ex.results}</p>
                              </div>

                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                                  Student Feedback
                                </h4>
                                <div className="space-y-2">
                                  {ex.studentFeedback.map((feedback, feedbackIdx) => (
                                    <div key={feedbackIdx} className="bg-white rounded-lg p-3 border border-indigo-200">
                                      <div className="flex items-start gap-2">
                                        <MessageSquare className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-gray-700 italic">"{feedback}"</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )
                        }

                        return (
                          <div key={idx} className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6">
                            {example.scenario ? (
                              <h3 className="text-lg font-bold text-gray-900 mb-3">{String(example.scenario)}</h3>
                            ) : null}
                            <div className="space-y-2 text-sm text-gray-800">
                              {example.task ? (
                                <p>
                                  <span className="font-semibold">Task: </span>
                                  {String(example.task)}
                                </p>
                              ) : null}
                              {example.output ? (
                                <p>
                                  <span className="font-semibold">Output: </span>
                                  {String(example.output)}
                                </p>
                              ) : null}
                              {example.result ? (
                                <p>
                                  <span className="font-semibold">Result: </span>
                                  {String(example.result)}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        )
                      })
                    : null}

                  {!exampleList && classroom ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Classroom Context</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Grade</p>
                            <p className="text-sm font-semibold text-gray-900">{String(classroom.grade ?? '—')}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Subject</p>
                            <p className="text-sm font-semibold text-gray-900">{String(classroom.subject ?? '—')}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Students</p>
                            <p className="text-sm font-semibold text-gray-900">{String(classroom.students ?? '—')}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Diversity</p>
                            <p className="text-sm font-semibold text-gray-900">{String(classroom.diversity ?? '—')}</p>
                          </div>
                        </div>
                      </div>

                      {d.challenge ? (
                        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Challenge</h3>
                          <p className="text-gray-700">{String(d.challenge)}</p>
                        </div>
                      ) : null}

                      {d.approach ? (
                        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Approach</h3>
                          <p className="text-gray-700">{String(d.approach)}</p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )
            })()}

            {currentStepData.content.type === 'interactive' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                  {currentStepData.content.data.strategy && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentStepData.content.data.strategy}</h3>
                  )}
                  
                  {/* Handle examples that are objects (with scenario property) */}
                  {currentStepData.content.data.examples && 
                   Array.isArray(currentStepData.content.data.examples) && 
                   currentStepData.content.data.examples.length > 0 &&
                   typeof currentStepData.content.data.examples[0] === 'object' &&
                   currentStepData.content.data.examples[0].scenario && (
                    <div className="space-y-4 mb-6">
                      {currentStepData.content.data.examples.map((example: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-5 border border-purple-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">{example.scenario}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {example.tier1 && (
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <p className="text-xs font-semibold text-blue-700 mb-1">Tier 1</p>
                                <p className="text-sm text-gray-700">{example.tier1}</p>
                              </div>
                            )}
                            {example.tier2 && (
                              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                                <p className="text-xs font-semibold text-green-700 mb-1">Tier 2</p>
                                <p className="text-sm text-gray-700">{example.tier2}</p>
                              </div>
                            )}
                            {example.tier3 && (
                              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                <p className="text-xs font-semibold text-purple-700 mb-1">Tier 3</p>
                                <p className="text-sm text-gray-700">{example.tier3}</p>
                              </div>
                            )}
                            {example.visual && (
                              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                                <p className="text-xs font-semibold text-amber-700 mb-1">Visual Learner</p>
                                <p className="text-sm text-gray-700">{example.visual}</p>
                              </div>
                            )}
                            {example.kinesthetic && (
                              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                                <p className="text-xs font-semibold text-red-700 mb-1">Kinesthetic Learner</p>
                                <p className="text-sm text-gray-700">{example.kinesthetic}</p>
                              </div>
                            )}
                            {example.auditory && (
                              <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                                <p className="text-xs font-semibold text-cyan-700 mb-1">Auditory Learner</p>
                                <p className="text-sm text-gray-700">{example.auditory}</p>
                              </div>
                            )}
                            {example.reading && (
                              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                                <p className="text-xs font-semibold text-indigo-700 mb-1">Reading/Writing Learner</p>
                                <p className="text-sm text-gray-700">{example.reading}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {currentStepData.content.data.examples &&
                    Array.isArray(currentStepData.content.data.examples) &&
                    currentStepData.content.data.examples.length > 0 &&
                    typeof currentStepData.content.data.examples[0] === 'object' &&
                    (currentStepData.content.data.examples[0] as { weak?: string }).weak != null &&
                    (currentStepData.content.data.examples[0] as { strong?: string }).strong != null && (
                    <div className="space-y-4 mb-6">
                      {(currentStepData.content.data.examples as Array<{ weak: string; strong: string }>).map(
                        (pair, idx: number) => (
                          <div key={idx} className="grid gap-3 md:grid-cols-2 rounded-lg border border-purple-200 bg-white p-4">
                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Weak</p>
                              <p className="text-sm text-gray-800">{pair.weak}</p>
                            </div>
                            <div className="rounded-lg bg-purple-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-purple-800 mb-1">Strong</p>
                              <p className="text-sm font-medium text-purple-900">{pair.strong}</p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {currentStepData.content.data.examples &&
                    Array.isArray(currentStepData.content.data.examples) &&
                    currentStepData.content.data.examples.length > 0 &&
                    typeof currentStepData.content.data.examples[0] === 'object' &&
                    Array.isArray((currentStepData.content.data.examples[0] as { roles?: string[] }).roles) && (
                    <div className="space-y-4 mb-6">
                      {(currentStepData.content.data.examples as Array<{ roles: string[]; benefit?: string }>).map(
                        (ex, idx: number) => (
                          <div key={idx} className="rounded-lg border border-purple-200 bg-white p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">Roles</p>
                            <ul className="mb-3 flex flex-wrap gap-2">
                              {ex.roles.map((role: string, rIdx: number) => (
                                <li
                                  key={rIdx}
                                  className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-900"
                                >
                                  {role}
                                </li>
                              ))}
                            </ul>
                            {ex.benefit ? (
                              <p className="text-sm text-gray-800">
                                <span className="font-semibold text-gray-900">Why it works: </span>
                                {ex.benefit}
                              </p>
                            ) : null}
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Handle examples that are strings (product options) */}
                  {currentStepData.content.data.examples && 
                   Array.isArray(currentStepData.content.data.examples) && 
                   currentStepData.content.data.examples.length > 0 &&
                   typeof currentStepData.content.data.examples[0] === 'string' && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Product Options</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {currentStepData.content.data.examples.map((option: string, optIdx: number) => (
                          <div key={optIdx} className="bg-white rounded-lg p-4 border border-purple-200 text-sm text-gray-700 shadow-sm hover:shadow-md transition">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-purple-600 flex-shrink-0" />
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rubrics info */}
                  {currentStepData.content.data.rubrics && (
                    <div className="mb-6 bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2">Rubric Guidelines</h4>
                      <p className="text-sm text-gray-700">{currentStepData.content.data.rubrics}</p>
                    </div>
                  )}

                  {currentStepData.content.data.implementation && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Implementation Steps</h4>
                      <ul className="space-y-2">
                        {currentStepData.content.data.implementation.map((step: string, stepIdx: number) => (
                          <li key={stepIdx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentStepData.content.data.steps && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Action Steps</h4>
                      <ol className="space-y-2">
                        {currentStepData.content.data.steps.map((step: string, stepIdx: number) => (
                          <li key={stepIdx} className="flex items-start gap-3 text-sm text-gray-700">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                              {stepIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {currentStepData.content.data.resources && (
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Resources</h4>
                      <ul className="space-y-2">
                        {currentStepData.content.data.resources.map((resource: string, resIdx: number) => (
                          <li key={resIdx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Download className="h-4 w-4 text-purple-600" />
                            <span>{resource}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStepData.content.type === 'text' && (
              <div className="space-y-6">
                {currentStepData.content.data.strategies && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategies</h3>
                    <ul className="space-y-3">
                      {currentStepData.content.data.strategies.map((strategy: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentStepData.content.data.tools && (
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Tools</h3>
                    <ul className="space-y-2">
                      {currentStepData.content.data.tools.map((tool: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <FileText className="h-4 w-4 text-green-600" />
                          <span>{tool}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentStepData.content.data.challenges && (
                  <div className="space-y-4">
                    {currentStepData.content.data.challenges.map((challenge: any, idx: number) => (
                      <div key={idx} className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                        <h4 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-600" />
                          {challenge.challenge}
                        </h4>
                        <div className="bg-white rounded-lg p-4 border border-amber-200 mt-3">
                          <p className="text-sm font-semibold text-gray-700 mb-1">Solution:</p>
                          <p className="text-sm text-gray-700">{challenge.solution}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!currentStepData.content.data.strategies && 
                 !currentStepData.content.data.tools && 
                 !currentStepData.content.data.challenges && (
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                    <p className="text-sm text-gray-600">Content coming soon...</p>
                  </div>
                )}
              </div>
            )}

            {/* Fallback for any unhandled content types */}
            {currentStepData.content.type !== 'video' && 
             currentStepData.content.type !== 'example' && 
             currentStepData.content.type !== 'interactive' && 
             currentStepData.content.type !== 'text' && (
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                <p className="text-sm text-gray-600">Content type not recognized. Please contact support.</p>
              </div>
            )}

            {/* Key Takeaways */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                Key Takeaways
              </h3>
              <ul className="space-y-2">
                {currentStepData.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <Star className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reflection Prompt */}
            <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                Reflection
              </h3>
              <p className="text-gray-700 mb-4">{currentStepData.reflection}</p>
              <textarea
                placeholder="Type your reflection here..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <Star className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Complete tutorial' : 'Next step'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Completion Message */}
          {currentStep === tutorialSteps.length - 1 && completedSteps.includes(currentStep) && (
            <div className="mt-6 rounded-2xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{c.completionTitle ?? 'Congratulations!'}</h3>
              <p className="text-gray-700 mb-6">
                {c.completionBody ?? "You've completed the Differentiation in Action tutorial."}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/learning-hub')}
                  className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Back to Learning Hub
                </button>
                <button className="rounded-full border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Download Certificate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DifferentiationTutorial() {
  const item = getSectionItemBySlug('ai-guided-tutorials-demonstrations', 'differentiation-in-action')
  if (!item?.aiGuidedTutorialContent) return null
  return <DifferentiationTutorialView item={item} />
}

