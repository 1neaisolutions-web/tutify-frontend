import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsWizardStepper } from '../components'
import { demoClasses } from '../demo/teacherToolsDemoData'
import {
  formatSourceSummary,
  type QuizDifficultyId,
  type QuizQuestionStub,
  type QuestionMixMode,
  type QuizStubCriteria,
} from '../demo/generationFromSources'
import { downloadQuizPdf } from '../utils/generateQuizPdf'
import type { DemoQuiz } from '../demo/teacherToolsDemoData'
import { GRADES, SUBJECTS } from '../types'
import { newDemoId } from '../demo/newDemoId'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
// @ts-expect-error — JS module
import { CustomModal } from '../../../../components/shared/CustomModal'
import {
  addQuestion as apiAddQuestion,
  createQuiz as apiCreateQuiz,
  deleteQuestion as apiDeleteQuestion,
  generateQuiz as apiGenerateQuiz,
  patchQuestion as apiPatchQuestion,
  patchQuiz as apiPatchQuiz,
  regenerateQuestion as apiRegenerateQuestion,
  reorderQuestions as apiReorderQuestions,
  type QuestionType,
  type QuizGeneratePayload,
} from '../../../../api/quizApi'
import {
  QUIZ_CREATION_STEPS,
  distributeBalancedToTypeCounts,
  QUESTION_COUNT,
  randomGenerationDelay,
  validateRagQuizBuild,
} from './config/quizCreationConfig'
import { DEFAULT_HANDOUT_LAYOUT, type HandoutLayoutOpts } from './config/handoutLayoutConfig'
import { useQuizRagScope } from './hooks/useQuizRagScope'
import { QuizRagBuildSection } from './components/QuizRagBuildSection'
import { QuizGeneratingOverlay } from './components/QuizGeneratingOverlay'
import { QuizReviewSection } from './components/QuizReviewSection'
import type { QuizPrintMeta } from './components/QuizPrintPreviewModal'
import NoCreditsCard from '../../../../components/NoCreditsCard'
import { getCreditBalance } from '../../../../api/subscriptions'
import { setBalance } from '../../../../redux/features/subscription/subscriptionSlice'
import { parseCreditError, type ParsedCreditError } from '../../../../utils/creditErrors'

function classKeyForGrade(grade: string) {
  return demoClasses.find((c) => c.grade === grade)?.key ?? demoClasses[0]?.key ?? 'g8c'
}

function isDifficultyId(x: string | undefined): x is QuizDifficultyId {
  return x === 'foundation' || x === 'standard' || x === 'challenge'
}

function totalMarksFromStubs(stubs: QuizQuestionStub[]): number {
  return Math.round(stubs.reduce((a, s) => a + (s.points ?? 2), 0) * 10) / 10
}

export default function QuizCreate() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const templateToastRef = useRef(false)
  const { quizId } = useParams<{ quizId?: string }>()
  const isEdit = location.pathname.endsWith('/edit')
  const { toast } = useSnackbar()
  const { api } = useTeacherToolsDemo()
  const dispatch = useDispatch()
  const hasCredits = useSelector((s: any) => (s?.subscription?.hasActiveCredits ?? false) || (s?.subscription?.balance ?? 0) > 0)

  const refreshCredits = useCallback(() => {
    void getCreditBalance()
      .then((b) => dispatch(setBalance(b)))
      .catch(() => {})
  }, [dispatch])

  const [phase, setPhase] = useState<'build' | 'review'>(isEdit ? 'review' : 'build')
  const [generating, setGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [creditGate, setCreditGate] = useState<ParsedCreditError | null>(null)

  useEffect(() => {
    if (!hasCredits) return
    if (creditGate) setCreditGate(null)
  }, [hasCredits])
  const [regenQuestionCreditGate, setRegenQuestionCreditGate] = useState<ParsedCreditError | null>(null)
  const [genProgress, setGenProgress] = useState(0.15)
  const [lastCriteria, setLastCriteria] = useState<QuizStubCriteria | null>(null)
  const [liveQuizId, setLiveQuizId] = useState<string | null>(null)
  const [questionLoadingId, setQuestionLoadingId] = useState<string | null>(null)
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false)

  const [title, setTitle] = useState('Topic check quiz')
  const [subject, setSubject] = useState<string>(SUBJECTS[0])
  const [grade, setGrade] = useState<string>(GRADES[0])
  const [studentInstructions, setStudentInstructions] = useState(
    'Answer all questions. Show working where appropriate.'
  )
  const [teacherNotes, setTeacherNotes] = useState('')
  const [timeLimit, setTimeLimit] = useState(30)
  const [questionCount, setQuestionCount] = useState(10)
  const [mixMode, setMixMode] = useState<QuestionMixMode>('balanced')
  const [countMcq, setCountMcq] = useState(4)
  const [countTf, setCountTf] = useState(3)
  const [countShort, setCountShort] = useState(3)
  const [difficulty, setDifficulty] = useState<QuizDifficultyId>('standard')
  const [includeMcq, setIncludeMcq] = useState(true)
  const [includeTf, setIncludeTf] = useState(true)
  const [includeShort, setIncludeShort] = useState(true)
  const [shuffleQuestions, setShuffleQuestions] = useState(true)
  const [shuffleAnswers, setShuffleAnswers] = useState(true)
  const [negativeMarking, setNegativeMarking] = useState(false)
  const [handoutLayout, setHandoutLayout] = useState<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)
  const handoutLayoutRef = useRef<HandoutLayoutOpts>(DEFAULT_HANDOUT_LAYOUT)

  /** Template / URL hint for optional scope refinement when creating new quiz. */
  const [templateScopeHint, setTemplateScopeHint] = useState('')
  /** Full quiz row when editing — drives RAG scope hydration. */
  const [loadedQuiz, setLoadedQuiz] = useState<DemoQuiz | null>(null)
  const [hydrateReady, setHydrateReady] = useState(!isEdit)
  const [publishPending, setPublishPending] = useState(false)
  const [saveDraftPending, setSaveDraftPending] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
  const [buildErrors, setBuildErrors] = useState<string[]>([])

  const [stubs, setStubs] = useState<QuizQuestionStub[]>([])

  const rag = useQuizRagScope({
    subject,
    grade,
    initialSelectedBookIds: isEdit ? loadedQuiz?.sourceBookIds : undefined,
    initialScopeTopics: isEdit ? loadedQuiz?.scopeTopics : undefined,
    initialScopeRefinement: isEdit ? loadedQuiz?.scopeRefinement : templateScopeHint,
  })

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
    if (topic) setTemplateScopeHint(topic)
    if (searchParams.get('fromTemplate') && !templateToastRef.current) {
      templateToastRef.current = true
      toast.success('Prefilled from template')
    }
  }, [isEdit, searchParams, toast])

  useEffect(() => {
    if (!isEdit || !quizId) {
      setHydrateReady(true)
      return
    }
    let cancelled = false
    setHydrateReady(false)
    ;(async () => {
      const q = await api.getQuiz(quizId)
      if (cancelled) return
      if (!q) {
        toast.error('Quiz not found')
        navigate('/teacher-tools/quiz')
        return
      }
      setTitle(q.title)
      setSubject(q.subject)
      setGrade(q.grade)
      setTimeLimit(q.timeLimitMinutes)
      setLoadedQuiz(q)
      setQuestionCount(q.questions)
      setLiveQuizId(quizId)
      if (q.studentInstructions) setStudentInstructions(q.studentInstructions)
      if (q.difficulty && isDifficultyId(q.difficulty)) setDifficulty(q.difficulty)
      if (typeof q.shuffleQuestions === 'boolean') setShuffleQuestions(q.shuffleQuestions)
      if (typeof q.shuffleAnswers === 'boolean') setShuffleAnswers(q.shuffleAnswers)
      if (typeof q.negativeMarking === 'boolean') setNegativeMarking(q.negativeMarking)
      const hydratedLayout = q.handoutLayout ? { ...DEFAULT_HANDOUT_LAYOUT, ...q.handoutLayout } : DEFAULT_HANDOUT_LAYOUT
      handoutLayoutRef.current = hydratedLayout
      setHandoutLayout(hydratedLayout)
      if (q.questionStubs?.length) {
        setStubs(q.questionStubs)
        setPhase('review')
      } else {
        setPhase('build')
      }
      setHydrateReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [api, isEdit, navigate, quizId, toast])

  const resolveQuizIdForGen = useCallback(() => quizId ?? newDemoId('quiz'), [quizId])

  function genIdempotencyKey(): string {
    // Backend supports Idempotency-Key for /generate. Use a stable-ish UUID when possible.
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  const buildCriteria = useCallback(
    (idForGen: string): QuizStubCriteria => {
      const srcTags = rag.ragSourceLabels.length > 0 ? rag.ragSourceLabels : undefined
      const customSum = countMcq + countTf + countShort
      if (mixMode === 'custom') {
        return {
          quizId: idForGen,
          topic: rag.combinedTopicLabel,
          subject,
          grade,
          count: Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, customSum)),
          difficulty,
          includeMcq: countMcq > 0,
          includeTf: countTf > 0,
          includeShort: countShort > 0,
          teacherNotes: teacherNotes.trim() || undefined,
          mixMode: 'custom',
          countsByType: { mcq: countMcq, tf: countTf, short: countShort },
          ragSourceLabels: srcTags,
        }
      }
      return {
        quizId: idForGen,
        topic: rag.combinedTopicLabel,
        subject,
        grade,
        count: Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, questionCount)),
        difficulty,
        includeMcq,
        includeTf,
        includeShort,
        teacherNotes: teacherNotes.trim() || undefined,
        mixMode: 'balanced',
        ragSourceLabels: srcTags,
      }
    },
    [
      rag.combinedTopicLabel,
      rag.ragSourceLabels,
      subject,
      grade,
      questionCount,
      mixMode,
      countMcq,
      countTf,
      countShort,
      difficulty,
      includeMcq,
      includeTf,
      includeShort,
      teacherNotes,
    ]
  )

  const runGeneration = useCallback(async () => {
    const v = validateRagQuizBuild({
      title,
      generateWithoutSources: rag.generateWithoutSources,
      selectedBookIds: rag.selectedBookIds,
      selectedTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement,
      mixMode,
      includeMcq,
      includeTf,
      includeShort,
      questionCount,
      countsByType: { mcq: countMcq, tf: countTf, short: countShort },
    })
    if (!v.ok) {
      setBuildErrors(v.errors)
      toast.error('Fix the highlighted fields to generate.')
      return
    }
    setBuildErrors([])
    setGenerationError(null)
    setCreditGate(null)
    setRegenQuestionCreditGate(null)
    setGenerating(true)
    setGenProgress(0.12)
    const steps = window.setInterval(() => {
      setGenProgress((p) => Math.min(0.92, p + Math.random() * 0.12))
    }, 450)
    const delay = randomGenerationDelay()
    try {
      await new Promise((r) => setTimeout(r, delay))

      const genPayload: QuizGeneratePayload = {
        questionCount: mixMode === 'custom' ? Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, countMcq + countTf + countShort)) : questionCount,
        mixMode,
        includeMcq: mixMode === 'custom' ? countMcq > 0 : includeMcq,
        includeTf: mixMode === 'custom' ? countTf > 0 : includeTf,
        includeShort: mixMode === 'custom' ? countShort > 0 : includeShort,
        ...(mixMode === 'custom' ? { countsByType: { mcq: countMcq, tf: countTf, short: countShort } } : {}),
        difficulty: difficulty as QuizGeneratePayload['difficulty'],
        teacherNotes: teacherNotes.trim() || undefined,
      }

      const idForCriteria = liveQuizId ?? resolveQuizIdForGen()
      const crit = buildCriteria(idForCriteria)

      if (liveQuizId) {
        const genResult = await apiGenerateQuiz(liveQuizId, genPayload, genIdempotencyKey())
        setStubs(genResult.quiz.questionStubs as any)
        setLastCriteria(crit)
        setPhase('review')
        toast.success('Questions generated — review below.')
        refreshCredits()
        return
      }

      const payload = {
        id: '',
        title: title.trim() || 'Untitled quiz',
        subject,
        grade,
        classes: [classKeyForGrade(grade)],
        questions: 0,
        totalMarks: 0,
        timeLimitMinutes: timeLimit,
        status: 'draft' as const,
        submissionCount: 0,
        avgScore: 0,
        topic: rag.combinedTopicLabel,
        sourceBookIds: rag.selectedBookIds,
        scopeTopics: rag.selectedTopics,
        scopeRefinement: rag.scopeRefinement.trim() || undefined,
        sourceSummary: undefined,
        questionStubs: [],
        studentInstructions,
        difficulty,
        shuffleQuestions,
        shuffleAnswers,
        negativeMarking,
        handoutLayout: handoutLayoutRef.current,
      }

      const createdQuiz = await apiCreateQuiz({
        title: payload.title,
        subject: payload.subject,
        grade: payload.grade,
        classes: payload.classes,
        timeLimitMinutes: payload.timeLimitMinutes,
        studentInstructions: payload.studentInstructions,
        teacherNotes: teacherNotes.trim() || undefined,
        status: 'draft',
        sourceBookIds: payload.sourceBookIds,
        scopeTopics: payload.scopeTopics,
        scopeRefinement: payload.scopeRefinement,
        generateWithoutSources: rag.generateWithoutSources,
        difficulty: difficulty as any,
        shuffleQuestions,
        shuffleAnswers,
        negativeMarking,
        handoutLayout: payload.handoutLayout ?? null,
      })

      setLiveQuizId(createdQuiz.id)

      const genResult = await apiGenerateQuiz(createdQuiz.id, genPayload, genIdempotencyKey())
      setStubs(genResult.quiz.questionStubs as any)
      setLastCriteria(crit)
      setPhase('review')
      toast.success('Questions generated — review below.')
      refreshCredits()
    } catch (e) {
      const credit = parseCreditError(e)
      if (credit) {
        setCreditGate(credit)
        setGenerationError(null)
        return
      }
      setGenerationError('Generation failed. Adjust sources and try again.')
      toast.error('Could not generate questions.')
      console.error('Quiz generation failed:', e)
    } finally {
      window.clearInterval(steps)
      setGenerating(false)
      setGenProgress(1)
    }
  }, [
    title,
    mixMode,
    includeMcq,
    includeTf,
    includeShort,
    questionCount,
    countMcq,
    countTf,
    countShort,
    toast,
    resolveQuizIdForGen,
    buildCriteria,
    rag.generateWithoutSources,
    rag.selectedBookIds,
    rag.selectedTopics,
    rag.scopeRefinement,
    refreshCredits,
  ])

  const regenerateAll = useCallback(() => {
    ;(async () => {
      if (!liveQuizId) {
        toast.error('Quiz is not ready yet. Generate once to create it.')
        return
      }
      if (generating || questionLoadingId || isRegeneratingAll) return
      setIsRegeneratingAll(true)
      setCreditGate(null)
      setRegenQuestionCreditGate(null)
      try {
        const genPayload: QuizGeneratePayload = {
          questionCount: mixMode === 'custom' ? Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, countMcq + countTf + countShort)) : questionCount,
          mixMode,
          includeMcq: mixMode === 'custom' ? countMcq > 0 : includeMcq,
          includeTf: mixMode === 'custom' ? countTf > 0 : includeTf,
          includeShort: mixMode === 'custom' ? countShort > 0 : includeShort,
          ...(mixMode === 'custom' ? { countsByType: { mcq: countMcq, tf: countTf, short: countShort } } : {}),
          difficulty: difficulty as QuizGeneratePayload['difficulty'],
          teacherNotes: teacherNotes.trim() || undefined,
        }
        const genResult = await apiGenerateQuiz(liveQuizId, genPayload, genIdempotencyKey())
        setStubs(genResult.quiz.questionStubs as any)
        const crit = lastCriteria ?? buildCriteria(liveQuizId)
        setLastCriteria(crit)
        toast.success('Question set regenerated.')
        refreshCredits()
      } catch (e) {
        const credit = parseCreditError(e)
        if (credit) {
          setCreditGate(credit)
          return
        }
        console.error('Regenerate all failed:', e)
        toast.error('Could not regenerate question set')
      } finally {
        setIsRegeneratingAll(false)
      }
    })()
  }, [
    liveQuizId,
    mixMode,
    includeMcq,
    includeTf,
    includeShort,
    questionCount,
    countMcq,
    countTf,
    countShort,
    difficulty,
    teacherNotes,
    toast,
    lastCriteria,
    buildCriteria,
    generating,
    questionLoadingId,
    isRegeneratingAll,
    refreshCredits,
  ])

  const regenerateOne = useCallback(
    (index: number) => {
      ;(async () => {
        if (!liveQuizId) {
          toast.error('Quiz is not ready yet. Generate once to create it.')
          return
        }
        if (generating || questionLoadingId || isRegeneratingAll) return
        const qid = stubs[index]?.id
        if (!qid) return
        setRegenQuestionCreditGate(null)
        setQuestionLoadingId(qid)
        try {
          const prevPrompt = stubs[index]?.prompt?.trim() ?? ''
          const updated = await apiRegenerateQuestion(liveQuizId, qid)
          const nextStub = (updated.questionStubs as any)?.[index]
          setStubs(updated.questionStubs as any)
          if (
            prevPrompt &&
            nextStub &&
            typeof nextStub.prompt === 'string' &&
            nextStub.prompt.trim() === prevPrompt
          ) {
            toast.warning('The model returned the same wording. Try again or edit the question.')
          } else {
            toast.success('Question regenerated.')
          }
          refreshCredits()
        } catch (e) {
          const credit = parseCreditError(e)
          if (credit) {
            setRegenQuestionCreditGate(credit)
            return
          }
          console.error('Question regeneration failed:', e)
          toast.error('Could not regenerate question')
        } finally {
          setQuestionLoadingId(null)
        }
      })()
    },
    [liveQuizId, stubs, toast, generating, questionLoadingId, isRegeneratingAll, refreshCredits]
  )

  const reorder = useCallback((from: number, to: number) => {
    ;(async () => {
      if (!liveQuizId) return
      if (to < 0 || to >= stubs.length) return
      const movingId = stubs[from]?.id
      if (!movingId) return

      const next = [...stubs]
      const [row] = next.splice(from, 1)
      next.splice(to, 0, row)
      const order = next.map((s, i) => ({ id: s.id, sort_order: i }))

      setQuestionLoadingId(movingId)
      try {
        const updated = await apiReorderQuestions(liveQuizId, order)
        setStubs(updated.questionStubs as any)
      } catch (e) {
        console.error('Reorder failed:', e)
        toast.error('Could not reorder questions')
      } finally {
        setQuestionLoadingId(null)
      }
    })()
  }, [liveQuizId, stubs, toast])

  const deleteAt = useCallback(
    (index: number) => {
      ;(async () => {
        if (!liveQuizId) return
        const qid = stubs[index]?.id
        if (!qid) return
        setQuestionLoadingId(qid)
        try {
          const updated = await apiDeleteQuestion(liveQuizId, qid)
          setStubs(updated.questionStubs as any)
          toast.success('Question removed')
        } catch (e) {
          console.error('Question delete failed:', e)
          toast.error('Could not remove question')
        } finally {
          setQuestionLoadingId(null)
        }
      })()
    },
    [liveQuizId, stubs, toast]
  )

  const handleAddQuestion = useCallback(
    (stub: QuizQuestionStub) => {
      ;(async () => {
        if (!liveQuizId) return
        if (stubs.length >= QUESTION_COUNT.max) {
          toast.error(`Each quiz supports at most ${QUESTION_COUNT.max} questions.`)
          return
        }
        try {
          const updated = await apiAddQuestion(liveQuizId, {
            type: stub.type as QuestionType,
            prompt: stub.prompt,
            points: stub.points ?? 1,
            options: stub.options,
            response_lines: stub.responseLines,
          })
          setStubs(updated.questionStubs as any)
          toast.success('Question added to the set')
        } catch (e) {
          console.error('Add question failed:', e)
          toast.error('Could not add question')
        }
      })()
    },
    [liveQuizId, stubs.length, toast]
  )

  const goList = () => navigate('/teacher-tools/quiz')

  const handleHandoutLayoutSave = useCallback((layout: HandoutLayoutOpts) => {
    const nextLayout = { ...DEFAULT_HANDOUT_LAYOUT, ...layout }
    handoutLayoutRef.current = nextLayout
    setHandoutLayout(nextLayout)
    toast.success('Handout spacing saved. PDF export and print use these settings.')
  }, [toast])

  const handleMixModeChange = useCallback(
    (m: QuestionMixMode) => {
      if (m === mixMode) return
      if (m === 'custom') {
        const d = distributeBalancedToTypeCounts(questionCount, includeMcq, includeTf, includeShort)
        setCountMcq(d.mcq)
        setCountTf(d.tf)
        setCountShort(d.short)
        setMixMode('custom')
        return
      }
      const sum = countMcq + countTf + countShort
      const clamped = Math.min(QUESTION_COUNT.max, Math.max(QUESTION_COUNT.min, sum || QUESTION_COUNT.min))
      setQuestionCount(clamped)
      setIncludeMcq(countMcq > 0)
      setIncludeTf(countTf > 0)
      setIncludeShort(countShort > 0)
      setMixMode('balanced')
    },
    [mixMode, questionCount, includeMcq, includeTf, includeShort, countMcq, countTf, countShort]
  )

  const handleSaveDraft = useCallback(async () => {
    if (stubs.length === 0) {
      toast.error('Generate at least one question before saving a draft.')
      return
    }
    setSaveDraftPending(true)
    try {
      if (!liveQuizId) return
      await apiPatchQuiz(liveQuizId, {
        status: 'draft',
        handoutLayout: handoutLayoutRef.current ?? null,
      })
      toast.success('Draft saved')
      navigate('/teacher-tools/quiz')
    } finally {
      setSaveDraftPending(false)
    }
  }, [liveQuizId, navigate, stubs.length, toast])

  const handlePublish = useCallback(async () => {
    if (stubs.length === 0) {
      toast.error('Add questions before publishing.')
      return
    }
    setPublishPending(true)
    try {
      if (!liveQuizId) return
      await apiPatchQuiz(liveQuizId, {
        status: 'published',
        handoutLayout: handoutLayoutRef.current ?? null,
      })
      toast.success('Quiz published')
      navigate('/teacher-tools/quiz')
    } finally {
      setPublishPending(false)
    }
  }, [liveQuizId, navigate, stubs.length, toast])

  const exportPdf = useCallback(() => {
    const ctx = rag.getGenerationContext()
    const activeLayout = handoutLayoutRef.current
    const q: DemoQuiz = {
      id: isEdit && quizId ? quizId : 'export',
      title: title.trim() || 'Quiz',
      subject,
      grade,
      classes: [classKeyForGrade(grade)],
      questions: stubs.length,
      totalMarks: totalMarksFromStubs(stubs),
      timeLimitMinutes: timeLimit,
      status: 'draft',
      submissionCount: 0,
      avgScore: 0,
      topic: rag.combinedTopicLabel,
      sourceBookIds: rag.selectedBookIds,
      scopeTopics: rag.selectedTopics,
      scopeRefinement: rag.scopeRefinement.trim() || undefined,
      sourceSummary: formatSourceSummary(ctx),
      questionStubs: stubs,
      studentInstructions,
      difficulty,
      handoutLayout: activeLayout,
    }
    try {
      downloadQuizPdf(q, `${title.replace(/\s+/g, '-').slice(0, 32)}-quiz.pdf`)
      toast.success('PDF downloaded')
    } catch {
      toast.error('Could not generate PDF')
    }
  }, [rag, title, subject, grade, timeLimit, stubs, studentInstructions, difficulty, isEdit, quizId, toast])

  const printMeta: QuizPrintMeta = {
    title: title.trim() || 'Quiz',
    subject,
    grade,
    timeLimitMinutes: timeLimit,
    studentInstructions,
    topic: rag.combinedTopicLabel,
    sourceSummaryLine: formatSourceSummary(rag.getGenerationContext()),
  }

  if (isEdit && !hydrateReady) {
    return (
      <div className="min-h-[40vh] space-y-3 p-8">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-32 max-w-xl animate-pulse rounded-2xl bg-gray-100" />
        <p className="text-sm text-gray-600">Loading quiz…</p>
      </div>
    )
  }

  const wizardStep = phase === 'build' ? 0 : 1

  return (
    <div className="space-y-6 pb-10">
      <TeacherToolsPageHeader
        title={isEdit ? 'Edit quiz' : 'Create quiz'}
        subtitle="Choose catalog sources, define retrieval scope, run generation, then review and publish."
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Quiz', to: '/teacher-tools/quiz' },
          { label: isEdit ? 'Edit' : 'Create' },
        ]}
      />

      <TeacherToolsWizardStepper
        steps={[...QUIZ_CREATION_STEPS]}
        current={wizardStep}
        onStepClick={(i) => {
          if (i === 1 && stubs.length === 0) {
            toast.error('Generate questions before opening review.')
            return
          }
          setPhase(i === 0 ? 'build' : 'review')
        }}
      />

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

      <QuizGeneratingOverlay open={generating} progress={genProgress} />

      {phase === 'build' && (
        <>
          <QuizRagBuildSection
            rag={rag}
            title={title}
            onTitleChange={setTitle}
            subject={subject}
            onSubjectChange={setSubject}
            grade={grade}
            onGradeChange={setGrade}
            studentInstructions={studentInstructions}
            onStudentInstructionsChange={setStudentInstructions}
            teacherNotes={teacherNotes}
            onTeacherNotesChange={setTeacherNotes}
            mixMode={mixMode}
            onMixModeChange={handleMixModeChange}
            questionCount={questionCount}
            onQuestionCountChange={setQuestionCount}
            countMcq={countMcq}
            countTf={countTf}
            countShort={countShort}
            onCountMcq={setCountMcq}
            onCountTf={setCountTf}
            onCountShort={setCountShort}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            includeMcq={includeMcq}
            includeTf={includeTf}
            includeShort={includeShort}
            onToggleMcq={setIncludeMcq}
            onToggleTf={setIncludeTf}
            onToggleShort={setIncludeShort}
            timeLimit={timeLimit}
            onTimeLimitChange={setTimeLimit}
            shuffleQuestions={shuffleQuestions}
            shuffleAnswers={shuffleAnswers}
            negativeMarking={negativeMarking}
            onShuffleQuestions={setShuffleQuestions}
            onShuffleAnswers={setShuffleAnswers}
            onNegativeMarking={setNegativeMarking}
            validationErrors={buildErrors}
          />
          <div className="sticky bottom-4 z-10 mt-8 flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">Ready to generate from your scope</p>
              <p className="mt-0.5 text-xs text-gray-600">
                {rag.generateWithoutSources
                  ? 'Primary action runs topic-only generation (no catalog retrieval).'
                  : 'Primary action runs a demo retrieval + generation pass using the selected titles and topic strands above.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => runGeneration()}
              disabled={generating}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-60"
            >
              {rag.generateWithoutSources ? 'Generate without sources' : 'Generate from selected materials'}
            </button>
          </div>
        </>
      )}

      {phase === 'review' && regenQuestionCreditGate && (
        <NoCreditsCard
          compact
          reason={regenQuestionCreditGate.reason}
          balance={regenQuestionCreditGate.balance}
          required={regenQuestionCreditGate.required}
          onActivated={() => setRegenQuestionCreditGate(null)}
        />
      )}

      {phase === 'review' && (
        <QuizReviewSection
          stubs={stubs}
          totalPoints={totalMarksFromStubs(stubs)}
          sourceSummaryLine={formatSourceSummary(rag.getGenerationContext())}
          printMeta={printMeta}
          handoutLayout={handoutLayout}
          onHandoutLayoutSave={handleHandoutLayoutSave}
          canAddMoreQuestions={stubs.length < QUESTION_COUNT.max}
          onReorder={reorder}
          onDelete={deleteAt}
          questionLoadingId={questionLoadingId}
          regeneratingAll={isRegeneratingAll}
          onUpdateStub={(index, next) => {
            ;(async () => {
              if (!liveQuizId) return
              const qid = stubs[index]?.id
              if (!qid) return
              setQuestionLoadingId(qid)
              try {
                const updated = await apiPatchQuestion(liveQuizId, qid, {
                  prompt: next.prompt,
                  points: next.points,
                  options: next.options,
                  response_lines: next.responseLines,
                })
                setStubs(updated.questionStubs as any)
              } catch (e) {
                console.error('Question edit failed:', e)
                toast.error('Could not update question')
              } finally {
                setQuestionLoadingId(null)
              }
            })()
          }}
          onAddQuestion={handleAddQuestion}
          onRegenerateAll={regenerateAll}
          onRegenerateOne={regenerateOne}
          onBackToEdit={() => setPhase('build')}
          onSaveDraft={handleSaveDraft}
          onExportPdf={exportPdf}
          onPublish={handlePublish}
          saveDraftPending={saveDraftPending}
          publishPending={publishPending}
        />
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
        <p className="py-3 text-sm text-gray-600">
          Unsaved catalog scope (titles, topics, refinement) will be cleared. Continue?
        </p>
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
          ← Back to quiz list
        </button>
      </div>
    </div>
  )
}
