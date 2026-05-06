import type {
  AIGrowthPathTheme,
  LearningHubPathThemeId,
  LearningHubSectionKey,
  PersonalizedMicroCourseTheme,
  PersonalizedMicroCourseThemeId,
} from './types'
import type { LearningHubSkillCategory } from './skillRegistry'

export interface LearningHubPathThemeDefinition {
  id: LearningHubPathThemeId
  slug: string
  name: string
  category: 'ai-growth-path'
  allowedSections: readonly LearningHubSectionKey[]
  tokens: AIGrowthPathTheme
  /** Future: bias automated theme selection by skill taxonomy */
  recommendedForSkillCategories?: readonly LearningHubSkillCategory[]
  generationHints?: string[]
  metadata?: Record<string, string | number | boolean>
}

export interface PersonalizedMicroCourseThemeDefinition {
  id: PersonalizedMicroCourseThemeId
  slug: string
  name: string
  category: 'personalized-micro-course'
  allowedSections: readonly ['personalized-micro-courses']
  tokens: PersonalizedMicroCourseTheme
  generationHints?: string[]
  metadata?: Record<string, string | number | boolean>
}

const sharedImpactBadges: Pick<
  AIGrowthPathTheme,
  'pathOverviewImpactBadgeHigh' | 'pathOverviewImpactBadgeMedium' | 'pathOverviewImpactBadgeLow'
> = {
  pathOverviewImpactBadgeHigh: 'px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold',
  pathOverviewImpactBadgeMedium: 'px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-semibold',
  pathOverviewImpactBadgeLow: 'px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold',
}

const differentiationTokens: AIGrowthPathTheme = {
  headerGradient: 'from-green-600 via-emerald-600 to-teal-600',
  accentBorder: 'border-green-200',
  accentBg: 'from-green-50 to-emerald-50',
  accentText: 'text-green-600',
  button: 'bg-green-600 hover:bg-green-700',
  tipPanelBg: 'from-green-50 to-emerald-50',
  tipPanelBorder: 'border-green-200',
  heroDescriptionClass: 'text-green-100',
  sparklesIconBg: 'bg-green-600',
  guidancePersonalizedBadge: 'px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold',
  guidanceTipBoxBorder: 'border-green-200',
  nextStepIconClass: 'text-green-600',
  skillImpactHeaderIcon: 'text-green-600',
  skillImprovementClass: 'text-green-600',
  skillBarAfter: 'bg-green-500',
  pathSidebarProgressBar: 'bg-green-600',
  pathSkillChip: 'px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium',
  moduleNumberBadge: 'bg-green-100 text-green-600',
  moduleExpandedBorder: 'border-green-300',
  moduleExpandedBg: 'bg-green-50',
  moduleCollapsedHoverBorder: 'hover:border-green-200',
  moduleExpandedInnerBorder: 'border-t border-green-200',
  sectionHeadingIconClass: 'text-green-600',
  moduleContentRowIconClass: 'text-green-600',
  moduleContentPointsClass: 'text-green-600',
  assessmentPanel: 'bg-green-50 rounded-lg p-4 border border-green-200',
  assessmentIconClass: 'text-green-600',
  assessmentPointsClass: 'text-green-600',
  markCompleteOutlineButton: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
  ...sharedImpactBadges,
}

const assessmentTokens: AIGrowthPathTheme = {
  headerGradient: 'from-indigo-600 via-blue-600 to-cyan-600',
  accentBorder: 'border-indigo-200',
  accentBg: 'from-indigo-50 to-blue-50',
  accentText: 'text-indigo-600',
  button: 'bg-indigo-600 hover:bg-indigo-700',
  tipPanelBg: 'from-indigo-50 to-blue-50',
  tipPanelBorder: 'border-indigo-200',
  heroDescriptionClass: 'text-indigo-100',
  sparklesIconBg: 'bg-indigo-600',
  guidancePersonalizedBadge: 'px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold',
  guidanceTipBoxBorder: 'border-indigo-200',
  nextStepIconClass: 'text-indigo-600',
  skillImpactHeaderIcon: 'text-indigo-600',
  skillImprovementClass: 'text-indigo-600',
  skillBarAfter: 'bg-indigo-500',
  pathSidebarProgressBar: 'bg-indigo-600',
  pathSkillChip: 'px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium',
  moduleNumberBadge: 'bg-indigo-100 text-indigo-600',
  moduleExpandedBorder: 'border-indigo-300',
  moduleExpandedBg: 'bg-indigo-50',
  moduleCollapsedHoverBorder: 'hover:border-indigo-200',
  moduleExpandedInnerBorder: 'border-t border-indigo-200',
  sectionHeadingIconClass: 'text-indigo-600',
  moduleContentRowIconClass: 'text-indigo-600',
  moduleContentPointsClass: 'text-indigo-600',
  assessmentPanel: 'bg-indigo-50 rounded-lg p-4 border border-indigo-200',
  assessmentIconClass: 'text-indigo-600',
  assessmentPointsClass: 'text-indigo-600',
  markCompleteOutlineButton: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
  ...sharedImpactBadges,
}

const studentEngagementTokens: AIGrowthPathTheme = {
  headerGradient: 'from-amber-600 via-orange-600 to-red-600',
  accentBorder: 'border-amber-200',
  accentBg: 'from-amber-50 to-orange-50',
  accentText: 'text-amber-600',
  button: 'bg-amber-600 hover:bg-amber-700',
  tipPanelBg: 'from-blue-50 to-indigo-50',
  tipPanelBorder: 'border-blue-200',
  heroDescriptionClass: 'text-amber-100',
  sparklesIconBg: 'bg-blue-600',
  guidancePersonalizedBadge: 'px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold',
  guidanceTipBoxBorder: 'border-blue-200',
  nextStepIconClass: 'text-blue-600',
  skillImpactHeaderIcon: 'text-green-600',
  skillImprovementClass: 'text-green-600',
  skillBarAfter: 'bg-gradient-to-r from-green-500 to-green-600',
  pathSidebarProgressBar: 'bg-gradient-to-r from-amber-500 to-orange-500',
  pathSkillChip: 'px-2 py-1 bg-amber-50 text-amber-800 rounded text-xs font-medium border border-amber-100',
  moduleNumberBadge: 'bg-amber-100 text-amber-700',
  moduleExpandedBorder: 'border-amber-300',
  moduleExpandedBg: 'bg-amber-50',
  moduleCollapsedHoverBorder: 'hover:border-amber-200',
  moduleExpandedInnerBorder: 'border-t border-amber-200',
  sectionHeadingIconClass: 'text-amber-600',
  moduleContentRowIconClass: 'text-amber-600',
  moduleContentPointsClass: 'text-amber-700',
  assessmentPanel: 'bg-purple-50 rounded-lg p-4 border border-purple-200',
  assessmentIconClass: 'text-purple-600',
  assessmentPointsClass: 'text-purple-700',
  markCompleteOutlineButton: 'border-2 border-green-600 text-green-600 hover:bg-green-50',
  ...sharedImpactBadges,
}

export const LEARNING_HUB_PATH_THEMES: readonly LearningHubPathThemeDefinition[] = [
  {
    id: 'ai-growth-differentiation',
    slug: 'ai-growth-differentiation',
    name: 'AI Growth — Differentiation',
    category: 'ai-growth-path',
    allowedSections: ['ai-growth-recommendations'],
    tokens: differentiationTokens,
    recommendedForSkillCategories: ['differentiation'],
    generationHints: ['Use calm greens; emphasize equity and tiered instruction.'],
  },
  {
    id: 'ai-growth-assessment',
    slug: 'ai-growth-assessment',
    name: 'AI Growth — Assessment',
    category: 'ai-growth-path',
    allowedSections: ['ai-growth-recommendations'],
    tokens: assessmentTokens,
    recommendedForSkillCategories: ['assessment'],
    generationHints: ['Use indigo/blue; emphasize data, rubrics, and feedback loops.'],
  },
  {
    id: 'ai-growth-student-engagement',
    slug: 'ai-growth-student-engagement',
    name: 'AI Growth — Student engagement',
    category: 'ai-growth-path',
    allowedSections: ['ai-growth-recommendations'],
    tokens: studentEngagementTokens,
    recommendedForSkillCategories: ['engagement'],
    generationHints: ['Warm amber hero; gamification and inquiry tone.'],
  },
]

export const LEARNING_HUB_PATH_THEME_BY_ID: Record<LearningHubPathThemeId, LearningHubPathThemeDefinition> =
  LEARNING_HUB_PATH_THEMES.reduce(
    (acc, row) => {
      acc[row.id] = row
      return acc
    },
    {} as Record<LearningHubPathThemeId, LearningHubPathThemeDefinition>
  )

export function resolveAIGrowthPathTheme(themeId: LearningHubPathThemeId): AIGrowthPathTheme {
  return LEARNING_HUB_PATH_THEME_BY_ID[themeId].tokens
}

export function tryResolveAIGrowthPathTheme(id: string): AIGrowthPathTheme | undefined {
  return LEARNING_HUB_PATH_THEME_BY_ID[id as LearningHubPathThemeId]?.tokens
}

const pmcAmber: PersonalizedMicroCourseTheme = {
  headerGradient: 'from-amber-500 via-orange-500 to-rose-500',
  primaryButton: 'bg-amber-600 hover:bg-amber-700',
  primaryBorder: 'border-amber-200',
  primaryText: 'text-amber-600',
  accentBorder: 'border-amber-200',
  accentBackground: 'from-amber-50 to-orange-50',
  accentIconBg: 'bg-amber-100',
  accentIconText: 'text-amber-600',
}

const pmcBlue: PersonalizedMicroCourseTheme = {
  headerGradient: 'from-blue-500 via-indigo-500 to-purple-500',
  primaryButton: 'bg-blue-600 hover:bg-blue-700',
  primaryBorder: 'border-blue-200',
  primaryText: 'text-blue-600',
  accentBorder: 'border-blue-200',
  accentBackground: 'from-blue-50 to-indigo-50',
  accentIconBg: 'bg-blue-100',
  accentIconText: 'text-blue-600',
}

const pmcGreen: PersonalizedMicroCourseTheme = {
  headerGradient: 'from-green-500 via-emerald-500 to-teal-500',
  primaryButton: 'bg-green-600 hover:bg-green-700',
  primaryBorder: 'border-green-200',
  primaryText: 'text-green-600',
  accentBorder: 'border-green-200',
  accentBackground: 'from-green-50 to-emerald-50',
  accentIconBg: 'bg-green-100',
  accentIconText: 'text-green-600',
}

const pmcPurple: PersonalizedMicroCourseTheme = {
  headerGradient: 'from-purple-500 via-pink-500 to-rose-500',
  primaryButton: 'bg-purple-600 hover:bg-purple-700',
  primaryBorder: 'border-purple-200',
  primaryText: 'text-purple-600',
  accentBorder: 'border-purple-200',
  accentBackground: 'from-purple-50 to-pink-50',
  accentIconBg: 'bg-purple-100',
  accentIconText: 'text-purple-600',
}

const pmcIndigo: PersonalizedMicroCourseTheme = {
  headerGradient: 'from-indigo-500 via-blue-500 to-cyan-500',
  primaryButton: 'bg-indigo-600 hover:bg-indigo-700',
  primaryBorder: 'border-indigo-200',
  primaryText: 'text-indigo-600',
  accentBorder: 'border-indigo-200',
  accentBackground: 'from-indigo-50 to-blue-50',
  accentIconBg: 'bg-indigo-100',
  accentIconText: 'text-indigo-600',
}

export const LEARNING_HUB_PMC_THEMES: readonly PersonalizedMicroCourseThemeDefinition[] = [
  {
    id: 'pmc-amber-warm',
    slug: 'pmc-amber-warm',
    name: 'Micro-course — Amber warm',
    category: 'personalized-micro-course',
    allowedSections: ['personalized-micro-courses'],
    tokens: pmcAmber,
    generationHints: ['Classroom culture, routines, warmth.'],
  },
  {
    id: 'pmc-blue-assessment',
    slug: 'pmc-blue-assessment',
    name: 'Micro-course — Blue assessment',
    category: 'personalized-micro-course',
    allowedSections: ['personalized-micro-courses'],
    tokens: pmcBlue,
    generationHints: ['Formative assessment, checks for understanding.'],
  },
  {
    id: 'pmc-green-differentiation',
    slug: 'pmc-green-differentiation',
    name: 'Micro-course — Green differentiation',
    category: 'personalized-micro-course',
    allowedSections: ['personalized-micro-courses'],
    tokens: pmcGreen,
    generationHints: ['Differentiation, learner variability.'],
  },
  {
    id: 'pmc-purple-engagement',
    slug: 'pmc-purple-engagement',
    name: 'Micro-course — Purple engagement',
    category: 'personalized-micro-course',
    allowedSections: ['personalized-micro-courses'],
    tokens: pmcPurple,
    generationHints: ['Motivation, reluctant learners.'],
  },
  {
    id: 'pmc-indigo-digital',
    slug: 'pmc-indigo-digital',
    name: 'Micro-course — Indigo digital',
    category: 'personalized-micro-course',
    allowedSections: ['personalized-micro-courses'],
    tokens: pmcIndigo,
    generationHints: ['AI tools, digital literacy.'],
  },
]

export const LEARNING_HUB_PMC_THEME_BY_ID: Record<PersonalizedMicroCourseThemeId, PersonalizedMicroCourseThemeDefinition> =
  LEARNING_HUB_PMC_THEMES.reduce(
    (acc, row) => {
      acc[row.id] = row
      return acc
    },
    {} as Record<PersonalizedMicroCourseThemeId, PersonalizedMicroCourseThemeDefinition>
  )

export function resolvePersonalizedMicroCourseTheme(themeId: PersonalizedMicroCourseThemeId): PersonalizedMicroCourseTheme {
  return LEARNING_HUB_PMC_THEME_BY_ID[themeId].tokens
}

export function tryResolvePersonalizedMicroCourseTheme(id: string): PersonalizedMicroCourseTheme | undefined {
  return LEARNING_HUB_PMC_THEME_BY_ID[id as PersonalizedMicroCourseThemeId]?.tokens
}
