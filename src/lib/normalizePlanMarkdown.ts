/**
 * Normalize LLM 504/IEP plan output (bold labels, duplicate titles) into ## markdown sections.
 */
const PLAN_504_HEADINGS = [
  'Present Levels of Performance',
  'Accommodations',
  'Goals',
  'Monitoring and Review',
] as const

function bulletizeSectionBody(body: string): string {
  const trimmed = body.trim()
  if (!trimmed || /^\s*[-*•]\s/m.test(trimmed)) return trimmed
  const paragraphs = trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  if (paragraphs.length > 1) {
    return paragraphs.map((p) => `- ${p}`).join('\n')
  }
  const sentences = trimmed.split(/(?<=[.!?])\s+(?=[A-Z[])/)
  if (sentences.length >= 2) {
    return sentences.map((s) => `- ${s.trim()}`).filter(Boolean).join('\n')
  }
  return trimmed
}

/** Normalize one 504 section body (accommodations/goals get bullet lists). */
export function normalizePlan504Section(
  sectionKey: string,
  text: string,
): string {
  if (!text?.trim()) return text
  if (sectionKey === 'accommodations' || sectionKey === 'goals') {
    return bulletizeSectionBody(text.replace(/^#+\s+/gm, '').trim())
  }
  return text.replace(/^#+\s+/gm, '').trim()
}

export function normalizePlanMarkdown(text: string, templateSlug?: string | null): string {
  if (!text?.trim()) return text
  let s = text.trim()

  if (templateSlug === '504-plan-generator') {
    s = s.replace(/^#+\s*504\s+Plan\s+Draft[^\n]*\n+/i, '')
    s = s.replace(/^504\s+Plan\s+Draft[^\n]*\n+/i, '')
    for (const heading of PLAN_504_HEADINGS) {
      const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      s = s.replace(new RegExp(`^\\s*\\*\\*${escaped}:\\*\\*\\s*`, 'gim'), `## ${heading}\n\n`)
      s = s.replace(new RegExp(`^\\s*\\*\\*${escaped}\\*\\*\\s*`, 'gim'), `## ${heading}\n\n`)
      s = s.replace(new RegExp(`^\\s*${escaped}:\\s*`, 'gim'), `## ${heading}\n\n`)
    }
  } else {
    s = s.replace(/^\s*\*\*([^*\n]+):\*\*\s*/gm, '## $1\n\n')
  }

  return s.replace(/\n{3,}/g, '\n\n').trim()
}
