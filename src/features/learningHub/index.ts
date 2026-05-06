import { learningHubData, toLearningHubSectionItem, getLearningHubDataItemBySlug } from './learningHubData'
import { learningHubSections } from './sections'
import { LearningHubSectionItem, LearningHubSectionKey } from './types'

export const getSectionItems = (sectionKey: LearningHubSectionKey): LearningHubSectionItem[] =>
  learningHubData.filter((row) => row.section === sectionKey).map(toLearningHubSectionItem)

export const getSectionItemBySlug = (sectionKey: LearningHubSectionKey, slug?: string): LearningHubSectionItem | undefined => {
  const row = getLearningHubDataItemBySlug(sectionKey, slug)
  return row ? toLearningHubSectionItem(row) : undefined
}

export const buildLearningHubSectionPath = (sectionKey: LearningHubSectionKey, slug: string) =>
  `${learningHubSections[sectionKey].routeBase}/${slug}`

export const legacyLearningHubSlugToNewPath: Record<string, string> = {
  'classroom-management': buildLearningHubSectionPath('personalized-micro-courses', 'classroom-management-essentials'),
  'assessment-strategies': buildLearningHubSectionPath('personalized-micro-courses', 'formative-assessment-strategies'),
  'differentiation-course': buildLearningHubSectionPath('personalized-micro-courses', 'differentiation-made-simple'),
  'student-engagement-course': buildLearningHubSectionPath('personalized-micro-courses', 'engaging-reluctant-learners'),
  'digital-literacy-course': buildLearningHubSectionPath('personalized-micro-courses', 'ai-tools-for-lesson-planning'),
  'lesson-planner-tutorial': buildLearningHubSectionPath('ai-guided-tutorials-demonstrations', 'mastering-lesson-planner-template'),
  'assessment-tutorial': buildLearningHubSectionPath('ai-guided-tutorials-demonstrations', 'creating-effective-assessments'),
  'differentiation-tutorial': buildLearningHubSectionPath('ai-guided-tutorials-demonstrations', 'differentiation-in-action'),
  'evidence-based-teaching': buildLearningHubSectionPath('research-insights-library', 'evidence-based-teaching'),
  'blooms-taxonomy': buildLearningHubSectionPath('research-insights-library', 'blooms-taxonomy'),
  'assessment-research': buildLearningHubSectionPath('research-insights-library', 'assessment-research'),
  'sel-behavior-research': buildLearningHubSectionPath('research-insights-library', 'sel-behavior-research'),
  'growth-mindset-research': buildLearningHubSectionPath('research-insights-library', 'growth-mindset-research'),
  'cognitive-load-research': buildLearningHubSectionPath('research-insights-library', 'cognitive-load-research'),
  'metacognition-research': buildLearningHubSectionPath('research-insights-library', 'metacognition-research'),
  'scaffolding-research': buildLearningHubSectionPath('research-insights-library', 'scaffolding-research'),
  'student-engagement-path': buildLearningHubSectionPath('ai-growth-recommendations', 'student-engagement-techniques'),
  'advanced-differentiation-path': buildLearningHubSectionPath('ai-growth-recommendations', 'advanced-differentiation-strategies'),
  'ai-assessment-path': buildLearningHubSectionPath('ai-growth-recommendations', 'ai-assisted-assessment-design'),
  'tiered-instruction-module': buildLearningHubSectionPath('ai-growth-recommendations', 'tiered-instruction-module'),
  'content-differentiation-module': buildLearningHubSectionPath('ai-growth-recommendations', 'content-differentiation-module'),
  'process-differentiation-module': buildLearningHubSectionPath('ai-growth-recommendations', 'process-differentiation-module'),
  'product-differentiation-module': buildLearningHubSectionPath('ai-growth-recommendations', 'product-differentiation-module'),
  'assessment-differentiation-module': buildLearningHubSectionPath('ai-growth-recommendations', 'assessment-differentiation-module'),
  'advanced-grouping-module': buildLearningHubSectionPath('ai-growth-recommendations', 'advanced-grouping-module'),
  'ai-assessment-intro-module': buildLearningHubSectionPath('ai-growth-recommendations', 'ai-assessment-intro-module'),
  'automated-rubrics-module': buildLearningHubSectionPath('ai-growth-recommendations', 'automated-rubrics-module'),
  'instant-feedback-module': buildLearningHubSectionPath('ai-growth-recommendations', 'instant-feedback-module'),
  'formative-automation-module': buildLearningHubSectionPath('ai-growth-recommendations', 'formative-automation-module'),
  'summative-ai-design-module': buildLearningHubSectionPath('ai-growth-recommendations', 'summative-ai-design-module'),
  'gamification-fundamentals': buildLearningHubSectionPath('ai-growth-recommendations', 'gamification-fundamentals'),
  'points-badges-leaderboards': buildLearningHubSectionPath('ai-growth-recommendations', 'points-badges-leaderboards'),
  'inquiry-learning-hooks': buildLearningHubSectionPath('ai-growth-recommendations', 'inquiry-learning-hooks'),
  'quest-based-learning': buildLearningHubSectionPath('ai-growth-recommendations', 'quest-based-learning'),
  'collaborative-game-mechanics': buildLearningHubSectionPath('ai-growth-recommendations', 'collaborative-game-mechanics'),
  'adaptive-gamification': buildLearningHubSectionPath('ai-growth-recommendations', 'adaptive-gamification'),
  'gamified-assessment': buildLearningHubSectionPath('ai-growth-recommendations', 'gamified-assessment'),
  'advanced-inquiry-frameworks': buildLearningHubSectionPath('ai-growth-recommendations', 'advanced-inquiry-frameworks'),
  'stem-mastery': buildLearningHubSectionPath('specialist-deep-dive-tracks', 'stem-mastery'),
  'literacy-expert': buildLearningHubSectionPath('specialist-deep-dive-tracks', 'literacy-expert'),
  'ngss-foundations': buildLearningHubSectionPath('specialist-deep-dive-tracks', 'ngss-foundations'),
  'engineering-design': buildLearningHubSectionPath('specialist-deep-dive-tracks', 'engineering-design'),
  'computational-thinking': buildLearningHubSectionPath('specialist-deep-dive-tracks', 'computational-thinking'),
  'lab-safety': buildLearningHubSectionPath('specialist-deep-dive-tracks', 'lab-safety'),
  'phenomena-driven': buildLearningHubSectionPath('specialist-deep-dive-tracks', 'phenomena-driven'),
  'data-literacy': buildLearningHubSectionPath('specialist-deep-dive-tracks', 'data-literacy'),
  'stem-integration': buildLearningHubSectionPath('specialist-deep-dive-tracks', 'stem-integration'),
  'ngss-assessment': buildLearningHubSectionPath('specialist-deep-dive-tracks', 'ngss-assessment'),
}

export * from './types'
export * from './skillRegistry'
export * from './contentModel'
export * from './lessonVideoMedia'
export * from './themeRegistry'
export {
  resolveAiGuidedTutorialShell,
  labelAiGuidedTutorialShell,
  type AiGuidedTutorialShellId,
} from './aiGuidedTutorialShell'
export {
  resolveResearchInsightRenderProfile,
  type ResearchInsightRenderProfileId,
} from './researchInsightShell'
export {
  RESEARCH_INSIGHT_BESPOKE_VARIANT_IDS,
  isResearchInsightBespokeVariant,
  type ResearchInsightBespokeVariantId,
} from './researchInsightRouting'
export {
  isResearchStructuredSectionsPayload,
  type ResearchStructuredSectionPayload,
} from './researchInsightStructuredPayload'
export {
  resolveSpecialistDeepDiveRenderProfile,
  type SpecialistDeepDiveRenderProfileId,
} from './specialistDeepDiveTrackShell'
export * from './examples/llmAuthoringExamples'
export * from './sections'
export * from './learningHubData'
export * from './useLearningHubScrollToTop'

/** Prefer filtering `learningHubData` by `section`; kept for existing imports. */
export const personalizedMicroCoursesData = learningHubData
  .filter((r) => r.section === 'personalized-micro-courses')
  .map(toLearningHubSectionItem)

/** @deprecated Prefer `learningHubData.filter((r) => r.section === 'ai-growth-recommendations')` */
export const aiGrowthRecommendationsData = learningHubData
  .filter((r) => r.section === 'ai-growth-recommendations')
  .map(toLearningHubSectionItem)

/** @deprecated Prefer `learningHubData.filter` by section */
export const aiGuidedTutorialsData = learningHubData
  .filter((r) => r.section === 'ai-guided-tutorials-demonstrations')
  .map(toLearningHubSectionItem)

/** @deprecated Prefer `learningHubData.filter` by section */
export const researchInsightsLibraryData = learningHubData
  .filter((r) => r.section === 'research-insights-library')
  .map(toLearningHubSectionItem)

/** @deprecated Prefer `learningHubData.filter` by section */
export const specialistDeepDiveTracksData = learningHubData
  .filter((r) => r.section === 'specialist-deep-dive-tracks')
  .map(toLearningHubSectionItem)
