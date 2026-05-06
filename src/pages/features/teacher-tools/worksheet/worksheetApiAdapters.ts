import type {
  WorksheetApiItem,
  WorksheetBlockApi,
  WorksheetBlockCreatePayload,
  WorksheetBlockPatchPayload,
  WorksheetCreatePayload,
  WorksheetPatchPayload,
  WorksheetSessionApi,
  WorksheetStatus,
} from '../../../../api/worksheetApi'
import type { DemoWorksheet } from '../demo/teacherToolsDemoData'
import type { HandoutLayoutOpts } from '../quiz/config/handoutLayoutConfig'
import type { WorksheetBlock } from '../demo/topicAwareGenerators'

export type LocalWorksheetBlock = WorksheetBlock & { _id: string }

export type LocalWorksheetSession = { id: string; title: string; blocks: LocalWorksheetBlock[] }

export function apiBlockToLocal(b: WorksheetBlockApi): WorksheetBlock {
  if (b.type === 'mcq') {
    return {
      type: 'mcq',
      prompt: b.prompt ?? '',
      options: b.options ?? [],
      answer: b.answer ?? '',
    }
  }
  if (b.type === 'fill_blank') {
    return {
      type: 'fill_blank',
      prompt: b.prompt ?? '',
      answer: b.answer ?? '',
    }
  }
  if (b.type === 'short') {
    return {
      type: 'short',
      prompt: b.prompt ?? '',
      sampleAnswer: b.sampleAnswer ?? '',
      responseLines: b.responseLines ?? 4,
    }
  }
  return {
    type: 'match',
    left: b.left ?? [],
    right: b.right ?? [],
  }
}

export function apiSessionsToLocal(sessions: WorksheetSessionApi[]): LocalWorksheetSession[] {
  return sessions.map((s) => ({
    id: s.id,
    title: s.title,
    blocks: (s.blocks ?? []).map((b) => ({ ...apiBlockToLocal(b), _id: b.id })),
  }))
}

export function localBlockToCreatePayload(b: WorksheetBlock): WorksheetBlockCreatePayload {
  if (b.type === 'mcq') {
    return { type: 'mcq', prompt: b.prompt, points: 1, options: b.options, answer: b.answer }
  }
  if (b.type === 'fill_blank') {
    return { type: 'fill_blank', prompt: b.prompt, points: 1, answer: b.answer }
  }
  if (b.type === 'short') {
    return {
      type: 'short',
      prompt: b.prompt,
      points: 2,
      sampleAnswer: b.sampleAnswer,
      responseLines: b.responseLines,
    }
  }
  return { type: 'match', points: 1, left: b.left, right: b.right }
}

/** Maps API worksheet to demo row shape (Teacher Tools overview / legacy context). */
export function adaptDemoWorksheetToCreatePayload(w: DemoWorksheet): WorksheetCreatePayload {
  const status: WorksheetStatus =
    w.status === 'draft' || w.status === 'published' || w.status === 'archived' ? w.status : 'draft'
  return {
    title: w.title?.trim() || 'Untitled worksheet',
    subject: w.subject,
    grade: w.grade,
    outputFormat: w.format,
    classes: Array.isArray(w.classes) ? w.classes : [],
    status,
    sourceBookIds: [],
    scopeTopics: w.topic ? [w.topic] : [],
    generateWithoutSources: !w.topic?.trim(),
    handoutLayout: (w.handoutLayout ?? null) as Record<string, unknown> | null,
  }
}

export function adaptDemoWorksheetPatchToApiPatch(patch: Partial<DemoWorksheet>): WorksheetPatchPayload {
  const out: WorksheetPatchPayload = {}
  if (patch.title !== undefined) out.title = patch.title
  if (patch.subject !== undefined) out.subject = patch.subject
  if (patch.grade !== undefined) out.grade = patch.grade
  if (patch.format !== undefined) out.outputFormat = patch.format
  if (patch.classes !== undefined) out.classes = patch.classes
  if (patch.status !== undefined) {
    if (patch.status === 'draft' || patch.status === 'published' || patch.status === 'archived') {
      out.status = patch.status
    }
  }
  if (patch.handoutLayout !== undefined) out.handoutLayout = patch.handoutLayout as Record<string, unknown>
  if (patch.topic !== undefined) out.scopeTopics = patch.topic.trim() ? [patch.topic.trim()] : []
  return out
}

export function worksheetApiItemToDemoWorksheet(w: WorksheetApiItem): DemoWorksheet {
  const created =
    typeof w.createdAt === 'string' ? w.createdAt.slice(0, 10) : String(w.createdAt ?? '').slice(0, 10)
  return {
    id: w.id,
    title: w.title,
    topic: w.topic,
    subject: w.subject,
    grade: w.grade,
    format: w.outputFormat,
    status: w.status,
    classes: w.classes,
    createdAt: created,
    usageCount: w.submissionCount,
    sourceSummary: w.sourceSummary ?? undefined,
    sessions: (w.sessions ?? []).map((s) => ({
      id: s.id,
      title: s.title,
      blocks: (s.blocks ?? []).map(apiBlockToLocal),
    })),
    handoutLayout: (w.handoutLayout ?? undefined) as HandoutLayoutOpts | undefined,
  }
}

export function localBlockToPatchPayload(b: WorksheetBlock): WorksheetBlockPatchPayload {
  if (b.type === 'mcq') {
    return { prompt: b.prompt, points: 1, options: b.options, answer: b.answer }
  }
  if (b.type === 'fill_blank') {
    return { prompt: b.prompt, points: 1, answer: b.answer }
  }
  if (b.type === 'short') {
    return { prompt: b.prompt, points: 2, sampleAnswer: b.sampleAnswer, responseLines: b.responseLines }
  }
  return { points: 1, left: b.left, right: b.right }
}
