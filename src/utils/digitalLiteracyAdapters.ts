import type {
  DigitalCitizenshipStandard,
  OnlineSafetyGuideline,
  MediaLiteracyConcept,
  TechnologyIntegrationStrategy,
  DigitalCitizenshipLesson,
  DigitalSafetyPlan,
} from './digitalLiteracyUtils'
import { ensureArray, ensureRecord, ensureString, slugId } from './adapterHelpers'

export function mapDigitalCitizenshipLessonResult(
  result: Record<string, unknown>,
  gradeLevel: string
): DigitalCitizenshipLesson {
  const activitiesRaw = ensureArray<Record<string, unknown>>(result.activities)
  const assessmentObj = ensureRecord(result.assessment)
  const formative = ensureArray<string>(assessmentObj.formative)
  const summative = ensureString(assessmentObj.summative)
  return {
    title: ensureString(result.lessonTopic, 'Digital citizenship lesson'),
    gradeLevel,
    duration: ensureString(result.duration),
    learningObjectives: ensureArray(result.objectives),
    activities: activitiesRaw.map((a) => ({
      activity: ensureString(a.title, 'Activity'),
      description: ensureArray<string>(a.steps).join('\n') || '—',
      duration: ensureString(a.time, ensureString(result.duration)),
    })),
    assessment: summative ? [...formative, summative] : formative,
    resources: [],
    standardsAlignment: ensureArray(result.standardsConnections),
  }
}

export function mapDigitalStandardsToCitizenshipList(
  result: Record<string, unknown>,
  gradeLevel: string
): DigitalCitizenshipStandard[] {
  const byFw = ensureRecord(result.standardsByFramework)
  const frameworks = ensureArray<string>(result.frameworks)
  const out: DigitalCitizenshipStandard[] = []
  for (const fw of frameworks.length ? frameworks : Object.keys(byFw)) {
    const items = ensureArray<string>(byFw[fw])
    items.forEach((text, i) => {
      out.push({
        id: slugId(`${fw}-${i}`),
        name: `${fw} — ${text.slice(0, 80)}`,
        organization: fw,
        region: 'Global',
        description: text,
        keyComponents: ensureArray<string>(result.classroomLookFors).slice(0, 6),
        gradeLevels: [gradeLevel],
        competencies: [
          {
            competency: 'Alignment',
            description: text,
            indicators: ensureArray<string>(result.alignmentTips).slice(0, 4),
          },
        ],
      })
    })
  }
  return out
}

export function mapOnlineSafetyToGuidelines(
  result: Record<string, unknown>,
  gradeLevel: string
): OnlineSafetyGuideline[] {
  const scenarios = ensureArray<Record<string, unknown>>(result.scenarios)
  const base: OnlineSafetyGuideline = {
    id: slugId(ensureString(result.safetyTopic, 'safety')),
    topic: ensureString(result.safetyTopic, 'Online safety'),
    description: ensureArray<string>(result.keyPoints).join(' ') || 'Safety overview',
    risks: ensureArray(result.warningSigns),
    preventionStrategies: [...ensureArray<string>(result.keyPoints), ...ensureArray<string>(result.familyTips)],
    responseActions: ensureArray(result.responseSteps),
    resources: ensureArray(result.classroomActivities),
    ageAppropriate: [gradeLevel],
  }
  if (!scenarios.length) return [base]
  return scenarios.map((s, i) => ({
    id: slugId(ensureString(s.scenario, `scenario-${i}`)),
    topic: ensureString(s.scenario, base.topic),
    description: ensureString(s.safeResponse, base.description),
    risks: ensureArray(s.discussionQuestions),
    preventionStrategies: ensureArray<string>(result.keyPoints),
    responseActions: ensureArray(result.responseSteps),
    resources: ensureArray(result.classroomActivities),
    ageAppropriate: [gradeLevel],
  }))
}

export function mapOnlineSafetyToPlan(
  result: Record<string, unknown>,
  safetyTopic: string,
  gradeLevel: string
): DigitalSafetyPlan {
  return {
    topic: safetyTopic,
    gradeLevel,
    preventionStrategies: [...ensureArray<string>(result.keyPoints), ...ensureArray<string>(result.familyTips)],
    detectionMethods: ensureArray(result.warningSigns),
    responseProtocol: ensureArray(result.responseSteps),
    resources: ensureArray(result.classroomActivities),
    parentCommunication: ensureArray(result.familyTips),
  }
}

export function mapMediaLiteracyResult(
  result: Record<string, unknown>,
  _gradeLevel: string
): MediaLiteracyConcept[] {
  const activities = ensureArray<Record<string, unknown>>(result.activities)
  const mini = ensureRecord(result.miniLesson)
  const id = slugId('media-literacy-pack')
  return [
    {
      id,
      concept: 'Media literacy (session)',
      description: [ensureString(mini.overview), ...ensureArray<string>(mini.steps)].filter(Boolean).join('\n'),
      keySkills: ensureArray(result.bigIdeas),
      activities: activities.length
        ? activities.map((a) => `${ensureString(a.title)}: ${ensureArray<string>(a.steps).join('; ')}`)
        : ensureArray<string>(result.keyQuestions),
      assessmentCriteria: ensureArray(result.assessment),
      realWorldExamples: ensureArray(result.extensions),
    },
  ]
}

export function mapTechIntegrationResult(
  result: Record<string, unknown>,
  gradeLevel: string
): TechnologyIntegrationStrategy[] {
  const strategies = ensureArray<string>(result.strategies)
  const tools = ensureArray<Record<string, unknown>>(result.tools)
  const lessonIdeas = ensureArray<Record<string, unknown>>(result.lessonIdeas)
  const impl = ensureArray<string>(result.implementationPlan)
  return strategies.map((str, i) => ({
    id: slugId(`strategy-${i}`),
    strategy: str,
    description: ensureArray<string>(result.principles).join('; ') || str,
    tools: tools.length ? tools.map((t) => ensureString(t.tool)) : ['Various'],
    implementationSteps: impl.length ? impl : lessonIdeas.map((l) => ensureString(l.title)),
    benefits: lessonIdeas.map((l) => ensureString(l.description)),
    challenges: ensureArray(result.pitfalls),
    bestPractices: ensureArray<string>(result.principles),
    gradeLevels: [gradeLevel],
  }))
}
