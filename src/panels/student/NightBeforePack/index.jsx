import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { loadPacks } from './nightBeforePackStorage'
import PackHeroCard from './components/PackHeroCard'
import PackListSection from './components/PackListSection'
import PackEmptyState from './components/PackEmptyState'

const HubSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-40 rounded-2xl bg-gray-100 dark:bg-gray-900" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-28 rounded-xl bg-gray-100 dark:bg-gray-900" />
      <div className="h-28 rounded-xl bg-gray-100 dark:bg-gray-900" />
      <div className="h-28 rounded-xl bg-gray-100 dark:bg-gray-900" />
    </div>
  </div>
)

const NightBeforePackHub = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [storageWarning, setStorageWarning] = useState(false)
  const [packs, setPacks] = useState([])

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(() => {
      const result = loadPacks()
      if (cancelled) return
      setPacks(result.data)
      setStorageWarning(!result.ok)
      setLoading(false)
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [])

  const { hero, upcoming, past } = useMemo(() => {
    const readyUnread = packs.find(
      (p) => p.status === 'ready' && !p.progress?.readAt && !p.progress?.markedDoneAt,
    )
    const heroPack = readyUnread || packs.find((p) => p.status === 'ready') || null

    const upcomingPacks = packs.filter(
      (p) =>
        p.id !== heroPack?.id &&
        (p.status === 'scheduled' || p.status === 'generating' || p.status === 'failed' || p.status === 'ready'),
    )
    const pastPacks = packs.filter((p) => p.status === 'completed')

    return { hero: heroPack, upcoming: upcomingPacks, past: pastPacks }
  }, [packs])

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.nightBefore.title')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.nightBefore.subtitle')}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/student/night-before/create')}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 shrink-0"
        >
          {t('studentPanel.nightBefore.createCta')}
        </button>
      </div>

      <div className="px-6 py-6 max-w-5xl space-y-6">
        {storageWarning ? (
          <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            {t('studentPanel.nightBefore.storageWarning')}
          </div>
        ) : null}

        {loading ? (
          <HubSkeleton />
        ) : packs.length === 0 ? (
          <PackEmptyState />
        ) : (
          <>
            {hero ? <PackHeroCard pack={hero} /> : null}
            <PackListSection
              title={t('studentPanel.nightBefore.sections.upcoming')}
              packs={upcoming}
              emptyLabel={t('studentPanel.nightBefore.list.noUpcoming')}
            />
            <PackListSection
              title={t('studentPanel.nightBefore.sections.past')}
              packs={past}
              emptyLabel={t('studentPanel.nightBefore.list.noPast')}
            />
          </>
        )}
      </div>
    </div>
  )
}

export default NightBeforePackHub
