import type { DemoQuiz } from '../pages/features/teacher-tools/demo/teacherToolsDemoData'
import type { QuizApiItem, QuizCreatePayload, QuizPatchPayload } from './quizApi'

/**
 * Convert a real API QuizApiItem → DemoQuiz shape used by all existing components.
 * This is a thin mapping — field names differ slightly (camelCase both, but
 * e.g. questionStubs vs questionStubs — they already match).
 */
export function adaptApiItemToDemoQuiz(item: QuizApiItem): DemoQuiz {
  return {
    id: item.id,
    title: item.title,
    subject: item.subject,
    grade: item.grade,
    classes: item.classes,
    questions: item.questions,
    totalMarks: item.totalMarks,
    timeLimitMinutes: item.timeLimitMinutes,
    status: item.status as DemoQuiz['status'],
    assignedAt: item.assignedAt ?? undefined,
    dueAt: item.dueAt ?? undefined,
    createdAt: item.createdAt ?? undefined,
    updatedAt: item.updatedAt ?? undefined,
    submissionCount: item.submissionCount,
    avgScore: item.avgScore,
    topic: item.topic,
    sourceBookIds: item.sourceBookIds,
    scopeTopics: item.scopeTopics,
    scopeRefinement: item.scopeRefinement ?? undefined,
    sourceSummary: item.sourceSummary ?? undefined,
    questionStubs: (item.questionStubs ?? []).map((q) => ({
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      points: q.points,
      ...(q.options !== undefined ? { options: q.options } : {}),
      ...(q.responseLines !== undefined ? { responseLines: q.responseLines } : {}),
      ...(q.reviewBadges !== undefined ? { reviewBadges: q.reviewBadges } : {}),
    })),
    studentInstructions: item.studentInstructions ?? undefined,
    difficulty: item.difficulty ?? undefined,
    shuffleQuestions: item.shuffleQuestions ?? true,
    shuffleAnswers: item.shuffleAnswers ?? true,
    negativeMarking: item.negativeMarking ?? false,
    handoutLayout: item.handoutLayout ? (item.handoutLayout as unknown as DemoQuiz['handoutLayout']) : undefined,
  }
}

/**
 * Convert DemoQuiz → QuizCreatePayload for POST /quizzes.
 */
export function adaptDemoQuizToCreatePayload(q: DemoQuiz): QuizCreatePayload {
  return {
    title: q.title,
    subject: q.subject,
    grade: q.grade,
    classes: q.classes ?? [],
    timeLimitMinutes: q.timeLimitMinutes ?? 30,
    studentInstructions: q.studentInstructions,
    status: (q.status as QuizCreatePayload['status']) ?? 'draft',
    sourceBookIds: q.sourceBookIds ?? [],
    scopeTopics: q.scopeTopics ?? [],
    scopeRefinement: q.scopeRefinement,
    generateWithoutSources: !(q.sourceBookIds?.length),
    difficulty: q.difficulty as QuizCreatePayload['difficulty'],
    shuffleQuestions: q.shuffleQuestions ?? true,
    shuffleAnswers: q.shuffleAnswers ?? true,
    negativeMarking: q.negativeMarking ?? false,
    handoutLayout: q.handoutLayout ?? null,
  }
}

/**
 * Convert a partial DemoQuiz patch → QuizPatchPayload for PATCH /quizzes/{id}.
 */
export function adaptDemoQuizPatchToApiPatch(patch: Partial<DemoQuiz>): QuizPatchPayload {
  const out: QuizPatchPayload = {}
  if (patch.title !== undefined) out.title = patch.title
  if (patch.subject !== undefined) out.subject = patch.subject
  if (patch.grade !== undefined) out.grade = patch.grade
  if (patch.classes !== undefined) out.classes = patch.classes
  if (patch.timeLimitMinutes !== undefined) out.timeLimitMinutes = patch.timeLimitMinutes
  if (patch.studentInstructions !== undefined) out.studentInstructions = patch.studentInstructions
  if (patch.status !== undefined) out.status = patch.status as QuizPatchPayload['status']
  if (patch.assignedAt !== undefined) out.assignedAt = patch.assignedAt ?? null
  if (patch.dueAt !== undefined) out.dueAt = patch.dueAt ?? null
  if (patch.sourceBookIds !== undefined) out.sourceBookIds = patch.sourceBookIds
  if (patch.scopeTopics !== undefined) out.scopeTopics = patch.scopeTopics
  if (patch.scopeRefinement !== undefined) out.scopeRefinement = patch.scopeRefinement
  if (patch.difficulty !== undefined) out.difficulty = patch.difficulty as QuizPatchPayload['difficulty']
  if (patch.shuffleQuestions !== undefined) out.shuffleQuestions = patch.shuffleQuestions
  if (patch.shuffleAnswers !== undefined) out.shuffleAnswers = patch.shuffleAnswers
  if (patch.negativeMarking !== undefined) out.negativeMarking = patch.negativeMarking
  if (patch.handoutLayout !== undefined) out.handoutLayout = patch.handoutLayout ?? null
  return out
}

