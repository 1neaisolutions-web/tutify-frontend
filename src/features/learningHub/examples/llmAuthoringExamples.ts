/**
 * Reference shapes for future LLM JSON generation (not used by renderers at runtime).
 * Keep in sync with `types.ts`, `contentModel.ts`, `themeRegistry.ts`, and `skillRegistry.ts`.
 */

import type { LearningHubContentBlock, LearningHubCtaSpec, LearningHubMediaVideo } from '../contentModel'
import type { LearningHubSectionItem, PersonalizedMicroCourseSectionItem } from '../types'
import type { SkillId } from '../skillRegistry'

/** Example: AI Growth standalone module payload an LLM could emit */
export const exampleLlmAIGrowthModuleShape = {
  id: 'example-tiered-module',
  slug: 'example-tiered-module',
  type: 'ai-growth-module' as const,
  sectionKey: 'ai-growth-recommendations' as const,
  title: 'Tiered Instruction Frameworks',
  subtitle: 'AI-Guided Learning Path',
  shortDescription: 'Challenge all learners at the right level.',
  description: 'Master tiered lessons that preserve shared objectives.',
  themeId: 'ai-growth-differentiation' as const,
  parentPathSlug: 'advanced-differentiation-strategies',
  layoutVariant: 'tiered-module',
  skillIds: ['diff-tiered-design', 'diff-readiness-assessment'] satisfies SkillId[],
  tags: ['differentiation', 'tiering'],
  level: 'Beginner' as const,
  impact: 'High' as const,
  duration: '40 min',
  status: 'published' as const,
  outcomes: ['Create tiered activities at 3–4 complexity levels'],
  prerequisites: ['Basic lesson planning'],
  cta: { primaryLabel: 'Start Module', secondaryLabel: 'Back to path' } satisfies LearningHubCtaSpec,
  assessment: { type: 'Project-Based', description: 'Design a tiered lesson', points: 100 },
  blocks: [
    { type: 'hero', title: 'Tiered Instruction', subtitle: 'Same goals, varied complexity' },
    { type: 'overview', markdown: 'Tiering adjusts task complexity while holding objectives constant.' },
    {
      type: 'video',
      media: {
        type: 'video',
        url: 'https://example.com/media/tiered-intro.mp4',
        provider: 'mp4',
        title: 'Introduction to Tiered Instruction',
        duration: '12 min',
        transcript: 'Optional transcript text…',
        controls: true,
      } satisfies LearningHubMediaVideo,
    },
    { type: 'keyPoints', items: ['Assess readiness', 'Design three tiers', 'Align to standards'] },
    { type: 'assessmentSummary', assessmentType: 'Project-Based', description: 'Submit a tiered lesson plan', points: 100 },
  ] satisfies LearningHubContentBlock[],
  metadata: { contentVersion: 1, locale: 'en-US', authoredBy: 'llm-template' },
}

/** Example: Personalized micro-course payload an LLM could emit */
export const exampleLlmPersonalizedMicroCourseShape = {
  id: 'pmc-example',
  slug: 'example-micro-course',
  type: 'personalized-micro-course' as const,
  sectionKey: 'personalized-micro-courses' as const,
  title: 'Quick wins: Example topic',
  subtitle: 'Professional learning',
  duration: '8 min',
  difficulty: 'Beginner',
  ctaLabel: 'Start',
  themeId: 'pmc-amber-warm' as const,
  tags: ['micro-course', 'example'],
  personalizedMicroCourseContent: {
    description: 'Short course description for learners.',
    learningObjectives: ['Objective one', 'Objective two'],
    themeId: 'pmc-amber-warm' as const,
    lessons: [
      {
        id: 1,
        title: 'Lesson 1',
        duration: '2 min',
        contentBlocks: [
          { type: 'text', heading: 'Core idea', paragraphs: ['Paragraph one.', 'Paragraph two.'] },
        ],
      },
    ],
    quizQuestions: [
      {
        id: 1,
        question: 'Sample question?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        explanation: 'Because…',
      },
    ],
    quizSubtitle: 'Check understanding',
    passingScorePercent: 70,
    successMessage: 'Great job!',
    blocks: [
      {
        type: 'video',
        media: {
          type: 'video',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          provider: 'youtube',
          title: 'Welcome video',
          thumbnailUrl: 'https://example.com/thumb.jpg',
          duration: '2 min',
        } satisfies LearningHubMediaVideo,
      },
      { type: 'callout', variant: 'tip', title: 'Try this week', body: 'Apply one strategy in your next class.' },
    ] satisfies LearningHubContentBlock[],
    metadata: { contentVersion: 1 },
  },
}

/**
 * Example of one full **visible** AI Growth path item after `finalizeAIGrowthPathBundle`-style assembly
 * (card + `aiGrowthRecommendationContent` with nested `modules` — same references as module-only routes).
 */
export const exampleFullAIGrowthPathSectionItem: Pick<
  LearningHubSectionItem,
  'id' | 'slug' | 'title' | 'shortDescription' | 'duration' | 'ctaLabel' | 'sectionKey' | 'aiGrowthRecommendationContent'
> = {
  id: 'agr-example',
  slug: 'example-differentiation-path',
  title: 'Example differentiation path',
  shortDescription: 'One object defines the list card and the full path experience.',
  duration: '2 hours',
  ctaLabel: 'Start Path',
  sectionKey: 'ai-growth-recommendations',
  aiGrowthRecommendationContent: {
    type: 'path',
    themeId: 'ai-growth-differentiation',
    estimatedTime: '2 hours',
    impactLevel: 'High',
    heroSubtitle: 'AI-Guided Learning Path',
    heroDescription: 'Narrative for the path hero.',
    aiGuidance: {
      recommendation: 'Start with module A',
      reason: 'Grounded in your skill profile.',
      nextSteps: ['Step 1', 'Step 2'],
      personalizedTip: 'Try one strategy this week.',
    },
    skillImpacts: [
      {
        skillId: 'impact-diff-student-achievement',
        before: 60,
        after: 85,
        improvement: 25,
        description: 'Example impact',
      },
    ],
    modules: [],
    storageKey: 'example-path-storage',
    metadata: { contentVersion: 1, locale: 'en-US' },
  },
}

/** Example of one full **visible** personalized micro-course catalog row. */
export const exampleFullPersonalizedMicroCourseSectionItem: Pick<
  PersonalizedMicroCourseSectionItem,
  'id' | 'slug' | 'title' | 'subtitle' | 'duration' | 'difficulty' | 'ctaLabel' | 'sectionKey' | 'personalizedMicroCourseContent'
> = {
  id: 'pmc-example',
  slug: 'example-micro-course',
  title: 'Quick wins: Example topic',
  subtitle: 'Professional learning',
  duration: '8 min',
  difficulty: 'Beginner',
  ctaLabel: 'Start',
  sectionKey: 'personalized-micro-courses',
  personalizedMicroCourseContent: {
    description: 'Course description for learners.',
    learningObjectives: ['Objective one', 'Objective two'],
    themeId: 'pmc-amber-warm',
    lessons: [
      {
        id: 1,
        title: 'Lesson 1',
        duration: '2 min',
        contentBlocks: [{ type: 'text', heading: 'Core idea', paragraphs: ['Paragraph one.'] }],
      },
    ],
    quizQuestions: [
      {
        id: 1,
        question: 'Sample?',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 0,
        explanation: 'Because…',
      },
    ],
    quizSubtitle: 'Check understanding',
    passingScorePercent: 70,
    successMessage: 'Great job!',
    metadata: { contentVersion: 1 },
  },
}
