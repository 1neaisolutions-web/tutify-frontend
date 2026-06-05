import type { WizardStepDef } from '../../types/teacherToolsWizard'

export const QUIZ_BUILD_SUB_STEPS: WizardStepDef[] = [
  { id: 'basics', label: 'Quiz basics', shortLabel: 'Basics' },
  { id: 'sources', label: 'Source materials', shortLabel: 'Sources' },
  { id: 'scope', label: 'Scope definition', shortLabel: 'Scope' },
  { id: 'design', label: 'Question design', shortLabel: 'Design' },
  { id: 'delivery', label: 'Delivery defaults', shortLabel: 'Delivery' },
]

export type QuizBuildSubStepId = (typeof QUIZ_BUILD_SUB_STEPS)[number]['id']
