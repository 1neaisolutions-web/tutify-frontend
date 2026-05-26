import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'

interface Props {
  isFirstStep: boolean
  isLastStep: boolean
  canGoNext: boolean
  onBack: () => void
  onNext: () => void
  onGenerate?: () => void
  generating?: boolean
  generateLabel?: string
  onShowExemplar?: () => void
  showExemplarLabel?: string
  /** Leave create flow and return to tool list */
  onExitToList?: () => void
  exitLabel?: string
  /** Extra action on the left (e.g. Edit requirements on review) */
  secondaryAction?: { label: string; onClick: () => void }
  /** Hide sub-step back / exemplar / next (review dock) */
  hideStepActions?: boolean
}

export function TeacherToolsWizardFooter({
  isFirstStep,
  isLastStep,
  canGoNext,
  onBack,
  onNext,
  onGenerate,
  generating = false,
  generateLabel = 'Generate',
  onShowExemplar,
  showExemplarLabel = 'Show exemplar',
  onExitToList,
  exitLabel = 'Back to list',
  secondaryAction,
  hideStepActions = false,
}: Props) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {onExitToList && (
          <button
            type="button"
            onClick={onExitToList}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-primary-600 hover:bg-primary-50"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
            {exitLabel}
          </button>
        )}
        {onExitToList && (secondaryAction || (!hideStepActions && !isFirstStep)) && (
          <span className="hidden h-5 w-px bg-gray-200 sm:inline" aria-hidden />
        )}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            {secondaryAction.label}
          </button>
        )}
        {!hideStepActions && !isFirstStep && (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        )}
        {!hideStepActions && onShowExemplar && (
          <button
            type="button"
            onClick={onShowExemplar}
            className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
          >
            <Sparkles className="h-4 w-4" />
            {showExemplarLabel}
          </button>
        )}
      </div>

      {!hideStepActions && (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {!isLastStep && (
            <button
              type="button"
              onClick={onNext}
              disabled={!canGoNext}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
          {isLastStep && onGenerate && (
            <button
              type="button"
              onClick={onGenerate}
              disabled={generating || !canGoNext}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating…
                </>
              ) : (
                generateLabel
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
