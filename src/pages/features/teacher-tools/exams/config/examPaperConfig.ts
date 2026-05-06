export type ExamPaperChoiceRule = 'all' | 'pickNM'

export type ExamPaperConfig = {
  objCount: number
  objMarksPer: number
  objOptions: 4 | 5
  objNegative: boolean
  shortCount: number
  shortMarksPer: number
  shortRule: ExamPaperChoiceRule
  shortN: number
  shortM: number
  longCount: number
  longMarksPer: number
  longSubparts: number
  longRule: ExamPaperChoiceRule
  longN: number
  longM: number
}

export const DEFAULT_EXAM_PAPER: ExamPaperConfig = {
  objCount: 20,
  objMarksPer: 1,
  objOptions: 4,
  objNegative: false,
  shortCount: 6,
  shortMarksPer: 5,
  shortRule: 'pickNM',
  shortN: 4,
  shortM: 6,
  longCount: 3,
  longMarksPer: 10,
  longSubparts: 3,
  longRule: 'pickNM',
  longN: 2,
  longM: 3,
}

export function deriveExamPaperMarks(p: ExamPaperConfig): {
  partA: number
  partB1: number
  partB2: number
  grand: number
} {
  const partA = Math.max(0, p.objCount) * Math.max(0, p.objMarksPer)
  const partB1 =
    p.shortRule === 'pickNM'
      ? Math.max(0, p.shortN) * Math.max(0, p.shortMarksPer)
      : Math.max(0, p.shortCount) * Math.max(0, p.shortMarksPer)
  const partB2 =
    p.longRule === 'pickNM'
      ? Math.max(0, p.longN) * Math.max(0, p.longMarksPer)
      : Math.max(0, p.longCount) * Math.max(0, p.longMarksPer)
  return { partA, partB1, partB2, grand: partA + partB1 + partB2 }
}

/** Inline field validation messages (12px red in UI). */
export function validateExamPaperFields(p: ExamPaperConfig): Record<string, string> {
  const err: Record<string, string> = {}
  if (p.objCount < 0 || p.objCount > 100) err.objCount = 'Objective questions: use 0–100.'
  if (p.shortCount < 0 || p.shortCount > 20) err.shortCount = 'Short questions: use 0–20.'
  if (p.longCount < 0 || p.longCount > 10) err.longCount = 'Long questions: use 0–10.'
  if (p.longSubparts < 1 || p.longSubparts > 6) err.longSubparts = 'Sub-parts per long question: use 1–6.'
  if (p.shortRule === 'pickNM') {
    if (p.shortN < 1 || p.shortM < 1) err.shortPick = 'Enter positive values for N and M.'
    else if (p.shortN >= p.shortM) err.shortPick = '"Attempt any N" must be less than total M (N < M).'
  }
  if (p.longRule === 'pickNM') {
    if (p.longN < 1 || p.longM < 1) err.longPick = 'Enter positive values for N and M.'
    else if (p.longN >= p.longM) err.longPick = '"Attempt any N" must be less than total M (N < M).'
  }
  return err
}
