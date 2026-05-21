/**
 * Demo data for Remotion — mirrors /learning-hub and formative-assessment-strategies
 * from src/features/learningHub/content/personalizedMicroCourses.ts
 */

export const DEMO_HUB_HERO = {
  title: 'Your Professional Growth Hub',
  subtitle:
    'Personalized micro-courses, AI-guided tutorials, and evidence-backed insights — built for your classroom.',
  unlocked: 12,
  prepared: 8,
  readiness: 94,
}

export const DEMO_MICRO_COURSES = [
  {
    title: 'Quick wins: Classroom management essentials',
    category: 'Classroom management',
    duration: '8 min',
    difficulty: 'Beginner',
    progress: 0,
    cta: 'Start',
    featured: false,
  },
  {
    title: 'Formative assessment strategies that work',
    category: 'Assessment strategies',
    duration: '6 min',
    difficulty: 'Intermediate',
    progress: 0,
    cta: 'Start',
    featured: true,
  },
  {
    title: 'Differentiation made simple',
    category: 'Differentiation',
    duration: '10 min',
    difficulty: 'Beginner',
    progress: 45,
    cta: 'Continue',
    featured: false,
  },
  {
    title: 'Engaging reluctant learners',
    category: 'Student engagement',
    duration: '7 min',
    difficulty: 'Intermediate',
    progress: 0,
    cta: 'Locked',
    featured: false,
    locked: true,
  },
] as const

export const DEMO_GROWTH_REC = {
  skill: 'Formative assessment mastery',
  reason: 'Based on your recent quiz and worksheet activity in mathematics.',
  impact: 'High',
  time: '2 weeks',
}

export const DEMO_COURSE = {
  title: 'Formative assessment strategies that work',
  subtitle: 'Assessment strategies',
  duration: '6 min',
  difficulty: 'Intermediate',
  description:
    'Learn evidence-based formative assessment techniques that provide real-time insights into student learning and guide your instruction.',
  learningObjectives: [
    'Implement quick-check strategies to gauge student understanding',
    'Use exit tickets and peer assessment effectively',
    'Provide actionable feedback that moves learning forward',
  ],
  lessons: [
    {
      id: 1,
      title: 'The Power of Formative Assessment',
      duration: '2 min',
      blocks: [
        {
          type: 'text' as const,
          heading: 'Why Formative Assessment Matters',
          body: 'Formative assessment gathers evidence about student learning during instruction to inform teaching decisions — not at the end of a unit.',
        },
        {
          type: 'text' as const,
          heading: 'Key Characteristics',
          body: 'Low-stakes, frequent, actionable, and student-focused. Research shows effect sizes of 0.4–0.7 on achievement.',
        },
        {
          type: 'interactive' as const,
          heading: 'Reflection',
          body: 'How often do you check for understanding during a lesson? Aim for 3–5 quick check-ins per class.',
        },
      ],
    },
    {
      id: 2,
      title: 'Quick-Check Strategies',
      duration: '2 min',
      blocks: [
        {
          type: 'text' as const,
          heading: 'Thumbs Up, Down, Sideways',
          body: 'A simple non-verbal check: thumbs up (I understand), down (need help), sideways (getting there).',
        },
        {
          type: 'text' as const,
          heading: 'Traffic Light Cards',
          body: 'Red, yellow, and green cards give you an instant visual of where the class stands.',
        },
      ],
    },
    {
      id: 3,
      title: 'Exit Tickets & Peer Assessment',
      duration: '2 min',
      blocks: [
        {
          type: 'text' as const,
          heading: 'Effective Exit Tickets',
          body: 'Brief 2–3 minute assessments at class end focused on one key question or concept.',
        },
        {
          type: 'interactive' as const,
          heading: 'Design Your Exit Ticket',
          body: 'Create a prompt for your next lesson — specific, quick, and actionable.',
        },
      ],
    },
  ],
  quizSubtitle: 'Test your understanding of formative assessment strategies',
  quizQuestions: [
    {
      id: 1,
      question: 'What is the primary purpose of formative assessment?',
      options: [
        'To assign grades to students',
        'To evaluate learning at the end of a unit',
        'To gather evidence during instruction to inform teaching decisions',
        'To compare students to each other',
      ],
      correctAnswer: 2,
      explanation:
        'Formative assessment is used during instruction to gather evidence and adjust teaching accordingly.',
    },
    {
      id: 2,
      question: 'Which quick-check strategy provides an instant visual of class understanding?',
      options: ['Written essays', 'Traffic light cards', 'Multiple choice tests', 'Oral presentations'],
      correctAnswer: 1,
      explanation:
        'Traffic light cards let students show understanding level immediately.',
    },
    {
      id: 3,
      question: 'Effective exit tickets should:',
      options: [
        'Take 15–20 minutes to complete',
        'Focus on multiple concepts',
        'Take 2–3 minutes and focus on one key question',
        'Be graded for accuracy',
      ],
      correctAnswer: 2,
      explanation: 'Exit tickets should be brief and focused on one key concept.',
    },
    {
      id: 4,
      question: 'What is a key benefit of peer assessment?',
      options: [
        'It reduces teacher workload only',
        'It helps students develop critical thinking and self-reflection skills',
        'It eliminates teacher feedback',
        'It ensures identical grades',
      ],
      correctAnswer: 1,
      explanation: 'Peer assessment builds critical thinking as students apply criteria.',
    },
  ],
  successMessage:
    "You've demonstrated a strong understanding of formative assessment strategies!",
}

/** Flatten lessons into linear steps for timeline-driven playback */
export const DEMO_LESSON_STEPS = DEMO_COURSE.lessons.flatMap((lesson, lessonIdx) =>
  lesson.blocks.map((block, blockIdx) => ({
    lessonIdx,
    blockIdx,
    lessonTitle: lesson.title,
    lessonDuration: lesson.duration,
    lessonCount: DEMO_COURSE.lessons.length,
    blockCount: lesson.blocks.length,
    block,
  })),
)
