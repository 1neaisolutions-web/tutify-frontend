import type { LearningHubContentBlock, LearningHubMediaVideo } from './contentModel'
import type { AIGrowthModuleContent, AIGrowthModuleLesson } from './types'

export type LessonVideoEmbed =
  | { kind: 'iframe'; src: string; title?: string }
  | { kind: 'html5'; src: string; posterUrl?: string; controls: boolean }

/**
 * Resolves explicit video media for an AI Growth module lesson: prefers the aligned `content` row,
 * then the n-th `blocks` entry of type `video` (by video-lesson ordinal).
 */
export function resolveAIGrowthLessonVideoMedia(
  module: AIGrowthModuleContent,
  lessonIndex: number,
  lessons: AIGrowthModuleLesson[]
): LearningHubMediaVideo | undefined {
  const lesson = lessons[lessonIndex]
  if (!lesson || lesson.type !== 'video') return undefined

  const row = module.content[lessonIndex]
  if (row?.type === 'video' && typeof row.media?.url === 'string' && row.media.url.trim() !== '') {
    return row.media
  }

  const blockVideos = (module.blocks ?? []).filter(
    (b): b is Extract<LearningHubContentBlock, { type: 'video' }> =>
      b.type === 'video' && typeof b.media?.url === 'string' && b.media.url.trim() !== ''
  )
  if (blockVideos.length === 0) return undefined

  let videoOrdinal = 0
  for (let i = 0; i < lessonIndex; i++) {
    if (lessons[i]?.type === 'video') videoOrdinal++
  }
  return blockVideos[videoOrdinal]?.media
}

function extractYoutubeId(raw: string): string | undefined {
  try {
    const u = new URL(raw)
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id || undefined
    }
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const parts = u.pathname.split('/').filter(Boolean)
      const embedIdx = parts.indexOf('embed')
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1]
      const shortIdx = parts.indexOf('shorts')
      if (shortIdx >= 0 && parts[shortIdx + 1]) return parts[shortIdx + 1]
    }
  } catch {
    return undefined
  }
  return undefined
}

function extractVimeoId(raw: string): string | undefined {
  try {
    const u = new URL(raw)
    if (!u.hostname.includes('vimeo.com')) return undefined
    const parts = u.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    return /^\d+$/.test(id) ? id : undefined
  } catch {
    return undefined
  }
}

/** Maps registry media to iframe or HTML5 video for the existing aspect-video shell. */
export function videoMediaToLessonEmbed(media: LearningHubMediaVideo): LessonVideoEmbed | undefined {
  const url = media.url?.trim()
  if (!url) return undefined

  if (media.provider === 'youtube') {
    const id = extractYoutubeId(url)
    if (id) return { kind: 'iframe', src: `https://www.youtube.com/embed/${id}`, title: media.title }
  }
  if (media.provider === 'vimeo') {
    const id = extractVimeoId(url)
    if (id) return { kind: 'iframe', src: `https://player.vimeo.com/video/${id}`, title: media.title }
  }
  if (media.provider === 'loom') {
    const m = url.match(/loom\.com\/share\/([a-zA-Z0-9-]+)/)
    if (m) return { kind: 'iframe', src: `https://www.loom.com/embed/${m[1]}`, title: media.title }
  }

  const yt = extractYoutubeId(url)
  if (yt) return { kind: 'iframe', src: `https://www.youtube.com/embed/${yt}`, title: media.title }
  const vm = extractVimeoId(url)
  if (vm) return { kind: 'iframe', src: `https://player.vimeo.com/video/${vm}`, title: media.title }

  return {
    kind: 'html5',
    src: url,
    posterUrl: media.posterUrl,
    controls: media.controls !== false,
  }
}
