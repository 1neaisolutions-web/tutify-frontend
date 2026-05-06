/**
 * Step Indicator Component - Visual step checklist for document processing
 */
import { Check, Loader2, X } from 'lucide-react'

interface Step {
  name: string
  label: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: string | null
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => {
        const isCurrent = step.name === currentStep
        const isCompleted = step.status === 'completed'
        const isFailed = step.status === 'failed'
        const isPending = step.status === 'pending'
        
        return (
          <div
            key={step.name}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isCurrent
                ? 'bg-blue-50 border border-blue-200'
                : isCompleted
                ? 'bg-green-50 border border-green-200'
                : isFailed
                ? 'bg-red-50 border border-red-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex-shrink-0">
              {isCompleted ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : isFailed ? (
                <X className="w-5 h-5 text-red-600" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <p
                className={`font-medium ${
                  isCurrent
                    ? 'text-blue-900'
                    : isCompleted
                    ? 'text-green-900'
                    : isFailed
                    ? 'text-red-900'
                    : 'text-gray-600'
                }`}
              >
                {step.label}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
