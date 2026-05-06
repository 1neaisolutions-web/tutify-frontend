import type { DemoBook, MaterialSourceKind } from './demoContentLibrary'
import { getBookById, getChapters } from './demoContentLibrary'
import { newDemoId } from './newDemoId'
import type { WorksheetBlock } from './topicAwareGenerators'
import { getTopicBlueprint } from './topicAwareGenerators'

export interface GenerationSourceContext {
  subject: string
  grade: string
  topic: string
  materialMode: MaterialSourceKind
  groundingEnabled: boolean
  /** Legacy single-book reference (worksheets / older flows). */
  book?: DemoBook
  /** Multi-source quiz RAG selection (preferred when present). */
  books?: DemoBook[]
  chapterTitles: string[]
  /** Topics explicitly chosen from catalog strands for quiz scope. */
  scopeTopics?: string[]
  scopeRefinement?: string
  uploadedMaterialTitle?: string
  allBooks: DemoBook[]
}

export function djb2(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i += 1) h = (h << 5) + h + s.charCodeAt(i)
  return Math.abs(h)
}

export function buildGenerationContext(input: {
  subject: string
  grade: string
  topic: string
  topicRefinement: string
  materialMode: MaterialSourceKind
  groundingEnabled: boolean
  selectedBookId: string
  chapterIds: string[]
  uploadedMaterialTitle?: string
  allBooks: DemoBook[]
}): GenerationSourceContext {
  const topic = [input.topic, input.topicRefinement].filter(Boolean).join(' — ')
  const book =
    input.materialMode === 'system' && input.selectedBookId
      ? getBookById(input.selectedBookId, input.allBooks)
      : undefined
  const chapters = book ? getChapters(book.id, input.allBooks).filter((c) => input.chapterIds.includes(c.id)) : []
  const chapterTitles = chapters.map((c) => c.title)
  return {
    subject: input.subject,
    grade: input.grade,
    topic: topic || 'General',
    materialMode: input.materialMode,
    groundingEnabled: input.groundingEnabled,
    book: input.groundingEnabled ? book : undefined,
    chapterTitles: input.groundingEnabled ? chapterTitles : [],
    uploadedMaterialTitle: input.groundingEnabled ? input.uploadedMaterialTitle : undefined,
    allBooks: input.allBooks,
  }
}

/** Multi-book quiz scope for RAG demos — replaces single-book `buildGenerationContext` at quiz create. */
export function buildRagScopeGenerationContext(input: {
  subject: string
  grade: string
  materialMode: MaterialSourceKind
  groundingEnabled: boolean
  selectedBookIds: string[]
  selectedScopeTopics: string[]
  scopeRefinement: string
  allBooks: DemoBook[]
}): GenerationSourceContext {
  const books = input.groundingEnabled
    ? input.selectedBookIds
        .map((id) => getBookById(id, input.allBooks))
        .filter((b): b is DemoBook => Boolean(b))
    : []
  const topicParts = [...input.selectedScopeTopics]
  if (input.scopeRefinement.trim()) topicParts.push(input.scopeRefinement.trim())
  const topic = topicParts.length ? topicParts.join(' — ') : 'General scope'
  return {
    subject: input.subject,
    grade: input.grade,
    topic,
    materialMode: input.materialMode,
    groundingEnabled: input.groundingEnabled,
    books: books.length ? books : undefined,
    book: books[0],
    chapterTitles: [],
    scopeTopics: input.selectedScopeTopics,
    scopeRefinement: input.scopeRefinement.trim() || undefined,
    allBooks: input.allBooks,
  }
}

function groundingLabel(ctx: GenerationSourceContext): string {
  if (!ctx.groundingEnabled) return ''
  if (ctx.books?.length) {
    const titles = ctx.books.map((b) => b.title)
    return titles.length > 2 ? `${titles.slice(0, 2).join('; ')} +${titles.length - 2}` : titles.join('; ')
  }
  if (ctx.book && ctx.chapterTitles.length)
    return `${ctx.book.title} (${ctx.chapterTitles.join(', ')})`
  if (ctx.book) return ctx.book.title
  if (ctx.uploadedMaterialTitle) return ctx.uploadedMaterialTitle
  return ''
}

export function formatSourceSummary(ctx: GenerationSourceContext): string {
  if (!ctx.groundingEnabled) return 'Generation without catalog retrieval (grounding off)'
  const g = groundingLabel(ctx)
  if (ctx.materialMode === 'none') return 'Topic only (no catalog grounding)'
  if (ctx.books?.length) {
    const tpc = ctx.scopeTopics?.length ?? 0
    const refine = ctx.scopeRefinement ? ' · scope hint applied' : ''
    return g
      ? `Catalog retrieval · ${g} · ${tpc} topic strand${tpc === 1 ? '' : 's'}${refine}`
      : 'Catalog retrieval (select sources)'
  }
  if (ctx.materialMode === 'system' && ctx.book)
    return g ? `System: ${g}` : `System: ${ctx.book.title}`
  return 'Sources selected'
}

export interface QuizQuestionStub {
  id: string
  type: 'mcq' | 'tf' | 'short'
  prompt: string
  /** Points for this item (demo / review UI). */
  points?: number
  /** MCQ option labels for teacher review; PDF still uses generic circles if absent. */
  options?: string[]
  /** Short answer only: ruled lines on handout / PDF (1–12). */
  responseLines?: number
  /** Review UI chips — populated by generator for demos; strip before export if needed. */
  reviewBadges?: { difficulty?: string; source?: string }
}

export const SHORT_RESPONSE_LINES = { min: 1, max: 12, default: 3 } as const
export const MCQ_OPTION_BOUNDS = { min: 2, max: 6 } as const

export function clampResponseLines(n: number | undefined): number {
  const v = n ?? SHORT_RESPONSE_LINES.default
  return Math.min(SHORT_RESPONSE_LINES.max, Math.max(SHORT_RESPONSE_LINES.min, Math.round(v)))
}

/** Strip type-specific fields and clamp values before save / export. */
export function normalizeQuizQuestionStub(q: QuizQuestionStub): QuizQuestionStub {
  if (q.type === 'mcq') {
    const raw = (q.options ?? []).map((s) => s.trim()).filter(Boolean)
    const opts =
      raw.length >= MCQ_OPTION_BOUNDS.min
        ? raw.slice(0, MCQ_OPTION_BOUNDS.max)
        : ['Option A', 'Option B', 'Option C', 'Option D']
    return { ...q, options: opts, responseLines: undefined }
  }
  if (q.type === 'tf') {
    return { ...q, options: undefined, responseLines: undefined }
  }
  return { ...q, options: undefined, responseLines: clampResponseLines(q.responseLines), reviewBadges: q.reviewBadges }
}

export function generateQuizQuestionStubs(ctx: GenerationSourceContext): QuizQuestionStub[] {
  const seed = djb2(`${ctx.subject}|${ctx.topic}|${ctx.book?.id ?? ''}|${ctx.chapterTitles.join('|')}`)
  const prefix = ctx.book && ctx.groundingEnabled ? `[${ctx.book.title}] ` : ''
  const ch = ctx.chapterTitles[0] ?? ctx.topic
  const templates: QuizQuestionStub[] = [
    {
      id: `qq-${seed}-1`,
      type: 'mcq',
      prompt: `${prefix}Which statement best fits “${ch}” in ${ctx.subject}?`,
    },
    {
      id: `qq-${seed}-2`,
      type: 'tf',
      prompt: `${prefix}True/False: A key idea in “${ch}” is illustrated in the selected chapter summary.`,
    },
    {
      id: `qq-${seed}-3`,
      type: 'short',
      prompt: `${prefix}In 2–3 sentences, connect “${ctx.topic}” to one classroom example.`,
    },
  ]
  return templates
}

export type QuizDifficultyId = 'foundation' | 'standard' | 'challenge'

export type QuestionMixMode = 'balanced' | 'custom'

export interface QuizStubCriteria {
  quizId: string
  topic: string
  subject: string
  grade: string
  count: number
  difficulty: QuizDifficultyId
  includeMcq: boolean
  includeTf: boolean
  includeShort: boolean
  /** Extra text baked into prompts for demo RAG handoff later. */
  teacherNotes?: string
  /** Balanced = round-robin across selected types; custom = explicit counts per type. */
  mixMode?: QuestionMixMode
  /** When mixMode is custom, must align with count (sum of these). */
  countsByType?: { mcq: number; tf: number; short: number }
  /** Single-item regen: fix the generated type. */
  forceType?: 'mcq' | 'tf' | 'short'
  /** Short titles for review “source” chips (rotate across questions). */
  ragSourceLabels?: string[]
}

/** Demo worksheet create — mirrors quiz volume / mix / difficulty wiring. */
export interface WorksheetGenerationOpts {
  mixMode: QuestionMixMode
  questionCount: number
  includeMcq: boolean
  includeFillBlank: boolean
  includeShort: boolean
  includeMatch: boolean
  countsByType: { mcq: number; fill_blank: number; short: number; match: number }
  difficulty: QuizDifficultyId
  generatorNotes?: string
}

export function defaultWorksheetGenerationOpts(): WorksheetGenerationOpts {
  return {
    mixMode: 'balanced',
    questionCount: 10,
    includeMcq: true,
    includeFillBlank: true,
    includeShort: true,
    includeMatch: true,
    countsByType: { mcq: 3, fill_blank: 2, short: 3, match: 2 },
    difficulty: 'standard',
    generatorNotes: undefined,
  }
}

function shuffleDeterministic<T>(items: T[], seedKey: string): T[] {
  const out = [...items]
  let s = djb2(seedKey)
  for (let i = out.length - 1; i > 0; i -= 1) {
    s = (s * 1103515245 + 12345) >>> 0
    const j = s % (i + 1)
    const t = out[i]
    out[i] = out[j]!
    out[j] = t!
  }
  return out
}

function resolveTypeSequence(c: QuizStubCriteria): Array<'mcq' | 'tf' | 'short'> {
  if (c.forceType && c.count === 1) {
    return [c.forceType]
  }
  if (c.mixMode === 'custom' && c.countsByType) {
    const seq: Array<'mcq' | 'tf' | 'short'> = []
    for (let i = 0; i < c.countsByType.mcq; i += 1) seq.push('mcq')
    for (let i = 0; i < c.countsByType.tf; i += 1) seq.push('tf')
    for (let i = 0; i < c.countsByType.short; i += 1) seq.push('short')
    return shuffleDeterministic(seq, `${c.quizId}|${c.topic}|${c.difficulty}|mix`)
  }
  const types: Array<'mcq' | 'tf' | 'short'> = []
  if (c.includeMcq) types.push('mcq')
  if (c.includeTf) types.push('tf')
  if (c.includeShort) types.push('short')
  if (types.length === 0) types.push('mcq', 'tf', 'short')
  return Array.from({ length: c.count }, (_, i) => types[i % types.length]!)
}

function difficultyPrefix(d: QuizDifficultyId): string {
  if (d === 'foundation') return 'Which statement best demonstrates basic understanding of'
  if (d === 'challenge') return 'Which analysis most accurately evaluates'
  return 'Which statement best reflects competency in'
}

function difficultyDisplayLabel(d: QuizDifficultyId): string {
  if (d === 'foundation') return 'Foundation'
  if (d === 'challenge') return 'Challenge'
  return 'Standard'
}

function basePointsForType(t: 'mcq' | 'tf' | 'short', d: QuizDifficultyId): number {
  const mul = d === 'foundation' ? 1 : d === 'standard' ? 1.25 : 1.5
  const base = t === 'mcq' ? 2 : t === 'tf' ? 1 : 3
  return Math.round(base * mul * 2) / 2
}

function mcqOptionsFromTopic(topic: string, seed: number): string[] {
  const t = topic.slice(0, 48)
  return [
    `The definition or example that best matches “${t}” in this unit.`,
    `A partially correct idea that misses one key condition.`,
    `A common misconception students hold before teaching this topic.`,
    `A distractor drawn from a related but different unit.`,
  ].map((s, i) => (seed + i) % 3 === 0 ? `${s} (review)` : s)
}

/** Rich generator for the redesigned quiz create flow + backward-compatible seeds. */
export function buildQuizStubsFromCriteria(c: QuizStubCriteria): QuizQuestionStub[] {
  const typeSequence = resolveTypeSequence(c)
  const count = typeSequence.length

  const { quizId, topic, subject, grade, difficulty } = c
  const notes = c.teacherNotes?.trim()
  const tag = `${subject} · ${grade}`
  const pref = difficultyPrefix(difficulty)
  const diffBadge = difficultyDisplayLabel(difficulty)
  const srcLabels = c.ragSourceLabels?.length ? c.ragSourceLabels : undefined

  return Array.from({ length: count }, (_, i) => {
    const type = typeSequence[i]!
    const n = i + 1
    const seed = djb2(`${quizId}|${n}|${topic}|${difficulty}|${type}`)
    const noteLine = notes ? ` Teacher focus: ${notes.slice(0, 120)}` : ''
    const srcBadge = srcLabels ? srcLabels[i % srcLabels.length] : undefined
    const badges = { difficulty: diffBadge, source: srcBadge }

    if (type === 'mcq') {
      return {
        id: `${quizId}-qn-${n}`,
        type: 'mcq',
        points: basePointsForType('mcq', difficulty),
        prompt: `Q${n}. ${pref} “${topic}”? (${tag})${noteLine}`,
        options: mcqOptionsFromTopic(topic, seed),
        reviewBadges: badges,
      }
    }
    if (type === 'tf') {
      return {
        id: `${quizId}-qn-${n}`,
        type: 'tf',
        points: basePointsForType('tf', difficulty),
        prompt: `Q${n}. True or false: Mastery of “${topic}” is needed to succeed on the performance task for ${tag}.${noteLine}`,
        reviewBadges: badges,
      }
    }
    return {
      id: `${quizId}-qn-${n}`,
      type: 'short',
      points: basePointsForType('short', difficulty),
      prompt: `Q${n}. In 3–4 sentences, apply “${topic}” to one classroom or real-world example (${tag}).${noteLine}`,
      responseLines: SHORT_RESPONSE_LINES.default,
      reviewBadges: badges,
    }
  })
}

/** Deterministic multi-question bank for seed/demo quizzes (detail + PDF). */
export function buildDemoQuizQuestionStubs(opts: {
  quizId: string
  topic: string
  subject: string
  grade: string
  count: number
}): QuizQuestionStub[] {
  return buildQuizStubsFromCriteria({
    ...opts,
    difficulty: 'standard',
    includeMcq: true,
    includeTf: true,
    includeShort: true,
    mixMode: 'balanced',
  })
}

export function generateAssignmentBrief(ctx: GenerationSourceContext): string[] {
  const label = groundingLabel(ctx)
  return [
    `Objective: demonstrate understanding of ${ctx.topic} (${ctx.subject}, ${ctx.grade}).`,
    label ? `Align evidence and examples to: ${label}.` : 'Use grade-appropriate general knowledge when catalog grounding is off.',
    'Deliverable: structured response with citations to class materials (retrieved excerpts when connected to your library).',
  ]
}

export interface AssignmentBriefLineStub {
  id: string
  text: string
}

export interface AssignmentBriefTopicStub {
  id: string
  title: string
  lines: AssignmentBriefLineStub[]
}

function assignmentDifficultyTone(d: QuizDifficultyId): string {
  if (d === 'foundation') return 'Scaffold with short prompts, guided checkpoints, and recall-level checks.'
  if (d === 'challenge') return 'Push synthesis, cross-strand links, and evaluative reasoning suited to extension.'
  return 'Balance grade-level rigor with clear checkpoints and structured tasks.'
}

function buildLinesForAssignmentTopic(
  ctx: GenerationSourceContext,
  topicTitle: string,
  opts: {
    assignmentType: string
    rigorProfile: string
    difficulty: QuizDifficultyId
    generatorNotes?: string
    seedKey: string
  },
): AssignmentBriefLineStub[] {
  const notes = opts.generatorNotes?.trim()
  const noteSuffix = notes ? ` Teacher note: ${notes.slice(0, 120)}` : ''
  const grounding = ctx.groundingEnabled ? groundingLabel(ctx) : ''
  const salt = djb2(`${opts.seedKey}|${topicTitle}`)
  return [
    {
      id: newDemoId('asg-line'),
      text: `Objective — ${topicTitle}: produce ${opts.assignmentType} work at ${opts.rigorProfile} expectations in ${ctx.subject} (${ctx.grade}).${noteSuffix}`,
    },
    {
      id: newDemoId('asg-line'),
      text: `Tasks — ${assignmentDifficultyTone(opts.difficulty)} Include ${(salt % 3) + 3} concrete deliverables tied to "${topicTitle}" with a short self-check against the success criteria.`,
    },
    {
      id: newDemoId('asg-line'),
      text: `Evidence — ${
        grounding
          ? `Prioritise catalog-aligned evidence (${grounding}).`
          : 'Use defensible sources and topic-suitable reasoning when retrieval is off.'
      } Cite materials explicitly when excerpts are available.`,
    },
  ]
}

export function distributeWorksheetBalanced(
  total: number,
  include: { mcq: boolean; fill_blank: boolean; short: boolean; match: boolean },
): { mcq: number; fill_blank: number; short: number; match: number } {
  const order: Array<'mcq' | 'fill_blank' | 'short' | 'match'> = []
  if (include.mcq) order.push('mcq')
  if (include.fill_blank) order.push('fill_blank')
  if (include.short) order.push('short')
  if (include.match) order.push('match')
  if (order.length === 0) return { mcq: 3, fill_blank: 2, short: 3, match: 2 }
  const n = order.length
  const base = Math.floor(total / n)
  const extra = total % n
  const out = { mcq: 0, fill_blank: 0, short: 0, match: 0 }
  for (let i = 0; i < n; i += 1) {
    const k = order[i]!
    out[k] = base + (i < extra ? 1 : 0)
  }
  return out
}

function cloneWorksheetBlock(b: WorksheetBlock): WorksheetBlock {
  return JSON.parse(JSON.stringify(b)) as WorksheetBlock
}

function worksheetDifficultyLabel(d: QuizDifficultyId): string {
  if (d === 'foundation') return 'Foundation'
  if (d === 'challenge') return 'Challenge'
  return 'Standard'
}

function worksheetSyntheticBlock(
  type: WorksheetBlock['type'],
  n: number,
  ctx: GenerationSourceContext,
  difficulty: QuizDifficultyId,
  generatorNotes?: string,
): WorksheetBlock {
  const topic = (ctx.topic || 'this topic').slice(0, 120)
  const tag = `${ctx.subject} · ${ctx.grade}`
  const dLab = worksheetDifficultyLabel(difficulty)
  const note = generatorNotes?.trim() ? ` Teacher focus: ${generatorNotes.trim().slice(0, 100)}.` : ''
  const seed = djb2(`${topic}|${type}|${n}|${difficulty}`)
  if (type === 'mcq') {
    const options = mcqOptionsFromTopic(topic, seed)
    return {
      type: 'mcq',
      prompt: `[${dLab}] ${n}. Select the best answer about “${topic}” (${tag}).${note}`,
      options,
      answer: options[0] ?? 'Option A',
    }
  }
  if (type === 'fill_blank') {
    return {
      type: 'fill_blank',
      prompt: `[${dLab}] ${n}. A core idea in “${topic}” can be summarised as ______. (${tag})${note}`,
      answer: 'mastery',
    }
  }
  if (type === 'short') {
    return {
      type: 'short',
      prompt: `[${dLab}] ${n}. In 2–3 sentences, explain one application of “${topic}” for ${tag}.${note}`,
      sampleAnswer: 'Clear explanation using unit vocabulary and one concrete example.',
      responseLines: SHORT_RESPONSE_LINES.default,
    }
  }
  return {
    type: 'match',
    left: [`Concept A · ${n}`, `Concept B · ${n}`, `Concept C · ${n}`],
    right: ['Definition / role A', 'Definition / role B', 'Definition / role C'],
  }
}

function applyWorksheetSourceTag(block: WorksheetBlock, ctx: GenerationSourceContext): WorksheetBlock {
  const b = cloneWorksheetBlock(block)
  const label = ctx.book && ctx.groundingEnabled ? `${ctx.book.title}` : ''
  const ch = ctx.chapterTitles[0]
  const tag = label && ch ? ` (${label}: ${ch})` : label ? ` (${label})` : ''
  if (!tag) return b
  if (b.type === 'mcq' && 'prompt' in b) {
    b.prompt = `${b.prompt}${tag}`
    return b
  }
  if (b.type === 'fill_blank' && 'prompt' in b) {
    b.prompt = `${b.prompt}${tag}`
    return b
  }
  if (b.type === 'short' && 'prompt' in b) {
    b.prompt = `${b.prompt}${tag}`
    return b
  }
  if (b.type === 'match' && 'left' in b) {
    b.left = b.left.map((x, j) => (j === 0 ? `${x}${tag}` : x))
    return b
  }
  return b
}

function buildWorksheetTypeSequence(
  ctx: GenerationSourceContext,
  opts: WorksheetGenerationOpts,
): Array<'mcq' | 'fill_blank' | 'short' | 'match'> {
  if (opts.mixMode === 'custom') {
    const seq: Array<'mcq' | 'fill_blank' | 'short' | 'match'> = []
    const c = opts.countsByType
    for (let i = 0; i < c.mcq; i += 1) seq.push('mcq')
    for (let i = 0; i < c.fill_blank; i += 1) seq.push('fill_blank')
    for (let i = 0; i < c.short; i += 1) seq.push('short')
    for (let i = 0; i < c.match; i += 1) seq.push('match')
    return shuffleDeterministic(seq, `${ctx.topic}|${ctx.subject}|ws-custom`)
  }
  const counts = distributeWorksheetBalanced(opts.questionCount, {
    mcq: opts.includeMcq,
    fill_blank: opts.includeFillBlank,
    short: opts.includeShort,
    match: opts.includeMatch,
  })
  const seq: Array<'mcq' | 'fill_blank' | 'short' | 'match'> = []
  for (let i = 0; i < counts.mcq; i += 1) seq.push('mcq')
  for (let i = 0; i < counts.fill_blank; i += 1) seq.push('fill_blank')
  for (let i = 0; i < counts.short; i += 1) seq.push('short')
  for (let i = 0; i < counts.match; i += 1) seq.push('match')
  return shuffleDeterministic(seq, `${ctx.topic}|${ctx.subject}|ws-balanced`)
}

export function generateOneWorksheetBlock(
  ctx: GenerationSourceContext,
  opts: WorksheetGenerationOpts,
  type: WorksheetBlock['type'],
  regenSalt = 0,
): WorksheetBlock {
  const bp = getTopicBlueprint(ctx.subject, ctx.topic)
  const pool = bp.blocks.filter((b) => b.type === type)
  const seed = djb2(`${ctx.topic}|${type}|${opts.difficulty}|${regenSalt}`)
  const base =
    pool.length > 0
      ? cloneWorksheetBlock(pool[seed % pool.length]!)
      : worksheetSyntheticBlock(type, seed % 1000, ctx, opts.difficulty, opts.generatorNotes)
  return applyWorksheetSourceTag(base, ctx)
}

/** Multi-topic assignment brief sections for the Create Assignment review step (demo generation). */
export function buildAssignmentTopicsFromScope(
  ctx: GenerationSourceContext,
  opts: {
    topicCount: number
    assignmentType: string
    rigorProfile: string
    difficulty: QuizDifficultyId
    generatorNotes?: string
    seedKey: string
    /** When set, returns a single topic block (used for per-topic / per-line regen). */
    topicTitleOverride?: string
  },
): AssignmentBriefTopicStub[] {
  if (opts.topicTitleOverride) {
    const title = opts.topicTitleOverride
    return [
      {
        id: newDemoId('asg-topic'),
        title,
        lines: buildLinesForAssignmentTopic(ctx, title, opts),
      },
    ]
  }

  const n = Math.min(10, Math.max(1, opts.topicCount))
  const strands = ctx.scopeTopics?.length ? [...ctx.scopeTopics] : ['General scope focus']
  const shuffled = shuffleDeterministic(strands, `${opts.seedKey}|${ctx.subject}|${ctx.grade}`)

  return Array.from({ length: n }, (_, i) => {
    const titleBase = shuffled[i % shuffled.length]!
    const dup = Math.floor(i / shuffled.length)
    const title = dup === 0 ? titleBase : `${titleBase} (continued ${dup + 1})`
    const seedKey = `${opts.seedKey}|topic-${i}`
    return {
      id: newDemoId('asg-topic'),
      title,
      lines: buildLinesForAssignmentTopic(ctx, title, { ...opts, seedKey }),
    }
  })
}

export function generateWorksheetBlocks(
  ctx: GenerationSourceContext,
  opts: WorksheetGenerationOpts = defaultWorksheetGenerationOpts(),
): WorksheetBlock[] {
  const bp = getTopicBlueprint(ctx.subject, ctx.topic)
  const seq = buildWorksheetTypeSequence(ctx, opts)
  const counters: Record<'mcq' | 'fill_blank' | 'short' | 'match', number> = {
    mcq: 0,
    fill_blank: 0,
    short: 0,
    match: 0,
  }
  return seq.map((t, i) => {
    const pool = bp.blocks.filter((b) => b.type === t)
    const idx = counters[t]++
    const base =
      pool.length > 0
        ? cloneWorksheetBlock(pool[idx % pool.length]!)
        : worksheetSyntheticBlock(t, i + idx * 7, ctx, opts.difficulty, opts.generatorNotes)
    return applyWorksheetSourceTag(base, ctx)
  })
}

export interface ExamSectionStub {
  id: string
  title: string
  marks: number
  description: string
}

export function generateExamSectionStubs(ctx: GenerationSourceContext): ExamSectionStub[] {
  const seed = djb2(`${ctx.subject}|${ctx.grade}|${ctx.book?.id ?? 'x'}`)
  const topicLine =
    ctx.scopeTopics?.length && ctx.scopeTopics.join(' · ').trim()
      ? ctx.scopeTopics.join(' · ')
      : ctx.topic
  const strand = topicLine.length > 72 ? `${topicLine.slice(0, 69)}…` : topicLine
  const catalog =
    ctx.books?.length && ctx.groundingEnabled
      ? ctx.books.map((b) => b.title).join('; ')
      : ctx.book && ctx.groundingEnabled
        ? ctx.book.title
        : ''
  const baseLabels = ['Recall & foundations', 'Application & problem solving', 'Extended reasoning']
  const titles: string[] = []
  for (let i = 0; i < 3; i += 1) {
    const ch = ctx.chapterTitles[i]
    titles.push(
      ch
        ? `Section ${String.fromCharCode(65 + i)}: ${baseLabels[i]} — ${ch}`
        : `Section ${String.fromCharCode(65 + i)}: ${baseLabels[i]} (${ctx.subject})`,
    )
  }
  const marks = [22, 28, 25]
  return titles.map((title, i) => ({
    id: `sec-${seed}-${i}`,
    title,
    marks: marks[i] ?? 25,
    description: catalog
      ? `Grounded in ${catalog}. Focus: ${strand}. Questions emphasise ${baseLabels[i]?.toLowerCase() ?? 'this strand'}.`
      : `Topic scope: ${strand}. Items are illustrative for ${ctx.grade} ${ctx.subject}; adjust wording after export if needed.`,
  }))
}
