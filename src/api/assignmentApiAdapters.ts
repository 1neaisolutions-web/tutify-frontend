import type { DemoAssignment } from '../pages/features/teacher-tools/demo/teacherToolsDemoData'
import type {
  AssignmentApiItem,
  AssignmentCreatePayload,
  AssignmentPatchPayload,
} from './assignmentApi'

function dueAtForDemo(iso: string | null | undefined): string {
  if (!iso) return ''
  if (iso.length >= 10 && iso[4] === '-' && iso[7] === '-') return iso.slice(0, 10)
  return iso
}

export function adaptApiItemToDemoAssignment(item: AssignmentApiItem): DemoAssignment {
  return {
    id: item.id,
    title: item.title,
    subject: item.subject,
    grade: item.grade,
    classes: item.classes,
    type: item.type,
    dueAt: dueAtForDemo(item.dueAt),
    createdAt: item.createdAt ?? undefined,
    updatedAt: item.updatedAt ?? undefined,
    assignedCount: item.assignedCount,
    submitted: item.submitted,
    pending: item.pending,
    graded: item.graded,
    status: item.status as DemoAssignment['status'],
    topic: item.topic,
    sourceSummary: item.sourceSummary ?? undefined,
    briefTopics: item.briefTopics,
    studentInstructions: item.studentInstructions ?? undefined,
    handoutLayout: item.handoutLayout as DemoAssignment['handoutLayout'],
    sourceBookIds: item.sourceBookIds?.length ? [...item.sourceBookIds] : undefined,
    scopeTopics: item.scopeTopics?.length ? [...item.scopeTopics] : undefined,
    scopeRefinement: item.scopeRefinement ?? undefined,
    generateWithoutSources: item.generateWithoutSources,
    rigorProfile: item.rigorProfile,
    teacherNotes: item.teacherNotes ?? undefined,
    difficulty: item.difficulty ?? undefined,
  }
}

export function adaptDemoAssignmentToCreatePayload(a: DemoAssignment): AssignmentCreatePayload {
  return {
    title: a.title,
    subject: a.subject,
    grade: a.grade,
    classes: a.classes ?? [],
    type: a.type,
    rigorProfile: a.rigorProfile ?? 'Standard',
    dueAt: a.dueAt ? `${a.dueAt}T12:00:00.000Z` : null,
    studentInstructions: a.studentInstructions,
    teacherNotes: a.teacherNotes,
    status: (a.status as AssignmentCreatePayload['status']) ?? 'draft',
    sourceBookIds: a.sourceBookIds ?? [],
    scopeTopics: a.scopeTopics ?? [],
    scopeRefinement: a.scopeRefinement,
    generateWithoutSources: a.generateWithoutSources ?? false,
    difficulty: a.difficulty as AssignmentCreatePayload['difficulty'],
    briefTopics: a.briefTopics ?? [],
    handoutLayout: (a.handoutLayout as Record<string, unknown>) ?? null,
  }
}

export function adaptDemoAssignmentPatchToApiPatch(patch: Partial<DemoAssignment>): AssignmentPatchPayload {
  const out: AssignmentPatchPayload = {}
  if (patch.title !== undefined) out.title = patch.title
  if (patch.subject !== undefined) out.subject = patch.subject
  if (patch.grade !== undefined) out.grade = patch.grade
  if (patch.classes !== undefined) out.classes = patch.classes
  if (patch.type !== undefined) out.type = patch.type
  if (patch.dueAt !== undefined) out.dueAt = patch.dueAt ? `${patch.dueAt}T12:00:00.000Z` : null
  if (patch.status !== undefined) out.status = patch.status as AssignmentPatchPayload['status']
  if (patch.studentInstructions !== undefined) out.studentInstructions = patch.studentInstructions
  if (patch.briefTopics !== undefined) out.briefTopics = patch.briefTopics
  if (patch.handoutLayout !== undefined)
    out.handoutLayout = (patch.handoutLayout as Record<string, unknown>) ?? null
  if (patch.sourceBookIds !== undefined) out.sourceBookIds = patch.sourceBookIds
  if (patch.scopeTopics !== undefined) out.scopeTopics = patch.scopeTopics
  if (patch.scopeRefinement !== undefined) out.scopeRefinement = patch.scopeRefinement
  if (patch.generateWithoutSources !== undefined) out.generateWithoutSources = patch.generateWithoutSources
  if (patch.rigorProfile !== undefined) out.rigorProfile = patch.rigorProfile
  if (patch.teacherNotes !== undefined) out.teacherNotes = patch.teacherNotes
  if (patch.difficulty !== undefined) out.difficulty = patch.difficulty as AssignmentPatchPayload['difficulty']
  return out
}
