import type {
  DailyActionItem,
  Difficulty,
  DifferentiationItem,
  ProgressMonitoringCheckpoint,
  SprintContext,
  SprintPlan,
  SprintPlanSections,
  SupportNeed,
} from './interventionSprintTypes'

/**
 * Deterministic, input-driven plan composition. This is a frontend-only demo
 * engine — it does not call any backend or LLM. Same inputs always produce
 * the same first plan; regenerate/adjust actions pass a bumped seed so only
 * the targeted content reshuffles.
 */

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

function seedFromContext(context: SprintContext, salt = ''): number {
  return hashString(
    `${context.subject}|${context.topicOrSkill}|${context.grade}|${context.groupType}|${context.mainConcern}|${salt}`,
  )
}

type SubjectBucket = 'math' | 'ela' | 'science' | 'general'

function resolveSubjectBucket(subject: string): SubjectBucket {
  const s = subject.toLowerCase()
  if (/(math|algebra|geometry|fraction|number)/.test(s)) return 'math'
  if (/(ela|english|literacy|reading|writing|language)/.test(s)) return 'ela'
  if (/(science|stem|biology|chemistry|physics)/.test(s)) return 'science'
  return 'general'
}

const SUBJECT_BANKS: Record<
  SubjectBucket,
  {
    phaseNames: string[]
    activities: string[]
    teacherMoves: string[]
    monitoringMethods: string[]
    guidanceQuestions: string[]
  }
> = {
  math: {
    phaseNames: ['Diagnose', 'Model', 'Guided Practice', 'Independent Practice', 'Check & Reflect'],
    activities: [
      'Use manipulatives or visual models to represent {topic} before moving to abstract notation.',
      'Work a "my turn, your turn" problem set on {topic} with think-alouds at each step.',
      'Partner problem-solving on {topic} using a error-analysis task (find and fix the mistake).',
      'Short independent practice set on {topic}, gradually removing supports.',
      'Number talk focused on {topic} to surface strategies and build flexible thinking.',
    ],
    teacherMoves: [
      'Ask "Can you show that another way?" to check for flexible understanding of {topic}.',
      'Circulate and check the first two problems for a quick accuracy pulse before continuing.',
      'Have students justify their answer on {topic} out loud to a partner before writing it down.',
      'Use a quick whiteboard check to catch misconceptions on {topic} in real time.',
    ],
    monitoringMethods: ['3-question exit ticket', 'quick whiteboard check', 'error-analysis task', 'one-on-one check-in'],
    guidanceQuestions: [
      'What do you notice about {topic}?',
      'How do you know that is true?',
      'Can you prove it a different way?',
      'What would happen if we changed one part of this problem?',
    ],
  },
  ela: {
    phaseNames: ['Diagnose', 'Model', 'Guided Reading/Writing', 'Independent Application', 'Check & Reflect'],
    activities: [
      'Model {topic} using a short mentor text, thinking aloud through the strategy.',
      'Guided practice on {topic} with a partner, using sentence starters as needed.',
      'Small-group discussion applying {topic} to a new short passage.',
      'Independent application of {topic} in a short writing or reading task.',
      'Quick reflection on {topic}: what worked, what was tricky.',
    ],
    teacherMoves: [
      'Ask students to point to evidence in the text that supports their thinking about {topic}.',
      'Provide a sentence frame to scaffold explanation of {topic}.',
      'Have students restate {topic} in their own words before applying it.',
      'Check one sample of student work mid-task to catch confusion early.',
    ],
    monitoringMethods: ['quick write exit ticket', 'running record', 'short comprehension check', 'one-on-one conference'],
    guidanceQuestions: [
      'What does the text tell us about {topic}?',
      'How does this connect to what we read yesterday?',
      'Can you find evidence for that idea?',
      'What would you tell a friend who was confused about {topic}?',
    ],
  },
  science: {
    phaseNames: ['Diagnose', 'Investigate', 'Guided Analysis', 'Independent Application', 'Check & Reflect'],
    activities: [
      'Short hands-on or simulated investigation exploring {topic}.',
      'Guided analysis of data or observations related to {topic}.',
      'Small-group discussion: what pattern do we see in {topic}?',
      'Independent application task connecting {topic} to a new scenario.',
      'Quick reflection: what evidence supports our thinking about {topic}?',
    ],
    teacherMoves: [
      'Ask "What evidence supports that claim?" when discussing {topic}.',
      'Have students sketch or diagram their thinking about {topic} before writing.',
      'Check for a common misconception about {topic} using a quick poll question.',
      'Prompt students to connect {topic} back to the driving question for the unit.',
    ],
    monitoringMethods: ['claim-evidence-reasoning check', 'quick diagram check', 'exit ticket', 'lab notebook check'],
    guidanceQuestions: [
      'What evidence do we have about {topic}?',
      'What pattern do you notice?',
      'How does this connect to what we already know?',
      'What would you predict would happen next?',
    ],
  },
  general: {
    phaseNames: ['Diagnose', 'Model', 'Guided Practice', 'Independent Practice', 'Check & Reflect'],
    activities: [
      'Short, focused reteach of {topic} using a concrete example.',
      'Guided practice on {topic} with immediate feedback.',
      'Partner practice applying {topic} to a new short task.',
      'Independent practice on {topic}, gradually removing supports.',
      'Quick reflection on progress with {topic}.',
    ],
    teacherMoves: [
      'Check in with each student at least once during {topic} practice.',
      'Have students explain {topic} back in their own words.',
      'Use a quick thumbs-up/thumbs-down check for confidence on {topic}.',
      'Offer a worked example of {topic} for students who need it.',
    ],
    monitoringMethods: ['quick exit ticket', 'one-on-one check-in', 'short practice set', 'observation checklist'],
    guidanceQuestions: [
      'What do you already know about {topic}?',
      'What part feels tricky?',
      'Can you show me how you got that?',
      'What would help you feel more confident with {topic}?',
    ],
  },
}

const SUPPORT_NEED_LABELS: Record<SupportNeed, string> = {
  el_support: 'English Learner support',
  iep_504: 'IEP / 504 accommodations',
  behavior_support: 'Behavior support',
  gifted_extension: 'Gifted extension',
}

function fillTopic(template: string, topic: string): string {
  return template.replace(/\{topic\}/g, topic || 'the target skill')
}

function extractPercentBaseline(evidence: string): number | null {
  const match = evidence.match(/(\d{1,3})\s*%/)
  if (!match) return null
  const value = Number(match[1])
  return Number.isFinite(value) && value >= 0 && value <= 100 ? value : null
}

function groupLabel(groupType: SprintContext['groupType']): string {
  switch (groupType) {
    case 'one_on_one':
      return 'this student'
    case 'whole_class_subgroup':
      return 'this subgroup of students'
    case 'small_group':
    default:
      return 'this small group'
  }
}

function buildDailyActionPlan(
  context: SprintContext,
  bucket: SubjectBucket,
  difficulty: Difficulty,
  minutesPerDay: number,
  random: () => number,
): DailyActionItem[] {
  const bank = SUBJECT_BANKS[bucket]
  const days: DailyActionItem[] = []
  const topic = context.topicOrSkill

  for (let day = 1; day <= context.durationDays; day++) {
    const progress = (day - 1) / Math.max(1, context.durationDays - 1)
    let phaseIndex: number
    if (progress < 0.2) phaseIndex = 0
    else if (progress < 0.4) phaseIndex = 1
    else if (progress < 0.8) phaseIndex = 2
    else if (progress < 0.95) phaseIndex = 3
    else phaseIndex = 4

    const activityTemplate = pick(bank.activities, random)
    let activity = fillTopic(activityTemplate, topic)
    if (difficulty === 'easier') {
      activity += ' Add modeling and sentence/step starters before releasing responsibility.'
    } else if (difficulty === 'more_rigorous') {
      activity += ' Ask students to justify their reasoning or extend to a less familiar example.'
    }

    days.push({
      day,
      phase: bank.phaseNames[phaseIndex],
      focus: `${bank.phaseNames[phaseIndex]}: ${topic || 'target skill'}`,
      activity,
      teacherMove: fillTopic(pick(bank.teacherMoves, random), topic),
      minutes: minutesPerDay,
    })
  }
  return days
}

function buildDifferentiation(
  context: SprintContext,
  bucket: SubjectBucket,
  elSupportAdded: boolean,
): DifferentiationItem[] {
  const items: DifferentiationItem[] = []
  const topic = context.topicOrSkill || 'the target skill'
  const needs = new Set(context.supportNeeds)
  if (elSupportAdded) needs.add('el_support')

  if (needs.has('el_support')) {
    items.push({
      label: SUPPORT_NEED_LABELS.el_support,
      adjustment:
        bucket === 'ela'
          ? `Pair sentence frames with visuals when discussing ${topic}; pre-teach key vocabulary before the session.`
          : `Pair visuals or manipulatives with sentence frames such as "___ is true because ___" when explaining ${topic}.`,
    })
  }
  if (needs.has('iep_504')) {
    items.push({
      label: SUPPORT_NEED_LABELS.iep_504,
      adjustment: `Chunk ${topic} into smaller steps, allow extra processing time, and provide a written copy of directions.`,
    })
  }
  if (needs.has('behavior_support')) {
    items.push({
      label: SUPPORT_NEED_LABELS.behavior_support,
      adjustment: `Use a visual timer, preferential seating near a teacher check-in point, and a brief movement break midway through the ${context.minutesPerDay}-minute session.`,
    })
  }
  if (needs.has('gifted_extension')) {
    items.push({
      label: SUPPORT_NEED_LABELS.gifted_extension,
      adjustment: `Offer an extension task requiring students to justify or teach back ${topic} using a second representation.`,
    })
  }
  if (items.length === 0) {
    items.push({
      label: 'Tiered support',
      adjustment: `Adjust scaffolding for ${groupLabel(context.groupType)} based on daily check-ins — add a worked example for students who need it, and a stretch task for students who are ready.`,
    })
  }
  return items
}

function buildProgressMonitoring(
  context: SprintContext,
  bucket: SubjectBucket,
  random: () => number,
): ProgressMonitoringCheckpoint[] {
  const bank = SUBJECT_BANKS[bucket]
  const total = context.durationDays
  const checkpointDays = Array.from(
    new Set([Math.max(1, Math.round(total / 3)), Math.max(2, Math.round((total * 2) / 3)), total]),
  ).sort((a, b) => a - b)

  return checkpointDays.map((day, idx) => ({
    day,
    method: pick(bank.monitoringMethods, random),
    lookFor:
      idx === checkpointDays.length - 1
        ? `Overall growth on ${context.topicOrSkill || 'the target skill'} compared to the day-1 baseline.`
        : `Early signs of progress or a persisting misconception on ${context.topicOrSkill || 'the target skill'}.`,
  }))
}

function buildTeacherGuidance(context: SprintContext, bucket: SubjectBucket, random: () => number): string[] {
  const bank = SUBJECT_BANKS[bucket]
  const topic = context.topicOrSkill || 'the target skill'
  const questions = [...bank.guidanceQuestions].map((q) => fillTopic(q, topic))
  // stable order, but shuffle-once via seeded random for a touch of variation
  return questions
    .map((q) => ({ q, r: random() }))
    .sort((a, b) => a.r - b.r)
    .map((x) => x.q)
}

function buildFamilyCommunication(context: SprintContext): string {
  const topic = context.topicOrSkill || 'a key skill'
  return [
    `Hi families,`,
    ``,
    `I wanted to share that ${groupLabel(context.groupType)} will be joining a short, focused support sprint on ${topic} over the next ${context.durationDays} school days. We'll meet for about ${context.minutesPerDay} minutes each day to build confidence and close the gap I've noticed in class.`,
    ``,
    `This is a normal part of how we respond to what our daily work shows us — it's proactive support, not a sign of a bigger problem. I'll share an update on progress at the end of the sprint.`,
    ``,
    `If you're able to reinforce ${topic} at home in a low-pressure way, that would help, but it isn't required. Please reach out anytime with questions.`,
    ``,
    `Thank you for partnering with me,`,
    `Your child's teacher`,
  ].join('\n')
}

function buildAdminSummary(context: SprintContext, baseline: number | null): string {
  const topic = context.topicOrSkill || 'the target skill'
  const baselineLine = baseline != null
    ? `Baseline evidence indicates approximately ${baseline}% proficiency prior to this sprint.`
    : `Baseline evidence: ${context.evidence || 'teacher-observed classroom data (see notes).'}`
  return [
    `Concern: ${context.mainConcern || `Students are struggling with ${topic}.`}`,
    `Grade/Subject: ${context.grade || 'Not specified'} / ${context.subject || 'Not specified'}`,
    `Group: ${groupLabel(context.groupType)}`,
    baselineLine,
    `Action taken: ${context.durationDays}-day targeted intervention sprint, ${context.minutesPerDay} minutes/day, focused on ${topic}.`,
    `Progress monitoring: checkpoints scheduled across the sprint (see Progress Monitoring section).`,
    `Next review: at the end of the ${context.durationDays}-day sprint, to determine whether to close, continue, or escalate support.`,
  ].join('\n')
}

function buildProblemSummary(context: SprintContext, baseline: number | null): string {
  const topic = context.topicOrSkill || 'the target skill'
  const concern = context.mainConcern
    ? context.mainConcern
    : `${groupLabel(context.groupType)} is struggling with ${topic}.`
  const evidenceLine = context.evidence
    ? `Evidence: ${context.evidence}`
    : `No specific evidence entered — plan is based on the concern described above.`
  const baselineLine = baseline != null ? ` Current data suggests roughly ${baseline}% proficiency.` : ''
  return `${concern} ${evidenceLine}${baselineLine}`.trim()
}

function buildInterventionGoal(context: SprintContext, baseline: number | null): string {
  const topic = context.topicOrSkill || 'the target skill'
  if (context.expectedGoal) return context.expectedGoal
  const growthLine =
    baseline != null
      ? `moving from an estimated ${baseline}% baseline toward consistent, independent accuracy`
      : `moving from inconsistent performance toward consistent, independent accuracy`
  return `By the end of this ${context.durationDays}-day sprint, ${groupLabel(context.groupType)} will demonstrate stronger understanding of ${topic}, ${growthLine} on daily checks.`
}

export function generateSprintPlan(context: SprintContext, difficulty: Difficulty = 'standard'): SprintPlan {
  const bucket = resolveSubjectBucket(context.subject)
  const baseline = extractPercentBaseline(context.evidence)
  const seed = seedFromContext(context)
  const random = mulberry32(seed)
  const elSupportAdded = context.supportNeeds.includes('el_support')

  const sections: SprintPlanSections = {
    problemSummary: buildProblemSummary(context, baseline),
    interventionGoal: buildInterventionGoal(context, baseline),
    dailyActionPlan: buildDailyActionPlan(context, bucket, difficulty, context.minutesPerDay, random),
    differentiation: buildDifferentiation(context, bucket, elSupportAdded),
    progressMonitoring: buildProgressMonitoring(context, bucket, random),
    teacherGuidance: buildTeacherGuidance(context, bucket, random),
    familyCommunication: buildFamilyCommunication(context),
    adminSummary: buildAdminSummary(context, baseline),
  }

  const now = new Date().toISOString()
  return {
    id: `sprint_${Date.now()}_${Math.floor(Math.random() * 1e6)}`,
    createdAt: now,
    updatedAt: now,
    context,
    difficulty,
    elSupportAdded,
    sections,
  }
}

export type AdjustAction = 'easier' | 'more_rigorous' | 'add_el_support'

export function adjustSprintPlan(plan: SprintPlan, action: AdjustAction): SprintPlan {
  if (action === 'add_el_support') {
    const bucket = resolveSubjectBucket(plan.context.subject)
    const differentiation = buildDifferentiation(plan.context, bucket, true)
    return {
      ...plan,
      elSupportAdded: true,
      updatedAt: new Date().toISOString(),
      sections: { ...plan.sections, differentiation },
    }
  }

  const difficulty: Difficulty = action === 'easier' ? 'easier' : 'more_rigorous'
  const bucket = resolveSubjectBucket(plan.context.subject)
  const random = mulberry32(seedFromContext(plan.context, difficulty))
  const dailyActionPlan = buildDailyActionPlan(plan.context, bucket, difficulty, plan.context.minutesPerDay, random)
  return {
    ...plan,
    difficulty,
    updatedAt: new Date().toISOString(),
    sections: { ...plan.sections, dailyActionPlan },
  }
}

export function changeDailyTime(plan: SprintPlan, minutesPerDay: number): SprintPlan {
  const bucket = resolveSubjectBucket(plan.context.subject)
  const random = mulberry32(seedFromContext(plan.context, `time-${minutesPerDay}`))
  const context = { ...plan.context, minutesPerDay: minutesPerDay as SprintContext['minutesPerDay'] }
  const dailyActionPlan = buildDailyActionPlan(context, bucket, plan.difficulty, minutesPerDay, random)
  return {
    ...plan,
    context,
    updatedAt: new Date().toISOString(),
    sections: { ...plan.sections, dailyActionPlan },
  }
}

export function regenerateSection(plan: SprintPlan, sectionKey: keyof SprintPlanSections): SprintPlan {
  const bucket = resolveSubjectBucket(plan.context.subject)
  const baseline = extractPercentBaseline(plan.context.evidence)
  const bump = `regen-${Date.now()}`
  const random = mulberry32(seedFromContext(plan.context, bump))

  const updates: Partial<SprintPlanSections> = {}
  switch (sectionKey) {
    case 'dailyActionPlan':
      updates.dailyActionPlan = buildDailyActionPlan(plan.context, bucket, plan.difficulty, plan.context.minutesPerDay, random)
      break
    case 'differentiation':
      updates.differentiation = buildDifferentiation(plan.context, bucket, plan.elSupportAdded)
      break
    case 'progressMonitoring':
      updates.progressMonitoring = buildProgressMonitoring(plan.context, bucket, random)
      break
    case 'teacherGuidance':
      updates.teacherGuidance = buildTeacherGuidance(plan.context, bucket, random)
      break
    case 'familyCommunication':
      updates.familyCommunication = buildFamilyCommunication(plan.context)
      break
    case 'adminSummary':
      updates.adminSummary = buildAdminSummary(plan.context, baseline)
      break
    case 'problemSummary':
      updates.problemSummary = buildProblemSummary(plan.context, baseline)
      break
    case 'interventionGoal':
      updates.interventionGoal = buildInterventionGoal(plan.context, baseline)
      break
    default:
      break
  }

  return {
    ...plan,
    updatedAt: new Date().toISOString(),
    sections: { ...plan.sections, ...updates },
  }
}
