import { Check, ChevronRight } from 'lucide-react'
import type { WizardStepDef } from '../types/teacherToolsWizard'

interface Props {
  steps: WizardStepDef[]
  current: number
  maxUnlocked: number
  onStepClick?: (index: number) => void
  /** Nested under primary stepper — less vertical padding. */
  compact?: boolean
}

export function TeacherToolsSubStepper({ steps, current, maxUnlocked, onStepClick, compact = false }: Props) {
  return (
    <nav
      aria-label="Configure steps"
      className={compact ? '' : 'border-b border-gray-200 pb-4'}
    >
      <ol className={`flex flex-wrap items-center ${compact ? 'gap-y-1' : 'gap-y-2'}`}>
        {steps.map((step, i) => {
          const done = i < current
          const active = i === current
          const locked = i > maxUnlocked
          const clickable = !locked && !!onStepClick

          return (
            <li key={step.id} className="flex items-center">
              {i > 0 && <ChevronRight className="mx-1.5 h-3.5 w-3.5 shrink-0 text-gray-300" aria-hidden />}
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(i)}
                aria-current={active ? 'step' : undefined}
                className={`flex items-center gap-1.5 rounded-full font-medium transition ${
                  compact ? 'px-1.5 py-0.5 text-xs' : 'gap-2 px-2.5 py-1 text-sm'
                } ${
                  active
                    ? 'text-indigo-700'
                    : done
                      ? 'text-gray-700 hover:text-indigo-700'
                      : locked
                        ? 'cursor-not-allowed text-gray-400'
                        : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span
                  className={`flex shrink-0 items-center justify-center rounded-full font-bold ${
                    compact ? 'h-5 w-5 text-[10px]' : 'h-6 w-6 text-[11px]'
                  } ${
                    done
                      ? 'bg-emerald-600 text-white'
                      : active
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-100'
                        : locked
                          ? 'border border-gray-200 bg-gray-50 text-gray-400'
                          : 'border border-gray-300 bg-white text-gray-600'
                  }`}
                >
                  {done ? <Check className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} /> : i + 1}
                </span>
                <span className="hidden sm:inline">{step.shortLabel ?? step.label}</span>
                <span className="sm:hidden">{step.shortLabel ?? step.label.split(' ')[0]}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
