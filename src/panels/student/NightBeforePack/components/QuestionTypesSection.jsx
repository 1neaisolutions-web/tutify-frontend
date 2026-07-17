import { useTranslation } from 'react-i18next'

const QuestionTypesSection = ({ items, open, onToggle }) => {
  const { t } = useTranslation()

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900/40"
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.nightBefore.sections.questionTypes')}</h2>
        <span className="text-xs text-gray-500">{open ? '−' : '+'}</span>
      </button>
      {open ? (
        <div className="px-4 pb-4 space-y-3">
          {(items || []).map((q) => (
            <div key={q.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-gray-900 dark:text-gray-100">{q.type}</p>
                <span className="text-xs font-medium text-primary-700 dark:text-primary-300">{q.weight}</span>
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{q.tip}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default QuestionTypesSection
