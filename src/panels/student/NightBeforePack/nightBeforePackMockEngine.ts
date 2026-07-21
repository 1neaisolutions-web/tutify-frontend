import type {
  CreatePackInput,
  FormulaItem,
  NightBeforePack,
  PackContent,
  PackSubject,
  QuestionTypePrediction,
  WarmupMcq,
} from './nightBeforePackTypes'
import { getProgressSubject } from '../data/mayaChenDemoData'

type SubjectBucket = 'math' | 'science' | 'english' | 'history' | 'general'

function resolveBucket(subject: string): SubjectBucket {
  const s = subject.toLowerCase()
  if (s.includes('math') || s.includes('algebra')) return 'math'
  if (s.includes('science') || s.includes('bio') || s.includes('chem') || s.includes('physics')) return 'science'
  if (s.includes('english') || s.includes('ela') || s.includes('essay')) return 'english'
  if (s.includes('history')) return 'history'
  return 'general'
}

function hashString(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length) % items.length]
}

const BANKS: Record<
  SubjectBucket,
  {
    formulas: Omit<FormulaItem, 'id'>[]
    questionTypes: Omit<QuestionTypePrediction, 'id'>[]
    mcqs: Omit<WarmupMcq, 'id'>[]
    summaryTemplates: string[]
  }
> = {
  math: {
    formulas: [
      { name: 'Quadratic formula', expression: 'x = (−b ± √(b² − 4ac)) / 2a', note: 'Use when ax² + bx + c = 0' },
      { name: 'Slope', expression: 'm = (y₂ − y₁) / (x₂ − x₁)', note: 'Rise over run between two points' },
      { name: 'Area of a circle', expression: 'A = πr²', note: 'r is the radius' },
      { name: 'Pythagorean theorem', expression: 'a² + b² = c²', note: 'Right triangles only' },
      { name: 'Logarithm definition', expression: 'logₐ(b) = c means aᶜ = b', note: 'The core relationship behind every log rule' },
      { name: 'Log quotient/product/power rules', expression: 'log(mn)=log(m)+log(n); log(m/n)=log(m)−log(n); log(mᵏ)=k·log(m)', note: 'Most-missed rules on the midterm' },
      { name: 'Change of base', expression: 'logₐ(b) = ln(b) / ln(a)', note: 'Use when bases don\u2019t match' },
    ],
    questionTypes: [
      { type: 'Multiple choice', weight: '~40%', tip: 'Watch for sign errors and domain restrictions.' },
      { type: 'Short calculation', weight: '~35%', tip: 'Show one clear method; box the final answer.' },
      { type: 'Word problem', weight: '~25%', tip: 'Define variables before solving.' },
    ],
    mcqs: [
      {
        text: 'What is the slope of the line through (2, 3) and (6, 11)?',
        options: ['1', '2', '3', '4'],
        answerIndex: 1,
        explanation: '(11 − 3) / (6 − 2) = 8 / 4 = 2.',
      },
      {
        text: 'Solutions of x² − 5x + 6 = 0 are…',
        options: ['x = 1, 6', 'x = 2, 3', 'x = −2, −3', 'x = 0, 5'],
        answerIndex: 1,
        explanation: 'Factors as (x − 2)(x − 3) = 0.',
      },
      {
        text: 'If a right triangle has legs 3 and 4, the hypotenuse is…',
        options: ['5', '6', '7', '12'],
        answerIndex: 0,
        explanation: '3² + 4² = 9 + 16 = 25 → √25 = 5.',
      },
      {
        text: 'The discriminant of ax² + bx + c is…',
        options: ['b² − 4ac', 'b² + 4ac', '2a', '−b / 2a'],
        answerIndex: 0,
        explanation: 'Discriminant Δ = b² − 4ac tells how many real roots.',
      },
      {
        text: 'Simplify: (x² − 9) / (x − 3) for x ≠ 3',
        options: ['x + 3', 'x − 3', 'x² − 3', '9'],
        answerIndex: 0,
        explanation: 'Difference of squares: (x − 3)(x + 3) / (x − 3) = x + 3.',
      },
      {
        text: 'Solve for x: log₂(x) = 5',
        options: ['x = 10', 'x = 25', 'x = 32', 'x = 16'],
        answerIndex: 2,
        explanation: '2⁵ = 32, so x = 32.',
      },
      {
        text: 'logₐ(b) − logₐ(c) =',
        options: ['logₐ(b/c)', 'logₐ(bc)', 'logₐ(b)^c', 'c·logₐ(b)'],
        answerIndex: 0,
        explanation: 'Quotient rule: subtracting logs corresponds to dividing inside.',
      },
      {
        text: 'Change of base: logₐ(b) =',
        options: ['ln(b)/ln(a)', 'ln(a)/ln(b)', 'a/b', 'b/a'],
        answerIndex: 0,
        explanation: 'Divide the natural log of b by the natural log of a.',
      },
    ],
    summaryTemplates: [
      'Focus on {topic}: identify the rule, apply it to a worked example, then try one without looking.',
      'For {topic}, list common mistakes (signs, units, order of operations) and how to catch them.',
      'Connect {topic} to prior skills so you can switch methods if stuck.',
    ],
  },
  science: {
    formulas: [
      { name: 'Photosynthesis', expression: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂', note: 'Light-dependent + Calvin cycle' },
      { name: 'Cellular respiration', expression: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP', note: 'Opposite of photosynthesis' },
      { name: 'Density', expression: 'ρ = m / V', note: 'Mass over volume' },
      { name: 'Speed', expression: 'v = d / t', note: 'Distance over time' },
    ],
    questionTypes: [
      { type: 'Multiple choice (concepts)', weight: '~45%', tip: 'Eliminate options that confuse related processes.' },
      { type: 'Short explain', weight: '~30%', tip: 'Use cause → effect in one or two sentences.' },
      { type: 'Diagram / label', weight: '~25%', tip: 'Name parts and one function each.' },
    ],
    mcqs: [
      {
        text: 'Photosynthesis mainly occurs in…',
        options: ['Mitochondria', 'Chloroplasts', 'Nucleus', 'Ribosomes'],
        answerIndex: 1,
        explanation: 'Chloroplasts contain chlorophyll and run light reactions + Calvin cycle.',
      },
      {
        text: 'Oxygen released in photosynthesis comes from…',
        options: ['CO₂', 'Glucose', 'Water', 'ATP'],
        answerIndex: 2,
        explanation: 'Water is split in the light reactions.',
      },
      {
        text: 'The Calvin cycle primarily uses…',
        options: ['CO₂', 'O₂', 'Nitrogen', 'Salt'],
        answerIndex: 0,
        explanation: 'Carbon fixation incorporates CO₂ into sugars.',
      },
      {
        text: 'Cellular respiration releases energy as…',
        options: ['Light only', 'ATP', 'Nitrogen gas', 'Starch only'],
        answerIndex: 1,
        explanation: 'ATP is the usable energy currency of cells.',
      },
      {
        text: 'A denser object has…',
        options: ['More mass in the same volume', 'Less mass always', 'Zero volume', 'No weight'],
        answerIndex: 0,
        explanation: 'Density = mass / volume.',
      },
    ],
    summaryTemplates: [
      'For {topic}, write a 3-bullet “what / why / how it is tested” card.',
      'Compare {topic} with a related process so you do not mix definitions on the exam.',
      'Sketch one labeled diagram for {topic} and say each part’s job out loud.',
    ],
  },
  english: {
    formulas: [
      { name: 'Thesis checklist', expression: 'Claim + reason + so-what', note: 'Keep it arguable and specific' },
      { name: 'PEEL paragraph', expression: 'Point → Evidence → Explain → Link', note: 'One idea per paragraph' },
      { name: 'Quote sandwich', expression: 'Context + quote + analysis', note: 'Never drop a quote alone' },
      { name: 'Counterargument', expression: 'Concede → refute → reaffirm', note: 'Shows maturity of argument' },
    ],
    questionTypes: [
      { type: 'Short response', weight: '~30%', tip: 'Lead with the claim, then one piece of evidence.' },
      { type: 'Extended essay', weight: '~50%', tip: 'Plan structure before writing; leave 5 min to proofread.' },
      { type: 'Passage analysis', weight: '~20%', tip: 'Name a technique and explain its effect on the reader.' },
    ],
    mcqs: [
      {
        text: 'A strong thesis should be…',
        options: ['A topic only', 'An arguable claim', 'A quote from the text', 'A summary of plot'],
        answerIndex: 1,
        explanation: 'Thesis takes a position you can support with evidence.',
      },
      {
        text: 'In PEEL, the “E” for Evidence means…',
        options: ['Emotion', 'Example or quote', 'Ending', 'Emphasis'],
        answerIndex: 1,
        explanation: 'Evidence supports your point with text or facts.',
      },
      {
        text: 'Analysis after a quote should…',
        options: ['Retell the plot', 'Explain how the quote proves your point', 'List page numbers only', 'Ask a new question'],
        answerIndex: 1,
        explanation: 'Connect the evidence back to your claim.',
      },
      {
        text: 'A counterargument is useful because it…',
        options: ['Makes the essay longer', 'Shows you considered other views', 'Replaces your thesis', 'Avoids evidence'],
        answerIndex: 1,
        explanation: 'Addressing opposing views strengthens credibility.',
      },
      {
        text: 'Topic sentences should…',
        options: ['Introduce the paragraph’s main idea', 'Always be a quote', 'Only ask questions', 'Repeat the title'],
        answerIndex: 0,
        explanation: 'They signal what the paragraph will prove.',
      },
    ],
    summaryTemplates: [
      'For {topic}, prepare one claim, two pieces of evidence, and a one-line analysis.',
      'Draft a PEEL outline for {topic} so you can write faster under time pressure.',
      'List three precise vocabulary words for {topic} you can drop into body paragraphs.',
    ],
  },
  history: {
    formulas: [
      { name: 'Cause → event → consequence', expression: 'C → E → C', note: 'Use for short answers' },
      { name: 'Source evaluation', expression: 'Origin + Purpose + Value + Limitation', note: 'OPVL for documents' },
      { name: 'Compare frame', expression: 'Similarity / Difference / Significance', note: 'For “compare and contrast”' },
      { name: 'Timeline anchor', expression: 'Before → Turning point → After', note: 'Keeps chronology clear' },
    ],
    questionTypes: [
      { type: 'Multiple choice (facts)', weight: '~35%', tip: 'Link dates to causes, not memorization alone.' },
      { type: 'Short explain', weight: '~40%', tip: 'Use cause → consequence with one named example.' },
      { type: 'Source-based', weight: '~25%', tip: 'State what the source shows, then what it leaves out.' },
    ],
    mcqs: [
      {
        text: 'A turning point is best described as…',
        options: ['Any date on a timeline', 'An event that changes the course of events', 'A biography', 'A map key'],
        answerIndex: 1,
        explanation: 'Turning points shift outcomes or accelerate change.',
      },
      {
        text: 'When evaluating a primary source, “purpose” means…',
        options: ['When it was written', 'Why it was created', 'How long it is', 'Who graded it'],
        answerIndex: 1,
        explanation: 'Purpose is the author’s intent or audience goal.',
      },
      {
        text: 'A strong historical explanation includes…',
        options: ['Only opinions', 'Cause and consequence with evidence', 'A list of names only', 'Modern slang'],
        answerIndex: 1,
        explanation: 'Link causes to outcomes with specific evidence.',
      },
      {
        text: 'Compare-and-contrast responses should…',
        options: ['Only list similarities', 'Include both similarities and differences', 'Avoid significance', 'Ignore chronology'],
        answerIndex: 1,
        explanation: 'Balanced comparison plus why it matters.',
      },
      {
        text: 'Chronology helps because it…',
        options: ['Makes essays longer', 'Shows sequence of cause and effect', 'Replaces evidence', 'Hides bias'],
        answerIndex: 1,
        explanation: 'Order clarifies how events relate.',
      },
    ],
    summaryTemplates: [
      'For {topic}, write one cause, one key event, and one lasting consequence.',
      'Prepare an OPVL note for one document related to {topic}.',
      'Build a 5-item timeline for {topic} with dates you can recall under pressure.',
    ],
  },
  general: {
    formulas: [
      { name: 'Active recall loop', expression: 'Cover → Recall → Check', note: 'Better than re-reading' },
      { name: 'Pomodoro', expression: '25 min focus + 5 min break', note: 'Keep the night-before session light' },
      { name: 'Priority filter', expression: 'High yield first', note: 'Start with likely exam topics' },
      { name: 'Mistake log', expression: 'Error → Fix → Retry', note: 'Turn misses into quick wins' },
    ],
    questionTypes: [
      { type: 'Multiple choice', weight: '~40%', tip: 'Eliminate extremes, then compare remaining options.' },
      { type: 'Short answer', weight: '~35%', tip: 'Answer the verb in the prompt (explain, list, compare).' },
      { type: 'Application', weight: '~25%', tip: 'Apply a rule to a new example, not a memorized one.' },
    ],
    mcqs: [
      {
        text: 'The best night-before strategy is…',
        options: ['Cram everything new', 'Light review + sleep', 'Skip practice', 'All-nighter'],
        answerIndex: 1,
        explanation: 'Retrieval practice and sleep beat last-minute cramming.',
      },
      {
        text: 'Active recall means…',
        options: ['Re-reading notes', 'Testing yourself from memory', 'Highlighting only', 'Watching videos passively'],
        answerIndex: 1,
        explanation: 'Pulling information from memory strengthens retention.',
      },
      {
        text: 'If you miss a practice question, you should…',
        options: ['Ignore it', 'Note the fix and retry soon', 'Stop studying', 'Only reread the chapter'],
        answerIndex: 1,
        explanation: 'Error → fix → retry closes the gap.',
      },
      {
        text: 'High-yield topics are…',
        options: ['Anything long', 'Topics most likely to appear', 'Only formulas', 'Extra credit'],
        answerIndex: 1,
        explanation: 'Prioritize what the exam is scoped to cover.',
      },
      {
        text: 'A short warm-up quiz helps because it…',
        options: ['Replaces sleep', 'Activates retrieval before the exam', 'Guarantees a score', 'Is graded'],
        answerIndex: 1,
        explanation: 'Light retrieval primes memory without heavy load.',
      },
    ],
    summaryTemplates: [
      'For {topic}, write three recall prompts you can answer without notes.',
      'List the two highest-yield ideas in {topic} and one example for each.',
      'Plan a 10-minute review block focused only on {topic}.',
    ],
  },
}

function buildSummary(topics: string[], bucket: SubjectBucket, random: () => number): string[] {
  const bank = BANKS[bucket]
  const list = topics.length > 0 ? topics : ['core exam topics']
  return list.slice(0, 5).map((topic) => {
    const template = pick(bank.summaryTemplates, random)
    return template.replace('{topic}', topic)
  })
}

/** Weak topics (especially Logarithms) from live progress data, prepended so they're never crowded out. */
function weakTopicsFor(subject: string): string[] {
  if (!subject.toLowerCase().includes('algebra')) return []
  const progress = getProgressSubject('algebra-ii')
  if (!progress) return []
  return progress.topics
    .filter((t) => t.level === 'weak')
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    .map((t) => t.name)
}

function mergeWeakTopicsFirst(topics: string[], weakTopics: string[]): string[] {
  if (weakTopics.length === 0) return topics
  const rest = topics.filter((t) => !weakTopics.some((w) => w.toLowerCase() === t.toLowerCase()))
  return [...weakTopics, ...rest]
}

/** Boosts bank items whose name/text references a weak topic to the front of the shuffled selection. */
function weightedPick<T extends { name?: string; text?: string }>(
  items: T[],
  count: number,
  random: () => number,
  weakTopics: string[]
): T[] {
  const isWeakHit = (item: T) => {
    const haystack = `${item.name || ''} ${item.text || ''}`.toLowerCase()
    return weakTopics.some((w) => haystack.includes(w.toLowerCase().replace(/s$/, '')))
  }
  const boosted = items.filter(isWeakHit)
  const rest = [...items.filter((item) => !isWeakHit(item))].sort(() => random() - 0.5)
  return [...boosted, ...rest].slice(0, count)
}

function buildContent(subject: string, topics: string[], seedSalt = ''): PackContent {
  const bucket = resolveBucket(subject)
  const random = mulberry32(hashString(`${subject}|${topics.join(',')}|${seedSalt}`))
  const bank = BANKS[bucket]
  const weakTopics = weakTopicsFor(subject)
  const weightedTopics = mergeWeakTopicsFirst(topics, weakTopics)

  const formulas = weightedPick(bank.formulas, 4, random, weakTopics).map((f, i) => ({ ...f, id: `f_${i + 1}` }))

  const predictedQuestionTypes = bank.questionTypes.map((q, i) => ({ ...q, id: `qt_${i + 1}` }))

  const warmupMcqs = weightedPick(bank.mcqs, 5, random, weakTopics).map((q, i) => ({ ...q, id: `mcq_${i + 1}` }))

  return {
    topicSummary: buildSummary(weightedTopics, bucket, random),
    keyFormulas: formulas,
    predictedQuestionTypes,
    warmupMcqs,
  }
}

export function generatePackContent(input: CreatePackInput, seedSalt = ''): PackContent {
  return buildContent(input.subject, input.topics, seedSalt)
}

export function createPackFromInput(
  input: CreatePackInput,
  options?: { id?: string; source?: NightBeforePack['source']; examId?: string | null; seedSalt?: string },
): NightBeforePack {
  const now = new Date().toISOString()
  const content = generatePackContent(input, options?.seedSalt)
  return {
    id: options?.id || `nbp_${Date.now()}`,
    examId: options?.examId ?? null,
    title: input.title.trim(),
    subject: input.subject as PackSubject,
    topics: input.topics,
    notes: input.notes?.trim() || undefined,
    source: options?.source || 'self-created',
    status: 'ready',
    examAt: input.examAt,
    estimatedMinutes: 25,
    readyAt: now,
    createdAt: now,
    content,
    progress: {
      sectionsViewed: [],
      mcqAnswers: {},
    },
  }
}

export function regenerateFailedPack(pack: NightBeforePack): NightBeforePack {
  const content = generatePackContent(
    {
      subject: pack.subject,
      title: pack.title,
      examAt: pack.examAt,
      topics: pack.topics,
      notes: pack.notes,
    },
    'retry',
  )
  return {
    ...pack,
    status: 'ready',
    readyAt: new Date().toISOString(),
    failureMessage: undefined,
    content,
  }
}

export { buildContent }
