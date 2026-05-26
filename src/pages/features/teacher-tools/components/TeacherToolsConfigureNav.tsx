import { TeacherToolsSubStepper } from './TeacherToolsSubStepper'
import { TeacherToolsWizardStepper } from './TeacherToolsWizardStepper'
import type { WizardStepDef } from '../types/teacherToolsWizard'

type Props = {
  primarySteps: string[]
  primaryCurrent: number
  primaryMaxReachable?: number
  onPrimaryStepClick?: (index: number) => void
  subSteps?: WizardStepDef[]
  subCurrent?: number
  subMaxUnlocked?: number
  onSubStepClick?: (index: number) => void
  showSubSteps?: boolean
}

/** Primary + sub configure breadcrumbs in a single compact block. */
export function TeacherToolsConfigureNav({
  primarySteps,
  primaryCurrent,
  primaryMaxReachable,
  onPrimaryStepClick,
  subSteps,
  subCurrent = 0,
  subMaxUnlocked = 0,
  onSubStepClick,
  showSubSteps = true,
}: Props) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-200 pb-3">
      <TeacherToolsWizardStepper
        steps={primarySteps}
        current={primaryCurrent}
        maxReachableStep={primaryMaxReachable}
        onStepClick={onPrimaryStepClick}
      />
      {showSubSteps && subSteps && subSteps.length > 0 && (
        <TeacherToolsSubStepper
          compact
          steps={subSteps}
          current={subCurrent}
          maxUnlocked={subMaxUnlocked}
          onStepClick={onSubStepClick}
        />
      )}
    </div>
  )
}
