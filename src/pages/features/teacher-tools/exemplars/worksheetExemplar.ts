import { newDemoId } from '../demo/newDemoId'
import type { LocalWorksheetBlock, LocalWorksheetSession } from '../worksheet/worksheetApiAdapters'
import type { TeacherToolExemplarPack } from './types'

export type WorksheetExemplarInput = {
  title: string
  subject: string
  grade: string
  outputFormat: 'interactive_digital' | 'printable_pdf' | 'both'
  generateWithoutSources: boolean
  bookIds: string[]
  topics: string[]
  scopeRefinement: string
  mixMode: 'balanced' | 'custom'
  questionCount: number
  difficulty: 'foundation' | 'standard' | 'challenge'
  includeMcq: boolean
  includeFillBlank: boolean
  includeShort: boolean
  includeMatch: boolean
  teacherNotes: string
}

export type WorksheetExemplarOutput = {
  sessions: LocalWorksheetSession[]
}

function block(
  type: LocalWorksheetBlock['type'],
  prompt: string,
  extra?: Partial<Omit<LocalWorksheetBlock, 'type' | 'prompt'>>,
): LocalWorksheetBlock {
  return { _id: newDemoId('wsb'), type, prompt, ...extra } as LocalWorksheetBlock
}

export const WORKSHEET_EXEMPLAR: TeacherToolExemplarPack<WorksheetExemplarInput, WorksheetExemplarOutput> = {
  label: 'Forces & motion practice',
  input: {
    title: 'Forces and motion — practice set',
    subject: 'Science',
    grade: 'Grade 7',
    outputFormat: 'both',
    generateWithoutSources: false,
    bookIds: ['book-math-heinemann-8'],
    topics: ['Forces', 'Friction', 'Motion graphs'],
    scopeRefinement: 'Balanced mix of recall and application on Newton’s first two laws.',
    mixMode: 'balanced',
    questionCount: 6,
    difficulty: 'standard',
    includeMcq: true,
    includeFillBlank: true,
    includeShort: true,
    includeMatch: false,
    teacherNotes: 'Include one diagram interpretation item.',
  },
  output: {
    sessions: [
      {
        id: newDemoId('wss'),
        title: 'Section A — Core skills',
        blocks: [
          block('mcq', 'Which force opposes motion when two surfaces touch?', {
            options: ['Friction', 'Gravity', 'Magnetism', 'Tension'],
            answer: 'Friction',
          }),
          block('fill_blank', 'Newton’s first law is also called the law of _____.', { answer: 'inertia' }),
          block('short', 'Explain in one sentence why a seatbelt reduces injury in a sudden stop.', {
            sampleAnswer: 'It increases the time over which momentum changes, reducing force on the body.',
            responseLines: 3,
          }),
          block('mcq', 'If net force on an object is zero, its velocity will _____.', {
            options: ['Stay constant', 'Always increase', 'Always decrease', 'Become zero instantly'],
            answer: 'Stay constant',
          }),
        ],
      },
    ],
  },
}
