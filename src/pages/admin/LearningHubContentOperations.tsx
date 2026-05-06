import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Loader2,
  RefreshCw,
  XCircle,
} from 'lucide-react'
import {
  approveContentJob,
  clearLearningHubAdminErrors,
  deleteContentJob,
  fetchContentGenerationJobDetail,
  fetchContentGenerationJobs,
  fetchJobReviews,
  fetchJobsSummary,
  fetchRegistryItems,
  rejectContentJob,
  retryContentJob,
  requestMicroCourseGeneration,
  stopGapGenerationWorker,
  requestContentJobChanges,
  selectJob,
  setJobFilters,
  setRegistryFilters,
} from '../../redux/features/learningHubAdmin/learningHubAdminSlice'

const JOB_STATUSES = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'running', label: 'Running' },
  { value: 'reviewing', label: 'Reviewing' },
  { value: 'awaiting_human_approval', label: 'Awaiting approval' },
  { value: 'publishing', label: 'Publishing' },
  { value: 'completed', label: 'Completed' },
  { value: 'failed', label: 'Failed' },
  { value: 'rejected', label: 'Rejected' },
]

const CONTENT_TYPES = [
  { value: '', label: 'All types' },
  { value: 'micro_course', label: 'Micro course' },
  { value: 'ai_guided_tutorial', label: 'AI-guided tutorial' },
  { value: 'learning_path', label: 'Learning path' },
]

const REGISTRY_STATUSES = [
  { value: 'published', label: 'Published' },
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
]

const REGISTRY_SOURCE_TYPES = [
  { value: '', label: 'All source types' },
  { value: 'starter_seed', label: 'Starter seed' },
  { value: 'content_factory', label: 'Generated (factory)' },
]

const JOB_OPS_QUICK = [
  { status: '', label: 'All' },
  { status: 'awaiting_human_approval', label: 'Needs approval' },
  { status: 'failed', label: 'Failed' },
  { status: 'running', label: 'Running' },
  { status: 'pending', label: 'Pending' },
] as const

function statusBadgeClass(status: string) {
  const s = String(status || '').toLowerCase()
  if (s === 'completed') return 'bg-green-100 text-green-800'
  if (s === 'failed' || s === 'rejected') return 'bg-red-100 text-red-800'
  if (s === 'awaiting_human_approval') return 'bg-amber-100 text-amber-900'
  if (s === 'publishing' || s === 'running') return 'bg-blue-100 text-blue-800'
  if (s === 'reviewing') return 'bg-purple-100 text-purple-800'
  if (s === 'pending') return 'bg-gray-100 text-gray-700'
  return 'bg-gray-100 text-gray-700'
}

function formatDt(iso: string | null | undefined) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return String(iso)
  }
}

function registryOriginLabel(item: {
  content_id?: string
  source_type?: string | null
}) {
  const st = item.source_type || ''
  const cid = item.content_id || ''
  if (st === 'starter_seed' || cid.startsWith('starter-')) return 'Starter seed'
  if (st === 'content_factory') return 'Generated'
  if (st) return st
  return 'Other'
}

function asStringList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x)).filter(Boolean)
  return []
}

function countArray(v: unknown): number {
  return Array.isArray(v) ? v.length : 0
}

const LearningHubContentOperations = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: { auth?: { user?: { role?: string } } }) => state.auth?.user)
  const role = user?.role || ''
  const canReview = role === 'super_admin' || role === 'org_admin'

  const {
    jobs,
    jobsLoading,
    jobsError,
    jobsSummary,
    jobsSummaryLoading,
    jobsSummaryError,
    jobFilters,
    selectedJobId,
    jobDetail,
    jobDetailLoading,
    jobDetailError,
    jobReviews,
    jobReviewsLoading,
    registryItems,
    registryLoading,
    registryError,
    registryFilters,
    actionLoading,
    actionError,
  } = useSelector((state: { learningHubAdmin: any }) => state.learningHubAdmin)

  const [actionNotes, setActionNotes] = useState('')

  // Micro-course generation (admin trigger)
  const [genTopic, setGenTopic] = useState('')
  const [genGenerationMode, setGenGenerationMode] = useState('on_demand')
  const [genSubject, setGenSubject] = useState('')
  const [genGradeBand, setGenGradeBand] = useState('')
  const [genDifficulty, setGenDifficulty] = useState('')
  const [genLocale, setGenLocale] = useState('en')
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const loadJobs = useCallback(() => {
    dispatch(fetchContentGenerationJobs({ ...jobFilters, limit: 100 }))
  }, [dispatch, jobFilters])

  const loadRegistry = useCallback(() => {
    dispatch(fetchRegistryItems({ ...registryFilters, limit: 200 }))
  }, [dispatch, registryFilters])

  const loadSummary = useCallback(() => {
    dispatch(fetchJobsSummary())
  }, [dispatch])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  useEffect(() => {
    loadRegistry()
  }, [loadRegistry])

  useEffect(() => {
    loadSummary()
  }, [loadSummary])

  useEffect(() => {
    if (!selectedJobId) return
    dispatch(fetchContentGenerationJobDetail(selectedJobId))
    dispatch(fetchJobReviews(selectedJobId))
  }, [dispatch, selectedJobId])

  const stepOutputKeys = useMemo(() => {
    const so = jobDetail?.step_outputs
    if (!so || typeof so !== 'object') return []
    return Object.keys(so)
  }, [jobDetail])

  const generatedPreview = useMemo(() => {
    const so = jobDetail?.step_outputs
    if (!so || typeof so !== 'object') return null
    const curriculum = (so as any).curriculum || {}
    const structure = (so as any).structure || {}
    const assessment = (so as any).assessment || {}
    const pedagogy = (so as any).pedagogy || {}
    const review = (so as any).review || {}
    const quality = (so as any).quality || {}

    const objectives = asStringList(curriculum.learning_objectives).slice(0, 6)
    const strategies = asStringList(pedagogy.teaching_strategies).slice(0, 6)
    const modules = Array.isArray(structure.modules) ? structure.modules : []
    const lessons = Array.isArray(structure.lessons) ? structure.lessons : []
    const steps = Array.isArray(structure.steps) ? structure.steps : []

    return {
      objectives,
      strategies,
      modules,
      lessons,
      steps,
      reflectionCount: countArray(assessment.reflection_prompts),
      practiceCount: countArray(assessment.practice_tasks),
      quizCount: countArray(assessment.mini_quizzes),
      reviewStatus: review?.review_status || '—',
      reviewIssues: asStringList(review?.issues_found).slice(0, 5),
      qualityScore: quality?.quality_score ?? jobDetail?.quality_score ?? null,
      qualityFeedback: String(quality?.quality_feedback || '').trim(),
    }
  }, [jobDetail])

  const onRowClick = (id: string) => {
    if (selectedJobId === id) {
      dispatch(selectJob(null))
      setActionNotes('')
      return
    }
    dispatch(selectJob(id))
    setActionNotes('')
  }

  const afterAction = async () => {
    setActionNotes('')
    loadJobs()
    loadSummary()
    loadRegistry()
    if (selectedJobId) {
      await dispatch(fetchContentGenerationJobDetail(selectedJobId))
      await dispatch(fetchJobReviews(selectedJobId))
    }
  }

  const handleApprove = async () => {
    if (!selectedJobId || !canReview) return
    try {
      await dispatch(approveContentJob({ jobId: selectedJobId, notes: actionNotes })).unwrap()
      await afterAction()
    } catch {
      /* error surfaced in actionError */
    }
  }

  const handleReject = async () => {
    if (!selectedJobId || !canReview) return
    try {
      await dispatch(rejectContentJob({ jobId: selectedJobId, notes: actionNotes })).unwrap()
      await afterAction()
    } catch {
      /* error surfaced in actionError */
    }
  }

  const handleRequestChanges = async () => {
    if (!selectedJobId || !canReview) return
    try {
      await dispatch(requestContentJobChanges({ jobId: selectedJobId, notes: actionNotes })).unwrap()
      await afterAction()
    } catch {
      /* error surfaced in actionError */
    }
  }

  const handleRetrySelectedJob = async () => {
    if (!selectedJobId || !canReview) return
    try {
      const job = await dispatch(retryContentJob(selectedJobId)).unwrap()
      dispatch(selectJob(job.id))
      await afterAction()
    } catch {
      /* error surfaced in actionError */
    }
  }

  const handleDeleteSelectedJob = async () => {
    if (!selectedJobId || !canReview) return
    setConfirmDeleteOpen(true)
  }

  const confirmDeleteSelectedJob = async () => {
    if (!selectedJobId || !canReview) return
    try {
      await dispatch(deleteContentJob(selectedJobId)).unwrap()
      dispatch(selectJob(null))
      setConfirmDeleteOpen(false)
      await afterAction()
    } catch {
      /* error surfaced in actionError */
    }
  }

  const handleGenerateMicroCourse = async () => {
    if (!canReview) return
    const topic = genTopic.trim()
    const subject = genSubject.trim()
    if (genGenerationMode === 'on_demand' && !topic) return
    if (genGenerationMode === 'gap_detection' && !subject) return
    try {
      const job = await dispatch(
        requestMicroCourseGeneration({
          topic: topic || `Foundational teaching strategies for ${subject || 'teachers'}`,
          subject: subject || null,
          grade_band: genGradeBand.trim() ? genGradeBand.trim() : null,
          difficulty: genDifficulty.trim() ? genDifficulty.trim() : null,
          locale: genLocale.trim() ? genLocale.trim() : 'en',
          generation_mode: genGenerationMode,
        })
      ).unwrap()

      setActionNotes('')
      dispatch(selectJob(job.id))

      // Ensure UI shows the generated job and any published registry changes.
      loadJobs()
      loadSummary()
      loadRegistry()
      await dispatch(fetchContentGenerationJobDetail(job.id))
      await dispatch(fetchJobReviews(job.id))
    } catch {
      /* error surfaced in actionError */
    }
  }

  const awaitingApproval = String(jobDetail?.status || '') === 'awaiting_human_approval'
  const canRetrySelected =
    String(jobDetail?.status || '') === 'failed' || String(jobDetail?.status || '') === 'rejected'
  const canGenerateMicroCourse =
    genGenerationMode === 'on_demand' ? Boolean(genTopic.trim()) : Boolean(genSubject.trim())

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-amber-600" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Learning Hub content operations</h1>
            <p className="text-sm text-gray-600">
              Monitor generation jobs, approvals, and published registry content.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            loadJobs()
            loadSummary()
            loadRegistry()
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {(jobDetailError || actionError) && (
        <div className="flex items-start justify-between gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <div>
              {jobDetailError && <p>Job detail: {jobDetailError}</p>}
              {actionError && <p>Action: {actionError}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={() => dispatch(clearLearningHubAdminErrors())}
            className="text-xs font-medium text-red-900 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Generate micro-course (admin trigger) */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Request AI micro-course generation</h2>
          <p className="text-xs text-gray-500">Creates a content factory job and runs the pipeline to completion.</p>
        </div>
        <div className="flex flex-wrap gap-3 border-b border-gray-100 px-4 py-3">
          <select
            className="min-w-[220px] flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            value={genGenerationMode}
            onChange={(e) => setGenGenerationMode(e.target.value)}
          >
            <option value="on_demand">Micro-course now (on-demand)</option>
            <option value="gap_detection">Enqueue as gap-detection job (async)</option>
          </select>
          <input
            className="min-w-[220px] flex-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            placeholder="Topic (required)"
            value={genTopic}
            onChange={(e) => setGenTopic(e.target.value)}
          />
          <input
            className="min-w-[180px] rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            placeholder="Subject (optional)"
            value={genSubject}
            onChange={(e) => setGenSubject(e.target.value)}
          />
          <input
            className="min-w-[180px] rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            placeholder="Grade band (optional)"
            value={genGradeBand}
            onChange={(e) => setGenGradeBand(e.target.value)}
          />
          <input
            className="min-w-[170px] rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            placeholder="Difficulty (optional)"
            value={genDifficulty}
            onChange={(e) => setGenDifficulty(e.target.value)}
          />
          <input
            className="min-w-[120px] rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            placeholder="Locale"
            value={genLocale}
            onChange={(e) => setGenLocale(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
          <button
            type="button"
            disabled={actionLoading || !canReview || !canGenerateMicroCourse}
            onClick={() => handleGenerateMicroCourse()}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
          >
            {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
            Generate micro-course
          </button>
          <button
            type="button"
            disabled={actionLoading || !canReview}
            onClick={async () => {
              try {
                await dispatch(stopGapGenerationWorker()).unwrap()
              } finally {
                loadJobs()
                loadSummary()
                loadRegistry()
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            <XCircle className="h-3 w-3" />
            Stop gap generation
          </button>
          <p className="text-[11px] text-gray-500">
            You should then see a new job in the table and the generated item in the registry.
          </p>
        </div>
      </section>

      {/* Jobs */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Content generation jobs</h2>
          <p className="text-xs text-gray-500">Source: content factory pipeline</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-50 bg-gray-50/60 px-4 py-2 text-[11px] text-gray-700">
          {jobsSummaryLoading ? (
            <span className="flex items-center gap-1 text-gray-500">
              <Loader2 className="h-3 w-3 animate-spin" /> Loading summary…
            </span>
          ) : jobsSummary ? (
            <>
              <span className="rounded-md bg-white px-2 py-0.5 shadow-sm">
                Pending <strong>{jobsSummary.pending_count ?? 0}</strong>
              </span>
              <span className="rounded-md bg-white px-2 py-0.5 shadow-sm">
                Running <strong>{jobsSummary.running_count ?? 0}</strong>
              </span>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-950 shadow-sm">
                Awaiting approval <strong>{jobsSummary.awaiting_human_approval_count ?? 0}</strong>
              </span>
              <span className="rounded-md bg-white px-2 py-0.5 shadow-sm">
                Failed <strong>{jobsSummary.failed_count ?? 0}</strong>
              </span>
              <span className="rounded-md bg-white px-2 py-0.5 shadow-sm">
                Rejected <strong>{jobsSummary.rejected_count ?? 0}</strong>
              </span>
              <span className="rounded-md bg-white px-2 py-0.5 shadow-sm">
                Completed <strong>{jobsSummary.completed_count ?? 0}</strong>
              </span>
              <span className="rounded-md bg-white px-2 py-0.5 shadow-sm" title="Pending/running, no update for 2h (UTC)">
                Stuck <strong>{jobsSummary.stuck_count ?? 0}</strong>
              </span>
              <span className="rounded-md bg-white px-2 py-0.5 shadow-sm">
                Published (generated){' '}
                <strong>{jobsSummary.published_generated_count ?? 0}</strong>
              </span>
            </>
          ) : null}
          {jobsSummaryError && (
            <span className="text-red-700">
              Summary unavailable: {jobsSummaryError}{' '}
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => dispatch(fetchJobsSummary())}
              >
                Retry
              </button>
            </span>
          )}
        </div>
        {jobsError && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-100 bg-red-50/80 px-4 py-2 text-xs text-red-800">
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Jobs list: {jobsError}
            </span>
            <div className="flex gap-2">
              <button type="button" className="font-semibold underline" onClick={() => loadJobs()}>
                Retry
              </button>
              <button
                type="button"
                className="text-red-600 underline"
                onClick={() => dispatch(clearLearningHubAdminErrors())}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-2 border-b border-gray-100 px-4 py-2">
          {JOB_OPS_QUICK.map((q) => {
            const active = (jobFilters.status || '') === q.status
            return (
              <button
                key={q.label}
                type="button"
                onClick={() => dispatch(setJobFilters({ status: q.status }))}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                  active
                    ? 'border-amber-500 bg-amber-50 text-amber-950'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {q.label}
              </button>
            )
          })}
        </div>
        <div className="flex flex-wrap gap-3 border-b border-gray-100 px-4 py-3">
          <select
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            value={jobFilters.status}
            onChange={(e) => dispatch(setJobFilters({ status: e.target.value }))}
          >
            {JOB_STATUSES.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            value={jobFilters.content_type}
            onChange={(e) => dispatch(setJobFilters({ content_type: e.target.value }))}
          >
            {CONTENT_TYPES.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            placeholder="Locale (e.g. en)"
            value={jobFilters.locale}
            onChange={(e) => dispatch(setJobFilters({ locale: e.target.value }))}
          />
          <input
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            placeholder="Source filter"
            value={jobFilters.source}
            onChange={(e) => dispatch(setJobFilters({ source: e.target.value }))}
          />
        </div>
        <div className="overflow-x-auto">
          {jobsLoading ? (
            <div className="flex items-center gap-2 p-8 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading jobs…
            </div>
          ) : jobs.length === 0 ? (
            <p className="p-8 text-sm text-gray-500">No jobs match the current filters.</p>
          ) : (
            <table className="min-w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Topic</th>
                  <th className="px-3 py-2">Subject</th>
                  <th className="px-3 py-2">Grade</th>
                  <th className="px-3 py-2">Locale</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Step</th>
                  <th className="px-3 py-2">Pri</th>
                  <th className="px-3 py-2">Result ID</th>
                  <th className="px-3 py-2">Created</th>
                  <th className="px-3 py-2">Updated</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job: any) => (
                  <tr
                    key={job.id}
                    onClick={() => onRowClick(job.id)}
                    className={`cursor-pointer border-t border-gray-100 hover:bg-amber-50/50 ${
                      selectedJobId === job.id ? 'bg-amber-50' : ''
                    }`}
                  >
                    <td className="px-3 py-2 font-mono text-[10px]">{job.id}</td>
                    <td className="px-3 py-2">{job.job_type || job.content_type}</td>
                    <td className="px-3 py-2">{job.source || '—'}</td>
                    <td className="px-3 py-2 max-w-[140px] truncate" title={job.topic}>
                      {job.topic}
                    </td>
                    <td className="px-3 py-2">{job.subject || '—'}</td>
                    <td className="px-3 py-2">{job.grade_band || '—'}</td>
                    <td className="px-3 py-2">{job.locale}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusBadgeClass(
                          job.status
                        )}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 max-w-[80px] truncate" title={job.current_step || ''}>
                      {job.current_step || '—'}
                    </td>
                    <td className="px-3 py-2">{job.priority ?? 0}</td>
                    <td className="px-3 py-2 font-mono text-[10px]">{job.result_content_id || '—'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatDt(job.created_at)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatDt(job.updated_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {selectedJobId && (
          <div className="border-t border-gray-200 bg-gray-50/80 px-4 py-4">
            <h3 className="text-sm font-semibold text-gray-900">Job detail</h3>
            {jobDetailLoading ? (
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </p>
            ) : jobDetail ? (
              <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-gray-500">Status</p>
                  <p className="mt-0.5">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeClass(
                        jobDetail.status
                      )}`}
                    >
                      {jobDetail.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Job type / strategy</p>
                  <p className="mt-0.5">
                    {jobDetail.job_type || jobDetail.content_type} · {jobDetail.generation_strategy || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Source</p>
                  <p className="mt-0.5">{jobDetail.source || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Current step</p>
                  <p className="mt-0.5">{jobDetail.current_step || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Review required</p>
                  <p className="mt-0.5">{jobDetail.review_required ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Publication policy</p>
                  <p className="mt-0.5">{jobDetail.publication_policy_decision || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Quality score</p>
                  <p className="mt-0.5">
                    {jobDetail.quality_score != null ? String(jobDetail.quality_score) : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500">Result content_id</p>
                  <p className="mt-0.5 font-mono text-xs break-all">
                    {jobDetail.result_content_id || '—'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-gray-500">Rejection / notes</p>
                  <p className="mt-0.5 text-red-800">{jobDetail.rejection_reason || '—'}</p>
                </div>
                {jobDetail.error_message && (
                  <div className="md:col-span-2">
                    <p className="text-xs font-semibold text-gray-500">Error</p>
                    <p className="mt-0.5 text-red-700">{jobDetail.error_message}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-xs font-semibold text-gray-500">Step outputs (keys)</p>
                  <p className="mt-0.5 font-mono text-xs">
                    {stepOutputKeys.length ? stepOutputKeys.join(', ') : '—'}
                  </p>
                </div>
              </div>
            ) : null}

            {generatedPreview && (
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/40 p-3">
                <p className="text-xs font-semibold text-blue-900">Generated content preview</p>
                <p className="mt-1 text-[11px] text-blue-900/80">
                  Use this preview to decide whether to keep, retry, or delete this job.
                </p>

                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border border-blue-100 bg-white p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">Structure</p>
                    <p className="mt-1 text-xs text-gray-700">
                      Modules: <strong>{generatedPreview.modules.length}</strong>
                    </p>
                    <p className="text-xs text-gray-700">
                      Lessons: <strong>{generatedPreview.lessons.length}</strong>
                    </p>
                    <p className="text-xs text-gray-700">
                      Steps: <strong>{generatedPreview.steps.length}</strong>
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-100 bg-white p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">Assessment</p>
                    <p className="mt-1 text-xs text-gray-700">
                      Reflection prompts: <strong>{generatedPreview.reflectionCount}</strong>
                    </p>
                    <p className="text-xs text-gray-700">
                      Practice tasks: <strong>{generatedPreview.practiceCount}</strong>
                    </p>
                    <p className="text-xs text-gray-700">
                      Mini quizzes: <strong>{generatedPreview.quizCount}</strong>
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-100 bg-white p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">Quality</p>
                    <p className="mt-1 text-xs text-gray-700">
                      Score: <strong>{generatedPreview.qualityScore != null ? String(generatedPreview.qualityScore) : '—'}</strong>
                    </p>
                    <p className="text-xs text-gray-700">
                      Review status: <strong>{generatedPreview.reviewStatus}</strong>
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-lg border border-blue-100 bg-white p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">Learning objectives</p>
                    {generatedPreview.objectives.length ? (
                      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-gray-700">
                        {generatedPreview.objectives.map((o, i) => (
                          <li key={`${i}-${o.slice(0, 16)}`}>{o}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">No objectives in output.</p>
                    )}
                  </div>
                  <div className="rounded-lg border border-blue-100 bg-white p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">Teaching strategies</p>
                    {generatedPreview.strategies.length ? (
                      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-gray-700">
                        {generatedPreview.strategies.map((s, i) => (
                          <li key={`${i}-${s.slice(0, 16)}`}>{s}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">No strategies in output.</p>
                    )}
                  </div>
                </div>

                {(generatedPreview.reviewIssues.length > 0 || generatedPreview.qualityFeedback) && (
                  <div className="mt-3 rounded-lg border border-blue-100 bg-white p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700">
                      Review / quality notes
                    </p>
                    {generatedPreview.reviewIssues.length > 0 && (
                      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-gray-700">
                        {generatedPreview.reviewIssues.map((iss, i) => (
                          <li key={`${i}-${iss.slice(0, 16)}`}>{iss}</li>
                        ))}
                      </ul>
                    )}
                    {generatedPreview.qualityFeedback && (
                      <p className="mt-1 text-xs text-gray-700">{generatedPreview.qualityFeedback}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {canReview && jobDetail && (
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={actionLoading || !canRetrySelected}
                  onClick={() => handleRetrySelectedJob()}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                  title={canRetrySelected ? 'Retry this failed/rejected job' : 'Retry is available only for failed/rejected jobs'}
                >
                  {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                  Retry job
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => handleDeleteSelectedJob()}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  title="Delete selected job"
                >
                  <XCircle className="h-3 w-3" />
                  Delete job
                </button>
              </div>
            )}

            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500">Review history</p>
              {jobReviewsLoading ? (
                <p className="mt-1 text-sm text-gray-500">Loading reviews…</p>
              ) : jobReviews.length === 0 ? (
                <p className="mt-1 text-sm text-gray-500">No review records.</p>
              ) : (
                <ul className="mt-2 space-y-2 text-xs">
                  {jobReviews.map((r: any) => (
                    <li key={r.id} className="rounded border border-gray-200 bg-white p-2">
                      <span className="font-semibold">{r.decision}</span>
                      <span className="text-gray-500"> · {formatDt(r.created_at)}</span>
                      {r.notes && <p className="mt-1 text-gray-700">{r.notes}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {canReview && awaitingApproval && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-3">
                <p className="text-xs font-semibold text-amber-900">Approval actions</p>
                <textarea
                  className="mt-2 w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm"
                  rows={2}
                  placeholder="Optional notes (required context for reject / request changes)"
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleApprove()}
                    className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                    Approve & publish
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleReject()}
                    className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    <XCircle className="h-3 w-3" />
                    Reject
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleRequestChanges()}
                    className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50"
                  >
                    Request changes
                  </button>
                </div>
                <p className="mt-2 text-[10px] text-amber-800">
                  Backend allows these actions only when status is <code>awaiting_human_approval</code>.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Registry */}
      <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Content registry</h2>
          <p className="text-xs text-gray-500">Published and other items visible to Learning Hub when published</p>
        </div>
        {registryError && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-100 bg-red-50/80 px-4 py-2 text-xs text-red-800">
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              Registry: {registryError}
            </span>
            <div className="flex gap-2">
              <button type="button" className="font-semibold underline" onClick={() => loadRegistry()}>
                Retry
              </button>
              <button
                type="button"
                className="text-red-600 underline"
                onClick={() => dispatch(clearLearningHubAdminErrors())}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-3 border-b border-gray-100 px-4 py-3">
          <select
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            value={registryFilters.status}
            onChange={(e) => dispatch(setRegistryFilters({ status: e.target.value }))}
          >
            {REGISTRY_STATUSES.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            value={registryFilters.content_type}
            onChange={(e) => dispatch(setRegistryFilters({ content_type: e.target.value }))}
          >
            {CONTENT_TYPES.map((o) => (
              <option key={`r-${o.value || 'all'}`} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <select
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            value={registryFilters.source_type}
            onChange={(e) => dispatch(setRegistryFilters({ source_type: e.target.value }))}
          >
            {REGISTRY_SOURCE_TYPES.map((o) => (
              <option key={o.value || 'all-src'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <input
            className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
            placeholder="Locale"
            value={registryFilters.locale}
            onChange={(e) => dispatch(setRegistryFilters({ locale: e.target.value }))}
          />
        </div>
        <div className="overflow-x-auto">
          {registryLoading ? (
            <div className="flex items-center gap-2 p-8 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading registry…
            </div>
          ) : registryItems.length === 0 ? (
            <p className="p-8 text-sm text-gray-500">No registry items for these filters.</p>
          ) : (
            <table className="min-w-full text-left text-xs text-gray-700">
              <thead className="bg-gray-50 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-3 py-2">content_id</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Locale</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Difficulty</th>
                  <th className="px-3 py-2">Origin</th>
                  <th className="px-3 py-2">source_type</th>
                  <th className="px-3 py-2">Published</th>
                </tr>
              </thead>
              <tbody>
                {registryItems.map((item: any) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50/80">
                    <td className="px-3 py-2 font-mono text-[10px]">{item.content_id}</td>
                    <td className="px-3 py-2">{item.content_type}</td>
                    <td className="px-3 py-2 max-w-[200px] truncate" title={item.title}>
                      {item.title}
                    </td>
                    <td className="px-3 py-2">{item.locale}</td>
                    <td className="px-3 py-2">{item.status}</td>
                    <td className="px-3 py-2">{item.category || '—'}</td>
                    <td className="px-3 py-2">{item.difficulty || '—'}</td>
                    <td className="px-3 py-2 font-medium text-gray-900">{registryOriginLabel(item)}</td>
                    <td className="px-3 py-2">{item.source_type || '—'}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatDt(item.published_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {confirmDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-gray-900">Delete selected job?</h3>
            <p className="mt-2 text-sm text-gray-600">
              This action permanently deletes the job and its review history.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(false)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={() => confirmDeleteSelectedJob()}
                className="inline-flex items-center gap-1 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearningHubContentOperations
