export interface WizardStepDef {
  id: string
  label: string
  shortLabel?: string
}

export interface BuildValidation {
  ok: boolean
  errors: string[]
}
