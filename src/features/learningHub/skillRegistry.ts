/**
 * Central catalog of Learning Hub skills (AI Growth paths and future sections).
 * Add a skill object here, then reference `id` from content as `skillIds` / `skillId`.
 */

export type LearningHubSkillCategory = 'differentiation' | 'assessment' | 'engagement' | 'outcome-impact'

/** Fields shared by all registry entries (id is added per row for literal inference). */
export type LearningHubSkillFields = {
  slug: string
  name: string
  shortLabel?: string
  description?: string
  category: LearningHubSkillCategory
  subcategory?: string
  proficiencyLevel?: 'foundational' | 'developing' | 'proficient' | 'advanced'
  gradeBand?: string
  audience?: 'k12-teachers' | 'instructional-coaches' | 'administrators'
  iconKey?: string
  themeToken?: string
  tags?: string[]
  relatedCompetencies?: string[]
  promptHints?: string[]
  metadata?: Record<string, string | number | boolean>
}

function defineSkill<const ID extends string>(s: LearningHubSkillFields & { id: ID }): LearningHubSkillFields & { id: ID } {
  return s
}

export const LEARNING_HUB_SKILLS = [
  defineSkill({
    id: 'diff-tiered-design',
    slug: 'tiered-design',
    name: 'Tiered design',
    category: 'differentiation',
    subcategory: 'instructional-design',
    tags: ['differentiation', 'tiering'],
    promptHints: ['tiered instruction'],
  }),
  defineSkill({
    id: 'diff-readiness-assessment',
    slug: 'readiness-assessment',
    name: 'Readiness assessment',
    category: 'differentiation',
    subcategory: 'assessment',
    tags: ['formative', 'readiness'],
  }),
  defineSkill({
    id: 'diff-complexity-scaling',
    slug: 'complexity-scaling',
    name: 'Complexity scaling',
    category: 'differentiation',
    tags: ['rigor', 'scaffolding'],
  }),
  defineSkill({
    id: 'diff-objective-alignment',
    slug: 'objective-alignment',
    name: 'Objective alignment',
    category: 'differentiation',
    subcategory: 'standards',
    tags: ['objectives'],
  }),
  defineSkill({
    id: 'diff-content-variation',
    slug: 'content-variation',
    name: 'Content variation',
    category: 'differentiation',
    tags: ['content', 'choice'],
  }),
  defineSkill({
    id: 'diff-learning-contracts',
    slug: 'learning-contracts',
    name: 'Learning contracts',
    category: 'differentiation',
    tags: ['contracts'],
  }),
  defineSkill({
    id: 'diff-compacting',
    slug: 'compacting',
    name: 'Compacting',
    category: 'differentiation',
    tags: ['compact', 'acceleration'],
  }),
  defineSkill({
    id: 'diff-interest-based-learning',
    slug: 'interest-based-learning',
    name: 'Interest-based learning',
    category: 'differentiation',
    tags: ['interest'],
  }),
  defineSkill({
    id: 'diff-activity-variation',
    slug: 'activity-variation',
    name: 'Activity variation',
    category: 'differentiation',
    tags: ['process'],
  }),
  defineSkill({
    id: 'diff-learning-stations',
    slug: 'learning-stations',
    name: 'Learning stations',
    category: 'differentiation',
    tags: ['stations'],
  }),
  defineSkill({
    id: 'diff-flexible-grouping',
    slug: 'flexible-grouping',
    name: 'Flexible grouping',
    category: 'differentiation',
    tags: ['grouping'],
  }),
  defineSkill({
    id: 'diff-multiple-intelligences',
    slug: 'multiple-intelligences',
    name: 'Multiple intelligences',
    category: 'differentiation',
    tags: ['learner-variability'],
  }),
  defineSkill({
    id: 'diff-choice-boards',
    slug: 'choice-boards',
    name: 'Choice boards',
    category: 'differentiation',
    tags: ['products'],
  }),
  defineSkill({
    id: 'diff-product-design',
    slug: 'product-design',
    name: 'Product design',
    category: 'differentiation',
    tags: ['products'],
  }),
  defineSkill({
    id: 'diff-rubric-creation',
    slug: 'rubric-creation',
    name: 'Rubric creation',
    category: 'differentiation',
    subcategory: 'assessment',
    tags: ['rubrics'],
  }),
  defineSkill({
    id: 'diff-assessment-variation',
    slug: 'assessment-variation',
    name: 'Assessment variation',
    category: 'differentiation',
    subcategory: 'assessment',
    tags: ['assessment'],
  }),
  defineSkill({
    id: 'diff-accommodations',
    slug: 'accommodations',
    name: 'Accommodations',
    category: 'differentiation',
    tags: ['access'],
  }),
  defineSkill({
    id: 'diff-alternative-assessments',
    slug: 'alternative-assessments',
    name: 'Alternative assessments',
    category: 'differentiation',
    subcategory: 'assessment',
    tags: ['alternative'],
  }),
  defineSkill({
    id: 'diff-fairness',
    slug: 'fairness',
    name: 'Fairness',
    category: 'differentiation',
    subcategory: 'equity',
    tags: ['equity'],
  }),
  defineSkill({
    id: 'diff-strategic-grouping',
    slug: 'strategic-grouping',
    name: 'Strategic grouping',
    category: 'differentiation',
    tags: ['grouping'],
  }),
  defineSkill({
    id: 'diff-heterogeneous-groups',
    slug: 'heterogeneous-groups',
    name: 'Heterogeneous groups',
    category: 'differentiation',
    tags: ['grouping', 'collaboration'],
  }),
  defineSkill({
    id: 'diff-homogeneous-groups',
    slug: 'homogeneous-groups',
    name: 'Homogeneous groups',
    category: 'differentiation',
    tags: ['grouping'],
  }),
  defineSkill({
    id: 'diff-dynamic-grouping',
    slug: 'dynamic-grouping',
    name: 'Dynamic grouping',
    category: 'differentiation',
    tags: ['grouping'],
  }),

  defineSkill({
    id: 'assess-ai-tools',
    slug: 'ai-tools',
    name: 'AI tools',
    category: 'assessment',
    subcategory: 'technology',
    tags: ['ai'],
  }),
  defineSkill({
    id: 'assess-assessment-design',
    slug: 'assessment-design',
    name: 'Assessment design',
    category: 'assessment',
    tags: ['design'],
  }),
  defineSkill({
    id: 'assess-automation',
    slug: 'automation',
    name: 'Automation',
    category: 'assessment',
    tags: ['workflow'],
  }),
  defineSkill({
    id: 'assess-feedback-systems',
    slug: 'feedback-systems',
    name: 'Feedback systems',
    category: 'assessment',
    subcategory: 'feedback',
    tags: ['feedback'],
  }),
  defineSkill({
    id: 'assess-rubric-design',
    slug: 'rubric-design',
    name: 'Rubric design',
    category: 'assessment',
    tags: ['rubrics'],
  }),
  defineSkill({
    id: 'assess-ai-prompts',
    slug: 'ai-prompts',
    name: 'AI prompts',
    category: 'assessment',
    subcategory: 'generative-ai',
    tags: ['prompting'],
  }),
  defineSkill({
    id: 'assess-standards-alignment',
    slug: 'standards-alignment',
    name: 'Standards alignment',
    category: 'assessment',
    tags: ['standards'],
  }),
  defineSkill({
    id: 'assess-quality-control',
    slug: 'quality-control',
    name: 'Quality control',
    category: 'assessment',
    tags: ['qa'],
  }),
  defineSkill({
    id: 'assess-feedback-automation',
    slug: 'feedback-automation',
    name: 'Feedback automation',
    category: 'assessment',
    tags: ['feedback', 'automation'],
  }),
  defineSkill({
    id: 'assess-ai-feedback',
    slug: 'ai-feedback',
    name: 'AI feedback',
    category: 'assessment',
    tags: ['ai', 'feedback'],
  }),
  defineSkill({
    id: 'assess-formative-assessment',
    slug: 'formative-assessment',
    name: 'Formative assessment',
    category: 'assessment',
    tags: ['formative'],
  }),
  defineSkill({
    id: 'assess-student-growth',
    slug: 'student-growth',
    name: 'Student growth',
    category: 'assessment',
    tags: ['growth'],
  }),
  defineSkill({
    id: 'assess-question-generation',
    slug: 'question-generation',
    name: 'Question generation',
    category: 'assessment',
    tags: ['items'],
  }),
  defineSkill({
    id: 'assess-data-analysis',
    slug: 'data-analysis',
    name: 'Data analysis',
    category: 'assessment',
    tags: ['data'],
  }),
  defineSkill({
    id: 'assess-time-efficiency',
    slug: 'time-efficiency',
    name: 'Time efficiency',
    category: 'assessment',
    tags: ['efficiency'],
  }),
  defineSkill({
    id: 'assess-summative-design',
    slug: 'summative-design',
    name: 'Summative design',
    category: 'assessment',
    tags: ['summative'],
  }),
  defineSkill({
    id: 'assess-ai-integration',
    slug: 'ai-integration',
    name: 'AI integration',
    category: 'assessment',
    tags: ['ai'],
  }),
  defineSkill({
    id: 'assess-assessment-validity',
    slug: 'assessment-validity',
    name: 'Assessment validity',
    category: 'assessment',
    tags: ['validity'],
  }),
  defineSkill({
    id: 'assess-quality-assurance',
    slug: 'quality-assurance',
    name: 'Quality assurance',
    category: 'assessment',
    tags: ['qa'],
  }),

  defineSkill({
    id: 'eng-game-mechanics',
    slug: 'game-mechanics',
    name: 'Game mechanics',
    category: 'engagement',
    subcategory: 'gamification',
    tags: ['games'],
  }),
  defineSkill({
    id: 'eng-reward-systems',
    slug: 'reward-systems',
    name: 'Reward systems',
    category: 'engagement',
    tags: ['motivation'],
  }),
  defineSkill({
    id: 'eng-progress-tracking',
    slug: 'progress-tracking',
    name: 'Progress tracking',
    category: 'engagement',
    tags: ['progress'],
  }),
  defineSkill({
    id: 'eng-student-motivation',
    slug: 'student-motivation',
    name: 'Student motivation',
    category: 'engagement',
    tags: ['motivation'],
  }),
  defineSkill({
    id: 'eng-point-systems',
    slug: 'point-systems',
    name: 'Point systems',
    category: 'engagement',
    tags: ['points'],
  }),
  defineSkill({
    id: 'eng-badge-design',
    slug: 'badge-design',
    name: 'Badge design',
    category: 'engagement',
    tags: ['badges'],
  }),
  defineSkill({
    id: 'eng-leaderboard-management',
    slug: 'leaderboard-management',
    name: 'Leaderboard management',
    category: 'engagement',
    tags: ['leaderboards'],
  }),
  defineSkill({
    id: 'eng-fair-competition',
    slug: 'fair-competition',
    name: 'Fair competition',
    category: 'engagement',
    tags: ['competition'],
  }),
  defineSkill({
    id: 'eng-question-design',
    slug: 'question-design',
    name: 'Question design',
    category: 'engagement',
    subcategory: 'inquiry',
    tags: ['questions'],
  }),
  defineSkill({
    id: 'eng-curiosity-triggers',
    slug: 'curiosity-triggers',
    name: 'Curiosity triggers',
    category: 'engagement',
    tags: ['hooks'],
  }),
  defineSkill({
    id: 'eng-problem-based-learning',
    slug: 'problem-based-learning',
    name: 'Problem-based learning',
    category: 'engagement',
    tags: ['pbl'],
  }),
  defineSkill({
    id: 'eng-student-driven-inquiry',
    slug: 'student-driven-inquiry',
    name: 'Student-driven inquiry',
    category: 'engagement',
    tags: ['inquiry'],
  }),
  defineSkill({
    id: 'eng-quest-design',
    slug: 'quest-design',
    name: 'Quest design',
    category: 'engagement',
    tags: ['quests'],
  }),
  defineSkill({
    id: 'eng-narrative-structure',
    slug: 'narrative-structure',
    name: 'Narrative structure',
    category: 'engagement',
    tags: ['narrative'],
  }),
  defineSkill({
    id: 'eng-choice-agency',
    slug: 'choice-agency',
    name: 'Choice and agency',
    category: 'engagement',
    tags: ['choice', 'agency'],
  }),
  defineSkill({
    id: 'eng-progressive-challenges',
    slug: 'progressive-challenges',
    name: 'Progressive challenges',
    category: 'engagement',
    tags: ['progression'],
  }),
  defineSkill({
    id: 'eng-team-dynamics',
    slug: 'team-dynamics',
    name: 'Team dynamics',
    category: 'engagement',
    tags: ['teams'],
  }),
  defineSkill({
    id: 'eng-collaborative-challenges',
    slug: 'collaborative-challenges',
    name: 'Collaborative challenges',
    category: 'engagement',
    tags: ['collaboration'],
  }),
  defineSkill({
    id: 'eng-peer-assessment',
    slug: 'peer-assessment',
    name: 'Peer assessment',
    category: 'engagement',
    tags: ['peer'],
  }),
  defineSkill({
    id: 'eng-group-rewards',
    slug: 'group-rewards',
    name: 'Group rewards',
    category: 'engagement',
    tags: ['teams', 'rewards'],
  }),
  defineSkill({
    id: 'eng-personalization',
    slug: 'personalization',
    name: 'Personalization',
    category: 'engagement',
    tags: ['personalization'],
  }),
  defineSkill({
    id: 'eng-adaptive-systems',
    slug: 'adaptive-systems',
    name: 'Adaptive systems',
    category: 'engagement',
    tags: ['adaptive'],
  }),
  defineSkill({
    id: 'eng-data-driven-design',
    slug: 'data-driven-design',
    name: 'Data-driven design',
    category: 'engagement',
    tags: ['data'],
  }),
  defineSkill({
    id: 'eng-individual-pathways',
    slug: 'individual-pathways',
    name: 'Individual pathways',
    category: 'engagement',
    tags: ['pathways'],
  }),
  defineSkill({
    id: 'eng-game-based-assessment',
    slug: 'game-based-assessment',
    name: 'Game-based assessment',
    category: 'engagement',
    subcategory: 'assessment',
    tags: ['games', 'assessment'],
  }),
  defineSkill({
    id: 'eng-formative-gaming',
    slug: 'formative-gaming',
    name: 'Formative gaming',
    category: 'engagement',
    tags: ['formative', 'games'],
  }),
  defineSkill({
    id: 'eng-feedback-loops',
    slug: 'feedback-loops',
    name: 'Feedback loops',
    category: 'engagement',
    tags: ['feedback'],
  }),
  defineSkill({
    id: 'eng-reduced-anxiety',
    slug: 'reduced-anxiety',
    name: 'Reduced anxiety',
    category: 'engagement',
    tags: ['sel'],
  }),
  defineSkill({
    id: 'eng-project-based-learning',
    slug: 'project-based-learning',
    name: 'Project-based learning',
    category: 'engagement',
    tags: ['pbl'],
  }),
  defineSkill({
    id: 'eng-design-thinking',
    slug: 'design-thinking',
    name: 'Design thinking',
    category: 'engagement',
    tags: ['design-thinking'],
  }),
  defineSkill({
    id: 'eng-research-methods',
    slug: 'research-methods',
    name: 'Research methods',
    category: 'engagement',
    tags: ['research'],
  }),
  defineSkill({
    id: 'eng-student-autonomy',
    slug: 'student-autonomy',
    name: 'Student autonomy',
    category: 'engagement',
    tags: ['autonomy'],
  }),

  defineSkill({
    id: 'impact-diff-student-achievement',
    slug: 'student-achievement',
    name: 'Student Achievement',
    category: 'outcome-impact',
    subcategory: 'differentiation-path',
    tags: ['outcomes'],
  }),
  defineSkill({
    id: 'impact-diff-student-engagement',
    slug: 'student-engagement',
    name: 'Student Engagement',
    category: 'outcome-impact',
    subcategory: 'differentiation-path',
    tags: ['outcomes', 'engagement'],
  }),
  defineSkill({
    id: 'impact-diff-advanced-learner-growth',
    slug: 'advanced-learner-growth',
    name: 'Advanced Learner Growth',
    category: 'outcome-impact',
    subcategory: 'differentiation-path',
    tags: ['advanced'],
  }),
  defineSkill({
    id: 'impact-diff-struggling-learner-support',
    slug: 'struggling-learner-support',
    name: 'Struggling Learner Support',
    category: 'outcome-impact',
    subcategory: 'differentiation-path',
    tags: ['support'],
  }),
  defineSkill({
    id: 'impact-diff-classroom-equity',
    slug: 'classroom-equity',
    name: 'Classroom Equity',
    category: 'outcome-impact',
    subcategory: 'differentiation-path',
    tags: ['equity'],
  }),

  defineSkill({
    id: 'impact-assess-efficiency',
    slug: 'assessment-efficiency',
    name: 'Assessment Efficiency',
    category: 'outcome-impact',
    subcategory: 'assessment-path',
    tags: ['efficiency'],
  }),
  defineSkill({
    id: 'impact-assess-feedback-quality',
    slug: 'feedback-quality',
    name: 'Feedback Quality',
    category: 'outcome-impact',
    subcategory: 'assessment-path',
    tags: ['feedback'],
  }),
  defineSkill({
    id: 'impact-assess-frequency',
    slug: 'assessment-frequency',
    name: 'Assessment Frequency',
    category: 'outcome-impact',
    subcategory: 'assessment-path',
    tags: ['formative'],
  }),
  defineSkill({
    id: 'impact-assess-student-growth',
    slug: 'student-growth-outcome',
    name: 'Student Growth',
    category: 'outcome-impact',
    subcategory: 'assessment-path',
    tags: ['growth'],
  }),
  defineSkill({
    id: 'impact-assess-data-insights',
    slug: 'data-insights',
    name: 'Data Insights',
    category: 'outcome-impact',
    subcategory: 'assessment-path',
    tags: ['data'],
  }),

  defineSkill({
    id: 'impact-eng-participation',
    slug: 'student-participation',
    name: 'Student Participation',
    category: 'outcome-impact',
    subcategory: 'engagement-path',
    tags: ['participation'],
  }),
  defineSkill({
    id: 'impact-eng-lesson-engagement',
    slug: 'lesson-engagement',
    name: 'Lesson Engagement',
    category: 'outcome-impact',
    subcategory: 'engagement-path',
    tags: ['engagement'],
  }),
  defineSkill({
    id: 'impact-eng-retention',
    slug: 'knowledge-retention',
    name: 'Knowledge Retention',
    category: 'outcome-impact',
    subcategory: 'engagement-path',
    tags: ['retention'],
  }),
  defineSkill({
    id: 'impact-eng-motivation',
    slug: 'student-motivation-outcome',
    name: 'Student Motivation',
    category: 'outcome-impact',
    subcategory: 'engagement-path',
    tags: ['motivation'],
  }),
  defineSkill({
    id: 'impact-eng-classroom-management',
    slug: 'classroom-management',
    name: 'Classroom Management',
    category: 'outcome-impact',
    subcategory: 'engagement-path',
    tags: ['management'],
  }),
] as const

/** Inferred structured skill row; registry is the source of truth — modules store `SkillId` refs only. */
export type LearningHubSkill = (typeof LEARNING_HUB_SKILLS)[number]

/** All valid skill ids (module skills + path outcome impacts). */
export type SkillId = LearningHubSkill['id']

export const LEARNING_HUB_SKILL_BY_ID: Record<SkillId, LearningHubSkill> = LEARNING_HUB_SKILLS.reduce(
  (acc, s) => {
    if (acc[s.id]) throw new Error(`Duplicate Learning Hub skill id: ${s.id}`)
    acc[s.id] = s
    return acc
  },
  {} as Record<SkillId, LearningHubSkill>
)

/** Strict lookup when the id is known to be a registered `SkillId`. */
export function getLearningHubSkill(id: SkillId): LearningHubSkill {
  return LEARNING_HUB_SKILL_BY_ID[id]
}

/** Lookup for unknown/runtime strings (e.g. future API payloads). */
export function tryGetLearningHubSkill(id: string): LearningHubSkill | undefined {
  return LEARNING_HUB_SKILL_BY_ID[id as SkillId]
}

/** User-visible label; `name` matches legacy copy when no `shortLabel`. */
export function resolveSkillLabel(skillId: string): string {
  const s = tryGetLearningHubSkill(skillId)
  if (!s) return skillId
  return s.shortLabel ?? s.name
}

export function resolveSkillLabels(skillIds: readonly SkillId[]): string[]
export function resolveSkillLabels(skillIds: readonly string[]): string[]
export function resolveSkillLabels(skillIds: readonly string[]): string[] {
  return skillIds.map((id) => resolveSkillLabel(id))
}

type SkillPromptSlice = Pick<LearningHubSkill, 'id' | 'slug' | 'name' | 'category' | 'tags'>

/** Compact shape for future LLM / API payloads. */
export function skillsForPromptJSON(skillIds: readonly SkillId[]): SkillPromptSlice[]
export function skillsForPromptJSON(skillIds: readonly string[]): SkillPromptSlice[]
export function skillsForPromptJSON(skillIds: readonly string[]): SkillPromptSlice[] {
  return skillIds
    .map((id) => tryGetLearningHubSkill(id))
    .filter(Boolean)
    .map((s) => ({
      id: s!.id,
      slug: s!.slug,
      name: s!.name,
      category: s!.category,
      tags: s!.tags ?? [],
    }))
}
