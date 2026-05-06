import type { ContentStatus, SubmissionStatus, ToolType } from '../types'
import type { HandoutLayoutOpts } from '../quiz/config/handoutLayoutConfig'
import {
  buildDemoQuizQuestionStubs,
  type AssignmentBriefTopicStub,
  type ExamSectionStub,
  type QuizQuestionStub,
} from './generationFromSources'
import type { WorksheetBlock } from './topicAwareGenerators'
import type { ExamPaperConfig } from '../exams/config/examPaperConfig'
import type { ExamLongStub, ExamMcqStub, ExamShortStub } from '../exams/demo/examQuestionStubs'

export const demoClasses = [
  { key: 'g5a', label: 'Grade 5 A', grade: 'Grade 5', subject: 'Mathematics' },
  { key: 'g6b', label: 'Grade 6 B', grade: 'Grade 6', subject: 'Science' },
  { key: 'g8c', label: 'Grade 8 C', grade: 'Grade 8', subject: 'English' },
  { key: 'g10sci', label: 'Grade 10 Science', grade: 'Grade 10', subject: 'Biology' },
  { key: 'y7blue', label: 'Year 7 Blue', grade: 'Year 7', subject: 'History' },
  { key: 'y9red', label: 'Year 9 Red', grade: 'Year 9', subject: 'Physics' },
  { key: 'g11calc', label: 'Year 11 Calculus', grade: 'Year 11', subject: 'Mathematics' },
  { key: 'g9lit', label: 'Year 9 Literature', grade: 'Year 9', subject: 'English' },
]

export const demoStudents: { id: string; name: string; classKey: string }[] = [
  { id: 's1', name: 'Aisha Rahman', classKey: 'g5a' },
  { id: 's2', name: 'Lucas Müller', classKey: 'g5a' },
  { id: 's3', name: 'Sofia García', classKey: 'g6b' },
  { id: 's4', name: 'James Okafor', classKey: 'g6b' },
  { id: 's5', name: 'Yuki Tanaka', classKey: 'g8c' },
  { id: 's6', name: 'Emma van Dijk', classKey: 'g10sci' },
  { id: 's7', name: 'Noah Kim', classKey: 'y7blue' },
  { id: 's8', name: 'Priya Sharma', classKey: 'y9red' },
  { id: 's9', name: 'Marcus Chen', classKey: 'g11calc' },
  { id: 's10', name: 'Olivia Brooks', classKey: 'g9lit' },
  { id: 's11', name: 'Diego Alvarez', classKey: 'g8c' },
  { id: 's12', name: 'Fatima Noor', classKey: 'y7blue' },
]

export interface DemoQuiz {
  id: string
  title: string
  subject: string
  grade: string
  classes: string[]
  questions: number
  totalMarks: number
  timeLimitMinutes: number
  status: ContentStatus
  assignedAt?: string
  dueAt?: string
  createdAt?: string
  updatedAt?: string
  submissionCount: number
  avgScore: number
  topic: string
  /** Catalog IDs selected for retrieval scope (quiz create RAG demo). */
  sourceBookIds?: string[]
  scopeTopics?: string[]
  scopeRefinement?: string
  sourceSummary?: string
  questionStubs?: QuizQuestionStub[]
  /** Shown to students when provided; optional for legacy seed rows. */
  studentInstructions?: string
  /** Generation profile; optional for legacy seed rows. */
  difficulty?: string
  shuffleQuestions?: boolean
  shuffleAnswers?: boolean
  negativeMarking?: boolean
  /** Line height + gap after questions for PDF / print handout. */
  handoutLayout?: HandoutLayoutOpts
}

export interface DemoAssignment {
  id: string
  title: string
  subject: string
  grade: string
  classes: string[]
  type: string
  dueAt: string
  createdAt?: string
  updatedAt?: string
  assignedCount: number
  submitted: number
  pending: number
  graded: number
  status: ContentStatus
  topic: string
  sourceSummary?: string
  /** Persisted review snapshot so print/PDF/export match latest edits. */
  briefTopics?: AssignmentBriefTopicStub[]
  studentInstructions?: string
  handoutLayout?: HandoutLayoutOpts
  /** Round-trip RAG + generation settings (API-backed assignments). */
  sourceBookIds?: string[]
  scopeTopics?: string[]
  scopeRefinement?: string
  generateWithoutSources?: boolean
  rigorProfile?: string
  teacherNotes?: string
  difficulty?: string
}

export interface DemoWorksheet {
  id: string
  title: string
  topic: string
  subject: string
  grade: string
  format: 'printable_pdf' | 'interactive_digital' | 'both'
  status: ContentStatus
  classes: string[]
  createdAt: string
  usageCount: number
  sourceSummary?: string
  /** Persisted review snapshot (sessions + blocks). */
  sessions?: { id: string; title: string; blocks: WorksheetBlock[] }[]
  handoutLayout?: HandoutLayoutOpts
}

export interface DemoExam {
  id: string
  title: string
  subject: string
  grade: string
  term: string
  classes: string[]
  examType: string
  durationMinutes: number
  totalMarks: number
  scheduleStart: string
  scheduleEnd: string
  status: ContentStatus
  completionPct: number
  sourceSummary?: string
  /** Persisted review snapshot so preview/export reflect latest changes. */
  paper?: ExamPaperConfig
  sections?: ExamSectionStub[]
  mcqs?: ExamMcqStub[]
  shorts?: ExamShortStub[]
  longs?: ExamLongStub[]
  handoutLayout?: HandoutLayoutOpts
}

export interface DemoTemplate {
  id: string
  name: string
  toolType: ToolType
  subject: string
  grade: string
  lastUsedAt: string
  createdBy: string
  usageCount: number
  isFeatured: boolean
  summary: string
}

export interface DemoSubmission {
  id: string
  toolType: ToolType
  contentId: string
  studentId: string
  studentName: string
  classKey: string
  status: SubmissionStatus
  submittedAt?: string
  score?: number
  totalMarks?: number
  attempt: number
  timeSpentMinutes?: number
  passFail?: 'pass' | 'fail'
}

type QuizSeed = {
  id: string
  title: string
  subject: string
  grade: string
  classes: string[]
  questions: number
  timeLimitMinutes: number
  status: ContentStatus
  assignedAt?: string
  dueAt?: string
  submissionCount: number
  avgScore: number
  topic: string
  sourceSummary?: string
}

const QUIZ_SEEDS: QuizSeed[] = [
  {
    id: 'q1',
    title: 'Algebra Basics Quiz',
    subject: 'Mathematics',
    grade: 'Grade 8',
    classes: ['g8c'],
    questions: 12,
    timeLimitMinutes: 30,
    status: 'published',
    assignedAt: '2026-04-01',
    dueAt: '2026-04-18',
    submissionCount: 28,
    avgScore: 18.4,
    topic: 'Linear equations',
    sourceSummary: 'System: Grade 8 Math Reader (Ch. 4–5)',
  },
  {
    id: 'q2',
    title: 'Photosynthesis Quick Check',
    subject: 'Biology',
    grade: 'Grade 10',
    classes: ['g10sci'],
    questions: 10,
    timeLimitMinutes: 20,
    status: 'scheduled',
    assignedAt: '2026-04-10',
    dueAt: '2026-04-22',
    submissionCount: 0,
    avgScore: 0,
    topic: 'Photosynthesis',
    sourceSummary: 'Topic only (no catalog grounding)',
  },
  {
    id: 'q3',
    title: 'Grammar & Punctuation',
    subject: 'English',
    grade: 'Year 7',
    classes: ['y7blue'],
    questions: 15,
    timeLimitMinutes: 25,
    status: 'draft',
    submissionCount: 0,
    avgScore: 0,
    topic: 'Sentence structure',
    sourceSummary: 'System: English Skills Workbook (Unit 2)',
  },
  {
    id: 'q4',
    title: 'Waves & Sound Review',
    subject: 'Physics',
    grade: 'Year 9',
    classes: ['y9red'],
    questions: 14,
    timeLimitMinutes: 35,
    status: 'published',
    assignedAt: '2026-04-05',
    dueAt: '2026-04-19',
    submissionCount: 22,
    avgScore: 21.2,
    topic: 'Wave properties',
    sourceSummary: 'Sources selected',
  },
  {
    id: 'q5',
    title: 'Civil Rights Movement Check-in',
    subject: 'History',
    grade: 'Year 7',
    classes: ['y7blue'],
    questions: 11,
    timeLimitMinutes: 28,
    status: 'published',
    assignedAt: '2026-04-03',
    dueAt: '2026-04-17',
    submissionCount: 26,
    avgScore: 16.8,
    topic: '1950s–1960s USA',
    sourceSummary: 'System: World History Themes (Ch. 12)',
  },
  {
    id: 'q6',
    title: 'Fractions & Decimals Warm-up',
    subject: 'Mathematics',
    grade: 'Grade 5',
    classes: ['g5a'],
    questions: 8,
    timeLimitMinutes: 20,
    status: 'published',
    assignedAt: '2026-04-02',
    dueAt: '2026-04-15',
    submissionCount: 24,
    avgScore: 13.1,
    topic: 'Operations with fractions',
    sourceSummary: 'Topic only (no catalog grounding)',
  },
  {
    id: 'q7',
    title: 'Cell Structure & Organelles',
    subject: 'Biology',
    grade: 'Grade 10',
    classes: ['g10sci'],
    questions: 16,
    timeLimitMinutes: 32,
    status: 'published',
    assignedAt: '2026-04-08',
    dueAt: '2026-04-24',
    submissionCount: 30,
    avgScore: 25.4,
    topic: 'Eukaryotic cells',
    sourceSummary: 'System: Biology Core (Ch. 3)',
  },
  {
    id: 'q8',
    title: 'Poetry Devices Mini-Quiz',
    subject: 'English',
    grade: 'Year 9',
    classes: ['g9lit'],
    questions: 9,
    timeLimitMinutes: 22,
    status: 'scheduled',
    assignedAt: '2026-04-12',
    dueAt: '2026-04-26',
    submissionCount: 0,
    avgScore: 0,
    topic: 'Metaphor and imagery',
    sourceSummary: 'Sources selected',
  },
  {
    id: 'q9',
    title: 'Derivatives Checkpoint',
    subject: 'Mathematics',
    grade: 'Year 11',
    classes: ['g11calc'],
    questions: 12,
    timeLimitMinutes: 40,
    status: 'archived',
    assignedAt: '2026-03-01',
    dueAt: '2026-03-20',
    submissionCount: 18,
    avgScore: 19.2,
    topic: 'Differentiation rules',
    sourceSummary: 'System: Calculus First Course (Sec 2.1–2.4)',
  },
  {
    id: 'q10',
    title: 'Climate Systems Quick Quiz',
    subject: 'Science',
    grade: 'Grade 6',
    classes: ['g6b'],
    questions: 10,
    timeLimitMinutes: 24,
    status: 'published',
    assignedAt: '2026-04-06',
    dueAt: '2026-04-21',
    submissionCount: 21,
    avgScore: 15.6,
    topic: 'Atmosphere and circulation',
    sourceSummary: 'Topic only (no catalog grounding)',
  },
  {
    id: 'q11',
    title: 'Electric Circuits Practice',
    subject: 'Physics',
    grade: 'Year 9',
    classes: ['y9red'],
    questions: 13,
    timeLimitMinutes: 30,
    status: 'draft',
    submissionCount: 0,
    avgScore: 0,
    topic: 'Series and parallel',
    sourceSummary: 'System: Physics Essentials (Unit 7)',
  },
  {
    id: 'q12',
    title: 'Reading Comprehension: Informational Text',
    subject: 'English',
    grade: 'Grade 8',
    classes: ['g8c'],
    questions: 12,
    timeLimitMinutes: 30,
    status: 'published',
    assignedAt: '2026-04-09',
    dueAt: '2026-04-23',
    submissionCount: 27,
    avgScore: 17.9,
    topic: 'Main idea & inference',
    sourceSummary: 'Sources selected',
  },
]

export const demoQuizzes: DemoQuiz[] = QUIZ_SEEDS.map((s) => ({
  ...s,
  totalMarks: s.questions * 2,
  questionStubs: buildDemoQuizQuestionStubs({
    quizId: s.id,
    topic: s.topic,
    subject: s.subject,
    grade: s.grade,
    count: s.questions,
  }),
}))

export const demoAssignments: DemoAssignment[] = [
  {
    id: 'a1',
    title: 'English Essay: Persuasive Writing',
    subject: 'English',
    grade: 'Grade 8',
    classes: ['g8c'],
    type: 'Essay',
    dueAt: '2026-04-20',
    assignedCount: 32,
    submitted: 24,
    pending: 5,
    graded: 19,
    status: 'active',
    topic: 'Climate action',
    sourceSummary: 'System: Writing Workshop (Unit 4)',
  },
  {
    id: 'a2',
    title: 'Lab Report: Chemical Reactions',
    subject: 'Chemistry',
    grade: 'Year 9',
    classes: ['y9red'],
    type: 'Lab report',
    dueAt: '2026-04-12',
    assignedCount: 26,
    submitted: 22,
    pending: 2,
    graded: 20,
    status: 'pending_review',
    topic: 'Acid-base reactions',
  },
  {
    id: 'a3',
    title: 'History Source Analysis',
    subject: 'History',
    grade: 'Year 7',
    classes: ['y7blue'],
    type: 'Short essay',
    dueAt: '2026-04-18',
    assignedCount: 28,
    submitted: 20,
    pending: 6,
    graded: 14,
    status: 'active',
    topic: 'Cold War documents',
  },
  {
    id: 'a4',
    title: 'Data Set Interpretation',
    subject: 'Mathematics',
    grade: 'Year 11',
    classes: ['g11calc'],
    type: 'Problem set',
    dueAt: '2026-04-14',
    assignedCount: 22,
    submitted: 21,
    pending: 1,
    graded: 21,
    status: 'active',
    topic: 'Regression basics',
  },
  {
    id: 'a5',
    title: 'Ecosystem Field Notes',
    subject: 'Biology',
    grade: 'Grade 10',
    classes: ['g10sci'],
    type: 'Field journal',
    dueAt: '2026-04-25',
    assignedCount: 24,
    submitted: 12,
    pending: 10,
    graded: 8,
    status: 'active',
    topic: 'Local biodiversity',
  },
  {
    id: 'a6',
    title: 'Creative Narrative Draft',
    subject: 'English',
    grade: 'Year 9',
    classes: ['g9lit'],
    type: 'Narrative',
    dueAt: '2026-04-16',
    assignedCount: 26,
    submitted: 24,
    pending: 2,
    graded: 18,
    status: 'pending_review',
    topic: 'Character arc',
  },
  {
    id: 'a7',
    title: 'Physics Problem Set: Forces',
    subject: 'Physics',
    grade: 'Year 9',
    classes: ['y9red'],
    type: 'Structured problems',
    dueAt: '2026-04-11',
    assignedCount: 25,
    submitted: 25,
    pending: 0,
    graded: 25,
    status: 'graded',
    topic: 'Newton’s laws',
  },
  {
    id: 'a8',
    title: 'Fraction Word Problems',
    subject: 'Mathematics',
    grade: 'Grade 5',
    classes: ['g5a'],
    type: 'Worksheet upload',
    dueAt: '2026-04-19',
    assignedCount: 20,
    submitted: 15,
    pending: 3,
    graded: 12,
    status: 'active',
    topic: 'Real-world fractions',
  },
  {
    id: 'a9',
    title: 'Art History Comparison',
    subject: 'History',
    grade: 'Year 7',
    classes: ['y7blue'],
    type: 'Comparative essay',
    dueAt: '2026-04-22',
    assignedCount: 27,
    submitted: 8,
    pending: 14,
    graded: 4,
    status: 'active',
    topic: 'Renaissance vs Baroque',
  },
  {
    id: 'a10',
    title: 'Scientific Method Summary',
    subject: 'Science',
    grade: 'Grade 6',
    classes: ['g6b'],
    type: 'Summary',
    dueAt: '2026-04-17',
    assignedCount: 24,
    submitted: 22,
    pending: 2,
    graded: 20,
    status: 'active',
    topic: 'Hypothesis and variables',
  },
  {
    id: 'a11',
    title: 'Debate Prep Brief',
    subject: 'English',
    grade: 'Grade 8',
    classes: ['g8c'],
    type: 'Brief',
    dueAt: '2026-04-24',
    assignedCount: 30,
    submitted: 5,
    pending: 22,
    graded: 2,
    status: 'active',
    topic: 'Renewable energy',
  },
  {
    id: 'a12',
    title: 'Maps & Projections Reflection',
    subject: 'History',
    grade: 'Year 7',
    classes: ['y7blue'],
    type: 'Reflection',
    dueAt: '2026-04-13',
    assignedCount: 28,
    submitted: 27,
    pending: 1,
    graded: 26,
    status: 'archived',
    topic: 'Cartography bias',
  },
]

export const demoWorksheets: DemoWorksheet[] = [
  {
    id: 'w1',
    title: 'Photosynthesis Worksheet',
    topic: 'Photosynthesis',
    subject: 'Biology',
    grade: 'Grade 10',
    format: 'interactive_digital',
    status: 'published',
    classes: ['g10sci'],
    createdAt: '2026-03-28',
    usageCount: 142,
    sourceSummary: 'System: Biology Core (Ch. 3)',
  },
  {
    id: 'w2',
    title: 'Fractions Practice Pack',
    topic: 'Fractions',
    subject: 'Mathematics',
    grade: 'Grade 5',
    format: 'printable_pdf',
    status: 'draft',
    classes: ['g5a'],
    createdAt: '2026-04-08',
    usageCount: 0,
  },
  {
    id: 'w3',
    title: 'Linear Functions Drill',
    topic: 'Linear functions',
    subject: 'Mathematics',
    grade: 'Grade 8',
    classes: ['g8c'],
    format: 'interactive_digital',
    status: 'published',
    createdAt: '2026-04-01',
    usageCount: 96,
  },
  {
    id: 'w4',
    title: 'World War I Timeline',
    topic: 'WWI',
    subject: 'History',
    grade: 'Year 7',
    classes: ['y7blue'],
    format: 'printable_pdf',
    status: 'published',
    createdAt: '2026-03-15',
    usageCount: 78,
  },
  {
    id: 'w5',
    title: 'Energy & Motion Vocabulary',
    topic: 'Energy',
    subject: 'Physics',
    grade: 'Year 9',
    classes: ['y9red'],
    format: 'interactive_digital',
    status: 'published',
    createdAt: '2026-04-05',
    usageCount: 64,
  },
  {
    id: 'w6',
    title: 'Grammar: Clauses & Phrases',
    topic: 'Clauses',
    subject: 'English',
    grade: 'Year 9',
    classes: ['g9lit'],
    format: 'interactive_digital',
    status: 'scheduled',
    createdAt: '2026-04-10',
    usageCount: 12,
  },
  {
    id: 'w7',
    title: 'Water Cycle Diagram Pack',
    topic: 'Water cycle',
    subject: 'Science',
    grade: 'Grade 6',
    classes: ['g6b'],
    format: 'printable_pdf',
    status: 'published',
    createdAt: '2026-03-22',
    usageCount: 110,
  },
  {
    id: 'w8',
    title: 'Derivatives Skill Sheet',
    topic: 'Derivatives',
    subject: 'Mathematics',
    grade: 'Year 11',
    classes: ['g11calc'],
    format: 'printable_pdf',
    status: 'published',
    createdAt: '2026-03-30',
    usageCount: 54,
  },
  {
    id: 'w9',
    title: 'Literary Devices Hunt',
    topic: 'Devices',
    subject: 'English',
    grade: 'Grade 8',
    classes: ['g8c'],
    format: 'interactive_digital',
    status: 'draft',
    createdAt: '2026-04-09',
    usageCount: 0,
  },
  {
    id: 'w10',
    title: 'Cell Division Checklist',
    topic: 'Mitosis',
    subject: 'Biology',
    grade: 'Grade 10',
    classes: ['g10sci'],
    format: 'interactive_digital',
    status: 'published',
    createdAt: '2026-04-02',
    usageCount: 88,
  },
  {
    id: 'w11',
    title: 'Chemical Symbols Quick Match',
    topic: 'Symbols',
    subject: 'Chemistry',
    grade: 'Year 9',
    classes: ['y9red'],
    format: 'interactive_digital',
    status: 'archived',
    createdAt: '2026-02-10',
    usageCount: 201,
  },
  {
    id: 'w12',
    title: 'Decimal Operations Mixed',
    topic: 'Decimals',
    subject: 'Mathematics',
    grade: 'Grade 5',
    classes: ['g5a'],
    format: 'printable_pdf',
    status: 'published',
    createdAt: '2026-04-06',
    usageCount: 41,
  },
]

export const demoExams: DemoExam[] = [
  {
    id: 'e1',
    title: 'Midterm Science Exam',
    subject: 'Science',
    grade: 'Grade 6',
    term: 'Term 2',
    classes: ['g6b'],
    examType: 'Midterm',
    durationMinutes: 90,
    totalMarks: 100,
    scheduleStart: '2026-04-25T09:00:00',
    scheduleEnd: '2026-04-25T10:30:00',
    status: 'scheduled',
    completionPct: 0,
    sourceSummary: 'System: Integrated Science (Terms 1–2)',
  },
  {
    id: 'e2',
    title: 'Unit Test: World War II',
    subject: 'History',
    grade: 'Year 7',
    classes: ['y7blue'],
    examType: 'Unit test',
    durationMinutes: 45,
    totalMarks: 50,
    scheduleStart: '2026-03-15T14:00:00',
    scheduleEnd: '2026-03-15T14:45:00',
    status: 'completed',
    completionPct: 96,
    term: 'Term 1',
  },
  {
    id: 'e3',
    title: 'Biology Semester A',
    subject: 'Biology',
    grade: 'Grade 10',
    classes: ['g10sci'],
    examType: 'Semester',
    durationMinutes: 120,
    totalMarks: 120,
    scheduleStart: '2026-05-02T09:00:00',
    scheduleEnd: '2026-05-02T11:00:00',
    status: 'scheduled',
    completionPct: 0,
    term: 'Term 2',
  },
  {
    id: 'e4',
    title: 'Algebra I Final Practice',
    subject: 'Mathematics',
    grade: 'Grade 8',
    classes: ['g8c'],
    examType: 'Mock',
    durationMinutes: 60,
    totalMarks: 60,
    scheduleStart: '2026-04-20T10:00:00',
    scheduleEnd: '2026-04-20T11:00:00',
    status: 'draft',
    completionPct: 0,
    term: 'Term 2',
  },
  {
    id: 'e5',
    title: 'Physics Mechanics Exam',
    subject: 'Physics',
    grade: 'Year 9',
    classes: ['y9red'],
    examType: 'Unit test',
    durationMinutes: 75,
    totalMarks: 80,
    scheduleStart: '2026-04-28T13:00:00',
    scheduleEnd: '2026-04-28T14:15:00',
    status: 'scheduled',
    completionPct: 0,
    term: 'Term 2',
  },
  {
    id: 'e6',
    title: 'English Literature Paper 1',
    subject: 'English',
    grade: 'Year 9',
    classes: ['g9lit'],
    examType: 'Final',
    durationMinutes: 90,
    totalMarks: 70,
    scheduleStart: '2026-05-15T09:30:00',
    scheduleEnd: '2026-05-15T11:00:00',
    status: 'scheduled',
    completionPct: 0,
    term: 'Term 2',
  },
  {
    id: 'e7',
    title: 'Calculus Techniques Check',
    subject: 'Mathematics',
    grade: 'Year 11',
    classes: ['g11calc'],
    examType: 'Unit test',
    durationMinutes: 50,
    totalMarks: 55,
    scheduleStart: '2026-04-18T08:00:00',
    scheduleEnd: '2026-04-18T08:50:00',
    status: 'completed',
    completionPct: 91,
    term: 'Term 2',
  },
  {
    id: 'e8',
    title: 'Chemistry Periodic Table Test',
    subject: 'Chemistry',
    grade: 'Year 9',
    classes: ['y9red'],
    examType: 'Unit test',
    durationMinutes: 40,
    totalMarks: 45,
    scheduleStart: '2026-04-10T11:00:00',
    scheduleEnd: '2026-04-10T11:40:00',
    status: 'completed',
    completionPct: 88,
    term: 'Term 2',
  },
  {
    id: 'e9',
    title: 'Primary Mathematics Checkpoint',
    subject: 'Mathematics',
    grade: 'Grade 5',
    classes: ['g5a'],
    examType: 'Checkpoint',
    durationMinutes: 45,
    totalMarks: 40,
    scheduleStart: '2026-05-05T09:00:00',
    scheduleEnd: '2026-05-05T09:45:00',
    status: 'scheduled',
    completionPct: 0,
    term: 'Term 2',
  },
  {
    id: 'e10',
    title: 'Global Issues Source Paper',
    subject: 'History',
    grade: 'Year 7',
    classes: ['y7blue'],
    examType: 'Structured exam',
    durationMinutes: 55,
    totalMarks: 50,
    scheduleStart: '2026-05-08T10:00:00',
    scheduleEnd: '2026-05-08T10:55:00',
    status: 'draft',
    completionPct: 0,
    term: 'Term 2',
  },
  {
    id: 'e11',
    title: 'Science Inquiry Skills',
    subject: 'Science',
    grade: 'Grade 6',
    classes: ['g6b'],
    examType: 'Performance',
    durationMinutes: 60,
    totalMarks: 60,
    scheduleStart: '2026-04-30T13:30:00',
    scheduleEnd: '2026-04-30T14:30:00',
    status: 'scheduled',
    completionPct: 42,
    term: 'Term 2',
  },
  {
    id: 'e12',
    title: 'Rivers & Landscapes Field Exam',
    subject: 'Geography',
    grade: 'Year 7',
    classes: ['y7blue'],
    examType: 'Practical',
    durationMinutes: 50,
    totalMarks: 50,
    scheduleStart: '2026-05-12T09:00:00',
    scheduleEnd: '2026-05-12T09:50:00',
    status: 'archived',
    completionPct: 100,
    term: 'Term 1',
  },
]

export const demoTemplates: DemoTemplate[] = [
  {
    id: 't1',
    name: '5-question formative quiz',
    toolType: 'quiz',
    subject: 'Science',
    grade: 'Grade 6',
    lastUsedAt: '2026-04-09',
    createdBy: 'You',
    usageCount: 18,
    isFeatured: true,
    summary: 'MCQ + short answer mix with auto-grading',
  },
  {
    id: 't2',
    name: 'Rubric-based essay',
    toolType: 'assignment',
    subject: 'English',
    grade: 'Grade 8',
    lastUsedAt: '2026-04-02',
    createdBy: 'School library',
    usageCount: 42,
    isFeatured: true,
    summary: 'Thesis, evidence, coherence, conventions',
  },
  {
    id: 't3',
    name: 'Topic worksheet (digital)',
    toolType: 'worksheet',
    subject: 'Biology',
    grade: 'Grade 10',
    lastUsedAt: '2026-03-30',
    createdBy: 'You',
    usageCount: 11,
    isFeatured: false,
    summary: 'MCQ + fill-in + short response blocks',
  },
  {
    id: 't4',
    name: 'Formal exam (2 sections)',
    toolType: 'exam',
    subject: 'Mathematics',
    grade: 'Year 9',
    lastUsedAt: '2026-02-14',
    createdBy: 'Institution',
    usageCount: 6,
    isFeatured: false,
    summary: 'Section A MCQ, Section B structured',
  },
  {
    id: 't5',
    name: 'Exit ticket (3 items)',
    toolType: 'quiz',
    subject: 'Mathematics',
    grade: 'Grade 5',
    lastUsedAt: '2026-04-11',
    createdBy: 'You',
    usageCount: 27,
    isFeatured: true,
    summary: 'Fast MCQ + one short response',
  },
  {
    id: 't6',
    name: 'Lab practical write-up',
    toolType: 'assignment',
    subject: 'Physics',
    grade: 'Year 9',
    lastUsedAt: '2026-04-07',
    createdBy: 'Department',
    usageCount: 33,
    isFeatured: false,
    summary: 'Hypothesis, method, results, evaluation',
  },
  {
    id: 't7',
    name: 'Revision crossword + matching',
    toolType: 'worksheet',
    subject: 'History',
    grade: 'Year 7',
    lastUsedAt: '2026-03-20',
    createdBy: 'School library',
    usageCount: 51,
    isFeatured: false,
    summary: 'Vocabulary + chronology',
  },
  {
    id: 't8',
    name: 'Timed reading quiz',
    toolType: 'quiz',
    subject: 'English',
    grade: 'Year 9',
    lastUsedAt: '2026-04-13',
    createdBy: 'You',
    usageCount: 14,
    isFeatured: false,
    summary: 'Passage + inference items',
  },
  {
    id: 't9',
    name: 'STEAM project checkpoint',
    toolType: 'assignment',
    subject: 'Science',
    grade: 'Grade 8',
    lastUsedAt: '2026-04-05',
    createdBy: 'Institution',
    usageCount: 9,
    isFeatured: false,
    summary: 'Milestones + peer review grid',
  },
  {
    id: 't10',
    name: 'Printable skills strip',
    toolType: 'worksheet',
    subject: 'Mathematics',
    grade: 'Grade 8',
    lastUsedAt: '2026-04-01',
    createdBy: 'You',
    usageCount: 62,
    isFeatured: true,
    summary: 'Skill-of-the-day strip layout',
  },
  {
    id: 't11',
    name: 'Oral defense scheduling shell',
    toolType: 'exam',
    subject: 'English',
    grade: 'Grade 10',
    lastUsedAt: '2026-02-28',
    createdBy: 'Department',
    usageCount: 4,
    isFeatured: false,
    summary: 'Sections + timing bands',
  },
  {
    id: 't12',
    name: 'Number talks starter pack',
    toolType: 'worksheet',
    subject: 'Mathematics',
    grade: 'Grade 5',
    lastUsedAt: '2026-03-25',
    createdBy: 'You',
    usageCount: 38,
    isFeatured: false,
    summary: 'Talk stems + reflection prompts',
  },
]

function seedSubmissions(): DemoSubmission[] {
  const out: DemoSubmission[] = []
  demoQuizzes.forEach((q) => {
    demoStudents.slice(0, 8).forEach((st, i) => {
      if (q.status === 'draft' || q.status === 'scheduled') return
      out.push({
        id: `sub-q-${q.id}-${st.id}`,
        toolType: 'quiz',
        contentId: q.id,
        studentId: st.id,
        studentName: st.name,
        classKey: st.classKey,
        status: i % 4 === 0 ? 'graded' : i % 4 === 1 ? 'submitted' : 'late_submitted',
        submittedAt: '2026-04-14T10:00:00',
        score: Math.min(q.totalMarks, 8 + (i % 12) + Math.floor(q.totalMarks / 4)),
        totalMarks: q.totalMarks,
        attempt: 1,
        timeSpentMinutes: 18 + i,
        passFail:
          (Math.min(q.totalMarks, 8 + (i % 12) + Math.floor(q.totalMarks / 4)) ?? 0) / q.totalMarks >= 0.5
            ? 'pass'
            : 'fail',
      })
    })
  })
  demoAssignments.forEach((a) => {
    demoStudents.slice(0, 8).forEach((st, i) => {
      out.push({
        id: `sub-a-${a.id}-${st.id}`,
        toolType: 'assignment',
        contentId: a.id,
        studentId: st.id,
        studentName: st.name,
        classKey: st.classKey,
        status:
          i === 0
            ? 'missing'
            : i === 1
              ? 'under_review'
              : i === 2
                ? 'graded'
                : 'late_submitted',
        submittedAt: i === 0 ? undefined : '2026-04-13T15:30:00',
        score: i === 0 ? undefined : 62 + i * 3,
        totalMarks: 100,
        attempt: 1,
      })
    })
  })
  return out
}

export const demoSubmissions = seedSubmissions()

export const overviewKpis = {
  activeItems: 52,
  scheduledThisWeek: 9,
  pendingReview: 18,
  submissionsReceived: 428,
  avgCompletion: 0.81,
  avgScore: 77.2,
}

export const activityFeed = [
  { id: '1', text: 'Algebra Basics Quiz — 12 new submissions', time: '12 min ago', type: 'submission', subject: 'Mathematics', grade: 'Grade 8', classKey: 'g8c', activityDate: '2026-04-16' },
  { id: '2', text: 'English Essay marked: 8 students', time: '1 hr ago', type: 'graded', subject: 'English', grade: 'Year 9', classKey: 'g9lit', activityDate: '2026-04-16' },
  { id: '3', text: 'Midterm Science Exam scheduled for Apr 25', time: '3 hr ago', type: 'schedule', subject: 'Science', grade: 'Grade 6', classKey: 'g6b', activityDate: '2026-04-16' },
  { id: '4', text: 'Waves & Sound Review — analytics updated', time: '4 hr ago', type: 'analytics', subject: 'Physics', grade: 'Year 9', classKey: 'y9red', activityDate: '2026-04-16' },
  { id: '5', text: 'Fractions Practice Pack draft saved', time: '5 hr ago', type: 'draft', subject: 'Mathematics', grade: 'Grade 5', classKey: 'g5a', activityDate: '2026-04-16' },
  { id: '6', text: 'Lab Report batch — 6 late submissions', time: '6 hr ago', type: 'submission', subject: 'Chemistry', grade: 'Grade 10', classKey: 'g10sci', activityDate: '2026-04-16' },
  { id: '7', text: 'Civil Rights Quiz — average 74%', time: 'Yesterday', type: 'graded', subject: 'History', grade: 'Year 7', classKey: 'y7blue', activityDate: '2026-04-15' },
  { id: '8', text: 'Biology semester exam window opened', time: 'Yesterday', type: 'schedule', subject: 'Biology', grade: 'Grade 10', classKey: 'g10sci', activityDate: '2026-04-15' },
  { id: '9', text: 'Template “Exit ticket” used 4× today', time: 'Yesterday', type: 'template', subject: 'Mathematics', grade: 'Grade 8', classKey: 'g8c', activityDate: '2026-04-15' },
  { id: '10', text: 'Derivatives checkpoint archived', time: '2 days ago', type: 'archive', subject: 'Mathematics', grade: 'Year 11', classKey: 'g11calc', activityDate: '2026-04-14' },
  { id: '11', text: 'Poetry Devices quiz scheduled', time: '2 days ago', type: 'schedule', subject: 'English', grade: 'Year 9', classKey: 'g9lit', activityDate: '2026-04-14' },
  { id: '12', text: 'Water Cycle worksheet — 110 opens', time: '3 days ago', type: 'analytics', subject: 'Science', grade: 'Grade 6', classKey: 'g6b', activityDate: '2026-04-13' },
]

export const upcomingDeadlines = [
  { id: 'd1', title: 'Grammar & Punctuation', date: '2026-04-16', tool: 'Quiz', subject: 'English', grade: 'Year 7', classKey: 'y7blue' },
  { id: 'd2', title: 'Lab Report: Chemical Reactions', date: '2026-04-12', tool: 'Assignment', subject: 'Chemistry', grade: 'Grade 10', classKey: 'g10sci' },
  { id: 'd3', title: 'History Source Analysis', date: '2026-04-18', tool: 'Assignment', subject: 'History', grade: 'Year 7', classKey: 'y7blue' },
  { id: 'd4', title: 'Electric Circuits Practice', date: '2026-04-20', tool: 'Quiz', subject: 'Physics', grade: 'Year 9', classKey: 'y9red' },
  { id: 'd5', title: 'Biology Semester A', date: '2026-05-02', tool: 'Exam', subject: 'Biology', grade: 'Grade 10', classKey: 'g10sci' },
  { id: 'd6', title: 'Debate Prep Brief', date: '2026-04-24', tool: 'Assignment', subject: 'English', grade: 'Year 9', classKey: 'g9lit' },
  { id: 'd7', title: 'Physics Mechanics Exam', date: '2026-04-28', tool: 'Exam', subject: 'Physics', grade: 'Year 9', classKey: 'y9red' },
  { id: 'd8', title: 'Climate Systems Quick Quiz', date: '2026-04-21', tool: 'Quiz', subject: 'Science', grade: 'Grade 6', classKey: 'g6b' },
  { id: 'd9', title: 'Literature Paper 1', date: '2026-05-15', tool: 'Exam', subject: 'English', grade: 'Year 9', classKey: 'g9lit' },
  { id: 'd10', title: 'Fraction Word Problems', date: '2026-04-19', tool: 'Assignment', subject: 'Mathematics', grade: 'Grade 5', classKey: 'g5a' },
  { id: 'd11', title: 'Rivers & Landscapes (archived)', date: '2026-05-12', tool: 'Exam', subject: 'Geography', grade: 'Year 7', classKey: 'y7blue' },
  { id: 'd12', title: 'Reading Comprehension Quiz', date: '2026-04-23', tool: 'Quiz', subject: 'English', grade: 'Grade 8', classKey: 'g8c' },
]

export const draftItems = [
  { id: 'q3', title: 'Grammar & Punctuation', tool: 'Quiz', updated: '2026-04-10', subject: 'English', grade: 'Year 7', classKey: 'y7blue' },
  { id: 'w2', title: 'Fractions Practice Pack', tool: 'Worksheet', updated: '2026-04-08', subject: 'Mathematics', grade: 'Grade 5', classKey: 'g5a' },
  { id: 'q11', title: 'Electric Circuits Practice', tool: 'Quiz', updated: '2026-04-09', subject: 'Physics', grade: 'Year 9', classKey: 'y9red' },
  { id: 'w9', title: 'Literary Devices Hunt', tool: 'Worksheet', updated: '2026-04-09', subject: 'English', grade: 'Year 9', classKey: 'g9lit' },
  { id: 'e4', title: 'Algebra I Final Practice', tool: 'Exam', updated: '2026-04-07', subject: 'Mathematics', grade: 'Year 11', classKey: 'g11calc' },
  { id: 'e10', title: 'Global Issues Source Paper', tool: 'Exam', updated: '2026-04-06', subject: 'History', grade: 'Year 7', classKey: 'y7blue' },
  { id: 'q8', title: 'Poetry Devices Mini-Quiz', tool: 'Quiz', updated: '2026-04-05', subject: 'English', grade: 'Year 9', classKey: 'g9lit' },
  { id: 'a11', title: 'Debate Prep Brief', tool: 'Assignment', updated: '2026-04-10', subject: 'English', grade: 'Year 9', classKey: 'g9lit' },
  { id: 'w6', title: 'Grammar: Clauses & Phrases', tool: 'Worksheet', updated: '2026-04-10', subject: 'English', grade: 'Grade 8', classKey: 'g8c' },
  { id: 'a5', title: 'Ecosystem Field Notes', tool: 'Assignment', updated: '2026-04-04', subject: 'Biology', grade: 'Grade 10', classKey: 'g10sci' },
  { id: 'e3', title: 'Biology Semester A', tool: 'Exam', updated: '2026-04-03', subject: 'Biology', grade: 'Grade 10', classKey: 'g10sci' },
  { id: 'q2', title: 'Photosynthesis Quick Check', tool: 'Quiz', updated: '2026-04-08', subject: 'Biology', grade: 'Grade 10', classKey: 'g10sci' },
]

/** Built-in library rows (read-only for delete/update in client session). */
export const TEACHER_TOOLS_SEED_QUIZ_IDS = new Set(demoQuizzes.map((q) => q.id))
export const TEACHER_TOOLS_SEED_ASSIGNMENT_IDS = new Set(demoAssignments.map((a) => a.id))
export const TEACHER_TOOLS_SEED_WORKSHEET_IDS = new Set(demoWorksheets.map((w) => w.id))
export const TEACHER_TOOLS_SEED_EXAM_IDS = new Set(demoExams.map((e) => e.id))
