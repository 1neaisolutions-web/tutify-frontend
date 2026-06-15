import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  TeacherToolsConfigureNav,
  TeacherToolsCreateLayout,
  TeacherToolsCreateReviewFooter,
  TeacherToolsExemplarReviewBanner,
  TeacherToolsFieldErrors,
  TeacherToolsPageHeader,
  TeacherToolsReviewHeaderCompact,
  TeacherToolsWizardFooter,
} from '../components'
import { TEACHER_TOOLS_CREATION_STEPS } from '../config/teacherToolsCreationSteps'
import { useTeacherToolsSubWizard } from '../hooks/useTeacherToolsSubWizard'
import { useTeacherToolsExemplarPreview } from '../hooks/useTeacherToolsExemplarPreview'
import { useTeacherToolsDirtyBaseline } from '../hooks/useTeacherToolsDirtyBaseline'
import { useTeacherToolsFormBaselineReady } from '../hooks/useTeacherToolsFormBaselineReady'
import { useTeacherToolsLeaveGuard } from '../hooks/useTeacherToolsLeaveGuard'
import { demoClasses, type DemoAssignment } from '../demo/teacherToolsDemoData'
import { formatSourceSummary, type AssignmentBriefLineStub, type AssignmentBriefTopicStub, type QuizDifficultyId } from '../demo/generationFromSources'
import { downloadAssignmentBriefPdf } from '../utils/generateAssignmentPdf'
import { SubjectSelect } from '@/components/shared/SubjectSelect'
import {
  subjectToTeacherToolsLabel,
  subjectValueForSelect,
} from '@/catalog/adapters/subjectAdapters'
import { gradeToLabel, gradeValueForSelect } from '@/catalog/adapters/gradeAdapters'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { store } from '../../../../redux/store'
import { assignmentApiSlice } from '../../../../redux/features/teacherTools/assignment/assignmentApiSlice'
import { setBalance } from '../../../../redux/features/subscription/subscriptionSlice'
import { getCreditBalance } from '../../../../api/subscriptions'
import NoCreditsCard from '../../../../components/NoCreditsCard'
import { parseCreditErrorFromUnknown, type ParsedCreditError } from '../../../../utils/creditErrors'
import type { AssignmentCreatePayload, AssignmentGeneratePayload } from '../../../../api/assignmentApi'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'
import { formatListLoadError } from '../utils/listLoadError'
import {
  ArrowDown,
  ArrowUp,
  Download,
  Eye,
  FileJson,
  Pencil,
  PlusCircle,
  Printer,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { QuizGeneratingOverlay } from '../quiz/components/QuizGeneratingOverlay'
import { AssignmentPrintPreviewModal, type AssignmentPrintMeta } from './components/AssignmentPrintPreviewModal'
import { DEFAULT_HANDOUT_LAYOUT, type HandoutLayoutOpts } from '../quiz/config/handoutLayoutConfig'
import { useQuizRagScope } from '../quiz/hooks/useQuizRagScope'
import {
  ASSIGNMENT_TOPIC_COUNT,
  validateAssignmentBuildSubStep,
  validateRagAssignmentBuild,
  type AssignmentRagBuildInput,
} from './config/assignmentCreationConfig'
import { ASSIGNMENT_BUILD_SUB_STEPS, type AssignmentBuildSubStepId } from './config/assignmentWizardSteps'
import { AssignmentRagBuildSection, type TopicVolumeMode } from './components/AssignmentRagBuildSection'
import { ASSIGNMENT_EXEMPLAR } from '../exemplars/assignmentExemplar'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appDispatch = store.dispatch as any

function classKeyForGrade(grade: string) {
  const label = gradeToLabel(grade)
  return demoClasses.find((c) => c.grade === label)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

function dueDateIso(daysAhead: number) {
  const d = new Date()
  d.setDate(d.getDate() + daysAhead)
  return d.toISOString().slice(0, 10)
}

function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function AssignmentCreate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const templateToastRef = useRef(false)
  const { assignmentId } = useParams<{ assignmentId?: string }>()
  const isEdit = location.pathname.endsWith('/edit')
  const { toast } = useSnackbar()
  const { api } = useTeacherToolsDemo()
  const hasCredits = useSelector((s: any) => (s?.subscription?.hasActiveCredits ?? false) || (s?.subscription?.balance ?? 0) > 0)

  const refreshCredits = useCallback(() => {
    void getCreditBalance()
      .then((b) => appDispatch(setBalance(b)))
      .catch(() => {})
  }, [])

  const [phase, setPhase] = useState<'build' | 'review'>('build')
  const [generating, setGenerating] = useState(false)
  const [genProgress, setGenProgress] = useState(0.15)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [creditGate, setCreditGate] = useState<ParsedCreditError | null>(null)

  useEffect(() => {
    if (!hasCredits) return
    if (creditGate) setCreditGate(null)
  }, [hasCredits])
  const [regenCreditGate, setRegenCreditGate] = useState<ParsedCreditError | null>(null)
  const [buildErrors, setBuildErrors] = useState<string[]>([])
  const [topicBlocks, setTopicBlocks] = useState<AssignmentBriefTopicStub[]>([])
  const [printOpen, setPrintOpen] = useState(false)
  const [handoutLayout, setHandoutLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)
  const handoutLayoutRef = useRef<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)

  const [title, setTitle] = useState(() => t('assignment.defaultTitle'))
  const [subject, setSubject] = useState<string>('math')
  const [grade, setGrade] = useState<string>('5')
  const [assignmentType, setAssignmentType] = useState('Structured response')
  const [dueAt, setDueAt] = useState(dueDateIso(14))
  const [studentInstructions, setStudentInstructions] = useState(() => t('assignment.defaultInstructions'))
  const [rigorProfile, setRigorProfile] = useState('Standard')
  const [topicMixMode, setTopicMixMode] = useState<TopicVolumeMode>('balanced')
  const [topicCount, setTopicCount] = useState(ASSIGNMENT_TOPIC_COUNT.default)
  const [difficulty, setDifficulty] = useState<QuizDifficultyId>('standard')
  const [generatorInstructions, setGeneratorInstructions] = useState('')

  const [loadedTopic, setLoadedTopic] = useState<string | undefined>(undefined)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [saveDraftPending, setSaveDraftPending] = useState(false)
  const [liveAssignmentId, setLiveAssignmentId] = useState<string | null>(null)
  const [regenTopicId, setRegenTopicId] = useState<string | null>(null)
  const [regenLineKey, setRegenLineKey] = useState<string | null>(null)
  const [hydratedRag, setHydratedRag] = useState<{
    bookIds?: string[]
    topics?: string[]
    refinement?: string
    withoutSources?: boolean
  } | null>(null)
  const [editingLine, setEditingLine] = useState<{ topicId: string; lineId: string } | null>(null)
  const [editingLineValue, setEditingLineValue] = useState('')
  const [addingLineTopicId, setAddingLineTopicId] = useState<string | null>(null)
  const [addingLineValue, setAddingLineValue] = useState('')

  const rag = useQuizRagScope({
    subject,
    grade,
    bookSelectionMode: 'single',
    initialSelectedBookIds: hydratedRag?.bookIds,
    initialScopeTopics: hydratedRag?.topics,
    initialScopeRefinement: hydratedRag?.refinement ?? loadedTopic,
    initialGenerateWithoutSources: hydratedRag?.withoutSources,
  })

  const subWizard = useTeacherToolsSubWizard(ASSIGNMENT_BUILD_SUB_STEPS, {
    storageKey: 'tutify-assignment-create-substep',
  })
  const { isExemplarPreview, enterExemplarPreview, exitExemplarPreview } = useTeacherToolsExemplarPreview()

  const assignmentBuildInput: AssignmentRagBuildInput = useMemo(
    () => ({
      title,
      generateWithoutSources: rag.generateWithoutSources,
      selectedBookIds: rag.selectedBookIds,
      selectedTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement,
      topicCount,
    }),
    [
      title,
      rag.generateWithoutSources,
      rag.selectedBookIds,
      rag.selectedTopics,
      rag.scopeRefinement,
      topicCount,
    ],
  )

  const currentStepValidation = useMemo(
    () => validateAssignmentBuildSubStep(subWizard.currentStepId as AssignmentBuildSubStepId, assignmentBuildInput),
    [subWizard.currentStepId, assignmentBuildInput],
  )

  const fullBuildValidation = useMemo(() => validateRagAssignmentBuild(assignmentBuildInput), [assignmentBuildInput])

  const hasGeneratedContent = topicBlocks.length > 0 && !isExemplarPreview
  const topMaxReachable = topicBlocks.length > 0 ? 1 : 0

  const formBaselineReady = useTeacherToolsFormBaselineReady(hydrateReady, isEdit)

  const formSnapshot = useMemo(
    () =>
      JSON.stringify({
        phase,
        title,
        subject,
        grade,
        assignmentType,
        dueAt,
        studentInstructions,
        rigorProfile,
        topicMixMode,
        topicCount,
        difficulty,
        generatorInstructions,
        topics: topicBlocks.map((t) => t.id),
        rag: rag.generationSignature,
        subStep: subWizard.currentStep,
        subMax: subWizard.maxUnlockedStep,
        exemplar: isExemplarPreview,
        liveAssignmentId,
      }),
    [
      phase,
      title,
      subject,
      grade,
      assignmentType,
      dueAt,
      studentInstructions,
      rigorProfile,
      topicMixMode,
      topicCount,
      difficulty,
      generatorInstructions,
      topicBlocks,
      rag.generationSignature,
      subWizard.currentStep,
      subWizard.maxUnlockedStep,
      isExemplarPreview,
      liveAssignmentId,
    ],
  )

  const { isDirty: isFormDirty, clearBaseline } = useTeacherToolsDirtyBaseline(
    formSnapshot,
    formBaselineReady,
  )

  const hasUnsavedWork = useMemo(() => {
    const wizardProgress =
      isExemplarPreview ||
      subWizard.currentStep > 0 ||
      subWizard.maxUnlockedStep > 0 ||
      (!isEdit && phase === 'review')

    if (isEdit) {
      return isFormDirty || rag.isDirty || wizardProgress
    }

    return (
      isFormDirty ||
      rag.isDirty ||
      topicBlocks.length > 0 ||
      !!liveAssignmentId ||
      wizardProgress
    )
  }, [
    isEdit,
    isFormDirty,
    rag.isDirty,
    topicBlocks.length,
    liveAssignmentId,
    phase,
    isExemplarPreview,
    subWizard.currentStep,
    subWizard.maxUnlockedStep,
  ])

  const clearSessionOnLeave = useCallback(() => {
    rag.resetSources()
    subWizard.clearStorage()
    subWizard.resetWizard()
    exitExemplarPreview()
    if (!isEdit) setLiveAssignmentId(null)
    clearBaseline()
  }, [rag, subWizard, exitExemplarPreview, isEdit, clearBaseline])

  const { discardOpen, requestLeave, confirmDiscard, cancelDiscard } = useTeacherToolsLeaveGuard(
    hasUnsavedWork,
    clearSessionOnLeave,
  )

  const handleBackToConfigure = useCallback(() => {
    if (isExemplarPreview) {
      exitExemplarPreview()
      setTopicBlocks([])
      setLiveAssignmentId(null)
      subWizard.resetWizard()
    }
    setPhase('build')
  }, [isExemplarPreview, exitExemplarPreview, subWizard])

  const handleShowExemplar = useCallback(() => {
    const ex = ASSIGNMENT_EXEMPLAR.input
    setLiveAssignmentId(null)
    enterExemplarPreview()
    setTitle(ex.title)
    setSubject(subjectValueForSelect(ex.subject))
    setGrade(gradeValueForSelect(ex.grade))
    setAssignmentType(ex.assignmentType)
    setDueAt(ex.dueAt)
    setStudentInstructions(ex.studentInstructions)
    setRigorProfile(ex.rigorProfile)
    setTopicCount(ex.topicCount)
    setDifficulty(ex.difficulty)
    setGeneratorInstructions(ex.generatorInstructions)
    rag.applySourceSnapshot({
      bookIds: ex.bookIds,
      topics: ex.topics,
      refinement: ex.scopeRefinement,
      generateWithoutSources: ex.generateWithoutSources,
    })
    setTopicBlocks(ASSIGNMENT_EXEMPLAR.output.topics)
    setBuildErrors([])
    subWizard.unlockAllSteps()
    setPhase('review')
    toast.success(t('teacherTools.toastExemplarLoaded'))
  }, [rag, subWizard, toast, enterExemplarPreview])

  useEffect(() => {
    if (isEdit && assignmentId) setLiveAssignmentId(assignmentId)
    else if (!isEdit) {
      setLiveAssignmentId(null)
      setHydratedRag(null)
    }
  }, [isEdit, assignmentId])

  const totalBriefLines = topicBlocks.reduce((n, t) => n + t.lines.length, 0)

  useEffect(() => {
    if (isEdit) return
    const titleParam = searchParams.get('title')
    if (titleParam) setTitle(titleParam)
    const sub = searchParams.get('subject')
    if (sub) {
      const resolved = subjectValueForSelect(sub)
      if (resolved) setSubject(resolved)
    }
    const gr = searchParams.get('grade')
    const grResolved = gr ? gradeValueForSelect(gr) : ''
    if (grResolved) setGrade(grResolved)
    const topic = searchParams.get('topic')
    if (topic) setLoadedTopic(topic)
    if (searchParams.get('fromTemplate') && !templateToastRef.current) {
      templateToastRef.current = true
      toast.success(t('teacherTools.toastPrefilledTemplate'))
    }
  }, [isEdit, searchParams, toast])

  useEffect(() => {
    if (!isEdit || !assignmentId) {
      setHydrateReady(true)
      return
    }
    let cancelled = false
    setHydrateReady(false)
    ;(async () => {
      const a = await api.getAssignment(assignmentId)
      if (cancelled) return
      if (!a) {
        toast.error(t('assignment.toastNotFound'))
        navigate('/teacher-tools/assignment')
        return
      }
      setTitle(a.title)
      setSubject(subjectValueForSelect(a.subject))
      setGrade(gradeValueForSelect(a.grade))
      setAssignmentType(a.type)
      setDueAt(a.dueAt)
      setStudentInstructions(
        typeof a.studentInstructions === 'string' && a.studentInstructions.trim()
          ? a.studentInstructions
          : t('assignment.defaultInstructions'),
      )
      if (a.topic) setLoadedTopic(a.topic)
      if (a.rigorProfile) setRigorProfile(a.rigorProfile)
      if (a.difficulty) setDifficulty(a.difficulty as QuizDifficultyId)
      if (a.teacherNotes) setGeneratorInstructions(a.teacherNotes)
      setHydratedRag({
        bookIds: a.sourceBookIds ?? [],
        topics: a.scopeTopics ?? [],
        refinement: a.scopeRefinement ?? '',
        withoutSources: a.generateWithoutSources ?? false,
      })
      if (Array.isArray(a.briefTopics)) setTopicBlocks(a.briefTopics as AssignmentBriefTopicStub[])
      if (a.handoutLayout) {
        const next = { ...DEFAULT_HANDOUT_LAYOUT, ...a.handoutLayout }
        handoutLayoutRef.current = next
        setHandoutLayout(next)
      }
      if (Array.isArray(a.briefTopics) && a.briefTopics.length > 0) setPhase('review')
      setHydrateReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [api, assignmentId, isEdit, navigate, toast])

  const buildShellCreatePayload = useCallback((): AssignmentCreatePayload => {
    return {
      title: title.trim() || t('assignment.untitled'),
      subject: subjectToTeacherToolsLabel(subject),
      grade: gradeToLabel(grade),
      classes: [classKeyForGrade(grade)],
      type: assignmentType,
      rigorProfile,
      dueAt: dueAt ? `${dueAt}T12:00:00.000Z` : null,
      studentInstructions,
      teacherNotes: generatorInstructions.trim() || undefined,
      status: 'draft',
      sourceBookIds: rag.selectedBookIds,
      scopeTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement || undefined,
      generateWithoutSources: rag.generateWithoutSources,
      difficulty,
      briefTopics: [],
      handoutLayout: null,
    }
  }, [
    title,
    subject,
    grade,
    assignmentType,
    rigorProfile,
    dueAt,
    studentInstructions,
    generatorInstructions,
    rag.selectedBookIds,
    rag.selectedTopics,
    rag.scopeRefinement,
    rag.generateWithoutSources,
    difficulty,
  ])

  const runGeneration = useCallback(async () => {
    const v = validateRagAssignmentBuild({
      title,
      generateWithoutSources: rag.generateWithoutSources,
      selectedBookIds: rag.selectedBookIds,
      selectedTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement,
    })
    if (!v.ok) {
      setBuildErrors(v.errors)
      toast.error(t('teacherTools.toastFixFields'))
      return
    }
    setBuildErrors([])
    setGenerationError(null)
    setCreditGate(null)
    setRegenCreditGate(null)
    exitExemplarPreview()
    setGenerating(true)
    setGenProgress(0.12)
    const steps = window.setInterval(() => {
      setGenProgress((p) => Math.min(0.88, p + Math.random() * 0.08))
    }, 600)
    try {
      let assignmentId: string | null = liveAssignmentId
      if (!assignmentId) {
        const created = await appDispatch(
          assignmentApiSlice.endpoints.createAssignment.initiate(buildShellCreatePayload()),
        ).unwrap()
        assignmentId = created.id
        setLiveAssignmentId(created.id)
      }
      if (!assignmentId) {
        setGenerationError(t('assignment.createGenerationError'))
        toast.error(t('assignment.toastCreateFailed'))
        return
      }
      const ensuredAssignmentId = assignmentId
      setGenProgress(0.3)
      const genPayload: AssignmentGeneratePayload = {
        topicCount,
        difficulty: difficulty as AssignmentGeneratePayload['difficulty'],
        teacherNotes: generatorInstructions.trim() || undefined,
        rigorProfile,
      }
      const genResult = await appDispatch(
        assignmentApiSlice.endpoints.generateAssignment.initiate({
          id: ensuredAssignmentId,
          payload: genPayload,
          idempotencyKey: newIdempotencyKey(),
        }),
      ).unwrap()
      setTopicBlocks(genResult.assignment.briefTopics as AssignmentBriefTopicStub[])
      setPhase('review')
      toast.success(t('assignment.toastBriefGenerated'))
      if (genResult.warnings?.length) {
        console.warn('Assignment generation warnings:', genResult.warnings)
      }
      refreshCredits()
    } catch (e) {
      const credit = parseCreditErrorFromUnknown(e)
      if (credit) {
        setCreditGate(credit)
        setGenerationError(null)
        return
      }
      setGenerationError(t('assignment.generationFailed'))
      toast.error(t('assignment.toastGenerateFailed'))
    } finally {
      window.clearInterval(steps)
      setGenerating(false)
      setGenProgress(1)
    }
  }, [
    title,
    rag,
    toast,
    liveAssignmentId,
    buildShellCreatePayload,
    topicCount,
    difficulty,
    generatorInstructions,
    rigorProfile,
    refreshCredits,
  ])

  const regenerateAll = useCallback(async () => {
    if (!liveAssignmentId) return
    setCreditGate(null)
    setRegenCreditGate(null)
    setGenerating(true)
    setGenProgress(0.2)
    const steps = window.setInterval(() => {
      setGenProgress((p) => Math.min(0.88, p + 0.08))
    }, 500)
    try {
      const genResult = await appDispatch(
        assignmentApiSlice.endpoints.generateAssignment.initiate({
          id: liveAssignmentId,
          payload: {
            topicCount,
            difficulty: difficulty as AssignmentGeneratePayload['difficulty'],
            teacherNotes: generatorInstructions.trim() || undefined,
            rigorProfile,
          },
          idempotencyKey: newIdempotencyKey(),
        }),
      ).unwrap()
      setTopicBlocks(genResult.assignment.briefTopics as AssignmentBriefTopicStub[])
      toast.success(t('assignment.toastBriefRegenerated'))
      refreshCredits()
    } catch (e) {
      const credit = parseCreditErrorFromUnknown(e)
      if (credit) {
        setCreditGate(credit)
        return
      }
      toast.error(t('assignment.toastBriefRegenFailed'))
    } finally {
      window.clearInterval(steps)
      setGenerating(false)
      setGenProgress(1)
    }
  }, [liveAssignmentId, topicCount, difficulty, generatorInstructions, rigorProfile, toast, refreshCredits])

  const regenerateTopic = useCallback(
    async (topicId: string) => {
      if (!liveAssignmentId) return
      const t = topicBlocks.find((x) => x.id === topicId)
      if (!t) return
      setRegenCreditGate(null)
      setRegenTopicId(topicId)
      try {
        const res = await appDispatch(
          assignmentApiSlice.endpoints.regenerateTopic.initiate({
            assignmentId: liveAssignmentId,
            topicId,
            topicTitle: t.title,
          }),
        ).unwrap()
        setTopicBlocks((prev) =>
          prev.map((b) =>
            b.id === topicId ? { ...(res.topic as AssignmentBriefTopicStub), id: topicId } : b,
          ),
        )
        toast.success(t('assignment.toastTopicRegenerated'))
        refreshCredits()
      } catch (e) {
        const credit = parseCreditErrorFromUnknown(e)
        if (credit) {
          setRegenCreditGate(credit)
          return
        }
        console.warn('[AssignmentCreate] regenerateTopic failed', e)
        toast.error(formatListLoadError(e))
      } finally {
        setRegenTopicId(null)
      }
    },
    [liveAssignmentId, topicBlocks, toast, refreshCredits],
  )

  const moveTopic = useCallback((index: number, dir: -1 | 1) => {
    const j = index + dir
    setTopicBlocks((prev) => {
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      const [row] = next.splice(index, 1)
      next.splice(j, 0, row)
      return next
    })
  }, [])

  const moveLineInTopic = useCallback((topicId: string, lineIndex: number, dir: -1 | 1) => {
    setTopicBlocks((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t
        const j = lineIndex + dir
        if (j < 0 || j >= t.lines.length) return t
        const lines = [...t.lines]
        const [row] = lines.splice(lineIndex, 1)
        lines.splice(j, 0, row)
        return { ...t, lines }
      }),
    )
  }, [])

  const deleteLine = useCallback(
    (topicId: string, lineIndex: number) => {
      const t = topicBlocks.find((x) => x.id === topicId)
      if (!t || t.lines.length <= 1) {
        toast.error(t('assignment.toastKeepOneLine'))
        return
      }
      setTopicBlocks((prev) =>
        prev.map((b) => (b.id === topicId ? { ...b, lines: b.lines.filter((_, i) => i !== lineIndex) } : b)),
      )
      toast.success(t('assignment.toastLineRemoved'))
    },
    [topicBlocks, toast],
  )

  const regenerateLine = useCallback(
    async (topicId: string, lineIndex: number) => {
      if (!liveAssignmentId) return
      const t = topicBlocks.find((x) => x.id === topicId)
      if (!t) return
      const lineKey = `${topicId}:${lineIndex}`
      setRegenCreditGate(null)
      setRegenLineKey(lineKey)
      try {
        const res = await appDispatch(
          assignmentApiSlice.endpoints.regenerateLine.initiate({
            assignmentId: liveAssignmentId,
            topicId,
            topicTitle: t.title,
            lineIndex,
          }),
        ).unwrap()
        setTopicBlocks((prev) =>
          prev.map((b) => {
            if (b.id !== topicId) return b
            const lines = b.lines.map((ln, i) =>
              i === lineIndex ? { ...ln, text: res.text } : ln,
            )
            return { ...b, lines }
          }),
        )
        toast.success(t('assignment.toastLineRegenerated'))
        refreshCredits()
      } catch (e) {
        const credit = parseCreditErrorFromUnknown(e)
        if (credit) {
          setRegenCreditGate(credit)
          return
        }
        console.warn('[AssignmentCreate] regenerateLine failed', e)
        toast.error(formatListLoadError(e))
      } finally {
        setRegenLineKey(null)
      }
    },
    [liveAssignmentId, topicBlocks, toast, refreshCredits],
  )

  const updateLineText = useCallback((topicId: string, lineId: string, text: string) => {
    setTopicBlocks((prev) =>
      prev.map((t) =>
        t.id !== topicId
          ? t
          : { ...t, lines: t.lines.map((ln) => (ln.id === lineId ? { ...ln, text } : ln)) },
      ),
    )
  }, [])

  const addLineToTopic = useCallback((topicId: string, text: string) => {
    const line: AssignmentBriefLineStub = { id: newDemoId('asg-line'), text }
    setTopicBlocks((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, lines: [...t.lines, line] } : t)),
    )
    toast.success(t('assignment.toastLineAdded'))
  }, [toast])

  const addTopicManual = useCallback(() => {
    setTopicBlocks((prev) => {
      const n = prev.length + 1
      const topic: AssignmentBriefTopicStub = {
        id: newDemoId('asg-topic'),
        title: `Topic ${n}`,
        lines: [
          {
            id: newDemoId('asg-line'),
            text: t('assignment.defaultLineText'),
          },
        ],
      }
      return [...prev, topic]
    })
    toast.success(t('assignment.toastTopicAdded'))
  }, [toast])

  const deleteTopic = useCallback(
    (topicId: string) => {
      setEditingLine((cur) => (cur?.topicId === topicId ? null : cur))
      setAddingLineTopicId((cur) => (cur === topicId ? null : cur))
      setTopicBlocks((prev) => prev.filter((t) => t.id !== topicId))
      toast.success(t('assignment.toastTopicRemoved'))
    },
    [toast],
  )

  const goList = useCallback(() => navigate('/teacher-tools/assignment'), [navigate])

  const handleExitToList = useCallback(() => {
    requestLeave(goList)
  }, [requestLeave, goList])

  const handleHandoutLayoutSave = useCallback(
    (layout: HandoutLayoutOpts) => {
      const next = { ...DEFAULT_HANDOUT_LAYOUT, ...layout }
      handoutLayoutRef.current = next
      setHandoutLayout(next)
      toast.success(t('assignment.toastHandoutSaved'))
    },
    [toast],
  )

  const assignmentPrintMeta: AssignmentPrintMeta = {
    title: title.trim() || t('assignment.fallbackTitle'),
    subject: subjectToTeacherToolsLabel(subject),
    grade,
    dueAt,
    assignmentType,
    studentInstructions,
    topic: rag.combinedTopicLabel,
    sourceSummaryLine: formatSourceSummary(rag.getGenerationContext()),
  }

  const exportPdf = useCallback(() => {
    try {
      downloadAssignmentBriefPdf(
        {
          title: title.trim() || t('assignment.fallbackTitle'),
          subject: subjectToTeacherToolsLabel(subject),
          grade: gradeToLabel(grade),
          dueAt,
          assignmentType,
          studentInstructions,
          topic: rag.combinedTopicLabel,
          sourceSummary: formatSourceSummary(rag.getGenerationContext()),
        },
        topicBlocks,
        handoutLayoutRef.current,
        `${(title || 'assignment').replace(/\s+/g, '-').slice(0, 32)}-assignment-brief.pdf`,
      )
      toast.success(t('teacherTools.toastPdfDownloaded'))
    } catch {
      toast.error(t('teacherTools.toastPdfFailed'))
    }
  }, [rag, title, subject, grade, dueAt, assignmentType, studentInstructions, topicBlocks, toast])

  const buildPayload = useCallback(
    (status: 'draft' | 'active') => ({
      title: title.trim() || t('assignment.untitled'),
      subject: subjectToTeacherToolsLabel(subject),
      grade: gradeToLabel(grade),
      classes: [classKeyForGrade(grade)],
      type: assignmentType,
      dueAt,
      assignedCount: 0,
      submitted: 0,
      pending: 0,
      graded: 0,
      status,
      topic: rag.combinedTopicLabel,
      sourceSummary: formatSourceSummary(rag.getGenerationContext()),
      briefTopics: topicBlocks,
      studentInstructions,
      handoutLayout: handoutLayoutRef.current,
      sourceBookIds: rag.selectedBookIds,
      scopeTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement,
      generateWithoutSources: rag.generateWithoutSources,
      rigorProfile,
      teacherNotes: generatorInstructions.trim() || undefined,
      difficulty,
    }),
    [
      title,
      subject,
      grade,
      assignmentType,
      dueAt,
      rag,
      topicBlocks,
      studentInstructions,
      generatorInstructions,
      rigorProfile,
      difficulty,
    ],
  )

  const buildDemoForSave = useCallback(
    (status: 'draft' | 'active'): DemoAssignment => {
      const id = (isEdit && assignmentId ? assignmentId : liveAssignmentId) ?? 'pending'
      return {
        id,
        ...buildPayload(status),
      } as DemoAssignment
    },
    [isEdit, assignmentId, liveAssignmentId, buildPayload],
  )

  const handleSaveDraft = useCallback(async () => {
    if (isExemplarPreview) {
      toast.error(t('teacherTools.toastExemplarNotSaved'))
      return
    }
    if (topicBlocks.length === 0) {
      toast.error(t('assignment.toastDraftNeedsBrief'))
      return
    }
    setSaveDraftPending(true)
    try {
      const payload = buildPayload('draft')
      if (isEdit && assignmentId) {
        const res = await api.updateAssignment(assignmentId, payload)
        if (!res.ok) {
          if (res.error === 'READ_ONLY') toast.error(t('teacherTools.toastReadOnly'))
          else toast.error(t('teacherTools.toastDraftFailed'))
          return
        }
        toast.success(t('teacherTools.toastDraftSaved'))
        navigate(`/teacher-tools/assignment/${assignmentId}`)
        return
      }
      if (liveAssignmentId) {
        const res = await api.updateAssignment(liveAssignmentId, payload)
        if (!res.ok) {
          toast.error(t('teacherTools.toastDraftFailed'))
          return
        }
        toast.success(t('teacherTools.toastDraftSaved'))
        navigate(`/teacher-tools/assignment/${liveAssignmentId}`)
        return
      }
      const { id } = await api.createAssignment(buildDemoForSave('draft'))
      toast.success(t('teacherTools.toastDraftSaved'))
      navigate(`/teacher-tools/assignment/${id}`)
    } finally {
      setSaveDraftPending(false)
    }
  }, [
    api,
    assignmentId,
    isEdit,
    liveAssignmentId,
    navigate,
    topicBlocks.length,
    toast,
    buildPayload,
    buildDemoForSave,
  ])

  const handlePublish = useCallback(async () => {
    if (isExemplarPreview) {
      toast.error(t('teacherTools.toastExemplarCannotPublish'))
      return
    }
    if (topicBlocks.length === 0) {
      toast.error(t('assignment.toastPublishNeedsBrief'))
      return
    }
    setPublishPending(true)
    try {
      const payload = buildPayload('active')
      if (isEdit && assignmentId) {
        const res = await api.updateAssignment(assignmentId, payload)
        if (!res.ok) {
          if (res.error === 'READ_ONLY')
            toast.error(t('assignment.toastDuplicateFirst'))
          else toast.error(t('assignment.toastSaveFailed'))
          return
        }
        toast.success(t('assignment.publishUpdated'))
      } else if (liveAssignmentId) {
        const res = await api.updateAssignment(liveAssignmentId, payload)
        if (!res.ok) {
          toast.error(t('assignment.toastSaveFailed'))
          return
        }
        toast.success(t('assignment.publishAssignment'))
      } else {
        await api.createAssignment(buildDemoForSave('active'))
        toast.success(t('assignment.publishAssignment'))
      }
      navigate('/teacher-tools/assignment')
    } finally {
      setPublishPending(false)
    }
  }, [
    api,
    assignmentId,
    isEdit,
    liveAssignmentId,
    navigate,
    topicBlocks.length,
    toast,
    buildPayload,
    buildDemoForSave,
  ])

  if (isEdit && !hydrateReady) {
    return (
      <div className="min-h-[40vh] space-y-3 p-8">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-32 max-w-xl animate-pulse rounded-2xl bg-gray-100" />
        <p className="text-sm text-gray-600">{t('assignment.loading')}</p>
      </div>
    )
  }

  const wizardStep = phase === 'build' ? 0 : 1

  const buildFooter = (
    <TeacherToolsWizardFooter
      isFirstStep={subWizard.isFirstStep}
      isLastStep={subWizard.isLastStep}
      canGoNext={currentStepValidation.ok}
      onBack={subWizard.goBack}
      onNext={() => {
        if (!currentStepValidation.ok) {
          setBuildErrors(currentStepValidation.errors)
          return
        }
        setBuildErrors([])
        subWizard.goNext()
      }}
      onGenerate={() => {
        if (!fullBuildValidation.ok) {
          setBuildErrors(fullBuildValidation.errors)
          toast.error(t('teacherTools.toastFixFields'))
          return
        }
        setBuildErrors([])
        void runGeneration()
      }}
      generating={generating}
      generateLabel={t('assignment.generateLabel')}
      onShowExemplar={handleShowExemplar}
      onExitToList={handleExitToList}
      exitLabel={t('assignment.exitLabel')}
    />
  )

  const reviewFooter = (
    <TeacherToolsCreateReviewFooter
      exitLabel={t('assignment.exitLabel')}
      onExitToList={handleExitToList}
      onEditRequirements={handleBackToConfigure}
      publish={{
        onPrintPreview: () => setPrintOpen(true),
        printPreviewDisabled: topicBlocks.length === 0,
        onSaveDraft: () => void handleSaveDraft(),
        saveDraftPending,
        saveDraftDisabled: topicBlocks.length === 0 || isExemplarPreview,
        onExportPdf: exportPdf,
        exportDisabled: topicBlocks.length === 0,
        onPublish: () => void handlePublish(),
        publishPending,
        publishDisabled: topicBlocks.length === 0 || isExemplarPreview,
        publishLabel: isEdit ? t('assignment.saveChanges') : t('assignment.publishButton'),
      }}
    />
  )

  return (
    <>
    <TeacherToolsCreateLayout
      header={
        <>
          <TeacherToolsPageHeader
            variant="compact"
            title={isEdit ? t('assignment.editTitle') : t('assignment.createTitle')}
            subtitle={t('assignment.createSubtitle')}
            breadcrumbs={[
              { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
              { label: t('assignment.breadcrumb'), to: '/teacher-tools/assignment' },
              { label: isEdit ? t('teacherTools.breadcrumbEdit') : t('teacherTools.breadcrumbCreate') },
            ]}
          />
          <div className="pb-2">
            <TeacherToolsConfigureNav
              primarySteps={[...TEACHER_TOOLS_CREATION_STEPS]}
              primaryCurrent={wizardStep}
              primaryMaxReachable={topMaxReachable}
              onPrimaryStepClick={(i) => {
                if (i === 1 && topicBlocks.length === 0) {
                  toast.error(t('assignment.toastReviewNeedsGenerate'))
                  return
                }
                if (i === 0) handleBackToConfigure()
                else setPhase('review')
              }}
              showSubSteps={phase === 'build'}
              subSteps={ASSIGNMENT_BUILD_SUB_STEPS}
              subCurrent={subWizard.currentStep}
              subMaxUnlocked={subWizard.maxUnlockedStep}
              onSubStepClick={subWizard.goToStep}
            />
          </div>
        </>
      }
      footer={phase === 'build' ? buildFooter : reviewFooter}
    >
      <div className="space-y-4 pb-4">

      {generationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {generationError}
          <button type="button" className="ml-3 font-semibold underline" onClick={() => setGenerationError(null)}>
            {t('teacherTools.dismiss')}
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

      <QuizGeneratingOverlay open={generating} progress={genProgress} />

      {phase === 'build' && (
        <>
          <TeacherToolsFieldErrors errors={currentStepValidation.errors} />
          <AssignmentRagBuildSection
            activeStepId={subWizard.currentStepId as AssignmentBuildSubStepId}
            rag={rag}
            title={title}
            onTitleChange={setTitle}
            assignmentType={assignmentType}
            onAssignmentTypeChange={setAssignmentType}
            dueAt={dueAt}
            onDueAtChange={setDueAt}
            subject={subject}
            onSubjectChange={setSubject}
            grade={grade}
            onGradeChange={setGrade}
            rigorProfile={rigorProfile}
            onRigorProfileChange={setRigorProfile}
            studentInstructions={studentInstructions}
            onStudentInstructionsChange={setStudentInstructions}
            topicMixMode={topicMixMode}
            onTopicMixModeChange={setTopicMixMode}
            topicCount={topicCount}
            onTopicCountChange={setTopicCount}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            generatorInstructions={generatorInstructions}
            onGeneratorInstructionsChange={setGeneratorInstructions}
          />
          {buildErrors.length > 0 && !currentStepValidation.errors.length && (
            <TeacherToolsFieldErrors errors={buildErrors} />
          )}
        </>
      )}

      {phase === 'review' && regenCreditGate && (
        <NoCreditsCard
          compact
          reason={regenCreditGate.reason}
          balance={regenCreditGate.balance}
          required={regenCreditGate.required}
          onActivated={() => setRegenCreditGate(null)}
        />
      )}

      {phase === 'review' && (
        <div className="space-y-3">
          {isExemplarPreview && <TeacherToolsExemplarReviewBanner />}
          <TeacherToolsReviewHeaderCompact
            title={t('assignment.briefTitle')}
            sourceTag={formatSourceSummary(rag.getGenerationContext())}
            stats={[
              { label: t('assignment.statTopics'), value: topicBlocks.length },
              { label: t('assignment.statLines'), value: totalBriefLines },
            ]}
            actions={
              <>
                <button
                  type="button"
                  onClick={() => setPrintOpen(true)}
                  disabled={topicBlocks.length === 0}
                  className="rounded-lg border border-indigo-200 bg-white px-2 py-1 text-xs font-semibold text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
                >
                  {t('quiz.review.printPreview')}
                </button>
                <button
                  type="button"
                  onClick={addTopicManual}
                  className="rounded-lg border border-emerald-200 bg-white px-2 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-50"
                >
                  {t('assignment.review.addTopic')}
                </button>
                <button
                  type="button"
                  disabled={generating || !liveAssignmentId || isExemplarPreview}
                  onClick={() => void regenerateAll()}
                  className="rounded-lg border border-indigo-200 bg-white px-2 py-1 text-xs font-semibold text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
                >
                  {t('assignment.review.regenerateAll')}
                </button>
              </>
            }
          />

          {topicBlocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <p className="text-sm font-medium text-gray-800">{t('assignment.noBriefSections')}</p>
              <p className="mt-1 text-sm text-gray-600">{t('assignment.noBriefSectionsHint')}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={handleBackToConfigure}
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
                >
                  {t('quiz.review.backToBuild')}
                </button>
                <button
                  type="button"
                  onClick={addTopicManual}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500"
                >
                  <PlusCircle className="h-4 w-4" />
                  {t('teacherTools.addTopic')}
                </button>
              </div>
            </div>
          ) : (
            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-3 py-2">
                <h3 className="text-sm font-semibold text-gray-900">{t('assignment.briefTitle')}</h3>
                <button
                  type="button"
                  onClick={addTopicManual}
                  className="ml-auto text-xs font-semibold text-emerald-700 hover:text-emerald-600"
                >
                  {t('teacherTools.addTopic')}
                </button>
              </div>
              <div className="space-y-4 p-4">
                {topicBlocks.map((topic, ti) => (
                  <div key={topic.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 bg-emerald-50/50 px-4 py-3">
                      <p className="min-w-0 flex-1 text-sm font-semibold text-gray-900">{topic.title}</p>
                      <div className="ml-auto flex flex-wrap gap-1">
                        <button
                          type="button"
                          title={t('teacherTools.moveTopicUp')}
                          disabled={ti === 0}
                          onClick={() => moveTopic(ti, -1)}
                          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title={t('teacherTools.moveTopicDown')}
                          disabled={ti === topicBlocks.length - 1}
                          onClick={() => moveTopic(ti, 1)}
                          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title={t('teacherTools.regenerateTopic')}
                          disabled={!liveAssignmentId || generating || regenTopicId === topic.id}
                          onClick={() => void regenerateTopic(topic.id)}
                          className="rounded-lg p-1.5 text-amber-800 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title={t('teacherTools.addLineToTopic')}
                          onClick={() => setAddingLineTopicId(topic.id)}
                          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100"
                        >
                          <PlusCircle className="h-3.5 w-3.5" />
                          Add line
                        </button>
                        <button
                          type="button"
                          title={t('teacherTools.deleteTopic')}
                          onClick={() => deleteTopic(topic.id)}
                          className="rounded-lg p-1.5 text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {topic.lines.map((line, li) => (
                        <li key={line.id} className="flex gap-3 px-4 py-3 text-sm text-gray-800">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
                            {li + 1}
                          </span>
                          <span className="min-w-0 flex-1 leading-relaxed">{line.text}</span>
                          <div className="flex shrink-0 gap-1">
                            <button
                              type="button"
                              title={t('teacherTools.moveUp')}
                              disabled={li === 0}
                              onClick={() => moveLineInTopic(topic.id, li, -1)}
                              className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                            >
                              <ArrowUp className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title={t('teacherTools.moveDown')}
                              disabled={li === topic.lines.length - 1}
                              onClick={() => moveLineInTopic(topic.id, li, 1)}
                              className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title={t('exam.detail.edit')}
                              onClick={() => {
                                setEditingLine({ topicId: topic.id, lineId: line.id })
                                setEditingLineValue(line.text)
                              }}
                              className="rounded-lg p-1.5 text-indigo-700 hover:bg-indigo-100"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title={t('teacherTools.regenerateLine')}
                              disabled={
                                !liveAssignmentId ||
                                generating ||
                                regenLineKey === `${topic.id}:${li}`
                              }
                              onClick={() => void regenerateLine(topic.id, li)}
                              className="rounded-lg p-1.5 text-amber-800 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              title={t('teacherTools.remove')}
                              onClick={() => deleteLine(topic.id, li)}
                              className="rounded-lg p-1.5 text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
      </div>
    </TeacherToolsCreateLayout>

      <AssignmentPrintPreviewModal
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        meta={assignmentPrintMeta}
        topics={topicBlocks}
        savedLayout={handoutLayout}
        onSaveLayout={handleHandoutLayoutSave}
      />

      <CustomModal
        open={discardOpen}
        close={cancelDiscard}
        title={t('teacherTools.leaveTitle')}
        primaryButtonText={t('teacherTools.leave')}
        isDelete
        handleSave={confirmDiscard}
      >
        <p className="py-3 text-sm text-gray-600">
          You have unsaved changes on this page. If you leave now, your progress will be cleared.
        </p>
      </CustomModal>

      <CustomModal
        open={editingLine !== null}
        close={() => setEditingLine(null)}
        title={t('assignment.editLineTitle')}
        primaryButtonText={t('teacherTools.save')}
        handleSave={() => {
          if (!editingLine) return
          updateLineText(editingLine.topicId, editingLine.lineId, editingLineValue)
          setEditingLine(null)
        }}
      >
        <textarea
          rows={4}
          value={editingLineValue}
          onChange={(e) => setEditingLineValue(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
        />
      </CustomModal>

      <CustomModal
        open={addingLineTopicId !== null}
        close={() => {
          setAddingLineTopicId(null)
          setAddingLineValue('')
        }}
        title={
          addingLineTopicId
            ? t('assignment.addLineTopic', {
                topic: topicBlocks.find((tb) => tb.id === addingLineTopicId)?.title ?? t('teacherTools.topic'),
              })
            : t('assignment.addBriefLine')
        }
        primaryButtonText={t('assignment.addLineButton')}
        handleSave={() => {
          if (!addingLineTopicId || !addingLineValue.trim()) return
          addLineToTopic(addingLineTopicId, addingLineValue.trim())
          setAddingLineTopicId(null)
          setAddingLineValue('')
        }}
      >
        <textarea
          rows={4}
          value={addingLineValue}
          onChange={(e) => setAddingLineValue(e.target.value)}
          className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          placeholder={t('assignment.addLinePlaceholder')}
        />
      </CustomModal>
    </>
  )
}
