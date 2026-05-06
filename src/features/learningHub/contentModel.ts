/**
 * Cross-section authoring model: media, blocks, and shared shapes for LLM-friendly JSON.
 * Renderers may still use legacy fields; new content should prefer these structures.
 */

export type LearningHubMediaProvider = 'youtube' | 'vimeo' | 'mp4' | 'internal' | 'loom' | 'external'

/** Explicit video/media payload — always includes a `url` key (may be empty until hosted). */
export interface LearningHubMediaVideo {
  type: 'video'
  url: string
  provider: LearningHubMediaProvider
  title?: string
  thumbnailUrl?: string
  /** Human-readable duration (e.g. "12 min") */
  duration?: string
  /** ISO 8601 duration when known */
  durationIso?: string
  transcript?: string
  captionsUrl?: string
  posterUrl?: string
  autoplay?: boolean
  controls?: boolean
  downloadable?: boolean
  metadata?: Record<string, string | number | boolean>
}

/** Turn a public YouTube watch/share URL into an embed URL, or return null if not recognized. */
export function youtubeWatchUrlToEmbedUrl(watchUrl: string): string | null {
  try {
    const u = new URL(watchUrl.trim())
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (u.hostname.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) {
        const id = u.pathname.replace(/^\/embed\//, '').split('/')[0]
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : watchUrl.trim()
      }
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`
      const shorts = u.pathname.match(/^\/shorts\/([^/]+)/)
      if (shorts?.[1]) return `https://www.youtube-nocookie.com/embed/${shorts[1]}`
    }
  } catch {
    return null
  }
  return null
}

export type LearningHubContentBlock =
  | { type: 'hero'; title: string; subtitle?: string; eyebrow?: string }
  | { type: 'overview'; markdown: string }
  | { type: 'lessonList'; items: Array<{ id: string; title: string; duration?: string }> }
  | { type: 'video'; media: LearningHubMediaVideo }
  | { type: 'transcript'; text: string }
  | { type: 'article'; title?: string; markdown: string }
  | { type: 'keyPoints'; items: string[] }
  | { type: 'checklist'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'interactivePrompt'; title: string; prompt: string; tips?: string[] }
  | { type: 'templatePreview'; title: string; sections?: string[] }
  | { type: 'resourceList'; resources: Array<{ label: string; url?: string; description?: string }> }
  | { type: 'assessmentSummary'; assessmentType: string; description: string; points?: number }
  | { type: 'completionPanel'; title: string; body: string; ctaLabel?: string }
  | { type: 'certificate'; title: string; body?: string }
  | { type: 'callout'; variant?: 'info' | 'tip' | 'warning'; title?: string; body: string }
  | { type: 'stats'; items: Array<{ label: string; value: string }> }
  | { type: 'sidebarInfo'; title: string; bullets: string[] }

/** Portable CTA for generation / APIs */
export interface LearningHubCtaSpec {
  primaryLabel: string
  secondaryLabel?: string
  /** Hint for routing (e.g. "start-path", "continue-lesson") */
  action?: string
  metadata?: Record<string, string | number | boolean>
}

/** Default placeholder video for AI Growth lessons (UI unchanged until url is set). */
export function placeholderInternalVideo(partial: Pick<LearningHubMediaVideo, 'title'> & { duration?: string }): LearningHubMediaVideo {
  return {
    type: 'video',
    url: '',
    provider: 'internal',
    title: partial.title,
    duration: partial.duration,
    controls: true,
    metadata: { placeholder: true },
  }
}
