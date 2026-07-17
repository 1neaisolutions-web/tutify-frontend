import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { getPackById, updatePackProgress, upsertPack } from './nightBeforePackStorage'
import { regenerateFailedPack } from './nightBeforePackMockEngine'
import TopicSummarySection from './components/TopicSummarySection'
import FormulasSection from './components/FormulasSection'
import QuestionTypesSection from './components/QuestionTypesSection'
import WarmupMcqBlock from './components/WarmupMcqBlock'
import PackCompletionCard from './components/PackCompletionCard'
import PackErrorState from './components/PackErrorState'
import PackStatusBadge from './components/PackStatusBadge'
import PackSourceBadge from './components/PackSourceBadge'
import GenerationProgress from './components/GenerationProgress'

const PackDetail = () => {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [pack, setPack] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [storageWarning, setStorageWarning] = useState(false)
  const [openSections, setOpenSections] = useState({
    summary: true,
    formulas: false,
    questionTypes: false,
    mcqs: false,
  })
  const [retrying, setRetrying] = useState(false)

  useEffect(() => {
    const result = getPackById(id)
    if (!result.data) {
      setNotFound(true)
      setPack(null)
      return
    }
    setNotFound(false)
    setPack(result.data)
    if (!result.ok) setStorageWarning(true)

    if (!result.data.progress?.readAt && result.data.status === 'ready') {
      const updated = updatePackProgress(id, { readAt: new Date().toISOString() })
      if (updated.data) setPack(updated.data)
      if (!updated.ok) setStorageWarning(true)
    }
  }, [id])

  const markSection = useCallback(
    (key) => {
      if (!pack) return
      const updated = updatePackProgress(pack.id, { sectionsViewed: [key] })
      if (updated.data) setPack(updated.data)
      if (!updated.ok) setStorageWarning(true)
    },
    [pack],
  )

  const toggleSection = (key) => {
    setOpenSections((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      if (!prev[key]) markSection(key)
      return next
    })
  }

  const onAnswer = (qid, value) => {
    if (!pack) return
    const mcqAnswers = { ...pack.progress.mcqAnswers, [qid]: value }
    const updated = updatePackProgress(pack.id, { mcqAnswers, sectionsViewed: ['mcqs'] })
    if (updated.data) setPack(updated.data)
    if (!updated.ok) setStorageWarning(true)
  }

  const questions = pack?.content?.warmupMcqs || []
  const answeredCount = questions.filter((q) => pack?.progress?.mcqAnswers?.[q.id] != null).length
  const allAnswered = questions.length > 0 && answeredCount === questions.length
  const isCompleted = pack?.status === 'completed' || Boolean(pack?.progress?.markedDoneAt)

  const score = useMemo(() => {
    if (!pack) return 0
    return questions.reduce((acc, q) => acc + (pack.progress.mcqAnswers?.[q.id] === q.answerIndex ? 1 : 0), 0)
  }, [pack, questions])

  const markDone = () => {
    if (!pack || !allAnswered) return
    const updated = updatePackProgress(pack.id, {
      mcqScore: score,
      markedDoneAt: new Date().toISOString(),
      sectionsViewed: ['summary', 'formulas', 'questionTypes', 'mcqs'],
    })
    if (updated.data) setPack(updated.data)
    if (!updated.ok) setStorageWarning(true)
  }

  const askCopilot = () => {
    navigate('/student/dashboard', {
      state: {
        nightBeforePrompt: t('studentPanel.nightBefore.completion.copilotPrompt', {
          title: pack?.title || '',
          subject: pack?.subject || '',
        }),
      },
    })
  }

  const onRetryComplete = () => {
    if (!pack) return
    const fixed = regenerateFailedPack(pack)
    const saved = upsertPack(fixed)
    setPack(fixed)
    setRetrying(false)
    if (!saved.ok) setStorageWarning(true)
  }

  if (notFound) {
    return (
      <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950 px-6 py-6 max-w-xl">
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-3">
          <h1 className="font-semibold text-gray-900 dark:text-gray-100">{t('studentPanel.nightBefore.notFound.title')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('studentPanel.nightBefore.notFound.subtitle')}</p>
          <button
            type="button"
            onClick={() => navigate('/student/night-before')}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700"
          >
            {t('studentPanel.nightBefore.completion.backHub')}
          </button>
        </div>
      </div>
    )
  }

  if (!pack) {
    return (
      <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950 px-6 py-6">
        <div className="animate-pulse space-y-3 max-w-3xl">
          <div className="h-8 w-1/2 rounded bg-gray-100 dark:bg-gray-900" />
          <div className="h-40 rounded-xl bg-gray-100 dark:bg-gray-900" />
        </div>
      </div>
    )
  }

  const examLabel = new Date(pack.examAt).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const sectionsViewed = pack.progress?.sectionsViewed?.length || 0
  const progressPct = Math.min(100, Math.round(((sectionsViewed + answeredCount / Math.max(questions.length, 1)) / 5) * 100))

  if (retrying) {
    return (
      <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{pack.title}</h1>
        </div>
        <div className="px-6 py-6 max-w-xl">
          <GenerationProgress forceFail={false} onCancel={() => setRetrying(false)} onComplete={onRetryComplete} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-65px)] w-full bg-white dark:bg-gray-950">
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-start justify-between gap-4 max-w-3xl">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <PackStatusBadge status={pack.status} />
              <PackSourceBadge source={pack.source} />
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{pack.title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {pack.subject} · {t('studentPanel.nightBefore.detail.examAt', { date: examLabel })}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-1.5 w-32 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <div className="h-full bg-primary-600 transition-all" style={{ width: `${isCompleted ? 100 : progressPct}%` }} />
              </div>
              <span className="text-xs text-gray-500">
                {t('studentPanel.nightBefore.detail.progress', {
                  mcqDone: answeredCount,
                  mcqTotal: questions.length,
                })}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/student/night-before')}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900 shrink-0"
          >
            {t('studentPanel.common.back')}
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-3xl space-y-4">
        {storageWarning ? (
          <div className="rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
            {t('studentPanel.nightBefore.storageWarning')}
          </div>
        ) : null}

        {pack.status === 'failed' ? (
          <PackErrorState message={pack.failureMessage} onRetry={() => setRetrying(true)} />
        ) : null}

        {pack.status === 'scheduled' ? (
          <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-4 text-sm text-amber-900 dark:text-amber-100">
            {t('studentPanel.nightBefore.detail.scheduledNotice')}
          </div>
        ) : null}

        {isCompleted ? <PackCompletionCard score={pack.progress.mcqScore ?? score} total={questions.length} onAskCopilot={askCopilot} /> : null}

        {(pack.status === 'ready' || pack.status === 'completed' || pack.status === 'scheduled') && pack.status !== 'failed' ? (
          <>
            <TopicSummarySection
              bullets={pack.content.topicSummary}
              open={openSections.summary}
              onToggle={() => toggleSection('summary')}
            />
            <FormulasSection
              formulas={pack.content.keyFormulas}
              open={openSections.formulas}
              onToggle={() => toggleSection('formulas')}
            />
            <QuestionTypesSection
              items={pack.content.predictedQuestionTypes}
              open={openSections.questionTypes}
              onToggle={() => toggleSection('questionTypes')}
            />
            <WarmupMcqBlock
              questions={questions}
              answers={pack.progress.mcqAnswers}
              open={openSections.mcqs}
              onToggle={() => toggleSection('mcqs')}
              onAnswer={onAnswer}
              disabled={isCompleted}
            />

            {!isCompleted ? (
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={!allAnswered}
                  onClick={markDone}
                  className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {t('studentPanel.nightBefore.detail.markDone')}
                </button>
                <button
                  type="button"
                  onClick={askCopilot}
                  className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  {t('studentPanel.nightBefore.detail.askCopilot')}
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}

export default PackDetail
