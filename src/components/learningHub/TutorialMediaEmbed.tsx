import { useMemo, useState } from 'react'
import { AlertTriangle, Play } from 'lucide-react'

function toYouTubeEmbedUrl(raw: string): string | null {
  const s = String(raw || '').trim()
  if (!s) return null
  try {
    const u = new URL(s.startsWith('//') ? `https:${s}` : s)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null
    }
    if (host.endsWith('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) {
        return `https://www.youtube-nocookie.com${u.pathname}${u.search || ''}`
      }
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube-nocookie.com/embed/${v}`
    }
  } catch {
    return null
  }
  return null
}

export interface TutorialMediaEmbedProps {
  /** Any watch URL or /embed/ URL; only YouTube is supported for real embeds. */
  videoUrl?: string | null
  title?: string
  className?: string
}

/**
 * Real media embed with loading / invalid / fallback states (no fake play chrome).
 */
export function TutorialMediaEmbed({ videoUrl, title, className = '' }: TutorialMediaEmbedProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const embedSrc = useMemo(() => {
    if (!videoUrl) return null
    return toYouTubeEmbedUrl(videoUrl)
  }, [videoUrl])

  if (!videoUrl) {
    return (
      <div
        className={`flex aspect-video items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-center ${className}`}
      >
        <p className="px-4 text-sm text-gray-600">No video is configured for this step yet.</p>
      </div>
    )
  }

  if (!embedSrc || error) {
    return (
      <div
        className={`flex aspect-video flex-col items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 text-center ${className}`}
      >
        <AlertTriangle className="h-8 w-8 text-amber-600" aria-hidden />
        <p className="text-sm font-medium text-amber-900">Could not load this video URL</p>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-amber-800 underline"
        >
          Open link in new tab
        </a>
      </div>
    )
  }

  return (
    <div className={`relative aspect-video overflow-hidden rounded-xl bg-black ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gray-900 text-white">
          <Play className="h-10 w-10 animate-pulse opacity-80" aria-hidden />
          <span className="text-xs text-white/80">Loading video…</span>
        </div>
      )}
      <iframe
        title={title || 'Tutorial video'}
        src={embedSrc}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  )
}
