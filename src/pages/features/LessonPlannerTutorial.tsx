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
  Maximize2,
  Settings,
  Sparkles,
  Layers,
  Pause,
} from 'lucide-react'
import { youtubeWatchUrlToEmbedUrl, type LearningHubMediaVideo } from '../../features/learningHub/contentModel'
import { useTutorialProgress } from '../../hooks/useTutorialProgress'

export function LessonPlannerTutorialView({ item }: { item: LearningHubSectionItem }) {
  const navigate = useNavigate()
  const location = useLocation()
  const contentId =
    (location.state as { content_id?: string; contentId?: string } | null)?.content_id ||
    (location.state as { content_id?: string; contentId?: string } | null)?.contentId ||
    item.slug ||
    'ui-tutorial-mastering-lesson-planner-template'
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
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 rounded-3xl p-8 text-white shadow-xl">
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
                  <span className="text-white/80 text-sm">{c.headerDurationLabel ?? item.duration}</span>
                </div>
                <h1 className="text-3xl font-bold">{item.title}</h1>
                <p className="mt-2 text-amber-100">
                  {c.heroDescription}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
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
                        ? 'bg-amber-50 border-2 border-amber-300'
                        : 'border-2 border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-green-100 text-green-600'
                          : isActive
                          ? 'bg-amber-100 text-amber-600'
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
                          isActive ? 'text-amber-900' : 'text-gray-900'
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
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {currentStepData.content.data.keyPoints.map((point: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
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

              return (
                <div className="space-y-6">
                  {classroom ? (
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
                  ) : null}

                  {exampleList && exampleList.length > 0 ? (
                    <div className="space-y-4">
                      {exampleList.map((ex: Record<string, unknown>, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-6 border border-amber-200 shadow-sm">
                          {ex.scenario ? (
                            <h4 className="text-base font-semibold text-gray-900 mb-3">{String(ex.scenario)}</h4>
                          ) : null}
                          <div className="space-y-2 text-sm text-gray-700">
                            {ex.task ? (
                              <p>
                                <span className="font-semibold text-gray-900">Task: </span>
                                {String(ex.task)}
                              </p>
                            ) : null}
                            {ex.output ? (
                              <p>
                                <span className="font-semibold text-gray-900">Output: </span>
                                {String(ex.output)}
                              </p>
                            ) : null}
                            {ex.result ? (
                              <p>
                                <span className="font-semibold text-gray-900">Result: </span>
                                {String(ex.result)}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}

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
              )
            })()}

            {currentStepData.content.type === 'interactive' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
                  {currentStepData.content.data.strategy && (
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">{currentStepData.content.data.strategy}</h3>
                  )}
                  
                  {currentStepData.content.data.examples && 
                   Array.isArray(currentStepData.content.data.examples) && 
                   currentStepData.content.data.examples.length > 0 &&
                   typeof currentStepData.content.data.examples[0] === 'object' &&
                   currentStepData.content.data.examples[0].scenario && (
                    <div className="space-y-4 mb-6">
                      {currentStepData.content.data.examples.map((example: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-5 border border-amber-200">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">{example.scenario}</h4>
                          <div className="space-y-2">
                            {example.grade && (
                              <p className="text-sm text-gray-700"><span className="font-semibold">Grade:</span> {example.grade}</p>
                            )}
                            {example.subject && (
                              <p className="text-sm text-gray-700"><span className="font-semibold">Subject:</span> {example.subject}</p>
                            )}
                            {example.topic && (
                              <p className="text-sm text-gray-700"><span className="font-semibold">Topic:</span> {example.topic}</p>
                            )}
                            {example.duration && (
                              <p className="text-sm text-gray-700"><span className="font-semibold">Duration:</span> {example.duration}</p>
                            )}
                            {example.tip && (
                              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                <p className="text-xs font-semibold text-amber-800 mb-1">💡 Tip</p>
                                <p className="text-sm text-amber-700">{example.tip}</p>
                              </div>
                            )}
                            {example.objectives && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Learning Objectives</p>
                                <ul className="space-y-1">
                                  {example.objectives.map((obj: string, objIdx: number) => (
                                    <li key={objIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                      <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                      <span>{obj}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {example.options && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Options</p>
                                <div className="space-y-1">
                                  {example.options.map((opt: string, optIdx: number) => (
                                    <p key={optIdx} className="text-sm text-gray-700">• {opt}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                            {example.materials && (
                              <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Materials</p>
                                <div className="flex flex-wrap gap-2">
                                  {example.materials.map((mat: string, matIdx: number) => (
                                    <span key={matIdx} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">{mat}</span>
                                  ))}
                                </div>
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
                          <div key={idx} className="grid gap-3 md:grid-cols-2 rounded-lg border border-amber-200 bg-white p-4">
                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Weak</p>
                              <p className="text-sm text-gray-800">{pair.weak}</p>
                            </div>
                            <div className="rounded-lg bg-amber-50 p-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800 mb-1">Strong</p>
                              <p className="text-sm font-medium text-amber-900">{pair.strong}</p>
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
                          <div key={idx} className="rounded-lg border border-amber-200 bg-white p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600 mb-2">Roles</p>
                            <ul className="mb-3 flex flex-wrap gap-2">
                              {ex.roles.map((role: string, rIdx: number) => (
                                <li
                                  key={rIdx}
                                  className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900"
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

                  {currentStepData.content.data.implementation && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Implementation Steps</h4>
                      <ul className="space-y-2">
                        {currentStepData.content.data.implementation.map((step: string, stepIdx: number) => (
                          <li key={stepIdx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
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
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold">
                              {stepIdx + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {currentStepData.content.data.resources && (
                    <div className="bg-white rounded-lg p-4 border border-amber-200">
                      <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Resources</h4>
                      <ul className="space-y-2">
                        {currentStepData.content.data.resources.map((resource: string, resIdx: number) => (
                          <li key={resIdx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Download className="h-4 w-4 text-amber-600" />
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
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategies</h3>
                    <ul className="space-y-3">
                      {currentStepData.content.data.strategies.map((strategy: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <span>{strategy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentStepData.content.data.tools && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tools & Examples</h3>
                    <div className="space-y-2 text-sm text-gray-700 whitespace-pre-line">
                      {currentStepData.content.data.tools.map((tool: string, idx: number) => (
                        <p key={idx}>{tool}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Key Takeaways */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {currentStepData.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reflection */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Reflection
                </h3>
                <p className="text-sm text-gray-700">{currentStepData.reflection}</p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white text-sm font-semibold rounded-full hover:bg-amber-700 transition"
              >
                {currentStep === tutorialSteps.length - 1 ? 'Complete tutorial' : 'Next step'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LessonPlannerTutorial() {
  const item = getSectionItemBySlug('ai-guided-tutorials-demonstrations', 'mastering-lesson-planner-template')
  if (!item?.aiGuidedTutorialContent) return null
  return <LessonPlannerTutorialView item={item} />
}

