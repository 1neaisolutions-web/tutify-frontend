import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

const WarmupMcqBlock = ({ questions, answers, open, onToggle, onAnswer, disabled }) => {
  const { t } = useTranslation()
  const [revealed, setRevealed] = useState({})

  const answeredCount = useMemo(
    () => (questions || []).filter((q) => answers?.[q.id] != null).length,
    [questions, answers],
  )

  const handleSelect = (qid, value) => {
    if (disabled) return
    onAnswer?.(qid, value)
    setRevealed((prev) => ({ ...prev, [qid]: true }))
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-900/40"
      >
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
          {t('studentPanel.nightBefore.sections.mcqs', { done: answeredCount, total: questions?.length || 5 })}
        </h2>
        <span className="text-xs text-gray-500">{open ? '−' : '+'}</span>
      </button>
      {open ? (
        <div className="px-4 pb-4 space-y-4">
          {(questions || []).map((q, idx) => {
            const selected = answers?.[q.id]
            const showFeedback = revealed[q.id] || selected != null
            const isCorrect = selected === q.answerIndex
            return (
              <div key={q.id} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {idx + 1}. {q.text}
                </p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt, oi) => {
                    let ring = 'border-gray-200 dark:border-gray-800'
                    if (showFeedback && selected === oi) {
                      ring = isCorrect
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                        : 'border-red-400 bg-red-50 dark:bg-red-950/20'
                    } else if (showFeedback && oi === q.answerIndex) {
                      ring = 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                    }
                    return (
                      <button
                        key={`${q.id}_${oi}`}
                        type="button"
                        disabled={disabled || selected != null}
                        onClick={() => handleSelect(q.id, oi)}
                        className={`text-left flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-800 dark:text-gray-100 ${ring} disabled:cursor-default hover:bg-gray-50 dark:hover:bg-gray-900/40`}
                      >
                        <span className="font-medium text-gray-500">{String.fromCharCode(65 + oi)}.</span>
                        <span>{opt}</span>
                      </button>
                    )
                  })}
                </div>
                {showFeedback ? (
                  <p
                    className={`mt-3 text-sm ${
                      isCorrect ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'
                    }`}
                  >
                    {isCorrect
                      ? t('studentPanel.nightBefore.mcq.correct')
                      : t('studentPanel.nightBefore.mcq.incorrect')}{' '}
                    <span className="text-gray-600 dark:text-gray-300">{q.explanation}</span>
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default WarmupMcqBlock
