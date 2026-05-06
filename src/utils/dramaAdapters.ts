import type {
  ScriptAnalysis,
  CharacterProfile,
  StageDirection,
  ProductionPlan,
  ActingMethod,
  TheaterStyle,
  TheaterStandard,
} from './dramaUtils'
import { ensureArray, ensureRecord, ensureString, slugId } from './adapterHelpers'

export function mapScriptAnalysisResult(result: Record<string, unknown>): ScriptAnalysis {
  const structure = ensureRecord(result.structure)
  const plot = ensureRecord(structure.plotStructure)
  const chars = ensureArray<Record<string, unknown>>(result.characters)
  return {
    title: ensureString(result.title),
    playwright: ensureString(result.playwright),
    period: ensureString(result.period),
    genre: ensureString(result.genre),
    structure: {
      acts: 0,
      scenes: 0,
      plotStructure: {
        exposition: ensureString(plot.exposition),
        risingAction: ensureString(plot.risingAction),
        climax: ensureString(plot.climax),
        fallingAction: ensureString(plot.fallingAction),
        resolution: ensureString(plot.resolution),
      },
    },
    characters: chars.map((c) => ({
      name: ensureString(c.name),
      role: ensureString(c.role),
      relationships: [],
      objectives: ensureArray(c.objectives),
      arc: '',
    })),
    themes: ensureArray(result.themes),
    symbols: [],
    style: ensureString(result.genre),
    culturalContext: ensureString(result.culturalContext),
  }
}

export function mapCharacterProfileResult(result: Record<string, unknown>): CharacterProfile {
  return {
    name: ensureString(result.name),
    age: '—',
    physicalTraits: ensureArray(result.physicalTraits),
    psychologicalTraits: ensureArray(result.psychologicalTraits),
    background: ensureString(result.background),
    objectives: ensureArray(result.objectives),
    obstacles: ensureArray(result.obstacles),
    tactics: ensureArray(result.tactics),
    relationships: [],
    arc: ensureString(result.arc),
    keyQuotes: [],
  }
}

export function mapStageDirectionResult(result: Record<string, unknown>): StageDirection {
  const blocking = ensureArray<Record<string, unknown>>(result.blocking)
  const tech = ensureRecord(result.technicalNotes)
  return {
    scene: ensureString(result.scene),
    stageType: ensureString(result.stageType),
    blocking: blocking.map((b) => ({
      character: ensureString(b.character),
      position: ensureString(b.position),
      movement: ensureString(b.movement),
      focus: ensureString(b.focus),
    })),
    stagePicture: ensureString(result.stagePicture),
    technicalNotes: {
      lighting: ensureArray(tech.lighting),
      sound: ensureArray(tech.sound),
      props: ensureArray(tech.props),
      costume: ensureArray(tech.costume),
    },
    objectives: [],
  }
}

export function mapProductionPlanResult(result: Record<string, unknown>): ProductionPlan {
  const timeline = ensureArray<Record<string, unknown>>(result.timeline)
  const budget = ensureArray<Record<string, unknown>>(result.budget)
  const team = ensureArray<Record<string, unknown>>(result.team)
  return {
    title: ensureString(result.title),
    timeline: timeline.map((t) => ({
      phase: ensureString(t.phase),
      startDate: ensureString(t.startDate),
      endDate: ensureString(t.endDate),
      tasks: ensureArray(t.tasks),
    })),
    budget: budget.map((b) => ({
      category: ensureString(b.category),
      amount: ensureString(b.amount),
      notes: ensureString(b.notes),
    })),
    team: team.map((m) => ({
      role: ensureString(m.role),
      responsibilities: ensureArray(m.responsibilities),
      requirements: [],
    })),
    rehearsalSchedule: [],
    performanceSchedule: [],
  }
}

export function mapActingMethodsList(result: Record<string, unknown>): ActingMethod[] {
  const methods = ensureArray<Record<string, unknown>>(result.methods)
  return methods.map((m) => ({
    id: ensureString(m.id, slugId(ensureString(m.name))),
    name: ensureString(m.name),
    founder: ensureString(m.founder),
    description: ensureString(m.description),
    keyPrinciples: ensureArray(m.keyPrinciples),
    techniques: ensureArray(m.techniques),
    exercises: ensureArray(m.exercises),
    applications: [],
    benefits: ensureArray(m.benefits),
  }))
}

export function mapTheaterStylesList(result: Record<string, unknown>): TheaterStyle[] {
  const styles = ensureArray<Record<string, unknown>>(result.styles)
  return styles.map((s) => ({
    id: ensureString(s.id, slugId(ensureString(s.name))),
    name: ensureString(s.name),
    origin: ensureString(s.origin),
    description: ensureString(s.description),
    characteristics: ensureArray(s.characteristics),
    keyPractitioners: ensureArray(s.keyPractitioners),
    examples: ensureArray(s.examples),
    teachingApproach: [],
  }))
}

export function mapTheaterStandardsList(result: Record<string, unknown>, gradeLevel: string): TheaterStandard[] {
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
