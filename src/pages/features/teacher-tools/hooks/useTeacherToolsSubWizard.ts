import { useCallback, useEffect, useMemo, useState } from 'react'
import type { WizardStepDef } from '../types/teacherToolsWizard'

export interface UseTeacherToolsSubWizardOptions {
  /** Optional sessionStorage key to restore sub-step on refresh */
  storageKey?: string
  initialStep?: number
}

export function useTeacherToolsSubWizard(
  steps: WizardStepDef[],
  options: UseTeacherToolsSubWizardOptions = {},
) {
  const { storageKey, initialStep = 0 } = options
  const stepCount = steps.length

  const readStoredStep = (): number => {
    if (!storageKey || typeof window === 'undefined') return initialStep
    try {
      const raw = sessionStorage.getItem(storageKey)
      if (raw == null) return initialStep
      const n = Number.parseInt(raw, 10)
      if (Number.isNaN(n) || n < 0 || n >= stepCount) return initialStep
      return n
    } catch {
      return initialStep
    }
  }

  const [currentStep, setCurrentStep] = useState(readStoredStep)
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(initialStep)

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return
    try {
      sessionStorage.setItem(storageKey, String(currentStep))
    } catch {
      /* ignore */
    }
  }, [currentStep, storageKey])

  const currentStepId = steps[currentStep]?.id ?? steps[0]?.id ?? ''
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === stepCount - 1

  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= stepCount) return
      if (index > maxUnlockedStep) return
      setCurrentStep(index)
    },
    [maxUnlockedStep, stepCount],
  )

  const goNext = useCallback(() => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, stepCount - 1)
      setMaxUnlockedStep((max) => Math.max(max, next))
      return next
    })
  }, [stepCount])

  const goBack = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }, [])

  const unlockAllSteps = useCallback(() => {
    setMaxUnlockedStep(stepCount - 1)
    setCurrentStep(stepCount - 1)
  }, [stepCount])

  const resetWizard = useCallback(
    (opts?: { step?: number; maxUnlocked?: number }) => {
      const step = opts?.step ?? initialStep
      const max = opts?.maxUnlocked ?? initialStep
      setCurrentStep(step)
      setMaxUnlockedStep(max)
      if (storageKey && typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(storageKey, String(step))
        } catch {
          /* ignore */
        }
      }
    },
    [initialStep, storageKey],
  )

  const clearStorage = useCallback(() => {
    if (!storageKey || typeof window === 'undefined') return
    try {
      sessionStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
  }, [storageKey])

  /** Call when current step validation passes before advancing */
  const advanceIfValid = useCallback(
    (isValid: boolean) => {
      if (!isValid) return false
      goNext()
      return true
    },
    [goNext],
  )

  const stepLabels = useMemo(() => steps.map((s) => s.label), [steps])

  return {
    steps,
    stepCount,
    currentStep,
    currentStepId,
    maxUnlockedStep,
    isFirstStep,
    isLastStep,
    stepLabels,
    goToStep,
    goNext,
    goBack,
    unlockAllSteps,
    resetWizard,
    clearStorage,
    advanceIfValid,
    setMaxUnlockedStep,
    setCurrentStep,
  }
}
