import { newDemoId } from '../demo/newDemoId'
import type { ExamSectionStub } from '../demo/generationFromSources'
import type { LocalLong, LocalMcq, LocalShort } from '../exams/examApiAdapters'
import { DEFAULT_EXAM_PAPER, type ExamPaperConfig } from '../exams/config/examPaperConfig'
import type { TeacherToolExemplarPack } from './types'

export type ExamExemplarInput = {
  title: string
  examType: string
  term: string
  durationMinutes: number
  subject: string
  grade: string
  internationalStandard: string
  sectionTargetCount: number
  paper: ExamPaperConfig
  generateWithoutSources: boolean
  bookIds: string[]
  topics: string[]
  scopeRefinement: string
}

export type ExamExemplarOutput = {
  mcqs: LocalMcq[]
  shorts: LocalShort[]
  longs: LocalLong[]
  sections: ExamSectionStub[]
}

export const EXAM_EXEMPLAR: TeacherToolExemplarPack<ExamExemplarInput, ExamExemplarOutput> = {
  label: 'Forces & motion — unit test',
  input: {
    title: 'Forces and motion — unit test',
    examType: 'Unit test',
    term: 'Term 2',
    durationMinutes: 60,
    subject: 'Science',
    grade: 'Grade 8',
    internationalStandard: 'Cambridge-style',
    sectionTargetCount: 4,
    paper: { ...DEFAULT_EXAM_PAPER, objCount: 10, shortCount: 4, longCount: 2 },
    generateWithoutSources: false,
    bookIds: ['book-math-heinemann-8'],
    topics: ['Forces', 'Newton laws', 'Friction'],
    scopeRefinement: 'Summative check on contact forces, free-body diagrams, and F=ma applications.',
  },
  output: {
    mcqs: (() => {
      const a = newDemoId('mcq')
      const b = newDemoId('mcq')
      return [
        {
          id: a,
          _id: a,
          stem: 'The SI unit of force is the _____.',
          options: ['Newton', 'Joule', 'Watt', 'Pascal'],
        },
        {
          id: b,
          _id: b,
          stem: 'When net force on an object is zero, it moves with _____.',
          options: ['constant velocity', 'increasing speed', 'decreasing mass', 'zero weight'],
        },
      ]
    })(),
    shorts: (() => {
      const a = newDemoId('short')
      const b = newDemoId('short')
      return [
        { id: a, _id: a, stem: 'State Newton’s first law in your own words.' },
        { id: b, _id: b, stem: 'Draw and label forces on a book resting on a table.' },
      ]
    })(),
    longs: (() => {
      const id = newDemoId('long')
      return [
        {
          id,
          _id: id,
          stem: 'A 2 kg cart is pushed along a frictionless track.',
          subparts: [
            'Calculate acceleration if the net force is 6 N.',
            'Explain how friction would change your answer on a rough surface.',
          ],
        },
      ]
    })(),
    sections: [
      {
        id: newDemoId('ex-sec'),
        title: 'Section A — Multiple choice',
        marks: 10,
        description: 'Recall and application of force concepts.',
      },
      {
        id: newDemoId('ex-sec'),
        title: 'Section B — Structured',
        marks: 20,
        description: 'Reasoning with diagrams and short explanations.',
      },
    ],
  },
}
