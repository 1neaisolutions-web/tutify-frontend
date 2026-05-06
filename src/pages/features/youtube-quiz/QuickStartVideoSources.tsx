import { useEffect, useState } from 'react'
import { Youtube, Play, CheckCircle2 } from 'lucide-react'
import { useSnackbar } from '../../../hooks/useSnackbar'
import { ApiError } from '../../../api/client'
import {
  getVideoRecommendations,
  type VideoLibraryChannel,
  type VideoLibraryVideo,
} from '../../../api/videoLibrary'

/** Preserves original six channel color themes (presentation only). */
const CHANNEL_CARD_PRESETS: { cardCls: string; activeCls: string }[] = [
  {
    cardCls: 'border-gray-100 bg-gray-50 hover:border-purple-300',
    activeCls: 'border-purple-400 bg-purple-50',
  },
  {
    cardCls: 'border-gray-100 bg-gray-50 hover:border-blue-300',
    activeCls: 'border-blue-400 bg-blue-50',
  },
  {
    cardCls: 'border-gray-100 bg-gray-50 hover:border-green-300',
    activeCls: 'border-green-400 bg-green-50',
  },
  {
    cardCls: 'border-gray-100 bg-gray-50 hover:border-red-300',
    activeCls: 'border-red-400 bg-red-50',
  },
  {
    cardCls: 'border-gray-100 bg-gray-50 hover:border-yellow-300',
    activeCls: 'border-yellow-400 bg-yellow-50',
  },
  {
    cardCls: 'border-gray-100 bg-gray-50 hover:border-orange-300',
    activeCls: 'border-orange-400 bg-orange-50',
  },
]

interface Props {
  onVideoPicked?: (p: { videoId: string; youtubeUrl: string; title: string }) => void
  /** After a video is chosen — e.g. scroll the main form into view so users see the filled link field. */
  onAfterVideoSelect?: () => void
}

export function QuickStartVideoSources({ onVideoPicked, onAfterVideoSelect }: Props) {
  const { toast } = useSnackbar()
  const [channels, setChannels] = useState<VideoLibraryChannel[]>([])
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [loadMessage, setLoadMessage] = useState<string | null>(null)
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null)
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoadState('loading')
      setLoadMessage(null)
      try {
        const res = await getVideoRecommendations()
        if (cancelled) return
        setChannels(res.channels ?? [])
        setLoadState('idle')
      } catch (e) {
        if (cancelled) return
        setLoadState('error')
        let msg = 'Could not load recommendations.'
        if (e instanceof ApiError && typeof e.message === 'string' && e.message.trim()) {
          msg = e.message
        }
        setLoadMessage(msg)
        toast.error(msg)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, [])

  const handleSelectVideo = (video: VideoLibraryVideo) => {
    setSelectedVideoId(video.id)
    setSelectedTitle(video.title)
    toast.success(`"${video.title}" added — link field updated above.`)
    onVideoPicked?.({ videoId: video.id, youtubeUrl: video.youtubeUrl, title: video.title })
    onAfterVideoSelect?.()
  }

  return (
    <div
      className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm scroll-mt-24"
      id="youtube-quiz-quick-library"
    >
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gray-600">
        <Youtube className="h-4 w-4 text-red-500" />
        Quick Start Video Sources
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        Pick a video — we paste it into the YouTube link at the top of the page and jump you there to review.
      </p>
      {loadState === 'loading' && (
        <p className="mt-1 text-xs text-gray-500">Loading recommendations…</p>
      )}
      {loadState === 'error' && loadMessage && (
        <p className="mt-1 text-xs text-gray-500">{loadMessage}</p>
      )}

      {selectedTitle && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="truncate">Selected: {selectedTitle}</span>
        </div>
      )}

      <div className="mt-4 space-y-2">
        {channels.map((ch, channelIndex) => {
          const preset = CHANNEL_CARD_PRESETS[channelIndex % CHANNEL_CARD_PRESETS.length]
          const isActive = activeChannelId === ch.id
          return (
            <div key={ch.id}>
              <button
                type="button"
                onClick={() => setActiveChannelId(isActive ? null : ch.id)}
                className={`w-full rounded-2xl border-2 p-3 text-left transition-all ${
                  isActive ? preset.activeCls : preset.cardCls
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{ch.name}</p>
                    <p className="text-[10px] uppercase tracking-wide text-gray-500">{ch.gradeBand}</p>
                    <p className="mt-1 text-xs text-gray-600 leading-snug">{ch.focus}</p>
                  </div>
                  <span className="mt-0.5 flex-shrink-0 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    {isActive ? '▲' : '▼'}
                  </span>
                </div>
              </button>

              {isActive && (
                <div className="mt-2 space-y-2 pl-1">
                  {ch.videos.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
                    >
                      <p className="text-xs font-semibold leading-snug text-gray-900">{v.title}</p>

                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {v.tags.map((tag, ti) => (
                          <span
                            key={`${v.id}-${ti}-${tag}`}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-x-3 text-[10px] text-gray-500">
                        <span>{v.gradeBand}</span>
                        <span>{v.duration}</span>
                        <span>{v.subject}</span>
                        <span className={v.transcript ? 'text-green-600' : 'text-gray-400'}>
                          {v.transcript ? '✓ Transcript' : 'No transcript'}
                        </span>
                      </div>

                      <p className="mt-1.5 text-[10px] text-gray-500">
                        Best quiz:{' '}
                        <span className="font-medium text-gray-700">{v.bestQuizType}</span>
                      </p>

                      <button
                        type="button"
                        onClick={() => handleSelectVideo(v)}
                        className={`mt-2 w-full rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          selectedVideoId === v.id
                            ? 'bg-green-500 text-white'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                        }`}
                      >
                        {selectedVideoId === v.id ? (
                          <span className="flex items-center justify-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Selected
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1">
                            <Play className="h-3 w-3" /> Use this video
                          </span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
