import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../../redux/http'

type SectionItem = {
  assignment_id: string
  content_id: string
  content_type: string
  bucket: 'visible' | 'locked_preview' | 'reserve'
  position: number
  route?: string
  locked?: boolean
  unlock_hint?: string | null
  title?: string
  display_meta?: {
    category?: string
    duration?: string
    difficulty?: string
    source_type?: string
  }
}

const sectionTitle: Record<string, string> = {
  micro_courses: 'Personalized Micro-Courses',
  growth_recommendations: 'AI Growth Recommendations',
  tutorials: 'AI-Guided Tutorials',
  research_insights: 'Research Insights',
  specialist_tracks: 'Specialist Deep-Dive Tracks',
}

export default function LearningHubSectionViewAllPage() {
  const navigate = useNavigate()
  const { section } = useParams()
  const [items, setItems] = useState<SectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await axiosInstance.get(`/api/v1/learning-hub/sections/${section}`)
        if (!mounted) return
        const merged: SectionItem[] = [
          ...(data.visible_items || []),
          ...(data.locked_preview_items || []),
          ...(data.reserve_items || []),
        ]
        setItems(merged)
      } catch (e: any) {
        if (!mounted) return
        setError(e?.response?.data?.detail || e?.message || 'Failed to load section')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [section])

  const grouped = useMemo(() => {
    const visible = items.filter((i) => i.bucket === 'visible')
    const locked = items.filter((i) => i.bucket === 'locked_preview')
    return { visible, locked }
  }, [items])

  const openItem = (item: SectionItem) => {
    if (!item.route || item.locked) return
    navigate(item.route, {
      state: {
        content_id: item.content_id,
        content_type: item.content_type,
        assignment_id: item.assignment_id,
        source_section: section,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{sectionTitle[section || ''] || 'Section'}</h1>
        <button
          onClick={() => navigate('/learning-hub')}
          className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 hover:bg-gray-50"
        >
          Back to hub
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading section items...</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">Available now</h2>
            <div className="mt-3 space-y-3">
              {grouped.visible.map((item) => (
                <button
                  key={item.assignment_id}
                  onClick={() => openItem(item)}
                  className="w-full rounded-xl border border-gray-100 bg-gray-50 p-4 text-left hover:border-amber-200"
                >
                  <p className="text-xs text-gray-500">{item.content_type.replaceAll('_', ' ')}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 break-words">{item.title || item.content_id}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {[item.display_meta?.category, item.display_meta?.duration, item.display_meta?.difficulty]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                </button>
              ))}
              {grouped.visible.length === 0 && <p className="text-sm text-gray-400">No unlocked items yet.</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-800">Locked preview</h2>
            <div className="mt-3 space-y-3">
              {grouped.locked.map((item) => (
                <div key={item.assignment_id} className="rounded-xl border border-amber-100 bg-white p-4">
                  <p className="text-xs text-amber-700">{item.content_type.replaceAll('_', ' ')}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900 break-words">{item.title || item.content_id}</p>
                  {item.unlock_hint && <p className="mt-1 text-xs text-gray-600">{item.unlock_hint}</p>}
                </div>
              ))}
              {grouped.locked.length === 0 && <p className="text-sm text-gray-400">No locked preview items.</p>}
            </div>
          </section>

        </div>
      )}
    </div>
  )
}
