/**
 * Detects the generic research-article payload shape rendered by `ResearchInsightSectionsPayloadView`.
 * New catalog items can use this without adding a new `variant` branch — use a non-bespoke variant
 * (e.g. `research-structured-sections`) and nest `summary` / `sections` / `contentBlocks` under `payload`.
 */

type UnknownRec = Record<string, unknown>

function isTextContentBlock(b: UnknownRec): boolean {
  if (b.type !== 'text') return false
  if (!Array.isArray(b.paragraphs)) return false
  return b.paragraphs.every((p) => typeof p === 'string')
}

function isInteractiveContentBlock(b: UnknownRec): boolean {
  if (b.type !== 'interactive') return false
  if (typeof b.title !== 'string' || typeof b.prompt !== 'string') return false
  if (!Array.isArray(b.tips)) return false
  return b.tips.every((t) => typeof t === 'string')
}

function isContentBlock(b: unknown): boolean {
  if (!b || typeof b !== 'object') return false
  const o = b as UnknownRec
  if (o.type === 'text') return isTextContentBlock(o)
  if (o.type === 'interactive') return isInteractiveContentBlock(o)
  return false
}

export type ResearchStructuredSectionPayload = {
  summary?: string[]
  sections: Array<{
    id: string
    title: string
    contentBlocks: unknown[]
  }>
  keyTakeaways?: string[]
  implementationIdeas?: string[]
  references?: string[]
  metadata?: Record<string, string>
}

export function isResearchStructuredSectionsPayload(p: unknown): p is ResearchStructuredSectionPayload {
  if (!p || typeof p !== 'object') return false
  const sections = (p as UnknownRec).sections
  if (!Array.isArray(sections) || sections.length === 0) return false
  return sections.every((s) => {
    if (!s || typeof s !== 'object') return false
    const sec = s as UnknownRec
    if (typeof sec.id !== 'string' || typeof sec.title !== 'string') return false
    const blocks = sec.contentBlocks
    if (!Array.isArray(blocks)) return false
    return blocks.every(isContentBlock)
  })
}
