import { Check } from 'lucide-react'

interface Props {
  steps: string[]
  current: number
  onStepClick?: (index: number) => void
}

export function TeacherToolsWizardStepper({ steps, current, onStepClick }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {steps.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <button
            key={label}
            type="button"
            disabled={!onStepClick}
            onClick={() => onStepClick?.(i)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? 'border-[#1D9E75] bg-[#E8F7F1] text-[#0B5C3F]'
                : done
                  ? 'border-[#1D9E75]/40 bg-[#E8F7F1] text-[#0B5C3F]'
                  : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                done || active ? 'bg-[#1D9E75] text-white' : 'bg-gray-200 text-gray-600'
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
