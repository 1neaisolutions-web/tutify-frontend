import {
  demoClasses,
  type DemoAssignment,
  type DemoQuiz,
  type DemoWorksheet,
} from '../demo/teacherToolsDemoData'
import { djb2 } from '../demo/generationFromSources'

export function scoreDistributionForQuiz(quiz: DemoQuiz, range: '7d' | '30d' | 'all') {
  const h = djb2(`${quiz.id}|${range}|${quiz.submissionCount}`)
  const scale = range === '7d' ? 0.6 : range === '30d' ? 0.85 : 1
  const bump = (i: number) => 1 + ((h >> (i * 3)) % 7)
  const raw = [bump(0), bump(1), bump(2), bump(3), bump(4)].map((v, i) =>
    Math.round((v + (h % 5)) * (1 + i * 0.08) * scale * (1 + (quiz.submissionCount % 7) * 0.02))
  )
  const max = Math.max(...raw, 1)
  return [
    { label: '0–20', value: raw[0], max },
    { label: '21–40', value: raw[1], max },
    { label: '41–60', value: raw[2], max },
    { label: '61–80', value: raw[3], max },
    { label: '81–100', value: raw[4], max },
  ]
}

export function questionDifficultyForQuiz(quiz: DemoQuiz) {
  const h = djb2(quiz.id + quiz.topic)
  const n = Math.min(8, Math.max(4, (quiz.questions % 5) + 4))
  return Array.from({ length: n }, (_, i) => {
    const v = 5 + ((h + i * 17) % 28)
    const colorClass = v > 20 ? 'bg-rose-500' : v > 12 ? 'bg-amber-400' : 'bg-emerald-400'
    return { label: `Q${i + 1}`, value: v, max: 100, colorClass }
  })
}

export function assignmentSubmissionBars(a: DemoAssignment, range: '7d' | '30d' | 'all') {
  const h = djb2(`${a.id}|sub|${range}|${a.submitted}|${a.assignedCount}`)
  const labels =
    range === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : range === '30d' ? ['W1', 'W2', 'W3', 'W4'] : ['M1', 'M2', 'M3', 'M4', 'M5']
  const scale = range === '7d' ? 0.72 : range === '30d' ? 0.9 : 1
  const rate =
    a.assignedCount > 0 ? Math.min(95, Math.round((a.submitted / Math.max(1, a.assignedCount)) * 100)) : 45 + (h % 35)
  return labels.map((label, i) => {
    const t = (i + 1) / labels.length
    const v = Math.round((rate * t + 8 + ((h >> (i * 2)) % 18)) * scale)
    return { label, value: Math.min(100, Math.max(8, v)), max: 100 }
  })
}

export function worksheetClassMasteryBars(
  w: Pick<DemoWorksheet, 'id' | 'topic' | 'classes'>,
  range: '7d' | '30d' | 'all',
) {
  const classKeys = w.classes.length ? w.classes : ['g8c', 'g6b', 'g5a']
  const labels = classKeys.map((key) => demoClasses.find((c) => c.key === key)?.label ?? key)
  const h = djb2(`${w.id}|classes|${range}|${labels.join('|')}`)
  const scale = range === '7d' ? 0.88 : range === '30d' ? 0.96 : 1
  return labels.map((label, i) => {
    const base = 52 + ((h + i * 23) % 42)
    return {
      label: label.length > 8 ? `${label.slice(0, 7)}…` : label,
      value: Math.min(100, Math.round(base * scale + (range === 'all' ? 6 : 0))),
      max: 100,
    }
  })
}

export function examSectionPerformanceBars(
  e: { id: string; subject: string; examType: string },
  range: '7d' | '30d' | 'all',
) {
  const h = djb2(`${e.id}|${e.subject}|${e.examType}|${range}`)
  const scale = range === '7d' ? 0.9 : range === '30d' ? 0.97 : 1
  const labels = ['Sec A', 'Sec B', 'Sec C', 'Short answ.']
  return labels.map((label, i) => ({
    label,
    value: Math.min(100, Math.round((58 + ((h + i * 19) % 35)) * scale)),
    max: 100,
  }))
}

