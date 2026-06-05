import type { WizardStepDef } from '../../types/teacherToolsWizard'

export const ASSIGNMENT_BUILD_SUB_STEPS: WizardStepDef[] = [
  { id: 'basics', label: 'Assignment basics', shortLabel: 'Basics' },
  { id: 'sources', label: 'Source materials', shortLabel: 'Sources' },
  { id: 'scope', label: 'Scope definition', shortLabel: 'Scope' },
  { id: 'design', label: 'Assignment design', shortLabel: 'Design' },
]

export type AssignmentBuildSubStepId = (typeof ASSIGNMENT_BUILD_SUB_STEPS)[number]['id']
