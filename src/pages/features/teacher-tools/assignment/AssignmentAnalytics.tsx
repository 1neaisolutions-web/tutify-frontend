import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SimpleBarChart, TeacherToolsPageHeader } from '../components'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
import { assignmentSubmissionBars } from '../utils/analyticsDemoSeries'

const ranges = [
  { id: '7d' as const, label: 'Last 7 days' },
  { id: '30d' as const, label: 'Last 30 days' },
  { id: 'all' as const, label: 'All time' },
]

export default function AssignmentAnalytics() {
  const { assignmentId } = useParams()
  const { allAssignments } = useTeacherToolsDemo()
  const a = useMemo(() => allAssignments.find((x) => x.id === assignmentId), [allAssignments, assignmentId])
  const [range, setRange] = useState<(typeof ranges)[number]['id']>('30d')

  const submissionPoints = useMemo(() => (a ? assignmentSubmissionBars(a, range) : []), [a, range])

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

  return (
    <div className="space-y-6">
      <TeacherToolsPageHeader
        title={`Analytics · ${a.title}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Assignment', to: '/teacher-tools/assignment' },
          { label: a.title, to: `/teacher-tools/assignment/${a.id}` },
          { label: 'Analytics' },
        ]}
      />

      <div className="flex flex-wrap gap-2">
        {ranges.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setRange(r.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              range === r.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
          <span className="font-semibold">Preview data</span>
          <span>— Real results will appear here after students submit.</span>
        </div>
        <SimpleBarChart
          title="Submission rate over time"
          subtitle={a ? `${a.submitted}/${a.assignedCount} submitted · demo series for ${ranges.find((x) => x.id === range)?.label}` : undefined}
          points={submissionPoints}
        />
      </div>
      <Link to={`/teacher-tools/assignment/${a.id}`} className="text-sm font-semibold text-primary-600">← Back</Link>
    </div>
  )
}
