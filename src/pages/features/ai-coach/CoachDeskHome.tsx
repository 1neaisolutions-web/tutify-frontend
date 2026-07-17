import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bot, MessageSquare, Plus, Search, Wrench, X } from 'lucide-react'
import { listChatbots } from '../../../api/chatbots'
import {
  COACH_CATEGORIES,
  GENERAL_COACH,
  allCapabilities,
  capabilityWorkspacePath,
  firstCapabilityForTool,
} from '../../../data/coachCatalog'

const CoachDeskHome = () => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [availability, setAvailability] = useState<Record<string, boolean> | null>(null)

  useEffect(() => {
    let mounted = true
    listChatbots()
      .then((bots) => {
        if (!mounted) return
        const avail: Record<string, boolean> = {}
        bots.forEach((b) => {
          avail[b.slug] = b.is_active
        })
        setAvailability(avail)
      })
      .catch(() => setAvailability(null))
    return () => {
      mounted = false
    }
  }, [])

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return null

    const generalHit = {
      kind: 'chat' as const,
      key: GENERAL_COACH.slug,
      slug: GENERAL_COACH.slug,
      name: t('chatbotsPage.general.name'),
      description: t('chatbotsPage.general.description'),
      href: `/chatbots/${GENERAL_COACH.slug}`,
    }

    const capHits = allCapabilities().map((cap) => ({
      kind: 'capability' as const,
      key: `${cap.toolSlug}:${cap.id}`,
      slug: cap.toolSlug,
      name: cap.label,
      description: cap.description,
      href: capabilityWorkspacePath(cap),
    }))

    return [generalHit, ...capHits].filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
    )
  }, [query, t])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">AI Coach Desk</h1>
        <p className="mt-1 text-sm text-gray-600">
          Quick instructional support for classroom questions, analysis, rewriting, and subject-specific coaching.
        </p>
      </div>

      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search coaches by name or what they help with"
          className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {searchResults ? (
        <section>
          <p className="mb-3 text-sm text-gray-500">
            {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((item) => {
              const isAvailable = availability === null || availability[item.slug] !== false
              return (
                <Link
                  key={item.key}
                  to={isAvailable ? item.href : '#'}
                  aria-disabled={!isAvailable}
                  className={`rounded-2xl border border-gray-200 bg-white p-5 transition ${
                    isAvailable ? 'hover:border-primary-300 hover:shadow-md' : 'pointer-events-none opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.kind === 'chat' ? (
                      <MessageSquare className="h-4 w-4 text-primary-500" />
                    ) : (
                      <Wrench className="h-4 w-4 text-gray-400" />
                    )}
                    <p className="font-semibold text-gray-900">{item.name}</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                  {!isAvailable && (
                    <span className="mt-2 inline-block text-xs font-medium text-gray-500">Temporarily unavailable</span>
                  )}
                </Link>
              )
            })}
            {searchResults.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                No coaches match &quot;{query}&quot;.
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                  <Bot className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">Featured</p>
                  <h2 className="mt-1 text-xl font-semibold text-gray-900">{t('chatbotsPage.general.name')}</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-600">{t('chatbotsPage.general.description')}</p>
                </div>
              </div>
              <Link
                to="/chatbots/general-teaching-assistant"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-500"
              >
                <Plus className="h-4 w-4" />
                {t('chatbotsPage.general.startChatting')}
              </Link>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Coach categories</h2>
              <p className="mt-1 text-sm text-gray-500">Each category groups a small set of focused capabilities.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {COACH_CATEGORIES.map((category) => (
                <Link
                  key={category.key}
                  to={`/chatbots/category/${category.key}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-primary-300 hover:shadow-md"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${category.colorClasses}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{category.label}</h3>
                  <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                  <p className="mt-3 text-xs font-medium text-gray-400">
                    {category.capabilities.length}{' '}
                    {category.capabilities.length === 1 ? 'capability' : 'capabilities'}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default CoachDeskHome

// Keep helper available for deep links that still need a default capability
export { firstCapabilityForTool }
