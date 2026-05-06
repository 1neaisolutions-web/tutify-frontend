/* eslint-disable react-refresh/only-export-components -- session context + mock API hook */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createTeacherToolsMockApi, type TeacherToolsMockApi, type TeacherToolsSessionExtras } from './api/teacherToolsMockApi'
import { type DemoAssignment, type DemoExam, type DemoQuiz, type DemoWorksheet } from './demo/teacherToolsDemoData'
import * as examApi from '../../../api/examApi'
// @ts-expect-error — JS module
import { store } from '../../../redux/store'
import { quizApiSlice } from '../../../redux/features/teacherTools/quiz/quizApiSlice'
import { assignmentApiSlice } from '../../../redux/features/teacherTools/assignment/assignmentApiSlice'
import { worksheetApiSlice } from '../../../redux/features/teacherTools/worksheet/worksheetApiSlice'
import {
  adaptApiItemToDemoQuiz,
  adaptDemoQuizPatchToApiPatch,
  adaptDemoQuizToCreatePayload,
} from '../../../api/quizApiAdapters'
import {
  adaptApiItemToDemoAssignment,
  adaptDemoAssignmentPatchToApiPatch,
  adaptDemoAssignmentToCreatePayload,
} from '../../../api/assignmentApiAdapters'
import {
  adaptDemoWorksheetPatchToApiPatch,
  adaptDemoWorksheetToCreatePayload,
  worksheetApiItemToDemoWorksheet,
} from './worksheet/worksheetApiAdapters'

/** Untyped JS store — RTK Query `initiate` thunks are not on the inferred dispatch union. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appDispatch = store.dispatch as any

const STORAGE_KEY = 'teacherTools_session_v1'
const LEGACY_STORAGE_KEY = 'teacherToolsDemo_v1'
const PERSIST_VERSION = 1

export type TeacherToolsDemoExtras = TeacherToolsSessionExtras

function examApiItemToDemoExam(item: examApi.ExamApiItem): DemoExam {
  return {
    id: item.id,
    title: item.title,
    subject: item.subject,
    grade: item.grade,
    term: item.term,
    classes: item.classes,
    examType: item.examType,
    durationMinutes: item.durationMinutes,
    totalMarks: item.totalMarks,
    scheduleStart: item.scheduleStart ?? '',
    scheduleEnd: item.scheduleEnd ?? '',
    status: item.status,
    completionPct: item.completionPct,
    sourceSummary: item.sourceSummary ?? undefined,
    paper: item.paper as unknown as DemoExam['paper'],
    sections: item.sections as unknown as DemoExam['sections'],
    mcqs: item.mcqs as unknown as DemoExam['mcqs'],
    shorts: item.shorts as unknown as DemoExam['shorts'],
    longs: item.longs as unknown as DemoExam['longs'],
    handoutLayout: item.handoutLayout as DemoExam['handoutLayout'],
  }
}

function emptyExtras(): TeacherToolsDemoExtras {
  return {
    extraQuizzes: [],
    extraAssignments: [],
    extraWorksheets: [],
    extraExams: [],
  }
}

function parseExtras(raw: string | null): TeacherToolsDemoExtras | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as { v?: number } & Partial<TeacherToolsDemoExtras>
    if (parsed.v !== PERSIST_VERSION) return null
    return {
      extraQuizzes: Array.isArray(parsed.extraQuizzes) ? parsed.extraQuizzes : [],
      extraAssignments: Array.isArray(parsed.extraAssignments) ? parsed.extraAssignments : [],
      extraWorksheets: Array.isArray(parsed.extraWorksheets) ? parsed.extraWorksheets : [],
      extraExams: Array.isArray(parsed.extraExams) ? parsed.extraExams : [],
    }
  } catch {
    return null
  }
}

function loadExtras(): TeacherToolsDemoExtras {
  let raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) raw = sessionStorage.getItem(LEGACY_STORAGE_KEY)
  return parseExtras(raw) ?? emptyExtras()
}

export interface TeacherToolsDemoContextValue extends TeacherToolsDemoExtras {
  allQuizzes: DemoQuiz[]
  allAssignments: DemoAssignment[]
  allWorksheets: DemoWorksheet[]
  allExams: DemoExam[]
  api: TeacherToolsMockApi
}

const TeacherToolsDemoContext = createContext<TeacherToolsDemoContextValue | null>(null)

export function TeacherToolsDemoProvider({ children }: { children: ReactNode }) {
  const [extras, setExtras] = useState<TeacherToolsDemoExtras>(() => loadExtras())
  const extrasRef = useRef(extras)
  extrasRef.current = extras
  const [quizItems, setQuizItems] = useState<DemoQuiz[]>([])
  const [assignmentItems, setAssignmentItems] = useState<DemoAssignment[]>([])
  const [worksheetItems, setWorksheetItems] = useState<DemoWorksheet[]>([])
  const [examItems, setExamItems] = useState<DemoExam[]>([])

  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ v: PERSIST_VERSION, ...extras }))
      } catch {
        /* ignore quota */
      }
    }, 400)
    return () => window.clearTimeout(t)
  }, [extras])

  const api = useMemo<TeacherToolsMockApi>(() => {
    const mockApi = createTeacherToolsMockApi({
      getExtras: () => extrasRef.current,
      setExtras,
    })

    return {
      // ── REAL backend quiz methods ──────────────────────────────────────────
      listQuizzes: async () => {
        const res = await appDispatch(
          quizApiSlice.endpoints.listQuizzes.initiate({ page_size: 200 }, { forceRefetch: true }),
        ).unwrap()
        const mapped = res.items.map(adaptApiItemToDemoQuiz)
        setQuizItems(mapped)
        return mapped
      },

      getQuiz: async (id: string) => {
        try {
          const item = await appDispatch(quizApiSlice.endpoints.getQuiz.initiate(id)).unwrap()
          const mapped = adaptApiItemToDemoQuiz(item)
          setQuizItems((prev) => {
            const next = prev.some((q) => q.id === mapped.id) ? prev.map((q) => (q.id === mapped.id ? mapped : q)) : [...prev, mapped]
            return next
          })
          return mapped
        } catch {
          return undefined
        }
      },

      createQuiz: async (q: DemoQuiz) => {
        await appDispatch(
          quizApiSlice.endpoints.createQuiz.initiate(adaptDemoQuizToCreatePayload(q)),
        ).unwrap()
        await appDispatch(quizApiSlice.endpoints.listQuizzes.initiate({ page_size: 200 }, { forceRefetch: true })).unwrap().then((r: import('../../../api/quizApi').QuizListResponse) => {
          setQuizItems(r.items.map(adaptApiItemToDemoQuiz))
        })
      },

      updateQuiz: async (id: string, patch: Partial<DemoQuiz>) => {
        try {
          await appDispatch(
            quizApiSlice.endpoints.patchQuiz.initiate({ id, patch: adaptDemoQuizPatchToApiPatch(patch) }),
          ).unwrap()
          const refreshed = await appDispatch(quizApiSlice.endpoints.getQuiz.initiate(id, { forceRefetch: true })).unwrap()
          const mapped = adaptApiItemToDemoQuiz(refreshed)
          setQuizItems((prev) => prev.map((q) => (q.id === id ? mapped : q)))
          return { ok: true as const }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          if (status === 403) return { ok: false as const, error: 'READ_ONLY' }
          return { ok: false as const, error: String(err) }
        }
      },

      deleteQuiz: async (id: string) => {
        try {
          await appDispatch(quizApiSlice.endpoints.deleteQuiz.initiate(id)).unwrap()
          setQuizItems((prev) => prev.filter((q) => q.id !== id))
          return { ok: true as const }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          return { ok: false as const, error: String(err) }
        }
      },

      duplicateQuiz: async (id: string) => {
        try {
          const res = await appDispatch(quizApiSlice.endpoints.duplicateQuiz.initiate(id)).unwrap()
          await appDispatch(quizApiSlice.endpoints.listQuizzes.initiate({ page_size: 200 }, { forceRefetch: true })).unwrap().then((r: import('../../../api/quizApi').QuizListResponse) => {
            setQuizItems(r.items.map(adaptApiItemToDemoQuiz))
          })
          return { ok: true as const, id: res.id }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          return { ok: false as const, error: String(err) }
        }
      },

      // ── REAL backend assignment methods ────────────────────────────────────
      listAssignments: async () => {
        const res = await appDispatch(
          assignmentApiSlice.endpoints.listAssignments.initiate({ page_size: 200 }, { forceRefetch: true }),
        ).unwrap()
        const mapped = res.items.map(adaptApiItemToDemoAssignment)
        setAssignmentItems(mapped)
        return [...mapped, ...extrasRef.current.extraAssignments]
      },

      getAssignment: async (id: string) => {
        try {
          const item = await appDispatch(assignmentApiSlice.endpoints.getAssignment.initiate(id)).unwrap()
          const mapped = adaptApiItemToDemoAssignment(item)
          setAssignmentItems((prev) => {
            const next = prev.some((a) => a.id === mapped.id)
              ? prev.map((a) => (a.id === mapped.id ? mapped : a))
              : [...prev, mapped]
            return next
          })
          return mapped
        } catch {
          return undefined
        }
      },

      createAssignment: async (a: DemoAssignment) => {
        const created = await appDispatch(
          assignmentApiSlice.endpoints.createAssignment.initiate(adaptDemoAssignmentToCreatePayload(a)),
        ).unwrap()
        const mapped = adaptApiItemToDemoAssignment(created)
        setAssignmentItems((prev) => {
          if (prev.some((x) => x.id === mapped.id)) return prev.map((x) => (x.id === mapped.id ? mapped : x))
          return [...prev, mapped]
        })
        return { id: created.id }
      },

      updateAssignment: async (id: string, patch: Partial<DemoAssignment>) => {
        try {
          await appDispatch(
            assignmentApiSlice.endpoints.patchAssignment.initiate({
              id,
              patch: adaptDemoAssignmentPatchToApiPatch(patch),
            }),
          ).unwrap()
          const refreshed = await appDispatch(
            assignmentApiSlice.endpoints.getAssignment.initiate(id, { forceRefetch: true }),
          ).unwrap()
          const mapped = adaptApiItemToDemoAssignment(refreshed)
          setAssignmentItems((prev) => prev.map((x) => (x.id === id ? mapped : x)))
          return { ok: true as const }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          if (status === 403) return { ok: false as const, error: 'READ_ONLY' }
          return { ok: false as const, error: String(err) }
        }
      },

      deleteAssignment: async (id: string) => {
        try {
          await appDispatch(assignmentApiSlice.endpoints.deleteAssignment.initiate(id)).unwrap()
          setAssignmentItems((prev) => prev.filter((a) => a.id !== id))
          return { ok: true as const }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          return { ok: false as const, error: String(err) }
        }
      },

      duplicateAssignment: async (id: string) => {
        try {
          const res = await appDispatch(assignmentApiSlice.endpoints.duplicateAssignment.initiate(id)).unwrap()
          await appDispatch(
            assignmentApiSlice.endpoints.listAssignments.initiate({ page_size: 200 }, { forceRefetch: true }),
          ).unwrap()
          const mapped = await appDispatch(
            assignmentApiSlice.endpoints.getAssignment.initiate(res.id, { forceRefetch: true }),
          ).unwrap()
          setAssignmentItems((prev) =>
            prev.some((a) => a.id === res.id) ? prev : [...prev, adaptApiItemToDemoAssignment(mapped)],
          )
          return { ok: true as const, id: res.id }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          return { ok: false as const, error: String(err) }
        }
      },

      listWorksheets: async () => {
        const res = await appDispatch(
          worksheetApiSlice.endpoints.listWorksheets.initiate({ page_size: 200 }, { forceRefetch: true }),
        ).unwrap()
        const mapped = res.items.map(worksheetApiItemToDemoWorksheet)
        setWorksheetItems(mapped)
        return [...mapped, ...extrasRef.current.extraWorksheets]
      },

      getWorksheet: async (id: string) => {
        const extra = extrasRef.current.extraWorksheets.find((w) => w.id === id)
        if (extra) return extra
        try {
          const item = await appDispatch(worksheetApiSlice.endpoints.getWorksheet.initiate(id)).unwrap()
          const mapped = worksheetApiItemToDemoWorksheet(item)
          setWorksheetItems((prev) => {
            const next = prev.some((w) => w.id === mapped.id)
              ? prev.map((w) => (w.id === mapped.id ? mapped : w))
              : [...prev, mapped]
            return next
          })
          return mapped
        } catch {
          return undefined
        }
      },

      createWorksheet: async (w: DemoWorksheet) => {
        await appDispatch(
          worksheetApiSlice.endpoints.createWorksheet.initiate(adaptDemoWorksheetToCreatePayload(w)),
        ).unwrap()
        await appDispatch(
          worksheetApiSlice.endpoints.listWorksheets.initiate({ page_size: 200 }, { forceRefetch: true }),
        )
          .unwrap()
          .then((r: import('../../../api/worksheetApi').WorksheetListResponse) => {
            setWorksheetItems(r.items.map(worksheetApiItemToDemoWorksheet))
          })
      },

      updateWorksheet: async (id: string, patch: Partial<DemoWorksheet>) => {
        try {
          await appDispatch(
            worksheetApiSlice.endpoints.patchWorksheet.initiate({
              id,
              patch: adaptDemoWorksheetPatchToApiPatch(patch),
            }),
          ).unwrap()
          const refreshed = await appDispatch(
            worksheetApiSlice.endpoints.getWorksheet.initiate(id, { forceRefetch: true }),
          ).unwrap()
          const mapped = worksheetApiItemToDemoWorksheet(refreshed)
          setWorksheetItems((prev) => prev.map((x) => (x.id === id ? mapped : x)))
          return { ok: true as const }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          if (status === 403) return { ok: false as const, error: 'READ_ONLY' }
          return { ok: false as const, error: String(err) }
        }
      },

      deleteWorksheet: async (id: string) => {
        try {
          await appDispatch(worksheetApiSlice.endpoints.deleteWorksheet.initiate(id)).unwrap()
          setWorksheetItems((prev) => prev.filter((w) => w.id !== id))
          return { ok: true as const }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          return { ok: false as const, error: String(err) }
        }
      },

      duplicateWorksheet: async (id: string) => {
        try {
          const res = await appDispatch(worksheetApiSlice.endpoints.duplicateWorksheet.initiate(id)).unwrap()
          await appDispatch(
            worksheetApiSlice.endpoints.listWorksheets.initiate({ page_size: 200 }, { forceRefetch: true }),
          ).unwrap()
          const mapped = await appDispatch(
            worksheetApiSlice.endpoints.getWorksheet.initiate(res.id, { forceRefetch: true }),
          ).unwrap()
          setWorksheetItems((prev) =>
            prev.some((w) => w.id === res.id) ? prev : [...prev, worksheetApiItemToDemoWorksheet(mapped)],
          )
          return { ok: true as const, id: res.id }
        } catch (err: unknown) {
          const status = (err as { status?: number }).status
          if (status === 404) return { ok: false as const, error: 'NOT_FOUND' }
          return { ok: false as const, error: String(err) }
        }
      },

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    void api.listQuizzes()
    void api.listAssignments()
    void api.listWorksheets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await examApi.fetchExamList({ page: 1, page_size: 200 })
        const mapped = res.items.map(examApiItemToDemoExam)
        if (!cancelled) setExamItems(mapped)
      } catch {
        if (!cancelled) setExamItems([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<TeacherToolsDemoContextValue>(() => {
    const allQuizzes = quizItems
    const allAssignments = assignmentItems
    const allWorksheets = worksheetItems
    const allExams = examItems
    return {
      ...extras,
      allQuizzes,
      allAssignments,
      allWorksheets,
      allExams,
      api,
    }
  }, [extras, api, quizItems, assignmentItems, worksheetItems, examItems])

  return <TeacherToolsDemoContext.Provider value={value}>{children}</TeacherToolsDemoContext.Provider>
}

export function useTeacherToolsDemo(): TeacherToolsDemoContextValue {
  const ctx = useContext(TeacherToolsDemoContext)
  if (!ctx) {
    throw new Error('useTeacherToolsDemo must be used within TeacherToolsDemoProvider')
  }
  return ctx
}

export function useTeacherToolsApi(): TeacherToolsMockApi {
  return useTeacherToolsDemo().api
}
