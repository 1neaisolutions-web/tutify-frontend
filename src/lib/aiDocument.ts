/**
 * Canonical AI document model for GPT/Gemini-style response rendering.
 * Sections are normalized into a single document flow: heading + readable content.
 */

import { normalizeStreamingContent } from '../components/ai/SectionRenderer'
import { normalizeLessonPhaseBulletContent } from './formatLessonFlow'

export interface DocumentSection {
  key: string
  heading: string
  content: string
  isComplete: boolean
}

export interface AiDocument {
  sections: DocumentSection[]
  /** Plain text for copy/export (no markers, no raw JSON). */
  plainText: string
}

const SECTION_MARKER_REGEX = /\[\[SECTION:[^\]]*\]\]/g

function stripMarkers(text: string): string {
  if (!text || !text.includes('[[SECTION:')) return text
  return text.replace(SECTION_MARKER_REGEX, '').trim()
}

function toHeadingLabel(key: string, label?: string): string {
  if (label && label.trim()) return label.trim()
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export interface StreamedSection {
  key: string
  label?: string
  content?: string
  type?: string
}

export interface SectionSchemaItem {
  key: string
  label?: string
  type?: string
}

/**
 * Compose a canonical AI document from streamed sections and schema.
 * Normalizes structured content (JSON/objects) into human-readable form.
 * Used for both display and copy/export.
 */
export function composeAiDocumentFromSections(
  sections: StreamedSection[],
  sectionsSchema: SectionSchemaItem[],
  options: {
    isStreaming?: boolean
    completedSectionKeys?: string[]
    excludeSectionKeys?: Set<string> | string[]
  } = {}
): AiDocument {
  const { isStreaming = false, completedSectionKeys = [], excludeSectionKeys } = options
  const excludeSet = Array.isArray(excludeSectionKeys)
    ? new Set(excludeSectionKeys.map((k) => k.toUpperCase().replace(/\s+/g, '_')))
    : excludeSectionKeys ?? new Set<string>()

  const inOrder = sectionsSchema.length
    ? sectionsSchema
        .map((s) => sections.find((sec) => sec.key === s.key))
        .filter((s): s is StreamedSection => s != null)
    : [...sections]

  const docSections: DocumentSection[] = []
  const lines: string[] = []

  for (const sec of inOrder) {
    const keyUpper = sec.key.toUpperCase().replace(/\s+/g, '_')
    if (excludeSet.has(sec.key) || excludeSet.has(keyUpper)) continue

    const heading = toHeadingLabel(sec.key, sec.label)
    let content = stripMarkers(sec.content ?? '')
    if (sec.key === 'lesson_flow') {
      content = normalizeLessonPhaseBulletContent(content)
    }
    content = normalizeStreamingContent(content)
    const isComplete = !isStreaming || (completedSectionKeys as string[]).includes(sec.key)

    docSections.push({ key: sec.key, heading, content, isComplete })
    if (heading) lines.push(heading)
    if (content) lines.push('', content, '')
  }

  const plainText = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()

  return { sections: docSections, plainText }
}
