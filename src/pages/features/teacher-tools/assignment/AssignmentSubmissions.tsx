import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TeacherToolsPageHeader, TeacherToolsSideReviewDrawer, TeacherToolsStatusBadge, Phase2Section } from '../components'
import { demoSubmissions } from '../demo/teacherToolsDemoData'
import { useTeacherToolsDemo } from '../TeacherToolsDemoProvider'
// @ts-expect-error — JS module
import { useSnackbar } from '../../../../hooks/useSnackbar'

export default function AssignmentSubmissions() {
  const { assignmentId } = useParams()
  const { toast } = useSnackbar()
  const { allAssignments } = useTeacherToolsDemo()
  const a = useMemo(() => allAssignments.find((x) => x.id === assignmentId), [allAssignments, assignmentId])
  const rows = a ? demoSubmissions.filter((s) => s.toolType === 'assignment' && s.contentId === a.id) : []
  const [open, setOpen] = useState(false)
  const [sel, setSel] = useState<typeof rows[0] | null>(null)

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
        title={`Submissions · ${a.title}`}
        breadcrumbs={[
          { label: 'Teacher Tools', to: '/teacher-tools' },
          { label: 'Assignment', to: '/teacher-tools/assignment' },
          { label: a.title, to: `/teacher-tools/assignment/${a.id}` },
          { label: 'Submissions' },
        ]}
      />
      <Phase2Section title="Student submissions" footnote="Grading queue syncs with your LMS roster in Phase 2.">
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left">Student</th>
              <th className="px-3 py-3 text-left">Status</th>
              <th className="px-3 py-3 text-left">Score</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-gray-100">
                <td className="px-3 py-3 font-medium">{r.studentName}</td>
                <td className="px-3 py-3">
                  <TeacherToolsStatusBadge kind="submission" value={r.status} />
                </td>
                <td className="px-3 py-3">{r.score ?? '—'}</td>
                <td className="px-3 py-3 text-right">
                  <button type="button" className="text-primary-600 font-semibold" onClick={() => { setSel(r); setOpen(true) }}>
                    Grade
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Phase2Section>
      <TeacherToolsSideReviewDrawer
        open={open}
        onClose={() => setOpen(false)}
        title={sel ? `Rubric · ${sel.studentName}` : 'Grade'}
        footer={
          <button
            type="button"
            className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white"
            onClick={() => { toast.success('Graded'); setOpen(false) }}
          >
            Save grade
          </button>
        }
      >
        {sel && (
          <div className="space-y-2 text-sm">
            <p>Rubric rows: Thesis, evidence, coherence, language (preview).</p>
            <label className="block">
              Feedback
              <textarea rows={4} className="mt-1 w-full rounded-xl border px-3 py-2" />
            </label>
          </div>
        )}
      </TeacherToolsSideReviewDrawer>
      <Link to={`/teacher-tools/assignment/${a.id}`} className="text-sm font-semibold text-primary-600">← Back</Link>
    </div>
  )
}
