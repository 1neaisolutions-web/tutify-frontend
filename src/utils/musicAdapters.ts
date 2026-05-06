import type {
  MusicTheoryConcept,
  CompositionGuide,
  PerformanceTechnique,
  EnsembleGuide,
  PedagogicalMethod,
  MusicGame,
  MusicStandard,
} from './musicUtils'
import { ensureArray, ensureString, slugId } from './adapterHelpers'

const THEORY_CATS: MusicTheoryConcept['category'][] = ['notes', 'rhythm', 'scales', 'chords', 'intervals', 'form']

function mapTheoryCategory(raw: string): MusicTheoryConcept['category'] {
  const x = raw.toLowerCase()
  for (const c of THEORY_CATS) {
    if (x.includes(c)) return c
  }
  return 'scales'
}

export function mapMusicTheoryResult(result: Record<string, unknown>): MusicTheoryConcept {
  return {
    id: slugId(ensureString(result.name)),
    name: ensureString(result.name),
    category: mapTheoryCategory(ensureString(result.category)),
    description: ensureString(result.description),
    fundamentals: ensureArray(result.fundamentals),
    examples: ensureArray(result.examples),
    exercises: ensureArray(result.exercises),
    visualAids: [],
    commonMistakes: ensureArray(result.commonMistakes),
    tips: ensureArray(result.tips),
  }
}

export function mapMusicCompositionResult(
  result: Record<string, unknown>,
  style: string,
  gradeLevel: string
): CompositionGuide {
  const elements = ensureArray<Record<string, unknown>>(result.elements)
  return {
    id: slugId(ensureString(result.title)),
    title: ensureString(result.title),
    style,
    gradeLevel,
    elements: elements.map((e) => ({
      element: ensureString(e.element),
      description: ensureString(e.description),
      techniques: ensureArray(e.techniques),
    })),
    structure: ensureArray(result.structure),
    examples: [],
    exercises: ensureArray(result.exercises),
  }
}

const PERF_CATS: PerformanceTechnique['category'][] = [
  'posture',
  'breathing',
  'articulation',
  'expression',
  'practice',
]

function mapPerfCategory(raw: string): PerformanceTechnique['category'] {
  const x = raw.toLowerCase()
  for (const c of PERF_CATS) {
    if (x.includes(c)) return c
  }
  return 'practice'
}

export function mapPerformanceTechniqueResult(
  result: Record<string, unknown>,
  techniqueParam: string
): PerformanceTechnique {
  return {
    id: slugId(ensureString(result.name, techniqueParam)),
    name: ensureString(result.name, techniqueParam),
    instrument: ensureString(result.instrument),
    category: mapPerfCategory(ensureString(result.category, techniqueParam)),
    description: ensureString(result.description),
    steps: ensureArray(result.steps),
    exercises: ensureArray(result.exercises),
    commonIssues: ensureArray(result.commonIssues),
    solutions: ensureArray(result.solutions),
    tips: ensureArray(result.tips),
  }
}

export function mapEnsembleResult(result: Record<string, unknown>): EnsembleGuide {
  const roles = ensureArray<Record<string, unknown>>(result.roles)
  return {
    type: ensureString(result.type),
    description: ensureString(result.description),
    instrumentation: ensureArray(result.instrumentation),
    roles: roles.map((r) => ({
      role: ensureString(r.role),
      responsibilities: ensureArray(r.responsibilities),
    })),
    rehearsalTechniques: ensureArray(result.rehearsalTechniques),
    performanceTips: ensureArray(result.performanceTips),
    commonChallenges: ensureArray(result.commonChallenges),
    solutions: ensureArray(result.solutions),
  }
}

export function mapMusicPedagogyList(result: Record<string, unknown>): PedagogicalMethod[] {
  const methods = ensureArray<Record<string, unknown>>(result.methods)
  return methods.map((m) => ({
    id: ensureString(m.id, slugId(ensureString(m.name))),
    name: ensureString(m.name),
    founder: ensureString(m.founder),
    description: ensureString(m.description),
    keyPrinciples: ensureArray(m.keyPrinciples),
    teachingStrategies: ensureArray(m.teachingStrategies),
    activities: ensureArray(m.activities),
    benefits: ensureArray(m.benefits),
    applications: ensureArray(m.applications),
  }))
}

export function mapMusicGamesList(result: Record<string, unknown>): MusicGame[] {
  const games = ensureArray<Record<string, unknown>>(result.games)
  return games.map((g, i) => ({
    id: slugId(ensureString(g.name, `game-${i}`)),
    name: ensureString(g.name),
    category: (ensureString(g.category, 'theory').toLowerCase().includes('rhythm')
      ? 'rhythm'
      : ensureString(g.category, 'theory').toLowerCase().includes('ear')
        ? 'ear-training'
        : ensureString(g.category, 'theory').toLowerCase().includes('composition')
          ? 'composition'
          : 'theory') as MusicGame['category'],
    description: ensureString(g.description),
    objectives: ensureArray(g.objectives),
    rules: ['Follow facilitator instructions', ...ensureArray(g.objectives)],
    difficulty: (ensureString(g.difficulty, 'beginner') as MusicGame['difficulty']) || 'beginner',
    duration: ensureString(g.duration),
  }))
}

export function mapMusicStandardsList(result: Record<string, unknown>, gradeLevel: string): MusicStandard[] {
  const standards = ensureArray<Record<string, unknown>>(result.standards)
  return standards.map((s) => ({
    id: ensureString(s.id, slugId(ensureString(s.name))),
    name: ensureString(s.name),
    organization: ensureString(s.organization),
    region: ensureString(s.region),
    description: ensureString(s.description),
    keyComponents: ensureArray(s.keyComponents),
    gradeLevels: [gradeLevel],
    assessmentCriteria: ensureArray(s.assessmentCriteria),
  }))
}
