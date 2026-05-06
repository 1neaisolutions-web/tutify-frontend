type AnyRecord = Record<string, any>

function asArray(value: any): any[] {
  return Array.isArray(value) ? value : []
}

function asText(value: any, fallback = ''): string {
  if (value === null || value === undefined) return fallback
  const s = String(value).trim()
  return s || fallback
}

function toDuration(value: any, fallback = ''): string {
  const s = asText(value, fallback)
  if (!s) return ''
  if (/\bmin\b/i.test(s)) return s
  if (/^\d+(\.\d+)?$/.test(s)) return `${s} min`
  return s
}

function toStringList(value: any): string[] {
  if (Array.isArray(value)) return value.map((v) => asText(v)).filter(Boolean)
  if (typeof value === 'string') return value.split(/\r?\n+/).map((s) => s.trim()).filter(Boolean)
  return []
}

export interface TutorialStepVM {
  id: number
  title: string
  duration: string
  content: {
    type: 'video' | 'text' | 'interactive' | 'example'
    data: AnyRecord
  }
  keyTakeaways: string[]
  reflection: string
}

export function parseTutorialStepsFromRegistry(item: any): TutorialStepVM[] {
  const blob = (item?.json_blob || {}) as AnyRecord
  const direct = asArray(blob.tutorial_steps)
  const structure = blob.structure || {}
  const steps = direct.length ? direct : asArray(structure.steps)
  if (!steps.length) return []

  return steps
    .map((raw: any, idx: number) => {
      const data = (raw?.content && typeof raw.content === 'object' ? raw.content.data : raw?.data) || {}
      const detectedType = asText(raw?.content?.type || raw?.type, '').toLowerCase()
      const type: 'video' | 'text' | 'interactive' | 'example' =
        detectedType === 'video'
          ? 'video'
          : detectedType === 'example'
          ? 'example'
          : detectedType === 'interactive'
          ? 'interactive'
          : 'text'

      return {
        id: Number(raw?.id) || idx + 1,
        title: asText(raw?.title || raw?.name, `Step ${idx + 1}`),
        duration: toDuration(raw?.duration || raw?.duration_min || raw?.estimated_duration_min, ''),
        content: {
          type,
          data: {
            videoUrl: asText(data?.videoUrl || data?.video_url || raw?.video_url, ''),
            description: asText(data?.description || raw?.summary, ''),
            keyPoints: toStringList(data?.keyPoints || data?.key_points),
            strategy: asText(data?.strategy, ''),
            examples: asArray(data?.examples),
            implementation: toStringList(data?.implementation),
            steps: toStringList(data?.steps),
            resources: toStringList(data?.resources),
            tools: toStringList(data?.tools),
            strategies: toStringList(data?.strategies),
            classroom: data?.classroom,
            challenge: asText(data?.challenge, ''),
            approach: asText(data?.approach, ''),
          },
        },
        keyTakeaways: toStringList(raw?.keyTakeaways || raw?.key_takeaways).slice(0, 6),
        reflection: asText(raw?.reflection || raw?.reflection_prompt, ''),
      }
    })
    .filter((s) => s.title)
}

export interface LearningPathVM {
  learningModules: any[]
  skillImpacts: any[]
  aiGuidance: {
    recommendation: string
    reason: string
    nextSteps: string[]
    personalizedTip: string
  }
}

export function parseLearningPathFromRegistry(item: any): LearningPathVM {
  const blob = (item?.json_blob || {}) as AnyRecord
  const modules = asArray(blob.learning_modules || blob.modules || blob.path_modules)
  const impacts = asArray(blob.skill_impacts || blob.impacts)
  const guidance = (blob.ai_guidance || blob.guidance || {}) as AnyRecord

  return {
    learningModules: modules.map((m: any) => ({
      id: asText(m?.id || m?.module_id || m?.slug),
      title: asText(m?.title, 'Module'),
      description: asText(m?.description || m?.summary, ''),
      duration: toDuration(m?.duration || m?.duration_min || m?.estimated_duration_min, ''),
      level: asText(m?.level, 'Beginner'),
      impact: asText(m?.impact, 'Medium'),
      skills: toStringList(m?.skills),
      learningOutcomes: toStringList(m?.learningOutcomes || m?.learning_outcomes),
      content: asArray(m?.content),
      assessment: {
        type: asText(m?.assessment?.type, ''),
        description: asText(m?.assessment?.description, ''),
        points: Number(m?.assessment?.points) || 0,
      },
      realWorldApplication: asText(m?.realWorldApplication || m?.real_world_application, ''),
      resources: asArray(m?.resources),
      completed: !!m?.completed,
      locked: !!m?.locked,
    })),
    skillImpacts: impacts.map((i: any) => ({
      skill: asText(i?.skill, ''),
      before: Number(i?.before) || 0,
      after: Number(i?.after) || 0,
      improvement: Number(i?.improvement) || 0,
      description: asText(i?.description, ''),
    })),
    aiGuidance: {
      recommendation: asText(guidance?.recommendation, ''),
      reason: asText(guidance?.reason, ''),
      nextSteps: toStringList(guidance?.nextSteps || guidance?.next_steps),
      personalizedTip: asText(guidance?.personalizedTip || guidance?.personalized_tip, ''),
    },
  }
}
