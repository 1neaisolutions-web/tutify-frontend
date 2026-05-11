import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper } from '../components'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { SHORT_RESPONSE_LINES, clampResponseLines, formatSourceSummary } from '../demo/generationFromSources'
import type { QuestionMixMode, QuizDifficultyId } from '../demo/generationFromSources'
import type { WorksheetBlock } from '../demo/topicAwareGenerators'
import { GRADES, SUBJECTS } from '../types'
import type { DemoQuiz } from '../demo/teacherToolsDemoData'
import {
  useAddWorksheetBlockMutation,
  useAddWorksheetSessionMutation,
  useCreateWorksheetMutation,
  useDeleteWorksheetBlockMutation,
  useDeleteWorksheetSessionMutation,
  useGenerateWorksheetMutation,
  useLazyGetWorksheetQuery,
  usePatchWorksheetBlockMutation,
  usePatchWorksheetMutation,
  usePatchWorksheetSessionMutation,
  useRegenerateWorksheetBlockMutation,
  useReorderWorksheetBlocksMutation,
} from '../../../../redux/features/teacherTools/worksheet/worksheetApiSlice'
import {
  apiSessionsToLocal,
  localBlockToCreatePayload,
  localBlockToPatchPayload,
  type LocalWorksheetBlock,
  type LocalWorksheetSession,
} from './worksheetApiAdapters'
import { downloadQuizPdf } from '../utils/generateQuizPdf'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'
// @ts-expect-error — JS module
import { store } from '../../../../redux/store'
import { setBalance } from '../../../../redux/features/subscription/subscriptionSlice'
import { getCreditBalance } from '../../../../api/subscriptions'
import NoCreditsCard from '../../../../components/NoCreditsCard'
import { parseCreditErrorFromUnknown, type ParsedCreditError } from '../../../../utils/creditErrors'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appDispatch = store.dispatch as any
import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  FileJson,
  FolderPlus,
  Minus,
  Pencil,
  Plus,
  PlusCircle,
  Loader2,
  Printer,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { QuizGeneratingOverlay } from '../quiz/components/QuizGeneratingOverlay'
import { ShortAnswerHandoutLines, ShortAnswerStudentResponsePreview } from '../quiz/components/ShortAnswerHandoutLines'
import {
  DEFAULT_HANDOUT_LAYOUT,
  LINE_HEIGHT_PRESETS,
  QUESTION_GAP_PRESETS,
  RULED_LINE_SPACING_PRESETS,
  type HandoutLayoutOpts,
} from '../quiz/config/handoutLayoutConfig'
import { QUIZ_CREATION_STEPS } from '../quiz/config/quizCreationConfig'
import { useQuizRagScope } from '../quiz/hooks/useQuizRagScope'
import { validateRagWorksheetBuild } from './config/worksheetCreationConfig'
import { WorksheetRagIdentitySection, type WorksheetOutputFormat } from './components/WorksheetRagIdentitySection'
import { WorksheetGenerationParametersSection } from './components/WorksheetGenerationParametersSection'

const TYPE_ORDER = ['mcq', 'fill_blank', 'short', 'match'] as const
const TYPE_HEADING: Record<(typeof TYPE_ORDER)[number], string> = {
  mcq: 'MULTIPLE CHOICE',
  fill_blank: 'FILL IN THE BLANK',
  short: 'SHORT ANSWER',
  match: 'MATCHING',
}

function totalQuestionsInSessions(sessionList: LocalWorksheetSession[]): number {
  return sessionList.reduce((sum, s) => sum + s.blocks.length, 0)
}

function distinctBlockTypesInSessions(sessionList: LocalWorksheetSession[]): number {
  return new Set(sessionList.flatMap((s) => s.blocks.map((b) => b.type))).size
}

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

type WorksheetBlockEditForm =
  | { t: 'mcq'; prompt: string; optionsLines: string; answer: string }
  | { t: 'fill_blank'; prompt: string; answer: string }
  | { t: 'short'; prompt: string; sampleAnswer: string; responseLines: number }
  | { t: 'match'; leftLines: string; rightLines: string }

function blockToEditForm(block: WorksheetBlock): WorksheetBlockEditForm {
  if (block.type === 'mcq') {
    return { t: 'mcq', prompt: block.prompt, optionsLines: block.options.join('\n'), answer: block.answer }
  }
  if (block.type === 'fill_blank') {
    return { t: 'fill_blank', prompt: block.prompt, answer: block.answer }
  }
  if (block.type === 'short') {
    return {
      t: 'short',
      prompt: block.prompt,
      sampleAnswer: block.sampleAnswer,
      responseLines: clampResponseLines(block.responseLines),
    }
  }
  return { t: 'match', leftLines: block.left.join('\n'), rightLines: block.right.join('\n') }
}

function parseNonEmptyLines(s: string): string[] {
  return s
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

function buildBlockFromEditForm(
  form: WorksheetBlockEditForm,
  toast: { error: (msg: string) => void },
): WorksheetBlock | null {
  if (form.t === 'mcq') {
    const prompt = form.prompt.trim()
    const options = parseNonEmptyLines(form.optionsLines)
    const answer = form.answer.trim()
    if (!prompt) {
      toast.error('Add a question prompt.')
      return null
    }
    if (options.length < 2) {
      toast.error('Add at least two answer choices (one per line).')
      return null
    }
    if (!answer || !options.includes(answer)) {
      toast.error('Correct answer must exactly match one of the choice lines.')
      return null
    }
    return { type: 'mcq', prompt, options, answer }
  }
  if (form.t === 'fill_blank') {
    const prompt = form.prompt.trim()
    const answer = form.answer.trim()
    if (!prompt || !answer) {
      toast.error('Prompt and model answer are required.')
      return null
    }
    return { type: 'fill_blank', prompt, answer }
  }
  if (form.t === 'short') {
    const prompt = form.prompt.trim()
    if (!prompt) {
      toast.error('Prompt is required.')
      return null
    }
    return {
      type: 'short',
      prompt,
      sampleAnswer: form.sampleAnswer.trim(),
      responseLines: clampResponseLines(form.responseLines),
    }
  }
  const left = parseNonEmptyLines(form.leftLines)
  const right = parseNonEmptyLines(form.rightLines)
  if (left.length === 0 || right.length === 0) {
    toast.error('Add at least one row in each matching column.')
    return null
  }
  if (left.length !== right.length) {
    toast.error('Left and right columns must have the same number of lines (one pair per row).')
    return null
  }
  return { type: 'match', left, right }
}

type AddQuestionDraft = {
  kind: 'short' | 'mcq' | 'fill_blank' | 'match'
  prompt: string
  mcqOptions: string
  mcqAnswer: string
  fillAnswer: string
  matchLeft: string
  matchRight: string
}

function emptyAddQuestionDraft(): AddQuestionDraft {
  return {
    kind: 'short',
    prompt: '',
    mcqOptions: 'Option A\nOption B\nOption C\nOption D',
    mcqAnswer: 'Option B',
    fillAnswer: '',
    matchLeft: 'Term 1\nTerm 2',
    matchRight: 'Definition 1\nDefinition 2',
  }
}

function buildBlockFromAddDraft(
  draft: AddQuestionDraft,
  toast: { error: (msg: string) => void },
): WorksheetBlock | null {
  if (draft.kind === 'short') {
    const prompt = draft.prompt.trim()
    if (!prompt) {
      toast.error('Enter a question prompt.')
      return null
    }
    return { type: 'short', prompt, sampleAnswer: '', responseLines: SHORT_RESPONSE_LINES.default }
  }
  if (draft.kind === 'fill_blank') {
    return buildBlockFromEditForm(
      { t: 'fill_blank', prompt: draft.prompt, answer: draft.fillAnswer },
      toast,
    )
  }
  if (draft.kind === 'mcq') {
    return buildBlockFromEditForm(
      { t: 'mcq', prompt: draft.prompt, optionsLines: draft.mcqOptions, answer: draft.mcqAnswer },
      toast,
    )
  }
  return buildBlockFromEditForm(
    { t: 'match', leftLines: draft.matchLeft, rightLines: draft.matchRight },
    toast,
  )
}

function worksheetPreviewTypeLabel(block: WorksheetBlock): string {
  return TYPE_HEADING[block.type]
}

function worksheetMutationErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as { data?: unknown; message?: string }
    if (typeof e.message === 'string' && e.message && !e.message.startsWith('[')) {
      return e.message.length > 220 ? `${e.message.slice(0, 217)}…` : e.message
    }
    const d = e.data
    if (typeof d === 'string') return d.length > 220 ? `${d.slice(0, 217)}…` : d
    if (d && typeof d === 'object') {
      const det = (d as { detail?: unknown }).detail
      if (typeof det === 'string') return det.length > 220 ? `${det.slice(0, 217)}…` : det
      if (Array.isArray(det)) {
        const parts = det.map((x) => (typeof x === 'object' && x !== null && 'msg' in x ? String((x as { msg: string }).msg) : JSON.stringify(x)))
        return parts.join('; ').slice(0, 240)
      }
    }
  }
  return 'Request failed.'
}

function WorksheetPreviewBlockContent({
  block,
  ruledLineSpacingPx,
}: {
  block: WorksheetBlock
  ruledLineSpacingPx: number
}) {
  if (block.type === 'mcq') {
    return (
      <div>
        <p className="whitespace-pre-wrap text-[15px] font-medium leading-snug text-gray-900">{block.prompt}</p>
        <ol className="mt-3 list-[lower-alpha] space-y-2 pl-6 text-[14px] leading-snug text-gray-800 marker:font-medium">
          {block.options.map((o, i) => (
            <li key={i} className="whitespace-pre-wrap pl-1">
              {o}
            </li>
          ))}
        </ol>
        <p className="mt-3 border-t border-gray-100 pt-2 text-xs text-gray-500">
          Answer key: <span className="font-medium text-gray-700">{block.answer}</span>
        </p>
      </div>
    )
  }
  if (block.type === 'fill_blank') {
    return <p className="whitespace-pre-wrap text-[15px] font-medium leading-snug text-gray-900">{block.prompt}</p>
  }
  if (block.type === 'short') {
    return (
      <div>
        <p className="whitespace-pre-wrap text-[15px] font-medium leading-snug text-gray-900">{block.prompt}</p>
        <ShortAnswerHandoutLines
          responseLines={block.responseLines}
          ruledLineSpacingPx={ruledLineSpacingPx}
          lineStyle="print"
        />
      </div>
    )
  }
  const rowCount = Math.max(block.left.length, block.right.length)
  return (
    <div className="mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-2 divide-x divide-gray-200 bg-gray-50/90 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
        <div className="px-3 py-2">Terms / concepts</div>
        <div className="px-3 py-2">Definitions / roles</div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-gray-200 text-[14px]">
        <div className="divide-y divide-gray-100">
          {Array.from({ length: rowCount }, (_, i) => (
            <div key={`l-${i}`} className="min-h-[2.75rem] px-3 py-2.5 leading-snug">
              <span className="font-semibold tabular-nums text-gray-500">{i + 1}.</span>{' '}
              <span className="text-gray-900">{block.left[i] ?? '—'}</span>
            </div>
          ))}
        </div>
        <div className="divide-y divide-gray-100">
          {Array.from({ length: rowCount }, (_, i) => (
            <div key={`r-${i}`} className="min-h-[2.75rem] px-3 py-2.5 leading-snug text-gray-800">
              <span className="font-semibold tabular-nums text-gray-400">{String.fromCharCode(65 + i)}.</span>{' '}
              <span>{block.right[i] ?? '—'}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="border-t border-gray-100 bg-gray-50/50 px-3 py-2 text-[11px] text-gray-500">
        Students draw lines or write letters to match each numbered term to a definition.
      </p>
    </div>
  )
}

export default function WorksheetCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const templateToastRef = useRef(false)
  /** Stable target for “add question” save — avoids stale session id if state batches oddly. */
  const addQuestionTargetSessionRef = useRef<string | null>(null)
  const { worksheetId } = useParams<{ worksheetId?: string }>()
  const isEdit = location.pathname.endsWith('/edit')
  const { toast } = useSnackbar()
  const hasCredits = useSelector((s: any) => (s?.subscription?.hasActiveCredits ?? false) || (s?.subscription?.balance ?? 0) > 0)
  const worksheetIdRef = useRef<string | null>(worksheetId ?? null)
  const idempotencyKeyRef = useRef<string>(typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`)

  const refreshCredits = useCallback(() => {
    void getCreditBalance()
      .then((b) => appDispatch(setBalance(b)))
      .catch(() => {})
  }, [])

  useEffect(() => {
    worksheetIdRef.current = worksheetId ?? worksheetIdRef.current
  }, [worksheetId])
  const [getWorksheet] = useLazyGetWorksheetQuery()
  const [createWorksheet] = useCreateWorksheetMutation()
  const [patchWorksheet] = usePatchWorksheetMutation()
  const [generateWorksheetMutation] = useGenerateWorksheetMutation()
  const [addWorksheetSessionMutation] = useAddWorksheetSessionMutation()
  const [deleteWorksheetSessionMutation] = useDeleteWorksheetSessionMutation()
  const [patchWorksheetSessionMutation] = usePatchWorksheetSessionMutation()
  const [addWorksheetBlockMutation] = useAddWorksheetBlockMutation()
  const [patchWorksheetBlockMutation] = usePatchWorksheetBlockMutation()
  const [deleteWorksheetBlockMutation] = useDeleteWorksheetBlockMutation()
  const [reorderWorksheetBlocksMutation] = useReorderWorksheetBlocksMutation()
  const [regenerateWorksheetBlockMutation] = useRegenerateWorksheetBlockMutation()

  const [ragHydration, setRagHydration] = useState<{
    sourceBookIds: string[]
    scopeTopics: string[]
    scopeRefinement: string
    generateWithoutSources: boolean
  } | null>(null)

  const [phase, setPhase] = useState<'build' | 'review'>('build')
  const [generating, setGenerating] = useState(false)
  const [genProgress, setGenProgress] = useState(0.15)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [creditGate, setCreditGate] = useState<ParsedCreditError | null>(null)
  const [blockRegenCreditGate, setBlockRegenCreditGate] = useState<ParsedCreditError | null>(null)

  useEffect(() => {
    if (!hasCredits) return
    if (creditGate) setCreditGate(null)
    if (blockRegenCreditGate) setBlockRegenCreditGate(null)
  }, [hasCredits])
  const [buildErrors, setBuildErrors] = useState<string[]>([])
  const [sessions, setSessions] = useState<LocalWorksheetSession[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [handoutLayout, setHandoutLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)
  const [draftLayout, setDraftLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)

  const [title, setTitle] = useState('Practice worksheet')
  const [subject, setSubject] = useState<string>(SUBJECTS[3])
  const [grade, setGrade] = useState<string>(GRADES[3])
  const [outputFormat, setOutputFormat] = useState<WorksheetOutputFormat>('interactive_digital')
  const [mixMode, setMixMode] = useState<QuestionMixMode>('balanced')
  const [questionCount, setQuestionCount] = useState(10)
  const [countMcq, setCountMcq] = useState(3)
  const [countFillBlank, setCountFillBlank] = useState(2)
  const [countShort, setCountShort] = useState(3)
  const [countMatch, setCountMatch] = useState(2)
  const [difficulty, setDifficulty] = useState<QuizDifficultyId>('standard')
  const [includeMcq, setIncludeMcq] = useState(true)
  const [includeFillBlank, setIncludeFillBlank] = useState(true)
  const [includeShort, setIncludeShort] = useState(true)
  const [includeMatch, setIncludeMatch] = useState(true)
  const [teacherNotes, setTeacherNotes] = useState('')

  const [discardOpen, setDiscardOpen] = useState(false)
  const [loadedTopic, setLoadedTopic] = useState<string | undefined>(undefined)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [saveDraftPending, setSaveDraftPending] = useState(false)
  const [usageMeta, setUsageMeta] = useState({ createdAt: '', usageCount: 0 })
  const [editingRef, setEditingRef] = useState<{ sessionId: string; blockIndex: number } | null>(null)
  const [editForm, setEditForm] = useState<WorksheetBlockEditForm | null>(null)
  const [addingBlockOpen, setAddingBlockOpen] = useState(false)
  const [addingBlockSessionId, setAddingBlockSessionId] = useState<string | null>(null)
  const [addQuestionDraft, setAddQuestionDraft] = useState<AddQuestionDraft>(() => emptyAddQuestionDraft())
  const [regeneratingAll, setRegeneratingAll] = useState(false)
  const [regeneratingBlockKey, setRegeneratingBlockKey] = useState<string | null>(null)

  const rag = useQuizRagScope({
    subject,
    grade,
    initialSelectedBookIds: ragHydration?.sourceBookIds,
    initialScopeTopics: ragHydration?.scopeTopics,
    initialScopeRefinement: ragHydration ? ragHydration.scopeRefinement : loadedTopic,
    initialGenerateWithoutSources: ragHydration?.generateWithoutSources,
  })

  const previewSections = useMemo(() => {
    let n = 0
    return sessions.map((session) => ({
      session,
      items: session.blocks.map((block) => {
        n += 1
        return { block, number: n }
      }),
    }))
  }, [sessions])

  useEffect(() => {
    if (isEdit) return
    const titleParam = searchParams.get('title')
    if (titleParam) setTitle(titleParam)
    const sub = searchParams.get('subject')
    const subOk = SUBJECTS.find((s) => s === sub)
    if (subOk) setSubject(subOk)
    const gr = searchParams.get('grade')
    const grOk = GRADES.find((g) => g === gr)
    if (grOk) setGrade(grOk)
    const topic = searchParams.get('topic')
    if (topic) setLoadedTopic(topic)
    const fmt = searchParams.get('format')
    if (fmt === 'printable_pdf' || fmt === 'interactive_digital' || fmt === 'both') {
      setOutputFormat(fmt as WorksheetOutputFormat)
    }
    if (searchParams.get('fromTemplate') && !templateToastRef.current) {
      templateToastRef.current = true
      toast.success('Prefilled from template')
    }
  }, [isEdit, searchParams, toast])

  useEffect(() => {
    if (!isEdit || !worksheetId) {
      setHydrateReady(true)
      return
    }
    let cancelled = false
    setHydrateReady(false)
    ;(async () => {
      try {
        const w = await getWorksheet(worksheetId).unwrap()
        if (cancelled) return
        worksheetIdRef.current = w.id
        setTitle(w.title)
        setSubject(w.subject)
        setGrade(w.grade)
        setOutputFormat(w.outputFormat)
        setLoadedTopic(w.topic)
        setTeacherNotes(w.teacherNotes ?? '')
        if (w.difficulty === 'foundation' || w.difficulty === 'standard' || w.difficulty === 'challenge') {
          setDifficulty(w.difficulty)
        }
        setUsageMeta({
          createdAt: typeof w.createdAt === 'string' ? w.createdAt.slice(0, 10) : '',
          usageCount: w.submissionCount,
        })
        setRagHydration({
          sourceBookIds: w.sourceBookIds ?? [],
          scopeTopics: w.scopeTopics ?? [],
          scopeRefinement: w.scopeRefinement ?? '',
          generateWithoutSources: Boolean(w.generateWithoutSources),
        })
        setSessions(apiSessionsToLocal(w.sessions ?? []))
        if (w.handoutLayout && typeof w.handoutLayout === 'object') {
          const next = { ...DEFAULT_HANDOUT_LAYOUT, ...(w.handoutLayout as HandoutLayoutOpts) }
          setHandoutLayout(next)
          setDraftLayout(next)
        }
        if ((w.sessions ?? []).some((s) => (s.blocks?.length ?? 0) > 0)) {
          setPhase('review')
        }
        setHydrateReady(true)
      } catch {
        if (cancelled) return
        toast.error('Worksheet not found')
        navigate('/teacher-tools/worksheet')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [getWorksheet, isEdit, navigate, toast, worksheetId])

  const regenerate = useCallback(async () => {
    const wsId = worksheetId ?? worksheetIdRef.current
    if (!wsId) {
      toast.error('Worksheet id missing. Reload the page or run Generate from the build step.')
      return
    }
    idempotencyKeyRef.current =
      typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
    setCreditGate(null)
    setBlockRegenCreditGate(null)
    setRegeneratingAll(true)
    try {
      const result = await generateWorksheetMutation({
        id: wsId,
        payload: {
          questionCount: totalQuestionsInSessions(sessions) || questionCount,
          mixMode,
          includeMcq,
          includeFillBlank,
          includeShort,
          includeMatch,
          countsByType: { mcq: countMcq, fill_blank: countFillBlank, short: countShort, match: countMatch },
          difficulty,
          teacherNotes: teacherNotes.trim() || undefined,
        },
        idempotencyKey: idempotencyKeyRef.current,
      }).unwrap()
      setSessions(apiSessionsToLocal(result.worksheet.sessions))
      const warn = result.warnings?.[0]
      if (warn) toast.warning(warn)
      else toast.success('Worksheet regenerated from sources.')
      refreshCredits()
    } catch (err) {
      const credit = parseCreditErrorFromUnknown(err)
      if (credit) {
        setCreditGate(credit)
        return
      }
      toast.error(worksheetMutationErrorMessage(err))
    } finally {
      setRegeneratingAll(false)
    }
  }, [
    worksheetId,
    sessions,
    questionCount,
    mixMode,
    includeMcq,
    includeFillBlank,
    includeShort,
    includeMatch,
    countMcq,
    countFillBlank,
    countShort,
    countMatch,
    difficulty,
    teacherNotes,
    toast,
    generateWorksheetMutation,
    refreshCredits,
  ])

  const addSession = async () => {
    const wsId = worksheetId ?? worksheetIdRef.current
    if (!wsId) {
      toast.error('Generate the worksheet first.')
      return
    }
    try {
      const updated = await addWorksheetSessionMutation({
        worksheetId: wsId,
        payload: { title: `Session ${sessions.length + 1}` },
      }).unwrap()
      setSessions(apiSessionsToLocal(updated.sessions))
      toast.success('Session added')
    } catch {
      toast.error('Could not add session')
    }
  }

  const removeSession = async (sessionId: string) => {
    const wsId = worksheetId ?? worksheetIdRef.current
    if (!wsId) return
    if (sessions.length <= 1) {
      toast.error('Keep at least one session.')
      return
    }
    const idx = sessions.findIndex((s) => s.id === sessionId)
    if (idx < 0) return
    const victim = sessions[idx]!
    const rest = sessions.filter((s) => s.id !== sessionId)
    const targetIdx = Math.max(0, idx - 1)
    const targetSessionId = rest[targetIdx]?.id
    if (!targetSessionId) return
    try {
      for (const b of victim.blocks) {
        const updated = await addWorksheetBlockMutation({
          worksheetId: wsId,
          sessionId: targetSessionId,
          block: localBlockToCreatePayload(b),
        }).unwrap()
        setSessions(apiSessionsToLocal(updated.sessions))
      }
      const updated = await deleteWorksheetSessionMutation({ worksheetId: wsId, sessionId }).unwrap()
      setSessions(apiSessionsToLocal(updated.sessions))
      toast.success('Session removed — its questions were merged into the session above.')
    } catch {
      toast.error('Could not remove session')
    }
  }

  const updateSessionTitleLocal = (sessionId: string, title: string) => {
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, title } : s)))
  }

  const flushSessionTitle = async (sessionId: string, title: string) => {
    const wsId = worksheetId ?? worksheetIdRef.current
    if (!wsId) return
    try {
      const updated = await patchWorksheetSessionMutation({
        worksheetId: wsId,
        sessionId,
        patch: { title },
      }).unwrap()
      setSessions(apiSessionsToLocal(updated.sessions))
    } catch {
      toast.error('Could not save session title')
    }
  }

  const closeBlockEditor = () => {
    setEditingRef(null)
    setEditForm(null)
  }

  const editBlock = (sessionId: string, blockIndex: number) => {
    const session = sessions.find((s) => s.id === sessionId)
    const block = session?.blocks[blockIndex]
    if (!block) return
    setEditingRef({ sessionId, blockIndex })
    setEditForm(blockToEditForm(block))
  }

  const openAddQuestion = (sessionId: string) => {
    addQuestionTargetSessionRef.current = sessionId
    setAddingBlockSessionId(sessionId)
    setAddQuestionDraft(emptyAddQuestionDraft())
    setAddingBlockOpen(true)
  }

  const closeAddQuestion = () => {
    addQuestionTargetSessionRef.current = null
    setAddingBlockOpen(false)
    setAddingBlockSessionId(null)
    setAddQuestionDraft(emptyAddQuestionDraft())
  }

  const handleRegenerateBlock = async (sessionId: string, blockIndex: number) => {
    const wsId = worksheetId ?? worksheetIdRef.current
    if (!wsId) {
      toast.error('Worksheet id missing. Reload the page or run Generate first.')
      return
    }
    const session = sessions.find((s) => s.id === sessionId)
    const block = session?.blocks[blockIndex] as LocalWorksheetBlock | undefined
    if (!block?._id) {
      toast.error('This question has no server id yet. Reload the worksheet, then try again.')
      return
    }
    const rk = `${sessionId}:${block._id}`
    setBlockRegenCreditGate(null)
    setRegeneratingBlockKey(rk)
    try {
      const updated = await regenerateWorksheetBlockMutation({
        worksheetId: wsId,
        sessionId,
        blockId: block._id,
      }).unwrap()
      setSessions(apiSessionsToLocal(updated.sessions))
      toast.success('Question replaced with a new version.')
      refreshCredits()
    } catch (err) {
      const credit = parseCreditErrorFromUnknown(err)
      if (credit) {
        setBlockRegenCreditGate(credit)
        return
      }
      toast.error(worksheetMutationErrorMessage(err))
    } finally {
      setRegeneratingBlockKey(null)
    }
  }

  const handleDeleteBlock = async (sessionId: string, blockIndex: number) => {
    const wsId = worksheetId ?? worksheetIdRef.current
    if (!wsId) return
    const total = totalQuestionsInSessions(sessions)
    if (total <= 1) {
      toast.error('Keep at least one question block, or go back to edit requirements.')
      return
    }
    const session = sessions.find((s) => s.id === sessionId)
    const block = session?.blocks[blockIndex] as LocalWorksheetBlock | undefined
    if (!block?._id) return
    try {
      const updated = await deleteWorksheetBlockMutation({
        worksheetId: wsId,
        sessionId,
        blockId: block._id,
      }).unwrap()
      setSessions(apiSessionsToLocal(updated.sessions))
      toast.success('Block removed')
    } catch {
      toast.error('Could not remove block')
    }
  }

  const moveBlockInSession = async (sessionId: string, blockIndex: number, direction: -1 | 1) => {
    const wsId = worksheetId ?? worksheetIdRef.current
    if (!wsId) return
    const session = sessions.find((s) => s.id === sessionId)
    if (!session) return
    const target = blockIndex + direction
    if (target < 0 || target >= session.blocks.length) return
    const reordered = [...session.blocks]
    const [row] = reordered.splice(blockIndex, 1)
    reordered.splice(target, 0, row)
    const order = reordered.map((b, i) => ({ id: (b as LocalWorksheetBlock)._id, sort_order: i }))
    if (order.some((o) => !o.id)) {
      toast.error('Missing block ids — save worksheet again.')
      return
    }
    try {
      const updated = await reorderWorksheetBlocksMutation({
        worksheetId: wsId,
        sessionId,
        order,
      }).unwrap()
      setSessions(apiSessionsToLocal(updated.sessions))
    } catch {
      toast.error('Could not reorder blocks')
    }
  }

  const runGeneration = useCallback(async () => {
    const v = validateRagWorksheetBuild({
      title,
      generateWithoutSources: rag.generateWithoutSources,
      selectedBookIds: rag.selectedBookIds,
      selectedTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement,
      mixMode,
      questionCount,
      includeMcq,
      includeFillBlank,
      includeShort,
      includeMatch,
      countsByType: { mcq: countMcq, fill_blank: countFillBlank, short: countShort, match: countMatch },
    })
    if (!v.ok) {
      setBuildErrors(v.errors)
      toast.error('Fix the highlighted fields to generate.')
      return
    }
    setBuildErrors([])
    setGenerationError(null)
    setCreditGate(null)
    setBlockRegenCreditGate(null)
    setGenerating(true)
    setGenProgress(0.12)
    const steps = window.setInterval(() => {
      setGenProgress((p) => Math.min(0.92, p + Math.random() * 0.12))
    }, 450)
    try {
      let wsId = worksheetId ?? worksheetIdRef.current
      if (!wsId) {
        const created = await createWorksheet({
          title: title.trim() || 'Untitled worksheet',
          subject,
          grade,
          outputFormat,
          classes: [classKeyForGrade(grade)],
          sourceBookIds: rag.selectedBookIds,
          scopeTopics: rag.selectedTopics,
          scopeRefinement: rag.scopeRefinement.trim() || undefined,
          generateWithoutSources: rag.generateWithoutSources,
          difficulty,
          teacherNotes: teacherNotes.trim() || undefined,
          status: 'draft',
        }).unwrap()
        wsId = created.id
        worksheetIdRef.current = wsId
        navigate(`/teacher-tools/worksheet/${wsId}/edit`, { replace: true })
      } else {
        await patchWorksheet({
          id: wsId,
          patch: {
            title: title.trim() || 'Untitled worksheet',
            subject,
            grade,
            outputFormat,
            classes: [classKeyForGrade(grade)],
            sourceBookIds: rag.selectedBookIds,
            scopeTopics: rag.selectedTopics,
            scopeRefinement: rag.scopeRefinement.trim() || undefined,
            generateWithoutSources: rag.generateWithoutSources,
            difficulty,
            teacherNotes: teacherNotes.trim() || undefined,
          },
        }).unwrap()
      }
      idempotencyKeyRef.current =
        typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
      const result = await generateWorksheetMutation({
        id: wsId,
        payload: {
          questionCount,
          mixMode,
          includeMcq,
          includeFillBlank,
          includeShort,
          includeMatch,
          countsByType: { mcq: countMcq, fill_blank: countFillBlank, short: countShort, match: countMatch },
          difficulty,
          teacherNotes: teacherNotes.trim() || undefined,
        },
        idempotencyKey: idempotencyKeyRef.current,
      }).unwrap()
      setSessions(apiSessionsToLocal(result.worksheet.sessions))
      setPhase('review')
      if (result.warnings.length > 0) toast.warning(result.warnings[0] ?? '')
      else toast.success('Worksheet generated — review below.')
      refreshCredits()
    } catch (err) {
      const credit = parseCreditErrorFromUnknown(err)
      if (credit) {
        setCreditGate(credit)
        setGenerationError(null)
        return
      }
      setGenerationError('Generation failed. Please retry.')
      toast.error(worksheetMutationErrorMessage(err))
    } finally {
      window.clearInterval(steps)
      setGenerating(false)
      setGenProgress(1)
    }
  }, [
    worksheetId,
    title,
    subject,
    grade,
    outputFormat,
    rag,
    difficulty,
    mixMode,
    questionCount,
    includeMcq,
    includeFillBlank,
    includeShort,
    includeMatch,
    countMcq,
    countFillBlank,
    countShort,
    countMatch,
    teacherNotes,
    toast,
    navigate,
    createWorksheet,
    patchWorksheet,
    generateWorksheetMutation,
    refreshCredits,
  ])

  const handleSaveDraft = async () => {
    const wsId = worksheetId ?? worksheetIdRef.current
    if (!wsId) {
      toast.error('Generate first.')
      return
    }
    if (totalQuestionsInSessions(sessions) === 0) {
      toast.error('Generate at least one block before saving a draft.')
      return
    }
    setSaveDraftPending(true)
    try {
      await patchWorksheet({
        id: wsId,
        patch: { status: 'draft', handoutLayout },
      }).unwrap()
      toast.success('Draft saved')
      navigate(`/teacher-tools/worksheet/${wsId}`)
    } catch {
      toast.error('Could not save draft')
    } finally {
      setSaveDraftPending(false)
    }
  }

  const handlePublish = async () => {
    const wsId = worksheetId ?? worksheetIdRef.current
    if (!wsId) {
      toast.error('Generate first.')
      return
    }
    if (totalQuestionsInSessions(sessions) === 0) {
      toast.error('Generate at least one block before publishing.')
      return
    }
    setPublishPending(true)
    try {
      await patchWorksheet({
        id: wsId,
        patch: { status: 'published', handoutLayout },
      }).unwrap()
      toast.success(isEdit ? 'Worksheet updated' : 'Worksheet published')
      navigate('/teacher-tools/worksheet')
    } catch {
      toast.error('Could not publish')
    } finally {
      setPublishPending(false)
    }
  }

  const goList = () => navigate('/teacher-tools/worksheet')

  const exportPdf = () => {
    let ordinal = 0
    const stubs = sessions.flatMap((session) =>
      session.blocks.map((b, bi) => {
        ordinal += 1
        const base =
          'prompt' in b ? b.prompt : `${(b as { left: string[] }).left.join(', ')} → ${(b as { right: string[] }).right.join(', ')}`
        const prompt = bi === 0 ? `【${session.title}】\n\n${base}` : base
        return {
          id: `ws-${ordinal}`,
          type: b.type === 'mcq' ? ('mcq' as const) : b.type === 'match' ? ('tf' as const) : ('short' as const),
          prompt,
          points: 2,
          options: b.type === 'mcq' && 'options' in b ? b.options : undefined,
          responseLines: b.type === 'short' ? clampResponseLines(b.responseLines) : 3,
        }
      }),
    )
    const payload: DemoQuiz = {
      id:
        worksheetId ??
        worksheetIdRef.current ??
        (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `ws-preview-${Date.now()}`),
      title: `${title || 'Worksheet'} — Handout`,
      subject,
      grade,
      classes: [classKeyForGrade(grade)],
      questions: stubs.length,
      totalMarks: stubs.length * 2,
      timeLimitMinutes: 30,
      status: 'draft',
      submissionCount: 0,
      avgScore: 0,
      topic: rag.combinedTopicLabel,
      sourceSummary: formatSourceSummary(rag.getGenerationContext()),
      questionStubs: stubs,
      studentInstructions: 'Complete all worksheet items.',
      handoutLayout,
    }
    try {
      downloadQuizPdf(payload, `${(title || 'worksheet').replace(/\s+/g, '-').slice(0, 32)}-worksheet.pdf`)
      toast.success('PDF downloaded')
    } catch {
      toast.error('Could not generate PDF')
    }
  }

  if (isEdit && !hydrateReady) {
    return (
      <div className="min-h-[40vh] space-y-3 p-8">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-32 max-w-xl animate-pulse rounded-2xl bg-gray-100" />
        <p className="text-sm text-gray-600">Loading worksheet…</p>
      </div>
    )
  }

  const wizardStep = phase === 'build' ? 0 : 1

  const reviewSourceTag = rag.generateWithoutSources ? 'Topic-only' : 'Sources selected'

  const totalQs = totalQuestionsInSessions(sessions)
  const typeCount = distinctBlockTypesInSessions(sessions)

  return (
    <div className="space-y-6 pb-10">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit worksheet' : 'Create worksheet'}
        subtitle={
          isEdit && usageMeta.createdAt
            ? `Created ${usageMeta.createdAt} · ${usageMeta.usageCount} submission${usageMeta.usageCount === 1 ? '' : 's'}. Configure scope and settings, generate, then review and publish.`
            : 'Configure scope and settings, generate the worksheet, then review and publish.'
        }
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Worksheet', to: '/teacher-tools/worksheet' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />

      <TeacherToolsWizardStepper
        steps={[...QUIZ_CREATION_STEPS]}
        current={wizardStep}
        onStepClick={(i) => {
          if (i === 1 && totalQuestionsInSessions(sessions) === 0) {
            toast.error('Generate the worksheet first to open review.')
            return
          }
          setPhase(i === 0 ? 'build' : 'review')
        }}
      />

      <QuizGeneratingOverlay open={generating} progress={genProgress} />
      {generationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {generationError}
          <button type="button" className="ml-3 font-semibold underline" onClick={() => setGenerationError(null)}>
            Dismiss
          </button>
        </div>
      )}

      {creditGate && (
        <NoCreditsCard
          reason={creditGate.reason}
          balance={creditGate.balance}
          required={creditGate.required}
          onActivated={() => setCreditGate(null)}
        />
      )}

      {phase === 'build' && (
        <div className="space-y-10">
          <WorksheetRagIdentitySection
            rag={rag}
            title={title}
            onTitleChange={setTitle}
            outputFormat={outputFormat}
            onOutputFormatChange={setOutputFormat}
            subject={subject}
            onSubjectChange={setSubject}
            grade={grade}
            onGradeChange={setGrade}
          />

          <WorksheetGenerationParametersSection
            mixMode={mixMode}
            onMixModeChange={setMixMode}
            questionCount={questionCount}
            onQuestionCountChange={setQuestionCount}
            countMcq={countMcq}
            countFillBlank={countFillBlank}
            countShort={countShort}
            countMatch={countMatch}
            onCountMcq={setCountMcq}
            onCountFillBlank={setCountFillBlank}
            onCountShort={setCountShort}
            onCountMatch={setCountMatch}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            includeMcq={includeMcq}
            includeFillBlank={includeFillBlank}
            includeShort={includeShort}
            includeMatch={includeMatch}
            onToggleMcq={setIncludeMcq}
            onToggleFillBlank={setIncludeFillBlank}
            onToggleShort={setIncludeShort}
            onToggleMatch={setIncludeMatch}
            teacherNotes={teacherNotes}
            onTeacherNotesChange={setTeacherNotes}
            validationErrors={buildErrors}
          />

          <div className="sticky bottom-4 z-10 mt-8 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Ready to generate worksheet content</p>
              <p className="mt-0.5 text-xs text-gray-600">
                Uses generation parameters together with basics and sources above.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void runGeneration()}
              disabled={generating}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 disabled:opacity-60"
            >
              {generating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Generating…
                </>
              ) : (
                'Generate worksheet'
              )}
            </button>
          </div>
        </div>
      )}

      {phase === 'review' && blockRegenCreditGate && (
        <NoCreditsCard
          compact
          reason={blockRegenCreditGate.reason}
          balance={blockRegenCreditGate.balance}
          required={blockRegenCreditGate.required}
          onActivated={() => setBlockRegenCreditGate(null)}
        />
      )}

      {phase === 'review' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">REVIEW</p>
              <h2 className="mt-1 text-lg font-semibold text-gray-900">Generated question set</h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-600">
                Organise content into sessions, edit prompts per item, reorder within a session, then publish. Print preview and PDF include session titles.
              </p>
              <p className="mt-2 text-xs text-gray-500">{reviewSourceTag}</p>
            </div>
            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{totalQs}</p>
                  <p className="text-xs text-gray-500">Questions</p>
                </div>
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{sessions.length}</p>
                  <p className="text-xs text-gray-500">Sessions</p>
                </div>
                <div className="rounded-xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-gray-100">
                  <p className="text-2xl font-semibold text-gray-900">{typeCount}</p>
                  <p className="text-xs text-gray-500">Types</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDraftLayout(handoutLayout)
                    setPreviewOpen(true)
                  }}
                  disabled={totalQs === 0}
                  className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-semibold text-indigo-900 shadow-sm hover:bg-indigo-50 disabled:opacity-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Print preview
                </button>
                <button
                  type="button"
                  onClick={() => void addSession()}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50"
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                  Add session
                </button>
              </div>
            </div>
          </div>

          <section className="overflow-hidden rounded-2xl border-[0.5px] border-gray-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50/60 to-white px-6 py-4">
              <h3 className="font-semibold text-gray-900">Content blocks</h3>
              <span className="ml-auto text-xs font-medium text-gray-500">{reviewSourceTag}</span>
              <button
                type="button"
                onClick={() => void addSession()}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-600"
              >
                Add session
              </button>
              <button
                type="button"
                disabled={regeneratingAll || generating}
                onClick={() => void regenerate()}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
              >
                {regeneratingAll ? 'Regenerating…' : 'Regenerate'}
              </button>
            </div>
            {sessions.length === 0 || totalQs === 0 ? (
              <div className="p-6 text-sm text-gray-500">
                No content yet — go back and generate, or add a session and use Add question on that session.
              </div>
            ) : (
              <div className="space-y-8 p-6">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/50 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-4 py-3">
                      <label className="flex min-w-[10rem] flex-1 flex-col gap-1 text-[10px] font-bold uppercase tracking-wide text-gray-500 sm:flex-row sm:items-center sm:gap-2">
                        <span className="shrink-0">Session</span>
                        <input
                          value={session.title}
                          onChange={(e) => updateSessionTitleLocal(session.id, e.target.value)}
                          onBlur={(e) => void flushSessionTitle(session.id, e.target.value)}
                          className="w-full min-w-0 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold normal-case text-gray-900"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => openAddQuestion(session.id)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
                      >
                        <PlusCircle className="h-3.5 w-3.5" />
                        Add question
                      </button>
                      {sessions.length > 1 ? (
                        <button
                          type="button"
                          onClick={() => void removeSession(session.id)}
                          className="text-xs font-semibold text-red-700 hover:text-red-600"
                        >
                          Remove session
                        </button>
                      ) : null}
                    </div>
                    <div className="p-4">
                      {session.blocks.length === 0 ? (
                        <p className="text-sm text-gray-600">No questions in this session yet.</p>
                      ) : (
                        <div className="space-y-6">
                          {TYPE_ORDER.map((kind) => {
                            const group = session.blocks
                              .map((b, idx) => ({ b, idx }))
                              .filter(({ b }) => b.type === kind)
                            if (group.length === 0) return null
                            return (
                              <div key={`${session.id}-${kind}`}>
                                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-900">
                                  {TYPE_HEADING[kind]} ({group.length})
                                </p>
                                <ul className="space-y-3">
                                  {group.map(({ b, idx: blockIndex }) => {
                                    const lb = b as LocalWorksheetBlock
                                    const blockSpinKey = `${session.id}:${lb._id}`
                                    const blockBusy = regeneratingBlockKey === blockSpinKey
                                    return (
                                    <li
                                      key={`${session.id}-${lb._id || `${kind}-${blockIndex}`}`}
                                      className="rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-800"
                                    >
                                      {b.type === 'mcq' && 'prompt' in b ? (
                                        <div>
                                          <p className="whitespace-pre-wrap leading-relaxed">{b.prompt}</p>
                                          <ol className="mt-2 list-[lower-alpha] space-y-1 pl-5 text-gray-700">
                                            {b.options.map((o, j) => (
                                              <li key={j} className="whitespace-pre-wrap">
                                                {o}
                                              </li>
                                            ))}
                                          </ol>
                                        </div>
                                      ) : null}
                                      {b.type === 'fill_blank' && 'prompt' in b ? (
                                        <p className="whitespace-pre-wrap leading-relaxed">{b.prompt}</p>
                                      ) : null}
                                      {b.type === 'short' && 'prompt' in b ? (
                                        <div>
                                          <p className="whitespace-pre-wrap leading-relaxed">{b.prompt}</p>
                                          <p className="mt-1 text-xs text-gray-400">
                                            {clampResponseLines(b.responseLines)} ruled lines
                                          </p>
                                          <ShortAnswerStudentResponsePreview
                                            responseLines={b.responseLines}
                                            ruledLineSpacingPx={handoutLayout.ruledLineSpacingPx}
                                          />
                                        </div>
                                      ) : null}
                                      {b.type === 'match' && 'left' in b ? (
                                        <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50/80">
                                          <div className="grid grid-cols-2 divide-x divide-gray-200 text-xs">
                                            <div className="space-y-2 p-3">
                                              {b.left.map((l, j) => (
                                                <p key={j} className="font-semibold text-gray-900">
                                                  {l}
                                                </p>
                                              ))}
                                            </div>
                                            <div className="space-y-2 p-3 text-gray-600">
                                              {b.right.map((r, j) => (
                                                <p key={j}>{r}</p>
                                              ))}
                                            </div>
                                          </div>
                                        </div>
                                      ) : null}
                                      <div className="mt-3 flex justify-end gap-1 border-t border-gray-100 pt-3">
                                        <button
                                          type="button"
                                          title="Move up"
                                          disabled={blockIndex === 0}
                                          onClick={() => void moveBlockInSession(session.id, blockIndex, -1)}
                                          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                                        >
                                          <ArrowUp className="h-4 w-4" />
                                        </button>
                                        <button
                                          type="button"
                                          title="Move down"
                                          disabled={blockIndex === session.blocks.length - 1}
                                          onClick={() => void moveBlockInSession(session.id, blockIndex, 1)}
                                          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                                        >
                                          <ArrowDown className="h-4 w-4" />
                                        </button>
                                        <button
                                          type="button"
                                          title="Edit"
                                          onClick={() => editBlock(session.id, blockIndex)}
                                          className="rounded-lg p-1.5 text-indigo-700 hover:bg-indigo-100"
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                          type="button"
                                          title="Regenerate this question"
                                          disabled={blockBusy || regeneratingAll || generating}
                                          onClick={() => void handleRegenerateBlock(session.id, blockIndex)}
                                          className="rounded-lg p-1.5 text-amber-800 hover:bg-amber-100 disabled:opacity-40"
                                        >
                                          {blockBusy ? (
                                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                          ) : (
                                            <RefreshCw className="h-4 w-4" aria-hidden />
                                          )}
                                        </button>
                                        <button
                                          type="button"
                                          title="Remove"
                                          disabled={totalQs <= 1}
                                          onClick={() => void handleDeleteBlock(session.id, blockIndex)}
                                          className="rounded-lg p-1.5 text-red-700 hover:bg-red-50 disabled:opacity-30"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </li>
                                    )
                                  })}
                                </ul>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={() => setPhase('build')}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              ← Edit requirements
            </button>
            <button
              type="button"
              disabled={regeneratingAll || generating || totalQs === 0}
              onClick={() => void regenerate()}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-900 hover:bg-indigo-100 disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${regeneratingAll ? 'animate-pulse' : ''}`} />
              {regeneratingAll ? 'Regenerating…' : 'Regenerate all'}
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">Publish & export</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setDraftLayout(handoutLayout)
                  setPreviewOpen(true)
                }}
                disabled={totalQs === 0}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                <Printer className="h-4 w-4" />
                Print preview
              </button>
              <button
                type="button"
                disabled={saveDraftPending || totalQs === 0}
                onClick={() => void handleSaveDraft()}
                className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {saveDraftPending ? 'Saving draft…' : 'Save draft'}
              </button>
              <button
                type="button"
                onClick={exportPdf}
                disabled={totalQs === 0}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
              <button
                type="button"
                disabled
                title="Coming with LMS integration"
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-gray-300 bg-white/60 px-4 py-2 text-sm font-medium text-gray-400"
              >
                <FileJson className="h-4 w-4" />
                QTI / LMS (soon)
              </button>
              <button
                type="button"
                disabled={publishPending || totalQs === 0}
                onClick={() => void handlePublish()}
                className="ml-auto rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 disabled:opacity-50"
              >
                {publishPending ? 'Publishing…' : isEdit ? 'Save changes' : 'Publish worksheet'}
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomModal
        open={discardOpen}
        close={() => setDiscardOpen(false)}
        title="Discard changes?"
        primaryButtonText="Leave"
        isDelete
        handleSave={() => {
          rag.resetSources()
          setDiscardOpen(false)
          goList()
        }}
      >
        <p className="py-3 text-sm text-gray-600">Unsaved catalog scope will be cleared. Continue?</p>
      </CustomModal>

      <CustomModal
        open={previewOpen}
        close={() => setPreviewOpen(false)}
        title="Worksheet preview"
        primaryButtonText="Save layout and close"
        handleSave={() => {
          setHandoutLayout(draftLayout)
          setPreviewOpen(false)
        }}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-900">Handout spacing</span>
            <label className="flex items-center gap-1.5 text-xs text-gray-800">
              <span className="text-gray-600">Line height</span>
              <select
                value={draftLayout.bodyLineHeight}
                onChange={(e) =>
                  setDraftLayout((l) => ({
                    ...l,
                    bodyLineHeight: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.bodyLineHeight,
                  }))
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
              >
                {LINE_HEIGHT_PRESETS.map((lh) => (
                  <option key={lh} value={lh}>
                    {lh}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-800">
              <span className="text-gray-600">Question gap</span>
              <select
                value={draftLayout.questionGapPx}
                onChange={(e) =>
                  setDraftLayout((l) => ({
                    ...l,
                    questionGapPx: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.questionGapPx,
                  }))
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
              >
                {QUESTION_GAP_PRESETS.map((px) => (
                  <option key={px} value={px}>
                    {px}px
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-800">
              <span className="text-gray-600">Response line height</span>
              <select
                value={draftLayout.ruledLineSpacingPx}
                onChange={(e) =>
                  setDraftLayout((l) => ({
                    ...l,
                    ruledLineSpacingPx: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.ruledLineSpacingPx,
                  }))
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
              >
                {RULED_LINE_SPACING_PRESETS.map((px) => (
                  <option key={px} value={px}>
                    {px}px
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="max-h-[60vh] overflow-y-auto py-3">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-inner">
              <p className="text-lg font-semibold tracking-tight text-gray-900">{title || 'Untitled worksheet'}</p>
              <p className="mt-1 text-xs text-gray-500">
                {subject} · {grade} ·{' '}
                {outputFormat === 'printable_pdf'
                  ? 'Print-ready PDF'
                  : outputFormat === 'both'
                    ? 'Both'
                    : 'Interactive digital'}
              </p>
              <div className="mt-6 space-y-8">
                {previewSections.map(({ session, items }) => (
                  <section key={session.id} className="border-t border-gray-200 pt-6 first:border-t-0 first:pt-0">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-800">{session.title}</h3>
                    <div className="mt-4 flex flex-col" style={{ gap: draftLayout.questionGapPx }}>
                      {items.map(({ block, number }) => (
                        <article key={`preview-q-${number}`}>
                          <div className="flex gap-3">
                            <span
                              className="shrink-0 pt-0.5 text-base font-semibold tabular-nums text-gray-900"
                              style={{ lineHeight: draftLayout.bodyLineHeight }}
                            >
                              {number}.
                            </span>
                            <div className="min-w-0 flex-1 text-sm text-gray-800" style={{ lineHeight: draftLayout.bodyLineHeight }}>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600/90">
                                {worksheetPreviewTypeLabel(block)}
                              </p>
                              <div className="mt-1.5">
                                <WorksheetPreviewBlockContent
                                  block={block}
                                  ruledLineSpacingPx={draftLayout.ruledLineSpacingPx}
                                />
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        open={editingRef !== null && editForm !== null}
        close={closeBlockEditor}
        title={
          editForm?.t === 'mcq'
            ? 'Edit multiple choice'
            : editForm?.t === 'fill_blank'
              ? 'Edit fill in the blank'
              : editForm?.t === 'short'
                ? 'Edit short answer'
                : 'Edit matching'
        }
        primaryButtonText="Save"
        handleSave={() => {
          void (async () => {
            if (editingRef === null || editForm === null) return
            const next = buildBlockFromEditForm(editForm, toast)
            if (!next) return
            const { sessionId, blockIndex } = editingRef
            const session = sessions.find((s) => s.id === sessionId)
            const blockId = (session?.blocks[blockIndex] as LocalWorksheetBlock | undefined)?._id
            const wsId = worksheetId ?? worksheetIdRef.current
            if (!blockId || !wsId) return
            try {
              const updated = await patchWorksheetBlockMutation({
                worksheetId: wsId,
                sessionId,
                blockId,
                patch: localBlockToPatchPayload(next),
              }).unwrap()
              setSessions(apiSessionsToLocal(updated.sessions))
              toast.success('Question updated')
              closeBlockEditor()
            } catch {
              toast.error('Could not update question')
            }
          })()
        }}
      >
        {editForm?.t === 'mcq' ? (
          <div className="space-y-4 py-1">
            <label className="block text-sm font-medium text-gray-800">
              Question
              <textarea
                rows={3}
                value={editForm.prompt}
                onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-gray-800">
              Choices <span className="font-normal text-gray-500">(one per line)</span>
              <textarea
                rows={5}
                value={editForm.optionsLines}
                onChange={(e) => setEditForm({ ...editForm, optionsLines: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-gray-800">
              Correct answer <span className="font-normal text-gray-500">(must match a line exactly)</span>
              <input
                type="text"
                value={editForm.answer}
                onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
        ) : null}
        {editForm?.t === 'fill_blank' ? (
          <div className="space-y-4 py-1">
            <label className="block text-sm font-medium text-gray-800">
              Prompt <span className="font-normal text-gray-500">(use ______ for the blank)</span>
              <textarea
                rows={3}
                value={editForm.prompt}
                onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-gray-800">
              Model answer
              <input
                type="text"
                value={editForm.answer}
                onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          </div>
        ) : null}
        {editForm?.t === 'short' ? (
          <div className="space-y-4 py-1">
            <label className="block text-sm font-medium text-gray-800">
              Prompt
              <textarea
                rows={4}
                value={editForm.prompt}
                onChange={(e) => setEditForm({ ...editForm, prompt: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm font-medium text-gray-800">
              Sample / exemplar answer <span className="font-normal text-gray-500">(optional)</span>
              <textarea
                rows={3}
                value={editForm.sampleAnswer}
                onChange={(e) => setEditForm({ ...editForm, sampleAnswer: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
            <section className="rounded-xl border border-gray-200 bg-gray-50/40 p-3">
              <div className="border-b border-gray-200/80 pb-2">
                <h3 className="text-sm font-semibold text-gray-900">Response space (print and PDF)</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  Ruled rows under this question on the handout — same rules as quiz short answers.
                </p>
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex w-fit items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
                  <button
                    type="button"
                    aria-label="Fewer lines"
                    disabled={clampResponseLines(editForm.responseLines) <= SHORT_RESPONSE_LINES.min}
                    onClick={() =>
                      setEditForm((f) =>
                        f?.t === 'short'
                          ? {
                              ...f,
                              responseLines: clampResponseLines(
                                (f.responseLines ?? SHORT_RESPONSE_LINES.default) - 1,
                              ),
                            }
                          : f,
                      )
                    }
                    className="rounded-lg p-2 text-gray-700 hover:bg-white disabled:opacity-30"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[3rem] text-center font-mono text-sm font-semibold text-gray-900">
                    {clampResponseLines(editForm.responseLines)}
                  </span>
                  <button
                    type="button"
                    aria-label="More lines"
                    disabled={clampResponseLines(editForm.responseLines) >= SHORT_RESPONSE_LINES.max}
                    onClick={() =>
                      setEditForm((f) =>
                        f?.t === 'short'
                          ? {
                              ...f,
                              responseLines: clampResponseLines(
                                (f.responseLines ?? SHORT_RESPONSE_LINES.default) + 1,
                              ),
                            }
                          : f,
                      )
                    }
                    className="rounded-lg p-2 text-gray-700 hover:bg-white disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="min-w-0 text-xs text-gray-600 sm:max-w-[14rem] sm:text-right">
                  {SHORT_RESPONSE_LINES.min}–{SHORT_RESPONSE_LINES.max} lines. Row height uses “Response line height” in
                  print preview (saved layout).
                </p>
              </div>
              <div className="mt-3 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2">
                <p className="text-xs font-medium text-gray-600">Quick preview</p>
                <ShortAnswerHandoutLines
                  responseLines={editForm.responseLines}
                  ruledLineSpacingPx={DEFAULT_HANDOUT_LAYOUT.ruledLineSpacingPx}
                  lineStyle="review"
                  className="mt-2 flex flex-col"
                />
              </div>
            </section>
          </div>
        ) : null}
        {editForm?.t === 'match' ? (
          <div className="space-y-4 py-1">
            <p className="text-xs text-gray-600">Each line on the left pairs with the same line on the right.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-800">
                Left column
                <textarea
                  rows={6}
                  value={editForm.leftLines}
                  onChange={(e) => setEditForm({ ...editForm, leftLines: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Right column
                <textarea
                  rows={6}
                  value={editForm.rightLines}
                  onChange={(e) => setEditForm({ ...editForm, rightLines: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
          </div>
        ) : null}
      </CustomModal>

      <CustomModal
        key={addingBlockSessionId ?? 'add-question-closed'}
        open={addingBlockOpen}
        close={closeAddQuestion}
        title={
          addingBlockSessionId
            ? `Add question · ${sessions.find((s) => s.id === addingBlockSessionId)?.title ?? 'Session'}`
            : 'Add question'
        }
        primaryButtonText="Add to session"
        handleSave={() => {
          void (async () => {
            const sessionId = addQuestionTargetSessionRef.current ?? addingBlockSessionId
            if (!sessionId) {
              toast.error('No session selected. Close and use “Add question” on a session again.')
              return
            }
            if (!sessions.some((s) => s.id === sessionId)) {
              toast.error('That session no longer exists. Close this dialog.')
              closeAddQuestion()
              return
            }
            const block = buildBlockFromAddDraft(addQuestionDraft, toast)
            if (!block) return
            const wsId = worksheetId ?? worksheetIdRef.current
            if (!wsId) {
              toast.error('Generate the worksheet first.')
              return
            }
            try {
              const updated = await addWorksheetBlockMutation({
                worksheetId: wsId,
                sessionId,
                block: localBlockToCreatePayload(block),
              }).unwrap()
              setSessions(apiSessionsToLocal(updated.sessions))
              toast.success('Question added to session')
              closeAddQuestion()
            } catch {
              toast.error('Could not add question')
            }
          })()
        }}
      >
        <div className="space-y-4 py-1">
          <label className="block text-sm font-medium text-gray-800">
            Question type
            <select
              value={addQuestionDraft.kind}
              onChange={(e) =>
                setAddQuestionDraft((d) => ({
                  ...emptyAddQuestionDraft(),
                  kind: e.target.value as AddQuestionDraft['kind'],
                  prompt: d.prompt,
                }))
              }
              className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="short">Short answer</option>
              <option value="mcq">Multiple choice</option>
              <option value="fill_blank">Fill in the blank</option>
              <option value="match">Matching</option>
            </select>
          </label>

          {(addQuestionDraft.kind === 'short' ||
            addQuestionDraft.kind === 'mcq' ||
            addQuestionDraft.kind === 'fill_blank') && (
            <label className="block text-sm font-medium text-gray-800">
              {addQuestionDraft.kind === 'fill_blank' ? (
                <span>
                  Prompt <span className="font-normal text-gray-500">(include ______ for the blank)</span>
                </span>
              ) : (
                'Question prompt'
              )}
              <textarea
                rows={addQuestionDraft.kind === 'mcq' ? 3 : 4}
                value={addQuestionDraft.prompt}
                onChange={(e) => setAddQuestionDraft((d) => ({ ...d, prompt: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          )}

          {addQuestionDraft.kind === 'mcq' ? (
            <>
              <label className="block text-sm font-medium text-gray-800">
                Choices <span className="font-normal text-gray-500">(one per line)</span>
                <textarea
                  rows={5}
                  value={addQuestionDraft.mcqOptions}
                  onChange={(e) => setAddQuestionDraft((d) => ({ ...d, mcqOptions: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Correct answer <span className="font-normal text-gray-500">(exact line match)</span>
                <input
                  type="text"
                  value={addQuestionDraft.mcqAnswer}
                  onChange={(e) => setAddQuestionDraft((d) => ({ ...d, mcqAnswer: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            </>
          ) : null}

          {addQuestionDraft.kind === 'fill_blank' ? (
            <label className="block text-sm font-medium text-gray-800">
              Model answer
              <input
                type="text"
                value={addQuestionDraft.fillAnswer}
                onChange={(e) => setAddQuestionDraft((d) => ({ ...d, fillAnswer: e.target.value }))}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              />
            </label>
          ) : null}

          {addQuestionDraft.kind === 'match' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-gray-800">
                Left column <span className="font-normal text-gray-500">(one per line)</span>
                <textarea
                  rows={5}
                  value={addQuestionDraft.matchLeft}
                  onChange={(e) => setAddQuestionDraft((d) => ({ ...d, matchLeft: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                Right column <span className="font-normal text-gray-500">(same line count)</span>
                <textarea
                  rows={5}
                  value={addQuestionDraft.matchRight}
                  onChange={(e) => setAddQuestionDraft((d) => ({ ...d, matchRight: e.target.value }))}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                />
              </label>
            </div>
          ) : null}
        </div>
      </CustomModal>

      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
        <button
          type="button"
          onClick={() => {
            if (rag.isDirty) setDiscardOpen(true)
            else goList()
          }}
          className="text-sm font-semibold text-primary-600 hover:text-primary-500"
        >
          ← Back to worksheet list
        </button>
      </div>
    </div>
  )
}
