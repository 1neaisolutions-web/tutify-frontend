import {
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Zap,
  Star,
  ArrowUpRight,
  Calendar,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useTranslation } from 'react-i18next'

const overallStats = {
  overallProgress: 68,
  coursesCompleted: 12,
  coursesInProgress: 5,
  totalHours: 24.5,
  certificatesEarned: 2,
  currentStreak: 5,
  weeklyGoal: 3,
  weeklyCompleted: 2,
}

const SKILL_AREA_CONFIG = [
  { key: 'classroomManagement', progress: 85, completed: 3, total: 4, statusKey: 'strong', color: 'green' },
  { key: 'assessmentStrategies', progress: 100, completed: 4, total: 4, statusKey: 'complete', color: 'green' },
  { key: 'differentiation', progress: 45, completed: 2, total: 5, statusKey: 'needsFocus', color: 'amber' },
  { key: 'studentEngagement', progress: 30, completed: 1, total: 4, statusKey: 'needsFocus', color: 'amber' },
  { key: 'digitalLiteracyAi', progress: 20, completed: 1, total: 6, statusKey: 'needsFocus', color: 'red' },
] as const

const FOCUS_AREA_CONFIG = [
  { key: 'digitalLiteracyAi', priorityKey: 'high', estimatedTimeKey: 'hours4', courses: 5 },
  { key: 'studentEngagement', priorityKey: 'high', estimatedTimeKey: 'hours3', courses: 3 },
  { key: 'differentiation', priorityKey: 'medium', estimatedTimeKey: 'hours2_5', courses: 3 },
] as const

const ACHIEVEMENT_CONFIG = [
  { key: 'assessmentMastery', date: '2024-02-20', typeKey: 'certificate' },
  { key: 'learningStreak', date: '2024-02-19', typeKey: 'milestone' },
  { key: 'coursesCompleted', date: '2024-02-15', typeKey: 'milestone' },
] as const

const MONTHLY_PROGRESS_CONFIG = [
  { weekKey: 'week1', completed: 3, goal: 3 },
  { weekKey: 'week2', completed: 4, goal: 3 },
  { weekKey: 'week3', completed: 2, goal: 3 },
  { weekKey: 'week4', completed: 3, goal: 3 },
] as const

const INSIGHT_CONFIG = [
  { key: 'completionRate', valueKey: 'completionRate', positive: true },
  { key: 'learningVelocity', valueKey: 'learningVelocity', positive: true },
  { key: 'skillBalance', valueKey: 'skillBalance', positive: false },
] as const

const Personalization = () => {
  const { t } = useTranslation()

  const skillAreas = SKILL_AREA_CONFIG.map((area) => ({
    ...area,
    category: t(`personalizationPage.skillAreas.${area.key}`),
    status: t(`personalizationPage.skillStatuses.${area.statusKey}`),
  }))

  const focusAreas = FOCUS_AREA_CONFIG.map((area) => ({
    ...area,
    title: t(`personalizationPage.skillAreas.${area.key}`),
    reason: t(`personalizationPage.focusAreas.${area.key}.reason`),
    priority: t(`personalizationPage.priorities.${area.priorityKey}`),
    estimatedTime: t(`personalizationPage.estimatedTimes.${area.estimatedTimeKey}`),
  }))

  const recentAchievements = ACHIEVEMENT_CONFIG.map((achievement) => ({
    ...achievement,
    title: t(`personalizationPage.achievements.${achievement.key}.title`),
    description: t(`personalizationPage.achievements.${achievement.key}.description`),
    type: t(`personalizationPage.achievementTypes.${achievement.typeKey}`),
    typeKey: achievement.typeKey,
  }))

  const monthlyProgress = MONTHLY_PROGRESS_CONFIG.map((week) => ({
    ...week,
    week: t(`personalizationPage.weeks.${week.weekKey}`),
  }))

  const performanceInsights = INSIGHT_CONFIG.map((insight) => ({
    ...insight,
    metric: t(`personalizationPage.insights.${insight.key}.metric`),
    trend: t(`personalizationPage.insights.${insight.key}.trend`),
    description: t(`personalizationPage.insights.${insight.key}.description`),
    value: t(`personalizationPage.insightValues.${insight.valueKey}`),
  }))
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 px-8 py-10 text-white shadow-xl">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
              <Target className="h-4 w-4" />{t('personalizationPage.performanceTracker')}</div>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{t('personalizationPage.trackYourProfessionalLearningJourneyAndDiscoverWhereToF')}</h1>
            <p className="text-sm text-white/80">{t('personalizationPage.understandYourProgressIdentifySkillGapsAndGetPersonaliz')}</p>
          </div>

          <div className="grid w-full max-w-md gap-4 rounded-2xl bg-white/10 p-6 text-white backdrop-blur">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{t('personalizationPage.overallProgress')}</p>
              <p className="mt-2 text-3xl font-semibold">{overallStats.overallProgress}%</p>
              <p className="text-xs text-white/70">{t('personalizationPage.acrossAllLearningAreas')}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{t('personalizationPage.coursesCompleted')}</p>
              <p className="mt-2 text-3xl font-semibold">{overallStats.coursesCompleted}</p>
              <p className="text-xs text-white/70">{t('personalizationPage.inProgressCount', { count: overallStats.coursesInProgress })}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{t('personalizationPage.learningStreak')}</p>
              <p className="mt-2 text-3xl font-semibold">{t('personalizationPage.daysCount', { count: overallStats.currentStreak })}</p>
              <p className="text-xs text-white/70">{t('personalizationPage.keepItGoing')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <BarChart3 className="h-5 w-5 text-purple-500" />{t('personalizationPage.skillAreaPerformance')}</h2>
                <p className="mt-1 text-sm text-gray-600">{t('personalizationPage.trackYourProgressAcrossDifferentTeachingCompetenciesAnd')}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {skillAreas.map((area) => (
                <div key={area.category} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{area.category}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            area.color === 'green'
                              ? 'bg-green-100 text-green-700'
                              : area.color === 'amber'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {area.status}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>
                            {t('personalizationPage.coursesOfTotal', {
                              completed: area.completed,
                              total: area.total,
                            })}
                          </span>
                          <span>{area.progress}%</span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className={`h-full transition-all ${
                              area.color === 'green'
                                ? 'bg-green-500'
                                : area.color === 'amber'
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${area.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <AlertCircle className="h-5 w-5 text-amber-500" />{t('personalizationPage.focusAreasTitle')}</h2>
                <p className="mt-1 text-sm text-gray-600">{t('personalizationPage.theseAreasNeedYourAttentionToImproveOverallProfessional')}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {focusAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-amber-200 bg-amber-50 p-4 transition hover:border-amber-300 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{area.title}</p>
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">
                          {t('personalizationPage.priorityLabel', { priority: area.priority })}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-gray-600">{area.reason}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span>{t('personalizationPage.coursesRemaining', { count: area.courses })}</span>
                        <span>•</span>
                        <span>{t('personalizationPage.estimatedTime', { time: area.estimatedTime })}</span>
                      </div>
                    </div>
                    <button className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-500">{t('personalizationPage.startLearning')}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Calendar className="h-5 w-5 text-purple-500" />{t('personalizationPage.monthlyProgress')}</h2>
                <p className="mt-1 text-sm text-gray-600">{t('personalizationPage.yourWeeklyCourseCompletionVsGoalsThisMonth')}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-end justify-between gap-2">
                {monthlyProgress.map((week, idx) => (
                  <div key={idx} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full items-end justify-center gap-1">
                      <div
                        className="w-full rounded-t-lg bg-purple-500 transition hover:bg-purple-600"
                        style={{ height: `${(week.completed / 4) * 80}px` }}
                      />
                      <div
                        className="w-full rounded-t-lg bg-gray-300 transition"
                        style={{ height: `${(week.goal / 4) * 80}px`, opacity: 0.5 }}
                      />
                    </div>
                    <p className="text-xs font-semibold text-gray-500">{week.week}</p>
                    <p className="text-xs text-gray-400">
                      {week.completed}/{week.goal}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-purple-500" />
                  <span>{t('personalizationPage.completed')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded bg-gray-300" />
                  <span>{t('personalizationPage.goal')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                <TrendingUp className="h-4 w-4 text-purple-500" />{t('personalizationPage.performanceInsights')}</h3>
            </div>

            <div className="mt-4 space-y-4">
              {performanceInsights.map((insight, idx) => (
                <div key={idx} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{insight.metric}</p>
                    <span
                      className={`text-xs font-semibold ${
                        insight.positive ? 'text-green-600' : 'text-amber-600'
                      }`}
                    >
                      {insight.trend}
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">{insight.value}</p>
                  <p className="mt-1 text-xs text-gray-600">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                <Award className="h-4 w-4 text-green-500" />{t('personalizationPage.recentAchievements')}</h3>
            </div>

            <div className="mt-4 space-y-3">
              {recentAchievements.map((achievement, idx) => (
                <div key={idx} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-100 text-green-600">
                      {achievement.typeKey === 'certificate' ? (
                        <Award className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{achievement.type}</p>
                      <h4 className="mt-1 text-sm font-semibold text-gray-900">{achievement.title}</h4>
                      <p className="mt-1 text-xs text-gray-600">{achievement.description}</p>
                      <p className="mt-1 text-xs text-gray-400">{achievement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
                <Clock className="h-4 w-4 text-purple-500" />{t('personalizationPage.timeTracking')}</h3>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('personalizationPage.thisMonth')}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{t('personalizationPage.hoursCount', { count: overallStats.totalHours })}</p>
                <p className="mt-1 text-xs text-gray-500">{t('personalizationPage.pdHoursLogged')}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('personalizationPage.weeklyGoal')}</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {overallStats.weeklyCompleted}/{overallStats.weeklyGoal}
                </p>
                <p className="mt-1 text-xs text-gray-500">{t('personalizationPage.coursesThisWeek')}</p>
                <div className="mt-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full bg-purple-500 transition-all"
                      style={{
                        width: `${(overallStats.weeklyCompleted / overallStats.weeklyGoal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
              <Zap className="h-4 w-4 text-purple-500" />{t('personalizationPage.quickActions')}</h3>
            <div className="mt-4 space-y-2">
              <button className="w-full rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:bg-purple-500">{t('personalizationPage.viewAllCourses')}</button>
              <button className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-50">{t('personalizationPage.exportProgressReport')}</button>
              <button className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-50">{t('personalizationPage.setLearningGoals')}</button>
              <Link
                to="/analytics"
                className="w-full rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-50 inline-flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />{t('personalizationPage.viewDetailedAnalytics')}</Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">{t('personalizationPage.yourStanding')}</p>
            <h2 className="text-2xl font-semibold">{t('personalizationPage.performanceSummary')}</h2>
            <p className="text-sm text-white/75">{t('personalizationPage.youReMakingSolidProgressFocusOnDigitalLiteracyAi')}</p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/60">{t('personalizationPage.rankAmongPeers')}</p>
              <p className="mt-2 text-2xl font-semibold">{t('personalizationPage.top35')}</p>
              <p className="text-xs text-white/70">{t('personalizationPage.aboveAveragePerformance')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Personalization
