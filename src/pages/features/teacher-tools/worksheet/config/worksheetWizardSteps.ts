import type { WizardStepDef } from '../../types/teacherToolsWizard'

export const WORKSHEET_BUILD_SUB_STEPS: WizardStepDef[] = [
  { id: 'basics', label: 'Worksheet basics', shortLabel: 'Basics' },
  { id: 'sources', label: 'Source materials', shortLabel: 'Sources' },
  { id: 'scope', label: 'Scope definition', shortLabel: 'Scope' },
  { id: 'generation', label: 'Generation parameters', shortLabel: 'Generate' },
]

export type WorksheetBuildSubStepId = (typeof WORKSHEET_BUILD_SUB_STEPS)[number]['id']
