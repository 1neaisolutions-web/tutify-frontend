/**
 * MCQ option strings from generation/API often include a leading label ("A. Kilogram")
 * while the UI prints letter prefixes separately. Strip those prefixes for display/export.
 */
export function stripLeadingMcqOptionLabel(raw: string): string {
  let s = raw.trim()
  for (let i = 0; i < 5; i += 1) {
    const before = s
    s = s.replace(/^\([A-Ea-e]\)\s*/, '').trim()
    s = s.replace(/^[A-Ea-e][\.\)]\s*/, '').trim()
    if (s === before) break
  }
  return s
}
