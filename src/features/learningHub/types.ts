import { ComponentType } from 'react'
import type { LearningHubContentBlock, LearningHubMediaVideo } from './contentModel'
import type { SkillId } from './skillRegistry'
import type { ResearchInsightBespokeVariantId } from './researchInsightRouting'

/** Registry id for AI Growth path / module chrome (see `themeRegistry`). */
export type LearningHubPathThemeId =
  | 'ai-growth-differentiation'
  | 'ai-growth-assessment'
  | 'ai-growth-student-engagement'

/** Registry id for personalized micro-course chrome (see `themeRegistry`). */
export type PersonalizedMicroCourseThemeId =
  | 'pmc-amber-warm'
  | 'pmc-blue-assessment'
  | 'pmc-green-differentiation'
  | 'pmc-purple-engagement'
  | 'pmc-indigo-digital'

export type LearningHubSectionKey =
  | 'personalized-micro-courses'
  | 'ai-growth-recommendations'
  | 'ai-guided-tutorials-demonstrations'
  | 'research-insights-library'
  | 'specialist-deep-dive-tracks'

export interface LearningHubSectionMeta {
  key: LearningHubSectionKey
  title: string
  routeBase: string
}

export interface LearningHubSectionItem {
  id: string
  slug: string
  title: string
  subtitle?: string
  shortDescription?: string
  duration?: string
  difficulty?: string
  ctaLabel?: string
  sectionKey: LearningHubSectionKey
  /** Optional list card / recommendation tags */
  tags?: string[]
  layoutVariant?: string
  /** Authoring or analytics (locale, source, version, etc.) */
  metadata?: Record<string, string | number | boolean>
  component?: ComponentType
  personalizedMicroCourseContent?: PersonalizedMicroCourseContent
  aiGrowthRecommendationContent?: AIGrowthRecommendationContent
  /** Full nested tutorial body for AI-guided tutorials & demonstrations (preferred over `component`). */
  aiGuidedTutorialContent?: AiGuidedTutorialContent
  /** Full nested body for Research insights library (preferred over `component`). */
  researchInsightContent?: ResearchInsightContent
  /** Full nested specialist track (modules → lessons → contentBlocks); preferred over `component`. */
  specialistDeepDiveContent?: SpecialistDeepDiveContent
}

/**
 * `ResearchInsightBespokeVariantId` → dedicated shell component.
 * `research-structured-sections` (or any non-bespoke string) + structured `payload` → generic sections renderer — no new switch branch.
 */
export type ResearchInsightVariant =
  | ResearchInsightBespokeVariantId
  | 'research-structured-sections'
  | (string & {})

export type ResearchInsightRenderProfile = 'research-article' | (string & {})

/**
 * Nested authoring payload for one research card.
 * - Bespoke `variant` → legacy/custom shell (Bloom, Hattie, etc.).
 * - Otherwise, if `payload` matches `isResearchStructuredSectionsPayload`, the generic article shell is used.
 */
export interface ResearchInsightContent {
  type: 'research-insight'
  renderProfile: ResearchInsightRenderProfile
  variant: ResearchInsightVariant
  description?: string
  heroSubtitle: string
  heroDescription: string
  headerDurationLabel?: string
  /** Row under title (e.g. Evidence-Based, Meta-Analysis) */
  headerBadgeLabels?: string[]
  /** Tailwind header gradient classes (e.g. from-purple-600 via-indigo-600 to-blue-600) */
  headerGradientClass?: string
  payload: unknown
  metadata?: Record<string, string | number | boolean>
}

export interface AIGrowthModuleContent {
  id: string
  slug: string
  title: string
  description: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  impact: 'Low' | 'Medium' | 'High'
  /** Registry ids only — full skill rows live in `LEARNING_HUB_SKILL_BY_ID` / `LEARNING_HUB_SKILLS`. */
  skillIds: SkillId[]
  learningOutcomes: string[]
  prerequisites?: string[]
  content: Array<{
    type: 'video' | 'reading' | 'interactive' | 'template' | 'project'
    title: string
    duration?: string
    points?: number
    /** Present for video rows; `url` may be filled when media is hosted */
    media?: LearningHubMediaVideo
  }>
  /** Optional LLM/authoring blocks; renderers may ignore until wired */
  blocks?: LearningHubContentBlock[]
  metadata?: Record<string, string | number | boolean>
  assessment: {
    type: string
    description: string
    points: number
  }
  realWorldApplication: string
  detail?: AIGrowthModuleDetail
}

export interface AIGrowthModuleLesson {
  id: string
  type: 'video' | 'reading' | 'interactive' | 'template'
  title: string
  duration?: string
  points: number
  content: {
    description?: string
    keyPoints?: string[]
    transcript?: string
    article?: string
    keyTakeaways?: string[]
    steps?: string[]
    sections?: string[]
  }
}

export type AIGrowthModuleSidebarStyle = 'tiered' | 'engagement'

/** Per-module lesson UI tokens for legacy visual parity (AI Growth only). */
export interface AIGrowthModulePageVisual {
  sidebarStyle: AIGrowthModuleSidebarStyle
  headerGradient: string
  heroSubtitleClass: string
  heroShowEarnedPoints: boolean
  heroShowImpactRow: boolean
  heroShowBookmarkShare: boolean
  /** Tiered sidebar (differentiation / assessment modules) */
  tieredSidebarActive: string
  tieredSidebarCompleted: string
  tieredSidebarIdle: string
  tieredSidebarCheckComplete: string
  sidebarProgressFill: string
  /** Engagement sidebar */
  engagementSidebarActive: string
  engagementSidebarIdle: string
  engagementNumCompleted: string
  engagementNumActive: string
  engagementNumIdle: string
  engagementTitleActive: string
  lessonTypeIconClass: string
  pointsPill: string
  videoOverlayGradient: string
  videoPlayUseTranslucent: boolean
  videoPlayIconClass: string
  showLessonHeaderShare: boolean
  keyPointsPanel: string
  keyPointsCheck: string
  transcriptPanel: string
  readingArticleWrap: string
  readingTakeawaysPanel: string
  readingTakeawaysIcon: string
  interactiveStepsPanel: string
  interactiveStepNumber: string
  templateSectionsCard: string
  templateSectionNumber: string
  templateDownloadCard: string
  templateDownloadIcon: string
  markCompleteButton: string
  completionPanel: string
  completionIconBg: string
  completionCta: string
  completedLessonBadge: string
  /** Tiered legacy: mark complete inside each lesson; engagement: footer Previous / Complete & Next with advance */
  lessonNavigation: 'inline-only' | 'footer-with-advance'
  /** Primary classes for footer complete button (engagement path); rounded-full + colors */
  footerCompleteButton: string
  /** Section headings (Key Points, Transcript, etc.) */
  blockHeadingClass: string
}

export interface AIGrowthModuleDetail {
  moduleLabel: string
  backPathSlug: string
  lessons: AIGrowthModuleLesson[]
  pageVisual: AIGrowthModulePageVisual
}

export interface AIGrowthPathTheme {
  headerGradient: string
  accentBorder: string
  accentBg: string
  accentText: string
  button: string
  tipPanelBg: string
  tipPanelBorder: string
  heroDescriptionClass: string
  sparklesIconBg: string
  guidancePersonalizedBadge: string
  guidanceTipBoxBorder: string
  nextStepIconClass: string
  skillImpactHeaderIcon: string
  skillImprovementClass: string
  skillBarAfter: string
  pathSidebarProgressBar: string
  pathSkillChip: string
  moduleNumberBadge: string
  moduleExpandedBorder: string
  moduleExpandedBg: string
  moduleCollapsedHoverBorder: string
  moduleExpandedInnerBorder: string
  sectionHeadingIconClass: string
  moduleContentRowIconClass: string
  moduleContentPointsClass: string
  assessmentPanel: string
  assessmentIconClass: string
  assessmentPointsClass: string
  markCompleteOutlineButton: string
  pathOverviewImpactBadgeHigh: string
  pathOverviewImpactBadgeMedium: string
  pathOverviewImpactBadgeLow: string
}

export type AIGrowthPathLayout = 'default' | 'student-engagement'

export type AIGrowthAchievementRule =
  | { type: 'minCompleted'; count: number }
  | { type: 'moduleCompleted'; moduleId: string }
  | { type: 'allUnlockedCompleted' }

/** IA extras for student-engagement path only (achievements + bottom CTA copy). */
export interface AIGrowthStudentEngagementExtras {
  achievements: Array<{
    name: string
    description: string
    rule: AIGrowthAchievementRule
  }>
  bottomCta: {
    title: string
    subtitle: string
    primaryLabel: string
    secondaryLabel: string
  }
}

/** Authoring: one lesson row inside a module (PMC-style nesting). Runtime expands to `content` + `detail.lessons`. */
export interface AIGrowthAuthoringLesson {
  id: string
  type: 'video' | 'reading' | 'interactive' | 'template' | 'project'
  title: string
  duration?: string
  points?: number
  media?: LearningHubMediaVideo
  /** Optional UI payload; if omitted, defaults are derived from the parent module. */
  payload?: AIGrowthModuleLesson['content']
}

/** Authoring: module with nested `lessons` (no separate flat `content` array in source data). */
export interface AIGrowthAuthoringModule {
  id: string
  slug: string
  title: string
  description: string
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  impact: 'Low' | 'Medium' | 'High'
  skillIds: SkillId[]
  learningOutcomes: string[]
  prerequisites?: string[]
  lessons: AIGrowthAuthoringLesson[]
  assessment: {
    type: string
    description: string
    points: number
  }
  realWorldApplication: string
  blocks?: LearningHubContentBlock[]
  metadata?: Record<string, string | number | boolean>
}

export interface AIGrowthRecommendationPathContent {
  type: 'path'
  /** Optional path summary for lists / LLM (in addition to hero copy). */
  description?: string
  estimatedTime: string
  impactLevel: 'Low' | 'Medium' | 'High'
  heroSubtitle: string
  heroDescription: string
  /** Registry id (analytics / fallbacks). Prefer `pathTheme` when you want a self-contained copy-paste path object. */
  themeId: LearningHubPathThemeId
  /** When set, overrides `themeId` resolution for path chrome (full token set in one place). */
  pathTheme?: AIGrowthPathTheme
  tags?: string[]
  metadata?: Record<string, string | number | boolean>
  blocks?: LearningHubContentBlock[]
  cta?: { primaryLabel?: string; secondaryLabel?: string }
  aiGuidance: {
    recommendation: string
    reason: string
    nextSteps: string[]
    personalizedTip: string
  }
  skillImpacts: Array<{
    skillId: SkillId
    before: number
    after: number
    improvement: number
    description: string
  }>
  modules: AIGrowthModuleContent[]
  storageKey: string
  /** When `student-engagement`, render legacy StudentEngagementPath-style IA. */
  pathLayout?: AIGrowthPathLayout
  studentEngagementExtras?: AIGrowthStudentEngagementExtras
}

/**
 * Optional authoring shape: nested `lessons` per module (expanded to `content` + `detail` if you materialize data).
 * The shipped catalog in `content/aiGrowthRecommendations.ts` is fully expanded `LearningHubSectionItem[]` instead.
 */
export type AIGrowthPathSectionItemDraft = Omit<LearningHubSectionItem, 'aiGrowthRecommendationContent'> & {
  aiGrowthRecommendationContent: Omit<AIGrowthRecommendationPathContent, 'modules'> & {
    modules: AIGrowthAuthoringModule[]
  }
}

export type { SkillId } from './skillRegistry'

export interface AIGrowthRecommendationModuleContent {
  type: 'module'
  parentPathSlug: string
  module: AIGrowthModuleContent
  themeId: LearningHubPathThemeId
  metadata?: Record<string, string | number | boolean>
}

export type AIGrowthRecommendationContent =
  | AIGrowthRecommendationPathContent
  | AIGrowthRecommendationModuleContent

export interface PersonalizedMicroCourseTheme {
  headerGradient: string
  primaryButton: string
  primaryBorder: string
  primaryText: string
  accentBorder: string
  accentBackground: string
  accentIconBg: string
  accentIconText: string
}

export interface PersonalizedMicroCourseTextBlock {
  type: 'text'
  heading: string
  paragraphs: string[]
}

export interface PersonalizedMicroCourseInteractiveBlock {
  type: 'interactive'
  title: string
  prompt: string
  tips: string[]
}

export type PersonalizedMicroCourseBlock = PersonalizedMicroCourseTextBlock | PersonalizedMicroCourseInteractiveBlock

export interface PersonalizedMicroCourseLesson {
  id: number
  title: string
  duration: string
  contentBlocks: PersonalizedMicroCourseBlock[]
}

export interface PersonalizedMicroCourseQuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface PersonalizedMicroCourseContent {
  description: string
  learningObjectives: string[]
  lessons: PersonalizedMicroCourseLesson[]
  quizQuestions: PersonalizedMicroCourseQuizQuestion[]
  quizSubtitle: string
  passingScorePercent: number
  successMessage: string
  themeId: PersonalizedMicroCourseThemeId
  tags?: string[]
  metadata?: Record<string, string | number | boolean>
  blocks?: LearningHubContentBlock[]
  /** Resolved tokens; prefer `themeId` + registry for new content */
  theme?: PersonalizedMicroCourseTheme
}

/** One catalog row = one full experience: list card fields + nested course payload. */
export type PersonalizedMicroCourseSectionItem = LearningHubSectionItem & {
  sectionKey: 'personalized-micro-courses'
  personalizedMicroCourseContent: PersonalizedMicroCourseContent
}

/** Built-in tutorial shells (Tailwind + layout). */
export type AiGuidedTutorialRenderProfilePreset =
  | 'lesson-planner'
  | 'assessment-best-practices'
  | 'differentiation-case-study'

/**
 * Preset ids or custom strings. Custom values resolve via `resolveAiGuidedTutorialShell`
 * (defaults to lesson-planner; optional aliases in `aiGuidedTutorialShell.ts`).
 */
export type AiGuidedTutorialRenderProfile = AiGuidedTutorialRenderProfilePreset | (string & {})

export interface AiGuidedTutorialStep {
  id: string
  title: string
  duration: string
  content: {
    type: 'video' | 'text' | 'interactive' | 'example'
    /** Matches existing tutorial page shapes (`video`/`text`/`interactive`/`example` payloads). */
    data: Record<string, unknown>
  }
  keyTakeaways: string[]
  reflection: string
}

export interface AiGuidedTutorialContent {
  type: 'tutorial'
  renderProfile: AiGuidedTutorialRenderProfile
  description?: string
  heroSubtitle: string
  heroDescription: string
  /** Hero pill duration (e.g. total "12 min"); step headers still use per-step durations. */
  headerDurationLabel?: string
  steps: AiGuidedTutorialStep[]
  /** Optional celebration block (differentiation shell). */
  completionTitle?: string
  completionBody?: string
  metadata?: Record<string, string | number | boolean>
}

/** Catalog row with nested tutorial payload. */
export type AiGuidedTutorialSectionItem = LearningHubSectionItem & {
  sectionKey: 'ai-guided-tutorials-demonstrations'
  aiGuidedTutorialContent: AiGuidedTutorialContent
}

/** Authoring blocks inside a specialist track lesson (video uses shared `LearningHubMediaVideo`). */
export interface SpecialistDeepDiveVideoBlock {
  type: 'video'
  media: LearningHubMediaVideo
}

export interface SpecialistDeepDiveTextBlock {
  type: 'text'
  heading: string
  paragraphs: string[]
}

export interface SpecialistDeepDiveInteractiveBlock {
  type: 'interactive'
  title: string
  prompt: string
  tips: string[]
}

export interface SpecialistDeepDiveCaseStudyBlock {
  type: 'caseStudy'
  title: string
  scenario: string
  discussionQuestions?: string[]
}

export interface SpecialistDeepDiveTemplateBlock {
  type: 'template'
  title: string
  sections?: string[]
}

export type SpecialistDeepDiveContentBlock =
  | SpecialistDeepDiveVideoBlock
  | SpecialistDeepDiveTextBlock
  | SpecialistDeepDiveInteractiveBlock
  | SpecialistDeepDiveCaseStudyBlock
  | SpecialistDeepDiveTemplateBlock

export interface SpecialistDeepDiveLesson {
  id: string
  title: string
  duration: string
  contentBlocks: SpecialistDeepDiveContentBlock[]
}

export interface SpecialistDeepDiveModule {
  id: string
  title: string
  description?: string
  duration?: string
  learningOutcomes?: string[]
  lessons: SpecialistDeepDiveLesson[]
  moduleAssessment?: { type: string; description: string; points?: number }
}

export type SpecialistDeepDiveRenderProfile = 'deep-dive-track' | (string & {})

export interface SpecialistDeepDiveContent {
  type: 'track'
  renderProfile: SpecialistDeepDiveRenderProfile
  description: string
  heroSubtitle: string
  heroDescription: string
  headerGradientClass?: string
  modules: SpecialistDeepDiveModule[]
  outcomes?: string[]
  assessment?: { title?: string; description: string; points?: number }
  certification?: { title: string; body?: string }
  metadata?: Record<string, string | number | boolean>
}

export type SpecialistDeepDiveSectionItem = LearningHubSectionItem & {
  sectionKey: 'specialist-deep-dive-tracks'
  specialistDeepDiveContent: SpecialistDeepDiveContent
}

