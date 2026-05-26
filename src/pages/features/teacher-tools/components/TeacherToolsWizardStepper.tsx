import { Check } from 'lucide-react'

interface Props {
  steps: string[]
  current: number
  /** Highest step index the user may navigate to (inclusive). Defaults to last step. */
  maxReachableStep?: number
  onStepClick?: (index: number) => void
}

export function TeacherToolsWizardStepper({
  steps,
  current,
  maxReachableStep,
  onStepClick,
}: Props) {
  const maxReachable = maxReachableStep ?? steps.length - 1

  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        const locked = i > maxReachable
        const clickable = !!onStepClick && !locked

        return (
          <button
            key={label}
            type="button"
            disabled={!clickable}
            onClick={() => clickable && onStepClick?.(i)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? 'border-[#1D9E75] bg-[#E8F7F1] text-[#0B5C3F]'
                : done
                  ? 'border-[#1D9E75]/40 bg-[#E8F7F1] text-[#0B5C3F] hover:opacity-90'
                  : locked
                    ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                done || active
                  ? 'bg-[#1D9E75] text-white'
                  : locked
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-200 text-gray-600'
              }`}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            {label}
          </button>
        )
      })}
    </div>
  )
}
