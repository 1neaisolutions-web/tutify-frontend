/**
 * Research insights library — **one catalog array**: copy a full top-level object, edit card fields and
 * `researchInsightContent` (hero strings + `payload`). Slugs must stay unique and match
 * `/learning-hub/research-insights-library/:slug`.
 *
 * - `renderProfile` resolves via `resolveResearchInsightRenderProfile` (default `research-article`).
 * - **Bespoke `variant`** (Bloom, Hattie, legacy shells) → dedicated page component.
 * - **Generic articles:** use `variant: 'research-structured-sections'` (or any non-bespoke string) and nest
 *   `payload` with `sections[]` + `contentBlocks` — no new router branch (`isResearchStructuredSectionsPayload`).
 * - **Payload:** bespoke items use `researchInsightBodies/*` or placeholders; generic items use structured sections.
 */
import type { LearningHubSectionItem } from '../types'
import { bloomsTaxonomyBody } from './researchInsightBodies/bloomsTaxonomyBody'
import { evidenceBasedTeachingBody } from './researchInsightBodies/evidenceBasedTeachingBody'

/** Placeholder until article body is fully extracted to `researchInsightBodies`. */
export const researchInsightPayloadPlaceholder = { schemaVersion: 1 as const }

export const researchInsightsLibraryData: LearningHubSectionItem[] = [
  {
    id: 'ril-1',
    slug: 'evidence-based-teaching',
    title: "Hattie's Visible Learning: Effect sizes that matter",
    shortDescription:
      'Which teaching strategies have the highest impact? Simplified breakdown of meta-analyses.',
    subtitle: 'Evidence-based teaching',
    duration: '5 min read',
    ctaLabel: 'Read More',
    sectionKey: 'research-insights-library',
    researchInsightContent: {
      type: 'research-insight',
      renderProfile: 'research-article',
      variant: 'evidence-based-teaching',
      description:
        'Which teaching strategies have the highest impact? Simplified breakdown of meta-analyses.',
      heroSubtitle: 'Evidence-based teaching',
      heroDescription:
        'Which teaching strategies have the highest impact? Simplified breakdown of meta-analyses.',
      headerDurationLabel: '5 min read',
      headerBadgeLabels: ['Evidence-Based', 'Meta-Analysis', 'High Impact'],
      headerGradientClass: 'from-blue-600 via-indigo-600 to-purple-600',
      payload: evidenceBasedTeachingBody,
    },
  },
  {
    id: 'ril-2',
    slug: 'blooms-taxonomy',
    title: "Bloom's taxonomy in modern classrooms",
    shortDescription: 'Practical applications of cognitive levels for lesson design and assessment.',
    subtitle: 'Pedagogy',
    duration: '6 min read',
    ctaLabel: 'Read More',
    sectionKey: 'research-insights-library',
    researchInsightContent: {
      type: 'research-insight',
      renderProfile: 'research-article',
      variant: 'blooms-taxonomy',
      description: 'Practical applications of cognitive levels for lesson design and assessment.',
      heroSubtitle: 'Pedagogy',
      heroDescription: 'Practical applications of cognitive levels for lesson design and assessment.',
      headerDurationLabel: '6 min read',
      headerBadgeLabels: ['Evidence-Based', 'Practical Applications', 'Teacher-Friendly'],
      headerGradientClass: 'from-purple-600 via-indigo-600 to-blue-600',
      payload: bloomsTaxonomyBody,
    },
  },
  {
    id: 'ril-3',
    slug: 'assessment-research',
    title: 'Formative assessment: What research says',
    shortDescription:
      'Key findings from Black & Wiliam and how to implement feedback loops effectively.',
    subtitle: 'Assessment',
    duration: '7 min read',
    ctaLabel: 'Read More',
    sectionKey: 'research-insights-library',
    researchInsightContent: {
      type: 'research-insight',
      renderProfile: 'research-article',
      variant: 'assessment-research',
      description:
        'Key findings from Black & Wiliam and how to implement feedback loops effectively.',
      heroSubtitle: 'Assessment',
      heroDescription:
        'Key findings from Black & Wiliam and how to implement feedback loops effectively.',
      headerDurationLabel: '7 min read',
      headerBadgeLabels: ['Evidence-Based', 'Practical Strategies', 'High Impact'],
      headerGradientClass: 'from-green-600 via-emerald-600 to-teal-600',
      payload: researchInsightPayloadPlaceholder,
    },
  },
  {
    id: 'ril-4',
    slug: 'sel-behavior-research',
    title: 'SEL & behavior: Restorative practices',
    shortDescription:
      'Evidence-backed approaches to building classroom community and addressing conflicts.',
    subtitle: 'SEL & Behavior',
    duration: '8 min read',
    ctaLabel: 'Read More',
    sectionKey: 'research-insights-library',
    researchInsightContent: {
      type: 'research-insight',
      renderProfile: 'research-article',
      variant: 'sel-behavior-research',
      description:
        'Evidence-backed approaches to building classroom community and addressing conflicts.',
      heroSubtitle: 'SEL & Behavior',
      heroDescription:
        'Evidence-backed approaches to building classroom community and addressing conflicts.',
      headerDurationLabel: '8 min read',
      headerBadgeLabels: ['Evidence-Based', 'Community', 'Restorative'],
      headerGradientClass: 'from-pink-600 via-rose-600 to-red-600',
      payload: researchInsightPayloadPlaceholder,
    },
  },
  {
    id: 'ril-5',
    slug: 'growth-mindset-research',
    title: "Growth mindset: Dweck's research in practice",
    shortDescription:
      'How to cultivate a growth mindset in students and transform their approach to learning challenges.',
    subtitle: 'Student motivation',
    duration: '6 min read',
    ctaLabel: 'Read More',
    sectionKey: 'research-insights-library',
    researchInsightContent: {
      type: 'research-insight',
      renderProfile: 'research-article',
      variant: 'growth-mindset-research',
      description:
        'How to cultivate a growth mindset in students and transform their approach to learning challenges.',
      heroSubtitle: 'Student motivation',
      heroDescription:
        'How to cultivate a growth mindset in students and transform their approach to learning challenges.',
      headerDurationLabel: '6 min read',
      headerBadgeLabels: ['Research-based', 'Motivation', 'Classroom strategies'],
      payload: researchInsightPayloadPlaceholder,
    },
  },
  {
    id: 'ril-6',
    slug: 'cognitive-load-research',
    title: 'Cognitive load theory: Optimizing learning',
    shortDescription:
      'Understanding how students process information and designing lessons that reduce cognitive overload.',
    subtitle: 'Learning science',
    duration: '7 min read',
    ctaLabel: 'Read More',
    sectionKey: 'research-insights-library',
    researchInsightContent: {
      type: 'research-insight',
      renderProfile: 'research-article',
      variant: 'cognitive-load-research',
      description:
        'Understanding how students process information and designing lessons that reduce cognitive overload.',
      heroSubtitle: 'Learning science',
      heroDescription:
        'Understanding how students process information and designing lessons that reduce cognitive overload.',
      headerDurationLabel: '7 min read',
      headerBadgeLabels: ['Cognitive science', 'Instructional design', 'Working memory'],
      payload: researchInsightPayloadPlaceholder,
    },
  },
  {
    id: 'ril-7',
    slug: 'metacognition-research',
    title: 'Metacognition: Teaching students to think about thinking',
    shortDescription:
      'Research-backed strategies for developing metacognitive skills that improve learning outcomes.',
    subtitle: 'Learning strategies',
    duration: '8 min read',
    ctaLabel: 'Read More',
    sectionKey: 'research-insights-library',
    researchInsightContent: {
      type: 'research-insight',
      renderProfile: 'research-article',
      variant: 'metacognition-research',
      description:
        'Research-backed strategies for developing metacognitive skills that improve learning outcomes.',
      heroSubtitle: 'Learning strategies',
      heroDescription:
        'Research-backed strategies for developing metacognitive skills that improve learning outcomes.',
      headerDurationLabel: '8 min read',
      headerBadgeLabels: ['Self-regulation', 'Reflection', 'Learning how to learn'],
      payload: researchInsightPayloadPlaceholder,
    },
  },
  {
    id: 'ril-8',
    slug: 'scaffolding-research',
    title: "Scaffolding instruction: Vygotsky's zone of proximal development",
    shortDescription:
      'Practical ways to provide just-right support that helps students reach their potential.',
    subtitle: 'Instructional design',
    duration: '6 min read',
    ctaLabel: 'Read More',
    sectionKey: 'research-insights-library',
    researchInsightContent: {
      type: 'research-insight',
      renderProfile: 'research-article',
      variant: 'scaffolding-research',
      description:
        'Practical ways to provide just-right support that helps students reach their potential.',
      heroSubtitle: 'Instructional design',
      heroDescription:
        'Practical ways to provide just-right support that helps students reach their potential.',
      headerDurationLabel: '6 min read',
      headerBadgeLabels: ['ZPD', 'Gradual release', 'Support'],
      payload: researchInsightPayloadPlaceholder,
    },
  },
  {
    id: 'ril-9',
    slug: 'cognitive-load-theory',
    title: 'Cognitive Load Theory: Designing lessons that don’t overwhelm students',
    shortDescription:
      'Learn how to structure instruction to reduce overload and improve student understanding.',
    subtitle: 'Learning science',
    duration: '7 min read',
    ctaLabel: 'Read More',
    sectionKey: 'research-insights-library',
    researchInsightContent: {
      type: 'research-insight',
      renderProfile: 'research-article',
      variant: 'research-structured-sections',
      description:
        'Understand how working memory limits affect learning and how to design instruction that maximizes clarity and retention.',
      heroSubtitle: 'Learning science',
      heroDescription:
        'Apply cognitive load principles to create clearer, more effective lessons that students can actually process and retain.',
      headerDurationLabel: '7 min read',
      headerBadgeLabels: ['Cognitive load', 'Instruction design', 'Memory'],
      payload: {
        summary: [
          'Students have limited working memory capacity.',
          'Overloading students reduces learning effectiveness.',
          'Well-structured instruction improves retention and understanding.',
        ],
        sections: [
          {
            id: 'section-1',
            title: 'What is Cognitive Load?',
            contentBlocks: [
              {
                type: 'text',
                heading: 'Understanding Working Memory',
                paragraphs: [
                  'Cognitive Load Theory explains how the human brain processes information during learning. Working memory has limited capacity, meaning students can only handle a certain amount of new information at once.',
                  'When too much information is presented simultaneously, learning breaks down. Effective instruction manages this load carefully.',
                ],
              },
            ],
          },
          {
            id: 'section-2',
            title: 'Types of Cognitive Load',
            contentBlocks: [
              {
                type: 'text',
                heading: 'Intrinsic, Extraneous, and Germane Load',
                paragraphs: [
                  'Intrinsic load relates to the complexity of the content itself.',
                  'Extraneous load comes from poor instructional design (e.g., cluttered slides or unclear instructions).',
                  'Germane load is the mental effort that contributes directly to learning.',
                ],
              },
            ],
          },
          {
            id: 'section-3',
            title: 'Classroom Applications',
            contentBlocks: [
              {
                type: 'text',
                heading: 'Reducing Overload',
                paragraphs: [
                  'Break content into smaller chunks.',
                  'Use clear, simple instructions.',
                  'Avoid unnecessary visuals or distractions.',
                ],
              },
              {
                type: 'interactive',
                title: 'Reflection',
                prompt:
                  'Think about your last lesson. Where might students have experienced overload?',
                tips: [
                  'Were instructions too long?',
                  'Did you introduce too many concepts at once?',
                  'Were visuals helping or distracting?',
                ],
              },
            ],
          },
        ],
        keyTakeaways: [
          'Less is more when introducing new concepts.',
          'Clear structure improves learning outcomes.',
          'Instructional design directly impacts student success.',
        ],
        implementationIdeas: [
          'Use step-by-step instructions for complex tasks.',
          'Limit slide content to key points only.',
          'Check understanding frequently before moving on.',
        ],
        references: [
          'Sweller, J. (1988). Cognitive Load During Problem Solving.',
          'Paas, F., & van Merriënboer, J. (1994). Instructional Design and Cognitive Load.',
        ],
        metadata: {
          difficulty: 'Intermediate',
          domain: 'Learning Science',
        },
      },
    },
  },
  {
    id: 'ril-10',
    slug: 'metacognition-strategies',
    title: 'Metacognition: Teaching students how to think about their thinking',
    shortDescription:
      'Help students become independent learners by building awareness of their own thinking processes.',
    subtitle: 'Learning strategies',
    duration: '5 min read',
    ctaLabel: 'Read More',
    sectionKey: 'research-insights-library',
    researchInsightContent: {
      type: 'research-insight',
      renderProfile: 'research-article',
      variant: 'metacognition-strategies',
      description:
        'Metacognition empowers students to plan, monitor, and evaluate their own learning, leading to deeper understanding and independence.',
      heroSubtitle: 'Learning strategies',
      heroDescription:
        'Equip students with the tools to reflect on their thinking, improve problem-solving, and take ownership of their learning journey.',
      headerDurationLabel: '5 min read',
      headerBadgeLabels: ['Metacognition', 'Self-regulation', 'Reflection'],
      payload: {
        summary: [
          'Metacognition means thinking about one’s own thinking.',
          'Students who reflect learn more effectively.',
          'Explicit strategy instruction improves outcomes.',
        ],
        sections: [
          {
            id: 'section-1',
            title: 'What is Metacognition?',
            contentBlocks: [
              {
                type: 'text',
                heading: 'Thinking About Thinking',
                paragraphs: [
                  'Metacognition refers to the ability to understand and regulate one’s own learning processes. It includes planning how to approach tasks, monitoring progress, and evaluating outcomes.',
                  'Students who develop metacognitive skills become more independent and effective learners over time.',
                ],
              },
            ],
          },
          {
            id: 'section-2',
            title: 'Core Components',
            contentBlocks: [
              {
                type: 'text',
                heading: 'Plan, Monitor, Evaluate',
                paragraphs: [
                  'Planning: Setting goals and choosing strategies before starting a task.',
                  'Monitoring: Checking understanding during the task.',
                  'Evaluating: Reflecting on what worked and what didn’t after completion.',
                ],
              },
            ],
          },
          {
            id: 'section-3',
            title: 'Classroom Strategies',
            contentBlocks: [
              {
                type: 'text',
                heading: 'Making Thinking Visible',
                paragraphs: [
                  'Use think-alouds to model your own thinking process.',
                  'Ask students reflective questions like “Why did you choose that strategy?”',
                  'Encourage students to explain their reasoning, not just answers.',
                ],
              },
              {
                type: 'interactive',
                title: 'Student Reflection Prompt',
                prompt:
                  'After completing a task, ask students: What strategy did you use, and how effective was it?',
                tips: [
                  'Keep reflections short and focused',
                  'Use sentence starters for younger students',
                  'Build reflection into routine, not as an extra task',
                ],
              },
            ],
          },
        ],
        keyTakeaways: [
          'Metacognition improves learning efficiency and independence.',
          'Students need explicit instruction in thinking strategies.',
          'Reflection should be embedded regularly in lessons.',
        ],
        implementationIdeas: [
          'Add a 2-minute reflection at the end of each lesson.',
          'Use learning journals for weekly reflections.',
          'Model thinking processes during problem-solving.',
        ],
        references: [
          'Flavell, J. H. (1979). Metacognition and Cognitive Monitoring.',
          'EEF (2018). Metacognition and Self-Regulated Learning.',
        ],
        metadata: {
          difficulty: 'Beginner',
          domain: 'Learning Strategies',
        },
      },
    },
  }
]
