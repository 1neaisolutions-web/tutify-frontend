import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const FormulasSection = ({ formulas, open, onToggle }) => {
  const { t } = useTranslation()
  const [copiedId, setCopiedId] = useState(null)

  const copy = async (formula) => {
    try {
      await navigator.clipboard.writeText(`${formula.name}: ${formula.expression}`)
      setCopiedId(formula.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      // ignore
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900/40"
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.nightBefore.sections.formulas')}</h2>
        <span className="text-xs text-gray-500">{open ? '−' : '+'}</span>
      </button>
      {open ? (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(formulas || []).map((f) => (
            <div key={f.id} className="rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/40 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{f.name}</p>
                <button
                  type="button"
                  onClick={() => copy(f)}
                  className="text-xs text-primary-700 dark:text-primary-300 hover:underline shrink-0"
                >
                  {copiedId === f.id ? t('studentPanel.nightBefore.formulas.copied') : t('studentPanel.nightBefore.formulas.copy')}
                </button>
              </div>
              <p className="mt-2 font-mono text-sm text-gray-800 dark:text-gray-100">{f.expression}</p>
              {f.note ? <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{f.note}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default FormulasSection
