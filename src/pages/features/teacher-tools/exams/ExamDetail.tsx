import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge } from '../components'
import { Phase2Section, Phase2Badge } from '../components/Phase2Lock'
import { TEACHER_TOOLS_SEED_EXAM_IDS } from '../demo/teacherToolsDemoData'
import * as examApi from '../../../../api/examApi'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'
import { formatGradeDisplay } from '@/catalog/adapters/gradeAdapters'

const tabs = ['Overview', 'Sections', 'Rules', 'Candidates', 'Results', 'Analytics', 'Settings'] as const

const TAB_I18N: Record<(typeof tabs)[number], string> = {
  Overview: 'exam.detail.tabs.overview',
  Sections: 'exam.detail.tabs.sections',
  Rules: 'exam.detail.tabs.rules',
  Candidates: 'exam.detail.tabs.candidates',
  Results: 'exam.detail.tabs.results',
  Analytics: 'exam.detail.tabs.analytics',
  Settings: 'exam.detail.tabs.settings',
}

function fmtDateTime(v: string | null | undefined, notScheduled: string) {
  if (!v) return notScheduled
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function examSectionsFallback(e: { totalMarks: number; examType: string }) {
  const m = e.totalMarks
  const isShort = e.examType === 'Unit test' || e.examType === 'Mock exam'
  if (isShort) {
    const a = Math.round(m * 0.4)
    const b = Math.round(m * 0.35)
    return [
      { title: 'Section A — Multiple choice', marks: a, description: `${Math.round(a)} questions, 1 mark each. Calculators not permitted.` },
      { title: 'Section B — Short answer', marks: b, description: `${Math.ceil(b / 5)} questions requiring brief structured responses.` },
      { title: 'Section C — Extended response', marks: m - a - b, description: '1–2 questions requiring full written explanations.' },
    ]
  }
  const a = Math.round(m * 0.3)
  const b = Math.round(m * 0.4)
  return [
    { title: 'Section A — Knowledge recall', marks: a, description: 'Multiple choice and true/false. Closed book.' },
    { title: 'Section B — Application', marks: b, description: 'Short structured questions. Show all working.' },
    { title: 'Section C — Analysis & synthesis', marks: m - a - b, description: 'Extended essays and case studies. Open notes permitted.' },
  ]
}

export default function ExamDetail() {
  const { t } = useTranslation()
  const { examId } = useParams()
  const navigate = useNavigate()
  const { toast } = useSnackbar()
  const [exam, setExam] = useState<examApi.ExamApiItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')

  useEffect(() => {
    if (!examId) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    ;(async () => {
      try {
        const ex = await examApi.fetchExam(examId)
        if (!cancelled) setExam(ex)
      } catch {
        if (!cancelled) setExam(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [examId])

  const goEdit = async () => {
    if (!examId) return
    if (TEACHER_TOOLS_SEED_EXAM_IDS.has(examId)) {
      try {
        const r = await examApi.duplicateExam(examId)
        if (r.ok && r.id) {
          toast.success(t('teacherTools.toastEditableCopy'))
          navigate(`/teacher-tools/exams/${r.id}/edit`)
          return
        }
      } catch {
        /* ignore */
      }
      toast.error(t('teacherTools.toastCopyFailed'))
      return
    }
    navigate(`/teacher-tools/exams/${examId}/edit`)
  }

  const e = exam

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
        <p className="text-sm text-gray-600">{t('exam.detail.loading')}</p>
      </div>
    )
  }

  if (!e) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">{t('exam.detail.notFound')}</p>
        <Link to="/teacher-tools/exams" className="text-sm font-semibold text-primary-600">
          {t('exam.detail.backToList')}
        </Link>
      </div>
    )
  }

  const sections =
    Array.isArray(e.sections) && e.sections.length > 0
      ? e.sections.map((s) => ({
          title: s.title,
          marks: s.marks,
          description: s.description ?? '',
        }))
      : examSectionsFallback(e)
  const LOCKED_TABS = new Set<string>(['Candidates', 'Results', 'Analytics'])

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={e.title}
        subtitle={`${e.subject} · ${e.examType} · ${e.term}`}
        breadcrumbs={[
          { label: t('teacherTools.breadcrumbTeacherTools'), to: '/teacher-tools' },
          { label: t('exam.breadcrumb'), to: '/teacher-tools/exams' },
          { label: e.title },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <TeacherToolsStatusBadge kind="content" value={e.status} />
            <button
              type="button"
              onClick={() => void goEdit()}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              {t('teacherTools.edit')}
            </button>
            <Link
              to={`/teacher-tools/exams/${e.id}/candidates`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              {t('exam.detail.candidates')}
              <Phase2Badge className="ml-0.5" />
            </Link>
            <Link
              to={`/teacher-tools/exams/${e.id}/results`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              {t('exam.detail.results')}
              <Phase2Badge className="ml-0.5" />
            </Link>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tabKey) => {
          const isLocked = LOCKED_TABS.has(tabKey)
          return (
            <button
              key={tabKey}
              type="button"
              onClick={() => { if (!isLocked) setTab(tabKey) }}
              title={isLocked ? t('teacherTools.phase2Tooltip') : undefined}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${
                tab === tabKey
                  ? 'bg-primary-600 text-white'
                  : isLocked
                    ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t(TAB_I18N[tabKey])}
              {isLocked ? <span className="ml-1.5 align-middle">• P2</span> : null}
            </button>
          )
        })}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('exam.detail.duration')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{e.durationMinutes} min</p>
              <p className="mt-1 text-xs text-gray-500">{t('exam.detail.perCandidate')}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('exam.detail.totalMarks')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{e.totalMarks}</p>
              <p className="mt-1 text-xs text-gray-500">{t('exam.detail.sectionsCount', { count: sections.length })}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('exam.detail.completion')}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {e.status === 'completed' ? `${e.completionPct}%` : t('quiz.detail.na')}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {e.status === 'completed' ? t('exam.detail.candidatesSat') : t('exam.detail.completionAfterWindow')}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t('exam.detail.term')}</p>
              <p className="mt-2 text-xl font-semibold text-gray-900">{e.term}</p>
              <p className="mt-1 text-xs text-gray-500">{e.examType}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{t('exam.detail.schedule')}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('exam.detail.start')}</dt>
                  <dd className="text-right text-gray-800">{fmtDateTime(e.scheduleStart, t('exam.detail.notScheduled'))}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('exam.detail.end')}</dt>
                  <dd className="text-right text-gray-800">{fmtDateTime(e.scheduleEnd, t('exam.detail.notScheduled'))}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('exam.detail.classes')}</dt>
                  <dd className="text-right text-gray-800">{e.classes.length}</dd>
                </div>
              </dl>
              {e.status === 'draft' && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  {t('exam.detail.draftScheduleHint')}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{t('exam.detail.content')}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('exam.detail.grade')}</dt>
                  <dd className="text-right text-gray-800">{formatGradeDisplay(e.grade)}</dd>
                </div>
                {e.sourceSummary && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-gray-500">{t('exam.detail.sourceStrategy')}</dt>
                    <dd className="text-right text-gray-800">{e.sourceSummary}</dd>
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('exam.detail.tabs.sections')}</dt>
                  <dd className="text-right text-gray-800">{sections.length}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">{t('exam.detail.totalMarks')}</dt>
                  <dd className="text-right text-gray-800">{e.totalMarks}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {tab === 'Sections' && (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">{t('exam.detail.sectionsHint')}</p>
          <ul className="space-y-3">
            {sections.map((s, i) => (
              <li key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 text-sm">{s.title}</h3>
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-bold text-primary-700">
                    {t('exam.detail.marksLabel', { count: s.marks })}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-gray-600">{s.description}</p>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2 text-sm font-semibold">
            <span className="text-gray-700">{t('exam.detail.total')}</span>
            <span className="text-gray-900">{t('exam.detail.marksLabel', { count: e.totalMarks })}</span>
          </div>
        </div>
      )}

      {tab === 'Rules' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-900">{t('exam.detail.rulesTitle')}</h3>
          <dl className="text-sm divide-y divide-gray-100">
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('exam.detail.mode')}</dt>
              <dd className="text-gray-800">{t('exam.detail.modeControlled')}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('exam.detail.questionOrder')}</dt>
              <dd className="text-gray-800">{t('exam.detail.questionOrderRandom')}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('exam.detail.webcamProctoring')}</dt>
              <dd className="italic text-gray-400">{t('exam.detail.webcamPhase2')}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('exam.detail.autoSubmit')}</dt>
              <dd className="text-gray-800">{t('exam.detail.autoSubmitExpiry')}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('exam.detail.lateEntry')}</dt>
              <dd className="text-gray-800">{t('exam.detail.lateEntryNotPermitted')}</dd>
            </div>
          </dl>
        </div>
      )}

      {tab === 'Candidates' && (
        <Phase2Section title={t('exam.detail.phase2CandidatesTitle')}>
          <div className="space-y-2 text-sm text-gray-700">
            <p>{t('exam.detail.candidatesBody1')}</p>
            <p>{t('exam.detail.candidatesBody2')}</p>
            <Link
              to={`/teacher-tools/exams/${e.id}/candidates`}
              className="mt-2 inline-block font-semibold text-primary-600"
            >
              {t('exam.detail.openCandidatesPreview')}
            </Link>
          </div>
        </Phase2Section>
      )}

      {tab === 'Results' && (
        <Phase2Section title={t('exam.detail.phase2ResultsTitle')}>
          <div className="space-y-2 text-sm text-gray-700">
            <p>{t('exam.detail.resultsBody1')}</p>
            <p>{t('exam.detail.resultsBody2')}</p>
            <Link
              to={`/teacher-tools/exams/${e.id}/results`}
              className="mt-2 inline-block font-semibold text-primary-600"
            >
              {t('exam.detail.openResultsPreview')}
            </Link>
          </div>
        </Phase2Section>
      )}

      {tab === 'Analytics' && (
        <Phase2Section title={t('exam.detail.phase2AnalyticsTitle')}>
          <div className="space-y-2 text-sm text-gray-700">
            <p>{t('exam.detail.analyticsBody1')}</p>
            <p>{t('exam.detail.analyticsBody2')}</p>
          </div>
        </Phase2Section>
      )}

      {tab === 'Settings' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">{t('exam.detail.settingsTitle')}</h3>
          <dl className="text-sm divide-y divide-gray-100">
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('exam.detail.visibility')}</dt>
              <dd className="text-gray-800">
                {e.status === 'draft' ? t('exam.detail.visibilityDraft') : t('exam.detail.visibilityPublished')}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('exam.detail.resultsRelease')}</dt>
              <dd className="text-gray-800">{t('exam.detail.resultsReleaseManual')}</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">{t('exam.detail.resitPolicy')}</dt>
              <dd className="text-gray-800">{t('exam.detail.resitPolicyPhase2')}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}
