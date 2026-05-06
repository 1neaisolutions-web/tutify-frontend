import type { ExamPaperConfig } from '../config/examPaperConfig'
import { getDemoLongBlock, getDemoMcq, getDemoShortStem } from './examReviewDemoContent'
import { newDemoId } from '../../demo/newDemoId'

export type ExamMcqStub = { id: string; stem: string; options: string[] }
export type ExamShortStub = { id: string; stem: string }
export type ExamLongStub = { id: string; stem: string; subparts: string[] }

export function shortPoolSize(p: ExamPaperConfig): number {
  return p.shortRule === 'pickNM' ? p.shortM : p.shortCount
}

export function longPoolSize(p: ExamPaperConfig): number {
  return p.longRule === 'pickNM' ? p.longM : p.longCount
}

export function buildExamMcqStubsFromPaper(subject: string, paper: ExamPaperConfig): ExamMcqStub[] {
  return Array.from({ length: paper.objCount }, (_, i) => {
    const n = i + 1
    const { stem, options } = getDemoMcq(subject, n, paper.objOptions)
    return { id: newDemoId('ex-obj'), stem, options: [...options] }
  })
}

export function buildExamShortStubsFromPaper(subject: string, paper: ExamPaperConfig): ExamShortStub[] {
  const m = shortPoolSize(paper)
  return Array.from({ length: m }, (_, i) => ({
    id: newDemoId('ex-sh'),
    stem: getDemoShortStem(subject, i),
  }))
}

export function buildExamLongStubsFromPaper(subject: string, paper: ExamPaperConfig): ExamLongStub[] {
  const m = longPoolSize(paper)
  return Array.from({ length: m }, (_, i) => {
    const block = getDemoLongBlock(subject, i)
    return {
      id: newDemoId('ex-lg'),
      stem: block.stem,
      subparts: block.subparts.slice(0, Math.max(1, paper.longSubparts)),
    }
  })
}

export function freshMcqStub(subject: string, questionNumber1: number, paper: ExamPaperConfig): ExamMcqStub {
  const salt = questionNumber1 + Math.floor(Math.random() * 50)
  const { stem, options } = getDemoMcq(subject, salt, paper.objOptions)
  return { id: newDemoId('ex-obj'), stem, options: [...options] }
}

export function freshShortStub(subject: string, idx0: number): ExamShortStub {
  return { id: newDemoId('ex-sh'), stem: getDemoShortStem(subject, idx0 + Math.floor(Math.random() * 20)) }
}

export function freshLongStub(subject: string, idx0: number, paper: ExamPaperConfig): ExamLongStub {
  const block = getDemoLongBlock(subject, idx0 + Math.floor(Math.random() * 4))
  return {
    id: newDemoId('ex-lg'),
    stem: block.stem,
    subparts: block.subparts.slice(0, Math.max(1, paper.longSubparts)),
  }
}

export function blankMcqStub(paper: ExamPaperConfig): ExamMcqStub {
  const base = ['Option A', 'Option B', 'Option C', 'Option D']
  if (paper.objOptions === 5) base.push('Option E')
  return {
    id: newDemoId('ex-obj'),
    stem: 'Enter the question stem…',
    options: base,
  }
}

export function blankShortStub(): ExamShortStub {
  return { id: newDemoId('ex-sh'), stem: 'Enter the short question stem…' }
}

export function blankLongStub(paper: ExamPaperConfig): ExamLongStub {
  const n = Math.max(1, paper.longSubparts)
  return {
    id: newDemoId('ex-lg'),
    stem: 'Enter the long question introduction…',
    subparts: Array.from({ length: n }, (_, i) => `Sub-part (${String.fromCharCode(97 + i)}): enter prompt…`),
  }
}

/** Decrement objective count (min 1). */
export function patchPaperDeleteOneMcq(p: ExamPaperConfig): ExamPaperConfig {
  return { ...p, objCount: Math.max(1, p.objCount - 1) }
}

export function patchPaperAddOneMcq(p: ExamPaperConfig): ExamPaperConfig {
  return { ...p, objCount: Math.min(100, p.objCount + 1) }
}

export function patchPaperDeleteOneShort(p: ExamPaperConfig): ExamPaperConfig {
  if (p.shortRule === 'pickNM') {
    const shortM = Math.max(2, p.shortM - 1)
    let shortN = p.shortN
    if (shortN >= shortM) shortN = Math.max(1, shortM - 1)
    return { ...p, shortM, shortN }
  }
  return { ...p, shortCount: Math.max(1, p.shortCount - 1) }
}

export function patchPaperAddOneShort(p: ExamPaperConfig): ExamPaperConfig {
  if (p.shortRule === 'pickNM') {
    const shortM = Math.min(20, p.shortM + 1)
    return { ...p, shortM }
  }
  return { ...p, shortCount: Math.min(20, p.shortCount + 1) }
}

export function patchPaperDeleteOneLong(p: ExamPaperConfig): ExamPaperConfig {
  if (p.longRule === 'pickNM') {
    const longM = Math.max(2, p.longM - 1)
    let longN = p.longN
    if (longN >= longM) longN = Math.max(1, longM - 1)
    return { ...p, longM, longN }
  }
  return { ...p, longCount: Math.max(1, p.longCount - 1) }
}

export function patchPaperAddOneLong(p: ExamPaperConfig): ExamPaperConfig {
  if (p.longRule === 'pickNM') {
    const longM = Math.min(10, p.longM + 1)
    return { ...p, longM }
  }
  return { ...p, longCount: Math.min(10, p.longCount + 1) }
}
