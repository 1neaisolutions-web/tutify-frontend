/**
 * Single source of truth for all Learning Hub catalog rows.
 * Each entry is a `LearningHubSectionItem` plus `section`, denormalized `skills`, and `theme.name` for authoring / LLM payloads.
 * Renderers use `toLearningHubSectionItem` to strip extras and keep existing behavior.
 */
import { aiGrowthRecommendationsData } from './content/aiGrowthRecommendations'
import { aiGuidedTutorialsData } from './content/aiGuidedTutorials'
import { personalizedMicroCoursesData } from './content/personalizedMicroCourses'
import { researchInsightsLibraryData } from './content/researchInsights'
import { specialistDeepDiveTracksData } from './content/specialistDeepDiveTracks'
import { labelAiGuidedTutorialShell, resolveAiGuidedTutorialShell } from './aiGuidedTutorialShell'
import { LEARNING_HUB_PATH_THEME_BY_ID, LEARNING_HUB_PMC_THEME_BY_ID } from './themeRegistry'
import { tryGetLearningHubSkill } from './skillRegistry'
import type { LearningHubSectionItem, LearningHubSectionKey } from './types'

const DEFAULT_CTA_LABEL_BY_SECTION: Record<LearningHubSectionKey, string> = {
  'personalized-micro-courses': 'Start',
  'ai-growth-recommendations': 'Start Path',
  'ai-guided-tutorials-demonstrations': 'Watch',
  'research-insights-library': 'Read More',
  'specialist-deep-dive-tracks': 'Start',
}

export type LearningHubInlineSkill = {
  name: string
  description: string
}

export type LearningHubInlineTheme = {
  name: string
}

/** One catalog row: legacy payload + section + inlined skill/theme labels for copy-paste / LLM authoring. */
export type LearningHubDataItem = LearningHubSectionItem & {
  section: LearningHubSectionKey
  /** List/teaser copy (mirrors `shortDescription` when present). */
  description: string
  skills: LearningHubInlineSkill[]
  theme: LearningHubInlineTheme
}

function extractSkillsForItem(item: LearningHubSectionItem): LearningHubInlineSkill[] {
  const c = item.aiGrowthRecommendationContent
  if (!c) return []
  if (c.type === 'path') {
    return c.skillImpacts.map((imp) => {
      const s = tryGetLearningHubSkill(imp.skillId)
      return {
        name: (s?.shortLabel ?? s?.name ?? imp.skillId).trim(),
        description: imp.description,
      }
    })
  }
  if (c.type === 'module') {
    return c.module.skillIds.map((id) => {
      const s = tryGetLearningHubSkill(id)
      return {
        name: (s?.shortLabel ?? s?.name ?? id).trim(),
        description: (s?.description ?? '').trim(),
      }
    })
  }
  return []
}

function extractThemeForItem(item: LearningHubSectionItem): LearningHubInlineTheme {
  const pmc = item.personalizedMicroCourseContent
  if (pmc?.themeId) {
    const def = LEARNING_HUB_PMC_THEME_BY_ID[pmc.themeId]
    return { name: def?.name ?? pmc.themeId }
  }
  const c = item.aiGrowthRecommendationContent
  if (c && 'themeId' in c && c.themeId) {
    const def = LEARNING_HUB_PATH_THEME_BY_ID[c.themeId]
    return { name: def?.name ?? c.themeId }
  }
  const agt = item.aiGuidedTutorialContent
  if (agt) {
    const shell = resolveAiGuidedTutorialShell(agt.renderProfile)
    return { name: labelAiGuidedTutorialShell(shell) }
  }
  if (item.researchInsightContent) {
    return { name: 'Research insight' }
  }
  if (item.specialistDeepDiveContent) {
    return { name: 'Specialist track' }
  }
  return { name: 'Learning Hub' }
}

function enrichItem(section: LearningHubSectionKey, item: LearningHubSectionItem): LearningHubDataItem {
  const normalized: LearningHubSectionItem = {
    ...item,
    title: item.title.trim(),
    subtitle: item.subtitle?.trim(),
    shortDescription: item.shortDescription?.trim(),
    duration: item.duration?.trim(),
    difficulty: item.difficulty?.trim(),
    ctaLabel: (item.ctaLabel?.trim() || DEFAULT_CTA_LABEL_BY_SECTION[section]).trim(),
  }

  return {
    ...normalized,
    section,
    description: (normalized.shortDescription ?? '').trim(),
    skills: extractSkillsForItem(normalized),
    theme: extractThemeForItem(normalized),
  }
}

/** Strips authoring-only fields so renderers receive the original `LearningHubSectionItem` shape. */
export function toLearningHubSectionItem(row: LearningHubDataItem): LearningHubSectionItem {
  const { section: _s, skills: _k, theme: _t, description: _d, ...rest } = row
  return rest
}

export const learningHubData: LearningHubDataItem[] = [
  ...personalizedMicroCoursesData.map((item) => enrichItem('personalized-micro-courses', item)),
  ...aiGrowthRecommendationsData.map((item) => enrichItem('ai-growth-recommendations', item)),
  ...aiGuidedTutorialsData.map((item) => enrichItem('ai-guided-tutorials-demonstrations', item)),
  ...researchInsightsLibraryData.map((item) => enrichItem('research-insights-library', item)),
  ...specialistDeepDiveTracksData.map((item) => enrichItem('specialist-deep-dive-tracks', item)),
]

/** Module slugs are not separate catalog rows; build a synthetic item from the parent path’s `modules`. */
function tryResolveAIGrowthModuleBySlug(slug: string): LearningHubSectionItem | undefined {
  for (const item of aiGrowthRecommendationsData) {
    const c = item.aiGrowthRecommendationContent
    if (!c || c.type !== 'path') continue
    const idx = c.modules.findIndex((m) => m.slug === slug)
    if (idx === -1) continue
    const mod = c.modules[idx]!
    return {
      id: `${item.id}-m${idx + 1}`,
      slug: mod.slug,
      title: mod.title,
      ctaLabel: 'Start',
      sectionKey: 'ai-growth-recommendations',
      aiGrowthRecommendationContent: {
        type: 'module',
        parentPathSlug: item.slug,
        module: mod,
        themeId: c.themeId,
      },
    }
  }
  return undefined
}

export function getLearningHubDataItemBySlug(
  sectionKey: LearningHubSectionKey,
  slug?: string
): LearningHubDataItem | undefined {
  if (!slug) return undefined
  const row = learningHubData.find((row) => row.section === sectionKey && row.slug === slug)
  if (row) return row
  if (sectionKey === 'ai-growth-recommendations') {
    const synthetic = tryResolveAIGrowthModuleBySlug(slug)
    if (synthetic) return enrichItem('ai-growth-recommendations', synthetic)
  }
  return undefined
}
