import type {
  SafetyStandard,
  SafetyProtocol,
  RiskAssessment,
  ChemicalInfo,
  EquipmentSafety,
  EmergencyProcedure,
  ExperimentDesign,
} from './labSafetyUtils'
import { ensureArray, ensureString } from './adapterHelpers'

export function mapLabSafetyStandardsResult(result: Record<string, unknown>): SafetyStandard[] {
  const raw = ensureArray<Record<string, unknown>>(result.standards)
  return raw.map((s) => ({
    id: ensureString(s.id, 'standard'),
    name: ensureString(s.name),
    organization: ensureString(s.organization),
    region: ensureString(s.region),
    description: ensureString(s.description),
    keyRequirements: ensureArray(s.keyRequirements),
    applicableLabs: ensureArray(s.applicableLabs),
    complianceChecklist: ensureArray(s.complianceChecklist),
    resources: ensureArray(s.resources),
  }))
}

export function mapLabSafetyProtocolResult(result: Record<string, unknown>): SafetyProtocol {
  const stepsRaw = ensureArray<Record<string, unknown>>(result.steps)
  return {
    id: ensureString(result.id, 'protocol'),
    title: ensureString(result.title),
    labType: (ensureString(result.labType, 'general') as SafetyProtocol['labType']) || 'general',
    gradeLevel: ensureString(result.gradeLevel),
    category: (ensureString(result.category, 'general') as SafetyProtocol['category']) || 'general',
    steps: stepsRaw.map((st) => ({
      step: typeof st.step === 'number' ? st.step : Number(st.step) || 0,
      action: ensureString(st.action),
      safetyNote: st.safetyNote != null ? ensureString(st.safetyNote) : undefined,
    })),
    requiredPPE: ensureArray(result.requiredPPE),
    hazards: ensureArray(result.hazards),
    emergencyProcedures: ensureArray(result.emergencyProcedures),
    complianceStandards: ensureArray(result.complianceStandards),
  }
}

export function mapLabRiskAssessmentResult(result: Record<string, unknown>): RiskAssessment {
  const hazardsRaw = ensureArray<Record<string, unknown>>(result.hazards)
  return {
    experiment: ensureString(result.experiment),
    labType: ensureString(result.labType),
    gradeLevel: ensureString(result.gradeLevel),
    hazards: hazardsRaw.map((h) => ({
      type: (ensureString(h.type, 'physical') as RiskAssessment['hazards'][0]['type']) || 'physical',
      description: ensureString(h.description),
      severity: (ensureString(h.severity, 'medium') as RiskAssessment['hazards'][0]['severity']) || 'medium',
      likelihood: (ensureString(h.likelihood, 'possible') as RiskAssessment['hazards'][0]['likelihood']) || 'possible',
      controls: ensureArray(h.controls),
    })),
    overallRisk: (ensureString(result.overallRisk, 'medium') as RiskAssessment['overallRisk']) || 'medium',
    recommendations: ensureArray(result.recommendations),
    approvalRequired: Boolean(result.approvalRequired),
  }
}

export function mapLabChemicalResult(result: Record<string, unknown>): ChemicalInfo {
  return {
    name: ensureString(result.name),
    casNumber: result.casNumber != null ? ensureString(result.casNumber) : undefined,
    formula: result.formula != null ? ensureString(result.formula) : undefined,
    ghsHazardClasses: ensureArray(result.ghsHazardClasses),
    ghsPictograms: ensureArray(result.ghsPictograms),
    storageRequirements: ensureArray(result.storageRequirements),
    incompatibilities: ensureArray(result.incompatibilities),
    ppeRequired: ensureArray(result.ppeRequired),
    disposalMethod: ensureString(result.disposalMethod),
    emergencyProcedures: ensureArray(result.emergencyProcedures),
  }
}

export function mapLabEquipmentResult(result: Record<string, unknown>): EquipmentSafety {
  return {
    equipment: ensureString(result.equipment),
    labType: ensureString(result.labType),
    safetyFeatures: ensureArray(result.safetyFeatures),
    operatingProcedures: ensureArray(result.operatingProcedures),
    maintenanceSchedule: ensureArray(result.maintenanceSchedule),
    hazards: ensureArray(result.hazards),
    ppeRequired: ensureArray(result.ppeRequired),
    emergencyProcedures: ensureArray(result.emergencyProcedures),
    ageAppropriate: ensureArray(result.ageAppropriate),
  }
}

export function mapLabEmergencyResult(result: Record<string, unknown>): EmergencyProcedure {
  return {
    type: (ensureString(result.type, 'spill') as EmergencyProcedure['type']) || 'spill',
    severity: (ensureString(result.severity, 'moderate') as EmergencyProcedure['severity']) || 'moderate',
    steps: ensureArray(result.steps),
    ppeRequired: ensureArray(result.ppeRequired),
    contacts: ensureArray(result.contacts),
    followUp: ensureArray(result.followUp),
  }
}

export function mapLabExperimentDesignResult(result: Record<string, unknown>): ExperimentDesign {
  const materialsRaw = ensureArray<Record<string, unknown>>(result.materials)
  return {
    title: ensureString(result.title),
    objective: ensureString(result.objective),
    labType: ensureString(result.labType),
    gradeLevel: ensureString(result.gradeLevel),
    materials: materialsRaw.map((m) => ({
      item: ensureString(m.item),
      quantity: ensureString(m.quantity),
      safetyNotes: m.safetyNotes != null ? ensureString(m.safetyNotes) : undefined,
    })),
    procedure: ensureArray(result.procedure),
    safetyConsiderations: ensureArray(result.safetyConsiderations),
    riskLevel: (ensureString(result.riskLevel, 'low') as ExperimentDesign['riskLevel']) || 'low',
    alternatives: ensureArray(result.alternatives),
    assessment: ensureArray(result.assessment),
  }
}

/** Map UI protocol category label to API protocol_category */
export function labProtocolCategoryToParam(ui: string): string {
  const m: Record<string, string> = {
    'Chemical Handling': 'chemical-handling',
    'Equipment Operation': 'equipment-operation',
    'PPE Usage': 'ppe-usage',
    'Emergency Procedures': 'emergency-procedures',
    'General Safety': 'general-safety',
  }
  return m[ui] || 'general-safety'
}
