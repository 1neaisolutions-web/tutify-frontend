import type { Dispatch, SetStateAction } from 'react'
import { newDemoId } from '../demo/newDemoId'
import {
  demoAssignments,
  demoQuizzes,
  type DemoAssignment,
  type DemoExam,
  type DemoQuiz,
  type DemoWorksheet,
  TEACHER_TOOLS_SEED_ASSIGNMENT_IDS,
  TEACHER_TOOLS_SEED_QUIZ_IDS,
} from '../demo/teacherToolsDemoData'

/** Latency tuned so lists and writes feel like network calls (replace with real fetch later). */
export const TEACHER_TOOLS_LIST_DELAY_MS = 320
export const TEACHER_TOOLS_WRITE_DELAY_MS = 480

export async function withLatency<T>(ms: number, fn: () => T): Promise<T> {
  await new Promise((r) => setTimeout(r, ms))
  return fn()
}

export interface TeacherToolsSessionExtras {
  extraQuizzes: DemoQuiz[]
  extraAssignments: DemoAssignment[]
  extraWorksheets: DemoWorksheet[]
  extraExams: DemoExam[]
}

/** Default `T` is `object` so plain `{ ok: true }` success is valid (avoid `& Record<string, never>`). */
export type MutationResult<T extends object = object> =
  | ({ ok: true } & T)
  | { ok: false; error: 'READ_ONLY' | 'NOT_FOUND' | string }

export interface TeacherToolsMockApi {
  listQuizzes: () => Promise<DemoQuiz[]>
  getQuiz: (id: string) => Promise<DemoQuiz | undefined>
  createQuiz: (q: DemoQuiz) => Promise<void>
  updateQuiz: (id: string, patch: Partial<DemoQuiz>) => Promise<MutationResult>
  deleteQuiz: (id: string) => Promise<MutationResult>
  duplicateQuiz: (id: string) => Promise<MutationResult<{ id: string }>>

  listAssignments: () => Promise<DemoAssignment[]>
  getAssignment: (id: string) => Promise<DemoAssignment | undefined>
  createAssignment: (a: DemoAssignment) => Promise<{ id: string }>
  updateAssignment: (id: string, patch: Partial<DemoAssignment>) => Promise<MutationResult>
  deleteAssignment: (id: string) => Promise<MutationResult>
  duplicateAssignment: (id: string) => Promise<MutationResult<{ id: string }>>

  /** Extras-only stubs; `TeacherToolsDemoProvider` overrides with RTK + real API. */
  listWorksheets: () => Promise<DemoWorksheet[]>
  getWorksheet: (id: string) => Promise<DemoWorksheet | undefined>
  createWorksheet: (w: DemoWorksheet) => Promise<void>
  updateWorksheet: (id: string, patch: Partial<DemoWorksheet>) => Promise<MutationResult>
  deleteWorksheet: (id: string) => Promise<MutationResult>
  duplicateWorksheet: (id: string) => Promise<MutationResult<{ id: string }>>
}

export function createTeacherToolsMockApi(opts: {
  getExtras: () => TeacherToolsSessionExtras
  setExtras: Dispatch<SetStateAction<TeacherToolsSessionExtras>>
}): TeacherToolsMockApi {
  const { getExtras, setExtras } = opts

  return {
    listQuizzes: () =>
      withLatency(TEACHER_TOOLS_LIST_DELAY_MS, () => [...demoQuizzes, ...getExtras().extraQuizzes]),

    getQuiz: (id) =>
      withLatency(200, () => {
        const merged = [...demoQuizzes, ...getExtras().extraQuizzes]
        return merged.find((q) => q.id === id)
      }),

    createQuiz: async (q) => {
      await withLatency(TEACHER_TOOLS_WRITE_DELAY_MS, () => undefined)
      setExtras((e) => ({ ...e, extraQuizzes: [...e.extraQuizzes, q] }))
    },

    updateQuiz: async (id, patch) => {
      return withLatency(TEACHER_TOOLS_WRITE_DELAY_MS, () => {
        if (TEACHER_TOOLS_SEED_QUIZ_IDS.has(id))
          return { ok: false as const, error: 'READ_ONLY' as const } as MutationResult
        if (!getExtras().extraQuizzes.some((q) => q.id === id))
          return { ok: false as const, error: 'NOT_FOUND' } as MutationResult
        setExtras((e) => ({
          ...e,
          extraQuizzes: e.extraQuizzes.map((q) => (q.id === id ? { ...q, ...patch } : q)),
        }))
        return { ok: true as const } as MutationResult
      })
    },

    deleteQuiz: async (id) => {
      return withLatency(TEACHER_TOOLS_WRITE_DELAY_MS, () => {
        if (TEACHER_TOOLS_SEED_QUIZ_IDS.has(id))
          return { ok: false as const, error: 'READ_ONLY' as const } as MutationResult
        const had = getExtras().extraQuizzes.some((q) => q.id === id)
        if (!had) return { ok: false as const, error: 'NOT_FOUND' } as MutationResult
        setExtras((e) => ({ ...e, extraQuizzes: e.extraQuizzes.filter((q) => q.id !== id) }))
        return { ok: true as const } as MutationResult
      })
    },

    duplicateQuiz: async (id) => {
      return withLatency<MutationResult<{ id: string }>>(TEACHER_TOOLS_WRITE_DELAY_MS, () => {
        const merged = [...demoQuizzes, ...getExtras().extraQuizzes]
        const found = merged.find((q) => q.id === id)
        if (!found) return { ok: false as const, error: 'NOT_FOUND' }
        const copy: DemoQuiz = {
          ...found,
          id: newDemoId('quiz'),
          title: `${found.title} (copy)`,
          status: found.status === 'archived' ? 'draft' : found.status,
        }
        setExtras((e) => ({ ...e, extraQuizzes: [...e.extraQuizzes, copy] }))
        return { ok: true as const, id: copy.id }
      })
    },

    listAssignments: () =>
      withLatency(TEACHER_TOOLS_LIST_DELAY_MS, () => [...demoAssignments, ...getExtras().extraAssignments]),

    getAssignment: (id) =>
      withLatency(200, () => {
        const merged = [...demoAssignments, ...getExtras().extraAssignments]
        return merged.find((a) => a.id === id)
      }),

    createAssignment: async (a) => {
      await withLatency(TEACHER_TOOLS_WRITE_DELAY_MS, () => undefined)
      setExtras((e) => ({ ...e, extraAssignments: [...e.extraAssignments, a] }))
      return { id: a.id }
    },

    updateAssignment: async (id, patch) => {
      return withLatency(TEACHER_TOOLS_WRITE_DELAY_MS, () => {
        if (TEACHER_TOOLS_SEED_ASSIGNMENT_IDS.has(id))
          return { ok: false as const, error: 'READ_ONLY' as const } as MutationResult
        if (!getExtras().extraAssignments.some((a) => a.id === id))
          return { ok: false as const, error: 'NOT_FOUND' } as MutationResult
        setExtras((e) => ({
          ...e,
          extraAssignments: e.extraAssignments.map((a) => (a.id === id ? { ...a, ...patch } : a)),
        }))
        return { ok: true as const } as MutationResult
      })
    },

    deleteAssignment: async (id) => {
      return withLatency(TEACHER_TOOLS_WRITE_DELAY_MS, () => {
        if (TEACHER_TOOLS_SEED_ASSIGNMENT_IDS.has(id))
          return { ok: false as const, error: 'READ_ONLY' as const } as MutationResult
        if (!getExtras().extraAssignments.some((a) => a.id === id))
          return { ok: false as const, error: 'NOT_FOUND' } as MutationResult
        setExtras((e) => ({ ...e, extraAssignments: e.extraAssignments.filter((a) => a.id !== id) }))
        return { ok: true as const } as MutationResult
      })
    },

    duplicateAssignment: async (id) => {
      return withLatency<MutationResult<{ id: string }>>(TEACHER_TOOLS_WRITE_DELAY_MS, () => {
        const merged = [...demoAssignments, ...getExtras().extraAssignments]
        const found = merged.find((a) => a.id === id)
        if (!found) return { ok: false as const, error: 'NOT_FOUND' }
        const copy: DemoAssignment = {
          ...found,
          id: newDemoId('asg'),
          title: `${found.title} (copy)`,
        }
        setExtras((e) => ({ ...e, extraAssignments: [...e.extraAssignments, copy] }))
        return { ok: true as const, id: copy.id }
      })
    },

    listWorksheets: () => withLatency(TEACHER_TOOLS_LIST_DELAY_MS, () => [...getExtras().extraWorksheets]),

    getWorksheet: (id) =>
      withLatency(200, () => getExtras().extraWorksheets.find((w) => w.id === id)),

    createWorksheet: async (w) => {
      await withLatency(TEACHER_TOOLS_WRITE_DELAY_MS, () => undefined)
      setExtras((e) => ({ ...e, extraWorksheets: [...e.extraWorksheets, w] }))
    },

    updateWorksheet: async (id, patch) => {
      return withLatency(TEACHER_TOOLS_WRITE_DELAY_MS, () => {
        if (!getExtras().extraWorksheets.some((x) => x.id === id))
          return { ok: false as const, error: 'NOT_FOUND' } as MutationResult
        setExtras((e) => ({
          ...e,
          extraWorksheets: e.extraWorksheets.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        }))
        return { ok: true as const } as MutationResult
      })
    },

    deleteWorksheet: async (id) => {
      return withLatency(TEACHER_TOOLS_WRITE_DELAY_MS, () => {
        if (!getExtras().extraWorksheets.some((x) => x.id === id))
          return { ok: false as const, error: 'NOT_FOUND' } as MutationResult
        setExtras((e) => ({ ...e, extraWorksheets: e.extraWorksheets.filter((x) => x.id !== id) }))
        return { ok: true as const } as MutationResult
      })
    },

    duplicateWorksheet: async (id) => {
      return withLatency<MutationResult<{ id: string }>>(TEACHER_TOOLS_WRITE_DELAY_MS, () => {
        const found = getExtras().extraWorksheets.find((w) => w.id === id)
        if (!found) return { ok: false as const, error: 'NOT_FOUND' }
        const copy: DemoWorksheet = {
          ...found,
          id: newDemoId('ws'),
          title: `${found.title} (copy)`,
        }
        setExtras((e) => ({ ...e, extraWorksheets: [...e.extraWorksheets, copy] }))
        return { ok: true as const, id: copy.id }
      })
    },
  }
}
