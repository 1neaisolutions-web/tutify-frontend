import { useTranslation } from 'react-i18next'

const TopicSummarySection = ({ bullets, open, onToggle }) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900/40"
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.nightBefore.sections.summary')}</h2>
        <span className="text-xs text-gray-500">{open ? '−' : '+'}</span>
      </button>
      {open ? (
        <ul className="px-4 pb-4 space-y-2">
          {(bullets || []).map((b) => (
            <li key={b} className="text-sm text-gray-700 dark:text-gray-200 rounded-lg bg-gray-50 dark:bg-gray-900/40 px-3 py-2">
              {b}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default TopicSummarySection
