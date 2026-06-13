/**
 * Map algebra-geometry-tutor capability JSON to AlgebraGeometryTutor.tsx UI types.
 */
import { ensureArray, ensureRecord, ensureString } from './adapterHelpers'

export interface VisualExplanationUI {
  concept: string
  explanation: string
  visualType: 'graph' | 'diagram' | 'animation' | 'interactive'
  steps: {
    step: number
    description: string
    visual: string
  }[]
  interactiveElements: string[]
}

export interface ProofStrategyUI {
  theorem: string
  proofType: 'direct' | 'indirect' | 'contradiction' | 'induction' | 'construction'
  strategy: string
  steps: {
    step: number
    statement: string
    justification: string
    visual?: string
  }[]
  hints: string[]
  commonMistakes: string[]
}

export interface ScaffoldedPracticeUI {
  topic: string
  levels: {
    level: number
    name: string
    problems: {
      id: number
      question: string
      hints: string[]
      solution: string
      explanation: string
    }[]
  }[]
}

function getVal(obj: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return obj[k]
  }
  return undefined
}

function normVisualType(raw: string): VisualExplanationUI['visualType'] {
  const x = raw.toLowerCase()
  if (x.includes('graph') || x.includes('line') || x.includes('coordinate')) return 'graph'
  if (x.includes('anim')) return 'animation'
  if (x.includes('interactive')) return 'interactive'
  return 'diagram'
}

function normProofType(raw: string): ProofStrategyUI['proofType'] {
  const x = raw.toLowerCase()
  if (x.includes('contradiction')) return 'contradiction'
  if (x.includes('induction')) return 'induction'
  if (x.includes('construction') || x.includes('synthetic') || x.includes('two-column')) return 'construction'
  if (x.includes('indirect')) return 'indirect'
  return 'direct'
}

const LEVEL_GROUPS: Record<string, { level: number; name: string }> = {
  easy: { level: 1, name: 'Foundation' },
  medium: { level: 2, name: 'Intermediate' },
  challenge: { level: 3, name: 'Advanced' },
  advanced: { level: 3, name: 'Advanced' },
  hard: { level: 3, name: 'Advanced' },
}

export function isUiVisualPayload(raw: Record<string, unknown>): boolean {
  return typeof raw.visualType === 'string' && Array.isArray(raw.steps)
}

export function isUiProofPayload(raw: Record<string, unknown>): boolean {
  return typeof raw.theorem === 'string' && Array.isArray(raw.steps) && raw.steps.length > 0
    && typeof (raw.steps[0] as Record<string, unknown>)?.statement === 'string'
}

export function isUiPracticePayload(raw: Record<string, unknown>): boolean {
  return Array.isArray(raw.levels)
    && raw.levels.length > 0
    && typeof (raw.levels[0] as Record<string, unknown>)?.problems !== 'undefined'
}

export function mapVisualExplanationResult(result: Record<string, unknown>): VisualExplanationUI {
  const topic = ensureString(getVal(result, 'topic', 'concept'))
  const explanation = ensureString(result.explanation)
  const visualsRaw = ensureArray<Record<string, unknown>>(result.visuals)
  const worked = ensureRecord(result.workedExample)
  const workedSteps = ensureArray<string>(worked.steps)

  const firstVisualType = visualsRaw[0] ? ensureString(visualsRaw[0].type, 'diagram') : 'diagram'
  const visualType = normVisualType(firstVisualType)

  const steps: VisualExplanationUI['steps'] = []
  if (workedSteps.length > 0) {
    workedSteps.forEach((stepText, idx) => {
      const visual = visualsRaw[idx]
      steps.push({
        step: idx + 1,
        description: stepText,
        visual: visual
          ? ensureString(getVal(visual, 'example', 'description'))
          : '',
      })
    })
  } else {
    visualsRaw.forEach((visual, idx) => {
      steps.push({
        step: idx + 1,
        description: ensureString(visual.description),
        visual: ensureString(getVal(visual, 'example', 'description')),
      })
    })
  }

  const interactiveElements = visualsRaw
    .map((v) => ensureString(v.description))
    .filter(Boolean)

  return {
    concept: topic,
    explanation,
    visualType,
    steps,
    interactiveElements,
  }
}

export function mapProofStrategyResult(result: Record<string, unknown>): ProofStrategyUI {
  const theorem = ensureString(getVal(result, 'statement', 'theorem'))
  const proofType = normProofType(ensureString(result.proofType, 'direct'))
  const strategy = ensureString(getVal(result, 'strategyOverview', 'strategy'))
  const outlineSteps = ensureArray<string>(getVal(result, 'outlineSteps', 'steps'))
  const commonPitfalls = ensureArray<string>(getVal(result, 'commonPitfalls', 'commonMistakes'))

  const steps = outlineSteps.map((stepText, idx) => ({
    step: idx + 1,
    statement: stepText,
    justification: 'Logical step in the proof outline',
  }))

  return {
    theorem,
    proofType,
    strategy,
    steps,
    hints: [],
    commonMistakes: commonPitfalls,
  }
}

export function mapScaffoldedPracticeResult(result: Record<string, unknown>): ScaffoldedPracticeUI {
  const topic = ensureString(result.topic)
  const problemsRaw = ensureArray<Record<string, unknown>>(result.problems)

  const grouped: Record<number, ScaffoldedPracticeUI['levels'][0]> = {}

  problemsRaw.forEach((p, idx) => {
    const levelKey = ensureString(p.level, 'medium').toLowerCase()
    const group = LEVEL_GROUPS[levelKey] ?? LEVEL_GROUPS.medium
    if (!grouped[group.level]) {
      grouped[group.level] = { level: group.level, name: group.name, problems: [] }
    }
    const solutionSteps = ensureArray<string>(p.solutionSteps)
    grouped[group.level].problems.push({
      id: idx + 1,
      question: ensureString(getVal(p, 'problem', 'question')),
      hints: [ensureString(p.hint)].filter(Boolean),
      solution: ensureString(p.answer),
      explanation: solutionSteps.length > 0 ? solutionSteps.join(' → ') : ensureString(p.answer),
    })
  })

  const levels = Object.values(grouped).sort((a, b) => a.level - b.level)

  return { topic, levels }
}

export function restoreVisualPayload(raw: Record<string, unknown>): VisualExplanationUI {
  if (isUiVisualPayload(raw)) return raw as unknown as VisualExplanationUI
  return mapVisualExplanationResult(raw)
}

export function restoreProofPayload(raw: Record<string, unknown>): ProofStrategyUI {
  if (isUiProofPayload(raw)) return raw as unknown as ProofStrategyUI
  return mapProofStrategyResult(raw)
}

export function restorePracticePayload(raw: Record<string, unknown>): ScaffoldedPracticeUI {
  if (isUiPracticePayload(raw)) return raw as unknown as ScaffoldedPracticeUI
  return mapScaffoldedPracticeResult(raw)
}
