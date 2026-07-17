import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'

const STEP_MS = [600, 700, 600, 600]

const GenerationProgress = ({ onComplete, onCancel, forceFail = false }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [failed, setFailed] = useState(false)
  const [failArmed, setFailArmed] = useState(forceFail)

  const steps = [
    t('studentPanel.nightBefore.generation.steps.topics'),
    t('studentPanel.nightBefore.generation.steps.formulas'),
    t('studentPanel.nightBefore.generation.steps.questionTypes'),
    t('studentPanel.nightBefore.generation.steps.mcqs'),
  ]

  useEffect(() => {
    if (failed) return undefined
    if (step >= steps.length) {
      if (failArmed) {
        setFailed(true)
        return undefined
      }
      const done = setTimeout(() => onComplete?.(), 350)
      return () => clearTimeout(done)
    }
    const tmr = setTimeout(() => setStep((s) => s + 1), STEP_MS[step] || 500)
    return () => clearTimeout(tmr)
  }, [step, steps.length, onComplete, failArmed, failed])

  const progressPct = Math.min(100, Math.round((step / steps.length) * 100))

  if (failed) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 p-6 space-y-4">
        <h2 className="font-semibold text-red-800 dark:text-red-200">{t('studentPanel.nightBefore.error.title')}</h2>
        <p className="text-sm text-red-700 dark:text-red-300">{t('studentPanel.nightBefore.error.default')}</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setFailArmed(false)
              setFailed(false)
              setStep(0)
            }}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            {t('studentPanel.nightBefore.error.retry')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-900"
          >
            {t('studentPanel.common.cancel')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.nightBefore.generation.title')}</h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.nightBefore.generation.subtitle')}</p>
      </div>

      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <ul className="space-y-3">
        {steps.map((label, i) => {
          const done = i < step
          const active = i === step
          return (
            <li
              key={label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                active ? 'bg-primary-50 dark:bg-primary-950/30 text-primary-800 dark:text-primary-200' : 'text-gray-700 dark:text-gray-200'
              } ${!done && !active ? 'opacity-50' : ''}`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  done
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : active
                      ? 'border-primary-500 animate-pulse'
                      : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : <span className="text-xs">{i + 1}</span>}
              </span>
              <span>{label}</span>
            </li>
          )
        })}
      </ul>

      <div className="animate-pulse space-y-2 pt-1">
        <div className="h-3 rounded bg-gray-100 dark:bg-gray-900 w-5/6" />
        <div className="h-3 rounded bg-gray-100 dark:bg-gray-900 w-2/3" />
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
      >
        {t('studentPanel.common.cancel')}
      </button>
    </div>
  )
}

export default GenerationProgress
