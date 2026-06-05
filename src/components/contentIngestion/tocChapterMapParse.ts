import i18n from '../../i18n'
import type { DocumentUploadRequest } from '../../api/contentIngestion'

export type ChapterMapList = NonNullable<DocumentUploadRequest['chapter_map']>

export type ParseChapterMapResult =
  | { ok: true; empty: true }
  | { ok: true; chapters: ChapterMapList }
  | { ok: false; message: string }

/**
 * Parse optional TOC JSON from the upload form. Empty string → no TOC (auto-detect).
 */
export function parseChapterMapFromJson(raw: string): ParseChapterMapResult {
  const t = raw.trim()
  if (!t) {
    return { ok: true, empty: true }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(t)
  } catch {
    return { ok: false, message: i18n.t('content.toc.errors.invalidJson') }
  }

  if (!Array.isArray(parsed)) {
    return { ok: false, message: i18n.t('content.toc.errors.notArray') }
  }

  const chapters: ChapterMapList = []
  for (let i = 0; i < parsed.length; i += 1) {
    const row = parsed[i]
    if (!row || typeof row !== 'object') {
      return { ok: false, message: i18n.t('content.toc.errors.entryNotObject', { n: i + 1 }) }
    }
    const o = row as Record<string, unknown>
    const id = String(o.id ?? `ch-${i + 1}`)
    const title = String(o.title ?? '').trim()
    if (!title) {
      return { ok: false, message: i18n.t('content.toc.errors.missingTitle', { n: i + 1 }) }
    }
    const sp = Number(o.start_page_pdf)
    const ep = Number(o.end_page_pdf)
    if (!Number.isFinite(sp) || !Number.isFinite(ep)) {
      return { ok: false, message: i18n.t('content.toc.errors.invalidPages', { n: i + 1 }) }
    }
    if (sp < 1 || ep < 1) {
      return { ok: false, message: i18n.t('content.toc.errors.pageMin', { n: i + 1 }) }
    }
    if (ep < sp) {
      return { ok: false, message: i18n.t('content.toc.errors.pageOrder', { n: i + 1 }) }
    }
    const level = Number(o.level)
    const keywords = Array.isArray(o.keywords)
      ? (o.keywords as unknown[]).map((k) => String(k))
      : []
    chapters.push({
      id,
      title,
      level: Number.isFinite(level) && level > 0 ? Math.floor(level) : 1,
      parent_id: o.parent_id === null || o.parent_id === undefined ? null : String(o.parent_id),
      start_page_pdf: Math.floor(sp),
      end_page_pdf: Math.floor(ep),
      keywords,
    })
  }

  if (chapters.length === 0) {
    return { ok: false, message: i18n.t('content.toc.errors.emptyArray') }
  }

  return { ok: true, chapters }
}

export const TOC_JSON_EXAMPLE = `[
  {
    "id": "ch-1",
    "title": "Chapter 1 — Introduction",
    "level": 1,
    "parent_id": null,
    "start_page_pdf": 1,
    "end_page_pdf": 14,
    "keywords": []
  },
  {
    "id": "ch-2",
    "title": "Chapter 2 — Motion",
    "level": 1,
    "parent_id": null,
    "start_page_pdf": 15,
    "end_page_pdf": 32,
    "keywords": []
  }
]`
