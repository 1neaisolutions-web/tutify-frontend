import { newDemoId } from '../demo/newDemoId'
import type { QuizQuestionStub } from '../demo/generationFromSources'
import type { TeacherToolExemplarPack } from './types'

export type QuizExemplarInput = {
  title: string
  subject: string
  grade: string
  studentInstructions: string
  teacherNotes: string
  generateWithoutSources: boolean
  bookIds: string[]
  topics: string[]
  scopeRefinement: string
  mixMode: 'balanced' | 'custom'
  questionCount: number
  countMcq: number
  countTf: number
  countShort: number
  difficulty: 'foundation' | 'standard' | 'challenge'
  includeMcq: boolean
  includeTf: boolean
  includeShort: boolean
  timeLimit: number
  shuffleQuestions: boolean
  shuffleAnswers: boolean
  negativeMarking: boolean
}

export type QuizExemplarOutput = {
  questions: QuizQuestionStub[]
}

export const QUIZ_EXEMPLAR: TeacherToolExemplarPack<QuizExemplarInput, QuizExemplarOutput> = {
  label: 'Fractions & decimals check (Grade 5)',
  input: {
    title: 'Fractions & decimals — retrieval check',
    subject: 'Mathematics',
    grade: 'Grade 5',
    studentInstructions: 'Answer all questions. Show working for short-answer items.',
    teacherNotes: 'Emphasise equivalence and place value; include one real-world context item.',
    generateWithoutSources: false,
    bookIds: ['book-math-heinemann-8'],
    topics: ['Fractions', 'Decimals', 'Place value'],
    scopeRefinement: 'Focus on comparing and ordering fractions with unlike denominators.',
    mixMode: 'balanced',
    questionCount: 8,
    countMcq: 4,
    countTf: 2,
    countShort: 2,
    difficulty: 'standard',
    includeMcq: true,
    includeTf: true,
    includeShort: true,
    timeLimit: 25,
    shuffleQuestions: true,
    shuffleAnswers: true,
    negativeMarking: false,
  },
  output: {
    questions: [
      {
        id: newDemoId('qq'),
        type: 'mcq',
        points: 2,
        prompt: 'Which fraction is equivalent to 3/4?',
        options: ['6/8', '2/3', '4/6', '9/12'],
      },
      {
        id: newDemoId('qq'),
        type: 'mcq',
        points: 2,
        prompt: 'What is 0.75 written as a fraction in simplest form?',
        options: ['3/4', '75/10', '7/5', '15/20'],
      },
      {
        id: newDemoId('qq'),
        type: 'tf',
        points: 1,
        prompt: '0.5 is greater than 1/3.',
      },
      {
        id: newDemoId('qq'),
        type: 'tf',
        points: 1,
        prompt: 'Two fractions with different denominators can still be equal.',
      },
      {
        id: newDemoId('qq'),
        type: 'short',
        points: 3,
        prompt: 'Order these from least to greatest: 1/2, 0.6, 3/5. Explain your reasoning.',
        responseLines: 4,
      },
      {
        id: newDemoId('qq'),
        type: 'mcq',
        points: 2,
        prompt: 'A recipe uses 2/3 cup of flour. Which amount is closest in decimal form?',
        options: ['0.33', '0.67', '0.75', '0.50'],
      },
      {
        id: newDemoId('qq'),
        type: 'short',
        points: 3,
        prompt: 'Convert 3/8 to a decimal. Show your steps.',
        responseLines: 3,
      },
      {
        id: newDemoId('qq'),
        type: 'mcq',
        points: 2,
        prompt: 'Which statement best compares 0.4 and 2/5?',
        options: ['They are equal', '0.4 is greater', '2/5 is greater', 'Cannot be compared'],
      },
    ],
  },
}
