import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsStatusBadge } from '../components'
import { Phase2Section, Phase2Badge } from '../components/Phase2Lock'
import { TEACHER_TOOLS_SEED_ASSIGNMENT_IDS } from '../demo/teacherToolsDemoData'
import { getTopicBlueprint } from '../demo/topicAwareGenerators'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

const tabs = ['Overview', 'Rubric', 'Submissions', 'Analytics', 'Settings'] as const

function fmtDate(v: string | undefined) {
  if (!v) return 'Not set'
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AssignmentDetail() {
  const { assignmentId } = useParams()
  const navigate = useNavigate()
  const { toast } = useSnackbar()
  const { api, allAssignments } = useTeacherToolsDemo()
  const a = useMemo(() => allAssignments.find((x) => x.id === assignmentId), [allAssignments, assignmentId])
  const [tab, setTab] = useState<(typeof tabs)[number]>('Overview')

  const goEdit = async () => {
    if (!assignmentId) return
    if (TEACHER_TOOLS_SEED_ASSIGNMENT_IDS.has(assignmentId)) {
      const r = await api.duplicateAssignment(assignmentId)
      if (r.ok && 'id' in r && r.id) {
        toast.success('Created an editable copy from the sample library')
        navigate(`/teacher-tools/assignment/${r.id}/edit`)
        return
      }
      toast.error('Could not create a copy')
      return
    }
    navigate(`/teacher-tools/assignment/${assignmentId}/edit`)
  }

  if (!a) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-gray-700">Assignment not found.</p>
        <Link to="/teacher-tools/assignment" className="text-sm font-semibold text-primary-600">
          ← Back to assignments
        </Link>
      </div>
    )
  }

  const bp = getTopicBlueprint(a.subject, a.topic)
  const submittedPct = a.assignedCount > 0 ? Math.round((a.submitted / a.assignedCount) * 100) : 0
  const gradedPct = a.assignedCount > 0 ? Math.round((a.graded / a.assignedCount) * 100) : 0

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={a.title}
        subtitle={`${a.subject} · ${a.grade} · Due ${fmtDate(a.dueAt)}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Assignment', to: '/teacher-tools/assignment' },
          { label: a.title },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <TeacherToolsStatusBadge kind="content" value={a.status} />
            <button
              type="button"
              onClick={() => void goEdit()}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              Edit
            </button>
            <Link
              to={`/teacher-tools/assignment/${a.id}/submissions`}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800"
            >
              Submissions
              <Phase2Badge className="ml-0.5" />
            </Link>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              if (t === 'Analytics') return
              setTab(t)
            }}
            title={t === 'Analytics' ? 'Available in Phase 2' : undefined}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase ${
              tab === t
                ? 'bg-primary-600 text-white'
                : t === 'Analytics'
                  ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}
            {t === 'Analytics' ? <span className="ml-1.5 align-middle">• P2</span> : null}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Assigned</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{a.assignedCount}</p>
              <p className="mt-1 text-xs text-gray-500">Students in scope</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Submitted</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{a.submitted}</p>
              <p className="mt-1 text-xs text-gray-500">
                {a.assignedCount > 0 ? `${submittedPct}% of class` : 'No submissions yet'}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pending review</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{a.pending}</p>
              <p className="mt-1 text-xs text-gray-500">Awaiting your feedback</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Graded</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">{a.graded}</p>
              <p className="mt-1 text-xs text-gray-500">
                {a.assignedCount > 0 ? `${gradedPct}% completion` : 'No grades yet'}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Summary</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Topic</dt>
                  <dd className="text-right text-gray-800">{a.topic}</dd>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Assignment type</dt>
                  <dd className="text-right text-gray-800">{a.type}</dd>
                </div>
                {a.sourceSummary && (
                  <div className="flex items-start justify-between gap-3">
                    <dt className="text-gray-500">Source strategy</dt>
                    <dd className="text-right text-gray-800">{a.sourceSummary}</dd>
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Classes</dt>
                  <dd className="text-right text-gray-800">{a.classes.length}</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">Schedule</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <dt className="text-gray-500">Due date</dt>
                  <dd className="text-right text-gray-800">{fmtDate(a.dueAt)}</dd>
                </div>
              </dl>
              {a.status === 'draft' && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  This assignment is a draft. Publish to make it visible to students.
                </div>
              )}
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Objective</p>
                <p className="mt-1 text-sm text-gray-700">{bp.objective}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Rubric' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">Rubric criteria</h3>
            <ul className="mt-3 space-y-2">
              {bp.rubricHints.map((hint, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 text-sm text-gray-800"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                    {i + 1}
                  </span>
                  {hint}
                </li>
              ))}
            </ul>
          </div>
          {bp.misconceptions.length > 0 && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
              <h3 className="font-semibold text-amber-900">Common misconceptions to watch for</h3>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-amber-800">
                {bp.misconceptions.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tab === 'Submissions' && (
        <Phase2Section title="Student submissions (preview)">
          <div className="space-y-2 text-sm text-gray-700">
            <p>Submission inbox, grading queue, late policy controls, and rubric scoring appear here.</p>
            <p>LMS roster integration and per-student feedback unlock in Phase 2.</p>
            <Link
              to={`/teacher-tools/assignment/${a.id}/submissions`}
              className="mt-2 inline-block font-semibold text-primary-600"
            >
              Open submissions preview →
            </Link>
          </div>
        </Phase2Section>
      )}

      {tab === 'Analytics' && (
        <Phase2Section title="Assignment analytics (locked)">
          <div className="space-y-2 text-sm text-gray-700">
            <p>Grade distribution, on-time submission rates, and rubric dimension breakdown appear here.</p>
            <p>Requires student attempt telemetry and standards alignment in Phase 2.</p>
          </div>
        </Phase2Section>
      )}

      {tab === 'Settings' && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <h3 className="font-semibold text-gray-900">Assignment settings</h3>
          <dl className="text-sm divide-y divide-gray-100">
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">Visibility</dt>
              <dd className="text-gray-800">
                {a.status === 'draft' ? 'Hidden (draft)' : 'Visible to assigned classes'}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">Late submissions</dt>
              <dd className="text-gray-800">Accepted (penalty configurable — Phase 2)</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">Moderation</dt>
              <dd className="text-gray-800">Off (blind grading available — Phase 2)</dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-gray-500">Submission format</dt>
              <dd className="text-gray-800">File upload + text (configurable in Edit)</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  )
}
