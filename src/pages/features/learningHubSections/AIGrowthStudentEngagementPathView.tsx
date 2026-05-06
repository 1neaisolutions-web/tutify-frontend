import type { NavigateFunction } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Lock,
  Play,
  Rocket,
  Share2,
  Sparkles,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  Video,
  Zap,
} from 'lucide-react'
import {
  buildLearningHubSectionPath,
  LearningHubSectionItem,
  resolveAIGrowthPathTheme,
  resolveSkillLabel,
} from '../../../features/learningHub'
import type {
  AIGrowthAchievementRule,
  AIGrowthModuleContent,
  AIGrowthRecommendationPathContent,
} from '../../../features/learningHub/types'

type ModuleWithLock = AIGrowthModuleContent & { locked: boolean }

function evaluateAchievementRule(
  rule: AIGrowthAchievementRule,
  completedModules: string[],
  completedCount: number,
  unlockedAvailableCount: number
): boolean {
  switch (rule.type) {
    case 'minCompleted':
      return completedCount >= rule.count
    case 'moduleCompleted':
      return completedModules.includes(rule.moduleId)
    case 'allUnlockedCompleted':
      return unlockedAvailableCount > 0 && completedCount === unlockedAvailableCount
    default:
      return false
  }
}

function levelPill(level: string) {
  switch (level) {
    case 'Beginner':
      return 'bg-green-100 text-green-700'
    case 'Intermediate':
      return 'bg-blue-100 text-blue-700'
    case 'Advanced':
      return 'bg-purple-100 text-purple-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function impactPill(impact: string) {
  switch (impact) {
    case 'High':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'Medium':
      return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'Low':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export interface AIGrowthStudentEngagementPathViewProps {
  item: LearningHubSectionItem
  content: AIGrowthRecommendationPathContent
  navigate: NavigateFunction
  unlockedModules: ModuleWithLock[]
  activeModule: string | null
  setActiveModule: (id: string | null) => void
  completedModules: string[]
  completedCount: number
  availableModulesCount: number
  progress: number
  markComplete: (moduleId: string) => void
  levelFilter: 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
  setLevelFilter: (v: 'all' | 'Beginner' | 'Intermediate' | 'Advanced') => void
}

const AIGrowthStudentEngagementPathView = ({
  item,
  content,
  navigate,
  unlockedModules,
  activeModule,
  setActiveModule,
  completedModules,
  completedCount,
  availableModulesCount,
  progress,
  markComplete,
  levelFilter,
  setLevelFilter,
}: AIGrowthStudentEngagementPathViewProps) => {
  const t = content.pathTheme ?? resolveAIGrowthPathTheme(content.themeId)
  const extras = content.studentEngagementExtras
  if (!extras) return null

  const filteredModules = unlockedModules.filter((m) => levelFilter === 'all' || m.level === levelFilter)

  const startLearningPath = () => {
    const first = unlockedModules.find((m) => !m.locked)
    if (first) {
      setActiveModule(first.id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className='space-y-6'>
      <div className={`bg-gradient-to-r ${t.headerGradient} rounded-3xl p-8 text-white shadow-xl`}>
        <div className='flex items-start justify-between mb-6'>
          <div className='flex-1'>
            <div className='flex items-center gap-3 mb-4'>
              <button
                type='button'
                onClick={() => navigate('/learning-hub')}
                className='p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition shrink-0'
              >
                <ArrowLeft className='h-5 w-5' />
              </button>
              <div className='min-w-0'>
                <div className='flex flex-wrap items-center gap-2 mb-2'>
                  <span className='px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wide'>{content.heroSubtitle}</span>
                  <span className='text-white/80'>•</span>
                  <span className='text-white/80 text-sm flex items-center gap-1'>
                    <Clock className='h-3 w-3' />
                    {content.estimatedTime} estimated
                  </span>
                </div>
                <h1 className='text-3xl font-bold'>{item.title}</h1>
                <p className={`mt-2 ${t.heroDescriptionClass}`}>{content.heroDescription}</p>
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-4 text-sm'>
              <div className='flex items-center gap-2'>
                <Target className='w-4 h-4 shrink-0' />
                <span>{content.impactLevel} Impact</span>
              </div>
              <div className='flex items-center gap-2'>
                <Trophy className='w-4 h-4 shrink-0' />
                <span>
                  {completedCount} of {availableModulesCount} modules completed
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-4 h-4 shrink-0' />
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
            <div className='mt-4 h-2 bg-white/20 rounded-full overflow-hidden'>
              <div className='h-full bg-white rounded-full transition-all duration-300' style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className={`bg-gradient-to-br ${t.tipPanelBg} rounded-2xl border-2 ${t.tipPanelBorder} p-6 shadow-sm`}>
        <div className='flex items-start gap-4'>
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl text-white flex items-center justify-center ${t.sparklesIconBg}`}>
            <Sparkles className='h-6 w-6' />
          </div>
          <div className='flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-2 mb-2'>
              <h3 className='text-lg font-semibold text-gray-900'>AI-Powered Learning Guidance</h3>
              <span className={t.guidancePersonalizedBadge}>Personalized</span>
            </div>
            <p className='text-sm font-medium text-gray-900 mb-2'>{content.aiGuidance.recommendation}</p>
            <p className='text-sm text-gray-700 mb-4'>{content.aiGuidance.reason}</p>
            <div className={`bg-white rounded-lg p-4 border mb-4 ${t.guidanceTipBoxBorder}`}>
              <p className='text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2'>Personalized Tip</p>
              <p className='text-sm text-gray-700'>{content.aiGuidance.personalizedTip}</p>
            </div>
            <div>
              <p className='text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2'>Your Next Steps</p>
              <ul className='space-y-1'>
                {content.aiGuidance.nextSteps.map((step) => (
                  <li key={step} className='flex items-start gap-2 text-sm text-gray-700'>
                    <ArrowRight className={`h-4 w-4 mt-0.5 flex-shrink-0 ${t.nextStepIconClass}`} />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-bold text-gray-900'>Expected Impact on Your Teaching</h2>
              <TrendingUp className='h-5 w-5 text-green-600 shrink-0' />
            </div>
            <div className='space-y-4'>
              {content.skillImpacts.map((impact, idx) => (
                <div key={`${impact.skillId}-${idx}`} className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium text-gray-700'>{resolveSkillLabel(impact.skillId)}</span>
                    <span className='text-green-600 font-semibold'>+{impact.improvement}%</span>
                  </div>
                  <div className='relative h-3 bg-gray-200 rounded-full overflow-hidden'>
                    <div className='absolute left-0 top-0 h-full bg-gray-400 rounded-full' style={{ width: `${impact.before}%` }} />
                    <div
                      className='absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-1000'
                      style={{ width: `${impact.after}%` }}
                    />
                  </div>
                  <p className='text-xs text-gray-500'>{impact.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-bold text-gray-900'>Learning Modules</h2>
              <div className='flex items-center gap-2'>
                <Filter className='h-4 w-4 text-gray-400 shrink-0' />
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value as 'all' | 'Beginner' | 'Intermediate' | 'Advanced')}
                  className='text-xs border border-gray-300 rounded-lg px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-100'
                >
                  <option value='all'>All Levels</option>
                  <option value='Beginner'>Beginner</option>
                  <option value='Intermediate'>Intermediate</option>
                  <option value='Advanced'>Advanced</option>
                </select>
              </div>
            </div>

            <div className='space-y-4'>
              {filteredModules.map((module) => {
                const isCompleted = completedModules.includes(module.id)
                const isActive = activeModule === module.id
                const originalIndex = content.modules.findIndex((m) => m.id === module.id)

                return (
                  <div
                    key={module.id}
                    className={`rounded-xl border-2 p-6 transition ${
                      isCompleted
                        ? 'bg-green-50 border-green-300'
                        : module.locked
                          ? 'bg-gray-50 border-gray-200 opacity-60'
                          : isActive
                            ? 'bg-amber-50 border-amber-300 shadow-md'
                            : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-sm'
                    }`}
                  >
                    <div className='flex items-start justify-between mb-4'>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 mb-2 flex-wrap'>
                          <span className='flex-shrink-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold'>
                            {originalIndex + 1}
                          </span>
                          <h3 className='text-lg font-bold text-gray-900'>{module.title}</h3>
                          {isCompleted ? <CheckCircle2 className='h-5 w-5 text-green-600 flex-shrink-0' /> : null}
                          {module.locked ? <Lock className='h-5 w-5 text-gray-400 flex-shrink-0' /> : null}
                        </div>
                        <p className='text-sm text-gray-700 ml-10 mb-3'>{module.description}</p>
                        <div className='flex flex-wrap items-center gap-2 ml-10'>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${levelPill(module.level)}`}>{module.level}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${impactPill(module.impact)}`}>{module.impact} Impact</span>
                          <span className='px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1'>
                            <Clock className='h-3 w-3' />
                            {module.duration}
                          </span>
                          <span className='px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold'>{module.assessment.points} points</span>
                        </div>
                      </div>
                    </div>

                    <div className='ml-10 mb-4'>
                      <p className='text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2'>Skills You&apos;ll Gain</p>
                      <div className='flex flex-wrap gap-2'>
                        {module.skillIds.map((skillId) => (
                          <span key={skillId} className='px-2 py-1 rounded bg-white border border-gray-200 text-xs text-gray-700'>
                            {resolveSkillLabel(skillId)}
                          </span>
                        ))}
                      </div>
                    </div>

                    {module.learningOutcomes.length > 0 ? (
                      <div className='ml-10 mb-4'>
                        <p className='text-sm font-semibold text-gray-900 mb-2'>Learning Outcomes</p>
                        <ul className='space-y-1'>
                          {module.learningOutcomes.map((outcome) => (
                            <li key={outcome} className='flex items-start gap-2 text-sm text-gray-700'>
                              <ArrowRight className='h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0' />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {isActive ? (
                      <>
                        {module.content.length > 0 ? (
                          <div className='ml-10 mb-4 bg-white rounded-lg p-5 border border-amber-200'>
                            <p className='text-sm font-semibold text-gray-900 mb-3'>Module Content</p>
                            <div className='space-y-3'>
                              {module.content.map((row, itemIdx) => {
                                const ContentIcon =
                                  row.type === 'video'
                                    ? Video
                                    : row.type === 'reading'
                                      ? BookOpen
                                      : row.type === 'interactive'
                                        ? Zap
                                        : row.type === 'project'
                                          ? Rocket
                                          : FileText
                                return (
                                  <div key={`${row.title}-${itemIdx}`} className='flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200'>
                                    <div className='flex items-center gap-3 min-w-0'>
                                      <ContentIcon className='h-5 w-5 text-amber-600 shrink-0' />
                                      <div className='min-w-0'>
                                        <p className='text-sm font-medium text-gray-900'>{row.title}</p>
                                        {row.duration ? <p className='text-xs text-gray-500'>{row.duration}</p> : null}
                                      </div>
                                    </div>
                                    {row.points ? (
                                      <span className='px-2 py-1 rounded bg-amber-100 text-amber-700 text-xs font-semibold shrink-0'>{row.points} pts</span>
                                    ) : null}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ) : null}
                        <div className='ml-10 mb-4 pt-4 border-t border-gray-200'>
                          <p className='text-sm font-semibold text-gray-900 mb-2'>Assessment</p>
                          <div className='bg-purple-50 rounded-lg p-3 border border-purple-200'>
                            <p className='text-sm font-medium text-gray-900 mb-1'>{module.assessment.type}</p>
                            <p className='text-xs text-gray-700'>{module.assessment.description}</p>
                            <p className='text-xs text-purple-700 font-semibold mt-1'>{module.assessment.points} points</p>
                          </div>
                        </div>
                        <div className='ml-10 mb-4 pt-4 border-t border-gray-200'>
                          <p className='text-sm font-semibold text-gray-900 mb-2'>Real-World Application</p>
                          <p className='text-sm text-gray-700 bg-blue-50 rounded-lg p-3 border border-blue-200'>{module.realWorldApplication}</p>
                        </div>
                      </>
                    ) : null}

                    <div className='ml-10 flex flex-wrap items-center gap-3'>
                      {module.locked ? (
                        <button
                          type='button'
                          disabled
                          className='px-4 py-2 rounded-lg bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed flex items-center gap-2'
                        >
                          <Lock className='h-4 w-4' />
                          {originalIndex === 3 ? 'Locked - Complete first 3 modules to unlock' : 'Locked - Complete previous module to unlock'}
                        </button>
                      ) : isCompleted ? (
                        <button
                          type='button'
                          onClick={() => setActiveModule(isActive ? null : module.id)}
                          className='px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 flex items-center gap-2'
                        >
                          <Eye className='h-4 w-4' />
                          Review Module
                        </button>
                      ) : (
                        <>
                          <button
                            type='button'
                            onClick={() => {
                              if (isActive) {
                                setActiveModule(null)
                              } else {
                                navigate(buildLearningHubSectionPath('ai-growth-recommendations', module.slug))
                              }
                            }}
                            className='px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 flex items-center gap-2'
                          >
                            {isActive ? (
                              <>
                                <Eye className='h-4 w-4' />
                                Hide Details
                              </>
                            ) : (
                              <>
                                <Play className='h-4 w-4' />
                                Start Module
                              </>
                            )}
                          </button>
                          <button
                            type='button'
                            onClick={() => markComplete(module.id)}
                            className='px-4 py-2 rounded-lg border-2 border-green-600 text-green-600 text-sm font-semibold hover:bg-green-50 flex items-center gap-2'
                          >
                            <CheckCircle2 className='h-4 w-4' />
                            Mark Complete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className='lg:col-span-1 space-y-6'>
          <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Your Progress</h3>
            <div className='space-y-4'>
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-gray-700'>Overall Completion</span>
                  <span className='text-sm font-bold text-amber-600'>{Math.round(progress)}%</span>
                </div>
                <div className='h-3 bg-gray-200 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300'
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-200'>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-gray-900'>{completedCount}</p>
                  <p className='text-xs text-gray-600'>Completed</p>
                </div>
                <div className='text-center'>
                  <p className='text-2xl font-bold text-gray-900'>{availableModulesCount - completedCount}</p>
                  <p className='text-xs text-gray-600'>Remaining</p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl border border-gray-200 p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
              <Trophy className='h-5 w-5 text-amber-600' />
              Achievements
            </h3>
            <div className='space-y-3'>
              {extras.achievements.map((badge) => {
                const earned = evaluateAchievementRule(badge.rule, completedModules, completedCount, availableModulesCount)
                return (
                  <div
                    key={badge.name}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      earned ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    {earned ? <Award className='h-5 w-5 text-amber-600 flex-shrink-0' /> : <Circle className='h-5 w-5 text-gray-400 flex-shrink-0' />}
                    <div className='flex-1 min-w-0'>
                      <p className={`text-sm font-semibold ${earned ? 'text-gray-900' : 'text-gray-500'}`}>{badge.name}</p>
                      <p className='text-xs text-gray-600'>{badge.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className='bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Quick Actions</h3>
            <div className='space-y-2'>
              <button
                type='button'
                className='w-full text-left px-4 py-3 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 transition flex items-center gap-2'
              >
                <Download className='h-4 w-4 text-amber-600' />
                <span className='text-sm font-medium text-gray-900'>Download Certificate</span>
              </button>
              <button
                type='button'
                className='w-full text-left px-4 py-3 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 transition flex items-center gap-2'
              >
                <Share2 className='h-4 w-4 text-amber-600' />
                <span className='text-sm font-medium text-gray-900'>Share Progress</span>
              </button>
              <button
                type='button'
                className='w-full text-left px-4 py-3 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 transition flex items-center gap-2'
              >
                <Settings className='h-4 w-4 text-amber-600' />
                <span className='text-sm font-medium text-gray-900'>Customize Path</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white'>
        <div className='text-center'>
          <h3 className='text-2xl font-bold mb-2'>{extras.bottomCta.title}</h3>
          <p className='text-amber-100 mb-6'>{extras.bottomCta.subtitle}</p>
          <div className='flex flex-wrap gap-3 justify-center'>
            <button
              type='button'
              onClick={startLearningPath}
              className='rounded-full bg-white px-6 py-3 text-sm font-semibold text-amber-600 hover:bg-amber-50 transition flex items-center gap-2'
            >
              <Rocket className='h-4 w-4' />
              {extras.bottomCta.primaryLabel}
            </button>
            <button
              type='button'
              onClick={() => navigate('/learning-hub')}
              className='rounded-full border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition'
            >
              {extras.bottomCta.secondaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIGrowthStudentEngagementPathView
