/** Shared helpers for mapping API capability JSON to UI types */

export function ensureArray<T = string>(v: unknown): T[] {
  if (Array.isArray(v)) return v as T[]
  return []
}

export function ensureString(v: unknown, fallback = ''): string {
  if (typeof v === 'string') return v
  return fallback
}

export function ensureRecord(v: unknown): Record<string, unknown> {
  if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>
  return {}
}

export function slugId(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'item'
}
