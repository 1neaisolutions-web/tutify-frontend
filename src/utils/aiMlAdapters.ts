import type {
  AIConcept,
  EthicalAIPrinciple,
  MLProject,
  AIStandard,
  AIEthicsFramework,
} from './aiMlUtils'
import { ensureArray, ensureString, slugId } from './adapterHelpers'

export function mapAiConceptsResult(result: Record<string, unknown>, gradeLevel: string): AIConcept[] {
  const concepts = ensureArray<Record<string, unknown>>(result.concepts)
  const activities = ensureArray<Record<string, unknown>>(result.activities)
  const activityLines = activities.map(
    (a) => `${ensureString(a.title)}: ${ensureArray<string>(a.steps).join('; ')}`
  )
  return concepts.map((c, i) => ({
    id: slugId(ensureString(c.title, `concept-${i}`)),
    concept: ensureString(c.title, 'AI concept'),
    description: ensureArray<string>(c.keyPoints).join(' ') || ensureString(c.title),
    gradeLevel,
    keyPoints: ensureArray(c.keyPoints),
    examples: ensureArray(result.examples),
    activities: activityLines.length ? activityLines : ['Discuss checks for understanding'],
    misconceptions: ensureArray(c.misconceptions),
    realWorldApplications: ensureArray(result.checksForUnderstanding),
  }))
}

export function mapEthicalAiToPrinciples(result: Record<string, unknown>): EthicalAIPrinciple[] {
  const themes = ensureArray<string>(result.themes)
  const scenarios = ensureArray<Record<string, unknown>>(result.scenarios)
  const dq = ensureArray<string>(result.discussionQuestions)
  const norms = ensureArray<string>(result.classroomNorms)
  const actions = ensureArray<string>(result.actionSteps)
  if (!themes.length && scenarios.length) {
    return scenarios.map((s, i) => ({
      id: slugId(`scenario-${i}`),
      principle: ensureString(s.scenario, `Scenario ${i + 1}`),
      description: ensureString(s.stakes),
      importance: ensureArray<string>(s.considerations).join('; ') || 'Classroom discussion',
      examples: ensureArray(s.considerations),
      discussionQuestions: dq,
      caseStudies: [ensureString(s.scenario)],
      resources: [],
      standardsAlignment: norms,
    }))
  }
  return themes.map((t, i) => ({
    id: slugId(`theme-${i}`),
    principle: t,
    description: actions[0] || 'Explore through guided discussion.',
    importance: 'Core ethical theme for responsible AI literacy.',
    examples: scenarios.length
      ? ensureArray<string>((scenarios[0] as Record<string, unknown>).considerations)
      : dq.slice(0, 3),
    discussionQuestions: dq,
    caseStudies: scenarios.map((s) => ensureString(s.scenario)),
    resources: [],
    standardsAlignment: norms.length ? norms : actions,
  }))
}

export function mapEthicalAiToFrameworks(result: Record<string, unknown>): AIEthicsFramework[] {
  const scenarios = ensureArray<Record<string, unknown>>(result.scenarios)
  const themes = ensureArray<string>(result.themes)
  if (scenarios.length) {
    return scenarios.map((s, i) => ({
      id: slugId(`fw-${i}`),
      name: ensureString(s.scenario, `Framework ${i + 1}`),
      organization: 'Case-based ethics',
      description: ensureString(s.stakes),
      principles: ensureArray<string>(s.considerations).map((p) => ({
        principle: p,
        description: '',
        examples: [],
      })),
      applications: ensureArray<string>(result.actionSteps),
    }))
  }
  return themes.map((t, i) => ({
    id: slugId(`fw-theme-${i}`),
    name: t,
    organization: 'Thematic lens',
    description: ensureArray<string>(result.discussionQuestions).join(' ') || t,
    principles: [
      {
        principle: t,
        description: '',
        examples: ensureArray<string>(result.classroomNorms).slice(0, 3),
      },
    ],
    applications: ensureArray(result.actionSteps),
  }))
}

export function mapMlProjectsResult(result: Record<string, unknown>, gradeLevel: string): MLProject[] {
  const projects = ensureArray<Record<string, unknown>>(result.projects)
  const diffRaw = ensureString(result.difficulty, 'Beginner')
  const difficulty =
    diffRaw.toLowerCase().includes('adv')
      ? 'Advanced'
      : diffRaw.toLowerCase().includes('inter')
        ? 'Intermediate'
        : 'Beginner'
  return projects.map((p, i) => {
    const stepsRaw = ensureArray<unknown>(p.steps)
    const steps = stepsRaw.map((st, j) => ({
      step: `Step ${j + 1}`,
      description: typeof st === 'string' ? st : ensureString(st),
      duration: '—',
    }))
    return {
      id: slugId(ensureString(p.title, `ml-${i}`)),
      title: ensureString(p.title, `Project ${i + 1}`),
      description: ensureString(p.goal),
      difficulty: difficulty as MLProject['difficulty'],
      gradeLevel,
      duration: 'Flexible',
      learningObjectives: [ensureString(p.goal)],
      tools: ensureArray(p.tools),
      datasets: ensureArray(p.datasetIdeas),
      steps: steps.length ? steps : [{ step: 'Overview', description: ensureString(p.goal), duration: '—' }],
      assessment: ensureArray(p.evaluation),
      extensions: ensureArray(result.extensions),
      realWorldConnection: ensureArray<string>(result.safetyAndEthics).join('; ') || '—',
    }
  })
}

export function mapAiStandardsResult(result: Record<string, unknown>, gradeLevel: string): AIStandard[] {
  const stds = ensureArray<Record<string, unknown>>(result.standards)
  return stds.map((s, i) => ({
    id: slugId(`${ensureString(s.framework)}-${i}`),
    name: `${ensureString(s.framework)} alignment pack`,
    organization: ensureString(s.framework),
    region: 'Global',
    description: ensureArray<string>(result.alignmentNotes).join('\n') || 'Standards overview',
    keyComponents: ensureArray(s.items),
    gradeLevels: [gradeLevel],
    competencies: ensureArray<string>(s.items).map((item) => ({
      competency: item,
      description: item,
      indicators: ensureArray<string>(result.suggestedEvidence).slice(0, 3),
    })),
  }))
}
