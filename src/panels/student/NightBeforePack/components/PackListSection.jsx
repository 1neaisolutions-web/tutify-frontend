import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import PackStatusBadge from './PackStatusBadge'
import PackSourceBadge from './PackSourceBadge'

const PackListSection = ({ title, packs, emptyLabel }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</h2>
      {packs.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-800 px-4 py-3">
          {emptyLabel}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packs.map((pack) => {
            const examLabel = new Date(pack.examAt).toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })
            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => navigate(`/student/night-before/${pack.id}`)}
                className="text-left rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900/40 p-4 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{pack.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{pack.subject}</p>
                  </div>
                  <PackStatusBadge status={pack.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PackSourceBadge source={pack.source} />
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-200">
                    {examLabel}
                  </span>
                  {pack.status === 'completed' && pack.progress?.mcqScore != null ? (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
                      {t('studentPanel.nightBefore.list.score', {
                        score: pack.progress.mcqScore,
                        total: pack.content?.warmupMcqs?.length || 5,
                      })}
                    </span>
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default PackListSection
