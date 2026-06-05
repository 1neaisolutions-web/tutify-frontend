import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import {
  TeacherToolsConfigureNav,
  TeacherToolsCreateLayout,
  TeacherToolsCreateReviewFooter,
  TeacherToolsExemplarReviewBanner,
  TeacherToolsFieldErrors,
  TeacherToolsPageHeader,
  TeacherToolsPanelHeader,
  TeacherToolsReviewHeaderCompact,
  TeacherToolsWizardFooter,
} from '../components'
import { EXAM_CREATION_STEPS } from '../config/teacherToolsCreationSteps'
import { useTeacherToolsSubWizard } from '../hooks/useTeacherToolsSubWizard'
import { useTeacherToolsExemplarPreview } from '../hooks/useTeacherToolsExemplarPreview'
import { useTeacherToolsDirtyBaseline } from '../hooks/useTeacherToolsDirtyBaseline'
import { useTeacherToolsFormBaselineReady } from '../hooks/useTeacherToolsFormBaselineReady'
import { useTeacherToolsLeaveGuard } from '../hooks/useTeacherToolsLeaveGuard'
import { demoClasses } from '../demo/teacherToolsDemoData'
import { formatSourceSummary, generateExamSectionStubs } from '../demo/generationFromSources'
import type { ExamSectionStub } from '../demo/generationFromSources'
import { GRADES, SUBJECTS } from '../types'
import * as examApi from '../../../../api/examApi'
import {
  hydrateFromApi,
  type LocalLong,
  type LocalMcq,
  type LocalShort,
} from './examApiAdapters'
import { downloadExamHandoutPdf } from '../utils/generateExamPdf'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'
// @ts-expect-error — JS module
import { store } from '../../../../redux/store'
import { setBalance } from '../../../../redux/features/subscription/subscriptionSlice'
import { getCreditBalance } from '../../../../api/subscriptions'
import NoCreditsCard from '../../../../components/NoCreditsCard'
import { parseCreditError, type ParsedCreditError } from '../../../../utils/creditErrors'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appDispatch = store.dispatch as any
import { AlertCircle, Download, Eye, FileJson, Loader2, Sparkles } from 'lucide-react'
import { QuizGeneratingOverlay } from '../quiz/components/QuizGeneratingOverlay'
import {
  DEFAULT_HANDOUT_LAYOUT,
  LINE_HEIGHT_PRESETS,
  QUESTION_GAP_PRESETS,
  type HandoutLayoutOpts,
} from '../quiz/config/handoutLayoutConfig'
import { useQuizRagScope } from '../quiz/hooks/useQuizRagScope'
import {
  validateExamBuildSubStep,
  validateRagExamBuild,
  type ExamRagBuildInput,
} from './config/examCreationConfig'
import { EXAM_BUILD_SUB_STEPS, type ExamBuildSubStepId } from './config/examWizardSteps'
import {
  DEFAULT_EXAM_PAPER,
  deriveExamPaperMarks,
  validateExamPaperFields,
  type ExamPaperConfig,
} from './config/examPaperConfig'
import { ExamNumberedSectionHeader, ExamSectionShell } from './components/ExamNumberedSectionHeader'
import { ExamSourcesRagPanel } from './components/ExamSourcesRagPanel'
import { ExamPaperStructureCard } from './components/ExamPaperStructureCard'
import { ExamPaperStructureReviewCard } from './components/ExamPaperStructureReviewCard'
import { ExamPaperQuestionsReview } from './components/ExamPaperQuestionsReview'
import { ExamPrintPreviewContent } from './components/ExamPrintPreviewContent'
import { blankLongStub, blankMcqStub, blankShortStub } from './demo/examQuestionStubs'
import { alignExamBlueprintMarksToTotal } from './utils/alignExamBlueprintMarks'
import { EXAM_EXEMPLAR } from '../exemplars/examExemplar'

const EXAM_TYPES = ['Unit test', 'Mid-term', 'Final exam', 'Mock exam'] as const
const EXAM_TYPE_LABEL_KEYS: Record<(typeof EXAM_TYPES)[number], string> = {
  'Unit test': 'exam.types.unitTest',
  'Mid-term': 'exam.types.midTerm',
  'Final exam': 'exam.types.finalExam',
  'Mock exam': 'exam.types.mockExam',
}
const TERMS = ['Term 1', 'Term 2', 'Term 3'] as const
const TERM_LABEL_KEYS: Record<(typeof TERMS)[number], string> = {
  'Term 1': 'exam.terms.term1',
  'Term 2': 'exam.terms.term2',
  'Term 3': 'exam.terms.term3',
}
const INTERNATIONAL_STANDARDS = ['Cambridge-style', 'IB-aligned', 'Standard', 'National curriculum'] as const
const STANDARD_LABEL_KEYS: Record<(typeof INTERNATIONAL_STANDARDS)[number], string> = {
  'Cambridge-style': 'exam.standards.cambridgeStyle',
  'IB-aligned': 'exam.standards.ibAligned',
  Standard: 'exam.standards.standard',
  'National curriculum': 'exam.standards.nationalCurriculum',
}

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

function normExamText(s: string) {
  return s.trim().replace(/\s+/g, ' ')
}

function sameOptionLists(a: string[], b: string[]) {
  if (a.length !== b.length) return false
  return a.every((x, i) => normExamText(x) === normExamText(b[i] ?? ''))
}

function fmtWindowLine(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

export default function ExamCreate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const templateToastRef = useRef(false)
  const { examId } = useParams<{ examId?: string }>()
  const isEdit = location.pathname.endsWith('/edit')
  const { toast } = useSnackbar()

  // If credits get activated elsewhere (e.g. Settings page), clear any stale gating UI.
  const hasCredits = useSelector((s: any) => (s?.subscription?.hasActiveCredits ?? false) || (s?.subscription?.balance ?? 0) > 0)

  const refreshCredits = useCallback(() => {
    void getCreditBalance()
      .then((b) => appDispatch(setBalance(b)))
      .catch(() => {})
  }, [])

  const [phase, setPhase] = useState<'build' | 'review'>(isEdit ? 'review' : 'build')
  const [generating, setGenerating] = useState(false)
  const [genProgress, setGenProgress] = useState(0.15)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [creditGate, setCreditGate] = useState<ParsedCreditError | null>(null)
  const [regenCreditGate, setRegenCreditGate] = useState<ParsedCreditError | null>(null)
  const [buildErrors, setBuildErrors] = useState<string[]>([])
  const [generatedSections, setGeneratedSections] = useState<ExamSectionStub[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [handoutLayout, setHandoutLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)
  const [draftLayout, setDraftLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)

  const [title, setTitle] = useState(() => t('exam.defaultTitle'))
  const [examType, setExamType] = useState<(typeof EXAM_TYPES)[number]>('Unit test')
  const [term, setTerm] = useState<(typeof TERMS)[number]>('Term 2')
  const [durationMinutes, setDurationMinutes] = useState(60)
  const [subject, setSubject] = useState<string>(SUBJECTS[2])
  const [grade, setGrade] = useState<string>(GRADES[2])
  const [internationalStandard, setInternationalStandard] = useState<(typeof INTERNATIONAL_STANDARDS)[number]>(
    'Cambridge-style',
  )
  const [sectionTargetCount, setSectionTargetCount] = useState(4)
  const [paper, setPaper] = useState<ExamPaperConfig>(() => ({ ...DEFAULT_EXAM_PAPER }))

  // Schedule
  const defaultDate = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 10)
    return d.toISOString().slice(0, 10)
  })()
  const [scheduleDate, setScheduleDate] = useState(defaultDate)
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [scheduleStartIso, setScheduleStartIso] = useState<string | null>(null)
  const [selectedClasses, setSelectedClasses] = useState<string[]>([])
  const [loadedTopic, setLoadedTopic] = useState<string | undefined>(undefined)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [saveDraftPending, setSaveDraftPending] = useState(false)
  const [completionMeta, setCompletionMeta] = useState({ completionPct: 0 })
  const [examMcqs, setExamMcqs] = useState<LocalMcq[]>([])
  const [examShorts, setExamShorts] = useState<LocalShort[]>([])
  const [examLongs, setExamLongs] = useState<LocalLong[]>([])
  const examQsHydratedRef = useRef(false)
  const [backendExamId, setBackendExamId] = useState<string | null>(null)
  const effectiveExamId = examId ?? backendExamId
  /** `mcq:id` | `short:id` | `long:id` | `sections` while regenerating */
  const [examRegenerateBusy, setExamRegenerateBusy] = useState<string | null>(null)
  const [scopeHydration, setScopeHydration] = useState<{
    bookIds: string[]
    topics: string[]
    refinement: string
    without: boolean
  } | null>(null)

  const applyExamFromApi = useCallback((exam: examApi.ExamApiItem) => {
    const h = hydrateFromApi(exam)
    setTitle(h.title)
    setExamType(h.examType)
    setTerm(h.term)
    setSubject(h.subject)
    setGrade(h.grade)
    setInternationalStandard(h.internationalStandard as (typeof INTERNATIONAL_STANDARDS)[number])
    setDurationMinutes(h.durationMinutes)
    setSectionTargetCount(h.sectionTargetCount)
    setPaper(h.paper as ExamPaperConfig)
    setGeneratedSections(h.sections)
    setExamMcqs(h.mcqs)
    setExamShorts(h.shorts)
    setExamLongs(h.longs)
    setSelectedClasses(h.classes ?? [])
    setCompletionMeta({ completionPct: h.completionPct })
    if (h.scheduleStart) {
      setScheduleStartIso(h.scheduleStart)
      setScheduleDate(h.scheduleStart.slice(0, 10))
      setScheduleTime(h.scheduleStart.slice(11, 16))
    } else {
      setScheduleStartIso(null)
    }
    if (h.handoutLayout) {
      const next = { ...DEFAULT_HANDOUT_LAYOUT, ...h.handoutLayout }
      setHandoutLayout(next)
      setDraftLayout(next)
    }
  }, [])

  const [editMcqIdx, setEditMcqIdx] = useState<number | null>(null)
  const [editMcqStem, setEditMcqStem] = useState('')
  const [editMcqOptionsText, setEditMcqOptionsText] = useState('')

  const [editShortIdx, setEditShortIdx] = useState<number | null>(null)
  const [editShortStem, setEditShortStem] = useState('')

  const [editLongIdx, setEditLongIdx] = useState<number | null>(null)
  const [editLongStem, setEditLongStem] = useState('')
  const [editLongSubpartsText, setEditLongSubpartsText] = useState('')

  useEffect(() => {
    if (!isEdit) setScheduleStartIso(null)
  }, [isEdit])

  useEffect(() => {
    if (!hasCredits) return
    if (creditGate) setCreditGate(null)
    if (regenCreditGate) setRegenCreditGate(null)
  }, [hasCredits])

  useEffect(() => {
    if (scheduleDate) {
      setScheduleStartIso(`${scheduleDate}T${scheduleTime}:00`)
    }
  }, [scheduleDate, scheduleTime])

  const rag = useQuizRagScope({
    subject,
    grade,
    initialSelectedBookIds: scopeHydration?.bookIds,
    initialScopeTopics: scopeHydration?.topics,
    initialScopeRefinement: scopeHydration?.refinement ?? loadedTopic,
    initialGenerateWithoutSources: scopeHydration?.without,
  })

  const subWizard = useTeacherToolsSubWizard(EXAM_BUILD_SUB_STEPS, {
    storageKey: 'tutify-exam-create-substep',
  })
  const { isExemplarPreview, enterExemplarPreview, exitExemplarPreview } = useTeacherToolsExemplarPreview()

  const examBuildInput: ExamRagBuildInput = useMemo(
    () => ({
      title,
      generateWithoutSources: rag.generateWithoutSources,
      selectedBookIds: rag.selectedBookIds,
      selectedTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement,
      durationMinutes,
      sectionTargetCount,
      paper,
    }),
    [
      title,
      rag.generateWithoutSources,
      rag.selectedBookIds,
      rag.selectedTopics,
      rag.scopeRefinement,
      durationMinutes,
      sectionTargetCount,
      paper,
    ],
  )

  const currentStepValidation = useMemo(
    () => validateExamBuildSubStep(subWizard.currentStepId as ExamBuildSubStepId, examBuildInput),
    [subWizard.currentStepId, examBuildInput],
  )

  const fullBuildValidation = useMemo(() => validateRagExamBuild(examBuildInput), [examBuildInput])

  const hasGeneratedContent =
    (examMcqs.length > 0 || examShorts.length > 0 || examLongs.length > 0 || generatedSections.length > 0) &&
    !isExemplarPreview
  const topMaxReachable =
    examMcqs.length > 0 || examShorts.length > 0 || examLongs.length > 0 || generatedSections.length > 0 ? 1 : 0

  const formBaselineReady = useTeacherToolsFormBaselineReady(hydrateReady, isEdit)

  const formSnapshot = useMemo(
    () =>
      JSON.stringify({
        phase,
        title,
        examType,
        term,
        durationMinutes,
        subject,
        grade,
        internationalStandard,
        sectionTargetCount,
        paper,
        scheduleDate,
        scheduleTime,
        selectedClasses,
        mcqCount: examMcqs.length,
        shortCount: examShorts.length,
        longCount: examLongs.length,
        sectionCount: generatedSections.length,
        rag: rag.generationSignature,
        subStep: subWizard.currentStep,
        subMax: subWizard.maxUnlockedStep,
        exemplar: isExemplarPreview,
        examId: effectiveExamId,
      }),
    [
      phase,
      title,
      examType,
      term,
      durationMinutes,
      subject,
      grade,
      internationalStandard,
      sectionTargetCount,
      paper,
      scheduleDate,
      scheduleTime,
      selectedClasses,
      examMcqs.length,
      examShorts.length,
      examLongs.length,
      generatedSections.length,
      rag.generationSignature,
      subWizard.currentStep,
      subWizard.maxUnlockedStep,
      isExemplarPreview,
      effectiveExamId,
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
      examMcqs.length > 0 ||
      examShorts.length > 0 ||
      examLongs.length > 0 ||
      generatedSections.length > 0 ||
      !!effectiveExamId ||
      wizardProgress
    )
  }, [
    isEdit,
    isFormDirty,
    rag.isDirty,
    examMcqs.length,
    examShorts.length,
    examLongs.length,
    generatedSections.length,
    effectiveExamId,
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
    if (!isEdit) setBackendExamId(null)
    clearBaseline()
  }, [rag, subWizard, exitExemplarPreview, isEdit, clearBaseline])

  const { discardOpen, requestLeave, confirmDiscard, cancelDiscard } = useTeacherToolsLeaveGuard(
    hasUnsavedWork,
    clearSessionOnLeave,
  )

  const handleBackToConfigure = useCallback(() => {
    if (isExemplarPreview) {
      exitExemplarPreview()
      setExamMcqs([])
      setExamShorts([])
      setExamLongs([])
      setGeneratedSections([])
      if (!isEdit) setBackendExamId(null)
      subWizard.resetWizard()
    }
    setPhase('build')
  }, [isExemplarPreview, exitExemplarPreview, isEdit, subWizard])

  const handleShowExemplar = useCallback(() => {
    const ex = EXAM_EXEMPLAR.input
    if (!isEdit) setBackendExamId(null)
    enterExemplarPreview()
    setTitle(ex.title)
    setExamType(ex.examType)
    setTerm(ex.term)
    setDurationMinutes(ex.durationMinutes)
    setSubject(ex.subject)
    setGrade(ex.grade)
    setInternationalStandard(ex.internationalStandard)
    setSectionTargetCount(ex.sectionTargetCount)
    setPaper(ex.paper)
    rag.applySourceSnapshot({
      bookIds: ex.bookIds,
      topics: ex.topics,
      refinement: ex.scopeRefinement,
      generateWithoutSources: ex.generateWithoutSources,
    })
    setExamMcqs(EXAM_EXEMPLAR.output.mcqs)
    setExamShorts(EXAM_EXEMPLAR.output.shorts)
    setExamLongs(EXAM_EXEMPLAR.output.longs)
    setGeneratedSections(EXAM_EXEMPLAR.output.sections)
    setBuildErrors([])
    subWizard.unlockAllSteps()
    setPhase('review')
    toast.success(t('teacherTools.toastExemplarLoaded'))
  }, [rag, subWizard, toast, enterExemplarPreview, isEdit])

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
    if (searchParams.get('fromTemplate') && !templateToastRef.current) {
      templateToastRef.current = true
      toast.success(t('teacherTools.toastPrefilledTemplate'))
    }
  }, [isEdit, searchParams, toast])

  const sectionsSeed: ExamSectionStub[] = useMemo(
    () => generateExamSectionStubs(rag.getGenerationContext()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rag.generationSignature, rag.getGenerationContext]
  )

  const paperMarks = useMemo(() => deriveExamPaperMarks(paper), [paper])

  useEffect(() => {
    if (phase !== 'review') return
    setGeneratedSections((prev) => {
      if (prev.length === 0) return prev
      return alignExamBlueprintMarksToTotal(prev, paperMarks.grand)
    })
  }, [paperMarks.grand, phase])

  const schedule = useMemo(() => {
    const start = scheduleStartIso ? new Date(scheduleStartIso) : new Date()
    if (!scheduleStartIso) {
      start.setDate(start.getDate() + 10)
      start.setHours(9, 0, 0, 0)
    }
    const end = new Date(start)
    end.setMinutes(end.getMinutes() + durationMinutes)
    return { start: start.toISOString(), end: end.toISOString() }
  }, [durationMinutes, scheduleStartIso])

  useEffect(() => {
    if (!isEdit || !examId) {
      setHydrateReady(true)
      return
    }
    let cancelled = false
    setHydrateReady(false)
    ;(async () => {
      try {
        const ex = await examApi.fetchExam(examId)
        if (cancelled) return
        setScopeHydration({
          bookIds: ex.sourceBookIds ?? [],
          topics: ex.scopeTopics ?? [],
          refinement: ex.scopeRefinement ?? '',
          without: ex.generateWithoutSources,
        })
        applyExamFromApi(ex)
        examQsHydratedRef.current = true
        setHydrateReady(true)
      } catch {
        if (cancelled) return
        toast.error(t('exam.toastNotFound'))
        navigate('/teacher-tools/exams')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [applyExamFromApi, examId, isEdit, navigate, toast])

  const runGeneration = async () => {
    const errs: string[] = []
    const ragV = validateRagExamBuild({
      title,
      generateWithoutSources: rag.generateWithoutSources,
      selectedBookIds: rag.selectedBookIds,
      selectedTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement,
    })
    if (!ragV.ok) errs.push(...ragV.errors)
    const pe = validateExamPaperFields(paper)
    if (Object.keys(pe).length > 0) errs.push(t('exam.paperStructureValidation'))
    if (errs.length > 0) {
      setBuildErrors(errs)
      toast.error(t('teacherTools.toastFixFields'))
      return
    }
    setBuildErrors([])
    setGenerationError(null)
    setCreditGate(null)
    setRegenCreditGate(null)
    exitExemplarPreview()
    setGenProgress(0.15)
    setGenerating(true)
    const progressTimer = window.setInterval(() => {
      setGenProgress((p) => Math.min(0.92, p + Math.random() * 0.08))
    }, 400)
    try {
      let id = effectiveExamId
      const classes = selectedClasses.length > 0 ? selectedClasses : [classKeyForGrade(grade)]
      if (!id) {
        const created = await examApi.createExam({
          title: title.trim() || t('exam.untitled'),
          subject,
          grade,
          examType,
          term,
          internationalStandard,
          durationMinutes,
          scheduleStart: null,
          scheduleEnd: null,
          classes,
          status: 'draft',
          sectionTargetCount,
          sourceBookIds: rag.selectedBookIds,
          scopeTopics: rag.selectedTopics,
          scopeRefinement: rag.scopeRefinement || undefined,
          generateWithoutSources: rag.generateWithoutSources,
          paper,
          handoutLayout,
        })
        id = created.id
        setBackendExamId(id)
      } else {
        await examApi.patchExam(id, {
          paper,
          sectionTargetCount,
          examType,
          term,
          internationalStandard,
          durationMinutes,
          sourceBookIds: rag.selectedBookIds,
          scopeTopics: rag.selectedTopics,
          scopeRefinement: rag.scopeRefinement || undefined,
          generateWithoutSources: rag.generateWithoutSources,
          handoutLayout,
        })
      }
      const gen = await examApi.generateExam(id, { regenerateScope: 'all' }, crypto.randomUUID())
      applyExamFromApi(gen.exam)
      setPhase('review')
      if (gen.warnings?.length) {
        toast.success(
          gen.warnings.length === 1
            ? t('exam.toastGeneratedWithNotices', { count: gen.warnings.length })
            : t('exam.toastGeneratedWithNoticesPlural', { count: gen.warnings.length }),
        )
      } else toast.success(t('exam.toastGenerated'))
      refreshCredits()
    } catch (e) {
      console.warn('[ExamCreate] generate failed', e)
      const credit = parseCreditError(e)
      if (credit) {
        setCreditGate(credit)
        setGenerationError(null)
        return
      }
      setGenerationError(t('exam.generationFailed'))
      toast.error(t('exam.toastGenerateFailed'))
    } finally {
      window.clearInterval(progressTimer)
      setGenerating(false)
      setGenProgress(1)
    }
  }

  const regenerateSections = async () => {
    if (!effectiveExamId) {
      toast.error(t('exam.toastGenerateFirst'))
      return
    }
    setCreditGate(null)
    setRegenCreditGate(null)
    setExamRegenerateBusy('sections')
    try {
      const gen = await examApi.generateExam(effectiveExamId, { regenerateScope: 'all' }, crypto.randomUUID())
      applyExamFromApi(gen.exam)
      toast.success(t('exam.toastRegenerated'))
      refreshCredits()
    } catch (e) {
      const credit = parseCreditError(e)
      if (credit) {
        setCreditGate(credit)
        return
      }
      toast.error(t('exam.toastRegenFailed'))
    } finally {
      setExamRegenerateBusy(null)
    }
  }

  const reorderMcq = async (from: number, to: number) => {
    if (!effectiveExamId) return
    if (to < 0 || to >= examMcqs.length) return
    const next = [...examMcqs]
    const [x] = next.splice(from, 1)
    next.splice(to, 0, x!)
    const order = next.map((q, i) => ({ id: q._id, sort_order: i }))
    try {
      const updated = await examApi.reorderMcqs(effectiveExamId, order)
      applyExamFromApi(updated)
    } catch {
      toast.error(t('exam.toastReorderFailed'))
    }
  }
  const deleteMcq = async (index: number) => {
    if (!effectiveExamId) return
    const q = examMcqs[index]
    if (!q) return
    try {
      const updated = await examApi.deleteMcq(effectiveExamId, q._id)
      applyExamFromApi(updated)
    } catch {
      toast.error(t('exam.toastDeleteFailed'))
    }
  }
  const regenerateMcq = async (index: number) => {
    if (!effectiveExamId) return
    const q = examMcqs[index]
    if (!q) return
    const prevStem = q.stem
    const prevOpts = [...q.options]
    setRegenCreditGate(null)
    setExamRegenerateBusy(`mcq:${q._id}`)
    try {
      const updated = await examApi.regenerateMcqApi(effectiveExamId, q._id)
      const next = updated.mcqs.find((m) => m.id === q._id)
      applyExamFromApi(updated)
      if (next && normExamText(prevStem) === normExamText(next.stem) && sameOptionLists(prevOpts, next.options)) {
        toast.warning(t('exam.toastSameQuestion'))
      } else {
        toast.success(t('exam.toastQuestionRegenerated'))
      }
      refreshCredits()
    } catch (e) {
      const credit = parseCreditError(e)
      if (credit) {
        setRegenCreditGate(credit)
        return
      }
      toast.error(t('exam.toastRegenFailed'))
    } finally {
      setExamRegenerateBusy(null)
    }
  }
  const addManualMcq = async () => {
    if (!effectiveExamId) {
      toast.error(t('exam.toastShellFirst'))
      return
    }
    const stub = blankMcqStub(paper)
    try {
      const updated = await examApi.addMcq(effectiveExamId, {
        stem: stub.stem,
        options: stub.options,
        marksPer: paper.objMarksPer,
      })
      applyExamFromApi(updated)
    } catch {
      toast.error(t('exam.toastAddFailed'))
    }
  }
  const openEditMcq = (index: number) => {
    const q = examMcqs[index]
    if (!q) return
    setEditMcqIdx(index)
    setEditMcqStem(q.stem)
    setEditMcqOptionsText(q.options.join('\n'))
  }

  const reorderShort = async (from: number, to: number) => {
    if (!effectiveExamId) return
    if (to < 0 || to >= examShorts.length) return
    const next = [...examShorts]
    const [x] = next.splice(from, 1)
    next.splice(to, 0, x!)
    const order = next.map((q, i) => ({ id: q._id, sort_order: i }))
    try {
      const updated = await examApi.reorderShorts(effectiveExamId, order)
      applyExamFromApi(updated)
    } catch {
      toast.error(t('exam.toastReorderFailed'))
    }
  }
  const deleteShort = async (index: number) => {
    if (!effectiveExamId) return
    const q = examShorts[index]
    if (!q) return
    try {
      const updated = await examApi.deleteShort(effectiveExamId, q._id)
      applyExamFromApi(updated)
    } catch {
      toast.error(t('exam.toastDeleteFailed'))
    }
  }
  const regenerateShort = async (index: number) => {
    if (!effectiveExamId) return
    const q = examShorts[index]
    if (!q) return
    const prevStem = q.stem
    setRegenCreditGate(null)
    setExamRegenerateBusy(`short:${q._id}`)
    try {
      const updated = await examApi.regenerateShortApi(effectiveExamId, q._id)
      const next = updated.shorts.find((s) => s.id === q._id)
      applyExamFromApi(updated)
      if (next && normExamText(prevStem) === normExamText(next.stem)) {
        toast.warning(t('exam.toastSameQuestion'))
      } else {
        toast.success(t('exam.toastQuestionRegenerated'))
      }
      refreshCredits()
    } catch (e) {
      const credit = parseCreditError(e)
      if (credit) {
        setRegenCreditGate(credit)
        return
      }
      toast.error(t('exam.toastRegenFailed'))
    } finally {
      setExamRegenerateBusy(null)
    }
  }
  const addManualShort = async () => {
    if (!effectiveExamId) {
      toast.error(t('exam.toastShellFirstShort'))
      return
    }
    const stub = blankShortStub()
    try {
      const updated = await examApi.addShort(effectiveExamId, { stem: stub.stem, marksPer: paper.shortMarksPer })
      applyExamFromApi(updated)
    } catch {
      toast.error(t('exam.toastAddFailed'))
    }
  }
  const openEditShort = (index: number) => {
    const q = examShorts[index]
    if (!q) return
    setEditShortIdx(index)
    setEditShortStem(q.stem)
  }

  const reorderLong = async (from: number, to: number) => {
    if (!effectiveExamId) return
    if (to < 0 || to >= examLongs.length) return
    const next = [...examLongs]
    const [x] = next.splice(from, 1)
    next.splice(to, 0, x!)
    const order = next.map((q, i) => ({ id: q._id, sort_order: i }))
    try {
      const updated = await examApi.reorderLongs(effectiveExamId, order)
      applyExamFromApi(updated)
    } catch {
      toast.error(t('exam.toastReorderFailed'))
    }
  }
  const deleteLong = async (index: number) => {
    if (!effectiveExamId) return
    const q = examLongs[index]
    if (!q) return
    try {
      const updated = await examApi.deleteLong(effectiveExamId, q._id)
      applyExamFromApi(updated)
    } catch {
      toast.error(t('exam.toastDeleteFailed'))
    }
  }
  const regenerateLong = async (index: number) => {
    if (!effectiveExamId) return
    const q = examLongs[index]
    if (!q) return
    const prevStem = q.stem
    const prevSub = [...q.subparts]
    setRegenCreditGate(null)
    setExamRegenerateBusy(`long:${q._id}`)
    try {
      const updated = await examApi.regenerateLongApi(effectiveExamId, q._id)
      const next = updated.longs.find((lg) => lg.id === q._id)
      applyExamFromApi(updated)
      if (
        next &&
        normExamText(prevStem) === normExamText(next.stem) &&
        sameOptionLists(prevSub, next.subparts)
      ) {
        toast.warning(t('exam.toastSameQuestion'))
      } else {
        toast.success(t('exam.toastQuestionRegenerated'))
      }
      refreshCredits()
    } catch (e) {
      const credit = parseCreditError(e)
      if (credit) {
        setRegenCreditGate(credit)
        return
      }
      toast.error(t('exam.toastRegenFailed'))
    } finally {
      setExamRegenerateBusy(null)
    }
  }
  const addManualLong = async () => {
    if (!effectiveExamId) {
      toast.error(t('exam.toastShellFirstShort'))
      return
    }
    const stub = blankLongStub(paper)
    try {
      const updated = await examApi.addLong(effectiveExamId, {
        stem: stub.stem,
        subparts: stub.subparts,
        marksPer: paper.longMarksPer,
      })
      applyExamFromApi(updated)
    } catch {
      toast.error(t('exam.toastAddFailed'))
    }
  }
  const openEditLong = (index: number) => {
    const q = examLongs[index]
    if (!q) return
    setEditLongIdx(index)
    setEditLongStem(q.stem)
    setEditLongSubpartsText(q.subparts.join('\n'))
  }

  const buildPatchPayload = (status: 'draft' | 'scheduled'): examApi.ExamPatchPayload => {
    const classes = selectedClasses.length > 0 ? selectedClasses : [classKeyForGrade(grade)]
    return {
      title: title.trim() || t('exam.untitled'),
      subject,
      grade,
      term,
      examType,
      internationalStandard,
      durationMinutes,
      scheduleStart: schedule.start,
      scheduleEnd: schedule.end,
      classes,
      status,
      completionPct: isEdit ? completionMeta.completionPct : 0,
      sectionTargetCount,
      sourceBookIds: rag.selectedBookIds,
      scopeTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement || undefined,
      generateWithoutSources: rag.generateWithoutSources,
      paper,
      handoutLayout,
    }
  }

  const handleSaveDraft = async () => {
    if (isExemplarPreview) {
      toast.error(t('teacherTools.toastExemplarNotSaved'))
      return
    }
    if (phase !== 'review' && examMcqs.length === 0) {
      toast.error(t('exam.toastDraftNeedsExam'))
      return
    }
    if (!effectiveExamId) {
      toast.error(t('exam.toastSaveFirst'))
      return
    }
    setSaveDraftPending(true)
    try {
      await examApi.patchExam(effectiveExamId, buildPatchPayload('draft'))
      toast.success(t('teacherTools.toastDraftSaved'))
      navigate(`/teacher-tools/exams/${effectiveExamId}`)
    } catch {
      toast.error(t('teacherTools.toastDraftFailed'))
    } finally {
      setSaveDraftPending(false)
    }
  }

  const handlePublish = async () => {
    if (isExemplarPreview) {
      toast.error(t('exam.toastExemplarCannotSchedule'))
      return
    }
    if (phase !== 'review' && examMcqs.length === 0) {
      toast.error(t('exam.toastScheduleNeedsExam'))
      return
    }
    if (!effectiveExamId) {
      toast.error(t('exam.toastGenerateFirst'))
      return
    }
    setPublishPending(true)
    try {
      await examApi.patchExam(effectiveExamId, buildPatchPayload('scheduled'))
      toast.success(isEdit ? t('exam.toastUpdated') : t('exam.toastScheduled'))
      navigate('/teacher-tools/exams')
    } catch {
      toast.error(t('exam.toastSaveFailed'))
    } finally {
      setPublishPending(false)
    }
  }

  const goList = useCallback(() => navigate('/teacher-tools/exams'), [navigate])

  const handleExitToList = useCallback(() => {
    requestLeave(goList)
  }, [requestLeave, goList])

  const exportPdf = () => {
    if (examMcqs.length === 0) {
      toast.error(t('exam.toastPdfNeedsExam'))
      return
    }
    downloadExamHandoutPdf(
      {
        title: `${title || t('exam.fallbackTitle')} — ${t('exam.previewTitleSuffix')}`,
        subject,
        grade,
        timeLimitMinutes: durationMinutes,
        topic: rag.combinedTopicLabel,
        sourceSummary: formatSourceSummary(rag.getGenerationContext()),
        mcqs: examMcqs.map((q) => ({ stem: q.stem, options: q.options, marks: paper.objMarksPer })),
        shorts: examShorts.map((q) => ({ stem: q.stem, marks: paper.shortMarksPer })),
        longs: examLongs.map((q) => ({ stem: q.stem, subparts: [...q.subparts], marks: paper.longMarksPer })),
        handoutLayout,
      },
      `${(title || 'exam').replace(/\s+/g, '-').slice(0, 32)}-exam.pdf`,
    )
    toast.success(t('teacherTools.toastPdfDownloaded'))
  }

  if (isEdit && !hydrateReady) {
    return (
      <div className="min-h-[40vh] space-y-3 p-8">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-32 max-w-xl animate-pulse rounded-2xl bg-gray-100" />
        <p className="text-sm text-gray-600">{t('exam.detail.loading')}</p>
      </div>
    )
  }

  const wizardStep = phase === 'build' ? 0 : 1
  const sections = generatedSections.length > 0 ? generatedSections : sectionsSeed
  const reviewSourceTag = rag.generateWithoutSources ? t('teacherTools.topicOnlyTag') : t('teacherTools.sourcesSelected')

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
      generateLabel={t('exam.generateLabel')}
      onShowExemplar={handleShowExemplar}
      onExitToList={handleExitToList}
      exitLabel={t('exam.exitLabel')}
    />
  )

  const reviewFooter = (
    <TeacherToolsCreateReviewFooter
      exitLabel={t('exam.exitLabel')}
      onExitToList={handleExitToList}
      onEditRequirements={handleBackToConfigure}
      publish={{
        onPrintPreview: () => {
          setDraftLayout(handoutLayout)
          setPreviewOpen(true)
        },
        printPreviewDisabled: examMcqs.length === 0,
        onSaveDraft: () => void handleSaveDraft(),
        saveDraftPending,
        saveDraftDisabled: isExemplarPreview,
        onExportPdf: exportPdf,
        exportDisabled: examMcqs.length === 0,
        onPublish: () => void handlePublish(),
        publishPending,
        publishDisabled: isExemplarPreview,
        publishLabel: isEdit ? t('exam.saveChanges') : t('exam.scheduleExam'),
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
            title={isEdit ? t('exam.editTitle') : t('exam.createTitle')}
            subtitle={t('exam.createSubtitle')}
            breadcrumbs={[
              { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
              { label: t('exam.breadcrumb'), to: '/teacher-tools/exams' },
              { label: isEdit ? t('teacherTools.breadcrumbEdit') : t('teacherTools.breadcrumbCreate') },
            ]}
          />
          <div className="pb-2">
            <TeacherToolsConfigureNav
              primarySteps={[...EXAM_CREATION_STEPS]}
              primaryCurrent={wizardStep}
              primaryMaxReachable={topMaxReachable}
              onPrimaryStepClick={(i) => {
                const hasReviewContent =
                  examMcqs.length > 0 || examShorts.length > 0 || examLongs.length > 0 || generatedSections.length > 0
                if (i === 1 && !hasReviewContent) {
                  toast.error(t('exam.toastReviewNeedsGenerate'))
                  return
                }
                if (i === 0) handleBackToConfigure()
                else setPhase('review')
              }}
              showSubSteps={phase === 'build'}
              subSteps={EXAM_BUILD_SUB_STEPS}
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
      <QuizGeneratingOverlay open={generating} progress={genProgress} />
      {generationError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {generationError}
          <button
            type="button"
            className="ml-3 font-semibold underline"
            onClick={() => setGenerationError(null)}
          >
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

      {phase === 'review' && regenCreditGate && (
        <NoCreditsCard
          compact
          reason={regenCreditGate.reason}
          balance={regenCreditGate.balance}
          required={regenCreditGate.required}
          onActivated={() => setRegenCreditGate(null)}
        />
      )}

      {phase === 'build' && (
        <>
          <TeacherToolsFieldErrors errors={currentStepValidation.errors} />
          {subWizard.currentStepId === 'basics' && (
          <ExamSectionShell
            variant="blue"
            compact
            header={
              <TeacherToolsPanelHeader
                kicker={t('exam.create.identityKicker')}
                title={t('exam.create.basicsTitle')}
                subtitle={t('exam.create.basicsSubtitle')}
                tone="indigo"
              />
            }
          >
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <label className="md:col-span-2 block text-sm font-medium text-gray-800">
                {t('exam.create.examTitle')} <span className="text-red-500">*</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('exam.examTitlePlaceholder')}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                {t('exam.create.examType')}
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as (typeof EXAM_TYPES)[number])}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {EXAM_TYPES.map((typeValue) => (
                    <option key={typeValue} value={typeValue}>
                      {t(EXAM_TYPE_LABEL_KEYS[typeValue])}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                {t('exam.create.term')}
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value as (typeof TERMS)[number])}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {TERMS.map((termValue) => (
                    <option key={termValue} value={termValue}>
                      {t(TERM_LABEL_KEYS[termValue])}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                {t('exam.create.durationMinutes')}
                <input
                  type="number"
                  value={durationMinutes}
                  min={15}
                  max={360}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 60)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                />
              </label>
              <label className="block text-sm font-medium text-gray-800">
                {t('teacherTools.subject')}
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                {t('teacherTools.gradeCohort')}
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium text-gray-800">
                {t('exam.create.internationalStandard')}
                <select
                  value={internationalStandard}
                  onChange={(e) =>
                    setInternationalStandard(e.target.value as (typeof INTERNATIONAL_STANDARDS)[number])
                  }
                  className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
                >
                  {INTERNATIONAL_STANDARDS.map((standardValue) => (
                    <option key={standardValue} value={standardValue}>
                      {t(STANDARD_LABEL_KEYS[standardValue])}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </ExamSectionShell>
          )}

          {subWizard.currentStepId === 'sources' && (
          <ExamSectionShell
            variant="teal"
            compact
            header={
              <TeacherToolsPanelHeader
                kicker={t('exam.create.contentSourcesKicker')}
                title={t('worksheet.rag.sourcesTitle')}
                subtitle={t('worksheet.rag.sourcesSubtitle')}
                tone="emerald"
              />
            }
          >
            <div className="p-5">
              <ExamSourcesRagPanel rag={rag} subject={subject} grade={grade} panelStep="sources" />
            </div>
          </ExamSectionShell>
          )}

          {subWizard.currentStepId === 'scope' && (
          <ExamSectionShell
            variant="coral"
            compact
            header={
              <TeacherToolsPanelHeader
                kicker={t('exam.create.scopeKicker')}
                title={t('worksheet.rag.scopeTitle')}
                subtitle={t('worksheet.rag.scopeSubtitle')}
                tone="violet"
              />
            }
          >
            <div className="p-5">
              <ExamSourcesRagPanel rag={rag} subject={subject} grade={grade} panelStep="scope" />
            </div>
          </ExamSectionShell>
          )}

          {subWizard.currentStepId === 'paper_structure' && (
          <div className="space-y-3">
            <TeacherToolsPanelHeader
              kicker={t('exam.create.paperStructureKicker')}
              title={t('exam.create.paperStructureTitle')}
              subtitle={t('exam.create.paperStructureSubtitle')}
              tone="gray"
            />
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <label className="mb-4 block text-sm font-medium text-gray-800">
              {t('exam.create.targetSectionCount')}
              <input
                type="number"
                min={1}
                max={12}
                value={sectionTargetCount}
                onChange={(e) => setSectionTargetCount(Math.min(12, Math.max(1, Number(e.target.value) || 4)))}
                className="mt-1.5 w-full max-w-xs rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
            </label>
            <ExamPaperStructureCard paper={paper} onChange={(patch) => setPaper((p) => ({ ...p, ...patch }))} />
            </div>
          </div>
          )}

          {buildErrors.length > 0 && !currentStepValidation.errors.length && (
            <TeacherToolsFieldErrors errors={buildErrors} />
          )}
        </>
      )}

      {phase === 'review' && (
        <div className="space-y-3">
          {isExemplarPreview && <TeacherToolsExemplarReviewBanner />}
          <TeacherToolsReviewHeaderCompact
            sourceTag={reviewSourceTag}
            stats={[{ label: t('exam.statMarks'), value: paperMarks.grand }]}
            actions={
              <>
                <button
                  type="button"
                  onClick={() => {
                    setDraftLayout(handoutLayout)
                    setPreviewOpen(true)
                  }}
                  disabled={examMcqs.length === 0}
                  className="rounded-lg border border-indigo-200 bg-white px-2 py-1 text-xs font-semibold text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
                >
                  {t('quiz.review.printPreview')}
                </button>
                <button
                  type="button"
                  disabled={examRegenerateBusy !== null || isExemplarPreview}
                  onClick={() => void regenerateSections()}
                  className="rounded-lg border border-indigo-200 bg-white px-2 py-1 text-xs font-semibold text-indigo-800 hover:bg-indigo-50 disabled:opacity-50"
                >
                  {examRegenerateBusy === 'sections' ? t('quiz.review.regeneratingAll') : t('quiz.review.regenerateAll')}
                </button>
              </>
            }
          />

          <ExamPaperQuestionsReview
            paper={paper}
            mcqs={examMcqs}
            shorts={examShorts}
            longs={examLongs}
            objMarksPer={paper.objMarksPer}
            shortMarksPer={paper.shortMarksPer}
            longMarksPer={paper.longMarksPer}
            onReorderMcq={reorderMcq}
            onDeleteMcq={deleteMcq}
            onRegenerateMcq={regenerateMcq}
            onEditMcq={openEditMcq}
            onAddManualMcq={addManualMcq}
            onReorderShort={reorderShort}
            onDeleteShort={deleteShort}
            onRegenerateShort={regenerateShort}
            onEditShort={openEditShort}
            onAddManualShort={addManualShort}
            onReorderLong={reorderLong}
            onDeleteLong={deleteLong}
            onRegenerateLong={regenerateLong}
            onEditLong={openEditLong}
            onAddManualLong={addManualLong}
            regenerateBusyKey={examRegenerateBusy}
          />

          <ExamPaperStructureReviewCard paper={paper} onEdit={handleBackToConfigure} />
        </div>
      )}
      </div>
    </TeacherToolsCreateLayout>

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
        open={previewOpen}
        close={() => setPreviewOpen(false)}
        title={t('exam.printPreviewTitle')}
        primaryButtonText={t('quiz.printPreview.saveLayoutClose')}
        handleSave={() => {
          setHandoutLayout(draftLayout)
          setPreviewOpen(false)
        }}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-3 py-2.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-900">{t('quiz.printPreview.handoutSpacing')}</span>
            <label className="flex items-center gap-1.5 text-xs text-gray-800">
              <span className="text-gray-600">{t('quiz.printPreview.lineHeight')}</span>
              <select
                value={draftLayout.bodyLineHeight}
                onChange={(e) =>
                  setDraftLayout((l) => ({ ...l, bodyLineHeight: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.bodyLineHeight }))
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
              >
                {LINE_HEIGHT_PRESETS.map((lh) => <option key={lh} value={lh}>{lh}</option>)}
              </select>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-800">
              <span className="text-gray-600">{t('teacherTools.questionGap')}</span>
              <select
                value={draftLayout.questionGapPx}
                onChange={(e) =>
                  setDraftLayout((l) => ({ ...l, questionGapPx: Number(e.target.value) || DEFAULT_HANDOUT_LAYOUT.questionGapPx }))
                }
                className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium shadow-sm"
              >
                {QUESTION_GAP_PRESETS.map((px) => <option key={px} value={px}>{px}px</option>)}
              </select>
            </label>
          </div>
          <div className="max-h-[60vh] overflow-y-auto py-3">
            <ExamPrintPreviewContent
              title={title}
              subject={subject}
              grade={grade}
              examType={examType}
              durationMinutes={durationMinutes}
              scheduleStartIso={schedule.start}
              paper={paper}
              sections={sections}
              draftLayout={draftLayout}
              fmtWindow={fmtWindowLine}
              reviewMcqs={examMcqs}
              reviewShorts={examShorts}
              reviewLongs={examLongs}
            />
          </div>
        </div>
      </CustomModal>

      <CustomModal
        open={editMcqIdx !== null}
        close={() => setEditMcqIdx(null)}
        title={t('exam.editMcq')}
        primaryButtonText={t('teacherTools.save')}
        handleSave={() => {
          void (async () => {
            if (editMcqIdx === null || !effectiveExamId) return
            const q = examMcqs[editMcqIdx]
            if (!q) return
            const need = paper.objOptions
            const lines = editMcqOptionsText.split('\n').map((l) => l.trim()).filter(Boolean)
            const opts = [...lines]
            while (opts.length < need) opts.push(`Option ${String.fromCharCode(65 + opts.length)}`)
            const final = opts.slice(0, need)
            try {
              const updated = await examApi.patchMcq(effectiveExamId, q._id, {
                stem: editMcqStem.trim() || q.stem,
                options: final,
              })
              applyExamFromApi(updated)
              setEditMcqIdx(null)
            } catch {
              toast.error(t('exam.toastSaveQuestionFailed'))
            }
          })()
        }}
      >
        <div className="space-y-3 py-2">
          <label className="block text-sm font-medium text-gray-800">
            Stem
            <textarea
              value={editMcqStem}
              onChange={(e) => setEditMcqStem(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Options (one per line, {paper.objOptions} required)
            <textarea
              value={editMcqOptionsText}
              onChange={(e) => setEditMcqOptionsText(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 font-mono text-sm"
            />
          </label>
        </div>
      </CustomModal>

      <CustomModal
        open={editShortIdx !== null}
        close={() => setEditShortIdx(null)}
        title={t('exam.editShort')}
        primaryButtonText={t('teacherTools.save')}
        handleSave={() => {
          void (async () => {
            if (editShortIdx === null || !effectiveExamId) return
            const q = examShorts[editShortIdx]
            if (!q) return
            try {
              const updated = await examApi.patchShort(effectiveExamId, q._id, { stem: editShortStem.trim() || q.stem })
              applyExamFromApi(updated)
              setEditShortIdx(null)
            } catch {
              toast.error(t('exam.toastSaveQuestionFailed'))
            }
          })()
        }}
      >
        <div className="space-y-3 py-2">
          <label className="block text-sm font-medium text-gray-800">
            Stem
            <textarea
              value={editShortStem}
              onChange={(e) => setEditShortStem(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </CustomModal>

      <CustomModal
        open={editLongIdx !== null}
        close={() => setEditLongIdx(null)}
        title={t('exam.editLong')}
        primaryButtonText={t('teacherTools.save')}
        handleSave={() => {
          void (async () => {
            if (editLongIdx === null || !effectiveExamId) return
            const q = examLongs[editLongIdx]
            if (!q) return
            const parts = editLongSubpartsText
              .split('\n')
              .map((l) => l.trim())
              .filter(Boolean)
            const sub = parts.length > 0 ? parts : ['(a) Enter sub-part…']
            const capped = sub.slice(0, Math.max(1, paper.longSubparts))
            try {
              const updated = await examApi.patchLong(effectiveExamId, q._id, {
                stem: editLongStem.trim() || q.stem,
                subparts: capped,
              })
              applyExamFromApi(updated)
              setEditLongIdx(null)
            } catch {
              toast.error(t('exam.toastSaveQuestionFailed'))
            }
          })()
        }}
      >
        <div className="space-y-3 py-2">
          <label className="block text-sm font-medium text-gray-800">
            Introduction
            <textarea
              value={editLongStem}
              onChange={(e) => setEditLongStem(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-gray-800">
            Sub-parts (one per line, up to {paper.longSubparts})
            <textarea
              value={editLongSubpartsText}
              onChange={(e) => setEditLongSubpartsText(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </CustomModal>
    </>
  )
}
