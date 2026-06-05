import type { WizardStepDef } from '../../types/teacherToolsWizard'

export const EXAM_BUILD_SUB_STEPS: WizardStepDef[] = [
  { id: 'basics', label: 'Exam basics', shortLabel: 'Basics' },
  { id: 'sources', label: 'Source materials', shortLabel: 'Sources' },
  { id: 'scope', label: 'Scope definition', shortLabel: 'Scope' },
  { id: 'paper_structure', label: 'Paper structure', shortLabel: 'Paper' },
]

export type ExamBuildSubStepId = (typeof EXAM_BUILD_SUB_STEPS)[number]['id']
