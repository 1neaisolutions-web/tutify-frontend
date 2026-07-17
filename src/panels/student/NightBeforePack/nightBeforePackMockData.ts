import type { NightBeforePack } from './nightBeforePackTypes'
import { buildContent } from './nightBeforePackMockEngine'

function tomorrowAt(hour: number, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function inDaysAt(days: number, hour: number, minute = 0): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  return d.toISOString()
}

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

/** Pre-seeded demo packs — dates stay relative to “today”. */
export function getSeedPacks(): NightBeforePack[] {
  const bioTopics = ['Photosynthesis', 'Cellular respiration', 'Chloroplasts', 'Calvin cycle']
  const mathTopics = ['Quadratic equations', 'Slope & lines', 'Factoring']
  const englishTopics = ['Thesis writing', 'PEEL paragraphs', 'Evidence & analysis']
  const chemTopics = ['Balancing equations', 'Moles', 'Stoichiometry']

  const bioContent = buildContent('Science', bioTopics, 'seed_bio')
  const mathContent = buildContent('Math', mathTopics, 'seed_math')
  const englishContent = buildContent('English', englishTopics, 'seed_english')
  const chemContent = buildContent('Science', chemTopics, 'seed_chem')

  const now = Date.now()

  return [
    {
      id: 'nbp_bio_midterm',
      examId: 'ex1',
      title: 'Biology Midterm',
      subject: 'Science',
      topics: bioTopics,
      source: 'teacher-linked',
      status: 'ready',
      examAt: tomorrowAt(9, 0),
      estimatedMinutes: 25,
      readyAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      content: bioContent,
      progress: {
        sectionsViewed: [],
        mcqAnswers: {},
      },
    },
    {
      id: 'nbp_math_algebra',
      examId: null,
      title: 'Algebra Unit Test',
      subject: 'Math',
      topics: mathTopics,
      source: 'teacher-linked',
      status: 'scheduled',
      examAt: inDaysAt(3, 10, 30),
      estimatedMinutes: 25,
      createdAt: new Date(now - 48 * 60 * 60 * 1000).toISOString(),
      content: mathContent,
      progress: {
        sectionsViewed: [],
        mcqAnswers: {},
      },
    },
    {
      id: 'nbp_chem_retake',
      examId: null,
      title: 'Chemistry Retake Prep',
      subject: 'Science',
      topics: chemTopics,
      source: 'self-created',
      status: 'failed',
      examAt: inDaysAt(2, 14, 0),
      estimatedMinutes: 25,
      createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      content: chemContent,
      failureMessage: 'We couldn’t finish building this pack from your materials. Try again in a moment.',
      progress: {
        sectionsViewed: [],
        mcqAnswers: {},
      },
    },
    {
      id: 'nbp_english_essay',
      examId: null,
      title: 'English Essay Prep',
      subject: 'English',
      topics: englishTopics,
      source: 'self-created',
      status: 'completed',
      examAt: daysAgo(2),
      estimatedMinutes: 25,
      readyAt: daysAgo(3),
      createdAt: daysAgo(4),
      content: englishContent,
      progress: {
        sectionsViewed: ['summary', 'formulas', 'questionTypes', 'mcqs'],
        mcqAnswers: {
          mcq_1: 1,
          mcq_2: 1,
          mcq_3: 1,
          mcq_4: 1,
          mcq_5: 0,
        },
        mcqScore: 4,
        markedDoneAt: daysAgo(2),
        readAt: daysAgo(3),
      },
    },
  ]
}
