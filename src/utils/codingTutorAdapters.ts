import type {
  CompetitionProblem,
  AlgorithmExplanation,
  DebuggingStrategy,
  ProjectMilestone,
  ComputationalThinkingFramework,
  CompetitionRoadmap,
  StandardsAlignment,
} from './codingUtils'
import { ensureArray, ensureRecord, ensureString, slugId } from './adapterHelpers'

export function mapCompetitionAnalyzerToProblem(
  result: Record<string, unknown>,
  competition: string,
  problemText: string
): CompetitionProblem {
  const complexity = ensureRecord(result.complexity)
  const timeC = ensureString(complexity.time, 'See summary')
  const spaceC = ensureString(complexity.space, 'See summary')
  const titleLine = problemText.split('\n').find((l) => l.trim()) || 'Competition problem analysis'
  return {
    id: slugId(titleLine.slice(0, 40)),
    title: titleLine.slice(0, 120),
    competition,
    difficulty: 'intermediate',
    category: 'Analysis',
    description: ensureString(result.summary, problemText.slice(0, 500)),
    constraints: ensureArray(result.edgeCases),
    inputFormat: 'As stated in the problem description',
    outputFormat: 'As stated in the problem description',
    sampleInput: ['—'],
    sampleOutput: ['—'],
    solutionApproach: ensureArray(result.approach),
    algorithms: ensureArray(result.keyAlgorithms),
    dataStructures: [],
    timeComplexity: timeC,
    spaceComplexity: spaceC,
    relatedProblems: ensureArray(result.practicePlan),
  }
}

export function mapAlgorithmTutorResult(
  result: Record<string, unknown>,
  programmingLanguage: string
): AlgorithmExplanation {
  const worked = ensureRecord(result.workedExample)
  const steps = ensureArray<string>(worked.steps)
  const codeBlock = [
    ...ensureArray<string>(result.implementationTips),
    '',
    worked.input ? `Example input: ${worked.input}` : '',
    worked.output ? `Example output: ${worked.output}` : '',
    steps.length ? `Steps:\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  return {
    name: ensureString(result.algorithm, 'Algorithm'),
    category: 'Algorithms',
    description: ensureArray<string>(result.intuition).join('\n') || ensureString(result.algorithm),
    timeComplexity: 'See tips / problem context',
    spaceComplexity: 'See tips / problem context',
    useCases: ensureArray(result.whenToUse),
    pseudocode: steps.join('\n'),
    codeExample: [{ language: programmingLanguage, code: codeBlock || '// See implementation tips above' }],
    visualization: [],
    commonMistakes: ensureArray(result.pitfalls),
    optimizationTips: ensureArray(result.implementationTips),
  }
}

export function mapDebuggingAssistantResult(result: Record<string, unknown>): DebuggingStrategy {
  const fixes = ensureArray<Record<string, unknown>>(result.fixes)
  const exampleFix =
    fixes.length > 0
      ? fixes.map((f) => `${ensureString(f.issue)} → ${ensureString(f.fix)}`).join('\n')
      : ensureString(result.errorType)
  return {
    errorType: ensureString(result.errorType, 'Error'),
    symptoms: [],
    commonCauses: ensureArray(result.likelyCauses),
    stepByStepApproach: ensureArray(result.debuggingSteps),
    tools: fixes.map((f) => ensureString(f.issue)).filter(Boolean),
    preventionTips: ensureArray(result.preventionTips),
    exampleFix,
  }
}

export function mapProjectPlannerToMilestones(result: Record<string, unknown>): ProjectMilestone[] {
  const milestones = ensureArray<Record<string, unknown>>(result.milestones)
  return milestones.map((m, idx) => ({
    milestone: idx + 1,
    title: ensureString(m.week, `Phase ${idx + 1}`),
    description: ensureArray<string>(m.goals).join('; ') || ensureString(result.overview),
    deliverables: ensureArray(m.deliverables),
    estimatedTime: ensureString(result.duration, '—'),
    skills: [],
    resources: ensureArray(result.resources),
  }))
}

export function mapComputationalThinkingResult(result: Record<string, unknown>): ComputationalThinkingFramework {
  const warmUp = ensureRecord(result.warmUp)
  const activities = ensureArray<Record<string, unknown>>(result.activities)
  const diff = ensureRecord(result.differentiation)
  const actTitles = activities.map((a) => ensureString(a.title))
  const actSteps = activities.flatMap((a) => ensureArray<string>(a.steps))
  const reflection = ensureArray<string>(result.reflection)

  return {
    decomposition: {
      steps: ensureArray<string>(result.focusSkills),
      examples: [ensureString(warmUp.prompt), ensureString(warmUp.time)].filter(Boolean),
    },
    patternRecognition: {
      patterns: actTitles.length ? actTitles : ['Activity focus'],
      exercises: actSteps.length ? actSteps : reflection,
    },
    abstraction: {
      concepts: ensureArray<string>(diff.support),
      applications: ensureArray<string>(diff.challenge),
    },
    algorithmDesign: {
      principles: reflection.length ? reflection : ['Reflect on process', 'Iterate'],
      strategies: actSteps.length ? actSteps.slice(0, 8) : ensureArray<string>(result.focusSkills),
    },
  }
}

export function mapCompetitionRoadmapResult(
  result: Record<string, unknown>,
  competition: string,
  targetLevelUi: string
): CompetitionRoadmap {
  const weekly = ensureArray<Record<string, unknown>>(result.weeklyPlan)
  const resources = ensureArray<string>(result.recommendedResources)
  return {
    competition,
    level: ensureString(result.targetLevel, targetLevelUi),
    currentSkills: [ensureString(result.currentLevel)],
    targetSkills: [ensureString(result.targetLevel)],
    learningPath: weekly.map((w, idx) => ({
      phase: `Week ${typeof w.week === 'number' ? w.week : idx + 1}`,
      duration: '1 week',
      topics: ensureArray(w.focus),
      resources: resources.length ? resources : ['See recommended resources'],
      practiceProblems: ensureArray(w.practice),
      milestones: ensureArray<string>(result.milestones).slice(0, 3),
    })),
    skillGaps: [],
    recommendedSchedule: weekly.map((w, idx) => ({
      week: typeof w.week === 'number' ? w.week : idx + 1,
      focus: ensureArray<string>(w.focus).join(', ') || 'Practice',
      hours: 5,
      activities: ensureArray(w.practice),
    })),
  }
}

export function mapCodingStandardsAlignmentResult(
  result: Record<string, unknown>,
  frameworkParam: string,
  gradeLevel: string
): StandardsAlignment {
  const aligned = ensureArray<Record<string, unknown>>(result.alignedStandards)
  const strong = aligned.filter((a) => ensureString(a.coverage) === 'strong').length
  const partial = aligned.filter((a) => ensureString(a.coverage) === 'partial').length
  const scoreBase = aligned.length ? Math.round(((strong * 100 + partial * 60) / aligned.length + 50) / 2) : 72
  const evidenceRows = ensureArray<unknown>(result.evidence)
  const evidenceStrings = evidenceRows.map((e) => {
    if (e && typeof e === 'object' && !Array.isArray(e)) {
      const ex = e as Record<string, unknown>
      return [ensureString(ex.excerpt), ensureString(ex.mappedTo)].filter(Boolean).join(' → ')
    }
    return String(e)
  })
  const competencies = aligned.map((a) => ({
    competency: ensureString(a.code, 'Standard'),
    description: ensureString(a.description),
    evidence: [ensureString(a.coverage), ensureString(result.coverageSummary)].filter(Boolean),
    assessment: ensureArray<string>(result.recommendations).slice(0, 4),
  }))
  return {
    standard: ensureString(result.framework, frameworkParam),
    framework: ensureString(result.framework, frameworkParam),
    gradeLevel,
    competencies: competencies.length
      ? competencies
      : [
          {
            competency: 'Coverage summary',
            description: ensureString(result.coverageSummary),
            evidence: evidenceStrings.length ? evidenceStrings : ['See API response'],
            assessment: ensureArray(result.recommendations),
          },
        ],
    alignmentScore: Math.min(100, Math.max(40, scoreBase)),
  }
}
