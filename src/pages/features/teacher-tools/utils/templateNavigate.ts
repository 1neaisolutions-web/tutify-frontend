import type { DemoTemplate } from '../demo/teacherToolsDemoData'
import type { ToolType } from '../types'

export function templateCreatePath(toolType: ToolType): string {
  switch (toolType) {
    case 'quiz':
      return '/teacher-tools/quiz/create'
    case 'assignment':
      return '/teacher-tools/assignment/create'
    case 'worksheet':
      return '/teacher-tools/worksheet/create'
    case 'exam':
      return '/teacher-tools/exams/create'
    default:
      return '/teacher-tools'
  }
}

/** Search params for pre-filling create wizards from a template row. */
export function templatePrefillSearchParams(t: DemoTemplate, opts?: { duplicate?: boolean }): string {
  const p = new URLSearchParams()
  p.set('title', t.name)
  p.set('subject', t.subject)
  p.set('grade', t.grade)
  if (t.summary) p.set('topic', t.summary)
  if (opts?.duplicate) p.set('fromTemplate', t.id)
  return p.toString()
}
