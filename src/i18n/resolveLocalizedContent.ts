import type { TFunction } from 'i18next'
import { normalizeCatalogId } from './catalogLabel'

/** Resolve nested locale content with English fallback (i18next defaultValue). */
export function localizedField(t: TFunction, key: string, fallback: string): string {
  if (!fallback) return fallback ?? ''
  const value = t(key, { defaultValue: fallback })
  if (typeof value !== 'string' || !value.trim() || value === key) return fallback
  return value
}

type ContentBlock = {
  type: string
  heading?: string
  paragraphs?: string[]
  [key: string]: unknown
}

type Lesson = {
  id: number
  title: string
  duration?: string
  contentBlocks: ContentBlock[]
}

type MicroCourseContent = {
  description?: string
  learningObjectives?: string[]
  lessons: Lesson[]
  [key: string]: unknown
}

/** Overlay locale strings onto static micro-course content by slug. */
export function resolveMicroCourseContent(
  t: TFunction,
  slug: string,
  content: MicroCourseContent,
): MicroCourseContent {
  const base = `learningHubContent.courses.${normalizeCatalogId(slug)}`

  return {
    ...content,
    description: content.description
      ? localizedField(t, `${base}.description`, content.description)
      : content.description,
    learningObjectives: content.learningObjectives?.map((obj, i) =>
      localizedField(t, `${base}.objectives.${i}`, obj),
    ),
    lessons: content.lessons.map((lesson) => ({
      ...lesson,
      title: localizedField(t, `${base}.lessons.${lesson.id}.title`, lesson.title),
      contentBlocks: lesson.contentBlocks.map((block, bi) => ({
        ...block,
        heading: block.heading
          ? localizedField(t, `${base}.lessons.${lesson.id}.blocks.${bi}.heading`, block.heading)
          : block.heading,
        paragraphs: block.paragraphs?.map((p, pi) =>
          localizedField(t, `${base}.lessons.${lesson.id}.blocks.${bi}.paragraphs.${pi}`, p),
        ),
      })),
    })),
  }
}

export function resolveHubItemTitle(t: TFunction, slug: string | undefined, fallback: string): string {
  if (!slug) return fallback
  return localizedField(t, `learningHubContent.catalog.${normalizeCatalogId(slug)}.title`, fallback)
}

export function resolveHubItemDescription(
  t: TFunction,
  slug: string | undefined,
  fallback: string,
): string {
  if (!slug || !fallback) return fallback ?? ''
  return localizedField(
    t,
    `learningHubContent.catalog.${normalizeCatalogId(slug)}.description`,
    fallback,
  )
}

export function resolveHubItemSubtitle(
  t: TFunction,
  slug: string | undefined,
  fallback: string,
): string {
  if (!slug || !fallback) return fallback ?? ''
  return localizedField(
    t,
    `learningHubContent.catalog.${normalizeCatalogId(slug)}.subtitle`,
    fallback,
  )
}
