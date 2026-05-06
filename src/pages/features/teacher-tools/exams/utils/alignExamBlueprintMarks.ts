import type { ExamSectionStub } from '../../demo/generationFromSources'

/** Rescale blueprint section marks so their sum matches the exam paper grand total (authoritative). */
export function alignExamBlueprintMarksToTotal(sections: ExamSectionStub[], targetGrand: number): ExamSectionStub[] {
  if (sections.length === 0 || targetGrand <= 0) return sections
  const n = sections.length
  const minPer = 1
  if (targetGrand < n * minPer) {
    return sections.map((s, i) => ({
      ...s,
      marks: i === 0 ? Math.max(1, targetGrand - (n - 1) * minPer) : minPer,
    }))
  }
  const weights = sections.map((s) => Math.max(1, s.marks))
  const wsum = weights.reduce((a, b) => a + b, 0)
  const marks = weights.map((w) => Math.floor((targetGrand * w) / wsum))
  let sum = marks.reduce((a, b) => a + b, 0)
  let i = 0
  while (sum < targetGrand) {
    marks[i % marks.length] += 1
    sum += 1
    i += 1
  }
  i = 0
  while (sum > targetGrand) {
    const j = marks.findIndex((m) => m > minPer)
    if (j === -1) break
    marks[j] -= 1
    sum -= 1
    i += 1
    if (i > targetGrand * 2) break
  }
  return sections.map((s, idx) => ({ ...s, marks: marks[idx]! }))
}
