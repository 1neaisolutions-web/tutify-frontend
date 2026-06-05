/**
 * Format lesson_flow / 5E phase arrays as markdown tables for readable output.
 */

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim()
}

export function isLessonFlowPhaseRow(item: unknown): item is Record<string, unknown> {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return false
  const row = item as Record<string, unknown>
  if (typeof row.phase !== 'string' || !row.phase.trim()) return false
  const hasInquiry =
    typeof row.teacher_role === 'string' ||
    typeof row.student_role === 'string'
  const hasPlanner = typeof row.activity === 'string'
  return hasInquiry || hasPlanner
}

/** Returns a GFM markdown table, or null if items are not lesson phase rows. */
export function formatLessonFlowArrayAsMarkdownTable(items: unknown[]): string | null {
  if (!items.length || !items.every(isLessonFlowPhaseRow)) return null

  const rows = items as Record<string, unknown>[]
  const styleOf = (r: Record<string, unknown>): 'inquiry' | 'planner' | null => {
    if (typeof r.teacher_role === 'string' || typeof r.student_role === 'string') return 'inquiry'
    if (typeof r.activity === 'string') return 'planner'
    return null
  }
  const style = styleOf(rows[0])
  if (!style || rows.some((r) => styleOf(r) !== style)) return null

  if (style === 'inquiry') {
    const lines = [
      '| Phase | Minutes | Teacher facilitation | Student actions |',
      '| --- | ---: | --- | --- |',
      ...rows.map((r) => {
        const phase = escapeTableCell(String(r.phase ?? ''))
        const minutes = r.minutes != null ? String(r.minutes) : ''
        const teacher = escapeTableCell(String(r.teacher_role ?? ''))
        const student = escapeTableCell(String(r.student_role ?? ''))
        return `| ${phase} | ${minutes} | ${teacher} | ${student} |`
      }),
    ]
    return lines.join('\n')
  }

  const lines = [
    '| Phase | Minutes | Activity |',
    '| --- | ---: | --- |',
    ...rows.map((r) => {
      const phase = escapeTableCell(String(r.phase ?? ''))
      const minutes = r.minutes != null ? String(r.minutes) : ''
      const activity = escapeTableCell(String(r.activity ?? ''))
      return `| ${phase} | ${minutes} | ${activity} |`
    }),
  ]
  return lines.join('\n')
}

/** Convert bullet lines of JSON phase objects into a table (exemplar fallback content). */
export function normalizeLessonPhaseBulletContent(content: string): string {
  const trimmed = (content || '').trim()
  if (!trimmed) return content

  const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return content

  const parsed: unknown[] = []
  for (const line of lines) {
    const match = line.match(/^[-*•]\s*(\{[\s\S]*\})\s*$/)
    if (!match) return content
    try {
      parsed.push(JSON.parse(match[1]))
    } catch {
      return content
    }
  }

  const table = formatLessonFlowArrayAsMarkdownTable(parsed)
  return table ?? content
}
